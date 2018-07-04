var Control = function () {
    var timerId;
    function search(e) {
        var searchingText = e.target.value;
        clearTimeout(timerId);
        timerId = setTimeout(function () {
            var domNotes = document.getElementsByTagName("textarea");
            for (var index = 0; index < domNotes.length; index++) {
                if ((domNotes[index].textContent).indexOf(searchingText) === -1) {
                    domNotes[index].parentElement.style.display = "none";
                }
                else {
                    domNotes[index].parentNode.style.display = "inline-block";
                }
            }
        }, 700);
    };

    function noteExist(a) {
        var notes = model.getNotes();
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
        secs = upDate.getSeconds();
        if (mins < "10") {
            mins = '0' + mins;
        }
        if (secs < '10') {
            secs = '0' + secs;
        }
        time = upDate.getHours() + ":" + mins + ":" + secs;
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

    
    return {
        search: search,
        noteExist: noteExist,
        setKey: setKey,
        getDate: getDate,
        enableText: enableText,
        disableText: disableText
    }
}

var controller = Control();