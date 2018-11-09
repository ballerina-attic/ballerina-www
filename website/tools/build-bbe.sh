#!/bin/sh
echo ".....Building BBE Site....."
mkdir -p $2
export GOPATH=$3
go get github.com/russross/blackfriday
rm target/dependencies/ballerina-examples -rf
#git clone https://github.com/ballerina-platform/ballerina-examples target/dependencies/ballerina-examples
git clone --branch v0.982.0 https://github.com/ballerina-platform/ballerina-examples target/dependencies/ballerina-examples
mv target/dependencies/ballerina-examples/examples/abstract-objects/abstract-objects.bal target/dependencies/ballerina-examples/examples/abstract-objects/abstract_objects.bal
mv target/dependencies/ballerina-examples/examples/abstract-objects/abstract-objects.description target/dependencies/ballerina-examples/examples/abstract-objects/abstract_objects.description
mv target/dependencies/ballerina-examples/examples/abstract-objects/abstract-objects.out target/dependencies/ballerina-examples/examples/abstract-objects/abstract_objects.out
go run tools/ballerinaByExample/tools/generate.go "target/dependencies/ballerina-examples" $2
echo "....Completed building BBE Site...."
