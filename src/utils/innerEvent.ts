// 消息订阅/推送
class InnerEvent {
  public list: { [key: string]: Array<Function> } = {}

  /**
   * 发送
   * @param key
   * @param fn
   */
  on (key: string, fn: Function) {
    if (!this.list[key]) {
      this.list[key] = []
    }
    this.list[key].push(fn)
  }

  /**
   * 消息关闭
   * @param key
   */
  off (key: string) {
    if (!this.list[key]) {
      return
    } else {
      delete this.list[key]
    }
  }

  /**
   * 推送
   * @param key
   * @param args
   */
  trigger (key: string, ...args: any[]) {
    let arrFn = this.list && this.list[key]
    if (!arrFn || arrFn.length === 0) {
      return
    }
    for (let i = 0; i < arrFn.length; i++) {
      if (typeof arrFn[i] == 'function') {
        arrFn[i].apply(this, [key, ...args])
      }
    }
  }
}
const innerEvent = new InnerEvent()

export default innerEvent
