
_sig = function (H) {
	var A = {
		"a": 870,
		"b": 906,
		"c": 167,
		"d": 119,
		"e": 130,
		"f": 899,
		"g": 248,
		"h": 123,
		"i": 627,
		"j": 706,
		"k": 694,
		"l": 421,
		"m": 214,
		"n": 561,
		"o": 819,
		"p": 925,
		"q": 857,
		"r": 539,
		"s": 898,
		"t": 866,
		"u": 433,
		"v": 299,
		"w": 137,
		"x": 285,
		"y": 613,
		"z": 635,
		"_": 638,
		"&": 639,
		"-": 880,
		"/": 687,
		"=": 721
	}
		;
	fn = function (I, B) {
		for (var R = 0; R < I.length; R++) {
			if (I[R] == B)
				return R;
		}
		return -1;
	}
	;
	var F = 1.51214;
	var N = 3219;
	for (var Y = 0; Y < H.length; Y++) {
		var Q = H.substr(Y, 1).toLowerCase();
		if (fn(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], Q) > -1) {
			N = N + (parseInt(Q) * 121 * F);
		} else {
			if (Q in A) {
				N = N + (A[Q] * F);
			}
		}
		N = N * 0.1;
	}
	N = Math.round(N * 1000);
	return N;
}
;

!function (a) {
	function c(k, b, c) {
		"addEventListener" in a ? k.addEventListener(b, c, !1) : "attachEvent" in a && k.attachEvent("on" + b, c)
	}

	function e(k, b, c) {
		"removeEventListener" in a ? k.removeEventListener(b, c, !1) : "detachEvent" in a && k.detachEvent("on" + b, c)
	}

	function n() {
		var k, b = ["moz", "webkit", "o", "ms"];
		for (k = 0; k < b.length && !y; k += 1)
			y = a[b[k] + "RequestAnimationFrame"];
		y || l("setup", "RequestAnimationFrame not supported")
	}

	function v(k) {
		var b = "Host page: " + k;
		return a.top !== a.self && (b = a.parentIFrame && a.parentIFrame.getId ?
		a.parentIFrame.getId() + ": " + k : "Nested host page: " + k),
			b
	}

	function l(a, c) {
		p("log", a, c, b[a] ? b[a].log : E)
	}

	function w(a, b) {
		p("warn", a, b, !0)
	}

	function p(k, b, c, d) {
		!0 === d && "object" == typeof a.console && console[k](F + "[" + v(b) + "]", c)
	}

	function G(k) {
		function u() {
			d("Height");
			d("Width");
			J(function () {
				K(q);
				L(f)
			}, q, "init")
		}

		function X() {
			var a = t.substr(I).split(":");
			return {
				iframe: b[a[0]].iframe,
				id: a[0],
				height: a[1],
				width: a[2],
				type: a[3]
			}
		}

		function d(a) {
			var k = Number(b[f]["max" + a])
				, c = Number(b[f]["min" + a]);
			a = a.toLowerCase();
			var d =
				Number(q[a]);
			l(f, "Checking " + a + " is in range " + c + "-" + k);
			c > d && (d = c,
				l(f, "Set " + a + " to min value"));
			d > k && (d = k,
				l(f, "Set " + a + " to max value"));
			q[a] = "" + d
		}

		function n() {
			function a() {
				function k() {
					var a = 0
						, b = !1;
					for (l(f, "Checking connection is from allowed list of origins: " + d); a < d.length; a++)
						if (d[a] === c) {
							b = !0;
							break
						}
					return b
				}

				function u() {
					var a = b[f].remoteHost;
					return l(f, "Checking connection is from: " + a),
					c === a
				}

				return d.constructor === Array ? k() : u()
			}

			var c = k.origin
				, d = b[f].checkOrigin;
			if (d && "null" != "" + c && !a())
				throw Error("Unexpected message received from: " +
					c + " for " + q.iframe.id + ". Message was: " + k.data + ". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");
			return !0
		}

		function v() {
			var a = q.type in {
					"true": 1,
					"false": 1,
					undefined: 1
				};
			return a && l(f, "Ignoring init message from meta parent page"),
				a
		}

		function m(a) {
			l(f, "MessageCallback passed: {iframe: " + q.iframe.id + ", message: " + a + "}");
			a = {
				iframe: q.iframe,
				message: JSON.parse(a)
			};
			A(f, "messageCallback", a);
			l(f, "--")
		}

		function M(k, b) {
			H(function () {
				var c = x, d;
				d = document.body.getBoundingClientRect();
				var f = q.iframe.getBoundingClientRect();
				d = JSON.stringify({
					iframeHeight: f.height,
					iframeWidth: f.width,
					clientHeight: Math.max(document.documentElement.clientHeight, a.innerHeight || 0),
					clientWidth: Math.max(document.documentElement.clientWidth, a.innerWidth || 0),
					offsetTop: parseInt(f.top - d.top, 10),
					offsetLeft: parseInt(f.left - d.left, 10),
					scrollTop: a.pageYOffset,
					scrollLeft: a.pageXOffset
				});
				c("Send Page Info", "pageInfo:" + d, k, b)
			}, 32)
		}

		function Y() {
			function k(c, f) {
				function e() {
					b[u] ?
						M(b[u].iframe, u) : d()
				}

				["scroll", "resize"].forEach(function (k) {
					l(u, c + k + " listener for sendPageInfo");
					f(a, k, e)
				})
			}

			function d() {
				k("Remove ", e)
			}

			var u = f;
			k("Add ", c);
			b[u].stopPageInfo = d
		}

		function Z() {
			var a = !0;
			return null === q.iframe && (w(f, "IFrame (" + q.id + ") not found"),
				a = !1),
				a
		}

		function y(a) {
			a = a.getBoundingClientRect();
			return N(f),
			{
				x: Math.floor(Number(a.left) + Number(r.x)),
				y: Math.floor(Number(a.top) + Number(r.y))
			}
		}

		function z(k) {
			var b = k ? y(q.iframe) : {
				x: 0,
				y: 0
			}
				, c = {
				x: Number(q.width) + b.x,
				y: Number(q.height) + b.y
			};
			l(f,
				"Reposition requested from iFrame (offset x:" + b.x + " y:" + b.y + ")");
			a.top !== a.self ? a.parentIFrame ? a.parentIFrame["scrollTo" + (k ? "Offset" : "")](c.x, c.y) : w(f, "Unable to scroll to requested position, window.parentIFrame not found") : (r = c,
				B(),
				l(f, "--"))
		}

		function B() {
			!1 !== A(f, "scrollCallback", r) ? L(f) : r = null
		}

		function C(k) {
			k = k.split("#")[1] || "";
			var b = decodeURIComponent(k);
			(b = document.getElementById(b) || document.getElementsByName(b)[0]) ? (b = y(b),
				l(f, "Moving to in page link (#" + k + ") at x: " + b.x + " y: " + b.y),
				r = {
					x: b.x,
					y: b.y
				},
				B(),
				l(f, "--")) : a.top !== a.self ? a.parentIFrame ? a.parentIFrame.moveToAnchor(k) : l(f, "In page link #" + k + " not found and window.parentIFrame not found") : l(f, "In page link #" + k + " not found")
		}

		function D(a) {
			var k = !0;
			return b[a] || (k = !1,
				w(q.type + " No settings for " + a + ". Message was: " + t)),
				k
		}

		function G() {
			for (var a in b)
				x("iFrame requested init", O(a), document.getElementById(a), a)
		}

		var t = k.data
			, q = {}
			, f = null;
		if ("[iFrameResizerChild]Ready" === t)
			G();
		else if (F === ("" + t).substr(0, I) && t.substr(I).split(":")[0] in b) {
			if (q =
					X(),
					f = q.id,
				!v() && D(f) && (l(f, "Received: " + t),
				Z() && n()))
				switch (b[f].firstRun && (b[f].firstRun = !1),
					q.type) {
					case "close":
						P(q.iframe);
						break;
					case "message":
						m(t.substr(t.indexOf(":") + Q + 6));
						break;
					case "scrollTo":
						z(!1);
						break;
					case "scrollToOffset":
						z(!0);
						break;
					case "pageInfo":
						M(b[f].iframe, f);
						Y();
						break;
					case "pageInfoStop":
						b[f] && b[f].stopPageInfo && (b[f].stopPageInfo(),
							delete b[f].stopPageInfo);
						break;
					case "inPageLink":
						C(t.substr(t.indexOf(":") + Q + 9));
						break;
					case "reset":
						R(q);
						break;
					case "init":
						u();
						A(f, "initCallback",
							q.iframe);
						A(f, "resizedCallback", q);
						break;
					default:
						u(),
							A(f, "resizedCallback", q)
				}
		} else
			p("info", f, "Ignored: " + t, b[f] ? b[f].log : E)
	}

	function A(a, c, l) {
		var d = null
			, e = null;
		if (b[a]) {
			if (d = b[a][c],
				"function" != typeof d)
				throw new TypeError(c + " on iFrame[" + a + "] is not a function");
			e = d(l)
		}
		return e
	}

	function P(a) {
		var c = a.id;
		l(c, "Removing iFrame: " + c);
		a.parentNode.removeChild(a);
		A(c, "closedCallback", c);
		l(c, "--");
		delete b[c]
	}

	function N(b) {
		null === r && (r = {
			x: void 0 !== a.pageXOffset ? a.pageXOffset : document.documentElement.scrollLeft,
			y: void 0 !== a.pageYOffset ? a.pageYOffset : document.documentElement.scrollTop
		},
			l(b, "Get page position: " + r.x + "," + r.y))
	}

	function L(b) {
		null !== r && (a.scrollTo(r.x, r.y),
			l(b, "Set page position: " + r.x + "," + r.y),
			r = null )
	}

	function R(a) {
		l(a.id, "Size reset requested by " + ("init" === a.type ? "host page" : "iFrame"));
		N(a.id);
		J(function () {
			K(a);
			x("reset", "reset", a.iframe, a.id)
		}, a, "reset")
	}

	function K(a) {
		function c(b) {
			a.iframe.style[b] = a[b] + "px";
			l(a.id, "IFrame (" + e + ") " + b + " set to " + a[b] + "px");
			S || "0" !== a[b] || (S = !0,
				l(e, "Hidden iFrame detected, creating visibility listener"),
				aa())
		}

		var e = a.iframe.id;
		b[e] && (b[e].sizeHeight && c("height"),
		b[e].sizeWidth && c("width"))
	}

	function J(a, b, c) {
		c !== b.type && y ? (l(b.id, "Requesting animation frame"),
			y(a)) : a()
	}

	function x(a, c, e, d) {
		d = d || e.id;
		if (b[d])
			if (e && "contentWindow" in e && null !== e.contentWindow) {
				var n = b[d].targetOrigin;
				l(d, "[" + a + "] Sending msg to iframe[" + d + "] (" + c + ") targetOrigin: " + n);
				e.contentWindow.postMessage(F + c, n)
			} else
				p("info", d, "[" + a + "] IFrame(" + d + ") not found", b[d] ? b[d].log : E),
				b[d] && delete b[d]
	}

	function O(a) {
		return a + ":" + b[a].bodyMarginV1 +
			":" + b[a].sizeWidth + ":" + b[a].log + ":" + b[a].interval + ":" + b[a].enablePublicMethods + ":" + b[a].autoResize + ":" + b[a].bodyMargin + ":" + b[a].heightCalculationMethod + ":" + b[a].bodyBackground + ":" + b[a].bodyPadding + ":" + b[a].tolerance + ":" + b[a].inPageLinks + ":" + b[a].resizeFrom + ":" + b[a].widthCalculationMethod
	}

	function T(a, e) {
		function n() {
			function c(d) {
				1 / 0 !== b[m][d] && 0 !== b[m][d] && (a.style[d] = b[m][d] + "px",
					l(m, "Set " + d + " = " + b[m][d] + "px"))
			}

			function d(a) {
				if (b[m]["min" + a] > b[m]["max" + a])
					throw Error("Value for min" + a + " can not be greater than max" +
						a);
			}

			d("Height");
			d("Width");
			c("maxHeight");
			c("minHeight");
			c("maxWidth");
			c("minWidth")
		}

		function d() {
			Function.prototype.bind && (b[m].iframe.iFrameResizer = {
				close: P.bind(null, b[m].iframe),
				resize: x.bind(null, "Window resize", "resize", b[m].iframe),
				moveToAnchor: function (a) {
					x("Move to anchor", "inPageLink:" + a, b[m].iframe, m)
				},
				sendMessage: function (a) {
					a = JSON.stringify(a);
					x("Send Message", "message:" + a, b[m].iframe, m)
				}
			})
		}

		function p(d) {
			c(a, "load", function () {
				x("iFrame.onload", d, a);
				var c = b[m].heightCalculationMethod in
					ba;
				!b[m].firstRun && c && R({
					iframe: a,
					height: 0,
					width: 0,
					type: "init"
				})
			});
			x("init", d, a)
		}

		function r(c) {
			c = c || {};
			b[m] = {
				firstRun: !0,
				iframe: a,
				remoteHost: a.src.split("/").slice(0, 3).join("/")
			};
			if ("object" != typeof c)
				throw new TypeError("Options is not an object");
			for (var d in z)
				z.hasOwnProperty(d) && (b[m][d] = c.hasOwnProperty(d) ? c[d] : z[d]);
			d = b[m];
			!0 === b[m].checkOrigin ? (c = b[m].remoteHost,
				c = "" === c || "file://" === c ? "*" : c) : c = "*";
			d.targetOrigin = c
		}

		var m = function (b) {
			if ("" === b) {
				var c = e && e.id || z.id + U++;
				b = (null !== document.getElementById(c) &&
				(c += U++),
					c);
				a.id = b;
				E = (e || {}).log;
				l(b, "Added missing iframe ID: " + b + " (" + a.src + ")")
			}
			return b
		}(a.id);
		m in b && "iFrameResizer" in a ? w(m, "Ignored iFrame, already setup.") : (r(e),
			l(m, "IFrame scrolling " + (b[m].scrolling ? "enabled" : "disabled") + " for " + m),
			a.style.overflow = !1 === b[m].scrolling ? "hidden" : "auto",
			a.scrolling = !1 === b[m].scrolling ? "no" : "yes",
			n(),
		("number" == typeof b[m].bodyMargin || "0" === b[m].bodyMargin) && (b[m].bodyMarginV1 = b[m].bodyMargin,
			b[m].bodyMargin = "" + b[m].bodyMargin + "px"),
			p(O(m)),
			d())
	}

	function H(a,
			   b) {
		null === B && (B = setTimeout(function () {
			B = null;
			a()
		}, b))
	}

	function aa() {
		function c() {
			for (var a in b)
				null === b[a].iframe.offsetParent || "0px" !== b[a].iframe.style.height && "0px" !== b[a].iframe.style.width || x("Visibility change", "resize", b[a].iframe, a)
		}

		function e(a) {
			l("window", "Mutation observed: " + a[0].target + " " + a[0].type);
			H(c, 16)
		}

		function n() {
			var a = document.querySelector("body");
			(new d(e)).observe(a, {
				attributes: !0,
				attributeOldValue: !1,
				characterData: !0,
				characterDataOldValue: !1,
				childList: !0,
				subtree: !0
			})
		}

		var d =
			a.MutationObserver || a.WebKitMutationObserver;
		d && n()
	}

	function C(a) {
		l("window", "Trigger event: " + a);
		H(function () {
			V("Window " + a, "resize")
		}, 16)
	}

	function W() {
		function a() {
			V("Tab Visable", "resize")
		}

		"hidden" !== document.visibilityState && (l("document", "Trigger event: Visiblity change"),
			H(a, 16))
	}

	function V(a, c) {
		for (var e in b)
			"parent" === b[e].resizeFrom && b[e].autoResize && !b[e].firstRun && x(a, c, document.getElementById(e), e)
	}

	function ca() {
		c(a, "message", G);
		c(a, "resize", function () {
			C("resize")
		});
		c(document, "visibilitychange",
			W);
		c(document, "-webkit-visibilitychange", W);
		c(a, "focusin", function () {
			C("focus")
		});
		c(a, "focus", function () {
			C("focus")
		})
	}

	function D() {
		function a(c, d) {
			if (d) {
				if (!d.tagName)
					throw new TypeError("Object is not a valid DOM element");
				if ("IFRAME" !== d.tagName.toUpperCase())
					throw new TypeError("Expected <IFRAME> tag, found <" + d.tagName + ">");
				T(d, c);
				b.push(d)
			}
		}

		var b;
		return n(),
			ca(),
			function (c, d) {
				switch (b = [],
					typeof d) {
					case "undefined":
					case "string":
						Array.prototype.forEach.call(document.querySelectorAll(d || "iframe"),
							a.bind(void 0, c));
						break;
					case "object":
						a(c, d);
						break;
					default:
						throw new TypeError("Unexpected data type (" + typeof d + ")");
				}
				return b
			}
	}

	function da(a) {
		a.fn.iFrameResize = function (a) {
			return this.filter("iframe").each(function (b, c) {
				T(c, a)
			}).end()
		}
	}

	var U = 0
		, E = !1
		, S = !1
		, Q = 7
		, F = "[iFrameSizer]"
		, I = F.length
		, r = null
		, y = a.requestAnimationFrame
		, ba = {
		max: 1,
		scroll: 1,
		bodyScroll: 1,
		documentElementScroll: 1
	}
		, b = {}
		, B = null
		, z = {
		autoResize: !0,
		bodyBackground: null,
		bodyMargin: null,
		bodyMarginV1: 8,
		bodyPadding: null,
		checkOrigin: !0,
		inPageLinks: !1,
		enablePublicMethods: !0,
		heightCalculationMethod: "bodyOffset",
		id: "iFrameResizer",
		interval: 32,
		log: !1,
		maxHeight: 1 / 0,
		maxWidth: 1 / 0,
		minHeight: 0,
		minWidth: 0,
		resizeFrom: "parent",
		scrolling: !1,
		sizeHeight: !0,
		sizeWidth: !1,
		tolerance: 0,
		widthCalculationMethod: "scroll",
		closedCallback: function () {
		},
		initCallback: function () {
		},
		messageCallback: function () {
			w("MessageCallback function not defined")
		},
		resizedCallback: function () {
		},
		scrollCallback: function () {
			return !0
		}
	};
	a.jQuery && da(jQuery);
	"function" == typeof define && define.amd ?
		define([], D) : "object" == typeof module && "object" == typeof module.exports ? module.exports = D() : a.iFrameResize = a.iFrameResize || D()
}(window || {});
var h, hCaptcha, info, video_id, interval, interval_diff = 5, latest_id = "", ad_code = "", error_count = 0, bFrame = !1, tlog = new Image, hashed_ads = !1, adcc = "glob", enableBetaAds = !1, lastAdRequest = (new Date).getTime(), adcnt = 0, convcomp = !1, asecl = 5, arell = 10, adhost = !1, s_adf = !1, disYA = !1, _bcb = null, inp_t = "", ald_sky = !1, ald_rect = !1, rect_width = 300, rect_height = 250, sky_width = 160, sky_height = 600;
try {
	document.domain = "youtube-mp3.org"
} catch (a) {
}
createRequestObject = function () {
	var a = null;
	"undefined" != typeof XMLHttpRequest && (a = new XMLHttpRequest);
	if (!a && "undefined" != typeof ActiveXObject)
		try {
			a = new ActiveXObject("Msxml2.XMLHTTP"),
				XMLHttpRequest = function () {
					return new ActiveXObject("Msxml2.XMLHTTP")
				}
		} catch (c) {
			try {
				a = new ActiveXObject("Microsoft.XMLHTTP"),
					XMLHttpRequest = function () {
						return new ActiveXObject("Microsoft.XMLHTTP")
					}
			} catch (e) {
				try {
					a = new ActiveXObject("Msxml2.XMLHTTP.4.0"),
						XMLHttpRequest = function () {
							return new ActiveXObject("Msxml2.XMLHTTP.4.0")
						}
				} catch (n) {
					a = null
				}
			}
			return a
		}
	!a &&
	window.createRequest && (a = window.createRequest());
	return a
}
;
endswith = function (a, c) {
	return "string" != typeof a ? !1 : -1 !== a.indexOf(c, a.length - c.length)
}
;
sig = function (a) {
	if ("function" == typeof _sig) {
		var c = "X";
		try {
			c = _sig(a)
		} catch (e) {
		}
		if ("X" != c)
			return c
	}
	return "-1"
}
;
sig_url = function (a) {
	var c = sig(a);
	return a + "&s=" + escape(c)
}
;
hs = function (a) {
	try {
		a.setRequestHeader("Accept-Location", "*"),
			a.setRequestHeader("Cache-Control", "no-cache")
	} catch (c) {
	}
}
;
g = function (a) {
	return document.getElementById(a)
}
;
tstamp = function () {
	return (new Date).getTime()
}
;
cFrameLoaded = function (a, c) {
	1 == hashed_ads && "about:blank" == a.src && (a.src = c + "#" + tstamp())
}
;
cFrame = function (a, c, e, n, v) {
	endswith(c, "%") || (c += "px");
	endswith(e, "%") || (e += "px");
	try {
		if (1 != bFrame) {
			var l = a + "iiFrm"
				, w = g(a);
			if ("none" != w.style.display) {
				if (null != w && null == g(l)) {
					clearChilds(a);
					var p = document.createElement("iframe");
					p.id = l;
					p.scrolling = "no";
					p.frameBorder = "0";
					p.frameborder = "0";
					p.width = c;
					p.height = e;
					p.border = "0";
					p.style.border = "0";
					s_adf && (p.sandbox = "allow-forms allow-pointer-lock allow-scripts allow-popups allow-same-origin");
					a = function () {
						cFrameLoaded(p, v)
					}
					;
					p.addEventListener ? p.addEventListener("load",
						a, !1) : p.attachEvent && p.attachEvent("onload", a);
					p.onload = a;
					w.appendChild(p)
				}
				g(l).src = n
			}
		}
	} catch (G) {
	}
}
;
noAdDisplayed = function (a) {
	"rectangle" == a && (ald_rect = !1);
	"skyscraper" == a && (ald_sky = !1);
	if ("*" == a || 0 == ald_rect && 0 == ald_sky)
		lastAdRequest = 1,
			--adcnt,
			convcomp = !0
}
;
loadAds = function () {
	_loadAds(!1)
}
;
_loadAds = function (a) {
	lastAdRequest = tstamp();
	adcnt += 1;
	ald_sky = ald_rect = !0;
	var c = "edge.youtube-mp3.org";
	0 != adhost && (c = adhost);
	var e = tstamp()
		, n = "http://" + c + "/acode/" + adcc + "/rectangle.htm"
		, c = "http://" + c + "/acode/" + adcc + "/skyscraper.htm"
		, v = n
		, l = c;
	1 == a && (v += "?r=" + e,
		l += "?r=" + e);
	1 == a && 1 == hashed_ads && (v = l = "about:blank");
	cFrame("rad", rect_width, rect_height, v, n);
	cFrame("sad", sky_width, sky_height, l, c);
	try {
		null != g("abp_rect") && (g("abp_rect").src = "//edge.youtube-mp3.org/a_pf/b9744bc13/rectangle.htm?r=" + e)
	} catch (w) {
	}
}
;
s = function (a) {
	g("youtube-url").value = a;
	btnSubmitClick()
}
;
escapeHtml = function (a) {
	var c = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;"
	};
	return a.replace(/[&<>"']/g, function (a) {
		return c[a]
	})
}
;
pushItemError = function () {
	resf();
	g("progress_info").className = "error";
	g("error_text").style.display = "block";
	g("error_text").innerHTML = "<b>" + _ytmp3Lang.INVALID_URL + ":</b><br />" + escapeHtml(g("youtube-url").value);
	res()
}
;
captchaRestart = function () {
	btnSubmitClick()
}
;
displayCaptcha = function (a) {
	resf();
	var c = new Date;
	g("progress_info").className = "captcha";
	g("error_text").style.display = "block";
	g("error_text").innerHTML = '<div style="text-align:center"><iframe scrolling="no" frameborder="0" src="/cpt/' + a + ".html?" + c.getTime() + '" style="width:470px; border:0" id="cpt-frame"></iframe></div>';
	iFrameResize({}, g("cpt-frame"));
	res()
}
;
pushItemMaintenance = function () {
	resf();
	g("progress_info").className = "error";
	g("error_text").style.display = "block";
	g("error_text").innerHTML = "<b>" + _ytmp3Lang.MAINTENANCE + "</b>";
	res()
}
;
pushItemYTError = function () {
	resf();
	g("progress_info").className = "error";
	g("error_text").style.display = "block";
	g("error_text").innerHTML = "<b>" + _ytmp3Lang.ERROR + "</b>";
	res()
}
;
limitError = function () {
	resf();
	g("progress_info").className = "error";
	g("error_text").style.display = "block";
	g("error_text").innerHTML = "<b>" + _ytmp3Lang.LIMIT + "</b>";
	res()
}
;
gr = function (a, c) {
	for (var e = 0, n = "", e = 0; e < a; e++)
		if (.5 < Math.random() || 1 == c && 0 == e)
			n += '<a href="/get?video_id=' + video_id + '&h=-1&r=-1.1" style="display:none"><b>' + _ytmp3Lang.DOWNLOAD + "</b></a>";
	return n
}
;
hint = function (a, c) {
	var e = c + "--" + a.replace(/\./g, "-")
		, n = document.getElementById(e);
	null != n && n.parentElement.removeChild(n);
	n = document.createElement("link");
	n.setAttribute("id", e);
	n.setAttribute("rel", c);
	n.setAttribute("href", "//" + a);
	document.getElementsByTagName("head")[0].appendChild(n)
}
;
checkInfo = function () {
	if ("captcha" == info.status)
		displayCaptcha(info.captcha_id);
	else {
		"" != info.image && (g("image").style.display = "block",
			g("image").innerHTML = '<img src="' + info.image + '"/>');
		"" != info.title && (g("title").style.display = "block",
			g("title").innerHTML = _ytmp3Lang.TITLE.replace("$0", info.title));
		"" != info.length && (g("length").style.display = "block",
			g("length").innerHTML = _ytmp3Lang.LENGTH.replace("$0", info.length));
		"" != info.status && "pending" != info.status && ("converting" == info.status ? (g("progress").style.display =
			"block",
			g("progress").innerHTML = _ytmp3Lang.CONVERTING) : "" != info.progress && "" != info.progress_speed && (g("progress").style.display = "block",
			g("progress").innerHTML = _ytmp3Lang.PROGRESS.replace("$0", info.progress).replace("$1", info.progress_speed)));
		if ("serving" == info.status) {
			g("status_text").innerHTML = _ytmp3Lang.CONVERTED;
			g("title").style.display = "block";
			g("length").style.display = "block";
			g("loader").style.display = "none";
			g("dl_link").style.display = "block";
			g("progress").style.display = "none";
			tstamp();
			var a =
				"/get?video_id=" + video_id + "&ts_create=" + info.ts_create + "&r=" + encodeURIComponent(info.r) + "&h2=" + info.h2
				, a = sig_url(a);
			g("dl_link").innerHTML = gr(3, !0) + '<a href="' + a + '"><b>' + _ytmp3Lang.DOWNLOAD + "</b></a>" + gr(3, !1);
			g("progress_info").className = "success";
			res()
		}
		try {
			"" != info.pf && hint(info.pf, "dns-prefetch"),
			"" != info.pc && (hint(info.pc, "dns-prefetch"),
				hint(info.pc, "preconnect"))
		} catch (c) {
		}
	}
}
;
infoRehashCallback = function () {
	4 == h.readyState && ("$$$ERROR$$$" == h.responseText ? pushItemError() : 400 < h.status && 600 > h.status ? (error_count += 1,
	4 < error_count && pushItemMaintenance()) : (eval(h.responseText),
		checkInfo()))
}
;
infoRehash = function () {
	var a = new Date;
	h = createRequestObject();
	a = "/a/itemInfo/?video_id=" + video_id + "&ac=www&t=grp&r=" + a.getTime();
	a = sig_url(a);
	h.onreadystatechange = infoRehashCallback;
	h.open("GET", a, !0);
	hs(h);
	h.send(null)
}
;
startInfoRehash = function (a) {
	video_id = a;
	infoRehash();
	interval = window.setInterval("infoRehash()", 1E3 * interval_diff)
}
;
pushItemCallback = function () {
	4 == h.readyState && ("$$$ERROR$$$" == h.responseText ? pushItemError() : "$$$LIMIT$$$" == h.responseText ? limitError() : 400 <= h.status && 600 >= h.status ? pushItemMaintenance() : startInfoRehash(h.responseText))
}
;
getBF = function () {
	return 1 == bFrame ? "true" : "false"
}
;
pushItem = function () {
	var a = new Date;
	h = createRequestObject();
	var c = "/a/pushItem/?item=" + escape(g("youtube-url").value) + "&el=na&bf=" + getBF() + "&r=" + a.getTime()
		, c = sig_url(c);
	h.onreadystatechange = pushItemCallback;
	h.open("GET", c, !0);
	hs(h);
	h.send(null);
	"" != inp_t && null != inp_t && (a = inp_t.replace("$1", escape(g("youtube-url").value)) + "&r=" + a.getTime(),
		tlog.src = a)
}
;
btnSubmitClick = function () {
	1 == enableBetaAds && 1 == convcomp && (tstamp() - lastAdRequest) / 1E3 > asecl && adcnt <= arell && _loadAds(!0);
	convcomp = !0;
	g("youtube-url");
	res();
	resf();
	info = video_id = null;
	g("submit").disabled = !0;
	g("youtube-url").disabled = !0;
	pushItem();
	g("progress_info").className = "normal";
	g("progress_info").style.display = "block";
	g("loader").style.display = "block";
	g("status_text").style.display = "block";
	g("status_text").innerHTML = _ytmp3Lang.PROCESSING;
	null != _bcb && _bcb();
	return !1
}
;
res = function () {
	clearInterval(interval);
	interval = h = null;
	g("submit-form").onsubmit = btnSubmitClick;
	g("submit").onclick = btnSubmitClick;
	g("submit").disabled = !1;
	g("youtube-url").disabled = !1
}
;
resf = function () {
	g("status_text").style.display = "none";
	g("dl_link").style.display = "none";
	g("title").style.display = "none";
	g("length").style.display = "none";
	g("image").style.display = "none";
	g("loader").style.display = "none";
	g("error_text").style.display = "none"
}
;
cutTo = function (a, c) {
	var e = a.indexOf(c);
	return -1 < e ? a.substring(0, e) : a
}
;
getArg = function (a, c) {
	var e = a.indexOf(c + "=", 0);
	return -1 < e ? (e += 1 + c.length,
		e = a.substring(e),
		e = cutTo(e, ";"),
		e = cutTo(e, "?"),
		e = cutTo(e, "&")) : null
}
;
fixDisp = function () {
	try {
		g("rad").style.paddingTop = "6px",
			g("sad").style.paddingTop = "6px"
	} catch (a) {
	}
}
;
checkForHash = function () {
	var a = document.getElementById("content");
	if (null != a && "true" == a.getAttribute("x-addon") && (a = getArg(window.location.hash, "v_id"),
		null != a && a != latest_id)) {
		var c = "http://www.youtube.com/watch?v=" + a + "&ft=li";
		g("youtube-url").value = c;
		btnSubmitClick();
		latest_id = a
	}
	window.setTimeout("checkForHash()", 750)
}
;
init = function () {
	g("submit-form").onsubmit = btnSubmitClick;
	g("submit").onclick = btnSubmitClick;
	g("submit").disabled = !1;
	g("youtube-url").disabled = !1;
	try {
		window.addEventListener("message", function (a) {
			a = a.data;
			"adc-no-rectangle" == a && noAdDisplayed("rectangle");
			"adc-no-skyscraper" == a && noAdDisplayed("skyscraper");
			"adc-no-ad" == a && noAdDisplayed("*")
		}, !1)
	} catch (a) {
	}
	checkForHash();
	fixDisp()
}
;
sAll = function (a) {
	a.focus();
	a.select()
}
;
clearChilds = function (a) {
	var c = 0;
	for (a = g(a); a.firstChild && !(a.removeChild(a.firstChild),
		c += 1,
	15 < c);)
		;
}
;
