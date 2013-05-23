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

function parseCoordinates() {
        map.clearOverlays();
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
                     var point = new GLatLng(parseInt(x[0])+(parseInt(x[1])+parseInt(x[2])/100)/60,parseInt(x[3])+(parseInt(x[4])+parseInt(x[5])/100)/60);
                     var marker = new GMarker(point);
                     GEvent.addListener(marker, "click", function () {
                       map.openInfoWindowHtml(point, "N "+x[0]+"&deg; "+x[1]+"."+x[2]+" E "+x[3]+"&deg; "+x[4]+"."+x[5]);
                   });
                     map.addOverlay(marker);
                     map.setCenter(new GLatLng(parseInt(x[0])+(parseInt(x[1])+parseInt(x[2])/100)/60,parseInt(x[3])+(parseInt(x[4])+parseInt(x[5])/100)/60), 11);
                 }
                 retval += "<tr><td>"+ count +"</td><td>N "+x[0]+"&deg; "+x[1]+"."+x[2]+" E "+x[3]+"&deg; "+x[4]+"."+x[5]+"</td><td><button id=\"btn-"+r+"\" class=\"btn btn\" onclick=\"toggle('btn-"+r+"')\">Checked</button></td></tr>";
             });
      document.getElementById("cachecoord").innerHTML = retval;

}

$(function(){
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map_canvas"));
        map.addControl(new GLargeMapControl3D());
        map.addControl(new GMapTypeControl());
        map.setCenter(new GLatLng(62+14.052/60,25+48.972/60), 7);
        //        map.setCenter(new GLatLng(61.00383333333333,24.5755), 7);
    }
})