import keys from '../assets/keys.json'

const EVENT_KEYPRESSED = "user:keyPress";
const STATE_OK = "ok";
const STATE_KO = "ko";

class KeyboardKey extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.baseKey = this.getKey();
  }

  static get styles() {
    return /* css */`

    article {
      width: 40px;
      height: 40px;
      background-color: #fff;
      text-align: center;
      margin: 10px;
    }

    .correct {
      background-color: #3ba946;
    }

    .wrong {
      background-color: #cf3535;
    }
    `;
  }

  connectedCallback() {
    this.position = parseInt(this.getAttribute("num"));
    document.addEventListener(EVENT_KEYPRESSED, this);
    this.render();
  }

  disconnectedCallback() {
    document.removeEventListener(EVENT_KEYPRESSED, this);
  }

  handleEvent(event) {
    if(event.type === EVENT_KEYPRESSED) {
      const { position, keyCode } = event.detail;
      if(this.position === position) this.checkKey(keyCode);
    }
  }

  checkKey(keyCode) {
    if(keyCode === this.baseKey.num) {
      this.changeKeyColor(STATE_OK);
      this.notifyBoard(STATE_OK);
    } else {
      this.changeKeyColor(STATE_KO);
      this.notifyBoard(STATE_KO);
    }
  }

  changeKeyColor(state) {
    const key = this.shadowRoot.querySelector('article');
    if(state === STATE_OK) key.className = "correct";
    if(state === STATE_KO) key.className = "wrong";
  }

  notifyBoard(state) {
    const okEvent = new CustomEvent("key:checked", 
      {
        detail: { result: state },
        bubbles: true,
        composed: true
      }
    )
    this.dispatchEvent(okEvent);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${KeyboardKey.styles}</style>
    <article>${this.baseKey.name}</article>
    `;
  }

  getKey(){
    const total = keys.length;
    const randomKey = Math.floor(Math.random() * total);
    return keys[randomKey];
  }
}

customElements.define("keyboard-key", KeyboardKey);
