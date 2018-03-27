#!/bin/sh
#nightly build script
echo ".....entering script....."
mkdir -p webroot
#two-column-pages
cd two-column-pages; mkdocs build; rm -f -- site/footer.html; mv -n site/* ../webroot;cd ../;
#cp two-column-pages/* ./ -r
#mkdocs build
#rm site/footer.html
#rm site/css site/fonts/ site/img/ site/js/ -r
#mv site/* webroot
#main-pages
echo "------------------"
cd main-pages;mkdocs build;mv -n site/* ../webroot; cd ../;
echo ".....starting BBE...."
export GOPATH=$PWD
go get github.com/russross/blackfriday
go run tools/ballerinaByExample/tools/generate.go $1
mkdir -p webroot/ballerina-by-example
cp tools/ballerinaByExample/public/* webroot/ballerina-by-example -r
echo ".....Finishing BBE...."
#Generate guides

cp tools/guides_mkdocs.yml target/dependencies/mkdocs.yml
cd target/dependencies;mkdocs build;cd ../../
for d in target/dependencies/site/*/ ; do (mv "$d"README/index.html "$d"); done
mv target/dependencies/site/ webroot/guides
echo "....Completed...."
