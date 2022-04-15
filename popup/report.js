import { db } from "../js/firebase/firebase_config.js";
import { collection, addDoc } from "../js/firebase/firebase-firestore.js";

function sendReport(url) {
  const docRef = addDoc(collection(db, "reports"), {
    content: document.getElementById("reportText").innerText,
    url: url,
  });
  console.log("sent");
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action == "sendReport") sendReport(request.url);
});
