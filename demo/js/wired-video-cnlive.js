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