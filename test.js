const data = {
  hello: {
    log() {
      return 'hello log';
    },
  },
  hi: {
    log() {
      return 'hi log'
    },
  },
}

const blankObject = {};

const proxy = new Proxy(blankObject, {
  get(target, key) {
    if (key in data) return data[key]; // <---
    return target[key]; // default
  }
});

console.log(proxy.hello.log()); // hello log;
