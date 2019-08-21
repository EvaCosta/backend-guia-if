#coding: utf-8

from bs4 import BeautifulSoup
import requests
import re
import json

data = []
url_base = "https://copese.ifsudestemg.edu.br"
url = "https://copese.ifsudestemg.edu.br/node/10843"

res = requests.get(url)

soup = BeautifulSoup(res.text, 'html.parser')

links = soup.find("div", {"id": "content-content"}).find("ul")

for link in links.find_all("a"):
    processo = {}
    page = requests.get(link.get("href") if "http" in link.get("href") else url_base + link.get("href"))
    page_soup = BeautifulSoup(page.text, 'html.parser')
    processo["nome"] = page_soup.find("h1").text
 
   
    processo["provas"] = []
    
    for prova in page_soup.find_all(lambda tag:tag.name=="a" and "Prova" in tag.text):
        objeto = {
            "titulo": prova.text,
            "link" : prova.get("href")
        }
        processo["provas"].append(objeto)
    
    data.append(processo)


with open('provas.json', 'w') as outfile:
    json.dump(data, outfile, indent=4, ensure_ascii=True)
