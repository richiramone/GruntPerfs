var SITE = SITE || {};

SITE.fileInputs = function() {
    var $this = $(this),
        $val = $this.val(),
        valArray = $val.split('\\'),
        newVal = valArray[valArray.length-1],
        $button = $this.siblings('.button'),
        $fakeFile = $button.find('.file-holder');
    if(newVal !== '') {
        $fakeFile.text(newVal);
    }
};


var _galFulHeight = $(window).height();
var _galFulWidth = $(window).width();

//global variable con metodi per gestire la domination
var pageController;

$(function () {

    function getUrlVars() {
        var vars = {};
        /*var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });*/
        return vars;
    }

    // cache container
    var $html = $('html'),
        $container = $('#container'),
        $header = $('#header'),
    // $body = $('body'),
        $wrapper = $('#wrapper');


    // topFix initialization
    //////////////////////////////////////////////////////////////////////////////
    var $topFix = $('.topFix');
    $topFix.each(function(index){
        var $this = $(this);
        //salviamo le posizioni relative al wrapper
        $this.data('initialTop', $this.position().top);
        if($this.hasClass('break')){
            $this.data('topOffset', $header.height());
            //aggiungo padding al content
            $('#content').css('padding-top', 40);
        }
        if(!$this.attr('id')){
            $this.attr('id', 'topfix-'+index);
        }
        //placeholder static di riferimento
        $this.before('<div class="plsh" style="height:0"></div>');
    });

    /* detect ipad */
    if (navigator.userAgent.toLowerCase().indexOf("ipad") > -1) {
        $html.addClass('ipad');
    }

    // DOMINATION
    //////////////////////////////////////////////////////////////////////////////
    pageController = {
        addDomination: function(){
            $html.addClass('domination');
            $wrapper.addClass('container').removeClass('full-container');
            $('.wide-carousel ul').trigger('updateSizes');
        },
        removeDomination: function(){
            $html.removeClass('domination');
            $wrapper.removeClass('container').addClass('full-container');
            $('.wide-carousel ul').trigger('updateSizes');
        },
        refreshIsotope:function() {
            if ($container.length) {
                $container.isotope('reloadItems');
            } else if ($('#list-articles').length) {
                $('#list-articles').isotope('reloadItems');
            }
        }
    };

    if ($('.corner-stamp').length>0){
        // initialize isotope
        $.Isotope.prototype._masonryResizeChanged = function() {
            return true;
        };

        $.Isotope.prototype._masonryReset = function() {
            // layout-specific props
            this.masonry = {};
            this._getSegments();
            var i = this.masonry.cols;
            this.masonry.colYs = [];
            while (i--) {
                this.masonry.colYs.push( 0 );
            }

            if ( this.options.masonry.cornerStampSelector ) {
                var $cornerStamp = this.element.find( this.options.masonry.cornerStampSelector ),
                    stampWidth = $cornerStamp.outerWidth(true) - ( this.element.width() % this.masonry.columnWidth ),
                    cornerCols = Math.ceil( stampWidth / this.masonry.columnWidth ),
                    cornerStampHeight = $cornerStamp.outerHeight(true);
                for ( i = Math.max( this.masonry.cols - cornerCols, cornerCols ); i < this.masonry.cols; i++ ) {
                    this.masonry.colYs[i] = cornerStampHeight;
                }
            }
        };
    }
    $container.imagesLoaded( function(){
        $container.isotope({
            itemSelector: '.item',
            masonry: {
                columnWidth: 320,
                cornerStampSelector: '.corner-stamp'
            },
            onLayout: function($elems) {
                // Add exponential z-index for dropdown cropping
                $elems.each(function(e){
                    $(this).css({ zIndex: ($elems.length - e) });
                });
            }
        });
    });

    // filter items when filter link is clicked
    $('#filters a').click(function() {
        var $this = $(this);
        if ($this.hasClass('selected')) { return false; }
        $('#filters .selected').removeClass('selected');
        $this.addClass('selected');

        location.href = $this.attr('href');
        //$container.isotope({ filter: selector }).isotope('reloadItems');
        return false;
    });



    // FILTRO LIST-ARTICLES
    //////////////////////////////////////////////////////////////////////////////
    var $list_articles = $('#list-articles');
    // initialize isotope

    $list_articles.imagesLoaded( function(){
        $list_articles.isotope({
            itemSelector: 'article:not(.corner-stamp)',
            masonry: {
                columnWidth: 320,
                cornerStampSelector: '.corner-stamp'
            },
            onLayout: function($elems) {
                // Add exponential z-index for dropdown cropping
                $elems.each(function(e){
                    $(this).css({ zIndex: ($elems.length - e) });
                });
            }
        });
    });

    // filter items when filter link is clicked
    $('.list-filters a').click(function(){
        var $this = $(this);
        if ( $this.parent('li').hasClass('active') ) {return false;}
        var selector = $this.attr('data-filter');
        // remove
        $('.list-filters .active a').removeAttr('class');
        $('.list-filters .active').removeClass('active');
        // add
        $this.parent('li').addClass('active');
        $this.addClass(selector);

        location.href = $this.attr('href');
        //$list_articles.isotope({ filter: selector });
        return false;
    });


    // SHARE
    //////////////////////////////////////////////////////////////////////////////
    if ($('.share').length>0){
        $('.share').click(function(e){
            e.preventDefault();
        });
        $('.tooltip a').hover(
            function() {
                $( this ).parents('article').addClass( "hover" );
            }, function() {
                $( this ).parents('article').removeClass( "hover" );
            });

        $('.share').tooltip({
            position: "center right",
            relative: true
        }).dynamic({
            left: {
                direction: 'left',
                offset: [0, 0],
                relative: true
            }
        });
    }

    // FOGLIA FORM FEEDBACK
    /////////////////////////////////////////////////////////////////////////////
    if ($('.fdbk').length>0){
        $('.fdbk').click(function(e){e.preventDefault();}).popover({
            html : true,
            placement : 'top',
            offset: -50,
            content: function() {
                return $('#popover_feedback').html();
            }
        });

        $('.file-wrapper input[type=file]').live( 'change focus click', SITE.fileInputs);

        $('.popover-content .close').live('click',function(e){
            e.preventDefault();
            $(this).parents('.popover').prev().popover('hide');
        });
    }
  



    // FOGLIA RELATED
    /////////////////////////////////////////////////////////////////////////////
    if ($('#related').length>0){
        var $related = $('#related');
        var $relatedul = $related.children().children('ul');
        //var $relatedli = $relatedul.children('li');
        $relatedul.carouFredSel({
            direction : "up",
            auto : false,
            circular: false,
            items: {
                visible: 1
            },
            onCreate:function(){
                var tot = $(this).children('li').size();
                $(this).trigger("currentVisible", function() {
                    $(this).trigger("currentPage", function(pos){
                        var $grandpa =$(this).parent().parent();
                        if ($('.counter .index').length>0) {
                            $grandpa.find('.counter .index').html(pos+1);
                        }
                    });
                });
                $(this).parent().parent().find('.counter .tot').html('/'+tot);
            },
            scroll:{
                items:1,
                onBefore: function(){
                    $(this).trigger("currentPage", function(pos){
                        var $grandpa =$(this).parent().parent();
                        $grandpa.find('.counter .index').html(pos+1);
                    });
                }
            },
            prev: function(){return $(this).parents('.wrapper').find(".prev");},
            next: function(){return $(this).parents('.wrapper').find(".next");}
        });


        // $relatedul.width(Math.floor($relatedli.length*($relatedli.outerWidth()+30)));
        $(window).resize(function(){
            var w = Math.floor((($(window).width()-600)/2)-23);
            var w2 = Math.floor((($(window).width()-960)/2)+318);
            var w3 = 334;
            if($(window).width() >= 1281){
                $('#related').width(w);
            } else  if($(window).width() <= 960) {
                $('#related').width(w3);
            } else {
                $('#related').width(w2);
            }
        });
    }



    // WIDGET NUOVO SU
    /////////////////////////////////////////////////////////////////////////////
    if ($('#nuovo-su').length>0){
        // carousel chiuso
        $('#nuovo-su ul.news-list').carouFredSel({
            scroll    : {
                items     :1,
                duration  : 800
            },
            direction : "up",
            auto      : {
                pauseOnHover: "resume",
                progress    : {
                    bar     : "#nuovo-su .timer",
                    updater : function(perc) { $(this).css('width', (100-perc)+'%'); },
                    interval: 25
                }
            }
        });
        // counter animato
        var counter = $('#nuovo-su p.counter'),
            nobj = parseInt(counter.attr('data-counter')),
            single = nobj < 10,
            i = 0,
            interval;
        counter.html(i);
        interval = setInterval(function() {
            var zero = '';
            if ((!single) && (i < 9)) { zero = '0'; }
            counter.html(zero+(++i));
            if (i === nobj) {
                clearInterval(interval);
            }
        }, 100);
        // apertura + paginazione da aperto
        // TO-DO
    }
  
  


    // POST SLIDER
    /////////////////////////////////////////////////////////////////////////////
    function loadImage(imgSrc, $img){
        var img = new Image();
        $img.addClass('loading');
        $(img)
            .load(function () {
                $img.attr("src", imgSrc);
                $img.removeClass('loading');
            })
            .error(function () {
                // notify the user that the image could not be loaded
            })
            .attr('src', imgSrc).css({'display':'none'});
    }
//   function getCenterThumb($carousel) {
//     var $visible = $carousel.triggerHandler( 'currentVisible' ),
//       center = Math.floor($visible.length / 2);
//     if($visible.length<3) {
//       center=0;
//     }
//     return center;
//   }
  
  
  


    if ($('.prev-gallery ul.thumbs').length>0){
        function updateBigImage($gallery, $item){
            var $bigImage = $gallery.find('.big-image');
            if($bigImage.length){
                $bigImage.find('a').attr('href', $item.find('.caption h2 a').attr('href'));
                loadImage($item.find('a:first').attr('href'), $bigImage.find('img:first'));
            }

            var $abstract = $item.parents('article').find('.abstract'),
                $caption = $item.find('.caption'),
                $oldItem = $gallery.find('li.active'),
                $oldItemCaption = $oldItem.find('.caption'),
                $oldCaption = $abstract.find('.caption');

            //append old new caption old li active item
            if($oldItemCaption.length === 0 && $oldCaption.length){
                $oldCaption.appendTo($oldItem);
            }

            //add and remove active class to/from li items
            $oldItem.removeClass('active');
            $item.addClass('active');

            //prepend new caption to abstact
            if($abstract.length && $caption.length){
                $abstract.html('');
                $caption.prependTo($abstract);
            }
        }
        $('.prev-gallery ul.thumbs').each(function(){
            var visibleItems = 3;
            if($(this).parents('.tmb-launch').length){
                visibleItems = 6;
            }
            if($(this).children('li').size() <= visibleItems){
                $(this).data("carouselDisabled", true);
            }
            $(this).carouFredSel({
                circular: true,
                infinite: true,
                auto: false,
                responsive: true,
                items: {visible: visibleItems},
                next: function(){return $(this).parents('.prev-gallery').find(".gallery-nav .next");},
                onCreate:function(){
                    var tot = $(this).children('li').size();
                    $(this).parents('.prev-gallery').find('.gallery-nav .tot').text(tot);
                    $(this).parents('.prev-gallery').find('.gallery-nav .counter').text('1');
                    $(this).find('li').each(function(index){
                        $(this).addClass('n'+index);
                    });
                    $(this).find('li:first').addClass('active');
                },
                scroll:{
                    duration:400,
                    easing:"swing",
                    items: 1,
                    onBefore: function(data){
                        $(this).trigger("currentPosition", function(pos){
                            $(this).parents('.prev-gallery').find('.gallery-nav .counter').text(pos+1);
                        });
                        //$(data.items.old[0]).removeClass('active');
                        //$(data.items.visible[0]).addClass('active');
                        var item = $(data.items.visible[0]);
                        updateBigImage($(this).parents('.prev-gallery'), item);
                    },
                    onAfter: function () {
                        $(this).trigger("currentPosition", function (pos) {
                            var _pos = pos + 1;
                            refreshCode("slider/" + _pos + "/");
                        });
                    }
                }
            });
        });

        $('.prev-gallery ul.thumbs li a').click(function(){
            var liClass = $(this).parents('li').attr( 'class' ),
                $gallery = $(this).parents('.prev-gallery'),
                $thumbs = $gallery.find('.thumbs');

            var $details = $(this).parent().find('.item-details');
            if($details.length){
                $gallery.find('.big-image header .container').html($details.html());
            }
            if($thumbs.data("carouselDisabled")===true){
                updateBigImage($gallery, $(this).parents('li'));
            }else{
                $thumbs.trigger( 'slideTo', [parseInt(liClass.substr(1), 10)] );
            }
            return false;
        });
    }
  
  

    if($('.wide-carousel').length){
        $('.wide-carousel ul').each(function(){
            var counter = false;
            var itemCount = $(this).find('li').length;
            $(this).carouFredSel({
                width: '100%',
                auto : false,
                items: {
                    visible: 3,
                    start: -1
                },
                onCreate:function(){
                    $(this).parents('.wide-carousel').addClass('created');
                },
                scroll: {
                    items: 1,
                    duration: 600,
                    timeoutDuration: 3000,
                    onBefore: function(data){
                        $(data.items.old[1]).removeClass('active');
                        $(data.items.visible[1]).addClass('active');
                    },
                    onAfter: function () {
                        $(this).trigger("currentPosition", function (pos) {
                            if (counter == true) {
                                var _pos = pos + 2;
                                if (_pos > itemCount) {
                                    _pos = 1;
                                }
                                refreshCode("slider/" + _pos + "/");
                            } else {
                                counter = true;
                            }
                        });
                    }
                },
                prev: function(){return $(this).parents('.wide-carousel').find(".prev");},
                next: function(){return $(this).parents('.wide-carousel').find(".next");}
            });
        });
    }


    // FOGLIA SLIDER
    /////////////////////////////////////////////////////////////////////////////
    if ($('.slider').length>0){
        $('.slider ul.slides').carouFredSel({
            width: '100%',
            circular: true,
            infinite: true,
            auto: false,
            responsive: true,
            swipe: {
                onMouse: true,
                onTouch: true
            },
            prev: function(){return $(this).parent().parent().find(".prev");},
            next: function(){return $(this).parent().parent().find(".next");},
            onCreate:function(){
                var tot = $(this).children('li').size();
                $(this).trigger("currentVisible", function( items ) {
                    $(this).trigger("currentPosition", function(pos){
                        var $grandpa =$(this).parent().parent();
                        var $caption = $(this).parent().parent().find('.caption');
                        if ($caption.length>0) {
                            var caption =items.find('figcaption').html();
                            $caption.html(caption);
                        }
                        if ($('.counter .index').length>0) {
                            var _pos = parseInt(pos) + 1;
                            if (_pos<10) {_pos = '0'+_pos;}
                            $grandpa.find('.counter .index').html(_pos);
                        }
                    });
                });
                if (tot<10) {tot = '0'+tot;}
                $(this).parent().parent().find('.counter .tot').html('/'+tot);
            },
            scroll:{
                duration:900,
                easing:"swing",
                pauseOnHover:true,
                onAfter: function(){
                    var $caption = $(this).parent().parent().find('.caption');
                    $(this).trigger("currentVisible", function( items ) {
                        $(this).trigger("currentPosition", function(pos){
                            var $grandpa =$(this).parent().parent();
                            var _pos = parseInt(pos) + 1;
                            if ($('.counter .index').length>0) {
                                if (_pos<10) {_pos = '0'+_pos;}
                                $grandpa.find('.counter .index').html(_pos);
                            }
                            if ($caption.length>0) {
                                var caption =items.find('figcaption').html();
                                $caption.html(caption);
                            }
                            refreshCode("slider/" + _pos + "/");
                        });
                    });
                }
            }
        });
    }

    if ($('.fullscreen').length>0){
        $(".fullscreen").show();
    }



    $(".fullscreen").click(function(e) {
        e.preventDefault();
        $("#bannerSpTop").hide();
        var lhref = $(this).attr('href');
        var galleryPosition = 0;
        var dataPosition = $(this).attr('data-position');
        if (dataPosition != undefined && dataPosition != '') {
            galleryPosition = dataPosition;
        }
        
        var _zindex = 999999999;
        if (navigator.userAgent.toLowerCase().indexOf("ipad") > -1) {
            _zindex = 1000;
        }
        
        try{
            if ($(window).width() != undefined && $(window).height() != undefined && $(window).width() != 0 && $(window).height() != 0) {
                $('iframe.fancybox-iframe').attr('style', 'height:' + $(window).height() + 'px');
            }
        } catch (e) {}
        $.fancybox({
            autoSize: false,
            fitToView : true,
            preload:1,
            modal:true,
            href : lhref,
            type: 'iframe',
            helpers : {
                overlay : {
                    css : {
                        'background' : 'rgba(0, 0, 0, 1)',
                        'z-index' : _zindex
                    }
                }
            },
            closeBtn : false,
            width:'100%',
            height:'100%',
            minHeight:'768px',
            minWidth:'768px',
            padding : 0,
            margin: 0,
            autoDimensions:false,
            beforeShow: function() {
                try{
                    if ($(window).width() != undefined && $(window).height() != undefined && $(window).width() != 0 && $(window).height() != 0) {
                        $('iframe.fancybox-iframe').attr('style', 'height:' + $(window).height() + 'px;overflow:hidden;');
                    }
                } catch (e) {}
                $('#fullscreen .full-slider').css({'height': $(window).height()+'px','line-height': ($(window).height()-120)+'px'});
                $("#fullscreen .close").click(function(e){
                    e.preventDefault();
                    $.fancybox.close();
                    var uri = top.location.toString();
                    if (uri.indexOf("#") > 0) {
                      var clean_uri = uri.substring(0, uri.indexOf("#"));
                      top.history.replaceState({}, top.title, clean_uri);
                    }
                });
            }
        });
        // Tracking events
        try {
            location.hash = "/fullscreen/" + galleryPosition + "/" + 1 + "/";
            refreshCode('');
        } catch (er) { }
        _gaq.push(['_trackEvent', 'fullscreen', 'apertura', 'wired', 1, true]);
    });




    // MENU
    /////////////////////////////////////////////////////////////////////////////
    function possubmenu()  {
        $('#header .open .active .submenu').each(function(){
            var $submenu = $(this);
            var w = Math.round($submenu.width());
            var pp = Math.round($submenu.parent().position().left);
            var pw = Math.round($submenu.parent().width());
            var gpw = Math.round($submenu.parent().parent().width());
            if ((w/2)>pp) { return; }
            else if ((pp+pw+(w/2))>gpw) {$submenu.addClass('pos-right').css("left",pp+(pw)-w+6);  }
            else  {$submenu.addClass('pos-center').css("left",pp+(pw/2)-(w/2));  }
        });
    }
    if ($('#header .open .active .submenu').length>0){
        possubmenu();
        window.onresize = function () {
            possubmenu();
        };

    }




    // DROPDOWN SCROLL CONTROL e MODULO ABBONATI
    /////////////////////////////////////////////////////////////////////////////

    var $headerDropdown = $('#header .secondary .dropdown');
    $headerDropdown.data('scrollOffsetOnShow', 0);
    $headerDropdown.on('show.bs.dropdown', function () {
        $(this).data('scrollOffsetOnShow', $(document).scrollTop());
    });

    $header.data('scrollOffsetOnShow', 0);
    $('.search-bar-toggle, #search-bar .close').click(function(){
        $html.toggleClass('search-bar-open');
        if($html.hasClass('search-bar-open')){
            $header.data('scrollOffsetOnShow', $(document).scrollTop());
            $('#search').focus();
        }
        return false;
    });

    // hot topic click
    var $hotTopic = $('#header .dropdown-hot-topic');
    var $showTopic = $('#header #topics');
    $hotTopic.click(function(e){
        if ($showTopic.find('.label-open').is(':visible')) {
            $showTopic.click();
        }
        e.preventDefault();
        return false;
    });

    var $footerDropdown = $('#abbonati .secondary .dropdown');
    $footerDropdown.data('scrollOffsetOnShow', 0);

    $('.footer-dropdown-toggle').click(function(){
        if (!$footerDropdown.hasClass('open')) {
            $footerDropdown.trigger($.Event('show.bs.dropdown'));
            $footerDropdown.addClass('open').trigger('shown.bs.dropdown');
        }
        return false;
    });


    $footerDropdown.on('show.bs.dropdown', function () {
        $(this).data('scrollOffsetOnShow', $(document).scrollTop());
        $('#abbonati').addClass('dropdown-open');
        if($('#abbonati .dropdown-menu .paged-carousel').length){
            if($('#abbonati .dropdown-menu .caroufredsel_wrapper').length === 0){
                setTimeout(function(){

                    $('#abbonati .paged-carousel ul.carousel').carouFredSel({
                        width: '100%',
                        auto : false,
                        items: {visible: 1},
                        responsive: true,
                        scroll: { items: 1 },
                        onCreate:function(){
                            $(this).parents('.paged-carousel').addClass('created');

                            $('#abbonati .paged-carousel .next').live('click',function(){
                                $(this).parents('.paged-carousel').find('ul').trigger('next');
                                return false;
                            });
                            $('#abbonati .paged-carousel .prev').live('click',function(){
                                $(this).parents('.paged-carousel').find('ul').trigger('prev');
                                return false;
                            });
                            $('#abbonati .paged-carousel .pages a').live('click',function(e){
                                e.stopPropagation();
                                return true;
                            });
                        },
                        //prev: function(){return $(this).parents('.paged-carousel').find(".prev");},
                        //next: function(){return $(this).parents('.paged-carousel').find(".next");},
                        pagination: {
                            container: function(){return $(this).parents('.paged-carousel').find(".pages");}
                        }
                    });
                }, 50);
            }else{
                setTimeout(function(){
                    //$('#abbonati .paged-carousel ul.carousel').trigger('configuration', ["items.visible", 1]);
                    $('#abbonati .paged-carousel ul.carousel').trigger('updateSizes');
                }, 50);
            }
        }
    }).on('hide.bs.dropdown', function () {
        $('#abbonati').removeClass('dropdown-open');
    });



    var search = getUrlVars()["s"];
    if(search){
        $('.search-bar-toggle').click();
    }



    // FUNZIONI ALLO SCROLL
    //////////////////////////////////////////////////////////////////////////////

    $(window).scroll(function () {
        var docViewTop = $(document).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        if(docViewTop > 0) {
            $('#header,.nav-foglia').addClass('scrolling');
        }else {
            $('#header,.nav-foglia').removeClass('scrolling');
        }

        // AGGANCIA SU SIDEBAR
        if ($('.lcktop').length>0) {
            $('.lcktop').each(function(){
                var $scr = $(this), $scrfig = $scr.children(), scrh =$scr.offset(), $sep = $scr.next('');
                if (docViewTop > (scrh.top)) {
                    if (!($scrfig.hasClass('fixed-top'))) {
                        $scrfig.addClass('fixed-top').css({top:0});
                    }
                } else {
                    if ($scrfig.hasClass('fixed-top')) {
                        $scrfig.removeClass('fixed-top');
                    }
                }
                if (docViewTop > (scrh.top+$sep.height())) {
                    $scrfig.removeClass('fixed-top').addClass('relative').css({top:$sep.height()});
                } else {
                    $scrfig.removeClass('relative');
                }
            });
        }

        if($('.nav-canale,.nav-foglia').length > 0){
            var $navcanale =  $('.nav-canale,.nav-foglia');
            var footerH = $('#footer').outerHeight() +20;
            var footerTop = $('#footer').offset().top -72;

            if(docViewTop+208  >= footerTop){
                $navcanale.addClass('nav-absolute').css('bottom',footerH).parent().addClass('static');
            }else {
                $navcanale.removeClass('nav-absolute').css('bottom','auto').parent().removeClass('static');
            }
        }

        if($('#main-article').length > 0){
            var $sclscrll =$('#sclscrll div');
            var $related = $('#related');

            var footerArtTop = $('#main-article footer').offset().top;
            var footerArtBottom = footerArtTop + $('#main-article footer').height();
            var footerTop = $('#footer').offset().top;
            //var relatedin= ($('#main-article footer').offset().top );


            if(docViewTop > 0) {
                $sclscrll.fadeIn();
            }else {
                $sclscrll.fadeOut();
            }

            if (footerTop <=  docViewBottom){
                $related.removeClass('fixed').css('bottom',70+$('#footer').height());
            }else {
                if (footerArtBottom <= docViewBottom){
                    $related.addClass('fixed').css('bottom',70);
                    var w = Math.floor((($(window).width()-600)/2)-23);
                    var w2 = Math.floor((($(window).width()-960)/2)+318);
                    var w3 = 334;
                    if($(window).width() >= 1281){
                        $('#related').width(w);
                    } else  if($(window).width() <= 960) {
                        $('#related').width(w3);
                    } else {
                        $('#related').width(w2);
                    }
                }else {
                    $related.width(0);
                }
            }
        }

        $topFix.each(function(){
            var $this = $(this), top=0,
                $plsh = $this.prev('.plsh');
            if($this.data('topOffset')){
                top=$this.data('topOffset');
            }

            if(docViewTop+top>$plsh.offset().top){
                if(!$this.hasClass('affix')){
                    $this.css({top:top}).addClass('affix');
                    $html.addClass($this.attr('id')+'-fixed');
                    $plsh.css({'height': $this.outerHeight()+'px'});
                }
            }else{
                if($this.hasClass('affix')){
                    $html.removeClass($this.attr('id')+'-fixed');
                    $this.css({top:0}).removeClass('affix');
                    $plsh.css({'height': 0});
                }
            }
        });

        if ($headerDropdown.hasClass('open') && Math.abs(docViewTop-$headerDropdown.data('scrollOffsetOnShow')) > 200) {
            $headerDropdown.trigger(e = $.Event('hide.bs.dropdown'));
            $headerDropdown.removeClass('open').trigger('hidden.bs.dropdown');
        }
        if ($footerDropdown.hasClass('open') && Math.abs(docViewTop-$footerDropdown.data('scrollOffsetOnShow')) > 300) {
            $footerDropdown.trigger(e = $.Event('hide.bs.dropdown'));
            $footerDropdown.removeClass('open').trigger('hidden.bs.dropdown');
        }
        if ($html.hasClass('search-bar-open') && Math.abs(docViewTop-$header.data('scrollOffsetOnShow')) > 100) {
            $html.removeClass('search-bar-open');
        }


    });


    // INIZIALIZZAZIONE ELEMENTI LOCKTOP
    //////////////////////////////////////////////////////////////////////////////
    var $lcktop = $('.lcktop');

    function locktopScroll(){
        var docViewTop = 0;//$(document).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        $lcktop.each(function(){
            var $scr = $(this), $scrfig = $scr.children(), scrh =$scr.offset(), $sep = $scr.next('');
            if (docViewTop > (scrh.top)) {
                if (!($scrfig.hasClass('fixed-top'))) {
                    $scrfig.addClass('fixed-top').css({top:0});
                }
            } else {
                if ($scrfig.hasClass('fixed-top')) {
                    $scrfig.removeClass('fixed-top');
                }
            }
            if (docViewTop > (scrh.top+$sep.height())) {
                $scrfig.removeClass('fixed-top').addClass('relative').css({top:$sep.height()});
            } else {
                $scrfig.removeClass('relative');
            }
        });
    }



    /* funzione da richiamare quando viene modificata la struttura dell'aside $(window).trigger('locktopInit'); */
    function locktopInit(){
        if ($lcktop.length>0) {
            $('.scont').each(function(){
                var $this = $(this);
                var rowHeight = $this.parents('.row:first').height();
                var sepNumber = $this.find('.sdbspc').length;
                var contHeight = 0;
                $this.find('.lcktop').each(function(){
                    var $scr = $(this);
                    $scr.height($scr.children().outerHeight());
                });
                $this.children(':not(.sdbspc,.label)').each(function(){
                    contHeight+=$(this).outerHeight();
                });
                var sepHeight = (((rowHeight-contHeight)/sepNumber)-20);
                $this.find('.lcktop').each(function(){
                    var $scr = $(this);
                    $scr.next('.sdbspc').css({height:sepHeight});
                });
            });
            locktopScroll();
        }
    }
    if ($lcktop.length>0) {
        $lcktop.each(function(){
            $(this).parents('.aside').addClass('scont').addClass('relative');
        });
        $(window).on('scroll', locktopScroll);
        $(window).on('load', locktopInit);
        $(window).on('locktopInit', locktopInit);
    }



    // LIVE BLOGGING
    //////////////////////////////////////////////////////////////////////////////
    if ($('#live').length>0){
        $('#live #tab_link a').click(function(e){
            var tab = $(this).attr('href');
            $('#live #tab_link a.active').removeClass('active');
            $(this).addClass('active');
            $('#live #tab li.active').removeClass('active');
            $('#live #tab li'+tab).addClass('active');
            e.preventDefault();
            return false;
        });
    }

    // LIVE BLOGGING
    //////////////////////////////////////////////////////////////////////////////
    if ($('#autorizzazioni').length>0){
        $('#autorizzazioni label').click(function(e){
            $(this).toggleClass('checked');
            if ($(this).hasClass('checked')){
                $(this).find('input').attr('checked', 'checked');
            } else {
                $(this).find('input').removeAttr('checked');
            }
            e.preventDefault();
            return false;
        });
    }



    // LIVE BLOGGING
    //////////////////////////////////////////////////////////////////////////////
    if ($('#topic_list').length>0){
        $('#topic_list .carousel ol').carouFredSel({
            auto : false,
            responsive: true,
            scroll: {
                items: 3
            },
            items: {
                visible: {
                    min: 3,
                    max: 4
                }
            },
            prev: function(){return $(this).parents('.carousel').find(".prev");},
            next: function(){return $(this).parents('.carousel').find(".next");}
        });
        $('#topic_list .carousel ol').trigger("linkAnchors", ["#topic_list menu", "a"]);
    }



    // WIRED EVENTI PROGRAMMA
    //////////////////////////////////////////////////////////////////////////////
    if ($('.page-wiredeventi-programma').length>0){
        var $programma = $('#wiredeventi-programma');
        $programma.imagesLoaded( function(){
            $programma.isotope({
                itemSelector: '.item',
                onLayout: function($elems) {
                    // Add exponential z-index for dropdown cropping
                    $elems.each(function(e){
                        $(this).css({ zIndex: ($elems.length - e) });
                    });
                }
            });
        });

        // filter items when filter link is clicked
        $('#programma-filters a').click(function(){
            var $this = $(this);
            if ( $this.hasClass('selected') ) {return false;}
            $('#programma-filters .selected').removeClass('selected');
            $this.parent().addClass('selected');
            var selector = $this.attr('data-filter');
            $programma.isotope({ filter: selector }).isotope('reloadItems');
            return false;
        });
        $programma.find('li').hover(function(){
            setTimeout(function(){
                $programma.isotope();
            }, 0);

        });
    }

});



// GOOGLE CHARTS
//////////////////////////////////////////////////////////////////////////////
google.load("visualization", "1", {packages:["corechart"]});
$(function () {
    function drawChart() {
        var options = {
            title: '',
            colors:['#02a750','#00de7d', '#4ebee4', '#698dc9', '#8f6bdf', '#d352c1', '#f25674', '#e23d23', '#f6b400', '#fbcf00'],
            //pieHole: 0.90,
            chartArea: {left:0,top:0,width:"100%",height:"100%"},
            legend: {position: 'none'},
            fontSize: 0,
            enableInteractivity: false
        };

        $('.donut').each(function(index){
            $(this).attr('id', 'dn-'+index);
            var arr = $(this).attr('data-values').split('-'),
                valuesArr = [];
            valuesArr.push(['','']);
            for(var i=0; i<arr.length; i++){
                valuesArr.push(['', parseInt(arr[i], 10)]);
            }
            var data = google.visualization.arrayToDataTable(valuesArr);
            var chart = new google.visualization.PieChart(document.getElementById('dn-'+index));
            chart.draw(data, options);
        });


        var optionsauthor = {
            colors:['#02a750','#00de7d', '#4ebee4', '#698dc9', '#8f6bdf', '#d352c1', '#f25674', '#e23d23', '#f6b400', '#fbcf00'],
            chartArea: {width:"100%",height:"83%"},
            pieSliceText: 'none',
            pieResidueSliceColor: '#fff',
            tooltip: { trigger: 'none',text : 'value' },
            enableInteractivity:false,
            pieHole: 0.75,
            legend: {
                alignment: 'end',
                position: 'labeled',
                textStyle:{color: 'black', fontName: 'Arial', fontSize: '12'}
            },
            titleTextStyle:{color: '#fff', fontName: 'Arial', fontSize: '12'}
        };


        $('.author-donut').each(function(index){
            $(this).attr('id', 'dn-'+index);
            var arr = $(this).attr('data-values').split('-'),
                valuesArr = [['',''],['ATTUALITA',''],['INTERNET',''],['GADGET',''],['MOBILE',''],['SCIENZA',''],['ECONOMIA',''],['LIFESTYLE',''],['PLAY',''],['LOL',''],['IDEE','']];

            for(var i=1; i<valuesArr.length; i++){
                valuesArr[i][1]= parseInt(arr[i-1], 10);
            }
            var data = google.visualization.arrayToDataTable(valuesArr);
            var chart = new google.visualization.PieChart(document.getElementById('dn-'+index));
            chart.draw(data, optionsauthor);
        });
    }
    google.setOnLoadCallback(drawChart);
});


function closeFancybox(){
    $.fancybox.close();
    // Tracking events
    _gaq.push(['_trackEvent', 'fullscreen', 'chiusura', 'wired', 1, true]);
    checkBanner();
}

// TEST EFFETTO BLUR HEADER
//////////////////////////////////////////////////////////////////////////////
/*if (Modernizr.canvas) {
 if ($('#blurheader').length>0){
 $(function () {
 html2canvas($("#content"), {
 onrendered: function (canvas) {
 $(".blurheader").append(canvas);
 $("canvas").attr("id", "canvas");



 stackBlurCanvasRGB(
 'canvas',
 0,
 0,
 $("canvas").width(),
 $("canvas").height(),
 15);
 }
 });

 });
 $(window).scroll(function () {
 $("canvas").css("-webkit-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-moz-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-ms-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-o-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("transform", "translatey(-" + $(window).scrollTop() + "px)");
 });

 window.onresize = function () {
 $("canvas").width($(window).width());
 };

 $(document).bind('touchmove', function () {
 $("canvas").css("-webkit-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-moz-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-ms-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-o-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("transform", "translatey(-" + $(window).scrollTop() + "px)");
 });

 $(document).bind('touchend', function () {
 $("canvas").css("-webkit-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-moz-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-ms-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("-o-transform", "translatey(-" + $(window).scrollTop() + "px)");
 $("canvas").css("transform", "translatey(-" + $(window).scrollTop() + "px)");
 });
 }
 }*/
