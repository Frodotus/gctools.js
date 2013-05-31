var map;
var marker;
var center = new google.maps.LatLng(62+14/60,25+45/60);

function toDecMinString(latLng){
  var lat = latLng.lat().toString().split(".");
  var lng = latLng.lng().toString().split(".");
  lat[1] = (parseFloat("0."+lat[1]) * 60).toFixed(3);
  lng[1] = (parseFloat("0."+lng[1]) * 60).toFixed(3);            
  return "N "+lat[0]+"° "+lat[1]+" E "+lng[0]+"° "+lng[1];
  
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
})