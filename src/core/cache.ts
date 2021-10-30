import Monitor from './track'

export class Cache {
  // Monitor是否已实例化
  public loaded: boolean = false
  public instance!: Monitor
}

export default new Cache()
