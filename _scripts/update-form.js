var casper = require('casper').create();
var fs = require("fs");
var googleFormUrl = 'https://docs.google.com/forms/d/1UVB3EqhdY4abRrzRegIn19ef1bhPaX4STuFvrbpwSIg/viewform';

console.log("\nacessando formulário do google...");
casper.start(googleFormUrl, function() {

    console.log("parseando html do formulário...");
    var form = this.evaluate(function() {
        return document.querySelector(".freebirdFormviewerViewCenteredContent form").innerHTML.replace(/required\=\"\"/g, '');
    });

    console.log("gravando arquivo com o formulário...");
    fs.write(
        fs.absolute(".")
            + fs.separator + "_includes"
            + fs.separator + "google-form.html",
        form,
        "w"
    );
});

casper.run();