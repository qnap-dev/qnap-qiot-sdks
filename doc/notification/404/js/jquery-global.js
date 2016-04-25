$(document).ready(function() {
						   
		
		$('.searchInput input[type=text]').focus(function() { //onclick remove Search phrase if is default
							if ($(this).val() == 'Search') {
								$(this).val('');
							}
			checkInput('focus');
		}).focusout(function () {
							if ($(this).val() == '') {
								$(this).val('Search');
							}
			checkInput('focusout');
		});
		
		$('.search form').submit(function() { // search form validation
			var errs = '';
			
			if ( $('.searchInput input[type=text]').val() == 'Search' || $('.searchInput input[type=text]').val().length < 3 ) {
				errs += '<br>Please fill search form';
			}
			
			if (errs.length > 0 ) {
          		$.prompt(errs,{ show:'slideDown' }); //impromptu error
          		return false;
     	 	}

		});
		
		$('.searchInput input[type=text]').keypress(function() {
			checkInput('keypress');
		});
		
		function checkInput(action) {
			
	
				if ( $('.searchInput input[type=text]').val() !== 'Search' && $('.searchInput input[type=text]').val().length >= 3 ) {
					$('.trafficLight').removeClass('trafficLightGreen').removeClass('trafficLightYellow').removeClass('trafficLightRed').addClass('trafficLightGreen');
				} else if ( $('.searchInput input[type=text]').val().length <= 3 ) {
					$('.trafficLight').removeClass('trafficLightGreen').removeClass('trafficLightYellow').removeClass('trafficLightRed').addClass('trafficLightYellow');
				} else if ( $('.searchInput input[type=text]').val() == 'Search' ) {
					$('.trafficLight').removeClass('trafficLightGreen').removeClass('trafficLightYellow').removeClass('trafficLightRed');
				}	

		}
		
	
});