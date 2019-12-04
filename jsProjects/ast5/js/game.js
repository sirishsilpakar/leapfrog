function Bird(){
  this.x = 80;
  this.y = 250;
  this.width = 30;
  this.height = 20;

  this.alive = true;
  this.gravity = 0.7;
  this.velocity = 0;
  this.lift = -15;

}

Bird.prototype.flap = function() {
  this.velocity += this.lift;
  this.update();
}

Bird.prototype.hitGround = function(y) {
  this.velocity = 0;
  this.y = y;
}

Bird.prototype.update = function(){
  this.velocity += this.gravity;
  this.velocity *= 0.9;
  this.y += this.velocity;
}

Bird.prototype.collisionWithPipe = function(height, pipe){
	if(this.y >= height || this.y + this.height <= 0){
		return true;
	}

		if(!(
			this.x > pipe.x + pipe.width ||
			this.x + this.width < pipe.x || 
			this.y > pipe.y + pipe.height ||
			this.y + this.height < pipe.y
			)){
			return true;
	  }
  
}

function Pipe(x, y, width, height) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 50;
  this.height= height || 50;
  this.speed = 3;

}

Pipe.prototype.update = function(){
	this.x -= this.speed;
}

Pipe.prototype.leftView = function(){
	return (this.x + this.width < 0);
}

Pipe.prototype.leftBird = false;

function Game() {
  this.pipes = [];
  this.bird;
  this.canvas = document.getElementById('flappy-bird-game');
  this.ctx = this.canvas.getContext('2d');
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.animation = true;

  this.spawnInterval = 90;
  this.interval = 0;

  this.checkBirdOverPipe = false;

  this.foregroundSpeed = 3;
  this.foregroundx = 0;
  this.score = 0;
  this.highScore = localStorage.getItem('highscore') || 0;

  this.state = {
    currentState: 0,
    startMenu: 0,
    gamePlay: 1,
    gameOver: 2
  }

  var that = this;

  this.startGamePlay = function() {
    this.state.currentState = this.state.gamePlay;

    game.start();
    game.update();
    game.display();
  }

  this.keyPressed = function(e) {
    if(e.key === ' ' && that.state.currentState === that.state.gamePlay){
      that.bird.flap();
    }
    else if (e.key === ' ' && that.state.currentState === that.state.startMenu) {
      that.startGamePlay();
    }
   }
  
  this.mouseClicked = function(e) {
    if(e.button === 0 && that.state.currentState === that.state.gamePlay) {
      that.bird.flap();
    }
    else if (e.button=== 0 && that.state.currentState === that.state.startMenu){
      that.startGamePlay();
    }
  } 
}

Game.prototype.startScreen = function() {

  this.addEvents();

  this.ctx.clearRect(0, 0, this.width, this.height);
 
  this.displayBackground();

  this.displayForegroundBase();

  this.ctx.drawImage(images.startScreen, this.width/4, this.height/4, this.width/2, this.height/2);

  this.ctx.fillStyle = 'white';
  this.ctx.font = 'bold 15px sans-serif'
	this.ctx.fillText('Press "SPACEBAR" or "Left-Mouse Button" to fly', this.width/9, this.height/6);
}

Game.prototype.start = function() {
  this.interval = 0;
  this.score = 0;
  this.pipes = [];
  this.bird = new Bird();
  this.animation = true;
}

Game.prototype.updateScore = function() {
  this.score+=0.5;
}

Game.prototype.gameOver = function() {
  this.state.currentState = this.state.gameOver;


}

Game.prototype.update = function() {
  this.foregroundx += this.foregroundSpeed;

  if(this.bird.alive){
    if(this.bird.y > this.height - images.base.height){
      this.bird.hitGround(this.height-images.base.height/2 - this.bird.height);
      this.animation = false;
    }
    else {
      this.bird.update();
    }
  }
  else {
    this.gameOver();
  }
  
  for(var i = 0; i < this.pipes.length; i++) {
    this.pipes[i].update();
    
    if (this.bird.collisionWithPipe(this.height, this.pipes[i])){
      this.animation = false;
      this.alive = false;
    }

    if (((this.pipes[i].x + this.pipes[i].width/2) < this.bird.x) && (!this.pipes[i].leftBird)){
      this.pipes[i].leftBird = true;
      this.updateScore();
    }

    if(this.pipes[i].leftView()){ 
      this.pipes.splice(i, 1);
      i--;
    }
  }

  if(this.interval === 0){
	
		var pipeHole = 120;
    var holePosition = Math.round(Math.random() * (this.height  - pipeHole - 100)) + 50;
  
		this.pipes.push(new Pipe(this.width, 0, 50,holePosition));
		this.pipes.push(new Pipe(this.width, holePosition+pipeHole, 50, this.height));
	}

	this.interval++;
	if(this.interval == this.spawnInterval){
		this.interval = 0;
	}

	var that = this;

  setTimeout(function(){
    that.update();
  }, 1000/FPS); 
  
}

Game.prototype.displayBackground = function() {
 
  var bgFill = this.ctx.createPattern(images.background, 'repeat');
  this.ctx.fillStyle = bgFill;
  this.ctx.fillRect(0, 0, this.width, this.height);
}

Game.prototype.displayForegroundPipes = function() {
  for(var i in this.pipes){
		if(i%2 == 0){
			this.ctx.drawImage(images.pipetop, this.pipes[i].x, this.pipes[i].y + this.pipes[i].height - images.pipetop.height, this.pipes[i].width, images.pipetop.height);
    } 
    else{
			this.ctx.drawImage(images.pipebottom, this.pipes[i].x, this.pipes[i].y, this.pipes[i].width, images.pipetop.height);
		}
  }
}

Game.prototype.displayForegroundBase = function() {
  for(var i = 0; i < Math.ceil(this.width/ images.base.width) + 1; i++) {
    this.ctx.drawImage(images.base, i * images.base.width - Math.floor(this.foregroundx % images.base.width), this.height - images.base.height/2);
  }
}

Game.prototype.displayForeground = function() {
  this.displayForegroundPipes();
  this.displayForegroundBase();
}

Game.prototype.display = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
 
  this.displayBackground();
  this.displayForeground();
  
  if(this.bird.alive){
    // this.ctx.save(); 
    // this.ctx.translate(this.bird.x + this.bird.width/2, this.bird.y + this.bird.height/2);
    // this.ctx.rotate(Math.PI/2 * this.gravity/2);
    this.ctx.drawImage(images.bird, this.bird.x, this.bird.y, this.bird.width, this.bird.height);
    // this.ctx.restore();
	}

  this.ctx.fillStyle = 'white';
  this.ctx.font = 'bold 45px sans-serif'
	this.ctx.fillText(this.score, this.width/2, this.height/5);


  if(!this.animation){ return;}

	var that = this;
	requestAnimationFrame(function(){
		that.display();
	});
}

Game.prototype.flapBird = function() {
  this.bird.flap();
}

Game.prototype.addEvents = function() {
  document.addEventListener('keydown', this.keyPressed);
  document.addEventListener('mousedown', this.mouseClicked);
}


var game; 
var FPS = 60;
var images = {};

var loadImages = function(sources, callback) {
  var numberOfImages = 0;
  var loaded = 0;
  var imgs = {};
  for(var i in sources) {
    numberOfImages++;
		imgs[i] = new Image();
		imgs[i].src = sources[i];
		imgs[i].onload = function(){
			loaded++;
			if(loaded == numberOfImages){
				callback(imgs);
			}
		}
  }
}

window.onload = function() {
  var sprites = {
    bird: './assets/images/yellowbird-midflap.png',
    background: './assets/images/background.png',
    pipetop: './assets/images/pipetop.png',
    pipebottom: './assets/images/pipebottom.png',
    base: './assets/images/base.png',
    startScreen: './assets/images/message.png',
    gameOver: './assets/images/gameover.png'
  }

  var start = function() {
    game = new Game();
    game.startScreen();
  }

  loadImages(sprites, function(imgs) {
    images = imgs;
    start();
  });
}
