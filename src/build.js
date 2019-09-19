

const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

function build() {
const targetDir = path.join("target");
fs.mkdirSync(targetDir, { recursive: true });

const baseHbs = fs.readFileSync(path.join("templates", "base.hbs")).toString();
const baseTemplate = handlebars.compile(baseHbs);


//Home Page
const indexContent = fs.readFileSync(path.join("templates", "index.html")).toString();
const indexData = { "content": indexContent };
const indexHtml = baseTemplate(indexData);
fs.writeFileSync(path.join(targetDir, "index.html"), indexHtml);


//Learn Page
const learnContent = fs.readFileSync(path.join("templates", "learn.html")).toString();
const learnData = { "content": learnContent };
const learnHtml = baseTemplate(learnData);
const learnTargetDir = path.join(targetDir,"learn");
fs.mkdirSync(learnTargetDir, { recursive: true });
fs.writeFileSync(path.join(learnTargetDir, "index.html"), learnHtml);

//Community page
const communityContent = fs.readFileSync(path.join("templates", "community.html")).toString();
const communityData = { "content": communityContent};
const communityHtml = baseTemplate(communityData);
const commTargetDir = path.join(targetDir,"community");
fs.mkdirSync(commTargetDir, { recursive: true });
fs.writeFileSync(path.join(commTargetDir, "index.html"), communityHtml);


//Events page
const eventsContent = fs.readFileSync(path.join("templates", "learn","events.html")).toString();
const eventsData = { "content": eventsContent};
const eventsHtml = baseTemplate(eventsData);
const eventsTargetDir = path.join(targetDir,"learn","events");
fs.mkdirSync(eventsTargetDir, { recursive: true });
fs.writeFileSync(path.join(eventsTargetDir, "index.html"), eventsHtml);


//How to pages

//How to Structure Ballerina Code
const howtostructureContent = fs.readFileSync(path.join("templates", "learn","how-to-structure-ballerina-code.html")).toString();
const howtostructureData = { "content": howtostructureContent};
const howtostructureHtml = baseTemplate(howtostructureData);
const howtostructureTargetDir = path.join(targetDir,"learn","how-to-structure-ballerina-code");
fs.mkdirSync(howtostructureTargetDir, { recursive: true });
fs.writeFileSync(path.join(howtostructureTargetDir, "index.html"), howtostructureHtml); 

// How to Test Ballerina Code
const howtotestContent = fs.readFileSync(path.join("templates", "learn","how-to-test-ballerina-code.html")).toString();
const howtotestData = { "content": howtotestContent};
const howtotestHtml = baseTemplate(howtotestData);
const howtotestTargetDir = path.join(targetDir,"learn","how-to-test-ballerina-code");
fs.mkdirSync(howtotestTargetDir, { recursive: true });
fs.writeFileSync(path.join(howtotestTargetDir, "index.html"), howtotestHtml); 

// How to Document Ballerina Code
const howtodocumentContent = fs.readFileSync(path.join("templates", "learn","how-to-document-ballerina-code.html")).toString();
const howtodocumentData = { "content": howtodocumentContent};
const howtodocumentHtml = baseTemplate(howtodocumentData);
const howtodocumentTargetDir = path.join(targetDir,"learn","how-to-document-ballerina-code");
fs.mkdirSync(howtodocumentTargetDir, { recursive: true });
fs.writeFileSync(path.join(howtodocumentTargetDir, "index.html"), howtodocumentHtml); 

// How to publish modules 
const howtopublishContent = fs.readFileSync(path.join("templates", "learn","how-to-publish-modules.html")).toString();
const howtopublishData = { "content": howtopublishContent};
const howtopublishHtml = baseTemplate(howtopublishData);
const howtopublishTargetDir = path.join(targetDir,"learn","how-to-publish-modules");
fs.mkdirSync(howtopublishTargetDir, { recursive: true });
fs.writeFileSync(path.join(howtopublishTargetDir, "index.html"), howtopublishHtml); 

// How to Run and Deploy Ballerina Programs
const howtodeployContent = fs.readFileSync(path.join("templates", "learn","how-to-deploy-and-run-ballerina-programs.html")).toString();
const howtodeployData = { "content": howtodeployContent};
const howtodeployhHtml = baseTemplate(howtodeployData);
const howtodeployTargetDir = path.join(targetDir,"learn","how-to-deploy-and-run-ballerina-programs");
fs.mkdirSync(howtodeployTargetDir, { recursive: true });
fs.writeFileSync(path.join(howtodeployTargetDir, "index.html"), howtodeployhHtml); 

// How to Observe Ballerina Services
const howtoobserveContent = fs.readFileSync(path.join("templates", "learn","how-to-observe-ballerina-code.html")).toString();
const howtoobserveData = { "content": howtoobserveContent};
const howtoobserveHtml = baseTemplate(howtoobserveData);
const howtoobserveTargetDir = path.join(targetDir,"learn","how-to-observe-ballerina-code");
fs.mkdirSync(howtoobserveTargetDir, { recursive: true });
fs.writeFileSync(path.join(howtoobserveTargetDir, "index.html"), howtoobserveHtml); 

// How to generate Ballerina code for Protocol Buffer Definition
const howtogenerateContent = fs.readFileSync(path.join("templates", "learn","how-to-generate-code-for-protocol-buffers.html")).toString();
const howtogenerateData = { "content": howtogenerateContent};
const howtogenerateHtml = baseTemplate(howtogenerateData);
const howtogenerateTargetDir = path.join(targetDir,"learn","how-to-generate-code-for-protocol-buffers");
fs.mkdirSync(howtogenerateTargetDir, { recursive: true });
fs.writeFileSync(path.join(howtogenerateTargetDir, "index.html"), howtogenerateHtml); 

// Ballerina Style Guide
const styleguideContent = fs.readFileSync(path.join("templates", "learn","style-guide.html")).toString();
const styleguideData = { "content": styleguideContent};
const styleguideHtml = baseTemplate(styleguideData);
const styleguideTargetDir = path.join(targetDir,"learn","style-guide");
fs.mkdirSync(styleguideTargetDir, { recursive: true });
fs.writeFileSync(path.join(styleguideTargetDir, "index.html"), styleguideHtml); 

}



build();