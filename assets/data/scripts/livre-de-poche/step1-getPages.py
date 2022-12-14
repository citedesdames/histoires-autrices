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

url = "https://www.livredepoche.com/collections/classiques?page=num"

# Save all pages in the pages folder
for pageNb in range(0,24):
  print("Downloading " + url.replace("num", str(pageNb)))
  response = requests.get(url.replace("num", str(pageNb)))
  open(os.path.join(os.path.join(folder,"pages"), str(pageNb) + ".html"), 'wb').write(response.content)
  time.sleep(2)

