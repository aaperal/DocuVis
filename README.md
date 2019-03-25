# DocuVis

Proper clustering and visualization tools simplify the process of information retrieval, navigation, and organization when dealing with a variety of documents. We present DocuVis, an interactive visualization system for document clustering and organization. We utilize a force-directed graph to visualize the topic clusters based on the Latent Dirichlet Allocation (LDA) topic model analysis and the D3 visualization package. We incorporate a variety of visualization and navigation tools to provide users with information about document sets they provide, helping people organize their files easily and automatically. We also demonstrate the effectivity of the DocuVis platform in integrating into existing research-oriented workflows.

## Getting Started

To run this file from the command line in your mac, head to the directory containing the LDA.py file. You will want to put the pdf documents you wish to analyze in the "pdfs" folder. Then, from the command line, run:

python3 LDA.py

This will produce the necessary files to make the graph layout visualization. Then, run the following:

python3 pdfconverter.py 

The file name is not appropriately named, but this script will generate the keywords and summaries that are needed to populate the side navigation panel. Afterwards, you can run a server from your terminal by inputting

python3 -m http.server

Upon doing this, go to your localhost in the browser so that you can see the resulting visualization!

### Prerequisites

You will need a variety of libraries, including gensim, nltk, pdfminer.six, matplotlib, and scipy. 


## Running the existing visualization

To see the existing visualization, simply run a server from the root directory in your terminal. This will show the topic modeling results for a variety of documents related to faculty mentoring and graduate school. 

Alternatively, you can navigate into the "civil rights test case" folder and do the same to see the visualization results of running the LDA topic model on a variety of documents related to the Civil Rights Movement. This visualization makes it apparent that additional improvements are still necessary for the system. 



## Authors

* **Ya Xu** - *Initial work* 
* **Alan Peral** - *Updated work*


## Acknowledgments

* Hat tip to anyone whose code or libraries were used
