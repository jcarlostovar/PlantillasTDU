/* VARIABLES PARA SLIDER'S */
var slider_height = new Array();
var screen_width = $(window).width();
var screen_height = $(window).height();
var totalpixels = screen_width;

/* SLIDER 1 (#contentitem) */
var current_slide = 1;
var total_slides = 1;
var slider_interval;

/* FUNCTIONS */
$(document).ready(function() {
/* ALTO DEL SLIDE */
    /*Animaciones de slider 1*/
    total_slides = $('.item').length;
    $('.item').css('height', '100%');

/* ANCHO DE SLIDER */
    /*Ancho slider 1*/
    var content_width = total_slides * 100 + '%';
    var slide_width = 100 / total_slides + '%';

    $("#cont-items").css('width', content_width);
    $( "#cont-items .item" ).each(function( index ) {
        $(this).css('width',slide_width);
    });

/* INTERVALO DE TIEMPO SLIDE */
    slider_interval = setTimeout("moveSlide()",5000);

/* EVENTO TOUCH PARA MOBILE */
    //$('#cont-items').touchSwipe(callback1);

    function callback1(direction) {
        if(direction=="left"){
            moveSlide();
        }else if(direction=="right"){
            backSlide();
        }
    }

    
});

/* AVANZAR AL SIGUIENTE */
function moveSlide(){
    clearTimeout(slider_interval);
    var neg_percent = '-'+current_slide+'00%';
    if(current_slide < total_slides){

        $("#cont-items").animate({
            left: neg_percent
        },600, "easeInOutExpo",function(){
            current_slide++;
            
        });

    }else{
        $("#cont-items").animate({
            left: '0%'
        },600, "easeInOutExpo",function(){
            current_slide = 1;
            
        });
    }
    slider_interval = setTimeout("moveSlide()",5000);
}

/* REGRESAR AL ANTERIOR */
function backSlide(){
    clearTimeout(slider_interval);
    var neg_percent = '-'+(current_slide-2)+'00%';
    
    if(current_slide == 1){

        $("#cont-items").animate({
            left: '-'+(total_slides-1)+'00%'
        },600, "easeInOutExpo",function(){
            current_slide = total_slides;
        
        });

    }else{
        $("#cont-items").animate({
            left: neg_percent
        },600, "easeInOutExpo",function(){
            current_slide--;

        });
    }
    slider_interval = setTimeout("backSlide()",5000);
}
