import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://playground-e0c15-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const promptsInDB = ref(database, "prompts");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl  = document.getElementById("add-button");
const promptListEl = document.getElementById("prompt-list");
const statusEl     = document.getElementById("status");

// Keep a local lowercase set for dup checks
let currentPromptsLC = new Set();

function say(msg) {
  if (statusEl) statusEl.textContent = msg || "";
}

function clearPromptList(){
  promptListEl.innerHTML = ""; 
}

function clearInputField(){
  inputFieldEl.value = ""; 
}

// Add by button
addButtonEl.addEventListener("click", handleAdd);
// Add by Enter key
inputFieldEl.addEventListener("keydown", (e)=>{
  if (e.key === "Enter") handleAdd();
});

function handleAdd(){
  const raw = inputFieldEl.value;
  const value = (raw || "").trim();

  if (!value){
    say("Please add a Romanticism phrase (e.g., “Byronic hero”).");
    return;
  }

  // Block duplicates (case-insensitive)
  if (currentPromptsLC.has(value.toLowerCase())){
    say("That phrase already exists—try a different one.");
    return;
  }

  push(promptsInDB, value)
    .then(()=>{
      say("Phrase added!")
      clearInputField();
    })
    .catch(()=>{
      say("Could not add phrase. Please try again.");
    });
}

onValue(promptsInDB, function(snapshot) {
  clearPromptList();
  currentPromptsLC = new Set();

  if (snapshot.exists()){
    const promptsArray = Object.entries(snapshot.val());

    // Fill set for dup check and render
    for (let i = 0; i < promptsArray.length; i++){
      const [id, val] = promptsArray[i];
      currentPromptsLC.add(String(val).toLowerCase());
      addItemToList([id, val]);
    }

    if (promptsArray.length === 0){
      promptListEl.innerHTML = `<p>Hmmm...no prompts yet? (Judges Judily)</p>`;
    }
  } else {
    promptListEl.innerHTML = `<p>Hmmm...no prompts yet? (Judges Judily)</p>`;
  }
});

function addItemToList(prompt){
  const promptID = prompt[0];
  const promptValue = prompt[1];

  const li = document.createElement("li");
  li.textContent = promptValue;
  li.title = "Click to claim this phrase";

  li.addEventListener("click", function() {
    // Claim = remove globally
    const exactLocationOfPrompt = ref(database, `prompts/${promptID}`);
    remove(exactLocationOfPrompt)
      .then(()=> say("Claimed—this phrase is now yours."))
      .catch(()=> say("Could not claim. Try again."));
  });

  promptListEl.append(li);
}

