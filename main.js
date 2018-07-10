var levelsLogic;

/*function showOrHideMenu(){
    $("#menu").toggle();
    $("#card").toggle();
}*/

function load(){
    console.log("loading activity...");
    loadJSON("assets/"+"ejTrafo.json",loadActivity);
}
function loadJSON(filename,callback) {
    console.log("loading file "+ filename);
   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', filename, true); // Replace 'my_data' with the path to your file
   xobj.onreadystatechange = function () { 
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           parseJson(xobj.responseText,callback);
         }
   };
   xobj.send(null);
   
}

function parseJson(response,callback){
if (IsJsonString(response)) {
    console.log("json correctly loaded!");
  callback(JSON.parse(response));
} else {
  console.error("not valid json");
}
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function loadActivity(jsonInput){
    var obj = jsonInput;
    console.log(obj.name);
    console.log("loading models...");
    loadJSON(obj.models,loadModels);
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
  levelsLogic = jsonInput;
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

$(function () {
  $("#jsonInput").val("ejTrafo");

});
