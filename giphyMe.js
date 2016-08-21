function getImageUrl(searchTerm, callback, errorCallback) {

  var searchUrl = 'https://api.giphy.com/v1/gifs/search?limit=1&q=' + encodeURIComponent(searchTerm) + '&api_key=dc6zaTOxFJmzC';

  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Giphy Image Search.
    var response = x.response;
    if (!response || !response.data || !response.data[0]) {
      errorCallback('gphy: No response from Giphy Image search!');
      return;
    }
    var result = response.data[0];
    var imageUrl = result.images.original.url;
    var width = parseInt(result.images.original.width);
    var height = parseInt(result.images.original.height);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'gphy: Unexpected response from the Giphy Image Search API!');
    callback(imageUrl);
  };
  x.onerror = function() {
    errorCallback('gphy: error on search');
  };
  x.send();
}

function giphyReplace(srcPath) {
  console.log('searching for path: ' + srcPath);
  var query = "img[src$='" + srcPath + "']";
  var image = $(query)[0];
  console.log('getting search term for');
  console.log(image);
  var searchTerm = getSearchTerm(image);
  console.log("gphy: -- searchTerm -- " + searchTerm);
  getImageUrl(searchTerm,
    function(imageUrl) {
      image.src = imageUrl;
      image.currentSrc = imageUrl;
    }.bind(this),
    function(errorMessage) {
      console.log('gphy: ' + errorMessage);
    }
  );
}

function getSearchTerm(image) {
  var term = image.alt;
  console.log('gphy: alt text: ' + term);
  if (!term) {
    var ancestors = image.parents();
    for (var i = 0; i < ancestors.length; i++) {
      term = ancestors[i].textContent.trim();
      if (term && term.match(/[^\d\s]/)) { break; }
    }
  }
  return term;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    giphyReplace(request.srcPath);
  }
);
