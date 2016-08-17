// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

console.log('GPHY: plugin loaded');

/**
 * @param {string} searchTerm - Search term for Giphy Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  var searchUrl = 'https://api.giphy.com/v1/gifs/search?limit=1&q=' + encodeURIComponent(searchTerm) + '&api_key=dc6zaTOxFJmzC';
  console.log('GPHY: searching for ' + searchTerm);

  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Giphy image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Giphy Image Search.
    var response = x.response;
    if (!response || !response.data || !response.data[0]) {
      errorCallback('No response from Giphy Image search!');
      return;
    }
    var firstResult = response.data[0];
    console.log(firstResult);
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.images.original.url;
    var width = parseInt(firstResult.images.original.width);
    var height = parseInt(firstResult.images.original.height);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Giphy Image Search API!');
    callback(imageUrl);
  };
  x.onerror = function() {
    errorCallback('error on search');
  };
  x.send();
}

(function() {
  var images = document.getElementsByTagName('img');
  console.log("GPHY");
  console.log(images);

  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var width = image.width;
    var height = image.height;
    var searchTerm = image.alt;

    if (width > 100 && height > 100) {
      getImageUrl(searchTerm,
        function(image, imageUrl) {
          console.log('GPHY: replacing image');
          image.src = imageUrl;
          image.currentSrc = imageUrl;
        }.bind(null, image),
        function(errorMessage) {
          console.log('GPHY: ' + errorMessage);
        }
      );
    }
  }
})();
