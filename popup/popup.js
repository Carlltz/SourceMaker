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
      console.log(latestWebsite);
      if (latestWebsite.url == request.url) {
        document.getElementById("title").innerText = latestWebsite.title;
        document.getElementById("site").innerText = latestWebsite.site;
        document.getElementById("date").innerText = latestWebsite.date;
        sourceNow = latestWebsite.url;
      } else {
        let today = new Date().toLocaleDateString("SE");
        //content.innerText = request.site + ', "' + request.title + '". ' + request.url + ", [" + today + "]";
        document.getElementById("title").innerText = request.title;
        document.getElementById("site").innerText = request.site;
        document.getElementById("date").innerText = today;
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
    let sourceNew = [
      document.getElementById("site").value,
      document.getElementById("title").value,
      sourceNow,
      document.getElementById("date").value,
    ];
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
  document.getElementById("date").addEventListener("change", function () {
    updateStorage();
  });
});

function updateStorage() {
  let newLatest = {
    site: document.getElementById("site").value,
    title: document.getElementById("title").value,
    url: sourceNow,
    date: document.getElementById("date").value,
  };
  chrome.storage.sync.set({ latestWebsite: newLatest });
}
