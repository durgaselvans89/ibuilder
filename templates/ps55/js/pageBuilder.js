//var JSONObject = {};
var contentArr = [];
var markerCode = '';
var markerHTML = '';
var set_font_size = '';
var iteration = '';

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
		if (typeof JSONObject.marker !== 'undefined') {
			$.json_marker = JSONObject.marker;

			//markerCode - 49 = 1, 65 = A, 97 = a,
			switch ($.json_marker) {
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
	pageBuilder: function(event) {
		console.log("ps55 pageBuild.pageBuilder --- ");

		contentArr = [];
		set_font_size = JSONObject.font_size;

		$("#content").replaceWith('<div id="contentTEMP"></div>');

		// Get Grades
		if (typeof JSONObject.grades !== 'undefined') {
			$.json_grades = JSONObject.grades;
		}

		// Get Marker
		if (typeof JSONObject.marker !== 'undefined') {
			$.json_marker = JSONObject.marker;
		}

		// Get Layout
		if (typeof JSONObject.layout !== 'undefined') {
			$.json_layout = JSONObject.layout;
		}

		// Get Font Size
		if (typeof JSONObject.font_size !== 'undefined') {
			set_font_size = JSONObject.font_size;
		}

		if (typeof JSONObject.auto_check !== 'undefined') {
			$.auto_check = JSONObject.auto_check;
		}

		// new content wrapper
		contentArr += '<div id="content" data-template="' + template + '" data-grades="' + $.json_grades + '" data-layout="' + $.json_layout + '" data-id="0" data-font="' + set_font_size + '"><div class="content">'; //data-iteration="'+iteration+'"


		if (typeof JSONObject.title !== 'undefined') {

			contentArr += '<div id="title_set" class="titles" data-id="0">';

			$.each(JSONObject.title, function(index) {
				// Title Data		
				$.json_title_id = JSONObject.title[index].id;
				$.json_title_type = JSONObject.title[index].type;
				$.json_title_txt = JSONObject.title[index].text;
				$.json_title_name = JSONObject.title[index].name;
				$.json_title_top = JSONObject.title[index].top;
				$.json_title_left = JSONObject.title[index].left;
				$.json_title_width = JSONObject.title[index].width;

				if ($.json_title_top !== 'default') {
					$.position = 'top: ' + $.json_title_top + 'px; left: ' + $.json_title_left + 'px; position: absolute;';
				} else {
					$.position = 'position: absolute;left: 50px;top: 50px;';
				}

				if ($.json_title_width !== 'default') {
					$.add_json_width = 'width: ' + $.json_title_width + 'px; height: auto;';
				} else {
					$.add_json_width = 'width:350px;';
				}

				switch ($.json_title_type) {
					case 'txt':
						contentArr += '<div id="title_' + $.json_title_id + '" style="' + $.position + $.add_json_width + '" class="title" data-block="title" data-id="' + $.json_title_id + '" data-type="' + $.json_title_type + '" data-name="' + $.json_title_name + '"><span class="txt">' + $.json_title_txt + '</span></div>';
						break;
					case 'img':
						// need to get image path
						contentArr += '<div id="title_' + $.json_title_id + '" style="' + $.position + '" class="title" data-block="title" data-id="' + $.json_title_id + '" data-type="' + $.json_title_type + '" data-name="' + $.json_title_name + '"><img src="' + media_path + '/images/' + $.json_title_name + '" style="' + $.add_json_width + '" class="content_img"><div class="print_width"></div></div>';
						break;
					case 'hide':
						contentArr += '';
						break;
				}
			});

			contentArr += '</div>';

		}

		if (typeof JSONObject.content_box !== 'undefined') {

			contentArr += '<div id="content_box_set" class="content_boxs" data-id="0">';

			$.each(JSONObject.content_box, function(index) {
				// content_box Data				
				$.json_content_box_id = JSONObject.content_box[index].id;
				$.json_content_box_type = JSONObject.content_box[index].type;
				$.json_content_box_txt = JSONObject.content_box[index].text;
				$.json_content_box_name = JSONObject.content_box[index].name;
				$.json_content_box_top = JSONObject.content_box[index].top;
				$.json_content_box_left = JSONObject.content_box[index].left;
				$.json_content_box_width = JSONObject.content_box[index].width;

				if ($.json_content_box_top !== 'default') {
					$.position = 'top: ' + $.json_content_box_top + 'px; left: ' + $.json_content_box_left + 'px; position: absolute;';
				} else {
					$.position = 'position: absolute;left: 50px;top: 125px;';
				}

				if ($.json_content_box_width !== 'default') {
					$.add_json_width = 'width: ' + $.json_content_box_width + 'px; height: auto;';
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
		var numQuadrants = 0;
		var blocksize_x = 0;
		var blocksize_y = 0;
		var dimension_x = 0;
		var dimension_y = 0;
		if (typeof JSONObject.coordinate_object !== 'undefined') {

			$.each(JSONObject.coordinate_object, function(index) {
				// variables
				numQuadrants = JSONObject.coordinate_object[index].quadrants;
				dimension_x = 400;
				dimension_y = 400;
				$.coordOb_scale_x = eval(JSONObject.coordinate_object[index].scale_x);
				$.coordOb_scale_y = eval(JSONObject.coordinate_object[index].scale_y);
				$.coordOb_origin_top = dimension_y;
				$.coordOb_origin_right = dimension_x;
				$.coordOb_label_x_top = dimension_y - 10;
				$.coordOb_label_x_left = dimension_x + 3;
				$.coordOb_label_y_top = -20;
				$.coordOb_label_y_left = -15;
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
				if (numQuadrants > 1) {
					// figure our block size and round for better placement
					blocksize_x = Math.round((dimension_x/2)/$.coordOb_scale_x);
					blocksize_y = Math.round((dimension_y/2)/$.coordOb_scale_y);

					// get dimensions
					dimension_x = blocksize_x * $.coordOb_scale_x * 2;
					dimension_y = blocksize_y * $.coordOb_scale_y * 2;
				} else {
					// get block size
					blocksize_x = Math.round(dimension_x/$.coordOb_scale_x);
					blocksize_y = Math.round(dimension_y/$.coordOb_scale_y);

					// get dimensions
					dimension_x = blocksize_x * $.coordOb_scale_x;
					dimension_y = blocksize_y * $.coordOb_scale_y;
				}

				// create draggable container
				contentArr += '<div id="coordinate_object_set" data-block="coordinate_object" class="coordinate_object" data-id="0" style="position:absolute;left:'+$.json_coordinate_object_left+'px;top:'+$.json_coordinate_object_top+'px;">';

				// add quadrant and change variables
				if (numQuadrants > 1) {
					// update label positions
					$.coordOb_origin_top = dimension_y/2;
					$.coordOb_origin_right = dimension_x/2 + 3;
					$.coordOb_label_x_top = dimension_y/2 - 10;
					$.coordOb_label_x_left = dimension_x + 5;
					$.coordOb_label_y_left = dimension_x/2 - 10;
					$.coordOb_label_y_top = -20;

					// create object
					contentArr += '<div id="coordinateGrid" style="width:'+(dimension_x+4)+'px; height:'+(dimension_y+4)+'px;">';

					// add in quadrants and blocks
					for (var k = 0; k < numQuadrants; k++) {
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

				} else {
					// create object
					contentArr += '<div id="coordinateGrid" style="width:'+dimension_x+'px;height:'+dimension_y+'px;">';

					// add in quadrant and blocks
					contentArr += '<div class="q1" style="width:'+dimension_x+'px;float:left;border: 1px solid black;">';
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
				}

				// add in labels
				contentArr += '<div class="labels">';
				if ((!eval(JSONObject.coordinate_object[index].show_scale) && numQuadrants == 1) || numQuadrants > 1) {
					contentArr += '<div class="origin" style="position:absolute;font-style:italic;right:'+$.coordOb_origin_right+'px;top:'+$.coordOb_origin_top+'px;">O</div>';
				}
				contentArr += '<div class="label_x main" style="position:absolute;font-style:italic;left:'+$.coordOb_label_x_left+'px;top:'+$.coordOb_label_x_top+'px;">'+ JSONObject.coordinate_object[index].label_x +'</div>';
				contentArr += '<div class="label_y main" style="position:absolute;font-style:italic;left:'+$.coordOb_label_y_left+'px;top:'+$.coordOb_label_y_top+'px;">'+ JSONObject.coordinate_object[index].label_y +'</div>';				

				// show scales if needed
				//alert('index1'+index);alert(JSONObject.coordinate_object[index].show_scale);
				if (eval(JSONObject.coordinate_object[index].show_scale)) {
					if (numQuadrants > 1) {
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
					} else {
						// add in arrows
						contentArr += '<div class="arrow_x" style="position:absolute;"></div>';
						contentArr += '<div class="arrow_y" style="position:absolute;"></div>';

						// x labels
						for (var i = 1; i <= $.coordOb_scale_x/2; i++) {
							// create lables
							number = i*2;
							contentArr += '<div class="label_x pos" style="position:absolute;">'+ number +'</div>';
						};

						// y labels
						for (var i = 1; i <= $.coordOb_scale_y/2; i++) {
							// create lables
							number = i*2;
							contentArr += '<div class="label_y pos" style="position:absolute;">'+ number +'</div>';
						};
					}
				}

				// close labels
				contentArr += '</div>';

				// add in canvas
				contentArr += '<div id="coordinateGridCanvas" style="position:absolute"></div>';

				// close coordinate grid
				contentArr += '</div>';

				// add in controls
				var buttonStyles = 'font-size:16px;padding:5px 5px;';
				var connect = (eval(JSONObject.coordinate_object[index].connect)) ? '' : 'display:none;';
				contentArr += '<div id="controls" style="position:absolute;left:0;top:-50px;"><button id="connect" style="'+buttonStyles+' '+connect+'">Connect</button><button id="clearButton" style="'+buttonStyles+'">Clear</button></div>';

				// close container
				contentArr += '</div>';
			});
		}

		
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
		if (numQuadrants > 1) {
			// get variables
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
		} else {
			var top = dimension_y;

			// position main labels
			$(".label_x.main").css('left', dimension_x + 10);
			$(".label_y.main").css('left', 3);

			// position arrows
			$(".arrow_x").css({
				width: 10,
				height: 10,
				borderRight: "2px solid",
				borderTop: "2px solid",
				left: dimension_x-12,
				top: top-4,
				transform: "rotate(45deg)"
			});
			$(".arrow_y").css({
				width: 10,
				height: 10,
				borderTop: "2px solid",
				borderRight: "2px solid",
				left: -5,
				top: 3,
				transform: "rotate(-45deg)"
			});

			// cycle through
			for (var i = 0; i < posX.length; i++) {
				var number = (i+1)*2;
				$(posX[i]).css({
					top: top + 2,
					left: number*blocksize_x - $(posX[i]).width()/2 + 1
				});//4	60	7	8	417
//alert('posx '+$(posX[i]).html()+' number '+number+' blocksize_x '+blocksize_x+' width '+$(posX[i]).width()+' '+(number*blocksize_x - $(posX[i]).width()/2 + 1))
			}
			for (i = 0; i < posY.length; i++) {
				var number = (i+1)*2;
				$(posY[i]).css({
					left: -$(posY[i]).width() - 2, // 2 for borders
					top: top - number*blocksize_y - $(posY[i]).height()/2
				});
			}
		}

		var isBuilderPHP = false;
		for (var i = 0; i < pageName.length; i++) {
			if (pageName[i] == "builder.php") isBuilderPHP = true;
		};

		var isTemplate = false;
    if (!isBuilderPHP && media_path !== undefined) {
    	isTemplate = true;
        var s = document.createElement("script");
        s.src = "js/ps55.js";
        s.type = "text/javascript";
	    $('head').append(s);
	    s = document.createElement("script");
	    s.src = "Grading/grading.js";
	    s.type = "text/javascript";
	    $('head').append(s); 
	    s = document.createElement("script");
	    s.src = "js/keypad_controller.js";
	    s.type = "text/javascript";
	    $('head').append(s); 
	    s = document.createElement("script");
	    s.src = "js/keyboardlookup.js";
	    s.type = "text/javascript";
	    $('head').append(s);
	    s = document.createElement("script");
	    s.src = "js/keypad.js";
	    s.type = "text/javascript";
	    $('head').append(s);
    }
    polljQuery(30, isTemplate);

		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

		MathJax.Hub.Queue(function() {

			$('.txt span').each(function() {
				$(this).css("visibility", "visible");
			});

		});

		//console.log(JSON.stringify(JSONObject, null, '\t'));

		$(".hint_close").click(page_builder_app.hint_close);
		$(".directions_close").click(page_builder_app.directions_close);

		$(".speakCustomClick").off('click');
		$(".speakCustomClick").click(page_builder_app.speakClick);

		// tipsy
		//$('.tipsy').tipsy({gravity: $.fn.tipsy.autoWE});

		$.cover_slide_options = {
			cursor: "pointer",
			containment: "parent",
			handle: ".cover_slide_handel"
		};

		//$( ".cover_slide" ).draggable($.cover_slide_options);

		// Developer Code Here...
		// if (pageName[2] !== 'builder.php') {
		// 	ps55.init(JSONObject);
		// }
	},

	show_hint: function(event) {
		$('#hint_set').show();
		$('#directions_set').hide();
	},

	hint_close: function(event) {
		$('#hint_set').hide();
		$('#directions_set').hide();
		soundManager.stopAll();
	},

	show_directions: function(event) {
		$('#directions_set').show();
		$('#hint_set').hide();
	},

	directions_close: function(event) {
		$('#directions_set').hide();
		$('#hint_set').hide();
		soundManager.stopAll();
	},

	speakClick: function(event) {

		select_parent = $(this).parent().attr('data-name');
		select_parent_id = $(this).parent().attr('data-id');
		select_selector = '.in_block[data-name="' + select_parent + '"].in_block[data-id="' + select_parent_id + '"]';
		select_value = $(select_selector + ' select').val();

		$.select_id = $(this).attr('data-id');
		$.select_type = $(this).attr('data-type');
		$.speakCustomName = $(this).attr('data-name');

		if ($.select_type == 'hint' || $.select_type == 'directions' || $.select_type == 'play_button' || $.select_type == 'custom_feedback') {
			soundManager.destroySound($.select_type + '_' + $.select_id, media_path + '/images/' + $.speakCustomName);
			soundManager.createSound($.select_type + '_' + $.select_id, media_path + '/images/' + $.speakCustomName);
			select_value = $.select_type + '_' + $.select_id;
		}

		if (select_value != 'none') {
			// peramiters = playSound array, callback 
			sm_app.playSound([select_value], "test");
		}

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
			var isBuilderPHP = false;
			for (var i = 0; i < pageName.length; i++) {
				if (pageName[i] == "builder.php") isBuilderPHP = true;
			};

			switch( $.type_split_arr[0] )
			{
			case 't':
			if(isBuilderPHP)
			  	return '<div id="type_object_'+ $.type_id +'" data-id="'+ $.type_id +'"style="display: inline-block;width:60px" class="type_object keypad_box" data-htmlarray="[]" data-output="" data-value=\''+ $.type_wrapper +'\' data-charlimit="'+$.type_size+'" data-keypad="'+$.type_type+'">'+$.type_id_arr+'</div>';	
			  else
			  	return '<div id="type_object_'+ $.type_id +'" data-id="'+ $.type_id +'"style="display: inline-block;width:60px" class="type_object keypad_box" data-htmlarray="[]" data-output="" data-value=\''+ $.type_wrapper +'\' data-charlimit="'+$.type_size+'" data-keypad="'+$.type_type+'"></div>';	
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
	build_keypad_events: function( e ) {
            
	    //console_on && console.log('build_keypad_events');
	    
	    if ( typeof JSONObject.type_object !== 'undefined' ) {
	        $.each(JSONObject.type_object, function(index) {	        	
	            $('#type_object_'+index+'').off();
	            $('#type_object_'+index+'').on("mousedown", function(e){clickedTextField($(this)[0].id)});
	        }); 
	    }        
    }
};

function withjQuery (isTemplate) {
    ps55.init(JSONObject, isTemplate);
    page_builder_app.build_keypad_events();
    loadKeyPads();
}
function polljQuery (time, isTemplate) {
  if (window.jQuery && $(".content_boxs").length > 0 && window.ps55) {
   withjQuery(isTemplate);
  } else if (isTemplate) {
    // checks for jQuery again in 50ms
    setTimeout(function () {
     polljQuery(time * 2)
    }, time);
 }
}

$(document).ready(page_builder_app.onReady);
