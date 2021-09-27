
///////////////////////////|
//// ADD / REMOVE SLOT ////|
///////////////////////////|

var chosenSlotList = new Array();

// ***
function onSlotClick (element) {
    if (chosenSlotList.includes(element.id) == false) {
        element.style.backgroundColor = '#A7E591';
        addChosenSlot(element.id);
        activeContinueButton();
    } else {
        element.style.backgroundColor = 'white';  
        removeChosenSlot(element.id);
        console.log("Delete");
        if (chosenLocationList.size == 0) {
            deactiveContinueButton();
        }
    }
}

function addChosenSlot (id) {
    chosenSlotList.push(id);
}

function removeChosenSlot (id) { 
    let index = chosenSlotList.indexOf(id);
    if (index > -1) {
        chosenSlotList.splice(index, 1);
    }
}

// ***
function activeContinueButton () {
    if (document.getElementById("btn_continue").disabled == true){
        document.getElementById("btn_continue").disabled = false;
    }
}

// ***
function deactiveContinueButton () {
    if (document.getElementById("btn_continue").disabled == false){
        document.getElementById("btn_continue").disabled = true;
    }
}

///////////////////////////////|
//// ADD / REMOVE LOCATION ////|
///////////////////////////////|

var chosenLocationList = new Array();

// ***
function focusNewTab () {
    var collections = document.getElementsByClassName("loc_slot unfilled next");
    var addButtonDiv = collections[0];

    // Model tag:
    // <div class="loc_slot focused"> 
    //    <p class="invisible">*</p>
    // </div>
    console.log(addButtonDiv);
    var focusedDiv = document.createElement("div");
    focusedDiv.className = "loc_slot focused";

    var invisibleP = document.createElement("p");
    invisibleP.innerHTML = "*";
    invisibleP.className = "invisible";

    focusedDiv.appendChild(invisibleP);
    console.log(focusedDiv);

    addButtonDiv.parentNode.appendChild(focusedDiv);
    addButtonDiv.parentNode.removeChild(addButtonDiv);

    activeChooseLocation ();
}

function activeChooseLocation () {
    document.getElementById("loc_list_disable_layer").style.display = "none";
}

function deactiveChooseLocation () {
    document.getElementById("loc_list_disable_layer").style.display = "block";
}

// ***
function onAddLocationClick (element) {

    // Fill Slot
    addChosenLocation(element.innerHTML);
    
    var collections = document.getElementsByClassName("loc_slot focused");
    var focusedButtonDiv = collections[0];

    let filledLocationTab = createFilledLocationTab(element.innerHTML);

    focusedButtonDiv.parentNode.appendChild(filledLocationTab);

    let addSlotButtonDiv = createAddSlotButton();    

    focusedButtonDiv.parentNode.appendChild(addSlotButtonDiv);
    focusedButtonDiv.parentNode.removeChild(focusedButtonDiv);

    deactiveChooseLocation();
    activeChooseSlot();
    hideChosenLocationInList(element.innerHTML);
}

function createFilledLocationTab (location) {
    // MODEL
    // <div class="loc_slot filled"> 
    //     <p>Thư viện tầng 3</p>
    //     <span style="width: 1px; height: 45px;"></span>
    //     <div class="btn_delete_loc">
    //         <img src="../icon/delete_location_icon.svg" class="m-auto">
    //     </div>
    // </div>
    
    let filledLocationTab = document.createElement("div");
    filledLocationTab.className = "loc_slot filled";
    
    let label = document.createElement("p");
    label.innerHTML = location;

    let line = document.createElement("span");
    line.style.width = "1px";
    line.style.height = "45px";
    line.className = "bg-white";

    let btnDeleteLocDiv = document.createElement("div");
    btnDeleteLocDiv.className = "btn_delete_loc"
    btnDeleteLocDiv.setAttribute("onclick", "onDeleteLocationClick('" + location + "')");
    
    let deleteIcon = document.createElement("img");
    deleteIcon.src = "../icon/delete_location_icon.svg";
    deleteIcon.className = "m-auto";

    btnDeleteLocDiv.appendChild(deleteIcon);
    filledLocationTab.appendChild(label);
    filledLocationTab.appendChild(line);
    filledLocationTab.appendChild(btnDeleteLocDiv);

    return filledLocationTab;
}

function hideChosenLocationInList (location) {
    var locItemList = document.getElementsByClassName("loc_item");
    for (var locItem of locItemList) {
        var matched = getLocationFromLocItem(locItem) == location;
        if (matched) {
            locItem.style.display = "none";
        }
    }
}


function getLocationFromLocItem (loc_item) {
    for (var element of loc_item.childNodes) {
        if (element.innerHTML != undefined) {
            return element.innerHTML;
        }
    }

    return undefined;
}

function activeChooseSlot () {
    if (document.getElementById("date_and_slot_disable_layer").style.display != "none") {
        document.getElementById("date_and_slot_disable_layer").style.display = "none";
    }
}

// ***
function onDeleteLocationClick (location) {

    var chosenLocationDivs = document.getElementsByClassName("loc_slot filled");
    for (var div of chosenLocationDivs) {
        if (getChosenLocationsFromDiv(div) == location) {
            div.parentNode.removeChild(div);
        }
    }

    removeChosenLocation(location);
    if (chosenLocationList.length == 0) {
        deactiveChooseSlot();
        activeChooseLocation();
    }

    showChosenLocationInList(location);
}

function showChosenLocationInList (location) {
    var locItemList = document.getElementsByClassName("loc_item");
    for (var locItem of locItemList) {
        var matched = getLocationFromLocItem(locItem) == location;
        if (matched) {
            locItem.style.display = "flex";
        }
    }
}

function deactiveChooseSlot () {
    if (document.getElementById("date_and_slot_disable_layer").style.display != "flex") {
        document.getElementById("date_and_slot_disable_layer").style.display = "flex";
    }
}

// ***
function createAddSlotButton () {
    // Create new Empty Slot
    // MODEL
    // <div onclick="focusNewTab()" class="loc_slot unfilled next"> 
    //     <div class="btn_add_loc">
    //         <img src="../icon/add_location_icon.svg" class="m-auto">
    //     </div>
    // </div>

    let addSlotButtonDiv = document.createElement("div");
    addSlotButtonDiv.onclick = function () {
        focusNewTab();
    };
    addSlotButtonDiv.className = "loc_slot unfilled next";

    let btnAddLocDiv = document.createElement("div");
    btnAddLocDiv.className = "btn_add_loc";
    
    let iconAdd = document.createElement("img");
    iconAdd.src = "../icon/add_location_icon.svg";
    iconAdd.className = "m-auto";

    btnAddLocDiv.appendChild(iconAdd);
    addSlotButtonDiv.appendChild(btnAddLocDiv);

    return addSlotButtonDiv;
}

function addChosenLocation (location) {
    chosenLocationList.push(location);
}

function removeChosenLocation (location) { 
    let index = chosenLocationList.indexOf(location);
    if (index > -1) {
        chosenLocationList.splice(index, 1);
    }
}

function getChosenLocationsFromDiv (loc_div) {
    return loc_div.childNodes[0].innerHTML;
}

//////////////////////|
//// SEND REQUEST ////|
//////////////////////|

// ***
function sendGetRequest () {
    console.log(document.getElementById("submit_form"));
    var submitContent = "<form id='submiter' method='GET'>";

    submitContent += createChosenSlotFormsHtml();
    submitContent += createChosenLocationFormsHmtl();
    submitContent += createChosenWeekFormHtml();
    submitContent += createTextSearchFormHtml();

    submitContent += "</form>";
    document.getElementById("submit_form").innerHTML = submitContent;
    console.log(document.getElementById("submit_form"));

    // document.getElementById("submiter").submit();
}

function createChosenSlotFormsHtml () {
    var html = "";
    for (const slot of chosenSlotList) {
        html += 
        "<input type='hidden' name='chosen_slot' value='" + slot +"'>";
    }
    return html;
}

function createChosenLocationFormsHmtl () {
    var html = "";
    for (const slot of chosenLocationList) {
        html += 
        "<input type='hidden' name='chosen_location' value='" + slot +"'>";
    }
    return html;
}

function createChosenWeekFormHtml () {
    var chosenWeek = document.getElementById("week_option").value;
    return "<input type='hidden' name='chosen_week' value='" + chosenWeek +"'>";
}

function createTextSearchFormHtml () {
    var txtSearch = document.getElementById("input_location").value;
    return "<input type='hidden' name='txt_search' value='" + txtSearch +"'>";
}
