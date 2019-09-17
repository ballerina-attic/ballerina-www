

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


// //Events page
// const eventsContent = fs.readFileSync(path.join("templates", "events.html")).toString();
// const eventsData = { "content": eventsContent};
// const eventsHtml = baseTemplate(eventsData);
// const commTargetDir = path.join(targetDir,"events");
// fs.mkdirSync(commTargetDir, { recursive: true });
// fs.writeFileSync(path.join(commTargetDir, "index.html"), eventsHtml);
}

build();