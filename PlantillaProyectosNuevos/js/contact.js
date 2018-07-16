$(document).ready(function(){

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }


    $('#submit-contact').click(function(e){
        e.preventDefault();

        if(!window.recapcha1){
            toastr.info('Captcha necesario');
            return false;
        }

        var validated = true;
        if(!$('#NombreCompleto').val()){validated = false;}
        if(!isEmail($('#Email').val())){
            validated = false;
            toastr.warning('Tu correo electrónico no es válido');
        }
        if(!$('#Asunto').val()){
            validated = false;
            toastr.warning('Escriba un Asunto');

        }
        var message = $('#Mensaje').val();
        if(message.length === 0){validated = false;}
        if(validated){
            var contact_data = {NombreCompleto: $('#NombreCompleto').val(), Telefono: $('#tel').val(), Email: $('#Email').val(), Asunto: $('#Asunto').val(), Mensaje: $('#Mensaje').val()}
            send_contact(contact_data);
            grecaptcha.reset();
        }
        else{
            toastr.info('Todos los campos son necesarios');
        }
    });


    $('#submit-contact-card').click(function(e){
        e.preventDefault();
        //var card_id = $("input[type='radio'][name=IdProductoWeb]:checked").val();
        var productos = [];
        $( ".numt option:selected").each(function(indice, elemento) {
          var cantidad = parseInt($(elemento).text());
          if (cantidad > 0) {
            var mapa = {IdProductoWeb:parseInt($(elemento).parent().attr("id")),
            PrecioUnitario:parseInt($(elemento).parent().attr("data-tarjeta-precio")), Cantidad:cantidad}

            productos.push(mapa);
          }

        });

        var validated = true;
        if(!window.recapcha2){
            toastr.info('Captcha necesario');
            return false;
        }

        if(productos.length < 1){
            validated = false;
            toastr.warning('Selecciona una tarjeta');
        }

        if(!$('#NombreCompleto_Tarjeta').val()){validated = false;}
        if(!isEmail($('#Email_Tarjeta').val())){
            validated = false;
            toastr.warning('Tu correo electrónico no es válido');
        }
        if(!$('#Telefono_Tarjeta').val()){validated = false;}
        if(!$('#Estado_Tarjeta').val()){validated = false;}



        if(validated){
            var contact_data = {NombreCompleto: $('#NombreCompleto_Tarjeta').val(), Email: $('#Email_Tarjeta').val(),
            Telefono: $('#Telefono_Tarjeta').val(), IdEstado: $('#Estado_Tarjeta').val(),
            Productos: productos};
            send_contact_card(contact_data);
        }
        else{
            toastr.warning('Todos los campos son necesarios');
        }
    });
});



function send_contact(contact_data){
    toastr.info('Enviando mensaje, espera por favor...');
    $.ajax({
        method: "POST",
        url: "https://tduwebcomercios.azurewebsites.net/api/formcontacto",
        data: contact_data,
        beforeSend:function(request){
            $('#submit-contact').prop( "disabled", true );
        },
        statusCode:{
            400:function(){ console.log("400"); },
            401:function(){ console.log("401"); },
            404:function(){ console.log("404"); },
            200:function(){ console.log("200"); }
        },
        success: function(error){
            $('.form-control').val('');
            $('#submit-contact').prop( "disabled", false );
            toastr.success('Gracias por tus comentarios');
        },
        error:function(error){
            $('#submit-contact').prop( "disabled", false );
        }
    });
}

function send_contact_card(contact_data){
    toastr.info('Enviando mensaje, espera por favor...');
    $.ajax({
        method: "POST",
        url: "https://tduwebcomercios.azurewebsites.net/api/formsolicita",
        data: contact_data,
        statusCode:{
            400:function(){ console.log("400"); },
            401:function(){ console.log("401"); },
            404:function(){ console.log("404"); },
            200:function(){ console.log("200"); }
        },
        success: function(error){
            $('.form-control').val('');
            toastr.success('¡Gracias! Tu solicitud ha sido enviada, en breve nos comunicaremos contigo');
            $('#NumeroDeTarjetas').val('');
            $('#NombreCompleto_Tarjeta').val('');
            $('#Email_Tarjeta').val('');
            $('#Telefono_Tarjeta').val('');
            $('.f-tit option:selected').remove();
            grecaptcha.reset();
        },
        error:function(error){
        }
    });
}

function isEmail(email){
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
