class MySelect extends HTMLElement {
    constructor() {
        super();
        console.log("Hello MySelect");
    }
}

customElements.define('my-select', MySelect);