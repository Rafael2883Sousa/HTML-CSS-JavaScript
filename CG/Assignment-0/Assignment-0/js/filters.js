"use strict";

var Filters = Filters || {}; 

////////////////////////////////////////////////////////////////////////////////
// General utility functions
////////////////////////////////////////////////////////////////////////////////

// Constrain val to the range [min, max]
function clamp(val, min, max) {
  /* Shorthand for:
   * if (val < min) {
   *   return min;
   * } else if (val > max) {
   *   return max;
   * } else {
   *   return val;
   * }
   */
  return ((val < min) ? min : ((val > max) ? max : val));
}

// extract vertex coordinates from a URL string
function stringToCoords( vertsString ) {
  var centers = [];
  var coordStrings = vertsString.split("x");
  var coordsSoFar = 0;
  for (var i = 0; i < coordStrings.length; i++) {
    var coords = coordStrings[i].split("y");
    var x = parseInt(coords[0]);
    var y = parseInt(coords[1]);
    if (!isNaN(x) && !isNaN(y)) {
      centers.push({x: x, y: y})
    }
  }

  return centers;
}

////////////////////////////////////////////////////////////////////////////////
// Filters
////////////////////////////////////////////////////////////////////////////////

// Fill the entire image with color
Filters.fillFilter = function( image, color ) {
  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      // uncomment this line to enable this function
      image.setPixel(x, y, color);
    }
  }
  console.log(color);
  return image;
};

// At each center, draw a solid circle with the specified radius and color
Filters.brushFilter = function( image, radius, color, vertsString ) {
  // centers is an array of (x, y) coordinates that each defines a circle center
  var centers = stringToCoords(vertsString);

  // draw a filled circle centered at every location in centers[].
  // radius and color are specified in function arguments.
  // ----------- STUDENT CODE BEGIN ------------
  for (var i = 0; i < centers.length; i++) {
    var centerX = centers[i].x;
    var centerY = centers[i].y; 

    // Loop through each pixel and calculate its distance from the center
    for (var y = 0; y < image.height; y++) {
      for (var x = 0; x < image.width; x++) {
        var dx = x - centerX;
        var dy = y - centerY;
        var distanceSquared = dx * dx + dy * dy;

        // If the pixel is within the specified radius, set its color
        if (distanceSquared <= radius * radius) {
          image.setPixel(x, y, {data: color, a: 1}); // Assuming the color object matches the expected format for setPixel
        }
      }
    }
  }
  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('brushFilter is not implemented yet');

  return image;
  
};

/*
 * At each center, draw a soft circle with the specified radius and color.
 * Pixel opacity should linearly decrease with the radius from alpha_at_center to 0.
 */
Filters.softBrushFilter = function( image, radius, color, alpha_at_center, vertsString ) {
  // centers is an array of (x, y) coordinates that each defines a circle center
  var centers = stringToCoords(vertsString);

  // draw a filled circle with opacity equals to alpha_at_center at the center of each circle
  // the opacity decreases linearly along the radius and becomes zero at the edge of the circle
  // radius and color are specified in function arguments.
  // ----------- STUDENT CODE BEGIN ------------
  for (var i = 0; i < centers.length; i++) {
    var centerX = centers[i].x;
    var centerY = centers[i].y;

    // Loop through each pixel and calculate its distance from the center
    for (var y = 0; y < image.height; y++) {
      for (var x = 0; x < image.width; x++) {
        var dx = x - centerX;
        var dy = y - centerY;
        var distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate opacity based on distance from the center
        var opacity = Math.max(0, alpha_at_center * (1 - distance / radius));

        // If the pixel is within the specified radius, set its color with calculated opacity
        if (distance <= radius) {
          image.setPixel(x, y, {data: color, a: opacity});
        }
      }
    }
  }
  // ----------- STUDENT CODE END ------------
  // Gui.alertOnce ('softBrushFilter is not implemented yet');

  return image;
};

Filters.customFilter = function( image, value ) {
  // You can use this filter to do whatever you want, for example
  // trying out some new idea or implementing something for the
  // art contest.
  // Currently the 'value' argument will be 1 or whatever else you set
  // it to in the URL. You could use this value to switch between
  // a bunch of different versions of your code if you want to
  // code up a bunch of different things for the art contest.
  // ----------- STUDENT CODE BEGIN ------------
  if (value == 1) {
    for (var y = 0; y < image.height; y++) {
      for (var x = 0; x < image.width; x++) {
        var pixel = image.getPixel(x, y);
        pixel.data[0] = 255 - pixel.data[0]; // Red
        pixel.data[1] = 200 - pixel.data[1]; // Green
        pixel.data[2] = 200 - pixel.data[2]; // Blue
        image.setPixel(x, y, pixel);
      }
    }
  }
  // ----------- STUDENT CODE END ------------
  // Gui.alertOnce ('customFilter is not implemented yet');
  return image;
};
