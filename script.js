let random;
let data;
function getRandomInt(max) {
    do {
        return Math.floor(Math.random() * max);
    }while (random == max)
}



function dziala() {
    $.get( "api-prawda.json", function( data ) {
        $( ".result" ).html( data );
        console.log( "Load was performed." );
        random=getRandomInt(data.length);
        console.log(data[random]);
        nowq = data[random].question;
        console.log(nowq);
        $("#pytanie").text(data[random].question);
    });
}

function shareQuestion() {
    console.log("dd")
    const shareData = {
        title: 'Pytanie',
        text: String(nowq) + " \n \n pytanie ze strony:",
        url: 'https://lubiewdupe.scianagipsowa.online'
    }
    navigator.share(shareData);
    console.log(shareData);
    alert("udostepnione");
}