var CardHirarchy = {
    Activity:1,
    Level:2
  };
var levelAmount=0;
var activityAmount=0;
var activityIndex=0;
var levelIndex=0;
var currentHirarchy=CardHirarchy.Activity;
var activities;
var level;

function loadMenu(){
  loadJSON("assets/"+"main.json",loadActivities);
  
}

function loadActivities(jsonInput){
  console.log("loading Activities... "+jsonInput);
  activities = jsonInput;
  activityAmount=activities.length;
  showActivity();

}
function showActivity(){
  //loads level data and shows it on card
  $(function () {
    $("#preview").attr("src",activities[activityIndex].preview);
    $("#description").text(activities[activityIndex].description);
    $("#name").text(activities[activityIndex].name);
    
  });
  console.log("Showing Activity... index= "+activityIndex+" named= "+activities[activityIndex].name);
}
function showLevel(){
  //loads level data and shows it on card
  loadJSON(activities[activityIndex].levels,
    function(jsonInput){
    console.log("Showing Level..."+jsonInput[levelIndex].name);
    level=jsonInput[levelIndex];
    console.log(level);
    levelAmount=jsonInput.length;
    $(function () {
      $("#preview").attr("src",level.preview);
      $("#description").text(level.description);
      $("#name").text(level.name);
      
    });
  })
  


}
function back(){
levelAmount=0;
activityAmount=0;
activityIndex=0;
levelIndex=0;
currentHirarchy=CardHirarchy.Activity;
loadMenu();
$("#back").toggle();
}

function next(){
  console.log("moving foward!")
  if(currentHirarchy==CardHirarchy.Activity){
    activityIndex+=1;
    resetActIfOutOfBounds();
    showActivity();
  }
  else{
    levelIndex+=1;
    resetLevelIfOutOfBounds();
    showLevel();
    
  }
  console.log(activityIndex+" | "+levelIndex);


}
function previous(){
  console.log("going back!")
  if(currentHirarchy==CardHirarchy.Activity){
    activityIndex-=1;
    resetActIfOutOfBounds();
    showActivity();
  }
  else{
    levelIndex-=1;
    resetLevelIfOutOfBounds();
    showLevel();
  }
  console.log(activityIndex+" | "+levelIndex);

}
function goTo(){
  if(currentHirarchy==CardHirarchy.Level){
    window.location.href = "ar.html?ActLvl="+activityIndex+"-"+levelIndex;
  }
  else{
    currentHirarchy=CardHirarchy.Level;
    showLevel();
    $("#back").toggle();
  }
}

function resetActIfOutOfBounds(){
  if(activityIndex>activityAmount-1){
    console.log("activity array max!");
    levelIndex=0;
    activityIndex=0;
    return;
  }
  if(activityIndex<0){
    console.log("activity array min!");
    levelIndex=0;
    activityIndex=activityAmount-1;
    return;
  }
}
function resetLevelIfOutOfBounds(){

  if(levelIndex>levelAmount-1){
    console.log("level array max! levelIndex="+levelIndex+" levelAmount="+levelAmount);
    levelIndex=levelAmount-1;
    return;
  }

  if(levelIndex<0){
    console.log("level array min!");
    levelIndex=0;
    return;
  }
}





