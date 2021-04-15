window.addEventListener('load', function () {

	// Ползунок слайдера
	const thumb = document.getElementById('slider_handle');

	// Закрашенная часть слайдера
	const slider_filled = document.getElementById('slider_line_copy');

	// Левая граница слайдера
	const left_border = document.getElementById('slider_line').getBoundingClientRect().left;

	// Правая граница слайдера (с запасом для ползунка)
	const right_border = document.getElementById('slider_line').getBoundingClientRect().right - 20;

	// Длина слайдера
	const slider_length = right_border - left_border;

	// Левая граница середины слайдера
	let mid_left_border = left_border + (slider_length / 3);
	// Правая граница середины слайдера
	let mid_right_border = left_border + (slider_length / 3) * 2;

	// Обработчик начала нажатия на ползунок
	thumb.ontouchstart = function (event) {
		event.preventDefault();

		// Нажатие
		let touch = event.touches[0] || event.changedTouches[0];
		// Сдвиг по оси х относительно позиции нажатия
		let shift_x = touch.clientX - thumb.getBoundingClientRect().left;

		// Вешаем обработчики на события
		document.addEventListener('touchmove', onMouseMove);
		document.addEventListener('touchend', onMouseUp);

		// Обработчик перетаскивания ползунка
		function onMouseMove(event) {

			// Касание экрана для текущего события
			touch = event.touches[0] || event.changedTouches[0];
			// Новая позиция ползунка
			let new_pos = (touch.clientX - left_border) - shift_x;

			// Ограничиваем ползунок в границах слайдера
			if (new_pos < -20) {
				new_pos = -20;
			}

			// Ограничение для правой границы
			if (new_pos > right_border - left_border) {
				new_pos = right_border - left_border;
			}
			// Ограничение для левой границы
			if (new_pos > right_border - left_border) {
				new_pos = right_border - left_border;
			}

			// Задаем ползунку и заливке обновленные стили
			thumb.style.left = new_pos + 'px';
			slider_filled.style.width = new_pos + 8 + 'px';

			// Позиция ползунка от левой границы экрана
			let handle_pos = document.getElementById('slider_handle').getBoundingClientRect().left;

			// Текущая активаня секция
			let active_sector = document.querySelectorAll('.active')[0];

			// Механика переключения слайдов:

			// Проверка среднего
			if ((handle_pos >= mid_left_border) && (handle_pos <= mid_right_border)) {
				// Из третьего во второй
				if ((document.querySelectorAll('.active')[0]).id == 'sector_3') {
					animateSector(active_sector, 'sector_2', 400, 0, 100);
				}
				// Из первого во второй
				else if ((document.querySelectorAll('.active')[0]).id == 'sector_1') {
					animateSector(active_sector, 'sector_2', 400, 200, -100);
				}
				// Проверка для левого
			} else if (handle_pos < mid_left_border && active_sector.id == 'sector_2') {
				animateSector(active_sector, 'sector_1', 400, 100, 100);

				// Проверка для правого
			} else if ((handle_pos > mid_right_border) && active_sector.id == 'sector_2') {
				animateSector(active_sector, 'sector_3', 400, 100, -100);
			}
		}

		// Обработчик конца нажатия на ползунок
		function onMouseUp() {
			document.removeEventListener('touchend', onMouseUp);
			document.removeEventListener('touchmove', onMouseMove);

			// Обработка отпускания слайдера:

			// Позиция ползунка от левой границы экрана
			let handle_pos = document.getElementById('slider_handle').getBoundingClientRect().left;
			// Позиция начала анимации ползунка относительно блока слайдера
			let handle_start_pos = handle_pos - left_border;// - Math.abs(shift_x);

			// лево
			if ((handle_pos < mid_left_border) && (handle_pos > left_border)) {

				// Изменение позиции ползунка для анимации
				let handle_pos_change = -(handle_pos - left_border);
				animateSlider(handle_start_pos, handle_pos_change, 300);

				// прав
			} else if ((handle_pos > mid_right_border) && (handle_pos < right_border)) {

				// Изменение позиции ползунка для анимации
				let handle_pos_change = right_border - handle_pos;
				animateSlider(handle_start_pos, handle_pos_change, 300);

				// центр
			} else if ((handle_pos >= mid_left_border) && (handle_pos <= mid_right_border)) {

				// Изменение позиции ползунка для анимации
				let handle_pos_change = left_border + slider_length / 2 - handle_pos;
				animateSlider(handle_start_pos, handle_pos_change, 300);
			}

			// Если ползунок отпустили рядом с границей, то меняем ширину заливки слайдера
			if (+thumb.style.left.replace('px', '') < 0) {
				slider_filled.style.width = 0;
			} else {
				slider_filled.style.width = thumb.style.left;
			}

		}
	};

	thumb.ondragstart = function () {
		return false;
	};
});

// Функция анимации элементов
function animateElement({ timing, draw, duration }) {

	let start = performance.now();

	requestAnimationFrame(function animateElement(time) {
		let time_fraction = (time - start) / duration;
		if (time_fraction > 1) time_fraction = 1;

		let progress = timing(time_fraction);

		draw(progress);

		if (time_fraction < 1) {
			requestAnimationFrame(animateElement);
		}

	});
}

// Функция анимации перехода между секторами
function animateSector(now_sector, next_sector, anim_duration, now_margin_left, next_margin_left) {
	now_sector.classList.remove('active');
	document.getElementById(next_sector).classList.add("active");

	animateElement({
		duration: anim_duration,
		timing(time_fraction) {
			return time_fraction;
		},
		draw(progress) {
			document.getElementById('third').style.marginLeft =
				now_margin_left + progress * next_margin_left + '%';
		}
	});
}

// Функция анимации слайдера при отпускании
function animateSlider(start_pos, final_pos, anim_duration) {
	animateElement({
		duration: anim_duration,
		timing(time_fraction) {
			return time_fraction;
		},
		draw(progress) {
			document.getElementById('slider_handle').style.left =
				start_pos + progress * final_pos + 'px';
			document.getElementById('slider_line_copy').style.width =
				start_pos + progress * final_pos + 'px';
		}
	});
}