

 // Initialize dTree with the specific tree data
 tree = dTree.init(treeData, {
                     target: "#tree",
                     debug: true,
     hideMarriageNodes: true,
     marriageNodeSize: 5,
     height: 265,
     width: 1000,
                     callbacks: {
                         nodeClick: function(name, extra) {
             // Create a string with the node information
             var nodeInfo = "<strong>Name:</strong> " + name;
             if (extra) {
                 if(extra.dateOfBirth){
                     nodeInfo += "<br><strong>Date of Birth:</strong> " + extra.dateOfBirth;
                 }
                 if(extra.place){
                     nodeInfo += "<br><strong>Place:</strong> " + extra.place;
                 }
                 if(extra.status){
                     nodeInfo += "<br><strong>Status:</strong> " + extra.status;
                 }
                 if(extra.profPic){
                     nodeInfo += "<img src=public/uploads/"+ extra.profPic +" width = 100px margin-left = 50px>";
                 }
             }
             // Display the information in the 'infoContent' div
             document.getElementById('infoContent').innerHTML = nodeInfo;
             // Show the 'nodeInfo' div
             document.getElementById('nodeInfo').style.display = 'block';
         },
     nodeRightClick: function(name, extra) {
         alert('Right-click: ' + name);
     },
     textRenderer: function(name, extra, textClass) {
         return "<p align='center' class='" + textClass + "'>" + name + "</p>";
     },
     marriageClick: function(extra, id) {
         alert('Clicked marriage node' + id);
     },
     marriageRightClick: function(extra, id) {
         alert('Right-clicked marriage node' + id);
     },
 }
});
tree.zoomTo(0, 200, zoom = 0.75, duration = 0);

document.getElementById('relationForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from being submitted normally
    
    const inputParent = document.getElementById('parentName').value;
    const inputName = document.getElementById('newName').value;
    const inputDate = document.getElementById('dateOfBirth').value;
    const inputPlace = document.getElementById('place').value;
    const inputStatus = document.querySelector('input[name="status"]:checked') ? document.querySelector('input[name="status"]:checked').value : '';
    const inputClass = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : '';
    const inputAction = document.querySelector('input[name="action"]:checked') ? document.querySelector('input[name="action"]:checked').value : '';
    const profilePicture = document.getElementById('profilePicture').files[0]; // Get the uploaded file
    
    // Create a new FormData instance
    let formData = new FormData();
    
    // Append all the form data
    formData.append('file', inputFile);
    formData.append('relationName', inputParent);
    formData.append('relation', JSON.stringify({name: inputName, class: inputClass, extra: {dateOfBirth: inputDate, place: inputPlace, status: inputStatus}}));
    formData.append('action', inputAction);
    if (profilePicture) {
        formData.append('profilePicture', profilePicture);
    }
    
    console.log(formData.values());
    fetch('/addRelation', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.reload();
        document.getElementById('successMessage').style.display = 'flex';
                    document.getElementById('newTreeForm').reset();
    
                    setTimeout(function() {
                        document.getElementById('successMessage').style.display = 'none';
                    }, 3000);
    })
    .catch((error) => console.error('Error:', error));
    });