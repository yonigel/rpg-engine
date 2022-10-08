const generateGameMap = (context) => {
    context.ctx = null;
    context.gameMap = [];
    context.tileWidth = 40;
    context.tileHeight = 40;
    context.numberOfRows = context.mapHeight / context.tileHeight;
    context.numberOfColumns = context.mapWidth / context.tileWidth;
    const totalTiles = context.numberOfRows * context.numberOfColumns;
    for (let i=0; i<totalTiles; i++) {
        context.gameMap.push(0);
    }
}

const onCanvasClick = (context, canvas, event) => {
    if (!context.selectedEditTile) {
      return;
    }
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / context.tileWidth);
    const y = Math.floor((event.clientY - rect.top) / context.tileHeight);
    console.log("x: " + x + " y: " + y)
    const result = Object.keys(context.tileMap).find(tileType => context.tileMap[tileType] === context.selectedEditTile);
    context.gameMap[x+y*context.numberOfColumns] = parseInt(result);
    drawGame(context);
}

export const initMap = (context) => {
    context.mapHeight = 800;
    context.mapWidth = 800;
    context.isEditMode = true;
    context.tileMap = {
      0: 'edit-mode-tile',
      1: 'light-green-tile'
    }
    generateGameMap(context);
    const canvas = context.shadowRoot.querySelector('canvas')
    canvas.addEventListener('mousedown', (e) => {
        onCanvasClick(context, canvas, e)
    })
    window.onload = () => {
        context.ctx = context.shadowRoot.getElementById('game').getContext("2d");
      requestAnimationFrame(() => drawGame(context));
      context.ctx.font = "bold 10pt sans-serif";
    };
}

export const getTileByCellType = (context, cellType) => {
    switch(cellType) {
      case 0:
        return context.shadowRoot.getElementById('edit-mode-tile');
      case 1:
        return context.shadowRoot.getElementById('light-green-tile');
    }
  }

export const onEditTileSelected = (context, e) => {
    console.log(e.target.id);
    const test = context.shadowRoot.getElementById('game');
    test.style.cursor = `url(../assets/${e.target.id}.svg), auto`
    context.selectedEditTile = e.target.id;
  }

const drawGame = (context) => {
    if (context.ctx === null) {
      return;
    }
    context.gameMap.map((cellType, index) => {
      let tileImage = getTileByCellType(context, cellType);
      let startOnX, startOnY;
      if (index < context.numberOfColumns) {
        startOnX = index * context.tileWidth;
        startOnY = 0;
      } else {
        const rowNumber = Math.floor(index / context.numberOfColumns);
        startOnX = (index - (rowNumber*(context.numberOfColumns))) * context.tileWidth;
        startOnY = rowNumber * context.tileHeight;
      }
      context.ctx.drawImage(tileImage, 0, 0, context.tileWidth, context.tileHeight, startOnX, startOnY, context.tileWidth, context.tileHeight)
    });
}