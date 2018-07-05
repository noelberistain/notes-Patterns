var Model = function () {
    var notes = localStorage.getItem("notes");
    notes = notes ? JSON.parse(notes) : [];
    var history = {
        register: [],
        addRegister: function (change) {
            this.register.push(change);
            console.log(this.register)
        },
        undo: function () {
            var lastChange = this.register.pop();
            model.command(lastChange.undo, lastChange.data)
            console.log(this.register);
        }
    };

    return {
        unDrag: function (data) {
            var orders = notes.map(function (element) {
                return data.array[element.key]
            },data.array.map(function (note){ return data.array[note.key] = note.ord }));
            console.log(orders);
            view.assignNewOrders(orders);
        },

        lastChange: function (note) {
            model.updateNote(note.index, note.date, note.lastText);
            view.updateNote(note.date, note.lastText, note.order, note.key);
        },

        showNotes: function (note) {
            console.log(note)
            notes.splice(+note.ord, 0, note)
            this.saveNotes(notes);
            view.showNotes(note);
        },

        deleteUndo: function (index) {
            var key = notes[index].key;
            this.deleteNote(index)
            view.deleteUndo(key);
        },

        undo: function () {
            history.undo();
        },

        command: function (command) {
            model[command] && model[command].apply(model, [].slice.call(arguments, 1));
        },

        addRegister: function (change) {
            history.addRegister(change);
        },

        getNotes: function () {
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

        displayExistentNotes: function (key) { //key => index
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