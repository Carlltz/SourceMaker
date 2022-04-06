let editingSourceNum = -1;
let numberOfSources = 0;
let storage = chrome.storage.largeSync;
let preSourceList;

//chrome.storage.largeSync.set({ a: "" });

document.addEventListener("DOMContentLoaded", function () {
  createList();

  //document.addEventListener("copy", (event) => copySources(event));

  document.getElementById("clear").addEventListener("click", function () {
    let choice = confirm("Do you wish to empty this sourcelist? (This cannot be undone!)");
    if (choice) {
      storage.set({ a: "" });
      createList();
    }
  });

  document.getElementById("update").addEventListener("click", function () {
    createList();
  });

  document.getElementById("copySources").addEventListener("click", function () {
    copySources();
  });

  document.getElementById("body").addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
      if (editingSourceNum != -1) {
        okEdit(editingSourceNum);
      }
    }
  });
});

function createList() {
  editingSourceNum = -1;
  numberOfSources = 0;
  document.getElementById("sources").innerHTML = "";
  storage.get("a", function (data) {
    if (data.a == "" || data.a == undefined) {
      document.getElementById("sources").innerHTML = "Add some sources to begin!";
      document.getElementById("btnList").innerHTML = "";
    } else {
      preSourceList = data.a;
      let sourceList = [];
      preSourceList.forEach((Element) => {
        numberOfSources++;

        let source =
          '<div style="display: flex; flex-direction: row; margin-bottom: 5pt; align-items: center;"><div class="unselectable" style="white-space: nowrap; flex-direction: row; margin-right: 5pt" id="btnPair' +
          numberOfSources +
          '"><button id="del' +
          numberOfSources +
          '" class="smallButton redButton text textSmall" style="margin-right: 2pt;">Delete</button><button id="edit' +
          numberOfSources +
          '" class="smallButton blueButton text textSmall">Edit</button>' +
          '</div><div style="flex-wrap: wrap;" id="source' +
          numberOfSources +
          '"><p>';
        if (Element.author == "") {
          source +=
            Element.site +
            ". " +
            "<i>" +
            Element.title +
            "</i>" +
            ". " +
            '<a style="color: #1155cc; text-decoration: underline;" href="' +
            Element.url +
            '" target="_blank">' +
            Element.url +
            "</a> (Hämtad " +
            Element.dateH +
            ")</p></div></div>";
        } else {
          source +=
            Element.author +
            ". " +
            "<i>" +
            Element.title +
            "</i>" +
            ". " +
            Element.site +
            ". " +
            '<a style="color: #1155cc; text-decoration: underline;" href="' +
            Element.url +
            '" target="_blank">' +
            Element.url +
            "</a> (Hämtad " +
            Element.dateH +
            ")</p></div></div>";
        }
        sourceList.push(source);
      });
      document.getElementById("sources").innerHTML = sourceList.join("");
      for (let i = 1; i <= numberOfSources; i++) {
        document.getElementById("del" + i).addEventListener("click", function () {
          removeSource(i);
        });
      }
      for (let i = 1; i <= numberOfSources; i++) {
        document.getElementById("edit" + i).addEventListener("click", function () {
          editSource(i);
        });
      }
    }
  });
}

function editSource(num) {
  if (editingSourceNum != -1) {
    let stopEditing = confirm("You're currently editing another source. Would you like to stop editing that one?");
    if (stopEditing) {
      okEdit(editingSourceNum);
    }
  } else {
    editingSourceNum = num;
    storage.get("a", function (data) {
      let edSource = data.a[num - 1];
      let editSource = document.getElementById("source" + num);
      editSource.innerHTML =
        '<p><span id="title" class="input rounded-3 px-2 border-solid border-black border-2" role="textbox" contenteditable>' +
        edSource[0] +
        '</span>, <span id="site" class="input rounded-3 px-2 border-solid border-black border-2" role="textbox" contenteditable>' +
        edSource[1] +
        '</span>. <span id="url" style="color: #1155cc" class="input rounded-3 px-2 border-solid border-black border-2" role="textbox" contenteditable>' +
        edSource[2] +
        '</span>, [<span id="date" class="input rounded-3 px-2 border-solid border-black border-2" role="textbox" contenteditable>' +
        edSource[3] +
        "</span>]</p>";

      document.getElementById("btnPair" + num).innerHTML =
        '<button id="ok' + num + '" class="smallButton greenButton text textSmall">Ok</button></li>';
      document.getElementById("ok" + num).addEventListener("click", function () {
        okEdit(num);
      });
    });
  }
}

function okEdit(num) {
  let sourceNow = [
    document.getElementById("title").innerText,
    document.getElementById("site").innerText,
    document.getElementById("url").innerText,
    document.getElementById("date").innerText,
  ];
  storage.get("a", function (data) {
    let sources = data.a;
    sources.splice(num - 1, 1, sourceNow);
    storage.set({ a: sources });
    createList();
  });
  editingSourceNum = -1;
}

function removeSource(num) {
  let choice = confirm("Are you sure you want to remove this source?");
  if (choice) {
    storage.get("a", function (data) {
      let sourceList = data.a;
      sourceList.splice(num - 1, 1);
      storage.set({ a: sourceList });
      createList();
    });
  }
}

function copySources(event = undefined) {
  let copyContent = "";
  if (preSourceList == "" || preSourceList == undefined) {
    copyContent = "Nothing to copy...";
  } else {
    preSourceList.forEach((element) => {
      copyContent +=
        "<label>" +
        element.site +
        ", " +
        element.title +
        ". " +
        '<a href="' +
        element.url +
        '" target="_blank">' +
        element.url +
        "</a>, [" +
        element.dateH +
        "]</label><br><br>";
    });
  }
  if (event) {
    console.log(document.getSelection().toString());
    event.clipboardData.setData("text/html", document.getSelection());
    //document.getSelection()
    event.preventDefault();
  } else {
    let type = "text/html";
    let blob = new Blob([copyContent], { type });
    let data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data);
  }
}
