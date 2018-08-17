

var ps25 = {

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

	getState: function() {
		// console.log("ps25.getState");

		// get the current state
		var out = {};
		out.quadrants = String(ps25.quadrant);
		out.colorMode = String(ps25.colorMode);
		out.coordinate_object_type = ps25.type;
		out.connect = String(ps25.connect);
		out.scale_x = String(ps25.scale_x);
		out.scale_y = String(ps25.scale_y);
		out.show_scale = String(ps25.show_scale);
		out.label_x = ps25.label_x;
		out.label_y = ps25.label_y;

		// check if connect button is turned on, and store
		if ($("#connect").hasClass("on") && ps25.connect) {
			out.object_data_open = "true";
		} else {
			out.object_data_open = "false";
		}

		// store object data
		out.coordinate_object_data = ps25.coordinate_object_data;

		// get display data
		out.user_object_data = ps25.getDisplayDataString(ps25.points, ps25.lines);

		// get answer data
		// out.coordinate_object_answer = ps25.origAnswer;
		out.fullAnswer = ps25.fullAnswer;
		// out.coordinate_object_answer = ps25.answer;
		out.slope = ps25.slope;

		return out;
	},

	setState: function(stateObject) {
		// console.log("ps25.setState");
		ps25.quadrant = eval(stateObject.quadrants);
		ps25.editable = eval(stateObject.object_data_open);
		ps25.colorMode = eval(stateObject.colorMode);
		ps25.type = stateObject.coordinate_object_type;
		ps25.connect = eval(stateObject.connect);

		// see if there is any pre definted data
		if (stateObject.coordinate_object_data.length) {
			ps25.coordinate_object_data = stateObject.coordinate_object_data;
			var resetData = ps25.parseDisplayData(ps25.coordinate_object_data, "data");
			ps25.resetPoints = resetData.points;
			ps25.resetLines = resetData.lines;
		}

		// see if there is already user data
		if (stateObject.user_object_data) {
			var displayData = ps25.parseDisplayData(stateObject.user_object_data, "user");
			ps25.points = displayData.points;
			ps25.lines = displayData.lines;
		}

		// set scale and labels
		if (ps25.quadrant == 1) ps25.scale_x = 10;
		if (ps25.quadrant == 1) ps25.scale_y = 10;
		if (stateObject.scale_x !== "") ps25.scale_x = eval(stateObject.scale_x);
		if (stateObject.scale_y !== "") ps25.scale_y = eval(stateObject.scale_y);
		ps25.show_scale = eval(stateObject.show_scale);
		ps25.label_x = stateObject.label_x;
		ps25.label_y = stateObject.label_y;

		if (ps25.type === "Line") {
			// turn slope on
			ps25.mode = ps25.MODE_SLOPE;

			// hide connect button
			$("#connect").hide();
		} else if (ps25.connect && ps25.editable) {
			// continuation - set mode
			ps25.mode = ps25.MODE_LINE;

			// set base user data if needed
			if (!ps25.lines.length) {
				var color = (ps25.colorMode) ? ps25.colors.user.line : ps25.colors.default.line ;
				ps25.lines.push({ type: "line", color: color, points: [ps25.resetLines[ps25.resetLines.length-1].points[ps25.resetLines[ps25.resetLines.length-1].points.length-1]], id:ps25.lines.length });
			}
		}

		// store answer
		// ps25.origAnswer = stateObject.coordinate_object_answer;
		if (stateObject.fullAnswer) {
			ps25.fullAnswer = stateObject.fullAnswer;
		} else {
			ps25.fullAnswer = stateObject.coordinate_object_answer;
			if (stateObject.coordinate_object_data.length && ps25.type !== "Line") ps25.fullAnswer += "|" + stateObject.coordinate_object_data;
		}
		ps25.slope = stateObject.slope;
		
		// set mode
		ps25.setMode(ps25.mode, ps25.editable);
	},

	init: function(data, addSubmit) {
		console.log("ps25.init");
		var self = this;

		// set state from data
		if (data) {
			ps25.setState(data.coordinate_object[0]);
		}

		// use data if it's supplied
		if (typeof HTML5RiaAPI !== "undefined") {
			var cogAPI = HTML5RiaAPI.getInstance();
			cogAPI.setQuestionStateGetFromAPPFunction(ps25.getState);
      cogAPI.setCaptureImageFromAPPFunction(ps25.getScreenShot);

			var state = cogAPI.getQuestionState();
			if (state) ps25.setState(state);
		}

		// check if we're showing 4 quadrants or 1
		if (ps25.quadrant > 1) {
			// figure our block size and round for better placement
			ps25.blocksize_x = Math.round((ps25.dimension_x/2)/ps25.scale_x);
			ps25.blocksize_y = Math.round((ps25.dimension_y/2)/ps25.scale_y);

			// get dimensions
			ps25.dimension_x = ps25.blocksize_x * ps25.scale_x * 2;
			ps25.dimension_y = ps25.blocksize_y * ps25.scale_y * 2;
		} else {
			// figure our block size
			ps25.blocksize_x = Math.round(ps25.dimension_x/ps25.scale_x);
			ps25.blocksize_y = Math.round(ps25.dimension_y/ps25.scale_y);

			// get dimensions
			ps25.dimension_x = ps25.blocksize_x * ps25.scale_x;
			ps25.dimension_y = ps25.blocksize_y * ps25.scale_y;
		}

		// add stage in
		ps25.stage = new Kinetic.Stage({
			container: 'coordinateGridCanvas',
			width: $("#coordinateGrid").width(),
			height: $("#coordinateGrid").height()
		});

		ps25.stage.on("contentMouseup contentTouchend", function(event) {
			self.handleClick(event);
		});

		ps25.drawLayer = new Kinetic.Layer();
		// ps25.backgroundLayer = new Kinetic.Layer();
		// ps25.stage.add(ps25.backgroundLayer);
		ps25.stage.add(ps25.drawLayer);

		if (addSubmit) {
			$("#controls").append($('<button/>',{text:"Submit",id:"submitButton"}));
			$("#submitButton").click(function() {
				var tmp = GradeCogneroQuestion(ps25.getState(), 1);
				alert(tmp?"Pass":"Fail");
			});
		}

		$("#slope").click(function() {
			ps25.setMode(ps25.MODE_SLOPE);
		});

		$("#resetButton").click(function() {
			ps25.reset();
		});

		$("#connect").click(function() {
			if ($(this).hasClass('on')) {
				ps25.setMode(ps25.MODE_POINT);
			} else {
				ps25.setMode(ps25.MODE_LINE);
			}
		});

		if (data) {
			ps25.draw();
		}

		ps25.renderGrid();
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
					if (points.length == 1 && ps25.type !== "Line" && !ps25.editable) {
						// add to points
						var color = ps25.colors.default.point;
						if (ps25.colorMode && dataType !== "answer") color = ps25.colors[dataType].point;
						displayData.points.push(ps25.getXYFromString(points[0], dataType, color));
					} else if (ps25.type == "Line" || ps25.connect) {
						// start line
						var line = { type: null, points: [], id:displayData.lines.length };
						if (ps25.type == "Line") {
							line.type = "slope";
							line.color = ps25.getRandomColor();
						} else {
							line.type = "line";
							line.color = ps25.colors.default.line;
							if (ps25.colorMode && dataType !== "answer") line.color = ps25.colors[dataType].line;
						}

						// add points
						for (var j = 0; j < points.length; j++) {
							var color = ps25.colors.default.point;
							if ((ps25.colorMode && dataType !== "answer") || ps25.type == "Line") color = line.color;
							line.points.push(ps25.getXYFromString(points[j], dataType, color));
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
		ps25.points = [];
		ps25.lines = [];

		// set mode
		if (ps25.connect && ps25.editable && (ps25.mode === ps25.MODE_POINT || ps25.mode === ps25.MODE_LINE)) {
			ps25.mode = ps25.MODE_LINE;

			if (!ps25.lines.length) {
				var color = (ps25.colorMode) ? ps25.colors.user.line : ps25.colors.default.line ;
				ps25.lines.push({ type: "line", color: color, points: [ps25.resetLines[ps25.resetLines.length-1].points[ps25.resetLines[ps25.resetLines.length-1].points.length-1]], id:ps25.lines.length });
			}
		}
		ps25.setMode(ps25.mode, ps25.editable);

		ps25.draw();
	},

	setMode: function(mode, editable) {
		switch (mode) {
			case ps25.MODE_LINE:
				ps25.mode = ps25.MODE_LINE;
				if (!editable) {
					var color = (ps25.colorMode) ? ps25.colors.user.line : ps25.colors.default.line ;
					ps25.lines.push({ type: "line", color: color, points: [], id:ps25.lines.length });
				}
				$("#connect").addClass('on');
				break;
			case ps25.MODE_POINT:
				ps25.mode = ps25.MODE_POINT;
				$("#connect").removeClass('on');
				break;
			case ps25.MODE_SLOPE:
				ps25.mode = ps25.MODE_SLOPE;
				ps25.lines.push({ type: "slope", points: [], color: ps25.getRandomColor(), id:ps25.lines.length });
				$("#connect").removeClass('on');
				break;
		}
	},

	handleClick: function(event) {
		// console.log("ps25.handleClick : " + ps25.mode);
		// console.log(event);

		if (ps25.mode !== ps25.MODE_DRAG) {
			var point = ps25.getCurrentPoint(event);

			switch (ps25.mode) {
				case ps25.MODE_POINT:
					// check if point exists anywhere
					var removePoints = ps25.findAllPoints(point);

					// if point exists
					if (!removePoints.length) {
						ps25.points.push(point);
					} else {
						// remove all points
						for (var i = 0; i < removePoints.length; i++) {
							ps25.removePoint(removePoints[i].array, removePoints[i].point);
						}
						// remove empty lines
						for (var i = ps25.lines.length-1; i >= 0; i--) {
							if (!ps25.lines[i].points.length) ps25.lines.splice(i,1);
						}
						// redo line ids
						for (var i = 0; i < ps25.lines.length; i++) {
							ps25.lines[i].id = i;
						}
					}
					break;

				case ps25.MODE_LINE:
						// add point
						ps25.lines[ps25.lines.length-1].points.push(point);
					break;

				case ps25.MODE_SLOPE:

					// add point
					point.color = ps25.lines[ps25.lines.length-1].color;
					ps25.lines[ps25.lines.length-1].points.push(point);

					// only 2 points needed per slope line
					if (ps25.lines[ps25.lines.length-1].points.length == 2) {
						ps25.lines.push({ type: "slope", points: [], color: ps25.getRandomColor(), id:ps25.lines.length });
					}
					break;
			}

			ps25.draw();
		}

	},

	getCurrentPoint: function(event) {
		var relX = Math.round(event.layerX);
		var relY = Math.round(event.layerY);
		var transX = Math.round(relX / ps25.blocksize_x);
		var transY = ps25.scale_y - Math.round(relY / ps25.blocksize_y);

		// check if we're in quadrants
		if (ps25.quadrant > 1) {
			transX = Math.round(relX / ps25.blocksize_x) - ps25.scale_x;
			transY = ps25.scale_y - Math.round(relY / ps25.blocksize_y);
		}

		var point = {
			x: transX,
			y: transY,
			color: ps25.colors.default.point
		};
		if (ps25.colorMode) point.color = ps25.colors.user.point;

		return point;
	},

	findAllPoints: function(point) {
		var removePoints = [];

		// check main points
		var index = _.indexOf(ps25.points, _.findWhere(ps25.points, point));
		if (index !== -1) removePoints.push({array:ps25.points, point:ps25.points[index]});

		// check lines
		for (var i = 0; i < ps25.lines.length; i++) {
			var instances = _.where(ps25.lines[i].points, point);

			// add all instances
			for (var j = 0; j < instances.length; j++) {
				removePoints.push({array:ps25.lines[i].points, point:instances[j]});
			}
		}

		return removePoints;
	},

	draw: function() {
		var self = this;

		ps25.drawLayer.destroyChildren();
		ps25.drawLayer.clear();

		// draw all the lines
		for (var i = 0; i < ps25.lines.length; i++) {
			ps25.addLine(ps25.lines[i], true);
		}

		// draw all the points
		$.each(ps25.points, function(index, value) {
			var pixelValue = ps25.getPositionFromXY(value);
			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps25.pointSize,
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

			ps25.drawLayer.add(point);

		});

		// draw all the base lines
		for (i = 0; i < ps25.resetLines.length; i++) {
			ps25.addLine(ps25.resetLines[i], false);
		}

		// draw all the base points
		$.each(ps25.resetPoints, function(index, value) {
			var pixelValue = ps25.getPositionFromXY(value);
			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps25.pointSize,
				fill: value.color,
				stroke: value.color,
				strokeWidth: 1,
				draggable: true,
				dragDistance: 3,
				id: index
			});

			ps25.drawLayer.add(point);

		});

		ps25.drawLayer.draw();

	},

	createArrow: function(direction, color) {

		var arrowDirection = (direction) ? 1 : 0;

		var points = [];

		if (arrowDirection) {
			points = [-ps25.pointSize*1.5, -ps25.pointSize*1.5, 0, 0, -ps25.pointSize*1.5, ps25.pointSize*1.5];
		} else {
			points = [ps25.pointSize*1.5, -ps25.pointSize*1.5, 0, 0, ps25.pointSize*1.5, ps25.pointSize*1.5];
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
		// console.log("ps25.addLine");
		var self = this;
		var points = [];
		var value = data.points;

		// create points array
		for (var i = 0; i < value.length; i++) {
			var pixelValue = ps25.getPositionFromXY(value[i]);
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
			var pixelValue = ps25.getPositionFromXY(value[i]);

			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps25.pointSize,
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
				var endPoints = ps25.getEndPoints(value);

				var arrowOne = ps25.createArrow(0, data.color);
				var arrowTwo = ps25.createArrow(1, data.color);

				var rotation = ps25.getLineAngle(value);

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

		ps25.drawLayer.add(currentGroup);

	},

	removeLine: function(line) {
		ps25.points.splice(_.indexOf(ps25.points, line), 1);
	},

	// Drag Functions
	linePointDragStart: function(event, groupID) {
		// console.log("ps25.linePointDragStart - " + groupID);
		ps25.priorMode = ps25.mode;
		ps25.mode = ps25.MODE_DRAG;
	},

	linePointDragEnd: function(event, groupID, pointID) {
		// console.log("ps25.linePointDragEnd - " + groupID);

		// only move point if it's dropped on the canvas
		if (event.target.localName === "canvas") {
			var point = ps25.getCurrentPoint(event);

			// update point
			var origPoint = $.extend(true, {}, ps25.lines[groupID].points[pointID]);
			ps25.lines[groupID].points[pointID].x = point.x;
			ps25.lines[groupID].points[pointID].y = point.y;

			// update other point if this is an end point
			if (pointID === 0 && _.isEqual(origPoint, ps25.lines[groupID].points[ps25.lines[groupID].points.length-1])) {
				ps25.lines[groupID].points[ps25.lines[groupID].points.length-1].x = point.x;
				ps25.lines[groupID].points[ps25.lines[groupID].points.length-1].y = point.y;
			} else if (pointID === ps25.lines[groupID].points.length-1 && _.isEqual(origPoint, ps25.lines[groupID].points[0])) {
				ps25.lines[groupID].points[0].x = point.x;
				ps25.lines[groupID].points[0].y = point.y;
			}
		}

		ps25.draw();
		ps25.mode = ps25.priorMode;
	},

	pointDragStart: function(event) {
		// console.log("ps25.pointDragStart");

		var chkXY = _.findWhere(ps25.points, this.getCurrentPoint(event));

		// TODO - Need to placeholder this point so that we can return it if drop is unsuccessful
		if (chkXY) {
			ps25.removePoint(ps25.points, chkXY);
		}

		ps25.priorMode = ps25.mode;
		ps25.mode = ps25.MODE_DRAG;
	},

	pointDragEnd: function(event) {
		// console.log("ps25.pointDragEnd");

		ps25.points.push(this.getCurrentPoint(event));
		ps25.draw();
		ps25.mode = ps25.priorMode;
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
						x: (ps25.quadrant > 1) ? -ps25.scale_x : 0,
						y: points[0].y
					},
					{
						x: ps25.scale_x,
						y: points[0].y
					}
				]
			} else {
				endPoints = [
					{
						x: points[0].x,
						y: (ps25.quadrant > 1) ? -ps25.scale_y : 0
					},
					{
						x: points[0].x,
						y: ps25.scale_y
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
					x: -ps25.scale_x,
					y: (slope*(-ps25.scale_x-leftPoint.x)) + leftPoint.y
				},
				{
					x: ps25.scale_x,
					y: (slope*(ps25.scale_y-leftPoint.x)) + leftPoint.y
				}
			]

			// check if ends are off screen
			if (endPoints[0].y < -ps25.scale_y) {
				endPoints[0] = {
					x: (-ps25.scale_y-leftPoint.y)/slope + leftPoint.x,
					y: -ps25.scale_y
				}
			} else if (endPoints[0].y > ps25.scale_y) {
				endPoints[0] = {
					x: (ps25.scale_x-leftPoint.y)/slope + leftPoint.x,
					y: ps25.scale_y
				}
			}
			if (endPoints[1].y < -ps25.scale_y) {
				endPoints[1] = {
					x: (-ps25.scale_y-leftPoint.y)/slope + leftPoint.x,
					y: -ps25.scale_y
				}
			} else if (endPoints[1].y > ps25.scale_y) {
				endPoints[1] = {
					x: (ps25.scale_x-leftPoint.y)/slope + leftPoint.x,
					y: ps25.scale_y
				}
			}
		}

		// change endpoints to pixels
		for (var i = 0; i < endPoints.length; i++) {
			endPoints[i] = ps25.getPositionFromXY(endPoints[i]);
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

		if (ps25.quadrant > 1) {
			var addX = (point.x >= 0) ? 2 : 0 ; // for lines
			var addY = (point.y <= 0) ? 2 : 0 ;
			newPoint.x = (point.x + ps25.scale_x) * ps25.blocksize_x + addX;
			newPoint.y = (ps25.scale_y - point.y) * ps25.blocksize_y + addY;
		} else {
			newPoint.x = point.x * ps25.blocksize_x;
			newPoint.y = (ps25.scale_y - point.y) * ps25.blocksize_y;
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
    tempCanvas.drawImage( ps25.ssCanvas, 0, 0);
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
					ps25.ssCanvas = canvas;
				}
			});
		}
	}
}
