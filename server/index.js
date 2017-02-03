let express = require('express');
let fs = require('fs');
let jsdom = require("jsdom").jsdom;
let serializer = require("jsdom").serializeDocument;
let DomImporter = require('./helpers/dom-importer.js');
let Router = require('./helpers/router');
let pkg = require('../package.json');

let app = express();

fs.readFile('../both/index.html', 'utf-8', function(err, data) {
    let doc = jsdom(data);
    let window = doc.defaultView;
    let domImporter = new DomImporter(window, doc, pkg.server);
    let router = new Router(app, serializer, doc);



    let template =  doc.createElement("script");


    domImporter.setGlobals();
    domImporter.init();
    router.init();


    let strVal = data; //obviously, this line can be omitted - just assign your string to the name strVal or put your string var in the pattern.exec call below
    let pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
    let array_matches = pattern.exec(strVal);

    template.type = "text/template";

    template.id="index.html";
    template.innerHTML = array_matches[0];



    let body = doc.getElementsByTagName('body')[0];
    body.appendChild(template);

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});