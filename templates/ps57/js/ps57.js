

var ps57 = {

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

	pointSize: 5,
	pointColor: 'black',
	lineColor: 'red',

	// A point is {x:o,y:0}
	points: [],

	// A line is [{x:0,y:0},{x:1,y:1}]
	lines: [],

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
		// console.log("ps57.getState");

		// get the current state
		var out = {};
		var typeOut=[];
		out.quadrants = String(ps57.quadrant);
		if (ps57.mode == ps57.MODE_SLOPE) {
			out.coordinate_object_type = "Line";
		} else {
			out.coordinate_object_type = "Point";
		}
		if ($('#connect').is(":visible")) {
			out.connect = "true";
		} else {
			out.connect = "false";
		}
		if (ps57.mode == ps57.MODE_LINE) {
			out.object_data_open = "true";
		} else {
			out.object_data_open = "false";
		}

		// get scale and labels
		out.scale_x = String(ps57.scale_x);
		out.scale_y = String(ps57.scale_y);
		out.show_scale = String(ps57.show_scale);
		out.label_x = ps57.label_x;
		out.label_y = ps57.label_y;

		// get display data
		out.coordinate_object_data = ps57.getDisplayDataString();

		// get answer data
		// out.coordinate_object_answer = ps57.origAnswer;
		out.fullAnswer = ps57.fullAnswer;
		out.slope = ps57.origSlope;
		
		for(var i=0;i<ps57.typeData.length;i++){
			typeOut[i] = {id:ps57.typeData[i].el.attr('data-id'),source:ps57.typeData[i].el.attr('data-value'),value:ps57.typeData[i].el.attr('data-htmlarray'),data:ps57.typeData[i].el.attr('data-output')};
		}
		out.typeData = typeOut;
		// set out data
		// console.log(out);

		return out;
	},

	setState: function(stateObject) {
		// console.log("ps57.setState");
		ps57.quadrant = eval(stateObject.quadrants);
		if (stateObject.coordinate_object_data.length) {
			var displayData = ps57.parseDisplayData(stateObject.coordinate_object_data, stateObject.coordinate_object_type, eval(stateObject.connect));
			ps57.points = displayData.points;
			ps57.lines = displayData.lines;
		}

		// set scale and labels
		if (ps57.quadrant == 1) ps57.scale_x = 10;
		if (ps57.quadrant == 1) ps57.scale_y = 10;
		if (stateObject.scale_x !== "") ps57.scale_x = eval(stateObject.scale_x);
		if (stateObject.scale_y !== "") ps57.scale_y = eval(stateObject.scale_y);
		ps57.show_scale = eval(stateObject.show_scale);
		ps57.label_x = stateObject.label_x;
		ps57.label_y = stateObject.label_y;

		if (stateObject.coordinate_object_type === "Line") {
			// turn slope on
			ps57.mode = ps57.MODE_SLOPE;
		} else if (eval(stateObject.connect)) {
			// set mode
			if(eval(stateObject.object_data_open)) ps57.mode = ps57.MODE_LINE;
		}

		// store answer
		// ps57.origAnswer = stateObject.coordinate_object_answer;
		if (stateObject.fullAnswer) {
			ps57.fullAnswer = stateObject.fullAnswer;
		} else {
			ps57.fullAnswer = stateObject.coordinate_object_answer;
			if (stateObject.coordinate_object_data !== "" && !eval(stateObject.object_data_open)) ps57.fullAnswer += "|" + stateObject.coordinate_object_data;
		}
		ps57.origSlope = stateObject.slope;
		
		// set mode
		ps57.setMode(ps57.mode, eval(stateObject.object_data_open));
		if(stateObject && stateObject.typeData){
			for (i = 0; i < stateObject.typeData.length; i++) {
				$('.type_object_'+stateObject.typeData[i].id).html(stateObject.typeData[i].data);				
			}
		}
	},

	init: function(data, addSubmit) {
		// console.log("ps57.init");
		var self = this;

		// set state from data
		if (data) {
			ps57.setState(data.coordinate_object[0]);
		}

		// use data if it's supplied
		if (typeof HTML5RiaAPI !== "undefined") {
			var cogAPI = HTML5RiaAPI.getInstance();
			cogAPI.setQuestionStateGetFromAPPFunction(ps57.getState);

			var state = cogAPI.getQuestionState();
			if (state) ps57.setState(state);
		}

		// check if we're showing 4 quadrants or 1
		if (ps57.quadrant > 1) {
			// figure our block size and round for better placement
			ps57.blocksize_x = Math.round((ps57.dimension_x/2)/ps57.scale_x);
			ps57.blocksize_y = Math.round((ps57.dimension_y/2)/ps57.scale_y);

			// get dimensions
			ps57.dimension_x = ps57.blocksize_x * ps57.scale_x * 2;
			ps57.dimension_y = ps57.blocksize_y * ps57.scale_y * 2;
		} else {
			// figure our block size
			ps57.blocksize_x = Math.round(ps57.dimension_x/ps57.scale_x);
			ps57.blocksize_y = Math.round(ps57.dimension_y/ps57.scale_y);

			// get dimensions
			ps57.dimension_x = ps57.blocksize_x * ps57.scale_x;
			ps57.dimension_y = ps57.blocksize_y * ps57.scale_y;
		}

		// add stage in
		ps57.stage = new Kinetic.Stage({
			container: 'coordinateGridCanvas',
			width: $("#coordinateGrid").width(),
			height: $("#coordinateGrid").height()
		});

		ps57.stage.on("contentMouseup contentTouchend", function(event) {
			self.handleCLick(event);
		});

		ps57.drawLayer = new Kinetic.Layer();
		ps57.stage.add(ps57.drawLayer);

		if (addSubmit) {
			$("#controls").append($('<button/>',{text:"Submit",id:"submitButton"}));
			$("#submitButton").click(function() {
				//var tmp = GradeCogneroQuestion(ps57.getState(), 1);
				//alert(tmp==1?"Pass":"Fail");
			});
		}

		$("#slope").click(function() {
			ps57.setMode(ps57.MODE_SLOPE);
		});

		$("#clearButton").click(function() {
			ps57.clear();
			$('.type_object.keypad_box').html('');
		});

		$("#connect").click(function() {
			if ($(this).hasClass('on')) {
				ps57.setMode(ps57.MODE_POINT);
			} else {
				ps57.setMode(ps57.MODE_LINE);
			}
		});

		if (data) {
			ps57.draw();
		}
		if(data && data.typeData){
			for (i = 0; i < data.typeData.length; i++) {
				$('.type_object_'+data.typeData[i].id).html(data.typeData[i].data);				
			}
		}
		
		var $typeObj = $('.type_object.keypad_box');
        for (i = 0; i < $typeObj.length; i++) {
        	ps57.typeData[i] = {el:$typeObj.eq(i),value:$typeObj.eq(i).attr('data-value'),htmlArr:$typeObj.eq(i).attr('data-htmlarray')};        	
		}
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	getDisplayDataString: function() {
		var displayString = ""; 

		// add points
		for (var i = 0; i < ps57.points.length; i++) {
			displayString += ps57.points[i].x + "," + ps57.points[i].y + "|";
		};

		// add lines
		for (var i = 0; i < ps57.lines.length; i++) {
			for (var j = 0; j < ps57.lines[i].points.length; j++) {
				displayString += ps57.lines[i].points[j].x + "," + ps57.lines[i].points[j].y;

				if (j !== ps57.lines[i].points.length - 1) displayString += ":";
			};
			if (i !== ps57.lines.length - 1) displayString += "|";
		};

		// check if ending | is there
		if (displayString.charAt(displayString.length-1) == "|") displayString = displayString.substring(0,displayString.length-1);

		return displayString;
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	parseDisplayData: function(data, type, connect) {
		var displayData = {
			points: [],
			lines: []
		}
		var objects = data.split('|');

		if (data.length) {
			for (var i = 0; i < objects.length; i++) {
				var points = objects[i].split(':');

				if (points.length == 1 && type !== "Line") {
					displayData.points.push(ps57.getXYFromString(points[0]));
				} else {
					// start line
					if (type == "Line" || connect) {
						var line = { type: null, points: [], id:displayData.lines.length };
						if (type == "Line") {
							line.type = "slope";
							line.color = ps57.getRandomColor();
						} else {
							line.type = "line";
						}
					}

					// add points
					for (var j = 0; j < points.length; j++) {
						if (type == "Line" || connect) {
							line.points.push(ps57.getXYFromString(points[j]));
						}
					};

					if (type == "Line" || connect) {
						displayData.lines.push(line);
					}
				}
			};
		}

		return displayData;
	},

	// 1,2|2,4|3,4:5,6:6,7:4,4 point|point|line
	parseAnswerData: function(answer, display, type, connect, slope, editable) {
		var answerData = {
			points: [],
			lines: [],
			slopes: [],
			type: type
		}

		// combine answer and display data cause that's the real end plot we're looking for
		var combinedData = answer;
		if (display !== "" && !editable) combinedData += "|" + display;

		// get answer data
		var displayData = ps57.parseDisplayData(combinedData, type, connect, null);
		answerData.points = displayData.points;
		answerData.lines = displayData.lines;

		// slope
		var slopes = slope.split("|");
		for (var i = 0; i < slopes.length; i++) {
			answerData.slopes.push(eval(slopes[i]));
		};

		return answerData;
	},

	clear: function() {
		// console.log("clear");
		ps57.points = [];
		ps57.lines = [];

		// set mode
		ps57.setMode(ps57.mode);

		ps57.draw();
	},

	setMode: function(mode, editable) {
		switch (mode) {
			case ps57.MODE_LINE:
				ps57.mode = ps57.MODE_LINE;
				if (!editable) ps57.lines.push({ type: "line", points: [], id:ps57.lines.length });
				$("#connect").addClass('on');
				break;
			case ps57.MODE_POINT:
				ps57.mode = ps57.MODE_POINT;
				$("#connect").removeClass('on');
				break;
			case ps57.MODE_SLOPE:
				ps57.mode = ps57.MODE_SLOPE;
				ps57.lines.push({ type: "slope", points: [], color: ps57.getRandomColor(), id:ps57.lines.length });
				$("#connect").removeClass('on');
				break;
		}
	},

	handleCLick: function(event) {
		// console.log("ps57.handleClick : " + ps57.mode);
		// console.log(event);

		if (ps57.mode !== ps57.MODE_DRAG) {
			var point = ps57.getCurrentPoint(event);

			switch (ps57.mode) {
				case ps57.MODE_POINT:
					// check if point exists anywhere
					var removePoints = ps57.findAllPoints(point);

					// if point exists
					if (!removePoints.length) {
						ps57.points.push(point);
					} else {
						// remove all points
						for (var i = 0; i < removePoints.length; i++) {
							ps57.removePoint(removePoints[i].array, removePoints[i].point);
						};
					}
					break;

				case ps57.MODE_LINE:
						// add point
						ps57.lines[ps57.lines.length-1].points.push(point);
					break;

				case ps57.MODE_SLOPE:

					// add point
					ps57.lines[ps57.lines.length-1].points.push(point);

					// only 2 points needed per slope line
					if (ps57.lines[ps57.lines.length-1].points.length == 2) {
						ps57.lines.push({ type: "slope", points: [], color: ps57.getRandomColor(), id:ps57.lines.length });
					}
					break;
			}

			ps57.draw();
		}

	},

	getCurrentPoint: function(event) {
		var relX = Math.round(event.layerX);
		var relY = Math.round(event.layerY);
		var transX = Math.round(relX / ps57.blocksize_x);
		var transY = ps57.scale_y - Math.round(relY / ps57.blocksize_y);

		// check if we're in quadrants
		if (ps57.quadrant > 1) {
			transX = Math.round(relX / ps57.blocksize_x) - ps57.scale_x;
			transY = ps57.scale_y - Math.round(relY / ps57.blocksize_y);
		}

		var point = {
			x: transX,
			y: transY
		};

		return point;
	},

	findAllPoints: function(point) {
		var removePoints = [];

		// check main points
		var index = _.indexOf(ps57.points, _.findWhere(ps57.points, point));
		if (index !== -1) removePoints.push({array:ps57.points, point:ps57.points[index]});

		// check lines
		for (var i = 0; i < ps57.lines.length; i++) {
			var instances = _.where(ps57.lines[i].points, point);

			// add all instances
			for (var j = 0; j < instances.length; j++) {
				removePoints.push({array:ps57.lines[i].points, point:instances[j]});
			};
		};

		return removePoints;
	},

	draw: function() {
		var self = this;

		ps57.drawLayer.destroyChildren();
		ps57.drawLayer.clear();

		// draw all the lines
		// if (ps57.currentLine.points.length) ps57.addLine(ps57.currentLine);
		for (var i = 0; i < ps57.lines.length; i++) {
			ps57.addLine(ps57.lines[i]);
		}

		// draw all the points
		$.each(ps57.points, function(index, value) {

			var pixelValue = ps57.getPositionFromXY(value);

			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps57.pointSize,
				fill: ps57.pointColor,
				stroke: ps57.pointColor,
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

			ps57.drawLayer.add(point);

		});

		ps57.drawLayer.draw();

	},

	createArrow: function(direction, color) {

		var arrowDirection = (direction) ? 1 : 0;

		var points = [];

		if (arrowDirection) {
			points = [-ps57.pointSize*1.5, -ps57.pointSize*1.5, 0, 0, -ps57.pointSize*1.5, ps57.pointSize*1.5];
		} else {
			points = [ps57.pointSize*1.5, -ps57.pointSize*1.5, 0, 0, ps57.pointSize*1.5, ps57.pointSize*1.5];
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

	addLine: function(data) {
		// console.log("ps57.addLine");
		var self = this;
		var points = [];
		var value = data.points;

		// create points array
		for (var i = 0; i < value.length; i++) {
			var pixelValue = ps57.getPositionFromXY(value[i]);
			points.push(pixelValue.x);
			points.push(pixelValue.y);
		}

		// get color
		var color = ps57.lineColor;
		if (data.color) color = data.color;

		// create line and group
		var currentLine = new Kinetic.Line({
			points: points,
			stroke: color,
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
			var pixelValue = ps57.getPositionFromXY(value[i]);

			// get color
			var color = ps57.pointColor;
			if (data.color) color = data.color;

			var point = new Kinetic.Circle({
				x: pixelValue.x,
				y: pixelValue.y,
				radius: ps57.pointSize,
				fill: color,
				stroke: color,
				strokeWidth: 1,
				id: i,
				draggable: true,
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
				var endPoints = ps57.getEndPoints(value);

				var arrowOne = ps57.createArrow(0, data.color);
				var arrowTwo = ps57.createArrow(1, data.color);

				var rotation = ps57.getLineAngle(value);

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

		ps57.drawLayer.add(currentGroup);

	},

	removeLine: function(line) {
		ps57.points.splice(_.indexOf(ps57.points, line), 1);
	},

	// Drag Functions
	linePointDragStart: function(event, groupID) {
		// console.log("ps57.linePointDragStart - " + groupID);
		ps57.priorMode = ps57.mode;
		ps57.mode = ps57.MODE_DRAG;
	},

	linePointDragEnd: function(event, groupID, pointID) {
		// console.log("ps57.linePointDragEnd - " + groupID);

		// only move point if it's dropped on the canvas
		if (event.target.localName === "canvas") {
			var point = ps57.getCurrentPoint(event);

			// update point
			var origPoint = $.extend(true, {}, ps57.lines[groupID].points[pointID]);
			ps57.lines[groupID].points[pointID].x = point.x;
			ps57.lines[groupID].points[pointID].y = point.y;

			// update other point if this is an end point
			if (pointID === 0 && _.isEqual(origPoint, ps57.lines[groupID].points[ps57.lines[groupID].points.length-1])) {
				ps57.lines[groupID].points[ps57.lines[groupID].points.length-1].x = point.x;
				ps57.lines[groupID].points[ps57.lines[groupID].points.length-1].y = point.y;
			} else if (pointID === ps57.lines[groupID].points.length-1 && _.isEqual(origPoint, ps57.lines[groupID].points[0])) {
				ps57.lines[groupID].points[0].x = point.x;
				ps57.lines[groupID].points[0].y = point.y;
			}
		}

		ps57.draw();
		ps57.mode = ps57.priorMode;
	},

	pointDragStart: function(event) {
		// console.log("ps57.pointDragStart");

		var chkXY = _.findWhere(ps57.points, this.getCurrentPoint(event));

		// TODO - Need to placeholder this point so that we can return it if drop is unsuccessful
		if (chkXY) {
			ps57.removePoint(ps57.points, chkXY);
		}

		ps57.priorMode = ps57.mode;
		ps57.mode = ps57.MODE_DRAG;
	},

	pointDragEnd: function(event) {
		// console.log("ps57.pointDragEnd");

		ps57.points.push(this.getCurrentPoint(event));
		ps57.draw();
		ps57.mode = ps57.priorMode;
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
						x: (ps57.quadrant > 1) ? -ps57.scale_x : 0,
						y: points[0].y
					},
					{
						x: ps57.scale_x,
						y: points[0].y
					}
				]
			} else {
				endPoints = [
					{
						x: points[0].x,
						y: (ps57.quadrant > 1) ? -ps57.scale_y : 0
					},
					{
						x: points[0].x,
						y: ps57.scale_y
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
					x: -ps57.scale_x,
					y: (slope*(-ps57.scale_x-leftPoint.x)) + leftPoint.y
				},
				{
					x: ps57.scale_x,
					y: (slope*(ps57.scale_y-leftPoint.x)) + leftPoint.y
				}
			]

			// check if ends are off screen
			if (endPoints[0].y < -ps57.scale_y) {
				endPoints[0] = {
					x: (-ps57.scale_y-leftPoint.y)/slope + leftPoint.x,
					y: -ps57.scale_y
				}
			} else if (endPoints[0].y > ps57.scale_y) {
				endPoints[0] = {
					x: (ps57.scale_x-leftPoint.y)/slope + leftPoint.x,
					y: ps57.scale_y
				}
			}
			if (endPoints[1].y < -ps57.scale_y) {
				endPoints[1] = {
					x: (-ps57.scale_y-leftPoint.y)/slope + leftPoint.x,
					y: -ps57.scale_y
				}
			} else if (endPoints[1].y > ps57.scale_y) {
				endPoints[1] = {
					x: (ps57.scale_x-leftPoint.y)/slope + leftPoint.x,
					y: ps57.scale_y
				}
			}
		}

		// change endpoints to pixels
		for (var i = 0; i < endPoints.length; i++) {
			endPoints[i] = ps57.getPositionFromXY(endPoints[i]);
		};

		return endPoints;
	},

	getLineAngle: function(points) {
		// get slope
		var slope = (points[0].y - points[1].y)/(points[0].x - points[1].x);
		var rotation = -Math.atan(slope) * (180/Math.PI);

		return rotation;
	},

	getXYFromString: function(coords) {
		coords = coords.split(',');
		var point = {
			x: eval(coords[0]),
			y: eval(coords[1])
		}

		return point
	},

	getPositionFromXY: function(point) {
		var newPoint = {x:0,y:0};

		if (ps57.quadrant > 1) {
			var addX = (point.x >= 0) ? 2 : 0 ; // for lines
			var addY = (point.y <= 0) ? 2 : 0 ;
			newPoint.x = (point.x + ps57.scale_x) * ps57.blocksize_x + addX;
			newPoint.y = (ps57.scale_y - point.y) * ps57.blocksize_y + addY;
		} else {
			newPoint.x = point.x * ps57.blocksize_x;
			newPoint.y = (ps57.scale_y - point.y) * ps57.blocksize_y;
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
	}
}
function getState() {
    return ps57.getState();
}
