function odswiez() {
    console.log("reloading page...");
    location.reload();
}
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}
var ileJednostek;
$.getJSON('https://psp.opole.pl/wp-json/wpgmza/v1/markers', function(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        $.getJSON('https://nominatim.openstreetmap.org/reverse?lat='+data[i].lat+'&lon='+data[i].lng+'&format=jsonv2', function(gigachad) {
            console.log(gigachad);
            var ospis = data[i].description;

            //ZAMIANA PRZECINKA NA KROPKI PRZY ILOŚCI WODY JEDNOSTKI

            for (var j = 2; j < ospis.length; j++) {
                var n=ospis.indexOf(",", j);
                if (ospis.charAt(n)===',' && n> 0) {
                j = n;
                }
                if (n > 0 && ospis.charAt(n) === ',' ) {
                if (!isNaN(ospis.charAt(n - 1)) && !isNaN(ospis.charAt(n + 1))) {
                    ospis = setCharAt(ospis, n, ".")
                    }
                }
            }
            for (var k = 2; k < ospis.length; k++) {
                var o=ospis.indexOf("-", k);
                if (ospis.charAt(o)==='-' && o> 0) {
                k = o;
                }
                if (o > 0 && ospis.charAt(o) === '-' ) {
                if (!isNaN(ospis.charAt(o - 1)) && !isNaN(ospis.charAt(o + 1))) {
                    ospis = setCharAt(ospis, o, "o")
                    }
                }
            }
            ospis = ospis.replaceAll(",", "&nbsp &nbsp   •   &nbsp &nbsp");
            console.log('Spis jednostek: '+ospis);
            var liczbaJed = ospis.split("•").length;
            console.log('Liczba jednostek:'+liczbaJed);
            var isGru = "";
            if (data[i].description.search("309o15") >= 0 || data[i].description.search("309o16") >= 0 || data[i].description.search("309o17") >= 0) {
                isGru = "!  &nbsp";
            } else if (data[i].description.search("309-15") >= 0 || data[i].description.search("309-16") >= 0 || data[i].description.search("309-17") >= 0) {
                isGru = "!  &nbsp";
            } else {
                isGru = "";
            }
            console.log(isGru);

            console.log('Interwencja '+i+':');
            if (gigachad.address.village != undefined) {
                console.log('Adres: '+gigachad.address.village);
            } else if (gigachad.address.city != undefined) {
                console.log('Adres: '+gigachad.address.city);
            } else if (gigachad.address.suburb != undefined) {
                console.log('Adres: '+gigachad.address.county+' '+gigachad.address.suburb);
            }





            if (data[i].title == "Pożar") {
                var templateW = '<li class="containerli"><div class="containerul"><b style="color:#d62828">'+isGru+' </b><b style="color:#d62828">'+ data[i].title+'&nbsp   </b><small><a href="https://www.google.com/maps/search/?api=1&map_action=map&query='+data[i].lat+','+data[i].lng+'" target="_blank">'+gigachad.display_name+'</a><br><i style="opacity: 0.7">'+ospis+'&nbsp &nbsp &nbsp ('+liczbaJed+')</i></small></div></li>';
            } else if (data[i].title == "Miejscowe zagrożenie") {
                var templateW = '<li class="containerli"><div class="containerul"><b style="color:#d62828">'+isGru+' </b><b style="color:#89b0ae">'+ data[i].title+'&nbsp   </b><small><a href="https://www.google.com/maps/search/?api=1&map_action=map&query='+data[i].lat+','+data[i].lng+'" target="_blank">'+gigachad.display_name+'</a><br><i style="opacity: 0.7">'+ospis+'&nbsp &nbsp &nbsp ('+liczbaJed+')</i></small></div></li>';
            } else {
                var templateW = '<li class="containerli"><div class="containerul"><b style="color:#d62828">'+isGru+' </b><b>'+ data[i].title+'&nbsp   </b><small><a href="https://www.google.com/maps/search/?api=1&map_action=map&query='+data[i].lat+','+data[i].lng+'" target="_blank">'+gigachad.display_name+'</a><br><i style="opacity: 0.7">'+ospis+'</i></small></div></li>';
            }




            //var templateW = '<li class="containerli"><div class="containerul"><b style="color:#d62828">'+isGru+'</b><b>'+ data[i].title+'   </b><small><a href="https://www.google.com/maps/search/?api=1&map_action=map&query='+data[i].lat+','+data[i].lng+'">'+data[i].address+'</a><br>'+ospis+'</small></div></li>';
            //console.log(templateW);
            console.log('==========================================================');

            $('.essa').append(templateW);
        });
    }
});