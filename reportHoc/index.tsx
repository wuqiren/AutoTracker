import React, { useEffect, useRef } from 'react'
import DomObserver from './DomObserver'

const ReportHoc = (WapperComponent, customCallBack?: any) => {
  return (props: { sellerItemInfo: any; index: number }) => {
    const { sellerItemInfo } = props
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
      const children = ref.current?.children
      const domObserver = new DomObserver({
        onEnterView: () => {
          const { index, ...args } = props
          customCallBack({ ...args }, index)
        }
      })

      if (children) {
        // 执行监听逻辑
        domObserver.addObserverSelector(children[0])
      }
      return () => {
        if (children) {
          domObserver.unobserveTarget(children[0])
        }
      }
    }, [])
    return (
      <div id="report-hoc" ref={ref}>
        {sellerItemInfo?.adId && (
          <img
            className="ad_sign"
            src="https://access-wfile.yuanling.com/yl-static/Group%2010664.png"
          />
        )}

        <WapperComponent {...props} />
      </div>
    )
  }
}
export default ReportHoc
