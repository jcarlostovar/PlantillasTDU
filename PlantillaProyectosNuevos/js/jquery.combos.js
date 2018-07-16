(function($){
    $.fn.combos = function(options) {
        var settings = $.extend({
        	comboGiros: "giros",
            comboEstados : "estados",
        	comboCiudades : "ciudades",
        	comboMunicipios : "municipios"
        }, options );


		function init (){
			$("#"+settings.comboEstados).change(function(){
				$("#"+settings.comboCiudades).attr("disabled", "disabled");
				//$("#"+settings.comboMunicipios).attr("disabled", "disabled");
				getCiudades($(this).find(" option:selected" ).val());
				getMunicipios($(this).find(" option:selected" ).val(), null);
			})

			$("#"+settings.comboCiudades).change(function(){
				$("#"+settings.comboMunicipios).attr("disabled", "disabled");
				getMunicipios($("#"+settings.comboEstados).find(" option:selected" ).val(), $(this).find(" option:selected" ).val());
			})

			$("#"+settings.comboMunicipios).change(function(){
			})
		}


        /* RENDERS */
        var renderGiro = function(response, combo){
            combo.append('<option value="0"> Giro... </option>');
        	for (var option = 0; option < response.length; option++){
        		var test = $('<option/>', {
					text: response[option].sGiro,
					value: response[option].IdGiro
					});

        		combo.append(test);
        	}
        };

        var renderEstados = function(response, combo){
        	combo.append('<option value="0"> Estado... </option>');

			for (var option = 0; option < response.length; option++){
				var test = $('<option/>', {
					text: response[option].sEstado,
					value: response[option].IdEstado
					});

        		combo.append(test);
        	}


        };

        var renderCiudades = function(response, combo, comboestado){
        	combo.append('<option value="0"> Ciudad... </option>');
        	for (var option = 0; option < response.length; option++){
				var test = $('<option/>', {
					text: response[option].sCiudad,
					value: response[option].IdCiudad
					});

        		combo.append(test);
        	}

			if(response.length > 0){
				$("#"+settings.comboCiudades).removeAttr("disabled");
			}

        };

        var renderMunicipios = function(response, combo){
        	combo.append('<option value="0"> Delegación/Municipio... </option>');

        	for (var option = 0; option < response.length; option++){
				var test = $('<option/>', {
					text: response[option].sMunicipio,
					value: response[option].IdMunicipio
					});

        		combo.append(test);
        	}

			if(response.length > 0){
				$("#"+settings.comboMunicipios).removeAttr("disabled");
			}

        };

        /* LLAMADAS A RENDERS */
        var call  = function(url, combo, combo2){
        	$.ajax({
			      url: url,
			      type: 'GET',
			      dataType:"json",
			      success: function(response){		
			      	 switch(combo){
			      	 	case "giros" :
			      	 		renderGiro(response, $("#"+combo));
			      	 	break;

			      	 	case "estados" :
			      	 		renderEstados(response, $("#"+combo));
			      	 	break;

			      	 	case "ciudades" :
			      	 		$("#"+combo).html("");
			      	 		$("#"+settings.comboMunicipios).html("");
			      	 		renderCiudades(response, $("#"+combo), $("#"+combo2));
			      	 	break;

			      	 	case "municipios" :
			      	 		$("#"+combo).html("");
			      	 		renderMunicipios(response, $("#"+combo));
			      	 	break;
			      	 }
			      },
			      error: function(xhr, status){
			        console.log("error", xhr );
			        console.log("error", status);
			      }
			});
        };

        /* FUNCIONES URL*/
        var getGiro = function(){
        	var url = 'https://tduwebcomercios.azurewebsites.net/api/giros';
        	var combo = settings.comboGiros;
        	call(url, combo, null);
        };

        var getEstados = function(){
        	var url = 'https://tduwebcomercios.azurewebsites.net/api/estados';
        	var combo = settings.comboEstados;
        	call(url, combo, null);
        };

        var getCiudades = function(idEstado){
        	var url = 'https://tduwebcomercios.azurewebsites.net/api/ciudades/1/programa/'+idEstado;
        	var combo = settings.comboCiudades;
        	var comboestado= settings.comboEstados;
        	call(url, combo, comboestado);
        };

        var getMunicipios = function(idEstado,idCiudad){

			var url;

			if(idEstado && idCiudad){
				url = 'https://tduwebcomercios.azurewebsites.net/api/municipios/1/programa/'+idEstado+'/'+idCiudad;
			}else{
				url = 'https://tduwebcomercios.azurewebsites.net/api/municipios/1/programa/'+idEstado;
			}

        	var combo = settings.comboMunicipios;
        	call(url, combo, null);
        };

		init();
		getEstados();
		getGiro();

	};
}(jQuery));