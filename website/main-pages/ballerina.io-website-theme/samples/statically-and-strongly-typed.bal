// quick intro to the ballerina type system
any anything;

// can be any type
int integer = 0; float floatingPoint = 0.0; boolean b = true;
string hi = "hello"; 
byte[] bl = hi.toByteArray("UTF-8");
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
map<boolean> myMap = {"ballerina": true}; // map is built in

// types can be defined as simple records or full objects
type myRec record  {string a; int i; };
public type Person object {
    public int age,
    public string name,
    @readonly public string fullName,

    private string email = "default@abc.com",
    private int[] marks,

    new(age, name = "John", string firstname,
        string lastname = "Doe", int... scores) {
        marks = scores;
    }
};

// functions are built in types including lambdas
function (string, int) returns (string) func =
   (string s, int i) => (string)
     { return "this is a lambda"; };

// this isn't everything - just a taster