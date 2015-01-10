var zone = "home", openGallery = "";
var _zone = "/5574/wired.it/";
var bannerList = new Array();
var listRefresBanner = new Array();
var listRefresFlipBanner = new Array();
var showGallery = true;

function refreshBanner() {
    try {
        googletag.pubads().refresh(listRefresBanner);
    } catch (e) {}
}

function refreshFlipBanner() {
    try {
        googletag.pubads().refresh(listRefresFlipBanner);
    } catch (e) {}
}

function adsJSCode(dimension, divID, refresh, promopos) {
    refresh = "true"; //SEMPRE A TRUE*/
    bannerList.push(divID);
    var _slot;
    try {
        _slot = googletag.defineSlot(_zone + zone, dimension, divID).addService(googletag.pubads());
        if (promopos != undefined && promopos != '') {
            _slot.setTargeting('promopos', promopos);
        }
    } catch (e) {}
    if ((refresh == "true") && (divID != 'advOverlayContainer')) { listRefresBanner.push(_slot); }
    if (divID == "adv_bkg") {
        _slot.renderEnded = function () {
            try {
                if (followingGoing != undefined)
                    return;
            } catch (e) {  }

            if (document.getElementById('adv_bkg').style.display == "none") {
                resetHTMLNew();
            } else {
                setHTMLforBannerNew();
            }
        };
    }
    if (divID == "advOverlayContainer") {
        _slot.renderEnded = function () {
            if (document.getElementById('advOverlayContainer').style.display == "none") {
                jQuery('#advOverlay').hide();
            } else {
                jQuery('#advOverlay').show();
            }
        };
    }

    if (divID == "adv_iso_high") {
        _slot.renderEnded = function () {
            if (document.getElementById('adv_iso_high').style.display == "none") {
                var $target = jQuery('#advIsoHigh');
                var $container = $('#container');
                if ($container.length) {
                    $target.hide();
                    $container.isotope( 'remove', $target );
                    $container.isotope( 'reLayout');
                } else if ($('#list-articles').length) {
                    $target.hide();
                    $('#list-articles').isotope( 'remove', $target );
                    $('#list-articles').isotope( 'reLayout');
                }
            }

        };
    }
    if (divID == "adv_iso_low") {
        _slot.renderEnded = function () {
            if (document.getElementById('adv_iso_low').style.display == "none") {
                var $target = jQuery('#advIsoLow');
                var $container = $('#container');
                if ($container.length) {
                    $target.hide();
                    $container.isotope( 'remove', $target );
                    $container.isotope( 'reLayout');
                } else if ($('#list-articles').length) {
                    $target.hide();
                    $('#list-articles').isotope( 'remove', $target );
                    $('#list-articles').isotope( 'reLayout');
                }
            }
        };
    }
}

function setHTMLforBannerNew() {
    pageController.addDomination();
    if ((jQuery("#adv_bkg iframe").attr('width') == '996') && (jQuery("#adv_bkg iframe").attr('height') == '350')) {
        $('.domination #wrapper').css('margin-top', '350px');
    }
    else if ((jQuery("#adv_bkg iframe").attr('width') == '970') && (jQuery("#adv_bkg iframe").attr('height') == '250')) {
        $('.domination #wrapper').css('margin-top', '250px');
    }
    if (showGallery == true){
        checkOpenGallery();
    }
}

function resetHTMLNew() {
    pageController.removeDomination();
    if (showGallery == true){
        checkOpenGallery();
    }
}

function checkOpenGallery(){
    showGallery = false;
    if ($('.fullscreen').length>0){
        try{
            if (openGallery != '' && (openGallery < $('.fullscreen').length)) {
                $('.fullscreen').eq(openGallery).trigger( "click" );
            }
        }
        catch (er){}
    }
}

window.onload=function(){
    try {
        if ($.browser.msie && parseInt($.browser.version) == 8) {
            //pageController.removeDomination();
        } else {
            pageController.removeDomination();
        }
        googletag.pubads().enableSingleRequest();
        googletag.pubads().enableAsyncRendering();
        googletag.pubads().collapseEmptyDivs();
        googletag.enableServices();

        $.each(bannerList, function (index, value) {
            googletag.display(value);
        })
    } catch (e) {}
};