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

const asyncFilePath = path.join(dataFolder, 'asyncFile.txt');

fs.writeFile(asyncFilePath, "Hello Node Async", (err) => {
  if(err) throw err;
  console.log("File written successfully!");
})

const asyncContent = fs.readFile(asyncFilePath, "UTF8", (err, data) => {
  if (err) throw err;
  console.log("File Content:");
  console.log(data);
});

fs.appendFile(asyncFilePath, "\nAsync Nigga", (err) => {
  if (err) throw err;
  console.log('New line added');
});
const asyncContent1 = fs.readFile(asyncFilePath, "UTF8", (err, data) => {
  if (err) throw err;
  console.log("File Content:");
  console.log(data);
})

