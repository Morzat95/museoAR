var levelsLogic;

function showOrHideMenu(){
    $("#menu").toggle();
}

function load(){
    showOrHideMenu();
    filename = "assets/"+$("#jsonInput")[0].value+".json";
    console.log("loading activity...");
    loadJSON(filename,loadActivity);
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
        obj.addEventListener('click', function() {
          if(obj.getAttribute('isClicked')=="true"){
            obj.setAttribute('material', {color: 'grey'});
            obj.setAttribute('isClicked',false);
          }
          else{
            obj.setAttribute('material', {color: 'blue'});
            obj.setAttribute('isClicked',true);
          }
          console.log("#" +jObj.id+" was clicked");
        });
      }
      marker.appendChild(obj);
      console.log("Adding entity #" + jObj.id);
      console.log(jObj.material.color);
      console.log(marker.querySelector("#" +jObj.id));
      toDOM(jObj.children,"#"+jObj.id)
      
      
}

$(function () {
  $("#jsonInput").val("ejTrafo");

});
