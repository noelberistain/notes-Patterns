var notes = localStorage.getItem("notes");
notes = notes ? JSON.parse(notes) : [];

function saveNotes(wholeNotes){
    localStorage.setItem("notes", JSON.stringify(wholeNotes));
}

function createNote(content) {
    notes.push(content);
    saveNotes(notes);
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes(notes);
}

function updateNote(index, date, text) {
    notes[index].textarea = text;
    notes[index].dateModified = date;
    saveNotes(notes);
}

function showExistentNotes() {

}