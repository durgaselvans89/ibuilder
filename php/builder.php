<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>INTERACTIVE TEMPLATE ITERATION BUILDER</title>
        
    <style type="text/css" media="screen">
        .txt span {
            visibility: hidden;
        }
    </style>    
    
    <!-- Keypad CSS -->
    <link rel="stylesheet" href="css/math_keypad_g1to2.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="css/numeric_keypad_g1to6.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="css/full_keypad_g1to2.css" type="text/css" media="screen"/>
    
    <!-- jQuery -->
    <script src="js/libs/jquery-1.10.2.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/libs/jquery-migrate-1.2.1.min.js" type="text/javascript" charset="utf-8"></script>
    
    <!-- Plugins -->
    <link rel="stylesheet" href="css/tipsy.css" type="text/css" media="screen" title="no title" charset="utf-8">
    <script src="js/libs/jquery.tipsy.js" type="text/javascript" charset="utf-8"></script>
    
    <!-- jQuery UI -->
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css" />
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>

    <!-- Spectrum Color Picker -->
    <script src="js/libs/spectrum.js" type="text/javascript" charset="utf-8"></script>
    <link rel="stylesheet" href="css/spectrum.css" type="text/css" media="screen"/>

    <!-- File Upload Plugin -->
    <script src="js/libs/jquery.fileupload.js" type="text/javascript" charset="utf-8"></script>

    <!-- Sound manager/Feedback -->
    <!-- <script src="js/libs/soundmanager/script/soundmanager2.js" type="text/javascript" charset="utf-8"></script> -->

    <!-- Raphaeljs -->
    <script src="js/libs/raphael.js" type="text/javascript" charset="utf-8"></script>

    <!-- Homegrown helpers -->
    <script src="js/libs/base.js" type="text/javascript" charset="utf-8"></script>

    <!-- Production -->
    <script src="js/libs/soundmanager/script/soundmanager2-nodebug-jsmin.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/sounds.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/feedback.js" type="text/javascript" charset="utf-8"></script>
    
    <script type="text/javascript" charset="utf-8">
        
        function getUrlVars() {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                vars[key] = value;
            });
            return vars;
        }
        
        var media_path = getUrlVars()["media"];
        var entryPoint = getUrlVars()["entryPoint"];
        var template = getUrlVars()["template"];
        
        document.write('<link rel="stylesheet" type="text/css" href="templates/'+template+'/css/styles.css">'); 
        //document.write('<script src="templates/'+template+'/js/formBuilder.js" type="text/javascript" charset="utf-8"><\/script>');   
        document.write('<script src="templates/'+template+'/js/pageBuilder.js" type="text/javascript" charset="utf-8"><\/script>'); 
        
        var mode = 'edit';
                
        if ( media_path == undefined ) {
            window.location = "dir.html";
        }else {
            media_path = media_path.replace(/\/?$/,"/");
        }
        
    </script>
    
    <link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.1/themes/base/jquery-ui.css"/>
    
    <style type="text/css" media="screen">
        
        .size_img { 
            width: 100%;
            height: auto;
        }
        
        .ui-resizable-helper { border: 2px dotted #00F; }
        .ui-icon { background: #fff url('images/resize-6-256.png'); z-index: 90; width: 15px; height: 15px; position: absolute; bottom: 3px; right: -3px;  }
    
    </style>
    
    <link rel="stylesheet" href="css/form_style.css" type="text/css" media="screen" title="no title" charset="utf-8">
    
    <!-- Keypad JS -->
    <script type="text/javascript" src="js/keyboardlookup.js"></script>
    <script type="text/javascript" src="js/keypad.js"></script>
    
</head>
 
<body>

<div class="tabs">
    <div class="show_form">FORM</div>
    <div class="hide_form">PREVIEW</div>
    <div class="save_form">SAVE</div>
    <div class="zip_form">DOWNLOAD<form id="zip_form" action="php/cogneroPackager.php" method="post"><input id="iteration" type="text" name="iteration" value="" hidden></input></form></div>
    <!-- <div class="save_to_cms">SEND TO CMS</div> -->
    <div class="save_message"></div>
    <div class="version">Version: 1.0.146</div>
    
    <div class="font_size">
        Font Size: 
        <span id="font_a" class="change_font_size">A</span>
        <span id="font_aa" class="change_font_size">A</span>
        <span id="font_aaa" class="change_font_size">A</span>
    </div>
    
    <div class="change_mode">
        Preview Mode:
        <select name="edit_mode" class="edit_mode">
            <option value="edit" selected>Edit</option>
            <option value="student_view">Student View</option>
            <!-- 
                <option value="teacher">Teacher</option>
                <option value="epres">ePresentation</option> 
            -->
        </select>
    </div>
    
    <!-- <div class="change_snap_to">
            
        Grid Snap: 
        <select name="snap_to" class="snap_to">
            <option value="1" selected>Default</option>
            <option value="10">10</option>
        </select>
    </div> -->
    
    
</div>

<!-- build dynamically use template in path ex...  /templates/em07/images/ib_layout_thumbs/Layout_A.png -->
<div class="layout_tab"></div>

<div class="form_tab">
        
    <div id="form_wrap">
        
        <div id="build_title">INTERACTIVE TEMPLATE ITERATION BUILDER</div>
    
        <div class="form">

            <form>
                
                <!-- hidden -->
                <input id="fileupload" type="file" name="files" accept="audio/*,image/*">
                        
                <h2 id="build_iteration"></h2>
                <ul id="build_menu"></ul>

            
                <div id="formTEMP"></div>
                    
            </form>
        
        </div>
    
    </div>
    
</div>

<div id="wrapper">  
        
    <div id="contentTEMP"></div>
    
    <div id="imageholder"><div id="horizontal"></div><div id="vertical"></div></div>
    
    <!-- Keypads -->

        <audio id="sfx_neg" src="sound/SFX_negative.mp3" preload></audio>
        <audio id="sfx_click" src="sound/SFX_keyboard.mp3" preload></audio>

        <!-- Keypad 1 -->
            <div id="math_keypad_G1to2" style="visibility:hidden;">



                                <div class= "dragbar">

                                </div>
                                <div data-id="0"  class="closebutton pointer" ></div>

                                <div class= "display_and_pad">

                                    <div class= "displaywindow" >



                                    <div data-id="0" class="display" ></div>



                                    <div class="fractionholder">    

                                        <div data-id="0" class="topfraction"   data-htmlarray= "" ></div>
                                        <!-- faked line --> 
                                            <div style="left:0px;top:22px;height:1px;width:146px;position:absolute;background-color: #000000"></div>
                                        <div data-id="0" class="botfraction"   data-htmlarray= "" ></div>
                                    </div>

                                        <div class="blinkingcursor"></div>
                                    </div>
                                    <!--keypad numbers-->
                                    <!--top row -->
                                    <div  class="seven number_symbol_key pointer nodrag">7</div>
                                    <div  class="eight number_symbol_key pointer nodrag">8</div>
                                    <div  class="nine number_symbol_key pointer nodrag">9</div>

                                    <div  class="dollar number_symbol_key pointer disableforfractions">$</div>
                                    <div  class="cent number_symbol_key pointer disableforfractions">&#162</div>
                                    <div  class="backspace custom_symbol_key pointer nodrag"></div>


                                    <!--row -->
                                    <div class="four number_symbol_key pointer nodrag">4</div>
                                    <div class="five number_symbol_key pointer nodrag">5</div>
                                    <div class="six number_symbol_key pointer nodrag">6</div>

                                    <div class="fahrenheit number_symbol_key pointer  disableforfractions">&#8457</div>
                                    <div class="celsius number_symbol_key pointer disableforfractions">&#8451</div>
                                    <div class="clear custom_symbol_key pointer nodrag"></div>


                                    <!--row -->
                                    <div class="one number_symbol_key pointer nodrag">1</div>
                                    <div class="two number_symbol_key pointer nodrag">2</div>
                                    <div class="three number_symbol_key pointer nodrag">3</div>

                                    <div class="less_than number_symbol_key pointer nodrag">&#60</div>
                                    <div class="greater_than number_symbol_key pointer nodrag">&#62</div>
                                    <div class="make_fraction custom_symbol_key pointer nodrag"></div>  

                                    <!--row -->
                                    <div class="zero number_symbol_key pointer nodrag">0</div>
                                    <div class="period number_symbol_key pointer nodrag">.</div>
                                    <div class="comma number_symbol_key pointer nodrag">,</div>

                                    <div class="plus number_symbol_key pointer nodrag">&#43</div>
                                    <div class="minus number_symbol_key pointer nodrag">&#8722</div>
                                    <div class="equal number_symbol_key pointer nodrag">&#61</div>  

                                    <!--row -->
                                    <div class="enter enter_key pointer nodrag" style="visibility:hidden">enter</div>       
                                    <div class="space space_key pointer nodrag">space</div> 


                                </div>  
                            </div>

                            <div id="numeric_keypad_G1to6" style="visibility:hidden;">


                                <div class= "dragbar">


                                </div>

                                <div data-id="0"  class="closebutton pointer" ></div>

                                <div class= "display_and_pad">


                                    <div class= "displaywindow" >

                                    <div class="blinkingcursor"></div>

                                    <div data-id="0" class="display" ></div>

                                    </div>
                                    <!--keypad numbers-->
                                    <!--top row -->
                                    <div  class="seven number_symbol_key pointer">7</div>
                                    <div  class="eight number_symbol_key pointer">8</div>
                                    <div  class="nine number_symbol_key pointer">9</div>
                                    <div  class="backspace custom_symbol_key pointer"></div>

                                    <!--row -->
                                    <div class="four number_symbol_key pointer">4</div>
                                    <div class="five number_symbol_key pointer">5</div>
                                    <div class="six number_symbol_key pointer">6</div>

                                    <!--row -->
                                    <div class="one number_symbol_key pointer">1</div>
                                    <div class="two number_symbol_key pointer">2</div>
                                    <div class="three number_symbol_key pointer">3</div>

                                    <!--row -->
                                    <div class="zero number_symbol_key pointer">0</div>
                                    <div class="period number_symbol_key pointer">.</div>
                                    <div class="comma number_symbol_key pointer">,</div>
                                    <div class="clear custom_symbol_key pointer">


                                </div>  
                            </div>

                        </div>
                    <!--place new one here?-->  
                                  <div id="full_keypad_g1to2" style="visibility:hidden;">
                                  <div class= "dragbar">


                                  </div>
                                  <div data-id="0"  class="closebutton pointer" ></div>

                                  <div class= "display_and_pad">

                                    <div class= "displaywindow" >




                                    <div data-id="0" class="display" ></div>



                                    <div class="fractionholder">    

                                        <div data-id="0" class="topfraction"   data-htmlarray= "" ></div>
                                        <!-- faked line --> 
                                        <div style="left:0px;top:22px;height:1px;width:146px;position:absolute;background-color: #000000"></div>
                                        <div data-id="0" class="botfraction"   data-htmlarray= "" ></div>
                                    </div>
                                        <div class="blinkingcursor"></div>

                                    </div>

                                        <div class="one number_symbol_key pointer group123">1</div>
                                        <div class="two number_symbol_key pointer group123">2</div>
                                        <div class="three number_symbol_key pointer group123">3</div>
                                        <div class="four number_symbol_key pointer group123">4</div>
                                        <div class="five number_symbol_key pointer group123">5</div>
                                        <div class="six number_symbol_key pointer group123">6</div>
                                        <div  class="seven number_symbol_key pointer group123">7</div>
                                        <div  class="eight number_symbol_key pointer group123">8</div>
                                        <div  class="nine number_symbol_key pointer group123">9</div>
                                        <div class="zero number_symbol_key pointer group123">0</div>
                                        <div class="clear custom_symbol_key pointer"></div>
                                        <div  class="backspace custom_symbol_key pointer"></div>

                                        <div class="plus number_symbol_key pointer group123">&#43</div>
                                        <div class="minus number_symbol_key pointer group123">&#8722</div>
                                        <div class="equal number_symbol_key pointer group123">&#61</div>    
                                        <div class="less_than number_symbol_key pointer group123">&#60</div>
                                        <div class="greater_than number_symbol_key pointer group123">&#62</div>
                                        <div  class="dollar number_symbol_key pointer group123 disableforfractions">$</div>
                                        <div  class="cent number_symbol_key pointer group123 disableforfractions">&#162</div>
                                        <div class="fahrenheit number_symbol_key pointer group123  disableforfractions">&#8457</div>
                                        <div class="celsius number_symbol_key pointer group123  disableforfractions">&#8451</div>
                                        <div class="enter enter_key pointer nodrag" style="visibility:hidden" ></div>   
                                        <div class="shift_key left_shift_key pointer nodrag" style="opacity:0.3" ></div>    
                                        <div class="shift_key right_shift_key pointer nodrag" style="opacity:0.3" ></div>   

                                        <div class="colon number_symbol_key pointer group123" >&#58</div>   
                                        <div class="apostrophe number_symbol_key pointer group123" >&#39</div>  
                                        <div class="comma number_symbol_key pointer group123" >,</div>  
                                        <div class="period number_symbol_key pointer group123" >.</div>
                                        <div class="hyphen number_symbol_key pointer group123" >&#45</div>  
                                        <div class="question_mark number_symbol_key pointer group123" >&#63</div>   
                                        <div class="make_fraction custom_symbol_key pointer group123" ></div>



                                        <div class="keys_to_show abc123_button_right pointer" ></div>   
                                        <div class="keys_to_show abc123_button_left pointer" ></div>    
                                        <div class="space space_key pointer nodrag" >space</div>


                                        <!--  ***************************************************************************************************************-->
                                        <div class="letter_q alphabet_key pointer groupABC" >q</div>

                                        <div class="letter_w alphabet_key pointer groupABC" >w</div>

                                        <div class="letter_e alphabet_key pointer groupABC" >e</div>

                                        <div class="letter_r alphabet_key pointer groupABC" >r</div>

                                        <div class="letter_t alphabet_key pointer groupABC" >t</div>

                                        <div class="letter_y alphabet_key pointer groupABC" >y</div>

                                        <div class="letter_u alphabet_key pointer groupABC" >u</div>

                                        <div class="letter_i alphabet_key pointer groupABC" >i</div>

                                        <div class="letter_o alphabet_key pointer groupABC" >o</div>

                                        <div class="letter_p alphabet_key pointer groupABC" >p</div>

                                        <!--  ***************************************************************************************************************-->
                                        <div class="letter_a alphabet_key pointer groupABC" >a</div>

                                        <div class="letter_s alphabet_key pointer groupABC" >s</div>

                                        <div class="letter_d alphabet_key pointer groupABC" >d</div>

                                        <div class="letter_f alphabet_key pointer groupABC" >f</div>

                                        <div class="letter_g alphabet_key pointer groupABC" >g</div>

                                        <div class="letter_h alphabet_key pointer groupABC" >h</div>

                                            <div class="letter_j alphabet_key pointer groupABC" >j</div>

                                        <div class="letter_k alphabet_key pointer groupABC" >k</div>

                                        <div class="letter_l alphabet_key pointer groupABC" >l</div>




                                            <div class="letter_z alphabet_key pointer groupABC" >z</div>

                                        <div class="letter_x alphabet_key pointer groupABC" >x</div>

                                            <div class="letter_c alphabet_key pointer groupABC" >c</div>

                                    <div class="letter_v alphabet_key pointer groupABC" >v</div>

                                        <div class="letter_b alphabet_key pointer groupABC" >b</div>

                                            <div class="letter_n alphabet_key pointer groupABC" >n</div>

                                    <div class="letter_m alphabet_key pointer groupABC" >m</div>





                                        <!--  ***************************************************************************************************************-->





                                    </div>
        </div>
        <!-- END Keypad 2 -->

    <!-- END Keypads -->
    
</div>

<br><br>

<script type="text/javascript" charset="utf-8">
    
    // Page embed wrapper
    // <div data-template="em02" data-iteration="0001" data-layout="A" data-id="0">
    //      <div class="content"></div>
    // </div>
    var console_on = false;
    //var template = '';
    var sucess_check = '';
    var template_name = '';
    var jsonLoad = '';
    var JSONObject = {};
    var formArr = [];
    var layoutArr = [];
    var contentArr = [];
    var formBuild = [];
    var formSetup = ''; 
    var defult_build = '';
    var defult_values = '';
    var new_values = '';
    var hint_values = '';
    var directions_values = '';
    var play_button_values = '';
    var cover_values = '';
    var move_object_values = '';
    var dragndrop_setup_values = '';
    var drop_object_values = '';
    var drag_object_values = '';
    var feedback_values = '';
    var parameter_values = '';
    var answer_values = [];
    var highlight_object_values = [];
    var type_object_values = [];
    var select_object_values = [];
    var image_object_values = [];
    var shading_object_values = [];
    var numberline_object_values = [];
    var question_values = [];
    var custom_feedback_values = [];
    var title_array = [];
    var content_box_array = [];
    var tooltip_array = [];
    var hint_array = [];
    var directions_array = [];
    var play_button_array = [];
    var cover_array = [];
    var move_object_array = [];
    var dragndrop_setup_array = [];
    var drop_object_array = [];
    var drag_object_array = [];
    var question_array = [];
    var answer_array = [];
    var highlight_object_array = [];
    var type_object_array = [];
    var select_object_array = [];
    var image_object_array = [];
    var shading_object_array = [];
    var numberline_object_array = [];
    var feedback_type = "";
    var feedback_array = [];
    var feedback_correct_array = [];
    var feedback_incorrect_array = [];
    var feedback_not_all_correct_array = [];
    var feedback_one_wrong_array = [];
    var feedback_some_wrong_array = [];
    var feedback_all_wrong_array = [];
    var feedback_last_attempt_array = [];
    var custom_feedback_array = [];
    var file_parent = '';
    var file_parent_id = '';
    var file_selector = '';
    var markerCode = '';
    var markerHTML = '';
    var snapGrid = 1;
    var set_font_size = 0;
    
    var audioObject = {};
    var linksObject = {};
    var list_attempts = '';
    var sfx_sounds = [];
    var vo_sounds = [];
    var vo_text = [];
    var soundData = {};
    var allowed_attempts = '';
    var feedback_type = '';
    var new_layout = 'A';
    
    var _field_count = 0;
    
    // zzzz cange name from app to soming more specific
    // formJS object literal to namspace form envents and functions
    var LO_page_app = {

        onReady: function() {
        
            if ( console_on == true ) { console.log('onReady'); }
            
            $(".show_form").click( LO_page_app.formScreenDown );
            $(".hide_form").click( LO_page_app.formScreenUp );
            $(".change_font_size").click( LO_page_app.change_font_size );
            $(".show_hint").click( page_builder_app.show_hint );
            $(".show_directions").click( page_builder_app.show_directions );
                        
            $('.edit_mode').on( "keyup change", LO_page_app.change_mode );
            $('.snap_to').on( "keyup change", LO_page_app.change_snap_to );
            
            // $.fn.tipsy.autoWE
            
            //$(".save_to_cms").click( LO_page_app.save_to_cms );
                
            // Get default_audio feedback definitions
            $.ajax({
                type: 'GET',
                url: 'templates/'+template+'/feedback/default_audio.json',
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                cache: false,
                success: LO_page_app.readFeedbackJSON,
                error: function() {
                    //alert('error');
                }
            });
            //Builds links to other templates to switch easily -- for dev use
            //$.ajax({
            //    type: 'POST',
            //    url: 'php/linkCreator.php',
            //    contentType: 'application/json; charset=utf-8',
            //    dataType: "json",
            //    cache: false,
            //    success: LO_page_app.readLinksJSON,
            //    error: function(err) {
            //        window.ERRORS = err;
            //    }
            //});
            
            // Get iteration JSON
            setTimeout(function() {
                $.ajax({
                    type: 'GET',
                    url: media_path + entryPoint,
                    contentType: 'application/json; charset=utf-8',
                    dataType: "json",
                    cache: false,
                    statusCode: {
                        404: function() {
                            //alert('404');
                        }
                    },
                    success: LO_page_app.assignJson,
                    error: function() {
                        jsonLoad = 'new';
                        // zzz get from portal page...
                        LO_page_app.defineTypes(template);
                        LO_page_app.setup();
                    }
                });
            }, 1000);
                            
        },
        
        defineTypes: function( template ) {
            
            if ( console_on == true ) { console.log('defineTypes'); }
                        
            // Define Defults
            defult_build = ['title', 'content_box', 'answer' ]; //'question', 'answer', 'help', 'solution', 'feedback', 'parameter', 'media'
            defult_values = '{"id": "0", "type": "txt", "name": "", "text": "", "top": "default", "left": "default", "width": "default"}';
            new_values = '{"id": "0"}';
            //feedback_group = ['attempts', 'feedback_type', 'feedback_correct', 'feedback_incorrect', 'feedback_not_all_correct', 'feedback_one_wrong', 'feedback_some_wrong', 'feedback_all_wrong', 'feedback_last_attempt', 'custom_feedback'];
            feedback_values = ['name', 'text'];
            type_object_values = ['text', 'size', 'aid', 'source', 'output']; 
            select_object_values = ['text','correct', 'size', 'aid']; 
            image_object_values = ['align'];
            hint_values = ['active']; 
            directions_values = ['active'];
            cover_values = ['width', 'height', 'direction']; 
            custom_feedback_values = ['first_attempt']; 
                        
            // JSON Definitions 
            switch(template)
            {
            case 'em01': // Static 
              template_name = 'Static';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'type_object', 'select_object', 'image_object', 'hint', 'directions', 'play_button', 'tooltip', 'cover'];
              break;
            case 'em02': // Multiple Choice
              template_name = 'Multiple Choice';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'marker', 'answer', 'type_object', 'select_object', 'image_object', 'hint', 'directions', 'play_button', 'tooltip', 'cover', 'attempts', 'feedback_type', 'feedback_correct', 'feedback_incorrect', 'feedback_not_all_correct', 'feedback_one_wrong', 'feedback_some_wrong', 'feedback_all_wrong', 'feedback_last_attempt', 'custom_feedback'];
              answer_values = ['correct','aid']; 
              break;
            case 'em03': // Type Entry
              template_name = 'Type Entry';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'type_object', 'select_object', 'image_object', 'hint', 'directions', 'play_button', 'tooltip', 'cover', 'attempts', 'feedback_type', 'feedback_correct', 'feedback_incorrect', 'feedback_not_all_correct', 'feedback_one_wrong', 'feedback_some_wrong', 'feedback_all_wrong', 'feedback_last_attempt', 'custom_feedback'];
              break;
            case 'em04': // Matching
              template_name = 'Matching';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'marker', 'question', 'answer', 'type_object', 'select_object', 'image_object', 'hint', 'directions', 'play_button', 'tooltip', 'cover', 'attempts', 'feedback_correct', 'feedback_incorrect', 'feedback_last_attempt', 'custom_feedback'];
              question_values = ['pairid','qid'];
              answer_values = ['pairid','aid'];
              break;
            case 'em05': // Sequencing
              template_name = 'Sequencing';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'answer', 'type_object', 'select_object', 'image_object', 'hint', 'directions', 'play_button', 'tooltip', 'cover', 'attempts', 'feedback_correct', 'feedback_incorrect', 'feedback_last_attempt', 'custom_feedback'];
              answer_values = ['aid'];
              break;
            case 'em06': // Drag-N-Drop - Sorting
              template_name = 'Drag -N- Drop';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'dragndrop_setup', 'drop_object', 'drag_object', 'type_object', 'select_object', 'image_object', 'hint', 'directions', 'play_button', 'tooltip', 'cover', 'attempts', 'feedback_correct', 'feedback_incorrect', 'feedback_last_attempt', 'custom_feedback'];
              dragndrop_setup_values = ['type', 'unique', 'restrict'];
              drop_object_values = ['width', 'height', 'border_style', 'drag_array', 'value']; 
              drag_object_values = ['count', 'value'];
              break;
            case 'em07': // Shading
              template_name = 'Shading';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'shading_object', 'type_object', 'select_object', 'image_object', 'hint', 'directions', 'play_button', 'tooltip', 'cover', 'attempts', 'feedback_correct', 'feedback_incorrect', 'feedback_last_attempt', 'custom_feedback'];
              shading_object_values = ['rows','rows_x','columns','columns_x','border_style', 'show_labels', 'label_start_at', 'red_check','red_value','red_array','blue_check','blue_value','blue_array','green_check','green_value','green_array','yellow_check','yellow_value','yellow_array','multiple_cell']; 
              break;
            case 'em08': // Movable Objects
              template_name = 'Movable Objects';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'type_object', 'select_object', 'image_object', 'hint', 'directions', 'play_button', 'tooltip', 'cover', 'move_object'];
              move_object_values = ['count'];
              break;
            
            //PS
            case 'ps01': // Highlighter
              template_name = 'Highlighter';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'highlight_object'];
              highlight_object_values = ['text','correct','aid']; 
              break;
              
            case 'ps02': // Shading
              template_name = 'Shading';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'shading_object', 'image_object'];
              shading_object_values = ['rows','rows_x','columns','columns_x','border_style', 'show_labels', 'label_start_at', 'red_check','red_value','red_array','blue_check','blue_value','blue_array','green_check','green_value','green_array','yellow_check','yellow_value','yellow_array','multiple_cell']; 
              break; 
              
            case 'ps03': // Type Entry
              template_name = 'Type Entry';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'image_object'];
              break;              
              
            case 'ps04': // Drag-N-Drop
              template_name = 'Drag -N- Drop';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'dragndrop_setup', 'drop_object', 'drag_object', 'image_object'];
              dragndrop_setup_values = ['type', 'unique', 'restrict'];
              drop_object_values = ['width', 'height', 'border_style', 'drag_array', 'value']; 
              drag_object_values = ['count', 'value'];
              break;
            case 'ps05': // Numberline
              template_name = 'Number Line';
              formSetup = ['template', 'iteration', 'layout', 'grades', 'title', 'content_box', 'numberline_object'];
              numberline_object_values =  JSONObject.numberline_object != undefined ? JSONObject.numberline_object[0] : {
                  "id":0,
                  "top":300,
                  "left":45,
                  "width":500,
                  "lineColor": "#000",
                  "hlColor":"#ff0000",
                  "lineLength": 450,
                  "ticks_vals": ",,,1/2,1,,,2.5,,3,,,",
                  "ticks_left": "arrow",
                  "ticks_right": "arrow",
                  "ticks_width": 3,
                  "ticks_height": 10,
                  "ticks_labelColor": "#000",
                  "ticks_labelSize": 15,
                  "ticks_color": "#000"
              };

              break;
              
            }
            
            LO_page_app.setupLayout();
            //$('head').prepend('<link rel="stylesheet" type="text/css" href="templates/' + template + '/css/styles.css">');                                
            $('#build_iteration').append( template_name );

        },

        
        change_font_size: function( event ) {
            
            if ( console_on == true ) { console.log('change_font_size'); }
            
            $('.change_font_size.active').removeClass('active');
            $(this).addClass('active');
            
            $.font_value = $(this).attr('id');  
            
            switch($.font_value)
            {
            case 'font_a':
              set_font_size = 0;
              JSONObject.font_size = set_font_size;
              break;
            case 'font_aa':
              set_font_size = 1;
              JSONObject.font_size = set_font_size;
              break;
            case 'font_aaa':
              set_font_size = 2;
              JSONObject.font_size = set_font_size;
              break;
            }
            
            /// zzzzz Update JSON
            
            page_builder_app.pageBuilder();
            LO_page_app.pageEditor();           
            
        },
        
        change_mode: function( event ) {
            
            if ( console_on == true ) { console.log('change_mode'); }
            
            $.mode_value = $(this).val();       
            mode = $.mode_value;
            
            if ( mode == 'edit' ) {
                if ( typeof JSONObject.layout !== 'undefined' ) {
                    JSONObject.layout = new_layout;
                    $('#wrapper').css('background', 'url(templates/'+template+'/images/ib_layout_thumbs/Layout_'+new_layout+'_guide.png) no-repeat top left');
                }   
            } else {
                if ( typeof JSONObject.layout !== 'undefined' ) {
                    JSONObject.layout = new_layout;
                    $('#wrapper').css('background', 'none');
                }
            }
            
            page_builder_app.pageBuilder();
            LO_page_app.pageEditor();           
            
        },

        change_snap_to: function( event ) {
            
            if ( console_on == true ) { console.log('change_snap_to'); }
            
            $.snap_value = $(this).val();           
            snapGrid = $.snap_value;
            
            page_builder_app.pageBuilder();
            LO_page_app.pageEditor();           
            
        },
            
        setupLayout: function( event ) {
            
            if ( console_on == true ) { console.log('setupLayout'); }
            
            layoutArr = [];
            
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_A.png" class="setlayout" data-layout="A">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_B.png" class="setlayout" data-layout="B">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_C.png" class="setlayout" data-layout="C">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_D.png" class="setlayout" data-layout="D">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_E.png" class="setlayout" data-layout="E">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_F.png" class="setlayout" data-layout="F">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_G.png" class="setlayout" data-layout="G">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_H.png" class="setlayout" data-layout="H">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_I.png" class="setlayout" data-layout="I">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_J.png" class="setlayout" data-layout="J">';
            layoutArr += '<img src="templates/'+template+'/images/ib_layout_thumbs/Layout_K.png" class="setlayout" data-layout="K">';
            
            layoutArr += '<div class="revertLayout">Reset to Layout</div>';
            layoutArr += '<div class="hideLayout">Hide</div>';
            layoutArr += '<div class="showLayout">Show</div>';
            
            $(".layout_tab").append(layoutArr);
            
            $(".setlayout").click( LO_page_app.changeLayout );
            $(".revertLayout").click( LO_page_app.revertLayout );
            $(".showLayout").click( LO_page_app.showLayout );
            $(".hideLayout").click( LO_page_app.hideLayout );
            
        },
        
        revertLayout: function( event ) {
                        
            if ( console_on == true ) { console.log('revertLayout'); }
            
            if ( typeof JSONObject.title !== 'undefined' ) {                
                $.each( JSONObject.title, function( index, value ) { 
                    JSONObject.title[index].top = 'default';
                    JSONObject.title[index].left = 'default';
                }); 
            }
            
            if ( typeof JSONObject.content_box !== 'undefined' ) {
                $.each( JSONObject.content_box, function( index, value ) { 
                    JSONObject.content_box[index].top = 'default';
                    JSONObject.content_box[index].left = 'default';
                });
            }
            
            if ( typeof JSONObject.tooltip !== 'undefined' ) {
                $.each( JSONObject.tooltip, function( index, value ) { 
                    JSONObject.tooltip[index].top = 'default';
                    JSONObject.tooltip[index].left = 'default';
                });
            }
            
            if ( typeof JSONObject.question !== 'undefined' ) {
                $.each( JSONObject.question, function( index, value ) { 
                    JSONObject.question[index].top = 'default';
                    JSONObject.question[index].left = 'default';
                });
            }
            
            if ( typeof JSONObject.answer !== 'undefined' ) {
                $.each( JSONObject.answer, function( index, value ) { 
                    JSONObject.answer[index].top = 'default';
                    JSONObject.answer[index].left = 'default';
                });
            }
            
            if ( typeof JSONObject.drop_object !== 'undefined' ) {
                $.each( JSONObject.drop_object, function( index, value ) { 
                    JSONObject.drop_object[index].top = 'default';
                    JSONObject.drop_object[index].left = 'default';
                });
            }
            
            if ( typeof JSONObject.cover !== 'undefined' ) {
                $.each( JSONObject.cover, function( index, value ) { 
                    JSONObject.cover[index].top = 'default';
                    JSONObject.cover[index].left = 'default';
                });
            }
            
            page_builder_app.pageBuilder();
            LO_page_app.pageEditor();           
            //console.log(JSON.stringify(JSONObject, null, '\t'));
            
            // $('.title, .content_box, .question, .answer').removeAttr( "style" );
            // $('.title, .content_box, .question, .answer').css( "position", "static" );
                        
        },
        
        hideLayout: function( event ) { 
            
            if ( console_on == true ) { console.log('hideLayout'); }
                    
            $('.hideLayout, .setlayout').hide();
            $('.showLayout').show();
        },
        
        showLayout: function( event ) {
            
            if ( console_on == true ) { console.log('showLayout'); }
            
            $('.hideLayout, .setlayout').show();
            $('.showLayout').hide();
        },
        
        changeLayout: function( event ) {
            
            if ( console_on == true ) { console.log('changeLayout'); }
                                    
            new_layout = $(this).attr('data-layout');           
            layout_selector = '#content[data-layout="'+new_layout+'"]';
            
            if ( typeof JSONObject.layout !== 'undefined' ) {
                JSONObject.layout = new_layout;
                $('#wrapper').css('background', 'url(templates/'+template+'/images/ib_layout_thumbs/Layout_'+new_layout+'_guide.png) no-repeat top left');
            }   
            
            $(layout_selector).attr('data-layout', new_layout);
            
            // Run pageBuilder when you click layout...
            page_builder_app.pageBuilder();
            LO_page_app.pageEditor();           
            
            $('.layout_tab .setlayout.active').removeClass('active');
            $('.layout_tab .setlayout[data-layout="'+new_layout+'"]').addClass('active');
                                    
        },
        
        changeMarker: function( event ) {
            
            if ( console_on == true ) { console.log('changeMarker'); }
            
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
            
            // Run formBuilder when you chage marker
            //LO_page_app.formBuilder();
                                
        },
        
        assignJson: function( data ) {
            
            if ( console_on == true ) { console.log('assignJson'); }
                        
            JSONObject = data;
            
            template = JSONObject.template;
            
            //This needs to happen first
            LO_page_app.defineTypes(template);
                        
            if ( typeof JSONObject.layout !== 'undefined' ) {
                
                $.setLayout = JSONObject.layout;
                $('.layout_tab .setlayout.active').removeClass('active');
                $('.layout_tab .setlayout[data-layout="'+$.setLayout+'"]').addClass('active');
                
                new_layout = JSONObject.layout; 
                $('#wrapper').css('background', 'url(templates/'+template+'/images/ib_layout_thumbs/Layout_'+new_layout+'_guide.png) no-repeat top left');
            }
            
            $.setFontSize = JSONObject.font_size;           
            $('.change_font_size.active').removeClass('active');
            switch($.setFontSize)
            {
            case 0:
              $('#font_a').addClass('active');
              break;
            case 1:
              $('#font_aa').addClass('active');
              break;
            case 2:
              $('#font_aaa').addClass('active');
              break;
            }
            
            LO_page_app.changeMarker();
            LO_page_app.formBuilder();          
            
            $(".show_form").click( LO_page_app.formBuilder );
            
            if ( typeof JSONObject.title !== 'undefined' ) {
                $.each( JSONObject.title, function( index, value ) { 
                    title_array.push(value);
                });
            }           
            
            if ( typeof JSONObject.content_box !== 'undefined' ) {
                $.each( JSONObject.content_box, function( index, value ) { 
                    content_box_array.push(value);
                });
            }
            
            if ( typeof JSONObject.tooltip !== 'undefined' ) {
                $.each( JSONObject.tooltip, function( index, value ) { 
                    tooltip_array.push(value);
                });
            }
            
            if ( typeof JSONObject.move_object !== 'undefined' ) {
                $.each( JSONObject.move_object, function( index, value ) { 
                    move_object_array.push(value);
                });
            }
            
            if ( typeof JSONObject.dragndrop_setup !== 'undefined' ) {
                $.each( JSONObject.dragndrop_setup, function( index, value ) { 
                    dragndrop_setup_array.push(value);
                });
            }
            
            if ( typeof JSONObject.drop_object !== 'undefined' ) {
                $.each( JSONObject.drop_object, function( index, value ) { 
                    drop_object_array.push(value);
                });
            }
            
            if ( typeof JSONObject.cover !== 'undefined' ) {
                $.each( JSONObject.cover, function( index, value ) { 
                    cover_array.push(value);
                });
            }
            
            if ( typeof JSONObject.drag_object !== 'undefined' ) {
                $.each( JSONObject.drag_object, function( index, value ) { 
                    drag_object_array.push(value);
                });
            }
            
            if ( typeof JSONObject.question !== 'undefined' ) {
                $.each( JSONObject.question, function( index, value ) { 
                    question_array.push(value);
                });
            }       
            
            if ( typeof JSONObject.answer !== 'undefined' ) {
                $.each( JSONObject.answer, function( index, value ) { 
                    answer_array.push(value);
                });
            }
            
            if ( typeof JSONObject.highlight_object !== 'undefined' ) {
                $.each( JSONObject.highlight_object, function( index, value ) { 
                    highlight_object_array.push(value);
                });
            }
            
            if ( typeof JSONObject.type_object !== 'undefined' ) {
                $.each( JSONObject.type_object, function( index, value ) { 
                    type_object_array.push(value);
                });
            }
            
            if ( typeof JSONObject.select_object !== 'undefined' ) {
                $.each( JSONObject.select_object, function( index, value ) { 
                    select_object_array.push(value);
                });
            }
            
            if ( typeof JSONObject.image_object !== 'undefined' ) {
                $.each( JSONObject.image_object, function( index, value ) { 
                    image_object_array.push(value);
                });
            }
            
            if ( typeof JSONObject.hint !== 'undefined' ) {
                $.each( JSONObject.hint, function( index, value ) { 
                    hint_array.push(value);
                });
            }
            if ( typeof JSONObject.shading_object !== 'undefined' ) {
                $.each( JSONObject.shading_object, function( index, value ) { 
                    shading_object_array.push(value);
                });
            }
            
            if ( typeof JSONObject.numberline_object !== 'undefined' ) {
                $.each( JSONObject.numberline_object, function( index, value ) { 
                    numberline_object_array.push(value);
                });
            }
            if ( typeof JSONObject.directions !== 'undefined' ) {
                $.each( JSONObject.directions, function( index, value ) { 
                    directions_array.push(value);
                });
            }
            
            if ( typeof JSONObject.play_button !== 'undefined' ) {
                $.each( JSONObject.play_button, function( index, value ) { 
                    play_button_array.push(value);
                });
            }
            
            // if ( typeof JSONObject.content_box !== 'undefined' ) {
            //              $.each( JSONObject.content_box, function( index, value ) { 
            //                  content_box_array.push(value);
            //              });
            //          }
            
            if ( typeof JSONObject.feedback_correct !== 'undefined' ) {
                $.each( JSONObject.feedback_correct, function( index, value ) { 
                    feedback_correct_array.push(value);
                });
            }
            
            if ( typeof JSONObject.feedback_incorrect !== 'undefined' ) {
                $.each( JSONObject.feedback_incorrect, function( index, value ) { 
                    feedback_incorrect_array.push(value);
                });
            }
            
            if ( typeof JSONObject.feedback_not_all_correct !== 'undefined' ) {
                $.each( JSONObject.feedback_not_all_correct, function( index, value ) { 
                    feedback_not_all_correct_array.push(value);
                });
            }
            
            if ( typeof JSONObject.feedback_one_wrong !== 'undefined' ) {
                $.each( JSONObject.feedback_one_wrong, function( index, value ) { 
                    feedback_one_wrong_array.push(value);
                });
            }
            
            if ( typeof JSONObject.feedback_some_wrong !== 'undefined' ) {
                $.each( JSONObject.feedback_some_wrong, function( index, value ) { 
                    feedback_some_wrong_array.push(value);
                });
            }
            
            if ( typeof JSONObject.feedback_all_wrong !== 'undefined' ) {
                $.each( JSONObject.feedback_all_wrong, function( index, value ) { 
                    feedback_all_wrong_array.push(value);
                });
            }
            
            if ( typeof JSONObject.feedback_last_attempt !== 'undefined' ) {
                $.each( JSONObject.feedback_last_attempt, function( index, value ) { 
                    feedback_last_attempt_array.push(value);
                });
            }
                        
            if ( typeof JSONObject.custom_feedback !== 'undefined' ) {
                $.each( JSONObject.custom_feedback, function( index, value ) { 
                    custom_feedback_array.push(value);
                });
            }
        },
        
        setup: function( event ) {
            
            if ( console_on == true ) { console.log('setup'); }
            
            // Enitial JSON build
            $.each( formSetup, function( index, value ) { 
                LO_page_app.buildJSON( value, 0 ); // peramiters (block_type, block_id)
            });
            
            LO_page_app.presets();
            
            LO_page_app.formBuilder();
            $(".show_form").click( LO_page_app.formBuilder );
                                        
        },
        
        select_type : function( event ) { 
            
            if ( console_on == true ) { console.log('select_type'); }
            
            select_type = $(this).val();
            select_parent = $(this).parent().attr('data-name');
            select_parent_id = $(this).parent().attr('data-id');
            select_selector = '.in_block[data-name="' + select_parent + '"].in_block[data-id="' + select_parent_id + '"]';
            
            // Write JSON
            JSONObject[select_parent][select_parent_id]['type'] = select_type;
                                        
            switch(select_type)
            {
            case 'txt':
              $(select_selector + ' .block_hide').hide();
              $(select_selector + ' .block_show').show();
              $(select_selector + ' .form_image').hide();
              break;
            case 'img':
              $(select_selector + ' .block_hide').hide();
              $(select_selector + ' .block_show').show();
              $(select_selector + ' .form_image').show();
              break;
            case 'hide':
              $(select_selector + ' .block_hide').show();
              $(select_selector + ' .block_show').hide();
              $(select_selector + ' .form_image').hide();
              break;
            }
            
        },
        
        feedback_type : function( event ) { 
            
            if ( console_on == true ) { console.log('feedback_type'); }
            
            feedback_type = $(this).val();
            
            //console.log(feedback_type);
                        
            switch(feedback_type)
            {
            case 'single':
              $('.multiple').hide();
              $('.single').show();
              break;
            case 'multiple':
              $('.single').hide();
              $('.multiple').show();
              break;
            }
                                
        },
        
        presets: function( event ) {
            
            if ( console_on == true ) { console.log('presets'); }
            
            JSONObject.template = template;
            //JSONObject.iteration = iteration;
            JSONObject.layout = 'A';
            $('#font_aa').addClass('active');
            
            
            JSONObject.font_size = '1';

            if ( typeof JSONObject.marker !== 'undefined' ) {
                JSONObject.marker = '0';
            }
            
            if ( typeof JSONObject.attempts !== 'undefined' ) {
                JSONObject.attempts = '5';
            }
            
            if ( typeof JSONObject.grades !== 'undefined' ) {
                JSONObject.grades = 'lower';
            }
            
            if ( typeof JSONObject.feedback_type !== 'undefined' ) {
                JSONObject.feedback_type = 'single';
            }
            
            //console.log(JSON.stringify(JSONObject, null, '\t'));
            
        },
        
        setid: function( block_type, block_id ) {
            
            if ( console_on == true ) { console.log('setid'); }
                        
            if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                if ( typeof JSONObject[block_type][block_id].id !== 'undefined' ) { 
                    JSONObject[block_type][block_id].id = block_id;
                }
            }
            
        },
    
// buildJSON   : builds JSON structure 
// destroyJSON : remove block of JSON run LO_page_app.setid
// formBuilder : builds form fields from JSON cotnent
// updateJSON  : update JSON structure on keyup - make dynamic
// pageBuilder : builds html on the page from JSON cotnent - this will also be used in template player                  
        
        //buildJSON : builds JSON structure 
        buildJSON: function( block_type, block_id ) {           
            
            if ( console_on == true ) { console.log('buildJSON'); }
                                                
            JSONObject[block_type] = {};
            
            // Build Block Types 
            switch(block_type)
            {
            case 'title': 
                //
                JSONObject[block_type] = title_array;
                title_array.push(JSON.parse(defult_values));

                LO_page_app.setid( block_type, block_id );

                break;
            case 'content_box': 
                //
                JSONObject[block_type] = content_box_array;
                content_box_array.push(JSON.parse(defult_values));

                LO_page_app.setid( block_type, block_id );

                break;
            case 'tooltip': 
                //
                JSONObject[block_type] = tooltip_array;
                tooltip_array.push(JSON.parse(defult_values));

                LO_page_app.setid( block_type, block_id );

                break;  
                
            case 'cover': 
                //
                JSONObject[block_type] = cover_array;
                cover_array.push(JSON.parse(defult_values));

                //add cover values 
                $.each( cover_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;
                                    
            case 'move_object': 
                //
                JSONObject[block_type] = move_object_array;
                move_object_array.push(JSON.parse(defult_values));
                
                //add custome object values 
                $.each( move_object_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });
                
                LO_page_app.setid( block_type, block_id );

                break;
            case 'dragndrop_setup': 
                //
                JSONObject[block_type] = dragndrop_setup_array;
                dragndrop_setup_array.push(JSON.parse(new_values)); 

                //add custome dragndrop_setup values 
                $.each( dragndrop_setup_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;      
            case 'drop_object': 
                //
                JSONObject[block_type] = drop_object_array;
                drop_object_array.push(JSON.parse(defult_values));
                
                //add custome object values 
                $.each( drop_object_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });
                
                LO_page_app.setid( block_type, block_id );

                break;                      
            case 'drag_object': 
                //
                JSONObject[block_type] = drag_object_array;
                drag_object_array.push(JSON.parse(defult_values));
                
                //add custome object values 
                $.each( drag_object_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });
                
                LO_page_app.setid( block_type, block_id );

                break;              
            case 'question': 
                //
                JSONObject[block_type] = question_array;
                question_array.push(JSON.parse(defult_values));
                
                //add custome question values 
                $.each( question_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });
                
                LO_page_app.setid( block_type, block_id );

                break;
            case 'answer': 
                //
                JSONObject[block_type] = answer_array;
                answer_array.push(JSON.parse(defult_values));   
                
                //add custome answer values 
                $.each( answer_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });
                
                LO_page_app.setid( block_type, block_id );

                break;  
            case 'highlight_object': 
                //
                JSONObject[block_type] = highlight_object_array;
                highlight_object_array.push(JSON.parse(new_values));    

                //add custome highlight_object values 
                $.each( highlight_object_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;      
            case 'type_object': 
                //
                JSONObject[block_type] = type_object_array;
                type_object_array.push(JSON.parse(new_values)); 

                //add custome type_object values 
                $.each( type_object_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;  
            case 'select_object': 
                //
                JSONObject[block_type] = select_object_array;
                select_object_array.push(JSON.parse(new_values));   

                //add custome select_object values 
                $.each( select_object_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;
            case 'image_object': 
                //
                JSONObject[block_type] = image_object_array;
                image_object_array.push(JSON.parse(defult_values)); 

                //add custome image_object values 
                $.each( image_object_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;
            case 'shading_object': 
                //
                JSONObject[block_type] = shading_object_array;
                shading_object_array.push(JSON.parse(defult_values));   

                //add custome shading_object values 
                $.each( shading_object_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;
            case 'numberline_object':
                JSONObject[block_type] = numberline_object_array;
                numberline_object_array.push(JSON.parse(defult_values));

                //add custom numberline_object values
                $.each( numberline_object_values, function( key, value ) { 
                    if (JSONObject[block_type][block_id] == undefined) {
                        JSONObject[block_type][block_id] = {};
                    }
                    JSONObject[block_type][block_id][key]=JSONObject[block_type][block_id][key]===undefined ? value : JSONObject[block_type][block_id][key];
                });

                LO_page_app.setid( block_type, block_id );
                break;
            case 'hint': 
                //
                JSONObject[block_type] = hint_array;
                hint_array.push(JSON.parse(defult_values));
                
                //add hint values 
                $.each( hint_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });
                
                LO_page_app.setid( block_type, block_id );

                break;  
            case 'directions': 
                //
                JSONObject[block_type] = directions_array;
                directions_array.push(JSON.parse(defult_values));

                //add directions values 
                $.each( directions_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;  
            case 'play_button': 
                //
                JSONObject[block_type] = play_button_array;
                play_button_array.push(JSON.parse(defult_values));

                //add play_button values 
                $.each( play_button_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;                                  
            case 'feedback_correct': 
                //
                JSONObject[block_type] = feedback_correct_array;
                feedback_correct_array.push(JSON.parse(new_values));    

                //add feedback_values values 
                $.each( feedback_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;  
            case 'feedback_incorrect': 
                //
                JSONObject[block_type] = feedback_incorrect_array;
                feedback_incorrect_array.push(JSON.parse(new_values));  

                //add feedback_values values 
                $.each( feedback_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;
                
            case 'feedback_not_all_correct': 
                //
                JSONObject[block_type] = feedback_not_all_correct_array;
                feedback_not_all_correct_array.push(JSON.parse(new_values));    

                //add feedback_values values 
                $.each( feedback_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;  
            case 'feedback_one_wrong': 
                //
                JSONObject[block_type] = feedback_one_wrong_array;
                feedback_one_wrong_array.push(JSON.parse(new_values));  

                //add feedback_values values 
                $.each( feedback_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;      
            case 'feedback_some_wrong': 
                //
                JSONObject[block_type] = feedback_some_wrong_array;
                feedback_some_wrong_array.push(JSON.parse(new_values)); 

                //add feedback_values values 
                $.each( feedback_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;
            case 'feedback_all_wrong': 
                //
                JSONObject[block_type] = feedback_all_wrong_array;
                feedback_all_wrong_array.push(JSON.parse(new_values));  

                //add feedback_values values 
                $.each( feedback_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;  
            case 'feedback_last_attempt': 
                //
                JSONObject[block_type] = feedback_last_attempt_array;
                feedback_last_attempt_array.push(JSON.parse(new_values));   

                //add feedback_values values 
                $.each( feedback_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;  
            case 'custom_feedback': 
                //
                JSONObject[block_type] = custom_feedback_array;
                custom_feedback_array.push(JSON.parse(new_values)); 

                //add custom_feedback_values 
                $.each( custom_feedback_values, function( index, value ) { 
                    if ( typeof JSONObject[block_type][block_id] !== 'undefined' ) {    
                        JSONObject[block_type][block_id][value] = "";
                    }
                });

                LO_page_app.setid( block_type, block_id );

                break;  
            }
        },
        
        //destroyJSON : remove block of JSON run LO_page_app.setid
        destroyJSON: function( block_type, block_id ) {
            
            if ( console_on == true ) { console.log('destroyJSON'); }
                                    
            JSONObject[block_type].splice(block_id, 1);
            
            $.each( JSONObject[block_type], function( index, value ) { 
                LO_page_app.setid( block_type , index );
            });
                    
            LO_page_app.formBuilder();
            
        },
        
        // formBuilder : builds form fields from JSON cotnent
        // run once after buildJSON
        // run when edit button is clicked 
        formBuilder: function( event ) {
            
            if ( console_on == true ) { console.log('formBuilder'); }
                        
            // Reset
            formArr = [];
            
            $("#new_form").replaceWith('<div id="formTEMP"></div>');
                                    
            // new form wrapper
            formArr += '<div id="new_form">';
            
                if ( JSONObject.template != 'em01' && JSONObject.template != 'em08' ) {
                    formArr += '<div id="auto_check">';

                        if ( JSONObject.auto_check == 'false' ) {
                            formArr +=  '<input type="checkbox" value="false" data-type="auto_check" checked> &nbsp;check if this iteration is <strong>only</strong> teacher assessed (open response).';
                        } else {
                            formArr +=  '<input type="checkbox" value="true" data-type="auto_check"> &nbsp;check if this iteration is <strong>only</strong> teacher assessed (open response).';
                        }               

                    formArr += '</div>';
                }
            
            // grades Block
            if ( typeof JSONObject.grades !== 'undefined' ) {
                
                $.gradesSelect = JSONObject.grades;
                
                formArr +=  '<!-- grades Block -->';            
                formArr +=  '<div id="form_grades" class="block">';
                formArr +=      '<strong>Grade:</strong> ';
                
                formArr +=      '<select id="grades" name="grades"  data-type="select" data-json-name="grades">';
                    if ( $.gradesSelect == 'lower' ) { formArr += '<option value="lower" selected>lower grades</option>'; } else { formArr += '<option value="lower">lower grades</option>'; }
                    if ( $.gradesSelect == 'mid' ) { formArr += '<option value="mid" selected>mid grades</option>'; } else { formArr += '<option value="mid">mid grades</option>'; }
                    if ( $.gradesSelect == 'upper' ) { formArr += '<option value="upper" selected>upper grades</option>'; } else { formArr += '<option value="upper">upper grades</option>'; }
                formArr +=      '</select>';
                formArr +=  '</div>';
                formArr +=  '<!-- END grades Block -->';    
            
            }   
            // END grades Block
            
            // Title Block
            formArr += '<!-- Title Block -->';
            formArr +=  '<div id="title" class="block">';

            formArr +=      '<strong>Title:</strong>';
            
            // Title Data   
            $.each(JSONObject.title, function(index) { 
                
                $.title_text = this.text;
                $.title_type = this.type;
                $.title_name = this.name;
                $.title_width = this.width;
                $.title_marker = index + 1;
                
                if ( $.title_width == '' ) {
                    $.title_width = "default"
                }
                
                LO_page_app.show_hide_type($.title_type)
            
                formArr +=  '<div class="in_block" data-name="title" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline;">'+$.title_marker+'.</div>';
                
                formArr +=      '<select name="title_type" class="select_type" data-type="select" data-json-name="type">';
                if ( $.title_type == 'txt') { formArr += '<option value="txt" selected>text</option>'; } else { formArr += '<option value="txt">text</option>'; }
                if ( $.title_type == 'img') { formArr += '<option value="img" selected>image</option>'; } else { formArr += '<option value="img">image</option>'; }
                if ( $.title_type == 'hide') { formArr += '<option value="hide" selected>hide</option>'; } else { formArr += '<option value="hide">hide</option>'; }
                formArr +=      '</select>';
                
                formArr +=  '&nbsp;&nbsp; Width: <input type="text" name="width" class="width" data-type="text" data-json-name="width" value="'+$.title_width+'" size="2"> <span class="small">( accepts numeric width or keyword <strong>default</strong> )</span>';
                
                formArr +=  '<div class="block_hide '+block_hide+'" style="color: #ccc; float: right; margin-right: 300px;">THIS BLOCK IS HIDDEN</div>';

                formArr +=  '<div class="block_show '+block_show+'">';

                formArr +=  '<div class="form_image '+form_image+'">';
                formArr +=  '<div class="select_images">';
                formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                formArr +=      '<span class="button">Choose File</span>';
                formArr +=      '<span class="val">'+$.title_name+'</span>';
                formArr +=  '</div><br>';
                formArr +=  'Image Description (not visible on the page)<br>';
                formArr +=  '</div>';
                
                formArr += '<textarea rows="2" cols="55" name="title" class="text" data-type="textarea" data-json-name="text">';
                formArr += $.title_text;
                formArr += '</textarea><br>';

                formArr += '</div>';
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END Title Block -->';                     
            // END Title Block
            
            // Content Box Block
            formArr += '<!-- Content Box Block -->';
            formArr +=  '<div id="content_box" class="block">';

            formArr +=      '<strong>Content Box:</strong>';
            
            // Content Box Data 
            $.each(JSONObject.content_box, function(index) { 
                
                $.content_box_text = this.text;
                $.content_box_type = this.type;
                $.content_box_name = this.name;
                $.content_box_width = this.width;
                $.content_box_marker = index + 1;
                
                if ( $.content_box_width == '' ) {
                    $.content_box_width = "default"
                }
                
                LO_page_app.show_hide_type($.content_box_type)
                
                formArr +=  '<div class="in_block" data-name="content_box" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline;">'+$.content_box_marker+'.</div> ';
                formArr +=      '<select name="content_box_type " class="select_type" data-type="select" data-json-name="type">';
                if ( $.content_box_type == 'txt') { formArr += '<option value="txt" selected>text</option>'; } else { formArr += '<option value="txt">text</option>'; }
                if ( $.content_box_type == 'img') { formArr += '<option value="img" selected>image</option>'; } else { formArr += '<option value="img">image</option>'; }
                if ( $.content_box_type == 'hide') { formArr += '<option value="hide" selected>hide</option>'; } else { formArr += '<option value="hide">hide</option>'; }
                formArr +=      '</select>';
                
                formArr +=  '&nbsp;&nbsp; Width: <input type="text" name="width" class="width" data-type="text" data-json-name="width" value="'+$.content_box_width+'" size="2"> <span class="small">( accepts numeric width or keyword <strong>default</strong> )</span>';
                
                formArr +=  '<div class="block_hide '+block_hide+'" style="color: #ccc; float: right; margin-right: 300px;">THIS BLOCK IS HIDDEN</div>';

                formArr +=  '<div class="block_show '+block_show+'">';

                formArr +=  '<div class="form_image '+form_image+'">';
                formArr +=  '<div class="select_images">';
                formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                formArr +=      '<span class="button">Choose File</span>';
                formArr +=      '<span class="val">'+$.content_box_name+'</span>';
                formArr +=  '</div><br>';
                formArr +=  'Image Description (not visible on the page)<br>';
                formArr +=  '</div>';

                formArr += '<textarea rows="2" cols="55" name="content_box" class="text" data-type="textarea" data-json-name="text">';
                formArr += $.content_box_text;
                formArr += '</textarea><br>';

                formArr += '</div>';
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END Content Box Block -->';                       
            // END Content Box Block
            
            // Move Object Block
            if ( typeof JSONObject.move_object !== 'undefined' ) {
                
                formArr += '<!-- Move Object Block -->';
                formArr +=  '<div id="move_object" class="block">';

                formArr +=      '<strong>Movable Object:</strong>';
            
                // Move Object Data 
                $.each(JSONObject.move_object, function(index) { 
                
                    $.move_object_text = this.text;
                    $.move_object_type = this.type;
                    $.move_object_name = this.name;
                    $.move_object_count = this.count;
                    $.move_object_width = this.width;
                    $.move_object_marker = index + 1;
                    
                    if ( $.move_object_width == '' ) {
                        $.move_object_width = "default"
                    }
                    
                    LO_page_app.show_hide_type($.move_object_type)
                
                    formArr +=  '<div class="in_block" data-name="move_object" data-id="'+index+'">';
                
                    if ( index > 0 ) {
                    formArr +=  '   <div class="remove">[ - ]</div>';
                    }
                
                    formArr +=  '<div style="display: inline;">'+$.move_object_marker+'.</div> ';
                    formArr +=      '<select name="move_object_type " class="select_type" data-type="select" data-json-name="type">';
                    if ( $.move_object_type == 'txt') { formArr += '<option value="txt" selected>text</option>'; } else { formArr += '<option value="txt">text</option>'; }
                    if ( $.move_object_type == 'img') { formArr += '<option value="img" selected>image</option>'; } else { formArr += '<option value="img">image</option>'; }
                    if ( $.move_object_type == 'hide') { formArr += '<option value="hide" selected>hide</option>'; } else { formArr += '<option value="hide">hide</option>'; }
                    formArr +=      '</select>';
                    
                    // Count
                    formArr +=  '<input type="text" name="count" class="count" data-type="text" data-json-name="count" value="'+$.move_object_count+'" size="1"><span class="small note">number of times object should appear</span>';
                    
                    formArr +=  '<br>';
                    
                    formArr +=  '&nbsp;&nbsp; Width: <input type="text" name="width" class="width" data-type="text" data-json-name="width" value="'+$.move_object_width+'" size="2"> <span class="small">( accepts numeric width or keyword <strong>default</strong> )</span>';
                    
                    formArr +=  '<div class="block_hide '+block_hide+'" style="color: #ccc; float: right; margin-right: 300px;">THIS BLOCK IS HIDDEN</div>';

                    formArr +=  '<div class="block_show '+block_show+'">';

                    formArr +=  '<div class="form_image '+form_image+'">';
                    formArr +=  '<div class="select_images">';
                    formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                    formArr +=      '<span class="button">Choose File</span>';
                    formArr +=      '<span class="val">'+$.move_object_name+'</span>';
                    formArr +=  '</div><br>';
                    formArr +=  'Image Description (not visible on the page)<br>';
                    formArr +=  '</div>';

                    formArr += '<textarea rows="2" cols="55" name="move_object" class="text" data-type="textarea" data-json-name="text">';
                    formArr += $.move_object_text;
                    formArr += '</textarea><br>';

                    formArr += '</div>';
                    formArr += '</div>';                
                });
            
                formArr += '<div class="in_block add_block">';
                formArr += '    <div class="add">Add [ + ]</div>';
                formArr += '</div>';
            
                formArr += '<span class="small tips">tips</span>';
            
                formArr +=  '</div>';
                formArr +=  '<!-- END Move Object Block -->';                       
            
            }
            // END Move Object Block
            
            // dragndrop_setup Block
            
            if ( typeof JSONObject.dragndrop_setup !== 'undefined' ) {
                
                formArr +=  '<!-- dragndrop_setup Block -->';           
                formArr +=  '<div id="form_dragndrop_setup" class="block">';
                formArr +=      '<strong>Drag -N- Drop Setup:</strong>';
                
                // dragndrop_setup Data 
                $.each(JSONObject.dragndrop_setup, function(index) { 
                
                    $.dragndrop_setup_type = this.type;
                    $.dragndrop_setup_unique = this.unique;
                    $.dragndrop_setup_restrict = this.restrict;
                    
                    formArr +=  '<div class="in_block" data-name="dragndrop_setup" data-id="'+index+'">';
                    
                    formArr +=      'Type <select name="dragndrop_setup_type " class="dragndrop_setup_type" data-type="select" data-json-name="type">';
                    if ( $.dragndrop_setup_type == 'id') { formArr += '<option value="id" selected>ID</option>'; } else { formArr += '<option value="id">ID</option>'; }
                    if ( $.dragndrop_setup_type == 'value') { formArr += '<option value="value" selected>Value</option>'; } else { formArr += '<option value="value">Value</option>'; }
                    if ( $.dragndrop_setup_type == 'id_value') { formArr += '<option value="id_value" selected>ID + Value</option>'; } else { formArr += '<option value="id_value">ID + Value</option>'; }
                    formArr +=      '</select>';        
                    
                    if ( typeof this.unique !== 'undefined' ) {
                    
                        if ( $.dragndrop_setup_unique == 'true' ) {
                            formArr +=  '&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="unique" class="unique" value="true" data-type="checkbox" data-json-name="unique" checked> Unique&nbsp;&nbsp;';
                        } else {
                            formArr +=  '&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="unique" class="unique" value="false" data-type="checkbox" data-json-name="unique"> Unique&nbsp;&nbsp;';
                        }
                    
                    }
                    
                    if ( typeof this.restrict !== 'undefined' ) {
                    
                        if ( $.dragndrop_setup_restrict == 'true' ) {
                            formArr +=  '&nbsp;&nbsp;<input type="checkbox" name="restrict" class="restrict" value="true" data-type="checkbox" data-json-name="restrict" checked> Restrict&nbsp;&nbsp;';
                        } else {
                            formArr +=  '&nbsp;&nbsp;<input type="checkbox" name="restrict" class="restrict" value="false" data-type="checkbox" data-json-name="restrict"> Restrict&nbsp;&nbsp;';
                        }
                    
                    }
                    
                    formArr +=  '</div>';
                                
                });
                
                formArr += '<span class="small tips">tips</span>';
                
                formArr +=  '</div>';
                formArr +=  '<!-- END dragndrop_setup Block -->';   
            
            }   
            // END dragndrop_setup Block
            
            // Drop Object Block
            if ( typeof JSONObject.drop_object !== 'undefined' ) {
                
                formArr += '<!-- Drop Object Block -->';
                formArr +=  '<div id="drop_object" class="block">';

                formArr +=      '<strong>Drop Object:</strong>';
            
                // Drop Object Data 
                $.each(JSONObject.drop_object, function(index) { 
                
                    $.drop_object_text = this.text;
                    $.drop_object_type = this.type;
                    $.drop_object_name = this.name;
                    $.drop_object_width = this.width;
                    $.drop_object_height = this.height;
                    $.drop_object_border_style = this.border_style;
                    $.drop_object_array = this.drag_array;
                    $.drop_object_value = this.value;
                    $.drop_object_graded = this.graded == undefined || this.graded == "true" ? "checked=" : "";
                    $.drop_object_marker = index + 1;
            
                    LO_page_app.show_hide_type($.drop_object_type)
                
                    formArr +=  '<div class="in_block" data-name="drop_object" data-id="'+index+'">';
                
                    if ( index > 0 ) {
                    formArr +=  '   <div class="remove">[ - ]</div>';
                    }
                
                    formArr +=  '<div style="display: inline;">'+$.drop_object_marker+'.</div> '; 
                    
                    formArr +=  'Graded: <input type="checkbox" name="graded" class="graded" value="true" data-type="checkbox" data-json-name="graded" '+$.drop_object_graded+'>&nbsp;';
                    formArr +=      'Size &nbsp;&nbsp; W: <input type="text" name="width" class="width" data-type="text" data-json-name="width" value="'+$.drop_object_width+'" size="1"> H: <input type="text" name="height" class="height" data-type="text" data-json-name="height" value="'+$.drop_object_height+'" size="1">';
                    
                    //  select          "border_style": "",
                    formArr +=      '&nbsp;&nbsp;&nbsp;&nbsp;Border Style <select name="border_style " class="border_style" data-type="select" data-json-name="border_style">';
                    if ( $.drop_object_border_style == 'solid') { formArr += '<option value="solid" selected>Solid</option>'; } else { formArr += '<option value="solid">Solid</option>'; }
                    if ( $.drop_object_border_style == 'dotted') { formArr += '<option value="dotted" selected>Dotted</option>'; } else { formArr += '<option value="dotted">Dotted</option>'; }
                    if ( $.drop_object_border_style == 'none') { formArr += '<option value="none" selected>None</option>'; } else { formArr += '<option value="none">None</option>'; }
                    formArr +=      '</select>';
                    
                    
                    formArr +=      '<br>';
                
                        //  textare         "drop_object_array": "",
                        formArr += 'Drag pairID Array <textarea type="textarea" rows="1" cols="79" name="select_object" class="nospace" data-type="textarea" data-json-name="drag_array">';
                        formArr += $.drop_object_array;
                        formArr += '</textarea><br>';

                    formArr +=      '<br>';
                    
                    
                    formArr +=      '<select name="move_object_type " class="select_type" data-type="select" data-json-name="type">';
                    if ( $.drop_object_type == 'txt') { formArr += '<option value="txt" selected>text</option>'; } else { formArr += '<option value="txt">text</option>'; }
                    if ( $.drop_object_type == 'img') { formArr += '<option value="img" selected>image</option>'; } else { formArr += '<option value="img">image</option>'; }
                    if ( $.drop_object_type == 'hide') { formArr += '<option value="hide" selected>hide</option>'; } else { formArr += '<option value="hide">hide</option>'; }
                    formArr +=      '</select>';
                    
                    // Value
                    formArr +=  ' Value <input type="text" name="value" class="value" data-type="text" data-json-name="value" value="'+$.drop_object_value+'" size="1">';
                    
                    
                    formArr +=  '<div class="block_hide '+block_hide+'" style="color: #ccc; float: right; margin-right: 300px;">THIS BLOCK IS HIDDEN</div>';

                    formArr +=  '<div class="block_show '+block_show+'">';

                    formArr +=  '<div class="form_image '+form_image+'">';
                    formArr +=  '<div class="select_images">';
                    formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                    formArr +=      '<span class="button">Choose File</span>';
                    formArr +=      '<span class="val">'+$.drop_object_name+'</span>';
                    formArr +=  '</div><br>';
                    formArr +=  'Image Description (not visible on the page)<br>';
                    formArr +=  '</div>';

                    formArr += '<textarea rows="2" cols="55" name="drop_object" class="text" data-type="textarea" data-json-name="text">';
                    formArr += $.drop_object_text;
                    formArr += '</textarea><br>';

                    formArr += '</div>';
                    formArr += '</div>';                
                });
            
                formArr += '<div class="in_block add_block">';
                formArr += '    <div class="add">Add [ + ]</div>';
                formArr += '</div>';
            
                formArr += '<span class="small tips">tips</span>';
            
                formArr +=  '</div>';
                formArr +=  '<!-- END Drop Object Block -->';                       
            
            }
            // END Drop Object Block
            
            // Drag Object Block
            if ( typeof JSONObject.drag_object !== 'undefined' ) {
                
                formArr += '<!-- Drag Object Block -->';
                formArr +=  '<div id="drag_object" class="block">';

                formArr +=      '<strong>Drag Object:</strong>';
            
                // Move Object Data 
                $.each(JSONObject.drag_object, function(index) { 
                
                    $.drag_object_text = this.text;
                    $.drag_object_type = this.type;
                    $.drag_object_name = this.name;
                    $.drag_object_count = this.count;
                    $.drag_object_value = this.value;
                    $.drag_object_width = this.width;
                    $.drag_object_marker = index + 1;
                    
                    if ( $.drag_object_width == '' ) {
                        $.drag_object_width = "default"
                    }
                    
                    LO_page_app.show_hide_type($.drag_object_type)
                
                    formArr +=  '<div class="in_block" data-name="drag_object" data-id="'+index+'">';
                
                    if ( index > 0 ) {
                    formArr +=  '   <div class="remove">[ - ]</div>';
                    }
                
                    formArr +=  '<div style="display: inline;">'+$.drag_object_marker+'.</div> ';
                    formArr +=      '<select name="move_object_type " class="select_type" data-type="select" data-json-name="type">';
                    if ( $.drag_object_type == 'txt') { formArr += '<option value="txt" selected>text</option>'; } else { formArr += '<option value="txt">text</option>'; }
                    if ( $.drag_object_type == 'img') { formArr += '<option value="img" selected>image</option>'; } else { formArr += '<option value="img">image</option>'; }
                    if ( $.drag_object_type == 'hide') { formArr += '<option value="hide" selected>hide</option>'; } else { formArr += '<option value="hide">hide</option>'; }
                    formArr +=      '</select>';
                    
                    // Count
                    formArr +=  ' Count <input type="text" name="count" class="count" data-type="text" data-json-name="count" value="'+$.drag_object_count+'" size="1">'; //<span class="small note">number of times object should appear</span>
                    
                    // Value
                    formArr +=  ' Value <input type="text" name="value" class="value" data-type="text" data-json-name="value" value="'+$.drag_object_value+'" size="1">';
                    
                    formArr +=  '<br>';
                    
                    formArr +=  '&nbsp;&nbsp; Width: <input type="text" name="width" class="width" data-type="text" data-json-name="width" value="'+$.drag_object_width+'" size="2"> <span class="small">( accepts numeric width or keyword <strong>default</strong> )</span>';
                    
                    formArr +=  '<div class="block_hide '+block_hide+'" style="color: #ccc; float: right; margin-right: 300px;">THIS BLOCK IS HIDDEN</div>';

                    formArr +=  '<div class="block_show '+block_show+'">';

                    formArr +=  '<div class="form_image '+form_image+'">';
                    formArr +=  '<div class="select_images">';
                    formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                    formArr +=      '<span class="button">Choose File</span>';
                    formArr +=      '<span class="val">'+$.drag_object_name+'</span>';
                    formArr +=  '</div><br>';
                    formArr +=  'Image Description (not visible on the page)<br>';
                    formArr +=  '</div>';

                    formArr += '<textarea rows="2" cols="55" name="drag_object" class="text" data-type="textarea" data-json-name="text">';
                    formArr += $.drag_object_text;
                    formArr += '</textarea><br><span class="small note">pairID = '+$.drag_object_marker+'</span>';

                    formArr += '</div>';
                    formArr += '</div>';                
                });
            
                formArr += '<div class="in_block add_block">';
                formArr += '    <div class="add">Add [ + ]</div>';
                formArr += '</div>';
            
                formArr += '<span class="small tips">tips</span>';
            
                formArr +=  '</div>';
                formArr +=  '<!-- END Drag Object Block -->';                       
            
            }
            // END Drag Object Block
            
            // Marker Block
            if ( typeof JSONObject.marker !== 'undefined' ) {
                
                $.markerSelect = JSONObject.marker;
                
                formArr +=  '<!-- Marker Block -->';            
                formArr +=  '<div id="form_marker" class="block">';
                formArr +=      '<strong>Marker Style:</strong>';
                formArr +=      '<select id="markerStyle" name="marker"  data-type="select" data-json-name="marker">';
                if ( $.markerSelect == '0') { formArr += '<option value="0" selected>none</option>'; } else { formArr += '<option value="0">none</option>'; }
                if ( $.markerSelect == '1') { formArr += '<option value="1" selected>(&nbsp&nbsp)</option>'; } else { formArr += '<option value="1">(&nbsp&nbsp)</option>'; }
                if ( $.markerSelect == '2') { formArr += '<option value="2" selected>(&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp) - long</option>'; } else { formArr += '<option value="2">(&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp) - long</option>'; }
                if ( $.markerSelect == '3') { formArr += '<option value="3" selected>[&nbsp&nbsp]</option>'; } else { formArr += '<option value="3">[&nbsp&nbsp]</option>'; }
                if ( $.markerSelect == '4') { formArr += '<option value="4" selected>(A)</option>'; } else { formArr += '<option value="4">(A)</option>'; }
                // formArr +=           '<option value="5">(1)</option>';
                // formArr +=           '<option value="6">(&nbsp&nbsp) a.</option>';
                // formArr +=           '<option value="7">(&nbsp&nbsp) A.</option>';
                // formArr +=           '<option value="8">(&nbsp&nbsp) 1.</option>';
                // formArr +=           '<option value="9">a.</option>';
                // formArr +=           '<option value="10">A.</option>';
                // formArr +=           '<option value="11">1.</option>';
                // formArr +=           '<option value="12">a</option>';
                // formArr +=           '<option value="13">A</option>';
                // formArr +=           '<option value="14">1</option>';
                // formArr +=           '<option value="15">a:</option>';
                // formArr +=           '<option value="16">A:</option>';
                // formArr +=           '<option value="17">1:</option>';
                formArr +=      '</select>';
                formArr +=  '</div>';
                formArr +=  '<!-- END Marker Block -->';    
            
            }   
            // END Marker Block
            
            // Questions Block
            if ( typeof JSONObject.question !== 'undefined' ) {
            
            formArr += '<!-- Questions Block -->';
            formArr +=  '<div id="question" class="block">';

            formArr +=      '<strong>Questions:</strong>';
            
            // Question Data    
            $.each(JSONObject.question, function(index) { 
                
                $.question_text = this.text;
                $.question_type = this.type;
                $.question_name = this.name;
                
                LO_page_app.show_hide_type($.question_type)
                
                formArr +=  '<div class="in_block" data-name="question" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                if ( typeof JSONObject.marker !== 'undefined' ) {
                    $.markerValue = (markerCode !== 'blank') ? String.fromCharCode(markerCode + index) : "";                
                }
                
                formArr +=  '<div class="question" data-marker="'+$.json_marker+'"><span class="marker"><span class="markerValue">'+$.markerValue+'</span><span class="markerHTML">'+markerHTML+'</span></span></div>';
                
                formArr +=      '<select name="question_type " class="select_type"  data-type="select" data-json-name="type">';
                if ( $.question_type == 'txt') { formArr += '<option value="txt" selected>text</option>'; } else { formArr += '<option value="txt">text</option>'; }
                if ( $.question_type == 'img') { formArr += '<option value="img" selected>image</option>'; } else { formArr += '<option value="img">image</option>'; }
                formArr +=      '</select>';

                formArr +=  '<div class="block_show '+block_show+'">';

                formArr +=  '<div class="form_image '+form_image+'">';
                formArr +=  '<div class="select_images">';
                formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                formArr +=      '<span class="button">Choose File</span>';
                formArr +=      '<span class="val">'+$.question_name+'</span>';
                formArr +=  '</div><br>';
                formArr +=  'Image Description (not visible on the page)<br>';
                formArr +=  '</div>';

                formArr += '<textarea rows="1" cols="55" name="question" class="text" data-type="textarea" data-json-name="text">';
                formArr += $.question_text;
                formArr += '</textarea><br>';

                formArr += '</div>';
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END Question Block -->';                      
            
            }
            // END Question Block
            
            // Answer Block
            if ( typeof JSONObject.answer !== 'undefined' ) {
            
            formArr += '<!-- Answer Block -->';
            formArr +=  '<div id="answer" class="block">';

            formArr +=      '<strong>Answers:</strong>';
            
            // Answers Data 
            $.each(JSONObject.answer, function(index) { 
                
                $.answer_text = this.text;
                $.answer_type = this.type;
                $.answer_name = this.name;
                $.answer_width = this.width;
                $.answer_correct = this.correct;
                
                if ( $.answer_width == '' ) {
                    $.answer_width = "default"
                }
                
                LO_page_app.show_hide_type($.answer_type)
                
                formArr +=  '<div class="in_block" data-name="answer" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                $.markerValue = (markerCode !== 'blank') ? String.fromCharCode(markerCode + index) : "";                
                                
                formArr +=  '<div class="answer" data-marker="'+$.json_marker+'"><span class="marker"><span class="markerValue">'+$.markerValue+'</span><span class="markerHTML">'+markerHTML+'</span></span></div>';
                
                formArr +=      '<select name="answer_type " class="select_type" data-type="select" data-json-name="type">';
                if ( $.answer_type == 'txt') { formArr += '<option value="txt" selected>text</option>'; } else { formArr += '<option value="txt">text</option>'; }
                if ( $.answer_type == 'img') { formArr += '<option value="img" selected>image</option>'; } else { formArr += '<option value="img">image</option>'; }
                formArr +=      '</select>';
                
                if ( typeof this.correct !== 'undefined' ) {
                    
                    if ( $.answer_correct == 'true' ) {
                        formArr +=  '<input type="checkbox" name="correct" class="correct" value="true" data-type="checkbox" data-json-name="correct" checked> <span class="small note">check if correct</span>';
                    } else {
                        formArr +=  '<input type="checkbox" name="correct" class="correct" value="false" data-type="checkbox" data-json-name="correct"> <span class="small note">check if correct</span>';
                    }
                    
                }
                
                formArr +=  '<br>';
                
                formArr +=  '&nbsp;&nbsp; Width: <input type="text" name="width" class="width" data-type="text" data-json-name="width" value="'+$.answer_width+'" size="2"> <span class="small">( accepts numeric width or keyword <strong>default</strong> )</span>';
                

                formArr +=  '<div class="block_show '+block_show+'">';

                formArr +=  '<div class="form_image '+form_image+'">';
                formArr +=  '<div class="select_images">';
                formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                formArr +=      '<span class="button">Choose File</span>';
                formArr +=      '<span class="val">'+$.answer_name+'</span>';
                formArr +=  '</div><br>';
                formArr +=  'Image Description (not visible on the page)<br>';
                formArr +=  '</div>';

                formArr += '<textarea type="textarea" rows="1" cols="55" name="answer" data-type="textarea" data-json-name="text">';
                formArr += $.answer_text;
                formArr += '</textarea><br>';

                formArr += '</div>';
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END answer Block -->';                        
            
            }
            // END Answer Block
            
            // Hint Block
            if ( typeof JSONObject.hint !== 'undefined' ) {
                
                formArr += '<!-- Hint Block -->';
                formArr +=  '<div id="hint" class="block">';

                formArr +=      '<strong>Hint:</strong>';
                                    
                    if ( typeof JSONObject.hint[0].text !== 'undefined' ) {
                        $.hint_text = JSONObject.hint[0].text; } else { $.hint_text = '' }
                                        
                    if ( typeof JSONObject.hint[0].type !== 'undefined' ) {
                        $.hint_type = JSONObject.hint[0].type; } else { $.hint_type = '' }
                    
                    if ( typeof JSONObject.hint[0].active !== 'undefined' ) {
                        $.hint_active = JSONObject.hint[0].active; } else { $.hint_active = '' }
                                                
                    if ( typeof JSONObject.hint[0].name !== 'undefined' && JSONObject.hint[0].name !== '' ) {
                        $.hint_name  = JSONObject.hint[0].name;
                        $.hint_name_speak = '<div class="speakCustomClick" data-id="0" data-name="'+$.hint_name+'" data-type="hint"><img src="images/speak.png"></div> <span class="remove_audio"> [ - ]</span>';
                    } else { $.hint_name = ''; $.hint_name_speak = ''; }
                                                
                    formArr +=  '<div class="in_block" data-name="hint" data-id="0">';
                    
                    if ( typeof $.hint_active !== 'undefined' ) {
                    
                        if ( $.hint_active == 'true' ) {
                            formArr +=  '<input type="checkbox" name="active" class="active" value="true" data-type="checkbox" data-json-name="active" checked> Use Hint ';
                        } else {
                            formArr +=  '<input type="checkbox" name="active" class="active" value="false" data-type="checkbox" data-json-name="active"> Use Hint ';
                        }
                    
                    }
                    
                    formArr +=  '<div class="select_images">';
                    formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                    formArr +=      '<span class="button">Choose File</span>';
                    formArr +=      '<span class="val">'+$.hint_name+' '+$.hint_name_speak+'</span>';
                    formArr +=  '</div><br>';

                    formArr += '<textarea rows="2" cols="55" name="hint" class="text" data-type="textarea" data-json-name="text">';
                    formArr += $.hint_text;
                    formArr += '</textarea><br>';

                    formArr += '</div>';
            
                formArr += '<span class="small tips">tips</span>';
            
                formArr +=  '</div>';
                formArr +=  '<!-- END Hint Block -->';  
            }                   
            // END Hint Block
            
            // Directions Block
            if ( typeof JSONObject.directions !== 'undefined' ) {
                
                formArr += '<!-- Directions Block -->';
                formArr +=  '<div id="directions" class="block">';

                formArr +=      '<strong>Directions:</strong>';
                                    
                    if ( typeof JSONObject.directions[0].text !== 'undefined' ) {
                        $.directions_text = JSONObject.directions[0].text; } else { $.directions_text = '' }
                                        
                    if ( typeof JSONObject.directions[0].type !== 'undefined' ) {
                        $.directions_type = JSONObject.directions[0].type; } else { $.directions_type = '' }
                    
                    if ( typeof JSONObject.directions[0].active !== 'undefined' ) {
                        $.directions_active = JSONObject.directions[0].active; } else { $.directions_active = '' }
                                                
                    if ( typeof JSONObject.directions[0].name !== 'undefined' && JSONObject.directions[0].name !== '' ) {
                        $.directions_name  = JSONObject.directions[0].name;
                        $.directions_name_speak = '<div class="speakCustomClick" data-id="0" data-name="'+$.directions_name+'" data-type="directions"><img src="images/speak.png"></div> <span class="remove_audio"> [ - ]</span>';
                    } else { $.directions_name = ''; $.directions_name_speak = ''; }
                                                
                    formArr +=  '<div class="in_block" data-name="directions" data-id="0">';
                    
                    if ( typeof $.directions_active !== 'undefined' ) {
                    
                        if ( $.directions_active == 'true' ) {
                            formArr +=  '<input type="checkbox" name="active" class="active" value="true" data-type="checkbox" data-json-name="active" checked> Use Directions ';
                        } else {
                            formArr +=  '<input type="checkbox" name="active" class="active" value="false" data-type="checkbox" data-json-name="active"> Use Directions ';
                        }
                    
                    }
                    
                    formArr +=  '<div class="select_images">';
                    formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                    formArr +=      '<span class="button">Choose File</span>';
                    formArr +=      '<span class="val">'+$.directions_name+' '+$.directions_name_speak+'</span>';
                    formArr +=  '</div><br>';

                    formArr += '<textarea rows="2" cols="55" name="directions" class="text" data-type="textarea" data-json-name="text">';
                    formArr += $.directions_text;
                    formArr += '</textarea><br>';

                    formArr += '</div>';
            
                formArr += '<span class="small tips">tips</span>';
            
                formArr +=  '</div>';
                formArr +=  '<!-- END Directions Block -->';    
            }                   
            // END Directions Block
            
            // Play Button Block
            if ( typeof JSONObject.play_button !== 'undefined' ) {
            
            formArr += '<!-- Play Button Block -->';
            formArr +=  '<div id="play_button" class="block">';

            formArr +=      '<strong>Audio Button:</strong>';
            
            //  play_button Data    
            $.each(JSONObject.play_button, function(index) { 
                
                if ( typeof this.text !== 'undefined' ) {
                    $.play_button_text = this.text;
                } else { $.play_button_text = ''; }
                
                if ( typeof this.type !== 'undefined' ) {
                    $.play_button_type = this.type;
                } else { $.play_button_type = ''; }
                
                if ( typeof this.name !== 'undefined' && this.name !== '' ) {
                    $.play_button_name  = this.name;
                    $.play_button_speak = '<div class="speakCustomClick" data-id="'+index+'" data-name="'+$.play_button_name+'" data-type="play_button"><img src="images/speak.png"></div>  <span class="remove_audio"> [ - ]</span>';
                } else { $.play_button_name = ''; $.play_button_speak = ''; }
                
                $.play_button_marker = index + 1;
                                
                formArr +=  '<div class="in_block" data-name="play_button" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline; float: left;">'+$.play_button_marker+'.</div> <br>';
            
                formArr +=  '<div class="form_image">';
                formArr +=  '<div class="select_images">';
                formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                formArr +=      '<span class="button">Choose File</span>';
                formArr +=      '<span class="val">'+$.play_button_name+' '+$.play_button_speak+'</span>';
                formArr +=  '</div><br>';
                formArr +=  'Description (not visible on the page)<br>';
                formArr +=  '</div>';

                formArr += '<textarea type="textarea" rows="1" cols="55" name="play_button" data-type="textarea" data-json-name="text">';
                formArr += $.play_button_text;
                formArr += '</textarea><br>';

                formArr += '</div>';
                //formArr += '</div>';              
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END Play Button Block -->';                       
            
            }
            // END Play Button Block
            
            // Cover Block
            if ( typeof JSONObject.cover !== 'undefined' ) {
            
            formArr += '<!-- Cover Block -->';
            formArr +=  '<div id="cover" class="block">';

            formArr +=      '<strong>Cover:</strong>';
            
            // Cover Data   
            $.each(JSONObject.cover, function(index) { 
                
                $.cover_id          = this.id;
                $.cover_width       = this.width;
                $.cover_height      = this.height;
                $.cover_direction   = this.direction;
                
                //alert($.cover_direction);
                
                $.cover_marker = index + 1;
                                
                formArr +=  '<div class="in_block" data-name="cover" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline;">'+$.cover_marker+'.</div> '; 
                
                formArr +=  'Size &nbsp;&nbsp; W: <input type="text" name="width" class="width" data-type="text" data-json-name="width" value="'+$.cover_width+'" size="1"> H: <input type="text" name="height" class="height" data-type="text" data-json-name="height" value="'+$.cover_height+'" size="1">';          
                
                formArr +=      '&nbsp;&nbsp;&nbsp;&nbsp;Drag Direction ';
                if ( $.cover_direction == 'horizontal' )    { formArr += '&nbsp;&nbsp;<input type="radio" value="horizontal" name="direction_'+$.cover_id+'" data-type="radio" data-json-name="direction" checked>&nbsp; <span class="small">Horizontal</span>'; }  else { formArr +=   '&nbsp;<input type="radio"       value="horizontal" name="direction_'+$.cover_id+'" data-type="radio" data-json-name="direction">&nbsp; <span class="small">Horizontal</span>'; }
                if ( $.cover_direction == 'vertical' )      { formArr += '&nbsp;&nbsp;<input type="radio" value="vertical"   name="direction_'+$.cover_id+'" data-type="radio" data-json-name="direction" checked>&nbsp; <span class="small">Vertical</span>'; }    else { formArr +=   '&nbsp;&nbsp;<input type="radio" value="vertical"   name="direction_'+$.cover_id+'" data-type="radio" data-json-name="direction">&nbsp; <span class="small">Vertical</span>'; }
                
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END answer Block -->';                        
            
            }
            // END Answer Block
            
            // Highlight Object Block
            if ( typeof JSONObject.highlight_object !== 'undefined' ) {
            
            formArr += '<!-- highlight_object Block -->';
            formArr +=  '<div id="highlight_object" class="block">';

            formArr +=      '<strong>Highlight Object:</strong>';
            
            // highlight_object Data    
            $.each(JSONObject.highlight_object, function(index) { 
                
                $.highlight_object_text = this.text;
                //$.highlight_object_type = this.type;
                //$.highlight_object_name = this.name;
                $.highlight_object_correct = this.correct;
                $.highlight_object_marker = index + 1;                      
                
                //LO_page_app.show_hide_type($.highlight_object_type)
                
                formArr +=  '<div class="in_block" data-name="highlight_object" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline;">'+$.highlight_object_marker+'.</div> ';
                
                //formArr +=    'zzzzzz';
                
                if ( typeof this.correct !== 'undefined' ) {
                    
                    if ( $.highlight_object_correct == 'true' ) {
                        formArr +=  '<input type="checkbox" name="correct" class="correct" value="true" data-type="checkbox" data-json-name="correct" checked> <span class="small note">check if correct</span>';
                    } else {
                        formArr +=  '<input type="checkbox" name="correct" class="correct" value="false" data-type="checkbox" data-json-name="correct"> <span class="small note">check if correct</span>';
                    }
                    
                }

                formArr +=  '<div class="block_show '+block_show+'">';

                formArr +=  '<div class="form_image '+form_image+'">';
                formArr +=  '<div class="select_images">';
                formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                formArr +=      '<span class="button">Choose File</span>';
                formArr +=      '<span class="val">'+$.highlight_object_name+'</span>';
                formArr +=  '</div><br>';
                formArr +=  'Image Description (not visible on the page)<br>';
                formArr +=  '</div>';

                formArr += '<textarea type="textarea" rows="1" cols="79" name="highlight_object" data-type="textarea" data-json-name="text">';
                formArr += $.highlight_object_text;
                formArr += '</textarea><br>';
                
                formArr += '<span class="small note">code = ##h:'+$.highlight_object_marker+'##</span>'; 
                                                    
                formArr += '</div>';
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END highlight_object Block -->';                      
            
            }
            // END highlight_object Block
            
            // Type Object Block
            if ( typeof JSONObject.type_object !== 'undefined' ) {
            
            formArr += '<!-- type_object Block -->';
            formArr +=  '<div id="type_object" class="block">';

            formArr +=      '<strong>Type Object:</strong>';
            
            // type_object Data 
            $.each(JSONObject.type_object, function(index) { 
                                
                $.type_object_id = this.id;
                $.type_object_text = this.text;
                $.type_object_correct = this.correct;
                $.type_object_size = this.size;
                //$.type_object_type = this.type;
                
                if ( $.type_object_size == '' ) {
                    $.type_object_size = 3;
                }
                
                if ( typeof this.type !== 'undefined' ) {
                    $.type_object_type = this.type;
                } else { $.type_object_type = 1; }
                
                $.type_object_source = this.source;
                $.type_object_output = this.output;
                $.type_object_marker = index + 1;
                                                        
                //LO_page_app.show_hide_type($.type_object_type)
                
                formArr +=  '<div class="in_block" data-name="type_object" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline;">'+$.type_object_marker+'.</div> ';
                
                // Keypad
                formArr +=      'Keypad <select name="type" class="type keypad_obj" data-type="select" data-json-name="type">';
                if ( $.type_object_type == '1') { formArr += '<option value="1" selected>Keypad 1 (small)</option>'; }  else { formArr += '<option value="1">Keypad 1 (small)</option>'; }
                if ( $.type_object_type == '2') { formArr += '<option value="2" selected>Keypad 2 (medium)</option>'; } else { formArr += '<option value="2">Keypad 2 (medium)</option>'; }
                if ( $.type_object_type == '3') { formArr += '<option value="3" selected>Keypad 3 (large)</option>'; }  else { formArr += '<option value="3">Keypad 3 (large)</option>'; }
                formArr +=      '</select>';
                
                // Character Count
                formArr +=      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Character Count <select name="size" class="size keypad_obj" data-type="select" data-json-name="size">';
                if ( $.type_object_size == '3') { formArr += '<option value="3" selected>3</option>'; } else { formArr += '<option value="3">3</option>'; }
                if ( $.type_object_size == '5') { formArr += '<option value="5" selected>5</option>'; } else { formArr += '<option value="5">5</option>'; }
                if ( $.type_object_size == '7') { formArr += '<option value="7" selected>7</option>'; } else { formArr += '<option value="7">7</option>'; }
                if ( $.type_object_size == '10') { formArr += '<option value="10" selected>10</option>'; } else { formArr += '<option value="10">10</option>'; }
                if ( $.type_object_size == '15') { formArr += '<option value="15" selected>15</option>'; } else { formArr += '<option value="15">15</option>'; }
                if ( $.type_object_size == '20') { formArr += '<option value="20" selected class="no_small" disabled="disabled">20</option>'; } else { formArr += '<option value="20" class="no_small" disabled="disabled">20</option>'; }
                formArr +=      '</select>';
                
                formArr +=  '<div class="block_show '+block_show+'">';
                
                formArr += '<span class="keypad_label">Content</span> &nbsp;&nbsp;<div id="type_object_form_'+ $.type_object_id +'" data-id="'+ $.type_object_id +'" class="type_object keypad_box" data-htmlarray=\'[' + $.type_object_source + ']\' data-output="' + $.type_object_output + '" data-charlimit="'+$.type_object_size+'" data-keypad="'+$.type_object_type+'">'+$.type_object_output+'</div><br>';
                                
                formArr += '<br><span class="small note">code = ##t:'+$.type_object_marker+'## | multiple code example = ##t:1,2,3##</span>'; 
                                                    
                formArr += '</div>';
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END type_object Block -->';                       
            
            }
            // END type_object Block
            
            // select Object Block
            if ( typeof JSONObject.select_object !== 'undefined' ) {
            
            formArr += '<!-- select_object Block -->';
            formArr +=  '<div id="select_object" class="block">';

            formArr +=      '<strong>Select Object:</strong><br>';
            
            formArr += '<span class="small note">select code example = ##s:1,2,3## (makes a select box from content in select object 1,2 and 3)</span>'; 
            
            // select_object Data   
            $.each(JSONObject.select_object, function(index) { 
                
                $.select_object_text = this.text;
                $.select_object_correct = this.correct;
                $.select_object_marker = index + 1;                     
                                
                formArr +=  '<div class="in_block" data-name="select_object" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline;">'+$.select_object_marker+'.</div> ';
                                
                if ( typeof this.correct !== 'undefined' ) {
                    
                    if ( $.select_object_correct == 'true' ) {
                        formArr +=  '<input type="checkbox" name="correct" class="correct" value="true" data-type="checkbox" data-json-name="correct" checked> <span class="small note">check if correct</span>';
                    } else {
                        formArr +=  '<input type="checkbox" name="correct" class="correct" value="false" data-type="checkbox" data-json-name="correct"> <span class="small note">check if correct</span>';
                    }
                    
                }

                formArr +=  '<div class="block_show '+block_show+'">';

                formArr += '<textarea type="textarea" rows="1" cols="79" name="select_object" data-type="textarea" data-json-name="text">';
                formArr += $.select_object_text;
                formArr += '</textarea><br>';
                                                                
                formArr += '</div>';
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END select_object Block -->';                     
            
            }
            // END select_object Block
            
            // Image Object Block
            if ( typeof JSONObject.image_object !== 'undefined' ) {
                
                formArr += '<!-- Image Object Block -->';
                formArr +=  '<div id="image_object" class="block">';

                formArr +=      '<strong>Image Object:</strong>';
            
                // Move Object Data 
                $.each(JSONObject.image_object, function(index) { 
                
                    $.image_object_text = this.text;
                    $.image_object_type = this.type;
                    $.image_object_name = this.name;
                    $.image_object_width = this.width;
                    $.image_object_marker = index + 1;
            
                    //LO_page_app.show_hide_type($.image_object_type)
                
                    formArr +=  '<div class="in_block" data-name="image_object" data-id="'+index+'">';
                
                    if ( index > 0 ) {
                    formArr +=  '   <div class="remove">[ - ]</div>';
                    }
                
                    formArr +=  '<div style="display: inline;">'+$.image_object_marker+'.</div> ';
                    formArr +=      'Align <select name="image_object_type " class="select_type" data-type="select" data-json-name="type">';
                    if ( $.image_object_type == 'center') { formArr += '<option value="center" selected>center</option>'; } else { formArr += '<option value="center">center</option>'; }
                    if ( $.image_object_type == 'left') { formArr += '<option value="left" selected>left</option>'; } else { formArr += '<option value="left">left</option>'; }
                    if ( $.image_object_type == 'right') { formArr += '<option value="right" selected>right</option>'; } else { formArr += '<option value="right">right</option>'; }
                    if ( $.image_object_type == 'inline') { formArr += '<option value="inline" selected>inline</option>'; } else { formArr += '<option value="inline">inline</option>'; }
                    formArr +=      '</select>';
                    formArr +=  '&nbsp;&nbsp; Width: <input type="text" name="width" class="width" data-type="text" data-json-name="width" value="'+$.image_object_width+'" size="2"> <span class="small">( accepts numeric width or keyword <strong>default</strong> )</span>';
                    
                    formArr +=  '<div class="form_image">';
                    formArr +=  '<div class="select_images">';
                    formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                    formArr +=      '<span class="button">Choose File</span>';
                    formArr +=      '<span class="val">'+$.image_object_name+'</span>';
                    formArr +=  '</div><br>';
                    formArr +=  'Image Description (not visible on the page)<br>';
                    formArr +=  '</div>';

                    formArr += '<textarea rows="2" cols="55" name="image_object" class="text" data-type="textarea" data-json-name="text">';
                    formArr += $.image_object_text;
                    formArr += '</textarea><br>';
                    
                    formArr += '<span class="small note">code = ##i:'+$.image_object_marker+'##</span>'; 
                    
                    //formArr += '</div>';
                    formArr += '</div>';                
                });
            
                formArr += '<div class="in_block add_block">';
                formArr += '    <div class="add">Add [ + ]</div>';
                formArr += '</div>';
            
                formArr += '<span class="small tips">tips</span>';
            
                formArr +=  '</div>';
                formArr +=  '<!-- END Image Object Block -->';                      
            
            }
            // END Image Object Block
            
            // shading_object Block
            if ( typeof JSONObject.shading_object !== 'undefined' ) {
            
            formArr += '<!-- shading_object Block -->';
            formArr +=  '<div id="shading_object" class="block">';

            formArr +=      '<strong>Shading Object:</strong>';
            
            // shading_object Data  
            $.each(JSONObject.shading_object, function(index) { 
                
                $.shading_object_rows = this.rows;
                $.shading_object_rows_x = this.rows_x;
                $.shading_object_columns = this.columns;
                $.shading_object_columns_x = this.columns_x;
                $.shading_object_border_style = this.border_style;
                $.shading_object_show_labels = this.show_labels;
                
                if ( this.label_start_at == '' ) {
                    $.shading_object_label_start_at = 1;
                } else {
                    $.shading_object_label_start_at = this.label_start_at;
                }
                
                $.shading_object_red_check = this.red_check;
                $.shading_object_red_value = this.red_value;
                $.shading_object_red_array = this.red_array;
                $.shading_object_blue_check = this.blue_check;
                $.shading_object_blue_value = this.blue_value;
                $.shading_object_blue_array = this.blue_array;
                $.shading_object_green_check = this.green_check;
                $.shading_object_green_value = this.green_value;
                $.shading_object_green_array = this.green_array;
                $.shading_object_yellow_check = this.yellow_check;
                $.shading_object_yellow_value = this.yellow_value;
                $.shading_object_yellow_array = this.yellow_array;
                $.shading_object_multiple_cell = this.multiple_cell;
                $.shading_object_marker = index + 1;                        
                                
                formArr +=  '<div class="in_block" data-name="shading_object" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline;">'+$.shading_object_marker+'.</div> ';
                                
                //  text            "rows": "",
                formArr +=  'Rows <input type="text" name="rows" class="rows" data-type="text" data-json-name="rows" value="'+$.shading_object_rows+'" size="1">';
                
                //  select          "rows_x": "",
                formArr +=      '<select name="rows_x " class="rows_x" data-type="select" data-json-name="rows_x">';
                if ( $.shading_object_rows_x == '1') { formArr += '<option value="1" selected>x1</option>'; } else { formArr += '<option value="1">x1</option>'; }
                if ( $.shading_object_rows_x == '2') { formArr += '<option value="2" selected>x2</option>'; } else { formArr += '<option value="2">x2</option>'; }
                if ( $.shading_object_rows_x == '3') { formArr += '<option value="3" selected>x3</option>'; } else { formArr += '<option value="3">x3</option>'; }
                if ( $.shading_object_rows_x == '4') { formArr += '<option value="4" selected>x4</option>'; } else { formArr += '<option value="4">x4</option>'; }
                formArr +=      '</select>';
                
                //  text            "columns": "",
                formArr +=  '&nbsp;&nbsp;&nbsp;&nbsp;Columns <input type="text" name="columns" class="columns" data-type="text" data-json-name="columns" value="'+$.shading_object_columns+'" size="1">';
                
                //  select          "columns_x": "",
                formArr +=      '<select name="columns_x " class="columns_x" data-type="select" data-json-name="columns_x">';
                if ( $.shading_object_columns_x == '1') { formArr += '<option value="1" selected>x1</option>'; } else { formArr += '<option value="1">x1</option>'; }
                if ( $.shading_object_columns_x == '2') { formArr += '<option value="2" selected>x2</option>'; } else { formArr += '<option value="2">x2</option>'; }
                if ( $.shading_object_columns_x == '3') { formArr += '<option value="3" selected>x3</option>'; } else { formArr += '<option value="3">x3</option>'; }
                if ( $.shading_object_columns_x == '4') { formArr += '<option value="4" selected>x4</option>'; } else { formArr += '<option value="4">x4</option>'; }
                formArr +=      '</select>';
                
                //  select          "border_style": "",
                formArr +=      '&nbsp;&nbsp;&nbsp;&nbsp;Border Style <select name="border_style " class="border_style" data-type="select" data-json-name="border_style">';
                if ( $.shading_object_border_style == 'osis') { formArr += '<option value="osis" selected>O:S I:S</option>'; } else { formArr += '<option value="osis">O:S I:S</option>'; }
                // if ( $.shading_object_border_style == 'osid') { formArr += '<option value="osid" selected>O:S I:D</option>'; } else { formArr += '<option value="osid">O:S I:D</option>'; }
                if ( $.shading_object_border_style == 'odid') { formArr += '<option value="odid" selected>O:D I:D</option>'; } else { formArr += '<option value="odid">O:D I:D</option>'; }
                if ( $.shading_object_border_style == 'osin') { formArr += '<option value="osin" selected>O:S I:N</option>'; } else { formArr += '<option value="osin">O:S I:N</option>'; }
                if ( $.shading_object_border_style == 'odin') { formArr += '<option value="odin" selected>O:D I:N</option>'; } else { formArr += '<option value="odin">O:D I:N</option>'; }
                if ( $.shading_object_border_style == 'none') { formArr += '<option value="none" selected>(N) none</option>'; } else { formArr += '<option value="none">(N) none</option>'; }
                formArr +=      '</select>';
                
            formArr +=      '<br>';
                
                //  check           "show_labels": "", 
                if ( typeof this.show_labels !== 'undefined' ) {
                    
                    if ( $.shading_object_show_labels == 'true' ) {
                        formArr +=  '<input type="checkbox" name="show_labels" class="show_labels" value="true" data-type="checkbox" data-json-name="show_labels" checked> Show Labels';
                    } else {
                        formArr +=  '<input type="checkbox" name="show_labels" class="show_labels" value="false" data-type="checkbox" data-json-name="show_labels"> Show Labels';
                    }
                    
                }
                
                //  text            "label_start_at": "", 
                formArr +=  '&nbsp;&nbsp;&nbsp;&nbsp;Label Start @  <input type="text" name="label_start_at" class="label_start_at" data-type="text" data-json-name="label_start_at" value="'+$.shading_object_label_start_at+'" size="1">';
            
            formArr +=      '<br>';

                //  check           "multiple_cell": "",
                if ( typeof this.multiple_cell !== 'undefined' ) {

                    if ( $.shading_object_multiple_cell == 'true' ) {
                        formArr +=  '<input type="checkbox" name="multiple_cell" class="multiple_cell" value="true" data-type="checkbox" data-json-name="multiple_cell" checked> Allow multiple colors in a cell';
                    } else {
                        formArr +=  '<input type="checkbox" name="multiple_cell" class="multiple_cell" value="false" data-type="checkbox" data-json-name="multiple_cell"> Allow multiple colors in a cell';
                    }

                }
                            
            formArr +=      '<br><br>';
                
                //  check           "red_check": "",
                if ( typeof this.red_check !== 'undefined' ) {
                    
                    if ( $.shading_object_red_check == 'true' ) {
                        formArr +=  '<input type="checkbox" name="red_check" class="red_check" value="true" data-type="checkbox" data-json-name="red_check" checked> Red';
                    } else {
                        formArr +=  '<input type="checkbox" name="red_check" class="red_check" value="false" data-type="checkbox" data-json-name="red_check"> Red';
                    }
                    
                }
                //  text            "red_value": "",
                formArr +=  '&nbsp;&nbsp;&nbsp;&nbsp;Value <input type="text" name="red_value" class="red_value" data-type="text" data-json-name="red_value" value="'+$.shading_object_red_value+'" size="2">';
                
            formArr +=      '<br>';
                
                //  textare         "red_array": "",
                formArr += 'Select Array <textarea type="textarea" rows="1" cols="79" name="select_object" class="nospace" data-type="textarea" data-json-name="red_array">';
                formArr += $.shading_object_red_array;
                formArr += '</textarea><br>';
                
                //var newStr = str.replace(/\s+/g, '');

            formArr +=      '<br>';

                //  check           "blue_check": "",
                if ( typeof this.blue_check !== 'undefined' ) {

                    if ( $.shading_object_blue_check == 'true' ) {
                        formArr +=  '<input type="checkbox" name="blue_check" class="blue_check" value="true" data-type="checkbox" data-json-name="blue_check" checked> Blue';
                    } else {
                        formArr +=  '<input type="checkbox" name="blue_check" class="blue_check" value="false" data-type="checkbox" data-json-name="blue_check"> Blue';
                    }

                }
                //  text            "blue_value": "",
                formArr +=  '&nbsp;&nbsp;&nbsp;&nbsp;Value <input type="text" name="blue_value" class="blue_value" data-type="text" data-json-name="blue_value" value="'+$.shading_object_blue_value+'" size="2">';

            formArr +=      '<br>';

                //  textare         "blue_array": "",
                formArr += 'Select Array <textarea type="textarea" rows="1" cols="79" name="select_object" class="nospace"  data-type="textarea" data-json-name="blue_array">';
                formArr += $.shading_object_blue_array;
                formArr += '</textarea><br>';
                
            formArr +=      '<br>';

                //  check           "green_check": "",
                if ( typeof this.green_check !== 'undefined' ) {

                    if ( $.shading_object_green_check == 'true' ) {
                        formArr +=  '<input type="checkbox" name="green_check" class="green_check" value="true" data-type="checkbox" data-json-name="green_check" checked> Green';
                    } else {
                        formArr +=  '<input type="checkbox" name="green_check" class="green_check" value="false" data-type="checkbox" data-json-name="green_check"> Green';
                    }

                }
                
                //  text            "green_value": "",
                formArr +=  '&nbsp;&nbsp;&nbsp;&nbsp;Value <input type="text" name="green_value" class="green_value" data-type="text" data-json-name="green_value" value="'+$.shading_object_green_value+'" size="2">';

            formArr +=      '<br>';

                //  textare         "green_array": "",
                formArr += 'Select Array <textarea type="textarea" rows="1" cols="79" name="select_object" class="nospace"  data-type="textarea" data-json-name="green_array">';
                formArr += $.shading_object_green_array;
                formArr += '</textarea><br>';   

            formArr +=      '<br>';

                //  check           "yellow_check": "",
                if ( typeof this.yellow_check !== 'undefined' ) {

                    if ( $.shading_object_yellow_check == 'true' ) {
                        formArr +=  '<input type="checkbox" name="yellow_check" class="yellow_check" value="true" data-type="checkbox" data-json-name="yellow_check" checked> Yellow'; 
                    } else {
                        formArr +=  '<input type="checkbox" name="yellow_check" class="yellow_check" value="false" data-type="checkbox" data-json-name="yellow_check"> Yellow';
                    }

                }
                //  text            "yellow_value": "",
                formArr +=  '&nbsp;&nbsp;&nbsp;&nbsp;Value <input type="text" name="yellow_value" class="yellow_value" data-type="text" data-json-name="yellow_value" value="'+$.shading_object_yellow_value+'" size="2">';

            formArr +=      '<br>';

                //  textare         "yellow_array": "",
                formArr += 'Select Array <textarea type="textarea" rows="1" cols="79" name="select_object" class="nospace" data-type="textarea" data-json-name="yellow_array">';
                formArr += $.shading_object_yellow_array;
                formArr += '</textarea><br>';       
                
                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END shading_object Block -->';                        
            
            }
            // END shading_object Block

            // NumberLine Block
            if ( typeof JSONObject.numberline_object !== 'undefined' ) {
                list_marks = "arrow,tick,circle-open,circle-filled".split(",");
                buildInput=function(opt){
                    //defaults
                    var defs = { t:"Text before input box", n:"name_of_input/json-name", c:"className", v:"value text", s:2, d:"float" };
                    $.each(defs, function(k,v) {
                        opt[k] = opt[k] == undefined ? v : opt[k];
                    });
                    return  '&nbsp;&nbsp;&nbsp;&nbsp;'+opt.t+
                            ' <input type="text" name="'+opt.n+
                            '" class="'+opt.c+
                            '" data-type="'+opt.d+
                            '" data-json-name="'+opt.n+
                            '" value="'+opt.v+
                            '" size="'+opt.s+'">';
                }
                
                formArr += '<!-- numberline_object Block -->';
                formArr += '<div id="numberline_object" class="block">';
                formArr +=      '<strong>Number Line Object:</strong>';

                $.each(JSONObject.numberline_object, function(index) { 
                    var self = this;
                    $.numberline_object_marker = index + 1;                     
                    formArr +=  '<div class="in_block" data-name="numberline_object" data-id="'+index+'">';
                    if ( index > 0 ) {
                        formArr +=  '   <div class="remove">[ - ]</div>';
                    }
                    formArr +=  '<div style="display: inline;">'+$.numberline_object_marker+'.</div> ';
                    formArr += buildInput({t:"Line Length",n:"lineLength",c:"lineLength",v:this.lineLength,d:"float"});
                    formArr += "<br>";
                    formArr += buildInput({t:"Line",n:"lineColor",c:"colorPicker",v:this.lineColor,d:"text",s:6});
                    formArr += buildInput({t:"Highlighted",n:"hlColor",c:"colorPicker",v:this.hlColor,d:"text",s:6});
                    formArr += buildInput({t:"Label",n:"ticks_labelColor",c:"colorPicker",v:this.ticks_labelColor,d:"text",s:6});
                    formArr += buildInput({t:"Tick",n:"ticks_color",c:"colorPicker",v:this.ticks_color,d:"text",s:6});
                    formArr += "<br>";
                    formArr += "<br>";
                    
                    formArr += buildInput({t:"Ticks (comma seperated)",n:"ticks_vals",c:"ticks_vals",v:this.ticks_vals,d:"text",s:30});
                    formArr += "<br>";

                    formArr += "&nbsp;&nbsp;&nbsp;&nbsp;Left <select name='ticks_left' class='ticks_left' data-type='select' data-json-name='ticks_left'>";
                    $.each(list_marks, function(index, value) {                  
                        if ( value === self.ticks_left) { 
                            formArr += '<option value="'+value+'" selected>'+value+'</option>'; } else { formArr += '<option value="'+value+'">'+value+'</option>'; 
                        }
                    });
                    formArr += "</select>";
                    formArr += "&nbsp;&nbsp;&nbsp;&nbsp;Right <select name='ticks_right' class='ticks_right' data-type='select' data-json-name='ticks_right'>";
                    $.each(list_marks, function(index, value) {                  
                        if ( value === self.ticks_right) { 
                            formArr += '<option value="'+value+'" selected>'+value+'</option>'; } else { formArr += '<option value="'+value+'">'+value+'</option>'; 
                        }
                    });
                    formArr += "</select>";
                    formArr += '</div>';
                });

                formArr += '<div class="in_block add_block">';
                formArr += '    <div class="add">Add [ + ]</div>';
                formArr += '</div>';
                
                formArr += '<span class="small tips">tips</span>';
                formArr += '</div>';
                formArr += '<!-- END numnerline_object Block -->';
            }
            
            // END Numberline Block
                    
            // attempts Block
            if ( typeof audioObject.attempts !== 'undefined' ) {
                list_attempts = audioObject.attempts.split(',');
            }
            
            if ( typeof JSONObject.attempts !== 'undefined' ) {
                
                $.attemptsSelect = JSONObject.attempts;
                
                formArr +=  '<!-- attempts Block -->';          
                formArr +=  '<div id="form_attempts" class="block">';
                formArr +=      '<strong>Feedback Setup:</strong> <br><br>';
                
                formArr +=      'Attempts ';
                formArr +=      '<select id="attempts" name="attempts"  data-type="select" data-json-name="attempts">';
                $.each(list_attempts, function(index, value) {                  
                    if ( value == $.attemptsSelect) { formArr += '<option value="'+value+'" selected>'+value+'</option>'; } else { formArr += '<option value="'+value+'">'+value+'</option>'; }
                });
                formArr +=      '</select>';
                
                // feedback_type Block
                if ( typeof JSONObject.feedback_type !== 'undefined' ) {

                    feedback_type = JSONObject.feedback_type;

                    formArr +=  '<!-- feedback_type Block -->';         
                    //formArr +=    '<div id="feedback_type" class="block">';
                    
                    console.log(feedback_type);
                    
                    // 1st
                    //<input type="radio" value="single" name="feedback_type" data-type="radio" data-json-name="feedback_type" checked="">
                    //<input type="radio" value="multiple" name="feedback_type" data-type="radio" data-json-name="feedback_type">
                    
                    // 2nd
                    //<input type="radio" value="single" name="feedback_type" data-type="radio" data-json-name="feedback_type">
                    //<input type="radio" value="multiple" name="feedback_type" data-type="radio" data-json-name="feedback_type" checked="">
                    
                    formArr +=      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Question Type ';
                        if ( feedback_type == 'single' ) { formArr += '&nbsp;&nbsp;<input type="radio" value="single" name="feedback_type" data-type="radio" data-json-name="feedback_type" checked>&nbsp;&nbsp; Single '; } else { formArr +=  '&nbsp;&nbsp;<input type="radio" value="single" name="feedback_type" data-type="radio" data-json-name="feedback_type">&nbsp;&nbsp; Single '; }
                        if ( feedback_type == 'multiple' ) { formArr += '&nbsp;&nbsp;<input type="radio" value="multiple" name="feedback_type" data-type="radio" data-json-name="feedback_type" checked>&nbsp;&nbsp; Multiple '; } else { formArr +=    '&nbsp;&nbsp;<input type="radio" value="multiple" name="feedback_type" data-type="radio" data-json-name="feedback_type">&nbsp;&nbsp; Multiple '; }
                    
                    formArr +=  '<!-- END feedback_type Block -->'; 

                }   
                // END feedback_type Block
                
                formArr +=  '</div>';
                formArr +=  '<!-- END attempts Block -->';  
            
            }   
            // END attempts Block
                    
            //Show hide fields based on singular and multiple
            
            // feedback_correct Block
            if ( typeof JSONObject.feedback_correct !== 'undefined' ) {
            
            formArr += '<!-- feedback_correct Block -->';
            formArr +=  '<div id="feedback_correct" class="block single multiple">';

            formArr +=      '<strong>Feedback - Correct:</strong>';
            
            // feedback_correct Data    
            $.each(JSONObject.feedback_correct, function(index) { 
                
                $.feedback_correct = this.name;
                                
                formArr +=  '<div class="in_block" data-name="feedback_correct" data-id="'+index+'">';
                                                                
                LO_page_app.build_feedback_cycles('feedback_correct', $.feedback_correct);

                formArr += '</div>';                
            });
            
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END feedback_correct Block -->';                      
            
            }
            // END feedback_correct Block
            
            // feedback_incorrect Block
            if ( typeof JSONObject.feedback_incorrect !== 'undefined' ) {
            
            formArr += '<!-- feedback_incorrect Block -->';
            formArr +=  '<div id="feedback_incorrect" class="block single">';

            formArr +=      '<strong>Feedback - Incorrect:</strong>';
            
            // feedback_incorrect Data  
            $.each(JSONObject.feedback_incorrect, function(index) { 
                
                $.feedback_incorrect = this.name;
                                
                formArr +=  '<div class="in_block" data-name="feedback_incorrect" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                                                                
                LO_page_app.build_feedback_cycles('feedback_incorrect', $.feedback_incorrect);

                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END feedback_incorrect Block -->';                        
            
            }
            // END feedback_incorrect Block
            
            // feedback_not_all_correct Block
            if ( typeof JSONObject.feedback_not_all_correct !== 'undefined' ) {
            
            formArr += '<!-- feedback_not_all_correct Block -->';
            formArr +=  '<div id="feedback_not_all_correct" class="block multiple">';

            formArr +=      '<strong>Feedback - Not All Correct:</strong>';
            
            // feedback_not_all_correct Data    
            $.each(JSONObject.feedback_not_all_correct, function(index) { 
                
                $.feedback_not_all_correct = this.name;
                                
                formArr +=  '<div class="in_block" data-name="feedback_not_all_correct" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                                                                
                LO_page_app.build_feedback_cycles('feedback_not_all_correct', $.feedback_not_all_correct);

                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END feedback_not_all_correct Block -->';                      
            
            }
            // END feedback_not_all_correct Block
            
            
            // feedback_one_wrong Block
            if ( typeof JSONObject.feedback_one_wrong !== 'undefined' ) {
            
            formArr += '<!-- feedback_one_wrong Block -->';
            formArr +=  '<div id="feedback_one_wrong" class="block multiple">';

            formArr +=      '<strong>Feedback - One Wrong:</strong>';
            
            // feedback_one_wrong Data  
            $.each(JSONObject.feedback_one_wrong, function(index) { 
                
                $.feedback_one_wrong = this.name;
                                
                formArr +=  '<div class="in_block" data-name="feedback_one_wrong" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                                                                
                LO_page_app.build_feedback_cycles('feedback_one_wrong', $.feedback_one_wrong);

                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END feedback_one_wrong Block -->';                        
            
            }
            // END feedback_one_wrong Block
            
            // feedback_some_wrong Block
            if ( typeof JSONObject.feedback_some_wrong !== 'undefined' ) {
            
            formArr += '<!-- feedback_some_wrong Block -->';
            formArr +=  '<div id="feedback_some_wrong" class="block multiple">';

            formArr +=      '<strong>Feedback - Some Wrong:</strong>';
            
            // feedback_some_wrong Data 
            $.each(JSONObject.feedback_some_wrong, function(index) { 
                
                $.feedback_some_wrong = this.name;
                                
                formArr +=  '<div class="in_block" data-name="feedback_some_wrong" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                                                                
                LO_page_app.build_feedback_cycles('feedback_some_wrong', $.feedback_some_wrong);

                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END feedback_some_wrong Block -->';                       
            
            }
            // END feedback_some_wrong Block
            
            // feedback_all_wrong Block
            if ( typeof JSONObject.feedback_all_wrong !== 'undefined' ) {
            
            formArr += '<!-- feedback_all_wrong Block -->';
            formArr +=  '<div id="feedback_all_wrong" class="block multiple">';

            formArr +=      '<strong>Feedback - All Wrong:</strong>';
            
            // feedback_all_wrong Data  
            $.each(JSONObject.feedback_all_wrong, function(index) { 
                
                $.feedback_all_wrong = this.name;
                                
                formArr +=  '<div class="in_block" data-name="feedback_all_wrong" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                                                                
                LO_page_app.build_feedback_cycles('feedback_all_wrong', $.feedback_all_wrong);

                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END feedback_all_wrong Block -->';                        
            
            }
            // END feedback_all_wrong Block
            
            // feedback_last_attempt Block
            if ( typeof JSONObject.feedback_last_attempt !== 'undefined' ) {
            
            formArr += '<!-- feedback_last_attempt Block -->';
            formArr +=  '<div id="feedback_last_attempt" class="block single multiple">';

            formArr +=      '<strong>Feedback - Last Attempt:</strong>';
            
            // feedback_last_attempt Data   
            $.each(JSONObject.feedback_last_attempt, function(index) { 
                
                $.feedback_last_attempt = this.name;
                                
                formArr +=  '<div class="in_block" data-name="feedback_last_attempt" data-id="'+index+'">';
                                                            
                LO_page_app.build_feedback_cycles('feedback_last_attempt', $.feedback_last_attempt);

                formArr += '</div>';                
            });
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END feedback_last_attempt Block -->';                     
            
            }
            // END feedback_last_attempt Block
            
            // Custom Feedback Block
            if ( typeof JSONObject.custom_feedback !== 'undefined' ) {
            
            formArr += '<!-- Custom Feedback Block -->';
            formArr +=  '<div id="custom_feedback" class="block single multiple">';

            formArr +=      '<strong>Feedback - Custom Corrective:</strong>';
            
            /// zzzz finish
            // Custom Feedback Data 
            $.each(JSONObject.custom_feedback, function(index) { 
                
                if ( typeof this.text !== 'undefined' ) {
                    $.custom_feedback_text = this.text;
                } else { $.custom_feedback_text = ''; }
                
                if ( typeof this.type !== 'undefined' ) {
                    $.custom_feedback_type = this.type;
                } else { $.custom_feedback_type = ''; }
                
                if ( typeof this.name !== 'undefined' && this.name !== '' ) {
                    $.custom_feedback_name  = this.name;
                    $.custom_feedback_speak = '<div class="speakCustomClick" data-id="'+index+'" data-name="'+$.custom_feedback_name+'" data-type="custom_feedback"><img src="images/speak.png"></div>  <span class="remove_audio"> [ - ]</span>';
                } else { $.custom_feedback_name = ''; $.custom_feedback_speak = ''; }
                
                $.custom_feedback_marker = index + 1;
                
                //LO_page_app.show_hide_type($.custom_feedback_type)
                
                formArr +=  '<div class="in_block" data-name="custom_feedback" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline; float: left;">'+$.custom_feedback_marker+'.</div> <br>';
            
                formArr +=  '<div class="form_image">';
                formArr +=  '<div class="select_images">';
                formArr +=      '<div class="progress"><div class="bar" style="width: 0%;"></div></div>';
                formArr +=      '<span class="button">Choose File</span>';
                formArr +=      '<span class="val">'+$.custom_feedback_name+' '+$.custom_feedback_speak+'</span>';
                formArr +=  '</div><br>';
                formArr +=  'Description (this will show in feedback box)<br>';
                formArr +=  '</div>';

                formArr += '<textarea type="textarea" rows="1" cols="55" name="custom_feedback" data-type="textarea" data-json-name="text">';
                formArr += $.custom_feedback_text;
                formArr += '</textarea><br>';

                formArr += '</div>';
                //formArr += '</div>';              
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END Custom Feedback Block -->';                       
            
            }
            // END Custom Feedback Block
            
            // Tooltip Block
            if ( typeof JSONObject.tooltip !== 'undefined' ) {
                
            formArr += '<!-- Tooltip Block -->';
            formArr +=  '<div id="tooltip" class="block">';

            formArr +=      '<strong>Tooltip/Credit:</strong>';
            
            // Tooltip Data 
            $.each(JSONObject.tooltip, function(index) { 
                
                $.tooltip_text = this.text;
                $.tooltip_type = this.type;
                $.tooltip_name = this.name;
                $.tooltip_marker = index + 1;
            
                //LO_page_app.show_hide_type($.content_box_type)
                
                formArr +=  '<div class="in_block" data-name="tooltip" data-id="'+index+'">';
                
                if ( index > 0 ) {
                formArr +=  '   <div class="remove">[ - ]</div>';
                }
                
                formArr +=  '<div style="display: inline;">'+$.tooltip_marker+'.</div> ';
                formArr +=  'Label <input type="text" name="name" class="name" data-type="text" data-json-name="name" value="'+$.tooltip_name+'" size="10">';

                formArr +=  '<br>'
                formArr +=  'Content: <br>'

                formArr += '<textarea rows="2" cols="55" name="tooltip" class="text" data-type="textarea" data-json-name="text">';
                formArr += $.tooltip_text;
                formArr += '</textarea><br>';

                formArr += '</div>';                
            });
            
            formArr += '<div class="in_block add_block">';
            formArr += '    <div class="add">Add [ + ]</div>';
            formArr += '</div>';
            
            formArr += '<span class="small tips">tips</span>';
            
            formArr +=  '</div>';
            formArr +=  '<!-- END Tooltip Block -->';                       
            
            }
            // END Tooltip Block            
            
            formArr += '</div>';
            // END new form wrapper
            
            // replace div with dynamic content 
            $("#formTEMP").replaceWith(formArr);
            
            //console.log(JSON.stringify(JSONObject, null, '\t'));
            $(".colorPicker").spectrum({
                change: function(color) { console.log(this);},
                showInput: true,
                showInitial: true,
                preferredFormat: "hex",
                clickoutFiresChange:true
            });
            
            $(".remove").on("click", function(event){
                
                $.remove_parent = $(this).parents('.in_block').attr('data-name');
                $.remove_parent_id = $(this).parents('.in_block').attr('data-id');
                
                LO_page_app.destroyJSON($.remove_parent,$.remove_parent_id);
    
            });
            
            //zzzz make this a function pass in peramiters - Fixed PaulS
             $(".add_block").on("click",function(event) {
                name = event.target.parentNode.parentNode.id;
                console.log(name);
                $.count = $('.in_block[data-name="'+name+'"]').length   
                console.log($.count);
                LO_page_app.buildJSON( name, $.count );
                LO_page_app.formBuilder();
            });

            
            $("#custom_feedback .add_block").on("click", function(event){
                $.count = $('.in_block[data-name="custom_feedback"]').length    
                LO_page_app.buildJSON( 'custom_feedback', $.count );
                LO_page_app.formBuilder();
            });
            
            
            $('.select_type').on( "keyup change", LO_page_app.select_type );
                        
            $('[name=feedback_type]:checked').on( "keyup change", LO_page_app.feedback_type );
            $('[name=feedback_type]').on( "click", LO_page_app.feedback_type );
            
            $('[name=marker]').val( $.markerSelect );
            
            //
            LO_page_app.updateJSON();
            LO_page_app.fileupload();
            LO_page_app.textarea_br();
            LO_page_app.textarea_nospace();
            LO_page_app.auto_check();
            
            // Keypad
            $( ".keypad_obj" ).change( LO_page_app.keypad_obj_change ); // clone and clear object
            LO_page_app.build_keypad_events(); // build events
                                    
            $(".remove_audio").click( LO_page_app.remove_audio );
            
            // if ( console_on == true ) { console.log(JSON.stringify(JSONObject, null, '\t')); }
            
        },
        
        build_keypad_events: function( e ) {
            
            if ( console_on == true ) { console.log('build_keypad_events'); }
            
            if ( typeof JSONObject.type_object !== 'undefined' ) {
                $.each(JSONObject.type_object, function(index) { 
                    $('#type_object_form_'+index+'').off();
                    $('#type_object_form_'+index+'').on("mousedown", clickedTextField);
                }); 
            }
            
        },
        
        keypad_obj_change: function( event ) {
            
            if ( console_on == true ) { console.log('keypad_obj_change'); }
            
            $.clone_type_entry = '';
            
            field_value = $(this).val();
            field_name = $(this).attr('data-json-name');
            field_parent_id = $(this).parents('.in_block').attr('data-id'); 
            
            //if ( console_on == true ) { console.log( field_value + ' | ' +  field_name + ' | ' + field_parent_id ); }
            // 1 | type | 0 
            
            // Clone keypad box and replace it with new empty version                   
            if ( field_name == 'size' ) {
                $.clone_type_entry = $( '#type_object_form_' + field_parent_id ).clone();
                $.clone_type_entry.attr("data-htmlarray", '[]');
                $.clone_type_entry.attr("data-output", '');
                $.clone_type_entry.attr("data-charlimit", field_value);
                // $.clone_type_entry.attr("data-keypad", field_value);  
                $.clone_type_entry.html('');
                $('#type_object_form_' + field_parent_id ).replaceWith($.clone_type_entry);
                LO_page_app.build_keypad_events();                          
            } else {
                $.clone_type_entry = $( '#type_object_form_' + field_parent_id ).clone();
                $.clone_type_entry.attr("data-htmlarray", '[]');
                $.clone_type_entry.attr("data-output", '');
                // $.clone_type_entry.attr("data-charlimit", field_value);
                $.clone_type_entry.attr("data-keypad", field_value);  
                $.clone_type_entry.html('');
                $('#type_object_form_' + field_parent_id ).replaceWith($.clone_type_entry);
                LO_page_app.build_keypad_events();
            }
            
        },
        
        store_keypad: function(keypad) {
            
            if ( console_on == true ) { console.log('store_keypad'); }
                        
            $.keypad_id = $('#'+keypad).attr('data-id');    
            $.keypad_source = $('#'+keypad).attr('data-htmlarray'); 
            $.keypad_output = $('#'+keypad).attr('data-output');    
            
            $.new_keypad_source = $.keypad_source.substring(1, $.keypad_source.length-1);
            
            //0 | ["52","53","54"] | &#52;&#53;&#54;
            //alert( $.keypad_id + ' | ' + $.keypad_source + ' | ' + $.keypad_output );
            JSONObject['type_object'][$.keypad_id]['source'] = $.new_keypad_source;
            JSONObject['type_object'][$.keypad_id]['output'] = $.keypad_output;
            
        },
        
        fileupload: function ( event ) { 
            
            if ( console_on == true ) { console.log('fileupload'); }
            
            $( "#fileupload" ).attr( "data-url", "php/upload_start.php?path="+media_path.replace(/\/?$/,"") );

            $('.button').click(function(){

                file_parent = $(this).parents('.in_block').attr('data-name');
                file_parent_id = $(this).parents('.in_block').attr('data-id');          
                file_selector = '.in_block[data-name="' + file_parent + '"].in_block[data-id="' + file_parent_id + '"]';        

                $("#fileupload").trigger('click');

            })

            $('#fileupload').fileupload({
                dataType: 'json',
                done: function (e, data) {
                                        
                    $.each(data.result.files, function (index, file) {
                        
                        $.fileName = file.name;
                        $.lastThree = $.fileName.substr($.fileName.length - 3);
            
                        if ( $.lastThree == 'mp3') {
                            $(file_selector + '  .val').html( ' ' + file.name + ' uploaded <div class="speakCustomClick" data-id="'+file_parent_id+'" data-name="'+$.fileName+'" data-type="'+file_parent+'"><img src="images/speak.png"></div> <span class="remove_audio"> [ - ]</span> ');

                            $(".speakCustomClick").off('click');
                            $(".remove_audio").off('click');
                            $(".speakCustomClick").click( page_builder_app.speakClick );
                            $(".remove_audio").click( LO_page_app.remove_audio );
                        } else {
                            $(file_selector + '  .val').text( ' ' + file.name + ' uploaded');
                        }
                        
                        JSONObject[file_parent][file_parent_id]['name'] = file.name ;
                    });
        
                    // console.log(JSON.stringify(JSONObject, null, '\t'));
                    
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $(file_selector + ' .progress .bar').css(
                        'width',
                        progress + '%'
                    );
                }
            });
        
        },
        
        remove_audio: function ( event ) { 
            
            if ( console_on == true ) { console.log('remove_audio'); }
                        
            file_parent = $(this).parents('.in_block').attr('data-name');
            file_parent_id = $(this).parents('.in_block').attr('data-id');          
            file_selector = '.in_block[data-name="' + file_parent + '"].in_block[data-id="' + file_parent_id + '"]';    

            JSONObject[file_parent][file_parent_id]['name'] = '';
            $(file_selector + '  .val').text('');
            $(file_selector + ' .progress .bar').css('width', '0%');
            
            // console.log(JSON.stringify(JSONObject, null, '\t'));
        },
        
        show_hide_type: function ( type ) { 
            
            if ( console_on == true ) { console.log('show_hide_type'); }
            
            switch( type )
            {
            case 'txt':
              block_hide = 'hide'; 
              block_show = 'show'
              form_image = 'hide'
              break;
            case 'img':
              block_hide = 'hide'; 
              block_show = 'show'
              form_image = 'show'
              break;
            case 'hide':
              block_hide = 'show'; 
              block_show = 'hide'
              form_image = 'hide'
              break;
            }
            
        },
        
        textarea_br: function ( event ) { 
            
            if ( console_on == true ) { console.log('textarea_br'); }
            
            $("textarea").on("keypress", function(e){
                if ( e.which === 13 && e.shiftKey ) {
                    $(this).val(function(i,v){
                        return v + "<br>";
                    });
                }
            });
        },
        
        textarea_nospace: function ( event ) { 
            
            if ( console_on == true ) { console.log('textarea_nospace'); }
            
            $(".nospace").on("keypress", function(e){
                var typedStr = $(this).val();
                var nospaceStr = typedStr.replace(/\s+/g, '');
                $(this).val(nospaceStr);
            });
        },
        
        // updateJSON : update JSON structure on keyup
        updateJSON: function ( event ) {
            
            if ( console_on == true ) { console.log('updateJSON'); }
            
            // this should only require a few lines...
            // may need to change based on type
            
            // Use id builder to build name...
                        
            $(":input").on("keyup change", function(e) {
                                
                field_type = $(this).attr('data-type');
                field_value = $(this).val();
                field_name = $(this).attr('data-json-name');
                field_parent = $(this).parents('.in_block').attr('data-name');
                field_parent_id = $(this).parents('.in_block').attr('data-id'); 
                filename = '';
                
                // radio | horizontal | direction | cover | 0
                // radio | vertical | direction | cover | 0
                
                //alert( field_parent + ' | ' +  field_parent_id + ' | ' + field_name + ' | ' + field_value + ' | ' + field_type );   
                //console.log( 'write:' + field_parent + ' | ' +  field_parent_id + ' | ' + field_name + ' | ' + field_value + ' | ' + field_type );
                
                        
                switch( field_type )
                {
                case 'text':
                  // 
                    JSONObject[field_parent][field_parent_id][field_name] = field_value;
                  break;
                case 'select':
                  //
                    
                    if ( field_name == 'marker' || field_name == 'attempts' || field_name == 'grades' ) {
                        JSONObject[field_name] = field_value;
                    } else {
                        // This covers all but marker and check box     
                        JSONObject[field_parent][field_parent_id][field_name] = field_value;    
                        // console.log( 'write:' + field_parent + ' | ' +  field_parent_id + ' | ' + field_name + ' | ' + field_value + ' | ' + field_type );                           
                                                
                    }
                    
                    // select | feedback_not_all_correct_vo_2 | name | feedback_not_all_correct | 0
                    if ( field_name == 'name') {
                        
                        $.each( audioObject[field_parent], function(){
                            if ( this.name ==  field_value ) {
                                $.text_value = this.text;
                            }
                        });
                        
                        JSONObject[field_parent][field_parent_id].text = $.text_value;
                    }
                    
                    if ( field_parent == 'type_object') {
                                                                                
                        if ( field_name == 'type' && field_value !== '1' ) {
                            $('.in_block[data-id="'+field_parent_id+'"] .no_small').removeAttr('disabled');
                        }
                        
                        if ( field_name == 'type' && field_value == '1' ) {
                            $('.in_block[data-id="'+field_parent_id+'"] .no_small').attr('disabled','disabled');
                            if ( $('.in_block[data-id="'+field_parent_id+'"] .size').val() == null ) { 
                                alert('20 is not allowed with this keypad - reseting to 3');
                                $('.in_block[data-id="'+field_parent_id+'"] .no_small').val('20').removeAttr('selected');
                                $('.in_block[data-id="'+field_parent_id+'"] .size').val('3').attr('selected','selected');
                                $('.type_object[data-id="'+field_parent_id+'"]').attr( "data-charlimit", '3' );
                            }
                            
                        }   
            
                    }
                    
                  break;
                case 'file':
                  //
                  // file |  | undefined | undefined | title | 0                  
                  var lastIndex = field_value.lastIndexOf("\\");
                  if (lastIndex >= 0) {
                    filename = field_value.substring(lastIndex + 1);
                  }
                  
                  JSONObject[field_parent][field_parent_id][field_name] = filename;
                  break;
                case 'textarea':
                  //
                  // textarea |  | title | text | title | 0
                    JSONObject[field_parent][field_parent_id][field_name] = field_value;
                  break;
                case 'float':
                  JSONObject[field_parent][field_parent_id][field_name] = parseFloat(field_value) || 0.0;
                  break;
                case 'checkbox':
                  //
                  // checkbox | false | correct | answer | 0                
                  $('.in_block[data-name="'+field_parent+'"].in_block[data-id="'+field_parent_id+'"] .' + field_name ).is(':checked') ? JSONObject[field_parent][field_parent_id][field_name] = 'true' : JSONObject[field_parent][field_parent_id][field_name] = 'false';                       
                  break;
                case 'radio':
                  //
                  // radio | single | feedback_type | undefined | undefined
                
                    if ( field_parent == 'cover' ) {
                        if ( $( '[value="'+field_value+'"]' ).is(':checked') == true ) {
                            JSONObject[field_parent][field_parent_id][field_name] = field_value;
                        }
                    } else {
                        // This covers all but cover
                        if ( $( '[value="'+field_value+'"]' ).is(':checked') == true ) {
                            JSONObject[field_name] = field_value;
                        }                                   
                    }   
                  
                  break;
                case 'auto_check':
                  // field_type | field_value
                  // auto_check | true      
                  $('#auto_check input:checkbox' ).is(':checked') ? JSONObject['auto_check'] = 'false' : JSONObject['auto_check'] = 'true' ;
                  
                  LO_page_app.auto_check();
                    
                  break;
                
                }
                
                //console.log(JSON.stringify(JSONObject, null, '\t'));
                                                
            }).keyup(); 
            
            $(".save_form").off('click');
            $(".save_form").on("click", function(event){
                LO_page_app.save(JSONObject);
            }); 
            $('.zip_form').click(function(e){
                e.preventDefault();
                form = $('#zip_form');
                form.submit();
            });
            
            $(".speakClick").click( page_builder_app.speakClick );
            $(".speakCustomClick").click( page_builder_app.speakClick );
            
            // Keypad
            LO_page_app.build_keypad_events(); // build events
                        
        },
        
        auto_check: function ( event ) {
            
            if ( console_on == true ) { console.log('auto_check'); }
            
            // create global variable...
            //alert(JSONObject.feedback_type);
            
            if ( JSONObject.auto_check == 'false' ) {
                $('#form_attempts, .single, .multiple').hide();
            } else {
                if ( feedback_type !== '' ) {
                    $('#form_attempts, .' + feedback_type ).show();
                }
            }
        },
        
        
        // New pageEditor               
        pageEditor: function ( event ) {

// Not part of Template Page Builder            
            
            if ( console_on == true ) { console.log('pageEditor'); }
                        
            var position = '';
            if ( mode == 'edit' ) {
                                
                $.dragoptions = { 
                    stack: ".content .title, .content .content_box, .content .move_object, .content .drop_object, .content .drag_object, .content .question, .content .answer",
                    grid: [ snapGrid, snapGrid ],
                    cursor: "pointer",
                    handle: ".handle",
                    create: function( event, ui ) {
                        
                        if ( snapGrid != 1 ) {
                            position = $(this).position();
                            $.pt = Math.round( position.top / 10) * 10;
                            $.pl = Math.round( position.left / 10) * 10;

                            $(this).css({top: $.pt, left: $.pl, position:'relative'}); //absolute

                        }                       
                        
                    },
                    drag: function(event, ui) { 
                        window._isDirty = true;
                        
                        position = $(this).position();
                        $.guide_top = Math.ceil(position.top);
                        $.guide_left = Math.ceil(position.left);
                        
                        $(".handle .top", this).html( $.guide_top + '/' );  
                        $(".handle .left", this).html( $.guide_left );
                        
                        $('#imageholder div').show();
                        
                        $('#horizontal').css('top', position.top );
                        $('#vertical').css('left', position.left + 1 );
                        
                    },
                    stop: function(event, ui) { 
                        
                        $('#imageholder div').hide();
                                            
                        $.data_block = $(this).attr('data-block')
                        $.data_id = $(this).attr('data-id');
                        position = $(this).position();
                        
                        JSONObject[$.data_block][$.data_id]['top'] = position.top;
                        JSONObject[$.data_block][$.data_id]['left'] = position.left;
                                                
                        //console.log(JSON.stringify(JSONObject, null, '\t'));
                        // This causes the z-index to be reset which is not always desired
                        page_builder_app.pageBuilder();
                        LO_page_app.pageEditor();
                        
                    }
                };
                
                $( ".content .title, .content .content_box, .content .move_object, .content .drop_object, .content .drag_object, .content .question, .content .answer, .content .shading_object, .content .numberline_object, .play_button, .tooltip, .cover" ).draggable($.dragoptions).prepend('<div class="handle"><img src="images/handle.png"> <span class="readout"><span class="top"></span><span class="left"></span></span></div>');
                
            }
        }, 
        
        formScreenDown: function( event ) {
            
            if ( console_on == true ) { console.log('formScreenDown'); }
            
            $( '.form_tab' ).animate({
                top: '0px'
                }, 900, function() {
                // Animation complete.
                $('.show_form').hide();
                $('.hide_form').show();
            });
    
        },
    
        formScreenUp: function( event ) {
            
            if ( console_on == true ) { console.log('formScreenUp'); }
            
            $( '.form_tab' ).animate({
                top: '-730px'
                }, 900, function() {
                // Animation complete.
                $('.hide_form').hide();
                $('.show_form').show();
            });
            
            // Run pageBuilder when you click preview...
            LO_page_app.changeMarker();
            page_builder_app.pageBuilder();
            LO_page_app.pageEditor();
                        
        },
        
        readFeedbackJSON: function( data ) {
            
            if ( console_on == true ) { console.log('readFeedbackJSON'); }
            
            audioObject = data;
            
            //console.log(JSON.stringify(audioObject, null, '\t'));
                        
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
            soundData['path'] = 'templates/'+template+'/feedback';
                            
            //audio_app.pageBuilder();
            sm_app.setup( soundData );      

        },

        readLinksJSON: function( data ) {
            
            if ( console_on == true ) { console.log('readLinksJSON',data); }
            linksObject = data;
            var getMenuItem = function (itemData) {
                var item = $("<li>");
                if (itemData.link != "") {
                    item.append(
                        $("<a>", {
                            href: window.location.href.replace(/ps[0-9]+_[0-9]+/,itemData.link).replace(/template=ps[0-9]+/,"template="+itemData.link.split("_")[0]),
                            html: itemData.name
                        }
                    ));
                } else {
                    item.append(
                        $("<span>", {
                            html: itemData.name
                        }
                    ));
                }
                if (itemData.sub) {
                    var subList = $("<ul>");
                    $.each(itemData.sub, function () {
                            subList.append(getMenuItem(this));
                    });
                    item.append(subList);
                }
                return item;
            };
            
            var $menu = $("#build_menu");
            $.each(linksObject, function () {
                $menu.append(
                    getMenuItem(this)
                );
            });
            $menu.menu();
        },
            
        build_feedback_cycles: function( feedback_group, sound_name ) {
            
            if ( console_on == true ) { console.log('build_feedback_cycles'); }
                                    
            formArr +=  '<select name="'+feedback_group+'" class="'+feedback_group+' feedback_select" data-type="select" data-json-name="name">';
                formArr += '<option value="none">none</option>';
                            
                if (audioObject[feedback_group] !== undefined) {
                $.each(audioObject[feedback_group], function(index) { 
                
                    $.feedback_id = this.id;
                    $.feedback_name = this.name;
                    $.feedback_text = this.text;
                    $.feedback_select = this.select;
                
                    if ( $.feedback_name == sound_name ) {
                        formArr += '<option value="'+$.feedback_name+'" selected>'+$.feedback_select+'</option>';
                    } else if ( index == 0 && sound_name != 'none' ) {
                        formArr += '<option value="'+$.feedback_name+'" selected>'+$.feedback_select+'</option>';
                    } else {
                        formArr += '<option value="'+$.feedback_name+'">'+$.feedback_select+'</option>';
                    }
            
                });
                }
            
            formArr += '</select> <div class="speakClick"><img src="images/speak.png"></div>';
            
        },
                
        save: function ( JSONObject ) {
            
            if ( console_on == true ) { console.log('save'); }
            
            //console.log(JSON.stringify(JSONObject, null, '\t'));
            
            // first check if using CMS 
            
                $.new_json = JSON.stringify(JSONObject, null, '\t');
            
                $.ajax({
                    type : 'POST',
                    url : 'php/service.php',
                    dataType: "json", //dataType: "text",
                    cache: false,
                    data: ({
                        path: media_path.replace(/\/?$/, ""),
                        file: entryPoint,
                        json: $.new_json //JSON.parse($.new_json)
                    }),
                    success: function(data) {
                    
                        // CMS Post script
                        $.iteration_callback_link = '';

                        // Get iteration JSON
                        $.ajax({
                            type: 'GET',
                            url: media_path + 'manifest.json',
                            contentType: 'application/json; charset=utf-8',
                            dataType: "json",
                            cache: false,
                            success: function(data) {
                                
                                // if prompt
                                if ( confirm( 'This will SAVE your changes and CLOSE this page. Are you sure this is what you want to do?' ) ) {

                                    $.iteration_callback_link = data.callback_link;
                            
                                    data.mediaFile = media_path.replace(/\/?$/,"");
                            
                                    $.new_json = JSON.stringify(data);

                                    // This happens in iteration Builder save_to_cms        
                                    $.ajax({
                                        type : 'POST',
                                        url : $.iteration_callback_link,
                                        contentType: 'application/json; charset=utf-8',
                                        dataType: "json",
                                        processData: false,
                                        cache: false,
                                        data: $.new_json,
                                        success: function( data ) {
                                            //window.close();
                            
                                            if (data.hasErrors) {
                                               $('.save_message').append('<br><span class="red">CMS Post Error!</span>');
                                            } else {
                                               $('.save_message').append('<br><span class="green">CMS Post Sucess!</span>');
                                                window.close();
                                            }
                            
                                        }
                                    });
                                
                                } // END if prompt
                    
                                //console.log('mediaFile = ' + media_path);
                                //console.log($.new_json);

                            }, // only needed for CMS
                            error: function () {
                                
                                if( data.success == 1 ) {
                                    message = '<span class="green">File Save Success!</span>';
                                    window._isDirty = false;
                                } else {
                                    message = '<span class="red">Error: Your work was not saved</span>';
                                }  

                                $('.save_message').html(message);
                                
                            }
                        });
                        // END CMS Post script                  
                    
                        setTimeout(function() {$('.save_message').html('');}, 5000);
                    
                    }
                });
            
        }
    };

    $( document ).ready( LO_page_app.onReady );
    window._isDirty = false;
    $(":input").change(function(){ window._isDirty = true;});
    window.onbeforeunload = function() {if (_isDirty) { return "You have un-saved changes";}};
        
</script>

<script type="text/javascript" charset="utf-8">

$('#wrapper').disableSelection();

//PLUGIN: remove defult from elememets - EX.. don't select text in IE.
$.fn.disableSelection = function() {
    return this.each(function() {
        $(this).attr('unselectable', 'on')
           .css({
               '-moz-user-select':'none',
               '-webkit-user-select':'none',
               'user-select':'none',
               '-ms-user-select':'none'
           })
           .each(function() {
               this.onselectstart = function() { return false; };
           });
    });
};

</script>
    
<script type="text/javascript" charset="utf-8"> 

    var getProtocal = document.location.protocol;
    
    if ( getProtocal == 'https:' ) {
        var protocalURL = 'https://c328740.ssl.cf1.rackcdn.com/mathjax/2.1-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    } else {
        var protocalURL = 'http://cdn.mathjax.org/mathjax/2.1-latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    }
    
    document.write('<script type="text/javascript" src="'+protocalURL+'"><\/script>');
    document.getElementById("iteration").setAttribute("value", media_path.replace(/\/?$/,"").split('/').pop());

        
</script>

<script type="text/x-mathjax-config">
//This turns most math to sans-serif
MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
  var TEX = MathJax.InputJax.TeX;
  var PREFILTER = TEX.prefilterMath;
  TEX.Augment({
    prefilterMath: function (math,displaymode,script) {
      return PREFILTER.call(TEX,"\\sf{"+math+"}",displaymode,script);
    }
  });
});
</script>

<!-- Must be at bottom to work -->
<script src="js/keypad_controller.js" type="text/javascript" charset="utf-8"></script>

</body>
</html> 
