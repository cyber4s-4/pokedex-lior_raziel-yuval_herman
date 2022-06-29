export class Say {
  alert(msg: string): void {
    alert(msg);
  }

  console(msg: string): void {
    console.log(msg);
  }

  printLength(msg: string): void {
    msg += ': ' + this.getLength(msg) + ' chars';
    console.log(msg);
  }

  getLength(msg: string): number {
    return msg.length;
  }
}
