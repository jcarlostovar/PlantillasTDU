var latlng = [];
var sucursales = {};
var markersArray = [];
var infowindow;
var centerLat = null;
var centerLong = null;
var img_det_suc = '';

function getQuery(url, estado, ciudad, municipio, giro){

    if(typeof estado !== "undefined" && estado != ""){
        url += "/"+estado;
    }else{
        url += "/0";
    }

    if(typeof ciudad !== "undefined" && ciudad != ""){
        url += "/"+ciudad;
    }else{
        url += "/0";
    }

    if(typeof municipio !== "undefined" && municipio != ""){
        url += "/"+municipio;
    }else{
        url += "/0";
    }

    if(typeof giro !== "undefined" && giro != "" && giro != null){
        url += "/"+giro;
    }else{
        url += "/0";
    }

    return url;
}

function getQuerySucursales(url, estado, ciudad, municipio, giro){

    if(typeof estado !== "undefined" && estado != "" && estado != 0){
        url += "/"+estado;
    }else{
        return url;
    }

    if(typeof ciudad !== "undefined" && ciudad != "" && ciudad != 0){
        url += "/"+ciudad;
    }else{
        return url;
    }

    if(typeof municipio !== "undefined" && municipio != "" && municipio != 0){
        url += "/"+municipio;
    }else{
        return url;
    }

    if(typeof giro !== "undefined" && giro != "" && giro != 0 && giro != null){
        url += "/"+giro;
    }else{
        return url;
    }

    return url;
}

function searchGiros(estado, ciudad, municipio, giro){

    var u = "https://tduwebcomercios.azurewebsites.net/api/comercios/1/programa";

    var url = getQuery(u, estado, ciudad, municipio, giro);

    if(url == false){
        return false;
    }

    $.ajax({
        url: url,
        dataType: "json"
    }).done(function(mapp) {
        var g = _(mapp).groupBy(function(o) {
            return o.Giro.sGiro;
        });
        g = {giros : g};

        var html = new EJS({url: 'js/giros.ejs'}).render(g);
        $(".buscador").val("");
        $(".banner").hide();
        $(".contenido").hide();

        $(".busqueda").html(html);
        $(".busqueda").show().arrangeInColumns();

        $(".busqueda").find('.fidein-resultado').fadeInOnScroll("#scroll-autoRES");//EFECTO FADE IN EN SCROLL RESULTADOS DE BUSQUEDA
        $(".busqueda").find('.search-item-container').zIndexFromPosition();
        $(".busqueda").find('.back').flipFix(); //PARA BUG CHROME

        /*EFECTO TARJETAS*/
        //efect_fade();
    });
}

function initMap() {
    $(".contenido").html("");
    var mapDiv = document.getElementById('map');
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(mapDiv, {
        center: {lat: 19.4326597, lng: -99.1376936},
        zoom: 16,
        scrollwheel: true
    });

}

function clearOverlays(ar) {
    for (var i = 0; i < ar.length; i++) {
        ar[i].setMap(null);
    }
    ar.length = 0;
}

function addmarker(latilongi) {
    var bounds = new google.maps.LatLngBounds();



    $.each(latilongi, function( index, value ) {


        //var logo = "img/icon/00.jpg";
        var logo = img_det_suc;

        var det =   $("<div/>", {class:"row map-target", id:index});
        var div2 =  $("<div/>", {class:"col-md-12 col-xs-12 text-center"}).appendTo(det);
        //var img =   $("<img/>", {src: logo, class: "img-responsive center"}).appendTo(div2);
        var div2_2= $("<div/>", {class:"col-md-12 col-xs-12 text-center"}).appendTo(det);
        $("<p/>", {text: value.sucursal.sSucursal,  class:"map-store-ubic"}).appendTo(div2_2);
        $("<p/>", {text: value.sucursal.Direccion,  class:"map-store-ubic"}).appendTo(div2_2);
        $("<p/>", {text: value.sucursal.Colonia,  class:"map-store-ubic"}).appendTo(div2_2);

        $('#contenido-sucursales').append(det);
        var marker = new google.maps.Marker({
            position: value.position,
            map: map,
            title: 'tienda',
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(marker, 'click', (function (marker, index) {
            return function () {
                infowindow.setContent(
                    value.sucursal.sSucursal + "<br>" +
                    value.sucursal.Direccion + "<br>" +
                    value.sucursal.Colonia
                );
                infowindow.open(map, marker);
            }
        })(marker, index));

        /** Click sobre comercio  */
        $("#" + index).click(function(e){
            map.setZoom(16);
            map.setCenter(new google.maps.LatLng(value.position.lat, value.position.lng));
        });

        /*Solo para mobile*/
        var android=navigator.userAgent.match(/Android/i);
        var ios=navigator.userAgent.match(/iPhone|iPad|iPod/i);

        if(ios){
            marker.addListener('click', function() {
                window.open('http://maps.google.com/maps?q=loc:'+ value.position.lat +','+  value.position.lng +'&sspn=0.2,0.1&nav=1', '_blank');            });
        }
        if(android){
            marker.addListener('click', function() {
                window.open('http://maps.google.com/maps?q=loc:'+ value.position.lat +','+  value.position.lng +'&sspn=0.2,0.1&nav=1', '_blank');
            });
        }
        /*Fin solo para mobile*/

        markersArray.push(marker);

        if(latilongi.length > 1){
            bounds.extend(marker.position);
            map.fitBounds(bounds);
        }else{
            map.setZoom(14);
            map.setCenter(new google.maps.LatLng(value.position.lat, value.position.lng));
        }
    });
}

$(document).ready(function(){
    //mas info
    $(document).on("click", '.map-store-more', function(){
        var storeinfo = $(this).attr('data-store');
        $('.more-info').slideUp('fast');
        $('.'+storeinfo).slideDown('fast');
    });

    $('.mapa-modal').on('shown.bs.modal', function (event) {
        google.maps.event.trigger(map, "resize");
        addmarker(latlng);
    });

    //Modal
    $(document).on("click", '.location-container', function(){

        var dataimg = $(this).attr('data-img');
        img_det_suc = dataimg; // Se usa en addmarker()

        var datatitle = $(this).attr('data-title');
        var dataweb = $(this).attr('data-web');
        var dataBeneficio = $(this).attr('data-beneficio');

        var datatargetlat = $(this).attr('data-targetlat');
        var datatargetlng= $(this).attr('data-targetlng');

        latlng = [];
        clearOverlays(markersArray);

        var u = "https://tduwebcomercios.azurewebsites.net/api/beneficios/"+dataBeneficio+"/sucursales";

        var url = getQuerySucursales(u , $("#estados option:selected").val(), $("#ciudades option:selected").val(),
                                $("#municipios option:selected").val(), null);

        initMap();

        centerlat = datatargetlat;
        centerlong = datatargetlng;

        $.ajax({
            url: url,
            dataType: "json"
        }).done(function(response) {

             $.each(response, function( index, value ) {
                latlng.push({position:{lat: value.Latitud, lng: value.Longitud},sucursal: value});
             });

            $('.modal-logo').attr('src',dataimg);
            $('.modal-name').text(datatitle);
            if(dataweb){
                $('.modal-web-container').html('Conoce mas en su<a href="'+dataweb+'" class="store-web modal-web" target="_blank"> sitio web</a>');
            }else{
                $('.modal-web-container').html('');
            }

            $('.mapa-modal').modal('show');
        });

        $("#contenido-sucursales").empty();
    });

    //Limpiar modal ver sucursales
    $(".close-modal-map-suc").click(function(e){
        $("#contenido-sucursales").empty();
    });
});
