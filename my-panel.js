class MyPanel extends HTMLElement {
    static observedAttributes = ["header", 'sub-header'];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

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
           <h2 id="main-header">Default header</h2>
           <h3 id="sub-header"></h3>
            <slot></slot>
        `;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'header') {
            const headerEl = this.shadowRoot.querySelector('#main-header');
            if (headerEl) {
                headerEl.textContent = newValue || 'Default Header';
            }
        } else if (name === 'sub-header') {
            const subHeaderEl = this.shadowRoot.querySelector('#sub-header');
            if (subHeaderEl) {
                subHeaderEl.textContent = newValue || '';
            }
        }
    }
}

customElements.define('my-panel', MyPanel);