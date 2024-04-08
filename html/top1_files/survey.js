var surveyID = 'survey';
var surveyDIV;

var validPages = ['/index.jsp', '/', '/misc/news.jsp'];


var showDebug = false;

window.onload = function() {
    if (Cookies['RDP_SURVEY_IGNORE']) {
        debug('survey not displayed due to survey ignore cookie');
        return;
    } else if (areCookiesEnabled() == false) {
        debug('cookies are disabled.  not displaying survey');
        return;
    } else if (isDisplayPage()) {
        setTimeout('loadSurvey()', 1000);
    }
}


function areCookiesEnabled() {
    if (readCookie('test')) {
        return true;
    } else {
        createCookie('test','test',1);
        if (readCookie('test')) {
            eraseCookie('test');
            return true;
        } else {
            return false;
        }
    }
}

function isDisplayPage() {
    for (var i = 0; i < validPages.length; i++) {
        if (window.location.pathname == validPages[i]) {
            debug('page is valid page to show survey on');
            return true;
        }
    }
    debug('page is not in list of valid display pages');
    return false;
}


function loadSurvey() {
    debug('sending request for survey');
    sendRequest('/survey/question.spr',addSurvey);
}


function submitSurvey() {
    debug('submitting survey and setting ignore cookie');
    Cookies.create('RDP_SURVEY_IGNORE','ignore',7);
    surveyDIV.style.display = 'none';

    // get the survey form object
    var forms = document.getElementsByTagName("form");
    var surveyForm;
    for (var i=0; i < forms.length; i++) {
        if (forms[i].name == 'surveyForm') {
            surveyForm = forms[i]
        }
    }

    // transform all the form data into a string
    var formData = concatFormData(surveyForm);
    debug('sending form data: ' + formData);
    sendRequest('/survey/response.spr',function() {
        ;
        },'response=' + formData);
    
    document.getElementsByTagName('body')[0].removeChild(surveyDIV);
}

function closeSurvey() {
    document.getElementsByTagName('body')[0].removeChild(surveyDIV);
}

function addSurvey(req) {
    debug('response recieved');
    if (!req || !req.responseText) {
        debug('null response recieved');
        Cookies.create('RDP_SURVEY_IGNORE','ignore',7);
        return;
    }

    // create a container element to convert the responseText to dom
    var container = document.createElement('div');
    container.innerHTML = req.responseText;

    // find the div with the survey id.  There's no getElementByID available on the container object
    var x = container.getElementsByTagName('div');
    for (var i=0;i<x.length;i++) {
        if (x[i].id == surveyID) {
            surveyDIV = x[i];
            break;
        }   		
    }

    // append the surveyID to the main body of the program
    if (surveyDIV) {
        // add a fancy fade in effect
        surveyDIV.style.opacity='0.0'
        var opacity = 0.0;
        window.opacityRamp = function() {
            if (opacity < 1) {
                opacity += .05;
                surveyDIV.style.opacity=opacity;
                setTimeout('opacityRamp()',10);
            }
        }
        setTimeout('opacityRamp()',10);
        
        document.getElementsByTagName("body")[0].appendChild(surveyDIV);
    } else {
        debug('did not find the surveyDIV in the response. setting ignore cookie');
        Cookies.create('RDP_SURVEY_IGNORE','ignore',7);
    }
}

function concatFormData(surveyForm) {
    var formData = "";
    function appendSColon() {
        if (formData != "") {
            formData += ";";
        }
    }
    for (var i=0; i < surveyForm.elements.length; i++) {
        var el = surveyForm.elements[i];
        
        if (el.type == 'button') {
        // no idea
        } else if (el.type == 'checkbox') {
            if (el.checked) {
                appendSColon(formData);
                formData += el.name + '=' + el.checked;
            }
        } else if (el.type == 'hidden') {
            appendSColon(formData);
            formData += el.name + '=' + el.value;
        } else if (el.type == 'radio') {
            if (el.checked) {
                appendSColon(formData);
                formData += el.name + '=' + el.value;
            }
        } else if (el.type == 'password') {
        // can't handle
        } else if (el.type == 'file') {
        // can't handle
        } else if (el.type == 'select') {
            appendSColon(formData);
            formData += el.name + '=' + el.options[el.selectedIndex];
        } else if (el.type == 'submit') {
        // do nothing
        } else if (el.type == 'textarea') {
            appendSColon(formData);
            formData += el.name + '=' + el.value;
        } else {
            appendSColon(formData);
            formData += el.name + '=' + el.value;
        }
    }
    formData = formData.replace(/\|/g,',');
    formData = encodeURIComponent(formData.replace(/\s/g,' '));
    return formData;
}


function debug(message) {
    if (showDebug) {
        if (!debug.window_ || debug.window_.closed) {
            var win = window.open("", null, "width=400,height=400," +
                "scrollbars=yes,resizable=yes,status=no," +
                "location=no,menubar=no,toolbar=no");
            if (!win) return;
            var doc = win.document;
            doc.write("<html><head><title>Debug Log</title></head>" +
                "<body></body></html>");
            doc.close();
            debug.window_ = win;
        }
        var logLine = debug.window_.document.createElement("div");
        logLine.appendChild(debug.window_.document.createTextNode(message));
        debug.window_.document.body.appendChild(logLine);
    }
}


/** XMLHTTPREQUEST AND COOKIES FROM FROM QUIRKSMODE.ORG **/

function sendRequest(url,callback,postData) {
    var req = createXMLHTTPObject();
    if (!req) return;
    var method = (postData) ? "POST" : "GET";
    req.open(method,url,true);
    req.setRequestHeader('User-Agent','XMLHTTP/1.0');
    if (postData)
        req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    req.onreadystatechange = function () {
        if (req.readyState != 4) return;
        if (req.status != 200 && req.status != 304) {
            //			alert('HTTP error ' + req.status);
            return;
        }
        callback(req);
    }
    if (req.readyState == 4) return;
    req.send(postData);
}

function XMLHttpFactories() {
    return [
    function () {
        return new XMLHttpRequest()
        },
    function () {
        return new ActiveXObject("Msxml2.XMLHTTP")
        },
    function () {
        return new ActiveXObject("Msxml3.XMLHTTP")
        },
    function () {
        return new ActiveXObject("Microsoft.XMLHTTP")
        }
    ];
}

function createXMLHTTPObject() {
    var xmlhttp = false;
    var factories = XMLHttpFactories();
    for (var i=0;i<factories.length;i++) {
        try {
            xmlhttp = factories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
}


var Cookies = {
    init: function () {
        var allCookies = document.cookie.split('; ');
        for (var i=0;i<allCookies.length;i++) {
            var cookiePair = allCookies[i].split('=');
            this[cookiePair[0]] = cookiePair[1];
        }
    },
    create: function (name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
        this[name] = value;
    },
    erase: function (name) {
        this.create(name,'',-1);
        this[name] = undefined;
    }
};
Cookies.init();

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}
