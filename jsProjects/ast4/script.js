function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function GameObject(parentElement) {
  this.x = 0;
  this.y = 0;
  this.dx = 5;
  this.dy = 0;
  this.width = 50;
  this.height = 50;
  this.lanePosition = 0; // 0 for center lane, -1 for left lane, 1 for right lane;
  this.element = null;
  this.parentElement = parentElement;
  this.images = {};
  
  this.init = function() {
    var gameElement = document.createElement('div');
    gameElement.style.height = this.height + 'px';
    gameElement.style.width = this.width + 'px';
    gameElement.style.position = 'absolute';
    gameElement.classList.add('game-element');
    this.parentElement.appendChild(gameElement);
    this.element = gameElement;

    this.draw();
    this.loadImage();
    return this;
  }
  
  this.loadImage = function() {
    var sources = {
      astonMartin: './images/aston-martin-one.png',
      policeCar: './images/police-car.png',
      blackCar: './images/black-car.png',
      fordMustang: './images/ford-mustang.png',
      redCar: './images/red-top-car.png',
      ammoBox: './images/ammu-box.png',
      bullet: './images/laser-bullet.png',
      roadBg: './images/road_bg.png'
    }

    loadImages = function(sources, callback) {
      var numberOfImages = 0;
      var loaded = 0;
      var imgs = {};
      for(var i in sources) {
        numberOfImages++;
        imgs[i] = new Image();
        imgs[i].src = sources[i];
        imgs[i].onload = function() {
          loaded++;
          if(loaded === numberOfImages){
            callback(imgs);
          }
        }
      }
    }

    loadImages(sources, function(imgs){
      this.images = imgs;
    });
  }

  this.playerCarInit = function() {
    this.element.style.backgroundImage = 'url("./images/police-car.png")';
    this.element.classList.add('player-car');
    this.element.style.backgroundSize = 'cover';
    this.element.style.backgroundRepeat = 'no-repeat';
    this.element.style.backgroundPosition = 'center center';
    this.element.style.backgroundColor = 'transparent';
  }

  this.enemyCarInit = function() {
    var enemyCarImages = ['aston-martin-one.png', 'black-car.png', 'ford-mustang.png', 'red-top-car.png']
    this.element.style.backgroundImage = 'url("./images/'+enemyCarImages[parseInt(getRandomNumber(-1,enemyCarImages.length-1))] + '")';
    this.element.classList.add('enemy-car');
    this.element.style.backgroundSize = 'cover';
    this.element.style.backgroundRepeat = 'no-repeat';
    this.element.style.backgroundPosition = 'center center';
    this.element.style.backgroundColor = 'transparent';
  }

  this.ammoBoxInit = function() {
    this.element.style.backgroundImage = 'url("./images/ammu-box.png")';
    this.element.classList.add('ammo-box');
    this.element.style.backgroundSize = 'cover';
    this.element.style.backgroundRepeat = 'no-repeat';
    this.element.style.backgroundPosition = 'center center';
    this.element.style.backgroundColor = 'transparent';
  }

  this.ammoInit = function() {
    this.element.style.backgroundImage = 'url("./images/laser-bullet.png")';
    this.element.classList.add('ammo');
    this.element.style.backgroundSize = 'cover';
    this.element.style.backgroundRepeat = 'no-repeat';
    this.element.style.backgroundPosition = 'center center';
    this.element.style.backgroundColor = 'transparent';
  }

  this.setPositionXY = function(x, y) {
    this.x = x ;
    this.y = y ;
  }

  this.checkPositionXY = function(cars) {
    if(this.lanePosition === -1) {
      if(Math.abs(this.y - cars[this.lanePosition + 1].y) < this.height * 1.25 ){
        return true;
      }
    }
    else if (this.lanePosition === 0) {
      if((Math.abs(this.y - cars[this.lanePosition - 1].y) < this.height * 1.25 ) 
          && (Math.abs(this.y - cars[this.lanePosition+1]) < this.height * 1.25) ){
        return true;
      }
    }
    else if (this.lanePosition === 1) {
      if((Math.abs(this.y - cars[this.lanePosition-1].y)) < this.height * 1.25){
        return true;
      }
    }

    return false;
  }

  this.checkPosition = function(cars) {
    for(var i = 0; i < cars.length; i++) {
      if(this.checkCollisionWithCar(cars[i])){
        return true;
      }
    }
    return false;
  }

  this.setSize = function (width, height) {
    this.width = width;
    this.height = height;
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
  }

  this.setSpeed = function (speedx, speedy) {
   this.dx = speedx;
   this.dy = speedy;
  }

  this.changePositionXY = function(x, y) {
    this.x = this.x + x;
    this.y = this.y + y;
  }

  this.draw = function () {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
  
  this.move = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }

  this.removeCar = function() {
    this.element.parentElement.removeChild(this.element);
  }

  this.checkCollisionWithCar = function(car) {
    if ((this.x) < (car.x + car.width) &&
        (this.x + this.width) > (car.x) &&
        (this.y) < (car.y + car.height) &&
        (this.y + this.height) > (car.y)) {
        return true;
    }
    return false;
  }
}

function Game(parentElement, maxWidth, maxHeight) {
  var enemyCars = [];
  var ammoBoxes = [];
  var ammos = [];
  var containerWidth = maxWidth || 600;
  var containerHeight = maxHeight || 800;
  var roadElement = null;
  var playerCar = null;
  var ammoElement = null;
  var playerAmmo = 0;
  var gameSpeed = 0;
  var carSpeed = 0;
  var gameRun;
  var that = this;
  var refreshRate = 30;
  var highestScore = localStorage.getItem('highestscore') || 0;
  this.gameState = true;
  this.gameScore = 0;
  this.scoreBoardElement = null;
  this.ammuElement = null;
  this.parentElement = parentElement;

  this.init = function() {
    this.parentElement.style.background = 'aliceblue';
    this.parentElement.style.textAlign = 'center';
    this.setContainerSize();
    this.initRoad();
  }

  this.startScreenInit = function() {
    var startMenu = document.createElement('div');
    startMenu.classList.add('start-menu');
    this.parentElement.appendChild(startMenu);

    var gameTitle = document.createElement('h1');
    gameTitle.classList.add('game-title');
    startMenu.appendChild(gameTitle);

    var gameControlInfo = document.createElement('span');
    gameControlInfo.classList.add('game-controls-info');
    startMenu.appendChild(gameControlInfo);

    var playBtn = document.createElement('span');
    playBtn.classList.add('start-btn');
    startMenu.appendChild(playBtn);

    var score = document.createElement('span');
    score.classList.add('highest-score');
    startMenu.appendChild(score);

    startMenu.style.position = 'absolute';
    startMenu.style.top = '35%';
    startMenu.style.width = '100%';
    startMenu.style.lineHeight = '3em';
    startMenu.style.backgroundColor = 'rgba(247, 136, 136, 0.8)';
    
    gameTitle.innerHTML = 'Car Lane Game';

    gameControlInfo.innerHTML = '<p>Press "Left Arrow / A" and "Right Arrow / D" to move the car<p><p>Press "Up Arrow / Spacebar to shoot"</p>';
    gameControlInfo.style.display = 'inline-block';
    gameControlInfo.style.color = 'white';

    playBtn.innerHTML = 'PLAY NOW!';
    playBtn.style.display = 'inline-block';
    playBtn.style.padding = '10px';
    playBtn.style.backgroundColor = 'rgba(71, 122, 107,1)';
    playBtn.style.fontWeight = 'bold';
    playBtn.style.color = 'white';
    playBtn.style.borderRadius = '5px';
    playBtn.style.cursor = 'pointer';

    score.style.display = 'block';
    score.style.fontWeight = 'bold';

    score.innerHTML = 'Highest Score:  ' + highestScore;

    playBtn.onclick = function () {
      that.parentElement.removeChild(startMenu);
      that.startGame();
    };
  }

  this.startScreen = function() {
    this.init();
    this.startScreenInit();
  }

  this.scoreBoardInit = function() {
    var scoreBoard = document.createElement('div');
    scoreBoard.classList.add('score-board');
    this.parentElement.appendChild(scoreBoard);

    scoreBoard.style.position = 'absolute';
    scoreBoard.style.width = '100%';
    scoreBoard.style.lineHeight = '2em';
    scoreBoard.style.backgroundColor = 'rgba(247, 136, 136, 0.8)';
    scoreBoard.style.padding = '10px 0px';

    var score = document.createElement('span');
    scoreBoard.appendChild(score);
    score.style.fontWeight = 'bold';
    score.style.color = 'white';
    this.gameScore = 0;
    score.innerHTML = 'Your Score: ' + this.gameScore;

    this.scoreBoardElement = score;

    var ammunition = document.createElement('span');
    scoreBoard.appendChild(ammunition);
    ammunition.style.display = 'block';
    ammunition.style.color = 'white';
    ammunition.innerHTML ='Ammo Left: ' + playerAmmo;
    
    this.ammuElement = ammunition;
  }

  this.setContainerSize = function() {
    this.parentElement.style.width = containerWidth + 'px';
    this.parentElement.style.height = containerHeight + 'px';
    this.parentElement.style.margin = '0 auto';
    this.parentElement.style.position = 'relative';
  }

  this.initRoad = function() {
    var road = document.createElement('div');
    this.parentElement.appendChild(road);
    road.classList.add('road');
    road.style.height = '100' + '%';
    road.style.width = '100' + '%';
    road.style.backgroundImage = 'url("./images/road_bg.png")';
    road.style.backgroundPosition = 'center center';
    road.style.backgroundRepeat = 'repeat-y';
    road.style.backgroundSize = 'contain';
    road.style.position = 'absolute';
    road.style.backgroundColor = '#438200';
    roadElement = road;
  }
  
  this.initPlayerCar = function() {
    var car = new GameObject(this.parentElement).init();
    car.setPositionXY(containerWidth / 1.75 - car.width, containerHeight - car.height * 2.5); //formula what to center car no matter what? container width / container height
                                                                                          /// number of lanes affect it?
    car.setSize(50, 120);
    car.setSpeed(0, 0);
    car.playerCarInit();
    car.draw();
    playerCar = car;
  }

  this.initEnemyCar = function() {
    var enemyCar = new GameObject(parentElement).init();
    enemyCar.lanePosition = parseInt(getRandomNumber(-2,2));
    // enemyCar.setPositionXY((containerWidth / 1.75 - enemyCar.width) + (enemyCar.lanePosition * (containerWidth / 3)), 
    //                           getRandomNumber(-playerCar.height * 1.5, -playerCar.height * 6));
    enemyCar.setPositionXY((containerWidth / 1.75 - enemyCar.width) + (enemyCar.lanePosition * (containerWidth / 3)), 
                            -enemyCar.height);
    enemyCar.setSize(50, 120);
    enemyCar.enemyCarInit();
    enemyCar.setSpeed(0, carSpeed);
    // if(enemyCar.checkPosition(enemyCars)) {
    //   enemyCar.setPositionXY(
    //     (containerWidth / 1.75 - enemyCar.width) + (enemyCar.lanePosition * (containerWidth / 3)), 
    //     getRandomNumber(-playerCar.height * 1.5, -playerCar.height * 6))
    // }
    enemyCars.push(enemyCar);    
  }

  this.fireAmmo = function() {
    var ammo = new GameObject(parentElement).init();
    ammo.lanePosition = playerCar.lanePosition;
    ammo.setPositionXY(playerCar.x, playerCar.y + 15);
    ammo.setSize(50, 50);
    ammo.ammoInit();this.ammuElement.innerHTML = 'Ammo Left: ' + playerAmmo;
    ammo.setSpeed(0, -carSpeed*2);
    // if(enemyCar.checkPosition(enemyCars)) {
    //   enemyCar.setPositionXY(
    //     (containerWidth / 1.75 - enemyCar.width) + (enemyCar.lanePosition * (containerWidth / 3)), 
    //     getRandomNumber(-playerCar.height * 1.5, -playerCar.height * 6))
    // }
    ammos.push(ammo);  
    ammo.move(); 
    playerAmmo--;
    this.ammuElement.innerHTML = 'Ammo Left: ' + playerAmmo;
  }

  this.initAmmoBox = function() {
    var ammoBox = new GameObject(parentElement).init();
    ammoBox.lanePosition = parseInt(getRandomNumber(-2,2));
    // ammoBox.setPositionXY((containerWidth / 1.75 - ammoBox.width) + (ammoBox.lanePosition * (containerWidth / 3)), 
    //                           getRandomNumber(-playerCar.height * 1.5, -playerCar.height * 6));
    ammoBox.setPositionXY((containerWidth / 1.75 - ammoBox.width) + (ammoBox.lanePosition * (containerWidth / 3)), 
                            ammoBox.height);
    ammoBox.setSize(50, 50);
    ammoBox.ammoBoxInit();
    ammoBox.setSpeed(0, carSpeed);
    // if(ammoBox.checkPosition(enemyCars)) {
    //   ammoBox.setPositionXY(
    //     (containerWidth / 1.75 - ammoBox.width) + (ammoBox.lanePosition * (containerWidth / 3)), 
    //     getRandomNumber(-playerCar.height * 1.5, -playerCar.height * 6))
    // }
    ammoBoxes.push(ammoBox);    
  }

  this.leftKeyPressed = function() {
    if ((playerCar.lanePosition === 0 || playerCar.lanePosition === 1) && this.gameState === true){
      playerCar.changePositionXY(-containerWidth/3, 0);
      playerCar.lanePosition--;
      playerCar.draw();
    }
  }

  this.rightKeyPressed = function() {
    if ((playerCar.lanePosition === 0 || playerCar.lanePosition === -1) && this.gameState === true){
      playerCar.changePositionXY(containerWidth/3, 0);
      playerCar.lanePosition++;
      playerCar.draw();
    }
  }

  this.upKeyPressed = function() {
    if(playerAmmo > 0) {
      this.fireAmmo();
    }
  }
  this.keyPressed = function(e) {
    console.log(e.key);

    switch(e.key) {
      case 'a':
      case 'ArrowLeft':
        that.leftKeyPressed();
        break;
      case 'd':
      case 'ArrowRight':
        that.rightKeyPressed();
        break;
      case 'ArrowUp':
      case ' ':
        that.upKeyPressed();
    }
  }

  this.addEvents = function() {
    document.addEventListener('keydown', this.keyPressed);
  }

  this.removeEvents = function() {
    document.removeEventListener('keydown', this.keyPressed);
  }

  this.checkCollisionWithEnemyCar = function() {
    for(var i = 0; i < enemyCars.length; i++) {
      if(playerCar.checkCollisionWithCar(enemyCars[i])){
        this.gameOver();
      }
      
      enemyCars[i].setSpeed(0, carSpeed);
      enemyCars[i].move();
      
      if(enemyCars[i].y + enemyCars[i].height / 1.5 > containerHeight){
        this.removeOpponentCar(enemyCars[i]);
        this.updateScore();
      }
   }
  }

  this.checkCollisionWithAmmoBox = function() {
    for(var i = 0; i < ammoBoxes.length; i++) {
      if(playerCar.checkCollisionWithCar(ammoBoxes[i])){
        playerAmmo+=2 ;
        this.ammuElement.innerHTML = 'Ammo Left: ' + playerAmmo;
        this.removeAmmoBox(ammoBoxes[i]);
        continue;
      }
      
      ammoBoxes[i].setSpeed(0, carSpeed);
      ammoBoxes[i].move();
      
      if(ammoBoxes[i].y + ammoBoxes[i].height / 1.5 > containerHeight){
        this.removeAmmoBox(ammoBoxes[i]);
      }
   }
  }

  this.checkHitWithAmmo = function() {
    for(var i = 0; i < enemyCars.length; i++) {
      if(ammoElement.checkCollisionWithCar(enemyCars[i])) {
        this.removeOpponentCar(enemyCars[i]);
        this.removeAmmo(ammoElement);
        this.updateScore();
      }
    }

  }

  this.moveAmmo = function() {
    if(ammos.length >0) {
      for(var i = 0; i < ammos.length; i++) {
        ammoElement = ammos[i];
        ammos[i].setSpeed(0, -carSpeed*2);
        ammos[i].move();
        this.checkHitWithAmmo();
      }
    }
  }

  this.moveCars = function() {
    gameSpeed += 15; 
    roadElement.style.backgroundPositionY = (gameSpeed % (containerHeight)) + 'px';
    
    if(gameSpeed > this.refreshRate*10) {
      carSpeed = 0;
      gameSpeed -= 15;
    }
    else if(gameSpeed % containerHeight/3 === 0 || enemyCars.length < 2) {
      this.initEnemyCar();
    }
    else if(gameSpeed % containerHeight/5 === 0 || ammoBoxes.length < 1){
      this.initAmmoBox();
    }
    carSpeed+=0.025;

    this.checkCollisionWithEnemyCar();
    this.checkCollisionWithAmmoBox();
    this.moveAmmo();
  }

  this.updateScore = function() {
    this.gameScore++;
    this.scoreBoardElement.innerHTML = 'Your Score: ' + this.gameScore;
  }

  this.removeOpponentCar = function(enemyCar) {
    enemyCars.splice(enemyCars.indexOf(enemyCar), 1);
    enemyCar.removeCar();
  }

  this.removeAmmo = function(ammu) {
    ammos.splice(ammos.indexOf(ammu), 1);
    ammu.removeCar();
  }

  this.removeAmmoBox = function(ammoBox) {
    ammoBoxes.splice(ammoBoxes.indexOf(ammoBox), 1);
    ammoBox.removeCar();
  }

  this.endScreenInit = function() {
    var endMenu = document.createElement('div');
    endMenu.classList.add('end-menu');
    this.parentElement.appendChild(endMenu);

    var over = document.createElement('span');
    over.classList.add('game-over');
    endMenu.appendChild(over);

    var yourScore = document.createElement('span');
    yourScore.classList.add('end-your-score');
    endMenu.appendChild(yourScore);

    var highScore = document.createElement('span');
    highScore.classList.add('end-high-score');
    endMenu.appendChild(highScore);

    var restartBtn = document.createElement('span');
    restartBtn.classList.add('restart-btn');
    endMenu.appendChild(restartBtn);

    endMenu.style.position = 'absolute';
    endMenu.style.top = '35%';
    endMenu.style.width = '100%';
    endMenu.style.lineHeight = '3em';
    endMenu.style.backgroundColor = 'rgba(247, 136, 136, 0.8)';

    over.innerHTML = 'Game Over!!!'
    over.style.display = 'block';
    over.style.fontWeight = 'bold';
    over.style.textTransform = 'uppercase';

    yourScore.style.display = 'block';
    yourScore.style.fontWeight = 'bold';
    yourScore.style.color = 'white';
    yourScore.innerHTML = 'Your Score:   ' + this.gameScore;
    

    highScore.style.display = 'block';
    
    highScore.style.color = 'white';

   
    if((highestScore < this.gameScore)){
      localStorage.setItem('highestscore', this.gameScore);
    }
    highestScore = localStorage.getItem('highestscore');
    highScore.innerHTML = 'Highest Score:  ' + highestScore;

    restartBtn.innerHTML = 'RESTART GAME!';
    restartBtn.style.display = 'inline-block';
    restartBtn.style.padding = '10px';
    restartBtn.style.backgroundColor = 'rgba(71, 122, 107,1)';
    restartBtn.style.fontWeight = 'bold';
    restartBtn.style.color = 'white';
    restartBtn.style.borderRadius = '5px';
    restartBtn.style.cursor = 'pointer';

    restartBtn.onclick = function () {
      that.parentElement.removeChild(endMenu);
      that.resetVariables();
      that.removeEvents();
      that.init();
      that.startGame();
    };
  }

  this.endScreen = function() {
    this.endScreenInit();
  }

  this.resetVariables = function() {
    if(!this.gameState) {
      enemyCars = [];
      ammoBoxes = [];
      ammos = [];
      playerAmmo = 0;
      containerWidth = maxWidth || 600;
      containerHeight = maxHeight || 800;
      roadElement = null;
      playerCar = null;
      gameSpeed = 0;
      carSpeed = 0;
      this.gameScore = 0;
      this.scoreBoardElement = null;
    }
    this.gameState = true;
  }

  this.gameOver = function() {
    this.gameState = false;
    clearInterval(gameRun);
    this.endScreen();
  }

  this.startGame = function() {
    this.scoreBoardInit();
    this.initPlayerCar();
    this.initEnemyCar(); 
    this.addEvents(); 
    gameRun = setInterval(this.runGame.bind(this), 1000/refreshRate);
  }
  
  this.runGame = function() {
    this.moveCars();    
  }
}

var parentElement = document.getElementById('car-game');
new Game(parentElement).startScreen();
