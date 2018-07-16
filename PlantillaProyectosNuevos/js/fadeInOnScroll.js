//EFECTO FADE IN EN SCROLL RESULTADOS DE BUSQUEDA
(function($){
    $.fn.fadeInOnScroll = function(scrolledElement){
        return this.each(function(){
            var thisElement = $(this).css({
                'opacity': 0,
                'margin-top': 50
            });

            if(typeof scrolledElement == 'undefined'){
                scrolledElement = window;
            }

            var top = thisElement.offset().top;
            var width = thisElement.outerWidth(false);
            var screenHeight = $(scrolledElement).height();

            var onScroll = function(){
                var scrollTop = $(scrolledElement).scrollTop();

                if(scrollTop + screenHeight > top){
                    thisElement.animate({
                        'opacity': 1,
                        'margin-top': 0
                    }, 750);
                }
            };

            onScroll();
            $(scrolledElement).on('scroll', onScroll);
        });
    };

    //Z-INDEX POR POSICIONAMIENTO EN ITEMS DE RESULTADOS DE BUSQUEDA
    $.fn.zIndexFromPosition = function(){
        return this.each(function(){
            
            $(this)
                .children()
                .each(function(i){
                    $(this).css('z-index', 1000 - i);
                });

        });
    };

    $.fn.arrangeInColumns = function(){
        return this.each(function(){
            var thisContainer = $(this);

            var createContainer = function(){
                return $('<div class="newContainer">')
                    .css({
                        'float': 'left',
                        'width': '50%',
                        'max-width': '50%'
                    })
                    .appendTo(thisContainer);
            };

            var containerLeft = createContainer();
            var containerRight = createContainer();

            var onResize = function(){
                var items = null;

                if($(window).width() > 1280){
                    items =  thisContainer
                        .children()
                        .not('.newContainer');

                    if(items.length > 0){
                        items.each(function(i){
                            var thisItem = $(this)
                            .data('order', i)
                            .css('width', '100%');

                            if(containerLeft.outerHeight(false) > containerRight.outerHeight(false)){
                                thisItem.appendTo(containerRight);
                            }else{
                                thisItem.appendTo(containerLeft);
                            }
                        });
                    }
                }else{
                    items = [];

                    $(containerLeft).add(containerRight)
                        .children()
                        //.css('width', '50%')
                        .each(function(){
                            var currentItem = $(this);

                            items[currentItem.data('order')] = currentItem;
                        });

                    for(var i = 0; i < items.length; i ++){
                        thisContainer.append(items[i]);
                    }
                }
            };

            $(window).resize(onResize);

            onResize();
        });
    };

    /*PARA CORREGIR BUG DE CHROME EN FLIP*/
    $.fn.flipFix = function(callback){
        return this.each(function(){
            var thisElement = $(this);

            thisElement.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(event) {
                var thisElement = $(this);

                if(thisElement.parent().hasClass('flip')){
                    thisElement.css('overflow-y', 'auto');
                }
            });

            thisElement.find('.detalle-back')
                .on('click', function(){
                    thisElement.css('overflow-y', 'hidden');
                });
        });
    };
})(jQuery);