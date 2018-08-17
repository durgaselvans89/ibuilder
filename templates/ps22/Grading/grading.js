//////Grading File//////
function GradeCogneroQuestion(stateObj, pointsPossible)
{
    var total = 0;
    var correct = 0;
    var s = stateObj.state.split(",");
    
    for (var i in s) {
       var t = s[i].split("|");
       if(t[2] == t[3])
       		correct++;   
        total++ 
    }
    return pointsPossible * (correct / total);
}
function displayAnswers(){
    var state = ps20.getState();    

}