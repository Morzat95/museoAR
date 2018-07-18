var a = window.location.toString();
var name = a.substring(a.indexOf("=")+1);
var activity;
var level;

function run(){
    console.log("activity= "+name);
    load();
}

function load(){
    console.log("loading activity and Level...");
    loadJSON("assets/"+name+".json",loadActivity);
}

function loadActivity(jsonInput){
    var obj = jsonInput;
    console.log(obj.name);
    console.log("loading models...");
    loadJSON(obj.models,loadModels);
    loadJSON(obj.levels,loadLevels);
    //console.log("loading levels...")
   // loadJSON(obj.levels,loadLevels);
    //loads all the assets for the Activity
}
function loadModels(jsonInput){
  console.log(jsonInput);
  toDOM(jsonInput,'#marker');
  //loads models
}
function loadLevels(jsonInput){
  var level = jsonInput[level];
  console.log(jsonInput);
  //loads level logic
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
  
  function appendObject(jObj,father){
        var marker= document.querySelector(father);
        var obj = document.createElement('a-entity');
        obj.setAttribute('id',jObj.id); 
  
        obj.setAttribute('obj-model','obj','url('+jObj.file+')');
        obj.setAttribute('scale',jObj.scale);
        obj.setAttribute('rotation',jObj.rotation);
        obj.setAttribute('position',jObj.position);
        obj.setAttribute('material','color',jObj.material.color);
        obj.setAttribute('isClicked',false);
        if(jObj.cursorListener==true){
          obj.setAttribute('cursor-listener','');
        }
        marker.appendChild(obj);
        console.log("Adding entity #" + jObj.id);
        console.log(jObj.material.color);
        console.log(marker.querySelector("#" +jObj.id));
        toDOM(jObj.children,"#"+jObj.id);
        
        
  }
  
  AFRAME.registerComponent('cursor-listener', {
    init: function () {
      var lastIndex = -1;
      var COLORS = ['red', 'green', 'lightblue'];
      this.el.addEventListener('click', function (evt) {
        if(this.getAttribute('isClicked')=="true"){
          this.setAttribute('material', {color: 'grey'});
          this.setAttribute('isClicked',false);
        }
        else{
          this.setAttribute('material', {color: 'blue'});
          this.setAttribute('isClicked',true);
        }
        console.log("#" +this.id+" was clicked");
        console.log('I was clicked at: ', evt.detail.intersection.point);
      });
    }
  });