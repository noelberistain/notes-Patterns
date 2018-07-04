var aRDom = function () {
    // var dateCreated = '', dateModified = '';

    var lastNoteContent, movingElem, newPlace, movingElemOrder, newPlaceOrder, key, order = 0; //originIndex, destIndex,
    var notes = model.getNotes();
    var fragment = document.createDocumentFragment();
    var temp1 = document.getElementsByTagName("template")[0];
    var container = document.getElementById("container");
    var inputSearch = document.getElementById("inputSearch");
    inputSearch.addEventListener("input", controller.search);

    function actions(event) {
        var noteContent = {};
        var noteInfo = view.getNoteInfo(event) // getNoteInfo(event);
        var indexFromDB = controller.noteExist(noteInfo.spanKey);
        if (noteInfo.attributeName === "trash") {
            if (indexFromDB) {
                var change = {
                    undo: "showNotes",
                    data: notes[indexFromDB]
                }
                model.addRegister(change);
                model.deleteNote(indexFromDB);
            }
            container.removeChild(event.target.parentNode);
        }
        // if i CLICK on edit button
        if (noteInfo.attributeName === "edit") { //if I click the textarea element which is disabled by default
            lastNoteContent = noteInfo.textarea.value;
            if (noteInfo.textarea.disabled) {
                controller.enableText(noteInfo.textarea);
                noteInfo.iEdited.style.display = "none";
            }
        }
        //if i press the "SAVE" icon (bottom-right)
        if (noteInfo.attributeName === "save") {
            controller.disableText(noteInfo.textarea);
            noteInfo.iEdited.style.display = "inline";
            var lastDate = noteInfo.iUpdated.innerText;
            var dateModified = controller.getDate();
            if (noteInfo.iUpdated.innerText.length > 0) {
                noteInfo.iUpdated.innerText = '';
            }
            if (indexFromDB) {
                var change = {
                    undo: "lastChange",
                    data: {
                        key : noteInfo.spanKey,
                        index: indexFromDB,
                        order : noteInfo.ord,
                        date : lastDate,
                        lastText : lastNoteContent,
                    }
                };
                model.addRegister(change);
                model.updateNote(indexFromDB, dateModified, noteInfo.textarea.value);
                noteInfo.iUpdated.appendChild(document.createTextNode(dateModified));
            }
            else {
                noteInfo.textNode = document.createTextNode(noteInfo.textarea.value);
                noteInfo.textarea.appendChild(noteInfo.textNode);
                noteContent.key = noteInfo.spanKey;
                noteContent.ord = noteInfo.ord;
                noteContent.dateCreated = noteInfo.iCreated.innerText;
                noteContent.textarea = noteInfo.textarea.value;
                noteInfo.iUpdated.appendChild(document.createTextNode(dateModified));
                noteContent.dateModified = noteInfo.iUpdated.innerText;
                model.createNote(noteContent);
                var change = {
                    undo: 'deleteUndo',
                    data: controller.noteExist(noteInfo.spanKey)
                }
                model.addRegister(change)
            }
        }
    }

    var container = document.getElementById("container");
    container.addEventListener("click", actions);
    // var notes = model.getNotes();
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
        note.setAttribute("key", num);
        container.appendChild(fragment);
    }

    document.addEventListener("keydown", function (ev) {
        if (ev.key == "z" && ev.ctrlKey)
        ev.preventDefault();
    })
    
    document.addEventListener("keyup", function (ev) {
        if (ev.key == "z" && ev.ctrlKey) {
            model.undo();
        }
    })
    
    notesBackUp = notes;
    return {
        updateNote : function (upDate, text, order, key) {
            var noteDom  = container.querySelector("[key='" + key + "']");
            noteDom.style.order = order;
            noteDom.querySelector(".innerText").value = text;
            noteDom.querySelector(".updated").textContent = upDate;
        },
        showNotes: function (note) {
            showNotes(note.ord, note.key, note.dateCreated,note.dateModified, note.textarea);
        },
        deleteUndo: function (key) {
            container.removeChild(container.querySelector("[key='" + key + "']"));
        },

        newNote: function () {
            var btnCreate = document.getElementById("btn");//document.getElementById("btn");
            btnCreate.addEventListener("click", this.createNew);
        },

        createNew: function () {
            var clon = temp1.content.cloneNode(true);
            fragment.appendChild(clon);
            var main = fragment.querySelector(".mainNote");
            main.setAttribute("style", "order:" + ++order);
            var key = fragment.querySelector(".key");
            key.appendChild(document.createTextNode(controller.setKey()));
            main.setAttribute("key", key.innerText);
            var span = fragment.querySelector(".created");
            var dateCreated = document.createTextNode(controller.getDate());
            span.appendChild(dateCreated);
            var textarea = fragment.querySelector(".innerText");
            container.appendChild(fragment);
        },

        getNoteInfo: function (event) {
            var mainNote = event.target.parentNode;
            return {
                textNode: '',
                attributeName: event.target.getAttribute("name"),
                textarea: mainNote.getElementsByTagName("textarea")[0],
                ord: mainNote.style.order,
                iUpdated: mainNote.querySelector(".updated"),
                iCreated: mainNote.querySelector(".created"),
                spanKey: mainNote.querySelector(".key").innerText,
                iEdited: mainNote.querySelector(".fa-edit")
            }

        },

        dragStart: function (elem) {
            movingElem = elem;
            key = movingElem.querySelector(".key").innerText;
            originIndex = controller.noteExist(key);
            movingElem.className += " hold";
            movingElem.setAttribute("ondragend", "view.dragEnd(this)");
        },

        dragEnter: function (elem) {
            newPlace = elem;
            key = newPlace.querySelector(".key").innerText;
            destIndex = controller.noteExist(key);
            newPlace.className += " hovered";
        },

        dragLeave: function (elem) {
            elem.className = "mainNote";
        },

        dragEnd: function () {
            movingElemOrder = parseInt(movingElem.style.order);
            newPlaceOrder = parseInt(newPlace.style.order);
            newPlace.className = "mainNote";
            var orders = this.getOrders(notes);
            var reordered = this.reorder(orders, movingElemOrder, newPlaceOrder);
            this.assignNewOrders(reordered);
            model.saveNotes(notes);
            newPlace.removeAttribute("ondragend");
            movingElem.removeAttribute("ondragend");
            
        },

        reorder: function (arr, origin, dest) {
            var indexDest = arr.findIndex(function (ord) { return +ord === +dest });
            var indexOrigin = arr.findIndex(function (ord) { return +ord === +origin });
            // console.log(indexDest, indexOrigin)
            // console.log(destIndex, originIndex)
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
        },

        getOrders: function (a) {
            var x = [];
            for (var key in a) {
                if (a.hasOwnProperty(key)) {
                    x.push(container.querySelector("[key='" + a[key].key + "']").style.order);
                }
            }
            return x;
        },

        assignNewOrders: function (newOrders) {
            for (var i = 0; i < notes.length; i++) {
                notes[i].ord = newOrders[i];
                container.querySelector("[key='" + notes[i].key + "']").style.order = newOrders[i];
            }
            notes.sort(function orderByOrd(note, next) {
                return +note.ord > +next.ord;
            });
        }
    }
}

var view = aRDom();