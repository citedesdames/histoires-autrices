#!/usr/sfw/bin/python
# -*- coding: utf-8 -*-

import glob, os, re, sys, time, requests, shutil

folder = os.path.abspath(os.path.dirname(sys.argv[0]))

inputFile = open("output.html", "r", encoding="utf-8", errors="ignore")
outputFile = open("output.csv", "w", encoding="utf-8")
outputFile.writelines("Author\t\tTitle\tDate\tURL\n")

for line in inputFile:
  res = re.search("<article[^>]*>(.*)</article>", line)
  if res:
     line = res.group(1).replace("\t"," ").replace("  "," ").replace("  "," ").replace("  "," ").replace("  "," ")

  url = ""
  res = re.search("<a class=.BookList-cover. href=.([^\"]+).>", line)
  if res:
     url = "https://editions.flammarion.com" + res.group(1)
  print(url)

  author = "-"
  res = re.search("<a class=.BookList-author[^>]*>[ ]*([^<]*)</a>", line)
  if res:
     author = res.group(1)
  print(author)

  title = "-"
  res = re.search("class=.BookList-title.>[ ]*<a[^>]*>([^<]*)</a>", line)
  if res:
     title = res.group(1)
  print(title)
  
  date = ""
  res = re.search("Paru le[ ]*[0-9]*/[0-9]*/([0-9]*)", line)
  if res:
     date = res.group(1)
  print(date)
  
  outputFile.writelines(author + "\t\t" + title + "\t" + date + "\t" + url + "\n")
  print("")
  #print(line)

inputFile.close()
outputFile.close()
