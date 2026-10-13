// better than callbacks to handle async codes

const promiseOne = new Promise((resolve, reject) => {
  // do an async task
  //DB Calls, Cryptography, network

  setTimeout(() => {
    console.log("Async task is completed");
    resolve();
  }, 1000);
})

promiseOne.then(() => {
  console.log("Promise Consumed");
})

const promise = new Promise((resolve, reject) => {
  console.log("User details in 5 seconds:");
  setTimeout(() => {
    resolve({username: "Aditya Sinha", email: "adityasinhaa01@gmail.com"})
  }, 5000);
}).then((user) => {
  console.log(user);
})