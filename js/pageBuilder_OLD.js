var JSONObject = {};
var contentArr = [];
var markerCode = '';
var markerHTML = '';
var set_font_size = '';
var iteration = '';

var page_builder_app = {

    runAjax: function() {
		
		// zzzz error 
		$.ajax({
		    type: 'GET',
		    url: media_path + '/' + entryPoint,
			dataType: "json",
			cache: false,
			success: page_builder_app.runSetup,
		    error: function() {
		        
		    }
		});
		
																		
    },
	
	runSetup: function( data ) {
		
		// This needs to happen
		JSONObject = data;
		
		//NEW
		template = JSONObject.template;
		iteration = JSONObject.iteration;
		
		$('head').prepend('<link rel="stylesheet" type="text/css" href="templates/' + template + '/css/styles.css">');
		
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
					$.position = 'style="top: '+$.json_title_top+'px; left: '+$.json_title_left+'px; position: absolute;" ';
				} else {
					$.position = '';
				}
				
				if ( $.json_title_width !== 'default' ) {
					$.add_json_width = 'style="width: '+$.json_title_width+'px; height: auto;" ';
				} else {
					$.add_json_width = '';
				}
				
				switch($.json_title_type)
				{
				case 'txt':
				  contentArr += '<div id="title_'+$.json_title_id+'" '+$.position+'class="title" data-block="title" data-id="'+$.json_title_id+'" data-type="'+$.json_title_type+'" data-name="'+$.json_title_name+'"><span class="txt">' + $.json_title_txt + '</span></div>';
				  break;
				case 'img':
				  // need to get image path
				  contentArr += '<div id="title_'+$.json_title_id+'" '+$.position+'class="title" data-block="title" data-id="'+$.json_title_id+'" data-type="'+$.json_title_type+'" data-name="'+$.json_title_name+'"><img src="'+media_path+'/images/'+$.json_title_name+'" '+$.add_json_width+'class="content_img"><div class="print_width"></div></div>';  
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
					$.position = 'style="top: '+$.json_content_box_top+'px; left: '+$.json_content_box_left+'px; position: absolute;" ';
				} else {
					$.position = '';
				}
				
				if ( $.json_content_box_width !== 'default' ) {
					$.add_json_width = 'style="width: '+$.json_content_box_width+'px; height: auto;" ';
				} else {
					$.add_json_width = '';
				}					
				
				switch($.json_content_box_type)
				{
				case 'txt':
				  contentArr += '<div id="content_box_'+$.json_content_box_id+'" '+$.position+'class="content_box" data-block="content_box" data-id="'+$.json_content_box_id+'" data-type="'+$.json_content_box_type+'" data-name="'+$.json_content_box_name+'"><span class="txt">' + $.json_content_box_txt + '</span></div>';
				  break;
				case 'img':
				  contentArr += '<div id="content_box_'+$.json_content_box_id+'" '+$.position+'class="content_box" data-block="content_box" data-id="'+$.json_content_box_id+'" data-type="'+$.json_content_box_type+'" data-name="'+$.json_content_box_name+'"><img src="'+media_path+'/images/'+$.json_content_box_name+'" '+$.add_json_width+'class="content_img"><div class="print_width"></div></div>';
				  break;
				case 'hide':
				  contentArr += '';
				  break;
				}
			});
		
		contentArr += '</div>';	
		
		}
		
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
				// zzz img_width
				
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
				  contentArr += '<div id="drop_object_'+$.json_drop_object_id+'" class="drop_object '+$.json_drop_object_border_style+'" data-block="drop_object" data-id="'+$.json_drop_object_id+'" data-type="'+$.json_drop_object_type+'" data-name="'+$.json_drop_object_name+'" data-array="'+$.json_drop_object_drag_array+'" data-value="'+$.json_drop_object_value+'" style="'+$.position+' '+$.add_json_width+' '+$.add_json_height+'"><span class="txt" style="'+$.add_json_width+' '+$.add_json_height+'">' + $.json_drop_object_txt + '</span></div>';
				  break;
				case 'img':
				  contentArr += '<div id="drop_object_'+$.json_drop_object_id+'" class="drop_object '+$.json_drop_object_border_style+'" data-block="drop_object" data-id="'+$.json_drop_object_id+'" data-type="'+$.json_drop_object_type+'" data-name="'+$.json_drop_object_name+'" data-array="'+$.json_drop_object_drag_array+'" data-value="'+$.json_drop_object_value+'" style="'+$.position+' '+$.add_json_width+' '+$.add_json_height+'"><img src="'+media_path+'/images/'+$.json_drop_object_name+'" class="content_img"><br><div class="print_width"></div></div>';
				  break;
				case 'hide':
				  contentArr += '';
				  break;
				}
			});
		
		contentArr += '</div>';	
		
		}
		
		
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
				$.json_drag_object_count  = JSONObject.drag_object[index].count;
				$.json_drag_object_value  = JSONObject.drag_object[index].value;
				// zzz width?
				
				if ( $.json_drag_object_top !== 'default' ) {
					$.position = 'style="top: '+$.json_drag_object_top+'px; left: '+$.json_drag_object_left+'px; position: absolute;" ';
				} else {
					$.position = '';
				}
				
				if ( mode == 'edit' ) {
					$.form_count = '<div class="form_count">'+$.json_drag_object_count+'</div>';
				} else {
					$.form_count = '';
				}
				
				switch($.json_drag_object_type)
				{
				case 'txt':
				  contentArr += '<div id="drag_object_'+$.json_drag_object_id+'" '+$.position+'class="drag_object" data-block="drag_object" data-id="'+$.json_drag_object_id+'" data-count="'+$.json_drag_object_count+'" data-value="'+$.json_drag_object_value+'" data-type="'+$.json_drag_object_type+'" data-name="'+$.json_drag_object_name+'"><span class="txt">' + $.json_drag_object_txt + '</span>'+$.form_count+'</div>';
				  break;
				case 'img':
				  contentArr += '<div id="drag_object_'+$.json_drag_object_id+'" '+$.position+'class="drag_object" data-block="drag_object" data-id="'+$.json_drag_object_id+'" data-count="'+$.json_drag_object_count+'" data-value="'+$.json_drag_object_value+'" data-type="'+$.json_drag_object_type+'" data-name="'+$.json_drag_object_name+'"><img src="'+media_path+'/images/'+$.json_drag_object_name+'">'+$.form_count+'</div>';
				  break;
				case 'hide':
				  contentArr += '';
				  break;
				}
				
			});
		
		contentArr += '</div>';	
		
		} 
		
		// Move Object
		if ( typeof JSONObject.move_object !== 'undefined' ) {		
			
		contentArr += '<div id="move_object_set" class="move_objects" data-id="0">';
			
			$.each(JSONObject.move_object, function(index) { 
				// move_object Data				
				$.json_move_object_id    = JSONObject.move_object[index].id;
				$.json_move_object_type  = JSONObject.move_object[index].type;
				$.json_move_object_txt   = JSONObject.move_object[index].text;
				$.json_move_object_name  = JSONObject.move_object[index].name;
				$.json_move_object_top   = JSONObject.move_object[index].top;
				$.json_move_object_left  = JSONObject.move_object[index].left;
				$.json_move_object_count  = JSONObject.move_object[index].count;
				
				if ( $.json_move_object_top !== 'default' ) {
					$.position = 'style="top: '+$.json_move_object_top+'px; left: '+$.json_move_object_left+'px; position: absolute;" ';
				} else {
					$.position = '';
				}
				
				if ( mode == 'edit' ) {
					$.form_count = '<div class="form_count">'+$.json_move_object_count+'</div>';
				} else {
					$.form_count = '';
				}
				
				switch($.json_move_object_type)
				{
				case 'txt':
				  contentArr += '<div id="move_object_'+$.json_move_object_id+'" '+$.position+'class="move_object" data-block="move_object" data-id="'+$.json_move_object_id+'" data-count="'+$.json_move_object_count+'" data-type="'+$.json_move_object_type+'" data-name="'+$.json_move_object_name+'"><span class="txt">' + $.json_move_object_txt + '</span>'+$.form_count+'</div>';
				  break;
				case 'img':
				  contentArr += '<div id="move_object_'+$.json_move_object_id+'" '+$.position+'class="move_object" data-block="move_object" data-id="'+$.json_move_object_id+'" data-count="'+$.json_move_object_count+'" data-type="'+$.json_move_object_type+'" data-name="'+$.json_move_object_name+'"><img src="'+media_path+'/images/'+$.json_move_object_name+'">'+$.form_count+'</div>';
				  break;
				case 'hide':
				  contentArr += '';
				  break;
				}
				
			});
		
		contentArr += '</div>';	
		
		} 
		
		if ( typeof JSONObject.answer !== 'undefined' ) {		
		
		contentArr += '<div id="answer_set" class="answers" data-id="0">';
		
			$.each(JSONObject.answer, function(index) { 
			
				// Answer Data
				$.json_answer_id 		= this.id;
				$.json_answer_correct 	= this.correct;
				$.json_answer_type 		= this.type;
				$.json_answer_name 		= this.name;
				$.json_answer_txt 		= this.text;
				$.json_answer_top       = JSONObject.answer[index].top;
				$.json_answer_left      = JSONObject.answer[index].left;
				$.json_answer_width     = JSONObject.answer[index].width;
				
				if ( $.json_answer_top !== 'default' ) {
					$.position = 'style="top: '+$.json_answer_top+'px; left: '+$.json_answer_left+'px; position: absolute;" ';
				} else {
					$.position = '';
				}
				
				if ( $.json_answer_width !== 'default' ) {
					$.add_json_width = 'style="width: '+$.json_answer_width+'px; height: auto;" ';
				} else {
					$.add_json_width = '';
				}
				
				// data-poasition="100,100" top and left position or default				
				$.markerValue = (markerCode !== 'blank') ? String.fromCharCode(markerCode + index) : "";				
				
				if ( template == "em05" ) {
					contentArr += '<div id="holder_'+index+'" class = "clickableHolder"></div>';
				}
				
				if ( $.json_answer_type == 'txt') {
					contentArr += '<div id="answer_'+index+'" class="answer" data-block="answer" data-id="'+$.json_answer_id+'" '+$.position+'data-correct="'+$.json_answer_correct+'" data-type="'+$.json_answer_type+'" data-name="'+$.json_answer_name +'" data-marker="'+$.json_marker+'" data-protocol=""><span class="txt">' + $.json_answer_txt + '</span><span class="marker"><span class="markerValue">'+$.markerValue+'</span><span class="markerHTML">'+markerHTML+'</span></span></div>';					
				} else {
					contentArr += '<div id="answer_'+index+'" class="answer" data-block="answer" data-id="'+$.json_answer_id+'" '+$.position+'data-correct="'+$.json_answer_correct+'" data-type="'+$.json_answer_type+'" data-name="'+$.json_answer_name +'" data-marker="'+$.json_marker+'" data-protocol=""><img src="'+media_path+'/images/'+$.json_answer_name+'" '+$.add_json_width+'class="content_img"><div class="print_width"></div><br><span class="marker center"><span class="markerValue">'+$.markerValue+'</span><span class="markerHTML">'+markerHTML+'</span></span></div>';					
				}
			
			});	
			
		contentArr += '</div>';
		
		}
		
		if ( typeof JSONObject.hint !== 'undefined' ) {		
		
		contentArr += '<div id="hint_set" class="hint" data-id="0">';
					
		// Hint Data
		$.json_hint_id    = JSONObject.hint[0].id;
		$.json_hint_type  = JSONObject.hint[0].type;
		$.json_hint_txt   = JSONObject.hint[0].text;
		$.json_hint_name  = JSONObject.hint[0].name;
		
		if ( typeof $.json_hint_name !== 'undefined' && $.json_hint_name !== '' ) {
			$.json_hint_name_speak = '<div class="hint_speak speakCustomClick" data-id="0" data-name="'+$.json_hint_name+'" data-type="hint"></div>';
		} else { 
			$.json_hint_name_speak = '<div class="hint_nospeak"></div>';
		}
						
		contentArr += '	<div id="hint_'+$.json_hint_id+'" class="hint" data-block="hint" data-id="'+$.json_hint_id+'" data-type="'+$.json_hint_type+'" data-name="'+$.json_hint_name +'">';
		contentArr += '		<div id="hint_top">'+$.json_hint_name_speak+'<div class="hint_dragg"></div><div class="hint_close"></div></div>';
		contentArr += '		<div id="hint_body">';
		contentArr += '			<div id="hint_body_content">';
		contentArr += '				<span class="txt">'+$.json_hint_txt+'</span>';
		contentArr += '			</div>';
		contentArr += '		</div>';
		contentArr += '	</div>';
			
		contentArr += '</div>';
		
		}
		
		if ( typeof JSONObject.shading_object !== 'undefined' ) {
		
		contentArr += '<div id="shading_object_set" class="shading_objects" data-id="0">';
		
			$.each(JSONObject.shading_object, function(index) { 
									
				// Title Data
				$.defult_cell_width = 40;
				$.defult_cell_height = 40;
				
				$.json_shading_object_id    			= JSONObject.shading_object[index].id;
				$.json_shading_object_rows  			= JSONObject.shading_object[index].rows;	
				$.json_shading_object_rows_x  			= JSONObject.shading_object[index].rows_x;	
				$.json_shading_object_columns   		= JSONObject.shading_object[index].columns;	
				$.json_shading_object_columns_x   		= JSONObject.shading_object[index].columns_x;	
				$.json_shading_object_border_style  	= JSONObject.shading_object[index].border_style;	
				$.json_shading_object_show_labels   	= JSONObject.shading_object[index].show_labels;	
				$.json_shading_object_label_start_at   	= JSONObject.shading_object[index].label_start_at;	
				$.json_shading_object_red_check  		= JSONObject.shading_object[index].red_check;	
				$.json_shading_object_red_value   		= JSONObject.shading_object[index].red_value;	
				$.json_shading_object_red_array   		= JSONObject.shading_object[index].red_array;	
				$.json_shading_object_blue_check   		= JSONObject.shading_object[index].blue_check;	
				$.json_shading_object_blue_value   		= JSONObject.shading_object[index].blue_value;	
				$.json_shading_object_blue_array   		= JSONObject.shading_object[index].blue_array;	
				$.json_shading_object_green_check   	= JSONObject.shading_object[index].green_check;	
				$.json_shading_object_green_value   	= JSONObject.shading_object[index].green_value;	
				$.json_shading_object_green_array   	= JSONObject.shading_object[index].green_array;	
				$.json_shading_object_yellow_check   	= JSONObject.shading_object[index].yellow_check;	
				$.json_shading_object_yellow_value  	= JSONObject.shading_object[index].yellow_value;	
				$.json_shading_object_yellow_array   	= JSONObject.shading_object[index].yellow_array;
				$.json_shading_object_multiple_cell   	= JSONObject.shading_object[index].multiple_cell;
				
				$.json_shading_object_top   			= JSONObject.shading_object[index].top;
				$.json_shading_object_left   			= JSONObject.shading_object[index].left;
				$.json_shading_object_width   			= JSONObject.shading_object[index].width;		
				
				// Shading Object Size
				$.object_width = ( $.defult_cell_width * $.json_shading_object_columns_x ) * $.json_shading_object_columns;
				$.object_height = ( $.defult_cell_height * $.json_shading_object_rows_x ) * $.json_shading_object_rows;
				$.shading_object_dimensions = 'width: '+$.object_width+'px; height: '+$.object_height+'px;';
				
				// Position
				if ( $.json_shading_object_top !== 'default' ) {
					$.shading_object_position = 'top: '+$.json_shading_object_top+'px; left: '+$.json_shading_object_left+'px; position: absolute;';
				}
				
				// Cell Count and Size
				$.num_cells = $.json_shading_object_rows * $.json_shading_object_columns
				$.cells_width = $.defult_cell_width * $.json_shading_object_columns_x;
				$.cells_height = $.defult_cell_height * $.json_shading_object_rows_x;
				
				// Add color array to
				//This also serve as a screen to only run with the color is checked
				$.shading_object_color_array = [];					
				if ( $.json_shading_object_red_check == 'true') { $.shading_object_color_array.push('R:'+$.json_shading_object_red_value); }
				if ( $.json_shading_object_blue_check == 'true') { $.shading_object_color_array.push('B:'+$.json_shading_object_blue_value); }
				if ( $.json_shading_object_green_check == 'true') { $.shading_object_color_array.push('G:'+$.json_shading_object_green_value); }
				if ( $.json_shading_object_yellow_check == 'true') { $.shading_object_color_array.push('Y:'+$.json_shading_object_yellow_value); }
				
				// color value array 
				// 1,2,3,4,5,6
				// this needs to mark data-option="true" for each color if that cell is included in the array
				// note defult is all colors in all cells have data-option="true"
				// check if array is blank
				
				// split color value array string to true array...
				$.json_shading_object_red_array = $.json_shading_object_red_array.split(",");
				$.json_shading_object_blue_array = $.json_shading_object_blue_array.split(",");
				$.json_shading_object_green_array = $.json_shading_object_green_array.split(",");
				$.json_shading_object_yellow_array = $.json_shading_object_yellow_array.split(",");
				
				contentArr += '<div id="shading_object_'+$.json_shading_object_id+'" class="shading_object '+$.json_shading_object_border_style+'" data-id="'+$.json_shading_object_id+'" data-block="shading_object" data-colors="'+$.shading_object_color_array+'" data-show-labels="'+$.json_shading_object_show_labels+'" data-multiple-cells="'+$.json_shading_object_multiple_cell+'" style="'+$.shading_object_dimensions+' '+$.shading_object_position+'">';
				
				// Loop through cells
				$.label_value = $.json_shading_object_label_start_at;
					
				for ( var i = 0; i < $.num_cells; i++ )
				{ 	
					$.humanID = i+1;
					$n = $.humanID.toString();						
											
					if ( $.json_shading_object_red_check == 'true' && $.json_shading_object_red_array != '' ) {
						if ( $.inArray( $n, $.json_shading_object_red_array ) != -1 ) { $.data_option_red_value = 'true'; $.data_option_red_mark = 'R'; } else { $.data_option_red_value = 'false'; $.data_option_red_mark = ''; }						
					} else { $.data_option_red_value = 'true'; $.data_option_red_mark = ''; }
					
					if ( $.json_shading_object_blue_check == 'true' && $.json_shading_object_blue_array != '' ) {
						if ( $.inArray( $n, $.json_shading_object_blue_array ) != -1 ) { $.data_option_blue_value = 'true'; $.data_option_blue_mark = 'B'; } else { $.data_option_blue_value = 'false'; $.data_option_blue_mark = ''; }						
					} else { $.data_option_blue_value = 'true'; $.data_option_blue_mark = ''; }
					
					if ( $.json_shading_object_green_check == 'true' && $.json_shading_object_green_array != '' ) {
						if ( $.inArray( $n, $.json_shading_object_green_array ) != -1 ) { $.data_option_green_value = 'true'; $.data_option_green_mark = 'G'; } else { $.data_option_green_value = 'false'; $.data_option_green_mark = ''; }						
					} else { $.data_option_green_value = 'true'; $.data_option_green_mark = ''; }
					
					if ( $.json_shading_object_yellow_check == 'true' && $.json_shading_object_yellow_array != '' ) {
						if ( $.inArray( $n, $.json_shading_object_yellow_array ) != -1 ) { $.data_option_yellow_value = 'true'; $.data_option_yellow_mark = 'Y;'; } else { $.data_option_yellow_value = 'false'; $.data_option_yellow_mark = ''; }						
					} else { $.data_option_yellow_value = 'true'; $.data_option_yellow_mark = ''; }
					
					if ( mode !== 'edit' ) { 
						$.data_option_red_mark = '';
						$.data_option_blue_mark = '';
						$.data_option_green_mark = '';
						$.data_option_yellow_mark = '';
					} 
																
					contentArr += '<div id="cell_'+i+'" class="shading_object_cell" data-id="'+i+'" data-color="A" style="width: '+$.cells_width+'px; height: '+$.cells_height+'px;">';
					contentArr += '<div class="red_cell" style="width: 0%; height: '+$.cells_height+'px;" data-option="'+$.data_option_red_value+'">'+$.data_option_red_mark+'</div>';	
					contentArr += '<div class="blue_cell" style="width: 0%; height: '+$.cells_height+'px;" data-option="'+$.data_option_blue_value+'">'+$.data_option_blue_mark+'</div>';
					contentArr += '<div class="green_cell" style="width: 0%; height: '+$.cells_height+'px;" data-option="'+$.data_option_green_value+'">'+$.data_option_green_mark+'</div>';
					contentArr += '<div class="yellow_cell" style="width: 0%; height: '+$.cells_height+'px;" data-option="'+$.data_option_yellow_value+'">'+$.data_option_yellow_mark+'</div>';	
					contentArr += '<span class="txt" style="width: '+$.cells_width+'px; height: '+$.cells_height+'px;">'+$.label_value+'</span>';
					contentArr += '</div>';
					$.label_value ++;
				}
				
				contentArr += '</div>';
				
			});
			
		contentArr += '</div>';
		
		}
		
	// if ( $.auto_check !== "true" ) {
	// 			contentArr += '<div id="checkAnswerButton2" class="checkButton"</div>';
	// 		}
		
	contentArr += '</div>';
	
	contentArr += '<div id="lockout"></div>';
	contentArr += '<div id="feedback_bar"><div id="feedback_message"></div></div>';
	
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
		
		console.log(JSON.stringify(JSONObject, null, '\t'));
		
		$(".hint_close").click( LO_page_app.hint_close );
		$(".speakCustomClick").off('click');
		$(".speakCustomClick").click( LO_page_app.speakClick );
		
		// Lorens Code Here...
		// LO_app.initLearningObject();
								
	}, 
	
	regexFun: function ( event ) {
		
		
		//This finds the inside of ##word##			
		var regex = /##(.*?)##/g;
		
		var index = 0;
		var regex_arr = [];
		contentArr = contentArr.replace(regex, function (match, contents) { 
			
			//use :  and split to create type of use another wrapper like {{(c)}} for library images.
			
			regex_arr.push(contents);
			
			// Make uniforem sizes based on content
			// type_entry_width = "";
			// 				type_entry_width = contents.length;
			
			// zzz keep for now
			// if ( type_entry_width > 3 ) {
			// 					type_entry_width = type_entry_width * 2;
			// 					type_entry_width = Math.ceil(type_entry_width / 1000) * 1000;
			// 					type_entry_width = type_entry_width / 100;
			// 					type_entry_width = Math.ceil(type_entry_width);
			// 				} else {
			// 					type_entry_width = type_entry_width * 15;
			// 					type_entry_width = Math.ceil(type_entry_width / 100) * 100;
			// 					type_entry_width = type_entry_width / 100;
			// 					type_entry_width = Math.ceil(type_entry_width);
			// 				}
			// 								
			// 				if ( mode == 'edit' ) {
			// 					$.fill_value = contents;
			// 				} else {
			// 					$.fill_value = '';
			// 				}
			
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
			
			// zzz still need to work on multiple array
			switch( $.type_split_arr[0] )
			{
			case 't':
			  return '<input type="text" value="' + $.type_id_arr + '" class="type_entry" data-id="'+ $.type_id_arr +'" data-value="'+ $.type_wrapper +'" size="' + $.type_size + '">';
			  break;
			case 's':
			  return '<select name="select_object" class="select_object"><option disabled selected></option>'+$.type_wrapper+'</select>';
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
			
			// zzz old
			//return '<input type="text" value="'+$.fill_value+'" id="type_entry_'+ index +'" class="type_entry" data-id="'+ index +'" data-value="'+ contents +'" size="'+type_entry_width+'">'; // style="width: '+type_entry_width+'px;"
							
		});
				
	}

};