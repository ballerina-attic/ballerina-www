#!/bin/sh
echo ".....Building BBE Site....."
mkdir -p $2
export GOPATH=$3
go get github.com/russross/blackfriday
go run tools/ballerinaByExample/tools/generate.go $1 $2
echo "....Completed building BBE Site...."
