#!/usr/sfw/bin/python
# -*- coding: utf-8 -*-
"""
    Histoires d'autrices, 2022-12-14
    À la découverte des femmes de lettres étudiées, jouées, lues, primées ou publiées en France
    Copyright (C) 2022 - Philippe Gambette
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
    
"""
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
  res = re.search("<a href=./livre/([^\"]+)\"", line)
  if res:
     url = "https://www.livredepoche.com/collections/livre/" + res.group(1)
  print(url)

  author = "-"
  res = re.search("<a href=./auteur/[^>]+>([^<]+)</a>", line)
  if res:
     author = res.group(1)
  print(author)

  title = "-"
  res = re.search("<a href=./livre/[^>]+>([^<]+)</a>", line)
  if res:
     title = res.group(1)
  print(title)
  
  date = ""
  res = re.search("[0-9][0-9]/[0-9][0-9]/([0-9][0-9][0-9][0-9])", line)
  if res:
     date = res.group(1)
  print(date)
  
  outputFile.writelines(author + "\t\t" + title + "\t" + date + "\t" + url + "\n")
  print("")
  #print(line)

inputFile.close()
outputFile.close()
