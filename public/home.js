    $.getJSON('public/data/data.json', function(treeData) {
        tree= dTree.init(treeData, {
            target: "#graph_home",
            debug: true,
            hideMarriageNodes: true,
            marriageNodeSize: 5,
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
        tree.zoomTo(0, 220, zoom = 1.75, duration = 0)
    });
    
