#!/bin/sh
#nightly build script
echo ".....Building three column pages....."
mkdocs build && cp -r site/* $1/
echo "....Completed building three column pages...."
