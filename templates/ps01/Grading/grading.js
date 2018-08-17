function GradeCogneroQuestion(stateObj, pointsPossible)
{
	var percentEarned = 0;
	
    var grid = stateObj.grid.split(",");
    var correct = 1;
    for(var i in grid) {
        var t = grid[i].split(":");
        if (t[1] != JSONObject.highlight_object[t[0]].correct)
            correct = 0;
    }
	var pointsEarned = pointsPossible * correct;
	return pointsEarned;
}
