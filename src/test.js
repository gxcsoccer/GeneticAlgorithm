window.onload = function() {
	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		hiddenCanvas = document.createElement('canvas'),
		hiddenContext = hiddenCanvas.getContext('2d'),
		img = new Image(),
		margin = 15,
		defaultFontSize = 15,
		fontSizeVar = 5,
		maxWidth = 800,
		maxHeight = 600,
		charSet = '•',//◼▲▼◀►◆',
		imageData, dataSize, imgWidth, imgHeight;

	img.src = 'image2.jpg';//'img/Firefox.png';
	img.onload = function() {
		var ratio = 1;
		imgWidth = img.width;
		imgHeight = img.height;
		if (imgWidth > maxWidth || imgHeight > maxHeight) {
			ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
			imgWidth = Math.floor(imgWidth * ratio);
			imgHeight = Math.floor(imgHeight * ratio);
		}

		canvas.style.width = canvas.width = imgWidth + 2 * margin;
		canvas.style.height = canvas.height = imgHeight + 2 * margin;
		hiddenCanvas.width = imgWidth;
		hiddenCanvas.height = imgHeight;

		hiddenContext.scale(ratio, ratio);
		hiddenContext.drawImage(img, 0, 0, img.width, img.height);
		imageData = hiddenContext.getImageData(0, 0, imgWidth, imgHeight).data;
		dataSize = imageData.length / 4;

		var character = charSet[Math.floor(Math.random() * charSet.length)],
			pixelOffset, dataOffset, color, fontSize, row, col; //'◼';
		context.translate(margin, margin);
		for (var i = 0; i < 105000; i++) {
			pixelOffset = Math.floor(Math.random() * dataSize);
			dataOffset = pixelOffset * 4;
			fontSize = Math.round((defaultFontSize + Math.random() * fontSizeVar));
			row = Math.floor(pixelOffset / imgWidth);
			col = Math.round(((pixelOffset / imgWidth) - row) * imgWidth);

			color = {
				r: imageData[dataOffset],
				g: imageData[dataOffset + 1],
				b: imageData[dataOffset + 2],
				a: imageData[dataOffset + 3] == 0 ? 0 : (0.3 + Math.random() * 0.7).toFixed(2)
			}

			col -= fontSize / 2;
			row += fontSize / 2;
			context.font = "normal " + fontSize + "px Arial";
			context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + ", " + color.a + ")";
			context.fillText(character, col, row);
		}
	}
};