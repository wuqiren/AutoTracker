class Observer{
    constructor(id){
        this.element = document.getElementById(id) //一定是根元素
        console.log( this.element,' this.element')
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
    }
}
const observe = new Observer('div1')