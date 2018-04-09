#Generate guides
echo ".....Building guide pages....."
echo "node version is " node -v;
mkdocs build;
for d in site/*/ ; do (mv "$d"README/index.html "$d"); done
cp index.html site/
rsync -ir site/ $1/
echo ".....Completed building guide pages....."
