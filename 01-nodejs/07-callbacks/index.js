// Callbacks are functions sent as an argument to another functions
const fs = require('fs');


//example - 1
function person(name, callbackFn){
  console.log(name);
  callbackFn();
}

function address(){
  console.log('India');
}

person('Aditya', address);


// example-2
fs.readFile('input.txt', 'UTF8', (err, data) => {
  if(err){
    console.error("Error encountered: ", err);
    return;
  }else{
    console.log(data);
  }
})