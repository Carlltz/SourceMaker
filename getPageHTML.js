siteName = getSite();
ytFetch = null;
function start() {
  if (document.getElementById("channel-container")) {
    afterSetup();
  } else if (siteName.toLowerCase() == "youtube" && !document.getElementById("watch7-content")) {
    let id = getVideoId();
    fetch(
      "https://www.googleapis.com/youtube/v3/videos?id=" +
        id +
        "&part=snippet&key=AIzaSyDauIAQOBb5H4rZqxnipSJieQfuGnkeJIs"
    ).then((response) => {
      response.json().then((res) => {
        ytFetch = res.items[0].snippet;
        afterSetup();
      });
    });
  } else {
    afterSetup();
  }
}
start();

function getVideoId() {
  return window.location.href.match(/(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/i)[3];
}

function afterSetup() {
  chrome.runtime.sendMessage({
    action: "getHTML",
    title: getTitle(),
    site: siteName,
    url: getURL(),
    dateP: getDateP(),
    author: getAuthor(),
  });
}

function getTitle() {
  let exceptionTit = exceptionTitle();
  if (exceptionTit != null) return exceptionTit;
  let response;
  let sitething = document.querySelectorAll("[property]");
  for (let i = 0; i < sitething.length; i++) {
    if (sitething[i].getAttribute("property") == "og:title") {
      //response = sitething[i].getAttribute("content").split(/[-:–\|]/g);
      response = sitething[i].getAttribute("content").split("|");
      return response[0];
    }
  }
  try {
    response = document.getElementsByTagName("title")[0].innerText.split(/[-:–\|]/g);
    response = response[0];
  } catch {
    response = window.location.href.split(/\//g);
    response = response[response.length - 1].replace(/-/g, " ");
    response = response.replace(/.pdf/g, "");
  }
  return response;
}
function exceptionTitle() {
  if (siteName.toLowerCase() == "wikipedia") {
    response = document.getElementsByTagName("title")[0].innerText.split(/[-:–\|]/g);
    return response[0].trim();
  }
}

function getSite() {
  // Really not optimal to loop through sitething, should be able to find "value" in sitething instead...
  let sitething = document.querySelectorAll("[property]");
  for (let i = 0; i < sitething.length; i++) {
    if (sitething[i].getAttribute("property") == "og:site_name") {
      return sitething[i].getAttribute("content");
    }
  } //Continues if no elements with the property "og:site_name"
  let site = getUrlSite();
  let titleSite = document.getElementsByTagName("title")[0].innerText;
  let index = titleSite.toLowerCase().search(site.toLowerCase());
  if (index != -1) {
    return titleSite.substring(index, index + site.length);
  }

  return site;

  function getTitleSiteOLD(part) {
    let response;
    response = document.getElementsByTagName("title")[0].innerText;

    response = response.split(/-:–\|\./g);
  }

  function getUrlSite() {
    let url = window.location.href.split(/\./g);
    //console.log(url[0].match(/https?:\/\/(.{0,3}\.)?/g));
    return url[1][0].toUpperCase() + url[1].slice(1);
  }
}

function getURL() {
  if (siteName.toLowerCase() != "wikipedia") return window.location.href;
  else {
    let permaLink = document.getElementById("t-permalink");
    return "https://" + document.documentElement.lang + ".wikipedia.org" + permaLink.children[0].getAttribute("href");
  }
}

function getDateP() {
  let exceptionDate = exceptionsDateP();
  if (exceptionDate != null) return exceptionDate;
  return "";
}

function getAuthor() {
  let exceptionAuthor = exceptionsAuthor();
  if (exceptionAuthor != null) return exceptionAuthor;
  return "";
}

function exceptionsDateP() {
  if (ytFetch != null) return ytFetch.publishedAt.split("T")[0];
  if (siteName.toLowerCase() == "youtube") {
    let date = document.getElementById("watch7-content");
    if (date) {
      date = date.children;
      for (let i = 0; i < date.length; i++) {
        if (date[i].getAttribute("itemprop") == "datePublished") {
          return date[i].getAttribute("content");
        }
      }
    }
  }
  return null;
}

function exceptionsAuthor() {
  if (ytFetch != null) return ytFetch.channelTitle;
  if (siteName.toLowerCase() == "youtube") {
    let channel = document.getElementById("watch7-content");
    if (channel) {
      channel = channel.children;
      for (let i = 0; i < channel.length; i++) {
        if (channel[i].getAttribute("itemprop") == "author") {
          return channel[i].children[1].getAttribute("content");
        }
      }
    }
  }
  return null;
}
