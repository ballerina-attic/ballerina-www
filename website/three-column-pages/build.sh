#!/bin/sh
#nightly build script
echo ".....Building three column pages....."
mkdocs build; mv -n site/* $1;
echo "....Completed building three column pages...."
