
function sendGiphyMessage(info, tab) {
  console.log(info.pageUrl);
  console.log(info.srcUrl);
  var srcPath = info.srcUrl.replace(info.pageUrl, "");
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "giphinate_image", srcPath: srcPath });
  });
}

chrome.contextMenus.create({"title": 'Giphy Madness', "contexts":["image"], "onclick": sendGiphyMessage });

