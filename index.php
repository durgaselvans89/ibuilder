<?php
header("Location: dir.html"); 
exit;
$return_json = $_POST['callBack'];

?> 

<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>CMS Portal Page</title>

<link rel="stylesheet" href="js/libs/multiselect_src/jquery.multiselect.css" type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="js/libs/multiselect_src/style.css" type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/ui-lightness/jquery-ui.css" />

<style type="text/css" media="screen">
	#buttons {
		padding: 10px 10px 5px 10px;
		font-family: Arial, "MS Trebuchet", sans-serif;
		background: #BAADAD;
		text-align: center;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		border-radius: 5px;
		color: #666;
		cursor: pointer;
		cursor: hand;
		width: 300px;
		height: 25px; 
		font-family: Arial, "MS Trebuchet", sans-serif;
		font-size: 1.5em;
		letter-spacing: 1px;
	}
	
	#buttons a {
		color: #666;
		text-decoration: none;
		
	}
	
</style>

</head>
<body>

<form>

<h2>Template</h2> <!-- selected -->
<select name="template" class="template">
	<option value="">Choose a Template</option>
	<option value="em01">Static - em01</option>
	<option value="em02">Multiple Choice - em02</option>
	<option value="em03">Type Entry - em03</option>
	<!-- <option value="em04">Matching - em04</option> -->
	<option value="em05">Sequencing - em05</option>
	<option value="em06">Drag-N-Drop - em06</option>
	<option value="em07">Shading - em07</option>
	<option value="em08">Movable Objects - em08</option>
</select>

<br>

<div id="contentTEMP"></div>

</form>

<br>

<!-- Teacher Notes<br>
<textarea name="Name" rows="8" cols="40"></textarea> -->

<!-- Load scrips at end for faster page load -->
<script src="js/libs/jquery-1.10.2.min.js" type="text/javascript" charset="utf-8"></script>
<script src="js/libs/jquery-migrate-1.2.1.min.js" type="text/javascript" charset="utf-8"></script>

<!-- jQuery UI -->
<script src="js/libs/jquery-ui-1.10.3/ui/jquery.ui.core.js" type="text/javascript" charset="utf-8"></script>
<script src="js/libs/jquery-ui-1.10.3/ui/jquery.ui.widget.js" type="text/javascript" charset="utf-8"></script>
<script src="js/libs/jquery-ui-1.10.3/ui/jquery.ui.mouse.js" type="text/javascript" charset="utf-8"></script>
<script src="js/libs/jquery-ui-1.10.3/ui/jquery.ui.draggable.js" type="text/javascript" charset="utf-8"></script>

<script src="js/libs/multiselect_src/jquery.multiselect.js" type="text/javascript" charset="utf-8"></script>

<script src="js/libs/jqXMLUtils.js" type="text/javascript" charset="utf-8"></script>

<script type="text/javascript" charset="utf-8">
	
	// Use when uploading to edmesh
	//window.location = "dir.html";
	
	var portalJSONObject = {};
	var contentArr = [];
	var template_code = "";
	var asset_id = "";
	var media_path = "";
	var entry_point = "";
	var iteration_callback_link = "";
	var curriculum_objective_callback_link = "";
	var edit_mode = '';
	
	// Form Data
	//  callBack:[{"name":"curriculum_objective","link":"http://cms-dev.cdiapps.com:80/cms2/em4CurriculumObjective.do","method":"GET","produces":"text/xml"},{"name":"iteration","link":"http://cms-dev.cdiapps.com:80/cms2/ib/iterations/100000287538","method":"GET","produces":"application/json"}]
	
	var callbackObj = <?php echo stripslashes($return_json) ?>;
	
	$.each( callbackObj, function(){
		if ( this.name == 'iteration' ) {
			iteration_callback_link = this.link;
		}
		if ( this.name == 'curriculum_objective' ) {
			curriculum_objective_callback_link = this.link;
		}
	});
	
	console.log(JSON.stringify(callbackObj, null, '\t'));
					
	var cms_app = {

	    onReady: function() {
			
			// Retrive JSON Callback
			cms_app.iteration_callback();
			
			// Retrive XML Callback to Build page
			//cms_app.curriculum_objective_callback();
			
	    },
		
		iteration_callback: function( event ) {
												
			$.ajax({
			    type: 'GET',
			    url: iteration_callback_link,
				contentType: 'application/json; charset=utf-8',
				dataType: "json",
				cache: false,
				success: cms_app.readJSON,
			    error: function() {
			        //alert('error');
			    }
			});
			
		},
		
		readJSON: function( data ) {
			
			portalJSONObject = data
			
			console.log(JSON.stringify(portalJSONObject, null, '\t'));
			
			asset_id = portalJSONObject.id;
			media_path = portalJSONObject.mediaFile;
			//alert(media_path);
			entry_point = portalJSONObject.entryPoint;
									
			if ( media_path == null ) {
				$('.template').on( "keyup change", cms_app.change_template );
			} else {
				$('.template').attr('disabled', 'disabled');
				//media_path = portalJSONObject.mediaFile;
				media_path = portalJSONObject.mediaFile;
				//alert(media_path);
				cms_app.change_template();
			}
			
			// OLD			
			// if ( portalJSONObject.uuid !== null ) {
			// 				iteration_uuid = portalJSONObject.uuid;
			// 				$('.template').attr('disabled', 'disabled');
			// 				
			// 				template = iteration_uuid;
			// 				// template = template.split("_");
			// 				// 				template = template[0];
			// 								
			// 				// make select selected 
			// 				$('.template').val(template).prop('selected', true);
			// 				
			// 				cms_app.change_template();
			// 			} else {
			// 				$('.template').on( "keyup change", cms_app.change_template );
			// 			}
									
		},
		
		curriculum_objective_callback: function( event ) {
						
			$.ajax({
			    type: 'GET',
			    url: curriculum_objective_callback_link,
				dataType: "xml",
				cache: false,
				success: cms_app.pageBuilder,
			    error: function() {
			        //alert('error');
			    }
			});

		},
		
		pageBuilder: function( xml ) {
			
			contentArr = [];
			
			$.xml = $( xml );
			
			console.log(xml);
			
			// GMP Section Head
			$.gmp_section_head = $.xml.find('NODE[thesaurus_id=CNCPT_DEF_abe930b9-f107-4be9-9680-0671be6aaea6]').attr('title');
			contentArr += $.gmp_section_head + '<br>';
			
			contentArr += '<select multiple="multiple" name="gmps" class="gmps" size="5">';
				
				// GMP options
				$.xml.find('NODE[thesaurus_id=CNCPT_DEF_abe930b9-f107-4be9-9680-0671be6aaea6]').children().each(function(){
				    $.gmp_thesaurus_id = $(this).attr('thesaurus_id');
					$.gmp_title = $(this).attr('title');
					$.gmp_description = $(this).attr('description');
			
					contentArr += '<option value="'+$.gmp_thesaurus_id+'">'+$.gmp_title+'</option>';
				
				})
				
			contentArr += '</select>';
			
			contentArr += '<br><br><br>';
			
			// CO Section Head
			$.co_section_head = $.xml.find('NODE[thesaurus_id=CNCPT_DEF_b859015d-89c7-4aa6-b3ac-bcfddbaa15d4]').attr('title');
			contentArr += $.co_section_head + '<br>';
			
			contentArr += '<select name="curriculum_objectives" class="curriculum_objectives" multiple="multiple" size="5">';
									
				// CO Groups
				$.xml.find('NODE[thesaurus_id=CNCPT_DEF_b859015d-89c7-4aa6-b3ac-bcfddbaa15d4]').children().each(function(){
				    $.co_group_title = $(this).attr('title');
					
					contentArr += '<optgroup label="'+$.co_group_title+'">';
					
					co_group = $(this).attr('thesaurus_id');
						
						// CO options
						$.xml.find('NODE[thesaurus_id='+co_group+']').children().each(function(){
							$.co_thesaurus_id = $(this).attr('thesaurus_id');	
							$.co_title = $(this).attr('title');
							$.co_description = $(this).attr('description');
						
							contentArr += '<option value="'+$.co_thesaurus_id+'">'+$.co_title+'</option>';
							
						})
						
					contentArr += '</optgroup>';
						
				})
			
			contentArr += '</select><br>click group to select all in that group';
			
			contentArr += '<br>';			
			
			$("#contentTEMP").replaceWith(contentArr);
			
			setTimeout(function() { 
				
				// Read JSON - add selected to all in list with matching THESAURUS_ID
				//INTRODUCE will have three types.... "DEVELOP", "CONCLUDE"..
				$.each(portalJSONObject.curriculumobjectives.INTRODUCE, function( index ) { 
					$.list_val_tid = this.attributes.THESAURUS_ID;
					$.list_val_tid = JSON.stringify($.list_val_tid)
					$.list_val_tid = $.list_val_tid.split('"');
					$.list_val_tid = $.list_val_tid[1];
					$('option[value="'+$.list_val_tid+'"]').prop('selected', true);
					//console.log($.list_val_tid);
				});
			
				$('select[multiple="multiple"]').multiselect(); 
				
			
			}, 500);
															
		},
		
		change_template: function( event ) {
			
			$("#buttons").replaceWith('');
			
			//set template
			
			console.log(edit_mode);
			console.log(JSON.stringify(portalJSONObject, null, '\t'));
			
			if ( media_path == null || edit_mode  == 'new' ) {				
				
				edit_mode  = 'new';
				media_path = '/repository/data/ib/iterations/'+asset_id;
				
				template_code = $('.template').val();
				
				setTimeout(function() {
					$('body').append('<div id="buttons"><a href="builder.php?media='+media_path+'&entryPoint=data.json&template='+template_code+'">LAUNCH ITERATION BUILDER</a></div>')
				}, 500);
				
				cms_app.save_to_cms(portalJSONObject); // Write File 
				//<div class="save_to_cms">SAVE TO CMS</div> <div class="save_message"></div>
				
				// $(".save_to_cms").on("click", function(event){
				// 				  cms_app.save_to_cms(portalJSONObject);
				// 				});
				
			} else { //get template from media file.
				
				edit_mode  = 'edit';
				
				// Get iteration JSON
				$.ajax({
				    type: 'GET',
				    url: media_path + '/data.json',
					contentType: 'application/json; charset=utf-8',
					dataType: "json",
					cache: false,
				    success: function(data) {
				        template_code = data.template;
						
						//Check is file is written before jumping to a new window...
						cms_app.save_to_cms(portalJSONObject); // Write File 
						window.location = 'builder.php?media='+media_path+'&entryPoint=data.json&template='+template_code+'';
				    }
				});
				
			}
			
		},
		
		// nees to be publish
		// needs to be in IB content
		// use saved manafest file and use whe publish is clickek in IB
		save_to_cms: function ( portalJSONObject ) {
			
			//alert('this happened');
			
			//portalJSONObject.curriculumobjectives.INTRODUCE = [];
			
			// $.gmp_val = $('.gmps').val();
			// 			
			// 			$.each( $.gmp_val, function( index, value ) { 
			// 				$.gmp_json = { "id":-1, "attributes":{ "THESAURUS_ID":[value] } };			
			// 				portalJSONObject.curriculumobjectives.INTRODUCE.push($.gmp_json);
			// 			});
			
			// $.cos_val = $('.curriculum_objectives').val();
			// 			
			// 			$.each( $.cos_val, function( index, value ) { 
			// 				$.cos_json = { "id":-1, "attributes":{ "THESAURUS_ID":[value] } };			
			// 				portalJSONObject.curriculumobjectives.INTRODUCE.push($.cos_json);
			// 			});
									
			portalJSONObject.entryPoint = 'data.json';
			//portalJSONObject.uuid = template_code;
			portalJSONObject.mediaFile = media_path;
			portalJSONObject['callback_link'] = iteration_callback_link;
						
			$.new_json = JSON.stringify(portalJSONObject);
			
			// This happens in iteration Builder save_to_cms		
			// $.ajax({
			// 				type : 'POST',
			// 				url : iteration_callback_link,
			// 				contentType: 'application/json; charset=utf-8',
			// 				dataType: "json",
			// 				processData: false,
			// 				cache: false,
			// 				data: $.new_json,
			// 			});
			
			// This writes manifest.json in media_path
			// $.ajax({
			// 			type : 'POST',
			// 			url : 'php/service.php',
			// 			dataType: "json",
			// 			cache: false,
			// 			data: ({
			// 		        path: media_path,
			// 				file: 'manifest.json',  
			// 				json: JSON.parse($.new_json)
			// 		    }),
			// 			success: function(data) {
			// 				if( data == 1 ) {
			// 					message = "Success!";
			// 				} else {
			// 					message = "Error: Your work was not saved";
			// 				}    
			// 				$('.save_message').html(message);
			// 			}
			// 		});
						
			$.ajax({
				type : 'POST',
				url : 'php/service.php',
				dataType: "json", //dataType: "text",
				cache: false,
				data: ({
			        path: media_path,
					file: 'manifest.json',
					json: $.new_json //JSON.parse($.new_json)
			    })
			});
			
			console.log('mediaFile = ' + media_path);
			console.log($.new_json);
			
		}
				
	};

	$( document ).ready( cms_app.onReady );

</script>

</body>
</html>
