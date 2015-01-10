var wired_social_login_template = {"ajax_url":"http:\/\/www.wired.it\/wp-admin\/admin-ajax.php","current_url":"http:\/\/www.wired.it\/","redirecturl":"http:\/\/www.wired.it","loadingmessage":""};
var fb_app_id = '156550261045391';
var zone = "home";
var openGallery = "";
var cnliveVideoPlayerId = 3266803526001;
var cnliveVideoPublisherId = 1177090979001;
var cnliveVideoWidth = 670;
var cnliveVideoHeight = 380;
var _sf_startpt=(new Date()).getTime();

function liveFyreUserLogin(userinfo, user) {
  console.log(userinfo);
  console.log(user);
}

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
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
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
        var docViewTop = $(document).scrollTop();
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

/* FACEBOOK */
FB.init({appId: fb_app_id, status: true, cookie: true, xfbml: true, scope: 'email'});
var wi_arr= ["wired invaders", "invaders", "space", "space invaders", "invaders"];

function decodeEntity(text) {
    return jQuery('<div />').html(text).text();
}

function refreshCode(urlCustom) {
    refreshPageView(urlCustom);
    checkBanner();
}

function checkBanner() {
    try {
        refreshBanner();
    } catch (er) { }
}

function encodeNielsenUrl(v) {
    return v.replace(/:/g, '%3A').replace(/\?/g, '%3F').replace(/&/g, '%26').replace(/#/g, '%23').replace(/=/g, '%3D');
};

function refreshPageView(urlCustom) {
    var now = new Date();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    $("#trkImg").html(" <img src='//secure-uk.imrworldwide.com/cgi-bin/m?rnd=" + now.getTime() + "&ci=condenast&cg=italy&si=" + encodeNielsenUrl(window.location.href) + urlCustom + "%26refresh_ce-awe' alt=''/>");
    _gaq.push(['_setAccount', 'UA-7392350-1']);
    _gaq.push(['_setDomainName', 'wired.it']);
    _gaq.push(['_trackPageview', escape(window.location.href) + urlCustom]);

    if (typeof wt != "undefined") {
        wt.sendinfo({ contentId: getContentIdByURL(), contentGroup: { 1: "Aggregato Condé Nast - WEB", 2: "Wired.it" }, customParameter: { 1: "refresh-ce_awe"} });
    }
}

jQuery.sharedCount = function(url, fn) {
    url = encodeURIComponent(url || location.href);
    var domain = "//plus.sharedcount.com/";
    var apikey = "fe0d7a476844fa7fa7ecf0a55a0a25ec3e244c6d"
    var arg = {
        data: {
            url : url,
            apikey : apikey
        },
        url: domain,
        cache: true,
        dataType: "json"
    };
    if ('withCredentials' in new XMLHttpRequest) {
        arg.success = fn;
    }
    else {
        var cb = "sc_" + url.replace(/\W/g, '');
        window[cb] = fn;
        arg.jsonpCallback = cb;
        arg.dataType += "p";
    }
    return jQuery.ajax(arg);
};

//abbrevia i numeri e aggiung il suffisso
function m(n,d){
    x=(''+n).length,p=Math.pow,d=p(10,d)
    x-=x%3
    return Math.round(n*d/p(10,x))/d+" kMGTPE"[x/3]
}

$(function () {
    //share
    if ($('div.socialMaster').length > 0) {
        $('div.socialMaster').each(function (index) {
        		if(index == 0) {
	            var toolbar = $(this);
	            var myUrl = toolbar.find('li.socialFB a').attr('href');
	            if ((myUrl != undefined) && (myUrl != '')) {
	                $.sharedCount(myUrl, function (data) {
	                    $('li.socialTW span.badge').html(data.Twitter);
	                    $('li.socialGP span.badge').html(data.GooglePlusOne);
	                    $('li.socialFB span.badge').html(data.Facebook.total_count);
	                    var totalCount = 0;
	                    if ((data.Twitter == undefined) || (data.Twitter == 0)) {
	                        $('li.socialTW span.badge').attr('style', 'display:none !important;');
	                    } else {
	                        totalCount += parseInt(data.Twitter);
	                    }
	                    if ((data.GooglePlusOne == undefined) || (data.GooglePlusOne == 0)) {
	                        $('li.socialGP span.badge').attr('style', 'display:none !important;');
	                    } else {
	                        totalCount += parseInt(data.GooglePlusOne);
	                    }
	                    if ((data.Facebook.total_count == undefined) || (data.Facebook.total_count == 0)) {
	                        $('li.socialFB span.badge').attr('style', 'display:none !important;');
	                    } else {
	                        totalCount += parseInt(data.Facebook.total_count);
	                    }
	                    if (fireLevel1 != undefined && totalCount >= fireLevel1) {
	                        $('.social-share .num .count').html(totalCount + " <span>CONDIVISIONI</span>");
	                        if (fireLevel2 != undefined && totalCount >= fireLevel2) {
	                            $('.social-share .num .icon-flame').show();
                                $('.social-share .num .hot-tooltip-wrapper').show();
	                        }
	                    }
	                });
	             }
            }
            $(window).trigger('locktopInit');
        })
    }

    if ($('div.social-share li.socialFB, span.tooltip span.socialFB').length > 0) {
        $("div.social-share li.socialFB a, span.tooltip span.socialFB a").click(function (event) {
            event.preventDefault();
            var _link = $(this).attr('href');
            var _title = '';
            var _description = '';
            var _image = '';
            if ($(this).attr('sh-title') != undefined) {
                _title = decodeEntity($(this).attr('sh-title'));
            }
            if ($(this).attr('sh-description') != undefined) {
                _description = decodeEntity($(this).attr('sh-description'));
            }
            if ($(this).attr('sh-image') != undefined) {
                _image = $(this).attr('sh-image');
            }
            FB.ui({
                method: 'feed',
                link: _link,
                name: _title,
                picture: _image,
                description: _description
            })
        })
    }
    //end share

    //box counter spalla

    if ($('.widget.wdgCounter').length > 0) {
        $('.widget.wdgCounter').each(function(){
            $(this).find('ul li').each(function(index){
                $(this).find('.pos').html(index + 1);
                $(this).find('.square').show();
            })
        })
    }

    checkWiredInvaders("#search");

    $("#search").keyup(function(){
        var obj = this;
        checkWiredInvaders(obj);
    });


    // === s: GA/WT URL Click Tracking ===
    $('article.promotion a').on('click', function(e){
        var destUrl =  location.href + ' Link To ' + $(this).attr('href');

        if (typeof _gaq !== "undefined") {
            _gaq.push(["_trackEvent", "Wired", "ClickOnUrl", destUrl]);
        }

        // --- WT Traking
        if (typeof wt !== "undefined") {
            var wt_customParams = {
                linkId:'clickonurl.wired.' + destUrl
            };
            wt.sendinfo( wt_customParams );
        }
    });
    // === e: GA/WT URL Click Tracking ===

})

function checkWiredInvaders(obj){
    if(jQuery.inArray( $(obj).val().toLowerCase(), wi_arr)!="-1") {
        $(obj).addClass("invaders");
        $("input#btnSearch").bind("click",function(e){
            e.preventDefault();
            location.href="/spaceinvaders";
        });
    } else {
        $(obj).removeClass("invaders");
        $("input#btnSearch").unbind("click");
    }
}

/*

Wired Social Login 
registration.js
v 1.0.0

*/



jQuery(document).ready(function(){

    $(".selectimg").click(
            function () {

            	 	$('#modalAvatar').on('show.bs.modal', function () {
            	        $('#modalAvatar iframe').attr("src", wired_social_login_template.redirecturl + '?action=imageCrop');
            		});
            	    $('#modalAvatar').modal({show:true})
                
                // $("#file").get(0).click();
                return false;
            }
     );
	

	jQuery.livefyreAuth = function() {

		var data = {action: 'get_livefyre_token'};
		
		jQuery.getJSON(ajax_url, data, function(response) {
			//console.log("LIVEFYRE");
			//console.log(response.token);
			if(typeof authDelegate != 'undefined' )
				authDelegate.doLogin(response.token);
		});
		
	}
	
	// show buttons
	var ajax_url = "http://wired.it/wp-admin/admin-ajax.php";
	var data = {action: 'get_profile_image'};
	
	jQuery.getJSON(ajax_url, data, function(response) {
		if(response.logged==true){
			
			/*
			if(response.admin==true){
				$("#profilo-logged-in .dropdown-menu").prepend("<li><a href='/wp-admin'>Amministrazione</a></li>");
			}
			*/
			
			var logout = response.logouturl;
			logout = logout.replace(/&amp;/g, '&');
			
			jQuery("#profilo-login-mobile").hide();
			
			jQuery("#mobile-login").hide();
			jQuery("#mobile-logged").show();
			
			jQuery("#mobile-logged img").attr("src", response.avatar);
			jQuery('.logged-user.img').attr("src", response.avatar);
			jQuery('#usernm').text( response.firstname + " " + response.lastname );

			
			if( response.newposts > 0 ){
				jQuery('.count-new-target').html('<span class="not-count">'+response.newposts+'</span>');
			}
			
			jQuery("#profilo-logged-in").show();
			jQuery("#profilo-logged-in .logged-user img").attr("src", response.avatar);
			//jQuery("#profilo-logged-in .logout-prof").attr("href", "http://stage.wired.it" + logout.substring(logout.indexOf('/wp-')) );
            jQuery("#profilo-logged-in .logout-prof").attr("href", logout );
			
	
			jQuery.livefyreAuth();
			
		}else {
			jQuery("#profilo-login").show();
			jQuery("#mobile-login").show();
		}
	});
		
	if(jQuery('.icon-login').length >0){
		
		jQuery('#profilo-login a').live('click', function(){

			$('.validator-info').hide();
			
			var data = {
					action: 'open_modal_login',
					redirect: wired_social_login_template.current_url
			};
			
			jQuery.post(wired_social_login_template.ajax_url, data, function(response) {

				if($("#modalLogin").length == 0){
					$("#content").append(response);
				}
				
				$("#modalLogin").modal();

                // Open social provider popup onclick
                $(".wsl_connect_with_provider").on('click', function(){
                    popupurl = $("#wsl_popup_base_url").val();
                    provider = $(this).attr("data-provider");

                    window.open(
                        popupurl+"provider="+provider,
                        "hybridauth_social_sing_on",
                        "location=1,status=0,scrollbars=0,width=1000,height=600"
                    );
                });

			});
			
		});
		
	}
	
	$(".tab_set li a").click(function(e){
				 
		if( ( $(e.target).attr("id") != "mobile-login" ) && ( ! $(e.target).hasClass("mask-absolute") ) ){	
			$(".active-ctrl a span").click();
			$("#account").hide();
			$('#mobile-logged').removeClass("icon-custom-close");
		}
	})
	
	if(jQuery("#mobile-logged").length >0){

		$( document ).scroll(function() {
			
			if(!$('#profilo-login-mobile').is(':visible'))
			{
				 if(!$("#liprof").hasClass("active")){
						$("#account").hide();
						$('#mobile-logged').removeClass("icon-custom-close");
				 }	
			}	
		});
		
		jQuery("#mobile-logged").click(function(){
			$("#account").toggle();
			$('#mobile-logged').toggleClass("icon-custom-close");
		});
		
	}
		
	if(jQuery('#mobile-login').length >0){

		jQuery('#mobile-login').click( function(){

			$('html,body').animate({
				scrollTop : $("body").offset().top
			}, 'slow');
			
			$("#account").toggle();
			$("#header").toggleClass("correggi-posizione");
			
			$("#liprof").toggleClass("active-ctrl");
			$('#mobile-login').toggleClass("icon-custom-close");

			var data = {
					action: 'open_mobile_login'
			};
			
			if(jQuery('#mloginbox').length == 0){
				
				$("#profilo-login-mobile").empty();
				
				jQuery.post(wired_social_login_template.ajax_url, data, function(response) {
					$("#profilo-login-mobile").append(response);

                    // Open social provider popup onclick
                    $(".wsl_connect_with_provider").on('click', function(){
                        popupurl = $("#wsl_popup_base_url").val();
                        provider = $(this).attr("data-provider");

                        window.open(
                            popupurl+"provider="+provider,
                            "hybridauth_social_sing_on",
                            "location=1,status=0,scrollbars=0,width=1000,height=600"
                        );
                    });
				});
			}
			
		});
		
	}

	 jQuery('form#wirlogin').live('submit', function(e){
		 
		 	$('.validator-info').hide();
	        // $('form#wirlogin p.status').show().text(wired_social_login_template.loadingmessage);
		 	
	        $.ajax({
	            type: 'POST',
	            dataType: 'json',
	            url: wired_social_login_template.ajax_url,
	            data: { 
	                
	            	'action': 'ajaxlogin', //calls wp_ajax_nopriv_ajaxlogin
	                'username': $('form#wirlogin #username').val(), 
	                'password': $('form#wirlogin #password').val(), 
	                'security': $('form#wirlogin #security').val() },
	        
	            success: function(data){

	            	// $('form#wirlogin p.status').text(data.message);
	                
	            	if (data.loggedin == false){
	            		$('.validator-info').show();
	            	}
	            	
	            	if(data.loggedin == true){ 
	            		   var newred = jQuery.cookie('newredirect');
                           if((newred=='')||(typeof(newred)=='undefined')){
                        	   document.location.href = document.URL;
                               // document.location.href = wired_social_login_template.redirecturl + "/profilo";
                           }
                           else{
                               	document.location.href = newred;
                           }
                           return false;
                   }

	                // return false;
	            }
	        });
	        e.preventDefault();
	        // return false;
	    });
	 
	
		function resetForm(id) {
			   // Lista dei tipi di campi input da resettare
			   $(':text, :password, :file', '#'+id).val('');  // Deseleziona checkbox, radio e select
			   $(':input,select option', '#'+id).removeAttr('checked').removeAttr('selected');
			   // Seleziona il primo valore della select
			   $('select option:first', '#'+id).attr('selected',true);
		}
		
		
		
		// jQuery Validator Methods

        jQuery.validator.addMethod("not_exixts_username", function(value, element) {

        		var data = {
        			action: 'check_username',
        			username: value
        		};

        		var isSuccess = false;

				   $.ajax({ url: wired_social_login_template.ajax_url,
				            data: data, 
				            async: false, 
				            success: 
				                function(msg) { 
				                	console.log(msg);
				                	if(msg.trim()==="true")
				                	{
				                		// console.log(msg);
				                		isSuccess = true;
				                	}
				                	else{
				                		// console.log(msg);
				                		isSuccess = false;
				                	}							                	
									}
				          });
				    return isSuccess;

        		/*
        		$.post(wired_social_login_template.ajax_url, data, function(response) {
        			alert('Got this from the server: ' + response);
        		});
        		*/
        	
        	
        }, "Nickname già utilizzato");
        

        jQuery.validator.addMethod("not_exixts_email", function(value, element) {


        	$("#insemail").empty();
        	
    		var data = {
    			action: 'check_email',
    			email: value
    		};

    		var isSuccess = false;

			   $.ajax({ 
				   type: "POST",
				    			url: wired_social_login_template.ajax_url,
			            data: data, 
			            async: false, 
			            success: function(msg) { 
		                	
		                	if(msg.trim()==="true")
		                	{
		                		// console.log(msg);
		                		isSuccess = true;
		                	}
		                	else{
		                		// console.log(msg);
		                		isSuccess = false;
		                	}
				        }
			          });



			    if(isSuccess){

					$("#insemail").append('<div class="controller cont-ok"> &nbsp; </div>');

			    } else{
			    	$("#insemail").append('<div class="controller cont-info" style="position: relative; top: -76px; left: 12px;"> &nbsp; </div>');
			    }

		          
			    return isSuccess;

    		/*
    		$.post(wired_social_login_template.ajax_url, data, function(response) {
    			alert('Got this from the server: ' + response);
    		});
    		*/
    	
    	
        }, " <div class='alert-field-box'>L'email inserita &egrave; gi&agrave; presente, per effettuare l'accesso <u><a id='clickpop' href='javascript:void(0)'>clicca qui</a></u>.<br />Oppure inserisci un indirizzo email diverso.</div>");
        
		jQuery.validator.addMethod("check_provincia", function(value, element) {

	    	$("#checkprovincia").empty();

			if(value=="none") val = false;
			else val = true;

			 if(val){

					$("#checkprovincia").append('<div class="controller cont-ok"> &nbsp; </div>');

			    }

			
			return val;
			
    	}, "Scegli una provincia");

		 jQuery.validator.addMethod("check_data", function(value, element) {

		    	$("#checkdata").empty();

		    	
		    	var data_giorno = $("#data_giorno").val();
		    	var data_mese = $("#data_mese").val()
		    	var data_anno = $("#data_anno").val()
		    	
		    	var data = data_giorno +"/"+ data_mese +"/"+ data_anno;
		    	
				val = checkDate(data);

				if(val){
					
					$(".data-nascita-select select").removeClass();
					$(".data-nascita-select select").addClass("completed");
					
					$("#checkdata").append('<div class="controller cont-ok"> &nbsp; </div>');
				}
				else{
					
					$(".data-nascita-select select").removeClass();
					$(".data-nascita-select select").addClass("error");
					
				}
				return val;

				
    	}, "Inserisci la data nel formato corretto (gg/mm/aaaa)");

	    function checkDate(testDate)
		  {  
			 var date_regex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

			 if(!(date_regex.test(testDate)))
			 {
			 return false;
			 }
			 else return true;
		  }
	      
});

jQuery(document).ready(function(){
		
	if(jQuery("#feed").length > 0){	
		boxNewsletter();
	} 
		
	jQuery("#emailfeed").live('blur', function(){
		jQuery("#feed").removeClass("active");
		jQuery("#feed .layer").remove();
	});
	
	jQuery(document).live('click', function(e){
		if(jQuery("#feed.active").length > 0){
			if(!jQuery("#feed").is(e.target) && jQuery("#feed").has(e.target).length === 0 ){
				jQuery("#feed").removeClass("active");
				jQuery("#feed").empty();
				boxNewsletter();
			}
		}
	});
	
	jQuery('.icon-check').live('click', function() {
		jQuery(this).parent().toggleClass("checked");
		var t = jQuery(this).attr("id");

		if(jQuery("input:checkbox[name=" + t + "]").is('checked')){
			jQuery('input:checkbox[name=newsletter-dem]').attr('checked', false)
		}
		else {
			jQuery('input:checkbox[name=newsletter-dem]').attr('checked', true)
		}
		
	})
		
	function boxNewsletter(){
		var data = {
				action: 'iscrz_newlsetter_home',
		};
		jQuery.post(wired_social_login_template.ajax_url, data, function(response) {
			jQuery("#feed").append(response);
		});
	}
	 

    
});


(function ($) {
				var queryString = document.location.search.substring(1);
				var found = queryString.search(/international\b/g);

				if (found !== -1) {
					$('#country-nav').show();
				}

				// if (localStorage.getItem('countryNav') !== 'closed') {
				//     $('#country-nav').show();
				// }

				$('#country-nav #close').on('click', function () {
					$('#country-nav').hide();
					localStorage.setItem('countryNav', 'closed');
				});

				$('#country-nav #show').on('click', function (e) {
					$('#message').hide();
					$('#choose').show();

					return false;
				});

				$('#country-nav .more-country').hover(function (e) {
					$(this).find('ul').show();
				}, function (e) {
					$(this).find('ul').hide();
				});
			})($);

/* Based on http://wordpress.org/extend/plugins/social-connect/ */

window.wsl_wordpress_social_login = function(config) {
	jQuery('#loginform').unbind('submit.simplemodal-login');

	var form_id = '#loginform';

	if(!jQuery('#loginform').length) {
		// if register form exists, just use that
		if( jQuery('#registerform').length ) {
			form_id = '#registerform';
		} 
		else {
			// create the login form
			var login_uri = jQuery("#wsl_login_form_uri").val();

			jQuery('body').append("<form id='loginform' method='post' action='" + login_uri + "'></form>");
			jQuery('#loginform').append("<input type='hidden' id='redirect_to' name='redirect_to' value='" + window.location.href + "'>");
		}
	}

	jQuery.each(config, function(key, value) { 
		jQuery("#" + key).remove();
		jQuery(form_id).append("<input type='hidden' id='" + key + "' name='" + key + "' value='" + value + "'>");
	});  

	if(jQuery("#simplemodal-login-form").length) {
		var current_url = window.location.href;
		jQuery("#redirect_to").remove();
		jQuery(form_id).append("<input type='hidden' id='redirect_to' name='redirect_to' value='" + current_url + "'>");
	}

	jQuery(form_id).submit();
}

function isEmpty( inputStr ) { 
	if ( null == inputStr || "" == inputStr ){ 
		return true; 
	} 
	return false; 
}



var modExp = false;
var modVP = false;

(function () {
    var Slider, convertTime, getMouseOffset, getTransitionType, myVideo;

    getTransitionType = function ($el) {
        var el, ris, t, transitions;
        ris = "webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd";
        if ($el && $el.size() > 0) {
            el = $el[0];
            transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd'
            };
            for (t in transitions) {
                if (el.style[t] !== void 0) {
                    ris = transitions[t];
                }
            }
        }
        return ris;
    };

    getMouseOffset = function (container, e) {
        var boxOffset, offset;
        boxOffset = container.offset();
        offset = {
            y: e.pageY - boxOffset.top,
            x: e.pageX - boxOffset.left
        };
        return offset;
    };

    convertTime = function (s) {
        var hour, min, myTime, sec, strHour, strMin, strSec;
        if (s) {
            myTime = new Date(s * 1000);
            hour = myTime.getUTCHours();
            min = myTime.getUTCMinutes();
            sec = myTime.getUTCSeconds();
            strHour = (hour < 10 ? "0" + hour : hour);
            strMin = (min < 10 ? "0" + min : min);
            strSec = (sec < 10 ? "0" + sec : sec);
            return (strHour !== "00" ? strHour + ":" : "") + strMin + ":" + strSec;
        }
        return "00:00";
    };

    Slider = function (container, settings) {
        var $navigator, afterSlide, arrowLeft, arrowRight, constructor, containerSize, currentIndex, increaseLeft, indexModule, items, leftBlocked, reflow, rightBlocked, self, showNextImage, showPrevImage, slide;
        this.container = container;
        this.settings = settings;
        self = this;
        containerSize = null;
        arrowLeft = null;
        arrowRight = null;
        items = null;
        leftBlocked = false;
        rightBlocked = false;
        currentIndex = 0;
        $navigator = null;
        constructor = function () {
            if ((typeof settings).toLowerCase() === "object") {
                settings["itemSize"] = settings["itemSize"] || 100;
                settings["preview"] = settings["preview"] || false;
                settings["navigator"] = settings["navigator"] || false;
                settings["startIndex"] = settings["startIndex"] || 0;
                settings["arrowLeft"] = settings["arrowLeft"] || container.find(".left").first();
                settings["arrowRight"] = settings["arrowRight"] || container.find(".right").first();
                settings["items"] = settings["items"] || container.find(".item");
                settings["startOffset"] = settings["startOffset"] || 0;
                settings["direction"] = settings["direction"] || "left";
                settings["slideNumber"] = settings["slideNumber"] || 1;
                settings["bindings"] = settings["bindings"] || [];
                settings["onAfterTransition"] = settings["onAfterTransition"] || void 0;
                settings["infinite"] = settings["infinite"] || false;
            } else {
                settings = {
                    itemSize: 100,
                    preview: false,
                    navigator: false,
                    startIndex: 0,
                    arrowLeft: container.find(".left").first(),
                    arrowRight: container.find(".right").first(),
                    items: container.find(".item"),
                    startOffset: 0,
                    direction: "left",
                    slideNumber: 1,
                    bindings: [],
                    onAfterTransition: void 0,
                    infinite: false
                };
            }
            arrowLeft = settings.arrowLeft;
            arrowRight = settings.arrowRight;
            items = settings.items;
            currentIndex = settings.startIndex;
            reflow();
            afterSlide();
            if (settings.preview) {
                arrowLeft.parent().on("mouseover", showPrevImage).on("mouseout", function () {
                    return arrowLeft.parent().css("background-image", "none");
                });
                arrowRight.parent().on("mouseover", showNextImage).on("mouseout", function () {
                    return arrowRight.parent().css("background-image", "none");
                });
            }
            if ((settings.navigator != null) && settings.navigator.length > 0) {
                $navigator = settings.navigator;
            }
            arrowLeft.click(function () {
                var i, _results;
                i = 0;
                _results = [];
                while (i < settings.slideNumber) {
                    slide("left");
                    _results.push(i++);
                }
                return _results;
            });
            return arrowRight.click(function () {
                var i, _results;
                i = 0;
                _results = [];
                while (i < settings.slideNumber) {
                    slide("right");
                    _results.push(i++);
                }
                return _results;
            });
        };
        afterSlide = function () {

            /*
            [
            {
            from: {
            selector: '.find("a")',   ---> RELATIVE TO THE SLIDER ACTIVE ELEMENT
            attr: ["html","href"]     ---> IF HTML IT USE THE .html() function
            IF INDEX IT GENERATE THIS STRING "CURRENT_INDEX - SIZE"
            ELSE IT READ/WRITE THE ATTRIBUTE/DATA-ATTRIBUTE
            },
            to: {
            selector: '$(".-wired-sfilate-box .-wired-sfilate-left-box h1 a")',
            attr: ["title","href"]
            }
            }
            ]
            */
            return items.on(getTransitionType(items), function () {
                console.log("transitionEND!!");
                if (settings.bindings.length > 0) {
                    $(settings.bindings).each(function (index, data) {
                        var fromSelector, i, toSelector, val, _i, _ref, _results;
                        if ((data["from"] != null) && (data["from"]["attr"] != null) && data["from"]["attr"].length > 0 && (data["to"] != null) && (data["to"]["attr"] != null) && data["to"]["attr"].length > 0) {
                            console.log("CURindex: " + currentIndex);
                            fromSelector = '$(items[' + currentIndex + '])' + data["from"]["selector"];
                            toSelector = data["to"]["selector"];
                            _results = [];
                            for (i = _i = 0, _ref = data["from"].attr.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                                if (data["from"].attr[i] === "html") {
                                    val = eval("" + fromSelector + ".html()");
                                } else if (data["from"].attr[i] === "index") {
                                    val = (currentIndex + 1) + " - " + (items.size());
                                } else if (data["from"].attr[i].indexOf("data-") === 0) {
                                    val = eval("" + fromSelector + ".data('" + (data['from'].attr[i].replace('data-', '')) + "')");
                                } else {
                                    val = eval("" + fromSelector + ".attr('" + data['from'].attr[i] + "')");
                                }
                                if (data["to"].attr[i] === "html") {
                                    _results.push(eval("" + toSelector + ".html('" + val + "')"));
                                } else if (data["to"].attr[i].indexOf("data-") === 0) {
                                    _results.push(eval("" + toSelector + ".data('" + (data['to'].attr[i].replace('data-', '')) + "','" + val + "')"));
                                } else {
                                    _results.push(eval("" + toSelector + ".attr('" + data['to'].attr[i] + "','" + val + "')"));
                                }
                            }
                            return _results;
                        }
                    });
                }
                if ((settings.onAfterTransition != null) && (typeof settings.onAfterTransition).toLowerCase() === "function") {
                    settings.onAfterTransition(currentIndex);
                }
                return items.off(getTransitionType(items));
            });
        };
        this.destroy = function () {
            arrowLeft.parent().unbind("mouseover, mouseout");
            arrowRight.parent().unbind("mouseover, mouseout");
            arrowLeft.unbind("click");
            arrowRight.unbind("click");
            container.unbind("swipeleft");
            container.unbind("swiperight");
            return currentIndex;
        };
        reflow = function () {
            var lefterVisibleIndex;
            if (settings.infinite === true) {
                lefterVisibleIndex = currentIndex;
                return items.each(function (index) {
                    var curLeft, left, relativeIndex;
                    relativeIndex = indexModule(index - lefterVisibleIndex, items.length);
                    left = ((relativeIndex * settings.itemSize) + settings.startOffset).toFixed(2);
                    if (left > parseInt(this.style[settings.direction]) + (settings.itemSize + 1)) {
                        curLeft = parseInt(this.style[settings.direction]);
                        this.style[settings.direction] = "" + (curLeft - settings.itemSize) + "%";
                        this.offsetHeight;
                        return $(this).on("transitionend", function () {
                            $(this).toggleClass("-wired-noTransitions", true);
                            this.style[settings.direction] = "" + left + "%";
                            this.offsetHeight;
                            $(this).toggleClass("-wired-noTransitions", false);
                            return $(this).off("transitionend");
                        });
                    } else if (left < parseInt(this.style[settings.direction]) - (settings.itemSize + 1)) {
                        curLeft = parseInt(this.style[settings.direction]);
                        $(this).toggleClass("-wired-noTransitions", true);
                        this.style[settings.direction] = "" + (-settings.itemSize) + "%";
                        this.offsetHeight;
                        $(this).toggleClass("-wired-noTransitions", false);
                        this.offsetHeight;
                        return this.style[settings.direction] = "" + left + "%";
                    } else {
                        return this.style[settings.direction] = "" + left + "%";
                    }
                });
            } else {
                return items.each(function (index) {
                    return $(this).css(settings.direction, (((index - currentIndex) * settings.itemSize) + settings.startOffset).toFixed(2) + "%");
                });
            }
        };
        this.goToIndex = function (index) {
            currentIndex = index < items.size() ? index : items.size() - 1;
            reflow();
            return afterSlide();
        };
        this.getCurrentActive = function () {
            return currentIndex;
        };
        this.getItems = function () {
            return items;
        };
        showNextImage = function () {
            var nextItem;
            nextItem = $navigator.get(indexModule(currentIndex + 1, items.length));
            if (nextItem != null) {
                return arrowRight.find('.-wired-video-thumb-preview').html($(nextItem).find('img')[0].outerHTML + $(nextItem).find('p')[0].outerHTML);
            } else {
                return arrowRight.find('.-wired-video-thumb-preview').html('');
            }
        };
        showPrevImage = function () {
            var prevItem;
            prevItem = $navigator.get(indexModule(currentIndex - 1, items.length));
            if (prevItem != null) {
                return arrowLeft.find('.-wired-video-thumb-preview').html($(prevItem).find('img')[0].outerHTML + $(prevItem).find('p')[0].outerHTML);
            } else {
                return arrowLeft.find('.-wired-video-thumb-preview').html('');
            }
        };
        increaseLeft = function (item, delta) {
            return item.style[settings.direction] = (parseFloat(item.style[settings.direction]) + delta).toFixed(2) + "%";
        };
        indexModule = function (i, l) {
            if (i < 0) {
                return l - ((((i + 1) * -1) % l) + 1);
            }
            return i % l;
        };
        slide = function (direction) {
            stopVideo();
            rightBlocked = parseFloat(items.first()[0].style[settings.direction]) >= settings.startOffset;
            leftBlocked = parseFloat(items.last()[0].style[settings.direction]) <= (100 - (settings.itemSize + settings.startOffset));
            if ((typeof direction).toLowerCase() === "string") {
                if (direction.indexOf("left") > -1) {
                    if (settings.infinite === true) {
                        self.goToIndex(indexModule(currentIndex - 1, items.length));
                        if (settings.navigator != null) {
                            $navigator.removeClass("-wired-video-item-active").filter(":nth(" + currentIndex + ")").toggleClass("-wired-video-item-active", true);
                        }
                        if (settings.preview === (typeof true !== "undefined" && true !== null)) {
                            return showPrevImage();
                        }
                    } else if (!rightBlocked) {
                        items.each(function () {
                            return increaseLeft(this, settings.itemSize);
                        });
                        currentIndex -= 1;
                        afterSlide();
                        if (settings.navigator != null) {
                            $navigator.removeClass("-wired-video-item-active").filter(":nth(" + currentIndex + ")").toggleClass("-wired-video-item-active", true);
                        }
                        if (settings.preview === (typeof true !== "undefined" && true !== null)) {
                            return showPrevImage();
                        }
                    }
                } else if (direction.indexOf("right") > -1) {
                    if (settings.infinite === true) {
                        self.goToIndex(indexModule(currentIndex + 1, items.length));
                        if (settings.navigator != null) {
                            $navigator.removeClass("-wired-video-item-active").filter(":nth(" + currentIndex + ")").toggleClass("-wired-video-item-active", true);
                        }
                        if (settings.preview === (typeof true !== "undefined" && true !== null)) {
                            return showNextImage();
                        }
                    } else if (!leftBlocked) {
                        items.each(function () {
                            return increaseLeft(this, -settings.itemSize);
                        });
                        currentIndex += 1;
                        afterSlide();
                        if (settings.navigator != null) {
                            $navigator.removeClass("-wired-video-item-active").filter(":nth(" + currentIndex + ")").toggleClass("-wired-video-item-active", true);
                        }
                        if (settings.preview === (typeof true !== "undefined" && true !== null)) {
                            return showNextImage();
                        }
                    }
                }
            } else {
                return console.error("direction is " + (typeof direction) + "!!");
            }
        };
        constructor(this.container);
        return this;
    };

    $('.-wired-slider-item-window').each((function () {
        var thisItemWindow;
        thisItemWindow = $(this);
        /*
        $('.-wired-slider-video-item').each((function (index) {
        return $(this).data('video', new myVideo($(this).find('video'), {
        autoplay: index === thisItemWindow.data('vid-start')
        }));
        }));
        */
        $('.-wired-slider-video-item').eq(0).find('.start').click();
        $('.-wired-slider-container h4').html($('.-wired-slider-video-item').eq(0).find('.start img').attr('title'));
        $('.-wired-slider-container h6').html($('.-wired-slider-video-item').eq(0).find('.start img').attr('data-category'));
        return $(this).data("slider", new Slider($(this), {
            arrowLeft: $(this).parent().find('.-wired-arrow-preview-left'),
            infinite: true,
            arrowRight: $(this).parent().find('.-wired-arrow-preview-right'),
            navigator: $('.-wired-video-playlist-item-container li'),
            items: $(this).children(),
            preview: true,
            startIndex: $(this).data('vid-start'),
            onAfterTransition: function (i) {
                $('.-wired-video-playlist-item-container li').toggleClass('-wired-video-item-active', false).filter(':nth(' + i + ')').toggleClass('-wired-video-item-active', true);
                $('.-wired-slider-video-item').filter(':nth(' + i + ')').find('.start').click();
                //alert("curr pos:"+i+",items:"+this.items.length);

                if (i == 3) {
                    // Show 1 to 4 thumb
                    $('.-wired-video-playlist-item-container li').toggleClass('-wired-video-item-hide', false);
                    $('.-wired-video-playlist-item-container li').filter(':nth(0)').toggleClass('-wired-video-item-hide', true);
                    $('.-wired-video-playlist-item-container li').filter(':nth(5)').toggleClass('-wired-video-item-hide', true);
                } else if (i == 4) {
                    // Show 2 to 5 thumb
                    $('.-wired-video-playlist-item-container li').toggleClass('-wired-video-item-hide', false);
                    $('.-wired-video-playlist-item-container li').filter(':nth(0)').toggleClass('-wired-video-item-hide', true);
                    $('.-wired-video-playlist-item-container li').filter(':nth(1)').toggleClass('-wired-video-item-hide', true);
                } else if (i == 5) {
                    // Show 3 to 0 thumb
                    $('.-wired-video-playlist-item-container li').toggleClass('-wired-video-item-hide', false);
                    $('.-wired-video-playlist-item-container li').filter(':nth(1)').toggleClass('-wired-video-item-hide', true);
                    $('.-wired-video-playlist-item-container li').filter(':nth(2)').toggleClass('-wired-video-item-hide', true);
                } else {
                    // Show first 4 thumb
                    $('.-wired-video-playlist-item-container li').toggleClass('-wired-video-item-hide', false);
                    $('.-wired-video-playlist-item-container li').filter(':nth(4)').toggleClass('-wired-video-item-hide', true);
                    $('.-wired-video-playlist-item-container li').filter(':nth(5)').toggleClass('-wired-video-item-hide', true);
                }

                /*
                this.items.filter(':nth(' + i + ')').find('video').parent().data('video').play();
                return this.items.filter(':not(:nth(' + i + '))').find('video').parent().each(function () {
                return $(this).data('video').stop();
                });
                */
            },
            bindings: [
            {
                from: {
                    selector: '.find(".start img")',
                    attr: ["title"]
                },
                to: {
                    selector: '$("hgroup h4")',
                    attr: ["html"]
                }
            },
            {
                from: {
                    selector: '.find(".start img")',
                    attr: ["data-category"]
                },
                to: {
                    selector: '$("hgroup h6")',
                    attr: ["html"]
                }
            }
          ]
        }));
    }));
    /*
    $('.-wired-video-playlist-item-container li').click(function () {
        var liIndx, slider;
        liIndx = $(this).index();
        if ($(this).hasClass('-wired-video-item-active')) {

        } else {
            $(this).parent().find('.-wired-video-item-active').removeClass('-wired-video-item-active');
            $(this).addClass('-wired-video-item-active');
            slider = $(this).parents('#-wired-video-container').find('.-wired-slider-item-window').data('slider');
            return slider.goToIndex(liIndx);
        }
    });
    */
}).call(this);

function stopVideo() {
    modVP.stop();
}

function pauseVideo() {
    modVP.pause();
}

function showVideo(playerID, videoID, callerObject) {
    var _shareUrl = $(callerObject).find('img').attr('data-url');
    var params = {};
    params.playerID = cnliveVideoPlayerId;
    params.publisherID = cnliveVideoPublisherId;
    params.bgcolor = "#000000";
    params.isVid = "true";
    params.isUI = "true";
    params.autoStart = "true";
    params.wmode = "transparent";
    params.width = cnliveVideoWidth;
    params.height = cnliveVideoHeight;
    params['@videoPlayer'] = videoID;
    params['includeAPI'] = "true";
    params['templateLoadHandler'] = "onTemplateLoadedPiede";
    params['templateReadyHandler'] = "onTemplateReady";
    params['adServerURL'] = "http://pubads.g.doubleclick.net/gampad/ads?sz=900x506&iu=/5574/wired.it/cnlive&ciu_szs=996x350&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=" + window.location.href;
    params['videoSmoothing'] = "true";
    if (_shareUrl != undefined && _shareUrl != '') {
        params['linkBaseURL'] = _shareUrl;
    } else {
        params['linkBaseURL'] = "http://www.cnlive.it";
    }

    var player = brightcove.createElement("object");
    player.id = playerID;
    var parameter = {};
    for (var key in params) {
        parameter = brightcove.createElement("param");
        parameter.name = key;
        parameter.value = params[key];
        player.appendChild(parameter);
    }
    brightcove.createExperience(player, document.getElementById(playerID), true);
}

/**
* Handler for when Brightcove player initially loads, allowing for API interaction.
*
* @param  pExperienceID  The ID of the HTML object element where the player is embedded.
*/
function onTemplateLoadedPiede(pExperienceID) {
    // store reference to player
    bcExp = brightcove.getExperience(pExperienceID);
    modVP = bcExp.getModule(APIModules.VIDEO_PLAYER);
    modExp = bcExp.getModule(APIModules.EXPERIENCE);
    var modCon = bcExp.getModule(APIModules.CONTENT);
    modVP.addEventListener(BCMediaEvent.COMPLETE, onMediaCompletePiede);
    modVP.mute();
}

function onMediaCompletePiede(evt) {
    stopVideo();
    $('.-wired-right').click();
}


function getContentIdByURL(){
      var url = document.location.href;
      if(url && url !== null) {
        return url.split("?")[0].toLowerCase();
      }
      return "no_content";
    };

    function getExistsParameterByName(name) {
      var match = RegExp('[?&]' + name).exec(window.location.search);
      if (match) return name; else return 'no-refresh';
    }
	
/*
 ********************* Ab hier nichts aendern ********************
 ********************* Don't change anything beyond this line ********************
 */

var webtrekkConfig = {
	trackId : "641856089134434",
	trackDomain : "condenastitalia01.wt-eu02.net",
	domain : "www.dummydomain-donotchange.com",
	cookie : "3",
	mediaCode : "wt_mc",
	contentId : ""
};

var webtrekkUnloadObjects=[];var webtrekkLinktrackObjects=[];var webtrekkHeatmapObjects=[];function webtrekkV3($a){var webtrekkUnload=function($b,$c){if($d.cookie=="1"&&!$d.optOut&&!$d.deactivatePixel){$d.firstParty();};var $e=($c)?$c:($d.formObject&&$b!="noForm")?"form":"link";if($d.beforeUnloadPixel!=false){$d.beforeUnloadPixel();}else if($e=="form"){$d.executePlugin($d.getPluginConfig("form","before"));};var p="";if($d.config.linkId){p+="&ct="+$d.wtEscape($d.maxlen($d.config.linkId,255));if(p){if($d.linktrackOut){p+="&ctx=1";};var $f=$d.ccParams;if(typeof($f)=='string'&&$f!=''){p+=$f;}}};if($d.wtEp){if($d.wtEpEncoded){p+=$d.wtEp;}else{var $g=$d.wtEp;if(typeof($g)=='string'&&$g!=''){$g=$g.split(/;/);for(var z=0;z<$g.length;z++){if($d.wtTypeof($g[z])){var $h=$g[z].split(/=/);if($d.checkSC('custom')){$h[1]=$d.decrypt($h[1]);};$h[1]=$d.wtEscape($h[1]);p+='&'+$h[0]+'='+$h[1];}}}}};if($d.formObject&&$b!="noForm"){var gatherFormsP=$d.gatherForm();if(gatherFormsP){p+="&fn="+($d.formName?$d.formName:$d.contentId.split(";")[0])+'|'+($d.formSubmit?"1":"0");p+="&ft="+$d.wtEscape(gatherFormsP);}};if(p!=""){if($d.isChrome&&$e!="click"){$d.quicksend($d.wtEscape($d.contentId.split(";")[0])+",1,"+$d.baseparams(),p,false,"saveRequest");}else{$d.quicksend($d.wtEscape($d.contentId.split(";")[0])+",1,"+$d.baseparams(),p,false,"sendRequest");};$d.config.linkId="";$d.ccParams="";$d.wtEp="";};if($d.afterUnloadPixel!=false){$d.afterUnloadPixel();}else if($e=="form"){$d.executePlugin($d.getPluginConfig("form","after"));}};var webtrekkLinktrack=function(e){if((e.which&&e.which==1)||(e.button&&e.button==1)){var a=((document.all&&window.event!==null)?window.event.srcElement:this);for(var i=0;i<4;i++){if(a.tagName&&a.tagName.toLowerCase()!="a"&&a.tagName.toLowerCase()!="area"){a=a.parentElement;}};$d.config=$d.getConfig(true);$d.config.customClickParameter=$d.customClickParameter;a.lname=$d.getAttribute(a,$d.linkTrackAttribute);a.lpos=0;$d.getCCParams(a);if(!$d.wtLength(a.lpos)&&a.tagName){var c=document.links;for(var d=0;d<$d.wtLength(c);d++){if(a==c[d]){a.lpos=d+1;break;}}};if(a.lpos){if($d.getJSON(a.lname)!=null){$d.parseJSON($d.getJSON(a.lname));a.lname=$d.config.linkId;};if($d.linkTrack=="link"){var y=a.href.indexOf("//");y=(y>=0?a.href.substr(y+2):a.href);if($d.linkTrackPattern){if(!$d.linkTrackReplace){$d.linkTrackReplace="";};y=y.replace($d.linkTrackPattern,$d.linkTrackReplace);};$d.config.linkId=(a.lname?(a.lname+"."):"")+y.split("?")[0].replace(/\//g,".");var p="";if($d.linkTrackParams){p=$d.linkTrackParams.replace(/;/g,",").split(",");};for(var i=0;i<p.length;i++){var v=$d.urlParam(y,p[i],"");if(v){$d.config.linkId+="."+p[i]+"."+v;}}}else if($d.linkTrack=="standard"&&a.lname){$d.config.linkId=a.lname;};var $i=false;if($d.linkTrackDownloads){var $j=a.href.split(".");$j=$j.pop();var $k=$d.linkTrackDownloads.split(";");for(i=0;i<$k.length;i++){if($k[i]==$j){$i=true;break;}}};if($d.config.linkId){if($d.domain&&!$d.isOwnDomain(a.href)){$d.linktrackOut=true;}};if($i||($d.config.linkId&&a.target!=""&&a.target!="_self")){$d.sendinfo($d.config,$d.config.linkId,"click");}else{$d.sendinfo($d.config,$d.config.linkId,"link");}}}};var webtrekkHeatmapClick=function(e){var $l=document.getElementById($d.heatmapRefpoint),$m;if($l&&$l!==null){$m={left:0,top:0};}else{$m={left:-1,top:-1};};if($l&&$l!==null){if($d.wtTypeof($l.offsetLeft)){while($l){$m.left+=(($l.offsetLeft>=0)?$l.offsetLeft:0);$m.top+=(($l.offsetTop>=0)?$l.offsetTop:0);$l=$l.offsetParent;}}};var $n=0;var $o=0;if(!e){var e=window.event;};if(e.pageX||e.pageY){$n=e.pageX;$o=e.pageY;}else{if(e.clientX||e.clientY){$n=e.clientX;$o=e.clientY;if($d.isIE){if(document.body.scrollLeft>0||document.body.scrollTop>0){$n+=document.body.scrollLeft;$o+=document.body.scrollTop;}else{if(document.documentElement.scrollLeft>0||document.documentElement.scrollTop>0){$n+=document.documentElement.scrollLeft;$o+=document.documentElement.scrollTop;}}}}};var $p=0;if($d.isIE){$p=document.body.clientWidth;}else{$p=self.innerWidth-16;};var $q=true;if($n>=$p||!$d.sentFullPixel){$q=false;};if(($m.top>=0||$m.left>=0)&&$n>$m.left&&$o>$m.top){$n='-'+($n-$m.left);$o='-'+($o-$m.top);};if($q&&$d.heatmap=="1"){$d.executePlugin($d.getPluginConfig("heatmap","before"));$d.quicksend($d.wtEscape($d.contentId.split(";")[0])+","+$n+","+$o,'',"hm","sendRequest");$d.executePlugin($d.getPluginConfig("heatmap","after"));}};var webtrekkStartHeatmap=function(){if(typeof(wt_heatmap)!="undefined"){window.setTimeout("wt_heatmap()",1000);}else{if(typeof($r)=="undefined"){$r=0;};$r++;if($r<60){window.setTimeout(function(){webtrekkStartHeatmap();},1000);}}};var webtrekkStartOverlay=function(){if(typeof(wt_overlay)!="undefined"){wt_overlay();}else{if(typeof($s)=="undefined"){$s=0;};$s++;if($s<60){window.setTimeout(function(){webtrekkStartOverlay();},1000);}}};var webtrekkFormTrackInstall=function(){$d.findForm();if(!$d.formObject){return;};for(var j=0;j<$d.formObject.elements.length;j++){var e=$d.formObject.elements[j];$d.registerEvent(e,"focus",webtrekkFormFocus);};$d.registerEvent($d.formObject,"submit",webtrekkFormSubmit);$d.registerEvent(window,(($d.wtTypeof(window.onbeforeunload))?"beforeunload":"unload"),webtrekkUnload);};var webtrekkFormSubmit=function(e){if(!$d.form){return;};if(e.target==$d.formObject||e.srcElement==$d.formObject){$d.formSubmit=true;}};var webtrekkFormFocus=function(e){var a=((document.all&&window.event!==null)?window.event.srcElement:e.target);if(!a.name||a.type=="submit"||a.type=="image"){return;};if($d.formObject){$d.formFocus=a.name;}};var c=webtrekkConfig,$d=this;if(!$a){var $a=c;};this.defaultAttribute=["contentId","linkId","trackId","trackDomain","domain","linkTrack","linkTrackParams","linkTrackPattern","linkTrackReplace","linkTrackDownloads","linkTrackIgnorePattern","customParameter","crmCategory","customClickParameter","customSessionParameter","customTimeParameter","customCampaignParameter","customEcommerceParameter","orderValue","currency","orderId","product","productCost","productQuantity","productCategory","productStatus","customerId","crmCategory","contentGroup","mediaCode","mediaCodeValue","mediaCodeCookie","campaignId","campaignAction","internalSearch","customSid","customEid","cookieDomain","cookieEidTimeout","cookieSidTimeout","forceNewSession","xwtip","xwtua","xwtrq","mediaCodeFrames","framesetReferrer","forceHTTPS","secureConfig","heatmap","pixelSampling","form","formFullContent","formAnonymous","disableOverlayView","beforeSendinfoPixel","afterSendinfoPixel","beforeUnloadPixel","afterUnloadPixel","executePluginFunction","sendOnUnload","xlc","xlct","xlcv","ignorePrerendering"];this.cookie=($a.cookie)?$a.cookie:(c.cookie)?c.cookie:"3";this.optoutName=($a.optoutName)?$a.optoutName:(c.optoutName)?c.optoutName:"webtrekkOptOut";this.paramFirst=($a.paramFirst)?$a.paramFirst:(c.paramFirst)?c.paramFirst:"";this.plugins=($a.plugins&&$a.plugins!='')?$a.plugins:(c.plugins&&c.plugins!='')?c.plugins:['Adobe Acrobat','Windows Media Player','Shockwave Flash','RealPlayer','QuickTime','Java','Silverlight'];if(typeof(this.plugins)=="string"){this.plugins=this.plugins.split(";");};this.heatmapRefpoint=($a.heatmapRefpoint)?$a.heatmapRefpoint:(c.heatmapRefpoint)?c.heatmapRefpoint:"wt_refpoint";this.linkTrackAttribute=($a.linkTrackAttribute)?$a.linkTrackAttribute:(c.linkTrackAttribute)?c.linkTrackAttribute:"name";this.formAttribute=($a.formAttribute)?$a.formAttribute:(c.formAttribute)?c.formAttribute:"name";this.formFieldAttribute=($a.formFieldAttribute)?$a.formFieldAttribute:(c.formFieldAttribute)?c.formFieldAttribute:"name";this.formValueAttribute=($a.formValueAttribute)?$a.formValueAttribute:(c.formValueAttribute)?c.formValueAttribute:"value";this.reporturl=($a.reporturl)?$a.reporturl:(c.reporturl)?c.reporturl:'report2.webtrekk.de/cgi-bin/wt';this.updateCookie=($a.updateCookie)?$a.updateCookie:(c.updateCookie)?c.updateCookie:true;this.version=323;this.deactivatePixel=false;this.deactivateRequest=false;this.optOut=false;this.eid=false;this.firstVisitContact=false;this.lastVisitContact=false;this.sampleCookieString=false;this.cookieOne=false;this.linktrackOut=false;this.linktrackNamedlinksOnly=true;this.ccParams=false;this.sentFullPixel=false;this.sentCampaignIds={};this.wtEp=false;this.wtEpEncoded=false;this.trackingSwitchMediaCode=false;this.trackingSwitchMediaCodeValue=false;this.trackingSwitchMediaCodeTimestamp=false;this.heatmapOn=false;this.overlayOn=false;this.gatherFormsP=false;this.formObject=false;this.formName=false;this.formFocus=false;this.formSubmit=false;this.browserLang=false;this.config=false;this.unloadInstance=webtrekkUnloadObjects.length;this.plugin={};this.pageCounter=0;this.clickCounter=0;this.linkCounter=0;this.formCounter=0;this.heatmapCounter=0;this.browserLang=false;if(typeof(navigator.language)=="string"){this.browserLang=navigator.language.substring(0,2);}else if(typeof(navigator.userLanguage)=="string"){this.browserLang=navigator.userLanguage.substring(0,2);};this.jsonPara={"ck":["customClickParameter",{}],"cp":["customParameter",{}],"cs":["customSessionParameter",{}],"ce":["customTimeParameter",{}],"cb":["customEcommerceParameter",{}],"vc":["crmCategory",{}],"ca":["productCategory",{}],"cc":["customCampaignParameter",{}],"cg":["contentGroup",{}],"ct":["linkId",""],"ov":["orderValue",""],"cr":["currency",""],"oi":["orderId",""],"ba":["product",""],"co":["productCost",""],"qn":["productQuantity",""],"st":["productStatus",""],"cd":["customerId",""],"is":["internalSearch",""],"mc":["campaignId",""],"mca":["campaignAction",""],"sou":["sendOnUnload",false]};this.generateDefaultConfig=function($t,$u){for(var i=0;i<this.defaultAttribute.length;i++){var a=this.defaultAttribute[i];this[a]=($t[a])?$t[a]:($u[a])?$u[a]:false;}};this.generateDefaultConfig($a,c);this.campaignAction=($a.campaignAction)?$a.campaignAction:(c.campaignAction)?c.campaignAction:"click";this.getJSON=function(s){if(s&&s.charAt(0)=="{"&&s.charAt(s.length-1)=="}"){try{return eval("("+s+")");}catch(e){return null;}};return null;};this.parseJSON=function(o,n){for(var $v in o){if(typeof(o[$v])=="object"){if(typeof(this.jsonPara[$v])!="undefined"&&typeof(this.config[this.jsonPara[$v][0]])!="object"){this.config[this.jsonPara[$v][0]]=this.jsonPara[$v][1];};this.parseJSON(o[$v],$v);continue;};if(n){if(isNaN(parseInt($v))||parseInt($v)<500){this.config[this.jsonPara[n][0]][$v]=o[$v];}}else{if(typeof(this.jsonPara[$v])!="undefined"){this.config[this.jsonPara[$v][0]]=o[$v];}}}};this.getMappingParam=function(np){var p=np.split(""),i,$w,$x,$y;for(i=0;i<p.length;i++){if(!isNaN(parseInt(p[i]))){$w=i;break;}};if($w){$x=np.substr(0,$w);$y=np.substr($w,np.length-1);}else{$x=np;};return{"mapping":((typeof(this.jsonPara[$x])!="undefined")?this.jsonPara[$x][0]:false),"index":(($y)?$y:false)};};this.getConfig=function(d){var c={};for(var i=0;i<this.defaultAttribute.length;i++){var a=this.defaultAttribute[i];c[a]=((d)?false:this[a]);};return c;};this.getRequestCounter=function($c,$z){var c=0;if($z=="before"){c++;};if($c=="link"){this.linkCounter+=c;return this.linkCounter;}else if($c=="click"){this.clickCounter+=c;return this.clickCounter;}else if($c=="page"){this.pageCounter+=c;return this.pageCounter;}else if($c=="heatmap"){this.heatmapCounter+=c;return this.heatmapCounter;}else if($c=="form"){this.formCounter+=c;return this.formCounter;}};this.getPluginConfig=function($c,$z){return{"instance":this,"mode":$c,"type":$z,"requestCounter":this.getRequestCounter($c,$z)};};this.checkAsynchron=function($A,$B,$C,$D){if(typeof(window[$A])!="undefined"){if($B){$B(true,$C);};return;}else if($D<=0){if($B){$B(false,$C);};return;};window.setTimeout(function(){$C.checkAsynchron($A,$B,$C,($D-100));},100);};this.loadAsynchron=function($E,$A,$B,$D){if(this.include($E)){$B=($B)?$B:false;$D=($D)?$D:2000;this.checkAsynchron($A,$B,this,$D);}};this.include=function(s){if(!document.createElement){return false;};var $F=document.getElementsByTagName('head').item(0);var js=document.createElement('script');js.setAttribute('language','javascript');js.setAttribute('type','text/javascript');js.setAttribute('src',s);$F.appendChild(js);return true;};this.executePlugin=function($G){if(!this.executePluginFunction||typeof(this.executePluginFunction)!="string"){return;};this.epf=false;var $H=this.executePluginFunction.split(";");for(var z=0;z<$H.length;z++){if(typeof(window[$H[z]])=="function"){this.epf=window[$H[z]];this.epf($G);}}};this.indexOf=function(a,b,c){return a.indexOf(b,c?c:0);};this.wtTypeof=function(v){return((typeof(v)!="undefined")?1:0);};this.wtLength=function(a){return((a!="undefined")?a.length:0);};this.getAttribute=function(o,a){if(typeof(o.getAttribute(a))=="string"){return o.getAttribute(a);};if(typeof(o.getAttribute(a))=="object"&&typeof(o.attributes[a])=="object"){if(o.attributes[a]!=null){return o.attributes[a].nodeValue;}};return "";};this.getTimezone=function(){return Math.round((new Date().getTimezoneOffset()/60)*(-1));};this.wtHref=function(){return this.wtLocation().href;};this.wtLocation=function(){var $I=document.location;if(!document.layers&&document.getElementById){try{$I=top.document.location;}catch(e){$I=document.location;}}else{$I=top.document.location;};return $I;};this.getWebtrekkPath=function(){if(!document.layers&&document.getElementById){var $J=document.getElementsByTagName('script');for(var i=0;i<$J.length;i++){if($J[i].src.match(/webtrekk[a-z|A-Z|0-9|_]*\.js/g)){return $J[i].src.replace(/webtrekk[a-z|A-Z|0-9|_]*\.js/g,'');}}};return '';};this.isIE=this.indexOf(navigator.appName,"Microsoft")?false:true;if(!this.isIE){this.isOpera=this.indexOf(navigator.appName,"Opera")?false:true;if(!this.isOpera){this.isSafari=(navigator.vendor.toLowerCase().indexOf("apple")!=-1)?true:false;this.isChrome=(navigator.vendor.toLowerCase().indexOf("google")!=-1)?true:false;}};this.url2contentId=function($I){if(!$I){return "no_content";};var tmp=new RegExp("//(.*)").exec($I);if(tmp.length<1){return "no_content";};var $K=tmp[1].split("?")[0].replace(/\./g,"_").replace(/\//g, ".").replace(/\.{2,}/g,".").toLowerCase();return $K.split(";")[0];};this.contentId=($a.contentId)?$a.contentId:this.url2contentId(document.location.href);this.registerEvent=function($L,e,f){if($L.addEventListener){if(e=="webkitvisibilitychange"){this.unregisterEvent($L,e,f);};$L.addEventListener(e,f,false);}else{if($L.attachEvent){if(e=="beforeunload"||e=="webkitvisibilitychange"){this.unregisterEvent($L,e,f);};$L.attachEvent("on"+e,f);}}};this.unregisterEvent=function($L,e,f){if($L.removeEventListener){$L.removeEventListener(e,f,false);}else{if($L.detachEvent){$L.detachEvent("on"+e,f);}}};this.maxlen=function(v,l){if(v&&v.length>l){return v.substring(0,l-1);};return v;};this.wtEscape=function(u){try{return encodeURIComponent(u);}catch(e){return escape(u);}};this.wtUnescape=function(u){try{return decodeURIComponent(u);}catch(e){return unescape(u);}};this.decrypt=function(x){var $M="";if(x){try{$M=this.wtUnescape(x.replace(/([0-9a-fA-F][0-9a-fA-F])/g,'%$1'));}catch(e){};};return $M;};this.checkSC=function(x){if(typeof(this.secureConfig)!='string'){return false;};var sc=this.secureConfig.split(';');for(var i=0;i<sc.length;i++){if(sc[i]==x){return true;}};return false;};this.zeroPad=function(n,$N){var $O="000000000000"+n;return $O.substring(($O.length-$N),$O.length);};this.generateEid=function(){return '2'+this.zeroPad(Math.floor(new Date().getTime()/1000),10)+this.zeroPad(Math.floor(Math.random()*1000000),8);};this.getexpirydate=function($P){var $Q;var $R=new Date();var $S=Date.parse($R);$R.setTime($S+$P*60*1000);$Q=$R.toUTCString();return $Q;};this.setCookie=function(name,$T,$U){var d=location.hostname;var $V="^[0-9]{1,3"+String.fromCharCode(125)+"\.[0-9]{1,3"+String.fromCharCode(125)+"\.[0-9]{1,3"+String.fromCharCode(125)+"\.[0-9]{1,3"+String.fromCharCode(125)+"$";if(d.search($V)==-1){d=location.hostname.split(".");d=d[d.length-2]+"."+d[d.length-1];};var c,f=false;if(this.cookieDomain){var cd=this.cookieDomain.split(";");for(var i=0;i<cd.length;i++){if(location.hostname.indexOf(cd[i])!=-1){d=cd[i];f=true;break;}}};if(f&&typeof($U)!="undefined"&&$U){c=name+"="+escape($T)+";domain="+d+";path=/;expires="+this.getexpirydate($U);}else if(f){c=name+"="+escape($T)+";path=/;domain="+d;}else if(d.split('.')[0].length<3&&typeof($U)!="undefined"&&$U){c=name+"="+escape($T)+";path=/;expires="+this.getexpirydate($U);}else if(d.split('.')[0].length<3){c=name+"="+escape($T)+";path=/";}else if(typeof($U)!="undefined"&&$U){c=name+"="+escape($T)+";domain="+d+";path=/;expires="+this.getexpirydate($U);}else{c=name+"="+escape($T)+";path=/;domain="+d;};document.cookie=c;};this.getCookie=function($W){var $X=document.cookie.split(";");for(var i=0;i<$X.length;i++){var $Y=$X[i].substr(0,$X[i].indexOf("="));var $Z=$X[i].substr($X[i].indexOf("=")+1);$Y=$Y.replace(/^\s+|\s+$/g,"");if($Y==$W){return unescape($Z);}};return "";};this.optOut=(this.getCookie(this.optoutName))?true:false;if(this.optOut){this.deactivatePixel=true;};this.urlParam=function($I,$00,$01){if(!$I||$I==null){return $01;};var p=new Array();if($I.indexOf("?")>0){p=$I.split("?")[1].replace(/&amp;/g,"&").split("#")[0].split("&");};for(var i=0;i<p.length;i++){if(p[i].indexOf($00+"=")==0){return this.wtUnescape(p[i].substring($00.length+1).replace(/\+/g,"%20"));}};return $01;};this.allUrlParam=function($00,$01){if(this.mediaCodeFrames&&this.mediaCodeFrames!=''){var lf=this.mediaCodeFrames.split(";");for(var i=0;i<lf.length;i++){var $02=false;eval("try { lFrame = eval(lf[i]) }catch(e){};");if($02&&$02!=top&&$02.location){var $03=this.urlParam($02.location.href,$00,$01);if($03!=$01){return $03;}}};return $01;}else{var topLocation="";try{topLocation=top.location.href;}catch(e){topLocation=document.location.href;};return this.urlParam(topLocation,$00,$01);}};this.linkTrackInit=function(){var $04=false;for(var i=0;i<webtrekkLinktrackObjects.length;i++){if(this==webtrekkLinktrackObjects[i]){$04=true;}};if(!$04){webtrekkLinktrackObjects.push(this);};if(this.linkTrack&&this.linkTrack=="link"){this.linktrackNamedlinksOnly=false;};for(var c=0;c<document.links.length;c++){var name=this.getAttribute(document.links[c],this.linkTrackAttribute);var $05=this.getAttribute(document.links[c],"href");if((this.linkTrackIgnorePattern&&$05.search(this.linkTrackIgnorePattern)==-1)||!this.linkTrackIgnorePattern){if((name||!this.linktrackNamedlinksOnly)&&typeof(document.links[c].wt_marked)=="undefined"){document.links[c].wt_marked=true;this.registerEvent(document.links[c],'mousedown',webtrekkLinktrack);}}}};if(this.linkTrack){this.linkTrackInit();};this.getCCParams=function(a){var p='';if(this.config.customClickParameter){var $06=(this.config.customClickParameter[this.getAttribute(a,"name")])?this.config.customClickParameter[this.getAttribute(a,"name")]:this.config.customClickParameter[a.id];if(!$06){$06=this.config.customClickParameter;};for(var z in $06){if(!isNaN(z)&&this.wtTypeof($06[z])&&typeof($06[z])=='string'&&$06[z]!=''){if(this.checkSC('custom')){$06[z]=this.decrypt($06[z]);};p+='&ck'+z+'='+this.wtEscape($06[z]);}}};this.ccParams=p;return;};this.plugInArray=function($07,$08){if(typeof($07)!='object'){return false;};for(var i=0;i<$07.length;i++){var $09=new RegExp($07[i].toLowerCase(),'g');if($08.toLowerCase().search($09)!=-1){return $07[i];}};return false;};this.quicksend=function($0a,$0b,$0c,$0d){if(!this.trackDomain||!this.trackId||this.deactivatePixel||this.deactivateRequest){this.deactivateRequest=false;return;};if(!$0c){$0c="wt";};if(typeof(this.requestTimeout)=="undefined"){this.requestTimeout=5;};if(this.cookie=="1"){$0b="&eid="+this.eid+"&one="+(this.cookieOne?"1":"0")+"&fns="+(this.forceNewSession?"1":"0")+$0b;};if(this.cookie!="1"&&(this.wtTypeof(this.cookieEidTimeout)||this.wtTypeof(this.cookieSidTimeout))){if(this.wtTypeof(this.cookieEidTimeout)&&this.cookieEidTimeout!=''){$0b="&cet="+this.cookieEidTimeout+$0b;};if(this.wtTypeof(this.cookieSidTimeout)&&this.cookieSidTimeout!=''){$0b="&cst="+this.cookieSidTimeout+$0b;}};if(this.pixelSampling>0){$0b+="&ps="+this.pixelSampling;};$0b="&tz="+this.getTimezone()+$0b;var $0e="//"+this.trackDomain+"/"+this.trackId+"/"+$0c+"?p="+this.version+","+$0a+$0b+"&eor=1";if(!this.ignorePrerendering&&this.isChrome&&typeof(document.webkitHidden)!="undefined"){if(typeof(this.prerendering)!="object"){this.prerendering=new Array();};if(document.webkitHidden){this.prerendering.push($0e);var pi=this;this.registerEvent(document,"webkitvisibilitychange",function(){pi.sendPrerendering();});return;}};if($0d=="saveRequest"&&this.cookie=="3"){if(this.getCookie("saveRequestV3")){this.setCookie("saveRequestV3",this.getCookie("saveRequestV3")+"<<>>"+$0e,this.requestTimeout);}else{this.setCookie("saveRequestV3",$0e,this.requestTimeout);}}else{this.sendPixel($0e,$0c);};if($0c!='hm'){this.cookieOne=false;this.forceNewSession=false;this.sentFullPixel=1;}};this.sendPrerendering=function(){if(!document.webkitHidden){for(var i=0;i<this.prerendering.length;i++){this.sendPixel(this.prerendering[i]);};this.prerendering=new Array();}};this.sendPixel=function($I,$0c){var $0f=(document.location.protocol=="https:"?"https:":"http:");if(this.forceHTTPS){$0f="https:";};$I=$0f+$I;if($0c=="hm"){$I+="&hm_ts="+new Date().getTime();};if(!this.wtTypeof($0g)){var $0g=new Array();};var ii=$0g.length;$0g[ii]=new Image();$0g[ii].onload=function(){return;};$0g[ii].src=$I;};this.checkCustomParameter=function(cp,np){var p="";if(typeof(cp)=='object'){for(var z in cp){if(!isNaN(z)&&this.wtTypeof(cp[z])&&typeof(cp[z])=='string'&&cp[z]!=''){if(this.checkSC('custom')){cp[z]=this.decrypt(cp[z]);};if(this.paramFirst.indexOf(np+z+';')==-1){p+='&'+np+z+'='+this.wtEscape(cp[z]);}}}};return p;};this.send=function(p,$c,ep){if($c=="link"||$c=="click"){this.config.linkId=p;};this.config.contentId=(this.config.contentId)?this.config.contentId:this.contentId;var $0h=($c&&($c=="link"||$c=="click"))?this.config.contentId:(p)?p:this.config.contentId;if(!$0h){$0h="no_content";};var $0i="";var $0j=this.wtEscape($0h)+",1,";$0j+=this.baseparams();var $0k=navigator.plugins.length;var $0l="";if($0k>0){var $0m=Array();for(var i=0;i<$0k;i++){if(navigator.plugins&&navigator.appName!='Microsoft Internet Explorer'){if(navigator.plugins[i].name=="Shockwave Flash"){$0l=navigator.plugins[i].description;}else{$0l=navigator.plugins[i].name;};var $0n=this.plugInArray(this.plugins,$0l);if($0n&&!this.plugInArray($0m,$0n)){$0m.push($0n);}}};$0l=$0m.join("|");};if(this.paramFirst){var $0o=this.paramFirst.split(";");for(var i=0;i<$0o.length;i++){var $00=this.getMappingParam($0o[i]);var $0p=$00.mapping;var $y=$00.index;if($0p){if($y){if(this.config[$0p]&&typeof(this.config[$0p][$y])!="undefined"&&this.config[$0p][$y]){$0i+="&"+$0o[i]+"="+this.wtEscape(this.config[$0p][$y]);}}else if(this.config[$0p]){$0i+="&"+$0o[i]+"="+this.wtEscape(this.config[$0p]);}}}};if(typeof(ep)=="string"&&ep!=""){ep=ep.split(/;/);for(var z=0;z<ep.length;z++){if(this.wtTypeof(ep[z])){$h=ep[z].split(/=/);if(this.checkSC('custom')){$h[1]=this.decrypt($h[1]);};$h[1]=this.wtEscape($h[1]);$0i+='&'+$h[0]+'='+$h[1];}}}else{this.wtEpEncoded=false;var $0q=this.checkCustomParameter(this.config.customParameter,"cp");var $0r=this.checkCustomParameter(this.config.customSessionParameter,"cs");var $0s=this.checkCustomParameter(this.config.customTimeParameter,"ce");var $0t=this.checkCustomParameter(this.config.customEcommerceParameter,"cb");if(this.config.orderValue){if(this.paramFirst.indexOf("ov;")==-1){if(this.checkSC('order')){$0i+="&ov="+this.wtEscape(this.decrypt(this.config.orderValue));}else{$0i+="&ov="+this.wtEscape(this.config.orderValue);}}};if(this.config.currency){if(this.paramFirst.indexOf("cr;")==-1){if(this.checkSC('order')){$0i+="&cr="+this.wtEscape(this.decrypt(this.config.currency));}else{$0i+="&cr="+this.wtEscape(this.config.currency);}}};if(this.config.orderId){if(this.paramFirst.indexOf("oi;")==-1){$0i+="&oi="+this.wtEscape(this.config.orderId);}};if(this.config.product){if(this.paramFirst.indexOf("ba;")==-1){$0i+="&ba="+this.wtEscape(this.config.product);};if(this.config.productCost){if(this.paramFirst.indexOf("co;")==-1){$0i+="&co="+this.wtEscape(this.config.productCost);}};if(this.config.productQuantity){if(this.paramFirst.indexOf("qn;")==-1){$0i+="&qn="+this.wtEscape(this.config.productQuantity);}};$0i+=this.checkCustomParameter(this.config.productCategory,"ca");if(this.config.productStatus){if(this.paramFirst.indexOf("st;")==-1){$0i+="&st="+this.wtEscape(this.config.productStatus);}}};var customerId=$0u("wt_cd","(.*)");if(!this.config.customerId){this.config.customerId=customerId;};if(this.config.customerId){if(this.paramFirst.indexOf("cd;")==-1){$0i+="&cd="+this.wtEscape(this.config.customerId);}};$0i+=this.checkCustomParameter(this.config.crmCategory,"vc");if(this.browserLang){$0i+="&la="+this.wtEscape(this.browserLang);};$0i+=this.checkCustomParameter(this.config.contentGroup,"cg");var $0v='';if(this.config.campaignId){if(!(this.config.campaignId in this.sentCampaignIds)){if(this.paramFirst.indexOf("mc;")==-1){$0i+="&mc="+this.wtEscape(this.config.campaignId);}}else{if(this.paramFirst.indexOf("mc;")==-1){$0i+="&mc="+this.wtEscape("ignore%3Dignore");}};if(this.paramFirst.indexOf("mca;")==-1){$0i+="&mca="+((this.config.campaignAction)?this.config.campaignAction.substring(0,1):"c");};this.sentCampaignIds[this.config.campaignId]=true;$0v+=this.checkCustomParameter(this.config.customCampaignParameter,"cc");};if(this.trackingSwitchMediaCode){$0i+="&tmc="+this.wtEscape(this.trackingSwitchMediaCode);};if(this.trackingSwitchMediaCodeValue){$0i+="&tmcv="+this.wtEscape(this.trackingSwitchMediaCodeValue);};if(this.trackingSwitchMediaCodeTimestamp){$0i+="&tmct="+this.wtEscape(this.trackingSwitchMediaCodeTimestamp);};if(typeof($0w)=="object"&&typeof($0w.trackingSwitchMediaCode)!="undefined"){$0i+="&tmc="+this.wtEscape($0w.trackingSwitchMediaCode);};if(typeof($0w)=="object"&&typeof($0w.trackingSwitchMediaCodeValue)!="undefined"){$0i+="&tmcv="+this.wtEscape($0w.trackingSwitchMediaCodeValue);};if(typeof($0w)=="object"&&typeof($0w.trackingSwitchMediaCodeTimestamp)!="undefined"){$0i+="&tmct="+this.wtEscape($0w.trackingSwitchMediaCodeTimestamp);};var $0x="";var $0y;if(typeof(wt_vt)!="undefined"){$0y=wt_vt;};if(!this.wtTypeof($0y)){$0y=this.urlParam(location.href,'wt_vt',false);};if($0y){var $0z=this.getCookie('wt_vt').split(";");for(var i=0;i<$0z.length;i++){if($0z[i].indexOf($0y+'v')!=-1){$0x='&wt_vt='+$0z[i].split('t')[0].split('v')[1];}}};if($0x){$0i+=$0x;};if(this.config.internalSearch){if(this.paramFirst.indexOf("is;")==-1){$0i+="&is="+this.wtEscape(this.maxlen(this.config.internalSearch,255));}};if($0q){$0i+=$0q;};if($0v){$0i+=$0v;};if($0s){$0i+=$0s;};if($0t){$0i+=$0t;};if($0r){$0i+=$0r;};if(this.wtTypeof(this.config.customSid)&&this.config.customSid!=''){$0i+="&csid="+this.config.customSid;};if(this.wtTypeof(this.config.customEid)&&this.config.customEid!=''){$0i+="&ceid="+this.config.customEid;};if(this.wtTypeof(this.config.xwtip)&&this.config.xwtip!=''){$0i+="&X-WT-IP="+this.wtEscape(this.config.xwtip);};if(this.wtTypeof(this.config.xwtua)&&this.config.xwtua!=''){$0i+="&X-WT-UA="+this.wtEscape(this.config.xwtua);};if(this.wtTypeof(this.config.xwtrq)&&this.config.xwtrq!=''){$0i+="&X-WT-RQ="+this.wtEscape(this.config.xwtrq);};if(!this.sentFullPixel&&this.firstVisitContact){$0i+="&fvc="+this.firstVisitContact;};if(!this.sentFullPixel&&this.lastVisitContact){$0i+="&lvc="+this.lastVisitContact;}};if(this.config.linkId&&this.config.customClickParameter){var $06=(this.config.customClickParameter[this.config.linkId])?this.config.customClickParameter[this.config.linkId]:this.config.customClickParameter;$0i+=this.checkCustomParameter($06,"ck");this.ccParams=false;};if(this.config.xlc&&this.config.xlct){if(this.config.xlc!=""||this.config.xlct!=""){if(this.config.xlcv){var $0A=this.getExtLifeCycles(this.config.xlc,this.config.xlct,this.config.xlcv);}else{var $0A=this.getExtLifeCycles(this.config.xlc,this.config.xlct);};$0i+=$0A;}};if(this.config.linkId&&this.config.sendOnUnload){this.linkTrack="manual";this.wtEp=$0i;this.wtEpEncoded=true;if(this.isChrome||this.isOpera||this.isSafari){webtrekkUnload('noForm',"link");}else{this.registerEvent(window,(this.isIE&&this.wtTypeof(window.onbeforeunload))?"beforeunload":"unload",webtrekkUnload);};return;}else if(this.config.linkId){this.wtEp=$0i;this.wtEpEncoded=true;webtrekkUnload('noForm',"click");return;}else if(!this.config.contentId&&!this.config.linkId){this.config.contentId=this.contentId;this.config.linkId="wt_ignore";this.wtEp=$0i;this.wtEpEncoded=true;webtrekkUnload('noForm',"click");return;}else if(this.config.sendOnUnload){this.wtEp=$0i;this.wtEpEncoded=true;if(this.isChrome||this.isOpera||this.isSafari){webtrekkUnload('noForm',"link");}else{this.registerEvent(window,(this.isIE&&this.wtTypeof(window.onbeforeunload))?"beforeunload":"unload",webtrekkUnload);};return;};if(this.cookie=="1"){if(this.cookieOne){$0i+="&np="+this.wtEscape($0l);}}else{$0i+="&np="+this.wtEscape($0l);};this.quicksend($0j,$0i,false,"sendRequest");};this.sendinfo=function(c,p,$c,ep){if(this.cookie=="1"&&!this.optOut&&!this.deactivatePixel){this.firstParty();};if(location.href.indexOf('fb_xd_fragment')!=-1){return;};if(typeof(c)=='object'){this.config=c;}else{this.config=this.getConfig();};if(!this.config.campaignId&&this.mediaCode){this.getMediaCode();};if(this.getCookie("saveRequestV3")){var $0B=this.getCookie("saveRequestV3").split("<<>>");for(var i=0;i<$0B.length;i++){this.sendPixel($0B[i],"wt");};this.setCookie("saveRequestV3","",-3600);};if(this.beforeSendinfoPixel!=false){this.beforeSendinfoPixel();}else{this.executePlugin(this.getPluginConfig(($c)?$c:"page","before"));};if(this.contentId!=""||p!=""||document.layers){this.send(p,$c,ep);};if(this.afterSendinfoPixel!=false){this.afterSendinfoPixel();}else{this.executePlugin(this.getPluginConfig(($c)?$c:"page","after"));}};this.sendinfo_media=function($0C,mk,$0D,$0E,mg,bw,$0F,$0G){if(this.wtTypeof($0H)){$0H($0C,mk,$0D,$0E,mg,bw,$0F,$0G,this.unloadInstance);}};this.getExtLifeCycles=function(xlc,xlct,xlcv){var $0I="";var $0J=new Object();var $0K=xlc.split("|");for(var i=0;i<$0K.length;i++){var $0L=$0K[i].split(";");for(var j=0;j<$0L.length;j++){if(j==0){$0I+=this.wtEscape($0L[j]);}else{$0I+=$0L[j];};$0I+=";";};$0I=$0I.substr(0,$0I.length-1);$0I+="|";};$0I=$0I.substr(0,$0I.length-1);$0J.xlcl=this.wtEscape(xlc.split("|").length);$0J.xlct=this.wtEscape(xlct);if(typeof(xlcv)!="undefined"){$0J.xlcv=this.wtEscape(xlcv);};$0J.xlc=this.wtEscape($0I);var $0b="";for(i in $0J){$0b+="&"+i+"="+$0J[i];};return $0b;};this.isOwnDomain=function(l){var pt='';if(this.domain){if(this.domain.toUpperCase().indexOf("REGEXP:")==0){pt=new RegExp(this.domain.substring(7),"i");if(pt.test(this.getDomain(l))){return true;}}else{var $0M=this.domain.split(';');var $0N=this.getDomain(l);for(var i=0;i<$0M.length;i++){if($0N==$0M[i]){return true;}}}}else{return false;};return false;};this.getDomain=function(l){if(typeof(l)!='string'){return '';};l=this.wtUnescape(l);l=l.split('://')[1];var rx=new RegExp('^(?:[^\/]+:\/\/)?([^\/:]+)','g');if(typeof(l)!="undefined"){l=l.match(rx);if(l[0]){return l[0].toLowerCase();}};return '';};var $0O=function(){var $0P=0,$0Q=$0u("wt_ref","(.*)");if($d.framesetReferrer){$0P=$d.wtEscape($d.framesetReferrer);}else if($d.getCookie("wt_ref")!=""){$0P=$d.wtEscape($d.getCookie("wt_ref"));$d.setCookie("wt_ref","",-3600);}else if($0Q){$0P=$d.wtEscape($0Q);}else{if(document.referrer.length>0){$0P=$d.wtEscape(document.referrer);}};if($d.sentFullPixel){$0P="2";}else if($d.isOwnDomain($0P)){$0P="1";};return $0P;};var $0R=function(){var $0S=0;if(!document.layers&&document.getElementById){try{$0S=top.window.innerHeight;}catch(e){};}else{$0S=top.window.innerHeight;};if(!$0S){try{$0S=top.document.documentElement.clientHeight;}catch(e){};};if(!$0S){try{$0S=top.document.body.clientHeight;}catch(e){};};if(typeof($0S)=='undefined'){$0S=-1;};return $0S;};var $0T=function(){var $0U=0;if(!document.layers&&document.getElementById){try{$0U=top.window.innerWidth;}catch(e){};}else{$0U=top.window.innerWidth;};if(!$0U){try{$0U=top.document.documentElement.clientWidth;}catch(e){};};if(!$0U){try{$0U=top.document.body.clientWidth;}catch(e){};};if(typeof($0U)=='undefined'){$0U=-1;};return $0U;};this.baseparams=function(){var $0V=screen.width+"x"+screen.height+","+(navigator.appName!='Netscape'?screen.colorDepth:screen.pixelDepth)+",";$0V+=((navigator.cookieEnabled==true)?"1,":((navigator.cookieEnabled==false)?"0,":((document.cookie.indexOf("=")!=-1)?"1,":"0,")));$0V+=new Date().getTime()+",";$0V+=$0O();var $0S=$0R();var $0U=$0T();if($0S&&$0S>screen.height){$0S=screen.height;};if($0U&&$0U>screen.width){$0U=screen.width;};$0V+=","+$0U+"x"+$0S;$0V+=","+(navigator.javaEnabled()?"1":"0");return $0V;};this.getMediaCode=function(mc){if(!mc){if(!this.mediaCode){return false;};mc=this.mediaCode;};var v;if(this.mediaCodeValue){v=this.mediaCodeValue.split(";");};var m=mc.split(";");this.config.campaignId="";for(var i=0;i<m.length;i++){if(this.config.campaignId!=""){this.config.campaignId+=";";};if(this.mediaCodeCookie){if(this.getCookie('wt_'+m[i].toLowerCase()+this.allUrlParam(m[i],"").toLowerCase())==''){this.config.campaignId+=m[i]+this.wtEscape("="+this.allUrlParam(m[i],""));}else{this.config.campaignId+="ignore%3Dignore";};var $0W='';if(this.mediaCodeCookie=='eid'){$0W=60*30*24*60;};this.setCookie('wt_'+m[i].toLowerCase()+this.allUrlParam(m[i],"").toLowerCase(),1,$0W);}else{if(typeof(v)!="undefined"&&typeof(v[i])!="undefined"&&v[i]!=""){this.config.campaignId+=m[i]+this.wtEscape("="+v[i]);}else if(this.allUrlParam(m[i],"")!=""){this.config.campaignId+=m[i]+this.wtEscape("="+this.allUrlParam(m[i],""));}}}};this.searchContentIds=function(){var $0X=0;var $04=0;this.contentIds=this.wtEscape(this.contentId.split(";")[0]);do{$0X++;var $0Y=this.urlParam(location.href,"wt_contentId"+$0X,false);if($0Y){this.contentIds+="&wt_contentId"+$0X+"="+this.wtEscape($0Y);$04++;}}while($04>=$0X);};this.startHeatmapOrOverlay=function($0f,$B){this.searchContentIds();if(this.contentIds){if(this.include(location.protocol+"//"+this.reporturl+"/"+$0f+".pl?wt_contentId="+this.contentIds+"&x="+new Date().getTime())){if($0f=="heatmap"&&navigator.userAgent.indexOf('MSIE 6')!=-1&&navigator.userAgent.indexOf('Windows NT 5.0')!=-1){alert("Click OK to start heatmap.");};if(document.readyState!="interactive"&&document.readyState!="complete"){this.registerEvent(window,"load",$B);}else{$B();}}}};this.heatmapOn=(this.wtHref().indexOf("wt_heatmap=1")>=0);this.overlayOn=(this.wtHref().indexOf("wt_overlay=1")>=0||document.cookie.indexOf("wt_overlay=1")>=0);if(this.wtHref().indexOf("wt_overlay=0")>=0){this.overlayOn=false;this.setCookie("wt_overlay","",-1);};var $0Z=false;for(i=0;i<webtrekkHeatmapObjects.length;i++){if(this==webtrekkHeatmapObjects[i]){$0Z=true;}};if(!$0Z&&this.heatmap&&this.heatmap=="1"){webtrekkHeatmapObjects.push(this);this.registerEvent(document,"mousedown",webtrekkHeatmapClick);};if(this.heatmapOn&&!this.disableOverlayView){this.searchContentIds();this.startHeatmapOrOverlay("heatmap",webtrekkStartHeatmap);};if(this.overlayOn&&!this.disableOverlayView){this.searchContentIds();this.setCookie("wt_overlay","1");this.startHeatmapOrOverlay("overlay",webtrekkStartOverlay);};this.setPixelSampling=function($10){if(!$10){var $10=this.pixelSampling;};var trackId=this.trackId.split(",")[0];var $11=this.getCookie("wt3_sample").split(";");var $12=false;for(var i=0;i<$11.length;i++){if(this.indexOf($11[i],trackId+"|"+$10)!=-1){$12=true;}else{if(this.indexOf($11[i],trackId+"|")!=-1){$11[i]="";}}};var $13=6;if(this.cookieEidTimeout){$13=this.cookieEidTimeout;};if(!$12){if(Math&&Math.random&&parseInt(Math.random()*$10)==0){$11.push(trackId+"|"+$10+"|1");}else{$11.push(trackId+"|"+$10+"|0");};this.setCookie("wt3_sample",$11.join(";"),$13*30*24*60);$11=this.getCookie("wt3_sample");}else{$11=$11.join(";");this.setCookie("wt3_sample",$11,$13*30*24*60);};if(this.indexOf($11,trackId+"|"+$10+"|1")==-1){this.deactivatePixel=true;}};if(this.pixelSampling&&!this.optOut){this.setPixelSampling();};var $0u=function($00,$14){var $15=$d.urlParam(location.href,$00,false);var $16=$d.urlParam(location.href,"wt_t",false);var $17=new Date().getTime();var $18=new RegExp($14);if($16){$16=parseInt($16)+(15*60*1000);}else{$16=$17-(15*60*1000);};if($15&&$18.test($15)&&$16>$17){return $15;};return false;};var $19=function($1a){if($1a&&$1a.substring(0,1)=="2"){var $1b=parseInt($1a.substring(1,11)+"000");var $1c=new Date($1b);var $1d=$1c.getFullYear();$1d+=(($1c.getMonth()<9)?"0":"");$1d+=($1c.getMonth()+1);$1d+=(($1c.getDate()<9)?"0":"");$1d+=$1c.getDate();$1d+=(($1c.getHours()<9)?"0":"");$1d+=$1c.getHours();$1d+=(($1c.getMinutes()<9)?"0":"");$1d+=$1c.getMinutes();return $1d;};return "";};this.firstParty=function(){var $1e=this.getCookie("wt3_sid").split(";");var $1f=this.getCookie("wt3_eid").split(";");var $13=(this.cookieEidTimeout)?this.cookieEidTimeout:6;var trackId=this.trackId.split(",")[0];var $1g=false;var $1h=false;var $1i=false;var $1c=this.generateEid();for(var i=0;i<$1e.length;i++){if($1e[i].indexOf(trackId)!=-1){$1g=i;break;}};for(var i=0;i<$1f.length;i++){if($1f[i].indexOf(trackId+"|")!=-1){$1h=i;break;}};if(!$1g){$1e.push(trackId);if($1h){this.forceNewSession=true;}};this.eid=$0u("wt_eid","^[0-9]{19}$");if(!$1h){if(!this.eid){this.eid=this.generateEid();};this.cookieOne=true;$1f.push(trackId+"|"+this.eid+"#"+$1c);this.setCookie("wt3_eid",$1f.join(";"),$13*30*24*60);}else{if(this.eid){$1f[$1h]=trackId+"|"+this.eid;this.updateCookie=true;};if($1f[$1h].indexOf("#")==-1){$1f[$1h]+="#"+$1c;};$1i=$1f[$1h].replace(trackId+"|","").split("#")[1];this.eid=$1f[$1h].replace(trackId+"|","").split("#")[0];$1f[$1h]=$1f[$1h].replace(/\#[0-9]{19}/g,"#"+$1c);if(this.updateCookie){this.setCookie("wt3_eid",$1f.join(";"),$13*30*24*60);}};this.setCookie("wt3_sid",$1e.join(";"));if(!$1g){this.firstVisitContact=$19(this.eid);if(this.updateCookie){$1i=(($1i)?$1i:$1c);this.lastVisitContact=$19($1i);}}};var $1k=false;for(i=0;i<webtrekkUnloadObjects.length;i++){if(this==webtrekkUnloadObjects[i]){$1k=true;}};if(!$1k){webtrekkUnloadObjects.push(this);};this.findForm=function(){if(!this.form||this.formObject){return;};var f=document.forms;for(var i=0;i<f.length;i++){var cf=f[i];if(this.wtTypeof(cf.elements["wt_form"])){this.formObject=cf;return;}}};this.checkFormFocus=function($1l){if($1l==this.formFocus){return 1;};return 0;};this.getFormFieldValue=function(ff){var p=ff.name;if(this.formFieldAttribute){p='';var tmp=this.getAttribute(ff,this.formFieldAttribute);if(tmp||tmp!==null){p=tmp;}};return p;};this.isFormFieldAnonym=function(ff){var $1m=[];if(this.formFullContent){$1m=this.formFullContent.split(";");};if(this.formAnonymous||(ff.type!="select-multiple"&&ff.type!="select-one"&&ff.type!="checkbox"&&ff.type!="radio")){for(var k=0;k<$1m.length;k++){if($1m[k]==this.getFormFieldValue(ff)){return false;}};return true;};return false;};this.getFieldValue=function(ff,e){var $T=this.getAttribute(e,this.formValueAttribute).replace(/[\.|\;|\|]/g,"_");if(ff.type!="select-multiple"&&ff.type!="select-one"&&ff.type!="checkbox"&&ff.type!="radio"){return this.maxlen(e.value,30);};if(!this.isFormFieldAnonym(ff)){return this.maxlen($T,30);};return "anon";};this.gatherForm=function(){var $1n=";";if(!this.formObject){return;};var f=this.formObject;this.formName=this.getAttribute(f,this.formAttribute)?this.getAttribute(f,this.formAttribute):this.contentId.split(";")[0];var fl="";if(this.wtTypeof(f.elements["wt_fields"])){fl=f.elements["wt_fields"].value;};if(!fl){for(var i=0;i<f.elements.length;i++){var e=f.elements[i];if(this.getFormFieldValue(e)){fl+=this.getFormFieldValue(e)+$1n;}};fl=fl.substring(0,fl.lastIndexOf($1n));};var $1o=fl.split($1n);var $1p=$1o.length;var pa="";var $1q={},$1r=false;for(var i=0;i<f.elements.length;i++){var e=f.elements[i],$T,$1s,$1t,$1u=false;if(fl){for(var j=0;j<$1p;j++){if(this.getFormFieldValue(e)==$1o[j]){$1u=true;}}}else{if(this.getFormFieldValue(e)){$1u=true;}};if($1u){$T=null;if(e.type=='select-multiple'){for(var j=0;j<e.options.length;j++){var $04=false;if(e.options[j].selected){$04=true;pa+=";"+this.getFormFieldValue(e).replace(/[\.|\;|\|]/g,"_")+"."+e.type+"|"+this.getFieldValue(e,e.options[j])+"|"+this.checkFormFocus(e.name);};if(!$04){$T="empty";}}}else if(e.type=='select-one'){if(e.selectedIndex!=-1){$T=this.getFieldValue(e,e.options[e.selectedIndex]);if(!$T){$T="empty";}}}else if(e.type=='checkbox'||e.type=='radio'){if(!e.checked){$T="empty";}else{$T=this.getFieldValue(e,e);}}else{if(e.type!="hidden"&&e.type!="button"&&e.type!="image"&&e.type!="reset"&&e.type!="submit"){$T=(this.getFieldValue(e,e)?"filled_out":"empty");if(!this.isFormFieldAnonym(e)){$T=this.getFieldValue(e,e);};if(!$T){$T="empty";}}};if($T){name=this.getFormFieldValue(e).replace(/[\.|\;|\|]/g,"_");$1s=";"+name+"."+e.type+"|";$1t=((this.isFormFieldAnonym(e)&&$T!="empty"&&$T!="filled_out")?"anon":$T)+"|"+this.checkFormFocus(e.name);if(e.type=='radio'){$1r=true;if(($1s in $1q)){if($1q[$1s].indexOf("empty")==0){$1q[$1s]=$1t;};continue;};$1q[$1s]=$1t;}else if(pa.indexOf($1s)==-1){pa+=$1s+$1t;}}}};if($1r){for(var $1v in $1q){pa+=$1v+$1q[$1v];}};if(pa){pa=pa.substring(1);};return pa;};this.formTrackInstall=function(f){if(f){this.formObject=f;}else{this.formObject=(document.forms[0])?document.forms[0]:false;};if(this.formObject){this.form="1";webtrekkFormTrackInstall();}};if(this.form){webtrekkFormTrackInstall();};this.cookieManager=function(name,$1w,$1x){var i,j;this.name=name;this.keySeperator="~";this.fieldSeparator="#";this.durationSeperator="|";this.found=false;this.expires=$1w;this.accessPath=$1x;this.rawValue="";this.fields=[];this.fieldsDuration=[];this.fieldnames=[];this.read=function(){var $A=this.name+"=";var $1y=document.cookie;this.rawValue=null;this.found=false;if($1y.length>0){$1z=$1y.indexOf($A);if($1z!=-1){$1z+=$A.length;end=$1y.indexOf(";",$1z);if(end==-1){end=$1y.length;};this.rawValue=$1y.substring($1z,end);this.found=true;}};if(this.rawValue!=null){var sl=this.rawValue.length;var $1A=0;var $1B=0;var i=0;do{$1B=this.rawValue.indexOf(this.fieldSeparator,$1A);if($1B!=-1){var $1C=this.rawValue.substring($1A,$1B).split(this.durationSeperator);var rV=$1C[0].split(this.keySeperator);this.fields[rV[0]]=unescape(rV[1]);this.fieldsDuration[rV[0]]=parseInt(unescape($1C[1]));i++;$1A=$1B+1;}}while($1B!=-1&$1B!=(this.rawValue.length-1));};return this.found;};this.getSize=function(){var $1D=new Date().getTime();var $1E="";for(i in this.fields){if(this.fieldsDuration[i]>=$1D){$1E+=escape(i)+this.keySeperator+escape(this.fields[i])+this.durationSeperator+escape(this.fieldsDuration[i])+this.fieldSeparator;}};return $1E.length;};this.write=function(){var $1D=new Date().getTime();var $1F=true;var $1E=this.name+"=";for(i in this.fields){if(this.fieldsDuration[i]>=$1D){$1E+=escape(i)+this.keySeperator+escape(this.fields[i])+this.durationSeperator+escape(this.fieldsDuration[i])+this.fieldSeparator;$1F=false;}};var $1G=($1F)?-99999:this.expires;if($1G!=""){if(typeof($1G)=="number"){var $1H=new Date();var $1I=new Date();$1I.setTime($1H.getTime()+1000*60*60*24*$1G);$1E+="; expires="+$1I.toGMTString();}else{$1E+="; expires="+$1G.toGMTString();}};if(this.accessPath!=null){$1E+="; PATH="+this.accessPath;};var d=location.hostname;var $V="^[0-9]{1,3"+String.fromCharCode(125)+"\.[0-9]{1,3"+String.fromCharCode(125)+"\.[0-9]{1,3"+String.fromCharCode(125)+"\.[0-9]{1,3"+String.fromCharCode(125)+"$";if(d.search($V)==-1){d=location.hostname.split(".");d=d[d.length-2]+"."+d[d.length-1];};$1E+="; DOMAIN="+d;document.cookie=$1E;return null;};this.remove=function(){this.expires=-10;this.write();return this.read();};this.get=function($1J){var $1D=new Date().getTime();if(this.fieldsDuration[$1J]>=$1D){return this.fields[$1J];};return "";};this.set=function($1J,$1K,$U,$c,$1L){if(!$U){$U=31536000;};if(!$c){$c="";};var $1D=new Date().getTime();if($c=="first"&&this.fields[$1J]!=""&&this.fields[$1J]!=null&&this.fieldsDuration[$1J]>=$1D){return this.fields[$1J];};this.fields[$1J]=$1K;this.fieldsDuration[$1J]=$1D+(parseInt($U)*1000);if(!$1L){this.write();};return $1K;};this.prepare=function($1J,$1K,$U,$c){this.set($1J,$1K,$U,$c,true);};this.read();};};
/* End webtrekk_v3.js */

/* Kompatibilitaetsmodus */
var webtrekkPixel=false;function wt_sendinfo(p,mode,ep){if(webtrekkPixel){for(var i in webtrekk){if(i!="plugins"&&i!="sendinfo"){webtrekkPixel[i]=webtrekk[i];}}webtrekkPixel.sendinfo(false,p,mode,ep);}}if(typeof(webtrekk)=="object"){webtrekkConfig=webtrekk;webtrekkPixel=new webtrekkV3();if(typeof(wt_updatePixel)=="function"){wt_updatePixel();}if(webtrekk.sendinfo&&webtrekk.sendinfo=='1'){webtrekkPixel.sendinfo();}}
/* End Kompatibilitaetsmodus */

                                                                                                                   
                                                                                                                   
if(typeof(webtrekkMediaTracking)=="undefined"){var webtrekkMediaTracking=new Object();};function wt_init_media(trackDomain,trackId,sampling){webtrekkMediaTracking.mediaStVersion=320;webtrekkMediaTracking.trackDomain=trackDomain;webtrekkMediaTracking.trackId=trackId;webtrekkMediaTracking.pixelSampling=(sampling)?sampling:0;webtrekkMediaTracking.deactivatePixel=false;webtrekkMediaTracking.posInterval=new Object();webtrekkMediaTracking.time=new Object();if(Math&&Math.random&&parseInt(Math.random()*parseInt(webtrekkMediaTracking.pixelSampling))!=0){webtrekkMediaTracking.deactivatePixel=true;}};function wt_sendinfo_media(wt_mi,mk,mt1,mt2,mg,bw,vol,mute){var wt_mg="";var params="";var wt_re=(typeof(wt_mediaInterval)!="undefined")?parseInt(wt_mediaInterval):3*2*5*2;var send=false;params+="&bw="+((bw)?bw:"");params+="&vol="+((vol)?vol:"");params+="&mut="+((mute)?mute:"");if(mg){mg=mg.split(";");for(var z=0;z<mg.length;z++){var tmp=mg[z].split("=");if(mk!="init"&&mk!="play"&&tmp[0].indexOf("mg")!=-1){continue;}else{wt_mg+="&"+tmp[0]+"="+wt_stEscape(tmp[1]);}}};if((mk=="init"||mk=="play")&&(typeof(webtrekkMediaTracking.posInterval[wt_mi])=="undefined"||webtrekkMediaTracking.posInterval[wt_mi]=="")){webtrekkMediaTracking.posInterval[wt_mi]="";webtrekkMediaTracking.time[wt_mi]="";};if(typeof(webtrekkMediaTracking.trackId)=="undefined"&&typeof(webtrekk)=="object"){wt_init_media(webtrekk.trackDomain,webtrekk.trackId);}else if(typeof(webtrekkMediaTracking.trackId)=="undefined"&&typeof(webtrekk)=="undefined"){return;};if(webtrekkMediaTracking.trackId&&typeof(webtrekkMediaTracking.instance)=="undefined"){webtrekkMediaTracking.instance=wt_getPixelInstance();webtrekkMediaTracking.eid=wt_getEid(webtrekkMediaTracking.trackId.split(","),webtrekkMediaTracking.instance.split(";"));webtrekkMediaTracking.pixelDeactivate=wt_getSampling(webtrekkMediaTracking.trackId.split(","),webtrekkMediaTracking.instance.split(";"));};if(typeof(mt2)!="undefined"&&mt2!=""&&mt2&&(typeof(webtrekkMediaTracking.posInterval[wt_mi])=="undefined"||webtrekkMediaTracking.posInterval[wt_mi]=="")){webtrekkMediaTracking.posInterval[wt_mi]=((parseInt(mt2)/wt_re)>=10)?(parseInt(mt2)/wt_re*1000):10*1000;}else if((typeof(mt2)=="undefined"||mt2=="")&&(typeof(webtrekkMediaTracking.posInterval[wt_mi])=="undefined"||webtrekkMediaTracking.posInterval[wt_mi]=="")){webtrekkMediaTracking.posInterval[wt_mi]=3*2*5*2*1000;};var trackId=webtrekkMediaTracking.trackId.split(",");for(var i=0;i<trackId.length;i++){var tempParams=params;if(mk=="pos"&&!send){if(webtrekkMediaTracking.time[wt_mi]==""){webtrekkMediaTracking.time[wt_mi]=new Date().getTime();send=true;}else{var tempTime=new Date().getTime();if(tempTime-webtrekkMediaTracking.time[wt_mi]<webtrekkMediaTracking.posInterval[wt_mi]){return;}else{webtrekkMediaTracking.time[wt_mi]=tempTime;send=true;}}};if(typeof(webtrekkMediaTracking.eid[i])!="undefined"&&webtrekkMediaTracking.eid[i]!=""){tempParams+="&eid="+webtrekkMediaTracking.eid[i];};if(typeof(webtrekkMediaTracking.pixelDeactivate[i])!="undefined"&&webtrekkMediaTracking.pixelDeactivate[i]=="true"){continue;};wt_stQuicksend(trackId[i],"st,1,"+wt_baseparams()+"&mi="+wt_stEscape(wt_mi)+"&mk="+mk+"&mt1="+mt1+"&mt2="+mt2+wt_mg+tempParams);}};function wt_stQuicksend(trackId,params,script){if(!webtrekkMediaTracking.trackDomain||!webtrekkMediaTracking.trackId||(typeof(webtrekkMediaTracking.deactivatePixel)!="undefined"&&webtrekkMediaTracking.deactivatePixel)){return;};if(!script){script="wt.pl";};params+="&x="+new Date().getTime();var wt_url=(location.protocol=="https:"?"https:":"http:")+"//"+webtrekkMediaTracking.trackDomain+"/"+trackId+"/"+script+"?p="+webtrekkMediaTracking.mediaStVersion+","+params;if(document.images){if(typeof(wt_i)=="undefined"){wt_i=new Array();};var ii=wt_i.length;wt_i[ii]=new Image();wt_i[ii].src=wt_url;wt_i[ii].onload=function(){};}else{document.write("<img src=\'"+wt_url+"\' height=\'1\' width=\'1\'>");}};function wt_stEscape(u){if(typeof(encodeURIComponent)=="function"){return encodeURIComponent(u);};return escape(u);};function wt_typeof(v){return(typeof v!="undefined")?1:0;};function wt_getPixelInstance(){var wt_instance="";for(var index in window){if(typeof(window[index])=="object"&&window[index]!=null){try{var contentId=(window[index]["contentId"])?window[index]["contentId"]:false;var trackId=(window[index]["trackId"])?window[index]["trackId"]:false;var trackDomain=(window[index]["trackDomain"])?window[index]["trackDomain"]:false;var domain=(window[index]["domain"])?window[index]["domain"]:false;var version=(window[index]["version"])?window[index]["version"]:(window["wt_version"])?window["wt_version"]:false;if(contentId&&trackId&&trackDomain&&domain&&version){wt_instance+=index+";";}}catch(e){}}};return wt_instance;};function wt_getEid(trackId,instance){var found=false;var wt_eid="";for(var i=0;i<trackId.length;i++){found=false;for(var j=0;j<instance.length-1;j++){var eid=(window[instance[j]]["eid"])?window[instance[j]]["eid"]:(instance[j]=="webtrekk"&&window["wt_cookie_eid"])?window["wt_cookie_eid"]:false;if(eid){var temp=window[instance[j]]["trackId"].split(",");for(var k=0;k<temp.length;k++){if(trackId[i]==temp[k]){wt_eid+=eid+";";found=true;break;}}};if(found){break;}};if(!found){wt_eid+=";";}};return wt_eid.split(";");};function wt_getSampling(trackId,instance){var found=false;var wt_sampling="";for(var i=0;i<trackId.length;i++){found=false;for(var j=0;j<instance.length-1;j++){var deactivatePixel=(window[instance[j]]["deactivatePixel"])?window[instance[j]]["deactivatePixel"]:(instance[j]=="webtrekk"&&window["wt_deactivatePixel"])?window["wt_deactivatePixel"]:false;var temp=window[instance[j]]["trackId"].split(",");for(var k=0;k<temp.length;k++){if(trackId[i]==temp[k]){wt_sampling+=deactivatePixel+";";found=true;break;}};if(found){break;}};if(!found){wt_sampling+=";";}};return wt_sampling.split(";");};function wt_getBrowserHeight(){var browserHeight=0;if(!document.layers&&document.getElementById){try{browserHeight=top.window.innerHeight;}catch(e){};}else{browserHeight=top.window.innerHeight;}if(!browserHeight){try{browserHeight=top.document.documentElement.clientHeight;}catch(e){};}if(!browserHeight){try{browserHeight=top.document.body.clientHeight;}catch(e){};}if(typeof(browserHeight)=='undefined'){browserHeight=-1;}return browserHeight;};function wt_getBrowserWidth(){var browserWidth=0;if(!document.layers&&document.getElementById){try{browserWidth=top.window.innerWidth;}catch(e){};}else{browserWidth=top.window.innerWidth;}if(!browserWidth){try{browserWidth=top.document.documentElement.clientWidth;}catch(e){};}if(!browserWidth){try{browserWidth=top.document.body.clientWidth;}catch(e){};}if(typeof(browserWidth)=='undefined'){browserWidth=-1;}return browserWidth;};function wt_baseparams(){var wt_c=screen.width+"x"+screen.height+","+(navigator.appName!='Netscape'?screen.colorDepth:screen.pixelDepth)+",";wt_c+=((navigator.cookieEnabled==true)?"1,":((navigator.cookieEnabled==false)?"0,":((document.cookie.indexOf("=")!=-1)?"1,":"0,")));wt_c+=new Date().getTime()+",";wt_c+=1;var browserHeight=wt_getBrowserHeight();var browserWidth=wt_getBrowserWidth();if(browserHeight&&browserHeight>screen.height){browserHeight=screen.height;}if(browserWidth&&browserWidth>screen.width){browserWidth=screen.width;}wt_c+=","+browserWidth+"x"+browserHeight;wt_c+=","+(navigator.javaEnabled()?"1":"0");return wt_c;};

                                                                                                                   
                                                                                                                   
var videoplayername = "CNL_Wired_670x380_ply"
var myTemplateLoaded, onTemplateReady, player, modVP, modExp, modCon, currentVideo; //videos we will swap
var videotitle, videoid, videolength, videoprop, videocat
var mgstring = "mg1={tipoPlayer};mg2={property};mg3={categoriaCNLive}"

myTemplateLoaded = function (experienceID) {
	//console.log("myTemplateLoaded");
	player = brightcove.api.getExperience(experienceID);
	modVP = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
	modExp = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
	modCon = player.getModule(brightcove.api.modules.APIModules.CONTENT);
}

onTemplateReady = function (evt) {
	modVP.getCurrentVideo(function (dto) {
		//console.log(dto);
		videotitle = dto.displayName; //.replace(/[^a-zA-Z0-9 ]/g,'');
		videotitle = encodeURIComponent(videotitle);
		videoid = dto.id;
		videolength = dto.length;
		var cusfie = dto.customFields;
		videoprop = dto.customFields.brand
		videocat = dto.customFields.categoria
		//console.log("videoprop " + videoprop);
		//console.log("videocat " + videocat);
	});
	modVP.addEventListener(brightcove.api.events.MediaEvent.BEGIN, onMediaEventFired);
	modVP.addEventListener(brightcove.api.events.MediaEvent.CHANGE, onMediaEventFired);
	modVP.addEventListener(brightcove.api.events.MediaEvent.COMPLETE, onMediaEventFired);
	modVP.addEventListener(brightcove.api.events.MediaEvent.ERROR, onMediaEventFired);
	modVP.addEventListener(brightcove.api.events.MediaEvent.PLAY, onMediaEventFired);
	modVP.addEventListener(brightcove.api.events.MediaEvent.PROGRESS, onMediaProgressFired);
	modVP.addEventListener(brightcove.api.events.MediaEvent.STOP, onMediaEventFired);
}

function onMediaEventFired(evt) {
	//console.log("MEDIA EVENT: " + evt.type + " fired at position: " + evt.position);
	var evento = "";
	if(evt.type=="mediaPlay"){evento="play"}
	else if(evt.type=="mediaStop"){evento="stop"}
	else if(evt.type=="mediaComplete"){evento="EOF"}
	
	if (evento != ""){
		mgstring = "mg1=" + videoplayername + ";mg2=" + videoprop + ";mg3=" + videocat
	   
		wt_sendinfo_media(
			videotitle + "_ID_" + videoid,	// titolo (al netto da caratteri non ASCII e virgolette) del video
			evento,							// evento  (play, stop, pause, EOF)
			parseInt(evt.position),			// tempo di partenza (nel caso del primo play/autoplay è sempre ZERO)
			videolength,					// durata totale del video
			mgstring,						// stringa di dettaglio, spiegata più avanti
			"64000",						// BANDWIDTH (se disponibile o va bene anche “hardcoded” ma non incide sull'analytics)
			"100",							// VOLUME
			"0"								// MUTED (boolean)
		);
	}
}

function onMediaProgressFired(evt) {
	var tester
   
	tester = parseInt(evt.position);
	var frattotester = (tester / 30);
	var intRegex = /^\d+$/;
	if(intRegex.test(frattotester)) {
   
		//document.getElementById("eventLog").innerHTML = videotitle + "_ID_" + videoid + "|pos|" + parseInt(evt.position) + "|" + videolength + "|" + mgstring;
		wt_sendinfo_media(
			videotitle + "_ID_" + videoid,	// titolo (nettizzato da caratteri non ASCII e virgolette) del video
			"pos",							// evento  (pos)
			parseInt(evt.position),			// tempo di visualizzazione
			videolength,					// durata totale del video
			mgstring,						// stringa di dettaglio, spiegata più avanti
			"64000",						// BANDWIDTH (se disponibile o va bene anche “hardcoded” ma non incide sull'analytics)
			"100",							// VOLUME
			"0"								// MUTED (boolean)
		);
	}
}

function currentVideoCallback(currentVideo) {

   if (currentVideo.id == videosToSwap[0]) {
	  modVP.loadVideoByID(videosToSwap[1]);
   } else {
	  modVP.loadVideoByID(videosToSwap[0]);
   }
}

var pageConfig = {
      linkTrack : "", // Attivare la rilevazione dei LINK ["link" o "standard"]
      heatmap : "", // Attivare la rilevazione della HEATMAP ["1" = on | "0" = off]
      form : "", // Attivare la rilevazione dei FORM ["1" = on | "0" = off]
      contentId : getContentIdByURL() // Popolare con il NOME della pagina
    };
    var wt = new webtrekkV3(pageConfig);
    var refresh;
    wt.ignorePrerendering = true;
    wt.contentGroup = {1: "Aggregato Condé Nast - WEB", 2: "Wired.it"};
    refresh = getExistsParameterByName("refresh_ce");
    wt.customParameter = {1: refresh};
    wt.sendinfo();

var webtrekkConfig = {
	trackId : "641856089134434",
	trackDomain : "condenastitalia01.wt-eu02.net",
	domain : "www.dummydomain-donotchange.com",
	cookie : "3",
	mediaCode : "wt_mc",
	contentId : ""
};



var authDelegate = new fyre.conv.RemoteAuthDelegate();

	authDelegate.doLogin = function (authDelegateToken){
      if (authDelegateToken) {
        	try {
          		fyre.conv.login(authDelegateToken);
          		jQuery("#livefyre-comments").removeClass("livefyre-anon");
          		console.log('Logging in...', authDelegateToken);
        	} catch (e) {
          		console.log("Error attempting to login with token value: ", authDelegateToken, " ", e);
        	}
    	}
	};

    authDelegate.login = function (handler){

    	var textarea = "";
    	
    	if(jQuery(".fyre-editor-field").length > 0){
    		textarea = jQuery(".fyre-editor-field").text();
    	}else{
    		textarea = jQuery(".fyre-editor-field-mobile").val();
    	}
    	
        jQuery.cookie('newredirect', location.href );
        jQuery.cookie('livefyre-comment-area', textarea );
   
    	jQuery('#profilo-login a').click();
    	jQuery('#mobile-login').click();
    	
    	handler.success();
    };

    authDelegate.logout = function (handler) {
		return true;
    };

    authDelegate.viewProfile =  function(handler,author) {
		// location.href = "/profilo#" + author.id.split('@')[0];
		handler.success();
    }

    authDelegate.editProfile = function(handler,author) {
		// location.href = "/profilo#" + author.id.split('@')[0];
		handler.success();
    };
    
    livefyre_onload_handler = function(widget){
   
    	// translate
    	var cc = jQuery("#livefyre-comments").eq(0);
    	
    	var translate = function() {
    		
    		console.log("Livefyre translator triggered ....");
    		
    		$(".fyre-share-button .fyre-button-right-inner-box",cc).livefyre_translate("Condividi","Share");
    		$(".fyre-comment-count span", cc).livefyre_translate("commenti", "comments");
    		$(".fyre-live-container .fyre-stream-livecount", cc).livefyre_translate("persone in ascolto", "people listening");
    		$(".fyre-stream-sort-newest",cc).livefyre_translate("Nuovi");
    		$(".fyre-stream-sort-oldest",cc).livefyre_translate("Vecchi");
    		$(".fyre-comment-like-btn",cc).livefyre_translate("Mi piace");
    		$(".fyre-share-link",cc).livefyre_translate("Condividi");
    		$(".fyre-flag-link",cc).livefyre_translate("Segnala");
    		$(".fyre-comment-date",cc).livefyre_translate("minuti", "minutes ago").livefyre_translate("minuto", "minute ago").livefyre_translate("adesso", "just now").livefyre_translate("giorni", "days ago").livefyre_translate("ore", "hours ago").livefyre_translate("giorno", "day ago").livefyre_translate("ora", "hour ago");
    		$(".fyre-follow-button .fyre-button-left-inner-box",cc).livefyre_translate("Segui", "Follow").livefyre_translate("Non seguire", "Unfollow");
    		$(".fyre-post-button .fyre-button-right-inner-box",cc).livefyre_translate("Commenta");
    		$(".fyre-editor-error-message",cc).livefyre_translate("Prima scrivi qualcosa ...", "It seems you're attempting to post an empty review.");
    		$(".fyre-comment-reply",cc).livefyre_translate("Rispondi");
    		$(".fyre-delete-link",cc).livefyre_translate("Elimina");
    		$(".fyre-provider-connections strong",cc).livefyre_translate("Per vedere e citare i tuoi amici");
    		
    		cc.one("DOMSubtreeModified", function(){ setTimeout(translate, 100); });

			/* Fix Link Profilo */
    		
            jQuery(".fyre-box-list").remove();
			// jQuery(".fyre-hovercard").remove();
			jQuery(".fyre-hovercard-button").remove();
            
            jQuery(".fyre-user-drop").addClass("fyre-user");
            jQuery(".fyre-user-drop").removeClass("fyre-user-drop");
    		
    	};
    	
    	cc.one("DOMSubtreeModified",translate);

        textarea = jQuery.cookie('livefyre-comment-area');
        if(typeof(textarea)!='undefined'){
                setTimeout(function(){
                        

                    	if(jQuery(".fyre-editor-field").length > 0){
                    		jQuery(".fyre-editor-field").text(textarea);
                    	}else{
                    		jQuery(".fyre-editor-field-mobile").val(textarea);
                    		$("#showComm").hide();
                    		jQuery("#livefyre-comments").show();
                    	}

                        jQuery.removeCookie('newredirect');
                        jQuery.removeCookie('livefyre-comment-area');
                        
                }, 1000 );
        }

    };
    
    (function( $ ) {
    
	    $.fn.livefyre_translate = function(t, r) {
	    	$(this).each(function(){
	    		var q = $(this); 
				var filter = function(){ return this.nodeType == 3; };
	    		var node = q.contents().filter(filter)[0];
	    		if(!node) node = q[0];
				if(!node) return;
				var v = node.nodeValue;
				if(r) v = v.replace(r,t);
				else v = t;
	    		node.nodeValue = v;
  				return;
  			});
  			return $(this);
  		};
  		
    })(jQuery);
