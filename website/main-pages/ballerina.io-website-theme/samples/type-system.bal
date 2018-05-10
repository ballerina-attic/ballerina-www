any anything; 
int integer = 0;
float floatingPoint = 0.0;
boolean b = true; 
string hi = "hello"; 
blob bl = hi.toBlob("UTF-8"); 
json jsonNative = { a: "hello", b: 5 }; 
xml x = xml `<ballerina>
                <supports>XML natively</supports>
             </ballerina>`;
string[] stringArray = ["hi", "there"]; 
int[][] arrayOfArrays = [[1,2],[3,4]];
json | xml | string unionType; 
(string, int) tuple = ("hello", 5); 
() n = (); // the empty tuple acts as "null"
string | int stringOrInt = "this is a union type";
int | () intOrNull = 5;
var inferred = ("hello", 5); 
map<boolean> myMap = {"ballerina": true}; 
type myRecord { string a; int b; };
type myObject object {   
    public { string x; } private { string y; }
    new (string xi, string yi) { x = xi; y = yi; }
    function getX() returns (string) { return x; }
};
