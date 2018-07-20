var a = window.location.toString();
var name = a.substring(a.indexOf("=")+1);
var activity;
var levelsFile;
var playing=false;
var overridenLevel="";
var currentLevel=0;

function run(){
    console.log("activity= "+name);
    loadJSON("assets/"+name+".lvl.json",loadLevels);
}

function levelWasOverriden(level){
  if(level==overridenLevel){
    return true;
  }
  return false;
}

function loadLevels(jsonInput){
  activity=jsonInput;
  loadLevel(jsonInput);

}
function goTo(level){
  overridenLevel=currentLevel;
  removeAllChildren(activity[currentLevel].marker);
  currentLevel=level;
  loadLevel(activity);
 
}
function stop(id){
  console.log("stop the video!");
  var vid = document.getElementById(id);
  vid.stop();
}
function loadLevel(jsonInput){
  console.log("Nivel: "+currentLevel);
  var item=jsonInput[currentLevel];
  appendText(item.description);
  toDOM(item.objects,item.marker);
  if(item.type=="delay"){
      var delayInMilliseconds = item.delay;
      setTimeout(function() {
        if(!levelWasOverriden(item.id)){
          if(currentLevel<jsonInput.length-1){
            console.log("removing!!");
            removeAllChildren(item.marker);
            currentLevel=currentLevel+1;
            loadLevel(jsonInput);
          }
          else{
            console.log("Activity Finished");
          }
      }
      else{
        overridenLevel="";
      }

      }, delayInMilliseconds);
    }

    

}

function toDOM(jsonInput,father) {
    if(jsonInput==null ||jsonInput=="")
    {return;
    }
      // this assumes it is being run first -- it will start placing objects with id 0 and set objectcount to the number of loaded objects
      for(var i = 0; i < jsonInput.length; i++) {
          var obj = jsonInput[i];
          appendObject(obj,father);
      }
      objectCount = i;
      console.log("objectCount:" + objectCount);
}
function removeAllChildren(father){
  var marker= document.querySelector('#'+father);
  marker.removeChild(marker.childNodes[0]);
}
  
function appendText(text){
  var obj = document.createElement('li');
  obj.innerText=text;
  var list= document.querySelector("#checklist");
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
      obj.setAttribute('text','value'," Hello World");
      if(jObj.onclick!=null){
        obj.setAttribute('cursor-listener','');
        obj.setAttribute('onclick',jObj.onclick);
      }
      if(jObj.material!=null){
        obj.setAttribute('material','color',jObj.material.color);
      }
      else{
        obj.setAttribute('src',jObj.src);
      }   
      marker.appendChild(obj);
      console.log("Adding entity #" + jObj.id);
      console.log(marker.querySelector("#" +jObj.id));
      toDOM(jObj.children,jObj.id);
     
}
  
AFRAME.registerComponent('cursor-listener', {
  init: function () {
    this.el.addEventListener('click', function (evt) {
     /* if(this.getAttribute('isClicked')=="true"){
        this.setAttribute('material', {color: 'grey'});
        this.setAttribute('isClicked',false);

      }
      else{
        this.setAttribute('material', {color: 'blue'});
        this.setAttribute('isClicked',true);
      }*/
      console.log("#" +this.id+" was clicked");
     // console.log('I was clicked at: ', evt.detail.intersection.point);
      this.onclick;

    });
  }
});

function isMarkerVisible(marker){
    return document.querySelector("#"+marker).object3D.visible;
}

AFRAME.registerComponent('markerhandler', {
	init: function() {
		// Set up the tick throttling. Will check if marker is active every 500ms
		this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
	},
	tick: function(t, dt) {
		if (isMarkerVisible('marker') && playing == false) {
      // MARKER IS PRESENT
      console.log("Found!");
      playing = true;
      run();
      
    } else if ((isMarkerVisible('marker')==false) && (playing == true)) {
     
			console.log("marker lost!");
    }
    else if((isMarkerVisible('marker')==false) && (playing == false)){
      console.log("looking for marker...");
    }

	}
});
