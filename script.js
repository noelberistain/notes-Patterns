var fragment, temp1, dateCreated = '', dateModified = '';
fragment = document.createDocumentFragment();
temp1 = document.getElementsByTagName("template")[0];
var container = document.getElementById("container");
var notes = localStorage.getItem("notes");
notes = notes ? JSON.parse(notes) : [];

if (notes.length > 0) {
    for (var key in notes) {
        showNotes(temp1,
            notes[key].key,
            notes[key].dateCreated,
            notes[key].dateModified,
            notes[key].textarea);
    }
}

function showNotes(temp1, num, crtd, updtd, txt) {
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
var inputSearch = document.getElementById("inputSearch");
inputSearch.addEventListener("input", function (e) {
    var searchingText = e.target.value;
    clearTimeout(timerId);
    timerId = setTimeout(function () {
        var notes = document.getElementsByTagName("textarea");
        for (var index = 0; index < notes.length; index++) {
            console.log(searchingText)
            if ((notes[index].textContent).indexOf(searchingText) === -1) {
                console.dir(notes[index].parentElement)
                notes[index].parentElement.style.display = "none";
            }
            else {
                console.dir(notes[index].parentNode)
                notes[index].parentNode.style.display = "block";
            }
        }
    }, 500);
    
});

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
    });
})(temp1);

container.addEventListener("click", function (event) {
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
            notes.splice(noteExist(spanKey), 1);
            localStorage.setItem("notes", JSON.stringify(notes));
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
            notes[noteExist(spanKey)].textarea = textarea.value;
            notes[noteExist(spanKey)].dateModified = dateModified;
            iUpdated.appendChild(document.createTextNode(dateModified));
            localStorage.setItem("notes", JSON.stringify(notes));
        }
        else {
            textNode = document.createTextNode(textarea.value);
            textarea.appendChild(textNode);
            noteContent.key = setKey();
            noteContent.dateCreated = iCreated.innerText;
            noteContent.textarea = textarea.value;
            iUpdated.appendChild(document.createTextNode(dateModified));
            noteContent.dateModified = iUpdated.innerText;
            notes.push(noteContent);
            localStorage.setItem("notes", JSON.stringify(notes));
        }
    }
});

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
    date = upDate.getFullYear() + "/" + upDate.getMonth() + "/" + upDate.getDate();
    return date + " - " + time;
}
function enableText(b) {
    b.disabled = !b.disabled || false || b.setAttribute("style", "disable = false");
    b.focus();
    // b.preventDefault();
}
function disableText(b) {
    b.disabled = true;
}