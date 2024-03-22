// Function to toggle the display of the user guide
function toggleUserGuide() {
    var userGuide = document.getElementById("userGuide");
    if (userGuide.style.display=="none"){
      userGuide.style.display="block";
    }
    else{
      userGuide.style.display="none";
    }
}