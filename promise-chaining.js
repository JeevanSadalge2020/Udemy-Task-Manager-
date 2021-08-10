function add(a, b) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
      reject("error");
    }, 1000);
  });
}

function sub(a, b) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a - b);
      reject("error");
    }, 1000);
  });
}

add(10, 10)
  .then(res => add(res, 10).then(res => sub(res, 30)))
  .then(res => console.log(res))
  .catch(err => console.log(err));
