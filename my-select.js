class MySelect extends HTMLElement {
    #selectButton;
    #selectPopup;
    #selectPopupSearch;
    #optionsBox;

    constructor() {
        super();
        console.log("Hello MySelect");
    }

    connectedCallback(el){
        this.#createTemplate();
        this.#renderOptions();
    }

    #createTemplate() {
        const template = document.createElement("template");
        template.innerHTML = `
          <button class="select-button"></button>

          <div class="select-popup">
            <input placeholder="Search..."/>
            <div class="select-popup-options"></div>
          </div>`;

        this.append(template.content.cloneNode(true));

        this.#selectButton = this.querySelector(".select-button");
        this.#selectPopup = this.querySelector(".select-popup");
        this.#selectPopupSearch = this.querySelector(".select-popup-search");
        this.#optionsBox = this.querySelector(".select-popup-options");
    }

    #renderOptions() {
        const options = Array.from(this.querySelectorAll("option"));

        const optionsData = options.map(opt => ({
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

        optionsData.forEach(opt => {
            const labelNode = document.createElement("label");
            labelNode.className = "option";
            labelNode.dataset.value = opt.value;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            const textNode = document.createTextNode(opt.text);

            labelNode.appendChild(checkbox);
            labelNode.appendChild(textNode);

            this.#optionsBox.appendChild(labelNode);
        });

        options.forEach(opt => opt.remove());
    }
}

customElements.define('my-select', MySelect);