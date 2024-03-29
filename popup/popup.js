let sourceNow;

chrome.runtime.onMessage.addListener(function (request) {
  let latestWebsite;
  chrome.storage.sync.get("latestWebsite", function (data) {
    if (data.latestWebsite == "" || data.latestWebsite == undefined) {
      latestWebsite = { url: "falseURL" };
    } else {
      latestWebsite = data.latestWebsite;
    }

    if (request.action == "getHTML") {
      console.log(request);
      console.log(latestWebsite);
      if (latestWebsite.url == request.url) {
        document.getElementById("title").innerText = latestWebsite.title;
        document.getElementById("site").innerText = latestWebsite.site;
        document.getElementById("dateH").innerText = latestWebsite.dateH;
        document.getElementById("dateP").innerText = request.dateP;
        document.getElementById("author").innerText = latestWebsite.author;
        sourceNow = latestWebsite.url;
      } else {
        let today = new Date().toLocaleDateString("sv-se");
        //content.innerText = request.site + ', "' + request.title + '". ' + request.url + ", [" + today + "]";
        document.getElementById("title").innerText = request.title;
        document.getElementById("site").innerText = request.site;
        document.getElementById("dateH").innerText = today;
        document.getElementById("dateP").innerText = request.dateP;
        document.getElementById("author").innerText = request.author;
        sourceNow = request.url;
        updateStorage();
      }
    }
  });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["getPageHtml.js"],
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("openSourceList").addEventListener("click", function () {
    chrome.tabs.create({ url: "/listPage/sourceList.html" });
  });

  document.getElementById("saveSource").addEventListener("click", function () {
    test();
    let sourceNew = {
      site: document.getElementById("site").value,
      title: document.getElementById("title").value,
      url: sourceNow,
      dateH: document.getElementById("dateH").value,
      dateP: document.getElementById("dateP").value,
      author: document.getElementById("author").value,
    };
    console.log(sourceNew);
    chrome.storage.largeSync.get("a", function (data) {
      if (data.a == "" || data.a == undefined) {
        chrome.storage.largeSync.set({ a: [sourceNew] });
      } else {
        let newSource = data.a;
        newSource.push(sourceNew);
        chrome.storage.largeSync.set({ a: newSource });
      }
    });
  });

  document.getElementById("title").addEventListener("change", function () {
    updateStorage();
  });
  document.getElementById("site").addEventListener("change", function () {
    updateStorage();
  });
  document.getElementById("dateH").addEventListener("change", function () {
    updateStorage();
  });
  document.getElementById("dateP").addEventListener("change", function () {
    updateStorage();
  });
  document.getElementById("author").addEventListener("change", function () {
    updateStorage();
  });
  document.getElementById("report").addEventListener("click", function () {
    document.getElementById("standardDIV").classList.add("displayNone");
    document.getElementById("reportDIV").classList.remove("displayNone");
  });
  document.getElementById("sendForm").addEventListener("click", function () {
    document.getElementById("reportDIV").classList.add("displayNone");
    document.getElementById("standardDIV").classList.remove("displayNone");
  });
});

function updateStorage() {
  let newLatest = {
    site: document.getElementById("site").value,
    title: document.getElementById("title").value,
    url: sourceNow,
    dateH: document.getElementById("dateH").value,
    dateP: document.getElementById("dateP").value,
    author: document.getElementById("author").value,
  };
  chrome.storage.sync.set({ latestWebsite: newLatest });
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function test() {
  let addedPopup = document.getElementById("addedSource");
  addedPopup.classList.remove("hide");
  addedPopup.classList.add("displayNone");
  addedPopup.classList.remove("displayNone");
  await sleep(400);
  addedPopup.classList.add("hide");
  await sleep(1000);
  addedPopup.classList.remove("hide");
  addedPopup.classList.add("displayNone");
}
