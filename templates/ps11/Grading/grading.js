
function GradeCogneroQuestion(stateObj, pointsPossible) {
	var percentEarned = 0;
	if(evaluate(stateObj)) {
		percentEarned = 1;
	}
	var pointsEarned = pointsPossible * percentEarned;
	return pointsEarned;
}
function evaluate(state) {
  var answerCorrect = true;
  var points = parseDisplayData(state.coordinate_object_data);
  var answerPoints = parseDisplayData(state.coordinate_object_answer);
  if (state.reference_labels.length) {
    if (isEqual(points[0],points[points.length-1]) && !isEqual(answerPoints[0],answerPoints[answerPoints.length-1])) points.pop();
    answerCorrect = isEqual(answerPoints, points);
  } else {
    answerCorrect = checkAllPoints(answerPoints, points);
  }
  return answerCorrect;
}
function parseDisplayData(data) {
  var points = [];
  var allPoints = data.split(':');
  for (var i = 0; i < allPoints.length; i++) {
    points.push(getXYFromString(allPoints[i]));
  }
  return points;
}
function getXYFromString(coords) {
  coords = coords.split(',');
  var point = {
    x: parseInt(coords[0]),
    y: parseInt(coords[1])
  };
  return point
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
function checkAllPoints(a, b) {
  for (var i = 0; i < a.length; i++) {
    var answerCorrect = true;
    for (var j = 0; j < b.length; j++) {
      answerCorrect = isEqual(a[i],b[j]);
      if (answerCorrect) break;
    }
    if (!answerCorrect) return false;
  }
  return true;
}
