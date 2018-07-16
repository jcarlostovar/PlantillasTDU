(function($){
    $.fn.tarjetas = function(options) {
        var settings = $.extend({
            url: "https://tduwebcomercios.azurewebsites.net/api/productosweb",
            urlEstados: "https://tduwebcomercios.azurewebsites.net/api/estados",
            selectEstados: $("#Estado_Tarjeta")
        }, options );

        var init = function(){
            $.ajax({
                url: settings.url,
                dataType: "json"
            }).done(function(response) {
                render({tarjetas: response});
            });

            $.ajax({
                url: settings.urlEstados,
                dataType: "json"
            }).done(function(response) {
                renderEstados(response);
            });
        };

        var render = function(response){
            var html = new EJS({url: 'js/tarjetas.ejs'}).render(response);
            $("#productosWeb").html(html);
        }

        var renderEstados = function(response){
            $.each(response, function( index, value ) {
                settings.selectEstados.append($("<option/>", {value: value.IdEstado, text:value.sEstado}));
            });
        }

        init();
    };
}(jQuery));