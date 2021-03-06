

//var JSONObject = {};
var contentArr = [];
var markerCode = '';
var markerHTML = '';
var set_font_size = '';
var iteration = '';
var resourcesNotLoaded = true;

var pageName = location.pathname.substring(1);
pageName = pageName.split('/');

var page_builder_app = {

	onReady: function() {
		if (media_path == undefined) {
			if (typeof(JSONObject) != "undefined")
				page_builder_app.runSetup(JSONObject);
		} else {
			$.ajax({
				type: 'GET',
				"url": media_path + '/' + entryPoint,
				dataType: "json",
				cache: false,
				success: page_builder_app.runSetup,
				error: function() {
					// error code goes here
				}
			});
		}

	},

	runSetup: function(data) {
		console.log("pageBuild.runSetup");
		
		// This needs to happen
		JSONObject = data;
		
		//NEW
		template = JSONObject.template;
		iteration = JSONObject.iteration;
		
		
		// This is not rebuilding on the form when changed in select
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
	
	// pageBuilder : builds html on the page from JSON cotnent - this will also be used in template player 					
	pageBuilder: function ( event ) {
		console.log("PS11 pageBuild.pageBuilder --- ");
		
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
		
		if ( typeof JSONObject.auto_check !== 'undefined' ) {
			$.auto_check = JSONObject.auto_check;
		}
					
	// new content wrapper
	contentArr += '<div id="content" data-template="'+template+'" data-grades="'+$.json_grades+'" data-layout="'+$.json_layout+'" data-id="0" data-font="'+set_font_size+'"><div class="content">'; //data-iteration="'+iteration+'"
		
		
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
					$.position = 'top: '+$.json_title_top+'px; left: '+$.json_title_left+'px; position: absolute;';
				} else {
					$.position = 'position: absolute;left: 50px;top: 50px;';
				}
				
				if ( $.json_title_width !== 'default' ) {
					$.add_json_width = 'width: '+$.json_title_width+'px; height: auto;';
				} else {
					$.add_json_width = 'width:350px;';
				}
				
				switch($.json_title_type)
				{
				case 'txt':
				  contentArr += '<div id="title_'+$.json_title_id+'" style="'+$.position+$.add_json_width+'" class="title" data-block="title" data-id="'+$.json_title_id+'" data-type="'+$.json_title_type+'" data-name="'+$.json_title_name+'"><span class="txt">' + $.json_title_txt + '</span></div>';
				  break;
				case 'img':
				  // need to get image path
				  contentArr += '<div id="title_'+$.json_title_id+'" style="'+$.position+'" class="title" data-block="title" data-id="'+$.json_title_id+'" data-type="'+$.json_title_type+'" data-name="'+$.json_title_name+'"><img src="'+media_path+'/images/'+$.json_title_name+'" style="'+$.add_json_width+'" class="content_img"><div class="print_width"></div></div>';  
				  break;
				case 'hide':
				  contentArr += '';
				  break;
				}
			});
		
		contentArr += '</div>';
		
		}
		
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
					$.position = 'top: '+$.json_content_box_top+'px; left: '+$.json_content_box_left+'px; position: absolute;';
				} else {
					$.position = 'position: absolute;left: 50px;top: 125px;';
				}
				
				if ( $.json_content_box_width !== 'default' ) {
					$.add_json_width = 'width: '+$.json_content_box_width+'px; height: auto;';
				} else {
					$.add_json_width = 'width:350px;';
				}

				switch ($.json_content_box_type) {
					case 'txt':
						contentArr += '<div id="content_box_' + $.json_content_box_id + '" style="' + $.position + $.add_json_width + '" class="content_box" data-block="content_box" data-id="' + $.json_content_box_id + '" data-type="' + $.json_content_box_type + '" data-name="' + $.json_content_box_name + '"><span class="txt">' + $.json_content_box_txt + '</span></div>';
						break;
					case 'img':
						contentArr += '<div id="content_box_' + $.json_content_box_id + '" style="' + $.position + '" class="content_box" data-block="content_box" data-id="' + $.json_content_box_id + '" data-type="' + $.json_content_box_type + '" data-name="' + $.json_content_box_name + '"><img src="' + media_path + '/images/' + $.json_content_box_name + '" style="' + $.add_json_width + '" class="content_img"><div class="print_width"></div></div>';
						break;
					case 'hide':
						contentArr += '';
						break;
				}
			});
		
		contentArr += '</div>';	
		
		}

		// coordinate object
		var blocksize_x = 0;
		var blocksize_y = 0;
		var dimension_x = 400;
		var dimension_y = 400;
		if (typeof JSONObject.coordinate_object !== 'undefined') {

			$.each(JSONObject.coordinate_object, function(index) {
				// variables
				$.coordOb_scale_x = eval(JSONObject.coordinate_object[index].scale_x);
				$.coordOb_scale_y = eval(JSONObject.coordinate_object[index].scale_y);
				$.json_coordinate_object_top = JSONObject.coordinate_object[index].top;
				$.json_coordinate_object_left = JSONObject.coordinate_object[index].left;

				// get left and top
				if ($.json_coordinate_object_top === 'default') {
					$.json_coordinate_object_top = 100;
				}
				if ($.json_coordinate_object_left === 'default') {
					$.json_coordinate_object_left = 450;
				}

				// get correct size
				// figure our block size and round for better placement
				blocksize_x = Math.round((dimension_x/2)/$.coordOb_scale_x);
				blocksize_y = Math.round((dimension_y/2)/$.coordOb_scale_y);

				// get dimensions
				dimension_x = blocksize_x * $.coordOb_scale_x * 2;
				dimension_y = blocksize_y * $.coordOb_scale_y * 2;

				// update label positions
				$.coordOb_origin_top = dimension_y/2;
				$.coordOb_origin_right = dimension_x/2 + 3;
				$.coordOb_label_x_top = dimension_y/2 - 10;
				$.coordOb_label_x_left = dimension_x + 5;
				$.coordOb_label_y_left = dimension_x/2 - 10;
				$.coordOb_label_y_top = -20;

				// create draggable container
				contentArr += '<div id="coordinate_object_set" data-block="coordinate_object" class="coordinate_object" data-id="0" style="position:absolute;left:'+$.json_coordinate_object_left+'px;top:'+$.json_coordinate_object_top+'px;">';

				// add quadrant
				// create object
				contentArr += '<div id="coordinateGrid" style="width:'+(dimension_x+4)+'px; height:'+(dimension_y+4)+'px;">';

				// add in quadrants and blocks
				for (var k = 0; k < 4; k++) {
					// start quadrant
					contentArr += '<div class="q'+(k+1)+'" style="width:'+dimension_x/2+'px;float:left;border: 1px solid black;">';

					// add coordinate squares
					for (var i = 0; i < $.coordOb_scale_y; i++) {
						var style = 'width:'+blocksize_x+'px;height:'+blocksize_y+'px;float:left;z-index: 1;box-sizing: border-box;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;border-right: 1px solid rgba(0,0,0,0.3);border-bottom: 1px solid rgba(0,0,0,0.3);';
						if (i === $.coordOb_scale_y-1) style += "border-bottom:none;";
						for (var j = 0; j < $.coordOb_scale_x; j++) {
							if (j === $.coordOb_scale_x-1) style += "border-right:none;";
							contentArr += '<div class="coordinate" style="'+style+'"/>';
						}
					}
					// close quadrant
					contentArr += '</div>';
				};

				// add in labels
				contentArr += '<div class="labels">';
				contentArr += '<div class="origin" style="position:absolute;font-style:italic;right:'+$.coordOb_origin_right+'px;top:'+$.coordOb_origin_top+'px;">O</div>';
				contentArr += '<div class="label_x main" style="position:absolute;font-style:italic;left:'+$.coordOb_label_x_left+'px;top:'+$.coordOb_label_x_top+'px;">'+ JSONObject.coordinate_object[index].label_x +'</div>';
				contentArr += '<div class="label_y main" style="position:absolute;font-style:italic;left:'+$.coordOb_label_y_left+'px;top:'+$.coordOb_label_y_top+'px;">'+ JSONObject.coordinate_object[index].label_y +'</div>';				

				// show scales
				// add in arrows
				contentArr += '<div class="arrow_x neg" style="position:absolute;"></div>';
				contentArr += '<div class="arrow_x pos" style="position:absolute;"></div>';
				contentArr += '<div class="arrow_y neg" style="position:absolute;"></div>';
				contentArr += '<div class="arrow_y pos" style="position:absolute;"></div>';

				// x labels
				for (var i = 1; i <= $.coordOb_scale_x/2; i++) {
					// create lables
					number = i*2;
					contentArr += '<div class="label_x pos" style="position:absolute;">'+ number +'</div>';
					contentArr += '<div class="label_x neg" style="position:absolute;">-'+ number +'</div>';
				};
				// y labels
				for (var i = 1; i <= $.coordOb_scale_y/2; i++) {
					// create lables
					number = i*2;
					contentArr += '<div class="label_y pos" style="position:absolute;">'+ number +'</div>';
					contentArr += '<div class="label_y neg" style="position:absolute;">-'+ number +'</div>';
				};

				// close labels
				contentArr += '</div>';

				// add in canvas
				contentArr += '<div id="coordinateGridCanvas" style="position:absolute;left:1px;top:1px;width:'+(dimension_x+2)+'px; height:'+(dimension_y+2)+'px;"></div>';

				// close coordinate grid
				contentArr += '</div>';

				// add in controls
				var buttonStyles = 'font-size:15px;padding:4px 3px;margin:0 3px 0 0;';
				contentArr += '<div id="controls" style="position:absolute;left:0;top:-50px;"><button id="flipHorzButton" style="'+buttonStyles+'">Flip Horizontal</button><button id="flipVertButton" style="'+buttonStyles+'">Flip Vertical</button><button id="rotateButton" style="'+buttonStyles+'">Rotate</button><button id="resetButton" style="'+buttonStyles+'">Reset</button></div>';

				// close container
				contentArr += '</div>';
			});
		}

	// 	// Drop Box
	// 	contentArr += '<div class="drop_box content_box"></div>';	
	
	// 	// 	end content
	// 	contentArr += '</div>';
		
	// 	if ( typeof JSONObject.hint !== 'undefined' ) {		
		
	// 	contentArr += '<div id="hint_set" class="hint" data-id="0">';
					
	// 	// Hint Data
	// 	$.json_hint_id    = JSONObject.hint[0].id;
	// 	$.json_hint_type  = JSONObject.hint[0].type;
	// 	$.json_hint_txt   = JSONObject.hint[0].text;
	// 	$.json_hint_name  = JSONObject.hint[0].name;
	// 	$.json_hint_active  = JSONObject.hint[0].active;
		
	// 	if ( typeof $.json_hint_name !== 'undefined' && $.json_hint_name !== '' ) {
	// 		$.json_hint_name_speak = '<div class="hint_speak speakCustomClick" data-id="0" data-name="'+$.json_hint_name+'" data-type="hint"></div>';
	// 	} else { 
	// 		$.json_hint_name_speak = '<div class="hint_nospeak"></div>';
	// 	}
						
	// 	contentArr += '	<div id="hint_'+$.json_hint_id+'" class="hint" data-block="hint" data-id="'+$.json_hint_id+'" data-type="'+$.json_hint_type+'" data-name="'+$.json_hint_name +'" data-active="'+$.json_hint_active+'">';
	// 	contentArr += '		<div id="hint_top">'+$.json_hint_name_speak+'<div class="hint_dragg"></div><div class="hint_close"></div></div>';
	// 	contentArr += '		<div id="hint_body">';
	// 	contentArr += '			<div id="hint_body_content">';
	// 	contentArr += '				<span class="txt">'+$.json_hint_txt+'</span>';
	// 	contentArr += '			</div>';
	// 	contentArr += '		</div>';
	// 	contentArr += '	</div>';
			
	// 	contentArr += '</div>';
		
	// 	}
		
	// 	if ( typeof JSONObject.directions !== 'undefined' ) {		
		
	// 	contentArr += '<div id="directions_set" class="directions" data-id="0">';
					
	// 	// Directions Data
	// 	$.json_directions_id    = JSONObject.directions[0].id;
	// 	$.json_directions_type  = JSONObject.directions[0].type;
	// 	$.json_directions_txt   = JSONObject.directions[0].text;
	// 	$.json_directions_name  = JSONObject.directions[0].name;
	// 	$.json_directions_active  = JSONObject.directions[0].active; 
		
	// 	if ( typeof $.json_directions_name !== 'undefined' && $.json_directions_name !== '' ) {
	// 		$.json_directions_name_speak = '<div class="directions_speak speakCustomClick" data-id="0" data-name="'+$.json_directions_name+'" data-type="directions"></div>';
	// 	} else { 
	// 		$.json_directions_name_speak = '<div class="directions_nospeak"></div>';
	// 	}
						
	// 	contentArr += '	<div id="directions_'+$.json_directions_id+'" class="directions" data-block="directions" data-id="'+$.json_directions_id+'" data-type="'+$.json_directions_type+'" data-name="'+$.json_directions_name +'" data-active="'+$.json_directions_active+'">';
	// 	contentArr += '		<div id="directions_top">'+$.json_directions_name_speak+'<div class="directions_dragg"></div><div class="directions_close"></div></div>';
	// 	contentArr += '		<div id="directions_body">';
	// 	contentArr += '			<div id="directions_body_content">';
	// 	contentArr += '				<span class="txt">'+$.json_directions_txt+'</span>';
	// 	contentArr += '			</div>';
	// 	contentArr += '		</div>';
	// 	contentArr += '	</div>';
			
	// 	contentArr += '</div>';
		
	// 	}
		
	// 	if ( typeof JSONObject.tooltip !== 'undefined' ) {		
		
	// 	contentArr += '<div id="play_button_set" class="play_buttons" data-id="0">';
		
	
	// 		$.each(JSONObject.play_button, function(index) {			
		
	// 			// Play All Data
	// 			$.json_play_button_id    = JSONObject.play_button[index].id;
	// 			$.json_play_button_txt   = JSONObject.play_button[index].text;
	// 			$.json_play_button_name  = JSONObject.play_button[index].name;
	// 			$.json_play_button_top   = JSONObject.play_button[index].top;
	// 			$.json_play_button_left  = JSONObject.play_button[index].left;
		
	// 			if ( typeof $.json_play_button_name !== 'undefined' && $.json_play_button_name !== '' ) {
	// 				$.json_play_button_name_speak = '<div class="play_button_speak speakCustomClick" data-id="0" data-name="'+$.json_play_button_name+'" data-type="play_button"></div>';
	// 			} else { 
	// 				$.json_play_button_name_speak = '<div class="play_button_nospeak"></div>';
	// 			}
		
	// 			if ( $.json_play_button_top !== 'default' ) {
	// 				$.position = 'style="top: '+$.json_play_button_top+'px; left: '+$.json_play_button_left+'px; position: absolute;"';
	// 			} else {
	// 				$.position = '';
	// 			}
	
	// 			contentArr += '<div id="play_button_'+$.json_play_button_id+'" '+$.position+' class="play_button" data-block="play_button" data-id="'+$.json_play_button_id+'" data-name="'+$.json_play_button_name+'">'+$.json_play_button_name_speak+'</div>';

	// 		});
	
	// 	contentArr += '</div>';
	
	// 	}
	
	// 	if ( typeof JSONObject.tooltip !== 'undefined' ) {		
	
	// 	contentArr += '<div id="tooltip_set" class="tooltips" data-id="0">';
	
	// 	$.each(JSONObject.tooltip, function(index) {			
		
	// 		// Tooltip Data
	// 		$.json_tooltip_id    = JSONObject.tooltip[index].id;
	// 		$.json_tooltip_type  = JSONObject.tooltip[index].type;
	// 		$.json_tooltip_txt   = JSONObject.tooltip[index].text;
	// 		$.json_tooltip_name  = JSONObject.tooltip[index].name;
	// 		$.json_tooltip_top   = JSONObject.tooltip[index].top;
	// 		$.json_tooltip_left  = JSONObject.tooltip[index].left;
	// 		$.json_tooltip_width = JSONObject.tooltip[index].width;
	
	// 		if ( $.json_tooltip_top !== 'default' ) {
	// 			$.position = 'style="top: '+$.json_tooltip_top+'px; left: '+$.json_tooltip_left+'px; position: absolute;"';
	// 		} else {
	// 			$.position = '';
	// 		}
	
	// 		contentArr += '<div id="tooltip_'+$.json_tooltip_id+'" '+$.position+' class="tooltip" data-block="tooltip" data-id="'+$.json_tooltip_id+'" data-type="'+$.json_tooltip_type+'" data-name="'+$.json_tooltip_name+'"><div class="tooltip_label tipsy" original-title="'+$.json_tooltip_txt+'">' + $.json_tooltip_name + '</div></div>';

	// 	});
		
	// 	contentArr += '</div>';
	
	// 	}
		
	// 	if ( typeof JSONObject.cover !== 'undefined' ) {		
		
	// 	contentArr += '<div id="cover_set" class="covers" data-id="0">';
		
	// 		$.each(JSONObject.cover, function(index) { 
				
	// 			// "id": 0,
	// 			// "type": "txt",
	// 			// "name": "",
	// 			// "text": "",
	// 			// "top": "default",
	// 			// "left": "default",
	// 			// "width": "",
	// 			// "height": "",
	// 			// "direction": ""
				
	// 			// Cover Data
	// 			$.json_cover_id 		= this.id;
	// 			$.json_cover_top        = this.top;
	// 			$.json_cover_left       = this.left;
	// 			$.json_cover_width      = this.width;
	// 			$.json_cover_height     = this.height;
	// 			$.json_cover_direction  = this.direction;
				
	// 			//alert($.json_cover_direction);
				
	// 			if ( $.json_cover_top !== 'default' ) {
	// 				$.position = 'top: '+$.json_cover_top+'px; left: '+$.json_cover_left+'px; position: absolute;';
	// 			} else {
	// 				$.position = '';
	// 			}
				
	// 			if ( $.json_cover_width !== 'default' ) {
	// 				$.json_wrap_size_w 		= parseInt($.json_cover_width) + 20;
	// 				$.json_wrap_size_h 		= parseInt($.json_cover_height) + 20;
	// 			    $.json_slide_size_w2 	= $.json_cover_width  * 2;
	// 			    $.json_slide_size_h2 	= $.json_cover_height * 2;
	// 				$.json_wrap_size   		= 'width: '+$.json_wrap_size_w+'px; height: '+$.json_wrap_size_h+'px; ';
	// 				$.json_slide_h_size  	= 'width: '+$.json_slide_size_w2+'px; height: '+$.json_cover_height+'px; ';
	// 				$.json_slide_v_size  	= 'width: '+$.json_cover_width+'px; height: '+$.json_slide_size_h2+'px; ';
	// 				$.json_cover_size  		= 'width: '+$.json_cover_width+'px; height: '+$.json_cover_height+'px; ';
	// 			} else {
	// 				$.add_json_wh = '';
	// 			}
				
	// 			if ( $.json_cover_direction == 'horizontal') {
	// 				contentArr += '<div id="cover_'+index+'" style="'+$.position+' '+$.json_wrap_size+'" class="cover" data-direction="'+$.json_cover_direction+'" data-block="cover" data-id="'+$.json_cover_id+'">';
	// 				contentArr += '	<div class="cover_slide_scroll" style="'+$.json_slide_h_size+'">';
	// 				contentArr += '		<div class="cover_slide cover_slide" style="'+$.json_cover_size+'">';
	// 				contentArr += '			<div class="cover_slide_handel"></div>';
	// 				contentArr += '		</div>';
	// 				contentArr += '	</div>';
	// 				contentArr += '</div>';
	// 			} 
				
	// 			if ( $.json_cover_direction == 'vertical') {
	// 				contentArr += '<div id="cover_'+index+'" style="'+$.position+' '+$.json_wrap_size+'" class="cover" data-direction="'+$.json_cover_direction+'" data-block="cover" data-id="'+$.json_cover_id+'">';
	// 				contentArr += '	<div class="cover_slide_scroll" style="'+$.json_slide_v_size+'">';
	// 				contentArr += '		<div class="cover_slide cover_slide" style="'+$.json_cover_size+'">';
	// 				contentArr += '			<div class="cover_slide_handel"></div>';
	// 				contentArr += '		</div>';
	// 				contentArr += '	</div>';
	// 				contentArr += '</div>';
	// 			}
			
	// 		});	
			
	// 	contentArr += '</div>';
		
	// 	}
	
	// contentArr += '<div id="lockout"></div>';
	
		contentArr += '</div>';
		// END new content wrapper
		
		//replace regex before you build page
		page_builder_app.regexFun(contentArr);
		
		// replace div with dynamic content 
		$("#contentTEMP").replaceWith(contentArr);

		// fix label placements
		var posX = $(".label_x.pos");
		var negX = $(".label_x.neg");
		var posY = $(".label_y.pos");
		var negY = $(".label_y.neg");
		var top = dimension_y/2;
		var center = dimension_x/2;

		// position main labels
		$(".label_x.main").css('left', dimension_x + 10);
		$(".label_y.main").css('left', center - $(".label_y.main").width()/2 + 2);

		// position arrows
		$(".arrow_x.pos").css({
			width: 10,
			height: 10,
			borderRight: "2px solid",
			borderTop: "2px solid",
			left: dimension_x-11,
			top: top-4,
			transform: "rotate(45deg)"
		});
		$(".arrow_x.neg").css({
			width: 10,
			height: 10,
			borderTop: "2px solid",
			borderLeft: "2px solid",
			left: 3,
			top: top-4,
			transform: "rotate(-45deg)"
		});
		$(".arrow_y.pos").css({
			width: 10,
			height: 10,
			borderTop: "2px solid",
			borderRight: "2px solid",
			left: center-4,
			top: 3,
			transform: "rotate(-45deg)"
		});
		$(".arrow_y.neg").css({
			width: 10,
			height: 10,
			borderBottom: "2px solid",
			borderRight: "2px solid",
			left: center-4,
			top: dimension_y-11,
			transform: "rotate(45deg)"
		});

		// cycle through
		for (var i = 0; i < posX.length; i++) {
			var number = (i+1)*2;
			$(posX[i]).css({
				top: top + 2,
				left: center + number*blocksize_x - $(posX[i]).width()/2 + 2, // 2 for borders
			});
			$(negX[i]).css({
				top: top + 2,
				left: center - number*blocksize_x - $(negX[i]).width()/2,
			});
		}

		for (i = 0; i < posY.length; i++) {
			var number = (i+1)*2;
			$(posY[i]).css({
				left: center - $(posY[i]).width() - 2, // 2 for borders
				top: top - number*blocksize_y - $(posY[i]).height()/2
			});
			$(negY[i]).css({
				left: center - $(negY[i]).width() - 2, // 2 for borders
				top: top + number*blocksize_y - $(negY[i]).height()/2 + 2 // 2 for borders
			});
		}

		var isBuilderPHP = false;
		for (var i = 0; i < pageName.length; i++) {
			if (pageName[i] == "builder.php") isBuilderPHP = true;
		}

		var isTemplate = false;
		if (resourcesNotLoaded) {
			resourcesNotLoaded = false;
    	var s = document.createElement("script");

	    // add in other code needed for builder.php
	    if (isBuilderPHP) {
	    	ps11Path = "templates/ps11/js/ps11.js";
	    	s = document.createElement("script");
	    	s.src = "js/libs/kinetic-v5.0.1.min.js";
	    	s.type = "text/javascript";
	    	$('head').append(s);
	    	s = document.createElement("script");
	    	s.src = "js/libs/underscore-min.js";
	    	s.type = "text/javascript";
	    	$('head').append(s);
				s = document.createElement("script");
		    s.src = "templates/ps11/js/ps11.js";
		    s.type = "text/javascript";
		    $('head').append(s);
	    }

	    if (!isBuilderPHP && media_path !== undefined) {
				s = document.createElement("script");
		    s.src = "js/ps11.js";
		    s.type = "text/javascript";
		    $('head').append(s);
	    	s = document.createElement("script");
	    	s.src = "Grading/grading.js";
	    	s.type = "text/javascript";
	    	$('head').append(s);
	    }
	  }

    if (!isBuilderPHP && media_path !== undefined) {
    	isTemplate = true;
    }

    polljQuery(30, isTemplate);

		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

		MathJax.Hub.Queue(function() {

			$('.txt span').each(function() {
				$(this).css("visibility","visible");
			});		

		});
		
		//console.log(JSON.stringify(JSONObject, null, '\t'));
		
		$(".hint_close").click( page_builder_app.hint_close );
		$(".directions_close").click( page_builder_app.directions_close );
				
		$(".speakCustomClick").off('click');
		$(".speakCustomClick").click( page_builder_app.speakClick );
		
		// tipsy
		//$('.tipsy').tipsy({gravity: $.fn.tipsy.autoWE});
		
		$.cover_slide_options = { 
			cursor: "pointer",
			containment: "parent",
			handle: ".cover_slide_handel"
		};
										
		//$( ".cover_slide" ).draggable($.cover_slide_options);
							
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
	
	regexFun: function ( event ) {
		
		
		//This finds the inside of ##word##			
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
				  $.type_wrapper.push($.type_text);
				  									  
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
			  return '<input type="text" value="' + $.type_id_arr + '" class="type_entry" data-id="'+ $.type_id_arr +'" data-value="'+ $.type_wrapper +'" size="' + $.type_size + '">';
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
				
	}

};
	
function withjQuery (isTemplate) {
    ps11.init(JSONObject, isTemplate);
}
function polljQuery (time, isTemplate) {
  if (window.jQuery && $(".content_boxs").length > 0 && window.ps11) {
   withjQuery(isTemplate);
  } else {
    // checks for jQuery again in 50ms
    setTimeout(function () {
     polljQuery(time * 2, isTemplate)
    }, time);
 }
}

$(document).ready(page_builder_app.onReady);
