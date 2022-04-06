siteName = getSite();
chrome.runtime.sendMessage({
  action: "getHTML",
  title: getTitle(),
  site: siteName,
  url: getURL(),
  dateP: getPageDate(),
  author: getAuthor(),
});

function getTitle() {
  let response;
  try {
    response = document.getElementsByTagName("title")[0].innerText.split(/[-:–\|]/g);
    response = response[0].trim();
  } catch (e) {
    response = window.location.href.split(/\//g);
    response = response[response.length - 1].replace(/-/g, " ");
    response = response.replace(/.pdf/g, "");
  }
  return response;
}

function getSite() {
  try {
    // Really not optimal to loop through sitething, should be able to find "value" in sitething instead...
    for (let i = 0; i < 10; i++) {
      sitething = document.querySelectorAll("[property]")[i];
      if (sitething.getAttribute("property") == "og:site_name") {
        return sitething.content;
      }
    }
    throw "Continue!";
  } catch {
    var siteUrl = getUrlSite();
  }

  function getTitleSite(part) {
    let response;
    response = document.getElementsByTagName("title")[0].innerText;
    if (part == "a") {
      return response;
    }
    response = response.split(/-|:|–|\||\./g);
    let preResponse = response[response.length - 1];
    if (["se", "com", "net"].includes(preResponse)) {
      preResponse = response[response.length - 2];
    }
    return preResponse.trim();
  }

  function getUrlSite() {
    let url = window.location.href.split(/\./g);
    if (["www", "https://www", "http://www", "http://"].includes(url[0])) {
      return url[1][0].toUpperCase() + url[1].slice(1);
    } else {
      url = url[0].split(/\//g);
      return url[url.length - 1];
    }
  }

  try {
    var siteTitle = getTitleSite("a");
  } catch {
    return siteUrl[0].toUpperCase() + siteUrl.slice(1);
  }
  if (siteTitle.toLowerCase().includes(siteUrl.toLowerCase())) {
    return siteUrl[0].toUpperCase() + siteUrl.slice(1);
  } else {
    return getTitleSite("");
  }
}

function getURL() {
  if (siteName.toLowerCase() != "wikipedia") return window.location.href;
  else {
    let permaLink = document.getElementById("t-permalink");
    return "https://" + document.documentElement.lang + ".wikipedia.org" + permaLink.children[0].getAttribute("href");
  }
}

function getPageDate() {
  return "";
}

function getAuthor() {
  return "";
}
