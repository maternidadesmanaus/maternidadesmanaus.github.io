if (!String.prototype.trim) {

    /**
     * Implements trim function, to remove blank spaces around the strings
     *
     * @author Andrews Lince <andrews@neemu.com>
     * @since  1.0.0
     * @return {String}
     */
    String.prototype.trim = function () {
        return this.replace(/^\s+/,'').replace(/\s+$/, '');
    };
}

/**
 * Setup page elements
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  2.3.4
 * @return {Void}
 */
function init() {

    // sets the mobile flag
    if (isMobile()) {
        document.body.classList.add("mobile");
    }

    // register menu navigation events
    document.querySelector(".nav .menu").addEventListener("click", function(event) {
        this.parentNode.classList.toggle("active");
    }, false);

    // register lazy loading images
    echo.init({
        offset   : 100,
        throttle : 250,
        unload   : false
    });

    // register select choice events (radio buttons)
    var radioButtons = document.querySelectorAll(".ropt");
    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].setAttribute("onclick", "selectChoiceRadioButton(this)");
    }

    // get form
    var frm = getForm();

    // register submit event
    frm.setAttribute("onsubmit", "return submitForm(this);");

    /***************************************************************************
     * defines the initial styles from the form
     **************************************************************************/

    // username with upper case
    frm.querySelectorAll(".row")[0].
        querySelector("input").
        classList.
        add("upper");

    // email with lower case
    frm.querySelectorAll(".row")[1].
        querySelector("input").
        classList.
        add("lower");
}

function getForm() {
    return document.getElementById("review-maternity");
}

function selectChoiceRadioButton(elm) {
    var parent = elm.parentNode,
        nodes = parent.querySelectorAll(".ropt");

    // checks if has a another answer
    if (elm.classList.contains("with-other")) {
        elm.querySelector(".otheropt").style.display = "block";
        elm.querySelector("input").focus();
    } else {
        var otherWrapper = parent.querySelector(".otheropt");
        if (otherWrapper) {
            otherWrapper.style.display = "none";
        }
    }

    // unselect all answers
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove("selected");
    }

    // select the option
    elm.classList.add("selected");

    // defines the selected value
    parent.setAttribute(
        "field-value",
        elm.querySelector("span").textContent
    );
}

/**
 * Checks if user is a mobile device
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  2.3.4
 * @return {Boolean}
 */
function isMobile() {
    var check = false;

    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
            check = true;
        }
    })(navigator.userAgent||navigator.vendor||window.opera);

    return check;
}

/**
 * Checks if email is valid
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  2.3.4
 * @return {Boolean}
 */
function isValidEmail(email) {
    var isValidEmail = false,
        regexPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (email !== undefined && typeof(email) === "string") {
        isValidEmail = regexPattern.test(email);
    }

    return isValidEmail;
}

/**
 * Clean validation information and styles from the field form
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  2.3.4
 * @return {Void}
 */
function removeValidationError(fieldWrapper) {

    // remove class error on field wrapper
    fieldWrapper.classList.remove("error");

    // hides error message
    if (fieldWrapper.querySelector(".msg")) {
        fieldWrapper.querySelector(".msg").style.display = "none";
    }
}

/**
 * Add validation information and styles on the field form
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  2.3.4
 * @return {Void}
 */
function setValidationError(fieldWrapper, message) {

    // set class error on field wrapper
    fieldWrapper.classList.add("error");

    if (fieldWrapper.querySelector(".msg")) {

        // set error message
        fieldWrapper.querySelector(".msg").innerHTML = message;
        
        // displays error message
        fieldWrapper.querySelector(".msg").style.display = "block";
    }
}

/**
 * Get the type from field (text, textarea, select etc.)
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  2.3.4
 * @param  {[type]} fieldWrapper
 * @return {String}
 */
function getFieldType(fieldWrapper) {
    var attrFieldType = fieldWrapper.getAttribute("field-type");
    return (attrFieldType) ?
        attrFieldType :
        "undefined";
}

/**
 * Get the "name" attribute (google form) from the field
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  2.3.4
 * @param  {[type]} fieldWrapper
 * @param  {String} fieldType
 * @return {String}
 */
function getFieldName(fieldWrapper, fieldType) {
    var fieldName = "",
        selector  = "";

    // radio button
    if (fieldType.indexOf("radio") != -1) {
        selector = ".rgrp";
    }

    // input text
    else if (fieldType === "text") {
        selector = ".txt";
    }

    // textarea
    else if (fieldType === "textarea") {
        selector = ".txtar";
    }

    // select
    else if (fieldType === "select") {
        selector = ".slt";
    }

    if (selector !== "") {
        fieldName = fieldWrapper.querySelector(selector).getAttribute("name");
    }

    return fieldName;
}

/**
 * Get the value from the field
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  2.0.0
 * @param  {[type]} fieldWrapper
 * @param  {String} fieldType
 * @return {String}
 */
function getFieldValue(fieldWrapper, fieldType) {
    
    var fieldValue = "";

    // radio button
    if (fieldType.indexOf("radio") != -1) {
        var radioGroup = fieldWrapper.querySelector(".rgrp"),
            radioValue = radioGroup.getAttribute("field-value");

        if (radioValue) {
            fieldValue = radioValue;

            // radio button with other (input field)
            if (
                fieldType === "radio-with-other" &&
                fieldValue.toLowerCase().indexOf("outro") != -1
            ) {
                var otherValue = radioGroup.querySelector("input").value.trim();

                fieldValue = (otherValue !== "") ?
                    fieldValue = "Outro__" + otherValue :
                    "";
            }
        }
    }

    // input text
    else if (fieldType === "text") {
        fieldValue = fieldWrapper.querySelector(".txt").value;
    }

    // textarea
    else if (fieldType === "textarea") {
        fieldValue = fieldWrapper.querySelector(".txtar").value;
    }

    // select
    else if (fieldType === "select") {
        var elmSelect   = fieldWrapper.querySelector("select"),
            selectedOpt = elmSelect.options[elmSelect.selectedIndex].value;
        if (selectedOpt !== "Escolher") {
            fieldValue = selectedOpt;
        }
    }

    return fieldValue.trim();
}

function showFeedbackMessage(className, title, message) {

    var container = getForm();

    smoothScroll.init({
        target   : container,
        discount : 4
    });

    htmlOutput  = "";
    htmlOutput += "<div id=\"sent-message\" class=\"" + className + "\">";
    htmlOutput += "<i></i>";
    htmlOutput += "<h4>" + title + "</h4>";
    htmlOutput += "<p>" + message + "</p>";
    htmlOutput += "</div>";

    // display success message
    container.innerHTML = htmlOutput;

    // run a animation on the success icon
    setTimeout(function(){
        container.querySelector("i").classList.add("animate");

        setTimeout(function(){
            container.querySelector("i").classList.remove("animate");
        }, 600);
    }, 300);
}

function submitForm(frm) {

    var frmIsValid    = true,
        fieldWrapper  = null,
        htmlOutput    = "",
        fieldValue    = "",
        fieldName     = "",
        fieldType     = "",
        frmFields     = frm.querySelectorAll(".row"),
        submitDataObj = {};

    // validate form fields
    for (var i = 0; i < frmFields.length; i++) {

        fieldWrapper = frmFields[i];
        fieldType    = getFieldType(fieldWrapper);
        fieldValue   = getFieldValue(fieldWrapper, fieldType);
        fieldName    = getFieldName(fieldWrapper, fieldType);

        if (fieldType === "radio-with-other") {
            if (fieldValue.indexOf("Outro__") != -1) {
                submitDataObj[fieldName + ".other_option_response"] = fieldValue;
                submitDataObj[fieldName] = "__other_option__";
            } else {
                submitDataObj[fieldName + ".other_option_response"] = "";
                submitDataObj[fieldName] = fieldValue;
            }
        } else {
            submitDataObj[fieldName] = fieldValue;
        }

        // invalid field
        if (
            fieldValue === "" &&
            fieldWrapper.getAttribute("required") === "1"
        ) {
            setValidationError(fieldWrapper, "campo obrigatório");

            // register flag from form error
            if (frmIsValid) {
                frmIsValid = false;
            }
        }

        // valid field
        else {
            removeValidationError(fieldWrapper);

            if (
                fieldWrapper.querySelector(".lbl").innerHTML.indexOf("e-mail") != -1 &&
                fieldValue !== "" &&
                !isValidEmail(fieldValue)
            ) {
                setValidationError(fieldWrapper, "e-mail inválido");
            }
        }
    }

    if (frmIsValid) {

        /**
         * removes the "onsubmit" event, to prevent which the form do not be
         * submitted more than one time
         */
        frm.setAttribute("onsubmit", "return false;");

        ajax({
            url: frm.action,
            data: obj2UrlParams(submitDataObj),
            type: "POST",
            success: function(response, statusCode) {
                showFeedbackMessage(
                    "ok",
                    "avaliação enviada com sucesso!!!",
                    "muito obrigado por participar desse projeto e ajudar outras mulheres a escolher a melhor maternidade de Manaus!"
                );
            },
            error: function(response, statusCode) {
                if (statusCode === 0) {
                    showFeedbackMessage(
                        "ok",
                        "avaliação enviada com sucesso!!!",
                        "muito obrigado por participar desse projeto e ajudar outras mulheres a escolher a melhor maternidade de Manaus!"
                    );
                } else {
                    showFeedbackMessage(
                        "nok",
                        "problemas no envio da avaliação!!!",
                        "infelizmente, ocorreu um problema desconhecido ao enviar a sua avaliação!"
                    );
                }
            }
        });
    } else {

        // register the form as invalid
        frm.classList.add("error");

        // set the focus to the first invalid field
        frm.querySelector("#review-maternity .error").focus();

        // go to the top of the form
        smoothScroll.init({
            target   : frm.querySelector("#review-maternity .error"),
            discount : (window.innerWidth <= 600) ?
                -220 :
                -30
        });
    }

    return false;
}

function menuNav(target) {

    // close menu
    document.querySelector(".nav").classList.toggle("active");

    smoothScroll.init({
        target   : target,
        discount : 0
    });
}

/**
 * Register modal configurations
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  1.0.0
 * @param  {String}  url
 * @param  {Integer} width
 * @param  {Integer} height
 * @return {Void}
 */
function openModalSharer(url, width, height) {
    var left = (screen.width/2)-(width/2);
    var top  = (screen.height/2)-(height/2);
    window.open(
        url,
        '',
        'width=' + width +
            ', height=' + height +
            ', scrollbars=no' +
            ', left=' + left +
            ', top=' + top
    );
}

/*function setDataTestForm() {

    var fields = document.querySelectorAll(".row"),
        fieldWrapper = null;

    for (var i = 0; i < fields.length; i++) {
        fieldWrapper = fields[i];
        fieldType    = getFieldType(fieldWrapper);

        // text
        if (fieldType === "text") {

            // email
            fieldWrapper.querySelector(".txt").value = (
                fieldWrapper.querySelector(".lbl").innerHTML.indexOf("e-mail") != -1
            )
                ? "a@a.com"
                : "nome de teste";
        }

        // textarea
        else if (fieldType === "textarea") {
            fieldWrapper.querySelector(".txtar").value = getRandomString(
                getRandomArbitrary(20, 30)
            );
        }
        
        // select
        else if (fieldType === "select") {
            var elmSelect = fieldWrapper.querySelector(".slt");
            var selectOptionIndex = getRandomArbitrary(
                0,
                elmSelect.options.length
            );

            elmSelect.value = elmSelect.options[selectOptionIndex].value;
        }

        // radios
        else if (fieldType.indexOf("radio") != -1) {
            var options = fieldWrapper.querySelectorAll(".ropt");
            var randomOption = getRandomArbitrary(0, options.length);

            options[randomOption].classList.add("selected");

            fieldWrapper.querySelector(".rgrp").
                setAttribute(
                    "field-value",
                    options[randomOption].querySelector("span").innerHTML
                );

            if (options[randomOption].classList.contains("with-other")) {
                options[randomOption].querySelector(".otheropt").style.display = "block";

                options[randomOption].querySelector(".txt").value =
                    getRandomString(30);
            }
        }
    }
}*/

/**
 * Convert an object to string by url parameters format
 * @{@link http://stackoverflow.com/a/6566471/2431214}
 * @since  2.3.4
 * @param  {Object} object
 * @return {String}
 */
function obj2UrlParams(object) {
    var urlParams = "";

    for (var key in object) {
        if (urlParams !== "") {
            urlParams += "&";
        }
        urlParams += key + "=" + encodeURIComponent(object[key]);
    }

    return urlParams;
}

/**
 * [ajax description]
 * @since  2.3.4
 * @param  {Object} options
 * - dataType
 * - type
 * - data
 * - url
 * - success
 * - error
 * @return {Void}
 */
function ajax(options) {

    // declare the variable at the top, even though it will be null at first
    var req = null;

    // defines default "dataType" as "json"
    if (options.dataType === undefined) {
        options.dataType = "json";
    }

    // figure out what kind of support we have for the XMLHttpRequest object
    req = (window.XMLHttpRequest) ?
        new XMLHttpRequest() :                   // modern browsers
        new ActiveXObject("Microsoft.XMLHTTP");  // good ol' lousy IE

    // setup the readystatechange listener
    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {

            var response;

            // success
            if(req.status === 200) {

                try {
                    response = JSON.parse(req.responseText);
                } catch(e) {
                    response = req.responseText;
                }
                options.success(response, req.status);
            }

            // error
            else {
                options.error(response, req.status);
            }
        }
    };

    // open the XMLHttpRequest connection
    req.open(options.type, options.url, true);

    /**
     * send the XMLHttpRequest request (nothing has actually been
     * sent until this very line)
     */
    if (options.type.toLowerCase() === "post") {
        req.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded; charset=UTF-8'
        );
        req.send(options.data);
    } else {
        req.send();
    }
}

/**
 * Debug informations
 * @author Andrews Lince <andrews.lince@gmail.com>
 * @since  1.0.0
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
/*function dbg(data) {
    console.log(data);
}

function getRandomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzãõçàáéíóú0123456789";

    for( var i=0; i < length; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}*/

// initial setup
init();

// setDataTestForm();