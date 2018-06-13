var dateCreated = '', dateModified = '';
var fragment = document.createDocumentFragment();
var temp1 = document.getElementsByTagName("template")[0];
var allNotes = document.getElementsByClassName("mainNote");
var movingElem, originKey, destKey, key;

if (notes.length > 0) {
    for (var key in notes) {
        var note = displayExistentNotes(key);
        showNotes(note.key, note.dateCreated, note.dateModified, note.textarea);
    }
}

function showNotes(num, crtd, updtd, txt) {
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
    container.appendChild(fragment);
}

var timerId;
function search(e) {
    var searchingText = e.target.value;
    clearTimeout(timerId);
    timerId = setTimeout(function () {
        var notes = document.getElementsByTagName("textarea");
        for (var index = 0; index < notes.length; index++) {
            if ((notes[index].textContent).indexOf(searchingText) === -1) {
                notes[index].parentElement.style.display = "none";
            }
            else {
                notes[index].parentNode.style.display = "inline-block";
            }
        }
    }, 700);
};

(function createNote(temp1) {
    btnCreate = document.getElementById("btn");
    btnCreate.addEventListener("click", function () {
        var clon = temp1.content.cloneNode(true);
        fragment.appendChild(clon);
        var span = fragment.querySelector(".created");
        var dateCreated = document.createTextNode(getDate());
        span.appendChild(dateCreated);
        var textarea = fragment.querySelector(".innerText");
        container.appendChild(fragment);
        saveNotes(notes);
    });
})(temp1);

function actions(event) {
    var textNode = '', attributeName = event.target.getAttribute("name");
    var textarea = event.target.parentNode.getElementsByTagName("textarea")[0];
    var mainNote = event.target.parentNode;
    var iUpdated = mainNote.querySelector(".updated");
    var iCreated = mainNote.querySelector(".created");
    var spanKey = mainNote.querySelector(".key").innerText;
    var iEdited = mainNote.querySelector(".fa-edit");

    //if i press the "TRASH" little icon(top-left)
    if (attributeName === "trash") {
        if (noteExist(spanKey)) {
            deleteNote(noteExist(spanKey));
        }
        container.removeChild(event.target.parentNode);
    }

    // if i CLICK on edit button
    if (attributeName === "edit") { //if I click the textarea element which is disabled by default
        if (textarea.disabled) {
            enableText(textarea);
            iEdited.style.display = "none";
        }
    }
    //if i press the "SAVE" icon (bottom-right)
    if (attributeName === "save") {
        disableText(textarea);
        iEdited.style.display = "inline";
        var noteContent = {};
        var dateModified = getDate();
        if (iUpdated.innerText.length > 0) {
            iUpdated.innerText = '';
        }
        if (noteExist(spanKey)) {
            updateNote(noteExist(spanKey), dateModified, textarea.value)
            iUpdated.appendChild(document.createTextNode(dateModified));
        }
        else {
            textNode = document.createTextNode(textarea.value);
            textarea.appendChild(textNode);
            noteContent.key = setKey();
            noteContent.dateCreated = iCreated.innerText;
            noteContent.textarea = textarea.value;
            iUpdated.appendChild(document.createTextNode(dateModified));
            noteContent.dateModified = iUpdated.innerText;
            createNote(noteContent);
        }
    }
};

function noteExist(a) {
    for (var i in notes) {
        if (a == notes[i].key) {
            return i;
        }
    }
}

function setKey() {
    var update = new Date();
    return update.getMilliseconds();
}

function getDate() {
    var upDate, mins, secs, time, date;
    upDate = new Date();
    mins = upDate.getMinutes();
    segs = upDate.getSeconds();
    if (mins < "10") {
        mins = '0' + mins;
    }
    if (segs < '10') {
        segs = '0' + segs;
    }
    time = upDate.getHours() + ":" + mins + ":" + segs;
    date = upDate.getFullYear() + "/" + (upDate.getMonth() + 1) + "/" + upDate.getDate();
    return date + " - " + time;
}

function enableText(b) {
    b.disabled = false;
    b.focus();
}

function disableText(b) {
    b.disabled = true;
}

function dragStart(elem) {
    movingElem = elem;
    key = movingElem.querySelector(".key").innerText;
    originKey = noteExist(key);
    elem.className += " hold";
    elem.setAttribute("ondragend", "dragEnd(this)");
}

function dragEnd(elem) {
    elem.className = "mainNote";
    elem.removeAttribute("ondragend");

}

//loop through all notes and adding drag events
for (var key of allNotes) {
    key.addEventListener('dragover', dragOver);
    key.addEventListener('dragenter', dragEnter);
    key.addEventListener('dragleave', dragLeave);
    key.addEventListener('drop', dragDrop);
}

function switchNotes(origin, dest) {
    var aux = notes[origin];
    notes[origin] = notes[dest];
    notes[dest] = aux;
    saveNotes(notes);
}

function dragOver(e) {
    e.preventDefault();
}
function dragEnter(e) {
    e.preventDefault();
    this.className += " hovered";
}
function dragLeave() {
    this.className = "mainNote";
}
function dragDrop(e) {
    this.className = "mainNote";
    key = this.querySelector(".key").innerText;
    destKey = noteExist(key);
    switchNotes(originKey, destKey);
    window.location.reload();
}