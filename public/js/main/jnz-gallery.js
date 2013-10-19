(function(jnz, $) {
    
    /*
     * This image gallery is based on work done by Florian Maul. Most of the logic is taken
     * as-is from his script. I only made modifications to make the gallery more reusable.
     * See http://www.techbits.de/2011/10/25/building-a-google-plus-inspired-image-gallery/
     */
    
    /*
TODO Make this gallery more responsive with regards to small screens.     
.imageContainer {
    margin: 7px;
    -webkit-user-select: none;
    position: relative;
    float: left;
    padding: 0px;
}

     */
    
    jnz.ImageGallery = function(opts) {
        var s = this;
        
        /** Utility function that returns a value or the defaultvalue if the value is null */
        var $nz = function(value, defaultvalue) {
            if( typeof (value) === undefined || value == null) {
                return defaultvalue;
            }
            return value;
        };
        
        /**
         * Distribute a delta (integer value) to n items based on
         * the size (width) of the items thumbnails.
         * 
         * @property len the sum of the width of all thumbnails
         * @property delta the delta (integer number) to be distributed
         * @property items an array with items of one row
         */
        var calculateCutOff = function(len, delta, items) {
            // resulting distribution
            var cutoff = [];
            var cutsum = 0;
    
            // distribute the delta based on the proportion of
            // thumbnail size to length of all thumbnails.
            for(var i in items) {
                var item = items[i];
                var fractOfLen = item.twidth / len;
                cutoff[i] = Math.floor(fractOfLen * delta);
                cutsum += cutoff[i];
            }
    
            // still more pixel to distribute because of decimal
            // fractions that were omitted.
            var stillToCutOff = delta - cutsum;
            while(stillToCutOff > 0) {
                for(i in cutoff) {
                    // distribute pixels evenly until done
                    cutoff[i]++;
                    stillToCutOff--;
                    if (stillToCutOff == 0) break;
                }
            }
            return cutoff;
        };
    
        /**
         * Takes images from the items array (removes them) as 
         * long as they fit into a width of maxwidth pixels.
         */
        var buildImageRow = function(maxwidth, items) {
            var row = [], len = 0;
    
            // Build a row of images until longer than maxwidth
            while(items.length > 0 && len < maxwidth) {
                var item = items.shift();
                row.push(item);
                len += (item.twidth + s.imgMargin);
            }
    
            // calculate by how many pixels too long?
            var delta = len - maxwidth;
    
            // if the line is too long, make images smaller
            if(row.length > 0 && delta > 0) {
    
                // calculate the distribution to each image in the row
                var cutoff = calculateCutOff(len, delta, row);
    
                for (var i in row) {
                    var pixelsToRemove = cutoff[i];
                    item = row[i];
    
                    // move the left border inwards by half the pixels
                    item.vx = Math.floor(pixelsToRemove / 2);
    
                    // shrink the width of the image by pixelsToRemove
                    item.vwidth = item.twidth - pixelsToRemove;
                }
            } else {
                // all images fit in the row, set vx and vwidth
                for(var i in row) {
                    item = row[i];
                    item.vx = 0;
                    item.vwidth = item.twidth;
                }
            }
    
            return row;
        };
    
        /**
         * Creates a new thumbail in the image area. An attaches a fade in animation
         * to the image. 
         */
        var createImageElement = function(parent, item) {
            var imageContainer = $('<div class="' + s.containerClass +'"/>');
    
            var overflow = $('<div/>');
            overflow.css('width', '' + $nz(item.vwidth, s.defaultHeight) + 'px');
            overflow.css('height', '' + $nz(item.theight, s.defaultHeight)+ 'px');
            overflow.css('overflow', 'hidden');
    
            var link = $('<a class="viewImageAction" href="#"/>');
            link.click(function() {
                alert('clicked');
                return false;
            });
            
            var img = $('<img/>');
            img.attr('src', item.src);
            img.attr('title', item.title);
            img.css('width', '' + $nz(item.twidth, s.defaultHeight) + 'px');
            img.css('height', '' + $nz(item.theight, s.defaultHeight) + 'px');
            img.css('margin-left', '' + (item.vx ? (-item.vx) : 0) + 'px');
            img.css('margin-top', '' + 0 + 'px');
            img.hide();
    
            link.append(img);
            overflow.append(link);
            imageContainer.append(overflow);
    
            // fade in the image after load
            img.bind('load', function () { 
                $(this).fadeIn(500); 
            });
    
            parent.find('.clearfix').before(imageContainer);
            item.el = imageContainer;
            return imageContainer;
        };
        
        /**
         * Updates an exisiting tthumbnail in the image area. 
         */
        var updateImageElement = function(item) {
            var overflow = item.el.find('div:first');
            var img = overflow.find('img:first');
    
            overflow.css('width', '' + $nz(item.vwidth, 120) + 'px');
            overflow.css('height', '' + $nz(item.theight, 120) + 'px');
    
            img.css('margin-left', '' + (item.vx ? (-item.vx) : 0) + 'px');
            img.css('margin-top', '' + 0 + 'px');
        };
        
        s.layout = function($container, theItems) {
            // reduce width by 1px due to layout problem in IE
            var containerWidth = $container.width() - 1;
            
            // Make a copy of the array
            var items = theItems.slice();
        
            // calculate rows of images which each row fitting into
            // the specified windowWidth.
            var rows = [];
            while(items.length > 0) {
                rows.push(buildImageRow(containerWidth, items));
            }  

            for(var r in rows) {
                for(var i in rows[r]) {
                    var item = rows[r][i];
                    if(item.el) {
                        // this image is already on the screen, update it
                        updateImageElement(item);
                    } else {
                        // create this image
                        createImageElement($container, item);
                    }
                }
            }
        };
        
        s.imgMargin = 14;
        s.containerClass = 'imageContainer';
        s.defaultHeight = 240;
        s.fadeInTime = 500;
        
        //Initialize gallery variables.
        (function(opts) {
            if (opts != undefined && opts != null) {
                s.imgMargin = $nz(opts.imgMargin, s.imgMargin);
                s.containerClass = $nz(opts.containerClass, s.containerClass);
                s.defaultHeight = $nz(opts.defaultHeight, s.defaultHeight);
                s.fadeInTime = $nz(opts.fadeInTime, s.fadeInTime);
            }
        })(opts);
    };
    
    jnz.GalleryItem = function() {
        var s = this;
        
        //General properties
        
        s.src = '';
        s.title = '';
        
        //Thumbnail dimensions
        
        s.theight = 0;
        s.twidth = 0;
        
        //Viewport adjustments for a justified row alignment
        
        s.vx = 0;
        s.vwidth = 0;
    };
    
    function theTest() {
        jnz.items = [{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-636-960.jpg',
            title: 'Hello',
            twidth: 120,
            theight: 180
        },{
            src: 'img/test/sample-960-636.jpg',
            title: 'Hello',
            twidth: 270,
            theight: 180
        }];
        
        jnz.theGallery = new jnz.ImageGallery();
        jnz.theGallery.layout($('#stuff'), jnz.items);
        
        $(window).resize(function() {
            // layout the images with new width
            jnz.theGallery.layout($("#stuff"), jnz.items);
        });
    }
    
})(window.jnz = window.jnz || {}, jQuery);
