var casper = require('casper').create();
var fs = require("fs");
var googleFormUrl = 'https://docs.google.com/forms/d/1UVB3EqhdY4abRrzRegIn19ef1bhPaX4STuFvrbpwSIg/viewform';  // PRD
// var googleFormUrl = 'https://docs.google.com/forms/d/1egfBCuUuQiYxtpo6_fUrMNUb_RnajuCkMkVekWlfsDs/viewform';  // BETA

console.log("\nacessando formulário do google...");
casper.start(googleFormUrl, function() {

    console.log("parseando html do formulário...");
    var htmlForm = this.evaluate(function() {
        var content = document.querySelector(".freebirdFormviewerViewCenteredContent");

        content.removeChild(
            document.querySelector(".freebirdFormviewerViewCenteredContent > div")
        );

        return content
            .innerHTML
            .replace(/required\=\"\"/g, '')
            .replace(
                "<span>Enviar</span>",
                '<input value="Enviar" id="submit-form" type="submit">'
            );
    });

    console.log("gravando arquivo com o formulário...");
    fs.write(
        fs.absolute(".")
            + fs.separator + "_includes"
            + fs.separator + "google-form.html",
        htmlForm,
        "w"
    );
});

casper.run();