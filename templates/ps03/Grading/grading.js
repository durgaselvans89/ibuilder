function GradeCogneroQuestion(stateObj, pointsPossible) {
    var grades = calcAnswer(stateObj);
    var total = grades.length;
    var correct = 0;
    for (var i = 0; i < total; i++) {
        if (grades[i])
            correct++
    }

    return pointsPossible * (correct / total);
}
function displayAnswer() {
    var grades = calcAnswer(ps03.getState());
    var str = "Grades:\n";
    for (var i = 0; i < grades.length; i++) {
        str += "  Answer Box " +(i+1)+": "+ (grades[i]? "Pass":"Fail") + "\n";
    }
    alert(str);
}
function calcAnswer(state) {
    var states = state.state.split("||");
    var answers = [];
    for (var i = 0; i < states.length;i++) {
        var isCorrect = false;
        var pieces = states[i].split("::");
        var answer = pieces[1];
        var type = pieces[0].split(":")[0];
        var ids = pieces[0].split(":")[1].split(",");
        if (type == "s") {
            if (answer != "" && typeof JSONObject.select_object[parseInt(answer,10) - 1] != "undefined" && JSONObject.select_object[parseInt(answer,10)-1].correct === "true") {
                isCorrect = true; 
            }
        } else {
            for (var j = 0; j < ids.length; j++) {
                if ( compareAnswers(JSONObject.type_object[parseInt(ids[j],10)-1].source, answer.substr(1,answer.length - 2),true) ) {
                    isCorrect = true;
                }
            }
        }
        answers.push(isCorrect);
    }
    return answers;
}
function compareAnswers(a1, a2, removeSpaces) {
    if (removeSpaces) {
        var an1 = a1.replace(/,"160"/g, "").replace(/"160",/g, "").replace(/"160"/g, "").replace(/ /g,"").replace(/"160,/g,"\"").replace(/,160,/g, ",").replace(/,160"/g,"\"");
        var an2 = a2.replace(/,"160"/g, "").replace(/"160",/g, "").replace(/"160"/g, "").replace(/ /g,"").replace(/"160,/g,"\"").replace(/,160,/g, ",").replace(/,160"/g,"\"");
        return an1 === an2;
    }
    return a1 === a2;
}
