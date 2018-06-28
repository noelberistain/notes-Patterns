var fragment = document.createDocumentFragment();
var temp1 = document.getElementsByTagName("template")[0];
var container = document.getElementById("container");

var inputSearch = document.getElementById("inputSearch");
inputSearch.addEventListener("input", search);

var container = document.getElementById("container");
container.addEventListener("click", actions);

var notes = model.getNotes();
if (notes.length > 0) {
    for (var key in notes) {
        var note = model.displayExistentNotes(key);
        showNotes(key, note.key, note.dateCreated, note.dateModified, note.textarea);
    }
}

function showNotes(index, num, crtd, updtd, txt) {
    order = parseInt(index);
    var clon = temp1.content.cloneNode(true);
    fragment.appendChild(clon);
    var keyNote = fragment.querySelector(".key");
    keyNote.innerText = num;
    var span = fragment.querySelector(".created");
    span.innerText = crtd;
    var updated = fragment.querySelector(".updated");
    updated.innerText = updtd;
    var textarea = fragment.querySelector(".innerText");
    textarea.innerText = txt;
    var note = fragment.querySelector(".mainNote");
    note.setAttribute("style", "order:" + order);
    note.setAttribute("key", num)
    container.appendChild(fragment);
}

function newNote(template) {
    var btnCreate = getThisElement("btn");//document.getElementById("btn");
    btnCreate.addEventListener("click", function createNew() {
        var clon = template.content.cloneNode(true);
        fragment.appendChild(clon);
        var main = fragment.querySelector(".mainNote");
        main.setAttribute("style", "order:" + ++order);
        var key = fragment.querySelector(".key");
        key.appendChild(document.createTextNode(setKey()));
        main.setAttribute("key", key.innerText);
        var span = fragment.querySelector(".created");
        var dateCreated = document.createTextNode(getDate());
        span.appendChild(dateCreated);
        var textarea = fragment.querySelector(".innerText");
        container.appendChild(fragment);
    });
}

function collectionOf(element) {
    return document.getElementsByTagName(element);
}

function getThisElement(element) {
    return document.getElementById(element);
}

function getNoteInfo(event) {
    return {
        textNode : '', 
        attributeName : event.target.getAttribute("name"),
        textarea : event.target.parentNode.getElementsByTagName("textarea")[0],
        mainNote : event.target.parentNode,
        iUpdated : event.target.parentNode.querySelector(".updated"),
        iCreated : event.target.parentNode.querySelector(".created"),
        spanKey : event.target.parentNode.querySelector(".key").innerText,
        iEdited : event.target.parentNode.querySelector(".fa-edit")
    }

}

function actions(event) {
    
    var noteInfo = getNoteInfo(event);
    //if i press the "TRASH" little icon(top-left)
    if (noteInfo.attributeName === "trash") {
        if (noteExist(noteInfo.spanKey)) {
            model.deleteNote(noteExist(noteInfo.spanKey));
        }
        container.removeChild(event.target.parentNode);
    }
    // if i CLICK on edit button
    if (noteInfo.attributeName === "edit") { //if I click the textarea element which is disabled by default
        if (noteInfo.textarea.disabled) {
            enableText(noteInfo.textarea);
            noteInfo.iEdited.style.display = "none";
        }
    }
    //if i press the "SAVE" icon (bottom-right)
    if (noteInfo.attributeName === "save") {
        disableText(noteInfo.textarea);
        noteInfo.iEdited.style.display = "inline";
        var noteContent = {};
        var dateModified = getDate();
        if (noteInfo.iUpdated.innerText.length > 0) {
            noteInfo.iUpdated.innerText = '';
        }
        if (noteExist(noteInfo.spanKey)) {
            model.updateNote(noteExist(noteInfo.spanKey), dateModified, noteInfo.textarea.value)
            noteInfo.iUpdated.appendChild(document.createTextNode(dateModified));
        }
        else {
            noteInfo.textNode = document.createTextNode(noteInfo.textarea.value);
            noteInfo.textarea.appendChild(noteInfo.textNode);
            noteContent.key = noteInfo.spanKey;
            noteContent.dateCreated = noteInfo.iCreated.innerText;
            noteContent.textarea = noteInfo.textarea.value;
            noteInfo.iUpdated.appendChild(document.createTextNode(dateModified));
            noteContent.dateModified = noteInfo.iUpdated.innerText;
            model.createNote(noteContent);
        }
    }
};


function dragStart(elem) {
    movingElem = elem;
    key = movingElem.querySelector(".key").innerText;
    originIndex = noteExist(key);
    movingElem.className += " hold";
    movingElem.setAttribute("ondragend", "dragEnd(this)");
}

function dragEnter(elem) {
    newPlace = elem;
    key = newPlace.querySelector(".key").innerText;
    destIndex = noteExist(key);
    newPlace.className += " hovered";
}

function dragLeave(e) {
    e.className = "mainNote";
}

function dragEnd() {
    movingElemOrder = parseInt(movingElem.style.order);
    newPlaceOrder = parseInt(newPlace.style.order);
    newPlace.className = "mainNote";
    var orders = getOrders(notes);
    var reordered = reorder(orders, movingElemOrder, newPlaceOrder);
    assignNewOrders(notes, reordered);
    saveNotes(notes);
    newPlace.removeAttribute("ondragend");
    movingElem.removeAttribute("ondragend");
}
function reorder(arr, origin, dest) {
    var indexDest = arr.findIndex(function (ord) { return +ord === +dest });
    var indexOrigin = arr.findIndex(function (ord) { return +ord === +origin });
    if (indexOrigin > indexDest) {
        var aux = arr[indexDest];
        for (var i = indexDest; i < indexOrigin; i++) {
            arr[i] = arr[i + 1];
        }
    }
    else {
        var aux = arr[indexOrigin];
        for (var i = indexOrigin; i < indexDest; i++) {
            arr[i] = arr[i + 1];
        }
    }
    arr[i] = aux;
    return arr;
}

function getOrders(a) {
    var x = [];
    for (var key in a) {
        if (a.hasOwnProperty(key)) {
            x.push(container.querySelector("[key='" + a[key].key + "']").style.order);
        }
    }
    return x;
}
function assignNewOrders(collection, newOrders) {
    for (var i = 0; i < notes.length; i++) {
        notes[i].ord = newOrders[i];
        container.querySelector("[key='" + notes[i].key + "']").style.order = newOrders[i];
    }
    notes.sort(function orderByOrd(note, next) {
        return +note.ord > +next.ord;
    });
}