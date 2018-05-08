// quick intro to the ballerina type system
any anything;

// can be any type
int integer = 0; float floatingPoint = 0.0; boolean b = true;
string hi = "hello"; 
blob bl = hi.toBlob("UTF-8");
@final float PI = 3.1415926; // constants

// json and XML are built in
json j = { a: "hello", b: 5 };
xml x = xml `<ballerina>
            <supports>XML natively</supports></ballerina>`;
string[] stringArray = ["hi", "there"];
int[][] arrayOfArrays = [[1,2],[3,4]]; // array of arrays
json | xml | error networkResponse;
(string, int) tuple = ("hello", 5); // tuple types
() n = (); // the empty tuple is 'null'
int | () stringOrnull = 5; // union type of string or 'null'
var inferred = ("hello", 5); // type inference
map<boolean> myMap = {"ballerina": true}; // map is built in

// types can be defined as simple records or full objects
type myRec  {string a; int b; };
public type Response object {
    public {
        @readonly int statusCode;
        string reasonPhrase;
        ResponseCacheControl cacheControl;
    }
    private {
        int receivedTime;
    }
    public native function getEntity () returns (mime:Entity|error);
    public function setStatusCode(int statusCode);
};

// functions are built in types including lambdas
function (string, int) returns (string) func =
   (string x, int i) => (string)
     { return "this is a lambda"; };

// this isn't everything - just a taster