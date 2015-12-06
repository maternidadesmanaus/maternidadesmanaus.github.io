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

function getForm() {
    return document.querySelector("#rate form");
}

/**
 * Defines the initial styles from the form
 *
 * @return {Void}
 */
function setFormStyles() {

    var form = getForm();

    // username with upper case
    form.querySelectorAll(".freebirdFormviewerViewItemsItemItem")[0].querySelector(".exportInput").classList.add("upper");
    
    // email with lower case
    form.querySelectorAll(".freebirdFormviewerViewItemsItemItem")[1].querySelector(".exportInput").classList.add("lower");
}

function registerEventOnSubmitForm(frm) {
    frm.setAttribute("onsubmit", "return submitForm(this);");
}

function removeEventOnSubmitForm(frm) {
    frm.setAttribute("onsubmit", "return false;");
}

/**
 * Register select choice events (another field)
 * 
 * @return {Void}
 */
function registerEventFromAnotherField() {
    var anotherFields = document.querySelectorAll(".freebirdFormviewerViewItemsRadioOtherInput input");
    for (var i = 0; i < anotherFields.length; i++) {
        anotherFields[i].addEventListener("focus", function(event) {
            this
                .parentNode
                .parentNode
                .parentNode
                .parentNode
                .parentNode
                .parentNode
                .querySelector(".freebirdFormviewerViewItemsRadioChoice")
                .classList
                .add("selected");
        }, false);
    }
}

/**
 * Register select choice events (select)
 * 
 * @return {Void}
 */
function registerEventFromSelectField() {
    var selectFields = document.querySelectorAll(".freebirdMaterialSelectPaperselectOption.isSelected");
    for (var i = 0; i < selectFields.length; i++) {
        selectFields[i].setAttribute("onclick", "openSelectChoice(this)");
    }
}

/**
 * Register select choice events (radio buttons)
 * 
 * @return {Void}
 */
function registerEventFromRadioButtonField() {
    var radioButtons = document.querySelectorAll(".LabeledRadioContainer");
    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].setAttribute("onclick", "selectChoiceRadioButton(this)");
    }
}

/**
 * Register event to open select field
 * 
 * @return {Void}
 */
function registerEventOpenSelect(elm) {
    var options = elm.parentNode.querySelectorAll(".freebirdMaterialSelectPaperselectOption");
    for (var i = 0; i < options.length; i++) {
        options[i].setAttribute("onclick", "selectChoiceDropdown(this)");
    }
}

function selectChoiceRadioButton(elm) {
    var hasAnother = false,
        anotherInput = null,
        parent = elm.parentNode,
        nodes = parent.querySelectorAll(".freebirdFormviewerViewItemsRadioChoice");

    // checks if has a another answer
    if ((parent.classList.contains("freebirdFormviewerViewItemsRadioOtherContainer"))) {
        nodes = parent.parentNode.querySelectorAll(".freebirdFormviewerViewItemsRadioChoice");
        hasAnother = true;
    }

    // unselect all answers
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove("selected");
    }

    // select the option
    elm.classList.add("selected");

    // if has a another answer
    if (hasAnother) {
        parent.querySelector(".freebirdFormviewerViewItemsRadioOtherInput").style.display = "block";
        parent.querySelector("input").focus();
    } else {
        anotherInput = parent.parentNode.querySelector(".freebirdFormviewerViewItemsRadioOtherInput");
        if (anotherInput !== null) {
            anotherInput.style.display = "none";
        }
    }
}

function selectChoiceDropdown(elm) {
    var parent = elm.parentNode;
    parent.querySelector(".isSelected content").innerHTML = elm.querySelector("content").innerHTML;
    parent.classList.remove("opened");

    registerEventFromSelectField();
}

function openSelectChoice(elm) {
    elm.parentNode.classList.add("opened");

    registerEventOpenSelect(elm);
}

function dbg(data) {
    console.log(data);
}

function _isMobile() {
    var check = false;

    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
            check = true;
        }
    })(navigator.userAgent||navigator.vendor||window.opera);

    return check;
};

function _isValidEmail(email) {
    var isValidEmail = false,
        regexPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (email !== undefined && typeof(email) === "string") {
        isValidEmail = regexPattern.test(email);
    }

    return isValidEmail;
}

function _removeValidationError(fieldWrapper) {

    // remove class error on field wrapper
    fieldWrapper.classList.remove("error");

    // hides error message
    if (fieldWrapper.querySelector(".freebirdFormviewerViewItemsItemErrorMessage")) {
        fieldWrapper.querySelector(".freebirdFormviewerViewItemsItemErrorMessage").style.display = "none";
    }
}

function _setValidationError(fieldWrapper, message) {

    // set class error on field wrapper
    fieldWrapper.classList.add("error");

    if (fieldWrapper.querySelector(".freebirdFormviewerViewItemsItemErrorMessage")) {

        // set error message
        fieldWrapper.querySelector(".freebirdFormviewerViewItemsItemErrorMessage").innerHTML = message;
        
        // displays error message
        fieldWrapper.querySelector(".freebirdFormviewerViewItemsItemErrorMessage").style.display = "block";
    }
}

function getFieldType(fieldWrapper) {

    var fieldType = 'undefined';

    // textarea
    if (fieldWrapper.querySelector(".exportContentArea")) {
        fieldType = "textarea";
    }

    // select
    else if (fieldWrapper.querySelector(".freebirdMaterialSelectPaperselectOptionList")) {
        fieldType = "select";
    }

    // radio buttons
    else if (fieldWrapper.querySelector(".freebirdFormviewerViewItemsRadioChoice")) {
        fieldType = "radios";
    }

    // input text
    else if (fieldWrapper.querySelector(".exportContent")) {
        fieldType = "input_text";
    }

    return fieldType;
}

function getField(fieldWrapper) {

    var field = undefined;

    // textarea
    if (fieldWrapper.querySelector(".exportContentArea")) {
        field = fieldWrapper.querySelector(".exportTextarea");
    }

    // select
    else if (fieldWrapper.querySelector(".freebirdMaterialSelectPaperselectOptionList")) {
        field = fieldWrapper.querySelector(".freebirdMaterialSelectPaperselectOptionList");
    }

    // radio buttons
    else if (fieldWrapper.querySelector(".freebirdFormviewerViewItemsRadioChoice")) {
        field = fieldWrapper;
    }

    // input text
    else if (fieldWrapper.querySelector(".exportContent")) {
        field = fieldWrapper.querySelector(".exportInput");
    }

    return field;
}

function isRequired(fieldWrapper) {
    return (fieldWrapper.getAttribute("data-required") !== null)
        ? true
        : false;
}

function getFieldValue(field) {
    
    var classList  = field.classList,
        fieldValue = "";

    // radio button
    if (classList.contains("freebirdFormviewerViewItemsItemItem")) {

        // simple choice (radio)
        var fieldElement = field.querySelector(".freebirdFormviewerViewItemsRadioChoice.selected span");
        fieldValue = (fieldElement !== null)
            ? fieldElement.innerHTML
            : "";

        // another choice (input)
        if (fieldValue.toLowerCase().indexOf("outro") != -1) {
            var anotherField = field.querySelector(".freebirdFormviewerViewItemsRadioOtherInput .exportInput");
            fieldValue = (anotherField !== null && anotherField.value !== "")
                ? fieldValue = "Outro__" + anotherField.value
                : "";
        }
    }

    // input text
    else if (classList.contains("exportInput")) {
        fieldValue = field.value;
    }

    // select
    else if (classList.contains("freebirdMaterialSelectPaperselectOptionList")) {
        fieldValue = field.querySelector("content").innerHTML;
        if (fieldValue === "Escolher") {
            fieldValue = "";
        }
    }

    // textarea
    else if (classList.contains("exportTextarea")) {
        fieldValue = field.value;
    }

    return fieldValue.trim();
}

function showFeedbackMessage(className, title, message) {

    var container = document.getElementById("rate");

    smoothScroll.init({
        target   : document.getElementById("rate-maternity"),
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

function getFormData(fieldList, valuesList) {
    var formData = {};

    for (var i = 0; i < fieldList.length; i++) {
        var nodeType = fieldList[i].nodeName.toLowerCase(),
            ariaLabel = null,
            elm = null,
            name = "";

        if (nodeType === "input" || nodeType === "textarea") {
            ariaLabel = fieldList[i].getAttribute("aria-label");
            elm = (
                nodeType === "textarea"
                || (ariaLabel !== null && ariaLabel.indexOf("e-mail") != -1)
            )
                
                // input (email) or textarea
                ? fieldList[i].parentNode.parentNode.parentNode.parentNode

                // input (text)
                : fieldList[i].parentNode.parentNode.parentNode.parentNode.parentNode;
        }

        else {
            elm = (fieldList[i].classList.contains("freebirdFormviewerViewItemsItemItem"))

                // radio
                ? fieldList[i].querySelector("content").parentNode.parentNode

                // select
                : fieldList[i].parentNode.parentNode;
        }

        name = elm.querySelector("input[type=hidden]").name;

        if (name.indexOf("other_option_response") != -1) {
            name = name.replace(".other_option_response", "");

            if (valuesList[i].indexOf("Outro__") != -1) {
                formData[name + ".other_option_response"] = valuesList[i];
                formData[name] = "__other_option__";
            } else {
                formData[name + ".other_option_response"] = "";
                formData[name] = valuesList[i];
            }
        } else {
            formData[name] = valuesList[i];
        }
    }

    return formData;
}

function submitForm(frm) {

    var frmIsValid    = true,
        fieldWrapper  = null,
        fieldValue    = "",
        htmlOutput    = "",
        frmFields     = frm.querySelectorAll(".freebirdFormviewerViewItemsItemItem"),
        fieldList     = [],
        valuesList    = [],
        submitDataObj = {};

    // validate form fields
    for (var i = 0; i < frmFields.length; i++) {

        var fieldWrapper    = frmFields[i],
            fieldType       = getFieldType(fieldWrapper),
            field           = getField(fieldWrapper),
            fieldIsRequired = isRequired(fieldWrapper),
            fieldValue      = getFieldValue(field);

        fieldList.push(field);
        valuesList.push(fieldValue);

        // invalid field
        if (fieldValue === "" && fieldIsRequired) {
            _setValidationError(fieldWrapper, "campo obrigatório");

            // register flag from form error
            if (frmIsValid) {
                frmIsValid = false;
            }
        }

        // valid field
        else {
            _removeValidationError(fieldWrapper);

            if (
                fieldWrapper.querySelector(".freebirdFormviewerViewItemsItemItemTitle").innerHTML.indexOf("e-mail") != -1
                && fieldValue !== ""
                && !_isValidEmail(fieldValue)
            ) {
                _setValidationError(fieldWrapper, "e-mail inválido");
            }
        }
    }

    if (frmIsValid) {

        /**
         * removes the "onsubmit" event, to prevent which the form do not be
         * submitted more than one time
         */
        removeEventOnSubmitForm(frm);
        
        $.ajaxSetup({ cache: false });
        $.ajax({
            url: frm.action,
            data: getFormData(fieldList, valuesList),
            type: "POST",
            dataType: "xml",
            statusCode: {
                0: function() {
                    showFeedbackMessage(
                        "ok",
                        "avaliação enviada com sucesso!!!",
                        "muito obrigado por participar desse projeto e ajudar outras mulheres a escolher a melhor maternidade de Manaus!"
                    );
                },
                200: function() {
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
        frm.querySelector("#rate .error").focus();

        // go to the top of the form
        smoothScroll.init({
            target   : frm.querySelector("#rate .error"),
            discount : (window.innerWidth <= 600)
                ? -220
                : -30
        });
    }

    return false;
}

function menuNav(target) {

    var userAgent = navigator.userAgent.toLowerCase(),
        discount  = 0;

    // mobile
    if (document.body.classList.contains("mobile")) {
        discount = (
            userAgent.indexOf("ipad") > 0
            || userAgent.indexOf("nexus") > 0
        )
            // ipad or google nexus
            ? -440

            // other devices
            : -610;
    }

    // desktop
    else {
        discount = 20;
    }

    smoothScroll.init({
        target   : target,
        discount : discount
    });
}

/**
 * Register go to top
 * 
 * @return {Void}
 */
function goToTop() {
    smoothScroll.init({
        target : document.body
    });
}

/**
 * Register modal configurations
 * 
 * @param  {String}  url
 * @param  {Integer} width
 * @param  {Integer} height
 * @return {Void}
 */
function openModalSharer(url, width, height) {
    var left = (screen.width/2)-(width/2);
    var top  = (screen.height/2)-(height/2);
    window.open(url, '', 'width=' + width + ', height=' + height + ', scrollbars=no, left=' + left + ', top=' + top);
}

// sets the mobile flag
if (_isMobile()) {
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

// register submit event
registerEventOnSubmitForm(getForm());

registerEventFromAnotherField();

registerEventFromRadioButtonField();

registerEventFromSelectField();

setFormStyles();