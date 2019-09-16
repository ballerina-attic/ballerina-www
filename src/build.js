const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

function build() {
   const targetDir = path.join("target");  
   fs.mkdirSync(targetDir, { recursive: true });

   const headHbs = fs.readFileSync(path.join("templates", "header.hbs")).toString();
   const footHbs = fs.readFileSync(path.join("templates", "footer.hbs")).toString();
   const indexHbs = fs.readFileSync(path.join("templates", "index.hbs")).toString();


   handlebars.registerPartial("head", headHbs);
   handlebars.registerPartial("foot", footHbs);

   const indexTemplate = handlebars.compile(indexHbs);
   const indexData = { "name": "test", "test": [1, 2, 3, 4, 5]};
   const indexHtml = indexTemplate(indexData);
   fs.writeFileSync(path.join(targetDir, "index.html"), indexHtml);


   //const headHbs = fs.readFileSync(path.join("templates", "header.hbs")).toString();
   //const footHbs = fs.readFileSync(path.join("templates", "footer.hbs")).toString();
   const learnHbs = fs.readFileSync(path.join("templates", "learn.hbs")).toString();

   handlebars.registerPartial("head", headHbs);
   handlebars.registerPartial("foot", footHbs);

   const learnTemplate = handlebars.compile(learnHbs);
   const learnData = { "name": "test", "test": [1, 2, 3, 4, 5]};
   const learnHtml = learnTemplate(learnData);

   fs.writeFileSync(path.join(targetDir, "learn.html"), learnHtml);
}

build();