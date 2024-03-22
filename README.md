# OnlineFamilytreeBuilder
This is a repo for my 4th Year project, which aims to build an online familytree builder webapplication.

## Build instructions

### Requirements

* Packages listed in 'package.json'
* Tested on Windows 10

### Build steps
To install required dependencies run the command "npm install".

To run the server locally run the command "node ."

The application alternatively can be found hosted on: https://onlinefamilytreebuilder.onrender.com/

There are no specific test suites, the application has been through thorough manual testing to ensure expected behaviour.

## Project set up
The server set up and server side calculations can be found in app,js file. This includes all get request handles to display the pages, as well as all post request used for calcualtions for the family tree (this includes post requests "/addNewTree" which is responsible for starting a tree and "/addRelation" which is used to add familiar relations and deletion of members) as well as collecting all public tree datat for the Trees page, and authentication for private trees.

The source code for each page can be found in the html files.

Files that need to be accessible by other files are in the folder "public". This include javascript and css files as well as member profile pictures in the subfolder "uploads" and all the trees' data in the subfolder "data". Private trees inside "data" is stored in a seperate subfolder named "private".
