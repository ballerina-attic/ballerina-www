#!/bin/sh
echo ".....Building BBE Site....."
mkdir -p $2
export GOPATH=$3
go get github.com/russross/blackfriday
rm target/dependencies/ballerina-examples -rf
#git clone https://github.com/ballerina-platform/ballerina-examples target/dependencies/ballerina-examples
#git clone --branch v0.982.0 https://github.com/ballerina-platform/ballerina-examples target/dependencies/ballerina-examples

#get BBE from the language master branch
rm ballerina-lang -rf
git clone https://github.com/ballerina-platform/ballerina-lang
git --git-dir=ballerina-lang/.git --work-tree=ballerina-lang/ checkout v0.983.0
mkdir -p target/dependencies/ballerina-examples/
mv ballerina-lang/examples target/dependencies/ballerina-examples/examples/
rm ballerina-lang -r

go run tools/ballerinaByExample/tools/generate.go "target/dependencies/ballerina-examples" $2
echo "....Completed building BBE Site...."
