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