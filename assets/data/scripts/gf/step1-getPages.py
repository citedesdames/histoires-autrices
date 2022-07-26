#!/usr/sfw/bin/python
# -*- coding: utf-8 -*-

import glob, os, re, sys, time, requests, shutil

folder = os.path.abspath(os.path.dirname(sys.argv[0]))

url = "https://editions.flammarion.com/Catalogue/gf?filtres%5Bsets%5D=&filtres%5Bsorting%5D%5Bsorting%5D=parution_desc&filtres%5Bpage%5D=num#ouvrages"

# Save all pages in the pages folder
for pageNb in range(1,106):
  print("Downloading " + url.replace("num", str(pageNb)))
  response = requests.get(url.replace("num", str(pageNb)))
  open(os.path.join(os.path.join(folder,"pages"), str(pageNb) + ".html"), 'wb').write(response.content)
  time.sleep(2)

