let activity;
let activityItemsFile;

function loadMenu(input){
  loadJSON("activities/"+input+".menu",loadActivity);
  activityItemsFile=input;
}

function loadActivity(jsonInput){
  console.log("loading Activity... "+jsonInput);
  activity = jsonInput;
  activityItemsFile=activity.itemsFile;
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

  if(activity.cards==null){ //If cards are not embedded

      if(document.getElementById("arCheck").checked){
    window.location.href = "ar.html?"+activityItemsFile;
  }
    else{

     window.location.href = "arEmu.html?"+activityItemsFile;
    }
  }
  else{//if cards are embedded on URL
    let cards = window.btoa(JSON.stringify(activity.cards));
          if(document.getElementById("arCheck").checked){
    window.location.href = "ar.html?"+cards;
  }
    else{

     window.location.href = "arEmu.html?"+cards
    }

  }

}



