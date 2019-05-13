let activity;
let activityItemsFile;
let hasPassword = false;

function loadMenu(input) {

    loadJSON(input, loadActivity);
    activityItemsFile = input;
}

function loadActivity(jsonInput) {
    console.log("loading Activity... " + jsonInput);
    activity = jsonInput;
    activityItemsFile = activity.itemsFile;
    showActivity();

}

function showActivity() {
    //loads level data and shows it on card
    $(function () {
        $("#preview").attr("src", activity.preview);
        $("#description").text(activity.description);
        $("#name").text(activity.name);
        if(activity.password!==null&&activity.password!==undefined){
            hasPassword = true;
            $("#passwordInput").show();
        }

    });
}

function goTo() {
    if(hasPassword){
        if(activity.password.localeCompare($("#passwordInput").val())!==0){ //if password does not match
            $("#invalid").show();
            return;
        }
    }

    if (activity.cards == null) { //If cards are not embedded

        if (document.getElementById("arCheck").checked) {
            window.location.href = "ar.html?" + activityItemsFile;
        } else {

            window.location.href = "arEmu.html?" + activityItemsFile;
        }
    } else {//if cards are embedded on URL

        let a = window.location.toString();
        let parameter = a.substring(a.indexOf("?") + 1);
        if (document.getElementById("arCheck").checked) {
            window.location.href = "ar.html?" + parameter;
        } else {

            window.location.href = "arEmu.html?" + parameter;
        }

    }

}



