import { LitElement, html, css } from 'lit';

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

export class RpgEngine extends LitElement {
  static get properties() {
    return {
      mapHeight: { type: Number } = 400,
      mapWidth: { type: Number } = 400,
      isEditMode: { type: Boolean },
      selectedEditTile: {type: String}
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
        /* cursor: url(../assets/light-green-tile.svg), auto; */
      }
      
    `;
  }

  constructor() {
    super();
    this.mapHeight = 800;
    this.mapWidth = 800;
    this.isEditMode = true;
    this.tileMap = {
      0: 'edit-mode-tile',
      1: 'light-green-tile'
    }
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
        return this.shadowRoot.getElementById('edit-mode-tile');
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
  }

  onCanvasClick = (canvas, event) => {
    if (!this.selectedEditTile) {
      return;
    }
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / this.tileWidth);
    const y = Math.floor((event.clientY - rect.top) / this.tileHeight);
    console.log("x: " + x + " y: " + y)
    const result = Object.keys(this.tileMap).find(tileType => this.tileMap[tileType] === this.selectedEditTile);
    this.gameMap[x+y*this.numberOfColumns] = parseInt(result);
    this.drawGame();
  }

  onEditTileSelected(e) {
    console.log(e.target.id);
    const test = this.shadowRoot.getElementById('game');
    test.style.cursor = `url(../assets/${e.target.id}.svg), auto`
    this.selectedEditTile = e.target.id;
  }

  render() {
    return html`
      <main>
        <img id="edit-mode-tile" @click=${this.onEditTileSelected} width="40" height="40" src="../assets/edit-mode-tile.svg" style="opacity: 1" />
        <img @click=${this.onEditTileSelected} id="light-green-tile" width="40" height="40" src="../assets/light-green-tile.svg" style="opacity: 1" />
        <canvas id="game" class="game" width="${this.mapWidth}" height="${this.mapHeight}"></canvas>
      </main>
    `;
  }
}
