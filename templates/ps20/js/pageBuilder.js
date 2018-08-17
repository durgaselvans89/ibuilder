//////Page Builder File/////
var contentArr = [];
var markerCode = '';
var markerHTML = '';
var set_font_size = '';
var image_path = "/images/";
if (typeof(media_path) != "undefined") {
    image_path = media_path + image_path;
}
var iteration = '';

var pageName = location.pathname.substring(1);
pageName = pageName.split('/');

var page_builder_app = {
    runAjax: function() {
		
        if (media_path == undefined) {
            if (typeof(JSONObject) != "undefined") {				
                this.runSetup(JSONObject);
            }
            $("[value='Evaluate']").remove();
        } else {
	    	$.ajax({
	    	    type: 'GET',
	    	    "url": media_path + "/" + entryPoint,
	    		dataType: "json",
	    		cache: false,
	    		success: page_builder_app.runSetup,
	    	    error: function() {
	    	        // error code goes here
	    	    }
	    	});
        }
    },
	runSetup: function( data ) {

		if(data) 
            JSONObject = data;
		
        if (media_path == undefined || media_path == "") {
            media_path = "";
            image_path = "";
        } else {
            media_path = media_path.replace(/\/?$/,'/');
            image_path = media_path + "images/";
        }

		//NEW
		template = JSONObject.template;
		iteration = JSONObject.iteration;
		
        if (media_path !== "") {
		    $('head').prepend('<link rel="stylesheet" type="text/css" href="css/styles.css">');
        }
		
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
					$.position = 'top: '+$.json_title_top+'px; left: '+$.json_title_left+'px; position: absolute;';
				} else {
					$.position = '';
				}
				
				if ( $.json_title_width !== 'default' ) {
					$.add_json_width = 'width: '+$.json_title_width+'px; height: auto;';
				} else {
					$.add_json_width = '';
				}
				
				switch($.json_title_type)
				{
				case 'txt':
				  contentArr += '<div id="title_'+$.json_title_id+'" style="'+$.position+$.add_json_width+'" class="title" data-block="title" data-id="'+$.json_title_id+'" data-type="'+$.json_title_type+'" data-name="'+$.json_title_name+'"><span class="txt">' + $.json_title_txt + '</span></div>';
				  break;
				case 'img':
				  // need to get image path
				  contentArr += '<div id="title_'+$.json_title_id+'" style="'+$.position+'" class="title" data-block="title" data-id="'+$.json_title_id+'" data-type="'+$.json_title_type+'" data-name="'+$.json_title_name+'"><img src="'+image_path+$.json_title_name+'" style="'+$.add_json_width+'" class="content_img"><div class="print_width"></div></div>';  
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
					$.position = '';
				}
				
				if ( $.json_content_box_width !== 'default' ) {
					$.add_json_width = 'width: '+$.json_content_box_width+'px; height: auto;';
				} else {
					$.add_json_width = '';
				}					
				
				switch($.json_content_box_type)
				{
				case 'txt':
				  contentArr += '<div id="content_box_'+$.json_content_box_id+'" style="'+$.position+$.add_json_width+' "class="content_box" data-block="content_box" data-id="'+$.json_content_box_id+'" data-type="'+$.json_content_box_type+'" data-name="'+$.json_content_box_name+'"><span class="txt">' + $.json_content_box_txt + '</span></div>';
				  break;
				case 'img':
				  contentArr += '<div id="content_box_'+$.json_content_box_id+'" style="'+$.position+'" class="content_box" data-block="content_box" data-id="'+$.json_content_box_id+'" data-type="'+$.json_content_box_type+'" data-name="'+$.json_content_box_name+'"><img src="'+image_path+$.json_content_box_name+'" style="'+$.add_json_width+'" class="content_img"><div class="print_width"></div></div>';
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
				$.json_drop_object_graded           = JSONObject.drop_object[index].graded;
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
				  contentArr += '<div id="drop_object_'+$.json_drop_object_id+'" class="drop_object '+$.json_drop_object_border_style+'" data-block="drop_object" data-id="'+$.json_drop_object_id+'" data-type="'+$.json_drop_object_type+'" data-name="'+$.json_drop_object_name+'" data-array="'+$.json_drop_object_drag_array+'" data-g="'+$.json_drop_object_graded+'" data-value="'+$.json_drop_object_value+'" style="'+$.position+' '+$.add_json_width+' '+$.add_json_height+'"><span class="txt" style="'+$.add_json_width+' '+$.add_json_height+'">' + $.json_drop_object_txt + '</span></div>';
				  break;
				case 'img':
				  contentArr += '<div id="drop_object_'+$.json_drop_object_id+'" class="drop_object '+$.json_drop_object_border_style+'" data-block="drop_object" data-id="'+$.json_drop_object_id+'" data-type="'+$.json_drop_object_type+'" data-name="'+$.json_drop_object_name+'" data-array="'+$.json_drop_object_drag_array+'" data-g="'+$.json_drop_object_graded+'" data-value="'+$.json_drop_object_value+'" style="'+$.position+' '+$.add_json_width+' '+$.add_json_height+'"><img src="'+image_path+$.json_drop_object_name+'" class="content_img"><br><div class="print_width"></div></div>';
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
		    var hOffset = 100;	
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
				$.json_drag_object_width = JSONObject.drag_object[index].width;
                hOffset += 20;
				// zzz width?
				
				if ( $.json_drag_object_top !== 'default' ) {
					$.position = 'style="z-index:15;top: '+$.json_drag_object_top+'px; left: '+$.json_drag_object_left+'px; position: absolute;" ';
				} else {
					$.position = 'style="z-index:15;position:absolute;top:'+hOffset+'px;"';
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
				  contentArr += '<div id="drag_object_'+$.json_drag_object_id+'" '+$.position+'class="drag_object" data-block="drag_object" data-id="'+$.json_drag_object_id+'" data-count="'+$.json_drag_object_count+'" data-value="'+$.json_drag_object_value+'" data-type="'+$.json_drag_object_type+'" data-name="'+$.json_drag_object_name+'"><img src="'+image_path+$.json_drag_object_name+'" style="width:'+$.json_drag_object_width+'px">'+$.form_count+'</div>';
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
				  contentArr += '<div id="move_object_'+$.json_move_object_id+'" '+$.position+'class="move_object" data-block="move_object" data-id="'+$.json_move_object_id+'" data-count="'+$.json_move_object_count+'" data-type="'+$.json_move_object_type+'" data-name="'+$.json_move_object_name+'"><img src="'+image_path+$.json_move_object_name+'">'+$.form_count+'</div>';
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
					contentArr += '<div id="answer_'+index+'" class="answer" data-block="answer" data-id="'+$.json_answer_id+'" '+$.position+'data-correct="'+$.json_answer_correct+'" data-type="'+$.json_answer_type+'" data-name="'+$.json_answer_name +'" data-marker="'+$.json_marker+'" data-protocol=""><img src="'+image_path+$.json_answer_name+'" '+$.add_json_width+'class="content_img"><div class="print_width"></div><br><span class="marker center"><span class="markerValue">'+$.markerValue+'</span><span class="markerHTML">'+markerHTML+'</span></span></div>';					
				}
			
			});	
			
		contentArr += '</div>';
		
		}
		if ( typeof JSONObject.answer1 !== 'undefined' ) {		
		
		contentArr += '<div id="answer_set" class="answers" data-id="1">';
		
			$.each(JSONObject.answer1, function(index) { 
			
				// Answer Data
				$.json_answer_id 		= this.id;
				$.json_answer_correct 	= this.correct;
				$.json_answer_type 		= this.type;
				$.json_answer_name 		= this.name;
				$.json_answer_txt 		= this.text;
				$.json_answer_top       = JSONObject.answer1[index].top;
				$.json_answer_left      = JSONObject.answer1[index].left;
				$.json_answer_width     = JSONObject.answer1[index].width;
				
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
					contentArr += '<div id="answer_'+index+'" class="answer" data-block="answer" data-id="'+$.json_answer_id+'" '+$.position+'data-correct="'+$.json_answer_correct+'" data-type="'+$.json_answer_type+'" data-name="'+$.json_answer_name +'" data-marker="'+$.json_marker+'" data-protocol=""><img src="'+image_path+$.json_answer_name+'" '+$.add_json_width+'class="content_img"><div class="print_width"></div><br><span class="marker center"><span class="markerValue">'+$.markerValue+'</span><span class="markerHTML">'+markerHTML+'</span></span></div>';					
				}
			
			});	
			
		contentArr += '</div>';
		
		}
		if ( typeof JSONObject.shading_object !== 'undefined' ) {
		
		contentArr += '<div id="shading_object_set" class="shading_objects" data-id="0">';
		
			$.each(JSONObject.shading_object, function(index) { 
									
				// Title Data
				$.defult_cell_width = 25;
				$.defult_cell_height = 25;
				
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
					
					} else { $.data_option_red_value = 'false'; $.data_option_red_mark = ''; }
					
					if ( $.json_shading_object_blue_check == 'true' && $.json_shading_object_blue_array != '' ) {
						if ( $.inArray( $n, $.json_shading_object_blue_array ) != -1 ) { $.data_option_blue_value = 'true'; $.data_option_blue_mark = 'B'; } else { $.data_option_blue_value = 'false'; $.data_option_blue_mark = ''; }						
					} else { $.data_option_blue_value = 'false'; $.data_option_blue_mark = ''; }
					
					if ( $.json_shading_object_green_check == 'true' && $.json_shading_object_green_array != '' ) {
						if ( $.inArray( $n, $.json_shading_object_green_array ) != -1 ) { $.data_option_green_value = 'true'; $.data_option_green_mark = 'G'; } else { $.data_option_green_value = 'false'; $.data_option_green_mark = ''; }						
					} else { $.data_option_green_value = 'false'; $.data_option_green_mark = ''; }
					
					if ( $.json_shading_object_yellow_check == 'true' && $.json_shading_object_yellow_array != '' ) {
						if ( $.inArray( $n, $.json_shading_object_yellow_array ) != -1 ) { $.data_option_yellow_value = 'true'; $.data_option_yellow_mark = 'Y;'; } else { $.data_option_yellow_value = 'false'; $.data_option_yellow_mark = ''; }						
					} else { $.data_option_yellow_value = 'false'; $.data_option_yellow_mark = ''; }
					
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
	
	// 	end content
	contentArr += '</div>';
		
		if ( typeof JSONObject.hint !== 'undefined' ) {		
		
		contentArr += '<div id="hint_set" class="hint" data-id="0">';
					
		// Hint Data
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
		
		if ( typeof JSONObject.tooltip !== 'undefined' ) {		
		
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
		
		if ( typeof JSONObject.cover !== 'undefined' ) {		
		
		contentArr += '<div id="cover_set" class="covers" data-id="0">';
		
			$.each(JSONObject.cover, function(index) { 
				
				// "id": 0,
				// "type": "txt",
				// "name": "",
				// "text": "",
				// "top": "default",
				// "left": "default",
				// "width": "",
				// "height": "",
				// "direction": ""
				
				// Cover Data
				$.json_cover_id 		= this.id;
				$.json_cover_top        = this.top;
				$.json_cover_left       = this.left;
				$.json_cover_width      = this.width;
				$.json_cover_height     = this.height;
				$.json_cover_direction  = this.direction;
				
				//alert($.json_cover_direction);
				
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
	
	contentArr += '<div id="lockout"></div>';
	
	contentArr += '</div>';
	// END new content wrapper
		
		//replace regex before you build page
		page_builder_app.regexFun(contentArr);
		
		// replace div with dynamic content 
		$("#contentTEMP").replaceWith(contentArr);
		var isBuilderPHP = false;
		for (var i = 0; i < pageName.length; i++) {
			if (pageName[i] == "builder.php") isBuilderPHP = true;
		};
		
        if (!isBuilderPHP && media_path !== "") {
            var s = document.createElement("script");
            s.src = "js/ps20.js";
            s.type = "text/javascript";
		    $('head').append(s);
            s = document.createElement("script");
            s.src = "Grading/grading.js";
            s.type = "text/javascript";
		    $('head').append(s);
        }
        polljQuery(30);
        
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
		
		// tipsy
		//$('.tipsy').tipsy({gravity: $.fn.tipsy.autoWE});
		
		$.cover_slide_options = { 
			cursor: "pointer",
			containment: "parent",
			handle: ".cover_slide_handel"
		};
		$( ".cover_slide" ).draggable($.cover_slide_options);
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
			soundManager.destroySound( $.select_type + '_' + $.select_id , image_path+$.speakCustomName );
			soundManager.createSound( $.select_type + '_' + $.select_id , image_path+$.speakCustomName );	
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
				  $.type_width = JSONObject.image_object[$.type_text_id].width == "default" ? ""
                                    :'style="width:'+JSONObject.image_object[$.type_text_id].width+'px;"';
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
			  return '<img src="'+image_path+$.type_name+'" class="'+$.type_type+'"'+$.type_width+' >';
			  break;
			case 'c':
			  return '<span class="coin">' + $.type_text + '</span>';
			  break;
			}
		});
	}

};
function withjQuery ($) {
	ps20.onReady();		
    initTouch();
}
function polljQuery (time) {
  if (window.jQuery && $(".answer").length > 0 && window.ps20) {
   withjQuery(window.jQuery);
  } else {
    // checks for jQuery again in 50ms
    setTimeout(function () {
     polljQuery(time * 2)
    }, time);
 }
}
var clickms = 100;
var lastTouchDown =-1;
function touchHandler(event) {
    var touch = event.changedTouches[0];
    var d = new Date();
    switch(event.type)
    {
        case "touchstart": type = "mousedown"; lastTouchDown = d.getTime(); break;
        case "touchmove": type="mousemove"; lastTouchDown = -1; break;        
        case "touchend": if(lastTouchDown > -1 && (d.getTime() - lastTouchDown) < clickms){lastTouchDown = -1; type="click"; break;} type="mouseup"; break;
        default: return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type 
        , true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function initTouch() {
    $("#wrapper")[0].addEventListener("touchstart", touchHandler, true);
    $("#wrapper")[0].addEventListener("touchmove", touchHandler, true);
    $("#wrapper")[0].addEventListener("touchend", touchHandler, true);
    $("#wrapper")[0].addEventListener("touchcancel", touchHandler, true);
}
var JSON = JSON || {};
JSON.stringify = JSON.stringify || function (obj) { var t = typeof (obj); if (t != "object" || obj === null) { if (t == "string") obj = '"'+obj+'"'; return String(obj); } else { var n, v, json = [], arr = (obj && obj.constructor == Array); for (n in obj) { v = obj[n]; t = typeof(v); if (t == "string") v = '"'+v+'"'; else if (t == "object" && v !== null) v = JSON.stringify(v); json.push((arr ? "" : '"' + n + '":') + String(v)); } return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}"); } };
JSON.parse = JSON.parse || function (str) { if (str === "") str = '""'; eval("var p=" + str + ";"); return p; };

