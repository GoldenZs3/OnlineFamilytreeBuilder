const {React} = require('react')
const {readFile, readFileSync} = require('fs')
const express = require('express');
const dtree = require('d3-dtree');
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
app.get('/page2', (request, response)=> {
  readFile('./page2.html', 'utf8', (err, html) => {
    if (err) {
      response.status(500).send("error")
    }
    response.send(html);
  })
});
app.post('/addRelation', (req, res) => {
  console.log(req.body);
  const { parentName, relation } = req.body;

  // Function to recursively search for the parent in the family tree
  function findParentAndAddRelation(tree) {
      for (let member of tree) {
          if (member.name === parentName) {
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
  const fs = require('fs');

let familyTree;
fs.readFile('public/data.json', 'utf8', (err, data) => {
  if (err) {
      console.error(`Error reading file from disk: ${err}`);
  } else {
      // parse JSON string to JSON object
      familyTree = JSON.parse(data);
  }
  console.log(familyTree);
  if (findParentAndAddRelation(familyTree)) {
    fs.writeFileSync('public/data.json', JSON.stringify(familyTree,"", 4));
    res.send(JSON.stringify({ success: true, familyTree }));
} else {
    res.status(400).send({ success: false, message: 'Parent not found' });
}
});
});
app.use("/public", express.static('./public/'));
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'))