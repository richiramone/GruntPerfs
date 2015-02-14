$(document).ready(function(){	

	//idle state for espanol button
	var idleState = function() {	
		$(this).attr("src", "media/images/footerespanol_i.jpg");	
	};
	//over state for espanol button
	var activeState = function() {	
		$(this).attr("src", "media/images/footerespanol_o.jpg");	
	};	
	
	//create the handler for 
	$("#espanolfooter").hover(activeState, idleState);	
	
	$('#espanolfooter').click(function() {
		$("#enespanol").show();
	});	

	
});


