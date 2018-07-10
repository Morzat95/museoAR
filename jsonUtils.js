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