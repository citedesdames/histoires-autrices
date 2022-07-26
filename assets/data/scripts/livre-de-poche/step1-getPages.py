#!/usr/sfw/bin/python
# -*- coding: utf-8 -*-

import glob, os, re, sys, time, requests, shutil

folder = os.path.abspath(os.path.dirname(sys.argv[0]))

url = "https://www.livredepoche.com/collections/classiques?page=num"

# Save all pages in the pages folder
for pageNb in range(0,24):
  print("Downloading " + url.replace("num", str(pageNb)))
  response = requests.get(url.replace("num", str(pageNb)))
  open(os.path.join(os.path.join(folder,"pages"), str(pageNb) + ".html"), 'wb').write(response.content)
  time.sleep(2)

