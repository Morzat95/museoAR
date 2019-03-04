# MuseoAR

MuseoAR is a mobile-ready, AR learning framework that allows to easily create AR activities and presentations with little to none programming background. It sits on top of [ar.js](https://github.com/jeromeetienne/AR.js)  and uses a .JSON file that contains an array of **cards**, these objects are transitions similar to what **slides** are in an ordinary presentation, inside museoAR these transitions can be triggered by **delay** or by user interaction. eg by **click**

### Upcoming!

  - As of now [projectAR](https://gitlab.com/pedrogut/proyectAR) (museoAR's GUI) is being developed, this sister-project will allow point and click creation of AR experiences inside museoAR.
  
### Example
```JSON
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
  

### Installation
Just run the server!

```sh
$ sudo snap install serve`
$ cd museoAR
$ serve
```
Because you need https for mobile devices to work you may need a webcam and a desktop, If you want to test it on mobile you will need an https server.