const IMG_WIDTH=800;
const IMG_HEIGHT=400;
const NUMBER_OF_IMG=4;

var imageIndex = 1;
var slideShow;


window.addEventListener("load",function() {
  imageIndex=0;
  startSlide();
});

function startSlide() {
  slideShow = setInterval(function(){
    showSlide(imageIndex);
  }, 2000);
}

function previousSlide(){
  clearInterval(slideShow);
  imageIndex-=2;
  showSlide(imageIndex);
  startSlide();
}

function nextSlide(){
  clearInterval(slideShow);
  // imageIndex+=1;
  showSlide(imageIndex);
  startSlide();
}


function showSlideIndex(index) {
  clearInterval(slideShow);
  showSlide(index);
  startSlide();
}

function showSlide(index) {
  
  var carouselImageWrapper = document.getElementById("carousel-image-wrapper");
  var indicatorDots = document.getElementsByClassName('dot');
  //var imageSlideSpeed=0.1;

  imageIndex = index;
  if(imageIndex >= NUMBER_OF_IMG) {
    imageIndex=0;
  }
  if(imageIndex < 0) {
    imageIndex = NUMBER_OF_IMG -1;
  }
  carouselImageWrapper.style.left = '-' + (imageIndex*IMG_WIDTH) + 'px';
  imageIndex +=1;
  
  for(var i = 0 ; i < indicatorDots.length; i++) {
    indicatorDots[i].className =  indicatorDots[i].className.replace(' active', '');
  }
  indicatorDots[imageIndex-1].className += ' active';
}

