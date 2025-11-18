class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;

    #shadow;
    #searchInput;

    #optionsData = [];
    #selectedValues = new Set();

    constructor() {
        super();
        console.log("Hello MySelect");
        this.value = '';

        this._boundHandleOutsideClick = this.#handleOutsideClick.bind(this);
    }

    connectedCallback() {
        this.#shadow = this.attachShadow({mode: "open"});
        this.#createTemplate();
        this.#renderOptions();

        document.addEventListener('click', this._boundHandleOutsideClick);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._boundHandleOutsideClick);
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host{
                    position: relative;
                    display: inline-block;
                    width: 200px;
                }
                
                .select-button{
                width: 100%;
                padding: 6px 8px;
                background: #fff;
                border: 1px solid #4285B4;
                border-radius: 6px;
                box-shadow: inset 4px 4px 6px rgba(0, 0, 0, 0.15);
                text-align: left;
                }
               .select-button:hover {
               border: 1px solid #3E5F8A;
               }
                
                .select-popup{
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background-color: #f0f8ff;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
                    border-radius: 14px;
                    width: 100%;
                }
                
                .select-popup.open{
                    display: block;
                }
                .select-popup-search{
                padding: 10px;
                background-color: #c1dbec;
                }
                .select-popup-options{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin: 10px;
                gap: 4px
                }
            </style>

          <button class="select-button">Выберите опцию</button>

          <div class="select-popup">
            <div class="select-popup-search">
                <input class="select-popup-input" placeholder="Search..."/>
            </div>
            <div class="select-popup-options"></div>
          </div>`;

        this.#shadow.appendChild(template.content.cloneNode(true));

        this.#selectButton = this.#shadow.querySelector(".select-button");
        this.#selectPopup = this.#shadow.querySelector(".select-popup");
        this.#selectPopupSearch = this.#shadow.querySelector(".select-popup-input");
        this.#optionsBox = this.#shadow.querySelector(".select-popup-options");

        this.#selectButton.addEventListener('click', this.#togglePopupHandler);

        this.#searchInput = this.#selectPopupSearch;
        this.#searchInput.addEventListener('input', () => this.#filterOptions());
    }


    #togglePopup() {
        this.#selectPopup.classList.toggle('open');
        this.classList.toggle('open');
    }

    #togglePopupHandler = (event) => {
        event.stopPropagation();
        this.#togglePopup();
    };

    #renderOptions() {
        const options = Array.from(this.querySelectorAll("option"));

        this.#optionsData = options.map(opt => ({
            value: opt.value,
            text: opt.textContent
        }));

        this.#optionsBox.innerHTML = '';

        const template = document.createElement("template");
        template.innerHTML = `
              <label class="option" data-value="">
                <input type="checkbox"/>
              </label>
             `;

        this.#optionsData.forEach(opt => {
            const labelNode = document.createElement("label");
            labelNode.className = "option";
            labelNode.dataset.value = opt.value;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = opt.value;
            checkbox.checked = this.#selectedValues.has(opt.value);
            checkbox.addEventListener('change', () => this.#selectOption(opt.value));


            const textNode = document.createTextNode(opt.text);

            labelNode.appendChild(checkbox);
            labelNode.appendChild(textNode);


            this.#optionsBox.appendChild(labelNode);
        });

        options.forEach(opt => opt.remove());
    }

    #handleOutsideClick(event) {
        if (!this.contains(event.target) && this.#shadow !== event.target && !this.shadowRoot.contains(event.target)) {
            this.#selectPopup.classList.remove('open');
        }
    }

    #filterOptions() {
        const filterText = this.#searchInput.value.toLowerCase();
        Array.from(this.#optionsBox.children).forEach(label => {
            const text = label.textContent.toLowerCase();
            label.style.display = text.includes(filterText) ? '' : 'none';
        });
    }

    #selectOption(value) {
        if (this.#selectedValues.has(value)) {
            this.#selectedValues.delete(value);
        } else {
            this.#selectedValues.add(value);
        }
        this.#updateButtonText();
        this.#updateInputs();
        this.#updateValueProperty();
    }

    #updateInputs() {
        const inputs = Array.from(this.#optionsBox.querySelectorAll('input'));
        inputs.forEach(input => {
            input.checked = this.#selectedValues.has(input.value);
        });
    }

    #updateButtonText() {
        if (this.#selectedValues.size === 0) {
            this.shadowRoot.querySelector('.select-button').textContent = 'Выберите опцию';
        } else {
            const selectedTexts = Array.from(this.#selectedValues).map(val => {
                const opt = this.#optionsData.find(o => o.value === val);
                return opt ? opt.text : val;
            });
            this.shadowRoot.querySelector('.select-button').textContent = selectedTexts.join(', ');
        }
    }


    #updateValueProperty() {
        this.value = Array.from(this.#selectedValues).join(',');
        this.setAttribute('value', this.value);
    }
}

customElements.define('my-select', MySelect);