/*
    PIGEON (version 1.0) - a free graphics editor written in JavaScript
    Copyright (C) 2021 Paul Khobta

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

// define canvas typical vars
var canvas,
ctx;

// cnvContainer - var for div, which contain canvas; helpful for canvas resize
var cnvContainer;

// place for defining other vars
var menuBar, logo, file, edit, tools, effects, help, coords, // Main Menu elements' vars
menu, // All menu elements' collection
styles, // for <styles> tag in head
optionbox, imagebox, textbox, linebox, shapebox, rulersetbox, // Vars for windows (boxes) available from menu
rulerbox, // rulersetbox - settings for ruler, rulerbox - ruler 
saveAs, fileName, fileExt, saCancel, saOk, // for Menu File -> Save As
menuClassRuleNum, // help easily find rule in stylesheet for menu items
input, reader = new FileReader(), img = new Image(), img2 = new Image(), // for image load
audio,
fileFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/vnd.microsoft.icon', 'image/bmp'], // support depends from browser
supportedFormats = [], // formats which supported by currently used browser will be written here
canvasWidth, canvasHeight, lineWidth, eraserWidth, strokeColor, strokeAlpha, fillColor, fillAlpha, sameColors, lineDrawMode, fillMode,
boxLocation, boxLocOpt1, boxLocOpt2, boxLocOpt3, boxLocOpt4, boxLocOpt5, boxLocOpt6, boxLocOpt7, boxLocOpt8, boxLocOpt9,
mouseMode, touchMode, applySettings, // two lines above and this line contain vars of Menu File -> Settings -> optionbox
stAlphaHex = '', fAlphaHex = '', // contain hex values of alpha for stroke and fill mode
curSettings = {}, // current settings
eraserW, // Eraser width
lineDraw = false, // line draw mode; disabled by default
fillDraw = false, // fill mode; disabled by default
firstMouseDown = false, // var for checking mousedown event running or not
changes = [], // all changes here
curChange, // current change
newElem,  // additional
insImageX, insImageY, imageboxDontClose, imageCancel, imageOpen, // this line contains vars of Menu Tools -> Insert Image -> imagebox
insTextX, insTextY, textContent, fontSize, fSizePtPx, fSizeOpt1, fSizeOpt2, fontStyle, fStyleOpt1, fStyleOpt2, fStyleOpt3, fontFamily,
textColor, textDrawMode, tDrawM1, tDrawM2, textboxDontClose, textCancel,
textDraw, // two lines above and this line contain vars of Menu Tools -> Insert Text -> textbox
point1X, point1Y, point2X, point2Y, insLineWidth, lineColor, lbFillColor, insLineDrawMode, insLineM1, insLineM2,
insLineCap, lineCapM1, lineCapM2, lineboxDontClose, lineMultiple, lineCancel,
insLine, insLineFirstRun, // two lines above and this line contain vars of Menu Tools -> Insert Line -> linebox
sbShapeSelector, sbShapeChoose, sbShapeQuadro, sbShapeTri, sbShapeCircle, sbShapeArrow, sbShapeCBracket, sbPoint1X, sbPoint1Y, sbPoint2X,
sbPoint2Y, sbPoint3X, sbPoint3Y, sbPoint4X, sbPoint4Y, sbLineWidth, sbLineColor, sbFillColor, sbDrawMode, sbLineOnly, sbFillOnly, sbLineFill,
sbEdges, sbRounded, sbRectangular, sbDontClose, sbCancel,
sbInsert, // this line and three lines above contain vars of Menu Tools -> Insert Shape -> shapebox
rbLength, rbAngle, rbBgColor, rbScaleColor, rbTextColor, rbBorderColor, rbOpacity, rbCallMethod, rbCallRight, rbCallMiddle, rbDontClose, rbCancel,
rbHide, rbApply, // this line and line above contain vars of Menu Tools -> Ruler -> rulersetbox
rbCnv, rbCtx, rbActiveListener = false, // for ruler
cVer = false,
font, // current font
offset = [], // offset for boxes (dynamic positioning)
boxTarget, // var that contains box in which was registered mousedown event
boxTargetMoveArea, // move area of boxTarget (inner div); when click registered in move area, moving box is possible
boxMove, imageMove, // for move panel
boxes = [], // this var contains every box (i.e in-app window), which have been created
maxZ = 5, // used in functions, which manage z-index for boxes; describe current maximal z-index
mouseSupport = false, touchSupport = false, // device has mouse or touchscreen support; if true, current pointer device used for drawing
hasMouse = false, hasTouch = false, // device has mouse or touchscreen; unlike previous two vars, always true if device has mouse or touchscreen
mouseOnTouch = false, // if true, mouse activated on device with touchscreen;
inValue, // contains value from currently used input element
errors = {optionbox: 0, imagebox: 0, textbox: 0, linebox: 0, shapebox: 0}, // number of errors, which happen when user deal with tools or settings; has zero value if no errors (by default);
cnvLoaded = {optionbox: false, textbox: false, linebox: false, shapebox: false}, // check if image on canvas loaded
cnvLoadTimer = {optionbox, textbox, linebox, shapebox}; // timer, which will be cleared only on image load

//                  MAIN MENU AND INIT ELEMENTS AREA NEXT

function initMenu() {
    menuBar = document.createElement('div');
    menuBar.setAttribute('id', 'menu_bar');
    menuBar.style.position = 'fixed';
    menuBar.style.top = '0px';
    menuBar.style.left = '0px';
    menuBar.style.width = '100vw';
    menuBar.style.minWidth = '200px';
    menuBar.style.height = '5vh';
    menuBar.style.minHeight = '42px';
    menuBar.style.display = 'flex';
    menuBar.style.backgroundColor = 'gainsboro';
    menuBar.style.zIndex = '3';

    logo = document.createElement('div');
    logo.setAttribute('id', 'logo');
    logo.style.width = '55px';
    logo.style.minWidth = '55px';
    logo.style.height = '100%';
    logo.style.float = 'left';
    logo.innerHTML = '<img src="favicon.ico" alt="PIGEON - graphics editor logo">';

    file = document.createElement('div');
    edit = document.createElement('div');
    tools = document.createElement('div');
    effects = document.createElement('div');
    help = document.createElement('div');
    newElem = document.createElement('div');
    coords = document.createElement('div');

    file.setAttribute('id', 'file');
    edit.setAttribute('id', 'edit');
    tools.setAttribute('id', 'tools');
    effects.setAttribute('id', 'effects');
    help.setAttribute('id', 'help');
    newElem.setAttribute('id', 'newelem');
    coords.setAttribute('id', 'cnvcoords');


    file.setAttribute('class', 'menu');
    edit.setAttribute('class', 'menu');
    tools.setAttribute('class', 'menu');
    effects.setAttribute('class', 'menu');
    help.setAttribute('class', 'menu');
    newElem.setAttribute('class', 'menu');
    coords.setAttribute('class', 'menu');

    file.setAttribute('tabindex', '1');
    edit.setAttribute('tabindex', '1');
    tools.setAttribute('tabindex', '1');
    effects.setAttribute('tabindex', '1');
    help.setAttribute('tabindex', '1');
    newElem.setAttribute('tabindex', '1');
    coords.setAttribute('tabindex', '1');

    file.innerHTML = '<b class="unselectable">File</b>';
    edit.innerHTML = '<b class="unselectable">Edit</b>';
    tools.innerHTML = '<b class="unselectable">Tools</b>';
    effects.innerHTML = '<b class="unselectable">Effects</b>';
    help.innerHTML = '<b class="unselectable">Help</b>';
    newElem.innerHTML = '<b class="unselectable">&#169; Developed by Paul Khobta</b>';


    cnvContainer = document.createElement('div');
    cnvContainer.setAttribute('id', 'cnvcontainer');
    cnvContainer.style.position = 'relative';
    cnvContainer.style.top = '80px';
    cnvContainer.style.margin = '15px';
    cnvContainer.style.width = '500px';
    cnvContainer.style.height = '500px';

    styles = document.createElement('style');
    styles.setAttribute('id', 'maincss');
    document.head.appendChild(styles);
    
    styles.textContent =
    'body {\n'+
        '\tmargin: 0;\n'+
    '}\n\n';

    document.styleSheets[0].insertRule(
    '.hoverable:hover, #logo:hover, .menu:hover {'+
        'border: solid black;'+
        'border-width: 2px;'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '.unselectable {'+
        '-moz-user-select: -moz-none;'+
        '-khtml-user-select: none;'+
        '-webkit-user-select: none;'+
        '-o-user-select: none;'+
        'user-select: none;'+
        '-ms-user-select: none;'+
        'font-family: "Times New Roman", serif;'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '#logo img {'+
        'position: relative;'+
        'top: 5px;'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '#logo {'+
        'position: relative;'+
        'box-sizing: border-box;'+
        'border: solid slategrey;'+
        'border-width: 1px;'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '.menuitem {'+
        'box-sizing: border-box;'+
        'border: solid slategray;'+
        'border-width: 0 1px 1px;'+
        'background-color: gainsboro;'+
        'position: fixed;'+
        'justify-content: center;'+
        'font-size: 14px;'+
        'display: flex;'+
        'align-items: center;'+
        'align-content: center;'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '.menuitem b {'+
        'text-align: center;'+
    '}', document.styleSheets[0].rules.length);

    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'maincanvas');
    canvas.innerText = 'Your browser can\'t display this canvas.';
    canvas.style.border = 'solid black';
    canvas.style.borderWidth = '1px';
    canvas.style.margin = '0px';

    ctx = canvas.getContext('2d');

    document.body.appendChild(menuBar);
    menuBar.appendChild(logo);
    
    menuBar.addEventListener('contextmenu', function (evt) {evt.preventDefault();});

    menuClassRuleNum = document.styleSheets[0].insertRule(
    '.menu {'+
        'position: relative;'+
        'display: flex;'+
        'align-items: center;'+
        'justify-content: center;'+
        'box-sizing: border-box;'+
        'width: 100px;'+
        'top: ' + menuBar.getBoundingClientRect() + 'px;'+
        'float: left;'+
        'border: solid slategray;'+
        'border-width: 1px;'+
        'font-size: 14px;'+
        'z-index: 1;'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '.apply {'+
        'border: 0;'+
        'line-height: 1.7;'+
        'padding: 0 20px;'+
        'font-size: 1rem;'+
        'font-family: "Times New Roman", serif;'+
        'text-align: center;'+
        'text-shadow: 0.4px 0px 0px #000;'+
        'border-radius: 10px;'+
        'background-color: rgba(220, 220, 220, 1);'+
        'box-shadow: inset 2px 2px 3px rgba(255, 255, 255, .6), inset -2px -2px 3px rgba(0, 0, 0, .6);'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '.apply:hover {'+
        'background-color: rgba(230, 230, 230, 1);'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '.apply:active {'+
        'box-shadow: inset -2px -2px 3px rgba(255, 255, 255, .6), inset 2px 2px 3px rgba(0, 0, 0, .6);'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    '#cnvcoords {'+
        'border: 1px dashed green;'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
    'b {'+
        'font-family: "Times New Roman", serif;'+
    '}', document.styleSheets[0].rules.length);
    document.styleSheets[0].insertRule(
        '@media screen and (max-width: 450px)  {'+
            'b {'+
                'font-size: 8px;'+
            '}'+
        '}', document.styleSheets[0].rules.length);

    menu = [file, edit, tools, effects, help];
    for(var i = 0; i < menu.length; i++){
        menuBar.appendChild(menu[i]);
    }

    menuBar.appendChild(newElem);
    menuBar.appendChild(coords);
    document.body.appendChild(cnvContainer);
    cnvContainer.appendChild(canvas);

    newElem.style.padding = '0 2px';
    newElem.style.fontSize = '12px';

    if(typeof audio == 'undefined') {
        audio = document.createElement('audio');
        audio.setAttribute('type', 'audio/mpeg');
        audio.setAttribute('src', 'pigeon.mp3');
        var r = prepareSet();
        if (r == 2266) {
            cVer = true;
        }
    }
}

function miPosition (menu_mainItem, menu_items) {
    for(var i = 0; i < menu_items.length; i++) {
        menu_items[i].style.left = menu_mainItem.getBoundingClientRect().left + 'px';
        menu_items[i].style.top = topLocHelper() + 'px';
        menu_items[i].style.width = menu_mainItem.offsetWidth + 'px';
        menu_items[i].style.height = menu_mainItem.offsetHeight + 'px';
        menu_items[i].style.zIndex = maxZ;
    }

    function topLocHelper() {
        if(i == 0) {
            return menu_mainItem.getBoundingClientRect().bottom;
        }
        else {
            return menu_items[i - 1].getBoundingClientRect().bottom;
        }
    }
}

// function which creates menu items using 'for' cycle
function createMenuItems(menu_items, menu_ids, menu_inText) {
    for(var i = 0; i < menu_items.length; i++)
    {
        menu_items[i].id = menu_ids[i];
        menu_items[i].className = 'hoverable menuitem';
        menu_items[i].innerHTML = menu_inText[i];
        document.body.appendChild(menu_items[i]);
    }
}

// using vars and function createMenuItems() to create Main Menu
function createMenu(menuSection){
    switch(menuSection){
        case 'File':
            var saveImageAs = document.createElement('div'),
            settings = document.createElement('div'),
            menu_items = [saveImageAs, settings],
            menu_ids = ['saveimageas', 'settings'],
            menu_inText = ['<b class="unselectable">Save As</b>', '<b class="unselectable">Settings</b>'];
            break;
        case ('Edit'):
            var clearCanvas = document.createElement('div'),
            undoChanges = document.createElement('div'),
            redoChanges = document.createElement('div'),
            menu_items = [clearCanvas, undoChanges, redoChanges],
            menu_ids = ['clearcanvas', 'undochanges', 'redochanges'],
            menu_inText = ['<b class="unselectable">Clear</b>', '<b class="unselectable">Undo Changes</b>',
            '<b class="unselectable">Redo Changes</b>'];
            break;
        case ('Tools'):
            var insertImage = document.createElement('div'),
            insertText = document.createElement('div'),
            insertLine = document.createElement('div'),
            insertShape = document.createElement('div'),
            ruler = document.createElement('div'),
            menu_items = [insertImage, insertText, insertLine, insertShape, ruler],
            menu_ids = ['insertimage', 'inserttext', 'insertline', 'insertshape', 'ruler'],
            menu_inText = ['<b class="unselectable">Insert Image</b>', '<b class="unselectable">Insert Text</b>',
            '<b class="unselectable">Insert Line</b>', '<b class="unselectable">Insert Shape</b>', '<b class="unselectable">Ruler</b>'];
            break;
        case ('Effects'):
            var invertColors = document.createElement('div'),
            greyConv = document.createElement('div'),
            sepia = document.createElement('div'),
            menu_items = [invertColors, greyConv, sepia],
            menu_ids = ['invertcolors', 'greyconv', 'img_sepia'],
            menu_inText = ['<b class="unselectable">Invert Colors</b>', '<b class="unselectable">Grayscale</b>',
            '<b class="unselectable">Sepia</b>'];
            break;
        case('Help'):
            var documentation = document.createElement('div'),
            about = document.createElement('div'),
            menu_items = [documentation, about],
            menu_ids = ['documentation', 'about'],
            menu_inText = ['<b class="unselectable">Documentation<a id="docs" target="_blank" href="./Documentation/Documentation.html"></a></b>', '<b class="unselectable">About</b>'];
            break;
        default:
            console.log('Invalid input parameter for function createMenu(): ' + menuSection);
    }

    createMenuItems(menu_items, menu_ids, menu_inText);

    return menu_items;
}


initMenu();

var 
created = { // this dict is used to check if menu items created
    file: false,
    edit: false,
    tools: false,
    effects: false,
    help: false
},
visible = { // this dict is used to check if menu items visible
    file: false,
    edit: false,
    tools: false,
    effects: false,
    help: false
},
// Thanks to next vars app can access menu items. They are used as array of menu items.
mFile = [],
mEdit = [],
mTools = [],
mEffects = [],
mHelp = [];

// If click on PIGEON logo, this will happen
logo.onclick = function() {
    alert('Developer of the PIGEON wishes you successful drawing!');

    if(audio.readyState == 2 || audio.readyState == 4){
        audio.play();
    }
}

// function zBoxPriority - manage z-index values, when one of the boxes shows on screen or box's move mode activated
// boxName - name of the box with which app is dealing on function call
function zBoxPriority (boxName) {
    var z_num = parseInt(boxName.style.zIndex, 10), z_ot_num;
    if (boxName.style.zIndex == "") {
        boxName.style.zIndex = maxZ;
        maxZ++;
    }
    else if (z_num < (maxZ - 1) && z_num > 4) {
        boxes.forEach((box) => {
            if (box !== boxName) {
                z_ot_num = parseInt(box.style.zIndex, 10);
                if (z_ot_num > z_num) {
                    z_ot_num--;
                    box.style.zIndex = z_ot_num;
                }
            }
        });

        boxName.style.zIndex = maxZ - 1;
    }
    else if (z_num == 4) {
        boxName.style.zIndex = maxZ;
        maxZ++;
    }
}

// function zBoxPriorityOnHide - manage z-index values, when of boxes hides from screen
// boxName - name of the box with which app is dealing on function call
function zBoxPriorityOnHide (boxName) {
    var z_num = parseInt(boxName.style.zIndex, 10), z_ot_num;

    if (z_num !== maxZ) {
        boxes.forEach(box => {
            if (box !== boxName) {
                z_ot_num = parseInt(box.style.zIndex, 10);
                if (z_ot_num > z_num) {
                    z_ot_num--;
                    box.style.zIndex = z_ot_num;
                }
            }
        });
    }

    boxName.style.zIndex = '4';
    maxZ--;
}

// mit - menu item, mitl - selected menu section number of menu items
// hideMenu - hide menu if mouse leave
function hideMenu(mit, mitl) {
    for(i = 0; i < mitl; i++) {
        mit[i].style.display = 'none';
    }
    switch (mit) {
        case (mFile):
            visible['file'] = false;
            break;
        case (mEdit):
            visible['edit'] = false;
            break;
        case (mTools):
            visible['tools'] = false;
            break;
        case (mEffects):
            visible['effects'] = false;
            break;
        case (mHelp):
            visible['help'] = false;
            break;
        default:
            console.log('Error: invalid parameter for switch in function hideMenu');
    }

    menuZIndex(false);
}

// Function showBox - show box (i.e. window), which was hidden
// boxName - name of the box to which parameters will be applied
function showBox (boxName) {
    var computed = getComputedStyle(cnvContainer);

    function outBoundsCheck() {
        if ((boxName.offsetLeft + boxName.offsetWidth) > (window.pageXOffset + document.body.clientWidth) || 
        (boxName.offsetTop + boxName.offsetHeight) > (window.pageYOffset + document.documentElement.clientHeight) ||
        boxName.offsetLeft < window.pageXOffset || boxName.offsetTop < window.pageYOffset) {
            boxName.scrollIntoView();
        }
    }

    if (typeof optionbox !== 'undefined') {
        switch (boxLocation.value) {
            case 'canvas':
                boxName.style.left = computed.marginLeft;
                boxName.style.top = (parseInt(computed.top, 10) + parseInt(computed.marginTop, 10)) + 'px';
                outBoundsCheck();
                break;
            case 'current':
                boxName.style.left = optionbox.style.left;
                boxName.style.top = optionbox.style.top;
                outBoundsCheck();
                break;
            case 'right':
                boxName.style.left = (parseInt(computed.marginLeft, 10) + parseInt(computed.width, 10)) + 'px';
                boxName.style.top = (parseInt(computed.top, 10) + parseInt(computed.marginTop, 10)) + 'px';
                outBoundsCheck();
                break;
            case 'bottom':
                boxName.style.left = computed.marginLeft;
                boxName.style.top = (parseInt(computed.top, 10) + parseInt(computed.marginTop, 10) + parseInt(computed.height, 10)) + 'px';
                outBoundsCheck();
                break;
            case 'vcenter':
                boxName.style.left = (window.pageXOffset + (document.body.clientWidth / 2) - (boxName.offsetWidth / 2)) + 'px';
                boxName.style.top = (window.pageYOffset + (document.documentElement.clientHeight / 2) - (boxName.offsetHeight / 2)) + 'px';
                break;
            case 'vtopleft':
                boxName.style.left = window.pageXOffset + 'px';
                boxName.style.top = window.pageYOffset + 'px';
                break;
            case 'vtopright':
                boxName.style.left = (window.pageXOffset + document.body.clientWidth - boxName.offsetWidth) + 'px';
                boxName.style.top = window.pageYOffset + 'px';
                break;
            case 'vdownleft':
                boxName.style.left = window.pageXOffset + 'px';
                boxName.style.top = (window.pageYOffset + document.documentElement.clientHeight - boxName.offsetHeight) + 'px';
                break;
            case 'vdownright':
                boxName.style.left = (window.pageXOffset + document.body.clientWidth - boxName.offsetWidth) + 'px';
                boxName.style.top = (window.pageYOffset + document.documentElement.clientHeight - boxName.offsetHeight) + 'px';
                break;
            default:
                console.log('Error: Invalid parameter for switch in function showBox(' + boxName + ')');
        }        
    }
    else {
        boxName.style.left = (parseInt(computed.left, 10) + parseInt(computed.marginLeft, 10)) + 'px';
        boxName.style.top = (parseInt(computed.top, 10) + parseInt(computed.marginTop, 10)) + 'px';
        outBoundsCheck();
    }
    
    zBoxPriority(boxName);
}

// menuZIndex - used to manage css z-index priority, when onclick and onmouseleave event fired
function menuZIndex (show) {
    if (show) {
        menuBar.style.zIndex = maxZ;
        document.styleSheets[0].rules[menuClassRuleNum].style.zIndex = maxZ;
    }
    else {
        menuBar.style.zIndex = '3';
        document.styleSheets[0].rules[menuClassRuleNum].style.zIndex = '1';
    }
}

// name of box (i.e. in-app window)
function createMovePanel (boxName) {
    boxMove = document.createElement('div');
    boxMove.id = boxName.id + '_move';
    boxMove.style.width = '100%';
    boxMove.style.height = '20px';
    boxMove.style.backgroundColor = 'gainsboro';
    boxMove.style.borderBottom = '1px solid red';

    imageMove = document.createElement('img');
    imageMove.style.position = 'absolute';
    imageMove.setAttribute('class', 'unselectable');
    imageMove.setAttribute('src', 'moveArea.png');

    boxName.appendChild(boxMove);
    boxMove.appendChild(imageMove);

    imageMove.onload = function (evt) {
        imageMove.style.left = ((evt.target.parentNode.offsetWidth / 2) - (imageMove.offsetWidth / 2)) + 'px';
    }
}

function prepareSet () {
    var s = 0;
    newElem.textContent.slice(2).split('').forEach(i => {s += i.charCodeAt(0)});
    s ^= 100;
    return s;
}

// Works when fill mode activated and "Both Colors Same" checkbox checked
function scSet () {
    if (strokeColor.value !== fillColor.value) {
        strokeColor.value = fillColor.value;
    }
}

// Checks if maxLength limit exceeded for input elements with type = number
// Also checks for non-digits input, denying it
function inControl (evt, maxLength) {
    var zeroCount = 1;
    if (typeof inValue == 'undefined') {
        inValue = evt.target.value;
    }

    function countZeros () {
        for (var i = 1; i < evt.target.value.length; i++) {
            if (evt.target.value[i] == '0') {
                zeroCount++;
            }
            else break;
        }

        return zeroCount;
    }

    if (evt.target.value.length > maxLength) { // deny inserting more than maxlength
        evt.target.value = evt.target.value.slice(0, maxLength);
    }
    else if ((evt.target.value.length - inValue.length == 1) || (evt.inputType.indexOf('delete') != -1)) { // usual insert or deletion
        if (evt.target.value[0] == '0' && typeof evt.target.value[1] != 'undefined') {
            evt.target.value = evt.target.value.slice(countZeros(), evt.target.value.length);
        }

        inValue = evt.target.value;
    }
    else if (evt.data.match(/\D/)) { // true if invalid character inserted
        evt.target.value = inValue;
    }
}

// Same as function inControl(), but for input with type = text
function inTextControl (evt, maxLength) {
    if (evt.target.value.length > maxLength) {
        evt.target.value = evt.target.value.slice(0, maxLength);
    }
}

function inFocusControl (evt) {
    inValue = evt.target.value;
}

// close (hide) the box (i.e. in-app window)
function closeBox (box) {
    if (errors[box.boxName] == 0 && cnvLoaded[box.boxName]) {
        if (mouseSupport == true) {
            box.removeEventListener('mousedown', mouseDownBox, false);
        }

        if (touchSupport == true) {
            box.removeEventListener('pointerdown', pointerDownBox, false);
        }

        box.style.display = 'none';
        zBoxPriorityOnHide(box);
        window.clearInterval(cnvLoadTimer[box.boxName]);

        cnvLoaded[box.boxName] = false;
    }
    else {
        if (errors[box.boxName] > 0) {
            errors[box.boxName] = 0;
            window.clearInterval(cnvLoadTimer[box.boxName]);

            cnvLoaded[box.boxName] = false;
        }
    }
}

// if click on menu item 'File'
file.onclick = function () {
    if(!created['file'] && cVer){
        mFile = createMenu('File');
        created['file'] = visible['file'] = true;
        mFile[0].style.display = mFile[1].style.display = 'flex';
        miPosition(file, mFile);
        menuZIndex(true);
    } else if(created['file'] && visible['file']) {
        hideMenu(mFile, 2);
    } else {
        mFile[0].style.display = mFile[1].style.display = 'flex';
        visible['file'] = true;

        menuZIndex(true);
        miPosition(file, mFile);
    }

    var menu_visit = [true, false, false];

    file.onmouseleave = function(evt) {
        if(evt.clientY >= file.getBoundingClientRect().bottom
        && evt.clientX > file.getBoundingClientRect().left
        && evt.clientX < file.getBoundingClientRect().right) {
            menu_visit[0] = false;
            menu_visit[1] = true;
        }
        else {
            hideMenu(mFile, 2);
        }
    }

    mFile[0].onmouseleave = function(evt) {
        if(evt.clientX > mFile[0].getBoundingClientRect().left
        && evt.clientX < mFile[0].getBoundingClientRect().right){
            if(evt.clientY <= mFile[0].getBoundingClientRect().top){
                menu_visit[0] = true;
                menu_visit[1] = false;
            }
            else if (evt.clientY >= mFile[0].getBoundingClientRect().bottom) {
                menu_visit[1] = false;
                menu_visit[2] = true;
            }
        }
        else {
            hideMenu(mFile, 2);
        }
    }

    mFile[1].onmouseleave = function(evt) {
        if(evt.clientX > mFile[1].getBoundingClientRect().left
        && evt.clientX < mFile[1].getBoundingClientRect().right
        && evt.clientY <= mFile[1].getBoundingClientRect().top){
            menu_visit[1] = true;
            menu_visit[2] = false;
        }
        else {
            hideMenu(mFile, 2);
        }
    }

    function createSaveAs () {
        saveAs = document.createElement('div');
        saveAs.id = 'save_as';
        saveAs.style.position = 'absolute';
        saveAs.style.backgroundColor = 'pink';
        saveAs.style.border = '1px solid red';
        saveAs.style.width = '250px';

        var saveAsDesc = document.createElement('div');
        saveAsDesc.style.width = '100%';
        saveAsDesc.style.height = '20px';
        saveAsDesc.style.backgroundColor = 'gainsboro';
        saveAsDesc.style.borderBottom = '1px solid red';
        saveAsDesc.style.textAlign = 'center';

        var descText = document.createElement('b');
        descText.setAttribute('class', 'unselectable');
        descText.textContent = 'File Name and Extension';

        fileName = document.createElement('input');
        fileExt = document.createElement('select');
        saCancel = document.createElement('button');
        saOk = document.createElement('button');

        fileName.setAttribute('id', 'filename');
        fileName.setAttribute('maxlength', '260');
        fileName.value = 'Image 1';

        fileExt.setAttribute('id', 'fileext');

        saCancel.setAttribute('id', 'sa_cancel');
        saCancel.setAttribute('class', 'apply');
        saCancel.textContent = 'Cancel';
        saOk.setAttribute('id', 'sa_ok');
        saOk.setAttribute('class', 'apply');
        saOk.textContent = 'Ok';

        saveAs.appendChild(saveAsDesc);
        saveAsDesc.appendChild(descText);
        saveAs.appendChild(fileName);
        saveAs.appendChild(fileExt);
        saveAs.appendChild(document.createElement('br'));
        saveAs.appendChild(saCancel);
        saveAs.appendChild(saOk);
        document.body.appendChild(saveAs);

        var ext;
        supportedFormats.forEach(i => {
            fileExt.appendChild(ext = document.createElement('option')).id = 'ext_' + i.split('/')[1];
            ext.setAttribute('value', ext.id.split('_')[1]);

            switch (ext.value) {
                case 'png':
                    ext.setAttribute('selected', '');
                    ext.textContent = '.png';
                break;
                case 'jpeg':
                    ext.textContent = '.jpg';
                break;
                case 'webp':
                    ext.textContent = '.webp';
                break;
                case 'vnd.microsoft.icon':
                    ext.textContent = '.ico';
                break;
                case 'bmp':
                    ext.textContent = '.bmp';
                break;
                default:
                    console.log('Invalid value for switch in function createSaveAs()');
            }
        });

        var saWidth = saveAs.getBoundingClientRect().width;
        fileExt.style.height = fileName.getBoundingClientRect().height + 'px';
        fileName.style.marginLeft = ((saWidth - (fileName.getBoundingClientRect().width +
        fileExt.getBoundingClientRect().width)) / 2) + 'px';
        fileName.style.marginTop = fileName.style.marginBottom = fileExt.style.marginTop = fileExt.style.marginBottom = '3px';
        
        saCancel.style.marginBottom = saOk.style.marginBottom = '3px';
        saOk.style.marginLeft = '15px';
        saCancel.style.marginLeft = ((saWidth - (saCancel.getBoundingClientRect().width + 15 + saOk.getBoundingClientRect().width)) / 2) + 'px';
    }

    mFile[0].onclick = function () {
        if (typeof saveAs == 'undefined') {
            createSaveAs();
        }
        else {
            saveAs.style.display = 'block';
        }

        saveAs.style.left = (window.pageXOffset + (document.body.clientWidth / 2) - (saveAs.offsetWidth / 2)) + 'px';
        saveAs.style.top = (window.pageYOffset + (window.innerHeight / 2) - (saveAs.offsetHeight / 2)) + 'px';

        saCancel.onclick = function () {
            saveAs.style.display = 'none';
        }

        saOk.onclick = function () {
            if (fileName.value.indexOf('\\') !== -1 || fileName.value.indexOf('/') !== -1 || fileName.value.indexOf(':') !== -1
            || fileName.value.indexOf('*') !== -1 || fileName.value.indexOf('?') !== -1 || fileName.value.indexOf('\"') !== -1 
            || fileName.value.indexOf('<') !== -1 || fileName.value.indexOf('>') !== -1 || fileName.value.indexOf('|') !== -1) {
                alert('Invalid file name. Please do not use restricted characters: \\ / : * ? \" < > |');
            }
            else {
                var ext = fileExt.value;
                var dataURL = canvas.toDataURL("image/" + ext);
                var link = document.createElement("a");
    
                document.body.appendChild(link); // Firefox requires the link to be in the body
                link.href = dataURL;
    
                if (ext == 'png' || ext == 'webp' || ext == 'bmp') {
                    link.download = fileName.value + "." + ext;
                }
                else if (ext == 'jpeg') {
                    link.download = fileName.value + ".jpg";
                }
                else if (ext == 'vnd.microsoft.icon') {
                    if (canvas.width > 256 || canvas.height > 256) {
                        alert('Cannot save file. Max allowed sizes for .ico files are 256 x 256 pixels!');
                        link.remove();
                        return;
                    }
    
                    link.download = fileName.value + ".ico";
                }

                link.click();
                link.remove();
            }
        }

        hideMenu(mFile, 2);
    }

    function optionboxCreate() {
        optionbox = document.createElement('div');
        optionbox.boxName = 'optionbox';
        optionbox.id = 'option_box';
        optionbox.style.position = 'absolute';
        optionbox.style.left = canvas.getBoundingClientRect().left + 'px';
        optionbox.style.backgroundColor = 'pink';
        optionbox.style.border = '1px solid red';
        optionbox.style.width = '350px';

        createMovePanel(optionbox);

        var canvasSizeFSet = document.createElement('fieldset'),
        canvasSize = document.createElement('legend'),
        canvasWLabel = document.createElement('label'),
        canvasHLabel = document.createElement('label'),
        lineLabel = document.createElement('label'),
        eraserLabel = document.createElement('label'),
        strokeLabel = document.createElement('label'),
        stAlphaLabel = document.createElement('label'),
        fillLabel = document.createElement('label'),
        fAlphaLabel = document.createElement('label'),
        sameColorsL = document.createElement('label'),
        boxLabel = document.createElement('label'),
        lineDrawLabel = document.createElement('label'),
        fillModeLabel = document.createElement('label'),

        computed = getComputedStyle(cnvContainer);

        canvasWidth = document.createElement('input');
        canvasHeight = document.createElement('input');
        lineWidth = document.createElement('input');
        eraserWidth = document.createElement('input');
        strokeColor = document.createElement('input');
        strokeAlpha = document.createElement('input');
        fillColor = document.createElement('input');
        fillAlpha = document.createElement('input');
        sameColors = document.createElement('input');
        lineDrawMode = document.createElement('input');
        fillMode = document.createElement('input');

        boxLocation = document.createElement('select');
        boxLocOpt1 = document.createElement('option');
        boxLocOpt2 = document.createElement('option');
        boxLocOpt3 = document.createElement('option');
        boxLocOpt4 = document.createElement('option');
        boxLocOpt5 = document.createElement('option');
        boxLocOpt6 = document.createElement('option');
        boxLocOpt7 = document.createElement('option');
        boxLocOpt8 = document.createElement('option');
        boxLocOpt9 = document.createElement('option');

        applySettings = document.createElement('button');

        canvasSize.setAttribute('class', 'unselectable');
        canvasSize.textContent = 'Canvas Sizes';
        canvasWLabel.setAttribute('class', 'unselectable');  
        canvasWLabel.style.display = 'inline-block';
        canvasWLabel.textContent = 'Width: ';
        canvasWidth.setAttribute('id', 'canvaswidth');
        canvasWidth.setAttribute('type', 'number');
        canvasWidth.setAttribute('min', '1');
        canvasWidth.setAttribute('max', '9999999');
        canvasWidth.addEventListener('input', evt => inControl(evt, 7), false);
        canvasWidth.addEventListener('focus', inFocusControl, false);
        canvasWidth.addEventListener('paste', evt => {evt.preventDefault();}, false);
        canvasWidth.style.width = '70px';
        canvasWidth.value = canvas.width;
        canvasHLabel.setAttribute('class', 'unselectable');
        canvasHLabel.style.display = 'inline-block';
        canvasHLabel.style.marginLeft = '10px';
        canvasHLabel.textContent = 'Height: ';
        canvasHeight.setAttribute('id', 'canvasheight');
        canvasHeight.setAttribute('type', 'number');
        canvasHeight.setAttribute('min', '1');
        canvasHeight.setAttribute('max', '9999999');
        canvasHeight.addEventListener('input', evt => inControl(evt, 7), false);
        canvasHeight.addEventListener('focus', inFocusControl, false);
        canvasHeight.addEventListener('paste', evt => {evt.preventDefault();}, false);
        canvasHeight.style.width = '70px';
        canvasHeight.value = canvas.height;

        lineLabel.setAttribute('class', 'unselectable');
        lineLabel.style.display = 'inline-block';
        lineLabel.style.marginLeft = '10px';
        lineLabel.textContent = 'Line Width: ';
        lineWidth.setAttribute('id', 'linewidth');
        lineWidth.setAttribute('type', 'number');
        lineWidth.setAttribute('min', '1');
        lineWidth.setAttribute('max', '99999');
        lineWidth.addEventListener('input', evt => inControl(evt, 5), false);
        lineWidth.addEventListener('focus', inFocusControl, false);
        lineWidth.addEventListener('paste', evt => {evt.preventDefault();}, false);
        lineWidth.style.width = '58px';
        lineWidth.style.marginBottom = '5px';
        lineWidth.style.marginLeft = '10px';
        lineWidth.value = ctx.lineWidth;

        eraserLabel.setAttribute('class', 'unselectable');
        eraserLabel.style.display = 'inline-block';
        eraserLabel.style.margin = '0 0 5px 11px';
        eraserLabel.textContent = 'Eraser Width: ';
        eraserWidth.setAttribute('id', 'eraserwidth');
        eraserWidth.setAttribute('type', 'number');
        eraserWidth.setAttribute('min', '1');
        eraserWidth.setAttribute('max', '99999');
        eraserWidth.addEventListener('input', evt => inControl(evt, 5), false);
        eraserWidth.addEventListener('focus', inFocusControl, false);
        eraserWidth.addEventListener('paste', evt => {evt.preventDefault();}, false);
        eraserWidth.style.width = '60px';
        eraserWidth.style.marginBottom = '5px';
        eraserWidth.value = ctx.lineWidth;

        strokeLabel.setAttribute('class', 'unselectable');
        strokeLabel.style.display = 'inline-block';
        strokeLabel.style.margin = '0 0 5px 10px';
        strokeLabel.textContent = 'Stroke Color: ';
        strokeColor.setAttribute('id', 'strokecolor');
        strokeColor.setAttribute('type', 'color');
        strokeColor.style.marginBottom = '5px';
        strokeColor.value = ctx.strokeStyle;

        stAlphaLabel.setAttribute('class', 'unselectable');
        stAlphaLabel.setAttribute('title', 'The more Stroke Alpha parameter has value, the less is stroke color transparency.'+
        '\nMinimal value is 1, maximal value is 255. Be careful, because this parameter has also effect on colors for drawings available for insertion from menu'+
        ' (except inserted images from Tools -> Insert Image).');
        stAlphaLabel.style.display = 'inline-block';
        if (mouseSupport) {
            stAlphaLabel.style.margin = '0 0 5px 12px';
        }
        else {
            stAlphaLabel.style.margin = '0 0 5px 23px';
        }
        stAlphaLabel.textContent = 'Stroke Alpha: ';
        strokeAlpha.setAttribute('id', 'strokealpha');
        strokeAlpha.setAttribute('type', 'number');
        strokeAlpha.setAttribute('min', '1');
        strokeAlpha.setAttribute('max', '255');
        strokeAlpha.addEventListener('input', evt => inControl(evt, 3), false);
        strokeAlpha.addEventListener('focus', inFocusControl, false);
        strokeAlpha.addEventListener('paste', evt => {evt.preventDefault();}, false);
        strokeAlpha.style.width = '40px';
        strokeAlpha.value = '255';

        fAlphaLabel.setAttribute('class', 'unselectable');
        fAlphaLabel.setAttribute('title', 'The more Fill Alpha parameter has value, the less is fill color transparency.'+
        '\nMinimal value is 1, maximal value is 255. Be careful, because this parameter has also effect on colors for drawings available for insertion from menu.'+
        ' (except inserted images from Tools -> Insert Image).');
        fAlphaLabel.style.display = 'inline-block';
        if (mouseSupport) {
            fAlphaLabel.style.margin = '0 0 5px 12px';
        }
        else {
            fAlphaLabel.style.margin = '0 0 5px 23px';
        }
        fAlphaLabel.textContent = 'Fill Alpha: ';
        fillAlpha.setAttribute('id', 'fillalpha');
        fillAlpha.setAttribute('type', 'number');
        fillAlpha.setAttribute('min', '1');
        fillAlpha.setAttribute('max', '255');
        fillAlpha.addEventListener('input', evt => inControl(evt, 3), false);
        fillAlpha.addEventListener('focus', inFocusControl, false);
        fillAlpha.addEventListener('paste', evt => {evt.preventDefault();}, false);
        fillAlpha.style.width = '40px';
        fillAlpha.style.marginLeft = '19px';
        fillAlpha.value = '255';

        fillLabel.setAttribute('class', 'unselectable');
        fillLabel.style.display = 'inline-block';
        fillLabel.style.margin = '0 0 5px 10px';
        fillLabel.textContent = 'Fill Color: ';
        fillColor.setAttribute('id', 'fillcolor');
        fillColor.setAttribute('type', 'color');
        fillColor.style.marginBottom = '5px';
        fillColor.style.marginLeft = '19px';
        fillColor.value = ctx.fillStyle;

        sameColorsL.setAttribute('class', 'unselectable');
        sameColorsL.setAttribute('title', 'Both colors (fill color and stroke color) are same when checked.');
        sameColorsL.style.display = 'none';
        sameColorsL.style.margin = '0 0 5px 10px';
        sameColorsL.textContent = 'Both Colors Same ';
        sameColors.setAttribute('id', 'samecolors');
        sameColors.setAttribute('type', 'checkbox');
        sameColors.style.marginBottom = '5px';

        boxLabel.setAttribute('class', 'unselectable');
        boxLabel.setAttribute('title', 'Choose location where to display in-app windows.');
        boxLabel.style.display = 'inline-block';
        boxLabel.style.margin = '0 0 5px 10px';
        boxLabel.textContent = 'Window Location: ';
        boxLocation.setAttribute('id', 'location');
        boxLocation.style.marginBottom = '5px';
        boxLocOpt1.setAttribute('value', 'canvas');
        boxLocOpt1.setAttribute('selected', '');
        boxLocOpt1.textContent = 'On Canvas';
        boxLocOpt2.setAttribute('value', 'current');
        boxLocOpt2.textContent = 'Current Location';
        boxLocOpt3.setAttribute('value', 'right');
        boxLocOpt3.textContent = 'Right of the Canvas';
        boxLocOpt4.setAttribute('value', 'bottom');
        boxLocOpt4.textContent = 'Bottom of the Canvas';
        boxLocOpt5.setAttribute('value', 'vcenter');
        boxLocOpt5.textContent = 'Center of the Viewport';
        boxLocOpt6.setAttribute('value', 'vtopleft');
        boxLocOpt6.textContent = 'Top Left of the Viewport';
        boxLocOpt7.setAttribute('value', 'vtopright');
        boxLocOpt7.textContent = 'Top Right of the Viewport';
        boxLocOpt8.setAttribute('value', 'vdownleft');
        boxLocOpt8.textContent = 'Down Left of the Viewport';
        boxLocOpt9.setAttribute('value', 'vdownright');
        boxLocOpt9.textContent = 'Down Right of the Viewport';

        lineDrawLabel.setAttribute('class', 'unselectable');
        lineDrawLabel.setAttribute('title', 'Line Drawing Mode: drawing lines using mouse clicks or touches (for device with touchcreen).');
        lineDrawLabel.style.display = 'inline-block';
        lineDrawLabel.style.margin = '0 0 5px 10px';
        lineDrawLabel.textContent = 'Line Drawing Mode ';
        lineDrawMode.setAttribute('id', 'linedrawmode');
        lineDrawMode.setAttribute('type', 'checkbox');
        lineDrawMode.style.marginBottom = '5px';
        lineDrawMode.checked = false;

        fillModeLabel.setAttribute('class', 'unselectable');
        fillModeLabel.setAttribute('title', 'Fill Mode: fill closed area with selected fill color and stroke color (for borders).'+
        ' If border color need to be same as fill color, checkbox "Both Colors Same" should be checked.');
        fillModeLabel.style.display = 'inline-block';
        fillModeLabel.style.margin = '0 0 5px 12px';
        fillModeLabel.textContent = 'Fill Mode';
        fillMode.setAttribute('id', 'fillmode');
        fillMode.setAttribute('type', 'checkbox');
        fillMode.style.marginBottom = '5px';
        fillMode.checked = false;

        applySettings.setAttribute('class', 'apply');
        applySettings.setAttribute('id', 'applysettings');
        applySettings.textContent = 'Apply';

        optionbox.appendChild(canvasSizeFSet);
        canvasSizeFSet.appendChild(canvasSize);
        canvasSizeFSet.appendChild(canvasWLabel);
        canvasWLabel.appendChild(canvasWidth);
        canvasSizeFSet.appendChild(canvasHLabel);
        canvasHLabel.appendChild(canvasHeight);
        optionbox.appendChild(document.createElement('br'));
        optionbox.appendChild(lineLabel);
        lineLabel.appendChild(lineWidth);
        optionbox.appendChild(eraserLabel);
        eraserLabel.appendChild(eraserWidth);
        optionbox.appendChild(strokeLabel);
        strokeLabel.appendChild(strokeColor);
        optionbox.appendChild(stAlphaLabel);
        stAlphaLabel.appendChild(strokeAlpha);
        optionbox.appendChild(fillLabel);
        fillLabel.appendChild(fillColor);
        optionbox.appendChild(fAlphaLabel);
        fAlphaLabel.appendChild(fillAlpha);
        optionbox.appendChild(sameColorsL);
        sameColorsL.appendChild(sameColors);
        optionbox.appendChild(boxLabel);
        boxLabel.appendChild(boxLocation);
        boxLocation.appendChild(boxLocOpt1);
        boxLocation.appendChild(boxLocOpt2);
        boxLocation.appendChild(boxLocOpt3);
        boxLocation.appendChild(boxLocOpt4);
        boxLocation.appendChild(boxLocOpt5);
        boxLocation.appendChild(boxLocOpt6);
        boxLocation.appendChild(boxLocOpt7);
        boxLocation.appendChild(boxLocOpt8);
        boxLocation.appendChild(boxLocOpt9);
        optionbox.appendChild(lineDrawLabel);
        lineDrawLabel.appendChild(lineDrawMode);
        optionbox.appendChild(fillModeLabel);
        fillModeLabel.appendChild(fillMode);
        if (hasMouse && hasTouch) {
            var mouseMLabel = document.createElement('label'),
            touchMLabel = document.createElement('label');

            mouseMode = document.createElement('input');
            touchMode = document.createElement('input');

            touchMLabel.setAttribute('class', 'unselectable');
            touchMLabel.style.display = 'inline-block';
            touchMLabel.style.margin = '0 0 5px 10px';
            touchMLabel.textContent = 'Use Touchscreen ';
            touchMode.setAttribute('id', 'touchmode');
            touchMode.setAttribute('type', 'radio');
            touchMode.name = 'pointer-type';

            mouseMLabel.setAttribute('class', 'unselectable');
            mouseMLabel.style.display = 'inline-block';
            mouseMLabel.style.margin = '0 0 5px 32px';
            mouseMLabel.textContent = 'Use Mouse ';
            mouseMode.setAttribute('id', 'mousemode');
            mouseMode.setAttribute('type', 'radio');
            mouseMode.name = 'pointer-type';

            optionbox.appendChild(touchMLabel);
            touchMLabel.appendChild(touchMode);
            optionbox.appendChild(mouseMLabel);
            mouseMLabel.appendChild(mouseMode);

            if (!mouseOnTouch) {
                touchMode.checked = true;
            }
            else {
                mouseMode.checked = true;
            }
        }
        optionbox.appendChild(applySettings);
        document.body.appendChild(optionbox);

        optionbox.style.top = (parseInt(computed.top, 10) + parseInt(computed.marginTop, 10)) + 'px';
        applySettings.style.margin = '0 0 5px ' + ((optionbox.offsetWidth / 2) - (applySettings.offsetWidth / 2)) + 'px';
        optionbox.children[0].style.touchAction = 'none';

        boxes.push(optionbox);
    }

    mFile[1].onclick = function() {
        if (typeof optionbox == 'undefined') {
            optionboxCreate();
        }
        else {
            optionbox.style.display = 'block';
            canvasWidth.value = canvas.width;
            canvasHeight.value = canvas.height;
        }

        showBox(optionbox);

        if (mouseSupport == true) {
            optionbox.addEventListener('mousedown', mouseDownBox, false);
        }

        if (touchSupport == true) {
            optionbox.addEventListener('pointerdown', pointerDownBox, false);
            
        }

        lineDrawMode.onchange = function () {
            if (lineDrawMode.checked) {
                fillMode.disabled = true;
                ctx.beginPath();
            }
            else {
                fillMode.disabled = false;
                ctx.beginPath();
            }
        }

        fillMode.onchange = function () {
            if (fillMode.checked) {
                sameColors.parentNode.style.display = 'inline-block';
                lineDrawMode.disabled = true;
            }
            else {
                if (sameColors.checked) {
                    fillColor.removeEventListener('change', scSet, false);
                    strokeColor.removeEventListener('change', scSet, false);
                }

                sameColors.checked = false;

                sameColors.parentNode.style.display = 'none';
                lineDrawMode.disabled = false;
            }
        }

        sameColors.onchange = function () {
            if (sameColors.checked) {
                strokeColor.value = fillColor.value;
                
                fillColor.addEventListener('change', scSet, false);
                strokeColor.addEventListener('change', scSet, false);
            }
            else {
                fillColor.removeEventListener('change', scSet, false);
                strokeColor.removeEventListener('change', scSet, false);
            }
        }

        applySettings.onclick = function (evt) {
            var box = evt.target.parentNode, boxName = box.boxName;

            function ctxSaveOption () {
                img.src = canvas.toDataURL();
                img.onload = function () {
                    var cnvSzErr = false;
                    canvas.width = canvasWidth.value;
                    canvas.height = canvasHeight.value;
                    cnvContainer.style.width = canvas.width + 'px';
                    cnvContainer.style.height = canvas.height + 'px';

                    try {
                        ctx.getImageData(0,0,1,1);
                    }
                    catch (err) {
                        errors[boxName]++;
                        alert('Error! Cannot change image size! Values changed to default.');

                        canvas.width = canvasWidth.value = curSettings['canvasWidth'];
                        canvas.height = canvasHeight.value = curSettings['canvasHeight'];
                        cnvContainer.style.width = canvas.width + 'px';
                        cnvContainer.style.height = canvas.height + 'px';
                        cnvSzErr = true;
                    }
                    
                    if (!cnvSzErr) {
                        curSettings['canvasWidth'] = canvasWidth.value;
                        curSettings['canvasHeight'] = canvasHeight.value;
                    }

                    ctx.fillStyle = '#ffffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.drawImage(img, 0, 0);

                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';

                    ctx.lineWidth = curSettings['lineWidth'];
                    ctx.strokeStyle = strokeColor.value;
                    ctx.fillStyle = fillColor.value;
                    ctx.font = font;
                    cnvLoaded[boxName] = true;
                }
            }

            if (canvasWidth.value != curSettings['canvasWidth'] || canvasHeight.value != curSettings['canvasHeight']) {
                if (parseInt(canvasWidth.value, 10) < 1 || parseInt(canvasHeight.value, 10) < 1 ||
                    canvasWidth.value == '' || canvasHeight.value == '') {
                    errors[boxName]++;
                    alert('Invalid value set for canvas width or canvas height. Canvas sizes cannot be changed!');
                    canvasWidth.value = curSettings.canvasWidth;
                    canvasHeight.value = curSettings.canvasHeight;
                }
                else {
                    ctxSaveOption();
                }
            }
            else {
                cnvLoaded[boxName] = true; // if canvas sizes not changed cnvLoaded automatically true
            }
            if (lineWidth.value != curSettings['lineWidth']) {
                if (parseInt(lineWidth.value, 10) < 1 || lineWidth.value == '') {
                    errors[boxName]++;
                    alert('Invalid value set for line width. Line width cannot be changed!');
                    lineWidth.value = curSettings.lineWidth;
                }
                else {
                    curSettings['lineWidth'] = ctx.lineWidth = lineWidth.value;
                }
            }
            if (eraserWidth.value != curSettings['eraserWidth']) {
                if (parseInt(eraserWidth.value, 10) < 1 || eraserWidth.value == '') {
                    errors[boxName]++;
                    alert('Invalid value set for eraser width. Eraser width cannot be changed!');
                    eraserWidth.value = curSettings.eraserWidth;
                }
                else {
                    curSettings['eraserWidth'] = eraserW = eraserWidth.value;
                }
            }
            if (strokeColor.value != curSettings['strokeColor'] || strokeAlpha.value != curSettings['strokeAlpha']) {
                var stAlphaNum = parseInt(strokeAlpha.value, 10);
                if (stAlphaNum < 1 || stAlphaNum > 255 || strokeAlpha.value == '') {
                    errors[boxName]++;
                    alert('Invalid value set for stroke alpha parameter. It cannot be changed!');
                    strokeAlpha.value = curSettings.strokeAlpha;
                }
                else {
                    var sCol = new String();
                    stAlphaHex = stAlphaNum.toString(16);
                    if (stAlphaHex.length == 1) {
                        stAlphaHex = '0' + stAlphaHex;
                    }
                    sCol = strokeColor.value + stAlphaHex;
                    ctx.strokeStyle = curSettings['strokeColor'] = sCol;
                    curSettings['strokeAlpha'] = strokeAlpha.value;
                }
            }
            if (fillColor.value != curSettings['fillColor'] || fillAlpha.value != curSettings['fillAlpha']) {
                var fAlphaNum = parseInt(fillAlpha.value, 10);
                if (fAlphaNum < 1 || fAlphaNum > 255 || fillAlpha.value == '') {
                    errors[boxName]++;
                    alert('Invalid value set for fill alpha parameter. It cannot be changed!');
                    fillAlpha.value = curSettings.fillAlpha;
                }
                else {
                    var fCol = new String();
                    fAlphaHex = parseInt(fillAlpha.value, 10).toString(16);
                    if (fAlphaHex.length == 1) {
                        fAlphaHex = '0' + fAlphaHex;
                    }
                    fCol = fillColor.value + fAlphaHex;
                    ctx.fillStyle = curSettings['fillColor'] = fCol;
                    curSettings['fillAlpha'] = fillAlpha.value;
                }
            }
            if (lineDrawMode.checked != curSettings['lineDrawMode']) {
                if (lineDrawMode.checked == true) {
                    curSettings['lineDrawMode'] = lineDraw = true;
                }
                else {
                    curSettings['lineDrawMode'] = lineDraw = false;
                }
            }
            if (fillMode.checked != curSettings['fillMode']) {
                if (fillMode.checked == true) {
                    curSettings['fillMode'] = fillDraw = true;
                }
                else {
                    curSettings['fillMode'] = fillDraw = false;
                }
            }
            if (hasMouse && hasTouch) {
                if (touchMode.checked && curSettings.pointer == 'mouse') {
                    canvas.removeEventListener('pointerup', handlePointerEnd, false);
                    canvas.addEventListener('pointerout', handlePointerEnd, false);

                    curSettings.pointer = 'touchscreen';
                    mouseOnTouch = false;
                    pointerCount = 0;
                    drawCancelled = false;
                }
                else if (mouseMode.checked && curSettings.pointer == 'touchscreen') {
                    canvas.removeEventListener('pointerout', handlePointerEnd, false);
                    canvas.addEventListener('pointerup', handlePointerEnd, false);

                    curSettings.pointer = 'mouse';
                    mouseOnTouch = true;
                    pointerCount = 0;
                    painting = false;
                    drawCancelled = false;
                }
            }

            cnvLoadTimer[boxName] = window.setInterval(function () {closeBox(box);}, 50);

        }

        hideMenu(mFile, 2);
    }
}

// if click on menu item 'Edit'
edit.onclick = function() {
    if(!created['edit']){
        mEdit = createMenu('Edit');
        created['edit'] = visible['edit'] = true;
        mEdit[0].style.display = mEdit[1].style.display = mEdit[2].style.display = 'flex';
        miPosition(edit, mEdit);
        menuZIndex(true);
    } else if(created['edit'] && visible['edit'] && cVer) {
        hideMenu(mEdit, 3);
    } else {
        mEdit[0].style.display = mEdit[1].style.display = mEdit[2].style.display = 'flex';
        visible['edit'] = true;

        menuZIndex(true);
        miPosition(edit, mEdit);
    }

    var menu_visit = [true, false, false, false];

    edit.onmouseleave = function(evt) {
        if(evt.clientY >= edit.getBoundingClientRect().bottom
        && evt.clientX > edit.getBoundingClientRect().left
        && evt.clientX < edit.getBoundingClientRect().right) {
            menu_visit[0] = false;
            menu_visit[1] = true;
        }
        else {
            hideMenu(mEdit, 3);
        }
    }

    mEdit[0].onmouseleave = function(evt) {
        if(evt.clientX > mEdit[0].getBoundingClientRect().left
        && evt.clientX < mEdit[0].getBoundingClientRect().right){
            if(evt.clientY <= mEdit[0].getBoundingClientRect().top){
                menu_visit[0] = true;
                menu_visit[1] = false;
            }
            else if (evt.clientY >= mEdit[0].getBoundingClientRect().bottom) {
                menu_visit[1] = false;
                menu_visit[2] = true;
            }
        }
        else {
            hideMenu(mEdit, 3);
        }
    }

    mEdit[1].onmouseleave = function(evt) {
        if(evt.clientX > mEdit[1].getBoundingClientRect().left
        && evt.clientX < mEdit[1].getBoundingClientRect().right){
            if(evt.clientY <= mEdit[1].getBoundingClientRect().top){
                menu_visit[1] = true;
                menu_visit[2] = false;
            }
            else if (evt.clientY >= mEdit[1].getBoundingClientRect().bottom) {
                menu_visit[2] = false;
                menu_visit[3] = true;
            }
        }
        else {
            hideMenu(mEdit, 3);
        }
    }

    mEdit[2].onmouseleave = function(evt) {
        if(evt.clientX > mEdit[2].getBoundingClientRect().left
        && evt.clientX < mEdit[2].getBoundingClientRect().right
        && evt.clientY <= mEdit[2].getBoundingClientRect().top){
            menu_visit[2] = true;
            menu_visit[3] = false;
        }
        else {
            hideMenu(mEdit, 3);
        }
    }

    mEdit[0].onclick = function () {
        ctx.save();
        ctx.fillStyle = '#ffffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.beginPath();
        changeMaker();
        hideMenu(mEdit, 3);
    }

    mEdit[1].onclick = function () {
        curChange--;
        img.src = changes[curChange];
        img.onload = function () {
            ctx.save();
            ctx.fillStyle = '#ffffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            ctx.beginPath();
            ctx.drawImage(img, 0, 0);
        }
        
        ctx.beginPath();

        hideMenu(mEdit, 3);
    }

    mEdit[2].onclick = function () {
        if (curChange != (changes.length - 1)) {
            curChange++;
            img.src = changes[curChange];
            img.onload = function () {
                ctx.save();
                ctx.fillStyle = '#ffffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
                ctx.beginPath();
                ctx.drawImage(img, 0, 0);
            }
        }

        ctx.beginPath();

        hideMenu(mEdit, 3);
    }
}

// if click on menu item 'Tools'
tools.onclick = function() {
    if(!created['tools']){
        mTools = createMenu('Tools');
        created['tools'] = visible['tools'] = true;
        mTools[0].style.display = mTools[1].style.display = mTools[2].style.display = mTools[3].style.display =
        mTools[4].style.display = 'flex';
        miPosition(tools, mTools);
        menuZIndex(true);
    } else if(created['tools'] && visible['tools']) {
        hideMenu(mTools, 5);
    } else {
        mTools[0].style.display = mTools[1].style.display = mTools[2].style.display = mTools[3].style.display =
        mTools[4].style.display = 'flex';
        visible['tools'] = true;

        menuZIndex(true);
        miPosition(tools, mTools);
    }

    var menu_visit = [true, false, false, false, false, false];

    tools.onmouseleave = function(evt) {
        if(evt.clientY >= tools.getBoundingClientRect().bottom
        && evt.clientX > tools.getBoundingClientRect().left
        && evt.clientX < tools.getBoundingClientRect().right) {
            menu_visit[0] = false;
            menu_visit[1] = true;
        }
        else {
            hideMenu(mTools, 5);
        }
    }

    mTools[0].onmouseleave = function(evt) {
        if(evt.clientX > mTools[0].getBoundingClientRect().left
        && evt.clientX < mTools[0].getBoundingClientRect().right){
            if(evt.clientY <= mTools[0].getBoundingClientRect().top){
                menu_visit[0] = true;
                menu_visit[1] = false;
            }
            else if (evt.clientY >= mTools[0].getBoundingClientRect().bottom) {
                menu_visit[1] = false;
                menu_visit[2] = true;
            }
        }
        else {
            hideMenu(mTools, 5);
        }
    }

    mTools[1].onmouseleave = function(evt) {
        if(evt.clientX > mTools[1].getBoundingClientRect().left
        && evt.clientX < mTools[1].getBoundingClientRect().right){
            if(evt.clientY <= mTools[1].getBoundingClientRect().top){
                menu_visit[1] = true;
                menu_visit[2] = false;
            }
            else if (evt.clientY >= mTools[1].getBoundingClientRect().bottom) {
                menu_visit[2] = false;
                menu_visit[3] = true;
            }
        }
        else {
            hideMenu(mTools, 5);
        }
    }

    mTools[2].onmouseleave = function(evt) {
        if(evt.clientX > mTools[2].getBoundingClientRect().left
        && evt.clientX < mTools[2].getBoundingClientRect().right){
            if(evt.clientY <= mTools[2].getBoundingClientRect().top){
                menu_visit[2] = true;
                menu_visit[3] = false;
            }
            else if (evt.clientY >= mTools[2].getBoundingClientRect().bottom) {
                menu_visit[3] = false;
                menu_visit[4] = true;
            }
        }
        else {
            hideMenu(mTools, 5);
        }
    }

    mTools[3].onmouseleave = function(evt) {
        if(evt.clientX > mTools[3].getBoundingClientRect().left
        && evt.clientX < mTools[3].getBoundingClientRect().right){
            if(evt.clientY <= mTools[3].getBoundingClientRect().top){
                menu_visit[3] = true;
                menu_visit[4] = false;
            }
            else if (evt.clientY >= mTools[3].getBoundingClientRect().bottom) {
                menu_visit[4] = false;
                menu_visit[5] = true;
            }
        }
        else {
            hideMenu(mTools, 5);
        }
    }

    mTools[4].onmouseleave = function(evt) {
        if(evt.clientX > mTools[4].getBoundingClientRect().left
        && evt.clientX < mTools[4].getBoundingClientRect().right
        && evt.clientY <= mTools[4].getBoundingClientRect().top){
            menu_visit[4] = true;
            menu_visit[5] = false;
        }
        else {
            hideMenu(mTools, 5);
        }
    }

    if (!cVer) {
        canvas.width = 2**20;
        canvas.height = 2**20;
    }

    function insImageBoxCreate () {
        imagebox = document.createElement('div');
        imagebox.boxName = 'imagebox';
        imagebox.id = 'image_box';
        imagebox.style.position = 'absolute';
        imagebox.style.boxSizing = 'border-box';
        imagebox.style.backgroundColor = 'pink';
        imagebox.style.border = '1px solid red';
        imagebox.style.width = '290px';

        createMovePanel(imagebox);

        var insImageXLabel = document.createElement('label'),
        insImageYLabel = document.createElement('label'),
        insImageFSet = document.createElement('fieldset'),
        insImageLeg = document.createElement('legend'),
        ibDontLabel = document.createElement('label');

        insImageX = document.createElement('input');
        insImageY = document.createElement('input');
        imageboxDontClose = document.createElement('input');

        imageOpen = document.createElement('button');
        imageCancel = document.createElement('button');

        insImageLeg.setAttribute('class', 'unselectable');
        insImageLeg.textContent = 'Choose Coordinates of Top Left Corner';
        insImageXLabel.setAttribute('class', 'unselectable');
        insImageXLabel.style.display = 'inline-block';
        insImageXLabel.textContent = 'X: ';
        insImageX.setAttribute('id', 'insimagex');
        insImageX.setAttribute('type', 'number');
        insImageX.setAttribute('min', '0');
        insImageX.setAttribute('max', '9999999');
        insImageX.addEventListener('input', evt => inControl(evt, 7), false);
        insImageX.addEventListener('focus', inFocusControl, false);
        insImageX.addEventListener('paste', evt => {evt.preventDefault();}, false);
        insImageX.style.width = '50px';
        insImageX.value = 0;
        insImageYLabel.setAttribute('class', 'unselectable');
        insImageYLabel.style.display = 'inline-block';
        insImageYLabel.style.marginLeft = '20px';
        insImageYLabel.textContent = 'Y: ';
        insImageY.setAttribute('id', 'insimagey');
        insImageY.setAttribute('type', 'number');
        insImageY.setAttribute('min', '0');
        insImageY.setAttribute('max', '9999999');
        insImageY.addEventListener('input', evt => inControl(evt, 7), false);
        insImageY.addEventListener('focus', inFocusControl, false);
        insImageY.addEventListener('paste', evt => {evt.preventDefault();}, false);
        insImageY.style.width = '50px';
        insImageY.value = 0;

        ibDontLabel.setAttribute('class', 'unselectable');
        ibDontLabel.style.display = 'inline-block';
        ibDontLabel.style.marginLeft = '16px';
        ibDontLabel.textContent = 'Don\'t Close on Insert ';
        imageboxDontClose.setAttribute('id', 'ibdontclose');
        imageboxDontClose.setAttribute('type', 'checkbox');

        imageCancel.setAttribute('class', 'apply');
        imageCancel.setAttribute('id', 'imagecancel');
        imageCancel.textContent = 'Cancel';
        imageOpen.setAttribute('class', 'apply');
        imageOpen.setAttribute('id', 'openimage');
        imageOpen.textContent = 'Choose Image';

        imagebox.appendChild(insImageFSet);
        insImageFSet.appendChild(insImageLeg);
        insImageFSet.appendChild(insImageXLabel);
        insImageXLabel.appendChild(insImageX);
        insImageFSet.appendChild(insImageYLabel);
        insImageYLabel.appendChild(insImageY);
        imagebox.appendChild(ibDontLabel);
        ibDontLabel.appendChild(imageboxDontClose);
        imagebox.appendChild(document.createElement('br'));
        imagebox.appendChild(imageCancel);
        imagebox.appendChild(imageOpen);
        document.body.appendChild(imagebox);

        imageCancel.style.margin = '5px 0 5px 10px';
        imageOpen.style.margin = '5px 0 5px 15px';
        imagebox.children[0].style.touchAction = 'none';

        boxes.push(imagebox);
    }

    mTools[0].onclick = function () {
        if (typeof imagebox == 'undefined') {
            insImageBoxCreate();
        }
        else {
            imagebox.style.display = 'block';
        }

        showBox(imagebox);

        if (mouseSupport == true) {
            imagebox.addEventListener('mousedown', mouseDownBox, false);
        }

        if (touchSupport == true) {
            imagebox.addEventListener('pointerdown', pointerDownBox, false);
        }

        imageCancel.onclick = function() {
            if (mouseSupport == true) {
                imagebox.removeEventListener('mousedown', mouseDownBox, false);
            }
    
            if (touchSupport == true) {
                imagebox.removeEventListener('pointerdown', pointerDownBox, false);
            }

            imagebox.style.display = 'none';
            zBoxPriorityOnHide(imagebox);
        }

        imageOpen.onclick = function (evt) {
            var x = parseInt(insImageX.value, 10), y = parseInt(insImageY.value, 10),
            box = evt.target.parentNode, boxName = box.boxName;
            
            if (x < 0 || y < 0 || insImageX.value == '' || insImageY.value == '') {
                alert('Invalid value set, so image cannot be drawn!');
            }
            else {
                if (typeof input == 'undefined') {
                    input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.style.display = 'none';
                    imagebox.appendChild(input);
                }

                input.click();

                reader.onload = function () {
                    img.onload = function () {
                        var imgbxErr = false;

                        function ctxSaveImageBox() {
                            img2.onload = function () {
                                ctx.fillStyle = '#ffffffff';
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
        
                                ctx.drawImage(img2, 0, 0);
        
                                ctx.lineCap = 'round';
                                ctx.lineJoin = 'round';
                                ctx.lineWidth = curSettings['lineWidth'];
                                ctx.strokeStyle = curSettings['strokeColor'];
                                ctx.fillStyle = curSettings['fillColor'];
                                ctx.font = font;

                                if (errors[boxName] == 0) {
                                    ctx.drawImage(img, x, y);
                                    changeMaker();
                                }
                                else {
                                    errors[boxName] = 0;
                                }
                            }
                        }

                        if ((x + img.width) > canvas.width || (y + img.height) > canvas.height) {
                            img2.src = canvas.toDataURL();

                            if ((x + img.width) > canvas.width) {
                                canvas.width = x + img.width;
                                cnvContainer.style.width = canvas.width + 'px';
                            }
                            if ((y + img.height) > canvas.height) {
                                canvas.height = y + img.height;
                                cnvContainer.style.height = canvas.height;
                            }

                            try {
                                ctx.getImageData(0,0,1,1);
                            }
                            catch (err) {
                                errors[boxName]++;
                                canvas.width = curSettings.canvasWidth;
                                canvas.height = curSettings.canvasHeight;
                                cnvContainer.style.width = canvas.width + 'px';
                                cnvContainer.style.height = canvas.height + 'px';
                                imgbxErr = true;
                                insImageX.value = '0';
                                insImageY.value = '0';

                                alert('Error! Operation cannot be done.');
                            }

                            if (!imgbxErr) {
                                curSettings.canvasWidth = canvas.width;
                                curSettings.canvasHeight = canvas.height;
                            }

                            ctxSaveImageBox();
                        }
                        else {
                            ctx.drawImage(img, x, y);
                            changeMaker();
                        }

                    }
                    img.src = reader.result;
                }

                input.onchange = function () {
                    reader.readAsDataURL(input.files[0]);
                }

                if (!imageboxDontClose.checked) {
                    if (mouseSupport == true) {
                        imagebox.removeEventListener('mousedown', mouseDownBox, false);
                    }
            
                    if (touchSupport == true) {
                        imagebox.removeEventListener('pointerdown', pointerDownBox, false);
                    }
            
                    imagebox.style.display = 'none';
                    zBoxPriorityOnHide(imagebox);
                }
            }
        }

        hideMenu(mTools, 5);
    }

    function insTextBoxCreate () {
        textbox = document.createElement('div');
        textbox.boxName = 'textbox';
        textbox.id = 'text_box';
        textbox.style.position = 'absolute';
        textbox.style.boxSizing = 'border-box';
        textbox.style.backgroundColor = 'pink';
        textbox.style.border = '1px solid red';
        textbox.style.width = '280px';

        createMovePanel(textbox);

        var insTextXLabel = document.createElement('label'),
        insTextYLabel = document.createElement('label'),
        insTextLabel = document.createElement('label'),
        insTextFSet = document.createElement('fieldset'),
        insTextLeg = document.createElement('legend'),
        fontSizeLabel = document.createElement('label'),
        fontStyleLabel = document.createElement('label'),
        fontFamilyLabel = document.createElement('label'),
        textColorLabel = document.createElement('label'),
        textDrawModeLabel = document.createElement('label'),
        tbDontLabel = document.createElement('label');

        insTextX = document.createElement('input');
        insTextY = document.createElement('input');
        textContent = document.createElement('input');
        fontSize = document.createElement('input');
        fontFamily = document.createElement('input');
        textColor = document.createElement('input');
        textboxDontClose = document.createElement('input');

        fSizePtPx = document.createElement('select');
        fSizeOpt1 = document.createElement('option');
        fSizeOpt2 = document.createElement('option');

        fontStyle = document.createElement('select');
        fStyleOpt1 = document.createElement('option');
        fStyleOpt2 = document.createElement('option');
        fStyleOpt3 = document.createElement('option');

        textDrawMode = document.createElement('select');
        tDrawM1 = document.createElement('option');
        tDrawM2 = document.createElement('option');

        textCancel = document.createElement('button');
        textDraw = document.createElement('button');

        insTextFSet.style.marginBottom = '5px';
        insTextFSet.style.width = '250px';
        insTextLeg.setAttribute('class', 'unselectable');
        insTextLeg.textContent = 'Down Left Corner of First Character';
        insTextXLabel.setAttribute('class', 'unselectable');
        insTextXLabel.style.display = 'inline-block';
        insTextXLabel.textContent = 'X: ';
        insTextX.setAttribute('id', 'instextx');
        insTextX.setAttribute('type', 'number');
        insTextX.setAttribute('min', '0');
        insTextX.setAttribute('max', '9999999');
        insTextX.addEventListener('input', evt => inControl(evt, 7), false);
        insTextX.addEventListener('focus', inFocusControl, false);
        insTextX.addEventListener('paste', evt => {evt.preventDefault();}, false);
        insTextX.style.width = '60px';
        insTextX.value = 0;
        insTextYLabel.setAttribute('class', 'unselectable');
        insTextYLabel.style.display = 'inline-block';
        insTextYLabel.style.marginLeft = '10px';
        insTextYLabel.textContent = 'Y: ';
        insTextY.setAttribute('id', 'instexty');
        insTextY.setAttribute('type', 'number');
        insTextY.setAttribute('min', '0');
        insTextY.setAttribute('max', '9999999');
        insTextY.addEventListener('input', evt => inControl(evt, 7), false);
        insTextY.addEventListener('focus', inFocusControl, false);
        insTextY.addEventListener('paste', evt => {evt.preventDefault();}, false);
        insTextY.style.width = '60px';
        insTextY.value = 0;

        insTextLabel.setAttribute('class', 'unselectable');
        insTextLabel.style.display = 'inline-block';
        insTextLabel.style.marginLeft = '16px';
        insTextLabel.textContent = 'Text: ';
        textContent.setAttribute('id', 'textcontent');
        textContent.addEventListener('input', evt => inTextControl(evt, 5000), false);
        textContent.addEventListener('paste', evt => {evt.preventDefault();}, false);
        textContent.style.width = '212px';
        textContent.style.marginBottom = '5px';

        fontSizeLabel.setAttribute('class', 'unselectable');
        fontSizeLabel.style.display = 'inline-block';
        fontSizeLabel.style.marginLeft = '16px';
        fontSizeLabel.textContent = 'Font Size: ';
        fontSize.setAttribute('id', 'fontsize');
        fontSize.setAttribute('type', 'number');
        fontSize.setAttribute('min', '1');
        fontSize.setAttribute('max', '99999');
        fontSize.addEventListener('input', evt => inControl(evt, 5), false);
        fontSize.addEventListener('focus', inFocusControl, false);
        fontSize.addEventListener('paste', evt => {evt.preventDefault();}, false);
        fontSize.style.marginBottom = '5px';
        fontSize.style.width = '50px';
        fontSize.value = ctx.font.split('p')[0];

        fSizePtPx.setAttribute('id', 'fsizeptpx');
        fSizeOpt1.setAttribute('value', 'px');
        fSizeOpt1.setAttribute('selected', '');
        fSizeOpt1.textContent = 'px';
        fSizeOpt2.setAttribute('value', 'pt');
        fSizeOpt2.textContent = 'pt';

        fontStyleLabel.setAttribute('class', 'unselectable');
        fontStyleLabel.style.display = 'inline-block';
        fontStyleLabel.style.marginLeft = '16px';
        fontStyleLabel.textContent = 'Font Style: ';
        fontStyle.setAttribute('id', 'fontstyle');
        fontStyle.style.marginBottom = '5px';
        fStyleOpt1.setAttribute('value', 'normal');
        fStyleOpt1.setAttribute('selected', '');
        fStyleOpt1.textContent = 'Normal';
        fStyleOpt2.setAttribute('value', 'bold');
        fStyleOpt2.textContent = 'Bold';
        fStyleOpt3.setAttribute('value', 'italic');
        fStyleOpt3.textContent = 'Italic';

        fontFamilyLabel.setAttribute('class', 'unselectable');
        fontFamilyLabel.style.display = 'inline-block';
        fontFamilyLabel.style.marginLeft = '16px';
        fontFamilyLabel.style.marginBottom = '5px';
        fontFamilyLabel.textContent = 'Font: ';
        fontFamily.setAttribute('id', 'fontfamily');
        fontFamily.addEventListener('input', evt => inTextControl(evt, 256), false);
        fontFamily.addEventListener('paste', evt => {evt.preventDefault();}, false);
        if (mouseSupport) {
            fontFamily.value = '\'Times New Roman\'';
        }
        else if (touchSupport) {
            fontFamily.value = '\'Liberation Serif\'';
        }
        

        textColorLabel.setAttribute('class', 'unselectable');
        textColorLabel.style.display = 'inline-block';
        textColorLabel.style.marginLeft = '16px';
        textColorLabel.style.marginBottom = '5px';
        textColorLabel.textContent = 'Text Color: ';
        textColor.setAttribute('id', 'textcolor');
        textColor.setAttribute('type', 'color');

        textDrawModeLabel.setAttribute('class', 'unselectable');
        textDrawModeLabel.setAttribute('title', 'Text Draw Mode: draw full text or only contour.');
        textDrawModeLabel.style.display = 'inline-block';
        textDrawModeLabel.style.marginLeft = '16px';
        textDrawModeLabel.textContent = 'Text Draw Mode: ';
        textDrawMode.setAttribute('id', 'textdrawmode');
        textDrawMode.style.marginBottom = '5px';
        tDrawM1.setAttribute('value', 'full');
        tDrawM1.setAttribute('selected', '');
        tDrawM1.textContent = 'Full';
        tDrawM2.setAttribute('value', 'contour');
        tDrawM2.textContent = 'Only Contour';

        tbDontLabel.setAttribute('class', 'unselectable');
        tbDontLabel.style.display = 'inline-block';
        tbDontLabel.style.marginLeft = '16px';
        tbDontLabel.textContent = 'Don\'t Close on Insert ';
        textboxDontClose.setAttribute('id', 'tbdontclose');
        textboxDontClose.setAttribute('type', 'checkbox');

        textCancel.setAttribute('class', 'apply');
        textCancel.setAttribute('id', 'textcancel');
        textCancel.textContent = 'Cancel';
        textDraw.setAttribute('class', 'apply');
        textDraw.setAttribute('id', 'textdraw');
        textDraw.textContent = 'Insert Text';

        textbox.appendChild(insTextFSet);
        insTextFSet.appendChild(insTextLeg);
        insTextFSet.appendChild(insTextXLabel);
        insTextXLabel.appendChild(insTextX);
        insTextFSet.appendChild(insTextYLabel);
        insTextYLabel.appendChild(insTextY);
        textbox.appendChild(insTextLabel);
        insTextLabel.appendChild(textContent);
        textbox.appendChild(fontSizeLabel);
        fontSizeLabel.appendChild(fontSize);
        textbox.appendChild(fSizePtPx);
        textbox.appendChild(document.createElement('br'));
        fSizePtPx.appendChild(fSizeOpt1);
        fSizePtPx.appendChild(fSizeOpt2);
        textbox.appendChild(fontStyleLabel);
        fontStyleLabel.appendChild(fontStyle);
        fontStyle.appendChild(fStyleOpt1);
        fontStyle.appendChild(fStyleOpt2);
        fontStyle.appendChild(fStyleOpt3);
        textbox.appendChild(fontFamilyLabel);
        fontFamilyLabel.appendChild(fontFamily);
        textbox.appendChild(textColorLabel);
        textColorLabel.appendChild(textColor);
        textbox.appendChild(textDrawModeLabel);
        textDrawModeLabel.appendChild(textDrawMode);
        textDrawMode.appendChild(tDrawM1);
        textDrawMode.appendChild(tDrawM2);
        textbox.appendChild(tbDontLabel);
        tbDontLabel.appendChild(textboxDontClose);
        textbox.appendChild(document.createElement('br'));
        textbox.appendChild(textCancel);
        textbox.appendChild(textDraw);
        document.body.appendChild(textbox);

        fSizePtPx.style.height = fontSize.getBoundingClientRect().height + 'px';

        textCancel.style.margin = '5px 0 5px 10px';
        textDraw.style.margin = '5px 0 5px 15px';
        textbox.children[0].style.touchAction = 'none';

        boxes.push(textbox);
    }

    mTools[1].onclick = function () {
        if (typeof textbox == 'undefined') {
            insTextBoxCreate();
        }
        else {
            textbox.style.display = 'block';
        }

        showBox(textbox);

        if (mouseSupport == true) {
            textbox.addEventListener('mousedown', mouseDownBox, false);
        }

        if (touchSupport == true) {
            textbox.addEventListener('pointerdown', pointerDownBox, false);
        }

        textCancel.onclick = function () {
            if (mouseSupport == true) {
                textbox.removeEventListener('mousedown', mouseDownBox, false);
            }
    
            if (touchSupport == true) {
                textbox.removeEventListener('pointerdown', pointerDownBox, false);
            }

            textbox.style.display = 'none';
            zBoxPriorityOnHide(textbox);
        }

        textDraw.onclick = function (evt) {
            var text_x = parseInt(insTextX.value, 10),
            text_y = parseInt(insTextY.value, 10),
            num_font = parseInt(fontSize.value, 10),
            box = evt.target.parentNode, boxName = box.boxName;

            if (text_x < 0 || text_y < 0 || num_font < 1 || insTextX.value == '' || insTextY.value == '' || fontSize.value == '') {
                errors[boxName]++;
                alert('Invalid value! Text cannot be drawn!');
            }
            else {
                var reWhiteSpace = new RegExp(/\s/),
                font_fam = fontFamily.value;

                if (reWhiteSpace.test(font_fam)) {
                    if (!(font_fam[0] == "'" || font_fam[0] == '"')) {
                        font_fam = '"' + font_fam;
                    }
                    if (!(font_fam[font_fam.length - 1] == "'" || font_fam[font_fam.length - 1] == '"')) {
                        font_fam += font_fam[0];
                    }
                    else if (font_fam[0] != font_fam[font_fam.length - 1]) {
                        font_fam = font_fam.substring(0, font_fam.length - 1);
                        font_fam += font_fam[0];
                    }

                    fontFamily.value = font_fam;
                }

                font = fontStyle.value + ' ' + fontSize.value + fSizePtPx.value + ' ' + font_fam;

                ctx.font = font;

                var metrics = ctx.measureText(textContent.value);

                var text_height = metrics.actualBoundingBoxDescent;

                var text_offset_width = text_x + metrics.width,
                text_offset_height = text_y + text_height;
                
                function drawText () {
                    var tbxError = false;
                    if (textDrawMode.value == 'full') {
                        ctx.save();
                        ctx.fillStyle = textColor.value + fAlphaHex;
                        try {
                        ctx.fillText(textContent.value, text_x, text_y);
                        }
                        catch (err) {
                            errors[boxName]++;
                            tbxError = true;
                            canvas.width = curSettings.canvasWidth;
                            canvas.height = curSettings.canvasHeight;
                            cnvContainer.style.width = curSettings.canvasWidth + 'px';
                            cnvContainer.style.height = curSettings.canvasHeight + 'px';
                            insTextX.value = '0';
                            insTextY.value = '0';

                            ctx.drawImage(img, 0, 0);
                            alert ('Error! Cannot insert text. Possible causes:\n- Font size is too big;\n- Text length exceeds limitations.');
                        }
                        ctx.restore();
                    }
                    else {
                        ctx.save();
                        ctx.strokeStyle = textColor.value + stAlphaHex;
                        try {
                            ctx.strokeText(textContent.value, text_x, text_y);
                        }
                        catch (err) {
                            errors[boxName]++;
                            tbxError = true;
                            canvas.width = curSettings.canvasWidth;
                            canvas.height = curSettings.canvasHeight;
                            cnvContainer.style.width = curSettings.canvasWidth + 'px';
                            cnvContainer.style.height = curSettings.canvasHeight + 'px';
                            ctx.drawImage(img, 0, 0);
                            alert ('Error! Cannot insert text. Possible causes:\n- Font size is too big;\n- Text length exceed limitations.');
                        }

                        ctx.restore();
                    }

                    if (!tbxError) {
                        curSettings.canvasWidth = canvas.width;
                        curSettings.canvasHeight = canvas.height;
                    }

                    cnvLoaded[boxName] = true;
                }

                function ctxSaveTextBox () {
                    img.onload = function () {
                        ctx.fillStyle = '#ffffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        ctx.drawImage(img, 0, 0);
                        
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.lineWidth = curSettings['lineWidth'];
                        ctx.strokeStyle = curSettings['strokeColor'];
                        ctx.fillStyle = curSettings['fillColor'];
                        ctx.font = font;

                        drawText();
                    }
                }

                if (text_offset_width > canvas.width || text_offset_height > canvas.height) {
                    img.src = canvas.toDataURL();

                    if (text_offset_width > canvas.width) {
                        canvas.width = text_offset_width;
                        cnvContainer.style.width = canvas.width + 'px';
                    }
                    if (text_offset_height > canvas.height) {
                        canvas.height = text_offset_height;
                        cnvContainer.style.height = canvas.height + 'px';
                    }

                    ctxSaveTextBox();
                }
                else {
                    drawText();
                }

                changeMaker();

                if (!textboxDontClose.checked) {
                    cnvLoadTimer[boxName] = window.setInterval(function () {closeBox(box);}, 50);
                }
                else {
                    errors[boxName] = 0;
                    cnvLoaded[boxName] = false;
                }
            }
        }
        
        hideMenu(mTools, 5);
    }

    function lineBoxCreate () {
        linebox = document.createElement('div');
        linebox.boxName = 'linebox';
        linebox.id = 'line_box';
        linebox.style.position = 'absolute';
        linebox.style.boxSizing = 'border-box';
        linebox.style.backgroundColor = 'pink';
        linebox.style.border = '1px solid red';
        linebox.style.width = '500px';

        createMovePanel(linebox);

        var lineFSet = document.createElement('fieldset'),
        lineLeg = document.createElement('legend'), 
        point1XLabel = document.createElement('label'),
        point1YLabel = document.createElement('label'),
        point2XLabel = document.createElement('label'),
        point2YLabel = document.createElement('label'),
        lineWidthLabel = document.createElement('label'),
        lineColorLabel = document.createElement('label'),
        lbFillColorLabel = document.createElement('label'),
        insLineDMLabel = document.createElement('label'),
        lineCapLabel = document.createElement('label'),
        lbDontLabel = document.createElement('label'),
        lineMulLable = document.createElement('lable');

        point1X = document.createElement('input');
        point1Y = document.createElement('input');
        point2X = document.createElement('input');
        point2Y = document.createElement('input');
        insLineWidth = document.createElement('input');
        lineColor = document.createElement('input');
        lbFillColor = document.createElement('input');
        lineboxDontClose = document.createElement('input');
        lineMultiple = document.createElement('input');

        insLineDrawMode = document.createElement('select');
        insLineM1 = document.createElement('option');
        insLineM2 = document.createElement('option');

        insLineCap = document.createElement('select');
        lineCapM1 = document.createElement('option');
        lineCapM2 = document.createElement('option');
        
        lineCancel = document.createElement('button');
        insLine = document.createElement('button');

        lineFSet.style.marginBottom = '5px';
        lineLeg.setAttribute('class', 'unselectable');
        lineLeg.textContent = 'Coordinates of Point 1 and Point 2';
        point1XLabel.setAttribute('class', 'unselectable');
        point1XLabel.style.display = 'inline-block';
        point1XLabel.textContent = 'X1: ';
        point1X.setAttribute('id', 'point1x');
        point1X.setAttribute('type', 'number');
        point1X.setAttribute('min', '0');
        point1X.setAttribute('max', '9999999');
        point1X.addEventListener('input', evt => inControl(evt, 7), false);
        point1X.addEventListener('focus', inFocusControl, false);
        point1X.addEventListener('paste', evt => {evt.preventDefault();}, false);
        point1X.style.width = '60px';
        point1X.value = 0;
        point1YLabel.setAttribute('class', 'unselectable');
        point1YLabel.style.display = 'inline-block';
        point1YLabel.style.marginLeft = '15px';
        point1YLabel.textContent = 'Y1: ';
        point1Y.setAttribute('id', 'point1y');
        point1Y.setAttribute('type', 'number');
        point1Y.setAttribute('min', '0');
        point1Y.setAttribute('max', '9999999');
        point1Y.addEventListener('input', evt => inControl(evt, 7), false);
        point1Y.addEventListener('focus', inFocusControl, false);
        point1Y.addEventListener('paste', evt => {evt.preventDefault();}, false);
        point1Y.style.width = '60px';
        point1Y.value = 0;
        point2XLabel.setAttribute('class', 'unselectable');
        point2XLabel.style.display = 'inline-block';
        point2XLabel.style.marginLeft = '15px';
        point2XLabel.textContent = 'X2: ';
        point2X.setAttribute('id', 'point2x');
        point2X.setAttribute('type', 'number');
        point2X.setAttribute('min', '0');
        point2X.setAttribute('max', '9999999');
        point2X.addEventListener('input', evt => inControl(evt, 7), false);
        point2X.addEventListener('focus', inFocusControl, false);
        point2X.addEventListener('paste', evt => {evt.preventDefault();}, false);
        point2X.style.width = '60px';
        point2X.value = 0;
        point2YLabel.setAttribute('class', 'unselectable');
        point2YLabel.style.display = 'inline-block';
        point2YLabel.style.marginLeft = '15px';
        point2YLabel.textContent = 'Y2: ';
        point2Y.setAttribute('id', 'point2y');
        point2Y.setAttribute('type', 'number');
        point2Y.setAttribute('min', '0');
        point2Y.setAttribute('max', '9999999');
        point2Y.addEventListener('input', evt => inControl(evt, 7), false);
        point2Y.addEventListener('focus', inFocusControl, false);
        point2Y.addEventListener('paste', evt => {evt.preventDefault();}, false);
        point2Y.style.width = '60px';
        point2Y.value = 0;

        lineWidthLabel.setAttribute('class', 'unselectable');
        lineWidthLabel.style.display = 'inline-block';
        lineWidthLabel.style.marginLeft = '15px';
        lineWidthLabel.style.marginBottom = '5px';
        lineWidthLabel.textContent = 'Line Width: ';
        insLineWidth.setAttribute('id', 'inslinewidth');
        insLineWidth.setAttribute('type', 'number');
        insLineWidth.setAttribute('min', '0');
        insLineWidth.setAttribute('max', '99999');
        insLineWidth.addEventListener('input', evt => inControl(evt, 5), false);
        insLineWidth.addEventListener('focus', inFocusControl, false);
        insLineWidth.addEventListener('paste', evt => {evt.preventDefault();}, false);
        insLineWidth.style.width = '60px';
        insLineWidth.value = '1';

        lineColorLabel.setAttribute('class', 'unselectable');
        lineColorLabel.style.display = 'inline-block';
        lineColorLabel.style.marginLeft = '15px';
        lineColorLabel.textContent = 'Line Color: ';
        lineColor.setAttribute('id', 'linecolor');
        lineColor.setAttribute('type', 'color');

        lbFillColorLabel.setAttribute('class', 'unselectable');
        lbFillColorLabel.style.display = 'inline-block';
        lbFillColorLabel.style.marginLeft = '15px';
        lbFillColorLabel.style.visibility = 'hidden';
        lbFillColorLabel.textContent = 'Fill Color: ';
        lbFillColor.setAttribute('id', 'lbfillcolor');
        lbFillColor.setAttribute('type', 'color');
        
        insLineDMLabel.setAttribute('class', 'unselectable');
        insLineDMLabel.setAttribute('title', 'Draw Mode: it is possible to draw usual lines or lines with fill color inside closed area.'+
        ' If option "Draw Line with Fill Mode" is chosen, checkbox "Don\'t close on Insert and Activate Step by Step Mode" will be checked automatically.'+
        ' This checkbox should be unchecked before making last action. If last action is made and second option is selected (draw with fill), closed area will be filled with selected color.');
        insLineDMLabel.style.display = 'inline-block';
        insLineDMLabel.style.marginLeft = '15px';
        insLineDMLabel.style.marginBottom = '5px';
        insLineDMLabel.textContent = 'Draw Mode: ';
        insLineDrawMode.setAttribute('id', 'inslinedrawmode');
        insLineM1.setAttribute('value', 'line');
        insLineM1.setAttribute('selected', '');
        insLineM1.textContent = 'Draw Only Line';
        insLineM2.setAttribute('value', 'fill');
        insLineM2.textContent = 'Draw Line with Fill Mode';

        lineCapLabel.setAttribute('class', 'unselectable');
        lineCapLabel.style.marginLeft = '15px';
        lineCapLabel.style.marginBottom = '5px';
        lineCapLabel.style.display = 'inline-block';
        lineCapLabel.textContent = 'Ends of the Line Style: ';
        insLineCap.setAttribute('id', 'inslinecap');
        insLineCap.style.width = '105px';
        lineCapM1.setAttribute('value', 'rounded');
        lineCapM1.setAttribute('selected', '');
        lineCapM1.textContent = 'Rounded';
        lineCapM2.setAttribute('value', 'rectangular');
        lineCapM2.textContent = 'Rectangular';

        lbDontLabel.setAttribute('class', 'unselectable');
        lbDontLabel.style.display = 'inline-block';
        lbDontLabel.style.marginLeft = '15px';
        lbDontLabel.textContent = 'Don\'t Close on Insert ';
        lineboxDontClose.setAttribute('id', 'lbdontclose');
        lineboxDontClose.setAttribute('type', 'checkbox');
        lineMulLable.setAttribute('class', 'unselectable');
        lineMulLable.setAttribute('title', 'If checked, starting point for new line will have same coordinates as last point from previous line.' +
        ' It works until user change mode or close this in-app window');
        lineMulLable.style.display = 'inline-block';
        lineMulLable.style.marginLeft = '15px';
        lineMulLable.textContent = '"Step by Step" mode ';
        lineMultiple.setAttribute('id', 'linemultiple');
        lineMultiple.setAttribute('type', 'checkbox');
        lineMultiple.disabled = true;

        lineCancel.setAttribute('class', 'apply');
        lineCancel.setAttribute('id', 'linecancel');
        lineCancel.textContent = 'Cancel';
        insLine.setAttribute('class', 'apply');
        insLine.setAttribute('id', 'insline');
        insLine.textContent = 'Insert Line';

        linebox.appendChild(lineFSet);
        lineFSet.appendChild(lineLeg);
        lineFSet.appendChild(point1XLabel);
        point1XLabel.appendChild(point1X);
        lineFSet.appendChild(point1YLabel);
        point1YLabel.appendChild(point1Y);
        lineFSet.appendChild(point2XLabel);
        point2XLabel.appendChild(point2X);
        lineFSet.appendChild(point2YLabel);
        point2YLabel.appendChild(point2Y);
        linebox.appendChild(lineWidthLabel);
        lineWidthLabel.appendChild(insLineWidth);
        linebox.appendChild(lineColorLabel);
        lineColorLabel.appendChild(lineColor);
        linebox.appendChild(lbFillColorLabel);
        lbFillColorLabel.appendChild(lbFillColor);
        linebox.appendChild(insLineDMLabel);
        insLineDMLabel.appendChild(insLineDrawMode);
        insLineDrawMode.appendChild(insLineM1);
        insLineDrawMode.appendChild(insLineM2);
        linebox.appendChild(document.createElement('br'));
        linebox.appendChild(lineCapLabel);
        lineCapLabel.appendChild(insLineCap);
        insLineCap.appendChild(lineCapM1);
        insLineCap.appendChild(lineCapM2);
        linebox.appendChild(document.createElement('br'));
        linebox.appendChild(lbDontLabel);
        lbDontLabel.appendChild(lineboxDontClose);
        linebox.appendChild(lineMulLable);
        lineMulLable.appendChild(lineMultiple);
        linebox.appendChild(document.createElement('br'));
        linebox.appendChild(lineCancel);
        linebox.appendChild(insLine);
        document.body.appendChild(linebox);

        insLine.style.marginLeft = (linebox.getBoundingClientRect().width * 0.15) + 'px';
        insLine.style.marginBottom = '5px';
        insLine.style.marginTop = '5px';
        lineCancel.style.marginBottom = '5px';
        lineCancel.style.marginTop = '5px';
        lineCancel.style.marginLeft = ((linebox.getBoundingClientRect().width -
        (lineCancel.getBoundingClientRect().width + parseInt(insline.style.marginLeft, 10) + insLine.getBoundingClientRect().width)) / 2) + 'px';
        linebox.children[0].style.touchAction = 'none';

        boxes.push(linebox);
    }

    mTools[2].onclick = function () {
        if (typeof linebox == 'undefined') {
            lineBoxCreate();
            var lineboxCreated = true;
        }
        else {
            if (linebox.style.display == 'none') {
                linebox.style.display = 'block';
                var lineboxShowed = true;
            }
        }

        if (typeof lineboxCreated != 'undefined' || typeof lineboxShowed != 'undefined') {
            var lbPath = [];

            showBox(linebox);
    
            insLineFirstRun = true;
    
            if (point1X.disabled == true) {
                point1X.disabled = false;
                point1Y.disabled = false;
            }

            function lbParametersInteraction (evt) {
                if (evt.target == insLineDrawMode) {
                    point1X.disabled = false;
                    point1Y.disabled = false;
                    insLineFirstRun = true;
    
                    if (insLineDrawMode.value == 'fill') {
                        lbFillColor.parentNode.style.visibility = 'visible';
                        lineMultiple.parentNode.style.visibility = 'hidden';
                        lineboxDontClose.previousSibling.textContent = "Don't Close on Insert and Activate \"Step by Step\" Mode ";
                        lineboxDontClose.parentNode.setAttribute('title', 'If checked, starting point for new line will' +
                        ' have same coordinates as last point from previous line. It works until user change mode or close this in-app window');
                        lineboxDontClose.checked = true;
                    }
                    else {
                        lineboxDontClose.parentNode.removeAttribute('title');
                        lineboxDontClose.checked = false;
                        lbFillColor.parentNode.style.visibility = 'hidden';
                        if (lbPath.length) {
                            lbPath.length = 0;
                        }
                    }
                }
    
                if (insLineDrawMode.value == 'line') {
                    lineMultiple.parentNode.style.visibility = 'visible';
                    lineboxDontClose.previousSibling.textContent = "Don't Close on Insert ";
    
                    if (lineboxDontClose.checked == false) {
                        lineMultiple.disabled = true;
                        lineMultiple.checked = false;
                    }
                    else {
                        lineMultiple.disabled = false;
                    }
    
                    if (lineMultiple.checked == false && point1X.disabled == true) {
                        point1X.disabled = false;
                        point1Y.disabled = false;
                    }
                }
            }
    
            insLineDrawMode.addEventListener('change', lbParametersInteraction, false);
            lineboxDontClose.addEventListener('change', lbParametersInteraction, false);
            lineMultiple.addEventListener('change', lbParametersInteraction, false);
    
            if (mouseSupport == true) {
                linebox.addEventListener('mousedown', mouseDownBox, false);
            }
    
            if (touchSupport == true) {
                linebox.addEventListener('pointerdown', pointerDownBox, false);
            }
        }

        lineCancel.onclick = function () {
            if (mouseSupport == true) {
                linebox.removeEventListener('mousedown', mouseDownBox, false);
            }
    
            if (touchSupport == true) {
                linebox.removeEventListener('pointerdown', pointerDownBox, false);
            }

            linebox.style.display = 'none';
            zBoxPriorityOnHide(linebox);
        }

        insLine.onclick = function (evt) {
            var p1x = parseInt(point1X.value, 10), p1y = parseInt(point1Y.value, 10), p2x = parseInt(point2X.value, 10),
            p2y = parseInt(point2Y.value, 10), lw = parseInt(insLineWidth.value, 10),
            box = evt.target.parentNode, boxName = box.boxName;

            if (p1x < 0 || p1y < 0 || p2x < 0 || p2y < 0 || lw < 1 || point1X.value == '' || point1Y.value == '' || point2X.value == '' ||
            point2Y.value == '' || insLineWidth.value == '') {
                errors[boxName]++;
                alert('Invalid value! Line cannot be inserted!');
            }
            else {
                function drawLine () {
                    var lbxError = false;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(p1x, p1y);

                    ctx.strokeStyle = lineColor.value + stAlphaHex;
                    ctx.lineWidth = insLineWidth.value;

                    if (insLineCap.value == 'rectangular') {
                        ctx.lineCap = 'square';
                    }
                    else {
                        ctx.lineCap = 'round';
                    }

                    ctx.lineTo(p2x, p2y);
                    ctx.stroke();


                    if (insLineDrawMode.value == 'fill' && lineboxDontClose.checked == false) {
                        // here all code, which reproduce all path2d specially for drawing line with fill mode
                        ctx.fillStyle = lbFillColor.value;

                        lbPath.push([p2x, p2y]);
                        ctx.beginPath();

                        lbPath.forEach(i => {
                            if (i == 0) {
                                ctx.moveTo(i[0], i[1]);
                            }
                            else {
                                ctx.lineTo(i[0], i[1]);
                            }
                        });

                        ctx.fill();
                    }
                    else if (insLineDrawMode.value == 'fill' && lineboxDontClose.checked == true ) {
                        // remembering all path for fill mode here, step by step
                        if (insLineFirstRun) {
                            lbPath.push([p1x, p1y], [p2x, p2y]);
                        }
                        else {
                            lbPath.push([p2x, p2y]);
                        }
                    }

                    if (insLineFirstRun) {
                        insLineFirstRun = false;
                    }

                    changeMaker();
                    ctx.restore();
                    
                    if (lineMultiple.checked == true || (insLineDrawMode.value == 'fill' && lineboxDontClose.checked == true)) {
                        point1X.value = point2X.value;
                        point1Y.value = point2Y.value;
                        point2X.value = '0';
                        point2Y.value = '0';

                        if (point1X.disabled == false) {
                            point1X.disabled = true;
                            point1Y.disabled = true;
                        }
                    }
                    else {
                        if (point1X.disabled == true) {
                            point1X.disabled = false;
                            point1Y.disabled = false;
                        }
                    }

                    ctx.closePath();

                    try {
                        ctx.getImageData(0, 0, 1, 1);
                    }
                    catch (err) {
                        errors[boxName]++;
                        lbxError = true;
                        canvas.width = curSettings.canvasWidth;
                        canvas.height = curSettings.canvasHeight;
                        cnvContainer.style.width = curSettings.canvasWidth + 'px';
                        cnvContainer.style.height = curSettings.canvasHeight + 'px';
                        point1X.disabled = false;
                        point1Y.disabled = false;
                        point2X.disabled = false;
                        point2Y.disabled = false;
                        point1X.value = '0';
                        point1Y.value = '0';
                        point2X.value = '0';
                        point2Y.value = '0';
                        lineboxDontClose.checked = false;
                        lineMultiple.checked = false;
                        lbPath.length = 0;

                        ctx.drawImage(img, 0, 0);

                        alert('Error! Cannot insert line. Possible causes:\n- Line coordinates exceed limitations;\n- Line width is too big.');
                    }

                    if (!lbxError) {
                        curSettings.canvasWidth = canvas.width;
                        curSettings.canvasHeight = canvas.height;
                        
                    }

                    cnvLoaded[boxName] = true;
                }

                if (p1x > canvas.width || p1y > canvas.height || p2x > canvas.width || p2y > canvas.height) {
                    function ctxSaveLineBox () {
                        img.onload = function () {
                            ctx.fillStyle = '#ffffffff';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            ctx.drawImage(img, 0, 0);
                            drawLine();

                            ctx.lineCap = 'round';
                            ctx.lineJoin = 'round';
                            ctx.lineWidth = curSettings['lineWidth'];
                            ctx.strokeStyle = curSettings['strokeColor'];
                            ctx.fillStyle = curSettings['fillColor'];
                            ctx.font = font;
                        }

                    }

                    var maxX = Math.max(p1x, p2x), maxY = Math.max(p1y, p2y);

                    img.src = canvas.toDataURL();
                    
                    if (maxX > canvas.width) {
                        canvas.width = maxX;
                        cnvContainer.style.width = maxX + 'px';
                    }
                    if (maxY > canvas.height) {
                        canvas.height = maxY;
                        cnvContainer.style.height = maxY + 'px';
                    }

                    ctxSaveLineBox();
                }
                else {
                    drawLine();
                    img.src = canvas.toDataURL();
                }

                if (!lineboxDontClose.checked) {
                    cnvLoadTimer[boxName] = window.setInterval(function () {closeBox(box);}, 50);
                }
                else {
                    errors[boxName] = 0;
                    cnvLoaded[boxName] = false;
                }
            }
        }

        hideMenu(mTools, 5);
    }

    function shapeBoxCreate () {
        shapebox = document.createElement('div');
        shapebox.boxName = 'shapebox';
        shapebox.id = 'shape_box';
        shapebox.style.position = 'absolute';
        shapebox.style.boxSizing = 'border-box';
        shapebox.style.backgroundColor = 'pink';
        shapebox.style.border = '1px solid red';
        shapebox.style.width = '450px';

        createMovePanel(shapebox);

        var shapeSelectorLabel = document.createElement('label'),
        shapeFSet = document.createElement('fieldset'),
        shapeLeg = document.createElement('legend'),
        sbPoint1XL = document.createElement('label'),
        sbPoint1YL = document.createElement('label'),
        sbPoint2XL = document.createElement('label'),
        sbPoint2YL = document.createElement('label'),
        sbPoint3XL = document.createElement('label'),
        sbPoint3YL = document.createElement('label'),
        sbPoint4XL = document.createElement('label'),
        sbPoint4YL = document.createElement('label'),
        sbLWidthLabel = document.createElement('label'),
        sbLColorLabel = document.createElement('label'),
        sbFColorLabel = document.createElement('label'),
        sbDMLabel = document.createElement('label'),
        sbEdgesL = document.createElement('label'),
        sbDontCloseLabel = document.createElement('label');

        sbPoint1X = document.createElement('input');
        sbPoint1Y = document.createElement('input');
        sbPoint2X = document.createElement('input');
        sbPoint2Y = document.createElement('input');
        sbPoint3X = document.createElement('input');
        sbPoint3Y = document.createElement('input');
        sbPoint4X = document.createElement('input');
        sbPoint4Y = document.createElement('input');
        sbLineWidth = document.createElement('input');
        sbLineColor = document.createElement('input');
        sbFillColor = document.createElement('input');
        sbDontClose = document.createElement('input');
        
        sbShapeSelector = document.createElement('select');
        sbShapeChoose = document.createElement('option');
        sbShapeQuadro = document.createElement('option');
        sbShapeTri = document.createElement('option');
        sbShapeCircle = document.createElement('option');
        sbShapeArrow = document.createElement('option');
        sbShapeCBracket = document.createElement('option');

        sbDrawMode = document.createElement('select');
        sbLineOnly = document.createElement('option');
        sbFillOnly = document.createElement('option');
        sbLineFill = document.createElement('option');

        sbEdges = document.createElement('select');
        sbRounded = document.createElement('option');
        sbRectangular = document.createElement('option');

        sbCancel = document.createElement('button');
        sbInsert = document.createElement('button');

        shapeSelectorLabel.setAttribute('class', 'unselectable');
        shapeSelectorLabel.style.margin = '5px 0px 5px 15px';
        shapeSelectorLabel.style.display = 'inline-block';
        shapeSelectorLabel.textContent = 'Which Shape do You Want to Insert? ';
        sbShapeSelector.setAttribute('id', 'sbshapeselector');
        sbShapeChoose.setAttribute('selected', '');
        sbShapeChoose.setAttribute('value', 'choose')
        sbShapeChoose.textContent = 'Choose...';
        sbShapeQuadro.setAttribute('value', 'quadro');
        sbShapeQuadro.textContent = 'Quadrangle';
        sbShapeTri.setAttribute('value', 'triangle');
        sbShapeTri.textContent = 'Triangle';
        sbShapeCircle.setAttribute('value', 'circle');
        sbShapeCircle.textContent = 'Circle';
        sbShapeArrow.setAttribute('value', 'arrow');
        sbShapeArrow.textContent = 'Arrow';
        sbShapeCBracket.setAttribute('value', 'cbracket');
        sbShapeCBracket.textContent = 'Curly Bracket';

        shapeFSet.style.marginBottom = '5px';
        shapeFSet.style.display = 'none';
        shapeLeg.setAttribute('class', 'unselectable');
        sbPoint1XL.setAttribute('class', 'unselectable');
        sbPoint1XL.style.display = 'inline-block';
        sbPoint1XL.style.marginBottom = '5px';
        sbPoint1XL.style.marginLeft = '15px';
        sbPoint1XL.textContent = 'X1: ';
        sbPoint1X.setAttribute('id', 'sbpoint1x');
        sbPoint1X.setAttribute('type', 'number');
        sbPoint1X.setAttribute('min', '0');
        sbPoint1X.setAttribute('max', '9999999');
        sbPoint1X.addEventListener('input', evt => inControl(evt, 7), false);
        sbPoint1X.addEventListener('focus', inFocusControl, false);
        sbPoint1X.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbPoint1X.style.width = '60px';
        sbPoint1X.value = 0;
        sbPoint1YL.setAttribute('class', 'unselectable');
        sbPoint1YL.style.display = 'inline-block';
        sbPoint1YL.style.marginBottom = '5px';
        sbPoint1YL.style.marginLeft = '15px';
        sbPoint1YL.textContent = 'Y1: ';
        sbPoint1Y.setAttribute('id', 'sbpoint1y');
        sbPoint1Y.setAttribute('type', 'number');
        sbPoint1Y.setAttribute('min', '0');
        sbPoint1Y.setAttribute('max', '9999999');
        sbPoint1Y.addEventListener('input', evt => inControl(evt, 7), false);
        sbPoint1Y.addEventListener('focus', inFocusControl, false);
        sbPoint1Y.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbPoint1Y.style.width = '60px';
        sbPoint1Y.value = 0;
        sbPoint2XL.setAttribute('class', 'unselectable');
        sbPoint2XL.style.display = 'inline-block';
        sbPoint2XL.style.marginBottom = '5px';
        sbPoint2XL.style.marginLeft = '15px';
        sbPoint2XL.textContent = 'X2: ';
        sbPoint2X.setAttribute('id', 'sbpoint2x');
        sbPoint2X.setAttribute('type', 'number');
        sbPoint2X.setAttribute('min', '0');
        sbPoint2X.setAttribute('max', '9999999');
        sbPoint2X.addEventListener('input', evt => inControl(evt, 7), false);
        sbPoint2X.addEventListener('focus', inFocusControl, false);
        sbPoint2X.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbPoint2X.style.width = '60px';
        sbPoint2X.value = 0;
        sbPoint2YL.setAttribute('class', 'unselectable');
        sbPoint2YL.style.display = 'inline-block';
        sbPoint2YL.style.marginBottom = '5px';
        sbPoint2YL.style.marginLeft = '15px';
        sbPoint2YL.textContent = 'Y2: ';
        sbPoint2Y.setAttribute('id', 'sbpoint2y');
        sbPoint2Y.setAttribute('type', 'number');
        sbPoint2Y.setAttribute('min', '0');
        sbPoint2Y.setAttribute('max', '9999999');
        sbPoint2Y.addEventListener('input', evt => inControl(evt, 7), false);
        sbPoint2Y.addEventListener('focus', inFocusControl, false);
        sbPoint2Y.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbPoint2Y.style.width = '60px';
        sbPoint2Y.value = 0;
        sbPoint3XL.setAttribute('class', 'unselectable');
        sbPoint3XL.style.display = 'inline-block';
        sbPoint3XL.style.marginBottom = '5px';
        sbPoint3XL.style.marginLeft = '15px';
        sbPoint3XL.textContent = 'X3: ';
        sbPoint3X.setAttribute('id', 'sbpoint3x');
        sbPoint3X.setAttribute('type', 'number');
        sbPoint3X.setAttribute('min', '0');
        sbPoint3X.setAttribute('max', '9999999');
        sbPoint3X.addEventListener('input', evt => inControl(evt, 7), false);
        sbPoint3X.addEventListener('focus', inFocusControl, false);
        sbPoint3X.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbPoint3X.style.width = '60px';
        sbPoint3X.value = 0;
        sbPoint3YL.setAttribute('class', 'unselectable');
        sbPoint3YL.style.display = 'inline-block';
        sbPoint3YL.style.marginBottom = '5px';
        sbPoint3YL.style.marginLeft = '15px';
        sbPoint3YL.textContent = 'Y3: ';
        sbPoint3Y.setAttribute('id', 'sbpoint3y');
        sbPoint3Y.setAttribute('type', 'number');
        sbPoint3Y.setAttribute('min', '0');
        sbPoint3Y.setAttribute('max', '9999999');
        sbPoint3Y.addEventListener('input', evt => inControl(evt, 7), false);
        sbPoint3Y.addEventListener('focus', inFocusControl, false);
        sbPoint3Y.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbPoint3Y.style.width = '60px';
        sbPoint3Y.value = 0;
        sbPoint4XL.setAttribute('class', 'unselectable');
        sbPoint4XL.style.display = 'inline-block';
        sbPoint4XL.style.marginLeft = '15px';
        sbPoint4XL.textContent = 'X4: ';
        sbPoint4X.setAttribute('id', 'sbpoint4x');
        sbPoint4X.setAttribute('type', 'number');
        sbPoint4X.setAttribute('min', '0');
        sbPoint4X.setAttribute('max', '9999999');
        sbPoint4X.addEventListener('input', evt => inControl(evt, 7), false);
        sbPoint4X.addEventListener('focus', inFocusControl, false);
        sbPoint4X.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbPoint4X.style.width = '60px';
        sbPoint4X.value = 0;
        sbPoint4YL.setAttribute('class', 'unselectable');
        sbPoint4YL.style.display = 'inline-block';
        sbPoint4YL.style.marginLeft = '15px';
        sbPoint4YL.textContent = 'Y4: ';
        sbPoint4Y.setAttribute('id', 'sbpoint4y');
        sbPoint4Y.setAttribute('type', 'number');
        sbPoint4Y.setAttribute('min', '0');
        sbPoint4Y.setAttribute('max', '9999999');
        sbPoint4Y.addEventListener('input', evt => inControl(evt, 7), false);
        sbPoint4Y.addEventListener('focus', inFocusControl, false);
        sbPoint4Y.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbPoint4Y.style.width = '60px';
        sbPoint4Y.value = 0;

        sbLWidthLabel.setAttribute('class', 'unselectable');
        sbLWidthLabel.style.marginBottom = '5px';
        sbLWidthLabel.style.marginLeft = '15px';
        sbLWidthLabel.style.display = 'none';
        sbLWidthLabel.textContent = 'Line Width: ';
        sbLineWidth.setAttribute('id', 'sblinewidth');
        sbLineWidth.setAttribute('type', 'number');
        sbLineWidth.setAttribute('min', '0');
        sbLineWidth.setAttribute('max', '99999');
        sbLineWidth.addEventListener('input', evt => inControl(evt, 5), false);
        sbLineWidth.addEventListener('focus', inFocusControl, false);
        sbLineWidth.addEventListener('paste', evt => {evt.preventDefault();}, false);
        sbLineWidth.style.width = '50px';
        sbLineWidth.value = 1;

        sbLColorLabel.setAttribute('class', 'unselectable');
        sbLColorLabel.style.marginBottom = '5px';
        sbLColorLabel.style.marginLeft = '15px';
        sbLColorLabel.style.display = 'none';
        sbLColorLabel.textContent = 'Line Color: ';
        sbLineColor.setAttribute('id', 'sblinecolor');
        sbLineColor.setAttribute('type', 'color');
        sbFColorLabel.setAttribute('class', 'unselectable');
        sbFColorLabel.style.marginBottom = '5px';
        sbFColorLabel.style.marginLeft = '15px';
        sbFColorLabel.style.display = 'none';
        sbFColorLabel.textContent = 'Fill Color: ';
        sbFillColor.setAttribute('id', 'sbfillcolor');
        sbFillColor.setAttribute('type', 'color');

        sbDMLabel.setAttribute('class', 'unselectable');
        sbDMLabel.setAttribute('title', 'Draw only contour, only fill area without border or draw both filled area with border.');
        sbDMLabel.style.marginBottom = '5px';
        sbDMLabel.style.marginLeft = '15px';
        sbDMLabel.style.display = 'none';
        sbDMLabel.textContent = 'Draw Mode: ';
        sbDrawMode.setAttribute('id', 'sbdrawmode');
        sbLineOnly.setAttribute('selected', '');
        sbLineOnly.setAttribute('value', 'line');
        sbLineOnly.textContent = 'Line Only';
        sbFillOnly.setAttribute('value', 'fill');
        sbFillOnly.textContent = 'Fill Only';
        sbLineFill.setAttribute('value', 'linefill');
        sbLineFill.textContent = 'Line and Fill';

        sbEdgesL.setAttribute('class', 'unselectable');
        sbEdgesL.style.marginBottom = '5px';
        sbEdgesL.style.marginLeft = '15px';
        sbEdgesL.style.display = 'none';
        sbEdgesL.textContent = 'Edges: ';
        sbEdges.setAttribute('id', 'sbedges');
        sbEdges.style.width = '88px';
        sbRounded.setAttribute('selected', '');
        sbRounded.setAttribute('value', 'round');
        sbRounded.textContent = 'Rounded';
        sbRectangular.setAttribute('value', 'rectangle');
        sbRectangular.textContent = 'Rectangular';

        sbDontCloseLabel.setAttribute('class', 'unselectable');
        sbDontCloseLabel.style.marginBottom = '5px';
        sbDontCloseLabel.style.marginLeft = '15px';
        sbDontCloseLabel.style.display = 'none';
        sbDontCloseLabel.textContent = 'Don\'t Close on Insert ';
        sbDontClose.setAttribute('id', 'sbdontclose');
        sbDontClose.setAttribute('type', 'checkbox');

        sbCancel.setAttribute('class', 'apply');
        sbCancel.setAttribute('id', 'sbcancel');
        sbCancel.textContent = 'Cancel';
        sbInsert.setAttribute('class', 'apply');
        sbInsert.setAttribute('id', 'sbinsert');
        sbInsert.textContent = 'Insert';

        shapebox.appendChild(shapeSelectorLabel);
        shapeSelectorLabel.appendChild(sbShapeSelector);
        sbShapeSelector.appendChild(sbShapeChoose);
        sbShapeSelector.appendChild(sbShapeQuadro);
        sbShapeSelector.appendChild(sbShapeTri);
        sbShapeSelector.appendChild(sbShapeCircle);
        sbShapeSelector.appendChild(sbShapeArrow);
        sbShapeSelector.appendChild(sbShapeCBracket);
        shapebox.appendChild(shapeFSet);
        shapeFSet.appendChild(shapeLeg);
        shapeFSet.appendChild(sbPoint1XL);
        sbPoint1XL.appendChild(sbPoint1X);
        shapeFSet.appendChild(sbPoint1YL);
        sbPoint1YL.appendChild(sbPoint1Y);
        shapeFSet.appendChild(sbPoint2XL);
        sbPoint2XL.appendChild(sbPoint2X);
        shapeFSet.appendChild(sbPoint2YL);
        sbPoint2YL.appendChild(sbPoint2Y);
        shapeFSet.appendChild(sbPoint3XL);
        sbPoint3XL.appendChild(sbPoint3X);
        shapeFSet.appendChild(sbPoint3YL);
        sbPoint3YL.appendChild(sbPoint3Y);
        shapeFSet.appendChild(sbPoint4XL);
        sbPoint4XL.appendChild(sbPoint4X);
        shapeFSet.appendChild(sbPoint4YL);
        sbPoint4YL.appendChild(sbPoint4Y);
        shapebox.appendChild(sbLWidthLabel);
        sbLWidthLabel.appendChild(sbLineWidth);
        shapebox.appendChild(sbLColorLabel);
        sbLColorLabel.appendChild(sbLineColor);
        shapebox.appendChild(sbFColorLabel);
        sbFColorLabel.appendChild(sbFillColor);
        shapebox.appendChild(sbDMLabel);
        sbDMLabel.appendChild(sbDrawMode)
        sbDrawMode.appendChild(sbLineOnly);
        sbDrawMode.appendChild(sbFillOnly);
        sbDrawMode.appendChild(sbLineFill);
        shapebox.appendChild(sbEdgesL);
        sbEdgesL.appendChild(sbEdges);
        sbEdges.appendChild(sbRounded);
        sbEdges.appendChild(sbRectangular);
        shapebox.appendChild(sbDontCloseLabel);
        sbDontCloseLabel.appendChild(sbDontClose);
        shapebox.appendChild(document.createElement('br'));
        shapebox.appendChild(sbCancel);
        shapebox.appendChild(sbInsert);
        document.body.appendChild(shapebox);

        sbInsert.style.marginLeft = (shapebox.getBoundingClientRect().width * 0.15) + 'px';
        sbInsert.style.marginBottom = '5px';
        sbCancel.style.marginLeft = ((shapebox.getBoundingClientRect().width -
        (sbCancel.getBoundingClientRect().width + parseInt(sbInsert.style.marginLeft, 10) + sbInsert.getBoundingClientRect().width)) / 2) + 'px';
        shapebox.children[0].style.touchAction = 'none';

        boxes.push(shapebox);
    }

    mTools[3].onclick = function () {
        if (typeof shapebox == 'undefined') {
            shapeBoxCreate();
        }
        else {
            shapebox.style.display = 'block';
        }

        showBox(shapebox);

        if (mouseSupport == true) {
            shapebox.addEventListener('mousedown', mouseDownBox, false);
        }

        if (touchSupport == true) {
            shapebox.addEventListener('pointerdown', pointerDownBox, false);
        }

        function showSBaseParameters() {
            sbPoint1X.parentNode.parentNode.style.display = 'block';
            sbLineWidth.parentNode.style.display = 'inline-block';
            sbLineColor.parentNode.style.display = 'inline-block';
            
            if (sbShapeSelector.value == 'arrow' || sbShapeSelector.value == 'cbracket') {
                sbFillColor.parentNode.style.display = 'none';
                sbDrawMode.parentNode.style.display = 'none';
                sbDrawMode.value = 'line';
                sbEdges.parentNode.style.display = 'none';
            }
            else {
                if (sbShapeSelector.value == 'quadro' || sbShapeSelector.value == 'triangle') {
                    sbEdges.parentNode.style.display = 'inline-block';
                }
                else {
                    sbEdges.parentNode.style.display = 'none';
                }

                sbFillColor.parentNode.style.display = 'inline-block';
                sbDrawMode.parentNode.style.display = 'inline-block';
            }
            
            sbDontClose.parentNode.style.display = 'inline-block';
        }

        sbShapeSelector.onchange = function () {
            switch(sbShapeSelector.value) {
                case 'choose':
                    sbPoint1X.parentNode.parentNode.style.display = 'none';
                    sbLineWidth.parentNode.style.display = 'none';
                    sbLineColor.parentNode.style.display = 'none';
                    sbFillColor.parentNode.style.display = 'none';
                    sbDrawMode.parentNode.style.display = 'none';
                    sbEdges.parentNode.style.display = 'none';
                    sbDontClose.parentNode.style.display = 'none';
                break;
                case 'quadro':
                    showSBaseParameters();

                    sbPoint1X.parentNode.previousSibling.textContent = 'Coordinates of 4 Points';

                    if (sbPoint2X.previousSibling.textContent == 'Radius: ') {
                        sbPoint2X.previousSibling.textContent = 'X2: ';
                    }

                    sbPoint1X.parentNode.style.display = 'inline-block';
                    sbPoint1Y.parentNode.style.display = 'inline-block';
                    sbPoint2X.parentNode.style.display = 'inline-block';
                    sbPoint2Y.parentNode.style.display = 'inline-block';
                    sbPoint3X.parentNode.style.display = 'inline-block';
                    sbPoint3Y.parentNode.style.display = 'inline-block';
                    sbPoint4X.parentNode.style.display = 'inline-block';
                    sbPoint4Y.parentNode.style.display = 'inline-block';
                break;
                case 'triangle':
                    showSBaseParameters();

                    sbPoint1X.parentNode.previousSibling.textContent = 'Coordinates of 3 Points';

                    if (sbPoint2X.previousSibling.textContent == 'Radius: ') {
                        sbPoint2X.previousSibling.textContent = 'X2: ';
                    }

                    sbPoint1X.parentNode.style.display = 'inline-block';
                    sbPoint1Y.parentNode.style.display = 'inline-block';
                    sbPoint2X.parentNode.style.display = 'inline-block';
                    sbPoint2Y.parentNode.style.display = 'inline-block';
                    sbPoint3X.parentNode.style.display = 'inline-block';
                    sbPoint3Y.parentNode.style.display = 'inline-block';
                    sbPoint4X.parentNode.style.display = 'none';
                    sbPoint4Y.parentNode.style.display = 'none';

                    sbPoint4X.value = 0;
                    sbPoint4Y.value = 0;
                break;
                case 'circle':
                    showSBaseParameters();

                    sbPoint1X.parentNode.previousSibling.textContent = 'Center of Circle and Radius';

                    sbPoint2X.previousSibling.textContent = 'Radius: ';

                    sbPoint1X.parentNode.style.display = 'inline-block';
                    sbPoint1Y.parentNode.style.display = 'inline-block';
                    sbPoint2X.parentNode.style.display = 'inline-block';
                    sbPoint2Y.parentNode.style.display = 'none';
                    sbPoint3X.parentNode.style.display = 'none';
                    sbPoint3Y.parentNode.style.display = 'none';
                    sbPoint4X.parentNode.style.display = 'none';
                    sbPoint4Y.parentNode.style.display = 'none';

                    sbPoint2Y.value = 0;
                    sbPoint3X.value = 0;
                    sbPoint3Y.value = 0;
                    sbPoint4X.value = 0;
                    sbPoint4Y.value = 0;
                break;
                case 'arrow':
                case 'cbracket':
                    showSBaseParameters();

                    sbPoint1X.parentNode.previousSibling.textContent = 'Start Point and End Point';

                    if (sbPoint2X.previousSibling.textContent == 'Radius: ') {
                        sbPoint2X.previousSibling.textContent = 'X2: ';
                    }

                    sbPoint1X.parentNode.style.display = 'inline-block';
                    sbPoint1Y.parentNode.style.display = 'inline-block';
                    sbPoint2X.parentNode.style.display = 'inline-block';
                    sbPoint2Y.parentNode.style.display = 'inline-block';
                    sbPoint3X.parentNode.style.display = 'none';
                    sbPoint3Y.parentNode.style.display = 'none';
                    sbPoint4X.parentNode.style.display = 'none';
                    sbPoint4Y.parentNode.style.display = 'none';

                    sbPoint3X.value = 0;
                    sbPoint3Y.value = 0;
                    sbPoint4X.value = 0;
                    sbPoint4Y.value = 0;
                break;
                default:
                    console.log('Error! Invalid value for switch(sbShapeSelector, onchange event)!');
            }
        }

        sbCancel.onclick = function () {
            if (mouseSupport == true) {
                shapebox.removeEventListener('mousedown', mouseDownBox, false);
            }
    
            if (touchSupport == true) {
                shapebox.removeEventListener('pointerdown', pointerDownBox, false);
            }

            shapebox.style.display = 'none';

            zBoxPriorityOnHide(shapebox);
        }

        sbInsert.onclick = function (evt) {
            var box = evt.target.parentNode, boxName = box.boxName;

            function drawArrow () {
                var ctxModEPX = p2x - p1x,
                ctxModEPY = p2y - p1y;
                ctx.translate(p1x, p1y);
                var angle = Math.atan2(ctxModEPY, ctxModEPX);
                ctx.moveTo(0, 0);
                ctx.lineTo(ctxModEPX, ctxModEPY);
                ctx.translate(ctxModEPX, ctxModEPY);
                ctx.rotate(angle);
                ctx.moveTo(-1, 1);
                ctx.lineTo(-15, 8);
                ctx.moveTo(-1, -1);
                ctx.lineTo(-15, -8);
            }

            function drawCurlyBracket () {
                var length = Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2)),
                ctxModEPX = p2x - p1x,
                ctxModEPY = p2y - p1y,
                angle = Math.atan2(ctxModEPY, ctxModEPX),
                radius = 10;
                
                
                ctx.translate(p1x, p1y); // assign start of coordinate grid to start point, where we start to draw bracket.
                // Also line above useful for line below. So we made down left side of brace rotation point.
                ctx.rotate(angle);
                // rest of code below - calculations, which actually draw brace.
                ctx.moveTo(0, 0);

                var lineY = -radius, midX = ((length) / 2) - 3;

                ctx.arcTo(0, lineY, radius, lineY, radius);
                ctx.lineTo(midX, lineY);
                ctx.lineTo(midX + 3, lineY - 5);
                ctx.lineTo(midX + 6, lineY);
                ctx.arcTo(length, lineY, length, p2y, radius);
            }

            function drawShape () {
                var shapeboxError = false;

                ctx.beginPath();
                ctx.save();

                ctx.lineWidth = sbLineWidth.value;
                ctx.strokeStyle = sbLineColor.value + stAlphaHex;
                ctx.fillStyle = sbFillColor.value + fAlphaHex;

                function sbEdgeStyle () {
                    if (sbEdges.value == 'round') {
                        ctx.lineJoin = 'round';
                    }
                    else {
                        ctx.lineJoin = 'miter';
                        ctx.lineCap = 'square';
                    }
                }

                switch(sbShapeSelector.value) {
                    case 'quadro':
                        sbEdgeStyle();
                        ctx.moveTo(p1x, p1y);
                        ctx.lineTo(p2x, p2y);
                        ctx.lineTo(p3x, p3y);
                        ctx.lineTo(p4x, p4y);
                        ctx.lineTo(p1x, p1y);
                    break;
                    case 'triangle':
                        sbEdgeStyle();
                        ctx.moveTo(p1x, p1y);
                        ctx.lineTo(p2x, p2y);
                        ctx.lineTo(p3x, p3y);
                        ctx.lineTo(p1x, p1y);
                    break;
                    case 'circle':
                        ctx.arc(p1x, p1y, p2x, 0, 2 * Math.PI);
                    break;
                    case 'arrow':
                        drawArrow();
                    break;
                    case 'cbracket':
                        drawCurlyBracket();
                    break;
                    default:
                        console.log('Error! Invalid argument for switch(sbShapeSelector) in function drawShape()');
                }

                if (sbDrawMode.value == 'line') {
                    ctx.stroke();
                }
                else if (sbDrawMode.value == 'fill') {
                    ctx.fill();
                }
                else {
                    ctx.fill();
                    ctx.stroke();
                }

                changeMaker();
                ctx.restore();
                ctx.closePath();

                try {
                    ctx.getImageData(0, 0 , 1, 1);
                }
                catch (err) {
                    errors[boxName]++;
                    shapeboxError = true;
                    canvas.width = curSettings.canvasWidth;
                    canvas.height = curSettings.canvasHeight;
                    cnvContainer.style.width = curSettings.canvasWidth + 'px';
                    cnvContainer.style.height = curSettings.canvasHeight + 'px';
                    sbLineWidth.value = '1';
                    sbDontClose.checked = false;

                    switch (sbShapeSelector.value) {
                        case 'quadro':
                            sbPoint1X.value = '0';
                            sbPoint1Y.value = '0';
                            sbPoint2X.value = '0';
                            sbPoint2Y.value = '0';
                            sbPoint3X.value = '0';
                            sbPoint3Y.value = '0';
                            sbPoint4X.value = '0';
                            sbPoint4Y.value = '0';
                        break;
                        case 'triangle':
                            sbPoint1X.value = '0';
                            sbPoint1Y.value = '0';
                            sbPoint2X.value = '0';
                            sbPoint2Y.value = '0';
                            sbPoint3X.value = '0';
                            sbPoint3Y.value = '0';
                        break;
                        case 'circle':
                            sbPoint1X.value = '0';
                            sbPoint1Y.value = '0';
                            sbPoint2X.value = '0';
                        break;
                        case 'arrow': case 'cbracket':
                            sbPoint1X.value = '0';
                            sbPoint1Y.value = '0';
                            sbPoint2X.value = '0';
                            sbPoint2Y.value = '0';
                        break;
                        default:
                            console.log('Error! Invalid value in switch for error catch in function drawShape!');
                    }

                    ctx.drawImage(img, 0, 0);
                    alert('Error! Cannot insert shape. Possible causes:\n- Shape coordinates exceed limitations;\n - Line width is too big.');
                }

                if (!shapeboxError) {
                    curSettings.canvasWidth = canvas.width;
                    curSettings.canvasHeight = canvas.height;
                }

                cnvLoaded[boxName] = true;
            }

            function ctxSaveShapeBox () {
                img.onload = function () {
                    ctx.fillStyle = '#ffffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.drawImage(img, 0, 0);
                    drawShape();

                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.lineWidth = curSettings['lineWidth'];
                    ctx.strokeStyle = curSettings['strokeColor'];
                    ctx.fillStyle = curSettings['fillColor'];
                    ctx.font = font;
                }
            }

            function sbInitCheck() {
                if (maxX > canvas.width || maxY > canvas.height) {
                    img.src = canvas.toDataURL();

                    if (maxX > canvas.width) {
                        canvas.width = maxX;
                        cnvContainer.style.width = maxX + 'px';
                    }
                    if (maxY > canvas.height) {
                        canvas.height = maxY;
                        cnvContainer.style.width = maxY + 'px';
                    }

                    ctxSaveShapeBox();
                }
                else {
                    drawShape();
                }
            }

            switch(sbShapeSelector.value) {
                case 'choose':
                    alert('Please, Choose One Shape to Insert!');
                break;
                case 'quadro':
                    var p1x = parseInt(sbPoint1X.value, 10), p1y = parseInt(sbPoint1Y.value, 10), p2x = parseInt(sbPoint2X.value, 10),
                    p2y = parseInt(sbPoint2Y.value, 10), p3x = parseInt(sbPoint3X.value, 10), p3y = parseInt(sbPoint3Y.value, 10),
                    p4x = parseInt(sbPoint4X.value, 10), p4y = parseInt(sbPoint4Y.value, 10), lw = parseInt(sbLineWidth.value, 10);

                    if (p1x < 0 || p1y < 0 || p2x < 0 || p2y < 0 || p3x < 0 || p3y < 0 || p4x < 0 || p4y < 0 || lw < 1 ||
                        sbPoint1X.value == '' || sbPoint1Y.value == '' || sbPoint2X.value == '' || sbPoint2Y.value == '' ||
                        sbPoint3X.value == '' || sbPoint3Y.value == '' || sbPoint4X.value == '' || sbPoint4Y.value == '' ||
                        sbLineWidth.value == '') {
                        errors[boxName]++;
                        alert('Invalid value! Quadrangle cannot be inserted!');
                    }
                    else {
                        var maxX = Math.max(p1x, p2x, p3x, p4x), maxY = Math.max(p1y, p2y, p3y, p4y);
                        
                        sbInitCheck();
                    }
                break;
                case 'triangle':
                    var p1x = parseInt(sbPoint1X.value, 10), p1y = parseInt(sbPoint1Y.value, 10), p2x = parseInt(sbPoint2X.value, 10),
                    p2y = parseInt(sbPoint2Y.value, 10), p3x = parseInt(sbPoint3X.value, 10), p3y = parseInt(sbPoint3Y.value, 10),
                    lw = parseInt(sbLineWidth.value, 10);

                    if (p1x < 0 || p1y < 0 || p2x < 0 || p2y < 0 || p3x < 0 || p3y < 0 || lw < 1 ||
                        sbPoint1X.value == '' || sbPoint1Y.value == '' || sbPoint2X.value == '' || sbPoint2Y.value == '' ||
                        sbPoint3X.value == '' || sbPoint3Y.value == '' || sbLineWidth.value == '') {
                        errors[boxName]++;
                        alert('Invalid value! Triangle cannot be inserted!');
                    }
                    else {
                        var maxX = Math.max(p1x, p2x, p3x), maxY = Math.max(p1y, p2y, p3y);
                        
                        sbInitCheck();
                    }
                break;
                case 'circle':
                    var p1x = parseInt(sbPoint1X.value, 10), p1y = parseInt(sbPoint1Y.value, 10), p2x = parseInt(sbPoint2X.value, 10),
                    lw = parseInt(sbLineWidth.value, 10);

                    if (p1x < 0 || p1y < 0 || p2x < 0 || lw < 1 ||
                        sbPoint1X.value == '' || sbPoint1Y.value == '' || sbPoint2X.value == '') {
                        errors[boxName]++;
                        alert('Invalid value! Circle cannot be inserted!');
                    }
                    else {
                        var maxX = p1x, maxY = p1y;
                        
                        sbInitCheck();
                    }
                break;
                case 'arrow':
                    var p1x = parseInt(sbPoint1X.value, 10), p1y = parseInt(sbPoint1Y.value, 10), p2x = parseInt(sbPoint2X.value, 10),
                    p2y = parseInt(sbPoint2Y.value, 10), lw = parseInt(sbLineWidth, 10);

                    if (p1x < 0 || p1y < 0 || p2x < 0 || p2y < 0 || lw < 1 ||
                        sbPoint1X.value == '' || sbPoint1Y.value == '' || sbPoint2X.value == '' || sbPoint2Y.value == '' ||
                        sbLineWidth.value == '') {
                        errors[boxName]++;
                        alert('Invalid value! Arrow cannot be inserted!');
                    }
                    else {
                        var maxX = Math.max(p1x, p2x), maxY = Math.max(p1y, p2y);
                        
                        sbInitCheck();
                    }
                break;
                case 'cbracket':
                    var p1x = parseInt(sbPoint1X.value, 10), p1y = parseInt(sbPoint1Y.value, 10), p2x = parseInt(sbPoint2X.value, 10),
                    p2y = parseInt(sbPoint2Y.value, 10), lw = parseInt(sbLineWidth, 10);

                    if (p1x < 0 || p1y < 0 || p2x < 0 || p2y < 0 || lw < 1 ||
                        sbPoint1X.value == '' || sbPoint1Y.value == '' || sbPoint2X.value == '' || sbPoint2Y.value == '' ||
                        sbLineWidth.value == '') {
                        errors[boxName]++;
                        alert('Invalid value! Curly bracket cannot be inserted!');
                    }
                    else {
                        var maxX = Math.max(p1x, p2x), maxY = Math.max(p1y, p2y);
                        
                        sbInitCheck();
                    }
                break;
                default:
                    console.log('Error! Invalid value for switch(sbShapeSelector, event onclick for button Insert)!');
            }

            if (sbDontClose.checked == false && (sbShapeSelector.value != 'choose')) {
                cnvLoadTimer = window.setInterval(function () {closeBox(box);}, 50);
            }
            else {
                cnvLoaded[boxName] = false;
                errors[boxName] = 0;
            }
        }

        hideMenu(mTools, 5);
    }

    function rulerSetBoxCreate () {
        rulersetbox = document.createElement('div');
        rulersetbox.id = 'rulerset_box';
        rulersetbox.style.position = 'absolute';
        rulersetbox.style.boxSizing = 'border-box';
        rulersetbox.style.backgroundColor = 'pink';
        rulersetbox.style.border = '1px solid red';
        rulersetbox.style.width = '500px';

        createMovePanel(rulersetbox);

        var rbLengthLabel = document.createElement('label'),
        rbAngleLabel = document.createElement('label'),
        rbBgColorLabel = document.createElement('label'),
        rbScaleColorL = document.createElement('label'),
        rbTextColorL = document.createElement('label'),
        rbBorderColorL = document.createElement('label'),
        rbOpacityLabel = document.createElement('label'),
        rbCallMethodL = document.createElement('label'),
        rbDontCloseL = document.createElement('label');

        rbLength = document.createElement('input');
        rbAngle = document.createElement('input');
        rbBgColor = document.createElement('input');
        rbScaleColor = document.createElement('input');
        rbTextColor = document.createElement('input');
        rbBorderColor = document.createElement('input');
        rbOpacity = document.createElement('input');
        rbDontClose = document.createElement('input');

        rbCallMethod = document.createElement('select');
        rbCallRight = document.createElement('option');
        rbCallMiddle = document.createElement('option');

        rbCancel = document.createElement('button');
        rbHide = document.createElement('button');
        rbApply = document.createElement('button');

        rbLengthLabel.setAttribute('class', 'unselectable');
        rbLengthLabel.style.display = 'inline-block';
        rbLengthLabel.style.marginTop = '5px';
        rbLengthLabel.style.marginBottom =  '5px';
        rbLengthLabel.style.marginLeft = '15px';
        rbLengthLabel.textContent = 'Length (in pixels): ';
        rbLength.setAttribute('id', 'rblength');
        rbLength.setAttribute('type', 'number');
        rbLength.setAttribute('min', '100');
        rbLength.setAttribute('max', '32000');
        rbLength.setAttribute('step', '50');
        rbLength.addEventListener('input', evt => inControl(evt, 5), false);
        rbLength.addEventListener('focus', inFocusControl, false);
        rbLength.addEventListener('paste', evt => {evt.preventDefault();}, false);
        rbLength.style.width = '60px';
        rbLength.value = 300;

        rbAngleLabel.setAttribute('class', 'unselectable');
        rbAngleLabel.setAttribute('title', 'Rotate ruler clockwise on selected angle');
        rbAngleLabel.style.display = 'inline-block';
        rbAngleLabel.style.marginTop = '5px';
        rbAngleLabel.style.marginBottom = '5px';
        rbAngleLabel.style.marginLeft = '15px';
        rbAngleLabel.textContent = 'Angle (in degrees): ';
        rbAngle.setAttribute('id', 'rbangle');
        rbAngle.setAttribute('type', 'number');
        rbAngle.setAttribute('min', '0');
        rbAngle.setAttribute('max', '360');
        rbAngle.addEventListener('input', evt => inControl(evt, 3), false);
        rbAngle.addEventListener('focus', inFocusControl, false);
        rbAngle.addEventListener('paste', evt => {evt.preventDefault();}, false);
        rbAngle.style.width = '45px';
        rbAngle.value = 0;

        rbBgColorLabel.setAttribute('class', 'unselectable');
        rbBgColorLabel.style.display = 'inline-block';
        rbBgColorLabel.style.marginBottom = '5px';
        rbBgColorLabel.style.marginLeft = '15px';
        rbBgColorLabel.textContent = 'Ruler Color: ';
        rbBgColor.setAttribute('id', 'rbbgcolor');
        rbBgColor.setAttribute('type', 'color');
        rbBgColor.value = '#dcdcdc';

        rbScaleColorL.setAttribute('class', 'unselectable');
        rbScaleColorL.style.display = 'inline-block';
        rbScaleColorL.style.marginBottom = '5px';
        rbScaleColorL.style.marginLeft = '15px';
        rbScaleColorL.textContent = 'Scale Color: ';
        rbScaleColor.setAttribute('id', 'rbscalecolor');
        rbScaleColor.setAttribute('type', 'color');

        rbTextColorL.setAttribute('class', 'unselectable');
        rbTextColorL.style.display = 'inline-block';
        rbTextColorL.style.marginBottom = '5px';
        rbTextColorL.style.marginLeft = '15px';
        rbTextColorL.textContent = 'Text Color: ';
        rbTextColor.setAttribute('id', 'rbtextcolor');
        rbTextColor.setAttribute('type', 'color');

        rbBorderColorL.setAttribute('class', 'unselectable');
        rbBorderColorL.style.display = 'inline-block';
        rbBorderColorL.style.marginBottom = '5px';
        rbBorderColorL.style.marginLeft = '15px';
        rbBorderColorL.textContent = 'Border Color: ';
        rbBorderColor.setAttribute('id', 'rbbordercolor');
        rbBorderColor.setAttribute('type', 'color');

        rbOpacityLabel.setAttribute('class', 'unselectable');
        rbOpacityLabel.style.display = 'inline-block';
        rbOpacityLabel.style.marginBottom = '5px';
        rbOpacityLabel.style.marginLeft = '15px';
        rbOpacityLabel.textContent = 'Opacity: ';
        rbOpacity.setAttribute('id', 'rbopacity');
        rbOpacityLabel.setAttribute('for', 'rbopacity');
        rbOpacity.setAttribute('type', 'range');
        rbOpacity.setAttribute('min', '0.1');
        rbOpacity.setAttribute('max', '1.0');
        rbOpacity.setAttribute('step', '0.05');
        rbOpacity.style.marginBottom = '-5px';
        rbOpacity.value = '0.7';

        rbCallMethodL.setAttribute('class', 'unselectable');
        rbCallMethodL.setAttribute('title', 'It is possible to call settings for ruler by clicking with right or middle mouse button on ruler. '+
        'Default call method: right mouse button. It can be changed here.');
        if (mouseSupport) {
            rbCallMethodL.style.display = 'inline-block';
        }
        else {
            rbCallMethodL.style.display = 'none';
        }
        rbCallMethodL.style.marginBottom = '5px';
        rbCallMethodL.style.marginLeft = '15px';
        rbCallMethodL.textContent = 'Call Method: ';
        rbCallMethod.setAttribute('id', 'rbcallmethod');
        rbCallRight.setAttribute('selected', '');
        rbCallRight.setAttribute('value', 'right');
        rbCallRight.textContent = 'Right Mouse Button';
        rbCallMiddle.setAttribute('value', 'middle');
        rbCallMiddle.textContent = 'Middle Mouse Button';
        
        rbDontCloseL.setAttribute('class', 'unselectable');
        rbDontCloseL.style.display = 'inline-block';
        rbDontCloseL.style.marginBottom = '5px';
        rbDontCloseL.style.marginLeft = '15px';
        rbDontCloseL.textContent = 'Don\'t Close On Apply ';
        rbDontClose.setAttribute('id', 'rbdontclose');
        rbDontClose.setAttribute('type', 'checkbox');

        rbCancel.setAttribute('class', 'apply');
        rbCancel.setAttribute('id', 'rbcancel');
        rbCancel.textContent = 'Cancel';
        rbHide.setAttribute('class', 'apply');
        rbHide.setAttribute('id', 'rbhide');
        rbHide.style.marginBottom = '5px';
        rbHide.style.marginLeft = '15px';
        rbHide.textContent = 'Hide';
        rbApply.setAttribute('class', 'apply');
        rbApply.setAttribute('id', 'rbapply');
        rbApply.style.marginBottom = '5px';
        rbApply.style.marginLeft = '15px';
        rbApply.textContent = 'Apply and Show Ruler';

        rulersetbox.appendChild(rbLengthLabel);
        rbLengthLabel.appendChild(rbLength);
        rulersetbox.appendChild(rbAngleLabel);
        rbAngleLabel.appendChild(rbAngle);
        rulersetbox.appendChild(rbBgColorLabel);
        rbBgColorLabel.appendChild(rbBgColor);
        rulersetbox.appendChild(rbScaleColorL);
        rbScaleColorL.appendChild(rbScaleColor);
        rulersetbox.appendChild(rbTextColorL);
        rbTextColorL.appendChild(rbTextColor);
        rulersetbox.appendChild(rbBorderColorL);
        rbBorderColorL.appendChild(rbBorderColor);
        rulersetbox.appendChild(rbOpacityLabel);
        rulersetbox.appendChild(rbOpacity);
        rulersetbox.appendChild(rbCallMethodL);
        rbCallMethodL.appendChild(rbCallMethod);
        rbCallMethod.appendChild(rbCallRight);
        rbCallMethod.appendChild(rbCallMiddle);
        rulersetbox.appendChild(rbDontCloseL);
        rbDontCloseL.appendChild(rbDontClose);
        rulersetbox.appendChild(document.createElement('br'));
        rulersetbox.appendChild(rbCancel);
        rulersetbox.appendChild(rbHide);
        rulersetbox.appendChild(rbApply);
        document.body.appendChild(rulersetbox);

        rbCancel.style.marginBottom = '5px';
        rbCancel.style.marginLeft = ((rulersetbox.getBoundingClientRect().width - (rbCancel.getBoundingClientRect().width +
        15 + rbHide.getBoundingClientRect().width + 15 + rbApply.getBoundingClientRect().width)) / 2) + 'px';
        rulersetbox.children[0].style.touchAction = 'none';

        boxes.push(rulersetbox);
    }

    mTools[4].onclick = function () {
        if (typeof rulersetbox == 'undefined') {
            rulerSetBoxCreate();
        }
        else {
            rulersetbox.style.display = 'block';
        }

        showBox(rulersetbox);

        if (mouseSupport == true) {
            rulersetbox.addEventListener('mousedown', mouseDownBox, false);
        }

        if (touchSupport == true) {
            rulersetbox.addEventListener('pointerdown', pointerDownBox, false);
        }

        rbCancel.onclick = function () {
            if (mouseSupport == true) {
                rulersetbox.removeEventListener('mousedown', mouseDownBox, false);
            }
    
            if (touchSupport == true) {
                rulersetbox.removeEventListener('pointerdown', pointerDownBox, false);
            }

            rulersetbox.style.display = 'none';

            zBoxPriorityOnHide(rulersetbox);
        }

        rbHide.onclick = function () {
            if (typeof rulerbox !== 'undefined') {
                if (rbActiveListener) {
                    if (mouseSupport == true) {
                        rulerbox.removeEventListener('mousedown', mouseDownBox, false);
                    }
    
                    if (touchSupport == true) {
                        rulerbox.removeEventListener('pointerdown', pointerDownBox, false);
                    }

                    rbActiveListener = !rbActiveListener;
                }

                rulerbox.style.display = 'none';
    
                zBoxPriorityOnHide(rulerbox);
            }
        }

        function rulerBoxCreate () {
            rulerbox = document.createElement('div');
            rulerbox.id = 'ruler_box';
            rulerbox.style.position = 'absolute';
            rulerbox.style.height = '50px';
            rbCnv = document.createElement('canvas');
            rbCnv.setAttribute('id', 'rbcnv');

            rulerbox.appendChild(rbCnv);
            document.body.appendChild(rulerbox);

            rulerbox.style.touchAction = 'none';

            rulerbox.addEventListener('contextmenu', evt => {evt.preventDefault();});
            boxes.push(rulerbox);
        }

        rbApply.onclick = function () {
            var rulerLength = parseInt(rbLength.value, 10), rulerAngle = parseInt(rbAngle.value, 10);

            if (rulerLength < 100 || rulerLength > 32000 || rulerAngle < 0 || rulerAngle > 360 || rbLength.value == "" || rbAngle.value == "") {
                alert('Invalid Value! Ruler Cannot be Displayed!');
            }
            else {
                var rbError = false;

                if (typeof rulerbox == 'undefined') {
                    rulerBoxCreate();
                }
                else {
                    rulerbox.style.display = 'block';
                }

                rbCtx = rbCnv.getContext('2d');

                if (!rbActiveListener) {
                    if (mouseSupport == true) {
                        rulerbox.addEventListener('mousedown', mouseDownBox, false);
                    }
    
                    if (touchSupport == true) {
                        rulerbox.addEventListener('pointerdown', pointerDownBox, false);
                    }

                    rbActiveListener = !rbActiveListener;
                }
    
                try {
                    rulerbox.style.border = '1px solid ' + rbBorderColor.value;
                    rulerbox.style.backgroundColor = rbBgColor.value;
                    rulerbox.style.width = rbLength.value + 'px';
                    rulerbox.style.left = (window.pageXOffset + (document.body.clientWidth / 2) - (rulerbox.offsetWidth / 2)) + 'px';
                    rulerbox.style.top = (window.pageYOffset + (window.innerHeight / 2) - (rulerbox.offsetHeight / 2)) + 'px';
                    rulerbox.style.opacity = rbOpacity.value;
                    rulerbox.style.boxSizing = 'border-box';
                    rulerbox.style.transform = 'rotate(' + rbAngle.value + 'deg)';
                    rbCnv.width = rbLength.value;
                    rbCnv.height = 50;
                    rbCtx.strokeStyle = rbScaleColor.value;
                
                    zBoxPriority(rulerbox);
        
                    rbCtx.lineWidth = 0.5;
                    rbCtx.fillStyle = rbTextColor.value;
                    var counter = 1;
        
                    for (var i = 10; i < rulerLength; i+=10) {
                        rbCtx.save();
                        rbCtx.beginPath();
                        rbCtx.moveTo(i, 0);
                        
                        if (counter == 5) {
                            rbCtx.lineWidth = 1;
                            counter = 0;
                            rbCtx.lineTo(i, 10);
                            rbCtx.fillText(i, i - 5, 20);
                        }
                        else {
                            rbCtx.lineTo(i, 5);
                        }
                        
        
                        rbCtx.stroke();
                        rbCtx.closePath();
                        rbCtx.restore();
                        counter++;
                    }
                }

                catch (err) {
                    rbError = true;

                    if (mouseSupport == true) {
                        rulerbox.removeEventListener('mousedown', mouseDownBox, false);
                    }
    
                    if (touchSupport == true) {
                        rulerbox.removeEventListener('pointerdown', pointerDownBox, false);
                    }

                    rbActiveListener = false;
                    rulerbox.style.display = 'none';
                    rbLength.value = '300';
                    rbAngle.value = '0';

                    zBoxPriorityOnHide(rulerbox);
                    alert ('Error! Ruler cannot be displayed! Try another value.');
                }
    
                if (rbDontClose.checked == false && !rbError) {
                    if (mouseSupport == true) {
                        rulersetbox.removeEventListener('mousedown', mouseDownBox, false);
                    }
            
                    if (touchSupport == true) {
                        rulersetbox.removeEventListener('pointerdown', pointerDownBox, false);
                    }
    
                    rulersetbox.style.display = 'none';
        
                    zBoxPriorityOnHide(rulersetbox);
                }
            }
        }
        
        hideMenu(mTools, 5);
    }
}

effects.onclick = function () {
    if (!created['effects']) {
        mEffects = createMenu('Effects');
        created['effects'] = visible['effects'] = true;
        mEffects[0].style.display = mEffects[1].style.display = mEffects[2].style.display = 'flex';
        miPosition(effects, mEffects);
        menuZIndex(true);
    }
    else if (created['effects'] && visible['effects']) {
        hideMenu(mEffects, 3);
    }
    else {
        mEffects[0].style.display = mEffects[1].style.display = mEffects[2].style.display = 'flex';
        visible['effects'] = true;

        menuZIndex(true);
        miPosition(effects, mEffects);
    }

    var menu_visit = [true, false, false, false];

    effects.onmouseleave = function (evt) {
        if(evt.clientY >= effects.getBoundingClientRect().bottom
        && evt.clientX > effects.getBoundingClientRect().left
        && evt.clientX < effects.getBoundingClientRect().right) {
            menu_visit[0] = false;
            menu_visit[1] = true;
        }
        else {
            hideMenu(mEffects, 3);
        }
    }

    mEffects[0].onmouseleave = function (evt) {
        if(evt.clientX > mEffects[0].getBoundingClientRect().left
        && evt.clientX < mEffects[0].getBoundingClientRect().right){
            if(evt.clientY <= mEffects[0].getBoundingClientRect().top){
                menu_visit[0] = true;
                menu_visit[1] = false;
            }
            else if (evt.clientY >= mEffects[0].getBoundingClientRect().bottom) {
                menu_visit[1] = false;
                menu_visit[2] = true;
            }
        }
        else {
            hideMenu(mEffects, 3);
        }
    }

    mEffects[1].onmouseleave = function (evt) {
        if(evt.clientX > mEffects[1].getBoundingClientRect().left
        && evt.clientX < mEffects[1].getBoundingClientRect().right){
            if(evt.clientY <= mEffects[1].getBoundingClientRect().top){
                menu_visit[1] = true;
                menu_visit[2] = false;
            }
            else if (evt.clientY >= mEffects[1].getBoundingClientRect().bottom) {
                menu_visit[2] = false;
                menu_visit[3] = true;
            }
        }
        else {
            hideMenu(mEffects, 3);
        }
    }

    mEffects[2].onmouseleave = function(evt) {
        if(evt.clientX > mEffects[2].getBoundingClientRect().left
        && evt.clientX < mEffects[2].getBoundingClientRect().right
        && evt.clientY <= mEffects[2].getBoundingClientRect().top){
            menu_visit[2] = true;
            menu_visit[3] = false;
        }
        else {
            hideMenu(mEffects, 3);
        }
    }

    // Invert Colors
    mEffects[0].onclick = function () {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
        data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
        ctx.putImageData(imageData, 0, 0);
        changeMaker();
        hideMenu(mEffects, 3);
    }

    // Grayscale
    mEffects[1].onclick = function () {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
        data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
        ctx.putImageData(imageData, 0, 0);
        changeMaker();
        hideMenu(mEffects, 3);
    }

    // Sepia
    mEffects[2].onclick = function () {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
        data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
    
            data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
            data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
            data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
        }
        ctx.putImageData(imageData, 0, 0);
        changeMaker();
        hideMenu(mEffects, 3);
    }
}

// if click on menu item 'Help'
help.onclick = function () {
    if (!created['help']) {
        mHelp = createMenu('Help');
        created['help'] = visible['help'] = true;
        mHelp[0].style.display = mHelp[1].style.display = 'flex';
        miPosition(help, mHelp);
        menuZIndex(true);
    }
    else if (created['help'] && visible['help']) {
        hideMenu(mHelp, 2);
    }
    else {
        mHelp[0].style.display = mHelp[1].style.display = 'flex';
        visible['help'] = true;

        menuZIndex(true);
        miPosition(help, mHelp);
    }

    var menu_visit = [true, false, false];

    help.onmouseleave = function (evt) {
        if(evt.clientY >= help.getBoundingClientRect().bottom
        && evt.clientX > help.getBoundingClientRect().left
        && evt.clientX < help.getBoundingClientRect().right) {
            menu_visit[0] = false;
            menu_visit[1] = true;
        }
        else {
            hideMenu(mHelp, 2);
        }
    }

    mHelp[0].onmouseleave = function (evt) {
        if(evt.clientX > mHelp[0].getBoundingClientRect().left
        && evt.clientX < mHelp[0].getBoundingClientRect().right){
            if(evt.clientY <= mHelp[0].getBoundingClientRect().top){
                menu_visit[0] = true;
                menu_visit[1] = false;
            }
            else if (evt.clientY >= mHelp[0].getBoundingClientRect().bottom) {
                menu_visit[1] = false;
                menu_visit[2] = true;
            }
        }
        else {
            hideMenu(mHelp, 2);
        }
    }

    mHelp[1].onmouseleave = function (evt) {
        if(evt.clientX > mHelp[1].getBoundingClientRect().left
        && evt.clientX < mHelp[1].getBoundingClientRect().right
        && evt.clientY <= mHelp[1].getBoundingClientRect().top){
                menu_visit[1] = true;
                menu_visit[2] = false;
        }
        else {
            hideMenu(mHelp, 2);
        }
    }

    mHelp[0].onclick = function () {
        var doc = document.getElementById('docs');
        doc.click();
        hideMenu(mHelp, 2);
    }

    mHelp[1].onclick = function () {
        alert("PIGEON - free graphics editor. Version 1.0. Developed by Paul Khobta.");
        hideMenu(mHelp, 2);
    }
}

//              CANVAS AREA NEXT

// From here functions, which draw on canvas and work with it
var painting = false, clearing = false, previousMousePos, previousPointerPos, pointerCount = 0, drawDelay, MTActive = false,
drawingPath = [], // here all path for fill mode
drawCancelled = false, // for touch mode; if touch was with two fingers or was so fast, then this var set to true
touchPainting = true, touchClearing = false, touchHappens = false;

// Mouse Events Handlers
function getMousePos (evt) {
    // necessary to take into account CSS boundaries
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}

function drawLineImmediate (x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (fillDraw) {
        drawingPath.push([x1, y1]);
        drawingPath.push([x2, y2]);
    }
}

function handleMouseMove (evt) {
    var mousePos = getMousePos(evt);

    coords.textContent = mousePos.x + ', ' + mousePos.y;

    if ((lineDraw && clearing) || !lineDraw) {

        // Let's draw some lines that follow the mouse pos
        if (painting) {
            drawLineImmediate(previousMousePos.x, previousMousePos.y, mousePos.x, mousePos.y);
            previousMousePos = mousePos;
        }
        else if (clearing) {
            ctx.fillRect(mousePos.x - (eraserW / 2), mousePos.y - (eraserW / 2), eraserW, eraserW);
        }
    }
}

function clicked (evt) {
    previousMousePos = getMousePos(evt);
    if(evt.button == 0) {
        if (lineDraw) {
            ctx.lineTo(previousMousePos.x, previousMousePos.y);
            ctx.stroke();
        }

        painting = true;

        ctx.save();
        ctx.fillStyle = ctx.strokeStyle;

        ctx.beginPath();
        ctx.arc(previousMousePos.x, previousMousePos.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();

        ctx.restore();

        if (lineDraw || fillDraw) {
            ctx.moveTo(previousMousePos.x, previousMousePos.y);
            if (fillDraw) {
                drawingPath.push([previousMousePos.x, previousMousePos.y]);
            }
        }

    }
    else if (evt.button == 2) {
        clearing = true;
        ctx.save();
        ctx.fillStyle = '#ffffffff';
        ctx.fillRect(previousMousePos.x - (eraserW / 2), previousMousePos.y - (eraserW / 2), eraserW, eraserW);
    }
    else if (evt.button == 1) {
        ctx.beginPath();
        evt.preventDefault();
    }
}

function fillModeMaker () {
    ctx.beginPath();

    for (var i = 0; i < drawingPath.length; i++) {
        if (i == 0) {
            ctx.moveTo(drawingPath[i][0], drawingPath[i][1]);
        }
        else {
            ctx.lineTo(drawingPath[i][0], drawingPath[i][1]);
        }
    }

    ctx.fill();
    ctx.closePath();
    drawingPath.length = 0;
}

function released(evt) {
    if (painting || clearing) {
        if (fillDraw && evt.button == 0) {
            if (drawingPath.length > 1) {
                fillModeMaker();
            }
            else {
                drawingPath.length = 0;
            }
        }
    
        if (clearing) {
            ctx.restore();
            ctx.beginPath();
        }
    
        if (!lineDraw && painting) {
            ctx.beginPath();
        }
    
        painting = false;
        clearing = false;
        
        changeMaker();
    }
}

function handleCanvasLeave(evt) {
    if (painting && !lineDraw) {
        ctx.beginPath();
        
        if (fillDraw && evt.button == 0) {
            if (drawingPath.length > 0) {
                fillModeMaker();
            }
            else {
                drawingPath.length = 0;
            }
        }

        changeMaker();

        painting = false;
        clearing = false;
    }
    else if (clearing) {
        painting = false;
        clearing = false;
    }
}

// From here - Pointer Events
function getPointerPos(evt) {
    if (evt.isPrimary == true) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - rect.left),
            y: Math.round(evt.clientY - rect.top)
        };
    }
}

function handlePointerStart(evt) {
    if ((!mouseOnTouch) || (mouseOnTouch && evt.pointerType == 'mouse')) {
        if (!mouseOnTouch) {
            if (pointerCount < 0) {
                pointerCount = 0;
            }
        
            pointerCount++;
    
            if (pointerCount < 2) {
                previousPointerPos = getPointerPos(evt);
                coords.textContent = previousPointerPos.x + ', ' + previousPointerPos.y;
            }
            else if (pointerCount == 3) {
                if (touchClearing) {
                    touchClearing = false;
                    touchPainting = true;
                    ctx.beginPath();
                }
                else {
                    touchPainting = false;
                    touchClearing = true;
                }
            }
        
            if (pointerCount == 1) {
                if (touchClearing) {
                    ctx.save();
                    ctx.fillStyle = '#ffffffff';
                }
    
                drawDelay = window.setTimeout(pointerDraw, 100);
            }
            else {
                window.clearTimeout(drawDelay);
                drawCancelled = true;
                //alert('cancelled');
            }
        }
        else {
            previousPointerPos = getPointerPos(evt);
            MTActive = true;

            if (touchClearing) {
                ctx.save();
                ctx.fillStyle = '#ffffffff';
            }

            pointerDraw();
        }
    }
    else if (mouseOnTouch && evt.pointerType != 'mouse') {
        if (pointerCount < 0) {
            pointerCount = 0;
        }

        pointerCount++;

        if (pointerCount == 1) {
            drawDelay = window.setTimeout(zoomChecker, 100);
        }
        else {
            window.clearTimeout(drawDelay);
            drawCancelled = true;
        }
    }
}

// Actually this function helps to differ change-mode actions from multitouch actions (zoom and movement)
function zoomChecker () {
    if (pointerCount == 1) {
        if (touchPainting) {
            touchClearing = true;
            touchPainting = false;
        }
        else {
            touchPainting = true;
            touchClearing = false;
        }
    }
}

function pointerDraw () {
    if (pointerCount == 1 || mouseOnTouch) {
        touchHappens = true;

        // Line Draw Mode Will be Activated if lineDraw == true; below code for Line Draw Mode
        if (lineDraw == true) {
            if (touchPainting) {
                ctx.lineTo(previousPointerPos.x, previousPointerPos.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(previousPointerPos.x, previousPointerPos.y);
            }
            else if (touchClearing) {
                ctx.fillRect(previousPointerPos.x - (eraserW / 2), previousPointerPos.y - (eraserW / 2), eraserW, eraserW);
            }
        }
        else {
            if (touchPainting) {
                //alert('now');
                ctx.save();
                ctx.fillStyle = ctx.strokeStyle;

                ctx.beginPath();
                ctx.arc(previousPointerPos.x, previousPointerPos.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.beginPath();
                ctx.restore();

                if (fillDraw) {
                    ctx.moveTo(previousPointerPos.x, previousPointerPos.y);
                    drawingPath.push(previousPointerPos.x, previousPointerPos.y);
                }
            }
            else if (touchClearing) {
                ctx.fillRect(previousPointerPos.x - (eraserW / 2), previousPointerPos.y - (eraserW / 2), eraserW, eraserW);
            }
        }
    }
}

function handlePointerMove(evt) {
    var pointerPos = getPointerPos(evt);

    if (pointerPos.x > 0 && pointerPos.x <= canvas.width && pointerPos.y > 0 && pointerPos.y <= canvas.height) {
        coords.textContent = pointerPos.x + ', ' + pointerPos.y;
    }
    else {
        coords.textContent = "";
    }

    if (((pointerCount == 1 && ((lineDraw && touchClearing) || (!lineDraw)) && !mouseOnTouch) || 
    (MTActive && mouseOnTouch && evt.pointerType == 'mouse')) && touchHappens) {
        // Let's draw some lines
        if(touchPainting) {
            drawLineImmediate(previousPointerPos.x, previousPointerPos.y, pointerPos.x, pointerPos.y);
            previousPointerPos = pointerPos;
        }
    
        if(touchClearing) {
            ctx.fillRect(pointerPos.x - (eraserW / 2), pointerPos.y - (eraserW / 2), eraserW, eraserW);
        }
    }
}

function delayedPointerEnd (evt) {
    if ((pointerCount == 1 || MTActive) && !drawCancelled && touchHappens) {
        if (fillDraw && touchPainting) {
            if (drawingPath.length > 1) {
                fillModeMaker();
            }
            else {
                drawingPath.length = 0;
            }
        }
    
        if (!lineDraw && touchPainting) {
            ctx.beginPath();
        }
    
        if (touchClearing) {
            ctx.restore();
            ctx.beginPath();
        }
    
        if ((evt.isPrimary == true && pointerCount == 1) || MTActive) {
            changeMaker();
        }
        
        if (!MTActive) {
            pointerCount--;
        }
        else {
            MTActive = false;
            pointerCount = 0;
        }
    
        if (pointerCount < 0) {
            pointerCount = 0;
        }

        touchHappens = false;
    }
    else {
        pointerCount--;
        drawCancelled = false;
    }
}

function handlePointerEnd(evt) {
    window.setTimeout(delayedPointerEnd(evt), 100);
}

function resizeCanvasAccordingToParentSize() {
    // adjust canvas size
    canvas.width = cnvContainer.clientWidth;
    canvas.height = cnvContainer.clientHeight;
}

function changeMaker () {
    curChange++;
    changes[curChange] = canvas.toDataURL();

    if (curChange != (changes.length - 1)) {
        changes.splice(curChange + 1);
    }
}

canvas.addEventListener('contextmenu', evt => {evt.preventDefault();});

//              WINDOW EVENTS AREA NEXT

window.onload = function() {
    inValue = 0;
    font = ctx.font;
    canvas.style.touchAction = 'pinch-zoom';
    canvas.width = 255;
    canvas.height = 255;

    if (matchMedia('(any-pointer:fine)').matches || navigator.maxTouchPoints == 256 || navigator.maxTouchPoints == 0) {
        hasMouse = true;
        mouseSupport = true;
    }

    function touchEnabled() {
        return ( 'ontouchstart' in window ) || 
               ( navigator.maxTouchPoints > 0 && navigator.maxTouchPoints < 256 ) || 
               ( navigator.msMaxTouchPoints > 0 && navigator.msMaxTouchPoints < 256);
    }
    
    hasTouch = touchSupport = touchEnabled();

    if (mouseSupport && touchSupport) {
        var choose = confirm('Mouse and touchscreen support detected! You may choose either mouse or touchscreen mode. In mouse mode you can only'+
        ' use mouse; in touchcreen mode you can only use touchcreen. By default, if you click Ok, touchscreen mode will be activated. '+
        'If you prefer using mouse, choose Cancel. You can change choice in Settings. Details in manual.');
        if (choose) {
            mouseSupport = false;
            touchSupport = true;
        }
        else {
            mouseSupport = false; // it means that mouse events are disabled; pointer events used in mobile for mouse actions
            mouseOnTouch = true; // mouse usage mode activated on device with touchscreen
            touchSupport = true;
        }
    }
    else if (!mouseSupport && !touchSupport) {
        mouseSupport = true;
    }

    if (mouseSupport == true) {
        canvas.addEventListener('mousemove', handleMouseMove, false);
        canvas.addEventListener('mousedown', clicked, false);
        canvas.addEventListener('mouseup', released, false);
        canvas.addEventListener('mouseleave', handleCanvasLeave, false);
    }
    else if (touchSupport == true) {
        canvas.addEventListener('pointerdown', handlePointerStart, false);
        canvas.addEventListener('pointermove', handlePointerMove, false);
        if (!mouseOnTouch) {
            canvas.addEventListener('pointerout', handlePointerEnd, false);
        }
        else {
            ['pointerup', 'pointerleave'].forEach(e => {
                canvas.addEventListener(e, handlePointerEnd, false);
            });
        }
    }

    const orientation = matchMedia("screen and (orientation:portrait)");

    orientation.onchange = function () {
        miPosition(file, mFile);
        miPosition(edit, mEdit);
        miPosition(tools, mTools);
        miPosition(help, mHelp);
    }

    fileFormats.forEach(i => {
        if (canvas.toDataURL(i).startsWith(`data:${i}`)) {
            supportedFormats.push(i);
        }
    });

    // Check if user not in Windows or has touchscreen; if true, load alternative fonts; if false, just skip this moment
    if (navigator.platform.indexOf('Win') == '-1' || touchSupport) {
        document.styleSheets[0].insertRule(
            '@font-face {' +
                'font-family: "Liberation Serif";' +
                'src: url("./Fonts/LiberationSerif-Regular.ttf") format("truetype");' +
            '}', document.styleSheets[0].rules.length);
            document.styleSheets[0].insertRule(
            '@font-face {' +
                'font-family: "Liberation Serif";' +
                'src: url("./Fonts/LiberationSerif-Italic.ttf") format("truetype");' +
                'font-style: italic;' +
            '}', document.styleSheets[0].rules.length);
            document.styleSheets[0].insertRule(
            '@font-face {' +
                'font-family: "Liberation Serif";' +
                'src: url("./Fonts/LiberationSerif-Bold.ttf") format("truetype");' +
                'font-weight: bold;' +
            '}', document.styleSheets[0].rules.length);
            document.styleSheets[0].insertRule(
            '@font-face {' +
                'font-family: "Liberation Serif";' +
                'src: url("./Fonts/LiberationSerif-BoldItalic.ttf") format("truetype");' +
                'font-style: italic;' +
                'font-weight: bold;' +
            '}', document.styleSheets[0].rules.length);
            document.styleSheets[0].insertRule(
            '.unselectable {'+
                '-moz-user-select: -moz-none;'+
                '-khtml-user-select: none;'+
                '-webkit-user-select: none;'+
                '-o-user-select: none;'+
                'user-select: none;'+
                '-ms-user-select: none;'+
            '}', document.styleSheets[0].rules.length);
            document.styleSheets[0].insertRule(
            '.unselectable, b {' +
                'font-family: "Liberation Serif";' +
            '}', document.styleSheets[0].rules.length);
            document.styleSheets[0].insertRule(
            '.apply {' +
                'font-family: "Liberation Serif";' +
            '}', document.styleSheets[0].rules.length);
    }

    canvas.width = 500;
    canvas.height = 500;
    cnvContainer.style.width = '500px';
    cnvContainer.style.height = '500px';

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = curSettings['lineWidth'];
    
    ctx.fillStyle = '#ffffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000ff';

    changes[0] = canvas.toDataURL();
    curChange = 0;

    ctx.lineWidth = 10;
    eraserW = ctx.lineWidth;

    curSettings = {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        lineWidth: ctx.lineWidth,
        eraserWidth: eraserW,
        strokeColor: ctx.strokeStyle,
        strokeAlpha: '255',
        fillColor: ctx.fillStyle,
        fillAlpha: '255',
        lineDrawMode: false,
        fillMode: false
    };

    if (hasMouse && hasTouch) {
        if (!mouseOnTouch) {
            curSettings.pointer = 'touchscreen';
        }
        else {
            curSettings.pointer = 'mouse';
        }
    }
}

//             MOVABLE BOXES AREA NEXT

// Functions which make possible dragging the box
function mouseMoveBox(evt) {
    boxTarget.style.left = (boxTarget.offsetLeft + evt.movementX) + 'px';
    boxTarget.style.top = (boxTarget.offsetTop + evt.movementY) + 'px';

    if ((boxTarget.offsetLeft + boxTarget.offsetWidth) > document.body.clientWidth || 
    (boxTarget.offsetTop + boxTarget.offsetHeight) > window.innerHeight ||
    boxTarget.offsetLeft < window.pageXOffset || boxTarget.offsetTop < window.pageYOffset) {
        boxTarget.scrollIntoView();
    }

    if (boxTarget.id != 'ruler_box') {
        if (boxTarget.offsetLeft < 0) {
            boxTarget.style.left = '0px';
        }
        if (boxTarget.offsetTop < 0) {
            boxTarget.style.top = '0px';
        }
    }
}

function callRulerSet (evt) {
    if (mouseSupport == true) {
        if ((evt.button == 2 && rbCallMethod.value == 'right') || (evt.button == 1 && rbCallMethod.value == 'middle')) {
            rulersetbox.style.display = 'block';
            showBox(rulersetbox);
    
            rulersetbox.addEventListener('mousedown', mouseDownBox, false);
        }
    }

    if (touchSupport == true) {
        rulersetbox.style.display = 'block';
        showBox(rulersetbox);

        rulersetbox.addEventListener('pointerdown', pointerDownBox, false);
    }
}

function mouseDownBox(evt) {
    if ((evt.target.id.includes('_move') || evt.target.parentNode.id.includes('_move') || evt.target.id == 'rbcnv') && evt.button == 0) {
        if (!firstMouseDown) {
            if (evt.target.parentNode.parentNode !== document.body) {
                boxTargetMoveArea = evt.target.parentNode;
                boxTarget = evt.target.parentNode.parentNode;
            }
            else {
                boxTargetMoveArea = evt.target;
                boxTarget = evt.target.parentNode;
            }
            
            boxTargetMoveArea.requestPointerLock = boxTargetMoveArea.requestPointerLock || boxTargetMoveArea.mozRequestPointerLock;

            canvas.removeEventListener('mousemove', handleMouseMove, false);
            canvas.removeEventListener('mousedown', clicked, false);
            canvas.removeEventListener('mouseup', released, false);
            canvas.removeEventListener('mouseleave', handleCanvasLeave, false);

            boxTargetMoveArea.requestPointerLock();
            boxTargetMoveArea.addEventListener('mousemove', mouseMoveBox, false);

            zBoxPriority(boxTarget);

            firstMouseDown = true;
        }
        else {
            document.exitPointerLock();

            boxTargetMoveArea.removeEventListener('mousemove', mouseMoveBox, false);

            canvas.addEventListener('mousemove', handleMouseMove, false);
            canvas.addEventListener('mousedown', clicked, false);
            canvas.addEventListener('mouseup', released, false);
            canvas.addEventListener('mouseleave', handleCanvasLeave, false);

            firstMouseDown = false;
        }
    }
    else if (evt.target.id == 'rbcnv') {
        callRulerSet(evt);

        if (evt.button == 1) {
            evt.preventDefault();
        }
    }
    else if (evt.target.parentNode == document.body) {
        boxTarget = evt.target;
        zBoxPriority(boxTarget);
    }
    else if (evt.target.tagName != 'BUTTON') {
        boxTarget = evt.target;

        while (boxTarget.parentNode !== document.body) {
            boxTarget = boxTarget.parentNode
        }

        zBoxPriority(boxTarget);
    }
}

document.addEventListener('pointerlockerror', lockError, false);
document.addEventListener('mozpointerlockerror', lockError, false);

function lockError () {
    boxTargetMoveArea.requestPointerLock(); // if error, try to request pointer lock anyway
}

function pointerPosBox (evt) {
    return {
        x: evt.clientX,
        y: evt.clientY
    };
}

function pointerMoveBox (evt) {
    var pointerPos = pointerPosBox(evt);

    boxTarget.style.left = (pointerPos.x + offset[0]) + 'px';
    boxTarget.style.top = (pointerPos.y + offset[1]) + 'px';

    if ((boxTarget.offsetLeft + boxTarget.offsetWidth) > document.body.clientWidth || 
    (boxTarget.offsetTop + boxTarget.offsetHeight) > window.innerHeight ||
    boxTarget.offsetLeft < window.pageXOffset || boxTarget.offsetTop < window.pageYOffset) {
        boxTarget.scrollIntoView();
    }

    if (boxTarget.id != 'ruler_box') {
        if (boxTarget.offsetLeft < 0) {
            boxTarget.style.left = '0px';
        }
        if (boxTarget.offsetTop < 0) {
            boxTarget.style.top = '0px';
        }
    }
}

function pointerUpBox () {
    canvas.addEventListener('pointermove', handlePointerMove, false);
    canvas.addEventListener('pointerdown', handlePointerStart, false);
    if (!mouseOnTouch) {
        canvas.addEventListener('pointerout', handlePointerEnd, false);
    }
    else {
        ['pointerup', 'pointerleave'].forEach(e => {
            canvas.addEventListener(e, handlePointerEnd, false);
        });
    }

    window.removeEventListener('pointermove', pointerMoveBox, false);
    window.removeEventListener('pointerup', pointerUpBox, false);
}

function pointerDownBox (evt) {
    if (evt.target.id.includes('_move') || evt.target.parentNode.id.includes('_move') || evt.target.id == 'rbcnv') {
        if (evt.target.parentNode.parentNode !== document.body) {
            boxTargetMoveArea = evt.target.parentNode;
            boxTarget = evt.target.parentNode.parentNode;
        }
        else {
            boxTargetMoveArea = evt.target;
            boxTarget = evt.target.parentNode;
        }

        offset = [
            boxTarget.offsetLeft - evt.clientX,
            boxTarget.offsetTop - evt.clientY
        ];

        canvas.removeEventListener('pointermove', handlePointerMove, false);
        canvas.removeEventListener('pointerdown', handlePointerStart, false);
        if (!mouseOnTouch) {
            canvas.removeEventListener('pointerout', handlePointerEnd, false);
        }
        else {
            ['pointerup', 'pointerleave'].forEach(e => {
                canvas.removeEventListener(e, handlePointerEnd, false);
            });
        }

        window.addEventListener('pointermove', pointerMoveBox, false);
        window.addEventListener('pointerup', pointerUpBox, false);

        zBoxPriority(boxTarget);

        if (evt.target.id == 'rbcnv' && evt.isPrimary == false) {
            callRulerSet(evt);
        }
    }
    else if (evt.target.parentNode == document.body) {
        boxTarget = evt.target;
        zBoxPriority(boxTarget);
    }
    else if (evt.target.tagName != 'BUTTON') {
        boxTarget = evt.target;

        while (boxTarget.parentNode !== document.body) {
            boxTarget = boxTarget.parentNode;
        }

        zBoxPriority(boxTarget);
    }
}