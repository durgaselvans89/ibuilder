var JSONObject = {};
var contentArr = [];
var markerCode = '';
var markerHTML = '';
var set_font_size = '';
var iteration = '';
var attempts = '';
var feedback_type = '';

var pageName = location.pathname.substring(1);
pageName = pageName.split('/');

var page_builder_app = {

    runAjax: function() {
		
		$.ajax({
		    type: 'GET',
		    url: media_path + '/' + entryPoint,
			dataType: "json",
			cache: false,
			success: page_builder_app.runSetup,
		    error: function() {
		        // error code goes here
		    }
		});
		
																		
    },
	
	runSetup: function( data ) {
		
		JSONObject = data;
		
		template  = JSONObject.template;
		iteration = JSONObject.iteration;
		
		$('head').prepend('<link rel="stylesheet" type="text/css" href="css/styles.css">');
		
		if ( typeof JSONObject.marker !== 'undefined' ) {
			$.json_marker = JSONObject.marker;
							
			//markerCode - 49 = 1, 65 = A, 97 = a,
			switch( $.json_marker )
			{
			case '0': // none
			  markerCode = 'blank';
			  markerHTML = '';
			  break;
			case '1': // ()
			  markerCode = 'blank';
			  markerHTML = '';
			  break;
			case '2': // ( - ) long
			  markerCode = 'blank';
			  markerHTML = '';
			  break;
			case '3': // []
			  markerCode = 'blank';
			  markerHTML = '';
			  break;
			case '4': // (A)
			  markerCode = 65;
			  markerHTML = '';
			  break;
			}
			
		}
		
		page_builder_app.pageBuilder();
							
	},
	
	make_dragg: function() {
		
		$.cover_slide_options = { 
			cursor: "pointer",
			containment: "parent",
			handle: ".cover_slide_handel"
		};
		
		$.hint_dir_options = { 
			cursor: "pointer",
			containment: "parent",
			handle: ".hint_dragg, .directions_dragg"
		};
										
		$( ".cover_slide" ).draggable($.cover_slide_options);
		$( "#hint_set, #directions_set" ).draggable($.hint_dir_options);
		
	},
	
	set_img_width: function() {
		
		$.each( $('.content_img'), function( index, value ) { 
			
			$.get_parent = $(this).parent().attr('id');
			$.get_parent_id = $(this).parent().attr('data-id');
			$.data_block = $(this).parent().attr('data-block')
			
			$.this_div_width = $('#'+$.get_parent).width();
			$.this_img_width = $(this).width();
			
			console.log( $.get_parent + ' | ' + $.get_parent_id + ' | ' + $.data_block + ' | ' + $.this_div_width + ' | ' + $.this_img_width );
								
			if ( $.this_div_width > $.this_img_width ) {				
				$(this).css("width", "auto");
			} else {
				$(this).css("width", $.this_div_width );
			}
			
		});
		
	},
	
	build_keypad: function( e ) {
		$.each(JSONObject.type_object, function(index) { 
			$('#type_object_'+index+'').on("mousedown", clickedTextField);
		});
	},
	
	show_hint: function( event ) {
		$('#hint_set').show();
		$('#directions_set').hide();
	},
	
	hint_close: function( event ) {
		$('#hint_set').hide();
		$('#directions_set').hide();
		soundManager.stopAll();
	},
	
	show_directions: function( event ) {
		$('#directions_set').show();
		$('#hint_set').hide();
	},
	
	directions_close: function( event ) {
		$('#directions_set').hide();
		$('#hint_set').hide();
		soundManager.stopAll();
	},
	
	speakClick: function( event ) {
	
		select_parent = $(this).parent().attr('data-name');
		select_parent_id = $(this).parent().attr('data-id');	
		select_selector = '.in_block[data-name="' + select_parent + '"].in_block[data-id="' + select_parent_id + '"]';
		select_value = $(select_selector + ' select').val();
		
		$.select_id = $(this).attr('data-id');
		$.select_type = $(this).attr('data-type');
		$.speakCustomName = $(this).attr('data-name');
					
		if ( $.select_type == 'hint' || $.select_type == 'directions' || $.select_type == 'play_button' || $.select_type == 'custom_feedback' ) {
			soundManager.destroySound( $.select_type + '_' + $.select_id , media_path+'/images/'+$.speakCustomName );
			soundManager.createSound( $.select_type + '_' + $.select_id , media_path+'/images/'+$.speakCustomName );	
			select_value = $.select_type + '_' + $.select_id;
		}
		
		if ( select_value != 'none' ) {
			// peramiters = playSound array, callback 
			sm_app.playSound([select_value], "test");	
		}
								
	},
	
	creatCustomSounds: function() {
		
		setTimeout(function() {
			if ( typeof JSONObject.custom_feedback !== 'undefined' ) {
				$.each(JSONObject.custom_feedback, function(index) { 
					$.custom_feedback_name = JSONObject.custom_feedback[index].name;
					soundManager.createSound( $.custom_feedback_name, media_path+'/images/'+$.custom_feedback_name );	
				});
			}
		}, 500);		
		
	},
	
	regexFun: function ( event ) {
		
		//This finds the inside of the hash ##t:1##			
		var regex = /##(.*?)##/g;
		
		var index = 0;
		var regex_arr = [];
		contentArr = contentArr.replace(regex, function (match, contents) { 
						
			regex_arr.push(contents);
			
			$.type_split_arr = [];
			$.type_split_arr = contents.split(':');
			
			$.type_split_id_arr = [];
			$.type_split_id_arr = $.type_split_arr[1].split(',');
			
			$.type_id_arr = [];
			$.type_wrapper = [];												
			$.each( $.type_split_id_arr , function( index, value ) { 
				
				$.type_text_id = value - 1;	
				
				switch( $.type_split_arr[0] )
				{
				case 't':
				  $.type_id = JSONObject.type_object[$.type_text_id].id;
				  $.type_text = JSONObject.type_object[$.type_text_id].text;
				  $.type_size = JSONObject.type_object[$.type_text_id].size;
				  $.type_type = JSONObject.type_object[$.type_text_id].type;
				  $.type_source = JSONObject.type_object[$.type_text_id].source;	
				  $.type_wrapper.push('[' + $.type_source + ']');
															  
					if ( mode == 'edit' ) {
						$.type_id_arr.push( eval( $.type_id + 1 ) );
					} else {
						$.type_id_arr = '';
					}
				  
				  break;
				case 's':
				  $.type_id = JSONObject.select_object[$.type_text_id].id;
				  $.type_text = JSONObject.select_object[$.type_text_id].text;
				  $.type_correct = JSONObject.select_object[$.type_text_id].correct;
				  $.type_wrapper +='<option value="'+$.type_text+'" data-correct="'+$.type_correct+'">'+$.type_text+'</option>\n';					
				  break;
				case 'h':
				  $.type_id = JSONObject.highlight_object[$.type_text_id].id;
				  $.type_text = JSONObject.highlight_object[$.type_text_id].text;
				  $.type_correct = JSONObject.highlight_object[$.type_text_id].correct;
				  $.type_wrapper.push($.type_text);
				  break;
				case 'i':
				  $.type_id = JSONObject.image_object[$.type_text_id].id;
				  $.type_type = JSONObject.image_object[$.type_text_id].type;
				  $.type_name = JSONObject.image_object[$.type_text_id].name;
				  break;
				case 'c':
				  $.type_text = value;
				  break;
				}
				
			});	
			
			switch( $.type_split_arr[0] )
			{
			case 't':
			  return '<div id="type_object_'+ $.type_id +'" data-id="'+ $.type_id +'" class="type_object" data-htmlarray="[]" data-output="" data-value=\''+ $.type_wrapper +'\' data-charlimit="'+$.type_size+'" data-keypad="'+$.type_type+'">'+$.type_id_arr+'</div>';	
			  break;
			case 's':
			  return '<select name="select_object" class="select_object"><option disabled selected>Choose One...</option>'+$.type_wrapper+'</select>';
			  break;
			case 'h':
			  return '<span class="highlight" data-correct="'+$.type_correct+'" data-id="'+$.type_id+'">' +  $.type_text + '</span>';
			  break;
			case 'i':
			  return '<img src="'+media_path+'/images/'+$.type_name+'" class="'+$.type_type+'">';
			  break;
			case 'c':
			  return '<span class="coin">' + $.type_text + '</span>';
			  break;
			}
										
		});
				
	},
	
		// This is the only function that shoud differ from the rest
		// pageBuilder : builds html on the page from JSON cotnent - this is used for both iBuilder and Template Player				
		pageBuilder: function ( event ) {

			contentArr = [];
			set_font_size = JSONObject.font_size;

			$("#content").replaceWith('<div id="contentTEMP"></div>');

			// Get Grades
			if ( typeof JSONObject.grades !== 'undefined' ) {
				$.json_grades = JSONObject.grades;
			}

			// Get Marker
			if ( typeof JSONObject.marker !== 'undefined' ) {
				$.json_marker = JSONObject.marker;
			}

			// Get Layout
			if ( typeof JSONObject.layout !== 'undefined' ) {
				$.json_layout = JSONObject.layout;
			}

			// Get Font Size
			if ( typeof JSONObject.font_size !== 'undefined' ) {
				set_font_size = JSONObject.font_size;
			}

			// Get Attempts
			if ( typeof JSONObject.attempts !== 'undefined' ) {
				attempts  = JSONObject.attempts;
			}

			// Get feedback_type
			if ( typeof JSONObject.feedback_type !== 'undefined' ) {
				feedback_type  = JSONObject.feedback_type;
			}

			if ( typeof JSONObject.auto_check !== 'undefined' ) {

				$.auto_check = JSONObject.auto_check;

				if ( $.auto_check == 'true' ) {
					$.open_response = 'false';
				} else {
					$.open_response = 'true';
				}

			}

		// Content Wrapper
		contentArr += '<div id="content" data-template="'+template+'" data-grades="'+$.json_grades+'" data-layout="'+$.json_layout+'" data-id="0" data-font="'+set_font_size+'" data-attempts="'+attempts+'" data-feedback_type="'+feedback_type+'" data-open_response="'+$.open_response+'"><div class="content">'; //data-iteration="'+iteration+'"

			// Title HTML
			if ( typeof JSONObject.title !== 'undefined' ) {

			contentArr += '<div id="title_set" class="titles" data-id="0">';

				$.each(JSONObject.title, function(index) { 
					// Title Data		
					$.json_title_id    = JSONObject.title[index].id;
					$.json_title_type  = JSONObject.title[index].type;
					$.json_title_txt   = JSONObject.title[index].text;
					$.json_title_name  = JSONObject.title[index].name;
					$.json_title_top   = JSONObject.title[index].top;
					$.json_title_left  = JSONObject.title[index].left;
					$.json_title_width = JSONObject.title[index].width;

					if ( $.json_title_top !== 'default' ) {
						$.position = 'top: '+$.json_title_top+'px; left: '+$.json_title_left+'px; position: absolute; ';
					} else { $.position = ''; }

					if ( $.json_title_width !== 'default' && $.json_title_width !== '' ) {
						$.add_json_width = 'width: '+$.json_title_width+'px; height: auto;';
					} else { $.add_json_width = 'width: auto'; }					

					switch($.json_title_type)
					{
					case 'txt':
					  contentArr += '<div id="title_'+$.json_title_id+'" style="'+$.position+$.add_json_width+'" class="title" data-block="title" data-id="'+$.json_title_id+'" data-type="'+$.json_title_type+'" data-name="'+$.json_title_name+'"><span class="txt">' + $.json_title_txt + '</span></div>';
					  break;
					case 'img':
					  contentArr += '<div id="title_'+$.json_title_id+'" style="'+$.position+$.add_json_width+'" class="title" data-block="title" data-id="'+$.json_title_id+'" data-type="'+$.json_title_type+'" data-name="'+$.json_title_name+'"><img src="'+media_path+'/images/'+$.json_title_name+'" class="content_img"></div>';  //<div class="print_width"></div>
					  break;
					case 'hide':
					  contentArr += '';
					  break;
					}
				});

			contentArr += '</div>';

			}
			// END Title HTML

			// Content Box HTML
			if ( typeof JSONObject.content_box !== 'undefined' ) {		

			contentArr += '<div id="content_box_set" class="content_boxs" data-id="0">';

				$.each(JSONObject.content_box, function(index) { 
					// content_box Data				
					$.json_content_box_id    = JSONObject.content_box[index].id;
					$.json_content_box_type  = JSONObject.content_box[index].type;
					$.json_content_box_txt   = JSONObject.content_box[index].text;
					$.json_content_box_name  = JSONObject.content_box[index].name;
					$.json_content_box_top    = JSONObject.content_box[index].top;
					$.json_content_box_left    = JSONObject.content_box[index].left;
					$.json_content_box_width = JSONObject.content_box[index].width;

					if ( $.json_content_box_top !== 'default' ) {
						$.position = 'top: '+$.json_content_box_top+'px; left: '+$.json_content_box_left+'px; position: absolute; ';
					} else { $.position = ''; }

					if ( $.json_content_box_width !== 'default' && $.json_content_box_width !== '' ) {
						$.add_json_width = 'width: '+$.json_content_box_width+'px; height: auto;';
					} else { $.add_json_width = 'width: auto'; }					

					switch($.json_content_box_type)
					{
					case 'txt':
					  contentArr += '<div id="content_box_'+$.json_content_box_id+'" style="'+$.position+$.add_json_width+'" class="content_box" data-block="content_box" data-id="'+$.json_content_box_id+'" data-type="'+$.json_content_box_type+'" data-name="'+$.json_content_box_name+'"><span class="txt">' + $.json_content_box_txt + '</span></div>';
					  break;
					case 'img':
					  contentArr += '<div id="content_box_'+$.json_content_box_id+'" style="'+$.position+$.add_json_width+'" class="content_box" data-block="content_box" data-id="'+$.json_content_box_id+'" data-type="'+$.json_content_box_type+'" data-name="'+$.json_content_box_name+'"><img src="'+media_path+'/images/'+$.json_content_box_name+'" class="content_img"></div>';
					  break;
					case 'hide':
					  contentArr += '';
					  break;
					}
				});

			contentArr += '</div>';	

			}
			// END Content Box HTML

	// Diffrences Start Here
		
		// Drop Object
		if ( typeof JSONObject.drop_object !== 'undefined' ) {		
		
		$.json_dragndrop_setup_type = JSONObject.dragndrop_setup[0].type;
		$.json_dragndrop_setup_unique = JSONObject.dragndrop_setup[0].unique;
		$.json_dragndrop_setup_restrict = JSONObject.dragndrop_setup[0].restrict;
			
		contentArr += '<div id="drop_object_set" class="drop_objects" data-id="0" data-type="'+$.json_dragndrop_setup_type+'" data-unique="'+$.json_dragndrop_setup_unique+'" data-restrict="'+$.json_dragndrop_setup_restrict+'">';
			
			$.each(JSONObject.drop_object, function(index) { 
				
				// drop_object Data				
				$.json_drop_object_id     			= JSONObject.drop_object[index].id;
				$.json_drop_object_type   			= JSONObject.drop_object[index].type;
				$.json_drop_object_txt    			= JSONObject.drop_object[index].text;
				$.json_drop_object_name   			= JSONObject.drop_object[index].name;
				$.json_drop_object_top    			= JSONObject.drop_object[index].top;
				$.json_drop_object_left   			= JSONObject.drop_object[index].left;
				$.json_drop_object_width  			= JSONObject.drop_object[index].width;
				$.json_drop_object_height  			= JSONObject.drop_object[index].height;
				$.json_drop_object_border_style  	= JSONObject.drop_object[index].border_style;
				$.json_drop_object_drag_array  		= JSONObject.drop_object[index].drag_array;
				$.json_drop_object_value  			= JSONObject.drop_object[index].value;
				
				if ( $.json_drop_object_top !== 'default' ) {
					$.position = 'top: '+$.json_drop_object_top+'px; left: '+$.json_drop_object_left+'px; position: absolute;';
				} else {
					$.position = '';
				}
				
				if ( $.json_drop_object_width !== '' ) {
					$.add_json_width = 'width: '+$.json_drop_object_width+'px;';
				} else {
					$.add_json_width = 'width: auto;';
				}	
				
				if ( $.json_drop_object_height !== '' ) {
					$.add_json_height = 'height: '+$.json_drop_object_height+'px;';
				} else {
					$.add_json_height = 'height: auto;';
				}					
				
				switch($.json_drop_object_type)
				{
				case 'txt':
				  contentArr += '<div id="drop_object_'+$.json_drop_object_id+'" style="'+$.position+' '+$.add_json_width+' '+$.add_json_height+'" class="drop_object '+$.json_drop_object_border_style+'" data-block="drop_object" data-id="'+$.json_drop_object_id+'" data-type="'+$.json_drop_object_type+'" data-name="'+$.json_drop_object_name+'" data-array="'+$.json_drop_object_drag_array+'" data-value="'+$.json_drop_object_value+'"><span class="txt" style="'+$.add_json_width+' '+$.add_json_height+'">' + $.json_drop_object_txt + '</span></div>';
				  break;
				case 'img':
				  contentArr += '<div id="drop_object_'+$.json_drop_object_id+'" style="'+$.position+' '+$.add_json_width+' '+$.add_json_height+'" class="drop_object '+$.json_drop_object_border_style+'" data-block="drop_object" data-id="'+$.json_drop_object_id+'" data-type="'+$.json_drop_object_type+'" data-name="'+$.json_drop_object_name+'" data-array="'+$.json_drop_object_drag_array+'" data-value="'+$.json_drop_object_value+'"><img src="'+media_path+'/images/'+$.json_drop_object_name+'" class="content_img"></div>';
				  break;
				case 'hide':
				  contentArr += '';
				  break;
				}
			});
		
		contentArr += '</div>';	
		
		}
		// END Drop Object
		
		// Drag Object
		if ( typeof JSONObject.drag_object !== 'undefined' ) {		
			
		contentArr += '<div id="drag_object_set" class="drag_objects" data-id="0">';
			
			$.each(JSONObject.drag_object, function(index) { 
				
				// drag_object Data				
				$.json_drag_object_id    = JSONObject.drag_object[index].id;
				$.json_drag_object_type  = JSONObject.drag_object[index].type;
				$.json_drag_object_txt   = JSONObject.drag_object[index].text;
				$.json_drag_object_name  = JSONObject.drag_object[index].name;
				$.json_drag_object_top   = JSONObject.drag_object[index].top;
				$.json_drag_object_left  = JSONObject.drag_object[index].left;
				$.json_drag_object_count = JSONObject.drag_object[index].count;
				$.json_drag_object_value = JSONObject.drag_object[index].value;
				$.json_drag_object_width = this.width;
				
				if ( $.json_drag_object_top !== 'default' ) {
					$.position = 'top: '+$.json_drag_object_top+'px; left: '+$.json_drag_object_left+'px; position: absolute; ';
				} else { $.position = ''; }
				
				if ( $.json_drag_object_width !== 'default' && $.json_drag_object_width !== '' ) {
					$.add_json_width = 'width: '+$.json_drag_object_width+'px; height: auto;';
				} else { $.add_json_width = 'width: auto'; }
				
				if ( mode == 'edit' ) {
					$.form_count = '<div class="form_count">'+$.json_drag_object_count+'</div>';
				} else {
					$.form_count = '';
				}
				
				switch($.json_drag_object_type)
				{
				case 'txt':
				  contentArr += '<div id="drag_object_'+$.json_drag_object_id+'" style="'+$.position+$.add_json_width+'" class="drag_object" data-block="drag_object" data-id="'+$.json_drag_object_id+'" data-count="'+$.json_drag_object_count+'" data-value="'+$.json_drag_object_value+'" data-type="'+$.json_drag_object_type+'" data-name="'+$.json_drag_object_name+'"><span class="txt">' + $.json_drag_object_txt + '</span>'+$.form_count+'</div>';
				  break;
				case 'img':
				  contentArr += '<div id="drag_object_'+$.json_drag_object_id+'" style="'+$.position+$.add_json_width+'" class="drag_object" data-block="drag_object" data-id="'+$.json_drag_object_id+'" data-count="'+$.json_drag_object_count+'" data-value="'+$.json_drag_object_value+'" data-type="'+$.json_drag_object_type+'" data-name="'+$.json_drag_object_name+'"><img src="'+media_path+'/images/'+$.json_drag_object_name+'" class="content_img">'+$.form_count+'</div>';
				  break;
				case 'hide':
				  contentArr += '';
				  break;
				}
				
			});
		
		contentArr += '</div>';	
		
		} 
		// END Drag Object
	
// END Diffrences Start Here

	contentArr += '</div>';
	// END Content Wrapper

	// Outside of Content Wrapper - Note stored in state

		// Hint HTML
		if ( typeof JSONObject.hint !== 'undefined' ) {		

		contentArr += '<div id="hint_set" class="hints" data-id="0">';

		$.json_hint_id    = JSONObject.hint[0].id;
		$.json_hint_type  = JSONObject.hint[0].type;
		$.json_hint_txt   = JSONObject.hint[0].text;
		$.json_hint_name  = JSONObject.hint[0].name;
		$.json_hint_active  = JSONObject.hint[0].active;

		if ( typeof $.json_hint_name !== 'undefined' && $.json_hint_name !== '' ) {
			$.json_hint_name_speak = '<div class="hint_speak speakCustomClick" data-id="0" data-name="'+$.json_hint_name+'" data-type="hint"></div>';
		} else { 
			$.json_hint_name_speak = '<div class="hint_nospeak"></div>';
		}

		contentArr += '	<div id="hint_'+$.json_hint_id+'" class="hint" data-block="hint" data-id="'+$.json_hint_id+'" data-type="'+$.json_hint_type+'" data-name="'+$.json_hint_name +'" data-active="'+$.json_hint_active+'">';
		contentArr += '		<div id="hint_top">'+$.json_hint_name_speak+'<div class="hint_dragg"></div><div class="hint_close"></div></div>';
		contentArr += '		<div id="hint_body">';
		contentArr += '			<div id="hint_body_content">';
		contentArr += '				<span class="txt">'+$.json_hint_txt+'</span>';
		contentArr += '			</div>';
		contentArr += '		</div>';
		contentArr += '	</div>';

		contentArr += '</div>';

		}
		// END Hint HTML

		// Directions HTML
		if ( typeof JSONObject.directions !== 'undefined' ) {		

		contentArr += '<div id="directions_set" class="directions" data-id="0">';

		// Directions Data
		$.json_directions_id    = JSONObject.directions[0].id;
		$.json_directions_type  = JSONObject.directions[0].type;
		$.json_directions_txt   = JSONObject.directions[0].text;
		$.json_directions_name  = JSONObject.directions[0].name;
		$.json_directions_active  = JSONObject.directions[0].active; 

		if ( typeof $.json_directions_name !== 'undefined' && $.json_directions_name !== '' ) {
			$.json_directions_name_speak = '<div class="directions_speak speakCustomClick" data-id="0" data-name="'+$.json_directions_name+'" data-type="directions"></div>';
		} else { 
			$.json_directions_name_speak = '<div class="directions_nospeak"></div>';
		}

		contentArr += '	<div id="directions_'+$.json_directions_id+'" class="directions" data-block="directions" data-id="'+$.json_directions_id+'" data-type="'+$.json_directions_type+'" data-name="'+$.json_directions_name +'" data-active="'+$.json_directions_active+'">';
		contentArr += '		<div id="directions_top">'+$.json_directions_name_speak+'<div class="directions_dragg"></div><div class="directions_close"></div></div>';
		contentArr += '		<div id="directions_body">';
		contentArr += '			<div id="directions_body_content">';
		contentArr += '				<span class="txt">'+$.json_directions_txt+'</span>';
		contentArr += '			</div>';
		contentArr += '		</div>';
		contentArr += '	</div>';

		contentArr += '</div>';

		}
		// END Directions HTML

		// Play Button HTML
		if ( typeof JSONObject.play_button !== 'undefined' ) {		

		contentArr += '<div id="play_button_set" class="play_buttons" data-id="0">';


			$.each(JSONObject.play_button, function(index) {			

				// Play All Data
				$.json_play_button_id    = JSONObject.play_button[index].id;
				$.json_play_button_txt   = JSONObject.play_button[index].text;
				$.json_play_button_name  = JSONObject.play_button[index].name;
				$.json_play_button_top   = JSONObject.play_button[index].top;
				$.json_play_button_left  = JSONObject.play_button[index].left;

				if ( typeof $.json_play_button_name !== 'undefined' && $.json_play_button_name !== '' ) {
					$.json_play_button_name_speak = '<div class="play_button_speak speakCustomClick" data-id="0" data-name="'+$.json_play_button_name+'" data-type="play_button"></div>';
				} else { 
					$.json_play_button_name_speak = '<div class="play_button_nospeak"></div>';
				}

				if ( $.json_play_button_top !== 'default' ) {
					$.position = 'style="top: '+$.json_play_button_top+'px; left: '+$.json_play_button_left+'px; position: absolute;"';
				} else {
					$.position = '';
				}

				contentArr += '<div id="play_button_'+$.json_play_button_id+'" '+$.position+' class="play_button" data-block="play_button" data-id="'+$.json_play_button_id+'" data-name="'+$.json_play_button_name+'">'+$.json_play_button_name_speak+'</div>';

			});

		contentArr += '</div>';

		}
		// END Play Button HTML

		// Tooltip HTML
		if ( typeof JSONObject.tooltip !== 'undefined' ) {		

		contentArr += '<div id="tooltip_set" class="tooltips" data-id="0">';

		$.each(JSONObject.tooltip, function(index) {			

			// Tooltip Data
			$.json_tooltip_id    = JSONObject.tooltip[index].id;
			$.json_tooltip_type  = JSONObject.tooltip[index].type;
			$.json_tooltip_txt   = JSONObject.tooltip[index].text;
			$.json_tooltip_name  = JSONObject.tooltip[index].name;
			$.json_tooltip_top   = JSONObject.tooltip[index].top;
			$.json_tooltip_left  = JSONObject.tooltip[index].left;
			$.json_tooltip_width = JSONObject.tooltip[index].width;

			if ( $.json_tooltip_top !== 'default' ) {
				$.position = 'style="top: '+$.json_tooltip_top+'px; left: '+$.json_tooltip_left+'px; position: absolute;"';
			} else {
				$.position = '';
			}

			contentArr += '<div id="tooltip_'+$.json_tooltip_id+'" '+$.position+' class="tooltip" data-block="tooltip" data-id="'+$.json_tooltip_id+'" data-type="'+$.json_tooltip_type+'" data-name="'+$.json_tooltip_name+'"><div class="tooltip_label tipsy" original-title="'+$.json_tooltip_txt+'">' + $.json_tooltip_name + '</div></div>';

		});

		contentArr += '</div>';

		}
		// END Tooltip HTML

		// Cover HTML
		if ( typeof JSONObject.cover !== 'undefined' ) {		

		contentArr += '<div id="cover_set" class="covers" data-id="0">';

			$.each(JSONObject.cover, function(index) { 

				// Cover Data
				$.json_cover_id 		= this.id;
				$.json_cover_top        = this.top;
				$.json_cover_left       = this.left;
				$.json_cover_width      = this.width;
				$.json_cover_height     = this.height;
				$.json_cover_direction  = this.direction;

				if ( $.json_cover_top !== 'default' ) {
					$.position = 'top: '+$.json_cover_top+'px; left: '+$.json_cover_left+'px; position: absolute;';
				} else {
					$.position = '';
				}

				if ( $.json_cover_width !== 'default' ) {
					$.json_wrap_size_w 		= parseInt($.json_cover_width) + 20;
					$.json_wrap_size_h 		= parseInt($.json_cover_height) + 20;
				    $.json_slide_size_w2 	= $.json_cover_width  * 2;
				    $.json_slide_size_h2 	= $.json_cover_height * 2;
					$.json_wrap_size   		= 'width: '+$.json_wrap_size_w+'px; height: '+$.json_wrap_size_h+'px; ';
					$.json_slide_h_size  	= 'width: '+$.json_slide_size_w2+'px; height: '+$.json_cover_height+'px; ';
					$.json_slide_v_size  	= 'width: '+$.json_cover_width+'px; height: '+$.json_slide_size_h2+'px; ';
					$.json_cover_size  		= 'width: '+$.json_cover_width+'px; height: '+$.json_cover_height+'px; ';
				} else {
					$.add_json_wh = '';
				}

				if ( $.json_cover_direction == 'horizontal') {
					contentArr += '<div id="cover_'+index+'" style="'+$.position+' '+$.json_wrap_size+'" class="cover" data-direction="'+$.json_cover_direction+'" data-block="cover" data-id="'+$.json_cover_id+'">';
					contentArr += '	<div class="cover_slide_scroll" style="'+$.json_slide_h_size+'">';
					contentArr += '		<div class="cover_slide cover_slide" style="'+$.json_cover_size+'">';
					contentArr += '			<div class="cover_slide_handel"></div>';
					contentArr += '		</div>';
					contentArr += '	</div>';
					contentArr += '</div>';
				} 

				if ( $.json_cover_direction == 'vertical') {
					contentArr += '<div id="cover_'+index+'" style="'+$.position+' '+$.json_wrap_size+'" class="cover" data-direction="'+$.json_cover_direction+'" data-block="cover" data-id="'+$.json_cover_id+'">';
					contentArr += '	<div class="cover_slide_scroll" style="'+$.json_slide_v_size+'">';
					contentArr += '		<div class="cover_slide cover_slide" style="'+$.json_cover_size+'">';
					contentArr += '			<div class="cover_slide_handel"></div>';
					contentArr += '		</div>';
					contentArr += '	</div>';
					contentArr += '</div>';
				}

			});	

		contentArr += '</div>';

		}
		// END Cover HTML		

// Diffrences Start Here		
	contentArr += '<div id="feedback_bar_wrap"><div id="feedback_bar"><div id="feedback_message"></div></div></div>';
// END Diffrences Start Here

	contentArr += '<div id="lockout"></div>';

	contentArr += '</div>';
	// END new content wrapper

		//replace regex before you build page
		page_builder_app.regexFun(contentArr);

		// replace div with dynamic content 
		$("#contentTEMP").replaceWith(contentArr);

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		MathJax.Hub.Queue(function () {

			$('.txt span').each(function() {
				$(this).css("visibility","visible");
			});		

		});

		$(".hint_close").click( page_builder_app.hint_close );
		$(".directions_close").click( page_builder_app.directions_close );

		$(".speakCustomClick").off('click');
		$(".speakCustomClick").click( page_builder_app.speakClick );

		// Tipsy
		$('.tipsy').tipsy({gravity: $.fn.tipsy.autoWE});	

		// Check if builder or player
		if ( pageName[1] !== 'builder.php' ) {

			// Build Keypad Events
			page_builder_app.build_keypad();

		// Diffrences Start Here
			// Developer Code Here...
			// AppController.startController();
		// END Diffrences Start Here

		}

		// Allow for page to build
		setTimeout(function() {
			page_builder_app.creatCustomSounds();
			page_builder_app.make_dragg();	
		}, 10);
		
		$('img').hide();
		
		$('img').on('load', function() {
		   page_builder_app.set_img_width();
			$('img').show();
		});

	}

};