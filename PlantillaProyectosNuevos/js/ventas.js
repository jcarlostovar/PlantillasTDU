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

    $('#submit-empresa').click(function(e){
        e.preventDefault();
        var validated = true;
        if(!window.recapcha1){
            validated = false;
            toastr.info('Captcha necesario');
            return false;
        }
        if(!$('#cont-empresa').val()){validated = false;}
        if(!$('#empresa').val()){validated = false;}
        if(!isEmail($('#email_empresa').val())){
            validated = false;
            toastr.warning('Tu correo electrónico no es válido');
        }
        if(!$('#tel-empresa').val()){
            validated = false;
            toastr.warning('Escriba un teléfono');
        }
        //**extension obligatorio??
        var message = $('#mensaje-empresa').val();
        if(message.length === 0){validated = false;}
        if(validated){
            var contact_data = {
                NombreCompleto: $('#cont-empresa').val(),
                Empresa: $('#empresa').val(),
                Email: $('#email_empresa').val(),
                Telefono: $('#tel-empresa').val(),
                Extension: $('#extension').val(),
                Mensaje: $('#mensaje-empresa').val()
            };
            send_contact(contact_data);
            grecaptcha.reset();
        }
        else{
            toastr.info('Todos los campos son necesarios');
        }
    });
});





function send_contact(contact_data){
    toastr.info('Enviando mensaje, espera por favor...');
    $.ajax({
        method: "POST",
        url: "https://tduwebcomercios.azurewebsites.net/api/formventascorp",
        data: contact_data,
        beforeSend:function(request){
            $('#submit-empresa').prop( "disabled", true );
        },
        statusCode:{
            400:function(){ console.log("400"); },
            401:function(){ console.log("401"); },
            404:function(){ console.log("404"); },
            200:function(){ console.log("200"); }
        },
        success: function(error){
            $('.form-control').val('');
            $('#submit-empresa').prop( "disabled", false );
            toastr.success('Gracias por tus comentarios');
        },
        error:function(error){
            $('#submit-empresa').prop( "disabled", false );
        }
    });
}



function isEmail(email){
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
