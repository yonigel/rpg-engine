import { LitElement, html, css } from 'lit';
import {initMap, getTileByCellType, onEditTileSelected} from './helpers/map.helper';

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

export class RpgEngine extends LitElement {
  static get properties() {
    return {
      mapHeight: { type: Number },
      mapWidth: { type: Number },
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
    `;
  }

  constructor() {
    super();
    
  }

  firstUpdated(changedProperties) {
    this.init();
  }

  init() {
    initMap(this);
  }
  
  render() {
    return html`
      <main>
        <img id="edit-mode-tile" @click=${(e) => onEditTileSelected(this, e)} width="40" height="40" src="../assets/edit-mode-tile.svg" style="opacity: 1" />
        <img @click=${(e) => onEditTileSelected(this, e)} id="light-green-tile" width="40" height="40" src="../assets/light-green-tile.svg" style="opacity: 1" />
        <canvas id="game" class="game" width="${this.mapWidth}" height="${this.mapHeight}"></canvas>
      </main>
    `;
  }
}
