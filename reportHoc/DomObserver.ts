import 'intersection-observer'
import { debounce } from 'lodash-es'
interface IDomObserver {
  onEnterView?: (target?: Element) => void
  onLeaveView?: (target?: Element) => void
  effectiveTime?: number
}
class DomObserver {
  intersectionInstance: IntersectionObserver | null
  effectiveTime: number
  constructor({
    onEnterView,
    onLeaveView,
    effectiveTime = 1000
  }: IDomObserver) {
    this.intersectionInstance = null
    this.effectiveTime = effectiveTime
    this.init({ onEnterView, onLeaveView })
  }
  //初始化
  init({ onEnterView, onLeaveView }: Exclude<IDomObserver, 'effectiveTime'>) {
    const callback = (entries) => {
      try {
        entries.forEach((entry) => {
          const { isIntersecting, target, intersectionRatio } = entry
          // 进入视图
          if (isIntersecting && intersectionRatio >= 0.5) {
            onEnterView &&
              setTimeout(() => {
                onEnterView()
                this.unobserveTarget(target)
              }, 0)
          }
          // 离开视图
          if (!isIntersecting && onLeaveView) {
            onLeaveView(target)
          }
        })
      } catch (e) {
        console.error('domobserver IntersectionObserver', e)
      }
    }
    this.intersectionInstance = new IntersectionObserver(
      debounce(callback, this.effectiveTime),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }
    )
  }
  // 增加元素监听
  addObserverSelector(addSelector: Element) {
    if (this.intersectionInstance) {
      addSelector && this.intersectionInstance.observe(addSelector)
    }
  }
  // 页面卸载
  disconnect() {
    this.intersectionInstance?.disconnect()
  }
  // 去除监听元素
  unobserveTarget(target: Element) {
    this.intersectionInstance?.unobserve(target)
  }
}

export default DomObserver
