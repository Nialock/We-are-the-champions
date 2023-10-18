import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-the-champions-solo-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "Endorsements")

const inputFieldEl = document.getElementById("input-field")
const inputFieldFromEl = document.getElementById("input-field-from")
const inputFieldToEl = document.getElementById("input-field-to")
const publishBtn = document.getElementById("publish-btn")
const endorsementsListEl = document.getElementById("endorsements-list")

publishBtn.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    let inputValueFrom = inputFieldFromEl.value
    let inputValueTo = inputFieldToEl.value

    push(endorsementListInDB, { value: inputValue, from: inputValueFrom, to: inputValueTo })

    clearInputFieldEl()
})

function clearInputFieldEl() {
    inputFieldEl.value = ""
    inputFieldFromEl.value = ""
    inputFieldToEl.value = ""
}

function clearEndorsementsListEl() {
    endorsementsListEl.innerHTML = ""
}

onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsObject = snapshot.val()

        clearEndorsementsListEl()

        for (let itemID in itemsObject) {
            let currentItem = itemsObject[itemID]

            appendItemToEndorsementsListEl({ id: itemID, ...currentItem })
        }
    } else {
        endorsementsListEl.innerHTML = ""
    }
});

function appendItemToEndorsementsListEl(item) {
    let itemValue = item.value
    let itemFrom = item.from
    let itemTo = item.to

    const li = document.createElement('li')
    const endorsementDiv = document.createElement('div')
    const toDiv = document.createElement('div')
    const senderDiv = document.createElement('div')

    endorsementDiv.textContent = itemValue
    toDiv.textContent = 'To: ' + itemTo
    senderDiv.textContent = 'From: ' + itemFrom

    endorsementDiv.classList.add('endorsement')
    toDiv.classList.add('bold-text')
    senderDiv.classList.add('bold-text')

    li.appendChild(toDiv)
    li.appendChild(endorsementDiv)
    li.appendChild(senderDiv)

    li.classList.add('endorsement-item')

    endorsementsListEl.insertBefore(li, endorsementsListEl.firstChild)
}
