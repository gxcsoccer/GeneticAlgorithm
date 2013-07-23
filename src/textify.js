/*!
 * Textify, http://textify.it
 *
 * Copyright (C) 2010 Hakim El Hattab, http://hakim.se
 */
var Textify = (function() {
	var v = 1000;
	var L = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg"][Math.floor(Math.random() * 5)];
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
	var ad = {},
		Y, x, N, W, l, s, U, E, J, q, B, u, K, S, y, H, O, M, T, aa, ab, R, G = 0,
		f, o, af, n, a = 1,
		c = 1,
		Q = false,
		j = false,
		P = !! navigator.userAgent.toLowerCase().match(/ipod/gi),
		i = !! navigator.userAgent.toLowerCase().match(/ipad/gi),
		m = !! navigator.userAgent.toLowerCase().match(/iphone/gi),
		p = !! navigator.userAgent.toLowerCase().match(/ipod|ipad|iphone/gi);

	function g() {
		f = document.createElement("img");
		M = document.createElement("canvas");
		T = M.getContext("2d");
		ab = document.createElement("canvas");
		ab.setAttribute("class", "textify-output-canvas");
		R = ab.getContext("2d");
		aa = document.createElement("div");
		aa.setAttribute("class", "textify-output-html");
		K = document.createElement("div");
		K.setAttribute("class", "textify-progress");
		S = document.createElement("div");
		K.appendChild(S);
		progressText = document.createElement("p");
		K.appendChild(progressText);
		y = document.createElement("input");
		y.setAttribute("type", "file");
		y.style.visibility = "hidden";
		document.body.appendChild(y);
		document.body.appendChild(ab);
		document.body.appendChild(aa);
		document.body.appendChild(K);
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
		X(L);
	}
	function ai() {
		Y = new DAT.GUI({
			width: 280
		});
		ad = ac(I.ABC);
		ad.redraw = function() {
			if (Q) {
				ah();
			}
		};
		ad.save = function() {
			if (Q) {
				C();
			}
		};
		ad.image = function() {
			y.click();
		};
		x = Y.add(ad, "preset").name("Preset").options("ABC", "Pointillism", "Mosaic", "Stitch", "@#%", "Bubbles", "StarStruck", "Pixelate", "Binary", "Snow", "Dash").onChange(function(aj) {
			x.removeOption(w);
			t(I[aj]);
		});
		W = Y.add(ad, "filter").name("Filter").options("None", "Black & White", "Sepia").listen().onChange(D);
		l = Y.add(ad, "backgroundColor").name("Background").options({
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
		s = Y.add(ad, "characterSet").name("Character Set").listen().onChange(D);
		U = Y.add(ad, "characterLimit").name("Character Count").min(1000).max(100000).step(500).listen().onChange(D);
		E = Y.add(ad, "characterScale").name("Font Scale").min(0.1).max(5).step(0.1).listen().onChange(D);
		J = Y.add(ad, "characterFontFamily").name("Font Family").options({
			Arial: "Arial",
			"Comic Sans MS": "Comic Sans MS",
			Helvetica: "Helvetica",
			monospace: "monospace",
			"Times New Roman": "Times New Roman"
		}).listen().onChange(D);
		guiFontWeight = Y.add(ad, "characterFontWeight").name("Font Weight").options("normal", "bold", "bolder").listen().onChange(D);
		u = Y.add(ad, "redraw").name("Apply Settings");
		u.domElement.className += " apply-button";
		Y.domElement.style.position = "absolute";
		Y.domElement.style.top = "0px";
		Y.domElement.style.right = "-20px";
		document.querySelector(".guidat-controllers").style.height = "auto";
		DAT.GUI.autoPlace = false;
		Y.autoListen = false;
	}
	function t(aj) {
		ad.filter = aj.filter;
		ad.backgroundColor = aj.backgroundColor;
		ad.characterSet = aj.characterSet;
		ad.characterLimit = aj.characterLimit;
		ad.characterScale = aj.characterScale;
		ad.characterFontFamily = aj.characterFontFamily;
		ad.characterFontWeight = aj.characterFontWeight;
		Y.listen();
	}
	function D() {
		x.prependOption(w, true);
		ad.preset = w;
	}
	function ac(al) {
		var ak = {};
		for (var aj in al) {
			ak[aj] = al[aj];
		}
		return ak;
	}
	function z() {
		aa.style.left = (window.innerWidth - a) * 0.5 + "px";
		aa.style.top = ((window.innerHeight - c) * 0.5) + 16 + "px";
		ab.style.left = (window.innerWidth - ab.width) * 0.5 + "px";
		ab.style.top = ((window.innerHeight - ab.height) * 0.5) + 16 + "px";
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
			ad.imageURL = A;
			f.src = aj.target.result;
			setTimeout(ah, 100);
		} else {
			alert("Unexpected file format, dude.");
		}
	}
	function X(aj) {
		f.onload = function() {
			Q = true;
			ah();
		};
		f.onerror = function() {
			alert("Failed to load image with URL " + f.src);
		};
		f.src = aj;
	}
	function ah() {
		j = ad.useCanvas;
		if (ad.backgroundColor === "transparent") {
			document.querySelector("html").style.background = 'url("assets/images/transparent-pattern.png")';
		} else {
			if (ad.backgroundColor !== "image") {
				document.querySelector("html").style.background = ad.backgroundColor;
			}
		}
		a = f.width;
		c = f.height;
		var ak = window.innerWidth * 0.8;
		var aj = window.innerHeight * 0.8;
		var al = 1;
		if (a > ak || c > aj) {
			al = Math.min(ak / a, aj / c);
			a = Math.floor(a * al);
			c = Math.floor(c * al);
		}
		aa.innerHTML = "";
		aa.style.width = a + "px";
		aa.style.height = c + "px";
		aa.style.fontFamily = ad.characterFontFamily;
		aa.style.fontWeight = ad.characterFontWeight;
		G = r * ad.characterScale * 1.5;
		R.restore();
		R.clearRect(0, 0, ab.width, ab.height);
		R.save();
		ab.width = a + (G * 2);
		ab.height = c + (G * 2);
		if (j) {
			if (ad.backgroundColor === "image") {
				R.save();
				R.translate(G, G);
				R.scale(a / f.width, c / f.height);
				R.drawImage(f, 0, 0, f.width, f.height);
				R.restore();
			} else {
				if (ad.backgroundColor !== "transparent") {
					R.fillStyle = ad.backgroundColor;
					R.fillRect(0, 0, ab.width, ab.height);
				}
			}
		}
		R.translate(G, G);
		M.width = a;
		M.height = c;
		T.save();
		T.scale(al, al);
		T.drawImage(f, 0, 0, f.width, f.height);
		T.restore();
		o = T.getImageData(0, 0, a, c).data;
		af = o.length / 4;
		n = [];
		if (q) {
			q.name(j ? "Save Image" : "View Source");
		}
		z();
		ag();
	}
	function d() {
		R.save();
		R.font = ad.characterFontWeight + " " + (r * ad.characterScale) + "px " + ad.characterFontFamily;
		var aj = R.measureText("X").width;
		R.restore();
		return aj;
	}
	function ag() {
		var at = ad.backgroundColor === "transparent";
		for (var an = 0; an < v; an++) {
			var ao = Math.floor(Math.random() * af);
			var aj = ao * 4;
			var ap = Math.floor(ao / a);
			var aq = Math.round(((ao / a) - ap) * a);
			var au = Math.round(k + Math.random() * r) * ad.characterScale;
			var ar = ad.characterSet[Math.floor(Math.random() * ad.characterSet.length)];
			var am = {
				r: o[aj],
				g: o[aj + 1],
				b: o[aj + 2],
				a: (0.3 + Math.random() * 0.7).toFixed(2)
			};
			var al = o[aj + 3] / 255;
			if (at && al === 0) {
				am.a = 0;
			}
			if (ad.filter === "Black & White") {
				am.r = am.g = am.b = Math.round((am.r + am.g + am.b) / 3);
			} else {
				if (ad.filter === "Sepia") {
					am.r = am.g = am.b = Math.round((am.r + am.g + am.b) / 3);
					am.b = Math.round(am.b * 0.85);
				}
			}
			if (j) {
				aq -= au / 2;
				ap += au / 2;
				R.save();
				R.font = ad.characterFontWeight + " " + au + "px " + ad.characterFontFamily;
				R.fillStyle = "rgba(" + am.r + "," + am.g + "," + am.b + ", " + am.a + ")";
				R.fillText(ar, aq, ap);
				R.restore();
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
				aa.appendChild(ak);
				n.push(ak);
			}
		}
		if (n.length < ad.characterLimit) {
			K.style.visibility = "visible";
			S.style.width = (Math.min(n.length / ad.characterLimit, 1) * K.offsetWidth) + "px";
			requestAnimFrame(ag);
		} else {
			K.style.visibility = "hidden";
			S.style.width = "0px";
		}
	}
	function C() {
		if (j) {
			var al = window.open("Textify Source", "height=400, width=700, toolbar=no, scrollbars=no, menubar=no");
			al.document.write('<img src="' + ab.toDataURL() + '"/>');
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
			ak.style.fontFamily = ad.characterFontFamily;
			ak.style.fontWeight = ad.characterFontWeight;
			ak.innerHTML += aa.innerHTML;
			aj.innerHTML += ak.outerHTML;
			al.document.write(aj.outerHTML);
		}
	}
	return {
		initialize: g,
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