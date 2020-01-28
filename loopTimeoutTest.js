function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  for (let i = 0; i < 100000; i++) {
    let start = new Date().getSeconds();
    // console.log('now', i);
    if (100000 % i === 20) {
      await delay(1000);
    }
    console.log(new Date().getSeconds() - start);
  }
})();
