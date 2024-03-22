fetch('/listOfTrees')
            .then(response => response.json())
            .then(files => {
            const treesContainer = document.getElementById('treesContainer');
            files.forEach(file => {
                const treeContainer = document.createElement('div');
                treesContainer.appendChild(treeContainer);
                treeContainer.setAttribute("id", "graph");

                fetch(`public/data/${file}`)
                    .then(response => response.json())
                    .then(treeData => {
                        tree=dTree.init(treeData, {
                            target: "#graph",
                            debug: true,
                            hideMarriageNodes: true,
                            marriageNodeSize: 5,
                            height: 600,
                            width: 1200,
                            callbacks: {
                                nodeClick: function (name, extra) {
                                    window.location.href = `/treePage?tree=${file}`;
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
	tree.zoomTo(0,200,1.5,0);
                        })
                        .catch(error => console.error('Error:', error));
					});
            })
            .catch(error => console.error('Error:', error));