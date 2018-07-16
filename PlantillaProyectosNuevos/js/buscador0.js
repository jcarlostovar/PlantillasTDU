

(function($){
    $.fn.buscador = function(options) {
        var settings = $.extend({
            url: "https://tduwebcomercios.azurewebsites.net/api/comercios/1/programa/",
            get: ""
        }, options );

        init = function(){
            var s_url = "";
            if (settings.get["q"] !== undefined){
                s_url = "https://tduwebcomercios.azurewebsites.net/api/comercios/?idprograma=1&nombre=" + encodeURIComponent(String(settings.get["q"]));
            }
            if (settings.get["id"] !== undefined){
                s_url = "https://tduwebcomercios.azurewebsites.net/api/comercios/1/programa/"+settings.get["id"];
            }
            $.ajax({
                url: s_url,
                dataType: "json"
            }).done(function(response) {
                render(response);
            });
        };

        render = function(response){
            var g = _(response).groupBy(function(o) {
                return o.Giro.sGiro;
            });
            g = {giros : g, latitude:settings.get["latitude"], longitude: settings.get["longitude"]};
            var html = new EJS({url: 'js/giros.ejs'}).render(g);
            $(".banner").hide();
            $(".busqueda").html(html);
            $(".busqueda").show();
            $(".busqueda").find('.back').flipFix(); //PARA BUG CHROME
        }

        init();

    };
}(jQuery));



$(document).ready(function(){

    $(document).on("click", '.map-search-more', function(){
        var storeinfo = $(this).attr('data-store');
        $('.more-info').slideUp('fast');
        $('.'+storeinfo).slideDown('fast');
    });



});
