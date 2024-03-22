const {React} = require('react')
const {readFile, readFileSync} = require('fs')
const express = require('express');
const dtree = require('d3-dtree');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const upload = multer({dest: 'public/uploads/'}).any();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json({limit: '1mb'})); 


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
app.get('/private', (request, response)=> {
  readFile('./private.html', 'utf8', (err, html) => {
    if (err) {
      response.status(500).send("error")
    }
    response.send(html);
  })
});

  app.post('/addRelation', upload, (req, res) => {
    const { file, relationName, r, action } = req.body;
    const relation=JSON.parse(req.body.relation);
    const profilePicture = req.files.find(file => file.fieldname == 'profilePicture'); // profilePicture is the uploaded file
    if (profilePicture) {
      relation.extra['profPic'] = profilePicture.filename;
  } else {
      relation.extra['profPic'] = "no_pic";
  }
    console.log(relation.extra['profPic']);
    

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
  let oldest=tree[0];
  for (let i = 0; i < tree.length; i++) {
      let member = tree[i];
      if (member.name === relation.name) {
          // If the member has marriages and children, add the children to the tree
          if (member==oldest && member.marriages) {
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
    if (file.startsWith("private")){
      pass=familyTree[0];
      familyTree=[familyTree[1]];
    }
    familyTree=addNewRoot(familyTree)
    if (file.startsWith("private")){
      familyTree= [pass, familyTree[0]];
    }
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

app.post('/addNewTree', upload, (req,res) => {
  console.log(req.body);
  const privacy= req.body.privacy;
  const relation = JSON.parse(req.body.relation);
  const profilePicture = req.files.find(file => file.fieldname == 'profilePicture'); // profilePicture is the uploaded file
    if (profilePicture) {
      relation.extra['profPic'] = profilePicture.filename;
  } else {
      relation.extra['profPic'] = "no_pic";
  }
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

app.post("/accessTree", (req, res)=>{
  console.log(req.body);
  const treeName = req.body.treeName;
  console.log(treeName);
  const passphrase = req.body.passphrase;
  fileName = treeName + "_data.json";
  console.log(fileName);
  const treeData = readTreeData(fileName, folder="private");
  let matched=false;
  if(treeData[0]==passphrase){
    matched=true;
  }
  if (matched){
    
    console.log("Matched pass and tree");
    res.send({ success: true, fileName });
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
      console.log(req.query);
      const treeParam = req.query.tree;
      console.log(treeParam);
      const folder=req.query.folder;
      console.log(folder);

      let file_path=""
      // Read the tree data synchronously
      let treeData = readTreeData(treeParam, folder);
      if(folder=="private"){
        treeData=[treeData[1]];
        file_path="private/"
      }
      file_path=file_path+treeParam;
      console.log(treeData);


      // Read the content of treePage.html synchronously
      const html = fs.readFileSync(path.join(__dirname, 'treePage.html'), 'utf8');

      // Replace placeholder in the HTML with the actual tree data
      const modifiedHtml = html.replace('/* Tree data placeholder */', JSON.stringify(treeData));
      const newHtml = modifiedHtml.replace('/* Tree data json placeholder */', JSON.stringify(file_path));
      // Send the modified HTML as the response
      res.send(newHtml);
  } catch (err) {
      console.error(err);
      // Handle the error, e.g., render an error page
      res.status(500).send('Error loading tree page');
  }
});



// Function to read tree data based on the filename
function readTreeData(filename, folder="public") {
  console.log(folder);
  console.log(folder=="private");
  if (folder=="public"){
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
  else if(folder=="private"){
    const filePath = path.join(__dirname, 'public', 'data', 'private', filename);
    try {
      // Read the JSON data from the file synchronously
      const data = fs.readFileSync(filePath, 'utf8');
      // Parse JSON data
      return JSON.parse(data);
  } catch (err) {
      throw err;
  }
  }
}



module.exports = app;

app.use("/public", express.static('./public/'));
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'))