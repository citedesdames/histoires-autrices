#!/usr/sfw/bin/python
# -*- coding: utf-8 -*-

import glob, os, re, sys, time, requests, shutil

folder = os.path.abspath(os.path.dirname(sys.argv[0]))

outputFile = open("output.html", "w", encoding="utf-8")

for fileNb in range(1,106):
  print("Treating " + os.path.join(os.path.join(folder,"pages"), str(fileNb) + ".html"))
  inputFile = open(os.path.join(os.path.join(folder,"pages"), str(fileNb) + ".html"), "r", encoding="utf-8", errors="ignore")
  startSaving = False
  for line in inputFile:
    res = re.search("^(.*)$", line)
    if res:
       line = res.group(1)
    #print(line)
    res = re.search("<article class=.BookList", line)
    if res:
       line = "\n" + line
       startSaving = True
    if startSaving:
       outputFile.writelines(line)

inputFile.close()
outputFile.close()
