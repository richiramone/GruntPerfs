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