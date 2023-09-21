class Panel{
   constructor(containerId) {
       this.container = document.getElementById(containerId);
       this.loadPanel();
  }
    loadPanel() {
        const panel = `
        <div class='autoTracker-Panel'}>
            <h1>这是一个panel</h1>
        </div>
        ` 
    this.container.innerHTML = panel;
  }
}
module.exports = Panel;