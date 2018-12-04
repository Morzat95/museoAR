$( document ).ready(function() {

    $("button").on("click",function(){

        // BASE64 encode
        var action = window.btoa("a button was pressed");
        var value = window.btoa($(this).val());
        var example = window.btoa("rock and roll");

        $.ajax({
            url: "https://loggermuseoar.000webhostapp.com/srvLog.php",
            type: "POST",
            dataType: "json",
            cache: false,
            data: {
                "action" : action,
                "value" : value,
                "example" : example
            },
            success: function( data ){
                console.log(data);
            }
        });
    });
});