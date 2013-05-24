/*if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}
*/
  function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object
    
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          alert("Ready!");
          //var span = document.createElement('span');
          //span.innerHTML = e.target.result;
          //document.getElementById('list').insertBefore(span, null);
        };
      })(file);

      // Read in the image file as a data URL.
      reader.readAsText(file);

  }
$(function(){
	console.log(document.getElementById('files'));
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
})