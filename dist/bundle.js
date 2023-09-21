'use strict';

class Panel{
   constructor(containerId) {
       this.container = document.getElementById(containerId);
       this.init();
    }
    init() {
        const panel = `
        <div id='autoTracker-Panel'}>
            <h1>这是一个panel</h1>
            <button id='btn-open'>展示埋点</button>
            <button id='btn-close'>隐藏埋点</button>
        </div>
        `;
        this.container.innerHTML = panel;
    }
    loadEvent(event) {
        const open = document.getElementById('btn-open');
        const close = document.getElementById('btn-close');
        open.addEventListener('click', () => {
            event.open();
        });
        close.addEventListener('click', () => {
            event.close();
        });
    }
}

class Observer{
    constructor(id){
        this.element = document.getElementById(id); //一定是根元素
        console.log(this.element, ' this.element');
        this.panel = new Panel(id);
        this.init();
    }
    init(){
        const observer =  new MutationObserver((mutationsList)=>{
            // MutationRecord数组集合，记录了DOM节点发生变化的一些相关信息
            console.log(mutationsList,'mutationsListmutationsList');
        });
        // 开启监听
        observer.observe(this.element,{
            childList:true,
        });
        this.panel.loadEvent({
            open: () => {
               console.log('展示渲染的');
            },
            close: () => { 
               console.log("隐藏渲染的");
            }
        });
    }
}
new Observer('div1');
