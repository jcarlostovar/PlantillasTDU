function clearOverlays(ar) {
    for (var i = 0; i < ar.length; i++) {
        ar[i].setMap(null);
    }
    ar.length = 0;
}

function preInitialize(position){
    $.ajax({
        url: "https://tduwebcomercios.azurewebsites.net/api/comercios/1/programa/"+ String(position.coords.latitude).replace(".", ",") +"/"+ String(position.coords.longitude).replace(".", ",")+"/10",
        dataType: "json"
    }).done(function(response) {
        initialize(position, response);
    }).fail(function(response) {
        alert("Error al consultar los datos")
    });
}

function initialize(position, response) {

    var latitud = position.coords.latitude;
    var longitud = position.coords.longitude;
    var bounds = new google.maps.LatLngBounds();

    window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(latitud, longitud),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var marcadores = {comercios : _.sortBy(response, function(num){ return num.Sucursal.Distancia; })};

    var infowindow = new google.maps.InfoWindow();

    var marker, m, mm;
    window.markersArray = [];

    infowindow.setContent('Tú estás aquí!');

    var image = 'img/youarehere.png';
    var marker = new google.maps.Marker({
        position: {lat: latitud, lng: longitud},
        map: map,
        icon: image
    });
    marker.setMap(map);
    infowindow.open(map, marker);


    /** Comercios **/
    $.each(marcadores["comercios"], function (index, value) {

        var logo = "img/icon/00.jpg";
        if( value.PathLogo && value.PathLogo != ""){
            logo  = 'https://tdushots.blob.core.windows.net'+value.PathLogo;
        }

        var det =   $("<div/>", {class:"row map-target", id:index});
        var div2 =  $("<div/>", {class:"col-md-12 col-xs-12 text-center"}).appendTo(det);
        var img =   $("<img/>", {src: logo, class: "img-responsive center"}).appendTo(div2);
        var div2_2= $("<div/>", {class:"col-md-12 col-xs-12 text-center"}).appendTo(det);
                    $("<p/>", {text: value.sComercio, class:"map-store-name"}).appendTo(div2_2);

                    $("<p/>", {html: "<span>Ubicar Sucursales</span>", class:"map-store-location"}).addClass("icon-markL").appendTo(div2_2);
        var p3 =    $("<p/>", {class:"map-store-cat"}).appendTo(div2_2);
                    $("<img/>", {src:'img/ico-'+(value.Giro.sGiro).toLowerCase().replace(/ /g, '_')+'.png' }).appendTo(p3);
                    $("<font/>", {text:value.Giro.sGiro}).appendTo(p3);
        var div3 = $("<div/>", {class:"suc"}).appendTo(div2_2);

        var datosPercent = formatNumber (value.Beneficio.Efectivo, "% en efectivo ", value.Beneficio.TC, "% en TC " );
        $("<div/>", {text: datosPercent.efectivo}).appendTo(div2_2);
        $("<div/>", {text: datosPercent.tarjeta, class:"m-left"}).appendTo(div2_2);
        $("<div/>", {text: datosPercent.promocion, class:"m-left"}).appendTo(div2_2);

        var div4 = $("<div/>", {class:"test", comerciofor: index}).appendTo(div3);
        $("<div/>", {text:value.Sucursal.sSucursal}).appendTo(div4);
        $("<div/>", {text:value.Beneficio.Descripcion, class:"m-left"}).appendTo(div4);
        $("<div/>", {text:value.Beneficio.Restricciones, class:"m-left"}).appendTo(div4);


      /*  var det = '<div id="' + index + '" class="row map-target"><div class="col-md-12 col-xs-12 text-center">' +
            '<img src="'+ logo +'" class="img-responsive center" alt="" />' +
            '</div><div class="col-md-12 col-xs-12 text-center"><p class="map-store-name">' + value.sComercio + '</p>' +
            '<p class="map-store-location">Ubicar Sucursales</p>'+
            '<p class="map-store-cat"><img src="img/ico-'+(value.Giro.sGiro).toLowerCase().replace(/ /g, '_')+'.png"/>'+ value.Giro.sGiro +'</p>'+
            '<div class="suc">' +
            '<div class="test" comerciofor="' + index + '"><div>&#8226; '+value.Sucursal.sSucursal+'</div><div class="m-left m-top">'+
            (value.Beneficio.Efectivo ? (parseFloat(value.Beneficio.Efectivo).toFixed(2)*100)+ "% en efectivo " : '') +'</div><div class="m-left">'+
            (value.Beneficio.TC ? (parseFloat(value.Beneficio.TC).toFixed(2)*100)+ "% en TC " : '') +'</div><div class="m-left">'+
            value.Beneficio.Descripcion+'</div><div class="m-left">' +
            value.Beneficio.Restricciones+'</div></div></div></div></div>';*/

        $('.content-mapstore').append(det);


        /* Imprimir marker para todas las sucursales */
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(value.Sucursal.Latitud, value.Sucursal.Longitud),
            contenido:  value.sComercio + " <br> " + value.Sucursal.sSucursal,
            map: map

        });

        /*Solo para mobile*/
        var android=navigator.userAgent.match(/Android/i);
        var ios=navigator.userAgent.match(/iPhone|iPad|iPod/i);

        if(ios){
            marker.addListener('click', function() {
            window.open('http://maps.google.com/maps?q=loc:'+ value.Sucursal.Latitud +','+ value.Sucursal.Longitud +'&sspn=0.2,0.1&nav=1', '_blank');            });
        }
        if(android){
            marker.addListener('click', function() {
            window.open('http://maps.google.com/maps?q=loc:'+ value.Sucursal.Latitud +','+ value.Sucursal.Longitud +'&sspn=0.2,0.1&nav=1', '_blank');
            });
        }
        /*Fin solo para mobile*/

        map.setZoom( 14 );
        map.setCenter(new google.maps.LatLng(latitud, longitud));

        markersArray.push(marker);

        google.maps.event.addListener(marker, 'click', (function (marker, index) {
            return function () {
                infowindow.setContent(
                    marker.contenido
                );
                infowindow.open(map, marker);
            }
        })(marker, index));

        //bounds.extend(marker.position);
        //map.fitBounds(bounds);

        /** Click sobre comercio  */
        $("#" + index).click(function (e) {
            var comercioID = $(this).attr("id");
            var bounds = new google.maps.LatLngBounds();

            $(".test[comerciofor='" + comercioID + "']").toggle('slow');

            clearOverlays(markersArray);

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(value.Sucursal.Latitud,
                    value.Sucursal.Longitud),
                map: map
            });

            markersArray.push(marker);
            google.maps.event.addListener(marker, 'click', (function (marker, index) {
                return function () {
                    infowindow.setContent(
                        value.sComercio + " <br> " +
                        value.Sucursal.sSucursal

                    );
                    infowindow.open(map, marker);
                }
            })(marker, index));

            map.setZoom( 15 );
            map.setCenter(new google.maps.LatLng(value.Sucursal.Latitud, value.Sucursal.Longitud));
            //bounds.extend(marker.position);
            //map.fitBounds(bounds);

        });
    });

    $(".suc .test").hide();
}
