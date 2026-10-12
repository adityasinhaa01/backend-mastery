const fs = require('fs');
const path = require('path');

const dataFolder = path.join(__dirname, "data");

if (!fs.existsSync(dataFolder)){
  fs.mkdirSync(dataFolder);
  console.log("Data folder created!");
}


//Synchronous File Operations
const filePath = path.join(dataFolder, "file.txt");

fs.writeFileSync(filePath, "Hello Node.js");

const content = fs.readFileSync(filePath, "UTF8");
console.log(content);

fs.appendFileSync(filePath, "\nAppended line hai ye wala");
const content1 = fs.readFileSync(filePath, "UTF8");
console.log(content1);


//Asynchronous File Operations

