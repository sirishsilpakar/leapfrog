function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function Box(parentElement) {
  this.x = 10;
  this.y = 10;
  this.dx = 5;
  this.dy = -5;
  this.width = 50;
  this.height = 50;
  this.element = null;
  this.parentElement = parentElement;
  
  this.init = function() {
    var box = document.createElement('div');
    box.style.height = this.height + 'px';
    box.style.width = this.width + 'px';
    box.classList.add('box');
    this.parentElement.appendChild(box);
    this.element = box;
    this.element.onclick = this.boxClicked.bind(this);
    this.antGameInit();
    this.draw();

    return this;
  }

  this.antGameInit = function() {
    this.element.style.backgroundImage = 'url("./images/ant.gif")';
    this.element.style.backgroundSize = 'contain';
    this.element.style.backgroundRepeat = 'no-repeat';
    this.element.style.backgroundPosition = 'center center';
    this.element.style.backgroundColor = 'transparent';
  }

  this.setPosition = function(x, y) {
    this.x = x ;
    this.y = y ;
  }

  this.checkPosition = function(boxes) {
    for (var i = 0; i < boxes.length ; i++) {
      if (this.x < boxes[i].x + boxes[i].width &&
        this.x + this.width > boxes[i].x &&
        this.y < boxes[i].y + boxes[i].height &&
        this.y + this.height > boxes[i].y) {
          return true;
      }
    }
    return false;
  }

  this.setSize = function (size) {
    this.width = size;
    this.height = size;
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
  }

  this.setSpeed = function (speedx, speedy) {
   this.dx = speedx;
   this.dy = speedy;
  }

  this.boxClicked = function () {
    this.element.style.display ='none';
    this.parentElement.removeChild(this.element);
  }

  this.draw = function () {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
  
  this.move = function() {
    this.x +=this.dx;
    this.y +=this.dy;
    this.draw();
  }

  this.checkCollisionWithWall = function(maxWidth, maxHeight){
    if(((this.x + this.dx) > (maxWidth - this.width)) || (this.x + this.dx  < 0)) {
      this.dx = -this.dx;
    }
    if(((this.y + this.dy )> (maxHeight- this.height)) ||( this.y + this.dy < 0)) {
        this.dy = -this.dy;
   }
  }

  this.checkCollisionWithBox = function(box) {
      if ((this.x) < (box.x + box.width) &&
        (this.x + this.width) > (box.x) &&
        (this.y) < (box.y + box.height) &&
        (this.y + this.height) > (box.y)) {
          
         this.dy = -this.dy;
         this.dx = -this.dx;
         box.dy = -box.dy;
         box.dx = -box.dx;   
    }
  }
}

function Game(parentElement, boxCount, maxWidth, maxHeight) {
  var boxes = [];
  var containerWidth = maxWidth || 800;
  var containerHeight = maxHeight || 500;
  var maxBoxSize = 50;
  var minBoxSize = 10;
  var gameStatus;
  this.parentElement = parentElement;
  this.boxCount = boxCount || 10;

  if(this.boxCount > 100) {
    maxBoxSize = 10;
    minBoxSize = 1;
  } 

  this.setContainerSize = function() {
    this.parentElement.style.width = containerWidth + 'px';
    this.parentElement.style.height = containerHeight + 'px';
  }

  this.startGame = function() {
    this.setContainerSize();
    for(var i = 0; i < this.boxCount; i++) {
      var box = new Box(parentElement).init();
      box.setPosition(
        getRandomArbitrary(0, containerWidth - box.width),
        getRandomArbitrary(0, containerHeight - box.height)
      )
      box.setSize(
        getRandomArbitrary(minBoxSize,maxBoxSize)
      );
      if(box.checkPosition(boxes)) {
        box.setPosition(
          getRandomArbitrary(0, containerWidth - box.width),
          getRandomArbitrary(0, containerHeight - box.height)
        )
      }
      box.setSpeed(
        getRandomArbitrary(1, 15),
        getRandomArbitrary(1, 15)
      );
     
      boxes.push(box);
      box.draw();
    }
    gameStatus = setInterval(this.moveBoxes.bind(this), 100);
  }

  this.boxDestroyedCheck = function(box) {
    if (box.element.style.display == 'none') {
      var indexofBox = boxes.indexOf(box);
      boxes.splice(indexofBox, 1);
    }
  }
  
  this.moveBoxes = function() {
    for(var i = 0; i < boxes.length; i++) {
      this.boxDestroyedCheck(boxes[i]);
      boxes[i].checkCollisionWithWall(containerWidth, containerHeight)
      for(var j = 0 ; j < boxes.length ; j++ ) {
        boxes[i].checkCollisionWithBox(boxes[j]);
      }
      boxes[i].move();
    }
  }
}

var parentElement = document.getElementById('app');
new Game(parentElement,15).startGame();
