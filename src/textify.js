/*!
 * Textify, http://textify.it
 *
 * Copyright (C) 2010 Hakim El Hattab, http://hakim.se
 */
var Textify = (function() {
	var v = 1000;
	var image = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg"][Math.floor(Math.random() * 5)];
	var A = "(Drag and drop works too)";
	var V = "@%#";
	var w = "Custom";
	var k = 10;
	var r = 15;
	var I = {
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
		gui, x, N, W, l, s, U, E, J, q, B, u, progress, S, y, H, O, hiddenCanvas, hiddenContext, output, canvas, context, G = 0,
		img, imageData, af, n, a = 1,
		c = 1,
		Q = false,
		j = false,
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
		S = document.createElement("div");
		progress.appendChild(S);
		progressText = document.createElement("p");
		progress.appendChild(progressText);
		y = document.createElement("input");
		y.setAttribute("type", "file");
		y.style.visibility = "hidden";
		document.body.appendChild(y);
		document.body.appendChild(canvas);
		document.body.appendChild(output);
		document.body.appendChild(progress);
		H = document.querySelector(".browse-button");
		O = document.querySelector(".save-button");
		window.addEventListener("resize", z, false);
		document.addEventListener("dragover", function(aj) {
			aj.preventDefault();
		}, false);
		document.addEventListener("dragenter", function(aj) {
			aj.preventDefault();
		}, false);
		document.addEventListener("dragexit", function(aj) {
			aj.preventDefault();
		}, false);
		document.addEventListener("drop", F, false);
		y.addEventListener("change", ae, false);
		H.addEventListener("click", e, false);
		O.addEventListener("click", b, false);
		ai();
		loadImage(image);
	}
	function ai() {
		gui = new DAT.GUI({
			width: 280
		});
		guiConfig = copy(I.ABC);
		guiConfig.redraw = function() {
			if (Q) {
				ah();
			}
		};
		guiConfig.save = function() {
			if (Q) {
				C();
			}
		};
		guiConfig.image = function() {
			y.click();
		};
		x = gui.add(guiConfig, "preset").name("Preset").options("ABC", "Pointillism", "Mosaic", "Stitch", "@#%", "Bubbles", "StarStruck", "Pixelate", "Binary", "Snow", "Dash").onChange(function(aj) {
			x.removeOption(w);
			t(I[aj]);
		});
		W = gui.add(guiConfig, "filter").name("Filter").options("None", "Black & White", "Sepia").listen().onChange(D);
		l = gui.add(guiConfig, "backgroundColor").name("Background").options({
			"Dark Grey": "#333",
			"Light Grey": "#888",
			Black: "#000",
			White: "#fff",
			Red: "#c21a08",
			Green: "#54ad3c",
			Blue: "#6c94d2",
			Transparent: "transparent",
			"Source Image": "image"
		}).listen().onChange(D);
		s = gui.add(guiConfig, "characterSet").name("Character Set").listen().onChange(D);
		U = gui.add(guiConfig, "characterLimit").name("Character Count").min(1000).max(100000).step(500).listen().onChange(D);
		E = gui.add(guiConfig, "characterScale").name("Font Scale").min(0.1).max(5).step(0.1).listen().onChange(D);
		J = gui.add(guiConfig, "characterFontFamily").name("Font Family").options({
			Arial: "Arial",
			"Comic Sans MS": "Comic Sans MS",
			Helvetica: "Helvetica",
			monospace: "monospace",
			"Times New Roman": "Times New Roman"
		}).listen().onChange(D);
		guiFontWeight = gui.add(guiConfig, "characterFontWeight").name("Font Weight").options("normal", "bold", "bolder").listen().onChange(D);
		u = gui.add(guiConfig, "redraw").name("Apply Settings");
		u.domElement.className += " apply-button";
		gui.domElement.style.position = "absolute";
		gui.domElement.style.top = "0px";
		gui.domElement.style.right = "-20px";
		document.querySelector(".guidat-controllers").style.height = "auto";
		DAT.GUI.autoPlace = false;
		gui.autoListen = false;
	}
	function t(aj) {
		guiConfig.filter = aj.filter;
		guiConfig.backgroundColor = aj.backgroundColor;
		guiConfig.characterSet = aj.characterSet;
		guiConfig.characterLimit = aj.characterLimit;
		guiConfig.characterScale = aj.characterScale;
		guiConfig.characterFontFamily = aj.characterFontFamily;
		guiConfig.characterFontWeight = aj.characterFontWeight;
		gui.listen();
	}
	function D() {
		x.prependOption(w, true);
		guiConfig.preset = w;
	}
	function copy(al) {
		var ak = {};
		for (var aj in al) {
			ak[aj] = al[aj];
		}
		return ak;
	}
	function z() {
		output.style.left = (window.innerWidth - a) * 0.5 + "px";
		output.style.top = ((window.innerHeight - c) * 0.5) + 16 + "px";
		canvas.style.left = (window.innerWidth - canvas.width) * 0.5 + "px";
		canvas.style.top = ((window.innerHeight - canvas.height) * 0.5) + 16 + "px";
	}
	function e(aj) {
		y.click();
	}
	function b(aj) {
		if (Q) {
			C();
		}
	}
	function ae(aj) {
		if (this.files.length) {
			h(this.files[0]);
		}
	}
	function F(ak) {
		ak.stopPropagation();
		ak.preventDefault();
		var aj = ak.dataTransfer.files;
		if (aj.length) {
			h(aj[0]);
		}
	}
	function h(ak) {
		var aj = new FileReader();
		aj.onloadend = Z;
		aj.readAsDataURL(ak);
	}
	function Z(aj) {
		if (aj.target.result.match(/^data:image/gi)) {
			guiConfig.imageURL = A;
			img.src = aj.target.result;
			setTimeout(ah, 100);
		} else {
			alert("Unexpected file format, dude.");
		}
	}
	function loadImage(url) {
		img.onload = function() {
			Q = true;
			ah();
		};
		img.onerror = function() {
			alert("Failed to load image with URL " + img.src);
		};
		img.src = url;
	}
	function ah() {
		j = guiConfig.useCanvas;
		if (guiConfig.backgroundColor === "transparent") {
			document.querySelector("html").style.background = 'url("assets/images/transparent-pattern.png")';
		} else {
			if (guiConfig.backgroundColor !== "image") {
				document.querySelector("html").style.background = guiConfig.backgroundColor;
			}
		}
		a = img.width;
		c = img.height;
		var ak = window.innerWidth * 0.8;
		var aj = window.innerHeight * 0.8;
		var al = 1;
		if (a > ak || c > aj) {
			al = Math.min(ak / a, aj / c);
			a = Math.floor(a * al);
			c = Math.floor(c * al);
		}
		output.innerHTML = "";
		output.style.width = a + "px";
		output.style.height = c + "px";
		output.style.fontFamily = guiConfig.characterFontFamily;
		output.style.fontWeight = guiConfig.characterFontWeight;
		G = r * guiConfig.characterScale * 1.5;
		context.restore();
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.save();
		canvas.width = a + (G * 2);
		canvas.height = c + (G * 2);
		if (j) {
			if (guiConfig.backgroundColor === "image") {
				context.save();
				context.translate(G, G);
				context.scale(a / img.width, c / img.height);
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
		hiddenCanvas.width = a;
		hiddenCanvas.height = c;
		hiddenContext.save();
		hiddenContext.scale(al, al);
		hiddenContext.drawImage(img, 0, 0, img.width, img.height);
		hiddenContext.restore();
		imageData = hiddenContext.getImageData(0, 0, a, c).data;
		af = imageData.length / 4;
		n = [];
		if (q) {
			q.name(j ? "Save Image" : "View Source");
		}
		z();
		ag();
	}
	function d() {
		context.save();
		context.font = guiConfig.characterFontWeight + " " + (r * guiConfig.characterScale) + "px " + guiConfig.characterFontFamily;
		var aj = context.measureText("X").width;
		context.restore();
		return aj;
	}
	function ag() {
		var at = guiConfig.backgroundColor === "transparent";
		for (var an = 0; an < v; an++) {
			var ao = Math.floor(Math.random() * af);
			var aj = ao * 4;
			var ap = Math.floor(ao / a);
			var aq = Math.round(((ao / a) - ap) * a);
			var au = Math.round(k + Math.random() * r) * guiConfig.characterScale;
			var ar = guiConfig.characterSet[Math.floor(Math.random() * guiConfig.characterSet.length)];
			var am = {
				r: imageData[aj],
				g: imageData[aj + 1],
				b: imageData[aj + 2],
				a: (0.3 + Math.random() * 0.7).toFixed(2)
			};
			var al = imageData[aj + 3] / 255;
			if (at && al === 0) {
				am.a = 0;
			}
			if (guiConfig.filter === "Black & White") {
				am.r = am.g = am.b = Math.round((am.r + am.g + am.b) / 3);
			} else {
				if (guiConfig.filter === "Sepia") {
					am.r = am.g = am.b = Math.round((am.r + am.g + am.b) / 3);
					am.b = Math.round(am.b * 0.85);
				}
			}
			if (j) {
				aq -= au / 2;
				ap += au / 2;
				context.save();
				context.font = guiConfig.characterFontWeight + " " + au + "px " + guiConfig.characterFontFamily;
				context.fillStyle = "rgba(" + am.r + "," + am.g + "," + am.b + ", " + am.a + ")";
				context.fillText(ar, aq, ap);
				context.restore();
				n.push(ar);
			} else {
				aq -= au / 2;
				ap -= au / 2;
				var ak = document.createElement("p");
				ak.style.left = aq + "px";
				ak.style.top = ap + "px";
				ak.style.color = "rgba(" + am.r + "," + am.g + "," + am.b + ", " + am.a + ")";
				ak.style.fontSize = au + "px";
				ak.innerHTML = ar;
				output.appendChild(ak);
				n.push(ak);
			}
		}
		if (n.length < guiConfig.characterLimit) {
			progress.style.visibility = "visible";
			S.style.width = (Math.min(n.length / guiConfig.characterLimit, 1) * progress.offsetWidth) + "px";
			requestAnimFrame(ag);
		} else {
			progress.style.visibility = "hidden";
			S.style.width = "0px";
		}
	}
	function C() {
		if (j) {
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
		viewSource: C
	};
})();
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(b, a) {
		window.setTimeout(b, 1000 / 60);
	};
})();
Textify.initialize();
