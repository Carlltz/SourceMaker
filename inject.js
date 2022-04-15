//This will inject the module.
//Add file to src

function injectModule(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement("script");
  s.setAttribute("type", "module");
  s.setAttribute("src", file);
  th.appendChild(s);
}

function add_base_url(url, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement("base_ext");
  s.setAttribute("url", url);
  s.setAttribute("ext_id", chrome.runtime.id);
  th.appendChild(s);
}

//var base_url = chrome.extension.getURL('');
//add_base_url(base_url, 'body');
injectModule(chrome.runtime.getURL("js/firebase/firebase_config.js"), "body");
