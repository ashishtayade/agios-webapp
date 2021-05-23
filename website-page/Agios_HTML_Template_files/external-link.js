 jQuery(document).ready(function ($) {
 	/*-----------------------------------------------
 		ANSWER TO ANCHOR WRAP
 	----------------------------------------------- */
 	$('.href').click(function () {
 		window.document.location = $(this).data("href");
 	});

 	$('.marker').click(function () {
 		window.document.location = $(this).data("href");
 	});

 	$('a.back').click(function () {
 		parent.history.back();
 		return false;
 	});

 	/*-----------------------------------------------
 		ANSWER TO TARGET = "_BLANK"
 	----------------------------------------------- */
 	/**
	$("a[rel*=alt_external]").click(function () {
        window.open(this.href);
        return false
    });
    **/

 	$('a[rel*=external]').filter(function () {
 		return this.hostname && this.hostname !== location.hostname;
 	}).click(function (e) {
			
 		//$('#modalConfim').modal() ;
 		if (!confirm('You are about to leave Agios.com. Please confirm to continue.')) {
 			// if user clicks 'no' then dont proceed to link.
			e.stopImmediatePropagation();
 			e.preventDefault();
			console.log('cancel');
 		};

 	});

 	$('a[rel*=alert]').filter(function () {
 		return this.hostname && this.hostname !== location.hostname;
 	}).click(function (e) {

 		//$('#modalConfim').modal() ;
 		if (!confirm('You are about to leave Agios.com. Please confirm to continue.')) {
 			// if user clicks 'no' then dont proceed to link.
 			e.preventDefault();
 		};

 	});

 });
