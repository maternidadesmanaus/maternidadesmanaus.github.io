var casper = require('casper').create();
var fs = require("fs");
// var googleFormUrl = 'https://docs.google.com/forms/d/1UVB3EqhdY4abRrzRegIn19ef1bhPaX4STuFvrbpwSIg/viewform';  // PRD
var googleFormUrl = 'https://docs.google.com/forms/d/1egfBCuUuQiYxtpo6_fUrMNUb_RnajuCkMkVekWlfsDs/viewform';  // BETA

console.log("\nacessando formulário do google...");
casper.start(googleFormUrl, function() {

    var form = {};

    // FORM ACTION
    
    form.action = casper.evaluate(function() {
        return document.forms[0].action;
    });

    // FORM FIELDS

    form.fields = casper.evaluate(function(selector) {
        return Array.prototype.map.call(
            document.querySelectorAll(selector),
            function(element) {

                var field = {};

                // type
                field.type = function(element){
                    var jsController = element.getAttribute("jscontroller");

                    var controllerMap = {
                        "rDGJeb" : "text",
                        "pkFYWb" : "radio",
                        "jmDACb" : "select"
                    };

                    var fieldType = controllerMap[jsController];

                    // check if exists "other option"
                    if (
                        fieldType === "radio" &&
                        element.querySelector(
                            ".freebirdFormviewerViewItemsRadioOtherChoice"
                        ) !== null
                    ) {
                        fieldType += "-with-other";
                    }

                    // check if is textarea
                    else if (
                        fieldType === "text" &&
                        element.querySelector(
                            ".quantumWizTextinputPapertextareaInput"
                        ) !== null
                    ) {
                        fieldType += "area";
                    }

                    return fieldType;
                }(element);

                // required
                field.required = function(element){
                    return (element.getAttribute("data-required") || "")
                        ? 1
                        : 0;
                }(element);

                // label
                field.label = function(element){
                    return element.querySelector(
                        ".freebirdFormviewerViewItemsItemItemTitle"
                    ).textContent.replace(" *", "");
                }(element);

                // help text
                field.helpText = function(element){
                    return element.querySelector(
                        ".freebirdFormviewerViewItemsItemItemHelpText"
                    ).textContent || "";
                }(element);
                
                // name
                field.name = function(element){
                    return element.querySelector("[name*=entry]").
                        name.
                        replace(".other_option_response", "");
                }(element);

                // options
                if (
                    field.type === "radio-with-other" ||
                    field.type === "radio" ||
                    field.type === "select"
                ) {
                    var selector = (field.type === "select")
                        ? "content"
                        : ".freebirdFormviewerViewItemsRadioLabel";

                    field.options = function(elm, selector){
                        var options = [];
                        var nodes = elm.querySelectorAll(selector);

                        for (var i = 0; i < nodes.length; i++) {
                            options.push(nodes[i].textContent);
                        }

                        return options;
                    }(element, selector);
                }

                return field;
            }
        )
    }, ".freebirdFormviewerViewItemList > div");

    // form.fields.filter(function(value) {
    //     console.log(value.label);
    //     console.log(value.type);
    //     console.log(value.required);
    //     console.log(value.helpText);
    //     console.log(value.name);
    //     console.log(value.options);
    //     console.log("");
    // });

    console.log("gravando arquivo com o formulário...");
    fs.write(
        fs.absolute(".")
            + fs.separator + "_data"
            + fs.separator + "google-form-stg.json",
        JSON.stringify(form, null, '\t'),
        "w"
    );
});

casper.run();