// В задании было сказано, что нужна поддержка только desktop chrome в режиме совместимости с ipad, так что все остальные события здесь отменены

// Отмена прокрутки страницы и настройка прокрутки слайдов:

// Переменная позиции нажатия
let touch_start;

// Номер текущего слайда
let curr_slide = 1;

// Обьект с кодами клавиш прокрутки
let keys = { 37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 34: 1, 33: 1, 35: 1, 36: 1 };


// Универсальная функция отмены действия 
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
    e.preventDefault();
  e.returnValue = false;
}

// Проверка нажатия клавиш
function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// Проверка нажатия на колесико и ее отмена
function preventDefaultForMidMouse(e) {
  if (e.which === 2) {
    preventDefault(e);
    return false;
  }
}

// Обработка скролла на мобилках/планшетах:

// Скролл до нужной секции
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth'
  });
}

// Обработка начала нажатия
function touchStartHandler(e) {
  if (e.target == document.getElementById('slider_handle')) {
    touch_start = NaN;
  } else {
    preventDefault(e);
    touch_start = e.touches[0].clientY;
  }
}

// Обработка окончания нажатия
function touchEndHandler(e) {
  let touch_end = e.changedTouches[0].clientY;
  if (touch_start > touch_end + 5) {
    goToNextSlide();
  } else if (touch_start < touch_end - 5) {
    goToPrevSlide();
  }
}

function animate({ timing, draw, duration }) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {

    // time_fraction изменяется от 0 до 1
    let time_fraction = (time - start) / duration;
    if (time_fraction > 1) time_fraction = 1;

    let progress = timing(time_fraction);

    draw(progress);

    if (time_fraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

// Анимация параллакс эффекта при переключении слайдов
function parallaxForNextSlideElems(el_id, duration_main, el_start_pos, koef) {
  document.getElementById(el_id).style.transform = 'translateY(' + el_start_pos + '%)';

  let curr_pos = el_start_pos;

  animate({
    duration: duration_main,
    timing(time_fraction) {
      return time_fraction;
    },
    draw(progress) {
      let current_progress = curr_pos - (progress * koef);
      document.getElementById(el_id).style.transform = 'translateY(' + current_progress + '%)';
    }
  });
}

// Переход на следующий слайд
function goToNextSlide() {
  switch (curr_slide) {
    case 1:
      scrollToSection('second');
      nextNavPage();
      parallaxForNextSlideElems('ice_1', 500, 500, 500);
      parallaxForNextSlideElems('ice_2', 500, 800, 800);
      parallaxForNextSlideElems('ice_3', 500, 200, 200);
      parallaxForNextSlideElems('ice_4', 500, 300, 350);

      break;
    case 2:
      nextNavPage();
      let height_of_window = document.getElementById('first').offsetHeight;
      window.scrollTo({ top: height_of_window * 2, behavior: 'smooth' });

      fade(document.getElementById('section_1_bottom_fade'));
      break;
  }

  if (curr_slide < 3) {
    curr_slide++;
  }
}

// Переход на предыдущий слайд
function goToPrevSlide() {
  switch (curr_slide) {
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

      unfade(document.getElementById('section_1_bottom_fade'));
      break;
  }

  if (curr_slide > 1) {
    curr_slide--;
  }
}


// Прячем элемент
function fade(element) {
  var initial_opacity = 1;  
  var timer = setInterval(function () {
    if (initial_opacity <= 0.1) {
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = initial_opacity;
    element.style.filter = 'alpha(opacity=' + initial_opacity * 100 + ")";
    initial_opacity -= initial_opacity * 0.1;
  }, 10);
}

// Показываем элемент
function unfade(element) {
  var initial_opacity = 0.1;  
  element.style.display = 'block';
  var timer = setInterval(function () {
    if (initial_opacity >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = initial_opacity;
    element.style.filter = 'alpha(opacity=' + initial_opacity * 100 + ")";
    initial_opacity += initial_opacity * 0.1;
  }, 10);
}

// Переход на следующую страницу
function nextNavPage() {
  let nav_mark_2 = document.getElementById('nav_2');

  if ((document.querySelectorAll('.active_page')[0]).id == 'nav_1') {
    fade(document.querySelectorAll('.active_page')[0]);
    (document.querySelectorAll('.active_page')[0]).classList.remove("active_page");
    unfade(nav_mark_2);
    nav_mark_2.classList.add("active_page");
  } else {
    let nav_mark_3 = document.getElementById('nav_3');

    fade(document.querySelectorAll('.active_page')[0]);
    (document.querySelectorAll('.active_page')[0]).classList.remove("active_page");
    unfade(nav_mark_3);
    nav_mark_3.classList.add("active_page");
  }

}

// Переход на предыдыщую страницу
function prevNavPage() {
  let nav_mark_2 = document.getElementById('nav_2');

  if ((document.querySelectorAll('.active_page')[0]).id == 'nav_3') {
    fade(document.querySelectorAll('.active_page')[0]);
    (document.querySelectorAll('.active_page')[0]).classList.remove("active_page");
    unfade(nav_mark_2);
    nav_mark_2.classList.add("active_page");
  } else {
    let nav_mark_1 = document.getElementById('nav_1');

    fade(document.querySelectorAll('.active_page')[0]);
    (document.querySelectorAll('.active_page')[0]).classList.remove("active_page");
    unfade(nav_mark_1);
    nav_mark_1.classList.add("active_page");
  }
}

// Перехват событий для предотвращения скролла:
if (window.addEventListener)
  window.addEventListener('DOMMouseScroll', preventDefault, false);

window.addEventListener('wheel', preventDefault, { passive: false }); 
window.addEventListener('mousewheel', preventDefault, { passive: false }); 
document.addEventListener('mousewheel', preventDefault, { passive: false }); 

window.addEventListener('touchstart', touchStartHandler, { passive: false }); // мобилки (начало нажатия)
window.addEventListener('touchend', touchEndHandler, { passive: false }); // мобилки (конец нажатия)

document.onkeydown = preventDefaultForScrollKeys; // для клавиш
document.addEventListener('mousedown', preventDefaultForMidMouse); // для колесика мышки
