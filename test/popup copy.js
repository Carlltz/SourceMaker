let sources;
let sourceNow;
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getHTML") {
    let today = new Date().toLocaleDateString("SE");
    //content.innerText = request.site + ', "' + request.title + '". ' + request.url + ", [" + today + "]";
    document.getElementById("title").innerText = request.title;
    document.getElementById("site").innerText = request.site;
    document.getElementById("date").innerText = today;
    sourceNow = request.url;
  } else if (request.action == "OG") {
    document.getElementById("ogSiteName").innerText = request.sitename;
  }
});

chrome.tabs.executeScript(null, { file: "getPageHTML.js" });

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("openSourceList").addEventListener("click", function () {
    chrome.tabs.create({ url: "sourceList.html" });
  });

  document.getElementById("saveSource").addEventListener("click", function () {
    let sourceNew = [
      document.getElementById("site").value,
      document.getElementById("title").value,
      sourceNow,
      document.getElementById("date").value,
    ];
    chrome.storage.sync.get("source1", function (data) {
      if (data.source1 == "") {
        alert("Hej");
        chrome.storage.sync.set({ source1: [sourceNew] });
        chrome.storage.sync.set({ numSource: 1 });
      } else {
        chrome.storage.sync.get("numSource", function (dataNum) {
          for (let i = 2; i <= dataNum.numSource; i++) {
            chrome.storage.sync.set({ [source]: i }, sourceNew);
            chrome.storage.sync.set({ numSource: i + 1 });
          }
        });
      }
    });
  });
});

/* // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClUA-u_UyipmlnjQu1MJZLOOahMcdHMso",
  authDomain: "sourcemaker-b299c.firebaseapp.com",
  projectId: "sourcemaker-b299c",
  storageBucket: "sourcemaker-b299c.appspot.com",
  messagingSenderId: "1020163270073",
  appId: "1:1020163270073:web:1c6289961d078f1c670268",
  measurementId: "G-6NQCE8CG5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); */
