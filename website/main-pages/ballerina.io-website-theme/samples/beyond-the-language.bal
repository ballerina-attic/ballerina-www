import wso2/twitter;

…

documentation {
	Create a user.

	P{{name}} - User’s name
	P{{age}} - User’s age
	P{{salary}} - User’s salary
	R{{}} - User object
}
function addUser (string name, int age, float salary) returns User {
     	io:println(name, age, salary);
     	User usr = new (name, age, salary);
return usr;
}

…
@test:Config
function testAddUser() {
}

@test:config {dependsOn: [“testAddUser”]}
function testUpdateUser() {
}
