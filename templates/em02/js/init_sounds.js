var audioObject = {};
var formArr = [];
var list_attempts = '';
var sfx_sounds = [];
var vo_sounds = [];
var vo_text = [];
var soundData = {};
var allowed_attempts = '';
var feedback_type = '';
var block_hide = "hide";	
var block_show = "show";	
			
var audio_app = {

    onReady: function() {
		
		$.ajax({
		    type: 'GET',
		    url: 'feedback/default_audio.json',
			contentType: 'application/json; charset=utf-8',
			dataType: "json",
			cache: false,
			success: audio_app.readJSON,
		    error: function() {
		        alert('error');
		    }
		});
		
    },
	 			
	readJSON: function( data ) {
		
		audioObject = data;
		
		// Build Preset SFX and VO events
		// Store sfx, vo and vo,text in soundData JSON
		$.each(audioObject, function(k, v) {
			
			if ( k !== 'template' && k !== 'attempts' ) {
				
				sfx_sounds.push(k);
				
				$.each(v, function() {						
					vo_sounds.push(this.name);
					vo_text.push(this.text);
				});
				
			}
						
		});
		
		soundData['sfx_sounds'] = sfx_sounds;
		soundData['vo_sounds'] = vo_sounds;
		soundData['vo_text'] = vo_text;
		soundData['path'] = 'feedback';
						
		sm_app.setup( soundData );		

	},
	
	form_attempts: function( event ) {
		// zzz in pageBuilder this will come from JSON
		allowed_attempts = $(this).val();
	}
};

$( document ).ready( audio_app.onReady );