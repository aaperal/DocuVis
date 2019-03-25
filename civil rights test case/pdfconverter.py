from gensim.models import Phrases
from gensim.models.coherencemodel import CoherenceModel
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import BytesIO
from io import StringIO
#nltk.download('punkt') 
import glob
import os
from summa import summarizer, keywords
from summa.preprocessing import textcleaner
import ntpath
import json

def convert_pdf_to_txt(path_to_file):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
    fp = open(path_to_file, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos=set()

    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
        interpreter.process_page(page)

    text = retstr.getvalue()

    fp.close()
    device.close()
    retstr.close()
    return text


def get_keywords(text, max_keywords = 10):
    words = (keywords.keywords(text, split=True))
    stems = textcleaner.filter_words(words)
    pairs = list(zip(words, stems))
    # if two words have the same stem, only take the first one
    filter_words = []
    seen_stems = set()
    for pair in pairs:
        if pair[1] not in seen_stems:
            seen_stems.add(pair[1])
            filter_words.append(pair[0])

    return (filter_words[:max_keywords])

def get_summary(text, max_percent = 0.3):
    return summarizer.summarize(text, ratio = max_percent)

def make_json_summary(document, summary):
    return {"name": document, "summaries": summary}

def make_json_keywords(document, keywords):
    return {"name": document, "keywords": keywords}
    
def path_leaf(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)


def prep_json_keywords():
    file_list = glob.glob(os.path.join(os.getcwd(), "pdfs", "*.pdf"))
    documents = []
    train_set = []

    for file_path in file_list:

        lines = convert_pdf_to_txt(file_path) # converts pdf to txt
        print("----------------------------------------------------------------------------")
        print(file_path)
        documents.append(make_json_keywords(path_leaf(file_path), get_keywords(lines)))

    json_prep = {"documents": documents}

    json_prep.keys()


    json_dump = json.dumps(json_prep, indent=1, sort_keys=True)

    filename_out = 'keywords.json'
    json_out = open(filename_out,'w')
    json_out.write(json_dump)
    json_out.close()

def prep_json_summaries():
    file_list = glob.glob(os.path.join(os.getcwd(), "pdfs", "*.pdf"))
    documents = []
    train_set = []

    for file_path in file_list:

        lines = convert_pdf_to_txt(file_path) # converts pdf to txt
        print("----------------------------------------------------------------------------")
        print(file_path)
        summ = get_summary(lines)
        if summ:
            documents.append(make_json_summary(path_leaf(file_path), summ))
        else: 
            documents.append(make_json_summary(path_leaf(file_path), lines))

    json_prep = {"documents": documents}

    json_prep.keys()


    json_dump = json.dumps(json_prep, indent=1, sort_keys=True)

    filename_out = 'summaries.json'
    json_out = open(filename_out,'w')
    json_out.write(json_dump)
    json_out.close()

prep_json_keywords()
prep_json_summaries()


