let editingSourceNum = -1;
let numberOfSources = 0;
let storage = chrome.storage.local;

document.addEventListener("DOMContentLoaded", function () {
  createList();

  document.getElementById("clear").addEventListener("click", function () {
    let choice = confirm("Do you wish to empty this sourcelist? (This cannot be undone!)");
    if (choice) {
      storage.set({ source: "" });
      createList();
    }
  });

  document.getElementById("update").addEventListener("click", function () {
    createList();
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
  storage.get("source", function (data) {
    if (data.source == "") {
      document.getElementById("sources").innerHTML = "Add some sources to begin!";
      document.getElementById("btnList").innerHTML = "";
    } else {
      let preSourceList = data.source;
      let sourceList = [];
      let buttonList = [];
      preSourceList.forEach((Element) => {
        numberOfSources++;
        buttonList.push(
          '<li id="btnPair' +
            numberOfSources +
            '"><button id="del' +
            numberOfSources +
            '" class="mr-1 bg-red-500 hover:bg-red-400 text-white py-0 px-1 border-b-2 border-red-500 hover:border-red-400 rounded">Delete</button><button id="edit' +
            numberOfSources +
            '" class="bg-blue-500 hover:bg-blue-400 text-white py-0 px-1 border-b-2 border-blue-500 hover:border-blue-400 rounded">Edit</button></li>'
        );
        sourceList.push(
          '<li style="display: flex; flex-wrap: wrap;" id="source' +
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
            "]</p></li>"
        );
      });
      document.getElementById("btnList").innerHTML = buttonList.join("");
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
    storage.get("source", function (data) {
      let edSource = data.source[num - 1];
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
  storage.get("source", function (data) {
    let sources = data.source;
    sources.splice(num - 1, 1, sourceNow);
    storage.set({ source: sources });
    createList();
  });
  editingSourceNum = -1;
}

function removeSource(num) {
  let choice = confirm("Are you sure you want to remove this source?");
  if (choice) {
    storage.get("source", function (data) {
      let sourceList = data.source;
      sourceList.splice(num - 1, 1);
      storage.set({ source: sourceList });
      createList();
    });
  }
}
