var activity;
var levelsFile;

function loadMenu(input){
  loadJSON("assets/"+input+".json",loadActivity);
  levelsFile=input;
  
}

function loadActivity(jsonInput){
  console.log("loading Activity... "+jsonInput);
  activity = jsonInput;
  showActivity();

}
function showActivity(){
  //loads level data and shows it on card
  $(function () {
    $("#preview").attr("src",activity.preview);
    $("#description").text(activity.description);
    $("#name").text(activity.name);
    
  });
}  
function goTo(){
  if(document.getElementById("arCheck").checked){
    window.location.href = "ar.html?Act="+levelsFile;
  }
    else{
      
     window.location.href = "vr.html?Act="+levelsFile;
    }
}



