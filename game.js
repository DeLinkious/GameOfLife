const gamedata = {};
gamedata.canvas = document.getElementById("game");
gamedata.pixelSize = 2;
gamedata.aliveRate = 0.5;
gamedata.fps = 10;

class Pixel {
	// creates pixel-object
	constructor(context, posX, posY, pixelSize, aliveRate, aliveColor, deadColor){
		this.context = context;

		// set position
		this.posX = posX;
		this.posY = posY;
		// set state
		this.state = Math.random() > aliveRate? 1 : 0;
		// set visuals
		this.pixelSize = pixelSize;
		this.aliveColor = aliveColor;
		this.deadColor = deadColor;
	}
	setPixel() {
		// draws pixel
		this.context.fillStyle = this.state == 1 ? this.aliveColor : this.deadColor;
		this.context.fillRect(this.posX * this.pixelSize, this.posY * this.pixelSize, this.pixelSize, this.pixelSize);
	}
}

class GameOfLife {
	// count generation
	static generation = 0;
	constructor(canvas,pixelSize=5, deadColor="#000000", aliveColor="#FFFFFF", aliveRate=0.35, fps=10, border="on"){
		this.pixels = [];
		this.width = canvas.width;
		this.height = canvas.height;
		this.context = canvas.getContext("2d");
		this.pixelSize = pixelSize;
		this.deadColor = deadColor;
		this.aliveColor = aliveColor;
		this.aliveRate = aliveRate; // chance of pixel being alive in %/100
		this.columns = Math.floor(this.width/this.pixelSize);
		this.rows = Math.floor(this.height/this.pixelSize);
		this.fps = 1000/fps;
		this.border = border; // can pixel loop through field
	}
	createPixel(){
		// pushes pixel-objects into array
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.columns; x++) {
				this.pixels.push(new Pixel(this.context, x, y, this.pixelSize, this.aliveRate, this.aliveColor, this.deadColor));
			}
		}
		// draw all pixels
		this.drawPixels();
	}
	validatePixels(){
		// loop over all pixels
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.columns; x++) {
				// count nearby pixels
				let neighbours = 
				this.isAlive(x - 1, y - 1) + 
				this.isAlive(x, y - 1) + 
				this.isAlive(x + 1, y - 1) +
				this.isAlive(x - 1, y) +
				this.isAlive(x + 1, y) +
				this.isAlive(x - 1, y + 1) +
				this.isAlive(x, y + 1) +
				this.isAlive(x + 1, y + 1);

				this.setStates(this.getIndex(x, y), neighbours);
			}
		}
	}
	isAlive(x, y){
		// TODO: make canvas borderless (option)
		if (x < 0 || x >= this.columns || y < 0 || y >= this.rows){
			return 0;
		}

		return this.pixels[this.getIndex(x, y)].state;
	}
	getIndex(x, y){
		return x + (y * this.columns);
	}
	setStates(index, neighbours){
		if (neighbours == 2){
			// pixel state stays the same
			this.pixels[index].nextState = this.pixels[index].state;
		}else if (neighbours == 3){
			// pixel must live
			this.pixels[index].nextState = 1;
		}else{
			// pixel must die
			this.pixels[index].nextState = 0;
		}
	}
	drawPixels(){
		for (let i = 0; i < this.pixels.length; i++) {
			this.pixels[i].setPixel();
		}
	}
	gameLoop(){
		// get alive neighbours check if pixels hit border and change the states
		this.validatePixels();
		// Apply the new state to the cells
		for (let i = 0; i < this.pixels.length; i++) {
			this.pixels[i].state = this.pixels[i].nextState;
		}
		// clear screen
		this.context.clearRect(0, 0, this.width, this.height);
		// draw all pixels
		this.drawPixels();
		// start looping
		setTimeout( () => {
			window.requestAnimationFrame(() => this.gameLoop());
		}, this.fps) // show this in x frames per second
	}
}


let game = new GameOfLife(gamedata.canvas,gamedata.pixelSize, gamedata.deadColor, gamedata.aliveColor, gamedata.aliveRate, gamedata.fps, gamedata.border);
game.createPixel();
window.requestAnimationFrame(() => game.gameLoop());