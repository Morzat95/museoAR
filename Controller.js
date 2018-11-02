var a = window.location.toString();
var name;
var playing = false;
var currentCard = 0;
let activity;
var historyStack = [];
var renderFncQueue = [];
var renderObjsIDs = new Set();
var lastClicked = "";



function run() {
  if (a.indexOf('#') == -1) {
    name = a.substring(a.indexOf("?") + 1);
  }
  else {
    name = a.substring(a.indexOf("?") + 1, a.indexOf('#'));
  }
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
  var markerSet = new Set;
  if (card.marker != null) {
    markerSet.add(card.marker);
    return markerSet;
  }
  else if (card.objects != null) {
    card.objects.forEach(node => {
      if (node.marker != null) {
        markerSet.add(node.marker);
      }
    });
  }
  if (markerSet.length == 0) {
    return null;
  }
  return markerSet;
}


function preLoadCard(card) {
  if (card == null) {
    throw "Card is null: Check JSON-file";

  }
  if (!isPreloaded(card)) {
    if (card.marker == null && card.objects != null) { //if null we asume its because we are using multipleIndependentMarkers
      card.objects.forEach(node => {
        if (node.marker != null) {
          setObjectProperties(node, node.marker);
          iterateObjects(node.children, node.id, setObjectProperties);
        } else {
          throw "ERROR: Either a marker for the whole card must be set o every level1 object must have a marker";

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
  if (card.clearAll != null && card.clearAll == true) {
    clearRenderer();

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

  if (jObj.material != null && jObj.src == null) {
    obj.setAttribute('material', jObj.material);
  }
  if (jObj.src != null && jObj.material == null) {
    obj.setAttribute('src', jObj.src);
  }
  if (jObj.src != null && jObj.material != null) {
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


  if (jObj.onclick != null) {
    obj.setAttribute('onclick', jObj.onclick);
    obj.setAttribute('cursor-listener', '');
  }


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

function increaseScale(entityID, value) {
  var obj = document.querySelector('#' + entityID)
  var scale = obj.getAttribute('scale');
  console.log('scale', Number(scale.x + value) + " " + scale.y + value + " " + scale.z + value);
  obj.setAttribute('scale', Number(scale.x + value) + " " + Number(scale.y + value) + " " + Number(scale.z + value));

}
function resetScale(entityID, value) {
  var obj = document.querySelector('#' + entityID)
  console.log('scale', Number(value) + " " + value + " " + value);
  obj.setAttribute('scale', Number(value) + " " + Number(value) + " " + Number(value));

}
/*function drawMatrix(matrix,marker,width,height){
  markerObj= document.querySelector("#" + marker).object3D;
  var scene= document.querySelector("#scene").object3D;
  var size=Object.keys(matrix).length;
  var squareWidth = Math.floor(width/size);
  var squareHeight = Math.floor(height/size);
  console.log("the matrix squares will be: "+squareWidth+":"+squareHeight +" in size");
  
  var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0) );
  geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
  geometry.vertices.push(new THREE.Vector3( 10, 10, 0) );
  geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
  geometry.vertices.push(new THREE.Vector3(0, 0, 0) );
  var line = new THREE.Line( geometry, material );
  markerObj.add( line );
}*/
function drawMatrix(size, marker, width, height) {
  markerObj = document.querySelector("#" + marker).object3D;
  var squareWidth = width / (size * 4);
  var squareHeight = height / (size * 4);
  console.log("the matrix squares will be: " + squareWidth + ":" + squareHeight + " in size");
  var yOffset = (squareHeight * size);
  var xOffset = (squareWidth * size) / 4;
  for (let i = 1; i <= size; i++) {
    for (let j = 1; j <= size; j++) {
      var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new THREE.Vector3((squareWidth * i) - yOffset, 0, 0));
      geometry.vertices.push(new THREE.Vector3((squareWidth * i) - yOffset, 0, (squareHeight * j) - xOffset));
      geometry.vertices.push(new THREE.Vector3(0, 0, (squareHeight * j) - xOffset));
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      var line = new THREE.Line(geometry, material);
      markerObj.add(line);
    }


  }

}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawLine(IDEntity, IDOtherEntity) {
  drawLineWOffset(IDEntity, IDOtherEntity, 0, 0, 0, 0, 0, 0);
}
function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function drawCircle(IDEntity) {
  var circleID = guidGenerator();
  renderFncQueue.push(function () {
    var entity3D = document.querySelector("#" + IDEntity).object3D;
    var scene = document.querySelector("#scene").object3D;
    var from = new THREE.Vector3();
    from.setFromMatrixPosition(entity3D.matrixWorld);
   
    var geometry = new THREE.RingBufferGeometry( 0.066, 0.1, 32 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00FF00, side: THREE.DoubleSide } );
    var circle = new THREE.Mesh( geometry, material );
    circle.position.set(from.x,from.y,from.z);
    circle.rotation.set( entity3D.getWorldRotation().x,entity3D.getWorldRotation().y,entity3D.getWorldRotation().z);

    var olderCircle = scene.getObjectByName(circleID);
    if (olderCircle == null) {
      circle.name = circleID;
      scene.add(circle);
      renderObjsIDs.add(circle.name);
    }
    else {
      scene.remove(olderCircle);
      circle.name = circleID;
      scene.add(circle);

    }
});
  
}


function drawLineWOffset(IDEntity, IDOtherEntity, xOffset, yOffset, zOffset, xOffset2, yOffset2, zOffset2) {
  var lineColor = getRandomColor();
  var lineID = guidGenerator();
  renderFncQueue.push(function () {
    var entity3D = document.querySelector("#" + IDEntity).object3D;
    var otherEntity3D = document.querySelector("#" + IDOtherEntity).object3D;
    var scene = document.querySelector("#scene").object3D;
    var from = new THREE.Vector3();
    from.setFromMatrixPosition(entity3D.matrixWorld);
    var to = new THREE.Vector3();
    to.setFromMatrixPosition(otherEntity3D.matrixWorld);
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(from.x + xOffset, from.y + yOffset, from.z + zOffset));
    geometry.vertices.push(new THREE.Vector3(to.x + xOffset2, to.y + yOffset2, to.z + zOffset2));
    var line = scene.getObjectByName(lineID);
    if (line == null) {

      var material = new THREE.LineBasicMaterial({ color: lineColor, linewidth: 10 });
      line = new THREE.Line(geometry, material);
      line.name = lineID;

      scene.add(line);
      renderObjsIDs.add(line.name);
    }
    else {
      scene.remove(line);
      var material = new THREE.LineBasicMaterial({ color: lineColor, linewidth: 10 });
      line = new THREE.Line(geometry, material);
      line.name = lineID;
      scene.add(line);

    }
  });
}



function drawDistance(IDEntity3D, IDOtherEntity3D) {
  console.log("distance...");
  var entity3D = document.querySelector("#" + IDEntity3D).object3D;
  var otherEntity3D = document.querySelector("#" + IDOtherEntity3D).object3D;
  var scene = document.querySelector("#scene").object3D;
  var from = entity3D.position;
  var to = otherEntity3D.position;
  var direction = to.clone().sub(from);
  var length = direction.length();
  var arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xff0000);
  arrowHelper.name = "arrowHelper";
  scene.add(arrowHelper);

  renderFncQueue.push(function () {
    var scene = document.querySelector("#scene").object3D;
    var object = scene.getObjectByName("arrowHelper");
    scene.remove(object);
    var entity3D = document.querySelector("#" + IDEntity3D).object3D;
    var otherEntity3D = document.querySelector("#" + IDOtherEntity3D).object3D;
    var from = entity3D.position;
    var to = otherEntity3D.position;
    var direction = to.clone().sub(from);
    var length = direction.length();
    var arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xff0000);
    arrowHelper.name = "arrowHelper";
    scene.add(arrowHelper);
    drawText(IDEntity3D + " -> " + IDOtherEntity3D + " : " + from.distanceTo(to));
  });
}
function isCurrentMarkerVisible() {
  if (currentCard == null) {
    return false;
  }
  var markerSet = getCardMarkers(currentCard);
  if (markerSet == null || markerSet.size == 0) {//if it has no marker its excecuted anyway
    return true;
  }
  var isVisible = false;
  markerSet.forEach(marker => {
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
        var cursor = document.querySelector('#cursor');
        cursor.setAttribute('visible', true);
        document.querySelector('.scanningSpinner').style.display = 'none';
        currentTimeout = "";
        playing = true;
        loadCard(currentCard);

      } else if ((isCurrentMarkerVisible() == false) && (playing == true)) {
        currentTimeout = "";
        playing = false;
        var cursor = document.querySelector('#cursor');
        cursor.setAttribute('visible', false);
        document.querySelector('.scanningSpinner').style.display = '';
      }
      else if ((isCurrentMarkerVisible() == false) && (playing == false)) {

        if (activity != null) { //if its already loading
          var markers = "";
          getCardMarkers(currentCard).forEach(e => markers += e + " ");
          console.log("Looking for: " + markers);

        }
      }
      else if ((isCurrentMarkerVisible() == true) && (playing == true)) {
        //playing


      }


    }
  }
});
function clearRenderer() {
  renderFncQueue = []
  renderObjsIDs.forEach(function (objID) { //delete all objects
    var scene = document.querySelector("#scene").object3D;
    var obj = scene.getObjectByName(objID);
    scene.remove(obj);
    console.log(obj);
  });
  renderObjsIDs = new Set();
  console.log("clearing renderder...");
}
AFRAME.registerComponent('render-queue', {
  init: function () {
    // Set up the tick throttling. Will check if marker is active every 500ms
    console.log("setting up render Queue..");
    this.tick = AFRAME.utils.throttleTick(this.tick, 16, this); //renders at 60FPS
  },

  tick: function (t, dt) {
    if (playing == true) {
      //playing
      renderFncQueue.forEach(function (renderFnc) { //executes functions added to the render queue
        renderFnc();
      });
    }
    else {
      if (renderObjsIDs.size > 0) {
        console.log("removed =" + renderObjsIDs.size);
        renderObjsIDs.forEach(function (objID) { //delete all objects
          var scene = document.querySelector("#scene").object3D;
          var obj = scene.getObjectByName(objID);
          scene.remove(obj);
        });
        renderObjsIDs = new Set();
      }

    }
  }
});

AFRAME.registerComponent('cursor-listener', {
  init: function () {
    this.el.addEventListener('click', function (evt) {

      console.log("#" + this.id + " was clicked");
      if (this.object3D.visible) {
        console.log(this.object3D);
        this.onclick;
      }
    });
  }
});


