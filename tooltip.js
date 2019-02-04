class Tooltip extends HTMLElement {
    constructor() {
        super();
        this._toolTipContainer;
        this._toolTipText = 'Some default text';
        this._timer;
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                div {
                    background-color: black;
                    color: white;
                    position: absolute;
                    z-index: 10;
                }

                .highlight {
                    background-color: red;
                }

                ::slotted(.highlight) {
                    border-bottom: 1px dotted red;
                }

                .icon {
                    background: black;
                    color: white;
                    padding: 0.15rem 0.5rem;
                    text-align: center;
                    border-radius: 50%;
                }
            </style>
            <slot></slot>
            <span class="icon">?</span>
        `;
    }

    connectedCallback() {
        if( this.hasAttribute('text') || this.hasAttribute('data-text') ) {
            this._toolTipText = this.getAttribute('text') || this.getAttribute('data-text');
        }
        const toolTipIcon = this.shadowRoot.querySelector('span');
        toolTipIcon.addEventListener('mouseenter', this._showToolTip.bind(this));
        toolTipIcon.addEventListener('mouseleave', this._hideToolTip.bind(this));
        this.shadowRoot.appendChild(toolTipIcon);
        this.style.position = 'relative';
    }

    _showToolTip() {
        this._timer = setTimeout(() => {
            this._toolTipContainer = document.createElement('div');
            this._toolTipContainer.textContent = this._toolTipText;
            this.shadowRoot.appendChild(this._toolTipContainer );
        }, 1000);
    }

    _hideToolTip() {
        clearTimeout(this._timer);
        if( this.shadowRoot.contains(this._toolTipContainer) ) {
            this.shadowRoot.removeChild(this._toolTipContainer);
        }
    }
}

customElements.define('hp-tooltip', Tooltip);