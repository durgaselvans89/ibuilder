var soundList_sfx = [];
var soundList_vo = [];
var sound_delay_1 = 20;
var sound_delay_2 = 500;
var sound_delay_3 = 500;
//var soundList_custom = [];

var sm_app = {
	
	// soundData = json
	setup: function( soundData ) {
		
		//console.log(JSON.stringify(soundData, null, '\t'));
		
		soundList_sfx = soundData.sfx_sounds;
		soundList_vo = soundData.vo_sounds;
		soundList_path = soundData.path;
		//soundList_custom = soundList_custom;
		
		soundManager.defaultOptions.volume = 60;
		
		soundManager.setup({
			url: 'js/libs/soundmanager/swf/',
			flashVersion: 9, // optional: shiny features (default = 8)
			preferFlash: false,
			onready: function() {
				sm_app.createSounds( soundList_sfx, soundList_path );
				sm_app.createSounds( soundList_vo, soundList_path );
				//sm_app.createSounds( soundList_custom, custom_path );
				
				//how to playback sound
				//sm_app.playSound(['feedback_correct', 'feedback_correct_vo_1', 'feedback_custom_name'], callback);
				
			}
		});
												
	},
	
	createSounds: function( soundList, path ) {
							
		$.each(soundList, function(index, value) {
			soundManager.createSound( value, path+'/'+value+'.mp3');										
		});
														
	},
	
	playSound: function( playList, callback ) {
		
		//alert( 'callback = ' + callback );
		
		// stop all sounds first
		soundManager.stopAll();
			
		// lock screen and gray out check	
		var count = playList.length
				
		if ( playList[0] ) {
			
			soundManager.play( playList[0] ,{ onfinish: function() { setTimeout(function() { 
				
				// put sound 1 functions here
				if ( count == 1 ) { sm_app.afterPlay(callback); }
						
				if ( playList[1] ) {

					soundManager.play( playList[1] ,{ onfinish: function() { setTimeout(function() { 
						
						// put sound 2 functions here
						if ( count == 2 ) { sm_app.afterPlay(callback); }
						
						if ( playList[2] ) {

							soundManager.play( playList[2] ,{ onfinish: function() { setTimeout(function() { 
								
								// put sound 3 functions here
								if ( count == 3 ) { sm_app.afterPlay(callback); }
								
							}, sound_delay_1); } });

						}

					}, sound_delay_2); } });

				}
					
			}, sound_delay_3); } });
			
		}
			
	},
	
	afterPlay: function( callback ) {
							
		//alert(callback);
		LO_app[callback]();
																
	}
	
}