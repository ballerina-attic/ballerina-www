any anything; 
int integer = 0;
float floatingPoint = 0.0;
boolean b = true; 
string hi = "hello"; 
blob bl = hi.toBlob("UTF-8"); 

json j = { a: "hello", b: 5 }; 

xml x = xml `<ballerina>
                <supports>XML natively</supports>
             </ballerina>`;

string[] stringArray = ["hi", "there"]; 
int[][] arrayOfArrays = [[1,2],[3,4]];
json | xml | string unionType; 
(string, int) tuple = ("hello", 5); 
() n = (); // the empty tuple acts as "null"
string | error stringOrError = "this is a union type";
int? optionalInt = 5; // an int value or no value
var inferred = ("hello", 5); 
map<boolean> myMap = {"ballerina": true}; 

type myRecord record { string a; int b; };

type myObject object {  
   public string x;
   private int y;

   new (x, y) {}
   function getX() returns (string) { return x; }
};
