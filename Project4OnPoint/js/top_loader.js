//Код отошлет на верх страницы при загрузки с тиком в 100
window.addEventListener('load', function(){
	setTimeout(function(){
        window.scrollTo(0, 0);
    }, 100);
});
