var activity;
var level;
var actFileName;

function loadMenu(input){
  actFileName=input;
  loadJSON("assets/"+actFileName+".json",loadActivity);
  
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
    window.location.href = "ar.html?Act="+actFileName;
  }
    else{
      
     window.location.href = "vr.html?Act="+actFileName;
    }
}



