import PyPDF2 as pdf
import json
import glob
import os

path = os.getcwd()
for doc in glob.glob(f"{path}/dataset/*.pdf"):
    reader = pdf.PdfReader(doc)
    meta = reader.metadata

    data = {
        "author": f"{meta.author}",
        "creator": f"{meta.creator}",
        "producer": f"{meta.producer}",
        "title": f"{meta.title}"
    }

    reader_string = json.dumps(data, indent=4)
    with open(f"{path}/metaData/{os.path.basename(doc).split('.')[0]}.json", "w") as f:
        f.write(reader_string)