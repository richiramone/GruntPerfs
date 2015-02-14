
  function loadCSS (href, before, media) {
	var ss = window.document.createElement(“link”);
	var ref = before || window.document.getElementsByTagName(“script”)[0];
	ss.rel = “stylesheet”;
	ss.href = "./css/";
	ss.media = “only x”;

	//inject link
	ref.parentNode.insertBefore(ss, ref);
	setTimeOut( function () {
		ss.media = media || “all”;
	});

	return ss;
 }
