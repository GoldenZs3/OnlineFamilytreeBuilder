const {React} = require('react')
const {readFile, readFileSync} = require('fs')
const express = require('express');
const dtree = require('d3-dtree');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const upload = multer({dest: 'public/uploads/'})
const app = express();
app.use(express.json());

app.get('/', (request, response)=> {
  readFile('./home.html', 'utf8', (err, html) => {
    if (err) {
      response.status(500).send("error")
    }
    response.send(html);
  })
});
app.get('/newTree', (request, response)=> {
  readFile('./newTree.html', 'utf8', (err, html) => {
    if (err) {
      response.status(500).send("error")
    }
    response.send(html);
  })
});
app.get('/trees', (request, response) =>{
  readFile('./trees.html', 'utf8', (err, html) => {
    if (err) {
      response.status(500).send("error")
    }
    response.send(html);
  })
});
app.post('/updateFamilyTree', (req, res) => {
    const familyTree = req.body;
    fs.writeFileSync('public/data/data.json', JSON.stringify(familyTree,"", 4));
    res.send(JSON.stringify({ success: true, familyTree }));
  });
  app.post('/addRelation', upload.single('profilePicture'), (req, res) => {
    const { file, relationName, r, action } = req.body; // file here is a text field
    const relation=JSON.parse(req.body.relation);
    const profilePicture = req.file; // profilePicture is the uploaded file
    try{
      relation.extra['profPic'] = profilePicture.filename;
    }
    catch{
      relation.extra['profPic'] = "no_pic";
    }
    

  // Function to recursively search for the parent in the family tree
  function findParentAndAddRelation(tree) {
      for (let member of tree) {
        console.log(member);
          if (member.name === relationName) {
              if (member.marriages) {
                  member.marriages[0].children.push(relation);
              } else {
                  member.marriages = [{
                      spouse: {},
                      children: [relation]
                  }];
              }
              return true;
          }
          if (member.marriages) {
              for (let marriage of member.marriages) {
                  if (marriage.children && findParentAndAddRelation(marriage.children)) { 
                    return true;
                  }
              }
          }
      }
      return false;
  }
  
  function findPartnerAndAddRelation(tree) {
    for (let member of tree) {
      console.log(member.name);
        if (member.name === relationName) {
          if (member.marriages && member.marriages.length>0){
                member.marriages = [{
                    spouse: relation,
                    children: member.marriages[0].children
                }];
              }
          else{
                  member.marriages = [{
                    spouse: relation,
                    children: []
                }];
                }
            return true;
              }
        if (member.marriages) {
            for (let marriage of member.marriages) {
                if (marriage.children && findPartnerAndAddRelation(marriage.children)) { 
                  return true;
                }
            }
        }
    }
    return false;
}

function addNewRoot(tree){
  // Create a new node
  let newRoot = [{
    "name": relation.name,
    "class": relation.class,
    "textClass": "emphasis",
    "marriages": [
      {
        "spouse": {},
        "children": tree
      }
    ]
  }];
  return newRoot;
}

function deleteNode(tree) {
  for (let i = 0; i < tree.length; i++) {
      let member = tree[i];
      if (member.name === relation.name) {
          // If the member has marriages and children, add the children to the tree
          if (member.marriages) {
              for (let marriage of member.marriages) {
                  if (marriage.children) {
                      tree.push(...marriage.children);
                  }
              }
          }
          // Remove the member from the tree
          tree.splice(i, 1);
          return true;
      }
      if (member.marriages) {
          for (let j = 0; j < member.marriages.length; j++) {
              let marriage = member.marriages[j];
              if (marriage.spouse && marriage.spouse.name === relation.name) {
                  if (marriage.children){
                      marriage.spouse = {};
                  }
                  else{
                      member.marriages.splice(j, 1);
                      j--; // adjust the index after removing an item
                  }
                  return true;
              }
              if (marriage.children && deleteNode(marriage.children)) {
                  return true;
              }
          }
      }
  }
  return false;
}

let familyTree;
fs.readFile(`public/data/${file}`, 'utf8', (err, data) => {
  if (err) {
      console.error(`Error reading file from disk: ${err}`);
  } else {
      // parse JSON string to JSON object
      familyTree = JSON.parse(data);
  }
  console.log(action);
  if (action==="child"){
    if (findParentAndAddRelation(familyTree)) {
      fs.writeFileSync(`public/data/${file}`, JSON.stringify(familyTree,"", 4));
      res.send(JSON.stringify({ success: true, familyTree }));
    } else {
      res.status(400).send({ success: false, message: 'Parent not found' });
    }
  }
  else if (action==="partner")
  {
  if (findPartnerAndAddRelation(familyTree)) {
    fs.writeFileSync(`public/data/${file}`, JSON.stringify(familyTree,"", 4));
    res.send(JSON.stringify({ success: true, familyTree }));
  } else {
    res.status(400).send({ success: false, message: 'Parent not found' });
  }}
  else if (action === "oldest")
  {
    familyTree=addNewRoot(familyTree)
    if (addNewRoot(familyTree)) {
      fs.writeFileSync(`public/data/${file}`, JSON.stringify(familyTree,"", 4));
      res.send(JSON.stringify({ success: true, familyTree }));
    } else {
      res.status(400).send({ success: false, message: 'Parent not found' });
    }
  }
  else if (action == "delete")
  {
    console.log("here");
    if (deleteNode(familyTree)) {
      fs.writeFileSync(`public/data/${file}`, JSON.stringify(familyTree,"", 4));
      res.send(JSON.stringify({ success: true, familyTree }));
    } else {
      res.status(400).send({ success: false, message: 'Parent not found' });
    }
  }
});
});

app.post('/addNewTree', (req,res) => {
  const privacy= req.body.privacy;
  const relation = req.body.relation;
  if (privacy=="public"){
    const filename = `public/data/${relation.name}_data.json`;
    fs.writeFile(filename, JSON.stringify([relation], null, 4), (err) => {
    if (err) {
        console.error(`Error writing file to disk: ${err}`);
        res.status(500).send({ success: false, message: 'Server error' });
    } else {
        res.send({ success: true, filename });
    }
});
  }
  else{
    const privateTreeName=req.body.treeName;
    const passphrase = req.body.passphrase;
    const filename = `public/data/private/${privateTreeName}_data.json`;
    fs.writeFile(filename, JSON.stringify([passphrase, relation], null, 4), (err) => {
    if (err) {
        console.error(`Error writing file to disk: ${err}`);
        res.status(500).send({ success: false, message: 'Server error' });
    } else {
        res.send({ success: true, filename });
    }
});
  }
  
});


app.get('/listOfTrees', (req, res) => {
  fs.readdir('public/data', (err, files) => {
      if (err) {
          console.error(`Error reading directory: ${err}`);
          res.status(500).send({ success: false, message: 'Server error' });
      } else {
          let trees = [];
          files.forEach(file => {
            console.log(file)
              trees.push(file);
          });
          console.log(trees)
          res.send(trees);
      }
  });
});


app.get('/treePage', (req, res) => {
  try {
      // Retrieve the tree parameter from the query string
      const treeParam = req.query.tree;
      console.log(treeParam);

      // Read the tree data synchronously
      const treeData = readTreeData(treeParam);

      // Read the content of treePage.html synchronously
      const html = fs.readFileSync(path.join(__dirname, 'treePage.html'), 'utf8');

      // Replace placeholder in the HTML with the actual tree data
      const modifiedHtml = html.replace('/* Tree data placeholder */', JSON.stringify(treeData));
      const newHtml = modifiedHtml.replace('/* Tree data json placeholder */', JSON.stringify(treeParam));
      // Send the modified HTML as the response
      res.send(newHtml);
  } catch (err) {
      console.error(err);
      // Handle the error, e.g., render an error page
      res.status(500).send('Error loading tree page');
  }
});


// Function to read tree data based on the filename
function readTreeData(filename) {
  // Implement this function based on your file storage/retrieval mechanism
  // For example, you might read the JSON file from a specific directory
  // and parse it to retrieve the tree data
  const filePath = path.join(__dirname, 'public', 'data', filename);

  try {
      // Read the JSON data from the file synchronously
      const data = fs.readFileSync(filePath, 'utf8');
      // Parse JSON data
      return JSON.parse(data);
  } catch (err) {
      throw err;
  }
}





app.use("/public", express.static('./public/'));
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'))