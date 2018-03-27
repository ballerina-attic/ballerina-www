#Generate guides
cp tools/guides_mkdocs.yml target/dependencies/mkdocs.yml
cd target/dependencies;mkdocs build;cd ../../
for d in target/dependencies/site/*/ ; do (mv "$d"README/index.html "$d"); done
mv target/dependencies/site/ webroot/guides
