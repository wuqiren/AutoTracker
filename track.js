/* eslint-disable no-restricted-syntax */
// 定义yltrack类

const JSSHA = require('jssha')

const yltrack = {}
// 获取操作系统
function getOsInfo() {
  const userAgent = navigator.userAgent.toLowerCase()
  let name = 'Unknown'
  let version = 'Unknown'
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows'
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000'
    } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
      version = 'Windows XP'
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista'
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7'
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8'
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1'
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
      version = 'Windows 10'
    } else {
      version = 'Unknown'
    }
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'Iphone'
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac'
  } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
    name = 'Unix'
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android'
    } else {
      name = 'Linux'
    }
  } else {
    name = 'Unknown'
  }
  const os = new Object()
  os.name = name
  os.version = version
  return os
}
// 获取浏览器
function getBrowser() {
  const UserAgent = navigator.userAgent.toLowerCase()
  const browserInfo = {}

  /**
     * ios CHROME:
     * mozilla/5.0 (iphone; cpu iphone os 16_3 like mac os x)
     * applewebkit/605.1.15 (khtml, like gecko)
     * crios/111.0.5563.101
     * mobile/15e148 safari/604.1
     *
     * ios SAFARI:
     * UA mozilla/5.0 (iphone; cpu iphone os 16_3_1 like mac os x)
     * applewebkit/605.1.15 (khtml, like gecko)
     * version/16.3 mobile/15e148 safari/604.1
     *
     * safari mac:
     * "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
     * AppleWebKit/605.1.15 (KHTML, like Gecko)
     * Version/15.3 Safari/605.1.15"
     * 
     * https://chromium.googlesource.com/chromium/src.git/+/HEAD/docs/ios/user_agent.md
     *  */

  const browserArray = {
    IE: window.ActiveXObject || 'ActiveXObject' in window, // IE
    Chrome: (UserAgent.indexOf('chrome') > -1 || UserAgent.indexOf('crios') > -1) && UserAgent.indexOf('safari') > -1, // Chrome浏览器
    Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
    Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
    Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1 && UserAgent.indexOf('crios') == -1, // safari浏览器
    Edge: UserAgent.indexOf('edge') > -1, // Edge浏览器
    QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
    WeixinBrowser: /MicroMessenger/i.test(UserAgent), // 微信浏览器
  }
  // console.log(browserArray)
  for (let i in browserArray) {
    if (browserArray[i]) {
      let version = ''
      if (i == 'IE') {
        version = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2]
      } else if (i == 'Chrome') {
        // eslint-disable-next-line no-restricted-syntax
        for (const mt in navigator.mimeTypes) {
          // 检测是否是360浏览器(测试只有pc端的360才起作用)
          if (navigator.mimeTypes[mt].type == 'application/360softmgrplugin') {
            i = '360'
          }
        }
        version = UserAgent.match(/chrome\/([\d.]+)/)?.[1] || UserAgent.match(/crios\/([\d.]+)/)?.[1]
      } else if (i == 'Firefox') {
        version = UserAgent.match(/firefox\/([\d.]+)/)[1]
      } else if (i == 'Opera') {
        version = UserAgent.match(/opera\/([\d.]+)/)[1]
      } else if (i == 'Safari') {
        version = UserAgent.match(/version\/([\d.]+)/)[1]
      } else if (i == 'Edge') {
        version = UserAgent.match(/edge\/([\d.]+)/)[1]
      } else if (i == 'QQBrowser') {
        version = UserAgent.match(/qqbrowser\/([\d.]+)/)[1]
      }
      console.log('browser version', version)
      browserInfo.type = i
      browserInfo.version = parseInt(version)
    }
  }
  return browserInfo
}
function deepObjectMerge(FirstOBJ, SecondOBJ) {
  for (const key in SecondOBJ) {
    FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
      ? deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key]
  }
  return FirstOBJ
}
// 预制属性
let logs = {
  properties: {
  },
}
let apiUrl = ''

function logReport(parmas) {
  if(navigator && navigator.sendBeacon) {
    const headers = {
      type: 'application/x-www-form-urlencoded;charset=utf-8'
    }
    const body = new Blob([JSON.stringify(parmas)], headers)
    const sb = navigator.sendBeacon(apiUrl, body)

    if (sb) {
      console.log('weblog', parmas)
    }
  } else {
    const httpRequest = new XMLHttpRequest()
    httpRequest.open('POST', apiUrl, true)
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8')
    httpRequest.send(JSON.stringify(parmas))
  }
}

function track(parmas) {
  logs.time = Date.parse(new Date()) // 客户端时间戳
  const trackLogs = deepObjectMerge(logs, parmas)
  // logReport(trackLogs)
}
function login(opts) {
  logs = deepObjectMerge(logs, opts)
}
function domToString(node) {
  let newDom = node.cloneNode(true)
  let tmpNode = document.createElement('div')
  tmpNode.appendChild(newDom)
  const str = tmpNode.innerHTML
  tmpNode = newDom = null // 解除引用，以便于垃圾回收
  return str
}
function parentNode(target) {
  if (['BUTTON', 'A'].indexOf(target.tagName.toString()) != -1 || target.getAttribute('data-track') != null) {
    return target
  } if (target.tagName.toString() == 'HTML') {
    return false
  } if (['BUTTON', 'A'].indexOf(target.parentNode.tagName.toString()) != -1 || target.parentNode.getAttribute('data-track') != null) {
    return target.parentNode
  }

  return parentNode(target.parentNode)
}

function AllparentNode(dom, classlist) {
  if (dom.parentNode.tagName.toString() != 'HTML') {
    classlist = [classlist, dom.classList]
    return AllparentNode(dom.parentNode, classlist)
  }
  return classlist.toString()
}
// 生成文件名称
function Hashname(name) {
  // 获取key
  const shaObj = new JSSHA('SHA3-224', 'TEXT', { encoding: 'UTF8' })
  shaObj.update(name)
  const hash = shaObj.getHash('HEX')
  return hash
}
// 初始化
// eslint-disable-next-line no-underscore-dangle
function __init(opts, url, global) {
  apiUrl = url
  const initLogs = {
    event: 'Default', // 事件名
    lib: 'JS', // SDK 类型
    lib_version: '3.0.0', // SDK 版本
    lib_method: 'auto', // 埋点方式
    event_type: 'front',
    properties: {
      url: window.location.href, // url 页面地址
      os: getOsInfo().name, // 设备os
      os_version: getOsInfo().version, // 设备os版本
      screen_width: window.screen.width, // 屏幕宽
      screen_height: window.screen.height, // 屏幕高
      model: navigator.appCodeName, // 设备型号
      manufacturer: navigator.vendor, // 设备制造商
      network_type: navigator.connection ? navigator.connection.effectiveType : '', // 网络类型
      browser: getBrowser().type, // 浏览器
      browser_version: getBrowser().version, // 浏览器版本
      user_agent: navigator.userAgent,
      referrer: document.referrer,
    },
  }
  logs = deepObjectMerge(deepObjectMerge(logs, initLogs), opts)
  // logs.login_id = opts.login_id ? opts.login_id : 0 // 当前的业务登陆用户id 默认 0
  // logs.anonymous_id = opts.anonymous_id ? opts.anonymous_id : 0 // 匿名访客id
  // logs.project_id = opts.project_id ? opts.project_id : 1 // 日志项目id
  // track({ event: 'PageView' })
  if (!global) return
  window.addEventListener('click', (e) => {
    if (parentNode(e.target)) {
      const dom_string = AllparentNode(parentNode(e.target))
      const dom_hash = Hashname(AllparentNode(parentNode(e.target)))
      console.log('埋点字符串', dom_string)
      console.log('埋点Hash值', dom_hash)
      track({ event: 'WebClick', lib_method: 'auto', properties: { dom_hash, dom_string } })
    }
  }, true)
}
// 入口函数
yltrack.init = (opts, url, global) => {
  // __init(opts, url, global)
}
yltrack.track = track
yltrack.login = login

module.exports = yltrack
// export { yltrack }
