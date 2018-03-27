#Generate guides
echo ".....Building guide pages....."
mkdocs build;
for d in site/*/ ; do (mv "$d"README/index.html "$d"); done
rsync -ir site/ $1/
echo ".....Completed building guide pages....."
