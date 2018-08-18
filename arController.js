var a = window.location.toString();
var name = a.substring(a.indexOf("=")+1);
var playing=false;
var currentCard=0;
let activity;

function run(){
    console.log("activity= "+name);
    loadJSON("assets/"+name+".item.json",loadCards);
}


function loadCards(jsonInput){
  currentCard=jsonInput[0];
  activity=new Map();
  jsonInput.forEach(card => {
    console.log("loading...id:"+card.id+" card"+card.description)
    activity.set(card.id,card);
    preLoadCard(card);
  });

  console.log(activity);
}


function preLoadCard(card){
  toDOM(card.objects,card.marker);
}


function loadCard(card){
  console.log("was the card loaded already? "+card.loaded);
  drawText(card.description);
 // toDOM(card.objects,card.marker);
  card.loaded=true;
  if(card.type=="delay"){
      startTimer(card);
    
    }
  if(currentCard.type=="redirect"){
    window.location.href = card.destiny;
  }
}

function startTimer(card){
  var delayInMilliseconds = card.delay;
  setTimeout(function(timeout) {
    console.log("timer finished");
        if(playing&&isCurrentMarkerVisible){ //if marker is still visible
          
          goTo(card.next);
                  }
  }, delayInMilliseconds);

}

function makeVisible(){

}
function makeInvisible(){
  
}

function toDOM(jsonInput,father) {
    if(jsonInput==null ||jsonInput=="")
    {return;
    }
      for(var i = 0; i < jsonInput.length; i++) {
          var obj = jsonInput[i];
          appendObject(obj,father);
          console.log("adding obj ID"+obj.id);
      }
      objectCount = i;
      console.log("objectCount:" + objectCount);
}

function removeAllChildren(father){
  
  var marker= document.querySelector('#'+father);
  if(marker!=null){
    while (marker.firstChild) {
      marker.removeChild(marker.firstChild);
      }
    }
}


function appendObject(jObj,father){
      var marker= document.querySelector('#'+father);
      var obj = document.createElement(jObj.type);
      obj.object3D.visible = false;  //starts invisible
      obj.setAttribute('id',jObj.id); 
      obj.setAttribute('obj-model','obj','url('+jObj.file+')');
      obj.setAttribute('scale',jObj.scale);
      obj.setAttribute('rotation',jObj.rotation);
      obj.setAttribute('position',jObj.position);
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
      toDOM(jObj.children,jObj.id);
     
}
function goTo(next){
  currentTimeout="";
  if(currentCard.persistent==null){
    removeAllChildren(currentCard.marker);
  }
  console.log(
  next
  )
  currentCard=activity.get(next);
  if(currentCard==null){
    console.error("attemped to redirect to: "+next+" but it was not found...");
  }
  playing=false;
}

function playPause(id){
  var aVideoAsset= document.querySelector('#'+id);
  if(aVideoAsset.paused==false){
    aVideoAsset.pause();
  }
  else{
    aVideoAsset.play();
    aVideoAsset.setAttribute('loop','false');
  }
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
    this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
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


