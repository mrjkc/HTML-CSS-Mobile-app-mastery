var db = new Dexie("secret_vault");
db.version(1).stores({
    vault: 'label,data'
});

var btnAdd = document.querySelector("#btnAdd");
btnAdd.addEventListener("click", function() {
    var label = document.querySelector("#label").value;
    var data = document.querySelector("#data").value;
    if (label.length<4 || data.length==0) {
        alert("You need to enter a label and the data");
    } else {
        var object = {
            label: label,
            data: data
        }
        db.vault.put(object).then(function() {
            updateList();  
        });
    }
});

function updateList() {
    db.vault.orderBy('label').toArray()
        .then(function(collection) {
            var keyphrase = document.querySelector("#keyphrase").value;
            var html = "";
            for (var element of collection) {
                html += "<dt onclick='remove(this)'>" + element.label + "</dt>";
                if (keyphrase=="html5") {
                    html += "<dd>" + element.data + "</dd>";
                } else {
                    html += "<dd>********</dd>"
                }
            }
            var list = document.querySelector("#list");
            list.innerHTML = html;

            var empty = document.querySelector("#empty");
            if (collection.length==0) {
                empty.style.display = "block";
            } else {
                empty.style.display = "none";
            }
        });
}

function remove(dt) {
    if (confirm("Do you want to delete this entry?")) {
        db.vault.where("label").equals(dt.innerHTML)
            .delete().then(function() {
                updateList();
            });
    }
}

// We are going to refresh the list when the user is typing
var keyphrase = document.querySelector("#keyphrase");
keyphrase.addEventListener("keyup", function() {
    updateList();
})

// When the page loads I want to update the list
updateList();