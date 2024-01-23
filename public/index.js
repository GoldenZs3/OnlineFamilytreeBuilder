fetch('public/data/data.json')
    .then(response => response.json())
    .then(data => {
        let familyTree = data;
        function addNameToUndefinedNode(tree) {
            if (tree.name === "undefined") {
                // Add a class to the node
                tree.name = "Unknown Person";
            }
        
            // If the node has marriages, check the spouse and children
            if (tree.marriages && tree.marriages.length > 0) {
                for (let marriage of tree.marriages) {
                    addNameToUndefinedNode(marriage.spouse);
                    for (let child of marriage.children) {
                        addNameToUndefinedNode(child);
                    }
                }
            }
        }
        
        // Call the function on your tree
        addNameToUndefinedNode(familyTree);

        fetch('/updateFamilyTree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(familyTree),
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error));
        
    })
    .catch(error => console.error('Error:', error));


    $.getJSON('public/data/data.json', function(treeData) {
        dTree.init(treeData, {
            target: "#graph_home",
            debug: true,
            hideMarriageNodes: true,
            marriageNodeSize: 5,
            height: 800,
            width: 1200,
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
                            nodeInfo += "<img src=public/uploads/"+ extra.profPic +" width = 200px>";
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
                    if (extra){
                        if(extra.dateOfBirth){
                            name = name + "<br>"+extra.dateOfBirth;
                        }
                        if(extra.place){
                            name = name + "<br>"+extra.place;
                        }
                        if(extra.status){
                            name = name + "<br>"+extra.status;
                        }
                    }
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
    });
    


$(function(){
    $("#nav-placeholder").load("public/topnav.html");
  });

  document.getElementById('closeButton').addEventListener('click', function() {
    // Clear the information from the 'infoContent' div
    document.getElementById('infoContent').innerHTML = '';
    // Hide the 'nodeInfo' div
    document.getElementById('nodeInfo').style.display = 'none';
});
