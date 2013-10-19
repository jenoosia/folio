(function(jnz, $) {
    
    $(document).ready(function() {
        jnz.heroSection = new jnz.HeroSection();
        jnz.heroSection.init();
    });
    
    jnz.heroSection = null;
    
    jnz.HeroSection = function() {
        var s = this;
        
        s.images = {};
        s.imageIds = [];
        s.currentImageIndex = 0;
        s.intervalId = null;
        
        s.init = function() {
            var $slides = $('[data-image]');
            $slides.hide();
            
            $('[data-image]>figcaption').addClass('hide');
            
            $slides.each(function(idx, elem) {
                var $elem = $(elem);
                var imageId = $elem.attr('data-image');
                s.images[imageId] = $elem;
                s.imageIds.push(imageId);
                
                /* TODO loading
                $elem.find('img').load(function() {
                    console.log('Loaded ' + imageId);
                });
                */
                
                var $figcap = $elem.find('figcaption');
                
                $elem.find('.info-handle').hover(function() {
                    $figcap.removeClass('hide');
                }, function() {
                    $figcap.addClass('hide');
                }).click(function() {
                    $figcap.removeClass('hide');
                });
            });
            
            s.doSlideTransition();
            s.intervalId = setInterval(s.doSlideTransition, 5000);
            
            $(window).resize(function() {
                s.adjustMaxHeight();
            });
            s.adjustMaxHeight();
        };
        
        s.doSlideTransition = function() {
            if (s.currentImageIndex > 0) {
                s.images[s.imageIds[s.currentImageIndex - 1]].fadeOut(600, doIt);
            } else {
                s.images[s.imageIds[s.imageIds.length - 1]].fadeOut(600, doIt);
            }
            
            function doIt() {
                s.images[s.imageIds[s.currentImageIndex]].fadeIn(600);
            
                if (s.currentImageIndex + 1 == s.imageIds.length) {
                    s.currentImageIndex = 0;
                } else {
                    s.currentImageIndex++;
                }
            }
        };
    
        s.adjustMaxHeight = function() {
            var windowHeight = $(window).height();
            var headerHeight = $('header').height();
            var heroPad = parseInt($('.hero-container').css('padding-top'));
            var extraOffset = 10;
            
            $('[data-image]>img').css('max-height', (windowHeight - headerHeight - heroPad - extraOffset) + 'px');
        };
    };
    
})(window.jnz = window.jnz || {}, jQuery);
