var telefonos = [false, false, false, false];
var timer;
var count = 5;

function read(idx){
    telefonos[idx] = true;

    let ret = true;
    telefonos.forEach(elem => {
        ret = ret && elem;
    });

    if (ret) {
        // drawText('¿Estás listo? Recordá que podés volver revisar los datos cuando quieras ' + ' ');
        // setTimeout( function() {
        //     drawText('');
        //     goTo('Ordenar');
        // }, 5000);
        timer = window.setTimeout( "countdown()", 1000);
    }
}

function countdown() {
    drawText('¿Estás listo? Recordá que podés volver revisar los datos cuando quieras ' + String(count));

    if (count == 0) {
        window.clearTimeout();
        timer = null;
        drawText('');
        goTo('Ordenar');
    } else {
        timer = window.setTimeout("countdown()", 1000);
    }

    count--;
}