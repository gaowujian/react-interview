class Playboy {
  constructor(name) {
    this.name = name;
    this.sleepTm = [];
    this.playCallback = [];
    this.isSleeping = false;
  }
  sayHi() {
    console.log(`大家好,我是${this.name}`);
    return this;
  }
  sleep(ms) {
    if (!this.isSleeping) {
      this.isSleeping = true;
      console.log(ms / 1000 + "秒之后");
      console.time();
      setTimeout(() => {
        this.isSleeping = false;
        const fn = this.playCallback.shift();
        fn && fn();
        const ms = this.sleepTm.pop();
        ms && this.sleep(ms);
      }, ms);
    } else {
      this.sleepTm.push(ms);
    }
    return this;
  }
  play(program) {
    if (!this.isSleeping) {
      console.log(`我在玩${program}`);
      console.timeEnd();
    } else {
      this.playCallback.push(() => {
        console.log(`我在玩${program}`);
        console.timeEnd();
      });
    }
    return this;
  }
}
const boy = new Playboy("tony");
// console.log("boy.sayHi().sleep(1000):", boy.sayHi().sleep(1000));
boy.sayHi().sleep(1000).play("王者").sleep(2000).play("跳一跳");
