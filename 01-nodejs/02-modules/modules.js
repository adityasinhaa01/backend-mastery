const sum = (a, b) => {
  return a + b;
}

const sub = (a, b) => {
  return a - b;
}

const div = (a, b) => {
  if(b === 0){
    throw new Error('Divide by zero not possible');
  }

  return a/b;
}

module.exports = {
  sum, 
  sub, 
  div,
};