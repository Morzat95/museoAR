var a = window.location.toString();
var name = a.substring(a.indexOf("=")+1);
var activity;
var levelsFile;
var playing=false;

function run(){
    console.log("activity= "+name);
    loadJSON("assets/"+name+".lvl.json",loadLevels);
}


function loadLevels(jsonInput){
  loadLevel(jsonInput,0);

}
function loadLevel(jsonInput,index){
  if(index>jsonInput.length-1){  
    console.log("Activity Finished");
    return;
  }
  console.log("iteracion: "+index);

  var item=jsonInput[index];
  console.log(item);
  appendText(item.description);
  toDOM(item.objects,'#marker');

  var delayInMilliseconds = item.delay;
  setTimeout(function() {
    removeAllChildren('#marker');
    loadLevel(jsonInput,index+1);
      }, delayInMilliseconds);
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
  var marker= document.querySelector(father);
  marker.removeChild(marker.childNodes[0]);
}
  
function appendText(text){
  var obj = document.createElement('li');
  obj.innerText=text;
  var list= document.querySelector("#checklist");
  list.appendChild(obj);


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

AFRAME.registerComponent('markerhandler', {
	init: function() {
		// Set up the tick throttling. Will check if marker is active every 500ms
		this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
	},
	tick: function(t, dt) {
    console.log("searching marker...");
		
		if (document.querySelector("#marker").object3D.visible == true && playing == false) {
      // MARKER IS PRESENT
      console.log("Found!");
      playing = true;
      run();
      document.querySelector("#marker").removeAttribute("markerhandler");
		} else {
			// MARKER IS HIDDEN, do nothing (up to you)
		}

	}
});
