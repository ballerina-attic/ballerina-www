#This script will scrape the html file content in the webroot
#and generate the search json file

from bs4 import BeautifulSoup
import os
import io
import json
import sys
import re

# The top argument for name in files
if len(sys.argv) > 1:
    topdir = sys.argv[1]
else:
    topdir = '.'
os.chdir(topdir)

extens = ['html']  # the extensions to search for

found = {x: [] for x in extens}

# Directories to ignore
ignore = ['docs', 'ballerina-fonts','css','fonts','img','js','search','vs']

outputjson = os.path.join("search","search_index.json")

print('Scraping files in %s for generating the search json' % os.path.realpath(topdir))

# The body of our log file
logbody = ''

data1 = "{\"docs\": ["

# Walk the tree
for dirpath, dirnames, files in os.walk(topdir):
    # Remove directories in ignore

    for idir in ignore:
        if idir in dirnames:
            dirnames.remove(idir)

    # Loop through the file names for the current step

    for name in files:
        # Split the name by '.' & get the last element
        ext = name.lower().rsplit('.', 1)[-1]

        if ext in extens:

            #Get URL path
            location = os.path.join(dirpath, name)
            found[ext].append(location)
            file = io.open(os.path.join(dirpath, name), 'r', encoding='utf8')
            logbody = file.read()

            #parse the html
            soup = BeautifulSoup(logbody,"lxml")

            #get title of the page
            title = soup.title


            if title is not None:
                title = str(title.get_text())
                title = title.replace("\"","")
                data1 = data1+ "{\"location\":\"/"+str(os.path.relpath(location))+"\""
                data1 = data1+",\"text\":\""+title+"\""
                data1 = data1+ ", \"title\":\"" + title+"\"},"

data1 = data1[:-1]
data1 = data1+"  ]}";

# Write results to the json file
with open(outputjson, 'w') as logfile:
    logfile.write(data1)
