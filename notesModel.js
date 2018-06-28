var Model = function () {
    var notes = localStorage.getItem("notes");
    notes = notes ? JSON.parse(notes) : [];
    return {
        getNotes : function(){
            return notes;
        },
        saveNotes: function (wholeNotes) {
            localStorage.setItem("notes", JSON.stringify(wholeNotes));
        },
        createNote: function (content) {
            notes.push(content);
            this.saveNotes(notes);
        },
        deleteNote: function (index) {
            notes.splice(index, 1);
            this.saveNotes(notes);
        },
        updateNote: function (index, date, text) {
            notes[index].textarea = text;
            notes[index].dateModified = date;
            this.saveNotes(notes);
        },
        displayExistentNotes: function (key) {
            return {
                "key": notes[key].key,
                "dateCreated": notes[key].dateCreated,
                "dateModified": notes[key].dateModified,
                "textarea": notes[key].textarea
            };
        }
    }
}

var model = Model();






// function saveNotes(wholeNotes) {
        //     localStorage.setItem("notes", JSON.stringify(wholeNotes));
        // }
    
        // function createNote(content) {
        //     notes.push(content);
        //     saveNotes(notes);
        // }
    
        // function deleteNote(index) {
        //     notes.splice(index, 1);
        //     saveNotes(notes);
        // }
    
        // function updateNote(index, date, text) {
        //     notes[index].textarea = text;
        //     notes[index].dateModified = date;
        //     saveNotes(notes);
        // }
    
        // function displayExistentNotes(key) {
        //     return {
        //         "key": notes[key].key,
        //         "dateCreated": notes[key].dateCreated,
        //         "dateModified": notes[key].dateModified,
        //         "textarea": notes[key].textarea
        //     };
        // }