#!/bin/sh
#nightly build script
echo ".....Building BBE Site....."
mkdir -p $2
# #two-column-pages
# cd two-column-pages; mkdocs build; rm -f -- site/footer.html; mv -n site/* ../webroot;cd ../;
# #cp -r two-column-pages/* ./
# #mkdocs build
# #rm site/footer.html
# #rm site/css site/fonts/ site/img/ site/js/ -r
# #mv site/* webroot
# #main-pages
# echo "------------------"
# cd main-pages;mkdocs build;mv -n site/* ../webroot; cd ../;
export GOPATH=$3
go get github.com/russross/blackfriday
mkdir -p $2
go run tools/ballerinaByExample/tools/generate.go $1 $2
#Generate guides

# cp tools/guides_mkdocs.yml target/dependencies/mkdocs.yml
# cd target/dependencies;mkdocs build;cd ../../
# for d in target/dependencies/site/*/ ; do (mv "$d"README/index.html "$d"); done
# mv target/dependencies/site/ webroot/guides
echo "....Completed building BBE Site...."
