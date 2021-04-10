// Srazy doljen skazat', 4to v zadanii ne bilo skazano, doljna bit' polnaya sovmestimost' tol'ko s ipadom ili net, poetomy ya vospolzovalsya y4ebnikom po JS, 4to bi otmenit' vse deistviya, krome nazhatiya. 
// Otmena prokrytki stranici & nastroyka prokrytki slaidov:
// -------------------------------------------------------------------------------
// Peremennaya poz. nazhatiya
let ts;

// Nomer tekushego slaida
let currSlide = 1;

// Object s kodami klavish prokrytki
let keys = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 34: 1, 33: 1, 35: 1, 36: 1};


// Universal'naya functsiya otmeni deystviya po default'y
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

// Proverka nazhatiya klavish
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// Proverka nazhatiya na kolesiko i ee otmena
function preventDefaultForMidMouse(e){
	if(e.which === 2){
		preventDefault(e);
		return false;
	}
}

// Obrabotka scroll'a na mobilkah/planshetah:

// Scroll do nyjnoy sekcii
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth'
  });
}

// Obrabotka na4ala nazhatiya
function touchStartHandler(e){
	if(e.target == document.getElementById('slider_handle')){ // novoe
		ts = NaN;
	}else{
		preventDefault(e);
		ts = e.touches[0].clientY;
	}
}

// Obrabotka okonchaniya nazhatiya
function touchEndHandler(e){
  let te = e.changedTouches[0].clientY;
  if(ts > te+5){
    goToNextSlide();
  }else if(ts < te-5){
    goToPrevSlide();
  }
}

function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction izmenyaetsya ot 0 do 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    let progress = timing(timeFraction);

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}

// Anicmaciya "parallax" effecta pri pereklu4enii slaidov
// P.S. v dushe ya Meksikanec, poetomy elemnti tak nazvani
function parallaxForNextSlideElems(el_id, duration_main, el_start_pos, koef){
  document.getElementById(el_id).style.transform = 'translateY('+ el_start_pos +'%)';

  let curr_pos = el_start_pos;

  animate({
    duration: duration_main,
    timing(timeFraction) {
      return timeFraction;
    },
    draw(progress) {
      document.getElementById(el_id).style.transform = 'translateY(' + (+curr_pos - (progress * koef)) + '%)';
    }
  });
}

// Perehod na next slaid
function goToNextSlide(){
  switch(currSlide){
    case 1:
      scrollToSection('second');
      nextNavPage();
      parallaxForNextSlideElems('ice_1', 500, 500, 500);
      parallaxForNextSlideElems('ice_2', 500, 800, 800);
      parallaxForNextSlideElems('ice_3', 500, 200, 200);
      parallaxForNextSlideElems('ice_4', 500, 300, 350);
      
      break;
    case 2:
      // novoe:
      nextNavPage();
      let height_of_window = document.getElementById('first').offsetHeight;
      window.scrollTo({ top: height_of_window * 2, behavior: 'smooth' });

      fade(document.getElementById('section_1_bottom_fade')); //novoe
      break;
  }

  if(currSlide < 3){
    currSlide++;
  }
}

// Perehod na pred. slaid
function goToPrevSlide(){
  switch(currSlide){
    case 2:
      scrollToSection('first');
      prevNavPage();
      break;
    case 3:
      scrollToSection('second');
      prevNavPage();
      parallaxForNextSlideElems('ice_1', 500, -800, -800);
      parallaxForNextSlideElems('ice_2', 500, -800, -800);
      parallaxForNextSlideElems('ice_3', 500, -200, -200);
      parallaxForNextSlideElems('ice_4', 500, -300, -350);

      unfade(document.getElementById('section_1_bottom_fade')); // novoe


      break;
  }
  

  if(currSlide > 1){
    currSlide--;
  }
}

if (window.addEventListener) 
	window.addEventListener('DOMMouseScroll', preventDefault, false);

window.addEventListener('wheel', preventDefault, {passive: false}); // 21 vek
window.addEventListener('mousewheel', preventDefault, {passive: false}); // 20 vek, tipa dlya IE
document.addEventListener('mousewheel', preventDefault, {passive: false}); // toje 20 vek, IE

window.addEventListener('touchstart', touchStartHandler, {passive: false}); // mobilki (nachalo nazhatiya)
window.addEventListener('touchend', touchEndHandler, {passive: false}); // mobilki (konec nazhatiya)

document.onkeydown = preventDefaultForScrollKeys; // dlya klavish
document.addEventListener('mousedown', preventDefaultForMidMouse); // dlya kolesika

// -----------------------------------------------------------------------------

// novoe:-----------------------------------------------------------------------

// Pryachem element
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}

// Pokazivaem elemetn
function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function nextNavPage(){
	if((document.querySelectorAll('.active_page')[0]).id == 'nav_1'){
		fade(document.querySelectorAll('.active_page')[0]);
		(document.querySelectorAll('.active_page')[0]).classList.remove("active_page");
		unfade(document.getElementById('nav_2'));
		document.getElementById('nav_2').classList.add("active_page");
	}else{
		fade(document.querySelectorAll('.active_page')[0]);
		(document.querySelectorAll('.active_page')[0]).classList.remove("active_page");
		unfade(document.getElementById('nav_3'));
		document.getElementById('nav_3').classList.add("active_page");
	}
	
}
function prevNavPage(){
	if((document.querySelectorAll('.active_page')[0]).id == 'nav_3'){
		fade(document.querySelectorAll('.active_page')[0]);
		(document.querySelectorAll('.active_page')[0]).classList.remove("active_page");
		unfade(document.getElementById('nav_2'));
		document.getElementById('nav_2').classList.add("active_page");
	}else{
		fade(document.querySelectorAll('.active_page')[0]);
		(document.querySelectorAll('.active_page')[0]).classList.remove("active_page");
		unfade(document.getElementById('nav_1'));
		document.getElementById('nav_1').classList.add("active_page");
	}
	
}
// konec 