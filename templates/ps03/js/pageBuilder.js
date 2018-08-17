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
	contentArr += '<div id="content" data-template="'+template+'" data-grades="'+$.json_grades+'" data-layout="'+$.json_layout+'" data-id="0" data-font="'+set_font_size+'">';
    contentArr += '<div class="content">'; //data-iteration="'+iteration+'
		
		
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
                    
		    var style = "";
            if (pageName[1] !== "builder.php") 
                style= "color:white";
		    contentArr += '<div id="content_box_set" class="content_boxs" data-id="0" style="'+style+'">';
			
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
				  contentArr += '<div id="content_box_'+$.json_content_box_id+'" style="'+$.position+$.add_json_width+' "class="content_box" data-block="content_box" data-id="'+$.json_content_box_id+'" data-type="'+$.json_content_box_type+'" data-name="'+$.json_content_box_name+'"><span class="txt" style="line-height:1.8em;">' + $.json_content_box_txt + '</span></div>';
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
	// 	end content
	contentArr += '</div>';
	contentArr += '</div>';
	// END new content wrapper
		
		// replace div with dynamic content 
		page_builder_app.regexFun(contentArr);
		$("#contentTEMP").replaceWith(contentArr);

        if (pageName[1] !== "builder.php" && media_path !== "") {
		$.getScript("js/ps03.js");
	    	$.getScript("Grading/grading.js");
        } else if (media_path !== "") {
	    	$.getScript("templates/ps03/Grading/grading.js");
        }
        polljQuery(30);
        
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		
		MathJax.Hub.Queue(function () {
			$('.txt span').each(function() {
				$(this).css("visibility","visible");
			});		
            window.MathJaxFinished = true;
		});


        $("#controls").remove();
        if (pageName[1] === 'builder.php' && $(".edit_mode")[0].value === "edit") {
            $('<div id="controls"> <div id="buttons"></div>').insertAfter("#wrapper");
            $("#buttons").append("<button id='da' class='buttons'>Submit</button>");
        } else if (pageName[1] === 'builder.php' && $(".edit_mode")[0].value === "student_view") {
            $('<div id="controls"> <div id="buttons"></div>').insertAfter("#wrapper");
            $("#buttons").append("<button id='da' class='buttons'>Submit</button>");
        } else if (pageName[1] !== "builder.php" && media_path != "") {
            $('<div id="controls"> <div id="buttons"> <button id="cb">Clear</button> </div> </div>').insertAfter("#wrapper");
            $("#buttons").append("<button id='da' class='buttons'>Submit</button>");
        } else {
            $('<div id="controls"> <div id="buttons"> <button id="cb">Clear</button> </div> </div>').insertAfter("#wrapper");
        }
    },
	regexFun: function ( event ) {

        if ($(".edit_mode").length > 0)
            return;

		//This finds the inside of ##word##			
		var regex = /##(.*?)##/g;
	    	
		var index = 0;
		var regex_arr = [];
		contentArr = contentArr.replace(regex, function (match, contents) { 
						
			regex_arr.push(contents);
			$.type_split_arr = contents.split(':');
			$.type_split_id_arr = $.type_split_arr[1].split(',');
			
			$.type_arr = [];
			$.type_wrapper = [];												
            $.type_size = 0;
			$.each( $.type_split_id_arr , function( index, value ) { 
				
				$.type_text_id = value - 1;	
				
				switch( $.type_split_arr[0] )
				{
				case 't':
                    if (typeof JSONObject.type_object[$.type_text_id] !== "undefined") {
				        $.type_arr.push(JSONObject.type_object[$.type_text_id].source);
				        $.type_size = JSONObject.type_object[$.type_text_id].size;
                        $.type_keypad = JSONObject.type_object[$.type_text_id].type;
                    }
				    break;
				case 's':
                    if (typeof JSONObject.select_object[$.type_text_id] !== "undefined") {
                        var select = JSONObject.select_object[$.type_text_id];
				        $.type_arr.push(select.text);
                        if (select.width == "default" && !select.text.match(/\\\(.*\\\)/g) && select.text.length > $.type_size) {
                            $.type_size = select.text.length;
                        } else if (select.width != "default" && parseInt(select.width,10) > parseInt($.type_size.toString().replace(/[^0-9]+/,""),10)) {
                            $.type_size = select.width + "px";
                        }
                    }
				    break;
				}
				
			});	
			switch( $.type_split_arr[0] )
			{
			case 't':
			    return '##:::'+$.type_keypad+':::' + $.type_size +":::"+ match.substr(2);
            case 's':
			    return '##'+$.type_arr.join("||")+":::"+$.type_keypad+':::' + ($.type_size) +":::"+ match.substr(2);
            }
            return match;
		});
	}
};
function withjQuery ($) {
    setTimeout(function(){
        loadKeyPads(ps03);
        ps03.onReady();
        if ($("#cb").length) {
            $("#cb")[0].onclick = ps03.clearInputs;
        }
        if ($("#da").length) {
            $("#da")[0].onclick = displayAnswer;
        }

    },400);
    initTouch();
}

function polljQuery (time) {
    var imgLoaded = function () {
        var imgs = JSON.stringify(JSONObject).match(/\"type\":\"img\"/g);
        var ret = imgs == null || imgs.length == $("img").length;
        $.each($("img"),function(i,item) {
            if (!item.completed && (typeof item.naturalHeight != "undefined" && item.naturalHeight == 0)) ret = false;
        });
        return ret;
    };
    if ( window.jQuery && imgLoaded() && $(".content_box").length == JSONObject.content_box.length && window.ps03 && window.displayAnswer
            && window.Kinetic && window.html2canvas && window.keyPad && window.MathJaxFinished) {
        withjQuery(window.jQuery);
    } else {
        // checks for jQuery again 
        setTimeout(function () {
            polljQuery(time * 1.3)
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
