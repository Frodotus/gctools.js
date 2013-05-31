var map;
var marker;
var center = new google.maps.LatLng(62+14/60,25+45/60);
var cachesArray = [];

function toDecMinString(latLng){
  var lat = latLng.lat().toString().split(".");
  var lng = latLng.lng().toString().split(".");
  lat[1] = (parseFloat("0."+lat[1]) * 60).toFixed(3);
  lng[1] = (parseFloat("0."+lng[1]) * 60).toFixed(3);            
  return "N "+lat[0]+"° "+lat[1]+" E "+lng[0]+"° "+lng[1];
  
}

function fetchCaches(){
    var latLng = marker.getPosition();
    $.get('/caches.json?lat='+latLng.lat()+'&lon='+latLng.lng(), function(data) {
      if (cachesArray) {      
          for (i in cachesArray) {     
              cachesArray[i].setMap(null);    
          }  
      }   
      cachesArray = [];
      for (var i = 0; i < data.geocaches.length; i++) {
        var cache = data.geocaches[i];
        var point = new google.maps.LatLng(cache.lat,cache.lon);
        var pinIcon = new google.maps.MarkerImage(
            cache.imageUrl,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            new google.maps.Point(8, 8), /* anchor is bottom center of the scaled image */
            new google.maps.Size(16, 16)
        );  
        var marker = new google.maps.Marker({
              position: point,
              map: map,
              icon: pinIcon,
              title: cache.name
         });                     
         if(cache.type == 2 || cache.type == 3 || (cache.type == 8 && cache.solved == true)){
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
             cachesArray.push(draw_circle); 
         }
         cachesArray.push(marker); 
      }
    });
}

$(function(){
        if(window.location.hash) {
            var coordinates = window.location.hash.substring(1).split("&");
            center = new google.maps.LatLng(coordinates[0],coordinates[1]);
        }
        var mapOptions = {
          center: center,
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
        marker = new google.maps.Marker({
          position: center,
          draggable:true,
          animation: google.maps.Animation.DROP,
          map: map,
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          title: "Coordinates"
        });             

        var latLng = marker.getPosition();
        var cdiv = document.getElementById("coordinates");
        window.location.hash = "#" + latLng.lat()+"&"+latLng.lng();
        cdiv.innerHTML= "Coordinates: "+toDecMinString(latLng);

        google.maps.event.addListener(marker, 'dragend', function() {          
            var latLng = marker.getPosition();
            var cdiv = document.getElementById("coordinates");
            window.location.hash = "#" + latLng.lat()+"&"+latLng.lng();
            cdiv.innerHTML= "Coordinates: "+toDecMinString(latLng);
        });

        $("body").on({
          ajaxStart: function() { 
              $(this).addClass("loading"); 
          },
          ajaxStop: function() { 
              $(this).removeClass("loading"); 
          }    
        });
})