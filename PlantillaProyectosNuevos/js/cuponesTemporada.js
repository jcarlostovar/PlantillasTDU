(function ($) {
    $.fn.cupones = function (options) {
        var settings = $.extend({
            url: "https://tduwebcomercios.azurewebsites.net/api/publicaciones/1/medio/1"
        }, options);

        var init = function () {
            $.ajax({
                url: settings.url,
                dataType: "json"
            }).done(function (response) {
                render({cupones: response});
            });
        };

        var render = function (response) {
            var html = new EJS({url: 'js/cuponesTemporada.ejs'}).render(response);
            $(".main-promociones").html(html);
        }

        init();
    };
}(jQuery));


var c = null;

$(document).on("show.bs.modal", '.modalPromociones', function(e){
    var id = $(this).attr("data-modal-id");
    c = capcha1(id);

});


$(document).on("hide.bs.modal", '.modalPromociones', function(e){
    var id = $(this).attr("data-modal-id");
    grecaptcha.reset(c);

});


function valid_email(my_email) {
    if (/(.+)@(.+){2,}\.(.+){2,}/.test(my_email)) {
        email = my_email;
        $('#submit-coupon').css("opacity", "1").removeAttr("disabled");
    }
    else {
        $('#submit-coupon').css("opacity", "0.6").attr("disabled", "disabled");
    }
}


function send_coupon(idpublicacion) {
    if(!window.recapcha){
        toastr.info('Captcha necesario');
        return false;
    }
    $.ajax({
        method: "POST",
        url: "https://tduwebcomercios.azurewebsites.net/api/sendEmailPublicacion",
        data: {IdPublicacionEspecialDisplay: idpublicacion, Email: email},
        beforeSend: function (request) {
            toastr.info('Enviando mensaje, espera por favor...');
            $('#submit-coupon').prop("disabled", true);
        },
        statusCode: {
            400: function () {
                console.log("400");
            },
            401: function () {
                console.log("401");
            },
            404: function () {
                console.log("404");
            },
            200: function () {
                console.log("200");
            }
        },
        success: function (error) {
            $('#submit-coupon').prop("disabled", false);
            toastr.success('¡Felicidades! En breve recibirás esta promoción en tu correo');
            $('#Email_Cupon').val('');
        },
        error: function (error) {
            $('#submit-coupon').prop("disabled", false);
        }
    });
}
