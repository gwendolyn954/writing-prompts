//Firebase set up:

import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-e0c15-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app);
const promptsInDB = ref(database, 'prompts');


const inputFieldEl = document.getElementById('input-field') 
const addButtonEl = document.getElementById('add-button') 
const promptListEl = document.getElementById('prompt-list')

addButtonEl.addEventListener('click', function() {
    let inputValue = inputFieldEl.value
    push(promptsInDB, inputValue) //push to database
    clearInputField()
})

onValue(promptsInDB, function(snapshot) {
    if (snapshot.exists()){
        let promptsArray = Object.entries(snapshot.val())

        clearPromptList()

        for (let i = 0; i < promptsArray.length; i++){
            let currentPrompt = promptsArray[i]
            let currentPromptId = currentPrompt[0]
            let currentPromptValue = currentPrompt[1]

            addItemToList(currentPrompt)
        }
    }else {
        promptListEl.innerHTML = `<p>Hmmm...no prompts yet? (Judges Judily)</p>`
    }
})


function clearPromptList(){
    promptListEl.innerHTML = ' '
}

function clearInputField(){
    inputFieldEl.value = ' '  
}

function addItemToList(prompt){
   let promptID = prompt[0]
   let promptValue = prompt[1]

   let newEl = document.createElement('li')
   newEl.textContent = promptValue

   newEl.addEventListener('click', function() {
    console.log(promptID)
    let exactLocationOfPrompt = ref(database,`prompts/${promptID}`)
    remove(exactLocationOfPrompt)
    
   })

   promptListEl.append(newEl)
}

