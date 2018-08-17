var ps02 = {
    ssCanvas: null,	
	// Look up to enable easier parsing of color data
	cellColors : {
		"R":{"cell":"red_cell","enabled":"json_shading_object_red_check","value":"json_shading_object_red_value","array":"json_shading_object_red_array"},
		"B":{"cell":"blue_cell","enabled":"json_shading_object_blue_check","value":"json_shading_object_blue_value","array":"json_shading_object_blue_array"},
		"G":{"cell":"green_cell","enabled":"json_shading_object_green_check","value":"json_shading_object_green_value","array":"json_shading_object_green_array"},
		"Y":{"cell":"yellow_cell","enabled":"json_shading_object_yellow_check","value":"json_shading_object_yellow_value","array":"json_shading_object_yellow_array"}
	},
	

	getState : function() {
		
		// Need to apply to each shading object
		var cells = $(".shading_object_cell");
		var colors;
		var id;
	    var gridId;	
        var grid = [];
		$.each(cells, function(index) {
			colors = $(cells[index]).attr("data-color");
            if (colors.charAt(0) == ",") colors = colors.substring(1);
            gridId = $(cells[index]).parent().attr("data-id");
			id = $(cells[index]).data("id");
			grid.push( gridId + "," + id + ":" + colors );
		});
		
		return {"grid":grid.join("|")};
	},
	
	setState : function(value) {
        console.log("SetState:",value);
        ps02.clear();
        if (value == undefined) return;
		var grid = value.grid.split("|");
		
		$.each(grid, function(index) {
			var item = grid[index].split(":");
            var gridId = item[0].split(",")[0];
            var cellId = item[0].split(",")[1];
            
			if(item[1] !== "") {
				var cell = $("#shading_object_"+gridId+" #cell_" + cellId );
				var colors = item[1].split(",");
			
				$.each(colors, function(index2) {
					if(ps02.cellColors[colors[index2]]) {
                        $("input[type=radio][value="+colors[index2]+"]").click();
                        cell.mousedown();
                        cell.mouseup();
					}
				});
			}
		});
	},
	
	// Need to get data from dom elements and not from global var
	init : function (data) {
        if (window.parent && window.parent.document) {
            $("#HTML5QuestionInnerPanel",window.parent.document).css("margin","0px");
        }
		
		
		if(typeof(HTML5RiaAPI) !== "undefined") {
		    var cogAPI = HTML5RiaAPI.getInstance();
			cogAPI.setQuestionStateGetFromAPPFunction(ps02.getState);
            cogAPI.setCaptureImageFromAPPFunction(ps02.getCanvas);
			var prevState = cogAPI.getQuestionState();
		}
	
		var objects = $(".shading_object");
		$.each(objects, function(index) {
			var colors = String($(objects[index]).data("colors")).split(",");
			$.each(colors, function(index) {
				if(colors[index]) {
					var color = colors[index].split(":")[0];
					$("input[value='" + color + "']")[0].disabled = false;
					$("input[value='" + color + "']")[0].checked = true;
                    $("#radios .colorRadio input[value="+color+"]").parent().show();
                }
			});
		});
						
		$("#submitButton").click(function() {
			var correct = GradeCogneroQuestion(ps02.getState(),1);
            alert(correct?"Pass":"Fail");
		});
		
		// Add event for clear all click
		$("#clearbutton").click(function() {
			ps02.clear();
		});
        var mouseDown = 0;
        $(".shading_object_cell").on("mousedown" , function(event) { 
           mouseDown = 1;
           $(event.target).mouseenter();
        });
        document.body.onmouseup = function() {
            mouseDown = 0;
		    ps02.captureScreenShot();	
        };
        $(".shading_object").on("mouseleave", function() {
            mouseDown = 0;
		    ps02.captureScreenShot();	
        });
		
		// Add event for cell click
		$(".shading_object_cell").on("mouseenter" ,function(event) { 
            if (!mouseDown) return;
			
			var offset = 0;
			var cell;
			
			// Retieve selected color from form
			var currColor = $('input[name=colors]:checked').val();
			
			// Retrieve color data from clicked cell
			var cellColorData = $(event.currentTarget).attr("data-color").split(",");
			
			// If not allowing multiple colors
			var allowMultiple = $(this.parentNode).attr("data-multiple-cells");
						
			if($.parseJSON(allowMultiple.toLowerCase())) {
				
				// If color exists, remove. Otherwise, add
				if($.inArray(currColor, cellColorData) !== -1) {
					cellColorData.splice($.inArray(currColor, cellColorData), 1);
				} else {
					cellColorData.push(currColor);
				}
				
			} else {
				
				// If color exists, remove. Otherwise, add
				if($.inArray(currColor, cellColorData) !== -1) {
					cellColorData.splice($.inArray(currColor, cellColorData), 1);
				} else {
					cellColorData = [currColor];
				}
				
			}
			
			// Update cell data
			$(event.currentTarget).attr("data-color", cellColorData.join(","));
			
			// Clear cell
			ps02.clearCell(event.currentTarget, ps02.cellColors);
			
			if($.parseJSON(allowMultiple.toLowerCase())) {
				offset = 1;
			}
			
			// Update display
			var cellWidth = $(event.currentTarget).width()/(cellColorData.length - offset);
			
			var count = 0;
			$.each(ps02.cellColors, function(index) {
				
				if($.inArray(index, cellColorData) !== -1) {
					cell = $(event.currentTarget).find("." + ps02.cellColors[index].cell)[0];
					$(cell).width(cellWidth);
					$(cell).css('left', (cellWidth * count));
					count++;
				}
				
			});
		});
	
        if (typeof(prevState) !== "undefined") {
            ps02.setState(prevState);
        }
        MathJax.Callback.Queue([ps02.captureScreenShot]);
	},
	
	clear : function() {
		var cells = $(".shading_object_cell");
		$.each(cells, function(index) {		
			ps02.clearCell(cells[index], ps02.cellColors);
		});
        cells.attr("data-color", "");
	},
	clearCell : function(cell, colors) {
		$.each(colors, function(index) {	
			var colorCell = $(cell).find("." + colors[index].cell)[0];
			$(colorCell).width(0);
			$(colorCell).css('left', 0);
		});
    },
    getCanvas: function () {
        if (ps02.ssCanvas !== null) 
            return ps02.ssCanvas.toDataURL();
        return $("<canvas/>")[0].toDataURL();
    },
    captureScreenShot: function () {
        if (typeof(html2canvas) != "undefined") {
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    ps02.ssCanvas = canvas;
                }
            });
        }
	}
};
