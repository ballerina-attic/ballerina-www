import ballerina/io;

function main (string... args) {
    //Create a JSON object out of other primitives
    int i = 4;
    json[] codes = [i, 8];
    json addr = {
        "street":"Main",
        "city":"94"
    };
    json j = {
        "Store":{
            "@id":"AST",
            "name":"Anne",
            "address":addr,
            "codes":codes
        }
    };
    j.Store.name = "Jane";
    io:println("Constructed JSON:");
    io:println(j);

    //Convert the JSON object to XML using the default `attributePrefix`
    //and the default `arrayEntryTag`.
    xml x1 = check j.toXML({});
    xml x2 = xml `<!--I am a comment-->`;
    xml x3 = x1 + x2;
    io:println("Produced XML:");
    io:println(x3);
    io:println("Value of an individual element:");
    io:println(x3.selectDescendants("name").getTextValue());
}