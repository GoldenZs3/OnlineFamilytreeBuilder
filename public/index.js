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
        target: "#graph",
        debug: true,
        hideMarriageNodes: true,
        marriageNodeSize: 5,
        height: 800,
        width: 1200,
        callbacks: {
            nodeClick: function(name, extra) {
                alert('Click: ' + name);
            },
            nodeRightClick: function(name, extra) {
                alert('Right-click: ' + name);
            },
            textRenderer: function(name, extra, textClass) {
                if (extra && extra.nickname)
                    name = name + " (" + extra.nickname + ")";
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
