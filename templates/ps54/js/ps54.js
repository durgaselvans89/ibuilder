

var ps54 = {

	// Configuration Params
	blocksize_x: 0, //size of each individual block
	blocksize_y: 0, //size of each individual block
	quadrant: 4, //1 or 4 ONLY
	scale: null,
	dimension_x: 400,
	dimension_y: 400,
	show_scale: true,
	label_x: "x",
	label_y: "y",
	scale_x: 5,
	scale_y: 5,
	editable: false,

	pointSize: 5,
	colors: {
		"default": {
			"point": "black",
			"line": "red"
		},
		"data": {
			"point": "blue",
			"line": "blue"
		},
		"user": {
			"point": "green",
			"line": "green"
		}
	},

	// A point is {x:o,y:0}
	points: [],
	resetPoints: [],

	// A line is [{x:0,y:0},{x:1,y:1}]
	lines: [],
	resetLines: [],

	// Need to know whether we are in line or point mode
	mode: "Mode.Point",
	priorMode: null,
	MODE_LINE: "Mode.Line",
	MODE_POINT: "Mode.Point",
	MODE_DRAG: "Mode.Drag",
	MODE_SLOPE: "Mode.Slope",
	// SLOPE: false,

	paper: null,

	stage: null,
	drawLayer: null,
	typeData:[],
	getState: function() {
		// console.log("ps54.getState");

		// get the current state
		var out = {};
		var typeOut=[];
		out.quadrants = String(ps54.quadrant);
		out.colorMode = String(ps54.colorMode);
		out.coordinate_object_type = ps54.type;
		out.connect = String(ps54.connect);
		out.scale_x = String(ps54.scale_x);
		out.scale_y = String(ps54.scale_y);
		out.show_scale = String(ps54.show_scale);
		out.label_x = ps54.label_x;
		out.label_y = ps54.label_y;

		// check if connect button is turned on, and store
		if ($("#connect").hasClass("on") && ps54.connect) {
			out.object_data_open = "true";
		} else {
			out.object_data_open = "false";
		}

		// store object data
		out.coordinate_object_data = ps54.coordinate_object_data;

		// get display data
		out.user_object_data = ps54.getDisplayDataString(ps54.points, ps54.lines);

		// get answer data
		// out.coordinate_object_answer = ps54.origAnswer;
		out.fullAnswer = ps54.fullAnswer;
		// out.coordinate_object_answer = ps54.answer;
		out.slope = ps54.slope;

		for(var i=0;i<ps54.typeData.length;i++){
			typeOut[i] = {id:ps54.typeData[i].el.attr('data-id'),source:ps54.typeData[i].el.attr('data-value'),value:ps54.typeData[i].el.attr('data-htmlarray'),data:ps54.typeData[i].el.attr('data-output')};			
		}
		out.typeData = typeOut;

		return out;
	},

	setState: function(stateObject) {
		// console.log("ps54.setState");
		ps54.quadrant = eval(stateObject.quadrants);
		ps54.editable = eval(stateObject.object_data_open);
		ps54.colorMode = eval(stateObject.colorMode);
		ps54.type = stateObject.coordinate_object_type;
		ps54.connect = eval(stateObject.connect);

		// see if there is any pre definted data
		ps54.coordinate_object_data = "";
		if (stateObject.coordinate_object_data.length) {
			ps54.coordinate_object_data = stateObject.coordinate_object_data;
			var resetData = ps54.parseDisplayData(ps54.coordinate_object_data, "data");
			ps54.resetPoints = resetData.points;
			ps54.resetLines = resetData.lines;
		}

		// see if there is already user data
		if (stateObject.user_object_data) {
			var displayData = ps54.parseDisplayData(stateObject.user_object_data, "user");
			ps54.points = displayData.points;
			ps54.lines = displayData.lines;
		}

		// set scale and labels
		if (ps54.quadrant == 1) ps54.scale_x = 10;
		if (ps54.quadrant == 1) ps54.scale_y = 10;
		if (stateObject.scale_x !== "") ps54.scale_x = eval(stateObject.scale_x);
		if (stateObject.scale_y !== "") ps54.scale_y = eval(stateObject.scale_y);
		ps54.show_scale = eval(stateObject.show_scale);
		ps54.label_x = stateObject.label_x;
		ps54.label_y = stateObject.label_y;

		if (ps54.type === "Line") {
			// turn slope on
			ps54.mode = ps54.MODE_SLOPE;

			// hide connect button
			$("#connect").hide();
		} else if (ps54.connect && ps54.editable) {
			// continuation - set mode
			ps54.mode = ps54.MODE_LINE;

			// set base user data if needed
			if (!ps54.lines.length) {
				var color = (ps54.colorMode) ? ps54.colors.user.line : ps54.colors.default.line ;
				ps54.lines.push({ type: "line", color: color, points: [ps54.resetLines[ps54.resetLines.length-1].points[ps54.resetLines[ps54.resetLines.length-1].points.length-1]], id:ps54.lines.length });
			}
		}

		// store answer
		// ps54.origAnswer = stateObject.coordinate_object_answer;
		if (stateObject.fullAnswer) {
			ps54.fullAnswer = stateObject.fullAnswer;
		} else {
			ps54.fullAnswer = stateObject.coordinate_object_answer;
			if (stateObject.coordinate_object_data.length && ps54.type !== "Line") ps54.fullAnswer += "|" + stateObject.coordinate_object_data;
		}
		ps54.slope = stateObject.slope;
		
		// set mode
		ps54.setMode(ps54.mode, ps54.editable);

		if(stateObject && stateObject.typeData){
			for (i = 0; i < stateObject.typeData.length; i++) {
				$('.type_object_'+stateObject.typeData[i].id).html(stateObject.typeData[i].data);				
			}
		}
	},

	init: function(data, addSubmit) {
		console.log("ps54.init");
		var self = this;

		// set state from data
		if (data) {
			ps54.setState(data.coordinate_object[0]);
		}

		// use data if it's supplied
		if (typeof HTML5RiaAPI !== "undefined") {
			var cogAPI = HTML5RiaAPI.getInstance();
			cogAPI.setQuestionStateGetFromAPPFunction(ps54.getState);
      cogAPI.setCaptureImageFromAPPFunction(ps54.getScreenShot);

			var state = cogAPI.getQuestionState();
			if (state) ps54.setState(state);
		}

		// check if we're showing 4 quadrants or 1
		if (ps54.quadrant > 1) {
			// figure our block size and round for better placement
			ps54.blocksize_x = Math.round((ps54.dimension_x/2)/ps54.scale_x);
			ps54.blocksize_y = Math.round((ps54.dimension_y/2)/ps54.scale_y);

			// get dimensions
			ps54.dimension_x = ps54.blocksize_x * ps54.scale_x * 2;
			ps54.dimension_y = ps54.blocksize_y * ps54.scale_y * 2;
		} else {
			// figure our block size
			ps54.blocksize_x = Math.round(ps54.dimension_x/ps54.scale_x);
			ps54.blocksize_y = Math.round(ps54.dimension_y/ps54.scale_y);

			// get dimensions
			ps54.dimension_x = ps54.blocksize_x * ps54.scale_x;
			ps54.dimension_y = ps54.blocksize_y * ps54.scale_y;
		}

		// add stage in
		ps54.stage = new Kinetic.Stage({
			container: 'coordinateGridCanvas',
			width: $("#coordinateGrid").width(),
			height: $("#coordinateGrid").height()
		});

		ps54.stage.on("contentMouseup contentTouchend", function(event) {
			self.handleClick(event);
		});

		ps54.drawLayer = new Kinetic.Layer();
		// ps54.backgroundLayer = new Kinetic.Layer();
		// ps54.stage.add(ps54.backgroundLayer);
		ps54.stage.add(ps54.drawLayer);

		if (addSubmit) {
			$("#controls").append($('<button/>',{text:"Submit",id:"submitButton"}));
			$("#submitButton").click(function() {
				var tmp = GradeCogneroQuestion(ps54.getState(), 1);
				alert(tmp?"Pass":"Fail");
			});
		}

		$("#slope").click(function() {
			ps54.setMode(ps54.MODE_SLOPE);
		});

		$("#resetButton").click(function() {
			ps54.reset();
			$('.type_object.keypad_box').attr("data-htmlarray","[]");
			$('.type_object.keypad_box').html('');
		});

		$("#connect").click(function() {
			if ($(this).hasClass('on')) {
				ps54.setMode(ps54.MODE_POINT);
			} else {
				ps54.setMode(ps54.MODE_LINE);
			}
		});

		if (data) {
			ps54.draw();
		}

		ps54.renderGrid();

		if(data && data.typeData){
			for (i = 0; i < data.typeData.length; i++) {
				$('.type_object_'+data.typeData[i].id).html(data.typeData[i].data);				
			}
		}
		
		var $typeObj = $('.type_object.keypad_box');		
	    for (i = 0; i < $typeObj.length; i++) {
	       	ps54.typeData[i] = {el:$typeObj.eq(i),value:$typeObj.eq(i).attr('data-value'),htmlArr:$typeObj.eq(i).attr('data-htmlarray')};        	
		}		
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	getDisplayDataString: function(points, lines) {
		var displayString = "";

		// add points
		for (var i = 0; i < points.length; i++) {
			displayString += points[i].x + "," + points[i].y + "|";
		};

		// add lines
		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < lines[i].points.length; j++) {
				displayString += lines[i].points[j].x + "," + lines[i].points[j].y;

				if (j !== lines[i].points.length - 1) displayString += ":";
			};
			if (i !== lines.length - 1) displayString += "|";
		};

		// check if ending | is there
		if (displayString.charAt(displayString.length-1) == "|") displayString = displayString.substring(0,displayString.length-1);

		return displayString;
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	parseDisplayData: function(data, dataType) {
		var displayData = {
			points: [],
			lines: []
		}

		// make sure we actually need to do this
		if (data.length) {
			// split into lines and individual points and cycle through
			var objects = data.split('|');
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].length) {
					// split into points if it's a line
					var points = objects[i].split(':');

					// check if we have a line or a point
					if (points.length == 1 && ps54.type !== "Line" && !ps54.editable) {
						// add to points
						var color = ps54.colors.default.point;
						if (ps54.colorMode && dataType !== "answer") color = ps54.colors[dataType].point;
						displayData.points.push(ps54.getXYFromString(points[0], dataType, color));
					} else if (ps54.type == "Line" || ps54.connect) {
						// start line
						var line = { type: null, points: [], id:displayData.lines.length };
						if (ps54.type == "Line") {
							line.type = "slope";
							line.color = ps54.getRandomColor();
						} else {
							line.type = "line";
							line.color = ps54.colors.default.line;
							if (ps54.colorMode && dataType !== "answer") line.color = ps54.colors[dataType].line;
						}

						// add points
						for (var j = 0; j < points.length; j++) {
							var color = ps54.colors.default.point;
							if ((ps54.colorMode && dataType !== "answer") || ps54.type == "Line") color = line.color;
							line.points.push(ps54.getXYFromString(points[j], dataType, color));
						}

						// add line
						displayData.lines.push(line);
					}
				}
			}
		}

		return displayData;
	},

	reset: function() {
		// console.log("reset");
		ps54.points = [];
		ps54.lines = [];

		// set mode
		if (ps54.connect && ps54.editable && (ps54.mode === ps54.MODE_POINT || ps54.mode === ps54.MODE_LINE)) {
			ps54.mode = ps54.MODE_LINE;

			if (!ps54.lines.length) {
				var color = (ps54.colorMode) ? ps54.colors.user.line : ps54.colors.default.line ;
				ps54.lines.push({ type: "line", color: color, points: [ps54.resetLines[ps54.resetLines.length-1].points[ps54.resetLines[ps54.resetLines.length-1].points.length-1]], id:ps54.lines.length });
			}
		}
		ps54.setMode(ps54.mode, ps54.editable);

		ps54.draw();
	},

	setMode: function(mode, editable) {
		switch (mode) {
			case ps54.MODE_LINE:
				ps54.mode = ps54.MODE_LINE;
				if (!editable) {
					var color = (ps54.colorMode) ? ps54.colors.user.line : ps54.colors.default.line ;
					ps54.lines.push({ type: "line", color: color, points: [], id:ps54.lines.length });
				}
				$("#connect").addClass('on');
				break;
			case ps54.MODE_POINT:
				ps54.mode = ps54.MODE_POINT;
				$("#connect").removeClass('on');
				break;
			case ps54.MODE_SLOPE:
				ps54.mode = ps54.MODE_SLOPE;
				ps54.lines.push({ type: "slope", points: [], color: ps54.getRandomColor(), id:ps54.lines.length });
				$("#connect").removeClass('on');
				break;
		}
	},

	handleClick: function(event) {
		// console.log("ps54.handleClick : " + ps54.mode);
		// console.log(event);

		if (ps54.mode !== ps54.MODE_DRAG) {
			var point = ps54.getCurrentPoint(event);

			switch (ps54.mode) {
				case ps54.MODE_POINT:
					// check if point exists anywhere
					var removePoints = ps54.findAllPoints(point);

					// if point exists
					if (!removePoints.length) {
						ps54.points.push(point);
					} else {
						// remove all points
						for (var i = 0; i < removePoints.length; i++) {
							ps54.removePoint(removePoints[i].array, removePoints[i].point);
						}
						// remove empty lines
						for (var i = ps54.lines.length-1; i >= 0; i--) {
							if (!ps54.lines[i].points.length) ps54.lines.splice(i,1);
						}
						// redo line ids
						for (var i = 0; i < ps54.lines.length; i++) {
							ps54.lines[i].id = i;
						}
					}
					break;

				case ps54.MODE_LINE:
						// add point
						ps54.lines[ps54.lines.length-1].points.push(point);
					break;

				case ps54.MODE_SLOPE:

					// add point
					point.color = ps54.lines[ps54.lines.length-1].color;
					ps54.lines[ps54.lines.length-1].points.push(point);

					// only 2 points needed per slope line
					if (ps54.lines[ps54.lines.length-1].points.length == 2) {
						ps54.lines.push({ type: "slope", points: [], color: ps54.getRandomColor(), id:ps54.lines.length });
					}
					break;
			}

			ps54.draw();
		}

	},

	getCurrentPoint: function(event) {
		var relX = Math.round(event.layerX);
		var relY = Math.round(event.layerY);
		var transX = Math.round(relX / ps54.blocksize_x);
		var transY = ps54.scale_y - Math.round(relY / ps54.blocksize_y);

		// check if we're in quadrants
		if (ps54.quadrant > 1) {
			transX = Math.round(relX / ps54.blocksize_x) - ps54.scale_x;
			transY = ps54.scale_y - Math.round(relY / ps54.blocksize_y);
		}

		var point = {
			x: transX,
			y: transY,
			color: ps54.colors.default.point
		};
		if (ps54.colorMode) point.color = ps54.colors.user.point;

		return point;
	},

	findAllPoints: function(point) {
		var removePoints = [];

		// check main points
		var index = _.indexOf(ps54.points, _.findWhere(ps54.points, point));
		if (index !== -1) removePoints.push({array:ps54.points, point:ps54.points[index]});

		// check lines
		for (var i = 0; i < ps54.lines.length; i++) {
			var instances = _.where(ps54.lines[i].points, point);

			// add all instances
			for (var j = 0; j < instances.length; j++) {
				removePoints.push({array:ps54.lines[i].points, point:instances[j]});
			}
		}

		return removePoints;
	},

	draw: function() {
		var self = this;

		ps54.drawLayer.destroyChildren();
		ps54.drawLayer.clear();

		// draw all the lines
		for (var i = 0; i < ps54.lines.length; i++) {
			ps54.addLine(ps54.lines[i], true);
		}

		// draw all the points
		$.each(ps54.points, function(index, value) {
			var pixelValue = ps54.getPositionFromXY(value);
			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps54.pointSize,
				fill: value.color,
				stroke: value.color,
				strokeWidth: 1,
				draggable: true,
				dragDistance: 3,
				id: index
			});

			point.on("dragstart", function(event) {
				self.pointDragStart(event);
			});

			point.on("dragend", function(event) {
				self.pointDragEnd(event);
			});

			ps54.drawLayer.add(point);

		});

		// draw all the base lines
		for (i = 0; i < ps54.resetLines.length; i++) {
			ps54.addLine(ps54.resetLines[i], false);
		}

		// draw all the base points
		$.each(ps54.resetPoints, function(index, value) {
			var pixelValue = ps54.getPositionFromXY(value);
			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps54.pointSize,
				fill: value.color,
				stroke: value.color,
				strokeWidth: 1,
				draggable: true,
				dragDistance: 3,
				id: index
			});

			ps54.drawLayer.add(point);

		});

		ps54.drawLayer.draw();

	},

	createArrow: function(direction, color) {

		var arrowDirection = (direction) ? 1 : 0;

		var points = [];

		if (arrowDirection) {
			points = [-ps54.pointSize*1.5, -ps54.pointSize*1.5, 0, 0, -ps54.pointSize*1.5, ps54.pointSize*1.5];
		} else {
			points = [ps54.pointSize*1.5, -ps54.pointSize*1.5, 0, 0, ps54.pointSize*1.5, ps54.pointSize*1.5];
		}

		var arrow = new Kinetic.Line({
			points: points,
			stroke: color,
			strokeWidth: 3,
			fill: color,
			closed: true,
			opacity: 1,
			lineCap: "butt"
		});

		return arrow;
	},

	addPoint: function(point) {

	},

	removePoint: function(array, point) {
		array.splice(_.indexOf(array, point), 1);
	},

	addLine: function(data, draggable) {
		// console.log("ps54.addLine");
		var self = this;
		var points = [];
		var value = data.points;

		// create points array
		for (var i = 0; i < value.length; i++) {
			var pixelValue = ps54.getPositionFromXY(value[i]);
			points.push(pixelValue.x);
			points.push(pixelValue.y);
		}

		// create line and group
		var currentLine = new Kinetic.Line({
			points: points,
			stroke: data.color,
			strokeWidth: 3,
			opacity: 1,
			tension: 0,
			lineCap: "butt",
			id: data.id
		});

		var currentGroup = new Kinetic.Group({
			x: 0,
			y: 0,
			id: data.id
		});

		currentGroup.add(currentLine);

		// add dots
		var iteration = (data.type !== "slope" && _.isEqual(value[0], value[value.length-1]) && value.length !== 1) ? value.length-1 : value.length;
		for (var i = 0; i < iteration; i++) {
			var pixelValue = ps54.getPositionFromXY(value[i]);

			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps54.pointSize,
				fill: value[i].color,
				stroke: value[i].color,
				strokeWidth: 1,
				id: i,
				draggable: draggable,
				dragDistance: 3
			});

			// Need to be able to move points
			point.on("dragstart", function(event) {
				self.linePointDragStart(event, this.parent.id());
			});

			point.on("dragend", function(event) {
				self.linePointDragEnd(event, this.parent.id(), this.id());
			});

			currentGroup.add(point);
		};

		// If slope mode, add arrows and extend to end
		if (data.type == "slope") {
			// if line done, add end arrows
			if (value.length > 1) {
				var endPoints = ps54.getEndPoints(value);

				var arrowOne = ps54.createArrow(0, data.color);
				var arrowTwo = ps54.createArrow(1, data.color);

				var rotation = ps54.getLineAngle(value);

				arrowOne.rotation(rotation);
				arrowTwo.rotation(rotation);

				arrowOne.setPosition({
					x: endPoints[0].x,
					y: endPoints[0].y
				});
				arrowTwo.setPosition({
					x: endPoints[1].x,
					y: endPoints[1].y
				});
				currentGroup.add(arrowOne);
				currentGroup.add(arrowTwo);

				// update line points
				points.unshift(endPoints[0].y);
				points.unshift(endPoints[0].x);
				points.push(endPoints[1].x);
				points.push(endPoints[1].y);
				currentLine.points(points);
			}

		}

		ps54.drawLayer.add(currentGroup);

	},

	removeLine: function(line) {
		ps54.points.splice(_.indexOf(ps54.points, line), 1);
	},

	// Drag Functions
	linePointDragStart: function(event, groupID) {
		// console.log("ps54.linePointDragStart - " + groupID);
		ps54.priorMode = ps54.mode;
		ps54.mode = ps54.MODE_DRAG;
	},

	linePointDragEnd: function(event, groupID, pointID) {
		// console.log("ps54.linePointDragEnd - " + groupID);

		// only move point if it's dropped on the canvas
		if (event.target.localName === "canvas") {
			var point = ps54.getCurrentPoint(event);

			// update point
			var origPoint = $.extend(true, {}, ps54.lines[groupID].points[pointID]);
			ps54.lines[groupID].points[pointID].x = point.x;
			ps54.lines[groupID].points[pointID].y = point.y;

			// update other point if this is an end point
			if (pointID === 0 && _.isEqual(origPoint, ps54.lines[groupID].points[ps54.lines[groupID].points.length-1])) {
				ps54.lines[groupID].points[ps54.lines[groupID].points.length-1].x = point.x;
				ps54.lines[groupID].points[ps54.lines[groupID].points.length-1].y = point.y;
			} else if (pointID === ps54.lines[groupID].points.length-1 && _.isEqual(origPoint, ps54.lines[groupID].points[0])) {
				ps54.lines[groupID].points[0].x = point.x;
				ps54.lines[groupID].points[0].y = point.y;
			}
		}

		ps54.draw();
		ps54.mode = ps54.priorMode;
	},

	pointDragStart: function(event) {
		// console.log("ps54.pointDragStart");

		var chkXY = _.findWhere(ps54.points, this.getCurrentPoint(event));

		// TODO - Need to placeholder this point so that we can return it if drop is unsuccessful
		if (chkXY) {
			ps54.removePoint(ps54.points, chkXY);
		}

		ps54.priorMode = ps54.mode;
		ps54.mode = ps54.MODE_DRAG;
	},

	pointDragEnd: function(event) {
		// console.log("ps54.pointDragEnd");

		ps54.points.push(this.getCurrentPoint(event));
		ps54.draw();
		ps54.mode = ps54.priorMode;
	},

	getEndPoints: function(points) {
		// get slope
		var slope = (points[0].y - points[1].y)/(points[0].x - points[1].x);
		var endPoints = [];

		// check for straight lines
		if (slope === 0 || slope === Infinity) {
			if (slope === 0) {
				endPoints = [
					{
						x: (ps54.quadrant > 1) ? -ps54.scale_x : 0,
						y: points[0].y
					},
					{
						x: ps54.scale_x,
						y: points[0].y
					}
				]
			} else {
				endPoints = [
					{
						x: points[0].x,
						y: (ps54.quadrant > 1) ? -ps54.scale_y : 0
					},
					{
						x: points[0].x,
						y: ps54.scale_y
					}
				]
			}
		} else {
			// sloped line!
			// find left point
			var leftPoint = (points[0].x < points[1].x) ? points[0] : points[1];

			//y - 3 = (1/4)(x - 2)
			// get end points
			endPoints = [
				{
					x: -ps54.scale_x,
					y: (slope*(-ps54.scale_x-leftPoint.x)) + leftPoint.y
				},
				{
					x: ps54.scale_x,
					y: (slope*(ps54.scale_y-leftPoint.x)) + leftPoint.y
				}
			]

			// check if ends are off screen
			if (endPoints[0].y < -ps54.scale_y) {
				endPoints[0] = {
					x: (-ps54.scale_y-leftPoint.y)/slope + leftPoint.x,
					y: -ps54.scale_y
				}
			} else if (endPoints[0].y > ps54.scale_y) {
				endPoints[0] = {
					x: (ps54.scale_x-leftPoint.y)/slope + leftPoint.x,
					y: ps54.scale_y
				}
			}
			if (endPoints[1].y < -ps54.scale_y) {
				endPoints[1] = {
					x: (-ps54.scale_y-leftPoint.y)/slope + leftPoint.x,
					y: -ps54.scale_y
				}
			} else if (endPoints[1].y > ps54.scale_y) {
				endPoints[1] = {
					x: (ps54.scale_x-leftPoint.y)/slope + leftPoint.x,
					y: ps54.scale_y
				}
			}
		}

		// change endpoints to pixels
		for (var i = 0; i < endPoints.length; i++) {
			endPoints[i] = ps54.getPositionFromXY(endPoints[i]);
		};

		return endPoints;
	},

	getLineAngle: function(points) {
		// get slope
		var slope = (points[0].y - points[1].y)/(points[0].x - points[1].x);
		var rotation = -Math.atan(slope) * (180/Math.PI);

		return rotation;
	},

	getXYFromString: function(coords, type, color) {
		coords = coords.split(',');
		var point = {
			x: eval(coords[0]),
			y: eval(coords[1]),
			color: color
		}

		return point
	},

	getPositionFromXY: function(point) {
		var newPoint = {x:0,y:0};

		if (ps54.quadrant > 1) {
			var addX = (point.x >= 0) ? 2 : 0 ; // for lines
			var addY = (point.y <= 0) ? 2 : 0 ;
			newPoint.x = (point.x + ps54.scale_x) * ps54.blocksize_x + addX;
			newPoint.y = (ps54.scale_y - point.y) * ps54.blocksize_y + addY;
		} else {
			newPoint.x = point.x * ps54.blocksize_x;
			newPoint.y = (ps54.scale_y - point.y) * ps54.blocksize_y;
		}

		return newPoint;
	},

	getRandomColor: function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
	},

	getScreenShot: function() {
		// get kinetic canvas and add background
		$("#coordinate_object_set").parent().append("<canvas width='400' height='400' style='position:abosolute;left:0;top:0;'/>");
		var tempCanvas = $("#coordinate_object_set").parent().find("> canvas")[0].getContext("2d");
    tempCanvas.drawImage( ps54.ssCanvas, 0, 0);
    tempCanvas.drawImage( $("#coordinateGridCanvas canvas")[0], 0, 0);

    // Save to a data URL 
    var imgUrl = $("#coordinate_object_set").parent().find("> canvas")[0].toDataURL();
    $("#coordinate_object_set").parent().find("> canvas").remove();
    // console.log(imgUrl);

    return imgUrl;
	},

	renderGrid: function() {
		if (typeof(html2canvas) != "undefined") {
			// get image of background
			html2canvas(document.getElementById("coordinateGrid"), {
				onrendered: function(canvas) {
					ps54.ssCanvas = canvas;
				}
			});
		}
	}
}
