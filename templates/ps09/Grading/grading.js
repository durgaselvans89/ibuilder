
function GradeCogneroQuestion(stateObj, pointsPossible) {
	var percentEarned = 0;
	if(evaluate(stateObj)) {
		percentEarned = 1;
	}
	var pointsEarned = pointsPossible * percentEarned;
	return pointsEarned;
}
function evaluate(state) {
	if (state.coordinate_object_type !== "Line" && state.coordinate_object_data) state.user_object_data += "|" + state.coordinate_object_data;
	var displayData = parseDisplayData(state.user_object_data);
	var points = displayData.points;
	var lines = displayData.lines;
	var answerData = null;
	if (state.coordinate_object_type === "Line" && state.inequalities === "true") {
		answerData = parseInequalityData(state.fullAnswer);
	} else if (state.coordinate_object_type === "Segment") {
		answerData = parseSegmentAnswerData(state.fullAnswer);
	} else {
		answerData = parseAnswerData(state.fullAnswer, state.slope);
	}
	var answerCorrect = true;
	if (state.coordinate_object_type === "Line") {
		if (state.inequalities === "true") {
			var shadeAreas = parseShadeData(state.shade_points, state.shade_areas);
			var dashData = parseDashData(state.line_object_data);
			answerCorrect = evaluateInequalities(lines, dashData, shadeAreas, answerData, state.no_solution);
		} else {
			answerCorrect = evaluateSlopeLines(lines, answerData);
		}
	} else if (state.coordinate_object_type === "Segment") {
		var segData = parseSegmentData(state.segment_object_data);
		answerCorrect = evaluateSegments(lines, segData, answerData);
	} else {
		answerCorrect = evaluatePoints(answerData.points, points);
		if (answerCorrect) answerCorrect = evaluateLines(answerData.lines, lines);
	}
	return answerCorrect;
}
function evaluateInequalities(lines, dashData, shadeAreas, answerData, noSolution) {
	if (lines.length) {
		var ineqCorrect = true;
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].length) {
				var slope = (lines[i][0].y-lines[i][1].y)/(lines[i][0].x-lines[i][1].x);
				if (slope == -Infinity) slope *= -1;
				if (slope != Infinity) {
					var intercept = lines[i][0].y - slope*lines[i][0].x;
				} else {
					var intercept = lines[i][0].x;
				}
				for (var j = 0; j < answerData.length; j++) {
					ineqCorrect = true;
					if (slope != answerData[j].slope) ineqCorrect = false;
					if (intercept != answerData[j].intercept) ineqCorrect = false;
					if (dashData[i] != answerData[j].dashEnabled) ineqCorrect = false;
					if (ineqCorrect) break;
				}
				if (!ineqCorrect) return false;
			}
		}
		for (var i = 0; i < answerData.length; i++) {
			for (var j = 0; j < lines.length; j++) {
				ineqCorrect = true;
				var slope = (lines[j][0].y-lines[j][1].y)/(lines[j][0].x-lines[j][1].x);
				if (slope == -Infinity) slope *= -1;
				if (slope != Infinity) {
					var intercept = lines[j][0].y - slope*lines[j][0].x;
				} else {
					var intercept = lines[j][0].x;
				}
				if (slope != answerData[i].slope) ineqCorrect = false;
				if (intercept != answerData[i].intercept) ineqCorrect = false;
				if (dashData[j] != answerData[i].dashEnabled) ineqCorrect = false;
				if (ineqCorrect) break;
			}
			if (!ineqCorrect) return false;
		}
		if(noSolution !== "true") {
			for (var i = 0; i < shadeAreas.length; i++) {
				var shadeCenter = getShadeCenter(shadeAreas[i].points);
				var isCorrect = true;
				for (var j = 0; j < answerData.length; j++) {
					if (answerData[j].slope != Infinity) {
						var ineqYVal = answerData[j].slope*shadeCenter.x + answerData[j].intercept;
						var shadeComparison = shadeCenter.y;
					} else {
						var ineqYVal = answerData[j].intercept;
						var shadeComparison = shadeCenter.x;
					}
					switch(answerData[j].symbol) {
						case ">" :
						case ">=" :
							if (answerData[j].dashEnabled) {
								if (shadeComparison <= ineqYVal) isCorrect = false;
							} else {
								if (shadeComparison < ineqYVal) isCorrect = false;
							}
							break;
						case "<" :
						case "<=" :
							if (answerData[j].dashEnabled) {
								if (shadeComparison >= ineqYVal) isCorrect = false;
							} else {
								if (shadeComparison > ineqYVal) isCorrect = false;
							}
							break;
					}
					if (!isCorrect) break;
				}
				if (isCorrect !== shadeAreas[i].filled) return false;
			}
		} else {
			for (var i = 0; i < shadeAreas.length; i++) {
				var shadeCenter = getShadeCenter(shadeAreas[i].points);
				var isCorrect = false;
				for (var j = 0; j < answerData.length; j++) {
					if (answerData[j].slope != Infinity) {
						var ineqYVal = answerData[j].slope*shadeCenter.x + answerData[j].intercept;
						var shadeComparison = shadeCenter.y;
					} else {
						var ineqYVal = answerData[j].intercept;
						var shadeComparison = shadeCenter.x;
					}
					switch(answerData[j].symbol) {
						case ">" :
						case ">=" :
							if (answerData[j].dashEnabled) {
								if (shadeComparison >= ineqYVal) isCorrect = true;
							} else {
								if (shadeComparison > ineqYVal) isCorrect = true;
							}
							break;
						case "<" :
						case "<=" :
							if (answerData[j].dashEnabled) {
								if (shadeComparison <= ineqYVal) isCorrect = true;
							} else {
								if (shadeComparison < ineqYVal) isCorrect = true;
							}
							break;
					}
					if (isCorrect) break;
				}
				if (isCorrect !== shadeAreas[i].filled) return false;
			}
		}
	} else {
		return false;
	}
	return true;
}
function evaluateSlopeLines(lines, answerData) {
	if (lines.length) {
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].length) {
				var slope = (lines[i][0].y-lines[i][1].y)/(lines[i][0].x-lines[i][1].x);
				var strSlope = (slope < 0) ? "-" : "" ;
				strSlope = strSlope + Math.abs(lines[i][0].y-lines[i][1].y) + "/" + Math.abs(lines[i][0].x-lines[i][1].x);
				if (answerData.points[i]) {
					if (answerData.points.length !== lines.length) return false;
					if (slope == Infinity || slope == -Infinity) {
						if (answerData.points[i].x !== lines[i][0].x) return false;
						resultY = answerData.points[i].y;
					} else {
						var resultY = slope*(answerData.points[i].x-lines[i][0].x)+lines[i][0].y;
					}
					if (resultY !== answerData.points[i].y) return false;
				}
				if (answerData.slopes[i]) {
					if (answerData.slopes.length !== lines.length) return false;
					if (answerData.slopes[i].indexOf("/") !== -1) {
						if (strSlope !== answerData.slopes[i]) return false;
					} else {
						if (slope !== parseFloat(answerData.slopes[i])) return false;
					}
				}
			}
		}
	} else {
		return false;
	}
	return true;
}
function evaluateSegments(lines, segData, answerData) {
	if (lines.length) {
		var foundData = [];
		for (var j = 0; j < answerData.length; j++) {
			foundData[j] = false;
		}
		var segCorrect = true;
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].length) {
				var slope = (lines[i][0].y-lines[i][1].y)/(lines[i][0].x-lines[i][1].x);
				var intercept = lines[i][0].y-slope*lines[i][0].x;
				for (var j = 0; j < answerData.length; j++) {
					segCorrect = true;
					if (slope != answerData[j].slope) {
						segCorrect = false;
					}
					if (intercept != answerData[j].intercept) {
						segCorrect = false;
					}
					if (segCorrect) {
						foundData[j] = true;
						var endPoint = false;
						for (var k = 0; k < lines[i].length; k++) {
							if (answerData[j].range.length > 1) {
								endPoint = true;
								for (var l = 0; l < segData[i].length; l++) {
									if (segData[i][l].showArrow) {
										segCorrect = false;
										break;
									}
								}
								if (segCorrect) {
									var isCorrect = false;
									for (l = 0; l < answerData[j].range.length; l++) {
										if (lines[i][k].x == answerData[j].range[l].value) {
											if (segData[i][k].fillEnabled === answerData[j].range[l].closed) {
												isCorrect = true;
											}
										}
									}
									segCorrect = isCorrect;
								}
							} else {
								var isCorrect = false;
								if (lines[i][k].x == answerData[j].range[0].value) {
									endPoint = true;
									if (segData[i][k].fillEnabled === answerData[j].range[0].closed && !segData[i][k].showArrow) {
										isCorrect = true;
									}
								} else {
									switch(answerData[j].range[0].symbol) {
										case ">" :
										case ">=" :
											if (lines[i][k].x > answerData[j].range[0].value) { 
												isCorrect = true;
											}
											break;
										case "<" :
										case "<=" :
											if (lines[i][k].x < answerData[j].range[0].value) { 
												isCorrect = true;
											}
											break;
									}
									if (isCorrect && (!segData[i][k].fillEnabled || !segData[i][k].showArrow)) {
										isCorrect = false;
									}
								}
								segCorrect = isCorrect;
							}
							if (!segCorrect) return false;
						}
						if (!endPoint) return false;
						if (segCorrect) break;
					}
				}
				if (!segCorrect) return false;
			}
		}
	} else {
		return false;
	}
	for (i = 0; i < answerData.length; i++) {
		if (!foundData[i]) return false;
	}
	return true;
}
function evaluatePoints(answer, points) {
	for (var i = 0; i < points.length; i++) {
		var index = cogIndexOf(answer, points[i]);
		if (index === -1) return false;
	}
	for (var i = 0; i < answer.length; i++) {
		var index = cogIndexOf(points, answer[i]);
		if (index === -1) return false;
	}
	return true;
}
function evaluateLines(answer, lines) {
	var linesCorrect = true;
	for (var i = 0; i < lines.length; i++) {
		if (!isEqual(lines[i][0],lines[i][1])) {
			for (var j = 0; j < answer.length; j++) {
				linesCorrect = true;
				var dupLines = cogCopy(lines[i]);
				for (var k = 0; k < answer[j].length; k++) {
					var index = cogIndexOf(dupLines, answer[j][k]);
					if (index !== -1) {
						dupLines.splice(index, 1);
					} else {
						linesCorrect = false;
					}
					if (!linesCorrect) break;
				}
				if (linesCorrect) break;
			}
		}
		if (!linesCorrect) return false;
	}
	for (var i = 0; i < answer.length; i++) {
		for (var j = 0; j < lines.length; j++) {
			linesCorrect = true;
			var dupAnswer = cogCopy(answer[i]);
			for (var k = 0; k < lines[j].length; k++) {
				var index = cogIndexOf(dupAnswer, lines[j][k]);
				if (index !== -1) {
					dupAnswer.splice(index, 1);
				} else {
					linesCorrect = false;
				}
				if (!linesCorrect) break;
			}
			if (linesCorrect) break;
		}
		if (!linesCorrect) return false;
	}
	return true;
}
function parseDisplayData(data) {
	var displayData = {
		points: [],
		lines: []
	};
	var objects = data.split('|');
	if (data.length) {
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].length) {
				var points = objects[i].split(':');
				if (points.length === 1) {
					displayData.points.push(getXYFromString(points[0]));
				} else {
					for (var j = 0; j < points.length; j++) {
						displayData.points.push(getXYFromString(points[j]));
						if (j < points.length-1) displayData.lines.push([getXYFromString(points[j]),getXYFromString(points[j+1])]);
					}
				}
			}
		}
	}
	return displayData;
}
function parseAnswerData(answer, slope) {
	var answerData = {
		points: [],
		lines: [],
		slopes: []
	};
	var displayData = parseDisplayData(answer);
	answerData.points = displayData.points;
	answerData.lines = displayData.lines;
	if (slope.length) {
		var slopes = slope.split(",");
		for (var i = 0; i < slopes.length; i++) {
			answerData.slopes.push(slopes[i]);
		}
	}
	return answerData;
}
function parseInequalityData(answer) {
	var inequalities = [];
	var ineqStrs = answer.split('|');
	for (var i = 0; i < ineqStrs.length; i++) {
		var pieces = ineqStrs[i].split(',');
		if (pieces[1] !== "i") {
			if (pieces[1].indexOf("/") !== -1) {
				var slope = pieces[1].split("/")[0]/pieces[1].split("/")[1];
			} else {
				var slope = parseFloat(pieces[1]);
			}
		} else {
			var slope = Infinity;
		}
		var line = {
			symbol: pieces[0],
			slope: slope,
			intercept: parseFloat(pieces[2]),
			dashEnabled: false
		};
		if (pieces[0].length === 1) line.dashEnabled = true;
		inequalities.push(line);
	}
	return inequalities;
}
function parseSegmentAnswerData(answer) {
	var segments = [];
	var segStrings = answer.split('|');
	for (var i = 0; i < segStrings.length; i++) {
		var pieces = segStrings[i].split(',');
		var segment = {
			slope: parseFloat(pieces[0]),
			intercept: parseFloat(pieces[1]),
			range: []
		};
		for (var j = 2; j < pieces.length; j++) {
			var rangeStr = pieces[j].split(':');
			var range = {
				symbol: rangeStr[0],
				value: rangeStr[1],
				closed: false
			};
			if (rangeStr[0].length !== 1) range.closed = true;
			segment.range.push(range);
		}
		segments.push(segment);
	}
	return segments;
}
function parseSegmentData(segString) {
	var segmentData = [];
	var segments = segString.split('|');
	for (var i = 0; i < segments.length; i++) {
		var segment = segments[i].split(':');
		var line = [];
		for (var j = 0; j < segment.length; j++) {
			var segData = segment[j].split(',');
			line[j] = {};
			line[j].fillEnabled = (segData[0] === "true") ? true : false ;
			line[j].showArrow = (segData[1] === "true") ? true : false ;
		}
		segmentData.push(line);
	}
	return segmentData;
}
function parseShadeData(pointString, areaString) {
	var shadeAreas = [];
	var lines = pointString.split('|');
	var areas = areaString.split(',');
	for (var i = 0; i < lines.length; i++) {
		var area = {
			points: [],
			filled: (areas[i] === "true") ? true : false
		};
		var points = lines[i].split(':');
		for (var j = 0; j < points.length; j++) {
			area.points.push(getXYFromString(points[j]));
		}
		shadeAreas.push(area);
	}
	return shadeAreas;
}
function parseDashData(dashString) {
	var dashData = [];
	var dashes = dashString.split(',');
	for (var i = 0; i < dashes.length; i++) {
		var dash = (dashes[i] === "true") ? true : false ;
		dashData.push(dash);
	}
	return dashData;
}
function isEqual(a, b) {
	if (typeof(a) != typeof(b)) return false;
	if(a.length == undefined) {
		if (a.x != b.x) return false;
		if (a.y != b.y) return false;
	} else {
		if (a.length != b.length) return false;
		for (var i = 0; i < a.length; i++) {
			if (!isEqual(a[i], b[i])) return false;
		}
	}
	return true;
}
function sortBy(arr, property) {
	var sortedArray = cogCopy(arr);
  var swapped = false;
  for( var i = 1; i < arr.length; i++ ) {
    var prev = arr[i - 1];
    var current = arr[i];
    if( prev[property] > current[property] ) {
      swapped = true;
      sortedArray[i] = prev;
      sortedArray[i - 1] = current;
    }
  }
  if( swapped ) {
    return sortBy(sortedArray, property);
  } else {
		return sortedArray;
	}
}
function cogIndexOf(arr, obj, start) {
    if (typeof(arr) != "object") return -1;
    for (var i = (start || 0), j = arr.length; i < j; i++) {
        if (isEqual(arr[i], obj)) { return i; }
    }
    return -1;
}
function getXYFromString(coords) {
	coords = coords.split(',');
	var point = {
		x: parseInt(coords[0]),
		y: parseInt(coords[1])
	};
	return point;
}
function cogCopy(arr) {
	var clone = [];
	for (var i = 0; i < arr.length; i++) {
		clone[i] = {
			x: arr[i].x,
			y: arr[i].y
		};
	}
	return clone;
}
function getShadeCenter(points) {
	var total = {};
	total.x = 0;
	total.y = 0;
	for (var i = 0; i < points.length-1; i++) {
		total.x += points[i].x;
		total.y += points[i].y;
	}
	var centerPoint = {
		x: total.x/(points.length-1),
		y: total.y/(points.length-1)
	};
	return centerPoint;
}
