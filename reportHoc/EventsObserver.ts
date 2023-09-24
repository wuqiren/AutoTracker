// 针对复杂的场景，多次行为合并：例如上报的参数需要合并为同一个请求参数，需要使用eventbus模式，目前暂时没有使用  2023-2-20
interface IEventsObserverProps {
  wait?: number
  globalSingleIns: boolean
  customCallBack: (params: any) => void
  displayName: string
}
export default class EventsObserver {
  timerId: ReturnType<typeof setTimeout> | null | undefined
  reportData: any
  wait: number | undefined
  customCallBack: ((params: []) => void | undefined) | undefined
  constructor(props: IEventsObserverProps) {
    const {
      customCallBack,
      wait = 300,
      globalSingleIns = false,
      displayName
    } = props
    // 如果全局上存在这个EventsObserver实例，如果globalSingleIns（是否公用一个实例）为true，直接返回全局上的实例
    if (globalSingleIns && (window as any)[displayName]) {
      return (window as any)[displayName]
    }
    this.timerId = null
    this.reportData = []
    this.wait = wait
    this.customCallBack = customCallBack
    //全局单实例模式
    if (globalSingleIns && !(window as any)[displayName]) {
      return ((window as any)[displayName] = this)
    }
  }
  // 收集数据 data是往上报数组里面存放的数据 cb是写判断函数，判断上报数组中是否存在该数据
  collectData<T>(data: T) {
    //只有当上报数组没有该元素的时候才会往里面存放数据
    this.tryDispatchAll()
    if (
      !this.reportData.some(
        (item: T) => JSON.stringify(item) === JSON.stringify(data)
      )
    ) {
      this.reportData.push(data)
    }
    return () => {
      this.clearData(data)
    }
  }
  tryDispatchAll() {
    //如果已经达到发请求的条件，则触发
    if (this.timerId) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
    this.timerId = setTimeout(() => {
      this.timerId = null //清除定时器
      // 只有收集到数据才请求
      if (this.reportData.length) {
        this.customCallBack && this.customCallBack(this.reportData)
      } else {
        return
      }
      this.clearAllData()
    }, this.wait)
  }
  clearAllData() {
    this.reportData = []
  }
  clearData<T>(data: T) {
    this.reportData = this.reportData.filter(
      (item: any) => JSON.stringify(item) !== JSON.stringify(data)
    )
  }
}
