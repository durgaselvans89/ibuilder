

var ps26 = {

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
	endPoints: [],
	shadeAreas: [],
	lineIntersects: [],

	// A line is [{x:0,y:0},{x:1,y:1}]
	lines: [],
	resetLines: [],

	// Need to know whether we are in line or point mode
	mode: "Mode.Point",
	priorMode: null,
	MODE_POINT: "Mode.Point",
	MODE_POINT_CONNECT: "Mode.Point.Connect",
	MODE_LINE: "Mode.Line",
	MODE_LINE_TYPE: "Mode.Line.Type",
	MODE_LINE_SHADE: "Mode.Line.Shade",
	MODE_SEGMENT: "Mode.Segment",
	MODE_SEGMENT_ARROW: "Mode.Segment.Arrow",
	MODE_DELETE: "Mode.Delete",
	MODE_DRAG: "Mode.Drag",
	// SLOPE: false,

	paper: null,

	stage: null,
	drawLayer: null,

	getState: function() {
		// console.log("ps26.getState");

		// get the current state
		var out = {};
		out.quadrants = String(ps26.quadrant);
		out.colorMode = String(ps26.colorMode);
		out.coordinate_object_type = ps26.type;
		out.connect = String(ps26.connect);
		out.scale_x = String(ps26.scale_x);
		out.scale_y = String(ps26.scale_y);
		out.show_scale = String(ps26.show_scale);
		out.label_x = ps26.label_x;
		out.label_y = ps26.label_y;
		out.inequalities = ps26.inequalities;
		out.no_solution = ps26.no_solution;

		// check if connect button is turned on, and store
		if ($("#connect").hasClass("on") && ps26.connect) {
			out.object_data_open = "true";
		} else {
			out.object_data_open = "false";
		}

		// store object data
		out.coordinate_object_data = ps26.coordinate_object_data;

		// get display data
		out.user_object_data = ps26.getDisplayDataString(ps26.points, ps26.lines);
		if (ps26.type === "Line") out.line_object_data = ps26.getLineDataString(ps26.lines);
		if (ps26.type === "Segment") out.segment_object_data = ps26.getSegmentDataString(ps26.lines);

		// get answer data
		// out.coordinate_object_answer = ps26.origAnswer;
		out.fullAnswer = ps26.fullAnswer;
		// out.coordinate_object_answer = ps26.answer;
		out.slope = ps26.slope;

		// shade areas
		if (!ps26.shadeAreas.length) ps26.createShadeAreas();
		var shadeData = ps26.getShadeData(ps26.shadeAreas);
		out.shade_points = shadeData.points;
		out.shade_areas = shadeData.area;

		// console.log(out);
		// console.log(ps26.getScreenShot());

		return out;
	},

	setState: function(stateObject) {
		// console.log("ps26.setState");
		ps26.quadrant = eval(stateObject.quadrants);
		ps26.editable = eval(stateObject.object_data_open);
		ps26.colorMode = eval(stateObject.colorMode);
		ps26.type = stateObject.coordinate_object_type;
		ps26.connect = eval(stateObject.connect);
		ps26.inequalities = stateObject.inequalities;
		ps26.no_solution = stateObject.no_solution;

		// see if there is any pre definted data
		if (stateObject.coordinate_object_data.length) {
			ps26.coordinate_object_data = stateObject.coordinate_object_data;
			var resetData = ps26.parseDisplayData(ps26.coordinate_object_data, "data");
			ps26.resetPoints = resetData.points;
			ps26.resetLines = resetData.lines;
		}

		// see if there is already user data
		if (stateObject.user_object_data) {
			var displayData = ps26.parseDisplayData(stateObject.user_object_data, "user", stateObject.line_object_data, stateObject.segment_object_data);
			ps26.points = displayData.points;
			ps26.lines = displayData.lines;
		}

		// set scale and labels
		if (ps26.quadrant == 1) ps26.scale_x = 10;
		if (ps26.quadrant == 1) ps26.scale_y = 10;
		if (stateObject.scale_x !== "") ps26.scale_x = eval(stateObject.scale_x);
		if (stateObject.scale_y !== "") ps26.scale_y = eval(stateObject.scale_y);
		ps26.show_scale = eval(stateObject.show_scale);
		ps26.label_x = stateObject.label_x;
		ps26.label_y = stateObject.label_y;

		// set low scale values
		ps26.lowBoundX = (ps26.quadrant > 1) ? -ps26.scale_x : 0 ;
		ps26.lowBoundY = (ps26.quadrant > 1) ? -ps26.scale_y : 0 ;

		if (ps26.type === "Line") {
			// turn slope on
			ps26.mode = ps26.MODE_LINE;

			// hide connect button
			$("#connect").hide();
		} else if (ps26.type === "Segment") {
			// turn segment on
			ps26.mode = ps26.MODE_SEGMENT;
		} else if (ps26.connect && ps26.editable) {
			// continuation - set mode
			ps26.mode = ps26.MODE_POINT_CONNECT;

			// set base user data if needed
			if (!ps26.lines.length) {
				var color = (ps26.colorMode) ? ps26.colors.user.line : ps26.colors.default.line ;
				ps26.lines.push({ type: "connect", color: color, points: [ps26.resetLines[ps26.resetLines.length-1].points[ps26.resetLines[ps26.resetLines.length-1].points.length-1]], id:ps26.lines.length, dashEnabled:false });
			}
		}

		// store answer
		// ps26.origAnswer = stateObject.coordinate_object_answer;
		if (stateObject.fullAnswer) {
			ps26.fullAnswer = stateObject.fullAnswer;
		} else {
			ps26.fullAnswer = stateObject.coordinate_object_answer;
			if (stateObject.coordinate_object_data.length && (ps26.type === "Point" || (ps26.type === "Line" && eval(ps26.inequalities)))) ps26.fullAnswer += "|" + stateObject.coordinate_object_data;
		}
		ps26.slope = stateObject.slope;
		
		// set mode
		ps26.setMode(ps26.mode, ps26.editable);
	},

	init: function(data, addSubmit) {
		console.log("ps26.init");
		var self = this;

		// set state from data
		if (data) {
			ps26.setState(data.coordinate_object[0]);
		}

		// use data if it's supplied
		if (typeof HTML5RiaAPI !== "undefined") {
			var cogAPI = HTML5RiaAPI.getInstance();
			cogAPI.setQuestionStateGetFromAPPFunction(ps26.getState);
      cogAPI.setCaptureImageFromAPPFunction(ps26.getScreenShot);

			var state = cogAPI.getQuestionState();
			if (state) ps26.setState(state);
		}

		// check if we're showing 4 quadrants or 1
		if (ps26.quadrant > 1) {
			// figure our block size and round for better placement
			ps26.blocksize_x = Math.round((ps26.dimension_x/2)/ps26.scale_x);
			ps26.blocksize_y = Math.round((ps26.dimension_y/2)/ps26.scale_y);

			// get dimensions
			ps26.dimension_x = ps26.blocksize_x * ps26.scale_x * 2;
			ps26.dimension_y = ps26.blocksize_y * ps26.scale_y * 2;
		} else {
			// figure our block size
			ps26.blocksize_x = Math.round(ps26.dimension_x/ps26.scale_x);
			ps26.blocksize_y = Math.round(ps26.dimension_y/ps26.scale_y);

			// get dimensions
			ps26.dimension_x = ps26.blocksize_x * ps26.scale_x;
			ps26.dimension_y = ps26.blocksize_y * ps26.scale_y;
		}

		// add stage in
		ps26.stage = new Kinetic.Stage({
			container: 'coordinateGridCanvas',
			width: $("#coordinateGrid").width(),
			height: $("#coordinateGrid").height()
		});

		// ps26.stage.on("contentMouseup contentTouchend", function(event) {
		// 	self.handleClick(event);
		// });

		$("#coordinateGridCanvas").on("mouseup", function(event) {
			self.handleClick(event);
		});

		ps26.drawLayer = new Kinetic.Layer();
		ps26.stage.add(ps26.drawLayer);

		if (addSubmit) {
			$("#controls").append($('<button/>',{text:"Submit",id:"submitButton"}));
			$("#submitButton").click(function() {
				var tmp = GradeCogneroQuestion(ps26.getState(), 1);
				alert(tmp?"Pass":"Fail");
				// alert(tmp);
			});
		}

		// $("#slope").click(function() {
		// 	ps26.setMode(ps26.MODE_LINE);
		// });

		$("#resetButton").click(function() {
			ps26.reset();
		});

		$("#connect").click(function() {
			if ($(this).hasClass('on')) {
				ps26.setMode(ps26.MODE_POINT);
			} else {
				ps26.setMode(ps26.MODE_POINT_CONNECT);
			}
		});

		$("#lineType").click(function() {
			if ($(this).hasClass('on')) {
				ps26.setMode(ps26.MODE_LINE);
			} else {
				ps26.setMode(ps26.MODE_LINE_TYPE);
			}
		});

		$("#shade").click(function() {
			if ($(this).hasClass('on')) {
				ps26.setMode(ps26.MODE_LINE);
			} else {
				ps26.setMode(ps26.MODE_LINE_SHADE);
			}
		});

		$("#arrow").click(function() {
			if ($(this).hasClass('on')) {
				ps26.setMode(ps26.MODE_SEGMENT);
			} else {
				ps26.setMode(ps26.MODE_SEGMENT_ARROW);
			}
		});

		$("#delete").click(function() {
			if ($(this).hasClass('on')) {
				if (ps26.type === "Line") {
					ps26.setMode(ps26.MODE_LINE);
				} else {
					ps26.setMode(ps26.MODE_SEGMENT);
				}
			} else {
				ps26.setMode(ps26.MODE_DELETE);
			}
		});

		if (data) {
			ps26.draw();
		}

		ps26.renderGrid();

	},

	getLineDataString: function(lines) {
		var dashedString = ""; 

		// add lines
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].dashEnabled) {
				dashedString += "true";
			} else {
				dashedString += "false";
			}
			if (i !== lines.length - 1) dashedString += ",";
		}

		// check if ending , is there
		if (dashedString.charAt(dashedString.length-1) == ",") dashedString = dashedString.substring(0,dashedString.length-1);

		return dashedString;
	},

	getSegmentDataString: function(lines) {
		var segmentString = ""; 

		// add lines
		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < lines[i].points.length; j++) {
				if (lines[i].points[j].fillEnabled) {
					segmentString += "true";
				} else {
					segmentString += "false";
				}
				segmentString += ",";
				if (lines[i].points[j].showArrow) {
					segmentString += "true";
				} else {
					segmentString += "false";
				}

				if (j !== lines[i].points.length - 1) segmentString += ":";
			}
			if (i !== lines.length - 1) segmentString += "|";
		}

		// check if ending , is there
		if (segmentString.charAt(segmentString.length-1) == "|") segmentString = segmentString.substring(0,segmentString.length-1);

		return segmentString;
	},

	getShadeData: function(shadeAreas) {
		var shadeData = {
			points: "",
			area: ""
		}

		for (var i = 0; i < shadeAreas.length; i++) {
			for (var j = 0; j < shadeAreas[i].points.length; j++) {
				shadeData.points += shadeAreas[i].points[j].x + "," + shadeAreas[i].points[j].y;

				if (j !== shadeAreas[i].points.length - 1) shadeData.points += ":";
			}

			shadeData.area += (shadeAreas[i].line && shadeAreas[i].line.fill() === 'black') ? "true" : "false" ;

			if (i !== shadeAreas.length - 1) {
				shadeData.points += "|";
				shadeData.area += ",";
			}
		}

		// check if ending | is there
		if (shadeData.points.charAt(shadeData.points.length-1) == "|") shadeData.points = shadeData.points.substring(0,shadeData.points.length-1);

		return shadeData;
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	getDisplayDataString: function(points, lines) {
		var displayString = ""; 

		// add points
		for (var i = 0; i < points.length; i++) {
			displayString += points[i].x + "," + points[i].y + "|";
		}

		// add lines
		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < lines[i].points.length; j++) {
				displayString += lines[i].points[j].x + "," + lines[i].points[j].y;

				if (j !== lines[i].points.length - 1) displayString += ":";
			}
			if (i !== lines.length - 1) displayString += "|";
		}

		// check if ending | is there
		if (displayString.charAt(displayString.length-1) == "|") displayString = displayString.substring(0,displayString.length-1);

		return displayString;
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	parseDisplayData: function(data, dataType, lineData, segmentData) {
		var displayData = {
			points: [],
			lines: []
		}

		// make sure we actually need to do this
		if (data.length) {
			// split into lines and individual points and cycle through
			var objects = data.split('|');
			if (lineData && lineData.length) var lineDashed = lineData.split(',');
			if (segmentData && segmentData.length) var segments = segmentData.split('|');
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].length) {
					// split into points if it's a line
					var points = objects[i].split(':');
					if (segmentData && segmentData.length) var segment = segments[i].split(':');

					// check if we have a line or a point
					if (points.length == 1 && (ps26.type !== "Line" || ps26.type !== "Segment") && !ps26.editable) {
						// add to points
						var color = ps26.colors.default.point;
						if (ps26.colorMode && dataType !== "answer") color = ps26.colors[dataType].point;
						displayData.points.push(ps26.getXYFromString(points[0], dataType, color));
					} else if (ps26.type === "Line" || ps26.type === "Segment" || ps26.connect) {
						// start line with generic properties
						var line = { points: [], id:displayData.lines.length, dashEnabled:false };

						// add specific properties
						if (ps26.type === "Line") {
							line.type = "line";
							line.color = ps26.getRandomColor();
							if (lineData && lineData.length) line.dashEnabled = eval(lineDashed[i]);
						} else if (ps26.type === "Segment") {
							line.type = "segment";
							line.color = ps26.getRandomColor();
						} else {
							line.type = "connect";
							line.color = ps26.colors.default.line;
							if (ps26.colorMode && dataType !== "answer") line.color = ps26.colors[dataType].line;
						}

						// add points
						for (var j = 0; j < points.length; j++) {
							var color = ps26.colors.default.point;
							if ((ps26.colorMode && dataType !== "answer") || ps26.type === "Line" || ps26.type === "Segment") color = line.color;
							line.points.push(ps26.getXYFromString(points[j], dataType, color));
							if (segmentData && segmentData.length) {
								var segData = segment[j].split(',');
								line.points[j].fillEnabled = eval(segData[0]);
								line.points[j].showArrow = eval(segData[1]);
							}
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
		ps26.points = [];
		ps26.lines = [];

		// remove shade areas
		ps26.endPoints = [];
		ps26.shadeAreas = [];
		ps26.lineIntersects = [];

		// set mode
		switch (ps26.type) {
			case "Line" :
				ps26.mode = ps26.MODE_LINE;
				break;
			case "Segment" :
				ps26.mode = ps26.MODE_SEGMENT
				break;
			case "Point" :
				if(ps26.connect && ps26.editable) {
					ps26.mode = ps26.MODE_POINT_CONNECT;

					var color = (ps26.colorMode) ? ps26.colors.user.line : ps26.colors.default.line ;
					ps26.lines.push({ type: "connect", color: color, points: [ps26.resetLines[ps26.resetLines.length-1].points[ps26.resetLines[ps26.resetLines.length-1].points.length-1]], id:ps26.lines.length, dashEnabled:false });
				} else {
					ps26.mode = ps26.MODE_POINT;
				}
				break;
		}

		ps26.setMode(ps26.mode, ps26.editable);
		ps26.draw();
	},

	setMode: function(mode, editable) {
		$("#connect").removeClass('on');
		$("#lineType").removeClass('on');
		$("#shade").removeClass('on');
		$("#arrow").removeClass('on');
		$("#delete").removeClass('on');
		switch (mode) {
			case ps26.MODE_POINT_CONNECT:
				ps26.mode = ps26.MODE_POINT_CONNECT;
				if (!editable) {
					var color = (ps26.colorMode) ? ps26.colors.user.line : ps26.colors.default.line ;
					ps26.lines.push({ type: "connect", color: color, points: [], id:ps26.lines.length, dashEnabled:false });
				}
				$("#connect").addClass('on');
				break;
			case ps26.MODE_POINT:
				ps26.mode = ps26.MODE_POINT;
				break;
			case ps26.MODE_LINE:
				ps26.mode = ps26.MODE_LINE;
				if(ps26.lines.length === 0 || ps26.lines[ps26.lines.length-1].points.length === 2) ps26.lines.push({ type: "line", points: [], color: ps26.getRandomColor(), id:ps26.lines.length, dashEnabled:false });
				break;
			case ps26.MODE_LINE_TYPE:
				ps26.mode = ps26.MODE_LINE_TYPE;
				$("#lineType").addClass('on');
				break;
			case ps26.MODE_LINE_SHADE:
				ps26.mode = ps26.MODE_LINE_SHADE;
				if (ps26.endPoints.length) ps26.createShadeAreas();
				$("#shade").addClass('on');
				break;
			case ps26.MODE_SEGMENT:
				ps26.mode = ps26.MODE_SEGMENT;
				if(ps26.lines.length === 0 || ps26.lines[ps26.lines.length-1].points.length === 2) ps26.lines.push({ type: "segment", points: [], color: ps26.getRandomColor(), id:ps26.lines.length, dashEnabled:false });
				break;
			case ps26.MODE_SEGMENT_ARROW:
				ps26.mode = ps26.MODE_SEGMENT_ARROW;
				$("#arrow").addClass('on');
				break;
			case ps26.MODE_DELETE:
				ps26.mode = ps26.MODE_DELETE;
				$("#delete").addClass('on');
				break;
		}
		ps26.draw();
	},

	handleClick: function(event) {
		// console.log("ps26.handleClick : " + ps26.mode);
		// console.log(event);

		if (ps26.mode !== ps26.MODE_DRAG && ps26.mode !== ps26.MODE_LINE_SHADE) {
			var point = ps26.getCurrentPoint(event);

			switch (ps26.mode) {
				case ps26.MODE_POINT:
					// check if point exists anywhere
					var removePoints = ps26.findAllPoints(point);

					// if point exists
					if (!removePoints.length) {
						ps26.points.push(point);
					} else {
						// remove all points
						for (var i = 0; i < removePoints.length; i++) {
							ps26.removePoint(removePoints[i].array, removePoints[i].point);
						}
						// remove empty lines
						for (var i = ps26.lines.length-1; i >= 0; i--) {
							if (!ps26.lines[i].points.length) ps26.lines.splice(i,1);
						}
						// redo line ids
						for (var i = 0; i < ps26.lines.length; i++) {
							ps26.lines[i].id = i;
						}
					}
					break;

				case ps26.MODE_POINT_CONNECT:
						// add point
						ps26.lines[ps26.lines.length-1].points.push(point);
					break;

				case ps26.MODE_LINE:

					// add point
					point.color = ps26.lines[ps26.lines.length-1].color;
					ps26.lines[ps26.lines.length-1].points.push(point);

					// only 2 points needed per slope line
					if (ps26.lines[ps26.lines.length-1].points.length == 2) {
						ps26.lines.push({ type: "line", points: [], color: ps26.getRandomColor(), id:ps26.lines.length, dashEnabled:false });
					}
					break;

				case ps26.MODE_SEGMENT:

					// add point
					point.color = ps26.lines[ps26.lines.length-1].color;
					ps26.lines[ps26.lines.length-1].points.push(point);

					// only 2 points needed per segment line
					if (ps26.lines[ps26.lines.length-1].points.length == 2) {
						ps26.lines.push({ type: "segment", points: [], color: ps26.getRandomColor(), id:ps26.lines.length, dashEnabled:false });
					}
					break;
			}

			ps26.draw();
		}

	},

	getCurrentPoint: function(event) {
		var relX = Math.round(event.offsetX);
		var relY = Math.round(event.offsetY);
		var transX = Math.round(relX / ps26.blocksize_x);
		var transY = ps26.scale_y - Math.round(relY / ps26.blocksize_y);

		// check if we're in quadrants
		if (ps26.quadrant > 1) {
			transX = Math.round(relX / ps26.blocksize_x) - ps26.scale_x;
			transY = ps26.scale_y - Math.round(relY / ps26.blocksize_y);
		}

		var point = {
			x: transX,
			y: transY,
			fillEnabled: true,
			showArrow: false,
			color: ps26.colors.default.point
		};
		if (ps26.colorMode) point.color = ps26.colors.user.point;

		return point;
	},

	findAllPoints: function(point) {
		var removePoints = [];

		// check main points
		var index = _.indexOf(ps26.points, _.findWhere(ps26.points, point));
		if (index !== -1) removePoints.push({array:ps26.points, point:ps26.points[index]});

		// check lines
		for (var i = 0; i < ps26.lines.length; i++) {
			var instances = _.where(ps26.lines[i].points, point);

			// add all instances
			for (var j = 0; j < instances.length; j++) {
				removePoints.push({array:ps26.lines[i].points, point:instances[j]});
			}
		}

		return removePoints;
	},

	draw: function() {
		if (ps26.drawLayer) {
			var self = this;

			ps26.drawLayer.destroyChildren();
			ps26.drawLayer.clear();

			// shade areas that need to be shaded
			if (ps26.mode === ps26.MODE_LINE_SHADE && ps26.shadeAreas.length) {
				// draw shade areas
				ps26.showShadeAreas();
			}

			// draw all the lines
			ps26.endPoints = [];
			for (var i = 0; i < ps26.lines.length; i++) {
				ps26.addLine(ps26.lines[i], true);
			}

			// draw all the points
			$.each(ps26.points, function(index, value) {

				var pixelValue = ps26.getPositionFromXY(value);

				var point = new Kinetic.Circle({
					x: pixelValue.x,
					y: pixelValue.y,
					radius: ps26.pointSize,
					fill: value.color,
					stroke: value.color,
					strokeWidth: 3,
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

				ps26.drawLayer.add(point);

			});

			// draw all the base lines
			for (i = 0; i < ps26.resetLines.length; i++) {
				ps26.addLine(ps26.resetLines[i], false);
			}

			// draw all the base points
			$.each(ps26.resetPoints, function(index, value) {
				var pixelValue = ps26.getPositionFromXY(value);
				var point = new Kinetic.Circle({
					x: pixelValue.x,
					y: pixelValue.y,
					radius: ps26.pointSize,
					fill: value.color,
					stroke: value.color,
					strokeWidth: 1,
					draggable: true,
					dragDistance: 3,
					id: index
				});

				ps26.drawLayer.add(point);

			});

			ps26.drawLayer.draw();
		}

	},

	createArrow: function(direction, color) {

		var arrowDirection = (direction) ? 1 : 0;

		var points = [];

		if (arrowDirection) {
			points = [-ps26.pointSize*1.5, -ps26.pointSize*1.5, 0, 0, -ps26.pointSize*1.5, ps26.pointSize*1.5];
		} else {
			points = [ps26.pointSize*1.5, -ps26.pointSize*1.5, 0, 0, ps26.pointSize*1.5, ps26.pointSize*1.5];
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

	removePoint: function(array, point) {
		array.splice(_.indexOf(array, point), 1);
	},

	addLine: function(data, editable) {
		// console.log("ps26.addLine");
		var self = this;
		var points = [];
		var value = data.points;

		// create points array
		for (var i = 0; i < value.length; i++) {
			var pixelValue = ps26.getPositionFromXY(value[i]);
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
			id: data.id,
			dash: [10, 5],
			dashEnabled: data.dashEnabled
		});

		var currentGroup = new Kinetic.Group({
			x: 0,
			y: 0,
			id: data.id
		});

		currentGroup.add(currentLine);

		if (editable) {
			currentGroup.on("click", function(event) {
				self.handleGroupClick(event, this.id());
			});
		}

		// add dots
		var iteration = (data.type !== "line" && _.isEqual(value[0], value[value.length-1]) && value.length !== 1) ? value.length-1 : value.length;
		for (var i = 0; i < iteration; i++) {
			var pixelValue = ps26.getPositionFromXY(value[i]);

			var fillColor = value[i].color;
			if (data.dashEnabled || !value[i].fillEnabled) fillColor = 'white';

			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps26.pointSize,
				fill: fillColor,
				stroke: value[i].color,
				strokeWidth: 3,
				id: i,
				draggable: editable,
				dragDistance: 3
			});

			// Need to be able to move points
			if (editable) {
				point.on("dragstart", function(event) {
					self.linePointDragStart(event, this.parent.id());
				});

				point.on("dragend", function(event) {
					self.linePointDragEnd(event, this.parent.id(), this.id());
				});

				point.on("mouseup", function(event) {
					self.handlePointClick(event, this.parent.id(), this.id());
				});
			}

			// adding arrows in segment mode
			if (value[i].showArrow) {
				var endPoints = ps26.getEndPoints(value);

				// change endPoints to pixels
				for (var j = 0; j < endPoints.length; j++) {
					endPoints[j] = ps26.getPositionFromXY(endPoints[j]);
				}

				var pos = ps26.getArrowPositions(i, value, endPoints);
				var arrow = ps26.createArrow(pos.arrow, data.color);
				var rotation = ps26.getLineAngle(value);

				arrow.rotation(rotation);

				arrow.setPosition({
					x: endPoints[pos.arrow].x,
					y: endPoints[pos.arrow].y
				});
				currentGroup.add(arrow);

				// update line points
				if (!pos.point) {
					// first in array
					points.unshift(endPoints[pos.arrow].y);
					points.unshift(endPoints[pos.arrow].x);
				} else {
					points.push(endPoints[pos.arrow].x);
					points.push(endPoints[pos.arrow].y);
				}
				currentLine.points(points);
			}

			currentGroup.add(point);
		}

		// If slope mode, add arrows and extend to end
		if (data.type == "line") {
			// if line done, add end arrows
			if (value.length > 1) {
				var endPoints = ps26.getEndPoints(value);

				// change endPoints to pixels and add to end points array
				for (var i = 0; i < endPoints.length; i++) {
					ps26.endPoints.push(endPoints[i]);
					ps26.endPoints[ps26.endPoints.length-1].line = data.id;
					endPoints[i] = ps26.getPositionFromXY(endPoints[i]);
				}

				var arrowOne = ps26.createArrow(0, data.color);
				var arrowTwo = ps26.createArrow(1, data.color);

				var rotation = ps26.getLineAngle(value);

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
				points = [];
				points.push(endPoints[0].x);
				points.push(endPoints[0].y);
				points.push(endPoints[1].x);
				points.push(endPoints[1].y);
				currentLine.points(points);


			}
		}

		ps26.drawLayer.add(currentGroup);
	},

	getArrowPositions: function(i, points, endPoints) {
		var j = (i) ? 0 : 1;
		var position = {
			point: 0,
			arrow: 0
		};

		// see if point is left or right
		if (points[i].x > points[j].x || (points[i].x === points[j].x && points[i].y > points[j].y)) position.point = 1;

		if (!position.point) {
			// left arrow
			if (endPoints[0].x > endPoints[1].x || (endPoints[0].x === endPoints[1].x && endPoints[0].y < endPoints[1].y)) position.arrow = 1;
		} else {
			position.arrow = 1;
			if (endPoints[0].x > endPoints[1].x || (endPoints[0].x === endPoints[1].x && endPoints[0].y < endPoints[1].y)) position.arrow = 0;
		}

		return position;
	},

	createShadeAreas: function() {
		// reset areas
		ps26.shadeAreas = [];
		ps26.outerPoints = [];

		// get outer points and find intersections
		ps26.outerPoints = ps26.createOuterPoints();
		ps26.findLineIntersects();

		// check if last two points are the same - if they are, move one to the beginning to start from there
		if (ps26.isSamePoint(ps26.outerPoints[ps26.outerPoints.length-1], ps26.outerPoints[ps26.outerPoints.length-2])) ps26.outerPoints.unshift(ps26.outerPoints.pop());

		// go around outside of graph to get outside shapes
		for (var i = 1; i < ps26.outerPoints.length; i++) {
			// make sure we actually have a shape here
			if (ps26.outerPoints[i].x !== ps26.outerPoints[i-1].x || ps26.outerPoints[i].y !== ps26.outerPoints[i-1].y) {
				var shape = [$.extend(true, {}, ps26.outerPoints[i-1]), $.extend(true, {}, ps26.outerPoints[i])];
				var downLine = false;

				// execute until the shape is closed
				while (!ps26.isSamePoint(shape[shape.length-1], shape[0])) {
					// figure out if point is corner point not attached to a line
					if (shape[shape.length-1].line === undefined) {
						// corner point
						if (!downLine) {
							i++;
							if (i < ps26.outerPoints.length) {
								shape.push($.extend(true, {}, ps26.outerPoints[i]));
							} else {
								shape.push($.extend(true, {}, ps26.outerPoints[0]));
							}
						} else {
							for (var j = 0; j < ps26.outerPoints.length; j++) {
								if (ps26.isSamePoint(ps26.outerPoints[j], shape[shape.length-1])) {
									var k = (j+1 < ps26.outerPoints.length) ? j+1 : 0 ;
									shape.push($.extend(true, {}, ps26.outerPoints[k]));
									break;
								}
							}
						}
					} else if (ps26.lastTwoAreEndsOfSameLine(shape[shape.length-1], shape[shape.length-2])) {
						// all the way down a line
						downLine = true;
						for (var j = 0; j < ps26.outerPoints.length; j++) {
							if (ps26.isSamePoint(ps26.outerPoints[j], shape[shape.length-1])) {
								shape.push($.extend(true, {}, ps26.outerPoints[j+1]));
								break;
							}
						}
					} else {
						// end or intersection point
						shape.push(ps26.getNextShapePoint(shape[shape.length-1]));
					}
				}

				ps26.shadeAreas.push({points:shape});
			}
		}

		// cycle through intersection points to get insides shapes
		if (ps26.lineIntersects.length > 1) {
			for (var i = 0; i < ps26.lineIntersects.length; i++) {
				if(ps26.lineIntersects[i].length > 1) {
					for (var j = 0; j < ps26.lineIntersects[i].length; j++) {
						for (var k = 0; k < ps26.lineIntersects[i][j].lines.length; k++) {
							// create start point and shape
							var startPoint = $.extend(true, {}, ps26.lineIntersects[i][j]);
							startPoint.line = ps26.lineIntersects[i][j].lines[k];
							startPoint.direction = "left";
							var shape = [startPoint];

							// execute until the shape is closed
							while ((!ps26.isSamePoint(shape[shape.length-1], shape[0]) || shape.length == 1) && !ps26.isEndPoint(shape[shape.length-1])) {
								shape.push(ps26.getNextShapePoint(shape[shape.length-1]));
							}

							// if last point in new shape isn't an end point - add it
							if (!ps26.isEndPoint(shape[shape.length-1])) ps26.shadeAreas.push({points:shape});
						}
					}
				}
			}
		}

		// compare to make sure no duplicates
		for (var i = ps26.shadeAreas.length-1; i >= 0; i--) {
			var duplicate = false;
			var dupArea1 = $.extend(true, [], ps26.shadeAreas[i].points);
			dupArea1.pop();

			// test against rest of areas
			for (var j = i-1; j >= 0; j--) {
				var dupArea2 = $.extend(true, [], ps26.shadeAreas[j].points);
				dupArea2.pop();

				// test
				duplicate = ps26.areSameShape(dupArea1, dupArea2);

				// if duplicate found, then remove this item and stop testing this one
				if (duplicate) {
					ps26.shadeAreas.splice(i,1);
					break;
				}
			}
		}
		// console.log(ps26.shadeAreas);
	},

	areSameShape: function(shape1, shape2) {
		if (shape1.length !== shape2.length) return false;
		for (var i = 0; i < shape1.length; i++) {
			var dup = false;
			for (var j = 0; j < shape2.length; j++) {
				dup = ps26.isSamePoint(shape1[i], shape2[j]);
				if (dup) break;
			}
			if (!dup) return false;
		}
		return true;
	},

	getNextShapePoint: function(prevPoint) {
		var newPoint = $.extend(true, {}, prevPoint);
		var newLine = prevPoint.line;
		var newDirection = "";

		// determine if it's an end or intersection prevPoint
		if (prevPoint.x === ps26.scale_x || prevPoint.x === ps26.lowBoundX || prevPoint.y === ps26.scale_y || prevPoint.y === ps26.lowBoundY) {
			// prevPoint is end
			// get movement direction
			newDirection = "down";
			if (prevPoint.x === ps26.scale_x) newDirection = "left";
			if (prevPoint.y === ps26.lowBoundY) newDirection = "up";
			if (prevPoint.x === ps26.lowBoundX) newDirection = "right";
		} else {
			// intersection point
			var prevDirection = prevPoint.direction;
			var prevLine = prevPoint.line;
			var prevSlope = (ps26.lines[prevLine].points[0].y - ps26.lines[prevLine].points[1].y)/(ps26.lines[prevLine].points[0].x - ps26.lines[prevLine].points[1].x);
			
			// figure out which line to use if more than 2 lines create intersection
			var intersectingLines = _.where(this.lineIntersects[prevPoint.line], {x:prevPoint.x,y:prevPoint.y});
			if (intersectingLines.length > 1) {
				// cycle through points and find smaller angle
				var angle = 181;
				var intersectionObject = {};
				for (var i = 0; i < intersectingLines.length; i++) {
					var tempLine = (prevLine === intersectingLines[i].lines[0]) ? intersectingLines[i].lines[1] : intersectingLines[i].lines[0];
					var tempSlope = (ps26.lines[tempLine].points[0].y - ps26.lines[tempLine].points[1].y)/(ps26.lines[tempLine].points[0].x - ps26.lines[tempLine].points[1].x);
					var tempDirection = this.findNewDirection(prevDirection, prevSlope, tempSlope);
					
					// get new points
					var reverseDirection = "";
					switch(prevDirection) {
						case "down":
							reverseDirection = "up";
							break;
						case "left":
							reverseDirection = "right";
							break;
						case "up":
							reverseDirection = "down";
							break;
						case "right":
							reverseDirection = "left";
							break;
					}
					var preLinePoint = this.getNextPointOnLine(reverseDirection,prevPoint,prevLine,prevSlope);
					var tempLinePoint = this.getNextPointOnLine(tempDirection,prevPoint,tempLine,tempSlope);

					// get line lengths
					var preLength = Math.sqrt(Math.pow(prevPoint.x - preLinePoint.x,2)+Math.pow(prevPoint.y - preLinePoint.y,2));
					var tempLength = Math.sqrt(Math.pow(prevPoint.x - tempLinePoint.x,2)+Math.pow(prevPoint.y - tempLinePoint.y,2));
					var hypLength = Math.sqrt(Math.pow(preLinePoint.x - tempLinePoint.x,2)+Math.pow(preLinePoint.y - tempLinePoint.y,2));

					// get angle value
					var newAngle = Math.acos((Math.pow(hypLength,2)-Math.pow(preLength,2)-Math.pow(tempLength,2))/(-2*preLength*tempLength)) * 180/Math.PI;
					if (newAngle < angle) {
						angle = newAngle;
						intersectionObject = intersectingLines[i];
					}
				}

				// get new line
				newLine = (prevLine === intersectionObject.lines[0]) ? intersectionObject.lines[1] : intersectionObject.lines[0];
			} else {
				newLine = (prevLine === prevPoint.lines[0]) ? prevPoint.lines[1] : prevPoint.lines[0];
			}
			var newSlope = (ps26.lines[newLine].points[0].y - ps26.lines[newLine].points[1].y)/(ps26.lines[newLine].points[0].x - ps26.lines[newLine].points[1].x);
			newDirection = this.findNewDirection(prevDirection, prevSlope, newSlope);
		}

		// find new prevPoint
		var difference = 0;
		switch(newDirection) {
			case "down":
				difference = ps26.scale_y*2;
				// find intersection point
				for (var i = 0; i < ps26.lineIntersects[newLine].length; i++) {
					if (ps26.lineIntersects[newLine][i].y < prevPoint.y && (prevPoint.y - ps26.lineIntersects[newLine][i].y) < difference) {
						difference = prevPoint.y - ps26.lineIntersects[newLine][i].y;
						newPoint = $.extend(true, {}, ps26.lineIntersects[newLine][i]);
					}
				}
				// if it's still the same point - get end point in that direction
				if (ps26.isSamePoint(newPoint, prevPoint)) {
					for (var i = 0; i < ps26.outerPoints.length; i++) {
						if (ps26.outerPoints[i].line == newLine && ps26.outerPoints[i].y < newPoint.y) newPoint = $.extend(true, {}, ps26.outerPoints[i]);
					}
				}
				break;
			case "left":
				difference = ps26.scale_x*2;
				for (var i = 0; i < ps26.lineIntersects[newLine].length; i++) {
					if (ps26.lineIntersects[newLine][i].x < prevPoint.x && (prevPoint.x - ps26.lineIntersects[newLine][i].x) < difference) {
						difference = prevPoint.x - ps26.lineIntersects[newLine][i].x;
						newPoint = $.extend(true, {}, ps26.lineIntersects[newLine][i]);
					}
				}
				// if it's still the same point - get end point in that direction
				if (ps26.isSamePoint(newPoint, prevPoint)) {
					for (var i = 0; i < ps26.outerPoints.length; i++) {
						if (ps26.outerPoints[i].line == newLine && ps26.outerPoints[i].x < newPoint.x) newPoint = $.extend(true, {}, ps26.outerPoints[i]);
					}
				}
				break;
			case "up":
				difference = ps26.scale_y*2;
				for (var i = 0; i < ps26.lineIntersects[newLine].length; i++) {
					if (ps26.lineIntersects[newLine][i].y > prevPoint.y && (ps26.lineIntersects[newLine][i].y - prevPoint.y) < difference) {
						difference = ps26.lineIntersects[newLine][i].y - prevPoint.y;
						newPoint = $.extend(true, {}, ps26.lineIntersects[newLine][i]);
					}
				}
				// if it's still the same point - get end point in that direction
				if (ps26.isSamePoint(newPoint, prevPoint)) {
					for (var i = 0; i < ps26.outerPoints.length; i++) {
						if (ps26.outerPoints[i].line == newLine && ps26.outerPoints[i].y > newPoint.y) newPoint = $.extend(true, {}, ps26.outerPoints[i]);
					}
				}
				break;
			case "right":
				difference = ps26.scale_x*2;
				for (var i = 0; i < ps26.lineIntersects[newLine].length; i++) {
					if (ps26.lineIntersects[newLine][i].x > prevPoint.x && (ps26.lineIntersects[newLine][i].x - prevPoint.x) < difference) {
						difference = ps26.lineIntersects[newLine][i].x - prevPoint.x;
						newPoint = $.extend(true, {}, ps26.lineIntersects[newLine][i]);
					}
				}
				// if it's still the same point - get end point in that direction
				if (ps26.isSamePoint(newPoint, prevPoint)) {
					for (var i = 0; i < ps26.outerPoints.length; i++) {
						if (ps26.outerPoints[i].line == newLine && ps26.outerPoints[i].x > newPoint.x) newPoint = $.extend(true, {}, ps26.outerPoints[i]);
					}
				}
				break;
		}

		// add line property so we know what line we came down
		newPoint.line = newLine;
		newPoint.direction = newDirection;

		return newPoint;
	},

	findNewDirection: function(prevDirection, prevSlope, newSlope) {
		var newDirection = "";

		switch(prevDirection) {
			case "down":
				newDirection = "left";
				if (prevSlope > 0 && (Math.abs(newSlope) == Infinity || (newSlope > 0 && newSlope > prevSlope))) newDirection = "up";
				if (prevSlope < 0 && (Math.abs(newSlope) == Infinity || (newSlope < 0 && newSlope < prevSlope))) newDirection = "down";
				break;
			case "left":
				newDirection = "up";
				if (prevSlope > 0 && (newSlope == 0 || (newSlope > 0 && newSlope < prevSlope))) newDirection = "left";
				if (prevSlope < 0 && (newSlope == 0 || (newSlope < 0 && newSlope > prevSlope))) newDirection = "right";
				break;
			case "up":
				newDirection = "right";
				if (prevSlope > 0 && (Math.abs(newSlope) == Infinity || (newSlope > 0 && newSlope > prevSlope))) newDirection = "down";
				if (prevSlope < 0 && (Math.abs(newSlope) == Infinity || (newSlope < 0 && newSlope < prevSlope))) newDirection = "up";
				break;
			case "right":
				newDirection = "down";
				if (prevSlope > 0 && (newSlope == 0 || (newSlope > 0 && newSlope < prevSlope))) newDirection = "right";
				if (prevSlope < 0 && (newSlope == 0 || (newSlope < 0 && newSlope > prevSlope))) newDirection = "left";
				break;
		}

		return newDirection;
	},

	getNextPointOnLine: function(direction, point, line, slope) {
		var newPoint = {};
		if (Math.abs(slope) === Infinity) {
			newPoint.x = ps26.lines[line].points[0].x;

			switch(direction) {
				case "down":
				case "right":
					newPoint.y = point.y-1;
					break;
				case "up":
				case "left":
					newPoint.y = point.y+1;
					break;
			}
		} else {
			var intercept = ps26.lines[line].points[0].y - slope*ps26.lines[line].points[0].x;

			switch(direction) {
				case "down":
					newPoint.y = point.y-1;
					newPoint.x = (newPoint.y - intercept)/slope;
					break;
				case "left":
					newPoint.x = point.x-1;
					newPoint.y = slope*newPoint.x + intercept;
					break;
				case "up":
					newPoint.y = point.y+1;
					newPoint.x = (newPoint.y - intercept)/slope;
					break;
				case "right":
					newPoint.x = point.x+1;
					newPoint.y = slope*newPoint.x + intercept;
					break;
			}
		}

		return newPoint;
	},

	isSamePoint: function(a, b) {
		if (a.x == b.x && a.y == b.y) return true;
		return false;
	},

	lastTwoAreEndsOfSameLine: function(a, b) {
		if ((a.x === ps26.scale_x || a.x === ps26.lowBoundX || a.y === ps26.scale_y || a.y === ps26.lowBoundY) && (b.x === ps26.scale_x || b.x === ps26.lowBoundX || b.y === ps26.scale_y || b.y === ps26.lowBoundY)) {
			if (a.line == b.line) return true;
		}
		return false;
	},

	isEndPoint: function(a) {
		if (a.x === ps26.scale_x || a.x === ps26.lowBoundX || a.y === ps26.scale_y || a.y === ps26.lowBoundY) return true;
		return false;
	},

	createOuterPoints: function() {
		var topPoints = [];
		var rightPoints = [];
		var bottomPoints = [];
		var leftPoints = [];

		// split end points
		for (var i = 0; i < ps26.endPoints.length; i++) {
			if (ps26.endPoints[i].x === ps26.lowBoundX) {
				if (ps26.endPoints[i].y !== ps26.lowBoundY) {
					leftPoints.push(ps26.endPoints[i]);
				} else {
					bottomPoints.push(ps26.endPoints[i]);
				}
			}
			if (ps26.endPoints[i].x === ps26.scale_x) {
				if (ps26.endPoints[i].y !== ps26.scale_y) {
					rightPoints.push(ps26.endPoints[i]);
				} else {
					topPoints.push(ps26.endPoints[i]);
				}
			}
			if (ps26.endPoints[i].y === ps26.lowBoundY) {
				if (ps26.endPoints[i].x !== ps26.scale_x) {
					bottomPoints.push(ps26.endPoints[i]);
				} else {
					rightPoints.push(ps26.endPoints[i]);
				}
			}
			if (ps26.endPoints[i].y === ps26.scale_y) {
				if (ps26.endPoints[i].x !== ps26.lowBoundX) {
					topPoints.push(ps26.endPoints[i]);
				} else {
					leftPoints.push(ps26.endPoints[i]);
				}
			}
		}

		// arrange points
		topPoints = _.sortBy(topPoints, function(point){ return point.x; });
		rightPoints = _.sortBy(rightPoints, function(point){ return -point.y; });
		bottomPoints = _.sortBy(bottomPoints, function(point){ return -point.x; });
		leftPoints = _.sortBy(leftPoints, function(point){ return point.y; });

		// check if any points are equal to the corners, add in if not
		if ((topPoints.length && topPoints[topPoints.length-1].x !== ps26.scale_x) || topPoints.length === 0) topPoints.push({x:ps26.scale_x,y:ps26.scale_y});
		if ((rightPoints.length && rightPoints[rightPoints.length-1].y !== ps26.lowBoundY) || rightPoints.length === 0) rightPoints.push({x:ps26.scale_x,y:ps26.lowBoundY});
		if ((bottomPoints.length && bottomPoints[bottomPoints.length-1].x !== ps26.lowBoundX) || bottomPoints.length === 0) bottomPoints.push({x:ps26.lowBoundX,y:ps26.lowBoundY});
		if ((leftPoints.length && leftPoints[leftPoints.length-1].y !== ps26.scale_y) || leftPoints.length === 0) leftPoints.push({x:ps26.lowBoundX,y:ps26.scale_y});

		// combine points
		if (topPoints.length > 1) {
			return topPoints.concat(rightPoints, bottomPoints, leftPoints);
		} else {
			return rightPoints.concat(bottomPoints, leftPoints, topPoints);
		}
	},

	findLineIntersects: function() {
		ps26.lineIntersects = [];

		// create all
		for (var i = 0; i < ps26.lines.length; i++) {
			if (ps26.lines[i].points.length) ps26.lineIntersects[i] = [];
		}

		// find intersects
		for (var i = 0; i < ps26.lines.length; i++) {
			if (ps26.lines[i].points.length !== 2) continue;
			var slope1 = (ps26.lines[i].points[0].y - ps26.lines[i].points[1].y)/(ps26.lines[i].points[0].x - ps26.lines[i].points[1].x);
			for (var j = i+1; j < ps26.lines.length; j++) {
				if (ps26.lines[j].points.length !== 2) continue;
				var slope2 = (ps26.lines[j].points[0].y - ps26.lines[j].points[1].y)/(ps26.lines[j].points[0].x - ps26.lines[j].points[1].x);
				if (slope1 !== slope2 && !(Math.abs(slope1) === Infinity && Math.abs(slope2) === Infinity)) {
					// find intersection
					var inter1 = ps26.lines[i].points[0].y - slope1*ps26.lines[i].points[0].x;
					var inter2 = ps26.lines[j].points[0].y - slope2*ps26.lines[j].points[0].x;

					// check if either line is straigh up and down
					if (Math.abs(slope1) !== Infinity && Math.abs(slope2) !== Infinity) {
						var intersect = { x: (inter2-inter1)/(slope1-slope2) };
						intersect.y = slope1*intersect.x + inter1;
					} else {
						if (Math.abs(slope1) === Infinity) {
							var intersect = {
								x: ps26.lines[i].points[0].x,
								y: slope2*ps26.lines[i].points[0].x + inter2
							};
						} else {
							var intersect = {
								x: ps26.lines[j].points[0].x,
								y: slope1*ps26.lines[j].points[0].x + inter1
							};
						}
					}

					// add refernces to lines that make this intersection
					intersect.lines = [i,j];

					// if actually on the screen, add to both lines intersect arrays
					if (intersect.x > ps26.lowBoundX && intersect.x < ps26.scale_x && intersect.y > ps26.lowBoundY & intersect.y < ps26.scale_y) {
						ps26.lineIntersects[i].push(intersect);
						ps26.lineIntersects[j].push(intersect);
					}
				}
			}
		}

		// TODO - Condense if more than 2 lines for an intersect
	},

	showShadeAreas: function() {
		for (var i = 0; i < ps26.shadeAreas.length; i++) {
			var points = [];
			var value = ps26.shadeAreas[i].points;

			// create points array
			for (var j = 0; j < value.length; j++) {
				var pixelValue = ps26.getPositionFromXY(value[j]);
				points.push(pixelValue.x);
				points.push(pixelValue.y);
			}

			// create line and group
			ps26.shadeAreas[i].line = new Kinetic.Line({
				points: points,
				opacity: .3,
				lineCap: "butt",
				id: i,
				closed: true,
				fill: 'transparent',

			});

			ps26.shadeAreas[i].line.on("click", function(event) {
				ps26.handleShapeClick(this);
			});

			ps26.drawLayer.add(ps26.shadeAreas[i].line);
		}
	},

	removeLine: function(line) {
		ps26.points.splice(_.indexOf(ps26.points, line), 1);
	},

	// Drag Functions
	linePointDragStart: function(event, groupID) {
		// console.log("ps26.linePointDragStart - " + groupID);
		if (ps26.mode == ps26.MODE_LINE_SHADE) ps26.mode = ps26.MODE_LINE;
		ps26.priorMode = ps26.mode;
		ps26.mode = ps26.MODE_DRAG;
	},

	linePointDragEnd: function(event, groupID, pointID) {
		// console.log("ps26.linePointDragEnd - " + groupID);

		// only move point if it's dropped on the canvas
		if (event.target.localName === "canvas") {
			var point = ps26.getCurrentPoint(event);

			// update point
			var origPoint = $.extend(true, {}, ps26.lines[groupID].points[pointID]);
			ps26.lines[groupID].points[pointID].x = point.x;
			ps26.lines[groupID].points[pointID].y = point.y;

			// update other point if this is an end point
			if (pointID === 0 && _.isEqual(origPoint, ps26.lines[groupID].points[ps26.lines[groupID].points.length-1])) {
				ps26.lines[groupID].points[ps26.lines[groupID].points.length-1].x = point.x;
				ps26.lines[groupID].points[ps26.lines[groupID].points.length-1].y = point.y;
			} else if (pointID === ps26.lines[groupID].points.length-1 && _.isEqual(origPoint, ps26.lines[groupID].points[0])) {
				ps26.lines[groupID].points[0].x = point.x;
				ps26.lines[groupID].points[0].y = point.y;
			}
		}

		// ps26.draw();
		ps26.mode = ps26.priorMode;
		ps26.setMode(ps26.mode);
	},

	pointDragStart: function(event) {
		// console.log("ps26.pointDragStart");

		var chkXY = _.findWhere(ps26.points, this.getCurrentPoint(event));

		// TODO - Need to placeholder this point so that we can return it if drop is unsuccessful
		if (chkXY) {
			ps26.removePoint(ps26.points, chkXY);
		}

		ps26.priorMode = ps26.mode;
		ps26.mode = ps26.MODE_DRAG;
	},

	pointDragEnd: function(event) {
		// console.log("ps26.pointDragEnd");

		ps26.points.push(this.getCurrentPoint(event));
		ps26.draw();
		ps26.mode = ps26.priorMode;
	},

	handleGroupClick: function(event, groupID) {
		// console.log("ps26.handleGroupClick - " + groupID);
		if (ps26.mode === ps26.MODE_LINE_TYPE) {
			ps26.lines[groupID].dashEnabled = !ps26.lines[groupID].dashEnabled;
		} else if (ps26.mode === ps26.MODE_DELETE) {
			event.stopPropagation();
			ps26.deleteLine(groupID);
			ps26.draw();
		}
	},

	handlePointClick: function(event, groupID, pointID) {
		// console.log("ps26.handlePointClick - " + groupID);
		if (ps26.mode === ps26.MODE_SEGMENT) {
			event.stopPropagation();
			ps26.lines[groupID].points[pointID].fillEnabled = !ps26.lines[groupID].points[pointID].fillEnabled;
			ps26.draw();
		} else if (ps26.mode === ps26.MODE_SEGMENT_ARROW) {
			event.stopPropagation();
			if (ps26.lines[groupID].points.length > 1) {
				ps26.lines[groupID].points[pointID].showArrow = !ps26.lines[groupID].points[pointID].showArrow;
				ps26.draw();
			}
		} else if (ps26.mode === ps26.MODE_DELETE) {
			event.stopPropagation();
			ps26.deleteLine(groupID);
			ps26.draw();
		}
	},

	handleShapeClick: function(shape) {
		// console.log("ps26.handleShapeClick - " + groupID);
		event.stopPropagation();
		if (shape.fill() !== 'black') {
			shape.fill('black');
		} else {
			shape.fill('transparent');
		}
		ps26.drawLayer.draw();
	},

	deleteLine: function(id) {
		// console.log("ps26.deleteLine");

		// remove line
		ps26.lines.splice(id,1);

		// redo line ids
		for (var i = 0; i < ps26.lines.length; i++) {
			ps26.lines[i].id = i;
		}
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
						x: (ps26.quadrant > 1) ? ps26.lowBoundX : 0,
						y: points[0].y
					},
					{
						x: ps26.scale_x,
						y: points[0].y
					}
				]
			} else {
				endPoints = [
					{
						x: points[0].x,
						y: (ps26.quadrant > 1) ? ps26.lowBoundY : 0
					},
					{
						x: points[0].x,
						y: ps26.scale_y
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
					x: ps26.lowBoundX,
					y: (slope*(ps26.lowBoundX-leftPoint.x)) + leftPoint.y
				},
				{
					x: ps26.scale_x,
					y: (slope*(ps26.scale_x-leftPoint.x)) + leftPoint.y
				}
			]

			// check if ends are off screen
			if (endPoints[0].y < ps26.lowBoundY) {
				endPoints[0] = {
					x: (ps26.lowBoundY-leftPoint.y)/slope + leftPoint.x,
					y: ps26.lowBoundY
				}
			} else if (endPoints[0].y > ps26.scale_y) {
				endPoints[0] = {
					x: (ps26.scale_y-leftPoint.y)/slope + leftPoint.x,
					y: ps26.scale_y
				}
			}
			if (endPoints[1].y < ps26.lowBoundY) {
				endPoints[1] = {
					x: (ps26.lowBoundY-leftPoint.y)/slope + leftPoint.x,
					y: ps26.lowBoundY
				}
			} else if (endPoints[1].y > ps26.scale_y) {
				endPoints[1] = {
					x: (ps26.scale_y-leftPoint.y)/slope + leftPoint.x,
					y: ps26.scale_y
				}
			}
		}

		return endPoints;
	},

	getLineAngle: function(points) {
		// get slope
		var slope = ((points[0].y - points[1].y)*ps26.blocksize_y)/((points[0].x - points[1].x)*ps26.blocksize_x);
		var rotation = -Math.atan(slope) * (180/Math.PI);

		return rotation;
	},

	getXYFromString: function(coords, type, color) {
		coords = coords.split(',');
		var point = {
			x: eval(coords[0]),
			y: eval(coords[1]),
			fillEnabled: true,
			showArrow: false,
			color: color
		}

		return point
	},

	getPositionFromXY: function(point) {
		var newPoint = {x:0,y:0};

		if (ps26.quadrant > 1) {
			var addX = (point.x >= 0) ? 2 : 0 ; // for lines
			var addY = (point.y <= 0) ? 2 : 0 ;
			newPoint.x = (point.x + ps26.scale_x) * ps26.blocksize_x + addX;
			newPoint.y = (ps26.scale_y - point.y) * ps26.blocksize_y + addY;
		} else {
			newPoint.x = point.x * ps26.blocksize_x;
			newPoint.y = (ps26.scale_y - point.y) * ps26.blocksize_y;
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
		$("#coordinate_object_set").parent().append("<canvas width='405' height='405' style='position:abosolute;left:0;top:0;'/>");
		var tempCanvas = $("#coordinate_object_set").parent().find("> canvas")[0].getContext("2d");
    tempCanvas.drawImage( ps26.ssCanvas, 0, 0);
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
			html2canvas($("#coordinateGrid")[0], {
				onrendered: function(canvas) {
					ps26.ssCanvas = canvas;
				}
			});
		}
	}
}
