function setLastLocationItemHeight () {
    var locList = document.getElementById("location_list");
    var liList = locList.getElementsByTagName("li");
    if (liList.length > 0) {
        var lastChild = liList[liList.length - 1];
        console.log(lastChild);
    }
    
}

//////////////////////|
//// CREATE TABLE ////|
//////////////////////|

var chosenWeekDayList = new Array();
var chosenStartDate;
var slotMap = {};

initSlotMap();
createWeekList(today(), true);
createYearList();
createDateSlotTableHeader(today());
createDateSlotTableBody();
setLastLocationItemHeight();

function createDateSlotTableHeader (aDate) {
    createDayOfWeekList(aDate);
    var htmlContent = document.getElementById("day_row").innerHTML;
    var dayCellHtml;
    for (var i = 0; i <= 6; i++) {
        var isSunDay = (i == 6);
        if (isSunDay) {
            dayCellHtml = '<th class="day_cell last_day_cell"> <div>';
            dayCellHtml += '<span class="day">Chủ nhật<span>';
        } else {
            dayCellHtml = '<th class="day_cell"> <div>';
            dayCellHtml += '<span class="day">Thứ ' + (i + 2) + '<span>';
        }
        dayCellHtml += '<span class="date">' + chosenWeekDayList[i] + '</span>';
        dayCellHtml += '</div> </th>'; 
        htmlContent += dayCellHtml;
    }
    document.getElementById("day_row").innerHTML = htmlContent;
}

function createDateSlotTableBody () {
    
    var tableBodyHtml = "";
    for (let slotNum = 1; slotNum <= 8; slotNum++) {
        tableBodyHtml += createASlotRow(slotNum, slotMap[slotNum]);
    }

    document.getElementById("date_and_slot_table_body").innerHTML = tableBodyHtml;
}

function createASlotRow (slotNumber, timeRange) {
    // <tr class="slot_row">
    //     <!-- BEGIN: SLOT 1 -->
    //     <td class="slot_cell">
    //         <div>
    //             <span class="slot_span">Slot 1<span>
    //             <span class="time_range_span">7:00 - 8:30</span>
    //         </div>
    //     </td>

    //     <td onclick="onSlotClick(this)" id="1-1" >

    //     </td>
    // </tr>
    var rowContent;
    rowContent = '<tr class="slot_row"> \n'; 
    rowContent +=  '<!-- BEGIN: SLOT 1 --> \n'; 
    rowContent +=     '<td class="slot_cell"> \n'; 
    rowContent +=         '<div> \n'; 
    rowContent +=            '<span class="slot_span">Slot'+ slotNumber +'<span> \n';
    rowContent +=            '<span class="time_range_span">' + timeRange + '</span> \n';   
    rowContent +=         '</div> \n';  
    rowContent +=     '</td> \n';  


    for (let dayNumber = 2; dayNumber <= 8; dayNumber++) {
        let id = slotNumber+'-'+dayNumber;
        rowContent += '<td onclick="onSlotClick(this)" ';
        if (dayNumber != 8) {
            rowContent += 'id="' + id + '"></td> \n'
        } else {
            rowContent += 'id="' + id + '" class="last_row_cell"></td> \n'
        }
    }

    rowContent += '</tr> \n'
    return rowContent;
}

function createDayOfWeekList (currentDate) {

    var currentDayOfWeek = currentDate.getDay();
    var dayOfMonth = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    if (currentDayOfWeek == 0) {
        currentDayOfWeek = 7;
    }

    var startWeekDate = (dayOfMonth - currentDayOfWeek + 1);
    var startDate = new Date(year, month, startWeekDate, 0, 0, 0, 0);

    for (var i = 0; i <= 6; i++) {
        var date = 
            new Date(startDate.getFullYear(), 
                    startDate.getMonth(), 
                    startDate.getDate() + i, 0, 0, 0, 0);
        var day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }

        var month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }

        chosenWeekDayList[i] = day + "/" + month;
        chosenStartDate = chosenWeekDayList[0];
    }
}

function onWeekChange (weekSelectTag) {
    var chosenWeek = weekSelectTag.value;
    var startDay = chosenWeek.slice(0, 5);
    var startDateInfor = startDay.split("/");

    var day = startDateInfor[0];
    var month = startDateInfor[1];
    chosenStartDate = day + "/" + month;
    sendGetRequestWithoutChosenSlot('viewSlotAndTimeFree');
}

function initSlotMap () {
    const SLOT_TIME = 90;
    const LUNCH_TIME = 30;
    const BREAK_TIME = 15; 
    var startHour = 7;
    var startMin;
    var endHour, endMin;
    var date = new Date(1, 1, 1, startHour - 1, 0, 0, 0)
    for (var slot = 1; slot <= 8; slot++) {
        startHour = date.getHours() + 1;
        startMin = date.getMinutes();
        startHour = get2DigitFormat(startHour);
        startMin = get2DigitFormat(startMin);

        date.setMinutes(date.getMinutes() + SLOT_TIME);
        endHour = date.getHours() + 1;
        endMin = date.getMinutes();
        endHour = get2DigitFormat(endHour);
        endMin = get2DigitFormat(endMin);

        slotMap[slot] = startHour + ":" + startMin + " - " + endHour + ":" + endMin;
        console.log("Slot " + slot + ": " + slotMap[slot]);

        if (slot != 3) {
            date.setMinutes(date.getMinutes() + BREAK_TIME);
        } else {
            date.setMinutes(date.getMinutes() + LUNCH_TIME);
        }
    }

}

function get2DigitFormat (number) {
    if (number < 10) {
        return "0" + number;
    }
    
    return number;
}

function today() {
    return new Date();
}

/////////////////////////////|
//// WEEK & YEAR PROCESS ////|
/////////////////////////////|

function createYearList () {
    var currentYear = today().getFullYear();
    var optionContent;
    var htmlContent;
    for (var i = 0; i <= 2; i++) {
        optionContent = "<option>" + (currentYear + i) + "</option>";
        htmlContent += optionContent;
    }
    document.getElementById("year_option").innerHTML = htmlContent;
}

function createWeekList (dateOfYear, takeFirstWeek) {

    var currentDate;
    if (dateOfYear != undefined) {
        currentDate = dateOfYear;
    } else {
        currentDate = today();
    }

    var dayOfMonth = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var date;
    var weekOption;
    var optionContent;
    var htmlContent;
    var i = 1;
    if (takeFirstWeek) {
        i = 0;
    }
    for (; i <= 51; i++) {
        
        date = new Date(year, month, dayOfMonth + i * 7, 0, 0, 0, 0);
 
        weekOption = getWeekFromDate(date);
        optionContent = "<option>" + weekOption + "</option>";
        htmlContent += optionContent;
        if (isTheLastWeekOfTheYear(date)) {
            break;  
        } 
    }

    document.getElementById("week_option").innerHTML = htmlContent;
}

function isTheLastWeekOfTheYear (date) {
    var currentDayOfWeek = date.getDay();
    var dayOfMonth = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    var endWeekDate = (dayOfMonth + (7 - currentDayOfWeek));
    var endDate = new Date(year, month, endWeekDate, 0, 0, 0, 0);

    if (endDate.getFullYear() > year) {
        return true;
    }

    if (endDate.getMonth() + 1 == 12) {
        if (endDate.getDate() == 31) {
            return true;
        }
    }

    return false;
}

function getWeekFromDate (date) {

    var currentDayOfWeek = date.getDay();
    var dayOfMonth = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    if (currentDayOfWeek == 0) {
        currentDayOfWeek = 7;
    }

    var startWeekDate = (dayOfMonth - currentDayOfWeek + 1);
    var startDate = new Date(year, month, startWeekDate, 0, 0, 0, 0);

    var endWeekDate = (dayOfMonth + (7 - currentDayOfWeek));
    var endDate = new Date(year, month, endWeekDate, 0, 0, 0, 0);

    var startDay = startDate.getDate();
    if (startDay < 10) {
        startDay = "0"  + startDay;
    }

    var startMonth = startDate.getMonth() + 1;
    if (startMonth < 10) {
        startMonth = "0" + (startMonth);
    }

    var endDay = endDate.getDate();
    if (endDay < 10) {
        endDay = "0"  + endDay;
    }
    var endMonth = endDate.getMonth() + 1;
    if (endMonth < 10) {
        endMonth = "0" + (endMonth);
    }

    var result = startDay+"/"+startMonth+" - "+endDay+"/"+endMonth;
    return result;
}

function onYearChange (yearSelect) {
    var chosenYear = yearSelect.value;
    if (today().getFullYear() != chosenYear) {
        var firstDayOfYear = new Date(chosenYear, 0, 1, 0, 0, 0, 0);
        if (firstDayOfYear.getDay() == 1) {
            createWeekList(firstDayOfYear, true);
        } else {
            createWeekList(firstDayOfYear, false);
        }
    } else {
        createWeekList(today(), true);
    }

    sendGetRequestWithoutChosenSlot('viewSlotAndTimeFree');
}


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
    var locationName = getLocationFromLocItem(element);
    var locationId = element.id;
    var locInfor = locationId + "-" + locationName;  
    console.log(element)
    console.log(getLocationFromLocItem(element))
    console.log(locInfor);
    // Fill Slot
    addChosenLocation(locInfor);
    
    var collections = document.getElementsByClassName("loc_slot focused");
    var focusedButtonDiv = collections[0];

    let filledLocationTab = createFilledLocationTab(element);

    focusedButtonDiv.parentNode.appendChild(filledLocationTab);

    let addSlotButtonDiv = createAddSlotButton();    

    focusedButtonDiv.parentNode.appendChild(addSlotButtonDiv);
    focusedButtonDiv.parentNode.removeChild(focusedButtonDiv);

    // << Xử lí sau trên JSP
    deactiveChooseLocation();
    activeChooseSlot();
    hideChosenLocationInList(element);
    // Xử lí sau trên JSP >>

    sendGetRequestWithoutChosenSlot('modifyLocation');
}

function createFilledLocationTab (locationElement) {
    var locationName = getLocationFromLocItem(locationElement);
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
    label.innerHTML = locationName;

    let line = document.createElement("span");
    line.style.width = "1px";
    line.style.height = "45px";
    line.className = "bg-white";

    let btnDeleteLocDiv = document.createElement("div");
    btnDeleteLocDiv.className = "btn_delete_loc"
    btnDeleteLocDiv.setAttribute("onclick", "onDeleteLocationClick('" + locationElement.id + "','" + locationName + "')");
    
    let deleteIcon = document.createElement("img");
    deleteIcon.src = "../icon/delete_location_icon.svg";
    deleteIcon.className = "m-auto";

    btnDeleteLocDiv.appendChild(deleteIcon);
    filledLocationTab.appendChild(label);
    filledLocationTab.appendChild(line);
    filledLocationTab.appendChild(btnDeleteLocDiv);

    return filledLocationTab;
}

function hideChosenLocationInList (locationElement) {
    var locationName = getLocationFromLocItem(locationElement);
    var locItemList = document.getElementsByClassName("loc_item");
    for (var locItem of locItemList) {
        var matched = getLocationFromLocItem(locItem) == locationName;
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
function onDeleteLocationClick (locationId, location) {

    var chosenLocationDivs = document.getElementsByClassName("loc_slot filled");
    for (var div of chosenLocationDivs) {
        if (getLocationFromLocItem(div) == location) {
            div.parentNode.removeChild(div);
        }
    }

    var locInfor = locationId + "-" + location;
    removeChosenLocation(locInfor);

    if (chosenLocationList.length == 0) {
        focusNewTab();
        deactiveChooseSlot();
        activeChooseLocation();
    }

    // << Xử lí sau trên JSP
    showChosenLocationInList(location);
    // Xử lí sau trên JSP >>

    sendGetRequestWithoutChosenSlot('modifyLocation');
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

function addChosenLocation (locationId) {
    chosenLocationList.push(locationId);
}

function removeChosenLocation (locationId) { 
    let index = chosenLocationList.indexOf(locationId);
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
function sendGetRequest (action) {
    var submitContent = "<form id='submiter' method='GET' action=" + action + ">";

    submitContent += createChosenSlotFormsHtml();
    submitContent += createChosenLocationFormsHmtl();
    submitContent += createStartDateFormHtml();
    submitContent += createTextSearchFormHtml();

    submitContent += "</form>";
    document.getElementById("submit_form").innerHTML = submitContent;
    console.log(document.getElementById("submit_form"));

    // document.getElementById("submiter").submit();
}

function sendGetRequestWithoutChosenSlot (action) {
    var submitContent = "<form id='submiter' method='GET' action=" + action + ">";

    submitContent += createChosenLocationFormsHmtl();
    submitContent += createStartDateFormHtml();
    submitContent += createTextSearchFormHtml();

    submitContent += "</form>";
    document.getElementById("submit_form").innerHTML = submitContent;
    console.log(document.getElementById("submit_form"));
    
}

function createChosenSlotFormsHtml () {
    var html = "";
    for (const slot of chosenSlotList) {
        html += 
        "<input type='hidden' name='chosenSlot' value='" + slot +"'>";
    }
    return html;
}

function createChosenLocationFormsHmtl () {
    var html = "";
    for (const slot of chosenLocationList) {
        html += 
        "<input type='hidden' name='chosenLocationId' value='" + slot +"'>";
    }
    return html;
}

function createStartDateFormHtml () {
    var startDateInfor = chosenStartDate.split("/");
    var day = startDateInfor[0]; 
    var month = startDateInfor[1]; 
    var year = document.getElementById("year_option").value;
    var startDateParam = year + "-" + month + "-" + day;
    return "<input type='hidden' name='startDate' value='" + startDateParam +"'>";
}

function createTextSearchFormHtml () {
    var txtSearch = document.getElementById("input_location").value;
    return "<input type='hidden' name='txtSearch' value='" + txtSearch +"'>";
}
