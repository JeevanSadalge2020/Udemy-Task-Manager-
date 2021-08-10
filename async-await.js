async function doWork() {
  const sum = await add(1, 99);
  const sum1 = await add(sum, 1);
  const sum2 = await add(sum1, 1);
  return sum2;
}

doWork()
  .then(res => console.log("SUM", res))
  .catch(err => console.log(err));

function add(a, b) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 2000);
  });
}
