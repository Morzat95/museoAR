var a = window.location.toString();
var name = a.substring(a.indexOf("=")+1);
var activity;
var playing=false;
var currentItem=0;
var dict = {};

function run(){
    console.log("activity= "+name);
    loadJSON("assets/"+name+".item.json",loadItems);
}


function loadItems(jsonInput){
  activity=jsonInput;
  
  currentItem=activity[0];
}

function goTo(index){
  currentTimeout="";
  if(currentItem.persistent==null){
    removeAllChildren(currentItem.marker);
  }
  currentItem=activity[index];
  playing=false;
}


function loadItem(item){
  drawText(item.description);
  toDOM(item.objects,item.marker);
  if(item.type=="delay"){
      startTimer(item);
    }
  if(currentItem.type=="redirect"){
    window.location.href = item.destiny;
  }
}

function startTimer(item){
  var delayInMilliseconds = item.delay;
  setTimeout(function(timeout) {
        if(playing){ //if marker is still visible
          if(item.persistent==null){
            removeAllChildren(item.marker);}
          currentItem=activity[item.next];
          playing=false;
          console.log("next! "+item.next);
                  }
  }, delayInMilliseconds);

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

function appendObject(jObj,father){
      var marker= document.querySelector('#'+father);
      var obj = document.createElement(jObj.type);
      obj.setAttribute('id',jObj.id); 
      obj.setAttribute('obj-model','obj','url('+jObj.file+')');
      obj.setAttribute('scale',jObj.scale);
      obj.setAttribute('rotation',jObj.rotation);
      obj.setAttribute('position',jObj.position);
      obj.setAttribute('isClicked',false);
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
      obj.setAttribute('color',jObj.color);
      obj.setAttribute('value',jObj.value);
      obj.setAttribute('shadow',jObj.shadow);

      marker.appendChild(obj);
      console.log("Adding entity #" + jObj.id);
      console.log(marker.querySelector("#" +jObj.id));
      toDOM(jObj.children,jObj.id);
     
}
  

function isCurrentMarkerVisible(){
    if(currentItem==null){
      return false;
    }
    if(currentItem.marker==null){//if it has no marker its excecuted anyway
      return true;
    }
    return document.querySelector("#"+currentItem.marker).object3D.visible;
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
          loadItem(currentItem);
          
        } else if ((isCurrentMarkerVisible()==false) && (playing == true)) {
          currentTimeout="";
          removeAllChildren(currentItem.marker);
          playing=false;
          console.log("marker lost!");
        }
        else if((isCurrentMarkerVisible()==false) && (playing == false)){
          if(activity!=null){//not yet loaded
              console.log("looking for marker... "+currentItem.marker);
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


