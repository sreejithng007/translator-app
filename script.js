// Letter mapping
const mapping = {
  A: "八", B: "爬", C: "妈", D: "飞", E: "大",
  F: "踢", G: "你", H: "老", I: "哥", J: "口",
  K: "好", L: "家", M: "七", N: "谢", O: "中",
  P: "吃", Q: "书", R: "人", S: "走", T: "菜",
  U: "三", V: "妈", W: "住", X: "我", Y: "和", Z: "你"
};

// Reverse mapping (symbols → English)
const reverseMapping = {};
for (let key in mapping) {
  reverseMapping[mapping[key]] = key;
}

// Google Form setup
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSdtNGv4vtewRi84URSUeLyuAO7FPahqgA4WDVd_9gsCHwTgWA/formResponse";
const GOOGLE_FORM_FIELD = "entry.997803431"; // Replace with your actual entry field ID

// Translate English → Symbols
function translateToSymbols() {
  const input = document.getElementById('inputText').value;
  let output = '';

  for (let ch of input) {
    if (mapping[ch.toUpperCase()]) {
      if (ch === ch.toLowerCase() && /[a-z]/.test(ch)) {
        output += `<span class="small-char">${mapping[ch.toUpperCase()]}</span>`;
      } else {
        output += mapping[ch.toUpperCase()];
      }
    } else {
      output += ch;
    }
  }

  document.getElementById('outputText').innerHTML = output;
  sendToGoogleSheet(input);
  document.getElementById('statusMsg').textContent = "Translated to symbols and saved!";
}

// Translate Symbols → English
function translateToEnglish() {
  const input = document.getElementById('inputText').value.trim();
  let output = '';

  for (let ch of input) {
    if (reverseMapping[ch]) {
      output += reverseMapping[ch];
    } else {
      output += ch;
    }
  }

  document.getElementById('outputText').textContent = output;
  document.getElementById('statusMsg').textContent = "Translated back to English!";
}

// Send data to Google Sheet
function sendToGoogleSheet(text) {
  const formData = new FormData();
  formData.append(GOOGLE_FORM_FIELD, text);

  fetch(GOOGLE_FORM_ACTION, {
    method: "POST",
    mode: "no-cors",
    body: formData
  }).then(() => {
    console.log("Data sent to Google Sheet");
  }).catch(err => {
    console.error("Error sending data:", err);
  });
}

// Copy output text
document.getElementById('copyBtn').addEventListener('click', function() {
  const outputDiv = document.getElementById('outputText');
  const tempElement = document.createElement('div');
  tempElement.innerHTML = outputDiv.innerHTML;
  const plainText = tempElement.textContent || tempElement.innerText;

  navigator.clipboard.writeText(plainText).then(() => {
    document.getElementById('statusMsg').textContent = "Output copied to clipboard!";
  }).catch(() => {
    document.getElementById('statusMsg').textContent = "Copy failed. Please try again.";
  });
});

// Add new "Translate Back" button dynamically
const backBtn = document.createElement('button');
backBtn.textContent = "Translate Back";
backBtn.style.background = "#9C27B0";
backBtn.style.marginLeft = "10px";
backBtn.style.color = "white";
backBtn.style.borderRadius = "8px";
backBtn.style.cursor = "pointer";
backBtn.addEventListener('click', translateToEnglish);

// Add it next to the translate button
document.getElementById('translateBtn').after(backBtn);

// Main translate button
document.getElementById('translateBtn').addEventListener('click', translateToSymbols);
