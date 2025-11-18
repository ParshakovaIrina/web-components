class MyPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 10px;
                    margin: 10px 0;
                }
                h3 {
                    margin: 0 0 10px 0;
                }
            </style>
            <h3>Панель</h3>
            <slot></slot>
        `;
    }
}

customElements.define('my-panel', MyPanel);