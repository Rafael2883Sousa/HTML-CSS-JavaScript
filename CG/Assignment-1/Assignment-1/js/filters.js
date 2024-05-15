"use strict";

const Filters = {};

////////////////////////////////////////////////////////////////////////////////
// General utility functions
////////////////////////////////////////////////////////////////////////////////

// Hardcoded Pi value
// const pi = 3.14159265359;
const pi = Math.PI; 

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
    return val < min ? min : val > max ? max : val;
}

// Extract vertex coordinates from a URL string
function stringToCoords(vertsString) {
    const centers = [];
    const coordStrings = vertsString.split("x");
    for (let i = 0; i < coordStrings.length; i++) {
        const coords = coordStrings[i].split("y");
        const x = parseInt(coords[0]);
        const y = parseInt(coords[1]);
        if (!isNaN(x) && !isNaN(y)) {
            centers.push({ x: x, y: y });
        }
    }

    return centers;
}

// Blend scalar start with scalar end. Note that for image blending,
// end would be the upper layer, and start would be the background
function blend(start, end, alpha) {
    return start * (1 - alpha) + end * alpha;
}

// ----------- STUDENT CODE BEGIN ------------
// ----------- Our reference solution uses 72 lines of code.
// ----------- STUDENT CODE END ------------

////////////////////////////////////////////////////////////////////////////////
// Filters
////////////////////////////////////////////////////////////////////////////////

// You've already implemented this in A0! Feel free to copy your code into here
Filters.fillFilter = function(image, color) {
    for (var x = 0; x < image.width; x++) {
        for (var y = 0; y < image.height; y++) {
          // uncomment this line to enable this function
          image.setPixel(x, y, color);
        }
    }
    console.log(color);
    image.fill(color);

    return image;
};

// You've already implemented this in A0! Feel free to copy your code into here
Filters.brushFilter = function(image, radius, color, vertsString) {
    // centers is an array of (x, y) coordinates that each defines a circle center
    const centers = stringToCoords(vertsString);

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
    // ----------- Our reference solution uses 10 lines of code.
    // ----------- STUDENT CODE END ------------

    return image; 
};

// You've already implemented this in A0! Feel free to copy your code into here
Filters.softBrushFilter = function(image, radius, color, alpha_at_center, vertsString) {
    // centers is an array of (x, y) coordinates that each defines a circle center
    const centers = stringToCoords(vertsString);

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
    // ----------- Our reference solution uses 20 lines of code.
    // ----------- STUDENT CODE END ------------

    return image;
};

// Ratio is a value in the domain [-1, 1]. When ratio is < 0, linearly blend the image
// with black. When ratio is > 0, linearly blend the image with white. At the extremes
// of -1 and 1, the image should be completely black and completely white, respectively.
Filters.brightnessFilter = function(image, ratio) {
    let alpha, dirLuminance;
    if (ratio < 0.0) {
        alpha = 1 + ratio;
        dirLuminance = 0; // blend with black
    } else {
        alpha = 1 - ratio;
        dirLuminance = 1; // blend with white
    }

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);

            pixel.data[0] = alpha * pixel.data[0] + (1 - alpha) * dirLuminance;
            pixel.data[1] = alpha * pixel.data[1] + (1 - alpha) * dirLuminance;
            pixel.data[2] = alpha * pixel.data[2] + (1 - alpha) * dirLuminance;

            image.setPixel(x, y, pixel);
        }
    }

    return image;
};

// Reference at this:
//      https://en.wikipedia.org/wiki/Image_editing#Contrast_change_and_brightening
// value = (value - 0.5) * (tan ((contrast + 1) * PI/4) ) + 0.5;
// Note that ratio is in the domain [-1, 1]
Filters.contrastFilter = function(image, ratio) {
    // ----------- STUDENT CODE BEGIN ------------

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);

            pixel.data[0] = (pixel.data[0] - 0.5) * Math.tan((ratio + 1) * pi / 4) + 0.5; // Red
            pixel.data[1] = (pixel.data[1] - 0.5) * Math.tan((ratio + 1) * pi / 4) + 0.5; // Green
            pixel.data[2] = (pixel.data[2] - 0.5) * Math.tan((ratio + 1) * pi / 4) + 0.5; // Blue

            image.setPixel(x, y, pixel);
        }
    }
    // ----------- Our reference solution uses 14 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('contrastFilter is not implemented yet');
    return image;
};

// Note that the argument here is log(gamma)
Filters.gammaFilter = function(image, logOfGamma) {
    const gamma = Math.exp(logOfGamma);
    // ----------- STUDENT CODE BEGIN ------------

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);

            pixel.data[0] = Math.pow(pixel.data[0], gamma); // Red
            pixel.data[1] = Math.pow(pixel.data[1], gamma); // Green
            pixel.data[2] = Math.pow(pixel.data[2], gamma); // Blue

            image.setPixel(x, y, pixel);
        }
    }
    // ----------- Our reference solution uses 9 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('gammaFilter is not implemented yet');
    return image;
};

/*
* The image should be perfectly clear up to innerRadius, perfectly dark
* (black) at outerRadius and beyond, and smoothly increase darkness in the
* circular ring in between. Both are specified as multiples of half the length
* of the image diagonal (so 1.0 is the distance from the image center to the
* corner).
*
* Note that the vignette should still form a perfect circle!
*/
Filters.vignetteFilter = function(image, innerR, outerR) {
    // Let's ensure that innerR is at least 0.1 smaller than outerR
    innerR = clamp(innerR, 0, outerR - 0.1);
    // ----------- STUDENT CODE BEGIN ------------

    const center = { x: image.width / 2, y: image.height / 2 }; // Find the center of the image

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const dx = x - center.x;
            const dy = y - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            let alpha = 1 - clamp((distance - innerR * Math.sqrt(image.width * image.width + image.height * image.height) / 2) / (outerR - innerR), 0, 1);

            const pixel = image.getPixel(x, y);
            pixel.data[0] *= alpha;
            pixel.data[1] *= alpha;
            pixel.data[2] *= alpha;

            image.setPixel(x, y, pixel);
        }
    }
    // ----------- Our reference solution uses 17 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('vignetteFilter is not implemented yet');
    return image;
};

/*
* You will want to build a normalized CDF of the L channel in the image.
*/
Filters.histogramEqualizationFilter = function(image) {
    // ----------- STUDENT CODE BEGIN ------------

    // First, we need to calculate the image histogram for each color channel (red, green, blue)
    const histogramRed = new Array(256).fill(0);
    const histogramGreen = new Array(256).fill(0);
    const histogramBlue = new Array(256).fill(0);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            histogramRed[Math.floor(pixel.data[0] * 255)]++;
            histogramGreen[Math.floor(pixel.data[1] * 255)]++;
            histogramBlue[Math.floor(pixel.data[2] * 255)]++;
        }
    }

    // Then we calculate the cumulative distribution function (CDF) for each color channel
    const cdfRed = calculateCDF(histogramRed, image.width * image.height);
    const cdfGreen = calculateCDF(histogramGreen, image.width * image.height);
    const cdfBlue = calculateCDF(histogramBlue, image.width * image.height);

    // Finally, we apply histogram equalization
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);

            pixel.data[0] = cdfRed[Math.floor(pixel.data[0] * 255)] / 255;
            pixel.data[1] = cdfGreen[Math.floor(pixel.data[1] * 255)] / 255;
            pixel.data[2] = cdfBlue[Math.floor(pixel.data[2] * 255)] / 255;

            image.setPixel(x, y, pixel);
        }
    }

    // Helper function to calculate the cumulative distribution function (CDF)
    function calculateCDF(histogram, totalPixels) {
        const cdf = [];
        let sum = 0;
    
        for (let i = 0; i < histogram.length; i++) {
            sum += histogram[i];
            cdf.push(sum / totalPixels);
        }
    
        return cdf;
    }

    // ----------- Our reference solution uses 33 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('histogramEqualizationFilter is not implemented yet');
    return image;
};

// Set each pixel in the image to its luminance
Filters.grayscaleFilter = function(image) {
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            const luminance = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1] + 0.0722 * pixel.data[2];
            pixel.data[0] = luminance;
            pixel.data[1] = luminance;
            pixel.data[2] = luminance;

            image.setPixel(x, y, pixel);
        }
    }

    return image;
};

// Adjust each channel in each pixel by a fraction of its distance from the average
// value of the pixel (luminance).
// See: http://www.graficaobscura.com/interp/index.html
Filters.saturationFilter = function(image, ratio) {
    // ----------- STUDENT CODE BEGIN ------------

    const averageLuminance = calculateAverageLuminance(image);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            const luminance = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1] + 0.0722 * pixel.data[2];

            pixel.data[0] += (luminance - pixel.data[0]) * ratio;
            pixel.data[1] += (luminance - pixel.data[1]) * ratio;
            pixel.data[2] += (luminance - pixel.data[2]) * ratio;

            image.setPixel(x, y, pixel);
        }
    }

    function calculateAverageLuminance(image) {
        let totalLuminance = 0;
    
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                const pixel = image.getPixel(x, y);
                const luminance = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1] + 0.0722 * pixel.data[2];
                totalLuminance += luminance;
            }
        }
    
        return totalLuminance / (image.width * image.height);
    }
    // ----------- Our reference solution uses 13 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('saturationFilter is not implemented yet');
    return image;
};

// Apply the Von Kries method: convert the image from RGB to LMS, divide by
// the LMS coordinates of the white point color, and convert back to RGB.
Filters.whiteBalanceFilter = function(image, white) {
    // ----------- STUDENT CODE BEGIN ------------

    const lmsImage = convertRGBtoLMS(image);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = lmsImage.getPixel(x, y);

            pixel.data[0] /= white[0]; // L
            pixel.data[1] /= white[1]; // M
            pixel.data[2] /= white[2]; // S

            lmsImage.setPixel(x, y, pixel);
        }
    }

    const balancedImage = convertLMStoRGB(lmsImage);

    // Conversão RGB para LMS
    function convertRGBtoLMS(image) {
        const lmsImage = new Image(image.width, image.height);

        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                const pixel = image.getPixel(x, y);

                const lmsMatrix = [
                    [0.3811, 0.5783, 0.0402],
                    [0.1967, 0.7244, 0.0782],
                    [0.0241, 0.1288, 0.8444]
                ];

                const lms = [
                    lmsMatrix[0][0] * pixel.data[0] + lmsMatrix[0][1] * pixel.data[1] + lmsMatrix[0][2] * pixel.data[2],
                    lmsMatrix[1][0] * pixel.data[0] + lmsMatrix[1][1] * pixel.data[1] + lmsMatrix[1][2] * pixel.data[2],
                    lmsMatrix[2][0] * pixel.data[0] + lmsMatrix[2][1] * pixel.data[1] + lmsMatrix[2][2] * pixel.data[2]
                ];

                lmsImage.setPixel(x, y, { data: lms, a: pixel.a });
            }
        }

        return lmsImage;
    }

    // Conversão LMS para RGB
    function convertLMStoRGB(image) {
        const rgbImage = new Image(image.width, image.height);

        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                const pixel = image.getPixel(x, y);

                const rgbMatrix = [
                    [ 4.4679, -3.5873,  0.1193],
                    [-1.2186,  2.3809, -0.1624],
                    [ 0.0497, -0.2439,  1.2045]
                ];

                const rgb = [
                    rgbMatrix[0][0] * pixel.data[0] + rgbMatrix[0][1] * pixel.data[1] + rgbMatrix[0][2] * pixel.data[2],
                    rgbMatrix[1][0] * pixel.data[0] + rgbMatrix[1][1] * pixel.data[1] + rgbMatrix[1][2] * pixel.data[2],
                    rgbMatrix[2][0] * pixel.data[0] + rgbMatrix[2][1] * pixel.data[1] + rgbMatrix[2][2] * pixel.data[2]
                ];

                rgbImage.setPixel(x, y, { data: rgb, a: pixel.a });
            }
        }

        return rgbImage;
    }


    return balancedImage;
    // ----------- Our reference solution uses 23 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('whiteBalanceFilter is not implemented yet');
};

// This is similar to the histogram filter, except here you should take the
// the CDF of the L channel in one image and
// map it to another
//
Filters.histogramMatchFilter = function(image, refImg) {
    // ----------- STUDENT CODE BEGIN ------------

    const cdfRefImg = calculateCDFofLChannel(refImg);

    const cdfCurrentImg = calculateCDFofLChannel(image);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            const newLuminance = mapValueToCDF(pixel.data[0], cdfCurrentImg, cdfRefImg);

            pixel.data[0] = newLuminance;
            pixel.data[1] = newLuminance;
            pixel.data[2] = newLuminance;

            image.setPixel(x, y, pixel);
        }
    }

    function calculateCDFofLChannel(image) {
        const histogram = new Array(256).fill(0);
        const totalPixels = image.width * image.height;

        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                const pixel = image.getPixel(x, y);
                const luminance = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1] + 0.0722 * pixel.data[2];
                histogram[Math.floor(luminance * 255)]++;
            }
        }

        const cdf = [];
        let sum = 0;
        for (let i = 0; i < histogram.length; i++) {
            sum += histogram[i];
            cdf.push(sum / totalPixels);
        }

        return cdf;
    }

    function mapValueToCDF(value, cdfCurrentImg, cdfRefImg) {

        let closestIndex = 0;
        let minDifference = Infinity;
        for (let i = 0; i < cdfCurrentImg.length; i++) {
            const difference = Math.abs(value - cdfCurrentImg[i]);
            if (difference < minDifference) {
                minDifference = difference;
                closestIndex = i;
            }
        }

        return cdfRefImg[closestIndex];
    }


    // ----------- Our reference solution uses 58 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('histogramMatchFilter is not implemented yet');
    return image;
};

// Convolve the image with a gaussian filter.
// NB: Implement this as a seperable gaussian filter
Filters.gaussianFilter = function(image, sigma) {
    // note: this function needs to work in a new copy of the image
    //       to avoid overwriting original pixels values needed later
    // create a new image with the same size as the input image
    let newImg = image.createImg(image.width, image.height);
    // the filter window will be [-winR, winR] for a total diameter of roughly Math.round(3*sigma)*2+1;
    const winR = Math.round(sigma * 3);
    // ----------- STUDENT CODE BEGIN ------------

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let sum = 0;
            let weightSum = 0;
            for (let i = -winR; i <= winR; i++) {
                for (let j = -winR; j <= winR; j++) {
                    const neighborX = x + i;
                    const neighborY = y + j;
                    if (neighborX >= 0 && neighborX < image.width && neighborY >= 0 && neighborY < image.height) {
                        const pixel = image.getPixel(neighborX, neighborY);
                        const distance = Math.sqrt(i * i + j * j);
                        const weight = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                        sum += weight * pixel.data[0]; // Assumindo que o canal de cor é o primeiro (R)
                        weightSum += weight;
                    }
                }
            }
            const avgColor = sum / weightSum;
            newImg.setPixel(x, y, { data: [avgColor, avgColor, avgColor], a: 1 });
        }
    }
    // ----------- Our reference solution uses 58 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('gaussianFilter is not implemented yet');
    return newImg;
};

/*
* First the image with the edge kernel and then add the result back onto the
* original image.
*/
Filters.sharpenFilter = function(image) {
    // ----------- STUDENT CODE BEGIN ------------

    // Implementação do filtro de nitidez
    // Primeiro, aplicamos um kernel de borda à imagem
    const edgeKernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];
    const edgeImage = applyConvolution(image, edgeKernel);

    // Em seguida, adicionamos o resultado de volta à imagem original
    const sharpImage = new Image(image.width, image.height);
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const edgePixel = edgeImage.getPixel(x, y);
            const originalPixel = image.getPixel(x, y);
            const sharpPixel = {
                data: [
                    originalPixel.data[0] + edgePixel.data[0],
                    originalPixel.data[1] + edgePixel.data[1],
                    originalPixel.data[2] + edgePixel.data[2]
                ],
                a: 1
            };
            sharpImage.setPixel(x, y, sharpPixel);
        }
    }
    // ----------- Our reference solution uses 33 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('sharpenFilter is not implemented yet');
    return sharpImage;
};

/*
* Convolve the image with the edge kernel from class. You might want to define
* a convolution utility that convolves an image with some arbitrary input kernel
*
* For this filter, we recommend inverting pixel values to enhance edge visualization
*/
Filters.edgeFilter = function(image) {
    // ----------- STUDENT CODE BEGIN ------------

    const edgeKernel = [
        [-1, -1, -1],
        [-1,  8, -1],
        [-1, -1, -1]
    ];
    const edgeImage = applyConvolution(image, edgeKernel);
    
    // ----------- Our reference solution uses 57 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('edgeFilter is not implemented yet');
    return edgeImage;
};

// Função Elementar
function applyConvolution(image, kernel) {
    const newImg = image.createImg(image.width, image.height);
    const kernelSize = kernel.length;
    const kernelRadius = Math.floor(kernelSize / 2);

    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;

            for (let i = 0; i < kernelSize; i++) {
                for (let j = 0; j < kernelSize; j++) {
                    const neighborX = x + i - kernelRadius;
                    const neighborY = y + j - kernelRadius;

                    if (neighborX >= 0 && neighborX < image.width && neighborY >= 0 && neighborY < image.height) {
                        const pixel = image.getPixel(neighborX, neighborY);
                        const kernelValue = kernel[i][j];
                        sumR += pixel.data[0] * kernelValue;
                        sumG += pixel.data[1] * kernelValue;
                        sumB += pixel.data[2] * kernelValue;
                    }
                }
            }

            const newPixel = {
                data: [
                    clamp(sumR, 0, 255),
                    clamp(sumG, 0, 255),
                    clamp(sumB, 0, 255)
                ],
                a: 1
            };
            newImg.setPixel(x, y, newPixel);
        }
    }

    return newImg;
}

// Set a pixel to the median value in its local neighbor hood. You might want to
// apply this seperately to each channel.
Filters.medianFilter = function(image, winR) {
    // winR: the window will be  [-winR, winR];
    // ----------- STUDENT CODE BEGIN ------------

    const newImg = image.createImg(image.width, image.height);
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const neighbors = [];
            for (let i = -winR; i <= winR; i++) {
                for (let j = -winR; j <= winR; j++) {
                    const neighborX = x + i;
                    const neighborY = y + j;
                    if (neighborX >= 0 && neighborX < image.width && neighborY >= 0 && neighborY < image.height) {
                        const pixel = image.getPixel(neighborX, neighborY);
                        neighbors.push(pixel.data[0]); // Assumindo que estamos trabalhando com imagens em tons de cinza
                    }
                }
            }
            neighbors.sort((a, b) => a - b);
            const medianValue = neighbors[Math.floor(neighbors.length / 2)];
            newImg.setPixel(x, y, { data: [medianValue, medianValue, medianValue], a: 1 });
        }
    }

    // ----------- Our reference solution uses 36 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('medianFilter is not implemented yet');
    return newImg;
};

// Apply a bilateral filter to the image. You will likely want to reference
// precept slides, lecture slides, and the assignments/examples page for help.
Filters.bilateralFilter = function(image, sigmaR, sigmaS) {
    // reference: https://en.wikipedia.org/wiki/Bilateral_filter
    // we first compute window size and preprocess sigmaR
    const winR = Math.round((sigmaR + sigmaS) * 1.5);
    sigmaR = sigmaR * (Math.sqrt(2) * winR);

    // ----------- STUDENT CODE BEGIN ------------

    const newImg = image.createImg(image.width, image.height);
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            let pixelSum = [0, 0, 0];
            let weightSum = 0;
            for (let i = -winR; i <= winR; i++) {
                for (let j = -winR; j <= winR; j++) {
                    const neighborX = x + i;
                    const neighborY = y + j;
                    if (neighborX >= 0 && neighborX < image.width && neighborY >= 0 && neighborY < image.height) {
                        const pixel = image.getPixel(neighborX, neighborY);
                        const spatialWeight = Math.exp(-(i * i + j * j) / (2 * sigmaS * sigmaS));
                        const rangeWeight = Math.exp(-((pixel.data[0] - image.getPixel(x, y).data[0]) ** 2) / (2 * sigmaR * sigmaR));
                        const weight = spatialWeight * rangeWeight;
                        pixelSum[0] += pixel.data[0] * weight;
                        pixelSum[1] += pixel.data[1] * weight;
                        pixelSum[2] += pixel.data[2] * weight;
                        weightSum += weight;
                    }
                }
            }
            const newPixel = {
                data: [
                    pixelSum[0] / weightSum,
                    pixelSum[1] / weightSum,
                    pixelSum[2] / weightSum
                ],
                a: 1
            };
            newImg.setPixel(x, y, newPixel);
        }
    }
    // ----------- Our reference solution uses 53 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('bilateralFilter is not implemented yet');
    return image;
};

// Conver the image to binary
Filters.quantizeFilter = function(image) {
    // convert to grayscale
    image = Filters.grayscaleFilter(image);

    // use center color
    for (let i = 0; i < image.height; i++) {
        for (let j = 0; j < image.width; j++) {
            const pixel = image.getPixel(j, i);
            for (let c = 0; c < 3; c++) {
                pixel.data[c] = Math.round(pixel.data[c]);
            }
            pixel.clamp();
            image.setPixel(j, i, pixel);
        }
    }
    return image;
};

// To apply random dithering, first convert the image to grayscale, then apply
// random noise, and finally quantize
Filters.randomFilter = function(image) {
    // convert to grayscale
    image = Filters.grayscaleFilter(image);

    // ----------- STUDENT CODE BEGIN ------------
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            const randomValue = Math.random() * 255;
            pixel.data[0] += randomValue;
            pixel.data[1] += randomValue;
            pixel.data[2] += randomValue;
            image.setPixel(x, y, pixel);
        }
    }
    // Quantize the grayscale values
    for (let x = 0; x < image.width; x++) {
        for (let y = 0; y < image.height; y++) {
            const pixel = image.getPixel(x, y);
            pixel.data[0] = Math.round(pixel.data[0] / 255) * 255;
            pixel.data[1] = Math.round(pixel.data[1] / 255) * 255;
            pixel.data[2] = Math.round(pixel.data[2] / 255) * 255;
            image.setPixel(x, y, pixel);
        }
    }
    // ----------- Our reference solution uses 12 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('randomFilter is not implemented yet');
    return image;
};

// Apply the Floyd-Steinberg dither with error diffusion
Filters.floydFilter = function(image) {
    // convert to grayscale
    //image = Filters.grayscaleFilter(image);

    // ----------- STUDENT CODE BEGIN ------------
    const width = image.width;
    const height = image.height;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const oldPixel = image.getPixel(x, y);
            const newPixel = { data: [oldPixel.data[0], oldPixel.data[1], oldPixel.data[2]], a: 1 };

            const quantErrorR = oldPixel.data[0] - newPixel.data[0];
            const quantErrorG = oldPixel.data[1] - newPixel.data[1];
            const quantErrorB = oldPixel.data[2] - newPixel.data[2];

            image.setPixel(x, y, newPixel);

            if (x < width - 1) {
                const rightPixel = image.getPixel(x + 1, y);
                rightPixel.data[0] += quantErrorR * 7 / 16;
                rightPixel.data[1] += quantErrorG * 7 / 16;
                rightPixel.data[2] += quantErrorB * 7 / 16;
                image.setPixel(x + 1, y, rightPixel);
            }

            if (y < height - 1) {
                if (x > 0) {
                    const bottomLeftPixel = image.getPixel(x - 1, y + 1);
                    bottomLeftPixel.data[0] += quantErrorR * 3 / 16;
                    bottomLeftPixel.data[1] += quantErrorG * 3 / 16;
                    bottomLeftPixel.data[2] += quantErrorB * 3 / 16;
                    image.setPixel(x - 1, y + 1, bottomLeftPixel);
                }

                const bottomPixel = image.getPixel(x, y + 1);
                bottomPixel.data[0] += quantErrorR * 5 / 16;
                bottomPixel.data[1] += quantErrorG * 5 / 16;
                bottomPixel.data[2] += quantErrorB * 5 / 16;
                image.setPixel(x, y + 1, bottomPixel);

                if (x < width - 1) {
                    const bottomRightPixel = image.getPixel(x + 1, y + 1);
                    bottomRightPixel.data[0] += quantErrorR / 16;
                    bottomRightPixel.data[1] += quantErrorG / 16;
                    bottomRightPixel.data[2] += quantErrorB / 16;
                    image.setPixel(x + 1, y + 1, bottomRightPixel);
                }
            }
        }
    }
    // ----------- Our reference solution uses 27 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('floydFilter is not implemented yet');
    return image;
};

// Apply ordered dithering to the image. We recommend using the pattern from the
// examples page and precept slides.
Filters.orderedFilter = function(image) {
    // convert to gray scale
    image = Filters.grayscaleFilter(image);

    // ----------- STUDENT CODE BEGIN ------------
    // Define the dither matrix
    const ditherMatrix = [
        [0, 128, 32, 160],
        [192, 64, 224, 96],
        [48, 176, 16, 144],
        [240, 112, 208, 80]
    ];

    const matrixSize = ditherMatrix.length;

    // ----------- STUDENT CODE BEGIN ------------
    // Apply ordered dithering using the defined dither matrix
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            const pixel = image.getPixel(x, y);
            const threshold = ditherMatrix[y % matrixSize][x % matrixSize];
            const luminance = (pixel.data[0] + pixel.data[1] + pixel.data[2]) / 3;
            const newPixelValue = luminance < threshold ? 0 : 255;
            pixel.data[0] = newPixelValue;
            pixel.data[1] = newPixelValue;
            pixel.data[2] = newPixelValue;
            image.setPixel(x, y, pixel);
        }
    }
    // ----------- Our reference solution uses 31 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('orderedFilter is not implemented yet');
    return image;
};

// Implement bilinear and Gaussian sampling (in addition to the basic point sampling).
// This operation doesn't appear on GUI and should be used as a utility function.
// Call this function from filters that require sampling (e.g. scale, rotate)
Filters.samplePixel = function(image, x, y, mode) {
    if (mode === "bilinear") {
        // ----------- STUDENT CODE BEGIN ------------
        // Bilinear sampling
        const xFloor = Math.floor(x);
        const yFloor = Math.floor(y);
        const xCeil = Math.ceil(x);
        const yCeil = Math.ceil(y);

        const topLeft = image.getPixel(xFloor, yFloor);
        const topRight = image.getPixel(xCeil, yFloor);
        const bottomLeft = image.getPixel(xFloor, yCeil);
        const bottomRight = image.getPixel(xCeil, yCeil);

        const xFraction = x - xFloor;
        const yFraction = y - yFloor;

        const topInterpolated = {
            data: [
                (1 - xFraction) * topLeft.data[0] + xFraction * topRight.data[0],
                (1 - xFraction) * topLeft.data[1] + xFraction * topRight.data[1],
                (1 - xFraction) * topLeft.data[2] + xFraction * topRight.data[2]
            ],
            a: 1
        };

        const bottomInterpolated = {
            data: [
                (1 - xFraction) * bottomLeft.data[0] + xFraction * bottomRight.data[0],
                (1 - xFraction) * bottomLeft.data[1] + xFraction * bottomRight.data[1],
                (1 - xFraction) * bottomLeft.data[2] + xFraction * bottomRight.data[2]
            ],
            a: 1
        };

        const interpolatedPixel = {
            data: [
                (1 - yFraction) * topInterpolated.data[0] + yFraction * bottomInterpolated.data[0],
                (1 - yFraction) * topInterpolated.data[1] + yFraction * bottomInterpolated.data[1],
                (1 - yFraction) * topInterpolated.data[2] + yFraction * bottomInterpolated.data[2]
            ],
            a: 1
        };

        return interpolatedPixel;
        // ----------- Our reference solution uses 21 lines of code.
        // ----------- STUDENT CODE END ------------
        // Gui.alertOnce ('bilinear sampling is not implemented yet');
    } else if (mode === "gaussian") {
        // ----------- STUDENT CODE BEGIN ------------
        // Gaussian sampling
        const gaussianKernel = [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ];

        let totalWeight = 0;
        let weightedSumR = 0;
        let weightedSumG = 0;
        let weightedSumB = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborPixel = image.getPixel(x + i, y + j);
                const weight = gaussianKernel[i + 1][j + 1];
                totalWeight += weight;
                weightedSumR += weight * neighborPixel.data[0];
                weightedSumG += weight * neighborPixel.data[1];
                weightedSumB += weight * neighborPixel.data[2];
            }
        }

        const averagedPixel = {
            data: [
                weightedSumR / totalWeight,
                weightedSumG / totalWeight,
                weightedSumB / totalWeight
            ],
            a: 1
        };

        return averagedPixel;
        // ----------- Our reference solution uses 38 lines of code.
        // ----------- STUDENT CODE END ------------
        // Gui.alertOnce ('gaussian sampling is not implemented yet');
    } else {
        // point sampling
        y = Math.max(0, Math.min(Math.round(y), image.height - 1));
        x = Math.max(0, Math.min(Math.round(x), image.width - 1));
        return image.getPixel(x, y);
    }
};

// Translate the image by some x, y and using a requested method of sampling/resampling
Filters.translateFilter = function(image, x, y, sampleMode) {
    // Note: set pixels outside the image to RGBA(0,0,0,0)
    // ----------- STUDENT CODE BEGIN ------------
    const newImage = image.createImg(image.width, image.height);

    for (let newY = 0; newY < newImage.height; newY++) {
        for (let newX = 0; newX < newImage.width; newX++) {
            // Calculate the corresponding position in the original image
            const origX = newX - x;
            const origY = newY - y;

            // Sample the pixel using the specified mode
            const sampledPixel = Filters.samplePixel(image, origX, origY, sampleMode);

            // Set the pixel in the new image
            newImage.setPixel(newX, newY, sampledPixel);
        }
    }
    // ----------- Our reference solution uses 21 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('translateFilter is not implemented yet');
    return newImage;
};

// Scale the image by some ratio and using a requested method of sampling/resampling
Filters.scaleFilter = function(image, ratio, sampleMode) {
    // ----------- STUDENT CODE BEGIN ------------
    const newWidth = Math.round(image.width * ratio);
    const newHeight = Math.round(image.height * ratio);
    const newImage = image.createImg(newWidth, newHeight);

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            // Calculate the corresponding position in the original image
            const origX = x / ratio;
            const origY = y / ratio;

            // Sample the pixel using the specified mode
            const sampledPixel = Filters.samplePixel(image, origX, origY, sampleMode);

            // Set the pixel in the new image
            newImage.setPixel(x, y, sampledPixel);
        }
    }
    // ----------- Our reference solution uses 19 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('scaleFilter is not implemented yet');
    return image;
};

// Rotate the image by some angle and using a requested method of sampling/resampling
Filters.rotateFilter = function(image, radians, sampleMode) {
    // Note: set pixels outside the image to RGBA(0,0,0,0)
    // ----------- STUDENT CODE BEGIN ------------
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const centerX = image.width / 2;
    const centerY = image.height / 2;

    // Calculate the dimensions of the new image to contain the rotated image
    const newWidth = Math.ceil(Math.abs(image.width * cosine) + Math.abs(image.height * sine));
    const newHeight = Math.ceil(Math.abs(image.width * sine) + Math.abs(image.height * cosine));

    // Create a new image with the calculated dimensions
    const newImage = image.createImg(newWidth, newHeight);

    for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
            // Calculate the coordinates of the pixel in the original image after rotation
            const origX = (x - newWidth / 2) * cosine - (y - newHeight / 2) * sine + centerX;
            const origY = (x - newWidth / 2) * sine + (y - newHeight / 2) * cosine + centerY;

            // Sample the pixel using the specified mode
            const sampledPixel = Filters.samplePixel(image, origX, origY, sampleMode);

            // Set the pixel in the new image
            newImage.setPixel(x, y, sampledPixel);
        }
    }
    // ----------- Our reference solution uses 29 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('rotateFilter is not implemented yet');
    return newImage;
};

// Swirl the filter about its center. The rotation of the swirl should be in linear increase
// along the radial axis up to radians
Filters.swirlFilter = function(image, radians, sampleMode) {
    // ----------- STUDENT CODE BEGIN ------------
    const centerX = image.width / 2;
    const centerY = image.height / 2;
    const maxRadius = Math.min(centerX, centerY);
    const newImage = image.createImg(image.width, image.height);

    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            // Calculate the distance from the center
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate the angle of rotation based on the distance from the center
            const angle = radians * (1 - Math.min(distance, maxRadius) / maxRadius);

            // Calculate the new coordinates after swirling
            const newX = Math.round(dx * Math.cos(angle) - dy * Math.sin(angle)) + centerX;
            const newY = Math.round(dx * Math.sin(angle) + dy * Math.cos(angle)) + centerY;

            // Sample the pixel using the specified mode
            const sampledPixel = Filters.samplePixel(image, newX, newY, sampleMode);

            // Set the pixel in the new image
            newImage.setPixel(x, y, sampledPixel);
        }
    }
    // ----------- Our reference solution uses 26 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('swirlFilter is not implemented yet');
    return newImage;
};

// Set alpha from luminance
Filters.getAlphaFilter = function(backgroundImg, foregroundImg) {
    for (let i = 0; i < backgroundImg.height; i++) {
        for (let j = 0; j < backgroundImg.width; j++) {
            const pixelBg = backgroundImg.getPixel(j, i);
            const pixelFg = foregroundImg.getPixel(j, i);
            const luminance =
            0.2126 * pixelFg.data[0] + 0.7152 * pixelFg.data[1] + 0.0722 * pixelFg.data[2];
            pixelBg.a = luminance;
            backgroundImg.setPixel(j, i, pixelBg);
        }
    }

    return backgroundImg;
};

// Composites the foreground image over the background image, using the alpha
// channel of the foreground image to blend two images.
Filters.compositeFilter = function(backgroundImg, foregroundImg) {
    // Assume the input images are of the same sizes.
    // ----------- STUDENT CODE BEGIN ------------
    const newImage = backgroundImg.createImg(backgroundImg.width, backgroundImg.height);

    for (let y = 0; y < backgroundImg.height; y++) {
        for (let x = 0; x < backgroundImg.width; x++) {
            // Get the pixels from both images
            const backgroundPixel = backgroundImg.getPixel(x, y);
            const foregroundPixel = foregroundImg.getPixel(x, y);

            // Calculate the alpha blending
            const alpha = foregroundPixel.a;
            const newRed = (foregroundPixel.data[0] * alpha) + (backgroundPixel.data[0] * (1 - alpha));
            const newGreen = (foregroundPixel.data[1] * alpha) + (backgroundPixel.data[1] * (1 - alpha));
            const newBlue = (foregroundPixel.data[2] * alpha) + (backgroundPixel.data[2] * (1 - alpha));

            // Set the new pixel in the composite image
            newImage.setPixel(x, y, { data: [newRed, newGreen, newBlue], a: 1 });
        }
    }
    // ----------- Our reference solution uses 14 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('compositeFilter is not implemented yet');
    return newImage;
};

// Morph two images according to a set of correspondance lines
Filters.morphFilter = function(initialImg, finalImg, alpha, sampleMode, linesFile) {
    const lines = Parser.parseJson("images/" + linesFile);

    // The provided linesFile represents lines in a flipped x, y coordinate system
    //  (i.e. x for vertical direction, y for horizontal direction).
    // Therefore we first fix the flipped x, y coordinates here.
    for (let i = 0; i < lines.initial.length; i++) {
        [lines.initial[i].x0, lines.initial[i].y0] = [lines.initial[i].y0, lines.initial[i].x0];
        [lines.initial[i].x1, lines.initial[i].y1] = [lines.initial[i].y1, lines.initial[i].x1];
        [lines.final[i].x0, lines.final[i].y0] = [lines.final[i].y0, lines.final[i].x0];
        [lines.final[i].x1, lines.final[i].y1] = [lines.final[i].y1, lines.final[i].x1];
    }

    // ----------- STUDENT CODE BEGIN ------------
    const newImage = initialImg.createImg(initialImg.width, initialImg.height);

    for (let y = 0; y < initialImg.height; y++) {
        for (let x = 0; x < initialImg.width; x++) {
            const u = x / initialImg.width;
            const v = y / initialImg.height;

            // Interpolate correspondences
            const initialPt = interpolatePoint(u, v, lines.initial);
            const finalPt = interpolatePoint(u, v, lines.final);

            // Compute intermediate point
            const newX = (1 - alpha) * initialPt.x + alpha * finalPt.x;
            const newY = (1 - alpha) * initialPt.y + alpha * finalPt.y;

            // Sample the pixel from the images using the specified mode
            const sampledPixel = Filters.samplePixel(initialImg, newX, newY, sampleMode);

            // Set the pixel in the new image
            newImage.setPixel(x, y, sampledPixel);
        }
    }

    // Helper function to interpolate points
    function interpolatePoint(u, v, points) {
        let x = 0;
        let y = 0;
        let totalWeight = 0;

        for (let i = 0; i < points.length; i++) {
            const weight = weightFunction(u, v, points[i]);
            x += points[i].x * weight;
            y += points[i].y * weight;
            totalWeight += weight;
        }

        return { x: x / totalWeight, y: y / totalWeight };
    }

    // Helper function to compute weight for interpolation
    function weightFunction(u, v, point) {
        const dist = Math.sqrt((u - point.u) ** 2 + (v - point.v) ** 2);
        return 1 / dist;
    }

    // ----------- Our reference solution uses 114 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('morphFilter is not implemented yet');
    return newImage;
};

// Use k-means to extract a pallete from an image
Filters.paletteFilter = function(image, colorNum) {
    // ----------- STUDENT CODE BEGIN ------------
    // Convert image to RGB if it's in a different color space
    const rgbImage = Filters.convertToRGB(image);

    // Flatten image data to perform k-means clustering
    const flattenedData = [];
    for (let y = 0; y < rgbImage.height; y++) {
        for (let x = 0; x < rgbImage.width; x++) {
            const pixel = rgbImage.getPixel(x, y);
            flattenedData.push(pixel.data);
        }
    }

    // Perform k-means clustering
    const clusters = kMeans(flattenedData, colorNum);

    // Calculate average color of each cluster
    const palette = clusters.map(cluster => {
        const clusterSize = cluster.length;
        const sum = cluster.reduce((acc, val) => acc.map((v, i) => v + val[i]), [0, 0, 0]);
        return sum.map(v => Math.round(v / clusterSize));
    });

    // Create a new image representing the palette
    const paletteImage = new Image(1, colorNum);
    for (let i = 0; i < colorNum; i++) {
        const color = palette[i];
        paletteImage.setPixel(0, i, { data: color, a: 1 });
    }
    // ----------- Our reference solution uses 89 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('paletteFilter is not implemented yet');
    return paletteImage;
};

// Simple k-means algorithm
function kMeans(data, k) {
    // Initialize centroids randomly
    let centroids = [];
    for (let i = 0; i < k; i++) {
        centroids.push(data[Math.floor(Math.random() * data.length)]);
    }

    let prevClusters = Array.from({ length: k }, () => []);

    // Assign data points to clusters and update centroids until convergence
    while (!clustersEqual(prevClusters, assignToClusters(data, centroids))) {
        prevClusters = assignToClusters(data, centroids);
        centroids = updateCentroids(prevClusters);
    }

    return prevClusters;
}

// Assign data points to clusters based on closest centroid
function assignToClusters(data, centroids) {
    const clusters = Array.from({ length: centroids.length }, () => []);
    for (const point of data) {
        const closestCentroidIndex = findClosestCentroidIndex(point, centroids);
        clusters[closestCentroidIndex].push(point);
    }
    return clusters;
}

// Find index of the closest centroid to a data point
function findClosestCentroidIndex(point, centroids) {
    let minDistance = Infinity;
    let closestIndex = 0;
    for (let i = 0; i < centroids.length; i++) {
        const distance = euclideanDistance(point, centroids[i]);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    }
    return closestIndex;
}

// Calculate Euclidean distance between two points
function euclideanDistance(point1, point2) {
    return Math.sqrt(point1.reduce((acc, val, i) => acc + (val - point2[i]) ** 2, 0));
}

// Update centroids based on mean of data points in each cluster
function updateCentroids(clusters) {
    return clusters.map(cluster => {
        if (cluster.length === 0) return null;
        const sum = cluster.reduce((acc, val) => acc.map((v, i) => v + val[i]), Array(cluster[0].length).fill(0));
        return sum.map(val => val / cluster.length);
    });
}

// Check if two sets of clusters are equal
function clustersEqual(clusters1, clusters2) {
    if (clusters1.length !== clusters2.length) return false;
    for (let i = 0; i < clusters1.length; i++) {
        if (clusters1[i].length !== clusters2[i].length) return false;
        for (let j = 0; j < clusters1[i].length; j++) {
            if (clusters1[i][j] !== clusters2[i][j]) return false;
        }
    }
    return true;
}

// Read the following paper and implement your own "painter":
//      http://mrl.nyu.edu/publications/painterly98/hertzmann-siggraph98.pdf
Filters.paintFilter = function(image, value) {
    // ----------- STUDENT CODE BEGIN ------------
    // Convert the image to grayscale
    const grayscaleImage = Filters.grayscaleFilter(image);

    // Initialize the canvas to hold the final painted image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    // Define brush parameters
    const brushSize = 20; // Size of the brush
    const brushSpacing = 10; // Spacing between brush strokes

    // Loop through the image pixels and apply the painterly effect
    for (let y = 0; y < image.height; y += brushSpacing) {
        for (let x = 0; x < image.width; x += brushSpacing) {
            // Determine the average luminance of the pixels in the brush area
            let luminanceSum = 0;
            let pixelCount = 0;
            for (let dy = -brushSize; dy <= brushSize; dy++) {
                for (let dx = -brushSize; dx <= brushSize; dx++) {
                    const nx = Math.min(Math.max(x + dx, 0), image.width - 1);
                    const ny = Math.min(Math.max(y + dy, 0), image.height - 1);
                    const pixel = grayscaleImage.getPixel(nx, ny);
                    const luminance = (pixel.data[0] + pixel.data[1] + pixel.data[2]) / 3;
                    luminanceSum += luminance;
                    pixelCount++;
                }
            }
            const averageLuminance = luminanceSum / pixelCount;

            // Use the average luminance to determine the color of the brush stroke
            const color = [averageLuminance, averageLuminance, averageLuminance];

            // Draw the brush stroke
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.beginPath();
            ctx.arc(x, y, brushSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Convert the canvas back to an Image object
    const paintedImage = new Image(canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % canvas.width;
        const y = Math.floor(pixelIndex / canvas.width);
        const pixel = {
            data: [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]],
            a: 1
        };
        paintedImage.setPixel(x, y, pixel);
    }
    // ----------- Our reference solution uses 59 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('paintFilter is not implemented yet');
    return paintedImage;
};

/*
* Read this paper for background on eXtended Difference-of-Gaussians:
*      http://www.cs.princeton.edu/courses/archive/spring19/cos426/papers/Winnemoeller12.pdf
* Read this paper for an approach that develops a flow field based on a bilateral filter
*      http://www.cs.princeton.edu/courses/archive/spring19/cos426/papers/Kang09.pdf
*/
Filters.xDoGFilter = function(image, value) {
    // ----------- STUDENT CODE BEGIN ------------
    // Convert the image to grayscale
    const grayscaleImage = Filters.grayscaleFilter(image);

    // Define parameters for the XDoG filter
    const sigma1 = 0.5; // Standard deviation for the first Gaussian
    const sigma2 = 1.5; // Standard deviation for the second Gaussian
    const k = 1.6; // Parameter for adjusting the contrast

    // Initialize the canvas to hold the filtered image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    // Calculate the Difference-of-Gaussians (DoG) image
    const dogImage = grayscaleImage.clone(); // Clone the grayscale image
    Filters.applyConvolution(dogImage, Filters.gaussianKernel(sigma1));
    const blurredImage = grayscaleImage.clone(); // Clone the grayscale image again
    Filters.applyConvolution(blurredImage, Filters.gaussianKernel(sigma2));
    for (let y = 0; y < dogImage.height; y++) {
        for (let x = 0; x < dogImage.width; x++) {
            const dogPixel = dogImage.getPixel(x, y);
            const blurredPixel = blurredImage.getPixel(x, y);
            const difference = dogPixel.data[0] - k * blurredPixel.data[0];
            dogPixel.data[0] = difference;
            dogPixel.data[1] = difference;
            dogPixel.data[2] = difference;
            dogImage.setPixel(x, y, dogPixel);
        }
    }

    // Apply a threshold to the DoG image to create the final XDoG image
    const threshold = 0.1; // Adjust as needed
    const xDogImage = grayscaleImage.clone(); // Clone the grayscale image once again
    for (let y = 0; y < xDogImage.height; y++) {
        for (let x = 0; x < xDogImage.width; x++) {
            const dogPixel = dogImage.getPixel(x, y);
            const xDogPixel = xDogImage.getPixel(x, y);
            if (dogPixel.data[0] >= threshold) {
                xDogPixel.data[0] = 255;
            } else {
                xDogPixel.data[0] = 0;
            }
            xDogPixel.data[1] = xDogPixel.data[0];
            xDogPixel.data[2] = xDogPixel.data[0];
            xDogImage.setPixel(x, y, xDogPixel);
        }
    }

    // Convert the XDoG image back to the original format and return it
    const filteredImage = new Image(xDogImage.width, xDogImage.height);
    for (let i = 0; i < xDogImage.data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % canvas.width;
        const y = Math.floor(pixelIndex / canvas.width);
        const pixel = {
            data: [xDogImage.data[i], xDogImage.data[i + 1], xDogImage.data[i + 2]],
            a: 1
        };
        filteredImage.setPixel(x, y, pixel);
    }

    // ----------- Our reference solution uses 70 lines of code.
    // ----------- STUDENT CODE END ------------
    // Gui.alertOnce ('xDoGFilter is not implemented yet');
    return filteredImage;
};

// You can use this filter to do whatever you want, for example
// trying out some new idea or implementing something for the
// art contest.
// Currently the 'value' argument will be 1 or whatever else you set
// it to in the URL. You could use this value to switch between
// a bunch of different versions of your code if you want to
// code up a bunch of different things for the art contest.
Filters.customFilter = function(image, value) {
    // ----------- STUDENT CODE BEGIN ------------

    if (value == 1) {
        for (var y = 0; y < image.height; y++) {
          for (var x = 0; x < image.width; x++) {
            var pixel = image.getPixel(x, y);
            pixel.data[0] = 255 - pixel.data[0]; // Red
            pixel.data[1] = 255 - pixel.data[1]; // Green
            pixel.data[2] = 255 - pixel.data[2]; // Blue
            image.setPixel(x, y, pixel);
          }
        }
      }
    // ----------- Our reference solution uses 0 lines of code.
    // ----------- STUDENT CODE END ------------
    //Gui.alertOnce ('customFilter is not implemented yet');
    return image;
};
