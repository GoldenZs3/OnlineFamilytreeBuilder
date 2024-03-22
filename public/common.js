$(function(){
    $("#nav-placeholder").load("public/topnav.html");
  });

  document.getElementById('closeButton').addEventListener('click', function() {
    // Clear the information from the 'infoContent' div
    document.getElementById('infoContent').innerHTML = '';
    // Hide the 'nodeInfo' div
    document.getElementById('nodeInfo').style.display = 'none';
});