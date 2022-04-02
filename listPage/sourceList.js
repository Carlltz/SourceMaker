let editingSourceNum = -1;
let numberOfSources = 0;
let storage = chrome.storage.largeSync;
let preSourceList;

//chrome.storage.largeSync.set({ a: "" });

document.addEventListener("DOMContentLoaded", function () {
  createList();

  document.addEventListener("copy", (event) => copySources(event));

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
        sourceList.push(
          '<div style="display: flex; flex-direction: row; margin-bottom: 5pt"><div class="unselectable" style="white-space: nowrap; flex-direction: row; margin-right: 5pt" id="btnPair' +
            numberOfSources +
            '"><button id="del' +
            numberOfSources +
            '" class="smallButton redButton text textSmall" style="margin-right: 2pt;">Delete</button><button id="edit' +
            numberOfSources +
            '" class="smallButton blueButton text textSmall">Edit</button>' +
            '</div><div style="flex-wrap: wrap;" id="source' +
            numberOfSources +
            '"><p>' +
            Element[0] +
            ", " +
            Element[1] +
            ". " +
            '<a style="color: #1155cc" href="' +
            Element[2] +
            '" target="_blank">' +
            Element[2] +
            "</a>, [" +
            Element[3] +
            "]</p></div></div>"
        );
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
        '<button id="del' +
        num +
        '" class="mr-1 bg-red-500 hover:bg-red-400 text-white py-0 px-1 border-b-2 border-red-500 hover:border-red-400 rounded">Delete</button><button id="ok' +
        num +
        '" class="bg-green-500 hover:bg-green-400 text-white py-0 px-1 border-b-2 border-green-500 hover:border-green-400 rounded">Ok</button></li>';
      document.getElementById("del" + num).addEventListener("click", function () {
        removeSource(num);
      });
      for (let i = 1; i <= numberOfSources; i++) {
        document.getElementById("del" + i).disabled = true;
      }
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
        element[0] +
        ", " +
        element[1] +
        ". " +
        '<a href="' +
        element[2] +
        '" target="_blank">' +
        element[2] +
        "</a>, [" +
        element[3] +
        "]</label><br><br>";
    });
  }
  if (event) {
    console.log(document.getSelection().toString());
    event.clipboardData.setData("text/plain", document.getSelection());
    //document.getSelection()
    event.preventDefault();
  } else {
    let type = "text/plain";
    let blob = new Blob([copyContent], { type });
    let data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data);
  }
}
