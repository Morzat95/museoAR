var a = window.location.toString();
var name = a.substring(a.indexOf("=") + 1);
var playing = false;
var currentCard = 0;
let activity;
var historyStack = [];
var renderQueue = [];


function run() {
  console.log("activity= " + name);
  loadJSON("assets/" + name + ".item.json", loadActivity);
}


function loadActivity(jsonInput) {
  currentCard = jsonInput[0];
  array = jsonInput;
  activity = new Map();
  jsonInput.forEach(card => {
    console.log("loading...id:" + card.id + " element: " + card.description)
    activity.set(card.id, card);

  });
  preLoadCard(currentCard);
  console.log(activity);
}


function getCardMarkers(card) {
  var markerStack = [];
  if (card.marker != null) {
    markerStack.push(card.marker);
    return markerStack;
  }
  else if(card.objects!=null){
    card.objects.forEach(node => {
      if (node.marker != null) {
        markerStack.push(node.marker);
      }
    });
  }
    if(markerStack.length==0){
      return null;
    }
    return markerStack;
  }


function preLoadCard(card) {
  if (card == null) {
    console.error("check JSON file card is null");
  }
  if (!isPreloaded(card)) {
    if (card.marker == null&&card.objects!=null) { //if null we asume its because we are using multipleIndependentMarkers
      card.objects.forEach(node => {
        if (node.marker != null) {
          setObjectProperties(node, node.marker);
          iterateObjects(node.children, node.id, setObjectProperties);
        }
      });
    }
    else {
      iterateObjects(card.objects, card.marker, setObjectProperties); //we use a marker for all objects
    }
    card.preoloaded = true;
  }

  
}

function isPreloaded(card) {
  if (card.isPreloaded != null) {
    if (card.isPreloaded == true) {
      return true;
    }
  }
  return false;
}

function loadCard(card) {
  preLoadCard(card);
  if (card.next != null) { //if possible loads next
    preLoadCard(activity.get(card.next));
  }
  else {
    console.log("next is null!, no preloading this time");
  }
  makeCardVisible(card);
  drawText(card.description);
  if (card.type == "delay") {
    startTimer(card);

  }
  if (currentCard.type == "redirect") {
    window.location.href = card.destiny;
  }
}
function makeCardVisible(card) {
  iterateObjects(card.objects, true, setObjectVisible);
}
function deleteCard(card) {
  iterateObjects(card.objects, false, setObjectVisible);
  iterateObjects(card.objects, true, markForRemoval);
  card.prelodaded = false;
  garbageCollection();
}

function markForRemoval(Jobj, value) {
  var obj = document.querySelector('#' + Jobj.id);
  obj.setAttribute('remove', value);
}

function logCurrentObjects() {

  document.querySelectorAll('*').forEach(function (node) {
    if (node.getAttribute('jsonLoaded') != null) {
      console.log("node: " + node.id + " - loaded");
    }


  });
}
function goTo(next) {
  currentTimeout = "";
  historyStack.push(currentCard.id);
  deleteCard(currentCard);
  console.log(next);
  currentCard = activity.get(next);
  if (currentCard == null) {
    console.error("attemped to redir(ect to: " + next + " but it was not found...");
  }
  playing = false;
}

function garbageCollection() {
  console.log("Removing card...");
  getGarbage().forEach(garbage => {
    garbage.parentNode.removeChild(garbage);
  });


}

function getGarbage() {
  var jsonObjects = [];
  document.querySelectorAll('*').forEach(function (node) {

    if (node != null) {
      if ((node.getAttribute('jsonLoaded') != null) && (node.getAttribute('remove') != null)) {
        jsonObjects.push(node);
        console.log(node.id);
      }
    }
  });
  return jsonObjects;
}

function setObjectVisible(Jobj, value) {
  var obj = document.querySelector('#' + Jobj.id);
  obj.setAttribute('visible', value);
}
function setObjectProperties(jObj, fatherID) {
  var father = document.querySelector('#' + fatherID);
  var obj = document.createElement(jObj.type);
  obj.setAttribute('visible', false); //Makes the object invisible by default so that we can make it visible later
  obj.setAttribute('id', jObj.id);
  obj.setAttribute('scale', jObj.scale);
  obj.setAttribute('rotation', jObj.rotation);
  obj.setAttribute('position', jObj.position);
  obj.setAttribute('width', jObj.width);
  obj.setAttribute('height', jObj.height);
  obj.setAttribute('depth', jObj.depth);
  obj.setAttribute('jsonLoaded', '');
  if (jObj.file != null) {
    obj.setAttribute('obj-model', 'obj', 'url(' + jObj.file + ')');
  }
  if (jObj.onclick != null) {
    obj.setAttribute('cursor-listener', '');
    obj.setAttribute('onclick', jObj.onclick);
  }
  if (jObj.material != null && jObj.src == null) {
    obj.setAttribute('material', jObj.material);
  }
  if (jObj.src != null && jObj.material == null) {
    obj.setAttribute('src', jObj.src);
  }
  if (jObj.src != null && jObj.material != null){
    obj.setAttribute('src', jObj.src);
    obj.setAttribute('material', jObj.material);
  }
  if (jObj.type == "video") {
    if (jObj.autoplay == "true") {
      obj.setAttribute('autoplay', '');
    }
    obj.setAttribute('loop', jObj.loop);
  }
  else {
    obj.setAttribute('color', jObj.color);
    obj.setAttribute('value', jObj.value);
    obj.setAttribute('shadow', jObj.shadow);
  }

  father.appendChild(obj);

}

/*var html = '<select>  combo</select> '
json.data.forEach( (elem)  => {
    html += `<optiion id = "${elem.id}"> ${elem.name} </option>`
})*/

function iterateObjects(jsonInput, value, callback) {
  if (jsonInput == null || jsonInput == "") {
    return;
  }
  for (var i = 0; i < jsonInput.length; i++) {
    var obj = jsonInput[i];
    callback(obj, value);
    iterateObjects(obj.children, obj.id, callback);

  }
  objectCount = i;

}
function appendText(text) {

  var obj = document.createElement('li');
  obj.setAttribute('class', 'checklist-text');
  obj.innerText = text;
  var list = document.querySelector("#checklist");
  list.appendChild(obj);
}
function drawText(text) {
  var obj = document.createElement('li');
  obj.innerText = text;
  obj.setAttribute('class', 'checklist-text');

  var list = document.querySelector("#checklist");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  list.appendChild(obj);
}

function startTimer(item) {
  var delayInMilliseconds = item.delay;
  item.delayStart = Date.now();
  setTimeout(function (timeout) {
    var diff = Date.now() - item.delayStart;
    console.log("timer finished, delta: " + diff);
    if (playing && isCurrentMarkerVisible && ((diff - delayInMilliseconds)) > -100) { //if marker is still visible
      console.log("next!");
      goTo(item.next);
    }
    else {
      console.log("timer cancelled...");
    }


    console.log("Delta= " + diff);
  }, delayInMilliseconds);

}
function firstPlay() {
  hideOrShow("playButton");
  play();
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
function play(id) {
  if (id == null) {
    id = currentCard.autoplay;
  }
  console.log("playPause: " + id);
  var aVideoAsset = document.querySelector('#' + id);
  aVideoAsset.play().catch(function (error) {
    aVideoAsset.pause();
    drawText("Presione el boton de play");
    hideOrShow("playButton");

  });
  aVideoAsset.setAttribute('loop', 'false');

}
function playPause(id) {
  if (id == null) {
    id = currentCard.autoplay;
  }
  console.log("playPause: " + id);
  var aVideoAsset = document.querySelector('#' + id);
  if (aVideoAsset.paused == false) {
    aVideoAsset.pause();
  }
  else {

    aVideoAsset.play().catch(function (error) {
      drawText("Presione el boton de play");
      hideOrShow("playButton");

    });
  }

  aVideoAsset.setAttribute('loop', 'false');

}

function increaseScale(entityID,value){
  var obj = document.querySelector('#'+entityID)
  var scale = obj.getAttribute('scale');
  console.log('scale',Number(scale.x+value)+" "+scale.y+value+" "+scale.z+value);
  obj.setAttribute('scale',Number(scale.x+value)+" "+Number(scale.y+value)+" "+Number(scale.z+value));
 
}
function resetScale(entityID,value){
  var obj = document.querySelector('#'+entityID)
  console.log('scale',Number(value)+" "+value+" "+value);
  obj.setAttribute('scale',Number(value)+" "+Number(value)+" "+Number(value));
 
}

function getDistance(IDEntity3D,IDOtherEntity3D){
  console.log("distance...");
  var entity3D= document.querySelector("#" + IDEntity3D).object3D;
  var otherEntity3D= document.querySelector("#" + IDOtherEntity3D).object3D;
  var scene= document.querySelector("#scene").object3D;
  var from = entity3D.position;
  var to = otherEntity3D.position;
  var direction = to.clone().sub(from);
  var length = direction.length();
  var arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xff0000 );
  arrowHelper.name="arrowHelper";
  scene.add( arrowHelper );
  
  renderQueue.push(function(){
    var scene= document.querySelector("#scene").object3D;
    var object = scene.getObjectByName( "arrowHelper" );
    scene.remove(object);
    var entity3D= document.querySelector("#" + IDEntity3D).object3D;
    var otherEntity3D= document.querySelector("#" + IDOtherEntity3D).object3D;
    var from = entity3D.position;
    var to = otherEntity3D.position;
    var direction = to.clone().sub(from);
    var length = direction.length();
    var arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xff0000 );
    arrowHelper.name="arrowHelper";
    scene.add( arrowHelper );
    drawText(IDEntity3D +" -> "+IDOtherEntity3D+" : " +from.distanceTo(to));
  });
 

  
}
function isCurrentMarkerVisible() {
  if (currentCard == null) {
    return false;
  }
  var markerStack = getCardMarkers(currentCard);
  if (markerStack == null) {//if it has no marker its excecuted anyway
    return true;
  }
  var isVisible = false;
  markerStack.forEach(marker => {
    isVisible = isVisible | document.querySelector("#" + marker).object3D.visible; //if at least one marker is visible
  });
  return isVisible;
}

AFRAME.registerComponent('markerhandler', {
  init: function () {
    // Set up the tick throttling. Will check if marker is active every 500ms
    console.log("setting up marker handler...");
    this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
  },

  tick: function (t, dt) {
    if (activity != null) {
      if (isCurrentMarkerVisible() && playing == false) {
        // MARKER IS PRESENT
        var cursor=document.querySelector('#cursor');
        cursor.setAttribute('visible', true);
        document.querySelector('.scanningSpinner').style.display = 'none'; 
        currentTimeout = "";
        playing = true;
        loadCard(currentCard);

      } else if ((isCurrentMarkerVisible() == false) && (playing == true)) {
        currentTimeout = "";
        playing = false;
        var cursor=document.querySelector('#cursor');
        cursor.setAttribute('visible', false);
        document.querySelector('.scanningSpinner').style.display = '';
      }
      else if ((isCurrentMarkerVisible() == false) && (playing == false)) {
        if (activity != null) { //if its already loading
          console.log("looking for marker... " + getCardMarkers(currentCard));
        }
      }
      else if ((isCurrentMarkerVisible() == true) && (playing == true)) {
        //playing
        renderQueue.forEach(function(renderFnc){ //executes functions added to the render queue
          renderFnc();
        })

      }


    }
  }
});


AFRAME.registerComponent('cursor-listener', {
  init: function () {
    this.el.addEventListener('click', function (evt) {
      console.log("#" + this.id + " was clicked");
      if(this.object3D.visible){
        this.onclick;
      }
    });
  }
});


