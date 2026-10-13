//module.exports -> exports functions/variables from a module

const {sum, sub, div} = require('./modules')

// console.log(firstModule.div(25,0));

try{
  console.log("Trying to divide by 0");
  let res = div(100,0);
  console.log(res);
}catch(error){
  console.log("Caught an error\n", error.message);
}