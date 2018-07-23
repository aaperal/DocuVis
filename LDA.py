import glob
import os
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from gensim import corpora, models
import logging

import unicodedata
import sys
import ntpath
import scipy
import json
import matplotlib.pyplot as plt
import csv

from gensim.models import Phrases
from gensim.models.coherencemodel import CoherenceModel


logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

def remove_punctuation(text):
    tbl = dict.fromkeys(i for i in xrange(sys.maxunicode)
                      if unicodedata.category(unichr(i)).startswith('P'))
    return text.translate(tbl)




def tokenize(review):
    return [word.lower() for t in sent_tokenize(review) for word in word_tokenize(remove_punctuation(t))]


def path_leaf(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)

# transfer a word to its original form
# manually change some partial forms resulted from tokenizing to original form



def normalize(words):
    wnl = WordNetLemmatizer()
    partial_list = {
        "n't": "not",
        "'m": "am",
        "'s": "is",
        "'re": "are",
        "'ll": "will",
        "'ve": "have",
        "'d": "will",
        "ca": "can",
        "wo": "will"
    }

    return [wnl.lemmatize(partial_list.get(x, x)) for x in words]




file_list = glob.glob(os.path.join(os.getcwd(), "documents", "*.txt"))
documents = []
train_set = []

file_number = 0

for file_path in file_list:
    file_number = file_number + 1
    with open(file_path) as f_input:
        lines = f_input.read()
        train_line = lines.split(" ")
        train_set.append(train_line)
        lines = lines.decode('utf-8').strip()
        lines = tokenize(lines)
        lines = normalize(lines)
        documents.append(lines)

print train_set
print documents

stoplist = set(stopwords.words('english'))

texts = [[word for word in document if word not in stoplist] for document in documents]

bigram = Phrases(train_set, min_count=1, threshold=5)


for text in texts:
    text = bigram[text]
print texts


dictionary = corpora.Dictionary(texts)
dictionary.save('/Users/yaxu/Desktop/LDA/tmp/lda.dict')  # store the dictionary, for future reference
print dictionary


corpus = [dictionary.doc2bow(text) for text in texts]
corpora.MmCorpus.serialize('/Users/yaxu/Desktop/LDA/tmp/lda.mm', corpus)  # store to disk, for later use
mm = corpora.MmCorpus('/Users/yaxu/Desktop/LDA/tmp/lda.mm')


lda = models.ldamodel.LdaModel
best_c_value = 0
best_topic_number = 0
topic_number_array = []
coherence_array = []

for topic_number in range(1, 8, 1):
    model_lda = lda(corpus=corpus, id2word=dictionary, num_topics=topic_number, passes=30, update_every=10)
    coherencemodel = CoherenceModel(model=model_lda, texts=texts, dictionary=dictionary, coherence='c_v')
    c_value = coherencemodel.get_coherence()
    print("Num Topics =", topic_number, " has Coherence Value of", round(c_value, 4))
    if c_value > best_c_value:
        texts_lda = model_lda
        best_c_value = c_value
        best_topic_number = topic_number
        print("lda model updated, coherence value is", best_c_value, "topic number is",best_topic_number)
    else:
        print("lda model not updated, coherence value is", best_c_value, "topic number is",best_topic_number)
    topic_number_array.append(topic_number)
    coherence_array.append(c_value)



#topic matrix and nodes list

topic_matrix = []
topic_node_topic_matrix = []

document_nodes_list = []
nodes_id = 0

nodes_file_list = []
nodes_file_id = 0

nodes_topic_list = []
nodes_topicweight_list = []


for text in corpus:
    x = [0] * topic_number  # x is the topic matrix for singne document
    topic_lists = texts_lda.get_document_topics(bow=text)

    for features in topic_lists:
        n = features[0]
        x[n] = features[1]

    max_group_weight = 0
    for features in topic_lists:
        if features[1] > max_group_weight:
            topic_id = features[0]
            topic_matrix.append(x)
            document_nodes_list.append({"name": path_leaf(file_list[nodes_file_id]), "type":"document","group": topic_id,"id": nodes_id,"fileid": nodes_file_id})
            nodes_id = nodes_id + 1
            nodes_file_list.append(nodes_file_id)
            nodes_topic_list.append(topic_id)
            nodes_topicweight_list.append(topic_lists)

    nodes_file_id = nodes_file_id + 1


#link betweem document-nodes based on cosine similarity

links_list = []
for n in range(nodes_id):
    for m in range(n+1,nodes_id):
        if nodes_file_list[n] != nodes_file_list[m]:
            if nodes_topic_list[n] == nodes_topic_list[m]:
                cosine_distance = scipy.spatial.distance.cosine(topic_matrix[n],topic_matrix[m])
                cosine_distance = cosine_distance +0.0001
                if cosine_distance <0.8 :
                    record = {"value":cosine_distance,"type":"innerlink", "source":n, "target":m}
                    links_list.append(record)
        if nodes_file_list[n] == nodes_file_list[m]:
            record = {"value":50, "type":"outerlink", "source":n, "target":m}
            links_list.append(record)
#topic node list
topicnode_list=[]

topicname_list=[]

for topic in texts_lda.show_topics(num_topics= topic_number, num_words=10):
    majot_topic = topic[1].replace("+", ",")
    majot_topic = majot_topic.split(',')
    feature = majot_topic[1]
    feature = feature.split('*')
    k = feature[1].encode('utf8')
    topicnode_list.append({"name": feature[1] , "type":"topic","group": topic[0]})
    topicname_list.append(k)
    #build link between topic-nodes and docement-nodes
    x = [0]* topic_number
    x[topic[0]] = 1
    topic_node_topic_matrix.append(x)
    for n in range(nodes_id):
        if nodes_topic_list[n] == topic[0]:
            cosine_distance = scipy.spatial.distance.cosine(topic_matrix[n], x)
            cosine_distance = cosine_distance + 0.0001
            if cosine_distance != 0:
                record = {"value": cosine_distance, "type": "topiclink", "source": n, "target": nodes_id+topic[0]}
                links_list.append(record)

for n in range(len(topic_node_topic_matrix)):
    for m in range(n+1,len(topic_node_topic_matrix)):
        cosine_distance = scipy.spatial.distance.cosine(topic_node_topic_matrix[n], topic_node_topic_matrix[m])
        cosine_distance = cosine_distance + 0.0001
        record = {"value": cosine_distance, "type": "outertopiclink", "source": nodes_id+n, "target": nodes_id+m}
        links_list.append(record)

for n in range(nodes_id):
    k = str(n)
    with open("data" + k + ".csv", 'wb') as csvfile:
        filewriter = csv.writer(csvfile, delimiter=',',
                                quotechar='|', quoting=csv.QUOTE_MINIMAL)
        filewriter.writerow(['topic', 'weight'])
        topiclist = nodes_topicweight_list[n]
        m = 0
        for topic in topicname_list:
            weight = 0
            for feature in topiclist:
                if feature[0] == m:
                    weight = feature[1]
            topic = ''.join(topic.split())
            t = [topic, weight]
            filewriter.writerow(t)
            m += 1

nodes_list = document_nodes_list+topicnode_list





json_prep = {"nodes":nodes_list, "links":links_list}

json_prep.keys()


json_dump = json.dumps(json_prep, indent=1, sort_keys=True)

filename_out = 'miserables.json'
json_out = open(filename_out,'w')
json_out.write(json_dump)
json_out.close()








