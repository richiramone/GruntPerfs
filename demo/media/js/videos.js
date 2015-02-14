$(document).ready(function(){

		$("#saulvideointro").show();

		//set source for all youtube links to be called later

		var suelinkcontent ='<div><object width="640" height="385"><param name="movie" value="http://www.youtube.com/v/pPd67CEL54E&hl=en_US&fs=1&"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/pPd67CEL54E&hl=en_US&fs=1&" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="640" height="385"></embed></object></div>';
		var tigertroublecontent ='<div><object width="640" height="385"><param name="movie" value="http://www.youtube.com/v/ll7GSiad0ko&hl=en_US&fs=1&"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/ll7GSiad0ko&hl=en_US&fs=1&" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="640" height="385"></embed></object></div>';
		var mailbagcontent ='<div><object width="640" height="385"><param name="movie" value="http://www.youtube.com/v/j3DY1_zijgA&hl=en_US&fs=1&"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/j3DY1_zijgA&hl=en_US&fs=1&" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="640" height="385"></embed></object></div>';
		var wayfarercontent ='<div><object width="640" height="385"><param name="movie" value="http://www.youtube.com/v/7B-hSSiaEAw&hl=en_US&fs=1&"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/7B-hSSiaEAw&hl=en_US&fs=1&" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="640" height="385"></embed></object></div>';

		//handle click functionality on video thumbs

		$("#videocontentmodule div").click(function() {

			// get id of selected video
			var selectedVid = $(this).attr('id');

			// set code for sidebar, used when clicked


			//based on selected video, replace image selector image with youtube vid
			switch(selectedVid)
			{
				case "suelink":
					//set main panel to have selected video
					 $("#videocontentmodule").html(suelinkcontent);
					 // set right sidebar to have new video selector
					 $("#rightcoltemp").hide();
					 $("#rightcolnav").show();
				 break;
				case "tigertrouble":
					//set main panel to have selected video
					 $("#videocontentmodule").html(tigertroublecontent);
					 // set right sidebar to have new video selector
					 $("#rightcoltemp").hide();
					 $("#rightcolnav").show();
				 break;
				case "mailbag":
					//set main panel to have selected video
					 $("#videocontentmodule").html(mailbagcontent);
					 // set right sidebar to have new video selector
					 $("#rightcoltemp").hide();
					 $("#rightcolnav").show();
				 break;
				case "wayfarer":
					//set main panel to have selected video
					 $("#videocontentmodule").html(wayfarercontent);
					 // set right sidebar to have new video selector
					 $("#rightcoltemp").hide();
					 $("#rightcolnav").show();
				 break;
				default:
				//set main panel to have selected video
				$("#videocontentmodule").html(suelinkcontent);
				 // set right sidebar to have new video selector
					 $("#rightcoltemp").hide();
					 $("#rightcolnav").show();
			};

		});

		// handle clicking of sidebar video selector

		$(".consultationsside").click(function() {

			// get id of selected sidebar video link
			var selectedVidSide = $(this).attr('id');

			//based on selected sidebar video, replace the youtube video in the video area
			switch(selectedVidSide)
			{
				case "suelinkside":
					//set main panel to have selected video
					$("#videocontentmodule").html(suelinkcontent);
				break;
				case "tigertroubleside":
					//set main panel to have selected video
					$("#videocontentmodule").html(tigertroublecontent);
				break;
				case "mailbagside":
					//set main panel to have selected video
					$("#videocontentmodule").html(mailbagcontent);
				break;
				case "wayfarerside":
					//set main panel to have selected video
					$("#videocontentmodule").html(wayfarercontent);
				break;
				default:
					//set main panel to have selected video
					$("#videocontentmodule").html(suelinkcontent);
			};

		});

});

function killVideo() {
	$("#flashcontent").remove();
	$("#saulheader").attr("src","media/images/mainheader_saul_update.jpg");
}

function killVideoespanol() {
	$("#enespanol").remove();
}

