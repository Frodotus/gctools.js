var map;
var markers = {};
var locs = [];
var markersArray = [];
var cachesArray = [];

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
    if(document.getElementById(button).getAttribute("class") == "btn btn-danger") {
        document.getElementById(button).setAttribute("class","btn btn-success");
        markers[button].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
    } else {
        document.getElementById(button).setAttribute("class","btn btn-danger");
        markers[button].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
    }
}

function addToggler(marker, button) {
            google.maps.event.addListener(marker, 'click', function () {
                toggle(button);
            });
}

function parseCoordinates() {
        markers = {};
        locs = [];
        if (markersArray) {      
            for (i in markersArray) {     
                markersArray[i].setMap(null);    
            }  
        }   
        markersArray = [];
        map.overlayMapTypes.setAt( 0, null);
        var s = document.getElementById("location").value;
        s = s.replace(/\s/g, '').replace(/N/g, '').replace(/E/g, '.').replace(/\u00B0/g, '.');
        window.location.hash = "#" + s;
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
     var centerLon = 0;
     var centerLat = 0;
     all.forEach(function(entry,i,a) {
        count = count+1;
        arr = entry.split("");
        r = sr;
        arr.forEach(function(entryitem,i,a) {
           r = r.replace(/\?/, entryitem)
       });
        var x = r.split(".");
                    if(all.length<50){
                     var decLat = parseInt(x[0])+(parseFloat(x[1]+"."+x[2])/60);
                     var decLon = parseInt(x[3])+(parseFloat(x[4]+"."+x[5])/60);
                     centerLat = centerLat+decLat;
                     centerLon = centerLon+decLon;
                     var point = new google.maps.LatLng(decLat,decLon);
                     var marker = new google.maps.Marker({
                          position: point,
                          map: map,
                          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                          title:"N "+x[0]+"&deg; "+x[1]+"."+x[2]+" E "+x[3]+"&deg; "+x[4]+"."+x[5]
                      });                     
                     addToggler(marker,"btn-"+r);
                     markers["btn-"+r] = marker;
                     markersArray.push(marker); 
                     locs.push([decLat,decLon]);
                 }
                 retval += "<tr><td>"+ count +"</td><td>N "+x[0]+"&deg; "+x[1]+"."+x[2]+" E "+x[3]+"&deg; "+x[4]+"."+x[5]+"</td><td><button id=\"btn-"+r+"\" class=\"btn btn-success\" onclick=\"toggle('btn-"+r+"')\">Checked</button></td></tr>";
             });
      centerLat = centerLat/count;
      centerLon = centerLon/count;
      map.setCenter(new google.maps.LatLng(centerLat,centerLon), 11);
      document.getElementById("download").setAttribute("class","btn");
      document.getElementById("fetchCaches").setAttribute("class","btn");
      document.getElementById("cachecoord").innerHTML = retval;
}


function fetchCaches(){
    $.get('/caches', function(data) {
      if (cachesArray) {      
          for (i in cachesArray) {     
              cachesArray[i].setMap(null);    
          }  
      }   
      cachesArray = [];
      for (var i = 0; i < data.geocaches.length; i++) {
        var cache = data.geocaches[i];
        var point = new google.maps.LatLng(cache.lat,cache.lon);
        var marker = new google.maps.Marker({
              position: point,
              map: map,
              icon: cache.imageUrl,
              title: cache.name
         });                     
         if(cache.type == 2 || cache.type == 3){
             draw_circle = new google.maps.Circle({
                center: point,
                radius: 161,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#FF0000",
                fillOpacity: 0.05,
                map: map
             });
         }
         cachesArray.push(marker); 


         console.log(cache);
      }
    });
}

function genGpx(){
     var gpx_details = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+
                    "<gpx xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" version=\"1.0\" creator=\"Groundspeak, Inc. All Rights Reserved. http://www.groundspeak.com\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd\" xmlns=\"http://www.topografix.com/GPX/1/0\">"+
                    "<name>Waypoint Listing Generated by gcache.info</name>"+
                    "<desc></desc>"+
                    "<author>gcache.info</author>"+
                    "<email>indo@gcache.info</email>"+
                    "<url>http://www.gcache.info</url>"+
                    "<urlname>Geocache</urlname>"+
                    "<time>2013-05-15T17:18:18.0000000Z</time>"+
                    "<keywords>cache, geocache</keywords>"+
                    "<bounds minlat=\"59.000\" minlon=\"20.000\" maxlat=\"71.000\" maxlon=\"32.000\" />";
     var gpx = "";
     locs.forEach(function(entry,i,a) {
         gpx = gpx + "<wpt lat=\"" + entry[0] + "\" lon=\"" + entry[1] + "\">"+
                            "<time>2013-05-09T00:00:00</time>"+
                            "<name>possible cache location " + i + "</name>"+
                            "<desc>possible cache " + i + "</desc>"+
                            "<sym>Geocache</sym>"+
                            "<type>Geocache|Traditional Cache</type>"+
                            "</wpt>";
     });
      window.open("data:application/octet-stream;filename=bruteforce.gpx," + escape(gpx_details + gpx +"</gpx>"));
}

$(function(){
        var mapOptions = {
          center: new google.maps.LatLng(62+14/60,25+45/60),
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
        if(window.location.hash) {
            document.getElementById("location").value = window.location.hash.substring(1);
            parseCoordinates();
        }


})