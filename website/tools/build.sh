#!/bin/sh
#nightly build script

echo ".....entering script....."
mkdir webroot

#two-column-pages
cp two-column-pages/* ./ -r
mkdocs build
rm site/footer.html
rm site/css site/fonts/ site/img/ site/js/ -r
mv site/* webroot

#main-pages

cp main-pages/* ./ -r
mkdocs build
cp site/* webroot -R

echo ".....starting BBE...."

rm public -r
mkdir public
export GOPATH=$PWD
go get github.com/russross/blackfriday
go run tools/ballerinaByExample/tools/generate.go
cp public webroot/ballerina-by-example -r

echo ".....Finishing BBE...."

#Generate guides
rm site -r
cp guides/mkdocs.yml ./
mkdocs build
rm site/footer.html
rm site/css site/fonts/ site/img/ site/js/ -r
for d in ./site/*/ ; do (pwd && cp "$d"README/index.html "$d"); done
mv site/ guides
