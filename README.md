# MuseoAR

MuseoAR is a mobile-ready, AR learning framework that allows to easily create AR activities and presentations with little to none programming background. It sits on top of [ar.js](https://github.com/jeromeetienne/AR.js) and [a-frame](https://aframe.io/) using a JSON file that contains an array of **cards**, these objects are transitions similar to what **slides** are in an ordinary presentation, inside museoAR these transitions can be triggered by **delay** or by user interaction. eg by **click**
  
## Demo Video
 [![Marker](https://user-images.githubusercontent.com/15642727/53751235-9d7af200-3e8a-11e9-972e-c66ab2fe5afe.gif)](https://www.youtube.com/watch?v=ZWhPTb0Ls5A)
 
 https://www.youtube.com/watch?v=ZWhPTb0Ls5A

## Example 
Go to this link [http://bit.ly/museoAR](https://museoar.herokuapp.com/menu.html?githubDemo) to try it out!

Just point to this **AR Marker** or uncheck AR on the menu to try it on a desktop
[![Marker](https://stemkoski.github.io/AR-Examples/markers/kanji.png)]()

## Demo Json File

```JSON
//activities/githubDemo.json
[
   {
      "id":"A",
      "description":"This is a Blue box, touch it to make it Red!",
      "objects":[
         {
            "id":"cube1",
            "marker":"kanji",
            "scale":"0.5 0.5 0.5",
            "rotation":"-31 65 -50",
            "type":"a-box",
            "onclick":"goTo('B')",
            "color":"blue"
         }
      ]
   },
   {
      "id":"B",
      "description":"Congratulations! you made it!",
      "type":"delay",
      "delay":"5000",
      "next":"C",
      "objects":[
         {
            "id":"cube2",
            "marker":"kanji",
            "scale":"0.5 0.5 0.5",
            "rotation":"-31 65 -50",
            "type":"a-box",
            "color":"red"
         }
      ]
   },
   {
      "id":"C",
      "description":"",
      "type":"redirect",
      "destiny":"menu.html?githubDemo"
   }
]
```
 As you can see with this simple file we can have 3 different transitions with user interaction without needing to know how to code. However some technical knowledge is necessary to make a JSON file, so the idea is to automate that process too.
## Upcoming!

  - As of now [projectAR](https://gitlab.com/pedrogut/proyectAR) (museoAR's activity-creation-GUI) is being developed, this sister-project will allow point and click creation of AR experiences inside museoAR without ever touching a JSON file.
### Features
Works with:
- 3D objects
- Images
- Video (event alpha channel transparent)
- Multimarker (using **multi** as marker, training and saving your marker [info](https://github.com/agusalex/AR.jsAframeMultimarkerDemo)
- Multiple Independent markers per object

### More Examples
- Demo of all media-types mentioned [link](https://museoar.herokuapp.com/menu.html?demo) (kanji)
- Multiple Independent markers: [measureIt](https://museoar.herokuapp.com/menu.html?measureIt) and [this one](https://museoar.herokuapp.com/menu.html?actividad) (kanji **and** hiro)
- Multiple Markers combined [link](https://museoar.herokuapp.com/menu.html?multiMarker) you'll need [this](https://github.com/agusalex/museoAR/blob/master/other/demoARtoolkit.png?raw=true) image to try it 


## Installation
Just run the server!

```sh
$ sudo snap install serve`
$ cd museoAR
$ serve
```
Because you need https for mobile devices to work you may need a webcam and a desktop, If you want to test it on mobile you will need an https server.
