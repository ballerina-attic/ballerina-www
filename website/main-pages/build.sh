#!/bin/sh
#nightly build script
echo ".....Building main pages....."
mkdocs build && cp -r site/* $1/
echo "....Completed building main pages...."
