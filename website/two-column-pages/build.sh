#!/bin/sh
#nightly build script
echo ".....Building two column pages....."
mkdocs build; rsync -ir site/ $1/;
echo "....Completed building two column pages...."
