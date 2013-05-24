var map;

function allPossibleCases(arr) {
      if (arr.length == 1) {
        return arr[0];
      } else {
        var result = [];
        var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
        for (var i = 0; i < allCasesOfRest.length; i++) {
          for (var j = 0; j < arr[0].length; j++) {
            result.push(arr[0][j] + allCasesOfRest[i]);
        }
      }
      return result;
      }
}


function toggle(button) {
    console.log("Toggle: "+button)
    document.getElementById(button).setAttribute("class","btn btn-warning");
}

function addToggler(marker, button) {
            google.maps.event.addListener(marker, 'click', function () {
                toggle(button);
            });
}

function parseCoordinates() {
        map.overlayMapTypes.setAt( 0, null);
        var s = document.getElementById("location").value;
        s = s.replace(/\s/g, '').replace(/N/g, '').replace(/E/g, '.').replace(/\u00B0/g, '.');
        sr = s.replace(/\(.*?\)/g, '?')
        var c = sr.split(".");
        document.getElementById("cachecoord").innerHTML = "N "+c[0]+"&deg; "+c[1]+"."+c[2]+" E "+c[3]+"&deg; "+c[4]+"."+c[5]+"";
        q = s.match(/\(.*?\)/g);
        q.forEach(function(entry,i,a) {
            e = entry.replace(/\(/g, '').replace(/\)/g, '');
            e = e.split(",");
            a[i] = e;
        });
        all = allPossibleCases(q);
        var retval = "";
        if(all.length>49){
         error="Too many possibilities to map<br />"
     } 
     retval="<tr><th>#</th><th>Coordinates</th><th>Checked</th></tr>"
     var count = 0;
     all.forEach(function(entry,i,a) {
        count = count+1;
        arr = entry.split("");
        r = sr;
        arr.forEach(function(entryitem,i,a) {
           r = r.replace(/\?/, entryitem)
       });
        var x = r.split(".");
                    //console.log(parseInt(x[0])+(parseInt(x[1])+parseInt(x[2])/100)/60,parseInt(x[3])+(parseInt(x[4])+parseInt(x[5])/100)/60);

                    if(all.length<50){
                     var point = new google.maps.LatLng(parseInt(x[0])+(parseInt(x[1])+parseInt(x[2])/100)/60,parseInt(x[3])+(parseInt(x[4])+parseInt(x[5])/100)/60);
                     var marker = new google.maps.Marker({
                          position: point,
                          map: map,
                          title:"N "+x[0]+"&deg; "+x[1]+"."+x[2]+" E "+x[3]+"&deg; "+x[4]+"."+x[5]
                      });
                     addToggler(marker,"btn-"+r);
                     map.setCenter(new google.maps.LatLng(parseInt(x[0])+(parseInt(x[1])+parseInt(x[2])/100)/60,parseInt(x[3])+(parseInt(x[4])+parseInt(x[5])/100)/60), 11);
                 }
                 retval += "<tr><td>"+ count +"</td><td>N "+x[0]+"&deg; "+x[1]+"."+x[2]+" E "+x[3]+"&deg; "+x[4]+"."+x[5]+"</td><td><button id=\"btn-"+r+"\" class=\"btn btn\" onclick=\"toggle('btn-"+r+"')\">Checked</button></td></tr>";
             });
      document.getElementById("cachecoord").innerHTML = retval;

}

$(function(){

        var mapOptions = {
          center: new google.maps.LatLng(62+14.052/60,25+48.972/60),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);


})