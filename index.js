import Panel from './panel/index'
class Observer{
    constructor(id){
        this.element = document.getElementById(id) //一定是根元素
        console.log(this.element, ' this.element')
        this.panel = new Panel(id)
        this.init()
    }
    init(){
        const observer =  new MutationObserver((mutationsList)=>{
            // MutationRecord数组集合，记录了DOM节点发生变化的一些相关信息
            console.log(mutationsList,'mutationsListmutationsList')
        })
        // 开启监听
        observer.observe(this.element,{
            childList:true,
        })
        this.panel.loadEvent({
            open: () => {
               console.log('展示渲染的')
            },
            close: () => { 
               console.log("隐藏渲染的")
            }
        })
    }
}
const observe = new Observer('div1')