var a = window.location.toString();
var name = a.substring(a.indexOf("=")+1);
var playing=false;
var currentCard=0;
let activity;
var awaitingDeletion=0;
var index=0
var array;

function run(){
    console.log("activity= "+name);
    loadJSON("assets/"+name+".item.json",loadActivity);
}


function loadActivity(jsonInput){
  currentCard=jsonInput[0];
  array=jsonInput;
  activity=new Map();
  jsonInput.forEach(card => {
    console.log("loading...id:"+card.id+" element: "+card.description)
    activity.set(card.id,card);
   
  });
  iterateObjects(currentCard.objects,currentCard.marker,setObjectProperties); //load first
  preLoadNextCard();
  console.log(activity);
}
function preLoadNextCard(){
  if(array.length>index+1){
  var card=array[index+1];
  iterateObjects(card.objects,card.marker,setObjectProperties);
}
  }

 
  

function preLoadCard(card){
  iterateObjects(card.objects,card.marker,setObjectProperties);
}

function loadCard(card){
  index+=1;
  preLoadNextCard();
  makeCardVisible(card);
 if(card.autoplay!=null){
   
  playPause(card.autoplay);
  }
  drawText(card.description);
  if(card.type=="delay"){
      startTimer(card);
    
    }
  if(currentCard.type=="redirect"){
    window.location.href = card.destiny;
  }
}
function makeCardVisible(card){
  iterateObjects(card.objects,true,setObjectVisible);
}
function makeCardInvisible(card){
  iterateObjects(card.objects,false,setObjectVisible);
  awaitingDeletion=0;
  iterateObjects(card.objects,true,markForRemoval);
  garbageCollection();

  //iterateObjects(card.objects,false,removeObject); //boolean here is not needed
}

function markForRemoval(Jobj,value){
    var obj= document.querySelector('#'+Jobj.id);
    obj.setAttribute('remove',value); 
    awaitingDeletion+=1;
}

function garbageCollection(){
  console.log("removing...");
  while(awaitingDeletion>0){
        console.log("awaiting removal.."+awaitingDeletion);
        document.querySelectorAll('*').forEach(function(node) {
          //console.log(node.id+" "+(node.getAttribute('remove')));
          if (node.getAttribute('remove')!=null){
            if(node.firstChild==null){
              var parent=node.parentNode;
              parent.removeChild(node);
              console.log("deleting: "+node.id);
              awaitingDeletion-=1;
            }
            else{
              console.log("my child "+node.firstChild.id+ " needs me");
            }
          }  
      });
  }
}

function setObjectVisible(Jobj,value){
  
  var obj= document.querySelector('#'+Jobj.id);
  obj.setAttribute('visible',value); 
}
function setObjectProperties(jObj,fatherID){
  var marker= document.querySelector('#'+fatherID);
  var obj = document.createElement(jObj.type);
  obj.setAttribute('visible', false); //Makes the object invisible by default
  obj.setAttribute('id',jObj.id); 
  obj.setAttribute('obj-model','obj','url('+jObj.file+')');
  obj.setAttribute('scale',jObj.scale);
  obj.setAttribute('rotation',jObj.rotation);
  obj.setAttribute('position',jObj.position);
  obj.setAttribute('width',jObj.width);
  obj.setAttribute('height',jObj.height);
  obj.setAttribute('depth',jObj.depth );
// obj.setAttribute('loaded',true);
  if(jObj.onclick!=null){
    obj.setAttribute('cursor-listener','');
    obj.setAttribute('onclick',jObj.onclick);
  }
  if(jObj.material!=null){
    obj.setAttribute('material',jObj.material);
  }
 
  else{
    obj.setAttribute('src',jObj.src);
  }
  if(jObj.type="video"){
    
    if(jObj.autoplay=="true"){
      obj.setAttribute('autoplay','');}
    obj.setAttribute('loop',jObj.loop);
  }   
  obj.setAttribute('color',jObj.color);
  obj.setAttribute('value',jObj.value);
  obj.setAttribute('shadow',jObj.shadow);

  marker.appendChild(obj);
  console.log("Adding entity #" + jObj.id);
  console.log(marker.querySelector("#" +jObj.id));
}

function iterateObjects(jsonInput,value,callback) {
  if(jsonInput==null ||jsonInput=="")
  {return;
  }
    for(var i = 0; i < jsonInput.length; i++) {
        var obj = jsonInput[i];
        callback(obj,value);
        iterateObjects(obj.children,obj.id,callback);
        
    }
    objectCount = i;
   // console.log("objectCount:" + objectCount);

}


function appendText(text){
  var obj = document.createElement('li');
  obj.setAttribute('class','checklist-text');
  obj.innerText=text;
  var list= document.querySelector("#checklist");
  list.appendChild(obj);


}
function drawText(text){
  var obj = document.createElement('li');
  obj.innerText=text;
  obj.setAttribute('class','checklist-text');

  var list= document.querySelector("#checklist");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
    }
  list.appendChild(obj);
}
function startTimer(item){
  var delayInMilliseconds = item.delay;
  item.delayStart=Date.now();
  setTimeout(function(timeout) {
    var diff = Date.now()-item.delayStart;
    console.log("timer finished, delta: "+diff);
    if(playing&&isCurrentMarkerVisible&&((diff-delayInMilliseconds))>-100){ //if marker is still visible
      console.log("next!");
      goTo(item.next);
              }
    else{
      console.log("timer cancelled...");
    }
  
  
  console.log("Delta= "+diff); 
  }, delayInMilliseconds);

}
function goTo(next){
  currentTimeout="";
  /*if(currentCard.autoplay!=null){
    playPause(currentCard.autoplay);
    }*/
 makeCardInvisible(currentCard);
 // }
  console.log(next);
  currentCard=activity.get(next);
  if(currentCard==null){
    console.error("attemped to redirect to: "+next+" but it was not found...");
  }
  playing=false;
}

function firstPlay(){
  hideOrShow("playButton");
  play();
  //startTimer(activity.get("INICIO"));
  drawText("Comenzando...");

}
function hideOrShow(id) {
  var x = document.getElementById(id);
  if (x.style.display === "none") {
      x.style.display = "block";
  } else {
      x.style.display = "none";
  }
}
function play(id){
  if(id==null){
    id=currentCard.autoplay;
  }
  console.log("playPause: "+id);
  var aVideoAsset= document.querySelector('#'+id);
  aVideoAsset.play().catch(function(error) {
    aVideoAsset.pause();
    drawText("Presione el boton de play");
    hideOrShow("playButton");
  
});
    aVideoAsset.setAttribute('loop','false');
  
}
function playPause(id){
  if(id==null){
    id=currentCard.autoplay;
  }
  console.log("playPause: "+id);
  var aVideoAsset= document.querySelector('#'+id);
  if(aVideoAsset.paused==false){
    aVideoAsset.pause();
  }
  else{

      aVideoAsset.play().catch(function(error) {
        drawText("Presione el boton de play");
        hideOrShow("playButton");
     
    });
  }
    
    aVideoAsset.setAttribute('loop','false');
  
}


function isCurrentMarkerVisible(){
    if(currentCard==null){
      return false;
    }
    if(currentCard.marker==null){//if it has no marker its excecuted anyway
      return true;
    }
    return document.querySelector("#"+currentCard.marker).object3D.visible;
}



AFRAME.registerComponent('markerhandler', {
  init: function() {
    // Set up the tick throttling. Will check if marker is active every 500ms
    console.log("setting up marker handler...");
    this.tick = AFRAME.utils.throttleTick(this.tick, 1000, this);
  },
  tick: function(t, dt) {
    if(activity!=null){
        if (isCurrentMarkerVisible() && playing == false) {
          // MARKER IS PRESENT
          console.log("Found!");
          currentTimeout="";
          playing = true;
          loadCard(currentCard);
          
        } else if ((isCurrentMarkerVisible()==false) && (playing == true)) {
          currentTimeout="";
         
          playing=false;
          console.log("marker lost!");
        }
        else if((isCurrentMarkerVisible()==false) && (playing == false)){
          if(activity!=null){//not yet loaded
              console.log("looking for marker... "+currentCard.marker);
          }
        }

      }
    }
});


AFRAME.registerComponent('cursor-listener', {
  init: function () {
    this.el.addEventListener('click', function (evt) {
      console.log("#" +this.id+" was clicked");
      this.onclick;
    });
  }
});


