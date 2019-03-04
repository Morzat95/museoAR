# MuseoAR

MuseoAR is a mobile-ready, AR learning framework that allows to easily create AR activities and presentations with little to none programming background. It sits on top of [ar.js](https://github.com/jeromeetienne/AR.js) and [a-frame](https://aframe.io/) using a JSON file that contains an array of **cards**, these objects are transitions similar to what **slides** are in an ordinary presentation, inside museoAR these transitions can be triggered by **delay** or by user interaction. eg by **click**

This project was possible thanks to UNGS's museum of science Scholarship.
  
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


## Card Properties
With these properties we can create all transitions between cards that do not require user interaction.

| Property | Description |
| ------ | ----------- |
| id | Unique id to be able to jump from one card to the other |
| description | Text to be displayed when active |
| type | The type of redirection of the card |
| delay | The amount of time to wait before changing to the next card. (Only applicable for cards of type **delay**) |
| next    | The card to which to jump next when the time is up |
| marker   | Global marker for this card. This is optional as you can set markers on a per-object basis |
| objects   | Object array containing everything the card has to display |


## Object Properties
These properties modify the objects contained in each card and modify the behaviour of user interactions for now thats just **clicks** 

| Property | Description |
| ------ | ----------- |
| id | Unique id to be able identify show and delete each object |
| marker   | Marker for this object. Used on a per-object basis |
| type | The type correspoding to **a-frame**'s naming scheme. eg. a-box |
| children | Objects whose position is relative to this object. Children cannot have a different marker that their father |
| onclick | The javascript function or script that will be executed when this object is clicked |
##Onclick-Ready Functions
These funcions are designed to be called from the JSON file. However **onclick** accepts any kind of JavaScript you throw at it, yes even conditionals!!

This makes the framework really customizable if needed.

| Function | Description |
| ------ | ----------- |
| goTo( id )   | Transition to card with this id  |
| drawText(text)| Draws text on screen (overrides **description**) |
| appendText(text)| Same but does not override. |
| playPause(id)| Plays or pauses a video, depending on its current state |
| play(id)| Plays a video|
| hideOrShow(id)| Toggles visibility of an object|
| resetScale(id,value)| Overrides current scale of object in all axes|
| increaseScale(id,value)| Adds to current scale of object in all axes|
| drawCircle(id)| Draws a green circle on top of an object|
| drawLine(id,otherId)| Draws a random-colored line between objects|
| drawDistance(id,otherId)| Same as draw line but prints distance|
| log(action, value)| Sends POST to server, server file on other/srvLog.php|

## Menu Properties
The **.menu** files allow to make a simple and fast menu for your activies and the ability to toggle AR on or off.


| Property | Description |
| ------ | ----------- |
| name | Tittle of the menu file |
| description | Description of the menu file |
| preview | Preview image link or relative path|
| itemsFile | Path to .json file containing the activity |

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
