jQuery( document ).ready( function( $ ) {
	
	setNavClass(); 
	 $(window).resize(function() {
		setNavClass();
	}); 
	
	
	function setNavClass() {
		var windowWidth = window.innerWidth;
		var navItems = $('.navbar-nav > li > a');
		if (windowWidth > 767) {
			navItems.addClass('disabled');
		}
		else {
			navItems.removeClass('disabled');
		}
	}
	
	var video =$('#agiosVideo')[0];
		$(video).prop("controls", true);
	
	$('#video').on('click', function(e) {
		if (video.paused)
		{
			 $(video).prop("controls", true);
			 video.currentTime = 0;
			 video.play();
		}
			else
		{
			 $(video).prop("controls", true);
			 video.play();
		}
		//$('#agiosVideo')[0].play();
	});
	
	$('body').on('hidden.bs.modal', '.modal', function () {
		$('video').trigger('pause');
	});
	
	$('#video').on('click', function(e) {
		$("iframe#vimeoVideo").vimeo("play");
	});
	
	$('body').on('hidden.bs.modal', '.modal', function () {
		$("iframe#vimeoVideo").vimeo("pause");
	});
	
	
	$('.collapse').on('shown.bs.collapse', function(){
		
		$(this).parent().find(".fa-chevron-circle-down").removeClass("fa-chevron-circle-down").addClass("fa-chevron-circle-up");
		}).on('hidden.bs.collapse', function(){
		$(this).parent().find(".fa-chevron-circle-up").removeClass("fa-chevron-circle-up").addClass("fa-chevron-circle-down");
	});
	
	
	
	
	  
    $('.navbar .dropdown-toggle').hover(function() {
	  if (document.documentElement.clientWidth > 769) { $(this).addClass('disabled');}
	  else { $(this).removeClass('disabled'); }
	});

});

(function($, viewport){
  	
  	$(document).ready(function() {
	  	if(viewport.is('<sm'))
	  	{
		     $('.dropdown').removeClass('open');
	    }
	    
	    if(viewport.is('>=sm')) {
		    $('.dropdown-menu').affix({
			  offset: {
			    top: 120
			  }
			});
			
			$('.dropdown').on('click', function(){
		        if(!$('.navbar-toggle').is(':visible')) { // disable for mobile view
		            if(!$(this).hasClass('open')) { // Keeps it open when hover it again
		              $('.dropdown').not(this).removeClass('open');
		                //$(this).find('.dropdown-toggle', this).trigger('click');
		            }
		        }
		    });
		    
		    $('.navbar-static-top .nav li').on('click', function(){
		         if(!$(this).hasClass('active')) { // Keeps it open when hover it again
		              $('.navbar-static-top .nav li').not(this).removeClass('active');
		                //$(this).find('.dropdown-toggle', this).trigger('click');
		            }
		    });
		    
			
			$('.navbar-collapse').on('hide.bs.dropdown', function () {
			    return false;
			});
			
	    }
  	});
	  	
})(jQuery, ResponsiveBootstrapToolkit);