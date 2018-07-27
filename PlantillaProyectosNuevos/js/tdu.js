var install_app; /*URL TIPO DISPOSITIVO*/
get = function() {
    window.$_GET = {};
    document.location.search.replace(/\??(?:([^=]+)=([\S]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }
        $_GET[decode(arguments[1])] = decode(arguments[2]);
    });
    return $_GET;
};

formatNumber = function(efectivo, efectivoString, tarjeta, tarjetaString){

    var res = {efectivo:"", tarjeta: "", promocion:""};

    if(efectivo || efectivo != ""){
        res.efectivo =  "" + (parseInt(parseFloat(efectivo)* 100)) + efectivoString;
    }

    if(tarjeta ||  tarjeta != ""){
        res.tarjeta = "" + (parseInt(parseFloat(tarjeta)* 100)) + tarjetaString;
    }

    if((!efectivo ||  efectivo == "") && (!tarjeta ||  tarjeta == "")){
        res.promocion = "promoción";
    }

    return res;
};

$(document).ajaxStart(function () {
    //$("#loader-wrapper").show()
});

$(document).ajaxStop(function () {
    $("#loader-wrapper").hide()
});

$(document).ready(function(){
    $(".intro-efect").fadeInOnScroll();//EFECTO FADE IN EN SCROLL RESULTADOS DE BUSQUEDA

    /*DETECTAR TIPO DISPOSITIVO*/
     var android=navigator.userAgent.match(/Android/i);
     var ios=navigator.userAgent.match(/iPhone|iPad|iPod/i);

     if(ios){
         install_app='http://itunes.apple.com/us/app/tdu/id491086360?mt=8';
     }
     if(android){
         install_app='https://play.google.com/store/apps/details?id=mx.com.estrategiatec.TDU';
     }
     $("#install_app_link").click(function(){
         //alert("dasd");
         window.open(install_app);
     });
    /*FIN DETECTAR TIPO DISPOSITIVO*/

    /*CLEAR INPUT*/
    $('#close-tarjeta').click(function(e){
        $('#NumeroDeTarjetas').val('');
        $('#NombreCompleto_Tarjeta').val('');
        $('#Email_Tarjeta').val('');
        $('#Telefono_Tarjeta').val('');
        grecaptcha.reset();
    });

    $(document).on('click', '#close-cupon',  function(e){
        $('#Email_Cupon').val('');
    });
    $(document).on('click', '#submit-coupon',  function(e){
        $('#Email_Cupon').val('');
    });
    /*FIN CLEAR INPUT*/

    $("body").tarjetas({});

    var gett= get();

    if(Object.keys(gett).length !== 0) {
        $(".buscador").val(gett["q"]);
    }

    $('.item-menu').click(function(e){
        e.preventDefault();

        var enlace = $(this).attr('data-target');
        if(enlace==''){
        }
        else{
            window.location.href = enlace+".html";
        }
    });

    $('.c-hamburger, .label-menu').click(function(e){
        e.preventDefault();
        $('.c-hamburger').toggleClass('is-active');
        if($('.c-hamburger').hasClass('is-active')){
            $('.open-menu').slideDown('fast');
        }
        else{
            $('.open-menu').slideUp('fast');
        }
    });

    $(document).on('keydown', '.buscador',  function(e){
        if(e.which === 13) {
            window.location.href = "./descuentos.html" + "?q=" + $(this).val();
            $('#load-wrapper-2').show();
        }
    });

    /*FIN BOTON SCROLL*/

    /*EFECTO TARJETAS
        efect_fade();
    FIN EFECTO TARJETAS*/

    /*ANIMACION CUADRO TARJETAS*/
        var $animation_elements = $('.animation-element');
        var $window = $(window);

        function check_if_in_view() {
          var window_height = $window.height();
          var window_top_position = $window.scrollTop();
          var window_bottom_position = (window_top_position + window_height);

          $.each($animation_elements, function() {
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top;
            var element_bottom_position = (element_top_position + element_height);

            if ((element_bottom_position >= window_top_position) &&
                (element_top_position <= window_bottom_position)) {
              $element.addClass('in-view');
            } else {
              $element.removeClass('in-view');
            }
          });
        }

        $window.on('scroll resize', check_if_in_view);
        $window.trigger('scroll', check_if_in_view);
    /*FIN ANIMACION CUADRO TARJETAS*/

    /*EFECTO FLIP*/
    $(document).on('click', '.panel-flip .action-flip', function(e){
        var elemento = $(this).data("store");
        $('.panel-flip').removeClass('flip');
        $('.panel-flip[data-store="'+elemento+'"]').addClass('flip');
        e.preventDefault();
    });

    $(document).on('click', '.panel-flip .detalle-back', function(e){
        var elemento = $(this).data("store");
        $('.panel-flip[data-store="'+elemento+'"]').removeClass('flip');
        e.preventDefault();
    });
    /*FIN EFECTO FLIP*/
});

// EFECTO PARLLA

$(document).ready(function(){

  $(window).scroll(function(){
    var barra = $(window).scrollTop();
    var posicion = barra * 0.10;

    $('como-funciona').css({
      'background-position': '0 -' + position + 'px'
    });
  });
});
