var set_feedback_event_name = '';
var attempt_count = 0;
var feedback_arr = [];
var feedback_last_arr = [];
var sound_play_array = [];
var feedback_correct_count = 0;
var feedback_incorrect_count = 0;
var feedback_not_all_correct_count = 0;
var feedback_one_wrong_count = 0;
var feedback_some_wrong_count = 0;
var feedback_all_wrong_count = 0;
var feedback_last_attempt_count = 0;
var vo_name;
var custom_vo_name;

var feedback_app = {
	
	feedback_simulater: function( event ) {
		//set feedback cyckle name
		set_feedback_event_name = $(this).val();
	},
	
	clickCheck: function() {
		feedback_app.runFeedbackCyckles(set_feedback_event_name);
	},
	
	runFeedbackCyckles: function( feedback_event_name ) {
		
		if ( feedback_type == 'single' && feedback_event_name != 'feedback_correct') {
			feedback_event_name = 'feedback_incorrect';
		}
		
		attempt_count ++;
		$('.attempt_print').html(attempt_count);
		
		// This needs to be based on JSON not the select value
		$.select_selector = $('.in_block[data-name="' + feedback_event_name + '"]');
		
		// reset 
		feedback_arr = [];
		
		$.cyckle_length = $.select_selector.length;
		
		// This needs to be based on JSON not the select value	 
		// Ex based on feedback_event_name
		// feedback_event_name {
		// 	feedback_names: [name1,name2,name2],
		// 	feedback_text: [text1,text2,text3]
		// }
				
		$.each($.select_selector, function(index, value) { 
			feedback_arr.push($("select", this).val());
		});
				
		switch(feedback_event_name)
		{
		case 'feedback_correct':
			$('.check_hide').show(); 
			$('.last_attempt_print').html('hide check');
			if ( $.cyckle_length == feedback_correct_count ) { feedback_correct_count = 0; } 
			vo_name = feedback_arr[feedback_correct_count];	
			feedback_correct_count ++; //$('.feedback_correct_count').html( '('+feedback_correct_count+')' );
		break;
		case 'feedback_incorrect':
			if ( $.cyckle_length == feedback_incorrect_count ) { feedback_incorrect_count = 0; } 	
			vo_name = feedback_arr[feedback_incorrect_count];
		  	feedback_incorrect_count ++; //$('.feedback_incorrect_count').html( '('+feedback_incorrect_count+')' );
		  	break;
		case 'feedback_not_all_correct':		  	
			if ( $.cyckle_length == feedback_not_all_correct_count ) { feedback_not_all_correct_count = 0; } 			
			vo_name = feedback_arr[feedback_not_all_correct_count];
			feedback_not_all_correct_count ++;  //$('.feedback_not_all_correct_count').html( '('+feedback_not_all_correct_count+')' );
		  	break;
		case 'feedback_one_wrong':
			if ( $.cyckle_length == feedback_one_wrong_count ) { feedback_one_wrong_count = 0; } 	
			vo_name = feedback_arr[feedback_one_wrong_count];
		  	feedback_one_wrong_count ++; //$('.feedback_one_wrong_count').html( '('+feedback_one_wrong_count+')' );
		  	break;
		case 'feedback_some_wrong':
			if ( $.cyckle_length == feedback_some_wrong_count ) { feedback_some_wrong_count = 0; } 
			vo_name = feedback_arr[feedback_some_wrong_count];	
		  	feedback_some_wrong_count ++; //$('.feedback_some_wrong_count').html( '('+feedback_some_wrong_count+')' );
		  	break;
		case 'feedback_all_wrong':
			if ( $.cyckle_length == feedback_all_wrong_count ) { feedback_all_wrong_count = 0; } 	
			vo_name = feedback_arr[feedback_all_wrong_count];
		  	feedback_all_wrong_count ++; //$('.feedback_all_wrong_count').html( '('+feedback_all_wrong_count+')' );
		  	break;	
		}		
		
		// Last		
		if ( attempt_count >= allowed_attempts && allowed_attempts != 'infinite' ) { 
			$('.check_hide').show();
			$('.last_attempt_print').html('hide check - Last Attemp');
			if ( feedback_event_name != 'feedback_correct' ) {
				
				if ( $.cyckle_length == feedback_last_attempt_count ) { feedback_last_attempt_count = 0; } 	
				
				// reset 
				feedback_last_arr = [];
				$.last_selector = $('.in_block[data-name="feedback_last_attempt"]');
				$.each($.last_selector, function(index, value) { 
					feedback_last_arr.push($("select", this).val());
				});
				
				custom_vo_name = feedback_last_arr[feedback_last_attempt_count];
			  	feedback_last_attempt_count ++; //$('.feedback_last_attempt_count').html( '('+feedback_last_attempt_count+')' );
							
			}
		}
		
		sound_play_array = [];
		
		if ( feedback_event_name != 'feedback_last_attempt' ) {
			sound_play_array.push(feedback_event_name);
		}
		
		sound_play_array.push(vo_name);
		sound_play_array.push(custom_vo_name);
		sound_play_array = sound_play_array;
		sm_app.playSound(sound_play_array, 'callback');
							
	}
	
}