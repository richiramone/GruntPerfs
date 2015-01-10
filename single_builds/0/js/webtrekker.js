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