#!/bin/sh
#nightly build script
echo ".....Building main pages....."
mkdocs build; mv -n site/* $1;
echo "....Completed building main pages...."
