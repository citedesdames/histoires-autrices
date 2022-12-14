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
