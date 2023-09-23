class Panel{
   constructor(containerId) {
       this.container = document.getElementById(containerId);
       this.init();
       this.loadCss()
    }
    init() {
        const panel = `
        <div id='autoTracker-Panel'}>
            <h1>这是一个panel</h1>
            <button id='btn-open'>展示埋点</button>
            <button id='btn-close'>隐藏埋点</button>
        </div>
        `
        this.container.innerHTML = panel;
    }
    loadEvent(event) {
        const open = document.getElementById('btn-open');
        const close = document.getElementById('btn-close');
        open.addEventListener('click', () => {
            event.open()
        })
        close.addEventListener('click', () => {
            event.close()
        })
    }
    loadCss() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = './panel/panel.css';
        document.head.appendChild(link);
    }
}
export default Panel;