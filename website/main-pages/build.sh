#!/bin/sh
#nightly build script
echo ".....Building main pages....."
mkdocs build; rsync -ir site/ $1/;
echo "....Completed building main pages...."
