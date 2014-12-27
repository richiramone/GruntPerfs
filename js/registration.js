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
	var ajax_url = "/wp-admin/admin-ajax.php";
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

