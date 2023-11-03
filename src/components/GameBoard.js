import './KeyboardKey'

class GameBoard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentPosition = 0;
    this.totalKeys = 0;
    this.win = false;
    this.winStreak = 0;
  }

  static get styles() {
    return /* css */`

      h1, p {
        text-align: center;
        color: #fff;
      }

      section {
        height: 100%;
        display: grid;
        grid-template-columns: repeat(10, 50px);
        justify-content: center;
        margin: auto;
      }
    `;
  }

  connectedCallback() {
    document.addEventListener("keydown", this);
    document.addEventListener("key:checked", this);
    this.render();
    this.generateKeys();
  }

  handleEvent(event) {
    if(event.type === "keydown") {
      const { keyCode } = event;
      const inputEvent = new CustomEvent("user:keyPress", {
        detail: { position: this.currentPosition, keyCode },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(inputEvent);
    }

    if( event.type === "key:checked" ) this.handleResult(event.detail);
  }

  handleResult({result}) {
    if(result === 'ok') {
      this.currentPosition++
      this.win = this.totalKeys === this.currentPosition
    };
    if(result === 'ko') {
      this.winStreak = 0;
      this.refreshWinStreak(this.winStreak);
    };

    if(this.win) this.handleWin()
  }

  handleWin() {
    this.generateKeys();
    this.currentPosition = 0;
    this.winStreak++;
    this.refreshWinStreak(this.winStreak);
    this.win = false;
  }
  
  refreshWinStreak(streak) {
    const text = this.shadowRoot.querySelector("p");
    text.innerText = `Win streak: ${streak}`;
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
    <style>${GameBoard.styles}</style>
    <h1>Keyboard Challenge</h1>
    <p>Win streak: ${this.winStreak}</p>
    <section id="keys-container"></section>
    `;
  }

  generateKeys() {
    this.totalKeys = Math.floor(Math.random() * 10) + 4;
    const keyContainer = this.shadowRoot.querySelector('section');
    const keys = keyContainer.querySelectorAll("keyboard-key");
    keys.forEach(e => e.remove());

    for (let index = 0; index < this.totalKeys; index++) {
      const newKey = document.createElement('keyboard-key');
      newKey.setAttribute('num', `${index}`);
      keyContainer.append(newKey);
    }
  }
}

customElements.define("game-board", GameBoard);
