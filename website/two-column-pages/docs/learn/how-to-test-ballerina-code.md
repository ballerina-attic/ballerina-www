# How to Test Ballerina Code

Ballerina has a built-in test framework named Testerina. Testerina enables developers to write testable code. The test framework provides a set of building blocks to help write tests and a set of tools to help test. 

Developers and testers can cover multiple levels of the test pyramid including unit testing, integration testing and end to end testing with the building blocks the framework provides. It provides the flexibility to programmers and testers to build intelligent tests that suites the domain and application needs. 

Testerina design and usage is aligned with project and package semantics of Ballerina. You can test the project packages while you are building the project in a seamless manner using the test constructs. 

 ## Overview
* Ballerina programmers can either place their test code into a single source code file or in a *tests* folder inside a *project* directory structure
* Ballerina tests are defined using a set of  *annotations*
* Test *assertions* can be used to verify the set of program behaviour expectations 
* Data providers can be used to feed in the test data sets 
* Service calls can be tested using service skeletons in the test phase of the project until the system is connected to real service 
* Function mocks can be used to mimic third party function calls to enable testing a project package in isolation 

## Writing and Running Tests 

You need to import test package in all tests. 
```
import ballerina/test;
```

The simple form of tests assumes the tests to be available in the same source file alongside the program code. This is useful for simple cases. 

For structured projects, it is recommended to use a structured test model that is aligned with standard package semantics. 

A package is mapped to a test suite. A package specific unit and integration tests needs to be placed in a subfolder called `tests/` under the package. All tests within a package’s `tests/` subfolder are considered to be part of the same test suite.

Integration tests that are used to test the sources of combination of packages of a project needs to be placed at the project root level folder called `tests/`.

### Project Structure
```
/
  .gitignore
  Ballerina-lock.toml  # Generated during build, used to rebuild identical binary
  Ballerina.toml       # Configuration that defines project intent
  .ballerina/          # Internal cache management and contains project repository
                       # Project repository is built or downloaded package dependencies

  main.bal             # Part of the “unnamed” package, compiled into a main.balx
                       # You can have many files in the "unnamed" package, though unadvisable

  package1/            # The source in this directory will be named “<org-name>/package1” 
    Package.md         # Optional, contains descriptive metadata for display at Ballerina Central
    *.bal              # In this dir and recursively in subdirs except tests/ and resources/
    [tests/]           # Package-specific unit and integration tests
    [resources/]       # Package-specific resources
      *.jar            # Optional, if package includes native Java libraries to link + embed 
    
  packages.can.include.dots.in.dir.name/
    Package.md
    *.bal
    *.jar
    [tests/]         
    [resources/]     
      *.jar            # Optional, if package includes native Java libraries to link + embed 

  [tests/]             # Tests executed for every package in the project
  [resources/]         # Resources included with every package in the project

  target/              # Compiled binaries and other artifacts end up here
      main.balx
      package1.balo
      packages.can.include.dots.in.dir.name.bal
```

The test source files could have any file names. The test functions will have to be specified with `@test:Config` annotation. There are no restrictions on test function name. 

`ballerina test` command can be used to execute tests. 

Execute tests in a given Ballerina source file with
```
ballerina test <balfile> 
```

Execute tests within the specified package with 
```
ballerina test <packagename> 
```
Execute tests in the entire project, using Ballerina `test` command without any parameters. 
```
ballerina test 
```
For more information on the Ballerina `test` command, run 
```
ballerina help test 
```

## Annotations 

The following semantic model can be used to add annotations to your test functions.

```ballerina
@test:BeforeSuite {} 
function testSuiteInitialize() { 
   // package level test initialization logic here 
}

@test:BeforeEach {}
function beforeEachTest() { 
   // test initialization logic here to be 
   // executed before each test being run
}

@test:Config {}
function testFoo() { 
   // test logic for function foo()
}

@test:Config {
    before: "beforeTestBar", 
    after: "afterTestBar", 
    dependsOn: ["testFunctionPre1", "testFuncctionPre2"]
}
function testBar() { 
   // test logic for function bar()
}

function beforeTestBar() { 
   // bar() function test initialization logic here 
}

function afterTestBar() { 
   // bar() function test cleanup logic here 
}

@test:AfterSuite {}
function testSuiteCleanup() { 
   // package level test cleanup logic here 
}
```

Testerina defines the following test annotations. 

#### @test:BeforeSuite {}
The function specified following the annotation will be run once before any of the tests in the test suite is run. This can be used for initializing test suite level aspects. 

#### @test:BeforeEach {}
The function specified following the annotation will be run before every test within the test suite is run. This can be used for repeatedly initializing test level aspects before every test function. 

#### @test:Config {}
The function specified following the annotation is a test function. 
##### Parameters:
``` enable: {true | false} ``` : Enable or disables the test 
Default: true

###### before: "<function name>" 
Name of the function to be run just before the test is run 
Default: none

###### after: "<function name>"
Name of the function to be run after the test is run
 
###### dependsOn: ["<function names>", …]
A list of function names the test function depends on, and will be run before the test. The list of functions provided has no order of execution. The current test function will depend on the list provided and that list will run in whatever order, the order in which the comma separated list appears has no prominence. In case there needs to be an order, the way to do that is to define a sequence of test functions with with one point to another based on dependency using dependsOn parameter in each one's config.

###### dataProvider: “<function name>”
Specifies the name of the function that will be used to provide the value sets to execute the test against. The given Ballerina function should return an array of arrays (eg: string[][] for a test function which accepts string parameters). Each array of the returned array of arrays should have a length similar to the number of arguments of the function (eg: function testSuffixC(string input, string expected) could have a dataProvider function which returns a `string[][]` like `[ [“ab”, “abc”], [“de”, “dec”] ]` ). The length of the array of arrays represents the number of time the same test case would run (eg: in the above example the test function testSuffixC would run 2 times with input parameters “ab”, “abc” and “de”, “dec” respectively.

###### groups:[“<test group name”, …]
List of test group names (one or more) that this test belongs to You can group a given test to a list of named test groups using this configuration. In order to execute tests belonging to a selected test group, you can name the test groups to be executed when you run tests.  
ballerina test `--groups <comma separated list of test group names> <package_name>`

You can skip a list of given tests with `--disable-groups <comma separated list of test group names>` Also you can use the  `--list-groups` flag to list the groups in your tests.

#### @test:AfterSuite {}
The function specified following the annotation will be run once after all of the tests in the test suite is run. This can be used for cleaning up test suite level aspects. 
The test suite covers tests related to a package. 

## Assertions 
Testerina supports the following assertions 

#### assertTrue( boolean expression, string message)
Asserts that the expression is true with an optional message.
```ballerina
import ballerina/test;

@test:Config
function testAssertTrue() {

    boolean value = false;
    test:assertTrue(value, msg = "AssertFalse failed");
}
```

#### assertFalse(boolean expression, string message) 

Asserts that the expression is false with an optional message.

```ballerina
import ballerina/test;

@test:Config
function testAssertFalse() {

    boolean value = false;
    test:assertFalse(value, msg = "AssertFalse failed");
}
```

#### assertEquals(Any actual, Any expected, string message) 

Asserts that the actual is equal to the expected, with an optional message.

```ballerina
import ballerina/test;

@test:Config
function testAssertIntEquals() {

    int answer = 0;
    int a = 5;
    int b = 3;
    answer = intAdd(a, b);
    test:assertEquals(answer, 8, msg = "IntAdd function failed");
}

function intAdd(int a, int b) returns (int) {
    return (a + b);
}
```

#### assertNotEquals(Any actual, Any expected, string message) 

Asserts that the actual is not equal to the expected, with an optional message.

```ballerina
import ballerina/test;

@test:Config
function testAssertIntEquals() {

    int answer = 0;
    int a = 5;
    int b = 3;
    answer = intAdd(a, b);
    test:assertNotEquals(answer, 8, msg = "Matches");
}

function intAdd(int a, int b) returns (int) {
    return (a + b);
}
```

#### assertFail(string message)

Fails the test. Useful when we want to fail a test while in execution based on a check for a condition.

Following are some samples which uses assertFails,

``` ballerina
@test:config
function foo(){
    try {
        bar(); // expecting an exception thrown here
        assertFail("Expected an exception”);
    }   
    catch (Exception e){
        assertTrue(e != null); //or some other assertions
    }
}
```
## Service start/stop Utility

Testerina provides the functionality to start/stop all services of a developer preferred ballerina package.

#### test:startServices(string packageName) (boolean isSuccessful)

Starts all the services of package identified by ‘packageName’. If it is successful returns true else returns false or throws an exception. e.g : ```boolean isSuccessful = test:startServices(“org.abc.services”);```

#### test:stopServices(string packageName) 

Stops all the services of package identified by ‘packageName’.```test:stopServices(“org.abc.services”);```|

## Service skeleton start/stop utility
Testerina provides the functionality to start/stop service skeletons generated from Swagger definitions.

#### test:startServiceSkeleton(string packageName, string swaggerFilePath) (boolean isSuccessful)

Start a service skeleton from a given Swagger definition in the given ballerina package. If it is successful returns true else returns false or throws an exception. e.g : 
```ballerina
boolean isSuccessful =  test:startServiceSkeleton("petstore.service.skeleton", "/tmp/petstore.yaml");
```
When the tests are executing service skeleton related ballerina definition will be generated and started.Host names, ports you have defined in the Swagger definition will be used when starting the service. You can then invoke this service skeleton using a HTTP client endpoint, just like a normal Ballerina service.
#### test:stopServiceSkeleton (string packageName) 

Stop a service skeleton and cleanup created directories of a given ballerina package. This function would first try to stop the service that was created using test:startServiceSkeleton function and then would try to clean up the directories created. e.g : 
```ballerina
test:stopServiceSkeleton(“petstore.service.skeleton”);
```
## Function mocks

Testerina provides the functionality to mock a function in a different third-party package with your own Ballerina function which will help you to test your package independently. 

#### @test:Mock {}

The function specified following the annotation will be a mock function which will get triggered every time the original function is called. The original function that will be mocked should be defined using the annotation parameters.

###### Parameters:
packageName: “<package name>”  : Name of the package where the function to be mocked resides in. 
Default: 
packageName: “.”

functionName: “<function name>” : Name of the function to be mocked. 
Default: 
functionName: null

Following is example for function mocking.

``` ballerina
import ballerina/test;
import ballerina/io;

// This is the mock function which will replace the real intAdd function.
@test:Mock {
    // Since we don't have a package declaration, `.` is the current package
    // We can include any package here e.g : `ballerina.io` etc.
    packageName: ".",
    functionName: "intAdd"
}
// The mock function's signature should match with the actual function's signature.
public function mockIntAdd(int a, int b) returns (int) {
    io:println("I'm the mock function!");
    return (a - b);
}

// This is the test function.
@test:Config {}
function testAssertIntEquals() {
    int answer = 0;
    answer = intAdd(5, 3);
    io:println("Function mocking test");
    test:assertEquals(answer, 2, msg = "function mocking failed");
}

// The real function which is mocked above.
public function intAdd(int a, int b) returns (int) {
    return (a + b);
}
```
