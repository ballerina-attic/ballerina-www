#!/bin/sh
echo ".....Building BBE Site....."
mkdir -p $2
export GOPATH=$3
go get github.com/russross/blackfriday
rm target/dependencies/ballerina-examples -rf
git clone -b release-0.980.0 https://github.com/ballerina-platform/ballerina-examples target/dependencies/ballerina-examples
go run tools/ballerinaByExample/tools/generate.go "target/dependencies/ballerina-examples" $2
echo "....Completed building BBE Site...."
