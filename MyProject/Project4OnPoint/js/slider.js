window.addEventListener('load', function(){

	// Peretaskivanie slider'a, tot, 4to na tretyem slaide:
	let thumb = document.getElementById('slider_handle');

	thumb.ontouchstart = function(event) {
		event.preventDefault(); 

		let touch = event.touches[0] || event.changedTouches[0];

		let shiftX = touch.clientX - thumb.getBoundingClientRect().left;
		
		let slider_filled = document.getElementById('slider_line_copy');

		let left_border = document.getElementById('slider_line').getBoundingClientRect().left - 20;
		let right_border = document.getElementById('slider_line').getBoundingClientRect().right - shiftX;

		let slider_length = right_border - left_border;

		document.addEventListener('touchmove', onMouseMove);
		document.addEventListener('touchend', onMouseUp);

		function onMouseMove(event) {
			
			touch = event.touches[0] || event.changedTouches[0];
			slider = document.getElementById('slider_line');
			let newPos = (touch.clientX - left_border) - shiftX;

			
			if (newPos < -20) {
				newPos = -20;;
			}

			if(shiftX < 30){
				if (newPos > right_border - left_border - 30) {
				  newPos = right_border - left_border - 30;
				}
			}else{
				if (newPos > right_border - left_border) {
				  newPos = right_border - left_border;
				}
			}
			
			thumb.style.left = newPos + 'px';
			slider_filled.style.width = newPos + 8 + 'px';

			let handle_pos = document.getElementById('slider_handle').getBoundingClientRect().left;

			let active_sector = document.querySelectorAll('.active')[0];
			// Mehanika pereklu4eniya slaidov:

			// Proverka srednego
			if((handle_pos >= left_border + (slider_length / 3)) && (handle_pos <= left_border + (slider_length / 3) * 2)){
				// Iz 3 v 2
				if((document.querySelectorAll('.active')[0]).id == 'sector_3'){
					active_sector.classList.remove('active');
					document.getElementById('sector_2').classList.add("active");

					animate_slider({
						duration: 400,
						timing(timeFraction) {
					      return timeFraction;
					    },
					    draw(progress) {
					    	//document.getElementById('third').style.marginLeft.replace('%', '')
					    	document.getElementById('third').style.marginLeft = 
					    		progress * 100 + '%';
					    }
					});
				
				}
				// Iz 1 v 2
				else if((document.querySelectorAll('.active')[0]).id == 'sector_1'){
					active_sector.classList.remove('active');
					document.getElementById('sector_2').classList.add("active");

					animate_slider({
						duration: 400,
						timing(timeFraction) {
					      return timeFraction;
					    },
					    draw(progress) {
					    	document.getElementById('third').style.marginLeft = 
					    		200 + progress * -100 + '%';
					    }
					});
				}
			// Proverka dlya levogo
			}else if(handle_pos < left_border + (slider_length / 3)  && active_sector.id == 'sector_2'){
				active_sector.classList.remove('active');
				document.getElementById('sector_1').classList.add("active");

				animate_slider({
					duration: 400,
					timing(timeFraction) {
				      return timeFraction;
				    },
				    draw(progress) {
				    	document.getElementById('third').style.marginLeft = 
				    		100 + progress * 100 + '%';
				    }
				});

			// Proverka dlya pravogo
			}else if((handle_pos > left_border + (slider_length / 3) * 2) && active_sector.id == 'sector_2'){
				active_sector.classList.remove('active');
				document.getElementById('sector_3').classList.add("active");

				animate_slider({
					duration: 400,
					timing(timeFraction) {
				      return timeFraction;
				    },
				    draw(progress) {
				    	document.getElementById('third').style.marginLeft = 
				    		100 + progress * -100 + '%';
				    }
				});
			}
		}

		function onMouseUp() {
			document.removeEventListener('touchend', onMouseUp);
			document.removeEventListener('touchmove', onMouseMove);

			// Obrabotka otpuskaniya slider'a:
			
			let handle_pos = document.getElementById('slider_handle').getBoundingClientRect().left;

			//levo
			if((handle_pos < left_border + (slider_length / 3)) && (handle_pos > left_border + 20)){
				
				animate_slider({
					duration: 300,
					timing(timeFraction) {
				      return timeFraction;
				    },
				    draw(progress) {
				    	if(shiftX < 30) shiftX = 10;
				    	document.getElementById('slider_handle').style.left = 
				    		(+handle_pos - left_border - 30 - shiftX) + progress * -(+handle_pos - left_border - 30 - shiftX) + 'px';
				    	document.getElementById('slider_line_copy').style.width = 
				    		(+handle_pos - left_border - 30 - shiftX) + progress * -(+handle_pos - left_border - 30 - shiftX) + 5 + 'px';
				    }
				});
			// pravo
			}else if((handle_pos > left_border + (slider_length / 3) * 2) && (handle_pos < right_border - 20)){
				animate_slider({
					duration: 300,
					timing(timeFraction) {
				      return timeFraction;
				    },
				    draw(progress) {
				    	if(shiftX < 30){
				    		shiftX = -20;
				    		document.getElementById('slider_handle').style.left = 
				    			(+handle_pos - left_border + shiftX) + progress * (right_border - +handle_pos + shiftX) + 'px';
				    		document.getElementById('slider_line_copy').style.width = 
				    			(+handle_pos - left_border + shiftX) + progress * (right_border - +handle_pos + shiftX) + 'px';
				    	}else{
				    		document.getElementById('slider_handle').style.left = 
				    			(+handle_pos - left_border - shiftX) + progress * (right_border - +handle_pos + shiftX) + 'px';
				    		document.getElementById('slider_line_copy').style.width = 
				    			(+handle_pos - left_border - shiftX) + progress * (right_border - +handle_pos + shiftX) + 'px';
				    	}
				    }
				});
			// center
			}else if ((handle_pos >= left_border + (slider_length / 3)) && (handle_pos <= left_border + (slider_length / 3) * 2)){
				animate_slider({
					duration: 300,
					timing(timeFraction) {
				      return timeFraction;
				    },
				    draw(progress) {
			    		document.getElementById('slider_handle').style.left = 
			    			(+handle_pos - left_border - shiftX) + progress * (left_border + slider_length / 2 - +handle_pos + shiftX) + 'px';
			    		document.getElementById('slider_line_copy').style.width = 
			    			(+handle_pos - left_border - shiftX) + progress * (left_border + slider_length / 2 - +handle_pos + shiftX) + 'px';
				    }
				});
			}

			if(+document.getElementById('slider_handle').style.left.replace('px', '') < 0){
				document.getElementById('slider_line_copy').style.width = 0;
			}else{
				document.getElementById('slider_line_copy').style.width = document.getElementById('slider_handle').style.left;
			}

		}
	};

	thumb.ondragstart = function() {
		return false;
	};
});

function animate_slider({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate_slider(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

   
    let progress = timing(timeFraction);

    draw(progress); 

    if (timeFraction < 1) {
      requestAnimationFrame(animate_slider);
    }

  });
}