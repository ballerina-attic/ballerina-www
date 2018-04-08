#!/bin/sh
#nightly build script
echo ".....Building two column pages....."
mkdocs build && cp -r site/* $1/
echo "....Completed building two column pages...."
