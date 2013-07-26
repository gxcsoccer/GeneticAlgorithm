/*!
 * Textify, http://textify.it
 *
 * Copyright (C) 2010 Hakim El Hattab, http://hakim.se
 */
var Textify = (function() {
	var num = 1000;
	var image = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg"][Math.floor(Math.random() * 5)];
	var A = "(Drag and drop works too)";
	var customOpt = "Custom";
	var k = 10;
	var r = 15;
	var preset = {
		ABC: {
			preset: "ABC",
			filter: "None",
			useCanvas: true,
			characterSet: "ABC",
			characterLimit: 15000,
			characterScale: 1.25,
			characterFontFamily: "AppleGothic",
			characterFontWeight: "bold",
			backgroundColor: "#333"
		},
		Pointillism: {
			preset: "Pointillism",
			filter: "None",
			useCanvas: true,
			characterSet: "•",
			characterLimit: 18000,
			characterScale: 2.5,
			characterFontFamily: "Comic Sans MS",
			characterFontWeight: "bold",
			backgroundColor: "#333"
		},
		Mosaic: {
			preset: "Mosaic",
			filter: "None",
			useCanvas: true,
			characterSet: "▲▼◀►◆",
			characterLimit: 13000,
			characterScale: 1.5,
			characterFontFamily: "Helvetica",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		},
		Bubbles: {
			preset: "Bubbles",
			filter: "None",
			useCanvas: true,
			characterSet: "oO◌◎",
			characterLimit: 16000,
			characterScale: 1.5,
			characterFontFamily: "Arial",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		},
		"@#%": {
			preset: "@#%",
			filter: "None",
			useCanvas: true,
			characterSet: "@#%",
			characterLimit: 16000,
			characterScale: 1.5,
			characterFontFamily: "monospace",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		},
		Pixelate: {
			preset: "Pixelate",
			filter: "None",
			useCanvas: true,
			characterSet: "◼",
			characterLimit: 12000,
			characterScale: 1.1,
			characterFontFamily: "Arial",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		},
		Binary: {
			preset: "Binary",
			filter: "None",
			useCanvas: true,
			characterSet: "01",
			characterLimit: 10000,
			characterScale: 1.5,
			characterFontFamily: "Arial",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		},
		StarStruck: {
			preset: "StarStruck",
			filter: "None",
			useCanvas: true,
			characterSet: "✦✩✪✭",
			characterLimit: 12000,
			characterScale: 2,
			characterFontFamily: "Helvetica",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		},
		Snow: {
			preset: "Snow",
			filter: "None",
			useCanvas: true,
			characterSet: "❆❇❋",
			characterLimit: 12000,
			characterScale: 2,
			characterFontFamily: "Arial",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		},
		Dash: {
			preset: "Dash",
			filter: "None",
			useCanvas: true,
			characterSet: "/\\",
			characterLimit: 17000,
			characterScale: 2,
			characterFontFamily: "Arial",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		},
		Stitch: {
			preset: "Stitch",
			filter: "None",
			useCanvas: true,
			characterSet: "✖✕",
			characterLimit: 9000,
			characterScale: 2,
			characterFontFamily: "Helvetica",
			characterFontWeight: "normal",
			backgroundColor: "#333"
		}
	};
	var guiConfig = {},
		gui, presetController, filterController, bgController, csController, clController, csController, cfController, redrawController, progress, progressContent, input, browseBtn, saveBtn, hiddenCanvas, hiddenContext, output, canvas, context, G = 0,
		img, imageData, dataSize, charCollection, imgWidth = 1,
		imgHeight = 1,
		imgLoaded = false,
		useCanvas = false,
		P = !! navigator.userAgent.toLowerCase().match(/ipod/gi),
		i = !! navigator.userAgent.toLowerCase().match(/ipad/gi),
		m = !! navigator.userAgent.toLowerCase().match(/iphone/gi),
		p = !! navigator.userAgent.toLowerCase().match(/ipod|ipad|iphone/gi);

	function initialize() {
		img = document.createElement("img");
		hiddenCanvas = document.createElement("canvas");
		hiddenContext = hiddenCanvas.getContext("2d");
		canvas = document.createElement("canvas");
		canvas.setAttribute("class", "textify-output-canvas");
		context = canvas.getContext("2d");
		output = document.createElement("div");
		output.setAttribute("class", "textify-output-html");
		progress = document.createElement("div");
		progress.setAttribute("class", "textify-progress");
		progressContent = document.createElement("div");
		progress.appendChild(progressContent);
		progressText = document.createElement("p");
		progress.appendChild(progressText);
		input = document.createElement("input");
		input.setAttribute("type", "file");
		input.style.visibility = "hidden";
		document.body.appendChild(input);
		document.body.appendChild(canvas);
		document.body.appendChild(output);
		document.body.appendChild(progress);
		browseBtn = document.querySelector(".browse-button");
		saveBtn = document.querySelector(".save-button");
		window.addEventListener("resize", onResize, false);
		document.addEventListener("dragover", function(ev) {
			ev.preventDefault();
		}, false);
		document.addEventListener("dragenter", function(ev) {
			ev.preventDefault();
		}, false);
		document.addEventListener("dragexit", function(ev) {
			ev.preventDefault();
		}, false);
		document.addEventListener("drop", onDropFile, false);
		input.addEventListener("change", onFileChanged, false);
		browseBtn.addEventListener("click", browse, false);
		saveBtn.addEventListener("click", viewSource, false);
		initGUI();
		loadImage(image);
	}
	function initGUI() {
		gui = new DAT.GUI({
			width: 280
		});
		guiConfig = copy(preset.ABC);
		guiConfig.redraw = function() {
			if (imgLoaded) {
				processImage();
			}
		};
		guiConfig.save = function() {
			if (imgLoaded) {
				viewSource();
			}
		};
		guiConfig.image = function() {
			input.click();
		};
		presetController = gui.add(guiConfig, "preset").name("Preset").options("ABC", "Pointillism", "Mosaic", "Stitch", "@#%", "Bubbles", "StarStruck", "Pixelate", "Binary", "Snow", "Dash").onChange(function(setting) {
			presetController.removeOption(customOpt);
			applySetting(preset[setting]);
		});
		filterController = gui.add(guiConfig, "filter").name("Filter").options("None", "Black & White", "Sepia").listen().onChange(reset);
		bgController = gui.add(guiConfig, "backgroundColor").name("Background").options({
			"Dark Grey": "#333",
			"Light Grey": "#888",
			Black: "#000",
			White: "#fff",
			Red: "#c21a08",
			Green: "#54ad3c",
			Blue: "#6c94d2",
			Transparent: "transparent",
			"Source Image": "image"
		}).listen().onChange(reset);
		csController = gui.add(guiConfig, "characterSet").name("Character Set").listen().onChange(reset);
		clController = gui.add(guiConfig, "characterLimit").name("Character Count").min(1000).max(100000).step(500).listen().onChange(reset);
		csController = gui.add(guiConfig, "characterScale").name("Font Scale").min(0.1).max(5).step(0.1).listen().onChange(reset);
		cfController = gui.add(guiConfig, "characterFontFamily").name("Font Family").options({
			Arial: "Arial",
			"Comic Sans MS": "Comic Sans MS",
			Helvetica: "Helvetica",
			monospace: "monospace",
			"Times New Roman": "Times New Roman"
		}).listen().onChange(reset);
		guiFontWeight = gui.add(guiConfig, "characterFontWeight").name("Font Weight").options("normal", "bold", "bolder").listen().onChange(reset);
		redrawController = gui.add(guiConfig, "redraw").name("Apply Settings");
		redrawController.domElement.className += " apply-button";
		gui.domElement.style.position = "absolute";
		gui.domElement.style.top = "0px";
		gui.domElement.style.right = "-20px";
		document.querySelector(".guidat-controllers").style.height = "auto";
		DAT.GUI.autoPlace = false;
		gui.autoListen = false;
	}
	function applySetting(setting) {
		guiConfig.filter = setting.filter;
		guiConfig.backgroundColor = setting.backgroundColor;
		guiConfig.characterSet = setting.characterSet;
		guiConfig.characterLimit = setting.characterLimit;
		guiConfig.characterScale = setting.characterScale;
		guiConfig.characterFontFamily = setting.characterFontFamily;
		guiConfig.characterFontWeight = setting.characterFontWeight;
		gui.listen();
	}
	function reset() {
		presetController.prependOption(customOpt, true);
		guiConfig.preset = customOpt;
	}
	function copy(obj) {
		var cloneObj = {};
		for (var name in obj) {
			cloneObj[name] = obj[name];
		}
		return cloneObj;
	}
	function onResize() {
		output.style.left = (window.innerWidth - imgWidth) * 0.5 + "px";
		output.style.top = ((window.innerHeight - imgHeight) * 0.5) + 16 + "px";
		canvas.style.left = (window.innerWidth - canvas.width) * 0.5 + "px";
		canvas.style.top = ((window.innerHeight - canvas.height) * 0.5) + 16 + "px";
	}
	function browse(ev) {
		input.click();
	}
	function save(ev) {
		if (imgLoaded) {
			viewSource();
		}
	}
	function onFileChanged(ev) {
		if (this.files.length) {
			loadFromUrl(this.files[0]);
		}
	}
	function onDropFile(ev) {
		ev.stopPropagation();
		ev.preventDefault();
		var files = ev.dataTransfer.files;
		if (files.length) {
			loadFromUrl(files[0]);
		}
	}
	function loadFromUrl(url) {
		var reader = new FileReader();
		reader.onloadend = onLoaded;
		reader.readAsDataURL(url);
	}
	function onLoaded(ev) {
		if (ev.target.result.match(/^data:image/gi)) {
			guiConfig.imageURL = A;
			img.src = ev.target.result;
			setTimeout(processImage, 100);
		} else {
			alert("Unexpected file format, dude.");
		}
	}
	function loadImage(url) {
		img.onload = function() {
			imgLoaded = true;
			processImage();
		};
		img.onerror = function() {
			alert("Failed to load image with URL " + img.src);
		};
		img.src = url;
	}
	function processImage() {
		useCanvas = guiConfig.useCanvas;
		if (guiConfig.backgroundColor === "transparent") {
			document.querySelector("html").style.background = 'url("assets/images/transparent-pattern.png")';
		} else {
			if (guiConfig.backgroundColor !== "image") {
				document.querySelector("html").style.background = guiConfig.backgroundColor;
			}
		}
		imgWidth = img.width;
		imgHeight = img.height;
		var innerWidth = window.innerWidth * 0.8;
		var innerHeight = window.innerHeight * 0.8;
		var ratio = 1;
		if (imgWidth > innerWidth || imgHeight > innerHeight) {
			ratio = Math.min(innerWidth / imgWidth, innerHeight / imgHeight);
			imgWidth = Math.floor(imgWidth * ratio);
			imgHeight = Math.floor(imgHeight * ratio);
		}
		output.innerHTML = "";
		output.style.width = imgWidth + "px";
		output.style.height = imgHeight + "px";
		output.style.fontFamily = guiConfig.characterFontFamily;
		output.style.fontWeight = guiConfig.characterFontWeight;
		G = r * guiConfig.characterScale * 1.5;
		context.restore();
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.save();
		canvas.width = imgWidth + (G * 2);
		canvas.height = imgHeight + (G * 2);
		if (useCanvas) {
			if (guiConfig.backgroundColor === "image") {
				context.save();
				context.translate(G, G);
				context.scale(imgWidth / img.width, imgHeight / img.height);
				context.drawImage(img, 0, 0, img.width, img.height);
				context.restore();
			} else {
				if (guiConfig.backgroundColor !== "transparent") {
					context.fillStyle = guiConfig.backgroundColor;
					context.fillRect(0, 0, canvas.width, canvas.height);
				}
			}
		}
		context.translate(G, G);
		hiddenCanvas.width = imgWidth;
		hiddenCanvas.height = imgHeight;
		hiddenContext.save();
		hiddenContext.scale(ratio, ratio);
		hiddenContext.drawImage(img, 0, 0, img.width, img.height);
		hiddenContext.restore();
		imageData = hiddenContext.getImageData(0, 0, imgWidth, imgHeight).data;
		dataSize = imageData.length / 4;
		charCollection = [];
		onResize();
		draw();
	}
	function d() {
		context.save();
		context.font = guiConfig.characterFontWeight + " " + (r * guiConfig.characterScale) + "px " + guiConfig.characterFontFamily;
		var aj = context.measureText("X").width;
		context.restore();
		return aj;
	}
	function draw() {
		var isTransparent = guiConfig.backgroundColor === "transparent";
		for (var i = 0; i < num; i++) {
			var pixelOffset = Math.floor(Math.random() * dataSize);
			var dataOffset = pixelOffset * 4;
			var row = Math.floor(pixelOffset / imgWidth);
			var col = Math.round(((pixelOffset / imgWidth) - row) * imgWidth);
			var fontSize = Math.round(k + Math.random() * r) * guiConfig.characterScale;
			var character = guiConfig.characterSet[Math.floor(Math.random() * guiConfig.characterSet.length)];
			var color = {
				r: imageData[dataOffset],
				g: imageData[dataOffset + 1],
				b: imageData[dataOffset + 2],
				a: (0.3 + Math.random() * 0.7).toFixed(2)
			};
			var alpha = imageData[dataOffset + 3] / 255;
			if (isTransparent && alpha === 0) {
				color.a = 0;
			}
			if (guiConfig.filter === "Black & White") {
				color.r = color.g = color.b = Math.round((color.r + color.g + color.b) / 3);
			} else {
				if (guiConfig.filter === "Sepia") {
					color.r = color.g = color.b = Math.round((color.r + color.g + color.b) / 3);
					color.b = Math.round(color.b * 0.85);
				}
			}
			if (useCanvas) {
				col -= fontSize / 2;
				row += fontSize / 2;
				context.save();
				context.font = guiConfig.characterFontWeight + " " + fontSize + "px " + guiConfig.characterFontFamily;
				context.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + ", " + color.a + ")";
				context.fillText(character, col, row);
				context.restore();
				charCollection.push(character);
			} else {
				col -= fontSize / 2;
				row -= fontSize / 2;
				var ak = document.createElement("p");
				ak.style.left = col + "px";
				ak.style.top = row + "px";
				ak.style.color = "rgba(" + color.r + "," + color.g + "," + color.b + ", " + color.a + ")";
				ak.style.fontSize = fontSize + "px";
				ak.innerHTML = character;
				output.appendChild(ak);
				charCollection.push(ak);
			}
		}
		if (charCollection.length < guiConfig.characterLimit) {
			progress.style.visibility = "visible";
			progressContent.style.width = (Math.min(charCollection.length / guiConfig.characterLimit, 1) * progress.offsetWidth) + "px";
			requestAnimFrame(draw);
		} else {
			progress.style.visibility = "hidden";
			progressContent.style.width = "0px";
		}
	}
	function viewSource() {
		if (useCanvas) {
			var al = window.open("Textify Source", "height=400, width=700, toolbar=no, scrollbars=no, menubar=no");
			al.document.write('<img src="' + canvas.toDataURL() + '"/>');
		} else {
			var al = window.open("", "Textify Source", "height=400, width=700, toolbar=no, scrollbars=no, menubar=no");
			var aj = al.document.createElement("textarea");
			aj.setAttribute("cols", "92");
			aj.setAttribute("rows", "27");
			aj.innerHTML += "<style>\n";
			aj.innerHTML += "	.textify-output p {\n";
			aj.innerHTML += "		position: absolute;\n";
			aj.innerHTML += "	}\n";
			aj.innerHTML += "</style>\n";
			var ak = al.document.createElement("div");
			ak.setAttribute("class", "textify-output");
			ak.style.fontFamily = guiConfig.characterFontFamily;
			ak.style.fontWeight = guiConfig.characterFontWeight;
			ak.innerHTML += output.innerHTML;
			aj.innerHTML += ak.outerHTML;
			al.document.write(aj.outerHTML);
		}
	}
	return {
		initialize: initialize,
		viewSource: viewSource
	};
})();
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(fn, a) {
		window.setTimeout(fn, 1000 / 60);
	};
})();
Textify.initialize();
