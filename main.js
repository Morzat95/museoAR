loadJSON(function(response){
  var jsonInput = JSON.parse(response);
  console.log(jsonInput);
  if (IsJsonString(jsonInput)) {
    toDOM(JSON.parse(jsonInput));
  } else {
    console.log("oops not valid json");
  }
  // Component to change to a sequential color on click.
});

AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'lightblue'];
    this.el.addEventListener('click', function (evt) {
      lastIndex = (lastIndex + 1) % COLORS.length;
      this.setAttribute('material', 'color', COLORS[lastIndex]);
      console.log(this.getAttribute('scale'))
      console.log('I was clicked at: ', evt.detail.intersection.point);
      var el = document.createElement('a-entity');
      document.querySelector('a-scene').appendChild(el);
    });
  }
});



function loadJSON(callback) {

   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', 'models/trafo4Bornes/trafo4Bornes.json', true); // Replace 'my_data' with the path to your file
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function appendObject(id, file, scale, position, rotation, scale) {
     console.log(position);
     $('<a-entity />', {
       id: id,
       class: 'city object children',
       position: position,  // doesn't seem to do anything
       scale: scale,
       rotation: rotation,
       file: file,
       "obj-model": "obj: url(assets/obj/" + file + ".obj); mtl: url(assets/obj/" + file + ".mtl)",
       // src: '#' + file + '-obj',
       // mtl: '#' + file + '-mtl',
       appendTo : $('#city')
     });
    document.getElementById(id).setAttribute("position", position); // workaround - this does set position
}

function toDOM(jsonInput) {
 // this assumes it is being run first -- it will start placing objects with id 0 and set objectcount to the number of loaded objects
 for(var i = 0; i < jsonInput.length; i++) {
     var obj = jsonInput[i];
     console.log("Adding entity #" + obj.id);
     appendObject(obj.id, obj.file, obj.scale, obj.position, obj.rotation, obj.scale)
 }
 objectCount = i;
 console.log("objectCount:" + objectCount);
}
