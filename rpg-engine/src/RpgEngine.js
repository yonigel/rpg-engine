import { LitElement, html, css } from 'lit';

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

export class RpgEngine extends LitElement {
  static get properties() {
    return {
      mapHeight: { type: Number } = 400,
      mapWidth: { type: Number } = 400,
      isEditMode: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin: 0 auto;
        text-align: center;
      }

      .game {
        cursor: url(../assets/light-green-tile.svg), auto;
      }
      
    `;
  }

  constructor() {
    super();
    this.mapHeight = 800;
    this.mapWidth = 800;
    this.isEditMode = true;
  }

  firstUpdated(changedProperties) {
    this.init();
  }

  init() {
    this.ctx = null;
    this.gameMap = [];
    this.tileWidth = 40;
    this.tileHeight = 40;
    this.numberOfRows = this.mapHeight / this.tileHeight;
    this.numberOfColumns = this.mapWidth / this.tileWidth;
    this.generateGameMap();
    const canvas = this.shadowRoot.querySelector('canvas')
    canvas.addEventListener('mousedown', (e) => {
      this.onCanvasClick(canvas, e)
    })
    window.onload = () => {
      this.ctx = this.shadowRoot.getElementById('game').getContext("2d");
      requestAnimationFrame(this.drawGame);
      this.ctx.font = "bold 10pt sans-serif";
    };
  }

  getTileByCellType(cellType) {
    switch(cellType) {
      case 0:
        return this.shadowRoot.getElementById('test');
      case 1:
        return this.shadowRoot.getElementById('light-green-tile');
    }
  }

  drawGame = () => {
    if (this.ctx === null) {
      return;
    }
    this.gameMap.map((cellType, index) => {
      let tileImage = this.getTileByCellType(cellType);
      let startOnX, startOnY;
      if (index < this.numberOfColumns) {
        startOnX = index * this.tileWidth;
        startOnY = 0;
      } else {
        const rowNumber = Math.floor(index / this.numberOfColumns);
        startOnX = (index - (rowNumber*(this.numberOfColumns))) * this.tileWidth;
        startOnY = rowNumber * this.tileHeight;
      }
      this.ctx.drawImage(tileImage, 0, 0, this.tileWidth, this.tileHeight, startOnX, startOnY, this.tileWidth, this.tileHeight)
    });
  }

  generateGameMap() {
    const defaultTileNumber = 0;
    const totalTiles = this.numberOfRows * this.numberOfColumns;
    for (let i=0; i<totalTiles; i++) {
      this.gameMap.push(0);
    }
    // this.gameMap = [
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    // ];
  }

  onCanvasClick = (canvas, event) => {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / this.tileWidth);
    const y = Math.floor((event.clientY - rect.top) / this.tileHeight);
    console.log("x: " + x + " y: " + y)
    this.gameMap[x+y*this.numberOfColumns] = 1;
    this.drawGame();
  }

  render() {
    return html`
      <main>
        <img id="test" width="40" height="40" src="../assets/edit-mode-tile.svg" style="opacity: 1" />
        <img id="light-green-tile" width="40" height="40" src="../assets/light-green-tile.svg" style="opacity: 1" />
        <canvas id="game" class="game" width="${this.mapWidth}" height="${this.mapHeight}"></canvas>
      </main>
    `;
  }
}
