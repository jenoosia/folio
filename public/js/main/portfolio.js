(function(jnz, $, ko, History) {
    
    jnz.albums;
    
    $(document).ready(function() {
        jnz.albums = new jnz.Albums();
        ko.applyBindings(jnz.albums, document.getElementById('albums'));
        jnz.albums.run();
    });
    
    /* UTILITIES */
    
    jnz.galleryBase = 'albums';
    
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).fadeIn(800) : $(element).hide();
        }
    };
    
    /* PORTFOLIO CODE */
    
    jnz.Albums = function() {
        var s = this;
        
        s.run = function() {
            var theState = History.getState();
            
            var urlArr = theState.url.split('?');
            
            //No query parameters mean business as usual.
            if (urlArr.length <= 1) {
                s.showGallery();
                return;
            }
            
            //Parse query into a parameter object.
            var queryParams = urlArr[1].split('&');
            var paramObj = {};
            $.each(queryParams, function(idx, paramString) {
                var paramArr = paramString.split('=');
                paramObj[paramArr[0]] = paramArr.length > 1 ? paramArr[1] : null;
            });
            
            //Actual routing.
            if (paramObj.album) {
                var theData = s.dataMap[paramObj.album];
                if (theData) {
                    s.showAlbum(theData, paramObj.image);
                } else {
                    s.showGallery();
                }
            } else {
                s.showGallery();
            }
        };
        
        History.Adapter.bind(window, 'statechange', s.run);
        
        s.albums = ko.observableArray([]);
        s.dataMap = {};
        
        $.each(jnz.GalleryData, function(idx, data) {
            s.dataMap[data.id] = data;
            s.albums.push(new jnz.AlbumCover(s, data));
        });
        
        s.isVisible = ko.observable(false);
        
        s.expandedAlbums = {};
        s.currentAlbum = null;
        
        s.showAlbum = function(data, imageId) {
            var albumId = data.id;
            
            //Hide the current expanded album if there is one.
            if (s.currentAlbum != null) {
                //TODO fix "back" button problem for the lightbox.
                // if (!imageId && s.currentAlbum.lightOpen) {
                    // $.colorbox.close();
                // }
                if (s.currentAlbum.data.id == albumId) {
                    return;
                }
                s.currentAlbum.isVisible(false);
                s.currentAlbum = null;
            }
            
            //Reuse existing expanded album.
            if (s.expandedAlbums[albumId]) {
                s.currentAlbum = s.expandedAlbums[albumId];
                s.isVisible(false);
                s.currentAlbum.isVisible(true);
                s.currentAlbum.navigateToImage(imageId);
                return;
            }
            
            var $album = $('[data-template=album]').clone();
            $album.removeAttr('data-template').attr('id', albumId);
            $('#albumPlaceholder').before($album);
            
            var newAlbum = new jnz.AlbumView(s, data);
            
            ko.applyBindings(newAlbum, $album[0]);
            
            newAlbum.initAlbum($album, imageId);
            
            s.currentAlbum = newAlbum;
            s.expandedAlbums[albumId] = s.currentAlbum;
            
            s.isVisible(false);
        };
        
        s.showGallery = function() {
            if (s.currentAlbum != null) {
                s.currentAlbum.isVisible(false);
                s.currentAlbum = null;
            }
            s.isVisible(true);
        }
        
        s.historyPush = function(id, title) {
            History.pushState(null, title ? title : 'Portfolio - Jensen Ching Photography', id ? '?album=' + id : '?');
            try { ga('send', 'pageview'); } catch (e) {}
        }
    };
    
    jnz.AlbumCover = function(parent, data) {
        var s = this;
        s.parent = parent;
        s.data = data;
        
        s.albumImage = jnz.galleryBase + '/' + data.folderThumbs + '/' + 
            data.imagePrefix + jnz.GalleryConst.thumbMidfix + pad(data.albumCover, 4) + 
            jnz.GalleryConst.defaultExt;
        
        s.showAlbum = function() {
            s.parent.historyPush(s.data.id, s.data.name + ' - Jensen Ching Photography');
        };
    };
    
    jnz.AlbumView = function(parent, data) {
        var s = this;
        s.parent = parent;
        s.data = data;
        
        s.$album = null;
        
        s.isVisible = ko.observable(false);
        s.hasLoaded = ko.observable(false);
        s.numLoaded = ko.observable(0);
        
        s.loadingText = ko.computed(function() {
            var pctProgress = Math.round((s.numLoaded() / s.data.totalImages) * 100);
            return '' + pctProgress + '%'; 
        });
            
        s.photos = ko.observableArray([]);
        
        s.goBack = function() {
            s.parent.historyPush();
        };
        
        s.lightOpen = false;
        s.lightbox = null;
        
        s.navigateToImage = function(imageId) {
            if (!isNumber(imageId)) {
                return;
            }
            $('a[data-image-id=' + imageId + ']').click();
        };
        
        s.initAlbum = function(album, imageId) {
            $album = album;
            
            $album.imagesLoaded().done(function() {
                s.hasLoaded(true);
                $album.find('.photos').masonry({
                    itemSelector: '.item',
                    gutter: 10
                });
                s.lightbox = $album.find('.photos>.item>a').colorbox({
                    rel: s.data.id,
                    maxWidth: '95%',
                    maxHeight: '95%',
                    onComplete: function() {
                        s.lightOpen = true;
                        History.pushState(null, s.data.name + ' - Jensen Ching Photography', 
                        '?album=' + s.data.id + '&image=' + $(this).attr('data-image-id'));
                        try { ga('send', 'pageview'); } catch (e) {}
                    },
                    onClosed: function() {
                        s.lightOpen = false;
                        History.pushState(null, s.data.name + ' - Jensen Ching Photography',
                        '?album=' + s.data.id);
                    }
                });
                
                s.navigateToImage(imageId);
            }).progress(function(instance, image) {
                s.numLoaded(s.numLoaded() + 1);
            });
            
            s.isVisible(true);
        };
        
        for (var i = 1; i <= s.data.totalImages; i++) {
            s.photos.push(new jnz.AlbumThumb(s, i));
        }
    }
    
    jnz.AlbumThumb = function(parent, theNumber, data) {
        var s = this;
        s.parent = parent;
        s.theNumber = theNumber;
        
        s.fullUrl = jnz.galleryBase + '/' + parent.data.folderFull + '/' + 
            parent.data.imagePrefix + jnz.GalleryConst.fullMidfix + pad(theNumber, 4) +
            jnz.GalleryConst.defaultExt;
        s.thumbUrl = jnz.galleryBase + '/' + parent.data.folderThumbs + '/' + 
            parent.data.imagePrefix + jnz.GalleryConst.thumbMidfix + pad(theNumber, 4) +
            jnz.GalleryConst.defaultExt;
    };
    
})(window.jnz = window.jnz || {}, jQuery, ko, window.History);
