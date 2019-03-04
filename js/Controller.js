
var a = window.location.toString();
var name;
var playing = false;
var currentCard = 0;
let activity;
var historyStack = [];
var renderFncQueue = [];
var renderObjsIDs = new Set();
var lastClicked = "";
var id;
var logAddress="https://loggermuseoar.000webhostapp.com/srvLog.php";



function run() {
  if (a.indexOf('#') == -1) {
    name = a.substring(a.indexOf("?") + 1);
  }
  else {
    name = a.substring(a.indexOf("?") + 1, a.indexOf('#'));
  }
  console.log("activity= " + name);
  loadJSON(name, loadActivity); //loads .item.json
  var cookie = document.cookie; 
  if(cookie==""){
    id=generateUUID();
    document.cookie =id+"; expires=Thu, 1 Jan 2019 12:00:00 UTC;";
    console.log("cookieGenerated="+document.cookie)
  }
  else{
    id=cookie.substring(cookie.indexOf(";"));
    console.log("cookieLoaded="+cookie)
  }

}


function loadActivity(jsonInput) {
  currentCard = jsonInput[0];
  activity = new Map();
  jsonInput.forEach(card => {
    console.log("loading...id:" + card.id + " element: " + card.description);
    activity.set(card.id, card);
    if(card.matrixURL!=null){
      parseCSV(card.matrixURL,function(result){card.matrix=result;},
      );
      console.log(card.matrixURL);
    }
  });
  preLoadCard(currentCard);
  console.log(activity);
}
function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
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
    if (card.marker == null && card.objects != null) { //if null we assume its because we are using multipleIndependentMarkers
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
  historyStack.push(currentCard.id);
  deleteCard(currentCard);
  console.log(next);
  currentCard = activity.get(next);
  if (currentCard == null) {
    console.error("attempted to redir(ect to: " + next + " but it was not found...");
  }
  log("goTo",currentCard.id);
  playing = false;
}


function log(action, value){
  $.ajax({
    url: logAddress,
    type: "POST",
    dataType: "json",
    cache: false,
    data: {
        "action" : window.btoa(action),
        "value" : window.btoa(value),
        "id" : window.btoa(id)
    },
    success: function( data ){
        console.log(data);
    }
});
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
  if(Jobj.type=="matrix"){
    console.log(currentCard.matrix);
    drawMatrix(currentCard.matrix,Jobj.marker,Jobj.width,Jobj.height,Jobj.xOffset,Jobj.yOffset);
    return;
  }
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
  var obj = document.querySelector('#' + entityID);
  var scale = obj.getAttribute('scale');
  console.log('scale', Number(scale.x + value) + " " + scale.y + value + " " + scale.z + value);
  obj.setAttribute('scale', Number(scale.x + value) + " " + Number(scale.y + value) + " " + Number(scale.z + value));

}
function resetScale(entityID, value) {
  var obj = document.querySelector('#' + entityID);
  console.log('scale', Number(value) + " " + value + " " + value);
  obj.setAttribute('scale', Number(value) + " " + Number(value) + " " + Number(value));

}



function drawMatrix(matrix,markerID,width,height,YOffset,XOffset){
  var matrixObjID = guidGenerator();
  var matrixObj = matrixHelper(matrix,width,height,YOffset,XOffset);
  renderFncQueue.push(function () {
    var marker = document.querySelector("#" + markerID).object3D;
  //  var scene = document.querySelector("#scene").object3D;
   // var from = new THREE.Vector3();
   // from.setFromMatrixPosition(entity3D.matrixWorld);
   // matrixObj.position.set(from.x,from.y,from.z);
  //  matrixObj.rotation.set( entity3D.getWorldRotation().x,0,0);

    var oldermatrixObj = marker.getObjectByName(matrixObjID);
    if (oldermatrixObj == null) {
      matrixObj.name = matrixObjID;
      marker.add(matrixObj);
      renderObjsIDs.add(matrixObj.name);
    }
    else {
      marker.remove(oldermatrixObj);
      matrixObj.name = matrixObjID;
      marker.add(matrixObj);

    }
});

    
  }

function matrixHelper(matrix,width,height,YOffset,XOffset){
  var size=Object.keys(matrix).length;
  var squareWidth = width ;
  var squareHeight = height;
  var yOffset = XOffset||0; //if Xoffset is null it uses 0 instead
  var xOffset = YOffset||0;
  var matrixObj= new THREE.Object3D();
  
  console.log(cellColorGenerator(cell));

  for (let i = 0; i < size-1; i++) {
    var row = matrix[i];
    for (let j = 0; j < Object.keys(matrix[i]).length; j++) {
      var cell = row [j];
      //console.log("Row: "+i+"Column: "+j+"cell: "+cell);
      var material = new THREE.LineBasicMaterial({ color: cellColorGenerator(cell)});
      var geometry = new THREE.Geometry();


      var xroot= (squareWidth * (j))+xOffset;
      var yroot= (squareHeight * (i))+yOffset;
      var y= (squareHeight * (i+1))+yOffset;
      var x= (squareWidth * (j+1))+xOffset;
    //  console.log("Xroot= "+xroot+" Yroot="+yroot+" x= "+x+"y= "+y);

      geometry.vertices.push(new THREE.Vector3(xroot, 0, yroot));
      geometry.vertices.push(new THREE.Vector3(xroot , 0, y));
      geometry.vertices.push(new THREE.Vector3(x, 0, y));
      geometry.vertices.push(new THREE.Vector3(x , 0, yroot));
      geometry.vertices.push(new THREE.Vector3(xroot, 0, yroot));
      
      //draw3DText(markerObj,xroot, yroot,cell,cellColorGenerator(cell),20);
      // console.log("value is "+20/(1/50));
      let line = new THREE.Line(geometry, material);



      matrixObj.add(line);
      
    }
    
  }

  return matrixObj;

}

function draw3DText(parent,x,y,text,tcolor,scale){
var loader = new THREE.FontLoader();
loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/gentilis_regular.typeface.json', function ( font ) {
    var textGeo = new THREE.TextGeometry( text, {
        font: font,
        size: (scale/100)*0.1, // font size
        height: (scale/100)*0.05, // how much extrusion (how thick / deep are the letters)
        curveSegments: (scale/100)*0.06,
        bevelThickness: (scale/100)*0.005,
        bevelSize: (scale/100)*0.005,
        bevelEnabled: true
        
    });
 
    textGeo.computeBoundingBox();
    var textMaterial = new THREE.MeshPhongMaterial( { color: tcolor, specular:  tcolor } );
    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.x = x+0.01;
    mesh.position.y = 0;
    mesh.position.z = y+0.035;
    mesh.rotation.x = -Math.PI/2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add( mesh );
});
}
/*
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

}*/
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function cellColorGenerator(cellPoints) {
	var r, g, b;
	var h = 1 - (cellPoints / 100);
	var i = ~~(h * 6);
	var f = h * 6 - i;
	var q = 1 - f;
	switch(i % 6){
		case 0: r = 1, g = f, b = 0; break;
		case 1: r = q, g = 1, b = 0; break;
		case 2: r = 0, g = 1, b = f; break;
		case 3: r = 0, g = q, b = 1; break;
		case 4: r = f, g = 0, b = 1; break;
		case 5: r = 1, g = 0, b = q; break;
	}
	var c = "#" + ("00" + (~ ~(r * 235)).toString(16)).slice(-2) + ("00" + (~ ~(g * 235)).toString(16)).slice(-2) + ("00" + (~ ~(b * 235)).toString(16)).slice(-2);
	return (c);
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
    var entity3D = document.querySelector("#" + IDEntity).camera.object3D;
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

function drawLine(IDEntity, IDOtherEntity) {
  drawLineWOffset(IDEntity, IDOtherEntity, 0, 0, 0, 0, 0, 0);
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

function calculateOnMatrixPosition(matrixID,PinID){
  var entity3D = document.querySelector("#" + matrixID).object3D;
  var otherEntity3D = document.querySelector("#" + PinID).object3D;
  var matrixVector = new THREE.Vector3();
  matrixVector.setFromMatrixPosition(entity3D.matrixWorld);

  var pinVector = new THREE.Vector3();
  var subVector = new THREE.Vector3();
  pinVector.setFromMatrixPosition(otherEntity3D.matrixWorld);
  subVector.subVectors(matrixVector,pinVector);
  console.log("Pin Vector= ("+pinVector.x+","+pinVector.y+","+pinVector.z+")");
  console.log("Matrix Vector= ("+matrixVector.x+","+matrixVector.y+","+matrixVector.z+")");
  console.log("Sub Vector= ("+subVector.x+","+subVector.y+","+subVector.z+")");
}

function drawDistance(IDEntity, IDOtherEntity) {
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
    geometry.vertices.push(new THREE.Vector3(from.x , from.y, from.z ));
    geometry.vertices.push(new THREE.Vector3(to.x , to.y , to.z ));
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
    drawText(IDEntity + " -> " + IDOtherEntity + " : " + from.distanceTo(to));
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
    isVisible = isVisible || document.querySelector("#" + marker).object3D.visible; //if at least one marker is visible
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
        playing = true;
        loadCard(currentCard);

      } else if ((isCurrentMarkerVisible() == false) && (playing == true)) {
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
  renderFncQueue = [];
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
    this.el.addEventListener('click', function (event) {

      console.log("#" + this.id + " was clicked");
      if (this.object3D.visible) {
        //console.log(this.object3D);
        this.onclick;
      }
    });
  }
});



