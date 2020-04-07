webpackJsonp(["covid"], {
    "https://www.bing.com/covid/ShowPanel.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/redux/actions/data.ts");
        t.default = i.connect(function(e) {
            return {
                byId: e.byId
            }
        }, {
            areaSelected: r.areaSelected
        })(function(e) {
            return n.useEffect(function() {
                e.byId && e.match && e.match.params && e.match.params.location && e.byId[e.match.params.location] && e.areaSelected(e.match.params.location, 2)
            }, [e.byId]), null
        })
    },
    "https://www.bing.com/covid/app.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/@uifabric/icons/lib/index.js");
        a("https://www.bing.com/node_modules/element-scroll-polyfill/index.js");
        var i = a("https://www.bing.com/node_modules/react/index.js"),
            r = a("https://www.bing.com/node_modules/react-dom/index.js"),
            o = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            l = a("https://www.bing.com/node_modules/react-router-dom/esm/react-router-dom.js");
        a("https://www.bing.com/node_modules/url-polyfill/url-polyfill.js");
        var s = a("https://www.bing.com/covid/clarity.ts"),
            d = a("https://www.bing.com/covid/components/Root.tsx"),
            u = a("https://www.bing.com/covid/instrumentation.ts"),
            c = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            f = a("https://www.bing.com/covid/redux/actions/size.ts"),
            p = a("https://www.bing.com/covid/redux/store.ts");
        a("https://www.bing.com/node_modules/promise-polyfill/src/polyfill.js"), a("https://www.bing.com/covid/arrayPolyfill.ts");
        var m = a("https://www.bing.com/covid/ShowPanel.tsx");
        a("https://www.bing.com/covid/styles/covid.css"), a("https://www.bing.com/covid/styles/graphVertical.css");
        var v = a("https://www.bing.com/covid/registerServiceWorker.ts"),
            h = a("https://www.bing.com/covid/appInstaller.ts");
        window.onload = function() {
            window.uiLang && c.setLanguage(window.uiLang), n.initializeIcons(), r.render(i.createElement(o.Provider, {
                store: p.default
            }, i.createElement(l.BrowserRouter, null, i.createElement(l.Route, {
                path: "/covid",
                component: d.default
            }), i.createElement(l.Route, {
                path: "/covid/local/:location",
                component: m.default
            }))), document.getElementById("main"))
        }, window.addEventListener("error", function(e) {
            u.logError(e.message, e.filename, e.lineno, e.colno)
        }), window.addEventListener("resize", function() {
            return p.default.dispatch(f.default(window.innerWidth, window.innerHeight))
        }), window.addEventListener("blur", u.sendInstrumentation), window.addEventListener("beforeunload", u.sendInstrumentation), window.addEventListener("pagehide", u.sendInstrumentation), document.addEventListener("visibilitychange", function() {
            document.hidden && u.sendInstrumentation()
        });
        setTimeout(function() {
            window.location.reload(!0)
        }, 864e5), window.addEventListener("beforeinstallprompt", h.onAppInstallStateChange), s.init(), v.register()
    },
    "https://www.bing.com/covid/appInstaller.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.onAppInstallStateChange = function(e) {
            e.preventDefault()
        }
    },
    "https://www.bing.com/covid/arrayPolyfill.ts": function(e, t) {
        Array.prototype.find || Object.defineProperty(Array.prototype, "find", {
            value: function(e) {
                if (null == this) throw TypeError('"this" is null or not defined');
                var t = Object(this),
                    a = t.length >>> 0;
                if ("function" != typeof e) throw TypeError("predicate must be a function");
                for (var n = arguments[1], i = 0; i < a;) {
                    var r = t[i];
                    if (e.call(n, r, i, t)) return r;
                    i++
                }
            },
            configurable: !0,
            writable: !0
        }), Array.prototype.findIndex || Object.defineProperty(Array.prototype, "findIndex", {
            value: function(e) {
                if (null == this) throw new TypeError('"this" is null or not defined');
                var t = Object(this),
                    a = t.length >>> 0;
                if ("function" != typeof e) throw new TypeError("predicate must be a function");
                for (var n = arguments[1], i = 0; i < a;) {
                    var r = t[i];
                    if (e.call(n, r, i, t)) return i;
                    i++
                }
                return -1
            },
            configurable: !0,
            writable: !0
        })
    },
    "https://www.bing.com/covid/clarity.ts": function(e, t, a) {
        "use strict";

        function n() {
            window.clarity && window.clarity.start()
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.init = function() {
            if (Math.random() < .1) {
                document.documentElement.setAttribute("data-clarity-unmask", "true");
                var e = document.createElement("script");
                e.src = "https://log.clarity.ms/js/cdd383ca-c62b-474d-bca0-3326d88c2c29", e.type = "text/javascript", e.setAttribute("crossorigin", "anonymous"), e.async = !0, e.onload = n, document.head.appendChild(e)
            }
        }
    },
    "https://www.bing.com/covid/components/AllRegions.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/components/Root.tsx"),
            r = a("https://www.bing.com/covid/components/shared/AreaButton.tsx"),
            o = a("https://www.bing.com/covid/helper.ts"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/components/Filter.tsx"),
            d = a("https://www.bing.com/covid/config.ts"),
            u = function(e, t) {
                for (var a = [], n = e; t[n];) t[n].areas && t[n].areas.length > 0 && a.push(n), n = t[n].parentId;
                return a.reverse()
            };
        t.default = function(e) {
            var t = n.useState([d.rootId]),
                a = t[0],
                c = t[1],
                f = a.length > 1,
                p = f ? i.sortAlphabetically : i.sortByConfirmed,
                m = e.selectedInfo ? e.selectedInfo.id : d.rootId,
                v = n.useState(e.byId[m].areas.length > 0 ? m : e.byId[m].parentId),
                h = v[0],
                g = v[1],
                b = n.useState(m),
                k = b[0],
                y = b[1],
                C = n.useRef(),
                w = n.useCallback(function(t, a) {
                    e.isMobile && g(t), e.areaSelected(t, a)
                }, []);
            return n.useEffect(function() {
                y(h), c(u(h, e.byId)), e.byId[h].areas && e.byId[h].areas.length > 0 && C && C.current && 0 != C.current.scrollTop && C.current.scrollTo(0, 0)
            }, [h]), n.useEffect(function() {
                y(m), c(u(m, e.byId)), e.isMobile || e.selectedInfo && (1 == e.selectedInfo.reason || 4 === e.selectedInfo.reason || 5 === e.selectedInfo.reason) ? setTimeout(function() {
                    if (C && C.current) {
                        var e = document.getElementById(m);
                        if (e) {
                            var t = C.current,
                                a = e.getBoundingClientRect(),
                                n = a.top + t.scrollTop - t.getBoundingClientRect().top;
                            if (n < t.scrollTop || n + a.height > t.scrollTop + t.clientHeight) {
                                var i = n - t.clientHeight / 2;
                                t.scrollTo({
                                    left: 0,
                                    top: i,
                                    behavior: "smooth"
                                })
                            }
                        }
                    }
                }, 200) : e.selectedInfo && e.selectedInfo.id && e.byId[e.selectedInfo.id].areas && e.byId[e.selectedInfo.id].areas.length > 0 && C && C.current && 0 != C.current.scrollTop && C.current.scrollTo(0, 0)
            }, [e.selectedInfo, e.byId]), n.createElement(n.Fragment, null, n.createElement("div", {
                className: "selectedAreas"
            }, n.createElement(s.default, {
                byId: e.byId,
                areaSelected: e.areaSelected,
                selectedInfo: e.selectedInfo,
                isMobile: e.isMobile
            }), a.map(function(t) {
                var a = "world" === t ? e.byId[t].totalConfirmed : n.createElement("div", {
                    className: "secondaryInfo"
                }, o.formatNumber(e.byId[t].totalConfirmed), n.createElement("span", {
                    onClick: function(a) {
                        w(e.byId[t].parentId, 3), a.stopPropagation()
                    }
                }, l.unselectRegion));
                return n.createElement(r.default, {
                    key: t,
                    displayName: e.byId[t].displayName,
                    secondaryInfo: a,
                    clickCallback: function() {
                        return w(t, 2)
                    },
                    customClassName: "selectedArea"
                })
            })), n.createElement("div", {
                className: "areas " + (f ? "deep" : ""),
                ref: C
            }, n.createElement(n.Fragment, null, e.byId[a[a.length - 1]].areas.slice().sort(p).map(function(e) {
                var t = e.id === k,
                    a = e.areas && e.areas.length > 0 ? n.createElement(n.Fragment, null, n.createElement("div", {
                        className: "secondaryInfo"
                    }, o.formatNumber(e.totalConfirmed)), n.createElement("div", {
                        className: "hasChildren"
                    }, l.regionChildIndicator)) : n.createElement("div", {
                        className: "secondaryInfo"
                    }, o.formatNumber(e.totalConfirmed));
                return n.createElement(r.default, {
                    key: e.id,
                    id: e.id,
                    customClassName: t ? "selected" : "",
                    displayName: e.displayName,
                    secondaryInfo: a,
                    clickCallback: function() {
                        return w(t ? e.parentId : e.id, t ? 3 : 2)
                    }
                })
            }))))
        }
    },
    "https://www.bing.com/covid/components/BingBot.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            },
            r = this;
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = a("https://www.bing.com/node_modules/react/index.js"),
            l = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            s = a("https://www.bing.com/covid/redux/actions/data.ts"),
            d = a("https://www.bing.com/covid/makeRequest.ts"),
            u = a("https://www.bing.com/covid/components/Icons.tsx"),
            c = a("https://www.bing.com/covid/localization/covid.strings/index.ts");
        t.default = l.connect(function(e) {
            return {
                messages: e.bingBotMessageData
            }
        }, {
            sendBotMessage: s.sendBotMessage
        })(function(e) {
            var t = o.useRef(null),
                a = o.createRef();
            o.useEffect(function() {
                0 === e.messages.length && e.sendBotMessage({
                    message: c.botWelcomeMessage(),
                    timestamp: (new Date).getTime(),
                    user: 1,
                    answerType: 0
                }), a && a.current && a.current.scrollTo({
                    left: 0,
                    top: a.current.scrollHeight,
                    behavior: "smooth"
                })
            }, [e.messages]);
            var l = function() {
                    if (t && t.current && t.current.value) {
                        var a = t.current.value;
                        e.sendBotMessage({
                            message: a,
                            timestamp: (new Date).getTime(),
                            user: 0
                        }), t.current.value = "", t.current.style.height = "24px", s(a)
                    }
                },
                s = function(t) {
                    return n(r, void 0, void 0, function() {
                        var a, n, r;
                        return i(this, function(i) {
                            switch (i.label) {
                                case 0:
                                    return [4, d.makeRequest("/covid/askBingBot", {
                                        question: t
                                    }, 3)];
                                case 1:
                                    return (a = i.sent()) && a[0] && a[0].answers && a[0].answers[0] && (n = a[0].answers[0], (r = n.score) <= .5 ? e.sendBotMessage({
                                        message: "Hmm, I don't support that yet...",
                                        timestamp: (new Date).getTime(),
                                        user: 1,
                                        answerType: 2
                                    }) : r < .7 ? a[0].answers.filter(function(e) {
                                        return e.score > .5
                                    }).length > 0 ? e.sendBotMessage({
                                        message: "Did you mean any of these?",
                                        timestamp: (new Date).getTime(),
                                        user: 1,
                                        answerType: 1,
                                        refinementQuestions: a[0].answers.slice(0, 3)
                                    }) : e.sendBotMessage({
                                        message: "Hmm, I don't support that yet...",
                                        timestamp: (new Date).getTime(),
                                        user: 1,
                                        answerType: 2
                                    }) : e.sendBotMessage({
                                        message: n.text,
                                        timestamp: (new Date).getTime(),
                                        user: 1,
                                        answerType: 0
                                    })), [2]
                            }
                        })
                    })
                },
                f = e.messages && e.messages.map(function(t) {
                    var a = 0 === t.user ? "userMessage" : "botMessage",
                        n = 0 === t.user ? "userMessageContainer" : "botMessageContainer",
                        i = "",
                        r = "",
                        l = [];
                    return 1 === t.answerType && t.refinementQuestions && t.refinementQuestions.length > 0 && (i = "botMessageRefinementContainer", r = "primaryAction", l = t.refinementQuestions.map(function(t) {
                        return o.createElement("div", {
                            key: t.url + t.matchedQuestion,
                            onClick: function() {
                                return function(t) {
                                    e.sendBotMessage({
                                        message: t.matchedQuestion,
                                        timestamp: (new Date).getTime(),
                                        user: 0
                                    }), e.sendBotMessage({
                                        message: t.text,
                                        timestamp: (new Date).getTime(),
                                        user: 1,
                                        answerType: 0
                                    })
                                }(t)
                            },
                            className: "messageBase actionBase"
                        }, t.matchedQuestion)
                    })), o.createElement("div", {
                        className: "messageContainerBase " + n + " " + i,
                        key: t.timestamp
                    }, o.createElement("div", {
                        className: "messageBase " + a + " " + r
                    }, t.message), l)
                });
            return o.createElement("div", {
                className: "bingBotContainer",
                style: {
                    right: e.botViewRight
                }
            }, o.createElement("div", {
                className: "botHeader"
            }, u.bingBotHead, o.createElement("div", {
                className: "botTitle"
            }, "Bing Bot"), o.createElement("div", {
                className: "botMinimize",
                onClick: e.toggleChatWindow
            }, u.minimize), o.createElement("div", {
                className: "botClose",
                onClick: e.toggleChatWindow
            }, u.closeDropdown)), o.createElement("div", {
                className: "botSeparator"
            }), o.createElement("div", {
                className: "messagesContainer",
                ref: a
            }, f && f.length > 0 ? f : o.createElement("div", null, "No messages yet")), o.createElement("div", {
                className: "inputContainer"
            }, o.createElement("div", {
                className: "inputAndSubmit"
            }, o.createElement("textarea", {
                ref: t,
                onKeyDown: function(e) {
                    var t = e.currentTarget;
                    if (t) {
                        var a = window.getComputedStyle(t),
                            n = parseInt(a.getPropertyValue("border-top-width"), 10) + parseInt(a.getPropertyValue("padding-top"), 10) + t.scrollHeight + parseInt(a.getPropertyValue("padding-bottom"), 10) + parseInt(a.getPropertyValue("border-bottom-width"), 10);
                        t.style.height = n + "px"
                    }
                    13 == e.keyCode && (l(), e.preventDefault())
                },
                className: "botInput"
            }), o.createElement("div", {
                className: "submitContainer",
                onClick: l
            }, u.send))))
        })
    },
    "https://www.bing.com/covid/components/BingMap.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__extends || function() {
            var e = function(t, a) {
                return (e = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(e, t) {
                        e.__proto__ = t
                    } || function(e, t) {
                        for (var a in t) t.hasOwnProperty(a) && (e[a] = t[a])
                    })(t, a)
            };
            return function(t, a) {
                function n() {
                    this.constructor = t
                }
                e(t, a), t.prototype = null === a ? Object.create(a) : (n.prototype = a.prototype, new n)
            }
        }();
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o = a("https://www.bing.com/node_modules/react/index.js"),
            l = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            s = a("https://www.bing.com/covid/helper.ts"),
            d = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            u = a("https://www.bing.com/covid/location.ts"),
            c = a("https://www.bing.com/covid/redux/actions/data.ts"),
            f = a("https://www.bing.com/covid/components/Map.tsx"),
            p = a("https://www.bing.com/covid/instrumentation.ts"),
            m = a("https://www.bing.com/covid/config.ts"),
            v = {},
            h = "https://www.bing.com/api/maps/mapcontrol?callback=bingmapsCallback&branch=experimental&enableInstrumentation=true&partner=msft",
            g = [],
            b = [],
            k = null,
            y = null,
            C = null,
            w = null,
            x = null,
            T = !1;
        ! function(e) {
            e[e.stopped = 0] = "stopped", e[e.playing = 1] = "playing", e[e.paused = 2] = "paused"
        }(r || (r = {}));
        var z = 0,
            S = null,
            I = ".wrapper-bingmaps",
            A = "spatial.virtualearth.net/REST/v1/data/3ae457ffc96f4c6390929b16fe4fa558/COVID/COVID",
            D = "AuB8zKEmLWMevQvK1ze9X-Wjn6WA3tqieBt2KazXTDG_NqZfHsIz36RjiiZ8T0HU",
            M = function(e) {
                function t(t) {
                    var a = e.call(this, t) || this,
                        n = h;
                    if (t.lang && (n += "&setlang=" + t.lang), t.mkt && (n += "&setmkt=" + t.mkt), window && window.location) {
                        var o = window.location;
                        a.getUrlParam(o, "uncrunched") && (n += "&uncrunched=1");
                        var l = a.getUrlParam(o, "features") || a.getUrlParam(o, "addfeaturesnoexpansion");
                        l && (n += "&features=" + l);
                        var s = a.getUrlParam(o, "setflight");
                        s && (n += "&setflight=" + s)
                    }
                    return null === document.querySelector('script[src="' + n + '"]') && (a.loadScript(n), window.bingmapsCallback = function() {
                        i = window.Microsoft, this.afterDependencyLoad(g)
                    }.bind(a)), a.state = {
                        trendsAnimationEnabled: !1,
                        trendsAnimationState: r.stopped,
                        trendsAnimationLabel: null,
                        currentTrendFrame: 0
                    }, a.setState = a.setState.bind(a), a
                }
                return n(t, e), t.prototype.componentDidMount = function() {
                    null === i || void 0 === i ? g.push(this.props) : this.reactBingmaps(this.props, i)
                }, t.prototype.afterDependencyLoad = function(e) {
                    var t = this;
                    try {
                        e.map(function(e) {
                            return t.reactBingmaps(e, i)
                        })
                    } catch (e) {
                        console.log("Error loading Microsoft bingmaps")
                    }
                }, t.prototype.componentWillUnmount = function() {
                    try {
                        v[".wrapper-bingmaps"] = void 0, g = []
                    } catch (e) {
                        console.log(e)
                    }
                }, t.prototype.loadScript = function(e) {
                    var t = document.createElement("script");
                    t.type = "text/javascript", t.async = !0, t.defer = !0, t.src = e, document.getElementsByTagName("head")[0].appendChild(t)
                }, t.prototype.componentWillReceiveProps = function(e) {
                    var t = e.center,
                        a = this.props.selectedAreaId,
                        n = e.selectedAreaId;
                    this.shouldSkipSetCenter(e) || this.props.center.join() === t.join() || this.setMapCenter(t, ".wrapper-bingmaps"), this.props.regularPolygons !== e.regularPolygons && this.createRegularPolygons(e.regularPolygons, ".wrapper-bingmaps");
                    var i = v[".wrapper-bingmaps"];
                    if (i) {
                        this.OnSelectedAreaIdChanged(i, t, n, a);
                        var r = e.trends;
                        r && r !== this.props.trends && this.bootstrapAnimationData(r, i)
                    }
                }, t.prototype.shouldSkipSetCenter = function(e) {
                    var t = w && w.metadata && w.metadata.id,
                        a = e && e.selectedAreaId,
                        n = a && a !== this.props.selectedAreaId && t === a,
                        i = this.state.trendsAnimationState !== r.stopped;
                    return n || i
                }, t.prototype.reactBingmaps = function(e, t) {
                    var a = this,
                        n = this.props && this.props.bingmapKey && this.props.center && this.props.regularPolygons ? this.props : e,
                        i = n.bingmapKey,
                        r = n.center,
                        o = n.regularPolygons,
                        l = n.trends;
                    if (i && t) {
                        v[".wrapper-bingmaps"] || (v[".wrapper-bingmaps"] = new t.Maps.Map(".wrapper-bingmaps", {
                            credentials: i,
                            showMapTypeSelector: !1,
                            maxZoom: 12,
                            showLocateMeButton: !0,
                            navigationBarMode: t.Maps.NavigationBarMode.square,
                            zoom: 0,
                            showScalebar: !1,
                            disableStreetside: !1,
                            mapTypeId: t.Maps.MapTypeId.grayscale
                        }));
                        var s = v[".wrapper-bingmaps"];
                        this.setLocateMe(s), this.setViewportPadding(s);
                        var d = this;
                        t.Maps.loadModule(["Microsoft.Maps.WellKnownText", "Microsoft.Maps.SpatialMath"], function() {
                            var e = v[".wrapper-bingmaps"];
                            a.setMapCenter(r, ".wrapper-bingmaps"), a.createRegularPolygons(o, ".wrapper-bingmaps");
                            var n = window.loc;
                            n.lat && n.long && u.getNearestToLocation(n.lat, n.long, a.props.byId, function(t) {
                                a.OnSelectedAreaIdChanged(e, null, t.id, null, !0)
                            }), a.OnSelectedAreaIdChanged(e, a.props.center, a.props.selectedAreaId), a.bootstrapAnimationData(l, e), t.Maps.Events.addHandler(e, "viewchangestart", function() {
                                k && k.setOptions({
                                    visible: !1
                                })
                            }), t.Maps.Events.addHandler(e, "viewchangeend", function() {
                                var t = e.getZoom();
                                "number" == typeof x && t < x - 1 && d.exitDrillDown(e)
                            })
                        })
                    }
                }, t.prototype.setViewportPadding = function(e) {
                    var t = i.Maps.GlobalConfig,
                        a = e.getWidth(),
                        n = t.isMobile ? a / 250 * 75 : a / 6,
                        r = n + (t.isMobile ? 0 : 344),
                        o = t.isMobile ? 150 : 25,
                        l = {
                            top: o + (t.isMobile ? 41 : 56),
                            right: n,
                            bottom: o + (t.isMobile ? 51 : 56),
                            left: r
                        };
                    e.getV8Map().setViewportPadding(l)
                }, t.prototype.setMapCenter = function(e, t) {
                    if (v[t] && e && e[0] && e[1]) {
                        var a = e[0],
                            n = e[1];
                        v[t].setView({
                            center: new i.Maps.Location(a, n),
                            zoom: e[2]
                        })
                    }
                }, t.prototype.setLocateMe = function(e) {
                    var t = this,
                        a = e.getV8Map();
                    a.navigationBarLoaded.addOne(function() {
                        a.getNavigationBar().getHelper().locateMe = function() {
                            u.getNearestLocation(!0, t.props.byId, function(e) {
                                return t.props.areaSelected(e.id, 5)
                            })
                        }
                    })
                }, t.prototype.MakeCallback = function(e, t) {
                    t ? e(t) : e()
                }, t.prototype.createCirclePushpin = function(e, t, a, n, r) {
                    r = r || 0;
                    var o = this.getPushpinIcon(t, r, a),
                        l = new i.Maps.Pushpin(e, {
                            icon: o,
                            anchor: new i.Maps.Point(t, t),
                            color: n
                        });
                    return l.entity.collisionBehavior = 1, l
                }, t.prototype.OnSelectedAreaIdChanged = function(e, t, a, n, r) {
                    void 0 === n && (n = "");
                    var o = this.props.byId[a],
                        l = o && o.parentId;
                    if (a && n !== a) {
                        C && this.unfocusPrimitive(C, !0);
                        var s = e.entities.getPrimitives().find(function(e) {
                            return e.metadata.id === a
                        });
                        if (s) this.onPushpinClick(s, e, null, r);
                        else if (l) {
                            if (w) s = function(e) {
                                return e && e.getPrimitives().find(function(e) {
                                    return e.metadata.id === a
                                })
                            }(e.layers.find(function(e) {
                                return e.getId() === l
                            }));
                            var d = null;
                            if (!s && (d = e.entities.getPrimitives().find(function(e) {
                                return e.metadata.id === l
                            }))) {
                                var u = t && t.length > 1 && new i.Maps.Location(t[0], t[1]);
                                this.onPushpinClick(d, e, u, r)
                            }
                            r || (s ? this.focusOnPrimitive(s, e, !0) : d || (this.exitDrillDown(e), this.setUpInfoboxForCountry(e, o)))
                        }
                    }
                }, t.prototype.setUpInfoboxForCountry = function(e, t) {
                    var a = this;
                    if (t.parentId === m.rootId && k) {
                        this.clearInfoboxAnimation();
                        y = setTimeout(function() {
                            a.clearInfoboxAnimation(), k.setOptions({
                                visible: !1
                            })
                        }, 2500), e.getV8Map().getOverlayManager().then(function() {
                            if (y) {
                                var e = a.getPushpinInfobox({
                                    infoBoxData: t.displayName,
                                    value0: t.totalConfirmed,
                                    value1: t.totalConfirmed - t.totalRecovered - t.totalDeaths,
                                    value2: t.totalRecovered,
                                    value3: t.totalDeaths
                                });
                                k.setOptions({
                                    location: new i.Maps.Location(t.lat, t.long),
                                    visible: !0,
                                    htmlContent: e
                                }), k._control.select(".InfoboxCustom").add_class("fade")
                            }
                        })
                    }
                }, t.prototype.clearInfoboxAnimation = function() {
                    y && clearTimeout(y), y = null, k._control.select(".InfoboxCustom").remove_class("fade")
                }, t.prototype.createRegularPolygons = function(e, t) {
                    var a = this,
                        n = v[t];
                    if (n && e) {
                        for (var r = n.entities.getLength() - 1; r >= 0; r--) {
                            n.entities.get(r) instanceof i.Maps.Pushpin && n.entities.removeAt(r)
                        }
                        b = [];
                        var o = document.createElement("style");
                        o.type = "text/css", o.innerText = ".tooltip { display:inline-block; position:relative; text-align:left; white-space: nowrap; } .tooltip .topToolTip { top:-20px; left:50%; transform:translate(-50%, -100%); padding:10px 10px; color:#000000; background-color:rgba(255,255,255,1); font-weight:normal; font-size:13px; border-radius:8px; position:absolute; z-index:99999999; box-sizing:border-box; border:2px solid #DDDDDD;box-shadow:0 1px 8px rgba(0,0,0,0.1); display:none; } .tooltip .topToolTip { display:block; } .tooltip .topToolTip i { position:absolute; top:100%; left:50%; margin-left:-16px; width:32px; height:16px; overflow:hidden; } .tooltip .topToolTip i::after { content:''; position:absolute; width:16px; height:16px; left:50%; transform:translate(-50%,-50%) rotate(45deg); background-color:rgba(255,255,255,1); border:2px solid #DDDDDD;box-shadow:0 1px 8px rgba(0,0,0,0.1); } .statLine { display: flex; flex-direction: row; justify-content: center; align-items: center; height: 20px; min-width: 160px;} .statLine.divider { height: 1px; background: rgba(0, 0, 0, 0.2); margin: 5px 0 4px 0; } .stat { flex:1; margin-right: 24px; height: 20px; font-size: 13px; line-height: 20px; color: #333333; } .stat.total { color: #DE3700; } .legendColor{ width: 8px; height: 8px; border-radius: 4px; margin-right: 10px; } .ongoing{ background-color: #F4C363; } .legendColor.recovered{ background-color: #60BB69; } .ongoing{ background-color: #F4C363; } .fatal{ background-color: #767676; } .statCount { height: 20px; font-size: 13px; line-height: 20px; text-align: right; color: #767676; } .statCount.total { color: #DE3700; } .titleInfoBox { font-weight: bold; font-size: 13px; line-height: 18px; text-align: center; color: #000000; margin-bottom: 7px; }", document.head.appendChild(o);
                        var l = document.createElement("style");
                        l.type = "text/css", l.innerText = 'div{font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;}', document.head.appendChild(l), (k = new i.Maps.Infobox(n.getCenter(), {
                            visible: !1,
                            htmlContent: '<div class="btn btn-primary tooltip"><div class="topToolTip"><div class="titleInfoBox">{title}</div> <div class="statLine"> <div class="legendColor ongoing"></div> <div class="stat">Ongoing cases</div> <div class="statCount">33222</div> </div> <div class="statLine"> <div class="legendColor recovered"></div> <div class="stat">Ongoing cases</div> <div class="statCount">231</div> </div> <div class="statLine"> <div class="legendColor fatal"></div> <div class="stat">Ongoing cases</div> <div class="statCount">33222</div> </div> <i></i></div></div>'
                        })).setMap(n);
                        for (var s = 0; s < e.length; s++) {
                            var d = e[s];
                            if (d.center[0] && d.center[1]) {
                                var u = d.density || 10,
                                    c = new i.Maps.Location(d.center[0], d.center[1]),
                                    f = this.createCirclePushpin(c, u, "rgba(222, 55, 0, 0.5)", "transparent", 4),
                                    p = d.infoBoxData || null;
                                f.metadata = {
                                    areas: d.areas,
                                    density: u,
                                    id: d.id,
                                    infoBoxData: p,
                                    topOffset: this.getPushpinInfoboxTopOffset(u),
                                    value0: d.value0,
                                    value1: d.value1,
                                    value2: d.value2,
                                    value3: d.value3,
                                    radius: u
                                }, this.processInfoboxValues(f.metadata), d.polygonAddHandler && i.Maps.Events.addHandler(f, d.polygonAddHandler.type, function(e, t) {
                                    this.MakeCallback(e, t)
                                }.bind(this, d.polygonAddHandler.callback, d.polygonAddHandler.callbackData)), i.Maps.Events.addHandler(f, "click", function(e) {
                                    return a.onPushpinClick(e.target, n, e.userLocation)
                                }), i.Maps.Events.addHandler(f, "mouseover", function(e) {
                                    return a.focusOnPrimitive(e.target, n, !1)
                                }), i.Maps.Events.addHandler(f, "mouseout", function(e) {
                                    return a.unfocusPrimitive(e.target, !1)
                                }), b.push(f)
                            }
                        }
                        v[t].entities.push(b)
                    }
                }, t.prototype.onPushpinClick = function(e, t, a, n) {
                    var i = e.metadata;
                    n || this.focusOnPrimitive(e, t, !0);
                    var r = !(i && i.areas && i.areas.length > 0),
                        o = this.shouldSkipSetCenter(null);
                    if (!r && !o && e !== w) {
                        if (n || (this.exitDrillDown(t), w = e), i.queued) return void(n || (i.userLocation = a));
                        var l = i.drillDownLayer;
                        if (l) return void(n || (this.addLayerToMap(t, l), this.setBestMapViewWithBounds(i.bmvBounds, !!a, t), this.setPushpinOptions(e, {
                            visible: !1
                        }), this.focusOnUserAdmin2Polygon(a, l, t)));
                        this.getAdmin2Data(e, t, a, n)
                    }
                }, t.prototype.getAdmin2Data = function(e, t, a, n) {
                    var r = this,
                        o = e.metadata,
                        l = i.Maps.Internal._Network,
                        s = e.metadata.id,
                        d = "COVID_" + s,
                        u = A,
                        c = D,
                        f = window.location;
                    this.isOnCorpnet() && f && (u = this.getUrlParam(f, "sdsep") || A, c = this.getUrlParam(f, "sdskey") || D);
                    var m = "https://{endpoint}(%27{id}%27)?$format=json&key={key}&$inlinecount=allpages&select=Id,Name,BMVBox,ChildCount".replace("{endpoint}", u).replace("{key}", c).replace("{id}", s);
                    o.queued = !0;
                    var v = Date.now();
                    l.downloadJson(m, d, function(e) {
                        return h(e)
                    }, function() {
                        p.logInfoWithTimeInMS("SDS_Admin1", v, {
                            id: s,
                            success: 0
                        }), o.queued = !1, delete o.userLocation
                    }, null, !1, null, !1);
                    var h = function(f) {
                        p.logInfoWithTimeInMS("SDS_Admin1", v, {
                            id: s,
                            success: 1
                        });
                        var m = f.d.ChildCount,
                            h = i.Maps.WellKnownText.read(f.d.BMVBox).map(function(e) {
                                return e.getLocation()
                            }),
                            g = i.Maps.LocationRect.fromLocations(h);
                        o.bmvBounds = g, n || r.setBestMapViewWithBounds(g, !!a, t);
                        var b = [];
                        v = Date.now();
                        for (var k = function(e) {
                            var t = new Promise(function(t, a) {
                                var n = "https://{endpoint}?$format=json&key={key}&$filter=ParentId%20Eq%20%27{id}%27&$inlinecount=allpages&$skip={skip}&$top={top}".replace("{endpoint}", u).replace("{key}", c).replace("{id}", s).replace("{top}", 250..toString()).replace("{skip}", e.toString());
                                l.downloadJson(n, d + "_" + e, function(e) {
                                    t(e)
                                }, function() {
                                    a()
                                }, null, !1, null, !1)
                            });
                            b.push(t)
                        }, y = 0; y < m; y += 250) k(y);
                        Promise.all(b).then(function(i) {
                            p.logInfoWithTimeInMS("SDS_Admin2", v, {
                                id: s,
                                success: 1
                            }), o.queued = !1;
                            var l = a || o.userLocation;
                            delete o.userLocation;
                            var d = w && w.metadata.id === s;
                            d && n && r.setBestMapViewWithBounds(g, l, t), d && r.setPushpinOptions(e, {
                                visible: !1
                            }), r.setUpAdmin2Layer(e, i, t, l, !d)
                        }, function() {
                            p.logInfoWithTimeInMS("SDS_Admin2", v, {
                                id: s,
                                success: 0
                            }), o.queued = !1, delete o.userLocation
                        })
                    }
                }, t.prototype.setUpAdmin2Layer = function(e, t, a, n, r) {
                    var o = e.metadata,
                        l = o.areas,
                        s = [];
                    t.forEach(function(e) {
                        e.d.results.forEach(function(e) {
                            var t = i.Maps.WellKnownText.read(e.Geometry);
                            t.length && (t = new i.Maps.Polygon(t.map(function(e) {
                                return e.getLocations()
                            }))), s.push(t);
                            var a = l.filter(function(t) {
                                    return t.id === e.Id
                                }),
                                n = new i.Maps.Location(e.Latitude, e.Longitude);
                            a.length > 0 ? (t.metadata = a[0], t.metadata.center = n) : t.metadata = {
                                id: e.Id,
                                infoBoxData: e.Name,
                                center: n
                            }
                        })
                    });
                    for (var d = 0; d < s.length; d++) {
                        var u = s[d],
                            c = u.metadata,
                            f = "rgba(0, 0, 0, 0)";
                        if (c && "number" == typeof c.value0) {
                            var p = c.value0;
                            f = "rgba(222, 55, 0, " + (.25 + .5 * Math.min(1, p / 200)) + ")"
                        }
                        u.setOptions({
                            fillColor: f,
                            strokeColor: "rgba(222, 55, 0, 1)",
                            strokeThickness: 2
                        }), this.processInfoboxValues(u.metadata), this.bindAdmin2PolygonEvents(u, a)
                    }
                    var m = new i.Maps.Layer(o.id);
                    m.add(s), o.drillDownLayer = m, r || (this.addLayerToMap(a, m), this.focusOnUserAdmin2Polygon(n, m, a))
                }, t.prototype.bindAdmin2PolygonEvents = function(e, t) {
                    var a = this,
                        n = e.metadata;
                    n && n.polygonAddHandler && i.Maps.Events.addHandler(e, n.polygonAddHandler.type, function(e, t) {
                        this.MakeCallback(e, t)
                    }.bind(this, n.polygonAddHandler.callback, n.polygonAddHandler.callbackData)), i.Maps.Events.addHandler(e, "click", function(e) {
                        return a.focusOnPrimitive(e.target, t, !0)
                    }), i.Maps.Events.addHandler(e, "mouseover", function(e) {
                        return a.focusOnPrimitive(e.target, t, !1)
                    }), i.Maps.Events.addHandler(e, "mouseout", function(e) {
                        return a.unfocusPrimitive(e.target, !1)
                    })
                }, t.prototype.exitDrillDown = function(e) {
                    if (w && e) {
                        C && this.unfocusPrimitive(C, !0), this.setPushpinOptions(w, {
                            visible: !0,
                            color: "transparent"
                        });
                        var t = w.metadata && w.metadata.drillDownLayer;
                        t && e.layers.remove(t), w = null, x = null
                    }
                }, t.prototype.setBestMapViewWithBounds = function(e, t, a) {
                    var n = a._v8Map.getMode().getMapViewWithBounds(e);
                    t ? x = Math.round(i.Maps.ZoomLevel.fromLocation(n.cameraLocation)) : (a._v8Map.setView(n), x = a.getZoom())
                }, t.prototype.focusOnUserAdmin2Polygon = function(e, t, a) {
                    var n = e && t && t.getPrimitives().find(function(t) {
                            return 3 === t.geometryType && i.Maps.SpatialMath.Geometry.intersects(t, e)
                        }),
                        r = n && n.metadata;
                    if (r && r.center) {
                        a.setView({
                            center: r.center,
                            zoom: x || 7
                        }), this.focusOnPrimitive(n, a, !0);
                        var o = r.polygonAddHandler;
                        o && o.callback && this.MakeCallback(o.callback, o.callbackData)
                    }
                }, t.prototype.focusOnPrimitive = function(e, t, a) {
                    var n = 1 === e.geometryType,
                        i = e.metadata;
                    C && (n ? this.setPushpinOptions(C, {
                        color: "transparent"
                    }) : C.setOptions({
                        strokeThickness: 2
                    })), C = e, T = a;
                    var r = null;
                    if (n ? (this.setPushpinOptions(e, {
                        color: "rgb(212,55,0,0.8)"
                    }), r = e.getLocation(), w && e !== w && a && this.exitDrillDown(t)) : (i && i.infoBoxData && e.setOptions({
                        strokeThickness: 4
                    }), r = i && i.center), k && r && i.infoBoxData && (i.topOffset || !n)) {
                        this.clearInfoboxAnimation();
                        var o = this.getPushpinInfobox(i);
                        k.setOptions({
                            location: r,
                            visible: !0,
                            htmlContent: o
                        })
                    }
                }, t.prototype.unfocusPrimitive = function(e, t) {
                    if (!T || t) {
                        var a = 1 === e.geometryType;
                        C && (a ? this.setPushpinOptions(C, {
                            color: "transparent"
                        }) : C.setOptions({
                            strokeThickness: 2
                        })), C = null, k.setOptions({
                            visible: !1
                        }), a ? this.setPushpinOptions(e, {
                            color: "transparent"
                        }) : e.setOptions({
                            strokeThickness: 2
                        })
                    } else T = !1
                }, t.prototype.addLayerToMap = function(e, t) {
                    var a = e.getV8Map().getFrameManager();
                    if (a) {
                        var n = Date.now();
                        a.frameRendered.addOne(function() {
                            p.logInfoWithTimeInMS("Map_PolygonLayer", n, {
                                id: t.getId()
                            })
                        })
                    }
                    e.layers.indexOf(t) < 0 && e.layers.insert(t)
                }, t.prototype.processInfoboxValues = function(e) {
                    e && (e.value0 = "number" == typeof e.value0 ? s.formatNumber(e.value0) : "-", e.value1 = "number" == typeof e.value1 ? s.formatNumber(e.value1) : "-", e.value2 = "number" == typeof e.value2 ? s.formatNumber(e.value2) : "-", e.value3 = "number" == typeof e.value3 ? s.formatNumber(e.value3) : "-")
                }, t.prototype.getPushpinInfobox = function(e) {
                    return '\n                    <div class="btn btn-primary tooltip">\n                        <div class="topToolTip" style="top: -' + (e.topOffset || 0) + 'px">\n                            <div class="titleInfoBox">' + e.infoBoxData + '</div>\n                            <div class="statLine">\n                                <div class="stat total">' + d.totalConfirmedShort() + '</div>\n                                <div class="statCount total">' + (e.value0 || "-") + '</div>\n                            </div>\n                            <div class="statLine divider"></div>\n                            <div class="statLine">\n                                <div class="legendColor ongoing"></div>\n                                <div class="stat">' + d.activeCasesForCallout() + '</div>\n                                <div class="statCount">' + (e.value1 || "-") + '</div>\n                            </div>\n                            <div class="statLine">\n                                <div class="legendColor recovered"></div>\n                                <div class="stat">' + d.recoveredCasesForCallout() + '</div>\n                                <div class="statCount">' + (e.value2 || "-") + '</div>\n                            </div>\n                            <div class="statLine"> \n                                <div class="legendColor fatal"></div>\n                                <div class="stat">' + d.fatalCasesForCallout() + '</div>\n                                <div class="statCount">' + (e.value3 || "-") + "</div>\n                            </div> \n                            <i></i>\n                        </div>\n                    </div>\n                "
                }, t.prototype.getPushpinIcon = function(e, t, a) {
                    return "<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'><circle cx='{xOffset}' cy='{yOffset}' r='{radius}' stroke='{color}' stroke-width='{strokeWidth}' fill='{fillColor}'/></svg>".replace("{width}", (2 * e).toString()).replace("{height}", (2 * e).toString()).replace("{xOffset}", e.toString()).replace("{yOffset}", e.toString()).replace("{radius}", (e - 4).toString()).replace("{fillColor}", a).replace("{strokeWidth}", t && t.toString())
                }, t.prototype.getPushpinInfoboxTopOffset = function(e) {
                    return e + 10
                }, t.prototype.setPushpinOptions = function(e, t) {
                    e.setOptions(t), e.entity.collisionBehavior = 1
                }, t.prototype.bootstrapAnimationData = function(e, t) {
                    var a = window.location;
                    if (a && this.getUrlParam(a, "trendsani") && e && !this.state.trendsAnimationEnabled) {
                        for (var n = t.entities.getPrimitives(), i = 0; i < n.length; i++) {
                            var r = n[i].metadata;
                            if (r) {
                                var o = e[r.id];
                                if (o) {
                                    r.trend = o;
                                    var l = o.length;
                                    l > z && (z = l)
                                }
                            }
                        }
                        this.setState({
                            trendsAnimationEnabled: !0
                        })
                    }
                }, t.prototype.toggleAnimation = function() {
                    var e = this;
                    this.setState({
                        trendsAnimationState: this.state.trendsAnimationState === r.playing ? r.paused : r.playing
                    }), this.exitDrillDown(v[I]), S || (S = setInterval(function() {
                        var t = e.state;
                        if (t.trendsAnimationState === r.playing) {
                            var a = t.currentTrendFrame;
                            e.updatePushpinFrame(a), ++a >= z && (a = 0), e.setState({
                                currentTrendFrame: a
                            })
                        } else e.state.trendsAnimationState === r.stopped && (S && clearInterval(S), S = null, e.setState({
                            currentTrendFrame: 0,
                            trendsAnimationLabel: null
                        }), e.updatePushpinFrame())
                    }, 500))
                }, t.prototype.updatePushpinFrame = function(e) {
                    for (var t = this, a = "number" != typeof e, n = v[I].entities.getPrimitives(), r = function(r) {
                        var l = n[r],
                            s = l.metadata,
                            d = s.trend,
                            u = a,
                            c = function(e) {
                                var a = t.getPushpinIcon(e, null, "rgba(222, 55, 0, 0.5)");
                                l.metadata.topOffset = t.getPushpinInfoboxTopOffset(e), t.setPushpinOptions(l, {
                                    icon: a,
                                    anchor: new i.Maps.Point(e, e)
                                })
                            };
                        if (a) c(s.density);
                        else if (d && d.length + e >= z) {
                            var p = d[e - (z - d.length)];
                            if (z === d.length && o.setState({
                                trendsAnimationLabel: d[e].date
                            }), p.confirmed > 0) u = !0, c(Math.round(f.getCountyBubbleSizeDynamic(f.getSqrtNumber(p.confirmed), f.scaleMin, f.scaleMax, f.rangeMin, f.rangeMax)))
                        }
                        o.setPushpinOptions(l, {
                            visible: u
                        })
                    }, o = this, l = 0; l < n.length; l++) r(l)
                }, t.prototype.onAnimationSliderChange = function(e) {
                    var t = parseInt(e);
                    "number" == typeof t && (this.updatePushpinFrame(t), this.setState({
                        currentTrendFrame: t
                    }))
                }, t.prototype.getUrlParam = function(e, t, a) {
                    void 0 === a && (a = !0);
                    var n = encodeURI(t).replace(/[\.\(\)\*\+]/g, "\\$&"),
                        i = new RegExp("^(?:.*[&\\?]" + n + "=([^&]*))?.*$", "i").exec(e.search),
                        r = i && i[1] || "";
                    return a ? decodeURIComponent(r) : r
                }, t.prototype.isOnCorpnet = function() {
                    return !!(((window.Microsoft || {}).Maps || {}).GlobalConfig || {}).isOnCorpnet
                }, t.prototype.render = function() {
                    var e = this,
                        t = this.state;
                    return o.createElement("div", {
                        className: "wrapper-bingmaps"
                    }, t.trendsAnimationEnabled && o.createElement("div", {
                        id: "trendsAnimationControl"
                    }, o.createElement("input", {
                        id: "playPauseBtn",
                        onClick: function() {
                            e.toggleAnimation()
                        },
                        type: "button",
                        value: t.trendsAnimationState === r.playing ? "||" : "►"
                    }), o.createElement("input", {
                        id: "resetBtn",
                        onClick: function() {
                            e.setState({
                                trendsAnimationState: r.stopped
                            })
                        },
                        type: "button",
                        value: "■"
                    }), t.trendsAnimationState !== r.stopped && o.createElement("input", {
                        id: "timeSlider",
                        onChange: function(t) {
                            e.onAnimationSliderChange(t.target.value)
                        },
                        type: "range",
                        min: "0",
                        max: z,
                        step: "1",
                        value: t.currentTrendFrame
                    }), t.trendsAnimationLabel && o.createElement("div", null, t.trendsAnimationLabel)))
                }, t
            }(o.Component);
        t.default = l.connect(function(e) {
            return {
                byId: e.byId,
                trends: e.trendsData
            }
        }, {
            areaSelected: c.areaSelected
        })(M)
    },
    "https://www.bing.com/covid/components/Charts/ChartHelper.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/localization/covid.strings/index.ts");
        t.chartTheme = {
            color: ["#38A69F", "#306CB3", "#E7B526", "#BB77C6", "#955E3F", "#DE7F49", "#97CFB8", "#3595CB", "#BF428D", "#9AAD26"],
            visualMap: {
                color: ["#E47C1C", "#E7B526"]
            }
        };
        var i = function(e, t) {
            if (e && t)
                for (var a in t) e[a] = t[a];
            return e
        };
        t.chartTooltip = function(e) {
            return i({
                textStyle: {
                    align: "left",
                    color: "#444",
                    fontSize: 13
                },
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(0, 0, 0, 0.1)",
                borderWidth: 1,
                extraCssText: "box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);"
            }, e)
        }, t.chartGrid = function(e) {
            return i({
                top: 56,
                right: 24,
                bottom: 16,
                left: 24,
                containLabel: !0
            }, e)
        }, t.chartLegend = function(e) {
            return i({
                top: 12,
                left: 16
            }, e)
        }, t.chartXAxis = function(e) {
            return i({
                type: "category",
                axisPointer: {
                    type: "shadow"
                },
                axisLabel: {
                    fontSize: 11,
                    color: "#767676"
                },
                axisLine: {
                    color: "#DDD"
                }
            }, e)
        }, t.chartYAxis = function(e) {
            return i({
                axisTick: {
                    show: !1
                },
                axisLine: {
                    color: "#DDD"
                },
                splitLine: {
                    lineStyle: {
                        color: "rgba(0, 0, 0, 0.05)"
                    }
                },
                axisLabel: {
                    fontSize: 11,
                    color: "#767676",
                    formatter: function(e, t) {
                        return 0 === t && 0 === e ? "" : e >= 1e6 ? "" + n.millionAbbreviation((e / 1e6).toFixed(1)) : e >= 1e3 ? Math.round(e / 1e4) < e / 1e4 ? "" + n.thousandAbbreviation((e / 1e3).toFixed(1)) : "" + n.thousandAbbreviation(Math.round(e / 1e3)) : e
                    }
                }
            }, e)
        }, t.chartResize = function(e) {
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) && e) {
                var t = e.getEchartsInstance();
                t && "function" == typeof t.resize && t.resize()
            }
        }
    },
    "https://www.bing.com/covid/components/Charts/MobilityChart.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/node_modules/echarts/index.js"),
            o = a("https://www.bing.com/node_modules/echarts-for-react/lib/index.js"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/components/Charts/ChartHelper.tsx"),
            u = a("https://www.bing.com/covid/config.ts");
        r.registerTheme("covid_topregion_chart", d.chartTheme);
        t.default = i.connect(function(e) {
            return {
                byId: e.byId,
                trends: e.trendsData,
                mobilityData: e.mobilityData,
                width: e.width
            }
        })(function(e) {
            var t = e.id || u.rootId,
                a = n.useRef(null);
            if (n.useEffect(function() {
                a && a.current && d.chartResize(a.current)
            }, [e.width]), !e.trends || !e.trends[t] || e.trends[t].length <= 0 || !e.mobilityData || !e.mobilityData[t]) return null;
            for (var i = e.trends[t], r = e.mobilityData[t], c = i.map(function(e) {
                return e.date
            }), f = [i[0].confirmed], p = 1; p < i.length; p++) f.push(i[p].confirmed - i[p - 1].confirmed);
            var m = r.length - c.length,
                v = r.slice();
            m > 0 ? v = new Array(m).concat(v) : m < 0 && (v = v.slice(-m));
            var h = [{
                name: s.mobility(),
                type: "line",
                data: v.map(function(e) {
                    return Number(e.movement_change.toFixed(2))
                }),
                yAxisIndex: 0
            }, {
                name: s.newCases(),
                type: "bar",
                stack: "total",
                data: f,
                yAxisIndex: 1
            }];
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, e.title), e.expandCallback && n.createElement("div", {
                onClick: function() {
                    return e.expandCallback(e.graphType)
                }
            }, s.expand(), l.expandIcon)), n.createElement("div", {
                className: "infoTile graph"
            }, n.createElement(o.default, {
                option: {
                    animation: !1,
                    tooltip: d.chartTooltip({
                        trigger: "axis"
                    }),
                    grid: d.chartGrid({}),
                    legend: d.chartLegend({
                        data: [s.mobility(), s.newCases()],
                        left: "center"
                    }),
                    xAxis: [d.chartXAxis({
                        data: c
                    })],
                    yAxis: [d.chartYAxis({
                        type: "value",
                        name: s.mobility(),
                        axisLabel: {
                            formatter: "{value} %"
                        }
                    }), d.chartYAxis({
                        type: "value",
                        name: s.newCases()
                    })],
                    series: h
                },
                theme: "covid_topregion_chart",
                style: {
                    height: e.height,
                    width: "100%"
                },
                notMerge: !0,
                ref: a
            })))
        })
    },
    "https://www.bing.com/covid/components/Charts/PunchChart.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/node_modules/echarts/index.js"),
            o = a("https://www.bing.com/node_modules/echarts-for-react/lib/index.js"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/components/Root.tsx"),
            u = a("https://www.bing.com/covid/components/Charts/ChartHelper.tsx"),
            c = a("https://www.bing.com/covid/config.ts");
        r.registerTheme("covid_topregion_chart", u.chartTheme);
        t.default = i.connect(function(e) {
            return {
                byId: e.byId,
                trends: e.trendsData,
                width: e.width
            }
        })(function(e) {
            var t, a = e.id || c.rootId,
                i = n.useState(10),
                r = i[0],
                f = (i[1], n.useRef(null));
            if (n.useEffect(function() {
                f && f.current && u.chartResize(f.current)
            }, [e.width]), !e.trends || !e.byId || !e.byId[a]) return null;
            var p = e.trends && e.byId && e.byId[a] && e.byId[a].areas.slice().sort(d.sortByConfirmed).map(function(t) {
                return {
                    id: t.id,
                    displayName: t.displayName,
                    data: e.trends && e.trends[t.id]
                }
            });
            if (!p || p.length <= 0) return null;
            var m = p.slice(0, Math.min(p.length, r)),
                v = m && m[0] && m[0].data && m[0].data.filter(function(e) {
                    return e.date
                }).map(function(e) {
                    return e.date
                }),
                h = m && m.map(function(e) {
                    return e.displayName
                }),
                g = m && m.map(function(e) {
                    return e.data && e.data.map(function(t) {
                        return [t.date, e.displayName, t.confirmed - t.fatal - t.recovered]
                    })
                }),
                b = (t = Array.prototype).concat.apply(t, g);
            if (!b || b.length < 3 || !v || v.length < 1) return null;
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, e.title), e.expandCallback && n.createElement("div", {
                onClick: function() {
                    return e.expandCallback(e.graphType)
                }
            }, s.expand(), l.expandIcon)), n.createElement("div", {
                className: "infoTile graph multiLineGraph"
            }, n.createElement(o.default, {
                option: {
                    animation: !1,
                    tooltip: u.chartTooltip({
                        trigger: "axis"
                    }),
                    grid: u.chartGrid({}),
                    legend: u.chartLegend({
                        type: "scroll",
                        data: h
                    }),
                    xAxis: [u.chartXAxis({
                        data: v
                    })],
                    yAxis: u.chartYAxis({
                        type: "category"
                    }),
                    visualMap: {
                        type: "piecewise",
                        pieces: [{
                            min: 0,
                            max: 499,
                            label: "< 500",
                            symbol: "circle",
                            color: "#F8E941"
                        }, {
                            min: 500,
                            max: 999,
                            label: "< 1000",
                            symbol: "circle",
                            color: "#E99421"
                        }, {
                            min: 1e3,
                            label: "> 1000",
                            symbol: "circle",
                            color: "#9D5512"
                        }],
                        show: !0,
                        orient: "horizontal",
                        left: "right",
                        top: 8,
                        textGap: 2
                    },
                    series: [{
                        type: "scatter",
                        symbolSize: function(e) {
                            return 10
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 20,
                                shadowColor: "rgba(0, 0, 0, 0.8)"
                            }
                        },
                        data: b
                    }]
                },
                theme: "covid_topregion_chart",
                style: {
                    height: e.height,
                    width: "100%"
                },
                notMerge: !0,
                ref: f
            })))
        })
    },
    "https://www.bing.com/covid/components/Charts/RawDataList.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/helper.ts"),
            o = a("https://www.bing.com/node_modules/office-ui-fabric-react/lib/DetailsList.js"),
            l = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            s = a("https://www.bing.com/covid/config.ts");
        t.default = i.connect(function(e) {
            return {
                byId: e.byId
            }
        })(function(e) {
            var t = e.id || s.rootId;
            if (!e.byId || !e.byId[t] || !e.byId[t].areas || e.byId[t].areas.length <= 0) return null;
            var a = e.byId[t].displayName ? e.byId[t].displayName : l.global(),
                i = n.useState([{
                    key: a,
                    name: a,
                    fieldName: "name",
                    minWidth: 120,
                    isResizable: !0,
                    isSorted: !1,
                    isSortedDescending: !1
                }, {
                    key: l.confirmed(),
                    name: l.confirmed(),
                    fieldName: "totalConfirmed",
                    minWidth: 120,
                    isResizable: !0,
                    onColumnClick: c,
                    isSorted: !0,
                    isSortedDescending: !0
                }, {
                    key: l.active(),
                    name: l.active(),
                    fieldName: "active",
                    minWidth: 120,
                    isResizable: !0,
                    onColumnClick: c,
                    isSorted: !1,
                    isSortedDescending: !1
                }, {
                    key: l.recovered(),
                    name: l.recovered(),
                    fieldName: "totalRecovered",
                    minWidth: 120,
                    isResizable: !0,
                    onColumnClick: c,
                    isSorted: !1,
                    isSortedDescending: !1
                }, {
                    key: l.fatal(),
                    name: l.fatal(),
                    fieldName: "totalDeaths",
                    minWidth: 120,
                    isResizable: !0,
                    onColumnClick: c,
                    isSorted: !1,
                    isSortedDescending: !1
                }]),
                d = i[0],
                u = i[1];

            function c(e, t) {
                var a = d.slice(),
                    n = a.filter(function(e) {
                        return t.key === e.key
                    }),
                    i = n && n.length > 0 && n[0];
                a.forEach(function(e) {
                    e === i ? (i.isSortedDescending = !i.isSortedDescending, i.isSorted = !0) : (e.isSorted = !1, e.isSortedDescending = !1)
                }), u(a)
            }
            n.useEffect(function() {
                var t = e.id || s.rootId,
                    a = e.byId[t].displayName ? e.byId[t].displayName : l.global(),
                    n = d.slice();
                n.splice(0, 1, {
                    key: a,
                    name: a,
                    fieldName: "name",
                    minWidth: 120,
                    isResizable: !0,
                    isSorted: !1,
                    isSortedDescending: !1
                }), u(n)
            }, [e.id]);
            var f = e.byId[t].areas.sort(function(e, t) {
                var a = d.find(function(e) {
                    return e.isSorted
                });
                if ("active" == a.fieldName) {
                    var n = t.totalConfirmed - (t.totalRecovered ? t.totalRecovered : 0) - (t.totalDeaths ? t.totalDeaths : 0),
                        i = e.totalConfirmed - (e.totalRecovered ? e.totalRecovered : 0) - (e.totalDeaths ? e.totalDeaths : 0);
                    return a.isSortedDescending ? n - i : i - n
                }
                var r = a.fieldName;
                return r && t[r] && e[r] ? a.isSortedDescending ? t[r] - e[r] : e[r] - t[r] : 0
            }).map(function(e) {
                var t = e.totalConfirmed,
                    a = e.totalDeaths ? e.totalDeaths : 0,
                    n = e.totalRecovered ? e.totalRecovered : 0,
                    i = t - n - a,
                    o = i ? r.formatNumber(i) : "-";
                i > 0 && (o += " (" + (i / t * 100).toFixed(2) + "%)");
                var l = a ? r.formatNumber(a) : "-";
                a > 0 && (l += " (" + (a / t * 100).toFixed(2) + "%)");
                var s = n ? r.formatNumber(n) : "-";
                return n > 0 && (s += " (" + (n / t * 100).toFixed(2) + "%)"), {
                    key: e.id,
                    name: e.displayName,
                    totalConfirmed: t ? r.formatNumber(t) : "-",
                    active: o,
                    totalDeaths: l,
                    totalRecovered: s
                }
            });
            return f.length <= 0 ? null : n.createElement(n.Fragment, null, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, l.dataTitle())), n.createElement("div", {
                className: "infoTile rawDataList"
            }, n.createElement(o.DetailsList, {
                items: f,
                columns: d,
                compact: !1,
                selectionMode: o.SelectionMode.none
            })))
        })
    },
    "https://www.bing.com/covid/components/Charts/SingleRegionLineChart.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/node_modules/echarts/index.js"),
            o = a("https://www.bing.com/node_modules/echarts-for-react/lib/index.js"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/components/Charts/ChartHelper.tsx"),
            u = a("https://www.bing.com/covid/config.ts");
        r.registerTheme("covid", {
            color: ["#DE3700", "#767676", "#60BB69"]
        });
        t.default = i.connect(function(e) {
            return {
                trends: e.trendsData,
                width: e.width
            }
        })(function(e) {
            var t = e.id || u.rootId,
                a = n.useRef(null);
            if (n.useEffect(function() {
                a && a.current && d.chartResize(a.current)
            }, [e.width]), !e.trends) return null;
            var i = e.trends && e.trends[t] ? e.trends[t] : null;
            if (!i || i.length <= 0) return null;
            var r = 0,
                c = [s.confirmed(), s.fatal()],
                f = i.map(function(e) {
                    return e.fatal > 0 && e.fatal > r && (r = e.fatal), e.date
                });
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, e.title), e.expandCallback && n.createElement("div", {
                onClick: function() {
                    return e.expandCallback(e.graphType)
                }
            }, s.expand(), l.expandIcon)), n.createElement("div", {
                className: "infoTile graph multiLineGraph"
            }, n.createElement(o.default, {
                option: {
                    animation: !1,
                    tooltip: d.chartTooltip({
                        trigger: "axis"
                    }),
                    grid: d.chartGrid({
                        containLabel: !0,
                        top: 80
                    }),
                    legend: d.chartLegend({
                        data: c
                    }),
                    xAxis: [d.chartXAxis({
                        data: f
                    })],
                    yAxis: [d.chartYAxis({
                        type: "value",
                        name: s.confirmed()
                    }), d.chartYAxis({
                        type: "value",
                        name: s.fatal(),
                        max: 2 * r
                    })],
                    series: [{
                        name: s.confirmed(),
                        type: "line",
                        data: i.map(function(e) {
                            return e.confirmed
                        }),
                        smooth: !0
                    }, {
                        name: s.fatal(),
                        type: "line",
                        data: i.map(function(e) {
                            return e.fatal
                        }),
                        smooth: !0,
                        yAxisIndex: 1
                    }]
                },
                theme: "covid",
                style: {
                    height: e.height,
                    width: "100%"
                },
                ref: a
            })))
        })
    },
    "https://www.bing.com/covid/components/Charts/SummaryInfo.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/helper.ts"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = a("https://www.bing.com/covid/config.ts");
        t.default = i.connect(function(e) {
            return {
                byId: e.byId
            }
        })(function(e) {
            var t = e.id || l.rootId;
            if (!e.byId || !e.byId[t]) return null;
            var a = e.byId[t],
                i = a.totalRecovered || 0,
                s = a.totalDeaths || 0,
                d = a.totalConfirmed - i - s,
                u = a.totalConfirmed,
                c = a.totalConfirmedDelta - a.totalRecoveredDelta || 0 - a.totalDeathsDelta || 0;
            return n.createElement("div", {
                className: "row"
            }, n.createElement("div", {
                className: "col-12"
            }, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, o.totalConfirmedShort()))), n.createElement("div", {
                className: "infoTile summary col-12"
            }, n.createElement("div", {
                className: "row"
            }, n.createElement("div", {
                className: "col-3"
            }, n.createElement("div", {
                className: "container confirmed"
            }, n.createElement("div", {
                className: "tile"
            }, n.createElement("div", {
                className: "title",
                title: o.totalConfirmed()
            }, o.totalConfirmed()), n.createElement("div", {
                className: "number confirmed"
            }, r.formatNumber(u)), 0 != a.totalConfirmedDelta && n.createElement("div", {
                className: "delta"
            }, a.totalConfirmedDelta > 0 ? "+" : "-", r.formatNumber(a.totalConfirmedDelta))))), n.createElement("div", {
                className: "col-3"
            }, n.createElement("div", {
                className: "container active"
            }, n.createElement("div", {
                className: "tile"
            }, n.createElement("div", {
                className: "title",
                title: o.activeCases()
            }, o.activeCases()), n.createElement("div", {
                className: "number active"
            }, r.formatNumber(d)), 0 != c && n.createElement("div", {
                className: "delta"
            }, c > 0 ? "+" : "-", r.formatNumber(c))))), n.createElement("div", {
                className: "col-3"
            }, n.createElement("div", {
                className: "container recovered"
            }, n.createElement("div", {
                className: "tile"
            }, n.createElement("div", {
                className: "title",
                title: o.recoveredCases()
            }, o.recoveredCases()), n.createElement("div", {
                className: "number recovered"
            }, r.formatNumber(i)), 0 != a.totalRecoveredDelta && n.createElement("div", {
                className: "delta"
            }, a.totalRecoveredDelta > 0 ? "+" : "-", r.formatNumber(a.totalRecoveredDelta))))), n.createElement("div", {
                className: "col-3"
            }, n.createElement("div", {
                className: "container death"
            }, n.createElement("div", {
                className: "tile"
            }, n.createElement("div", {
                className: "title",
                title: o.fatalCases()
            }, o.fatalCases()), n.createElement("div", {
                className: "number death"
            }, r.formatNumber(s)), 0 != a.totalDeathsDelta && n.createElement("div", {
                className: "delta"
            }, a.totalDeathsDelta > 0 ? "+" : "-", r.formatNumber(a.totalDeathsDelta))))))))
        })
    },
    "https://www.bing.com/covid/components/Charts/TimelyStackedBarChart.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/node_modules/echarts/index.js"),
            o = a("https://www.bing.com/node_modules/echarts-for-react/lib/index.js"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/components/Root.tsx"),
            u = a("https://www.bing.com/covid/components/Charts/ChartHelper.tsx"),
            c = a("https://www.bing.com/covid/config.ts");
        r.registerTheme("covid_topregion_chart", u.chartTheme);
        t.default = i.connect(function(e) {
            return {
                byId: e.byId,
                trends: e.trendsData,
                width: e.width
            }
        })(function(e) {
            var t = e.id || c.rootId,
                a = n.useState(10),
                i = a[0],
                r = (a[1], n.useRef(null));
            n.useEffect(function() {
                r && r.current && u.chartResize(r.current)
            }, [e.width]);
            var f = e.trends && e.byId && e.byId[t] && e.byId[t].areas && e.byId[t].areas.slice().sort(d.sortByConfirmed).map(function(t) {
                return {
                    id: t.id,
                    displayName: t.displayName,
                    data: e.trends && e.trends[t.id]
                }
            });
            if (!f) return null;
            var p = f && f.slice(0, Math.min(f.length, i)),
                m = p && p[0] && p[0].data && p[0].data.filter(function(e) {
                    return e.date
                }).map(function(e) {
                    return e.date
                }),
                v = p && p.map(function(e) {
                    return e.displayName
                }),
                h = m ? m.length : 0,
                g = p && p.map(function(t) {
                    var a = t.data && t.data.map(function(t) {
                        return 0 === e.type ? t.confirmed - t.fatal - t.recovered : 3 === e.type ? t.recovered : 4 === e.type ? t.fatal : t.confirmed
                    });
                    if (a) {
                        var n = h - a.length;
                        n > 0 ? a = new Array(n).concat(a) : n < 0 && (a = a.slice(-n))
                    }
                    return {
                        name: t.displayName,
                        type: "bar",
                        stack: "total",
                        data: a
                    }
                });
            if (!g || g.length < 2 || !m || m.length < 1) return null;
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, e.title), e.expandCallback && n.createElement("div", {
                onClick: function() {
                    return e.expandCallback(e.graphType)
                }
            }, s.expand(), l.expandIcon)), n.createElement("div", {
                className: "infoTile graph"
            }, n.createElement(o.default, {
                option: {
                    animation: !1,
                    tooltip: u.chartTooltip({
                        trigger: "axis"
                    }),
                    grid: u.chartGrid({}),
                    legend: u.chartLegend({
                        data: v,
                        type: "scroll"
                    }),
                    xAxis: [u.chartXAxis({
                        data: m
                    })],
                    yAxis: u.chartYAxis({
                        type: "value"
                    }),
                    series: g
                },
                theme: "covid_topregion_chart",
                style: {
                    height: e.height,
                    width: "100%"
                },
                notMerge: !0,
                ref: r
            })))
        })
    },
    "https://www.bing.com/covid/components/Charts/TimelyTopRegionsLineChart.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/node_modules/echarts/index.js"),
            o = a("https://www.bing.com/node_modules/echarts-for-react/lib/index.js"),
            l = a("https://www.bing.com/node_modules/react-select/dist/react-select.browser.esm.js"),
            s = a("https://www.bing.com/covid/components/Icons.tsx"),
            d = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            u = a("https://www.bing.com/covid/components/Root.tsx"),
            c = a("https://www.bing.com/covid/components/Charts/ChartHelper.tsx"),
            f = a("https://www.bing.com/covid/config.ts");
        r.registerTheme("covid_topregion_chart", c.chartTheme);
        t.default = i.connect(function(e) {
            return {
                byId: e.byId,
                trends: e.trendsData,
                width: e.width
            }
        })(function(e) {
            var t = e.id || f.rootId;
            if (!e.trends || !e.byId || !e.byId[t]) return null;
            var a = n.useState(10),
                i = a[0],
                r = (a[1], [{
                    value: "linear",
                    label: d.linearScale()
                }, {
                    value: "log",
                    label: d.logScale()
                }]),
                p = [{
                    value: "confirmed",
                    label: d.confirmed()
                }, {
                    value: "active",
                    label: d.active()
                }, {
                    value: "recovered",
                    label: d.recovered()
                }, {
                    value: "fatal",
                    label: d.fatal()
                }],
                m = n.useState(r[0]),
                v = m[0],
                h = m[1],
                g = n.useState(p[0]),
                b = g[0],
                k = g[1],
                y = n.useState(!1),
                C = y[0],
                w = (y[1], n.useRef(null));
            n.useEffect(function() {
                w && w.current && c.chartResize(w.current)
            }, [e.width]);
            var x = !1,
                T = e.byId[t] && e.byId[t].areas;
            if (t != f.rootId && e.byId[t].parentId != f.rootId || T.length <= 0) {
                for (var z = e.byId[t].parentId; z && e.byId[z] && e.byId[z].parentId != f.rootId;) z = e.byId[z].parentId;
                T = e.byId[z] && e.byId[z].areas, x = !0
            }
            T && T.filter(function(t) {
                return e.trends[t.id]
            }).length > 0 || (T = e.byId[f.rootId].areas, x = !0);
            var S = T && T.slice().sort(u.sortByConfirmed).map(function(t) {
                return {
                    id: t.id,
                    displayName: t.displayName,
                    data: e.trends[t.id]
                }
            });
            if (!S || S.length <= 0) return null;
            var I = S && S.slice(0, Math.min(S.length, i));
            x && !I.find(function(e) {
                return e.id == t
            }) && e.trends[t] && I.push({
                id: t,
                displayName: e.byId[t].displayName,
                data: e.trends && e.trends[t]
            });
            var A = I && I[0] && I[0].data && I[0].data.filter(function(e) {
                    return e.date
                }).map(function(e) {
                    return e.date
                }),
                D = I && I.map(function(e) {
                    return e.displayName
                }),
                M = {},
                E = A ? A.length : 0,
                j = 0,
                P = I && I.map(function(a) {
                    var n = a.data && a.data.map(function(e) {
                        var t = 0;
                        switch (b.value) {
                            case "confirmed":
                                t = e.confirmed;
                                break;
                            case "fatal":
                                t = e.fatal;
                                break;
                            case "recovered":
                                t = e.recovered;
                                break;
                            case "active":
                                t = e.confirmed - e.fatal - e.recovered
                        }
                        return j = Math.max(t, j), "log" === v.value && (t = t < 3 ? 1 : Number(Math.log(t).toFixed(2))), t
                    });
                    if (n) {
                        var i = E - n.length;
                        i > 0 ? n = new Array(i).concat(n) : i < 0 && (n = n.slice(-i))
                    }
                    return x && e.trends[t] && (M[a.displayName] = t === a.id), {
                        name: a.displayName,
                        type: "line",
                        data: n,
                        smooth: !0
                    }
                });
            if (!P || P.length < 2 || !A || A.length < 1) return null;

            function B(e) {
                var t = e.findIndex(function(e) {
                    return e >= j
                });
                return t > -1 ? e.slice(0, t + 1) : e
            }

            function F(e, t) {
                return {
                    name: t,
                    type: "line",
                    data: "log" === v.value ? e.map(function(e) {
                        return Number(Math.log(e).toFixed(2))
                    }) : e,
                    smooth: !0,
                    lineStyle: {
                        type: "dashed",
                        color: "#ccc",
                        width: "2"
                    },
                    showSymbol: !1,
                    itemStyle: {
                        color: "#ccc"
                    }
                }
            }
            if (C) {
                for (var L = [], O = [], R = [], _ = 0; _ < E; _++) L.push(Math.floor(1 * Math.pow(2, _ / 2))), O.push(Math.floor(1 * Math.pow(2, _ / 3))), R.push(Math.floor(1 * Math.pow(2, _ / 7)));
                L = B(L), O = B(O), R = B(R), D.splice(0, 0, "Double every 2 days", "Double every 3 days", "Double every week"), P.push(F(L, "Double every 2 days")), P.push(F(O, "Double every 3 days")), P.push(F(R, "Double every week"))
            }
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, e.title), e.expandCallback && n.createElement("div", {
                onClick: function() {
                    return e.expandCallback(e.graphType)
                }
            }, d.expand(), s.expandIcon)), n.createElement("div", {
                className: "infoTile graph"
            }, n.createElement("div", {
                className: "chartFilterLine"
            }, n.createElement("div", {
                className: "selectBox"
            }, n.createElement(l.default, {
                value: b,
                options: p,
                onChange: function(e) {
                    k(e)
                }
            })), n.createElement("div", {
                className: "selectBox"
            }, n.createElement(l.default, {
                value: v,
                options: r,
                onChange: function(e) {
                    h(e)
                }
            }))), n.createElement(o.default, {
                option: {
                    animation: !1,
                    tooltip: c.chartTooltip({
                        trigger: "axis"
                    }),
                    grid: c.chartGrid({}),
                    legend: c.chartLegend({
                        data: D,
                        type: "scroll",
                        selected: M
                    }),
                    xAxis: [c.chartXAxis({
                        data: A
                    })],
                    yAxis: c.chartYAxis({
                        type: "value",
                        min: "log" === v.value ? 1 : 0
                    }),
                    series: P
                },
                theme: "covid_topregion_chart",
                style: {
                    height: e.height,
                    width: "100%"
                },
                notMerge: !0,
                ref: w
            })))
        })
    },
    "https://www.bing.com/covid/components/Charts/TreeMapChart.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/node_modules/echarts/index.js"),
            o = a("https://www.bing.com/node_modules/echarts-for-react/lib/index.js"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/components/Root.tsx"),
            u = a("https://www.bing.com/covid/components/Charts/ChartHelper.tsx"),
            c = a("https://www.bing.com/covid/helper.ts"),
            f = a("https://www.bing.com/covid/config.ts");
        r.registerTheme("covid_topregion_chart", u.chartTheme);
        t.default = i.connect(function(e) {
            return {
                byId: e.byId,
                width: e.width
            }
        })(function(e) {
            var t = e.id || f.rootId,
                a = e.byId && e.byId[t] && e.byId[t].areas && e.byId[t].areas.slice().sort(d.sortByConfirmed),
                i = e.byId && e.byId[t] && e.byId[t].displayName,
                r = n.useRef(null);
            if (n.useEffect(function() {
                r && r.current && u.chartResize(r.current)
            }, [e.width]), !a) return null;
            for (var p = [], m = 0; m < a.length; ++m) {
                var v = a[m],
                    h = {
                        value: v.totalConfirmed,
                        name: v.displayName,
                        path: v.displayName
                    };
                if (v.areas && v.areas.length > 0) {
                    h.children = [];
                    for (var g = 0; g < v.areas.length; ++g) {
                        var b = v.areas[g],
                            k = {
                                value: b.totalConfirmed,
                                name: b.displayName,
                                path: b.displayName
                            };
                        if (b.areas && b.areas.length > 0) {
                            k.children = [];
                            for (var y = 0; y < b.areas.length; ++y) {
                                var C = b.areas[y],
                                    w = {
                                        value: C.totalConfirmed,
                                        name: C.displayName,
                                        path: C.displayName
                                    };
                                k.children.push(w)
                            }
                        }
                        h.children.push(k)
                    }
                }
                p.push(h)
            }
            if (0 == p.length) return null;
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, e.title), e.expandCallback && n.createElement("div", {
                onClick: function() {
                    return e.expandCallback(e.graphType)
                }
            }, s.expand(), l.expandIcon)), n.createElement("div", {
                className: "infoTile graph"
            }, n.createElement(o.default, {
                option: {
                    animation: !1,
                    tooltip: u.chartTooltip({
                        formatter: function(e) {
                            for (var t = e.value ? c.formatNumber(e.value) : e.value, a = e.treePathInfo, n = [], i = 1; i < a.length; i++) n.push(a[i].name);
                            return ['<div class="tooltip-title">' + n.join(" / ") + "</div>", s.totalConfirmedShort() + ": " + t].join("")
                        }
                    }),
                    grid: u.chartGrid({
                        top: 0
                    }),
                    series: [{
                        name: i || s.global(),
                        type: "treemap",
                        visibleMin: 300,
                        roam: "false",
                        label: {
                            show: !0,
                            formatter: "{b}"
                        },
                        itemStyle: {
                            borderColor: "#fff"
                        },
                        breadcrumb: {
                            top: "93%",
                            itemStyle: {
                                color: "#fff",
                                borderWidth: 0,
                                textStyle: {
                                    color: "#444"
                                }
                            }
                        },
                        levels: [{
                            itemStyle: {
                                borderWidth: 0,
                                gapWidth: 0
                            }
                        }, {
                            itemStyle: {
                                gapWidth: 0
                            }
                        }, {
                            itemStyle: {
                                gapWidth: .5,
                                borderColorSaturation: .6
                            }
                        }],
                        data: p
                    }]
                },
                theme: "covid_topregion_chart",
                style: {
                    height: e.height,
                    width: "100%"
                },
                notMerge: !0,
                ref: r
            })))
        })
    },
    "https://www.bing.com/covid/components/Feedback.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n, i = a("https://www.bing.com/node_modules/react/index.js"),
            r = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = a("https://www.bing.com/covid/makeRequest.ts"),
            s = a("https://www.bing.com/covid/components/Icons.tsx"),
            d = a("https://www.bing.com/covid/components/Root.tsx"),
            u = a("https://www.bing.com/covid/components/shared/Modal.tsx");
        ! function(e) {
            e[e.Issue = 0] = "Issue", e[e.Idea = 1] = "Idea", e[e.Compliment = 2] = "Compliment", e[e.Legal = 3] = "Legal"
        }(n || (n = {}));
        var c = [{
            enum: n.Issue,
            option: o.feedbackReportIssue,
            question: o.feedbackTellIssue,
            sentiment: "DSAT"
        }, {
            enum: n.Idea,
            option: o.feedbackShareIdea,
            question: o.feedbackTellIdea,
            sentiment: "Suggestion"
        }, {
            enum: n.Compliment,
            option: o.feedbackGiveCompliment,
            question: o.feedbackTellCompliment,
            sentiment: "SAT"
        }, {
            enum: n.Legal,
            option: o.feedbackLegalConcern,
            question: o.feedbackTellConcern,
            sentiment: "DSAT"
        }];
        t.default = r.connect(function(e) {
            return {
                selectedArea: e.selectedInfo
            }
        })(function(e) {
            var t = i.useState(null),
                a = t[0],
                r = t[1],
                l = i.useState(!1),
                d = l[0],
                p = l[1],
                m = i.createRef();
            i.useEffect(function() {
                e.feedbackOpen && (r(null), p(!1))
            }, [e.feedbackOpen]);
            var v = i.useCallback(function() {
                var t = c.find(function(e) {
                    return e.enum === a
                });
                f(a, m.current ? m.current.value : "", e.selectedArea, t ? t.sentiment : ""), p(!0), setTimeout(function() {
                    return e.openFeedback(!1)
                }, 2e3)
            }, [a, e.selectedArea]);
            return i.createElement(u.default, {
                callback: e.openFeedback,
                duration: 200,
                modalOpen: e.feedbackOpen
            }, i.createElement("div", {
                className: "feedbackModal"
            }, i.createElement("div", {
                className: "question"
            }, null === a ? o.feedbackQuestion() : c[a].question()), i.createElement("div", {
                className: "feedbackInput"
            }, null === a ? c.map(function(e) {
                return i.createElement("div", {
                    key: e.enum,
                    className: "feedbackOption",
                    onClick: function() {
                        e.enum === n.Legal ? window.open("http://go.microsoft.com/fwlink?LinkId=850876", "_blank") : r(e.enum)
                    }
                }, e.option())
            }) : i.createElement(i.Fragment, null, i.createElement("textarea", {
                placeholder: o.feedbackTextEntry(),
                ref: m
            }), i.createElement("a", {
                className: "privacyLink",
                target: "=blank",
                href: "https://privacy.microsoft.com/en-us/privacystatement"
            }, o.privacyStatement()), i.createElement("div", {
                className: "feedbackActions"
            }, d ? i.createElement("div", {
                className: "thanks"
            }, o.feedbackThanks()) : i.createElement(i.Fragment, null, i.createElement("div", {
                className: "feedbackButton",
                onClick: function() {
                    return r(null)
                }
            }, o.feedbackButtonBack()), i.createElement("div", {
                className: "feedbackButton",
                onClick: v
            }, o.feedbackButtonSend()))))), i.createElement("div", {
                className: "closeFeedback",
                onClick: function() {
                    return e.openFeedback(!1)
                },
                title: o.close()
            }, s.closeFeedback)))
        });
        var f = function(e, t, a, n) {
            l.makeRequest("/covid/feedback", {
                partner: "BingLegacy",
                feedbackType: "feedback",
                width: window.innerWidth,
                height: window.innerHeight,
                text: t,
                query: "",
                url: window.location.href,
                structured_data: {
                    selectedArea: a,
                    covidFeedbackType: e,
                    ig: window.ig
                },
                impression_guid: window.ig,
                vertical: "covid",
                sentiment: n,
                linkId: d.feedbackId,
                traceId: window.traceId
            }, 3)
        }
    },
    "https://www.bing.com/covid/components/Filter.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n, i = a("https://www.bing.com/node_modules/fuzzy/lib/fuzzy.js"),
            r = a("https://www.bing.com/covid/leven.ts"),
            o = a("https://www.bing.com/node_modules/react/index.js"),
            l = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            s = a("https://www.bing.com/covid/location.ts"),
            d = a("https://www.bing.com/covid/components/Icons.tsx");
        ! function(e) {
            e[e.Blur = 0] = "Blur", e[e.NoInput = 1] = "NoInput", e[e.Suggestions = 2] = "Suggestions"
        }(n || (n = {}));
        t.default = function(e) {
            var t = o.useState(function(e) {
                    var t = [];
                    for (var a in e) t.push({
                        id: a,
                        displayName: e[a].displayName
                    });
                    return t
                }(e.byId))[0],
                a = o.useState([]),
                u = a[0],
                c = a[1],
                f = o.useState(null),
                p = f[0],
                m = f[1],
                v = o.useState(n.Blur),
                h = v[0],
                g = v[1],
                b = o.useRef(null),
                k = o.useCallback(function() {
                    if (b && b.current)
                        if (b.current.value) {
                            var a = b.current.value,
                                o = i.filter(b.current.value, t, {
                                    extract: function(e) {
                                        return e.displayName
                                    }
                                });
                            o.sort(function(t, n) {
                                return t.score !== n.score ? n.score - t.score : r.default(a, t.original.displayName) !== r.default(a, n.original.displayName) ? r.default(a, t.original.displayName) - r.default(a, n.original.displayName) : e.byId[n.original.id].totalConfirmed - e.byId[t.original.id].totalConfirmed
                            }), c(o.map(function(e) {
                                return e.original
                            })), 0 === o.length ? g(n.Blur) : h !== n.Suggestions && g(n.Suggestions)
                        } else c([]), g(n.NoInput), !p && s.haveLocationPermission() && s.getNearestLocation(!1, e.byId, function(e) {
                            return m(e)
                        })
                }, []);
            return o.useEffect(function() {
                h === n.Blur && (c([]), m(null))
            }, [h]), o.createElement(o.Fragment, null, o.createElement("input", {
                ref: b,
                type: "text",
                className: "area " + (h !== n.Blur ? "open" : ""),
                placeholder: l.filterPlaceholder(),
                onFocus: k,
                onBlur: function() {
                    return setTimeout(function() {
                        return g(n.Blur)
                    }, 200)
                },
                onChange: k,
                autoCapitalize: "off",
                autoComplete: "off",
                autoCorrect: "off"
            }), o.createElement("div", {
                className: "locate"
            }, o.createElement("div", {
                className: "locationIcon",
                onClick: function() {
                    return s.getNearestLocation(!0, e.byId, function(t) {
                        return e.areaSelected(t.id, 5)
                    })
                }
            }, d.locationIcon)), e.isMobile && h !== n.Blur && o.createElement("div", {
                className: "filterOverlay",
                onClick: function() {
                    return g(n.Blur)
                }
            }), h !== n.Blur && o.createElement("div", {
                className: "suggestions"
            }, o.createElement(o.Fragment, null, h === n.NoInput && o.createElement("div", {
                className: "nearest"
            }, o.createElement("div", {
                className: "nearestTitle"
            }, l.yourLocation()), h === n.NoInput && o.createElement("div", {
                className: "suggestion",
                onClick: function() {
                    return p ? e.areaSelected(p.id, 4) : s.getNearestLocation(!0, e.byId, function(e) {
                        return m(e)
                    })
                }
            }, o.createElement("div", {
                className: "locationIcon"
            }, d.locationIcon), o.createElement("div", {
                className: "nearestInfo " + (p ? "" : "noPermission")
            }, p ? o.createElement(o.Fragment, null, o.createElement("div", {
                className: "suggArea"
            }, p.displayName), p.parentId && "world" != p.parentId && o.createElement("div", {
                className: "parentSugg"
            }, e.byId[p.parentId].displayName)) : o.createElement("div", null, l.permissionsToShowNearest())))), u.map(function(t) {
                return o.createElement("div", {
                    className: "suggestion",
                    key: t.id,
                    onClick: function() {
                        e.areaSelected(t.id, 4), b && b.current && (b.current.value = "")
                    }
                }, o.createElement("div", {
                    className: "suggArea"
                }, t.displayName), e.byId[t.id].parentId && "world" != e.byId[t.id].parentId && o.createElement("div", {
                    className: "parentSugg"
                }, e.byId[e.byId[t.id].parentId].displayName))
            }))))
        }
    },
    "https://www.bing.com/covid/components/FloatingUpsell.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/components/Icons.tsx"),
            r = a("https://www.bing.com/covid/instrumentation.ts"),
            o = a("https://www.bing.com/covid/components/ShareModal.tsx"),
            l = a("https://www.bing.com/covid/upsellHelper.ts"),
            s = a("https://www.bing.com/covid/components/BingBot.tsx"),
            d = a("https://www.bing.com/covid/components/HealthBot.tsx");
        a("https://www.bing.com/covid/styles/upsells.css");
        var u = a("https://www.bing.com/covid/components/UpsellDetailView.tsx");
        t.default = function() {
            var e = n.useState(!1),
                t = e[0],
                a = e[1],
                c = n.useState(function() {
                    return l.getCurrentUpsellAttrribute()
                })[0],
                f = n.useState(!1),
                p = f[0],
                m = f[1],
                v = n.useState(!1),
                h = v[0],
                g = v[1],
                b = n.useState(!1),
                k = b[0],
                y = b[1],
                C = window.location && window.location.href && window.location.href.indexOf("bingBot=1") > -1,
                w = window.location && window.location.href && window.location.href.indexOf("healthBot=1") > -1,
                x = C || w,
                T = function() {
                    C ? g(!h) : w && y(!k)
                },
                z = p ? "upsellOpen" : "",
                S = 73 + (x ? 50 : 0);
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "upsellContainer"
            }, n.createElement("div", {
                className: "floatingUpsell " + z,
                onClick: function() {
                    r.logInfo(1 === c.upsellType ? "dseUpsell" : "opalUpsell", {
                        action: p ? "closeDialog" : "openDialog"
                    }), m(!p)
                }
            }, p ? i.closeFloatingUpsell : n.createElement(n.Fragment, null, 0 === c.upsellType && i.mobileIcon, n.createElement("span", {
                className: c.titleStyle
            }, c.bubbleTitle()))), x && n.createElement("div", {
                className: "floatingUpsell shareFloating " + (h ? "botOpen" : ""),
                onClick: T
            }, i.BotHeadForTray(h)), n.createElement("div", {
                className: "floatingUpsell shareFloating",
                onClick: function() {
                    r.logInfo("shareFloat", {
                        action: t ? "closeDialog" : "openDialog"
                    }), a(!t)
                }
            }, i.share)), p && n.createElement(u.default, {
                upsellAttribute: c,
                containerRight: S
            }), n.createElement(o.default, {
                isOpen: t,
                openModal: a
            }), h && n.createElement(s.default, {
                botViewRight: 73,
                toggleChatWindow: T
            }), k && n.createElement(d.default, {
                botViewRight: 73
            }))
        }
    },
    "https://www.bing.com/covid/components/Header.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(e) {
                for (var t, a = 1, n = arguments.length; a < n; a++)
                    for (var i in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }).apply(this, arguments)
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = a("https://www.bing.com/node_modules/office-ui-fabric-react/lib/Button.js"),
            r = a("https://www.bing.com/node_modules/office-ui-fabric-react/lib/Callout.js"),
            o = a("https://www.bing.com/node_modules/react/index.js"),
            l = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            s = a("https://www.bing.com/covid/helper.ts"),
            d = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            u = a("https://www.bing.com/covid/localization/localeHelper.ts"),
            c = a("https://www.bing.com/covid/components/Icons.tsx"),
            f = a("https://www.bing.com/covid/components/Root.tsx"),
            p = {
                height: 16,
                width: 16,
                color: "white"
            };

        function m(e) {
            var t = o.useState(!1),
                a = t[0],
                n = t[1],
                l = o.useRef();
            return o.useEffect(function() {
                e.autoDismiss && a && setTimeout(function() {
                    n(!1)
                }, 1e3)
            }, [a]), o.createElement(o.Fragment, null, o.createElement("div", {
                ref: l,
                onClick: function() {
                    "function" == typeof e.onClick && e.onClick(), !e.disable && n(!a)
                },
                className: e.className,
                title: e.hoverTitle
            }, e.icon, e.title && o.createElement("div", null, e.title)), a && !e.disable && o.createElement(r.Callout, {
                target: l,
                directionalHint: r.DirectionalHint.rightCenter,
                onDismiss: function() {
                    return n(!1)
                }
            }, o.createElement("div", {
                className: "infoCallout"
            }, !e.disableCloseButton && o.createElement(i.IconButton, {
                iconProps: {
                    iconName: "ChromeClose",
                    style: {
                        fontSize: 12
                    }
                },
                title: d.close(),
                ariaLabel: d.close(),
                className: "closeCallout",
                onClick: function() {
                    return n(!1)
                }
            }), e.callout)))
        }
        t.Info = l.connect(function(e) {
            return {
                lastUpdated: e.lastUpdated
            }
        })(function(e) {
            var t = o.createElement(c.InfoIcon, n({}, e.iconProps)),
                a = o.createElement(o.Fragment, null, o.createElement("p", null, o.createElement("span", null, d.dataFrom(), " "), o.createElement("a", {
                    className: "attribution",
                    href: "https://www.cdc.gov/coronavirus/2019-ncov/index.html",
                    target: "_blank"
                }, "CDC "), "·", o.createElement("a", {
                    className: "attribution",
                    href: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019",
                    target: "_blank"
                }, " WHO "), " ·", o.createElement("a", {
                    className: "attribution",
                    href: "https://www.ecdc.europa.eu/en/novel-coronavirus-china",
                    target: "_blank"
                }, " ECDC "), " ·", o.createElement("a", {
                    className: "attribution",
                    href: "https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic",
                    target: "_blank"
                }, " Wikipedia"), " ·", o.createElement("a", {
                    className: "attribution",
                    href: "https://247wallst.com/",
                    target: "_blank"
                }, " 24/7 Wall St.")), o.createElement("p", {
                    style: {
                        paddingTop: "10px"
                    }
                }, d.dataUpdate(), o.createElement("br", null), e.lastUpdated && e.lastUpdated.toLocaleString(u.isValidLocale(window.uiLang) ? window.uiLang : void 0)));
            return o.createElement(m, n({}, {
                icon: t,
                callout: a
            }, {
                title: e.title,
                className: e.className,
                hoverTitle: d.dataInfo()
            }))
        }), t.default = l.connect(function(e) {
            return {
                panelsHidden: e.panelsHidden
            }
        })(function(e) {
            var a = e.isMobile ? "#444" : "#666",
                i = n({}, p, {
                    color: a
                });
            return o.createElement("div", {
                className: "header",
                role: "banner",
                "aria-label": "Header"
            }, o.createElement("div", null, o.createElement("a", {
                className: "logo",
                href: "https://www.bing.com",
                target: "_blank"
            }, c.logo(a, e.isMobile ? 20 : 24))), e.titleInBar && o.createElement(o.Fragment, null, o.createElement("a", {
                href: "/covid",
                target: s.isInIframe() ? "_blank" : "_self",
                className: "covidHeader"
            }, o.createElement("h1", {
                className: "pageName"
            }, d.covidTitle())), o.createElement("div", {
                className: "spacer"
            })), o.createElement("div", {
                className: "headerButtons"
            }, e.onShareClick && o.createElement("div", {
                onClick: e.onShareClick
            }, o.createElement(c.ShareIcon, n({}, i))), o.createElement("div", {
                title: d.feedback(),
                onClick: function() {
                    return e.openFeedback(!0)
                },
                id: f.feedbackId
            }, o.createElement(c.FeedbackIcon, n({}, i))), o.createElement(t.Info, {
                iconProps: i
            })))
        })
    },
    "https://www.bing.com/covid/components/HealthBot.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js");
        t.default = function(e) {
            return n.createElement("div", {
                className: "healthChatContainer",
                style: {
                    right: e.botViewRight
                }
            }, ">", n.createElement("iframe", {
                src: "https://webchat.botframework.com/embed/covidbotbing-bot?s=h9Hy1DG84JA.jeb4DPCRLjpdR_TqJXwqm35QP_cSWTEiIImwJbcNGKA",
                height: 500,
                width: 400
            }))
        }
    },
    "https://www.bing.com/covid/components/HelpfulResources.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/instrumentation.ts"),
            r = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            o = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = function(e, t) {
                var a = !!e.attribution;
                return n.createElement("div", {
                    key: e.url,
                    className: "infoContainer"
                }, n.createElement("a", {
                    href: e.url,
                    target: "_blank",
                    className: "helpfulResourceTitle",
                    onClick: function() {
                        return function(e, t, a) {
                            void 0 === a && (a = "article"), i.logInfo("helpfulResourceClick", {
                                regionId: e,
                                url: t,
                                elementType: a
                            })
                        }(t, e.url)
                    }
                }, e.title), n.createElement("div", {
                    className: "provider"
                }, a && n.createElement("div", {
                    className: "providerName"
                }, e.attribution)))
            };
        t.default = o.connect(function(e) {
            return {
                selectedInfo: e.selectedInfo,
                helpfulResponse: e.helpfulResourcesData
            }
        })(function(e) {
            var t = e.selectedInfo && e.selectedInfo.id || "world",
                a = e.helpfulResponse && e.helpfulResponse[t] ? e.helpfulResponse[t] : null;
            if (!a || 0 === a.length) return null;
            var i = n.useState(!1),
                o = i[0],
                d = i[1],
                u = a.slice(0, 5);
            return n.createElement(n.Fragment, null, n.createElement("h4", {
                className: "segmentTitle helpfulResourceTitle"
            }, r.helpfulResources()), n.createElement("div", {
                className: "helpfulResourceCard infoTile"
            }, u.map(function(e, a) {
                return (a <= 2 || o) && s(e, t)
            }), !o && u.length > 3 && n.createElement("div", {
                className: "seeMoreHelpful helpfulResourceTitle",
                onClick: function() {
                    return d(!0)
                }
            }, n.createElement("div", {
                className: "seeMoreWithIcon"
            }, r.seeMore()), n.createElement("div", null, l.chevronDown))))
        })
    },
    "https://www.bing.com/covid/components/Icons.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js");
        t.InfoIcon = function(e) {
            return n.createElement("svg", {
                width: e.width,
                height: e.height,
                viewBox: "0 0 16 16",
                fill: "none"
            }, n.createElement("path", {
                d: "M8 1C6.61553 1 5.26215 1.41054 4.11101 2.17971C2.95987 2.94888 2.06266 4.04213 1.53285 5.32122C1.00303 6.6003 0.86441 8.00776 1.13451 9.36563C1.4046 10.7235 2.07129 11.9708 3.05026 12.9497C4.02922 13.9287 5.2765 14.5954 6.63437 14.8655C7.99224 15.1356 9.3997 14.997 10.6788 14.4672C11.9579 13.9373 13.0511 13.0401 13.8203 11.889C14.5895 10.7378 15 9.38447 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1ZM9 9.5V11C9 11.2652 8.89464 11.5196 8.70711 11.7071C8.51957 11.8946 8.26522 12 8 12C7.73479 12 7.48043 11.8946 7.2929 11.7071C7.10536 11.5196 7 11.2652 7 11V8C7 7.73478 7.10536 7.48043 7.2929 7.29289C7.48043 7.10536 7.73479 7 8 7C8.26522 7 8.51957 7.10536 8.70711 7.29289C8.89464 7.48043 9 7.73478 9 8V9.5ZM8.707 5.707C8.54338 5.87057 8.32811 5.97235 8.09786 5.99499C7.86761 6.01763 7.63664 5.95973 7.44429 5.83116C7.25195 5.70259 7.11013 5.51131 7.04301 5.2899C6.97589 5.0685 6.98762 4.83066 7.07619 4.61693C7.16477 4.4032 7.32471 4.2268 7.52877 4.11777C7.73283 4.00875 7.96838 3.97386 8.19529 4.01904C8.42219 4.06422 8.62641 4.18668 8.77314 4.36555C8.91988 4.54442 9.00005 4.76864 9 5C8.99994 5.26519 8.89455 5.51951 8.707 5.707Z",
                fill: e.color
            }))
        }, t.ShareIcon = function(e) {
            return n.createElement("svg", {
                width: e.width,
                height: e.height,
                viewBox: "0 0 16 16",
                fill: "none"
            }, n.createElement("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M10 3C10 1.34315 11.3431 0 13 0C14.6569 0 16 1.34315 16 3C16 4.65685 14.6569 6 13 6C12.0971 6 11.2873 5.60109 10.7373 4.96988L5.93406 7.3715C5.97726 7.57418 6 7.78443 6 8C6 8.21557 5.97726 8.42582 5.93406 8.6285L10.7373 11.0301C11.2873 10.3989 12.0971 10 13 10C14.6569 10 16 11.3431 16 13C16 14.6569 14.6569 16 13 16C11.3431 16 10 14.6569 10 13C10 12.7844 10.0227 12.5742 10.0659 12.3715L5.26271 9.96988C4.71272 10.6011 3.90295 11 3 11C1.34315 11 0 9.65685 0 8C0 6.34315 1.34315 5 3 5C3.90295 5 4.71272 5.39891 5.26271 6.03012L10.0659 3.6285C10.0227 3.42582 10 3.21557 10 3ZM13 11.5C12.1716 11.5 11.5 12.1716 11.5 13C11.5 13.8284 12.1716 14.5 13 14.5C13.8284 14.5 14.5 13.8284 14.5 13C14.5 12.1716 13.8284 11.5 13 11.5ZM1.5 8C1.5 7.17157 2.17157 6.5 3 6.5C3.82843 6.5 4.5 7.17157 4.5 8C4.5 8.82843 3.82843 9.5 3 9.5C2.17157 9.5 1.5 8.82843 1.5 8ZM13 1.5C12.1716 1.5 11.5 2.17157 11.5 3C11.5 3.82843 12.1716 4.5 13 4.5C13.8284 4.5 14.5 3.82843 14.5 3C14.5 2.17157 13.8284 1.5 13 1.5Z",
                fill: e.color
            }))
        }, t.FeedbackIcon = function(e) {
            return n.createElement("svg", {
                width: e.width,
                height: e.height,
                viewBox: "0 0 16 15",
                fill: "none"
            }, n.createElement("path", {
                d: "M14.5 0H1.5C0.7 0 0 0.7 0 1.5V10.5C0 11.3 0.7 12 1.5 12H2V14.5C2 14.8 2.2 15 2.5 15C2.6 15 2.7 15 2.8 14.9L5.7 12H14.5C15.3 12 16 11.3 16 10.5V1.5C16 0.7 15.3 0 14.5 0Z",
                fill: e.color
            }))
        }, t.logo = function(e, t) {
            return void 0 === e && (e = "white"), void 0 === t && (t = 24), n.createElement("svg", {
                width: t,
                height: t,
                viewBox: "0 0 24 24",
                fill: "none"
            }, n.createElement("g", {
                clipPath: "url(#clipLogo)"
            }, n.createElement("path", {
                d: "M8.8 18.564V1.68L4 0V21.324L8.8 24L20.8 17.1V11.64L8.8 18.564Z",
                fill: e
            }), n.createElement("path", {
                opacity: "0.75",
                d: "M20.8 17.1V11.64L10.156 7.92001L12.238 13.11L20.8 17.1Z",
                fill: e
            })), n.createElement("defs", null, n.createElement("clipPath", {
                id: "clipDarkLogo"
            }, n.createElement("rect", {
                width: "24",
                height: "24",
                fill: "white"
            }))))
        }, t.share = n.createElement("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 16 16",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
        }, n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M10 3C10 1.34315 11.3431 0 13 0C14.6569 0 16 1.34315 16 3C16 4.65685 14.6569 6 13 6C12.0971 6 11.2873 5.60109 10.7373 4.96988L5.93406 7.3715C5.97726 7.57418 6 7.78443 6 8C6 8.21557 5.97726 8.42582 5.93406 8.6285L10.7373 11.0301C11.2873 10.3989 12.0971 10 13 10C14.6569 10 16 11.3431 16 13C16 14.6569 14.6569 16 13 16C11.3431 16 10 14.6569 10 13C10 12.7844 10.0227 12.5742 10.0659 12.3715L5.26271 9.96988C4.71272 10.6011 3.90295 11 3 11C1.34315 11 0 9.65685 0 8C0 6.34315 1.34315 5 3 5C3.90295 5 4.71272 5.39891 5.26271 6.03012L10.0659 3.6285C10.0227 3.42582 10 3.21557 10 3ZM13 11.5C12.1716 11.5 11.5 12.1716 11.5 13C11.5 13.8284 12.1716 14.5 13 14.5C13.8284 14.5 14.5 13.8284 14.5 13C14.5 12.1716 13.8284 11.5 13 11.5ZM1.5 8C1.5 7.17157 2.17157 6.5 3 6.5C3.82843 6.5 4.5 7.17157 4.5 8C4.5 8.82843 3.82843 9.5 3 9.5C2.17157 9.5 1.5 8.82843 1.5 8ZM13 1.5C12.1716 1.5 11.5 2.17157 11.5 3C11.5 3.82843 12.1716 4.5 13 4.5C13.8284 4.5 14.5 3.82843 14.5 3C14.5 2.17157 13.8284 1.5 13 1.5Z",
            fill: "white"
        })), t.opalLogo = n.createElement("svg", {
            width: "58",
            height: "58",
            viewBox: "0 0 58 58",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
        }, n.createElement("rect", {
            x: "1",
            y: "1",
            width: "56",
            height: "56",
            rx: "12",
            fill: "url(#paint0_linear)"
        }), n.createElement("g", {
            clipPath: "url(#clipOpalLogo)"
        }, n.createElement("path", {
            d: "M25.7334 37.752V15.24L19.3334 13V41.432L25.7334 45L41.7334 35.8V28.52L25.7334 37.752Z",
            fill: "#00809D"
        }), n.createElement("path", {
            opacity: "0.75",
            d: "M41.7334 35.8V28.52L27.5414 23.56L30.3174 30.48L41.7334 35.8Z",
            fill: "#00809D"
        })), n.createElement("rect", {
            x: "0.5",
            y: "0.5",
            width: "57",
            height: "57",
            rx: "12.5",
            stroke: "black",
            strokeOpacity: "0.1"
        }), n.createElement("defs", null, n.createElement("linearGradient", {
            id: "paint0_linear",
            x1: "1",
            y1: "1",
            x2: "57",
            y2: "57",
            gradientUnits: "userSpaceOnUse"
        }, n.createElement("stop", {
            stopColor: "white"
        }), n.createElement("stop", {
            offset: "1",
            stopColor: "#F7F7F7"
        })), n.createElement("clipPath", {
            id: "clipOpalLogo"
        }, n.createElement("rect", {
            x: "14",
            y: "13",
            width: "32",
            height: "32",
            fill: "white"
        })))), t.mobileIcon = n.createElement("svg", {
            width: "10",
            height: "16",
            viewBox: "0 0 10 16",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
        }, n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M1.5 0C0.671573 0 0 0.671573 0 1.5V14.5C0 15.3284 0.671573 16 1.5 16H8.5C9.32843 16 10 15.3284 10 14.5V1.5C10 0.671573 9.32843 0 8.5 0H6H4H1.5ZM3 1H2C1.44772 1 1 1.44772 1 2V14C1 14.5523 1.44772 15 2 15H8C8.55229 15 9 14.5523 9 14V2C9 1.44772 8.55229 1 8 1H7C7 1.55228 6.55228 2 6 2H4C3.44772 2 3 1.55228 3 1ZM3 13.5C3 13.2239 3.22386 13 3.5 13H6.5C6.77614 13 7 13.2239 7 13.5C7 13.7761 6.77614 14 6.5 14H3.5C3.22386 14 3 13.7761 3 13.5Z",
            fill: "white"
        })), t.dseCovidIcon = n.createElement("svg", {
            width: "58",
            height: "58",
            viewBox: "0 0 58 58",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
        }, n.createElement("g", {
            clipPath: "url(#clip0)"
        }, n.createElement("g", {
            filter: "url(#filter0_d)"
        }, n.createElement("path", {
            clipRule: "evenodd",
            fillRule: "evenodd",
            d: "M8 9.87878C8 8.13825 9.4103 6.72726 11.15 6.72726H46.85C48.5897 6.72726 50 8.13825 50 9.87878V50.8485C50 52.589 48.5897 54 46.85 54H11.15C9.4103 54 8 52.589 8 50.8485V9.87878Z",
            fill: "#D8D8D8"
        })), n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M8 9.87878C8 8.13825 9.4103 6.72726 11.15 6.72726H46.85C48.5897 6.72726 50 8.13825 50 9.87878V47.1717C50 48.9122 48.5897 50.3232 46.85 50.3232H11.15C9.4103 50.3232 8 48.9122 8 47.1717V9.87878Z",
            fill: "white"
        }), n.createElement("mask", {
            id: "mask0",
            "mask-type": "alpha",
            maskUnits: "userSpaceOnUse",
            x: "8",
            y: "6",
            width: "42",
            height: "45"
        }, n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M8 9.87878C8 8.13825 9.4103 6.72726 11.15 6.72726H46.85C48.5897 6.72726 50 8.13825 50 9.87878V47.1717C50 48.9122 48.5897 50.3232 46.85 50.3232H11.15C9.4103 50.3232 8 48.9122 8 47.1717V9.87878Z",
            fill: "white"
        })), n.createElement("g", {
            mask: "url(#mask0)"
        }, n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M8 6.72726H50V16.7071H8V6.72726Z",
            fill: "#00B7C8"
        })), n.createElement("path", {
            d: "M15.8755 23.0101C15.8755 22.1398 16.5806 21.4343 17.4505 21.4343V21.4343C18.3203 21.4343 19.0255 22.1398 19.0255 23.0101V23.0101C19.0255 23.8804 18.3203 24.5858 17.4505 24.5858V24.5858C16.5806 24.5858 15.8755 23.8804 15.8755 23.0101V23.0101Z",
            fill: "#ECECEC"
        }), n.createElement("path", {
            d: "M15.8748 28.7879C15.8748 27.9176 16.5799 27.2121 17.4498 27.2121V27.2121C18.3196 27.2121 19.0248 27.9176 19.0248 28.7879V28.7879C19.0248 29.6582 18.3196 30.3636 17.4498 30.3636V30.3636C16.5799 30.3636 15.8748 29.6582 15.8748 28.7879V28.7879Z",
            fill: "#ECECEC"
        }), n.createElement("path", {
            d: "M15.8748 34.5656C15.8748 33.6954 16.5799 32.9899 17.4498 32.9899V32.9899C18.3196 32.9899 19.0248 33.6954 19.0248 34.5656V34.5656C19.0248 35.4359 18.3196 36.1414 17.4498 36.1414V36.1414C16.5799 36.1414 15.8748 35.4359 15.8748 34.5656V34.5656Z",
            fill: "#ECECEC"
        }), n.createElement("path", {
            d: "M15.8748 40.3434C15.8748 39.4732 16.5799 38.7677 17.4498 38.7677V38.7677C18.3196 38.7677 19.0248 39.4732 19.0248 40.3434V40.3434C19.0248 41.2137 18.3196 41.9192 17.4498 41.9192V41.9192C16.5799 41.9192 15.8748 41.2137 15.8748 40.3434V40.3434Z",
            fill: "#ECECEC"
        }), n.createElement("path", {
            d: "M21.1248 23.0101C21.1248 22.1398 21.8299 21.4343 22.6998 21.4343H40.5498C41.4196 21.4343 42.1248 22.1398 42.1248 23.0101V23.0101C42.1248 23.8803 41.4196 24.5858 40.5498 24.5858H22.6998C21.8299 24.5858 21.1248 23.8803 21.1248 23.0101V23.0101Z",
            fill: "#ECECEC"
        }), n.createElement("path", {
            d: "M21.1248 28.7879C21.1248 27.9176 21.8299 27.2121 22.6998 27.2121H40.5498C41.4196 27.2121 42.1248 27.9176 42.1248 28.7879V28.7879C42.1248 29.6582 41.4196 30.3636 40.5498 30.3636H22.6998C21.8299 30.3636 21.1248 29.6582 21.1248 28.7879V28.7879Z",
            fill: "#ECECEC"
        }), n.createElement("path", {
            d: "M21.1248 34.5656C21.1248 33.6954 21.8299 32.9899 22.6998 32.9899H40.5498C41.4196 32.9899 42.1248 33.6954 42.1248 34.5656V34.5656C42.1248 35.4359 41.4196 36.1414 40.5498 36.1414H22.6998C21.8299 36.1414 21.1248 35.4359 21.1248 34.5656V34.5656Z",
            fill: "#ECECEC"
        }), n.createElement("path", {
            d: "M21.1248 40.3434C21.1248 39.4732 21.8299 38.7677 22.6998 38.7677H33.1998C34.0696 38.7677 34.7748 39.4732 34.7748 40.3434V40.3434C34.7748 41.2137 34.0696 41.9192 33.1998 41.9192H22.6998C21.8299 41.9192 21.1248 41.2137 21.1248 40.3434V40.3434Z",
            fill: "#ECECEC"
        }), n.createElement("g", {
            filter: "url(#filter1_d)"
        }, n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M24.763 2C24.0296 2 23.435 2.59482 23.435 3.32857V5.30665H20.878C20.1446 5.30665 19.55 5.90147 19.55 6.63522V9.60073C19.55 10.3345 20.1446 10.9293 20.878 10.9293H37.6471C38.3805 10.9293 38.975 10.3345 38.975 9.60073V6.63522C38.975 5.90147 38.3805 5.30665 37.6471 5.30665H35.1318V3.32857C35.1318 2.59482 34.5373 2 33.8039 2H24.763Z",
            fill: "#CCCCCC"
        }), n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M29.525 8.82827C30.6848 8.82827 31.625 7.88762 31.625 6.72726C31.625 5.56691 30.6848 4.62625 29.525 4.62625C28.3653 4.62625 27.425 5.56691 27.425 6.72726C27.425 7.88762 28.3653 8.82827 29.525 8.82827Z",
            fill: "white"
        }), n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M28.7848 8.69401C28.43 8.31779 28.2125 7.81056 28.2125 7.25251C28.2125 6.09216 29.1528 5.1515 30.3125 5.1515C30.5731 5.1515 30.8226 5.19898 31.0528 5.28577C30.6699 4.8797 30.1271 4.62625 29.525 4.62625C28.3653 4.62625 27.425 5.56691 27.425 6.72726C27.425 7.62692 27.9902 8.39451 28.7848 8.69401Z",
            fill: "#9B9B9B"
        })), n.createElement("g", {
            filter: "url(#filter2_d)"
        }, n.createElement("path", {
            d: "M39 44.5C39 43.9477 39.4477 43.5 40 43.5H54C54.5523 43.5 55 43.9477 55 44.5V47.5C55 48.0523 54.5523 48.5 54 48.5H40C39.4477 48.5 39 48.0523 39 47.5V44.5Z",
            fill: "#FE5450"
        }), n.createElement("path", {
            d: "M48.5 38C49.0523 38 49.5 38.4477 49.5 39L49.5 53C49.5 53.5523 49.0523 54 48.5 54L45.5 54C44.9477 54 44.5 53.5523 44.5 53L44.5 39C44.5 38.4477 44.9477 38 45.5 38L48.5 38Z",
            fill: "#FE5450"
        }))), n.createElement("defs", null, n.createElement("filter", {
            id: "filter0_d",
            x: "6",
            y: "4.72726",
            width: "48",
            height: "53.2727",
            filterUnits: "userSpaceOnUse",
            "color-interpolation-filters": "sRGB"
        }, n.createElement("feFlood", {
            floodOpacity: "0",
            result: "BackgroundImageFix"
        }), n.createElement("feColorMatrix", { in : "SourceAlpha",
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        }), n.createElement("feOffset", {
            dx: "1",
            dy: "1"
        }), n.createElement("feGaussianBlur", {
            stdDeviation: "1.5"
        }), n.createElement("feColorMatrix", {
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        }), n.createElement("feBlend", {
            mode: "normal",
            in2: "BackgroundImageFix",
            result: "effect1_dropShadow"
        }), n.createElement("feBlend", {
            mode: "normal",
            in : "SourceGraphic",
            in2: "effect1_dropShadow",
            result: "shape"
        })), n.createElement("filter", {
            id: "filter1_d",
            x: "18.55",
            y: "2",
            width: "21.425",
            height: "10.9293",
            filterUnits: "userSpaceOnUse",
            "color-interpolation-filters": "sRGB"
        }, n.createElement("feFlood", {
            floodOpacity: "0",
            result: "BackgroundImageFix"
        }), n.createElement("feColorMatrix", { in : "SourceAlpha",
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        }), n.createElement("feOffset", {
            dy: "1"
        }), n.createElement("feGaussianBlur", {
            stdDeviation: "0.5"
        }), n.createElement("feColorMatrix", {
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0.501961 0 0 0 0 0.615686 0 0 0 0.5 0"
        }), n.createElement("feBlend", {
            mode: "normal",
            in2: "BackgroundImageFix",
            result: "effect1_dropShadow"
        }), n.createElement("feBlend", {
            mode: "normal",
            in : "SourceGraphic",
            in2: "effect1_dropShadow",
            result: "shape"
        })), n.createElement("filter", {
            id: "filter2_d",
            x: "37",
            y: "36",
            width: "22",
            height: "22",
            filterUnits: "userSpaceOnUse",
            "color-interpolation-filters": "sRGB"
        }, n.createElement("feFlood", {
            floodOpacity: "0",
            result: "BackgroundImageFix"
        }), n.createElement("feColorMatrix", { in : "SourceAlpha",
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        }), n.createElement("feOffset", {
            dx: "1",
            dy: "1"
        }), n.createElement("feGaussianBlur", {
            stdDeviation: "1.5"
        }), n.createElement("feColorMatrix", {
            type: "matrix",
            values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        }), n.createElement("feBlend", {
            mode: "normal",
            in2: "BackgroundImageFix",
            result: "effect1_dropShadow"
        }), n.createElement("feBlend", {
            mode: "normal",
            in : "SourceGraphic",
            in2: "effect1_dropShadow",
            result: "shape"
        })), n.createElement("clipPath", {
            id: "clip0"
        }, n.createElement("rect", {
            width: "58",
            height: "58",
            fill: "white"
        })))), t.closeFloatingUpsell = n.createElement("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 16 16",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
        }, n.createElement("path", {
            d: "M15.7072 0.29325C15.3162 -0.09775 14.6832 -0.09775 14.2922 0.29325L7.99425 6.59125L1.69625 0.29325C1.29825 -0.09075 0.66525 -0.07975 0.28125 0.31825C-0.09375 0.70625 -0.09375 1.32125 0.28125 1.70925L6.57925 8.00725L0.28125 14.3053C-0.10275 14.7032 -0.09175 15.3363 0.30625 15.7203C0.69425 16.0952 1.30925 16.0952 1.69725 15.7203L7.99525 9.42225L14.2933 15.7203C14.6912 16.1042 15.3243 16.0933 15.7083 15.6952C16.0833 15.3072 16.0833 14.6923 15.7083 14.3053L9.40925 8.00625L15.7072 1.70825C16.0982 1.31725 16.0982 0.68425 15.7072 0.29325Z",
            fill: "#00809D"
        }), n.createElement("path", {
            d: "M15.7072 0.29325C15.3162 -0.09775 14.6832 -0.09775 14.2922 0.29325L7.99425 6.59125L1.69625 0.29325C1.29825 -0.09075 0.66525 -0.07975 0.28125 0.31825C-0.09375 0.70625 -0.09375 1.32125 0.28125 1.70925L6.57925 8.00725L0.28125 14.3053C-0.10275 14.7032 -0.09175 15.3363 0.30625 15.7203C0.69425 16.0952 1.30925 16.0952 1.69725 15.7203L7.99525 9.42225L14.2933 15.7203C14.6912 16.1042 15.3243 16.0933 15.7083 15.6952C16.0833 15.3072 16.0833 14.6923 15.7083 14.3053L9.40925 8.00625L15.7072 1.70825C16.0982 1.31725 16.0982 0.68425 15.7072 0.29325Z",
            fill: "white"
        })), t.hamburger = n.createElement("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 20 20",
            fill: "none"
        }, n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M0 3H20V5H0V3ZM0 9H20V11H0V9ZM20 15H0V17H20V15Z",
            fill: "#444444"
        })), t.closeDropdown = n.createElement("svg", {
            width: "12",
            height: "12",
            viewBox: "0 0 12 12",
            fill: "none"
        }, n.createElement("path", {
            d: "M7.41343 6.00041L11.7064 1.70741C11.8886 1.5188 11.9894 1.2662 11.9871 1.00401C11.9848 0.741809 11.8797 0.490997 11.6942 0.305589C11.5088 0.12018 11.258 0.0150115 10.9958 0.0127331C10.7336 0.0104547 10.481 0.111249 10.2924 0.293407L5.99943 4.58641L1.70643 0.293407C1.51783 0.111249 1.26523 0.0104547 1.00303 0.0127331C0.740833 0.0150115 0.49002 0.12018 0.304612 0.305589C0.119204 0.490997 0.014035 0.741809 0.0117566 1.00401C0.00947813 1.2662 0.110273 1.5188 0.292431 1.70741L4.58543 6.00041L0.292431 10.2934C0.110273 10.482 0.00947813 10.7346 0.0117566 10.9968C0.014035 11.259 0.119204 11.5098 0.304612 11.6952C0.49002 11.8806 0.740833 11.9858 1.00303 11.9881C1.26523 11.9904 1.51783 11.8896 1.70643 11.7074L5.99943 7.41441L10.2924 11.7074C10.481 11.8896 10.7336 11.9904 10.9958 11.9881C11.258 11.9858 11.5088 11.8806 11.6942 11.6952C11.8797 11.5098 11.9848 11.259 11.9871 10.9968C11.9894 10.7346 11.8886 10.482 11.7064 10.2934L7.41343 6.00041Z",
            fill: "#767676"
        })), t.expand = n.createElement("svg", {
            width: "12",
            height: "8",
            viewBox: "0 0 12 8",
            fill: "none"
        }, n.createElement("path", {
            d: "M11.7804 5.71957L6.53043 0.469567C6.38979 0.328964 6.19906 0.249977 6.00018 0.249977C5.80131 0.249977 5.61058 0.328964 5.46993 0.469567L0.219934 5.71957C0.148301 5.78875 0.0911637 5.87151 0.0518571 5.96301C0.0125504 6.05452 -0.00814049 6.15293 -0.00900548 6.25251C-0.00987047 6.3521 0.00910668 6.45086 0.0468178 6.54303C0.084528 6.6352 0.140218 6.71894 0.210637 6.78936C0.281056 6.85978 0.364796 6.91547 0.456968 6.95318C0.54914 6.99089 0.6479 7.00987 0.747484 7.009C0.847069 7.00814 0.945483 6.98745 1.03699 6.94814C1.12849 6.90884 1.21125 6.8517 1.28043 6.78007L6.00018 2.06032L10.7199 6.78007C10.7891 6.8517 10.8719 6.90884 10.9634 6.94814C11.0549 6.98745 11.1533 7.00814 11.2529 7.009C11.3525 7.00987 11.4512 6.99089 11.5434 6.95318C11.6356 6.91547 11.7193 6.85978 11.7897 6.78936C11.8601 6.71894 11.9158 6.6352 11.9535 6.54303C11.9913 6.45086 12.0102 6.3521 12.0094 6.25252C12.0085 6.15293 11.9878 6.05452 11.9485 5.96301C11.9092 5.87151 11.8521 5.78875 11.7804 5.71957Z",
            fill: "#767676"
        })), t.collapseCarrot = n.createElement("svg", {
            width: "5",
            height: "8",
            viewBox: "0 0 5 8",
            fill: "none"
        }, n.createElement("path", {
            d: "M5 6.95969V1.04031C5 0.621059 4.51503 0.387973 4.18765 0.649878L0.488043 3.60957C0.23784 3.80973 0.23784 4.19027 0.488043 4.39043L4.18765 7.35012C4.51503 7.61203 5 7.37894 5 6.95969Z",
            fill: "#767676"
        })), t.playIcon = n.createElement("svg", {
            fill: "none",
            height: "32",
            viewBox: "0 0 32 32",
            width: "32"
        }, n.createElement("rect", {
            fill: "#000",
            fillOpacity: ".7",
            height: "30",
            rx: "15",
            stroke: "#fff",
            strokeWidth: "2",
            width: "30",
            x: "1",
            y: "1"
        }), n.createElement("path", {
            d: "m12 21.259v-10.518c0-.77175.8372-1.25263 1.5039-.86374l9.0153 5.25894c.6615.3859.6615 1.3417 0 1.7276l-9.0153 5.2589c-.6667.3889-1.5039-.0919-1.5039-.8637z",
            fill: "#fff"
        })), t.closeFeedback = n.createElement("svg", {
            width: "12",
            height: "12",
            viewBox: "0 0 12 12",
            fill: "none"
        }, n.createElement("path", {
            d: "M11.7804 0.219938C11.4872 -0.0733125 11.0124 -0.0733125 10.7192 0.219938L5.99569 4.94344L1.27219 0.219938C0.973687 -0.0680625 0.498937 -0.0598125 0.210938 0.238687C-0.0703125 0.529687 -0.0703125 0.990937 0.210938 1.28194L4.93444 6.00544L0.210938 10.7289C-0.0770625 11.0274 -0.0688125 11.5022 0.229688 11.7902C0.520688 12.0714 0.981938 12.0714 1.27294 11.7902L5.99644 7.06669L10.7199 11.7902C11.0184 12.0782 11.4932 12.0699 11.7812 11.7714C12.0624 11.4804 12.0624 11.0192 11.7812 10.7289L7.05694 6.00469L11.7804 1.28119C12.0737 0.987937 12.0737 0.513188 11.7804 0.219938Z",
            fill: "white"
        })), t.unselectRegion = n.createElement("svg", {
            width: "13",
            height: "13",
            viewBox: "0 0 13 13",
            fill: "none"
        }, n.createElement("rect", {
            x: "13",
            width: "13",
            height: "13",
            rx: "6.5",
            transform: "rotate(90 13 0)",
            fill: "#008098",
            fillOpacity: "0.8"
        }), n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M8.97487 4.02517C8.77961 3.8299 8.46303 3.8299 8.26777 4.02517L6.5 5.79293L4.73223 4.02517C4.53697 3.8299 4.22039 3.8299 4.02513 4.02517C3.82986 4.22043 3.82986 4.53701 4.02513 4.73227L5.79289 6.50004L4.02513 8.26781C3.82986 8.46307 3.82986 8.77965 4.02513 8.97491C4.22039 9.17018 4.53697 9.17018 4.73223 8.97491L6.5 7.20715L8.26777 8.97491C8.46303 9.17018 8.77961 9.17018 8.97487 8.97491C9.17014 8.77965 9.17014 8.46307 8.97487 8.26781L7.20711 6.50004L8.97487 4.73227C9.17014 4.53701 9.17014 4.22043 8.97487 4.02517Z",
            fill: "white"
        })), t.regionChildIndicator = n.createElement("svg", {
            width: "11",
            height: "13",
            viewBox: "0 0 11 13",
            fill: "none"
        }, n.createElement("rect", {
            y: "9",
            width: "11",
            height: "1",
            rx: "0.504048",
            transform: "rotate(-45 0 9)",
            fill: "#919191"
        }), n.createElement("rect", {
            x: "4",
            y: "9",
            width: "5.00001",
            height: "1",
            rx: "0.504048",
            transform: "rotate(-45 4 9)",
            fill: "#919191"
        })), t.searchIcon = n.createElement("svg", {
            width: "20",
            height: "21",
            viewBox: "0 0 20 21",
            fill: "none"
        }, n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M7 1C3.687 1 1 3.687 1 7C1 10.313 3.687 13 7 13C10.313 13 13 10.313 13 7C13 3.687 10.313 1 7 1Z",
            stroke: "#007DAA",
            strokeWidth: "2"
        }), n.createElement("path", {
            d: "M12 12L19 20",
            stroke: "#007DAA",
            strokeWidth: "2",
            strokeLinecap: "round"
        })), t.expandIcon = n.createElement("svg", {
            width: "10",
            height: "10",
            viewBox: "0 0 12 12",
            fill: "none"
        }, n.createElement("path", {
            d: "M12 4.28571C12 4.7591 11.6162 5.14286 11.1429 5.14286C10.6695 5.14286 10.2857 4.7591 10.2857 4.28571V2.92629L2.92629 10.2857H4.28571C4.7591 10.2857 5.14286 10.6695 5.14286 11.1429C5.14286 11.6162 4.7591 12 4.28571 12H0.642857C0.287817 12 0 11.7122 0 11.3571V7.71429C0 7.2409 0.383756 6.85714 0.857143 6.85714C1.33053 6.85714 1.71429 7.2409 1.71429 7.71429V9.07372L9.07372 1.71429H7.71429C7.2409 1.71429 6.85714 1.33053 6.85714 0.857143C6.85714 0.383756 7.2409 0 7.71429 0H11.3571C11.7122 0 12 0.287817 12 0.642857V4.28571Z",
            fill: "#767676"
        })), t.locationIcon = n.createElement("svg", {
            width: "14",
            height: "14",
            viewBox: "0 0 14 14",
            fill: "none"
        }, n.createElement("path", {
            d: "M13.7168 0.292888C13.4279 0.0030768 12.9909 -0.0805688 12.6153 0.0820253L0.599272 5.30403C0.566883 5.32155 0.535532 5.34091 0.505372 5.36202C0.195712 5.53538 0.00282391 5.86133 0 6.21601V6.67675C0.00548436 6.7198 0.013945 6.76243 0.0253213 6.80432C0.0833152 7.29709 0.499472 7.66956 0.995972 7.67307H5.27633C5.70009 7.67299 6.08277 7.92628 6.24804 8.3162C6.26764 8.38158 6.28106 8.44864 6.28813 8.51652C6.30972 8.5851 6.32387 8.65579 6.33033 8.72739V13.0037C6.33582 13.0467 6.34428 13.0894 6.35565 13.1312C6.41365 13.624 6.8298 13.9965 7.32631 14H7.78736C8.18352 13.9981 8.5415 13.7635 8.70104 13.4012L11.3134 7.3979L13.9257 1.39464C13.9461 1.33852 13.9613 1.28064 13.971 1.22174C14.0535 0.889004 13.9572 0.537363 13.7168 0.292888Z",
            fill: "#666666"
        })), t.testingInfoIcon = n.createElement("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 16 16"
        }, n.createElement("path", {
            d: "M16 7C16.0018 6.64608 15.9096 6.29804 15.7329 5.99139C15.5561 5.68475 15.3012 5.43049 14.9941 5.25458C14.687 5.07867 14.3387 4.9874 13.9848 4.9901C13.6309 4.9928 13.284 5.08936 12.9796 5.26993C12.6752 5.4505 12.4242 5.70862 12.2522 6.01792C12.0801 6.32722 11.9933 6.67663 12.0004 7.03048C12.0076 7.38433 12.1085 7.72994 12.2929 8.03204C12.4773 8.33413 12.7386 8.58188 13.05 8.75C13.0224 8.83076 13.0055 8.91482 13 9V10.5C13 11.4283 12.6313 12.3185 11.9749 12.9749C11.3185 13.6313 10.4283 14 9.5 14C8.57174 14 7.6815 13.6313 7.02513 12.9749C6.36875 12.3185 6 11.4283 6 10.5V9.9C7.12936 9.66947 8.1444 9.05582 8.87331 8.1629C9.60222 7.26999 10.0002 6.15265 10 5V2.143C10 1.57464 9.77422 1.02956 9.37233 0.62767C8.97044 0.22578 8.42536 0 7.857 0C7.59178 0 7.33743 0.105357 7.14989 0.292893C6.96236 0.48043 6.857 0.734784 6.857 1C6.857 1.26522 6.96236 1.51957 7.14989 1.70711C7.33743 1.89464 7.59178 2 7.857 2L8 2.143V5C8 5.79565 7.68393 6.55871 7.12132 7.12132C6.55871 7.68393 5.79565 8 5 8C4.20435 8 3.44129 7.68393 2.87868 7.12132C2.31607 6.55871 2 5.79565 2 5V2.143L2.143 2C2.40822 2 2.66257 1.89464 2.85011 1.70711C3.03764 1.51957 3.143 1.26522 3.143 1C3.143 0.734784 3.03764 0.48043 2.85011 0.292893C2.66257 0.105357 2.40822 0 2.143 0C1.57464 0 1.02956 0.22578 0.62767 0.62767C0.22578 1.02956 1.04228e-07 1.57464 1.04228e-07 2.143V5C-0.000235151 6.15265 0.397783 7.26999 1.12669 8.1629C1.8556 9.05582 2.87064 9.66947 4 9.9V10.5C4 11.9587 4.57946 13.3576 5.61091 14.3891C6.64236 15.4205 8.04131 16 9.5 16C10.9587 16 12.3576 15.4205 13.3891 14.3891C14.4205 13.3576 15 11.9587 15 10.5V9C14.9944 8.91483 14.9776 8.83076 14.95 8.75C15.2666 8.5801 15.5313 8.32775 15.7161 8.01968C15.901 7.71161 15.9991 7.35927 16 7Z",
            fill: "#00809D"
        })), t.buildingIcon = n.createElement("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 16 16"
        }, n.createElement("path", {
            d: "M0,0H16V16H0Z",
            fill: "none"
        }), n.createElement("path", {
            d: "M12.5,0h-9A1.5,1.5,0,0,0,2,1.5V16H7V13.75A.75.75,0,0,1,7.75,13h.5a.75.75,0,0,1,.75.75V16h5V1.5A1.5,1.5,0,0,0,12.5,0ZM6,4.25A.75.75,0,0,1,5.25,5h-.5A.75.75,0,0,1,4,4.25V2.75A.75.75,0,0,1,4.75,2h.5A.75.75,0,0,1,6,2.75Zm3,0A.75.75,0,0,1,8.25,5h-.5A.75.75,0,0,1,7,4.25V2.75A.75.75,0,0,1,7.75,2h.5A.75.75,0,0,1,9,2.75Zm3,0a.75.75,0,0,1-.75.75h-.5A.75.75,0,0,1,10,4.25V2.75A.75.75,0,0,1,10.75,2h.5a.75.75,0,0,1,.75.75Zm-6,5a.75.75,0,0,1-.75.75h-.5A.75.75,0,0,1,4,9.25V7.75A.75.75,0,0,1,4.75,7h.5A.75.75,0,0,1,6,7.75Zm3,0a.75.75,0,0,1-.75.75h-.5A.75.75,0,0,1,7,9.25V7.75A.75.75,0,0,1,7.75,7h.5A.75.75,0,0,1,9,7.75Zm3,0a.75.75,0,0,1-.75.75h-.5A.75.75,0,0,1,10,9.25V7.75A.75.75,0,0,1,10.75,7h.5a.75.75,0,0,1,.75.75Z",
            fill: "#00809d"
        })), t.chevronDown = n.createElement("svg", {
            width: "12px",
            height: "7px",
            viewBox: "0 0 12 7"
        }, n.createElement("g", {
            id: "Page-1",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd"
        }, n.createElement("g", {
            id: "Artboard-2",
            transform: "translate(-184.000000, -180.000000)"
        }, n.createElement("g", {
            id: "ChevronDown-16px",
            transform: "translate(184.000000, 177.000000)"
        }, n.createElement("path", {
            d: "M0.228632851,4.28948475 L5.47056487,9.53948475 C5.76298968,9.8322712 6.23701032,9.8322712 6.52943513,9.53948475 L11.7713671,4.28948475 C11.966035,4.10117889 12.0441068,3.82232633 11.9755757,3.56010425 C11.9070446,3.29788218 11.7025756,3.09309846 11.4407565,3.02446188 C11.1789374,2.9558253 10.9005134,3.03401731 10.7124969,3.22898475 L6,7.94873475 L1.28750312,3.22898475 C1.09948665,3.03401731 0.821062609,2.9558253 0.559243507,3.02446188 C0.297424405,3.09309846 0.0929553881,3.29788218 0.0244242856,3.56010425 C-0.044106817,3.82232633 0.0339650303,4.10117889 0.228632851,4.28948475 Z",
            id: "Shape",
            fill: "#767676",
            fillRule: "nonzero"
        }), n.createElement("polygon", {
            id: "Shape",
            points: "12 12 0 12 0 0 12 0"
        }))))), t.quizIcon = n.createElement("svg", {
            width: "20",
            height: "19",
            viewBox: "0 0 20 19",
            fill: "none"
        }, n.createElement("path", {
            d: "M6.61626 0.616257L3.12501 4.10751L2.13376 3.11626C1.64501 2.62751 0.853757 2.62751 0.366257 3.11626C-0.122493 3.60501 -0.122493 4.39626 0.366257 4.88376L2.24126 6.75876C2.47376 6.99126 2.79626 7.12501 3.12501 7.12501C3.45376 7.12501 3.77626 6.99126 4.00876 6.75876L8.38376 2.38376C8.87251 1.89501 8.87251 1.10376 8.38376 0.616257C7.89626 0.127507 7.10376 0.127507 6.61626 0.616257Z",
            fill: "#00809D"
        }), n.createElement("path", {
            d: "M7.13376 11.8663C6.64501 11.3775 5.85376 11.3775 5.36626 11.8663L3.75001 13.4825L2.13376 11.8663C1.64501 11.3775 0.853757 11.3775 0.366257 11.8663C-0.122493 12.355 -0.122493 13.1463 0.366257 13.6338L1.98251 15.25L0.366257 16.8663C-0.122493 17.355 -0.122493 18.1463 0.366257 18.6338C0.855007 19.1213 1.64626 19.1225 2.13376 18.6338L3.75001 17.0175L5.36626 18.6338C5.85501 19.1225 6.64626 19.1225 7.13376 18.6338C7.62251 18.145 7.62251 17.3538 7.13376 16.8663L5.51751 15.25L7.13376 13.6338C7.62251 13.1463 7.62251 12.3538 7.13376 11.8663Z",
            fill: "#00809D"
        }), n.createElement("path", {
            d: "M13.75 6.5H17.5C18.8812 6.5 20 5.38125 20 4C20 2.61875 18.8812 1.5 17.5 1.5H13.75C12.3687 1.5 11.25 2.61875 11.25 4C11.25 5.38125 12.3687 6.5 13.75 6.5Z",
            fill: "#00809D"
        }), n.createElement("path", {
            d: "M17.5 12.75H13.75C12.3687 12.75 11.25 13.8687 11.25 15.25C11.25 16.6312 12.3687 17.75 13.75 17.75H17.5C18.8812 17.75 20 16.6312 20 15.25C20 13.8687 18.8812 12.75 17.5 12.75Z",
            fill: "#00809D"
        })), t.bingBotHead = n.createElement("svg", {
            width: "28",
            height: "28",
            viewBox: "0 0 28 28",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
        }, n.createElement("rect", {
            width: "28",
            height: "28",
            rx: "14",
            fill: "#00809D"
        }), n.createElement("path", {
            d: "M11 15H12.5V13.5H11V15ZM15.5 15H17V13.5H15.5V15ZM20 12.75V11.5C20 10.65 19.35 10 18.5 10H14.5V8.9C14.95 8.7 15.25 8.25 15.25 7.75C15.25 7.05 14.7 6.5 14 6.5C13.3 6.5 12.75 7.05 12.75 7.75C12.75 8.25 13.05 8.7 13.5 8.9V10H9.5C8.65 10 8 10.65 8 11.5V12.75C7.3 12.85 6.75 13.5 6.75 14.25C6.75 15 7.3 15.6 8 15.75V17C8 17.85 8.65 18.5 9.5 18.5H10.5V21.25L15.75 18.5H18.5C19.35 18.5 20 17.85 20 17V15.75C20.7 15.65 21.25 15 21.25 14.25C21.25 13.5 20.7 12.9 20 12.75ZM19 17C19 17.3 18.8 17.5 18.5 17.5H15.5L15.3 17.6L11.5 19.6V17.5H9.5C9.2 17.5 9 17.3 9 17V11.5C9 11.2 9.2 11 9.5 11H18.5C18.8 11 19 11.2 19 11.5V17Z",
            fill: "white"
        })), t.minimize = n.createElement("svg", {
            width: "12",
            height: "12",
            viewBox: "0 0 12 12",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
        }, n.createElement("path", {
            d: "M11.1429 5H0.857143C0.384 5 0 5.448 0 6C0 6.552 0.384 7 0.857143 7H11.1429C11.616 7 12 6.552 12 6C12 5.448 11.616 5 11.1429 5Z",
            fill: "#767676"
        })), t.BotHeadForTray = function(e) {
            return n.createElement("svg", {
                width: "20",
                height: "20",
                viewBox: "0 0 20 20",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg"
            }, n.createElement("path", {
                d: "M6.25 11.25H8.125V9.375H6.25V11.25ZM11.875 11.25H13.75V9.375H11.875V11.25ZM17.5 8.4375V6.875C17.5 5.8125 16.6875 5 15.625 5H10.625V3.625C11.1875 3.375 11.5625 2.8125 11.5625 2.1875C11.5625 1.3125 10.875 0.625 10 0.625C9.125 0.625 8.4375 1.3125 8.4375 2.1875C8.4375 2.8125 8.8125 3.375 9.375 3.625V5H4.375C3.3125 5 2.5 5.8125 2.5 6.875V8.4375C1.625 8.5625 0.9375 9.375 0.9375 10.3125C0.9375 11.25 1.625 12 2.5 12.1875V13.75C2.5 14.8125 3.3125 15.625 4.375 15.625H5.625V19.0625L12.1875 15.625H15.625C16.6875 15.625 17.5 14.8125 17.5 13.75V12.1875C18.375 12.0625 19.0625 11.25 19.0625 10.3125C19.0625 9.375 18.375 8.625 17.5 8.4375ZM16.25 13.75C16.25 14.125 16 14.375 15.625 14.375H11.875L11.625 14.5L6.875 17V14.375H4.375C4 14.375 3.75 14.125 3.75 13.75V6.875C3.75 6.5 4 6.25 4.375 6.25H15.625C16 6.25 16.25 6.5 16.25 6.875V13.75Z",
                fill: e ? "#00809D" : "#FFF"
            }))
        }, t.send = n.createElement("svg", {
            width: "16",
            height: "17",
            viewBox: "0 0 16 17",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
        }, n.createElement("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M1.44468 1.07927L15.4491 8.07981C16.1836 8.447 16.1836 9.49501 15.4491 9.86221L1.44468 16.8627C0.650517 17.2597 -0.227285 16.4986 0.0534935 15.6565L1.68634 10.7591L10.5352 9.49497C11.1076 9.41321 11.1076 8.58679 10.5352 8.50503L1.70664 7.24381L0.0534927 2.28555C-0.227286 1.44342 0.65052 0.682282 1.44468 1.07927Z",
            fill: "#444444"
        }))
    },
    "https://www.bing.com/covid/components/InlineChart.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(e) {
                for (var t, a = 1, n = arguments.length; a < n; a++)
                    for (var i in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }).apply(this, arguments)
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = a("https://www.bing.com/node_modules/react/index.js"),
            r = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/components/shared/InfoChart.tsx"),
            d = a("https://www.bing.com/covid/components/shared/Modal.tsx"),
            u = a("https://www.bing.com/covid/instrumentation.ts"),
            c = a("https://www.bing.com/covid/components/Root.tsx"),
            f = a("https://www.bing.com/covid/components/shared/TopChart.tsx"),
            p = a("https://www.bing.com/covid/config.ts"),
            m = function(e) {
                var t = e.trends && e.trends[e.id] ? e.trends[e.id] : null;
                if (!t) return null;
                var a = i.useState(!1),
                    n = a[0],
                    r = a[1],
                    c = i.useCallback(function() {
                        r(!0), u.logInfo("graphExpand", {
                            id: e.id
                        })
                    }, []),
                    f = i.useCallback(function() {
                        r(!1), u.logInfo("graphCollapse", {
                            id: e.id
                        })
                    }, []);
                return i.createElement(i.Fragment, null, i.createElement("h4", {
                    className: "segmentTitle"
                }, o.trends()), i.createElement(s.default, {
                    height: 200,
                    data: t,
                    title: o.graphOverTime(),
                    expandCallback: !e.isMobile && c
                }), i.createElement(d.default, {
                    modalOpen: n,
                    duration: 200,
                    callback: r,
                    className: "graphModal"
                }, i.createElement("div", {
                    className: "expandedGraph"
                }, i.createElement(s.default, {
                    data: t,
                    title: e.areaName + " - " + o.graphOverTime(),
                    height: 340
                }), i.createElement("div", {
                    className: "closeFeedback",
                    onClick: f,
                    title: o.close()
                }, l.closeFeedback))))
            },
            v = function(e) {
                var t = "world" == e.id && e.trends && e.byId && e.byId.world.areas.slice().sort(c.sortByConfirmed).map(function(t) {
                    return {
                        id: t.id,
                        displayName: t.displayName,
                        data: e.trends && e.trends[t.id]
                    }
                });
                if (!t || t.length <= 0) return null;
                var a = i.useState(!1),
                    n = a[0],
                    r = a[1],
                    s = i.useCallback(function() {
                        r(!0), u.logInfo("graphExpand", {
                            id: "top"
                        })
                    }, []),
                    p = i.useCallback(function() {
                        r(!1), u.logInfo("graphCollapse", {
                            id: "top"
                        })
                    }, []);
                return i.createElement(i.Fragment, null, i.createElement(f.default, {
                    height: 240,
                    data: t,
                    title: o.topTrends(),
                    count: 3,
                    showFilter: !1,
                    expandCallback: !e.isMobile && s
                }), i.createElement(d.default, {
                    modalOpen: n,
                    duration: 200,
                    callback: r,
                    className: "graphModal"
                }, i.createElement("div", {
                    className: "expandedGraph"
                }, i.createElement(f.default, {
                    data: t,
                    title: o.topTrends(),
                    count: 10,
                    height: 480,
                    showFilter: !0
                }), i.createElement("div", {
                    className: "closeFeedback",
                    onClick: p,
                    title: o.close()
                }, l.closeFeedback))))
            };
        t.default = r.connect(function(e) {
            return {
                trends: e.trendsData,
                byId: e.byId
            }
        })(function(e) {
            return i.createElement(i.Fragment, null, i.createElement(m, n({}, e)), e.id === p.rootId && i.createElement(v, n({}, e)))
        })
    },
    "https://www.bing.com/covid/components/LoadData.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/node_modules/react/index.js"),
            o = a("https://www.bing.com/covid/redux/actions/data.ts"),
            l = a("https://www.bing.com/covid/redux/actions/graphData.ts"),
            s = a("https://www.bing.com/covid/redux/actions/helpfulResources.ts"),
            d = a("https://www.bing.com/covid/redux/actions/testingLocationsData.ts"),
            u = a("https://www.bing.com/covid/redux/actions/articleClustersData.ts"),
            c = a("https://www.bing.com/covid/redux/actions/mobilityData.ts"),
            f = a("https://www.bing.com/node_modules/react-redux/es/index.js");
        t.default = f.connect(null, {
            getData: o.default,
            graphData: l.graphData,
            helpfulResources: s.helpfulResources,
            testingLocationsData: d.testingLocationsData,
            articleClustersData: u.articleClustersData,
            mobilityData: c.mobilityData
        })(function(e) {
            return r.useEffect(function() {
                ! function(e) {
                    n(this, void 0, void 0, function() {
                        return i(this, function(t) {
                            switch (t.label) {
                                case 0:
                                    return [4, Promise.all([e.getData(), e.graphData()])];
                                case 1:
                                    return t.sent(), e.helpfulResources(), e.testingLocationsData(), e.articleClustersData(), e.mobilityData(), [2]
                            }
                        })
                    })
                }(e)
            }, []), null
        })
    },
    "https://www.bing.com/covid/components/Map.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/redux/actions/data.ts"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = a("https://www.bing.com/covid/components/Root.tsx"),
            s = a("https://www.bing.com/covid/components/BingMap.tsx"),
            d = a("https://www.bing.com/covid/config.ts"),
            u = window && window.loc && window.loc.lat && window.loc.long ? [window.loc.lat, window.loc.long, 0] : [47.60357, -122.32945, 0],
            c = ["unitedstates"];
        t.scaleMin = 0, t.scaleMax = 0, t.rangeMin = 5, t.rangeMax = 60, t.getCountyBubbleSizeDynamic = function(e, t, a, n, i) {
            return (e - t) / (a - t) * (i - n) + n
        }, t.getSqrtNumber = function(e) {
            return Math.ceil(Math.sqrt(e))
        };
        var f = function(e, a, n) {
            var i = e && e.areas ? e.areas.slice().sort(l.sortByConfirmed) : [],
                r = i.length > 0 ? i[0].totalConfirmed : 0,
                o = i.length > 0 ? i[i.length - 1].totalConfirmed : 0;
            t.scaleMin = t.getSqrtNumber(o), t.scaleMax = t.getSqrtNumber(r);
            var s = function(e) {
                return {
                    id: e.id || e.parentId,
                    center: [e.lat, e.long],
                    density: t.getCountyBubbleSizeDynamic(t.getSqrtNumber(e.totalConfirmed), t.scaleMin, t.scaleMax, t.rangeMin, t.rangeMax),
                    infoBoxData: e.displayName,
                    polygonAddHandler: {
                        type: "click",
                        callback: function() {
                            n(e.id, 1)
                        }
                    },
                    value0: e.totalConfirmed,
                    value1: e.totalConfirmed - e.totalRecovered - e.totalDeaths,
                    value2: e.totalRecovered,
                    value3: e.totalDeaths
                }
            };
            return (a ? Object.keys(a).filter(function(e) {
                return function(e) {
                    var t = 0 === e.areas.length,
                        a = e.parentId,
                        n = c.indexOf(a) > -1,
                        i = c.every(function(e) {
                            return a && a.indexOf("_" + e) > -1
                        });
                    return (t || n) && !i
                }(a[e])
            }).map(function(e) {
                return a[e]
            }) : []).map(function(e) {
                var t = s(e),
                    a = e.areas;
                return a && a.length > 0 && (t.areas = a.map(function(e) {
                    return s(e)
                })), t
            }).sort(function(e, t) {
                return e.density - t.density
            })
        };
        t.default = i.connect(function(e) {
            return {
                area: e.data,
                allAreas: e.byId,
                selectedInfo: e.selectedInfo
            }
        }, {
            areaSelected: r.areaSelected
        })(function(e) {
            if (!e.area || !e.allAreas || !e.areaSelected) return null;
            var t = n.useState(function() {
                    return f(e.area, e.allAreas, e.areaSelected)
                }),
                a = t[0],
                i = t[1],
                r = n.useState([e.allAreas[d.rootId].lat, e.allAreas[d.rootId].long]),
                l = r[0],
                p = r[1],
                m = n.useState(null),
                v = m[0],
                h = m[1];
            return n.useEffect(function() {
                i(f(e.area, e.allAreas, e.areaSelected))
            }, [e.allAreas]), n.useEffect(function() {
                var t = e.selectedInfo;
                if ([2, 3, 1, 4, 5, 6].indexOf(t.reason) > -1) {
                    var a = e && t && t.id,
                        n = a && e.allAreas[a],
                        i = n && n.parentId,
                        r = i === d.rootId ? 5 : 7;
                    c.every(function(e) {
                        return i && i.indexOf("_" + e) > -1
                    }) && (r = null);
                    var o = n && n.lat && n.long ? [n.lat, n.long, r] : u;
                    p(o), h(a)
                }
            }, [e.selectedInfo]), n.createElement("div", {
                className: "mapContainer"
            }, n.createElement(s.default, {
                center: l,
                regularPolygons: a,
                bingmapKey: "AnSks7WjXNsIw8qrhVyqxNPgbbJa1ucyxqfcx_8-hTDYIk4N37upKCsrtfwJ1xzy",
                selectedAreaId: v,
                lang: o.tryGetLocale(window.uiLang)
            }))
        })
    },
    "https://www.bing.com/covid/components/Mobile/MobileDropdown.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            r = a("https://www.bing.com/covid/components/AllRegions.tsx"),
            o = a("https://www.bing.com/covid/components/Icons.tsx"),
            l = a("https://www.bing.com/covid/config.ts");
        t.default = function(e) {
            var t = n.useState(0),
                a = t[0],
                s = t[1],
                d = n.useState(e.selectedInfo && e.selectedInfo.id ? e.selectedInfo.id : l.rootId),
                u = d[0],
                c = d[1],
                f = n.useCallback(function(t, a) {
                    return 4 === a ? (e.openDropdown(!1), e.areaSelected(t, a)) : (c(t), null)
                }, []),
                p = n.useCallback(function() {
                    e.areaSelected(u, 2), e.openDropdown(!1)
                }, [u]),
                m = n.useCallback(function() {
                    return s(0)
                }, []),
                v = n.useCallback(function() {
                    return s(1)
                }, []);
            return n.createElement("div", {
                className: "dropdown"
            }, n.createElement("div", {
                className: "pageTitle"
            }, n.createElement("div", null, i.selectARegion()), n.createElement("div", {
                onClick: function() {
                    return e.openDropdown(!1)
                }
            }, o.closeDropdown)), l.favoritesEnabled && n.createElement("div", {
                className: "dropdownVerts"
            }, n.createElement("div", {
                className: "dropdownVert " + (0 === a ? "selected" : ""),
                onClick: m
            }, i.browse()), n.createElement("div", {
                className: "dropdownVert " + (1 === a ? "selected" : ""),
                onClick: v
            }, i.favorites()), n.createElement("div", {
                className: "verticalIndicator",
                style: {
                    gridColumn: a + 1 + " / " + (a + 2)
                }
            })), 0 === a && n.createElement(n.Fragment, null, n.createElement("div", {
                className: "dropdownOptions"
            }, n.createElement(r.default, {
                areaSelected: f,
                byId: e.byId,
                selectedInfo: e.selectedInfo,
                isMobile: !0
            })), n.createElement("div", {
                className: "dropdownSubmit"
            }, n.createElement("div", {
                onClick: p
            }, i.submit()))))
        }
    },
    "https://www.bing.com/covid/components/Mobile/MobileInfoCard.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/helper.ts"),
            r = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            o = a("https://www.bing.com/covid/components/Icons.tsx"),
            l = a("https://www.bing.com/covid/components/shared/AreaButton.tsx"),
            s = a("https://www.bing.com/covid/components/Verticals/MobileVerticalSwipe.tsx"),
            d = a("https://www.bing.com/covid/config.ts");
        t.default = function(e) {
            if (!e.byId || !e.selectedArea || !e.selectedArea.id) return null;
            var t = r.globalStatus();
            return e.selectedArea.id !== d.rootId && (t = e.selectedArea.displayName, e.selectedArea.parentId && e.selectedArea.parentId !== d.rootId && e.byId[e.selectedArea.parentId] && (t += ", " + e.byId[e.selectedArea.parentId].displayName)), e.selectedArea ? n.createElement(n.Fragment, null, n.createElement("div", {
                className: "pullbar"
            }), n.createElement(l.default, {
                displayName: e.selectedArea.id === d.rootId ? r.globalStatus() : t,
                clickCallback: function() {
                    return e.openDropdown(!0)
                },
                secondaryInfo: n.createElement("div", {
                    className: "secondaryInfo"
                }, n.createElement("div", null, i.formatNumber(e.selectedArea.totalConfirmed)), o.expand)
            }), e.verticals && e.verticalClick && null !== e.verticalIndex && n.createElement(s.default, {
                verticals: e.verticals,
                verticalClick: e.verticalClick,
                verticalIndex: e.verticalIndex
            })) : null
        }
    },
    "https://www.bing.com/covid/components/Mobile/MobileMenu.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(e) {
                for (var t, a = 1, n = arguments.length; a < n; a++)
                    for (var i in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }).apply(this, arguments)
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = a("https://www.bing.com/node_modules/office-ui-fabric-react/lib/components/Button/IconButton/IconButton.js"),
            r = a("https://www.bing.com/node_modules/react/index.js"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = a("https://www.bing.com/covid/components/Header.tsx"),
            s = a("https://www.bing.com/covid/components/Icons.tsx"),
            d = a("https://www.bing.com/covid/components/shared/AnimatingComponent.tsx"),
            u = a("https://www.bing.com/covid/components/Root.tsx"),
            c = {
                height: 20,
                width: 20,
                color: "#444"
            };
        t.default = function(e) {
            var t = r.useCallback(function() {
                e.openMenu(!1), setTimeout(function() {
                    return e.openFeedback(!0)
                }, 200)
            }, []);
            return r.createElement(d.default, {
                duration: 200,
                isOpen: e.menuOpen
            }, r.createElement("div", {
                className: "mobileMenuPanel"
            }, r.createElement("div", {
                className: "overlay",
                onClick: function() {
                    return e.openMenu(!1)
                }
            }), r.createElement("div", {
                className: "mobileMenu"
            }, r.createElement(i.IconButton, {
                iconProps: {
                    iconName: "ChromeClose"
                },
                title: o.close(),
                ariaLabel: o.close(),
                className: "closeMenu",
                onClick: function() {
                    return e.openMenu(!1)
                }
            }), r.createElement("div", {
                className: "menuOptions"
            }, r.createElement("div", {
                className: "menuOption",
                onClick: t,
                id: u.feedbackId
            }, r.createElement(s.FeedbackIcon, n({}, c)), r.createElement("div", null, o.feedback())), r.createElement(l.Info, {
                title: o.dataInfo(),
                className: "info menuOption",
                iconProps: c
            }), r.createElement("div", {
                className: "mobileMapCR"
            }, o.map(), " © ", (new Date).getFullYear(), " HERE, © ", (new Date).getFullYear(), " Microsoft Corporation ", r.createElement("a", {
                href: "https://www.microsoft.com/en-us/maps/product/terms-april-2011",
                target: "_blank"
            }, "Terms"))))))
        }
    },
    "https://www.bing.com/covid/components/MobileUpsell.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            r = a("https://www.bing.com/covid/components/Icons.tsx"),
            o = a("https://www.bing.com/covid/components/shared/Modal.tsx"),
            l = a("https://www.bing.com/covid/instrumentation.ts"),
            s = function() {
                l.logInfo("opalUpsell", {
                    action: "downloadClicked",
                    platform: "mobile"
                }), window.open("https://bing.app.link/48iIQRrp14", "_blank")
            };
        t.default = function(e) {
            return n.createElement(o.default, {
                callback: e.openUpsellModal,
                duration: 200,
                modalOpen: e.isOpen
            }, n.createElement("div", {
                className: "upsellContainer"
            }, n.createElement("div", {
                className: "floatingUpsellContent upsellModal"
            }, n.createElement("div", {
                className: "upsellContent"
            }, r.opalLogo, n.createElement("div", {
                className: "contentText"
            }, n.createElement("div", {
                className: "title"
            }, i.upsellTitle()), n.createElement("div", {
                className: "description"
            }, i.upsellDesc()))), n.createElement("div", {
                className: "downloadButton",
                onClick: s
            }, i.upsellCTA())), n.createElement("div", {
                className: "closeFeedback",
                title: i.close(),
                onClick: function() {
                    return e.openUpsellModal(!1)
                }
            }, r.closeFeedback)))
        }
    },
    "https://www.bing.com/covid/components/NewsPanel.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/instrumentation.ts"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = function(e, t, a) {
                void 0 === a && (a = "article"), r.logInfo("newsClick", {
                    regionId: e,
                    url: t,
                    elementType: a
                })
            };
        t.default = i.connect(function(e) {
            return {
                newsResponse: e.newsData
            }
        })(function(e) {
            if (!e.newsResponse || !e.newsResponse || 0 === e.newsResponse.value.length) return null;
            var t = null;
            return e.newsResponse.msnPage && e.newsResponse.msnPage.trim() ? t = e.newsResponse.msnPage : e.newsResponse.queryContext && e.newsResponse.queryContext.originalQuery && e.newsResponse.queryContext.originalQuery.trim() && (t = function(e) {
                return "https://www.bing.com/news/search?q=" + encodeURIComponent(e)
            }(e.newsResponse.queryContext.originalQuery)), n.createElement(n.Fragment, null, n.createElement("h4", {
                className: "segmentTitle"
            }, o.news()), e.newsResponse.value && e.newsResponse.value.map(function(t) {
                var a = !!(t.image && t.image.thumbnail && t.image.thumbnail.contentUrl),
                    i = a ? "infoContainer" : "infoNoImage",
                    r = !(!t.provider || !t.provider[0]);
                return n.createElement("a", {
                    key: t.url,
                    href: t.url,
                    target: "_blank",
                    className: "apiContentLink newsCard",
                    onClick: function() {
                        return l(e.selectedId, t.url)
                    }
                }, a && n.createElement("img", {
                    className: "newsImage",
                    height: "76px",
                    width: "76px",
                    src: t.image.thumbnail.contentUrl
                }), n.createElement("div", {
                    className: i
                }, n.createElement("div", {
                    className: "title"
                }, t.name), n.createElement("div", {
                    className: "provider"
                }, r && t.provider[0].image && t.provider[0].image.thumbnail && t.provider[0].image.thumbnail.contentUrl && n.createElement("img", {
                    className: "newsProviderThumbnail",
                    height: 14,
                    width: 14,
                    src: t.provider[0].image.thumbnail.contentUrl
                }), r && t.provider[0].name && n.createElement("div", {
                    className: "providerName"
                }, t.provider[0].name), n.createElement("div", {
                    className: "publishedTime"
                }, t.timeDiff))))
            }), !!t && n.createElement("a", {
                href: t,
                target: "_blank",
                className: "apiContentLink seeMoreContainer",
                onClick: function() {
                    return l(e.selectedId, t, "moreButton")
                }
            }, n.createElement("div", {
                className: "seeMoreButton"
            }, o.moreNews())))
        })
    },
    "https://www.bing.com/covid/components/QuizModal.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            r = a("https://www.bing.com/covid/components/Icons.tsx"),
            o = a("https://www.bing.com/covid/components/shared/Modal.tsx"),
            l = a("https://www.bing.com/covid/config.ts");
        t.default = function(e) {
            var t = "https://www.bing.com/bingqa/weeklyQuiz?q=coronavirus+quiz&mkt=" + l.market.toLowerCase();
            return n.createElement(o.default, {
                callback: e.openModal,
                duration: 200,
                modalOpen: e.isOpen
            }, n.createElement("div", {
                className: "quizContainer"
            }, n.createElement("div", {
                className: "feedbackModal"
            }, n.createElement("iframe", {
                src: t,
                width: "100%",
                height: "100%",
                scrolling: "no"
            }), n.createElement("div", {
                className: "closeFeedback",
                title: i.close(),
                onClick: function() {
                    return e.openModal(!1)
                }
            }, r.closeFeedback))))
        }
    },
    "https://www.bing.com/covid/components/QuizPanel.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/instrumentation.ts"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/components/QuizModal.tsx"),
            d = a("https://www.bing.com/covid/config.ts"),
            u = a("https://www.bing.com/covid/quizClicks.ts");
        t.default = i.connect(function(e) {
            return {
                selectedInfo: e.selectedInfo
            }
        })(function(e) {
            var t = e.selectedInfo && e.selectedInfo.id || "world";
            if (!d.locale || !d.locale.toLowerCase().startsWith("en") || "world" != t) return null;
            var a = n.useState(!1),
                i = a[0],
                c = a[1];
            return n.createElement(n.Fragment, null, n.createElement("h4", {
                className: "segmentTitle quizTitle"
            }, o.quizTitle()), n.createElement("div", {
                className: "quizCard infoTile"
            }, n.createElement("div", {
                className: "quizDescription"
            }, n.createElement("div", {
                className: "quizIconStyle"
            }, l.quizIcon), n.createElement("div", null, n.createElement("div", {
                className: "quizTitle"
            }, o.quizTitleCorona()), n.createElement("div", {
                className: "quizSource"
            }, o.quizTitleDebunk()))), n.createElement("div", {
                className: "quizTakeQuizPart",
                onClick: function() {
                    r.logInfo("QuizClicked", {
                        action: i ? "closeDialog" : "openDialog"
                    }), i || u.addToQuizClicks(), c(!i)
                }
            }, n.createElement("span", {
                className: "takeQuizStyle"
            }, o.quizTaketheQuiz()), n.createElement("span", {
                className: "chevronRightStyle"
            }, l.chevronDown))), n.createElement(s.default, {
                isOpen: i,
                openModal: c,
                isMobile: e.isMobile
            }))
        })
    },
    "https://www.bing.com/covid/components/Root.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(e) {
                for (var t, a = 1, n = arguments.length; a < n; a++)
                    for (var i in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }).apply(this, arguments)
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = a("https://www.bing.com/node_modules/react/index.js"),
            r = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            o = a("https://www.bing.com/covid/helper.ts"),
            l = a("https://www.bing.com/covid/instrumentation.ts"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/redux/actions/data.ts"),
            u = a("https://www.bing.com/covid/components/Feedback.tsx"),
            c = a("https://www.bing.com/covid/components/Header.tsx"),
            f = a("https://www.bing.com/covid/components/LoadData.tsx"),
            p = a("https://www.bing.com/covid/components/Map.tsx"),
            m = a("https://www.bing.com/covid/components/Mobile/MobileDropdown.tsx"),
            v = a("https://www.bing.com/covid/components/Mobile/MobileInfoCard.tsx"),
            h = a("https://www.bing.com/covid/components/Mobile/MobileMenu.tsx"),
            g = a("https://www.bing.com/covid/components/MobileUpsell.tsx"),
            b = a("https://www.bing.com/covid/components/shared/AnimatingComponent.tsx"),
            k = a("https://www.bing.com/covid/components/shared/ErrorBoundary.tsx"),
            y = a("https://www.bing.com/covid/components/ShareModal.tsx"),
            C = a("https://www.bing.com/covid/components/Sidebar.tsx"),
            w = a("https://www.bing.com/covid/components/Verticals/Graphs.tsx"),
            x = a("https://www.bing.com/covid/components/Verticals/MobileOverview.tsx"),
            T = a("https://www.bing.com/covid/components/Verticals/Overview.tsx");
        a("https://www.bing.com/covid/styles/upsells.css");
        var z = a("https://www.bing.com/covid/components/Verticals/MobileGraphs.tsx"),
            S = a("https://www.bing.com/covid/config.ts"),
            I = a("https://www.bing.com/covid/location.ts"),
            A = a("https://www.bing.com/covid/localStorage.ts");
        t.feedbackId = "covidFeedback";
        t.sortByConfirmed = function(e, t) {
            return t.totalConfirmed - e.totalConfirmed
        }, t.sortAlphabetically = function(e, t) {
            return e.displayName.trim() > t.displayName.trim() ? 1 : -1
        };
        t.default = r.connect(function(e) {
            return {
                allData: e.data,
                byId: e.byId,
                selectedInfo: e.selectedInfo,
                width: e.width,
                height: e.height,
                panelsHidden: e.panelsHidden
            }
        }, {
            areaSelected: d.areaSelected,
            getNews: d.getNews
        })(function(e) {
            var t = i.useState(e.width < 800),
                a = t[0],
                r = t[1],
                l = i.useState(function() {
                    var e = 0,
                        t = o.getParamsFromURL(window.location.href).vert;
                    if ("string" == typeof t) {
                        var a = j.findIndex(function(e) {
                            return e.key === t
                        });
                        a > 0 && (e = a)
                    }
                    return e
                }),
                s = l[0],
                d = l[1],
                u = i.useState(!1),
                c = u[0],
                p = u[1];
            i.useEffect(function() {
                return r(e.width < 800)
            }, [e.width]);
            var m = i.useCallback(function(e) {
                return D(e, d)
            }, []);
            return i.useEffect(function() {
                window.location && window.location.href && window.location.href.indexOf("showCountryData=1") > -1 && !c && e.byId && S.userCoordinates && I.getNearestToLocation(S.userCoordinates.lat, S.userCoordinates.long, e.byId, function(t) {
                    for (var a = e.byId[t.id].parentId, n = t.id; a && "world" !== a;) n = a, a = e.byId[n].parentId;
                    p(!0), e.areaSelected(n, 6)
                })
            }, [e.byId]), i.useEffect(function() {
                var e = A.readFromLocalStorage(A.LocalStorageKeys.SessionCount) || 0;
                A.writeToLocalStorage(A.LocalStorageKeys.SessionCount, ++e)
            }, []), i.createElement(k.default, {
                errorArea: "root"
            }, i.createElement(k.default, {
                errorArea: "loadData"
            }, i.createElement(f.default, null)), i.createElement("div", {
                className: a ? "mobile" : "desktop"
            }, a ? i.createElement(M, n({}, e, {
                verticalClick: m,
                verticalIndex: s
            })) : i.createElement(E, n({}, e, {
                verticalClick: m,
                verticalIndex: s
            })), i.createElement("div", {
                id: "portal"
            })))
        });
        var D = function(e, t) {
                0 === e ? window.history.replaceState(null, null, o.removeURLParam(window.location.href, "vert")) : window.history.replaceState(null, null, o.setURLParam(window.location.href, "vert", j[e].key)), t(e)
            },
            M = function(e) {
                var t, a = e.selectedInfo && e.selectedInfo.id || "world",
                    r = e.height - 276 + 30,
                    d = r - 30,
                    f = i.createRef(),
                    C = i.useState(!1),
                    w = C[0],
                    x = C[1],
                    T = i.useState(!1),
                    z = T[0],
                    S = T[1],
                    I = i.useState(!1),
                    A = I[0],
                    D = I[1],
                    M = i.useState(!1),
                    E = M[0],
                    P = M[1],
                    B = i.useState(!1),
                    F = B[0],
                    L = B[1];
                j[e.verticalIndex] && (t = j[e.verticalIndex].mobileView || j[e.verticalIndex].view);
                return i.createElement("div", {
                    className: "content",
                    style: w ? {
                        overflow: "hidden"
                    } : {},
                    ref: f
                }, i.createElement(k.default, {
                    errorArea: "mobileHeader"
                }, i.createElement(c.default, {
                    openFeedback: D,
                    titleInBar: !0,
                    onShareClick: function() {
                        l.logInfo("shareFloat", {
                            action: E ? "closeDialog" : "openDialog"
                        }), o.nativeShare(function() {
                            return P(!E)
                        })
                    },
                    isMobile: !0
                })), i.createElement(k.default, {
                    errorArea: "mobileMenu"
                }, i.createElement(h.default, {
                    menuOpen: z,
                    openMenu: S,
                    feedbackOpen: A,
                    openFeedback: D
                })), i.createElement(k.default, {
                    errorArea: "mobileFeedback"
                }, i.createElement(u.default, {
                    openFeedback: D,
                    feedbackOpen: A
                })), i.createElement("div", {
                    className: "map",
                    style: {
                        height: r
                    }
                }, i.createElement(k.default, {
                    errorArea: "mobileMap"
                }, i.createElement(p.default, null))), i.createElement(k.default, {
                    errorArea: "mobileShareModal"
                }, i.createElement(y.default, {
                    isOpen: E,
                    openModal: P,
                    isMobile: !0
                })), !o.isOpal() && i.createElement(k.default, {
                    errorArea: "mobileUpsell"
                }, i.createElement("div", {
                    className: "floatingUpsell",
                    onClick: function() {
                        return L(!0)
                    },
                    style: {
                        bottom: 286
                    }
                }, s.upsellBubbleTitle()), i.createElement(g.default, {
                    isOpen: F,
                    openUpsellModal: L
                })), i.createElement("div", {
                    className: "information",
                    style: {
                        marginTop: d,
                        position: w ? "fixed" : "absolute",
                        minHeight: 276
                    }
                }, i.createElement(k.default, {
                    errorArea: "mobileInfoCard"
                }, e.byId && i.createElement(v.default, {
                    width: e.width,
                    selectedArea: e.byId[a],
                    openDropdown: x,
                    byId: e.byId,
                    verticals: j,
                    verticalIndex: e.verticalIndex,
                    verticalClick: e.verticalClick
                })), i.createElement(t, null)), i.createElement(k.default, {
                    errorArea: "mobileDropdown"
                }, i.createElement(b.default, {
                    isOpen: w,
                    duration: 300
                }, i.createElement(m.default, n({}, e, {
                    openDropdown: x
                })))))
            },
            E = function(e) {
                var t = i.useState(!1),
                    a = t[0],
                    r = t[1],
                    o = j[e.verticalIndex] ? j[e.verticalIndex].view : T.default;
                return i.createElement("div", {
                    className: "wholePage"
                }, i.createElement(k.default, {
                    errorArea: "desktopHeader"
                }, i.createElement(c.default, {
                    openFeedback: r,
                    titleInBar: !0
                })), i.createElement(k.default, {
                    errorArea: "desktopFeedback"
                }, i.createElement(u.default, {
                    openFeedback: r,
                    feedbackOpen: a
                })), i.createElement("div", {
                    className: "content"
                }, e.byId && i.createElement(C.default, n({}, e)), i.createElement("div", {
                    className: "verticalWrapper"
                }, i.createElement("div", {
                    className: "verticalHeader"
                }, i.createElement("h2", {
                    className: "locationTitle"
                }, e.byId ? e.byId[e.selectedInfo.id].displayName : ""), j.length > 1 && i.createElement("div", {
                    className: "verticalOptions",
                    style: {
                        gridTemplateColumns: "repeat(" + j.length + ", min-content)"
                    }
                }, j.map(function(t, a) {
                    return i.createElement("div", {
                        className: "verticalOption " + (e.verticalIndex === a ? "selected" : ""),
                        key: t.key,
                        onClick: function() {
                            return e.verticalClick(a)
                        }
                    }, t.title())
                }), i.createElement("div", {
                    className: "verticalIndicator",
                    style: {
                        gridColumn: e.verticalIndex + 1 + " / " + (e.verticalIndex + 2)
                    }
                }))), i.createElement(k.default, {
                    errorArea: "vertical:" + (j[e.verticalIndex] ? j[e.verticalIndex].key : "overview")
                }, i.createElement("div", {
                    className: "verticalContent"
                }, i.createElement(o, null))))))
            },
            j = [{
                key: "overview",
                title: s.overviewVertical,
                view: T.default,
                mobileView: x.default
            }, {
                key: "graph",
                title: s.graphstrends,
                view: w.default,
                mobileView: z.default
            }]
    },
    "https://www.bing.com/covid/components/SegmentPanel.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/helper.ts"),
            o = a("https://www.bing.com/covid/components/HelpfulResources.tsx"),
            l = a("https://www.bing.com/covid/components/InlineChart.tsx"),
            s = a("https://www.bing.com/covid/components/NewsPanel.tsx"),
            d = a("https://www.bing.com/covid/components/shared/ErrorBoundary.tsx"),
            u = a("https://www.bing.com/covid/components/VideosPanel.tsx"),
            c = a("https://www.bing.com/covid/components/TestingLocationsPanel.tsx"),
            f = a("https://www.bing.com/covid/components/TopicClusterPanel.tsx"),
            p = a("https://www.bing.com/covid/components/QuizPanel.tsx"),
            m = a("https://www.bing.com/covid/quizClicks.ts");
        t.default = i.connect(function(e) {
            return {
                selectedInfo: e.selectedInfo
            }
        })(function(e) {
            var t = e.selectedInfo && e.selectedInfo.id || "world",
                a = n.createRef(),
                i = n.useState(r.isNewsAndVideosEnabled())[0];
            return n.useEffect(function() {
                a && a.current && a.current.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: "smooth"
                })
            }, [e.selectedInfo]), n.createElement("div", {
                className: "segmentPanel",
                key: t,
                ref: a
            }, n.createElement(d.default, {
                errorArea: "trends"
            }, n.createElement(l.default, {
                isMobile: e.isMobile,
                areaName: e.areaName,
                id: e.selectedInfo.id
            })), n.createElement(d.default, {
                errorArea: "testingLocations"
            }, n.createElement(c.default, null)), !m.getQuizClicks() && n.createElement(d.default, {
                errorArea: "quiz"
            }, n.createElement(p.default, {
                isMobile: e.isMobile
            })), n.createElement(d.default, {
                errorArea: "helpfulResources"
            }, n.createElement(o.default, null)), n.createElement(d.default, {
                errorArea: "news"
            }, i && n.createElement(s.default, {
                selectedId: t
            })), n.createElement(d.default, {
                errorArea: "topicClusters"
            }, n.createElement(f.default, null)), n.createElement(d.default, {
                errorArea: "videos"
            }, i && n.createElement(u.default, {
                selectedId: t
            })), m.getQuizClicks() && m.getQuizClicks() && n.createElement(d.default, {
                errorArea: "quizBottom"
            }, n.createElement(p.default, {
                isMobile: e.isMobile
            })))
        })
    },
    "https://www.bing.com/covid/components/ShareModal.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__assign || function() {
                return (n = Object.assign || function(e) {
                    for (var t, a = 1, n = arguments.length; a < n; a++)
                        for (var i in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                    return e
                }).apply(this, arguments)
            },
            i = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            r = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            },
            o = this;
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var l = a("https://www.bing.com/node_modules/react/index.js"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/components/Icons.tsx"),
            u = a("https://www.bing.com/covid/components/shared/Modal.tsx"),
            c = a("https://www.bing.com/covid/instrumentation.ts"),
            f = a("https://www.bing.com/node_modules/react-share/lib/FacebookShareButton.js"),
            p = a("https://www.bing.com/node_modules/react-share/lib/FacebookIcon.js"),
            m = a("https://www.bing.com/node_modules/react-share/lib/LinkedinShareButton.js"),
            v = a("https://www.bing.com/node_modules/react-share/lib/LinkedinIcon.js"),
            h = a("https://www.bing.com/node_modules/react-share/lib/RedditShareButton.js"),
            g = a("https://www.bing.com/node_modules/react-share/lib/RedditIcon.js"),
            b = a("https://www.bing.com/node_modules/react-share/lib/TwitterShareButton.js"),
            k = a("https://www.bing.com/node_modules/react-share/lib/TwitterIcon.js"),
            y = a("https://www.bing.com/node_modules/react-share/lib/WhatsappShareButton.js"),
            C = a("https://www.bing.com/node_modules/react-share/lib/WhatsappIcon.js"),
            w = a("https://www.bing.com/node_modules/react-share/lib/EmailShareButton.js"),
            x = a("https://www.bing.com/node_modules/react-share/lib/EmailIcon.js"),
            T = a("https://www.bing.com/node_modules/react-share/lib/ViberShareButton.js"),
            z = a("https://www.bing.com/node_modules/react-share/lib/ViberIcon.js"),
            S = a("https://www.bing.com/node_modules/office-ui-fabric-react/lib/Button.js"),
            I = a("https://www.bing.com/covid/helper.ts"),
            A = function(e) {
                c.logInfo("shareItemClicked", {
                    itemType: e
                })
            },
            D = function() {
                return i(o, void 0, void 0, function() {
                    var e;
                    return r(this, function(t) {
                        switch (t.label) {
                            case 0:
                                return A("copyLink"), e = I.nativeShare, [4, I.copyToClipBoard(location.href)];
                            case 1:
                                return e.apply(void 0, [t.sent()]), [2]
                        }
                    })
                })
            };
        t.default = function(e) {
            var t = s.latestUpdates(),
                a = "https://www.bing.com/covid",
                i = {
                    quote: t,
                    url: a,
                    className: "shareButton"
                },
                r = {
                    title: t,
                    url: a,
                    className: "shareButton"
                },
                o = "zh-cn" === window.mkt.toLowerCase();
            return l.createElement(u.default, {
                callback: e.openModal,
                duration: 200,
                modalOpen: e.isOpen
            }, l.createElement("div", {
                className: e.isMobile ? "mobileShareContainer" : "shareContainer"
            }, l.createElement("img", {
                className: "shareImage",
                src: "/covid/static/images/covidog.jpg"
            }), l.createElement("div", {
                className: "shareLinks"
            }, l.createElement("div", {
                className: "title"
            }, s.share()), !o && l.createElement("div", {
                className: "shareItem",
                onClick: function() {
                    return A("facebook")
                }
            }, l.createElement(f.default, n({}, i), l.createElement(p.default, {
                size: 32
            }), l.createElement("div", {
                className: "shareText"
            }, s.facebook()))), l.createElement("div", {
                className: "shareItem",
                onClick: function() {
                    return A("linkedin")
                }
            }, l.createElement(m.default, n({}, r), l.createElement(v.default, {
                size: 32
            }), l.createElement("div", {
                className: "shareText"
            }, s.linkedin()))), !o && l.createElement("div", {
                className: "shareItem",
                onClick: function() {
                    return A("twitter")
                }
            }, l.createElement(b.default, n({}, r), l.createElement(k.default, {
                size: 32
            }), l.createElement("div", {
                className: "shareText"
            }, s.twitter()))), l.createElement("div", {
                className: "shareItem",
                onClick: function() {
                    return D()
                }
            }, l.createElement("div", null, l.createElement(S.IconButton, {
                styles: {
                    root: {
                        backgroundColor: "#ECECEC",
                        height: "32px",
                        width: "32px",
                        marginTop: "4px"
                    }
                },
                iconProps: {
                    iconName: "Link12",
                    style: {
                        fontSize: 16
                    }
                }
            })), l.createElement("div", {
                className: "shareText",
                onClick: function() {
                    return D()
                }
            }, s.copyLink())), !o && l.createElement("div", {
                className: "shareItem",
                onClick: function() {
                    return A("whatsapp")
                }
            }, l.createElement(y.default, n({}, r), l.createElement(C.default, {
                size: 32
            }), l.createElement("div", {
                className: "shareText"
            }, s.whatsapp()))), !o && l.createElement("div", {
                className: "shareItem",
                onClick: function() {
                    return A("reddit")
                }
            }, l.createElement(h.default, n({}, r), l.createElement(g.default, {
                size: 32
            }), l.createElement("div", {
                className: "shareText"
            }, s.reddit()))), l.createElement("div", {
                className: "shareItem",
                onClick: function() {
                    return A("email")
                }
            }, l.createElement(w.default, n({}, r), l.createElement(x.default, {
                size: 32
            }), l.createElement("div", {
                className: "shareText"
            }, s.email()))), !o && l.createElement("div", {
                className: "shareItem",
                onClick: function() {
                    return A("viber")
                }
            }, l.createElement(T.default, n({}, r), l.createElement(z.default, {
                size: 32
            }), l.createElement("div", {
                className: "shareText"
            }, s.viber())))), e.isMobile ? l.createElement("div", {
                className: "shareCancel",
                onClick: function() {
                    return e.openModal(!1)
                }
            }, s.cancel()) : l.createElement("div", {
                className: "closeFeedback",
                title: s.close(),
                onClick: function() {
                    return e.openModal(!1)
                }
            }, d.closeFeedback)))
        }
    },
    "https://www.bing.com/covid/components/Sidebar.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/components/AllRegions.tsx"),
            r = a("https://www.bing.com/covid/components/shared/ErrorBoundary.tsx"),
            o = a("https://www.bing.com/covid/components/shared/InfoTile.tsx");
        t.default = function(e) {
            return n.createElement("div", {
                className: "country tab",
                role: "Region",
                "aria-label": "country list"
            }, n.createElement(r.default, {
                errorArea: "Country"
            }, n.createElement(o.default, {
                showTotal: !0,
                area: e.allData,
                width: 272,
                hideBar: !0,
                showLastestUpdateAtTop: !0
            }), n.createElement(i.default, {
                selectedInfo: e.selectedInfo,
                byId: e.byId,
                areaSelected: e.areaSelected
            })))
        }
    },
    "https://www.bing.com/covid/components/TestingLocationsPanel.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/instrumentation.ts"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = a("https://www.bing.com/covid/components/Icons.tsx");
        a("https://www.bing.com/covid/styles/testingLocations.css");
        var s = function(e, t, a, n) {
            "Range" == window.getSelection().type ? (e.preventDefault(), e.stopPropagation()) : (r.logInfo("testingLocationClick", {
                id: t,
                url: a,
                elementType: n
            }), window.open(a, "_blank"))
        };
        t.default = i.connect(function(e) {
            return {
                selectedInfo: e.selectedInfo,
                testingLocationsResponse: e.testingLocationsData
            }
        })(function(e) {
            var t = e.selectedInfo && e.selectedInfo.id,
                a = e.testingLocationsResponse,
                i = a && t && a[t];
            if (!i || 1 != i.LocationLevel) return null;
            var d = n.useState(!1),
                u = d[0],
                c = d[1],
                f = i.BasicInfo,
                p = f && f.Sources && f.Sources.length && f.Sources[0],
                m = i.TestingLocations,
                v = m && m.length,
                h = v ? u ? "" + o.seeLess() : "" + o.moreTestingLocations(m.length.toString()) : null;
            return n.createElement(n.Fragment, null, n.createElement("h4", {
                className: "segmentTitle"
            }, o.testingProcess()), p && n.createElement("div", {
                className: v ? "tlocCard newsCard" : "tlocCard newsCard nolist",
                onClick: function(e) {
                    return s(e, t, p.Link, "process")
                }
            }, n.createElement("div", {
                className: "headerRow"
            }, l.testingInfoIcon, o.testingInfoHeader()), n.createElement("div", {
                className: "sepRow"
            }), f.Protocol && n.createElement("div", null, n.createElement("div", {
                className: "labelRow"
            }, o.testingProcessProtocol()), n.createElement("div", {
                className: "factRow"
            }, " ", i.BasicInfo.Protocol)), f.Hotline && n.createElement("div", null, n.createElement("div", {
                className: "labelRow"
            }, o.hotline()), n.createElement("div", {
                className: "factRow"
            }, " ", i.BasicInfo.Hotline)), f.PartnerCompanies && f.PartnerCompanies.length && n.createElement("div", null, n.createElement("div", {
                className: "lableRow"
            }, o.partnerCompanies()), n.createElement("div", {
                className: "factRow"
            }, f.PartnerCompanies[0])), f.MetaData && f.MetaData.map(function(e, t) {
                return n.createElement("div", {
                    key: t,
                    className: "factRow"
                }, e)
            }), n.createElement("div", {
                className: "linkRow"
            }, p.Name)), v && m.map(function(e, t) {
                var a = e && e.Sources && e.Sources.length && e.Sources[0];
                return n.createElement("div", {
                    key: t,
                    className: u ? "tlocCard newsCard" : "tlocCard newsCard hide",
                    onClick: function(t) {
                        return s(t, e.EntityId, a.Link, "location")
                    }
                }, n.createElement("div", null, n.createElement("div", {
                    className: "headerRow"
                }, l.buildingIcon, e.ApptType), n.createElement("div", {
                    className: "sepRow"
                }), n.createElement("div", {
                    className: "titleRow"
                }, e.Name), e.Address && n.createElement("div", {
                    className: "factRow"
                }, e.Address), e.MetaData && e.MetaData.map(function(e, t) {
                    return n.createElement("div", {
                        key: t,
                        className: "factRow"
                    }, e)
                }), n.createElement("div", {
                    className: "linkRow"
                }, a.Name)))
            }), h && n.createElement("div", {
                className: "apiContentLink seeMoreContainer"
            }, n.createElement("div", {
                className: u ? "tlocSeeMore seeMoreUp seeMoreButton" : "tlocSeeMore seeMoreButton",
                onClick: function() {
                    r.logInfo("testingLocationClick", {
                        action: u ? "collapse" : "expand"
                    }), c(!u)
                }
            }, h, n.createElement("span", null, l.chevronDown))))
        })
    },
    "https://www.bing.com/covid/components/TopicClusterCard.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js");
        a("https://www.bing.com/covid/styles/topicClusters.css");
        var i = a("https://www.bing.com/covid/instrumentation.ts"),
            r = a("https://www.bing.com/covid/helper.ts"),
            o = a("https://www.bing.com/covid/components/Icons.tsx"),
            l = a("https://www.bing.com/covid/localization/covid.strings/index.ts");
        t.default = function(e) {
            var t = n.useState(function(e, t) {
                    var a = e % t.length,
                        n = t[a];
                    if ("" === n.image) {
                        var i = t.slice().filter(function(e) {
                            return "" !== e.image
                        });
                        i.length > 0 && (n = i[e % i.length], a = t.findIndex(function(e) {
                            return e.url === n.url
                        }))
                    }
                    var o = t.slice();
                    return o.splice(a, 1), o = r.arrayRandomSort(o).slice(0, 4), {
                        article: n,
                        moreArticles: o
                    }
                }(e.articleNumber, e.topic.cluster))[0],
                a = n.useState(!1),
                s = a[0],
                d = a[1],
                u = n.useState(function(e) {
                    return e[e.length > 1 ? Math.floor(Math.random() * e.length) : 0].toLowerCase()
                }(e.topic.cluster_names))[0],
                c = function(t) {
                    i.logInfo("topicArticleClicked", {
                        url: t,
                        topic: e.topic.cluster_names[0]
                    }), window.open(t, "_blank")
                },
                f = s ? "" + l.lessOnTopic(u) : "" + l.moreOnTopic(u),
                p = t.moreArticles.length > 0 ? f : r.capitalizeFirstChar(u),
                m = 0 === t.moreArticles.length ? "noMoreArticle" : "",
                v = t.moreArticles.map(function(e) {
                    return n.createElement("div", {
                        key: e.url,
                        className: "moreArticle"
                    }, n.createElement("div", {
                        className: "pointContainer"
                    }, n.createElement("div", {
                        className: "articlePoint"
                    })), n.createElement("div", null, n.createElement("div", {
                        onClick: function() {
                            return c(e.url)
                        },
                        className: "topicClusterTitle moreArticleTitle"
                    }, e.title), n.createElement("div", {
                        className: "topicPublisher"
                    }, e.publisher)))
                });
            return n.createElement("div", {
                className: "articleContainer",
                key: t.article.url
            }, n.createElement("div", {
                className: "articleCard"
            }, "" !== t.article.image && n.createElement("img", {
                className: "topicImage",
                height: "70px",
                width: "70px",
                src: t.article.image
            }), n.createElement("div", null, n.createElement("div", {
                onClick: function() {
                    return c(t.article.url)
                },
                className: "topicClusterTitle"
            }, t.article.title), n.createElement("div", {
                className: "topicPublisher"
            }, t.article.publisher))), n.createElement("div", {
                onClick: function() {
                    t.moreArticles.length > 0 && (i.logInfo("moreArticles", {
                        toState: s.toString(),
                        topic: e.topic.cluster_names[0]
                    }), d(!s))
                },
                className: "topicMore " + m
            }, p, n.createElement("div", {
                className: "chevronDown " + (s ? "rotate" : "")
            }, o.chevronDown)), n.createElement("div", {
                className: s ? "moreArticlesContainerOpen" : "moreArticlesContainerClose"
            }, v))
        }
    },
    "https://www.bing.com/covid/components/TopicClusterPanel.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js");
        a("https://www.bing.com/covid/styles/topicClusters.css");
        var r = a("https://www.bing.com/covid/helper.ts"),
            o = a("https://www.bing.com/covid/components/TopicClusterCard.tsx"),
            l = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            s = a("https://www.bing.com/covid/config.ts"),
            d = [.12, .12, .12, .12, .12, .05, .05, .05, .05, .05, .03, .03, .03, .03, .03];
        t.default = i.connect(function(e) {
            return {
                selectedInfo: e.selectedInfo,
                topicsResponse: e.articleClustersData
            }
        })(function(e) {
            if ("en-us" !== s.market || "en-us" !== s.locale) return null;
            if ((e.selectedInfo && e.selectedInfo.id) !== s.rootId) return null;
            var t = !!e.topicsResponse,
                a = t && e.topicsResponse.topClusters && e.topicsResponse.topClusters.length > 0,
                i = t && e.topicsResponse.clusters && e.topicsResponse.clusters.length > 0;
            if (!a && !i) return null;
            var u = n.useState(function(e, t, a) {
                    var n = [];
                    t && (n = r.arrayRandomSort(e.topClusters).slice(0, 4));
                    var i = [];
                    return a && (i = r.arrayRandomSort(e.clusters).slice(0, 5 - n.length)), n.concat(i)
                }(e.topicsResponse, a, i))[0],
                c = r.weightedRandom(d),
                f = u.map(function(e) {
                    return n.createElement(o.default, {
                        key: e.cluster_names[0],
                        topic: e,
                        articleNumber: c
                    })
                });
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "segmentTitle"
            }, l.trendingTopics()), n.createElement("div", {
                className: "articlesList"
            }, f))
        })
    },
    "https://www.bing.com/covid/components/UpsellDetailView.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            },
            r = this;
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = a("https://www.bing.com/node_modules/react/index.js"),
            l = a("https://www.bing.com/covid/instrumentation.ts"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/helper.ts"),
            u = a("https://www.bing.com/covid/makeRequest.ts"),
            c = a("https://www.bing.com/covid/config.ts");
        a("https://www.bing.com/covid/styles/upsells.css");
        t.default = function(e) {
            var t = o.useState(0),
                a = t[0],
                f = t[1],
                p = o.useRef(null),
                m = "",
                v = "calloutError";
            1 === a ? m = s.validNumberRequired() : 2 === a ? (v = "calloutSubmitted", m = s.opalSMSAccepted()) : 3 === a && (m = s.opalSMSError());
            var h = "en-us" === c.market,
                g = 1 === e.upsellAttribute.upsellType;
            return o.createElement("div", {
                className: "floatingUpsellContent",
                style: {
                    right: e.containerRight
                }
            }, o.createElement("div", {
                className: "upsellContent"
            }, e.upsellAttribute.icon, o.createElement("div", {
                className: "contentText"
            }, o.createElement("div", {
                className: "title"
            }, e.upsellAttribute.title()), o.createElement("div", {
                className: "description"
            }, e.upsellAttribute.desc()))), g && o.createElement("div", {
                className: "downloadButton",
                onClick: function() {
                    l.logInfo(1 === e.upsellAttribute.upsellType ? "dseUpsell" : "opalUpsell", {
                        action: "downloadClicked"
                    }), window.open(e.upsellAttribute.ctaLink, "_blank")
                }
            }, e.upsellAttribute.ctaText()), !g && h && 0 !== a && o.createElement("div", {
                className: v
            }, m), !g && h && o.createElement("div", {
                className: "container"
            }, o.createElement("input", {
                onFocus: function() {
                    0 !== a && f(0)
                },
                placeholder: "(201) 555-0123",
                className: "numberInput",
                ref: p
            }), o.createElement("div", {
                className: "submit",
                onClick: function() {
                    return n(r, void 0, void 0, function() {
                        var e, t, a;
                        return i(this, function(n) {
                            switch (n.label) {
                                case 0:
                                    return e = !1, p && p.current && p.current.value ? 10 !== (t = d.removeNonDigits(p.current.value)).length ? [3, 2] : (e = !0, [4, u.makeRequest("/covid/upsellApp", {
                                        phNumber: t
                                    }, 3)]) : [3, 2];
                                case 1:
                                    (a = n.sent()) && null === a.error ? (f(2), l.logInfo("opalSMSState", {
                                        success: "true"
                                    })) : (f(3), l.logInfo("opalSMSState", {
                                        error: a.error.toString()
                                    })), n.label = 2;
                                case 2:
                                    return e || f(1), l.logInfo("shareFloat", {
                                        action: "phoneNumSubmit"
                                    }), [2]
                            }
                        })
                    })
                }
            }, s.sendLink())), !g && o.createElement("div", null, o.createElement("div", {
                className: "appIcons"
            }, o.createElement("a", {
                target: "_blank",
                href: "https://apps.apple.com/app/microsoft-bing-search/id345323231"
            }, o.createElement("div", {
                className: "appleBadge"
            })), o.createElement("a", {
                target: "_blank",
                href: "https://play.google.com/store/apps/details?id=com.microsoft.bing&_branch_match_id=767928654231143675"
            }, o.createElement("div", {
                className: "androidBadge"
            }))), o.createElement("div", {
                className: "policy"
            }, s.phoneNumberPolicy()), o.createElement("a", {
                className: "apiContentLink",
                target: "_blank",
                href: "https://privacy.microsoft.com/en-us/privacystatement"
            }, o.createElement("div", {
                className: "privacy"
            }, s.msPrivacyTitle()))))
        }
    },
    "https://www.bing.com/covid/components/Verticals/Graphs.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/helper.ts"),
            o = a("https://www.bing.com/covid/components/shared/Modal.tsx"),
            l = a("https://www.bing.com/covid/components/shared/ErrorBoundary.tsx"),
            s = a("https://www.bing.com/covid/instrumentation.ts"),
            d = a("https://www.bing.com/covid/components/Icons.tsx"),
            u = a("https://www.bing.com/covid/components/Charts/TreeMapChart.tsx"),
            c = a("https://www.bing.com/covid/components/Charts/SummaryInfo.tsx"),
            f = a("https://www.bing.com/covid/components/Charts/TimelyStackedBarChart.tsx"),
            p = a("https://www.bing.com/covid/components/Charts/TimelyTopRegionsLineChart.tsx"),
            m = a("https://www.bing.com/covid/components/Charts/RawDataList.tsx"),
            v = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            h = a("https://www.bing.com/covid/components/Charts/SingleRegionLineChart.tsx"),
            g = a("https://www.bing.com/covid/components/Charts/MobilityChart.tsx"),
            b = a("https://www.bing.com/covid/components/Charts/PunchChart.tsx");
        t.default = i.connect(function(e) {
            return {
                selectedInfo: e.selectedInfo
            }
        })(function(e) {
            var t = e.selectedInfo.id || "world",
                a = n.useState(!1),
                i = a[0],
                k = a[1],
                y = n.useState(null),
                C = y[0],
                w = y[1],
                x = n.useState("1" === r.getParamsFromURL(window.location.href).graphexp)[0],
                T = n.useCallback(function(e) {
                    w(e), k(!0), s.logInfo("graphExpand", {
                        id: t,
                        graphName: C
                    })
                }, []),
                z = n.useCallback(function() {
                    k(!1), s.logInfo("graphCollapse", {
                        id: t
                    })
                }, []);
            return n.createElement(n.Fragment, null, n.createElement("div", {
                className: "graphPanel"
            }, !e.isMobile && n.createElement(c.default, {
                id: t
            }), n.createElement("div", {
                className: "row"
            }, n.createElement("div", {
                className: "col-6"
            }, n.createElement(l.default, {
                key: t,
                errorArea: "SingleRegionLineChart"
            }, n.createElement(h.default, {
                graphType: 5,
                id: t,
                title: v.graphOverTime(),
                height: e.isMobile ? 240 : 478,
                expandCallback: !e.isMobile && T
            }))), n.createElement("div", {
                className: "col-6"
            }, n.createElement(l.default, {
                key: t,
                errorArea: "TimelyTopRegionsLineChart"
            }, n.createElement(p.default, {
                graphType: 0,
                id: t,
                title: v.topTrends(),
                height: e.isMobile ? 240 : 420,
                expandCallback: !e.isMobile && T
            })))), n.createElement("div", {
                className: "row"
            }, n.createElement("div", {
                className: "col-6"
            }, n.createElement(l.default, {
                key: t,
                errorArea: "TreeMapChart"
            }, n.createElement(u.default, {
                graphType: 1,
                id: t,
                title: v.confirmedDistribution(),
                height: e.isMobile ? 340 : 440,
                expandCallback: !e.isMobile && T
            }))), n.createElement("div", {
                className: "col-6"
            }, n.createElement(l.default, {
                key: t,
                errorArea: "PunchChart"
            }, n.createElement(b.default, {
                id: t,
                graphType: 7,
                title: v.activeTopTen(),
                height: e.isMobile ? 340 : 440,
                expandCallback: !e.isMobile && T
            })))), n.createElement("div", {
                className: "row"
            }, n.createElement("div", {
                className: "col-6"
            }, n.createElement(l.default, {
                key: t,
                errorArea: "TimelyStackedBarChartConfirmed"
            }, n.createElement(f.default, {
                graphType: 3,
                id: t,
                title: v.confirmedTrend(),
                type: 1,
                height: e.isMobile ? 240 : 340,
                expandCallback: !e.isMobile && T
            }))), n.createElement("div", {
                className: "col-6"
            }, n.createElement(l.default, {
                key: t,
                errorArea: "TimelyStackedBarChartActive"
            }, n.createElement(f.default, {
                graphType: 4,
                id: t,
                title: v.activeTrend(),
                type: 0,
                height: e.isMobile ? 240 : 340,
                expandCallback: !e.isMobile && T
            })))), x && n.createElement("div", {
                className: "row"
            }, n.createElement("div", {
                className: "col-12"
            }, n.createElement(l.default, {
                key: t,
                errorArea: "MobilityChart"
            }, n.createElement(g.default, {
                graphType: 6,
                id: t,
                title: v.mobility(),
                height: e.isMobile ? 200 : 420,
                expandCallback: !e.isMobile && T
            })))), !e.isMobile && n.createElement("div", {
                className: "row"
            }, n.createElement("div", {
                className: "col-12"
            }, n.createElement(m.default, {
                id: t
            })))), n.createElement(o.default, {
                modalOpen: i,
                duration: 200,
                callback: k,
                className: "graphModal"
            }, n.createElement("div", {
                className: "expandedGraph"
            }, n.createElement(l.default, {
                key: t,
                errorArea: "ExpandedGraph"
            }, 5 == C && n.createElement(h.default, {
                graphType: 5,
                id: t,
                title: v.graphOverTime(),
                height: 500
            }), 0 == C && n.createElement(p.default, {
                graphType: 0,
                id: t,
                title: v.topTrends(),
                height: 500
            }), 7 == C && n.createElement(b.default, {
                id: t,
                graphType: 7,
                title: v.activeTopTen(),
                height: e.isMobile ? 340 : 440
            }), 1 == C && n.createElement(u.default, {
                graphType: 1,
                id: t,
                title: v.confirmedDistribution(),
                height: 560
            }), 3 == C && n.createElement(f.default, {
                graphType: 3,
                id: t,
                title: v.confirmedTrend(),
                type: 1,
                height: 500
            }), 4 == C && n.createElement(f.default, {
                graphType: 4,
                id: t,
                title: v.activeTrend(),
                type: 0,
                height: 500
            }), 6 == C && n.createElement(g.default, {
                graphType: 6,
                id: t,
                title: v.mobility(),
                height: e.isMobile ? 200 : 420
            }), n.createElement("div", {
                className: "closeFeedback",
                onClick: z
            }, d.closeFeedback)))))
        })
    },
    "https://www.bing.com/covid/components/Verticals/MobileGraphs.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/components/Verticals/Graphs.tsx");
        t.default = function() {
            return n.createElement(i.default, {
                isMobile: !0
            })
        }
    },
    "https://www.bing.com/covid/components/Verticals/MobileOverview.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/components/shared/InfoTile.tsx"),
            r = a("https://www.bing.com/covid/components/SegmentPanel.tsx"),
            o = a("https://www.bing.com/node_modules/react-redux/es/index.js");
        t.default = o.connect(function(e) {
            return {
                selectedArea: e.byId && e.selectedInfo && e.selectedInfo.id ? e.byId[e.selectedInfo.id] : null,
                width: e.width
            }
        })(function(e) {
            return e.selectedArea ? (n.useEffect(function() {
                document.getElementsByClassName("content")[0].scrollTo(0, 0)
            }, []), n.createElement(n.Fragment, null, n.createElement(i.default, {
                area: e.selectedArea,
                width: e.width - 84,
                showLastestUpdateAtBottom: !0
            }), n.createElement(r.default, {
                isMobile: !0
            }))) : null
        })
    },
    "https://www.bing.com/covid/components/Verticals/MobileVerticalSwipe.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js");
        t.default = function(e) {
            if (!e.verticals || e.verticals.length < 2) return null;
            var t = n.useRef();
            return n.useEffect(function() {
                t && t.current && t.current.children && t.current.children.length > e.verticalIndex && t.current.children[e.verticalIndex].scrollIntoView()
            }, []), n.createElement("div", {
                className: "verticalSwipe"
            }, n.createElement("div", {
                className: "mobileVerticals",
                ref: t,
                style: {
                    gridTemplateColumns: "repeat(" + e.verticals.length + ", min-content)"
                }
            }, e.verticals.map(function(t, a) {
                return n.createElement("div", {
                    className: "mobileVertOption " + (e.verticalIndex === a ? "selected" : ""),
                    key: t.key,
                    onClick: function() {
                        return e.verticalClick(a)
                    }
                }, t.title())
            }), n.createElement("div", {
                className: "verticalIndicator",
                style: {
                    gridColumn: e.verticalIndex + 1 + " / " + (e.verticalIndex + 2)
                }
            })))
        }
    },
    "https://www.bing.com/covid/components/Verticals/Overview.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/components/shared/ErrorBoundary.tsx"),
            r = a("https://www.bing.com/covid/components/Verticals/OverviewPanel.tsx"),
            o = a("https://www.bing.com/covid/components/FloatingUpsell.tsx"),
            l = a("https://www.bing.com/covid/components/Map.tsx");
        t.default = function() {
            return n.createElement(n.Fragment, null, n.createElement(r.default, null), n.createElement("div", {
                className: "map",
                role: "main",
                style: {
                    height: "100%",
                    width: "100%",
                    overflow: "hidden"
                }
            }, n.createElement(i.default, {
                errorArea: "map"
            }, n.createElement(l.default, null))), n.createElement(i.default, {
                errorArea: "floatingUpsell"
            }, n.createElement(o.default, null)))
        }
    },
    "https://www.bing.com/covid/components/Verticals/OverviewPanel.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/components/SegmentPanel.tsx"),
            o = a("https://www.bing.com/covid/components/shared/ErrorBoundary.tsx"),
            l = a("https://www.bing.com/covid/components/shared/InfoTile.tsx"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            d = a("https://www.bing.com/covid/config.ts");
        t.default = i.connect(function(e) {
            return {
                selectedInfo: e.selectedInfo,
                byId: e.byId
            }
        })(function(e) {
            if (!e.selectedInfo || !e.byId) return null;
            var t = e.selectedInfo ? e.selectedInfo.id : "world",
                a = e.byId[t];
            return n.createElement("div", {
                key: t,
                className: "overview",
                role: "complementary",
                "aria-label": "Overview"
            }, n.createElement(o.default, {
                errorArea: "region:" + (a ? a.displayName : "")
            }, n.createElement("h3", {
                className: "pageName"
            }, s.overview()), t !== d.rootId && n.createElement(l.default, {
                showTotal: !0,
                area: a,
                width: 244
            }), n.createElement(r.default, {
                areaName: a.displayName
            })))
        })
    },
    "https://www.bing.com/covid/components/VideosPanel.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-redux/es/index.js"),
            r = a("https://www.bing.com/covid/components/Icons.tsx"),
            o = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            l = a("https://www.bing.com/covid/instrumentation.ts"),
            s = function(e, t, a) {
                void 0 === a && (a = "video"), l.logInfo("videoClicked", {
                    regionId: e,
                    url: t,
                    elementType: a
                })
            };
        t.default = i.connect(function(e) {
            return {
                videosResponse: e.videosData
            }
        })(function(e) {
            return e.videosResponse ? n.createElement(n.Fragment, null, n.createElement("h4", {
                className: "segmentTitle"
            }, o.videos()), n.createElement("div", {
                className: "videoContent"
            }, e.videosResponse.value && e.videosResponse.value.map(function(t, a) {
                var i = !!t.thumbnailUrl,
                    l = !!(t.publisher && t.publisher.length > 0 && t.publisher[0].name),
                    d = !(!t.creator || !t.creator.name),
                    u = l && !!t.creator,
                    c = 0 !== a,
                    f = c ? t.datePublished.substring(3) : t.datePublished;
                f = o.durationAgo(f);
                var p = l ? t.publisher[0].name : "";
                return p += u ? " · " : "", p += d ? t.creator.name : "", p += c ? "" : f, n.createElement("a", {
                    href: t.webSearchUrl,
                    key: t.webSearchUrl,
                    target: "_blank",
                    className: "apiContentLink videoCard " + (c ? "miniVideoCard" : ""),
                    onClick: function() {
                        return s(e.selectedId, t.webSearchUrl)
                    }
                }, i && n.createElement("div", {
                    className: "thumbnailContainer"
                }, n.createElement("img", {
                    className: "videoImage",
                    src: t.thumbnailUrl
                }), n.createElement("div", {
                    className: "playIcon"
                }, r.playIcon)), n.createElement("div", {
                    className: "info"
                }, n.createElement("div", {
                    className: "title"
                }, t.name), c && n.createElement("div", {
                    className: "videoTimestamp"
                }, f), n.createElement("div", {
                    className: "sourceContainer"
                }, n.createElement("div", {
                    className: "videoSource"
                }, p))))
            })), e.videosResponse.webSearchUrl && n.createElement("a", {
                href: e.videosResponse.webSearchUrl,
                target: "_blank",
                className: "apiContentLink seeMoreContainer",
                onClick: function() {
                    return s(e.selectedId, e.videosResponse.webSearchUrl, "moreButton")
                }
            }, n.createElement("div", {
                className: "seeMoreButton"
            }, o.moreVideos()))) : null
        })
    },
    "https://www.bing.com/covid/components/shared/AnimatingComponent.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js");
        t.default = function(e) {
            var t = n.useState(!1),
                a = t[0],
                i = t[1],
                r = n.useState(!1),
                o = r[0],
                l = r[1],
                s = n.useState(!1),
                d = s[0],
                u = s[1],
                c = n.useRef(!1);
            return n.useEffect(function() {
                !c.current && e.isOpen ? (u(!0), i(!0), c.current = !0, setTimeout(function() {
                    return i(!1)
                }, e.duration)) : c.current && !e.isOpen && (l(!0), setTimeout(function() {
                    u(!1), l(!1)
                }, e.duration), c.current = !1)
            }, [e.isOpen]), d ? n.createElement("div", {
                className: a ? "opening" : o ? "closing" : "open"
            }, e.children) : null
        }
    },
    "https://www.bing.com/covid/components/shared/AreaButton.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/helper.ts");
        t.default = function(e) {
            var t = e.secondaryInfo;
            return "number" == typeof t && (t = i.formatNumber(t)), n.createElement("div", {
                id: e.id,
                className: "area " + e.customClassName,
                onClick: e.clickCallback
            }, n.createElement("div", {
                className: "areaName",
                title: e.displayName
            }, e.displayName), n.createElement("div", {
                className: "areaTotal"
            }, t))
        }
    },
    "https://www.bing.com/covid/components/shared/ErrorBoundary.tsx": function(e, t, a) {
        "use strict";
        var n = this && this.__extends || function() {
            var e = function(t, a) {
                return (e = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(e, t) {
                        e.__proto__ = t
                    } || function(e, t) {
                        for (var a in t) t.hasOwnProperty(a) && (e[a] = t[a])
                    })(t, a)
            };
            return function(t, a) {
                function n() {
                    this.constructor = t
                }
                e(t, a), t.prototype = null === a ? Object.create(a) : (n.prototype = a.prototype, new n)
            }
        }();
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = a("https://www.bing.com/node_modules/react/index.js"),
            r = a("https://www.bing.com/covid/instrumentation.ts"),
            o = function(e) {
                function t(t) {
                    var a = e.call(this, t) || this;
                    return a.state = {
                        hasError: !1
                    }, a
                }
                return n(t, e), t.prototype.componentDidCatch = function(e, t) {
                    this.setState({
                        hasError: !0
                    });
                    var a = "Error in " + this.props.errorArea + e,
                        n = "";
                    void 0 !== t && t && t.componentStack && (n = t.componentStack), r.logError(a, n)
                }, t.prototype.render = function() {
                    return this.state.hasError ? this.props.renderOnError || null : this.props.children
                }, t
            }(i.Component);
        t.default = o
    },
    "https://www.bing.com/covid/components/shared/InfoChart.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/echarts/index.js"),
            r = a("https://www.bing.com/node_modules/echarts-for-react/lib/index.js"),
            o = a("https://www.bing.com/covid/components/Icons.tsx"),
            l = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            s = a("https://www.bing.com/covid/components/Charts/ChartHelper.tsx");
        i.registerTheme("covid", {
            color: ["#DE3700", "#767676", "#60BB69"]
        });
        t.default = function(e) {
            var t = {
                tooltip: s.chartTooltip({
                    trigger: "axis"
                }),
                grid: s.chartGrid({
                    top: "8%",
                    right: "8",
                    bottom: "12%",
                    left: "8"
                }),
                xAxis: s.chartXAxis({
                    boundaryGap: !1,
                    data: e.data && e.data.map(function(e) {
                        return e.date
                    })
                }),
                legend: {
                    data: [l.confirmed(), l.fatal()],
                    bottom: 0
                },
                yAxis: s.chartYAxis({}),
                series: [{
                    name: l.confirmed(),
                    type: "line",
                    data: e.data && e.data.map(function(e) {
                        return e.confirmed
                    }),
                    smooth: !0
                }, {
                    name: l.fatal(),
                    type: "line",
                    data: e.data && e.data.map(function(e) {
                        return e.fatal
                    }),
                    smooth: !0
                }]
            };
            return n.createElement("div", {
                className: "infoTile graph multiLineGraph"
            }, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, e.title), e.expandCallback && n.createElement("div", {
                onClick: e.expandCallback
            }, l.expand(), o.expandIcon)), n.createElement(r.default, {
                option: t,
                theme: "covid",
                style: {
                    height: e.height,
                    width: "100%"
                }
            }))
        }
    },
    "https://www.bing.com/covid/components/shared/InfoTile.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/covid/helper.ts"),
            r = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            o = a("https://www.bing.com/covid/config.ts");
        t.default = function(e) {
            var t, a = e.area.totalRecovered || 0,
                l = e.area.totalDeaths || 0,
                s = e.area.totalConfirmed - a - l,
                d = e.area.totalConfirmedDelta - e.area.totalRecoveredDelta || 0 - e.area.totalDeathsDelta || 0,
                u = e.area.totalConfirmed,
                c = (0 === s ? 1 : 0) + (0 === a ? 1 : 0) + (0 === l ? 1 : 0),
                f = e.width - 4 * (2 - c),
                p = 8 / f;
            0 !== s && s / u < p && (s += t = u * p - s, a > l ? a -= t : l -= t);
            0 !== a && a / u < p && (a += t = u * p - a, s > l ? s -= t : l -= t);
            0 !== l && l / u < p && (l += t = u * p - l, a > s ? a -= t : s -= t);
            var m = 0;
            if (e.area.lastUpdated) {
                var v = new Date(e.area.lastUpdated).valueOf() / 1e3,
                    h = Math.round(Date.now() / 1e3);
                m = Math.ceil((h - v) / 60)
            }
            return n.createElement("div", {
                className: "infoTile",
                style: {
                    width: e.width
                }
            }, e.showTotal && n.createElement("h2", {
                className: "title",
                title: r.totalConfirmed()
            }, r.totalConfirmed()), e.showLastestUpdateAtTop && e.area.lastUpdated && n.createElement("div", {
                className: "lastUpdate"
            }, " ", r.lastUpdateMinutes(m.toLocaleString(o.locale)), " "), e.showTotal && n.createElement("div", {
                className: "confirmed"
            }, i.formatNumber(e.area.totalConfirmed)), !e.hideBar && u > 0 && n.createElement("div", {
                className: "bar"
            }, s > 0 && n.createElement("div", {
                className: "slice",
                style: {
                    background: "#F4C363",
                    width: s / u * f,
                    marginRight: 0 === a && 0 === l ? 0 : 4
                }
            }), a > 0 && n.createElement("div", {
                className: "slice",
                style: {
                    background: "#60BB69",
                    width: a / u * f,
                    marginRight: 0 === l ? 0 : 4
                }
            }), l > 0 && n.createElement("div", {
                className: "slice",
                style: {
                    background: "#767676",
                    width: l / u * f
                }
            })), n.createElement("div", {
                className: "infoTileData"
            }, n.createElement("h2", {
                className: "legend"
            }, n.createElement("div", {
                className: "color",
                style: {
                    background: "#F4C363"
                }
            }), n.createElement("div", {
                className: "description"
            }, r.activeCases()), n.createElement("div", {
                className: "total"
            }, i.formatNumber(e.area.totalConfirmed - (e.area.totalRecovered || 0) - (e.area.totalDeaths || 0)), d > 0 && n.createElement("div", {
                className: "delta"
            }, d > 0 ? "+" : "-", i.formatNumber(d)))), n.createElement("h2", {
                className: "legend"
            }, n.createElement("div", {
                className: "color",
                style: {
                    background: "#60BB69"
                }
            }), n.createElement("div", {
                className: "description"
            }, r.recoveredCases()), n.createElement("div", {
                className: "total"
            }, null !== e.area.totalRecovered ? i.formatNumber(e.area.totalRecovered) : "-", e.area.totalRecoveredDelta && 0 != e.area.totalRecoveredDelta && n.createElement("div", {
                className: "delta"
            }, "+" + i.formatNumber(e.area.totalRecoveredDelta)))), n.createElement("h2", {
                className: "legend"
            }, n.createElement("div", {
                className: "color",
                style: {
                    background: "#767676"
                }
            }), n.createElement("div", {
                className: "description"
            }, r.fatalCases()), n.createElement("div", {
                className: "total"
            }, null !== e.area.totalDeaths ? i.formatNumber(e.area.totalDeaths) : "-", e.area.totalDeathsDelta && 0 != e.area.totalDeathsDelta && n.createElement("div", {
                className: "delta"
            }, "+" + i.formatNumber(e.area.totalDeathsDelta))))), e.showLastestUpdateAtBottom && e.area.lastUpdated && n.createElement("div", {
                className: "lastUpdate"
            }, " ", r.lastUpdateMinutes(m.toLocaleString(o.locale)), " "))
        }
    },
    "https://www.bing.com/covid/components/shared/Modal.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/react-dom/index.js"),
            r = a("https://www.bing.com/covid/components/shared/AnimatingComponent.tsx");
        t.default = function(e) {
            var t = document.getElementById("portal");
            return t ? i.createPortal(n.createElement(r.default, {
                isOpen: e.modalOpen,
                duration: e.duration
            }, n.createElement("div", {
                className: (e.className ? e.className : "") + " modal"
            }, n.createElement("div", {
                className: "overlay",
                onClick: function() {
                    return e.callback(!1)
                }
            }), e.children)), t) : null
        }
    },
    "https://www.bing.com/covid/components/shared/TopChart.tsx": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/react/index.js"),
            i = a("https://www.bing.com/node_modules/echarts/index.js"),
            r = a("https://www.bing.com/node_modules/echarts-for-react/lib/index.js"),
            o = a("https://www.bing.com/node_modules/react-select/dist/react-select.browser.esm.js"),
            l = a("https://www.bing.com/covid/components/Icons.tsx"),
            s = a("https://www.bing.com/covid/localization/covid.strings/index.ts");
        i.registerTheme("covid_topchart", {
            color: ["#e6a745", "#F78200", "#047efb", "#973999", "#21c5b0", "#a9c707"]
        });
        t.default = function(e) {
            var t = n.useState(d()),
                a = t[0],
                i = t[1];

            function d() {
                return e.data && e.data.slice(0, e.count).map(function(e) {
                    return {
                        value: e.id,
                        label: e.displayName
                    }
                })
            }
            return n.createElement("div", {
                className: "infoTile graph multiLineGraph"
            }, n.createElement("div", {
                className: "graphTitle"
            }, n.createElement("div", null, e.title), e.expandCallback && n.createElement("div", {
                onClick: e.expandCallback
            }, s.compare(), l.expandIcon)), e.showFilter && n.createElement(o.default, {
                className: "filter",
                defaultValue: d(),
                options: e.data && e.data.map(function(e) {
                    return {
                        value: e.id,
                        label: e.displayName
                    }
                }),
                onChange: function(e) {
                    i(e)
                },
                isMulti: !0
            }), n.createElement(r.default, {
                option: function() {
                    var t = e.data.filter(function(e) {
                            if (a) {
                                for (var t = 0; t < a.length; t++)
                                    if (a[t].value == e.id) return !0;
                                return !1
                            }
                            return !1
                        }),
                        n = function(e) {
                            var t = e && e[0] && e[0].data && e[0].data.filter(function(e) {
                                return e.date
                            });
                            return t && t.map(function(e) {
                                return e.date
                            })
                        }(t),
                        i = function(e, t) {
                            if (e && t) {
                                var a = e.length;
                                return t.map(function(e) {
                                    if (e && e.data && e.data.length > 0) {
                                        var t = a - e.data.length;
                                        t > 0 ? e.data = new Array(t).concat(e.data) : t < 0 && (e.data = e.data.slice(-t))
                                    }
                                    return e
                                })
                            }
                            return t
                        }(n, t),
                        r = [],
                        o = [];
                    return i && i.map(function(e) {
                            var t = e.displayName;
                            r.push(t), o.push({
                                name: t,
                                type: "line",
                                data: function(e) {
                                    return e && e.map(function(e) {
                                        return e.confirmed
                                    })
                                }(e.data),
                                smooth: !0
                            })
                        }),
                        function(t, a, n) {
                            return {
                                tooltip: {
                                    trigger: "axis",
                                    textStyle: {
                                        align: "left",
                                        color: "#444",
                                        fontSize: 12
                                    },
                                    backgroundColor: "#FFF",
                                    borderColor: "rgba(0, 0, 0, 0.15)",
                                    borderWidth: 1,
                                    extraCssText: "box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05); z-index: 100;"
                                },
                                grid: {
                                    top: "5%",
                                    right: "8",
                                    bottom: e.showFilter ? "12%" : "18%",
                                    left: "8",
                                    containLabel: !0,
                                    borderColor: "red"
                                },
                                xAxis: {
                                    type: "category",
                                    boundaryGap: !1,
                                    axisLabel: {
                                        fontSize: 11,
                                        color: "#767676",
                                        fontWeight: e.showFilter ? "bold" : "normal"
                                    },
                                    data: t,
                                    axisLine: {
                                        color: "#DDD"
                                    }
                                },
                                legend: {
                                    data: a,
                                    bottom: 0
                                },
                                yAxis: {
                                    type: "value",
                                    axisTick: {
                                        show: !1
                                    },
                                    axisLine: {
                                        color: "#DDD"
                                    },
                                    splitLine: {
                                        lineStyle: {
                                            color: "rgba(0, 0, 0, 0.05)"
                                        }
                                    },
                                    axisLabel: {
                                        fontSize: 11,
                                        color: "#767676",
                                        formatter: function(e, t) {
                                            return 0 === t && 0 === e ? "" : e >= 1e6 ? "" + s.millionAbbreviation(Math.round(e / 1e6)) : e >= 1e3 ? Math.round(e / 1e4) < e / 1e4 ? "" + s.thousandAbbreviation((e / 1e3).toFixed(1)) : "" + s.thousandAbbreviation(Math.round(e / 1e3)) : e
                                        }
                                    }
                                },
                                series: n
                            }
                        }(n, r, o)
                }(),
                theme: "covid_topchart",
                style: {
                    height: e.height,
                    width: "100%"
                },
                notMerge: !0
            }))
        }
    },
    "https://www.bing.com/covid/config.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/localization/localeHelper.ts");
        t.rootId = "world", t.hasWindow = "undefined" != typeof window, t.globalNS = t.hasWindow ? window : {}, t.ig = t.globalNS.ig, t.isPWA = !!t.globalNS.pwa, t.token = t.globalNS.token, t.market = t.globalNS.mkt || "en-us", t.favoritesEnabled = !1, t.userCoordinates = t.globalNS.loc, t.isMobile = !("undefined" == typeof navigator || !navigator || !navigator.userAgent) && navigator.userAgent.indexOf("Mobi") >= 0, t.isChromeDesktop = !(t.isMobile || "undefined" == typeof navigator || !navigator || !navigator.userAgent) && (navigator.userAgent.indexOf("Chrome/") >= 0 && navigator.userAgent.indexOf("Chromium/") < 0 && navigator.userAgent.indexOf("Edg/") < 0), t.isFireFoxDesktop = !(t.isMobile || "undefined" == typeof navigator || !navigator || !navigator.userAgent) && (navigator.userAgent.indexOf("Firefox/") >= 0 && navigator.userAgent.indexOf("Seamonkey/") < 0), t.locale = n.isValidLocale(window.uiLang) ? window.uiLang : void 0
    },
    "https://www.bing.com/covid/helper.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/node_modules/memoize-one/dist/memoize-one.esm.js"),
            o = a("https://www.bing.com/server/safeAsync.ts"),
            l = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            s = a("https://www.bing.com/covid/config.ts"),
            d = /(\d)(?=(\d{3})+(?!\d))/g;
        t.getHostFromURL = function(e) {
            return new URL(e).hostname
        }, t.getParamsFromURL = r.default(function(e) {
            var t;
            try {
                t = new URL(e).search
            } catch (a) {
                (0 === e.indexOf("/") && e.indexOf("?") > 0 || 0 === e.indexOf("?")) && (t = e.slice(e.indexOf("?")))
            }
            var a = {};
            return t && (t = t.replace("?", "")).split("&").map(function(e) {
                var t = e.split("=");
                if (2 === t.length) {
                    var n = decodeURIComponent(t[1]);
                    "string" == typeof a[t[0]] ? a[t[0]] = [a[t[0]], n] : Array.isArray(a[t[0]]) ? a[t[0]].push(n) : a[t[0]] = n
                }
            }), a
        }), t.setURLParam = function(e, t, a) {
            var n;
            try {
                (n = new URL(e)).searchParams.set(t, a)
            } catch (e) {}
            return n ? n.href : e
        }, t.removeURLParam = function(e, t) {
            var a;
            try {
                (a = new URL(e)).searchParams.delete(t)
            } catch (e) {}
            return a ? a.href : e
        }, t.caseInsensitiveObj = function(e) {
            void 0 === e && (e = {});
            var t = {};
            for (var a in e) t[a.toLowerCase()] = a;
            return {
                set: function(a, n) {
                    t[a.toLowerCase()] = a, e[a] = n
                },
                get: function(a) {
                    var n = t[a.toLowerCase()];
                    return n ? e[n] : void 0
                },
                delete: function(a) {
                    delete e[t[a.toLowerCase()]]
                },
                getObj: function() {
                    return e
                }
            }
        }, t.copyToClipBoard = function(e) {
            return n(this, void 0, void 0, function() {
                var t, a;
                return i(this, function(n) {
                    switch (n.label) {
                        case 0:
                            return (t = navigator).clipboard && t.clipboard.writeText ? [4, o.default(t.clipboard.writeText(e))] : [3, 2];
                        case 1:
                            return (a = n.sent().error) ? [2, a] : [3, 3];
                        case 2:
                            return [2,
                                function(e) {
                                    var t, a = document.createElement("textarea");
                                    a.value = e, a.style.top = "0", a.style.left = "0", a.style.position = "fixed", document.body.appendChild(a), a.focus(), a.select();
                                    try {
                                        document.execCommand("copy")
                                    } catch (e) {
                                        t = e
                                    }
                                    return document.body.removeChild(a), t
                                }(e)
                            ];
                        case 3:
                            return [2]
                    }
                })
            })
        };
        var u = !!window.navigator.share;

        function c(e) {
            return n(this, void 0, void 0, function() {
                var e;
                return i(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return navigator.share ? (e = {
                                title: "BING COVID Tracker",
                                url: location.href
                            }, [4, o.default(window.navigator.share(e))]) : [2];
                        case 1:
                            return [2, t.sent().error]
                    }
                })
            })
        }
        t.nativeShare = function(e) {
            return n(this, void 0, void 0, function() {
                return i(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return u ? [4, c({
                                url: "https://www.bing.com/covid",
                                title: l.bingCovidTitle()
                            })] : [3, 2];
                        case 1:
                            return t.sent(), [3, 3];
                        case 2:
                            e(), t.label = 3;
                        case 3:
                            return [2]
                    }
                })
            })
        }, t.shareNativeDialog = c, t.formatNumber = function(e) {
            return "number" != typeof e ? "" : e.toString().replace(d, "$1,")
        }, t.removeNonDigits = function(e) {
            return e.replace(/\D/g, "")
        }, t.isInIframe = function() {
            var e = function() {
                try {
                    return window.top !== window.self
                } catch (e) {
                    return !0
                }
            }();
            return function() {
                return e
            }
        }(), t.roundToDecimalPoint = function(e, t) {
            return void 0 === t && (t = 1e3), Math.round(e * t) / t
        }, t.capitalizeFirstChar = function(e) {
            return s.locale ? e.charAt(0).toLocaleUpperCase() + e.slice(1) : e.charAt(0).toUpperCase() + e.slice(1)
        }, t.arrayRandomSort = function(e) {
            return e.sort(function() {
                return .5 - Math.random()
            })
        }, t.weightedRandom = function(e) {
            for (var t = 0, a = Math.random(), n = 0, i = 0; i < e.length; i++)
                if (a <= (t += e[i])) {
                    n = i;
                    break
                }
            return n
        };
        var f = r.default(function(e, a) {
            var n = t.getParamsFromURL(e);
            return "string" == typeof n.ref && n.ref === a
        });

        function p() {
            return f(location.href, "msn")
        }
        t.isMsn = p, t.isOpal = function() {
            return f(location.href, "opal")
        }, t.isNewsAndVideosEnabled = function() {
            var e = window.mkt;
            return !(p() && "en-us" !== e.toLowerCase() || "es-es" === e.toLowerCase())
        }, t.isUrlParameterPresent = function(e, a) {
            var n = t.getParamsFromURL(location.href);
            return "string" == typeof n[e] && n[e] === a
        }, t.stateToMSNLocationID = {
            alabama_unitedstates: "Y_d7547506-3358-40e6-855e-32d06a125c08",
            alaska_unitedstates: "Y_99545dcb-6bbc-46da-97a4-cf5ec5a39dfb",
            arizona_unitedstates: "Y_51f552e0-a6c5-40dc-b080-6d31a93cf572",
            arkansas_unitedstates: "Y_71d2bba2-f612-4e86-b933-a9ca34fc5d92",
            california_unitedstates: "Y_1ad0fd3d-7a71-4757-918f-e5fb410ccaf6",
            colorado_unitedstates: "Y_fe8b8767-cd95-4d4c-ac10-2a18aadd03f6",
            connecticut_unitedstates: "Y_83fbcc4b-0480-41e5-836f-ff848b55d003",
            delaware_unitedstates: "Y_35ebc9ad-8f7f-48a3-b24e-7736ba5bfdd5",
            florida_unitedstates: "Y_1810dae2-6e95-48a3-b3e1-9fcd1cf4a2c3",
            georgia_unitedstates: "Y_67a374ba-3636-4944-ac5a-236f9c38f3e8",
            hawaii_unitedstates: "Y_b30c6346-309d-4cdc-9c79-86019c895704",
            idaho_unitedstates: "Y_bb6feaf4-b75e-4a09-b263-1535bc3110b5",
            illinois_unitedstates: "Y_71516a3d-1567-4387-a3cb-2ad609d31170",
            indiana_unitedstates: "Y_9c2b1d8d-c9a0-4e80-98a6-a79aca237d02",
            iowa_unitedstates: "Y_5869bd82-f4a6-4492-98f8-5099188406bc",
            kansas_unitedstates: "Y_a3106025-09f5-4ef2-a414-422417355936",
            kentucky_unitedstates: "Y_5f1a0cbf-8ebb-476e-b0b6-8271e493e38a",
            louisiana_unitedstates: "Y_117169a5-0ac4-4d90-8aec-fc524cb976de",
            maine_unitedstates: "Y_a8659285-eb13-49f8-8239-7a519114f922",
            maryland_unitedstates: "Y_2f90f40d-daef-470c-8dc2-59a9b4194e17",
            massachusetts_unitedstates: "Y_5051cfb5-0f86-4161-ba43-83bcf12f309a",
            michigan_unitedstates: "Y_114e23b2-33bb-442e-99cb-f90b77a62e7d",
            minnesota_unitedstates: "Y_3a0153e5-c415-431d-911f-7b69dbc49284",
            mississippi_unitedstates: "Y_c7b23605-6c8e-4b71-a8fd-d5ea52872528",
            missouri_unitedstates: "Y_0a2b4b6a-5f02-4ad9-82c0-f939bb328f40",
            montana_unitedstates: "Y_6f9cff95-b935-4e8a-99b1-11a4bc700dce",
            nebraska_unitedstates: "Y_eb1e7002-7c2d-469e-9aa7-82f64684777f",
            nevada_unitedstates: "Y_941962bb-09e1-4421-8e56-485a7a1627bb",
            newhampshire_unitedstates: "Y_9acab2fe-f9c2-4753-b37c-b658efe65338",
            newjersey_unitedstates: "Y_cb53d0ce-1f66-4a41-bb79-977f23c4e435",
            newmexico_unitedstates: "Y_403ef224-60ff-4fc6-9346-7565650cbc3c",
            newyork_unitedstates: "Y_8efe4d79-d426-4423-8ec2-1a6d724b1ad3",
            northcarolina_unitedstates: "Y_5eb2a277-b60d-4090-84e2-7a6d3e42feae",
            northdakota_unitedstates: "Y_b01d1ce3-5f5b-44e0-948e-91f2aa3b917d",
            ohio_unitedstates: "Y_0c0fb917-408c-4fb2-8028-a9c25ea83054",
            oklahoma_unitedstates: "Y_21731e9b-4a03-4c8e-9363-be7d2325360b",
            oregon_unitedstates: "Y_5b9759c5-6f52-4740-900d-7f754ba722f4",
            pennsylvania_unitedstates: "Y_4011a504-843a-44bb-996d-532e50444c89",
            rhodeisland_unitedstates: "Y_2fb516fb-e725-4e75-aa07-8fbc4ecfee2d",
            southcarolina_unitedstates: "Y_96756eec-4a30-4c94-9155-0472de88a36a",
            southdakota_unitedstates: "Y_9767a6ba-513b-4151-a36c-8d472189414b",
            tennessee_unitedstates: "Y_3f9180a7-5645-4c74-b79a-cb3f46cdd62d",
            texas_unitedstates: "Y_40c4de50-7c0c-465c-b2b3-4117f0ceea25",
            utah_unitedstates: "Y_2338ed5d-b730-4e36-9828-22af2c8d48ed",
            vermont_unitedstates: "Y_0c5c05bf-dbc7-41c3-8436-7b523e0c58ec",
            virginia_unitedstates: "Y_b20a1b7f-9fab-432c-8143-1b2b476c1bf0",
            washington_unitedstates: "Y_4c7d9c79-edc2-421e-8d8c-9d7469e5e320",
            washingtondc_unitedstates: "Y_f72f759c-10e2-48c8-9c77-df604ff5bcdb",
            westvirginia_unitedstates: "Y_86e0de44-1e61-4bf5-b319-22426e85f836",
            wisconsin_unitedstates: "Y_c63a613d-238b-4dcb-a7dc-a20dc9e619b7",
            wyoming_unitedstates: "Y_2720d5b5-615f-4c15-8730-df377561b51a"
        }, t.marketToMSNFeedId = {
            "cs-cz": "Y_a0b519c3-f932-44c0-adfa-eec18c05a28f",
            "da-dk": "Y_7576f078-2c87-4266-9fe2-748ab7c9b656",
            "ar-ae": "Y_67d9b374-a305-4dd4-8d3e-bacfb0915f46",
            "ar-eg": "Y_26bad43b-de50-4dfd-8636-e4442eccf4e5",
            "ar-sa": "Y_b24c9994-4fd0-4140-9bd6-a59a6d17473d",
            "de-at": "Y_0f76865c-05eb-4999-a50b-05f2f4c91bb7",
            "de-ch": "Y_3b2ab3a1-231c-408f-ac44-c9be0f01e033",
            "de-de": "Y_5d12c4b4-9831-4421-b348-4ceb935b2eb4",
            "en-ae": "Y_56b4e014-3e38-48d4-98c5-5f2bede1dba9",
            "en-gb": "Y_bd3e20e1-bfda-4c69-9314-2e4ae0c3db9e",
            "en-in": "Y_e3456e91-215f-4a5c-ab78-6874509075ef",
            "en-my": "Y_e2012b1a-7ebe-45a5-b8ec-cc90d18cd4c8",
            "en-ph": "Y_4500c584-a70a-430c-ba61-a19b25134cae",
            "en-sg": "Y_ed22ee9a-c1c8-4760-b44e-0e63f68b9002",
            "en-us": "Y_46cba2b4-26fd-492e-a1c0-41ec9917c10b",
            "es-ar": "Y_2e1acdc8-8c90-4ce5-ba5f-3af0e1ee13f0",
            "es-co": "Y_e3a1292a-23ee-4a2a-803e-30b8d3dd231a",
            "es-es": "Y_947c25e5-cd49-4e89-bfc2-44f7a2c501ba",
            "es-mx": "Y_571ddf74-5c15-4093-9b81-7ebd33c21301",
            "es-us": "Y_3d7fc59a-2873-41b9-ae73-369a67014be1",
            "fi-fi": "Y_e9e1dc76-56ac-49c5-a092-0bc94b3ad60d",
            "fr-be": "Y_833d0f2d-d787-46d6-925b-51da4500e331",
            "fr-ca": "Y_d028ea10-a80b-4a32-9bb7-5769636a5471",
            "fr-fr": "Y_512493ad-0312-4236-a254-34f6f5f09292",
            "id-id": "Y_69ae5788-226d-4623-b899-931a025fc7dc",
            "it-it": "Y_39007d13-b029-498a-91df-d38a2cbc36c1",
            "ja-jp": "Y_aff7a7ee-dcf5-48b8-825b-6ff4a61e6c47",
            "ko-kr": "Y_053ba9fd-5e4c-4577-89e6-5e36e8d5bfdf",
            "nb-no": "Y_3dabe98e-1feb-4a43-bd08-d38d1cd09e0a",
            "nl-nl": "Y_8c3fb691-eb1b-4bf6-a581-24892a8b9233",
            "pl-pl": "Y_24531d08-1fd1-41c7-90de-144783865f33",
            "pt-br": "Y_9817e811-aa85-4c55-8726-ec33b167f674",
            "ru-ru": "Y_aa4b43dc-6a12-4d22-90de-3e5bea7f517f",
            "sv-se": "Y_554bafaf-df74-46ef-a3cc-90436c7ad527",
            "th-th": "Y_dea39d1e-894f-4cc9-93a8-fad11f99e5a9",
            "vi-vn": "Y_1f96dfbe-535f-4e27-9beb-8efa0b8fedd6",
            "zh-hk": "Y_2387c707-dafc-4ff4-99b8-a4d5def68705",
            "zh-tw": "Y_4c46d0f0-c5f3-4f3f-82fb-9998b94c92de",
            "el-gr": "Y_ad38e474-1dfb-4379-bf01-6b141e0a2ee3",
            "en-ie": "Y_50d66c59-4129-4b19-8438-96537a4b28b8",
            "en-za": "Y_dc355491-519a-4cca-8460-79f6defcd6ec",
            "es-cl": "Y_3513be24-f8b9-4679-84e9-d58c6e3b58d9",
            "es-pe": "Y_6302b9a6-b074-4fa1-a91a-868edb1d51ab",
            "es-xl": "Y_6fc80a79-1927-46e6-a22c-7809b865fe34",
            "he-il": "Y_abbd68c8-bca6-40a9-baf7-ff664fb26c1f",
            "hu-hu": "Y_8e14893f-5271-4a79-9f63-3a1a144e8f6e",
            "nl-be": "Y_caa8fc8b-6dd9-4efe-be8b-e785b5ef6887",
            "pt-pt": "Y_8c982443-9bfc-4c0e-9dad-4b2fde01eee9",
            "zh-cn": "Y_a4e80263-f0c6-438f-bf73-27d8763ccfba",
            "tr-tr": "Y_e8312d13-14a5-4d01-8106-122b20c0aeee"
        }, t.marketToCountryId = {
            "cs-cz": "czechrepublic",
            "da-dk": "denmark",
            "ar-ae": "unitedarabemirates",
            "ar-eg": "egypt",
            "ar-sa": "saudiarabia",
            "de-at": "austria",
            "de-ch": "switzerland",
            "de-de": "germany",
            "en-ae": "unitedarabemirates",
            "en-gb": "unitedkingdom",
            "en-in": "india",
            "en-my": "malaysia",
            "en-ph": "philippines",
            "en-sg": "singapore",
            "en-us": "unitedstates",
            "es-ar": "argentina",
            "es-co": "colombia",
            "es-es": "spain",
            "es-mx": "mexico",
            "es-us": "unitedstates",
            "fi-fi": "finland",
            "fr-be": "belgium",
            "fr-ca": "canada",
            "fr-fr": "france",
            "id-id": "indonesia",
            "it-it": "italy",
            "ja-jp": "japan",
            "ko-kr": "southkorea",
            "nb-no": "norway",
            "nl-nl": "netherlands",
            "pl-pl": "poland",
            "pt-br": "brazil",
            "ru-ru": "russia",
            "sv-se": "sweden",
            "th-th": "thailand",
            "vi-vn": "vietnam",
            "zh-hk": "hongkong",
            "zh-tw": "taiwan",
            "el-gr": "greece",
            "en-ie": "ireland",
            "en-za": "southafrica",
            "es-cl": "chile",
            "es-pe": "peru",
            "es-xl": "latinamerica",
            "he-il": "israel",
            "hu-hu": "hungary",
            "nl-be": "belgium",
            "pt-pt": "portugal",
            "zh-cn": "chinamainland",
            "tr-tr": "turkey"
        }
    },
    "https://www.bing.com/covid/instrumentation.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(e) {
                for (var t, a = 1, n = arguments.length; a < n; a++)
                    for (var i in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }).apply(this, arguments)
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = a("https://www.bing.com/covid/helper.ts"),
            r = a("https://www.bing.com/framework/apiFetchTools.ts"),
            o = a("https://www.bing.com/covid/makeRequest.ts"),
            l = {
                Info: null,
                Error: null
            },
            s = Date.now();

        function d(e, t, a) {
            var r = i.roundToDecimalPoint(Date.now() - s);
            void 0 === t && (t = {}), l.Info || (l.Info = {});
            var o = n({
                T: r
            }, t);
            void 0 === l.Info[e] || a ? l.Info[e] = o : Array.isArray(l.Info[e]) ? l.Info[e].push(o) : l.Info[e] = [l.Info[e], o]
        }

        function u() {
            var e = n({}, l);
            delete l.Info, delete l.Error,
                function(e) {
                    var t = {},
                        a = JSON.stringify(e);
                    return t.IG = window.ig, new Promise(function(n, i) {
                        e.Info || e.Error ? o.asyncRequest("/covid/instrument" + r.stringifyUrlParams(t, !1), function(e) {
                            e ? n() : i()
                        }, a, function(e) {
                            e.setRequestHeader("Content-Type", "application/json")
                        }) : n()
                    })
                }(e).catch(function() {
                    return function(e) {
                        if (e.Info && void 0 === l.Info || !l.Info) l.Info = e.Info;
                        else if (e.Info)
                            for (var t in e.Info) void 0 === l.Info[t] ? l.Info[t] = e.Info[t] : Array.isArray(l.Info[t]) ? l.Info[t] = (Array.isArray(e.Info[t]) ? e.Info[t] : [e.Info[t]]).concat(l.Info[t]) : l.Info[t] = (Array.isArray(e.Info[t]) ? e.Info[t] : [e.Info[t]]).concat([l.Info[t]])
                    }(e)
                })
        }
        t.logInfoWithTimeInMS = function(e, t, a, i) {
            var r = Date.now() - t;
            d(e, n({
                elapsedInMs: r
            }, a || {}), i)
        }, t.logInfo = d, t.logError = function(e, t, a, n) {
            l.Error = {
                message: e,
                file: t,
                lineNum: a,
                colNum: n
            }, u()
        }, t.sendInstrumentation = u
    },
    "https://www.bing.com/covid/leven.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = [],
            i = [];
        t.leven = function(e, t) {
            if (e === t) return 0;
            var a = e;
            e.length > t.length && (e = t, t = a);
            for (var r = e.length, o = t.length; r > 0 && e.charCodeAt(~-r) === t.charCodeAt(~-o);) r--, o--;
            for (var l, s, d, u, c = 0; c < r && e.charCodeAt(c) === t.charCodeAt(c);) c++;
            if (o -= c, 0 === (r -= c)) return o;
            for (var f = 0, p = 0; f < r;) i[f] = e.charCodeAt(c + f), n[f] = ++f;
            for (; p < o;)
                for (l = t.charCodeAt(c + p), d = p++, s = p, f = 0; f < r; f++) u = l === i[f] ? d : d + 1, d = n[f], s = n[f] = d > s ? u > s ? s + 1 : u : u > d ? d + 1 : u;
            return s
        }, t.default = t.leven
    },
    "https://www.bing.com/covid/localStorage.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/instrumentation.ts"),
            i = null,
            r = "covid-test";

        function o() {
            if (null !== i) return i;
            if ("undefined" != typeof window && window) try {
                window.localStorage.setItem(r, r), window.localStorage.getItem(r), window.localStorage.removeItem(r), i = !0
            } catch (e) {
                i = !1
            }
            return i
        }
        t.LocalStorageKeys = {
            SessionCount: "SessionCount"
        }, t.readFromLocalStorage = function(e) {
            var t, a;
            if (o() && (t = window.localStorage.getItem(e))) try {
                a = JSON.parse(t)
            } catch (t) {
                n.logError("failed parsing localStorage JSON for " + e + " with " + t.message)
            }
            return a
        }, t.writeToLocalStorage = function(e, t) {
            if (o()) {
                var a = JSON.stringify(t);
                window.localStorage.setItem(e, a)
            }
        }, t.deleteFromLocalStorage = function(e) {
            o() && localStorage.removeItem(e)
        }, t.doesHaveAccessToLocalStorage = o
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.ar-sa.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["تمّ آخر تحديث للبيانات في:"], ["تمّ آخر تحديث للبيانات في:"]))), t.urlCopied = bt.default(r || (r = n(["تمّ نسخ عنوان Url في الحافظة"], ["تمّ نسخ عنوان Url في الحافظة"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["أداة تعقّب فيروس كورونا المستجد (كوفيد-19)"], ["أداة تعقّب فيروس كورونا المستجد (كوفيد-19)"]))), t.bingCovidTitle = bt.default(s || (s = n(["أداة تعقّب الخريطة المباشرة لفيروس كورونا المستجد (كوفيد-19) على Bing من Microsoft"], ["أداة تعقّب الخريطة المباشرة لفيروس كورونا المستجد (كوفيد-19) على Bing من Microsoft"]))), t.citiesAndProvinces = bt.default(d || (d = n(["المناطق"], ["المناطق"]))), t.noRegionalData = bt.default(u || (u = n(["البيانات الإقليمية غير متاحة بعد لهذه البلد/المنطقة. أعِد المحاولة لاحقًا."], ["البيانات الإقليمية غير متاحة بعد لهذه البلد/المنطقة. أعِد المحاولة لاحقًا."]))), t.activeCases = bt.default(c || (c = n(["حالات نشِطة"], ["حالات نشِطة"]))), t.recoveredCases = bt.default(f || (f = n(["حالات متعافية"], ["حالات متعافية"]))), t.fatalCases = bt.default(p || (p = n(["حالات مميتة"], ["حالات مميتة"]))), t.activeCasesForCallout = bt.default(m || (m = n(["نشِطة"], ["نشِطة"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["متعافية"], ["متعافية"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["مُميتة"], ["مُميتة"]))), t.overview = bt.default(g || (g = n(["نظرة عامة"], ["نظرة عامة"]))), t.close = bt.default(b || (b = n(["إغلاق"], ["إغلاق"]))), t.selectARegion = bt.default(k || (k = n(["حدّد منطقة"], ["حدّد منطقة"]))), t.global = bt.default(y || (y = n(["عالميًا"], ["عالميًا"]))), t.globalStatus = bt.default(C || (C = n(["الوضع العالمي"], ["الوضع العالمي"]))), t.allRegions = bt.default(w || (w = n(["جميع الأقاليم"], ["جميع الأقاليم"]))), t.share = bt.default(x || (x = n(["مشاركة"], ["مشاركة"]))), t.dataInfo = bt.default(T || (T = n(["معلومات البيانات"], ["معلومات البيانات"]))), t.totalConfirmed = bt.default(z || (z = n(["إجمالي الحالات المؤكدة"], ["إجمالي الحالات المؤكدة"]))), t.totalConfirmedShort = bt.default(S || (S = n(["إجمالي الحالات"], ["إجمالي الحالات"]))), t.totalAreas = bt.default(I || (I = n(["الإجمالي ", ""], ["الإجمالي ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["إخفاء المعلومات لمشاهدة الخريطة كاملةً"], ["إخفاء المعلومات لمشاهدة الخريطة كاملةً"]))), t.showInfo = bt.default(D || (D = n(["عرض المعلومات"], ["عرض المعلومات"]))), t.news = bt.default(M || (M = n(["الأخبار"], ["الأخبار"]))), t.helpfulResources = bt.default(E || (E = n(["مساعدة ومعلومات"], ["مساعدة ومعلومات"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["الاطّلاع على المزيد"], ["الاطّلاع على المزيد"]))), t.dataFrom = bt.default(O || (O = n(["البيانات من:"], ["البيانات من:"]))), t.videos = bt.default(R || (R = n(["مقاطع الفيديو"], ["مقاطع الفيديو"]))), t.moreNews = bt.default(_ || (_ = n(["عرض مزيد من المقالات"], ["عرض مزيد من المقالات"]))), t.moreVideos = bt.default(N || (N = n(["عرض مزيد من مقاطع الفيديو"], ["عرض مزيد من مقاطع الفيديو"]))), t.map = bt.default(V || (V = n(["الخريطة:"], ["الخريطة:"]))), t.feedback = bt.default(U || (U = n(["تقديم ملاحظات"], ["تقديم ملاحظات"]))), t.feedbackQuestion = bt.default(q || (q = n(["ما نوع الملاحظات لديك حول هذه الأداة؟"], ["ما نوع الملاحظات لديك حول هذه الأداة؟"]))), t.feedbackReportIssue = bt.default(H || (H = n(["الإبلاغ عن مشكلة"], ["الإبلاغ عن مشكلة"]))), t.feedbackTellIssue = bt.default(G || (G = n(["أخبرنا عن المشكلة"], ["أخبرنا عن المشكلة"]))), t.feedbackShareIdea = bt.default(W || (W = n(["مشاركة فكرة"], ["مشاركة فكرة"]))), t.feedbackTellIdea = bt.default(K || (K = n(["أخبرنا عن فكرتك"], ["أخبرنا عن فكرتك"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["تقديم ثناء"], ["تقديم ثناء"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["أخبرنا بما يعجبك"], ["أخبرنا بما يعجبك"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["مصدر قلق قانوني أو يتعلّق بالخصوصية"], ["مصدر قلق قانوني أو يتعلّق بالخصوصية"]))), t.feedbackTellConcern = bt.default(J || (J = n(["أخبرنا عن مصدر القلق"], ["أخبرنا عن مصدر القلق"]))), t.feedbackTextEntry = bt.default(X || (X = n(["أدخِل الملاحظات هنا. للمساعدة في حماية خصوصيتك، لا تضمّن معلومات شخصية، مثل عنوانك أو رقم هاتفك"], ["أدخِل الملاحظات هنا. للمساعدة في حماية خصوصيتك، لا تضمّن معلومات شخصية، مثل عنوانك أو رقم هاتفك"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["عودة للخلف"], ["عودة للخلف"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["إرسال"], ["إرسال"]))), t.feedbackThanks = bt.default(te || (te = n(["نشكرك على تعليقاتك!"], ["نشكرك على تعليقاتك!"]))), t.privacyStatement = bt.default(ae || (ae = n(["بيان الخصوصية"], ["بيان الخصوصية"]))), t.websiteDescription = bt.default(ne || (ne = n(["تعقّب حالات الإصابة المحلية والعالمية بفيروس كورونا المستجّد (كوفيد-19) مع توضيح للحالات النشطة والحالات المتعافية من الإصابة ومعدّل الوفيات على الخريطة، مع أخبار ومقاطع فيديو يومية."], ["تعقّب حالات الإصابة المحلية والعالمية بفيروس كورونا المستجّد (كوفيد-19) مع توضيح للحالات النشطة والحالات المتعافية من الإصابة ومعدّل الوفيات على الخريطة، مع أخبار ومقاطع فيديو يومية."]))), t.graphOverTime = bt.default(ie || (ie = n(["معدّل الانتشار بمرور الزمن"], ["معدّل الانتشار بمرور الزمن"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " مليون"], ["", " مليون"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " ألف"], ["", " ألف"])), 0), t.upsellDesc = bt.default(le || (le = n(["تعقّب آخر المستجدّات على هاتفك باستخدام تطبيق Bing"], ["تعقّب آخر المستجدّات على هاتفك باستخدام تطبيق Bing"]))), t.upsellCTA = bt.default(se || (se = n(["تنزيل الآن"], ["تنزيل الآن"]))), t.upsellTitle = bt.default(de || (de = n(["متابعة أخبار فيروس كورونا المستجّد"], ["متابعة أخبار فيروس كورونا المستجّد"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["تعقّب فيروس كورونا المستجّد"], ["تعقّب فيروس كورونا المستجّد"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["احصل على آخر تحديثات فيروس كورونا على Bing من خلال إضافة ملحقنا على المستعرض Chrome"], ["احصل على آخر تحديثات فيروس كورونا على Bing من خلال إضافة ملحقنا على المستعرض Chrome"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["احصل على آخر تحديثات فيروس كورونا على Bing من خلال إضافة ملحقنا على المستعرض Firefox"], ["احصل على آخر تحديثات فيروس كورونا على Bing من خلال إضافة ملحقنا على المستعرض Firefox"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["إضافة الملحق"], ["إضافة الملحق"]))), t.dseUpsellTitle = bt.default(me || (me = n(["ابقَ آمنًا، ابق على اطلاع"], ["ابقَ آمنًا، ابق على اطلاع"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["تعقّب باستخدام الملحق"], ["تعقّب باستخدام الملحق"]))), t.submit = bt.default(he || (he = n(["تمّ"], ["تمّ"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "ع"], ["", "ع"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "ش"], ["", "ش"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "أ"], ["", "أ"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "ي"], ["", "ي"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "س"], ["", "س"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "د"], ["", "د"])), 0), t.yourLocation = bt.default(xe || (xe = n(["موقعك"], ["موقعك"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["تصفية إلى موقع"], ["تصفية إلى موقع"]))), t.expand = bt.default(ze || (ze = n(["توسيع"], ["توسيع"]))), t.trends = bt.default(Se || (Se = n(["التوجهات"], ["التوجهات"]))), t.testingProcess = bt.default(Ie || (Ie = n(["معلومات الاختبار"], ["معلومات الاختبار"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["البروتوكول وجهات الاتصال"], ["البروتوكول وجهات الاتصال"]))), t.testingProcessProtocol = bt.default(De || (De = n(["البروتوكول"], ["البروتوكول"]))), t.hotline = bt.default(Me || (Me = n(["الخط الساخن"], ["الخط الساخن"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["الشركات الشريكة"], ["الشركات الشريكة"]))), t.moreTestingLocations = bt.default(je || (je = n(["الاطّلاع على مواقع الاختبار (", ")"], ["الاطّلاع على مواقع الاختبار (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["الاطّلاع على معلومات أقل"], ["الاطّلاع على معلومات أقل"]))), t.topTrends = bt.default(Be || (Be = n(["مقارنة حسب الحالات الإجمالية"], ["مقارنة حسب الحالات الإجمالية"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["آخر التحديثات عن فيروس كورونا المستجد"], ["آخر التحديثات عن فيروس كورونا المستجد"]))), t.copyLink = bt.default(Le || (Le = n(["نسخ الرابط"], ["نسخ الرابط"]))), t.email = bt.default(Oe || (Oe = n(["بريد إلكتروني"], ["بريد إلكتروني"]))), t.cancel = bt.default(Re || (Re = n(["إلغاء"], ["إلغاء"]))), t.confirmed = bt.default(_e || (_e = n(["مؤكّدة"], ["مؤكّدة"]))), t.fatal = bt.default(Ne || (Ne = n(["مُميتة"], ["مُميتة"]))), t.recovered = bt.default(Ve || (Ve = n(["متعافية"], ["متعافية"]))), t.active = bt.default(Ue || (Ue = n(["نشِطة"], ["نشِطة"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["للاطّلاع على موقعك، عليك بتمكين أذونات الموقع من هنا."], ["للاطّلاع على موقعك، عليك بتمكين أذونات الموقع من هنا."]))), t.overviewVertical = bt.default(He || (He = n(["نظرة عامة"], ["نظرة عامة"]))), t.newsvideos = bt.default(Ge || (Ge = n(["الأخبار ومقاطع الفيديو"], ["الأخبار ومقاطع الفيديو"]))), t.graphstrends = bt.default(We || (We = n(["الرسومات البيانية"], ["الرسومات البيانية"]))), t.localResources = bt.default(Ke || (Ke = n(["الموارد المحلية"], ["الموارد المحلية"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["تم التحديث منذ ", " دقيقة"], ["تم التحديث منذ ", " دقيقة"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["بإرسال رقم هاتفك أو عنوان بريدك الإلكتروني، فأنت توافق على تلقّي رسالة مبرمَجة لمرّة واحدة من Microsoft إلى رقم الهاتف الجوّال أو عنوان البريد الإلكتروني هذا. يتم تطبيق أسعار الرسائل النصية القصيرة (SMS) القياسية."], ["بإرسال رقم هاتفك أو عنوان بريدك الإلكتروني، فأنت توافق على تلقّي رسالة مبرمَجة لمرّة واحدة من Microsoft إلى رقم الهاتف الجوّال أو عنوان البريد الإلكتروني هذا. يتم تطبيق أسعار الرسائل النصية القصيرة (SMS) القياسية."]))), t.msPrivacyTitle = bt.default(at || (at = n(["بيان الخصوصية من Microsoft"], ["بيان الخصوصية من Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["إرسال رابط"], ["إرسال رابط"]))), t.compare = bt.default(it || (it = n(["مقارنة"], ["مقارنة"]))), t.browse = bt.default(rt || (rt = n(["يستعرض"], ["يستعرض"]))), t.favorites = bt.default(ot || (ot = n(["المفضلة"], ["المفضلة"]))), t.validNumberRequired = bt.default(lt || (lt = n(["يُرجى إدخال رقم هاتف بالولايات المتحدة صالح."], ["يُرجى إدخال رقم هاتف بالولايات المتحدة صالح."]))), t.opalSMSAccepted = bt.default(st || (st = n(["شكرًا لك. يُرجى تجربة الرابط المُرسَل إلى هاتفك في غضون ساعة."], ["شكرًا لك. يُرجى تجربة الرابط المُرسَل إلى هاتفك في غضون ساعة."]))), t.opalSMSError = bt.default(dt || (dt = n(['حدث خطأ، يُرجى تنزيل تطبيق "بحث Bing" من متجر التطبيقات.'], ['حدث خطأ، يُرجى تنزيل تطبيق "بحث Bing" من متجر التطبيقات.']))), t.moreOnTopic = bt.default(ut || (ut = n(["عرض المزيد عن ", ""], ["عرض المزيد عن ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["عرض عناصر أقل عن ", ""], ["عرض عناصر أقل عن ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["الموضوعات الرائجة"], ["الموضوعات الرائجة"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["مقياس لوغاريتمي"], ["مقياس لوغاريتمي"]))), t.linearScale = bt.default(vt || (vt = n(["مقياس خطي"], ["مقياس خطي"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["مرحبًا! أنا الروبوت المساعد للردّ على الأسئلة المتداولة حول فيروس كورونا المستجدّ (كوفيد-19) وأنا هنا لتقديم المساعدة بالإجابة على أسئلتكم!"], ["مرحبًا! أنا الروبوت المساعد للردّ على الأسئلة المتداولة حول فيروس كورونا المستجدّ (كوفيد-19) وأنا هنا لتقديم المساعدة بالإجابة على أسئلتكم!"]))), t.dataTitle = bt.default(gt || (gt = n(["البيانات"], ["البيانات"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.bn-in.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["ডেটা সর্বশেষ আপডেট করা হয়েছে:"], ["ডেটা সর্বশেষ আপডেট করা হয়েছে:"]))), t.urlCopied = bt.default(r || (r = n(["Url ক্লিপবোর্ডে কপি করা হয়েছে"], ["Url ক্লিপবোর্ডে কপি করা হয়েছে"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19 ট্র্যাকার"], ["COVID-19 ট্র্যাকার"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing দ্বারা প্রদত্ত করোনাভাইরাসের (COVID-19) লাইভ মানচিত্র ট্র্যাকার"], ["Microsoft Bing দ্বারা প্রদত্ত করোনাভাইরাসের (COVID-19) লাইভ মানচিত্র ট্র্যাকার"]))), t.citiesAndProvinces = bt.default(d || (d = n(["অঞ্চলসমূহ"], ["অঞ্চলসমূহ"]))), t.noRegionalData = bt.default(u || (u = n(["এই দেশ/অঞ্চলের আঞ্চলিক ডেটা এখনও পর্যন্ত উপলভ্য নয়। পরে আবার চেষ্টা করুন।"], ["এই দেশ/অঞ্চলের আঞ্চলিক ডেটা এখনও পর্যন্ত উপলভ্য নয়। পরে আবার চেষ্টা করুন।"]))), t.activeCases = bt.default(c || (c = n(["সক্রিয় কেস"], ["সক্রিয় কেস"]))), t.recoveredCases = bt.default(f || (f = n(["আরোগ্যপ্রাপ্ত কেস"], ["আরোগ্যপ্রাপ্ত কেস"]))), t.fatalCases = bt.default(p || (p = n(["প্রাণঘাতী কেস"], ["প্রাণঘাতী কেস"]))), t.activeCasesForCallout = bt.default(m || (m = n(["সক্রিয়"], ["সক্রিয়"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["আরোগ্যপ্রাপ্ত"], ["আরোগ্যপ্রাপ্ত"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["প্রাণঘাতী"], ["প্রাণঘাতী"]))), t.overview = bt.default(g || (g = n(["পরিস্থিতি"], ["পরিস্থিতি"]))), t.close = bt.default(b || (b = n(["বন্ধ করুন"], ["বন্ধ করুন"]))), t.selectARegion = bt.default(k || (k = n(["একটি অঞ্চল নির্বাচন করুন"], ["একটি অঞ্চল নির্বাচন করুন"]))), t.global = bt.default(y || (y = n(["বিশ্বব্যাপী"], ["বিশ্বব্যাপী"]))), t.globalStatus = bt.default(C || (C = n(["বিশ্বব্যাপী স্থিতি"], ["বিশ্বব্যাপী স্থিতি"]))), t.allRegions = bt.default(w || (w = n(["সব অঞ্চল"], ["সব অঞ্চল"]))), t.share = bt.default(x || (x = n(["শেয়ার করুন"], ["শেয়ার করুন"]))), t.dataInfo = bt.default(T || (T = n(["ডেটা সংক্রান্ত তথ্য"], ["ডেটা সংক্রান্ত তথ্য"]))), t.totalConfirmed = bt.default(z || (z = n(["মোট সুনিশ্চিত কেস"], ["মোট সুনিশ্চিত কেস"]))), t.totalConfirmedShort = bt.default(S || (S = n(["মোট কেস"], ["মোট কেস"]))), t.totalAreas = bt.default(I || (I = n(["মোট ", ""], ["মোট ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["সম্পূর্ণ মানচিত্র দেখতে তথ্য লুকান"], ["সম্পূর্ণ মানচিত্র দেখতে তথ্য লুকান"]))), t.showInfo = bt.default(D || (D = n(["তথ্য দেখান"], ["তথ্য দেখান"]))), t.news = bt.default(M || (M = n(["খবর"], ["খবর"]))), t.helpfulResources = bt.default(E || (E = n(["সহায়তা এবং তথ্য"], ["সহায়তা এবং তথ্য"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["আরও দেখুন"], ["আরও দেখুন"]))), t.dataFrom = bt.default(O || (O = n(["ডেটা প্রদানকারী:"], ["ডেটা প্রদানকারী:"]))), t.videos = bt.default(R || (R = n(["ভিডিও"], ["ভিডিও"]))), t.moreNews = bt.default(_ || (_ = n(["আরও নিবন্ধ দেখুন"], ["আরও নিবন্ধ দেখুন"]))), t.moreVideos = bt.default(N || (N = n(["আরও ভিডিও দেখুন"], ["আরও ভিডিও দেখুন"]))), t.map = bt.default(V || (V = n(["মানচিত্র:"], ["মানচিত্র:"]))), t.feedback = bt.default(U || (U = n(["মতামত দিন"], ["মতামত দিন"]))), t.feedbackQuestion = bt.default(q || (q = n(["এই সরঞ্জামটির সম্বন্ধে আপনি কি ধরনের মতামত দিতে চান?"], ["এই সরঞ্জামটির সম্বন্ধে আপনি কি ধরনের মতামত দিতে চান?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["কোনো সমস্যা রিপোর্ট করুন"], ["কোনো সমস্যা রিপোর্ট করুন"]))), t.feedbackTellIssue = bt.default(G || (G = n(["সমস্যাটির সম্বন্ধে আমাদের বলুন"], ["সমস্যাটির সম্বন্ধে আমাদের বলুন"]))), t.feedbackShareIdea = bt.default(W || (W = n(["কোনো ধারণা শেয়ার করুন"], ["কোনো ধারণা শেয়ার করুন"]))), t.feedbackTellIdea = bt.default(K || (K = n(["আপনার ধারণা সম্বন্ধে আমাদের বলুন"], ["আপনার ধারণা সম্বন্ধে আমাদের বলুন"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["প্রশংসামূলক মতামত দিন"], ["প্রশংসামূলক মতামত দিন"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["আপনার যা পছন্দ তার সম্বন্ধে আমাদের বলুন"], ["আপনার যা পছন্দ তার সম্বন্ধে আমাদের বলুন"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["আইনগত অথবা গোপনীয়তা সংক্রান্ত উদ্বেগ"], ["আইনগত অথবা গোপনীয়তা সংক্রান্ত উদ্বেগ"]))), t.feedbackTellConcern = bt.default(J || (J = n(["আপনার উদ্বেগ সম্বন্ধে আমাদের বলুন"], ["আপনার উদ্বেগ সম্বন্ধে আমাদের বলুন"]))), t.feedbackTextEntry = bt.default(X || (X = n(["এখানে মতামত টাইপ করুন। আপনার গোপনীয়তাকে সুরক্ষিত রাখতে, ব্যক্তিগত তথ্য দেবেন না, যেমন আপনার ঠিকানা অথবা ফোন নম্বর"], ["এখানে মতামত টাইপ করুন। আপনার গোপনীয়তাকে সুরক্ষিত রাখতে, ব্যক্তিগত তথ্য দেবেন না, যেমন আপনার ঠিকানা অথবা ফোন নম্বর"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["ফিরে যান"], ["ফিরে যান"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["পাঠান"], ["পাঠান"]))), t.feedbackThanks = bt.default(te || (te = n(["আপনার মতামতের জন্য ধন্যবাদ!"], ["আপনার মতামতের জন্য ধন্যবাদ!"]))), t.privacyStatement = bt.default(ae || (ae = n(["গোপনীয়তা বিবৃতি"], ["গোপনীয়তা বিবৃতি"]))), t.websiteDescription = bt.default(ne || (ne = n(["COVID-19 সংক্রান্ত স্থানীয় এবং বিশ্বব্যাপী সক্রিয়, আরোগ্যপ্রাপ্ত কেস এবং মৃত্যুর হারের পরিসংখ্যান সহ করোনাভাইরাসের কেসগুলি মানচিত্রতে ট্র্যাক করুন, এবং সঙ্গে দৈনন্দিন খবর এবং ভিডিও দেখুন।"], ["COVID-19 সংক্রান্ত স্থানীয় এবং বিশ্বব্যাপী সক্রিয়, আরোগ্যপ্রাপ্ত কেস এবং মৃত্যুর হারের পরিসংখ্যান সহ করোনাভাইরাসের কেসগুলি মানচিত্রতে ট্র্যাক করুন, এবং সঙ্গে দৈনন্দিন খবর এবং ভিডিও দেখুন।"]))), t.graphOverTime = bt.default(ie || (ie = n(["সময়ের সাথে বিস্তার"], ["সময়ের সাথে বিস্তার"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "M"], ["", "M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = bt.default(le || (le = n(["Bing অ্যাপের মাধ্যমে আপনার ফোনে সাম্প্রতিক আপডেটগুলি ট্র্যাক করুন"], ["Bing অ্যাপের মাধ্যমে আপনার ফোনে সাম্প্রতিক আপডেটগুলি ট্র্যাক করুন"]))), t.upsellCTA = bt.default(se || (se = n(["এখন ডাউনলোড করুন"], ["এখন ডাউনলোড করুন"]))), t.upsellTitle = bt.default(de || (de = n(["করোনাভাইরাস সংক্রান্ত খবর দেখুন"], ["করোনাভাইরাস সংক্রান্ত খবর দেখুন"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["করোনাভাইরাস ট্র্যাক করুন"], ["করোনাভাইরাস ট্র্যাক করুন"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["আপনি আমাদের Chrome এক্সটেনশনটি যোগ করার মাধ্যমে Bing-এ করোনাভাইরাস সংক্রান্ত সাম্প্রতিক আপডেটগুলি পেতে পারেন"], ["আপনি আমাদের Chrome এক্সটেনশনটি যোগ করার মাধ্যমে Bing-এ করোনাভাইরাস সংক্রান্ত সাম্প্রতিক আপডেটগুলি পেতে পারেন"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["আপনি আমাদের Firefox এক্সটেনশনটি যোগ করার মাধ্যমে Bing-এ করোনাভাইরাস সংক্রান্ত সাম্প্রতিক আপডেটগুলি পেতে পারেন"], ["আপনি আমাদের Firefox এক্সটেনশনটি যোগ করার মাধ্যমে Bing-এ করোনাভাইরাস সংক্রান্ত সাম্প্রতিক আপডেটগুলি পেতে পারেন"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["এক্সটেনশনটি যোগ করুন"], ["এক্সটেনশনটি যোগ করুন"]))), t.dseUpsellTitle = bt.default(me || (me = n(["সুরক্ষিত থাকুন, অবগত থাকুন"], ["সুরক্ষিত থাকুন, অবগত থাকুন"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["এক্সটেনশনের মাধ্যমে ট্র্যাক করুন"], ["এক্সটেনশনের মাধ্যমে ট্র্যাক করুন"]))), t.submit = bt.default(he || (he = n(["সম্পন্ন"], ["সম্পন্ন"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "y"], ["", "y"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "M"], ["", "M"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "w"], ["", "w"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "h"], ["", "h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["আপনার স্থান"], ["আপনার স্থান"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["কোনো স্থান অনুযায়ী ফিল্টার করুন"], ["কোনো স্থান অনুযায়ী ফিল্টার করুন"]))), t.expand = bt.default(ze || (ze = n(["প্রসারিত করুন"], ["প্রসারিত করুন"]))), t.trends = bt.default(Se || (Se = n(["ট্রেন্ড"], ["ট্রেন্ড"]))), t.testingProcess = bt.default(Ie || (Ie = n(["টেস্টিং-এর তথ্য"], ["টেস্টিং-এর তথ্য"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["প্রোটোকল এবং যোগাযোগ"], ["প্রোটোকল এবং যোগাযোগ"]))), t.testingProcessProtocol = bt.default(De || (De = n(["প্রোটোকল"], ["প্রোটোকল"]))), t.hotline = bt.default(Me || (Me = n(["হটলাইন"], ["হটলাইন"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["পার্টনার কোম্পানি"], ["পার্টনার কোম্পানি"]))), t.moreTestingLocations = bt.default(je || (je = n(["টেস্টিং-এর স্থানগুলি দেখুন (", ")"], ["টেস্টিং-এর স্থানগুলি দেখুন (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["কম দেখুন"], ["কম দেখুন"]))), t.topTrends = bt.default(Be || (Be = n(["মোট কেস অনুযায়ী তুলনা"], ["মোট কেস অনুযায়ী তুলনা"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["করোনাভাইরাস সংক্রান্ত সাম্প্রতিক আপডেট"], ["করোনাভাইরাস সংক্রান্ত সাম্প্রতিক আপডেট"]))), t.copyLink = bt.default(Le || (Le = n(["লিঙ্ক কপি করুন"], ["লিঙ্ক কপি করুন"]))), t.email = bt.default(Oe || (Oe = n(["ইমেল"], ["ইমেল"]))), t.cancel = bt.default(Re || (Re = n(["বাতিল করুন"], ["বাতিল করুন"]))), t.confirmed = bt.default(_e || (_e = n(["সুনিশ্চিত"], ["সুনিশ্চিত"]))), t.fatal = bt.default(Ne || (Ne = n(["প্রাণঘাতী"], ["প্রাণঘাতী"]))), t.recovered = bt.default(Ve || (Ve = n(["আরোগ্যপ্রাপ্ত"], ["আরোগ্যপ্রাপ্ত"]))), t.active = bt.default(Ue || (Ue = n(["সক্রিয়"], ["সক্রিয়"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["আপনার স্থান দেখার জন্য, স্থান সংক্রান্ত অনুমতিগুলি এখানে সক্রিয় করুন।"], ["আপনার স্থান দেখার জন্য, স্থান সংক্রান্ত অনুমতিগুলি এখানে সক্রিয় করুন।"]))), t.overviewVertical = bt.default(He || (He = n(["পরিস্থিতি"], ["পরিস্থিতি"]))), t.newsvideos = bt.default(Ge || (Ge = n(["খবর এবং ভিডিও"], ["খবর এবং ভিডিও"]))), t.graphstrends = bt.default(We || (We = n(["গ্রাফ"], ["গ্রাফ"]))), t.localResources = bt.default(Ke || (Ke = n(["স্থানীয় সংস্থান"], ["স্থানীয় সংস্থান"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " মিনিট আগে আপডেট করা হয়েছে"], ["", " মিনিট আগে আপডেট করা হয়েছে"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["আপনার ফোন নম্বর অথবা ইমেল পাঠানোর মাধ্যমে, আপনি এই মোবাইল ফোন নম্বর অথবা ইমেলে Microsoft থেকে একটি এককালীন স্বয়ংক্রিয় বার্তা গ্রহণ করতে সম্মত হন। SMS-এর সাধারণ মূল্য প্রযোজ্য হবে।"], ["আপনার ফোন নম্বর অথবা ইমেল পাঠানোর মাধ্যমে, আপনি এই মোবাইল ফোন নম্বর অথবা ইমেলে Microsoft থেকে একটি এককালীন স্বয়ংক্রিয় বার্তা গ্রহণ করতে সম্মত হন। SMS-এর সাধারণ মূল্য প্রযোজ্য হবে।"]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft গোপনীয়তা বিবৃতি"], ["Microsoft গোপনীয়তা বিবৃতি"]))), t.sendLink = bt.default(nt || (nt = n(["লিঙ্ক পাঠান"], ["লিঙ্ক পাঠান"]))), t.compare = bt.default(it || (it = n(["তুলনা করুন"], ["তুলনা করুন"]))), t.browse = bt.default(rt || (rt = n(["ব্রাউজ করা"], ["ব্রাউজ করা"]))), t.favorites = bt.default(ot || (ot = n(["পচ্ছন্দসই"], ["পচ্ছন্দসই"]))), t.validNumberRequired = bt.default(lt || (lt = n(["অনুগ্রহ করে একটি বৈধ US ফোন নম্বর টাইপ করুন।"], ["অনুগ্রহ করে একটি বৈধ US ফোন নম্বর টাইপ করুন।"]))), t.opalSMSAccepted = bt.default(st || (st = n(["ধন্যবাদ। অনুগ্রহ করে আপনার ফোনে পাঠানো লিঙ্কটিকে এক ঘন্টার মধ্যে ব্যবহার করে চেষ্টা করুন।"], ["ধন্যবাদ। অনুগ্রহ করে আপনার ফোনে পাঠানো লিঙ্কটিকে এক ঘন্টার মধ্যে ব্যবহার করে চেষ্টা করুন।"]))), t.opalSMSError = bt.default(dt || (dt = n(["ত্রুটি ঘটেছে, অনুগ্রহ করে অ্যাপ স্টোর থেকে Bing সন্ধান অ্যাপটি ডাউনলোড করুন।"], ["ত্রুটি ঘটেছে, অনুগ্রহ করে অ্যাপ স্টোর থেকে Bing সন্ধান অ্যাপটি ডাউনলোড করুন।"]))), t.moreOnTopic = bt.default(ut || (ut = n(["", "-এর সম্বন্ধে আরও"], ["", "-এর সম্বন্ধে আরও"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["", "-এর সম্বন্ধে কম"], ["", "-এর সম্বন্ধে কম"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["ট্রেন্ডিং প্রসঙ্গ"], ["ট্রেন্ডিং প্রসঙ্গ"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["লগ স্কেল"], ["লগ স্কেল"]))), t.linearScale = bt.default(vt || (vt = n(["রৈখিক স্কেল"], ["রৈখিক স্কেল"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["নমস্কার! আমি COVID-19 FAQ সহায়ক বট এবং আমি আপনার প্রশ্নের উত্তর দিতে এসেছি!"], ["নমস্কার! আমি COVID-19 FAQ সহায়ক বট এবং আমি আপনার প্রশ্নের উত্তর দিতে এসেছি!"]))), t.dataTitle = bt.default(gt || (gt = n(["ডেটা"], ["ডেটা"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.cs-cz.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Poslední aktualizace údajů:"], ["Poslední aktualizace údajů:"]))), t.urlCopied = bt.default(r || (r = n(["Adresa URL zkopírována do schránky"], ["Adresa URL zkopírována do schránky"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19 Tracker"], ["COVID-19 Tracker"]))), t.bingCovidTitle = bt.default(s || (s = n(["Živé sledování koronaviru (COVID-19) na mapě od Microsoft Bing"], ["Živé sledování koronaviru (COVID-19) na mapě od Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Oblasti"], ["Oblasti"]))), t.noRegionalData = bt.default(u || (u = n(["Údaje z regionů nejsou v této zemi/oblasti zatím dostupné. Zkuste to znovu později."], ["Údaje z regionů nejsou v této zemi/oblasti zatím dostupné. Zkuste to znovu později."]))), t.activeCases = bt.default(c || (c = n(["Aktivní případy"], ["Aktivní případy"]))), t.recoveredCases = bt.default(f || (f = n(["Počet zotavených"], ["Počet zotavených"]))), t.fatalCases = bt.default(p || (p = n(["Mrtví"], ["Mrtví"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktivní"], ["Aktivní"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Zotavení"], ["Zotavení"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["úmrtí"], ["úmrtí"]))), t.overview = bt.default(g || (g = n(["Přehled"], ["Přehled"]))), t.close = bt.default(b || (b = n(["Zavřít"], ["Zavřít"]))), t.selectARegion = bt.default(k || (k = n(["Vyberte oblast"], ["Vyberte oblast"]))), t.global = bt.default(y || (y = n(["Celý svět"], ["Celý svět"]))), t.globalStatus = bt.default(C || (C = n(["Celosvětový stav"], ["Celosvětový stav"]))), t.allRegions = bt.default(w || (w = n(["Všechny oblasti"], ["Všechny oblasti"]))), t.share = bt.default(x || (x = n(["Sdílet"], ["Sdílet"]))), t.dataInfo = bt.default(T || (T = n(["Informace o údajích"], ["Informace o údajích"]))), t.totalConfirmed = bt.default(z || (z = n(["Celkem potvrzených případů"], ["Celkem potvrzených případů"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Případů celkem"], ["Případů celkem"]))), t.totalAreas = bt.default(I || (I = n(["Celkem ", ""], ["Celkem ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Skrýt informace a zobrazit celou mapu"], ["Skrýt informace a zobrazit celou mapu"]))), t.showInfo = bt.default(D || (D = n(["Zobrazit informace"], ["Zobrazit informace"]))), t.news = bt.default(M || (M = n(["Zprávy"], ["Zprávy"]))), t.helpfulResources = bt.default(E || (E = n(["Užitečné informace"], ["Užitečné informace"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Zobrazit více"], ["Zobrazit více"]))), t.dataFrom = bt.default(O || (O = n(["Zdroj údajů:"], ["Zdroj údajů:"]))), t.videos = bt.default(R || (R = n(["Videa"], ["Videa"]))), t.moreNews = bt.default(_ || (_ = n(["Zobrazit více článků"], ["Zobrazit více článků"]))), t.moreVideos = bt.default(N || (N = n(["Zobrazit více videí"], ["Zobrazit více videí"]))), t.map = bt.default(V || (V = n(["Mapa:"], ["Mapa:"]))), t.feedback = bt.default(U || (U = n(["Poslat zpětnou vazbu"], ["Poslat zpětnou vazbu"]))), t.feedbackQuestion = bt.default(q || (q = n(["Jaký druh zpětné vazby nám k tomuto nástroji chcete poslat?"], ["Jaký druh zpětné vazby nám k tomuto nástroji chcete poslat?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Nahlásit problém"], ["Nahlásit problém"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Povězte nám o problému."], ["Povězte nám o problému."]))), t.feedbackShareIdea = bt.default(W || (W = n(["Podělit se o nápad"], ["Podělit se o nápad"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Povězte nám o svém nápadu."], ["Povězte nám o svém nápadu."]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Udělit pochvalu"], ["Udělit pochvalu"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Povězte nám, co se vám líbí."], ["Povězte nám, co se vám líbí."]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Právní problém nebo problém s ochranou soukromí"], ["Právní problém nebo problém s ochranou soukromí"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Povězte nám, co vás znepokojuje."], ["Povězte nám, co vás znepokojuje."]))), t.feedbackTextEntry = bt.default(X || (X = n(["Sem zadejte zpětnou vazbu. Z důvodu ochrany soukromí nezadávejte žádné osobní údaje, jako je adresa nebo telefonní číslo."], ["Sem zadejte zpětnou vazbu. Z důvodu ochrany soukromí nezadávejte žádné osobní údaje, jako je adresa nebo telefonní číslo."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Zpět"], ["Zpět"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Poslat"], ["Poslat"]))), t.feedbackThanks = bt.default(te || (te = n(["Děkujeme za zpětnou vazbu!"], ["Děkujeme za zpětnou vazbu!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Prohlášení o zásadách ochrany osobních údajů"], ["Prohlášení o zásadách ochrany osobních údajů"]))), t.websiteDescription = bt.default(ne || (ne = n(["Sledujte na mapě potvrzené případy, zotavené případy a úmrtí na nemoc COVID-19 ve vaší oblasti i ve světě. Také zde najdete nejnovější zprávy a videa."], ["Sledujte na mapě potvrzené případy, zotavené případy a úmrtí na nemoc COVID-19 ve vaší oblasti i ve světě. Také zde najdete nejnovější zprávy a videa."]))), t.graphOverTime = bt.default(ie || (ie = n(["Šíření v čase"], ["Šíření v čase"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " mil."], ["", " mil."])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " tis."], ["", " tis."])), 0), t.upsellDesc = bt.default(le || (le = n(["Sledujte nejnovější aktualizace na svém telefonu v aplikaci Bing."], ["Sledujte nejnovější aktualizace na svém telefonu v aplikaci Bing."]))), t.upsellCTA = bt.default(se || (se = n(["Stáhnout"], ["Stáhnout"]))), t.upsellTitle = bt.default(de || (de = n(["Sledujte zprávy o koronaviru"], ["Sledujte zprávy o koronaviru"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Sledovat koronavirus"], ["Sledovat koronavirus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Když si přidáte rozšíření do Chromu, získáte nejnovější informace o koronaviru."], ["Když si přidáte rozšíření do Chromu, získáte nejnovější informace o koronaviru."]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Když si přidáte rozšíření do Firefoxu, získáte nejnovější informace o koronaviru."], ["Když si přidáte rozšíření do Firefoxu, získáte nejnovější informace o koronaviru."]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Přidat rozšíření"], ["Přidat rozšíření"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Aktuální informace"], ["Aktuální informace"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Sledovat v rozšíření"], ["Sledovat v rozšíření"]))), t.submit = bt.default(he || (he = n(["Hotovo"], ["Hotovo"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " r."], ["", " r."])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " měs."], ["", " měs."])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " týd."], ["", " týd."])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " d."], ["", " d."])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " h."], ["", " h."])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " m."], ["", " m."])), 0), t.yourLocation = bt.default(xe || (xe = n(["Vaše poloha"], ["Vaše poloha"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtrovat podle polohy"], ["Filtrovat podle polohy"]))), t.expand = bt.default(ze || (ze = n(["Rozbalit"], ["Rozbalit"]))), t.trends = bt.default(Se || (Se = n(["Tendence"], ["Tendence"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Informace o vyšetření"], ["Informace o vyšetření"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Postup a kontakt"], ["Postup a kontakt"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokol"], ["Protokol"]))), t.hotline = bt.default(Me || (Me = n(["Horká linka"], ["Horká linka"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Partnerské společnosti"], ["Partnerské společnosti"]))), t.moreTestingLocations = bt.default(je || (je = n(["Zobrazit testovací místa (", ")"], ["Zobrazit testovací místa (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Zobrazit méně"], ["Zobrazit méně"]))), t.topTrends = bt.default(Be || (Be = n(["Srovnání podle celkového počtu případů"], ["Srovnání podle celkového počtu případů"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Nejnovější zprávy o koronaviru"], ["Nejnovější zprávy o koronaviru"]))), t.copyLink = bt.default(Le || (Le = n(["Zkopírovat odkaz"], ["Zkopírovat odkaz"]))), t.email = bt.default(Oe || (Oe = n(["E-mail"], ["E-mail"]))), t.cancel = bt.default(Re || (Re = n(["Zrušit"], ["Zrušit"]))), t.confirmed = bt.default(_e || (_e = n(["Potvrzené případy"], ["Potvrzené případy"]))), t.fatal = bt.default(Ne || (Ne = n(["Úmrtí"], ["Úmrtí"]))), t.recovered = bt.default(Ve || (Ve = n(["Počet zotavených"], ["Počet zotavených"]))), t.active = bt.default(Ue || (Ue = n(["Aktivní"], ["Aktivní"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Vaše poloha se zobrazí, až udělíte přístup k údajům o poloze zde."], ["Vaše poloha se zobrazí, až udělíte přístup k údajům o poloze zde."]))), t.overviewVertical = bt.default(He || (He = n(["Přehled"], ["Přehled"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Zprávy a videa"], ["Zprávy a videa"]))), t.graphstrends = bt.default(We || (We = n(["Grafy"], ["Grafy"]))), t.localResources = bt.default(Ke || (Ke = n(["Místní zdroje"], ["Místní zdroje"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Aktualizováno před ", " min"], ["Aktualizováno před ", " min"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Odesláním svého telefonního čísla nebo e-mailu souhlasíte se zasláním jednorázové automatizované zprávy od společnosti Microsoft na toto mobilní telefonní číslo nebo e-mail. Účtují se základní poplatky za zasílání SMS zpráv."], ["Odesláním svého telefonního čísla nebo e-mailu souhlasíte se zasláním jednorázové automatizované zprávy od společnosti Microsoft na toto mobilní telefonní číslo nebo e-mail. Účtují se základní poplatky za zasílání SMS zpráv."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Prohlášení o ochraně osobních údajů společnosti Microsoft"], ["Prohlášení o ochraně osobních údajů společnosti Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Odeslat odkaz"], ["Odeslat odkaz"]))), t.compare = bt.default(it || (it = n(["Srovnat"], ["Srovnat"]))), t.browse = bt.default(rt || (rt = n(["Procházet"], ["Procházet"]))), t.favorites = bt.default(ot || (ot = n(["Oblíbené"], ["Oblíbené"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Zadejte platné telefonní číslo v USA."], ["Zadejte platné telefonní číslo v USA."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Děkujeme. Vyzkoušejte odkaz, který během následující hodiny obdržíte ve svém telefonu."], ["Děkujeme. Vyzkoušejte odkaz, který během následující hodiny obdržíte ve svém telefonu."]))), t.opalSMSError = bt.default(dt || (dt = n(["Došlo k chybě. Stáhněte si aplikaci Bing Search z obchodu s aplikacemi."], ["Došlo k chybě. Stáhněte si aplikaci Bing Search z obchodu s aplikacemi."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Zobrazit více na téma ", ""], ["Zobrazit více na téma ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Zobrazit méně na téma ", ""], ["Zobrazit méně na téma ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Nejčtenější témata"], ["Nejčtenější témata"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logaritmická stupnice"], ["Logaritmická stupnice"]))), t.linearScale = bt.default(vt || (vt = n(["Lineární stupnice"], ["Lineární stupnice"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Dobrý den! Jsem robotický pomocník a můžete se mě ptát na vše o COVID-19."], ["Dobrý den! Jsem robotický pomocník a můžete se mě ptát na vše o COVID-19."]))), t.dataTitle = bt.default(gt || (gt = n(["Údaje"], ["Údaje"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.da-dk.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Dataene blev senest opdateret:"], ["Dataene blev senest opdateret:"]))), t.urlCopied = bt.default(r || (r = n(["URL kopieret til Udklipsholder"], ["URL kopieret til Udklipsholder"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19-sporing"], ["COVID-19-sporing"]))), t.bingCovidTitle = bt.default(s || (s = n(["Livekortsporing af coronavirus (COVID-19) fra Microsoft Bing"], ["Livekortsporing af coronavirus (COVID-19) fra Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Områder"], ["Områder"]))), t.noRegionalData = bt.default(u || (u = n(["Regionale data er endnu ikke tilgængelige for dette land/område. Prøv igen senere."], ["Regionale data er endnu ikke tilgængelige for dette land/område. Prøv igen senere."]))), t.activeCases = bt.default(c || (c = n(["Aktive tilfælde"], ["Aktive tilfælde"]))), t.recoveredCases = bt.default(f || (f = n(["Helbredte tilfælde"], ["Helbredte tilfælde"]))), t.fatalCases = bt.default(p || (p = n(["Tilfælde med dødelig udgang"], ["Tilfælde med dødelig udgang"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktive"], ["Aktive"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Helbredte"], ["Helbredte"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Døde"], ["Døde"]))), t.overview = bt.default(g || (g = n(["Oversigt"], ["Oversigt"]))), t.close = bt.default(b || (b = n(["Luk"], ["Luk"]))), t.selectARegion = bt.default(k || (k = n(["Vælg et område"], ["Vælg et område"]))), t.global = bt.default(y || (y = n(["Globalt"], ["Globalt"]))), t.globalStatus = bt.default(C || (C = n(["Global status"], ["Global status"]))), t.allRegions = bt.default(w || (w = n(["Alle områder"], ["Alle områder"]))), t.share = bt.default(x || (x = n(["Del"], ["Del"]))), t.dataInfo = bt.default(T || (T = n(["Dataoplysninger"], ["Dataoplysninger"]))), t.totalConfirmed = bt.default(z || (z = n(["Bekræftede tilfælde i alt"], ["Bekræftede tilfælde i alt"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Tilfælde i alt"], ["Tilfælde i alt"]))), t.totalAreas = bt.default(I || (I = n(["", " i alt"], ["", " i alt"])), 0), t.hideInfo = bt.default(A || (A = n(["Skjul oplysninger for at se hele kortet"], ["Skjul oplysninger for at se hele kortet"]))), t.showInfo = bt.default(D || (D = n(["Vis oplysninger"], ["Vis oplysninger"]))), t.news = bt.default(M || (M = n(["Nyheder"], ["Nyheder"]))), t.helpfulResources = bt.default(E || (E = n(["Hjælp og oplysninger"], ["Hjælp og oplysninger"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Se mere"], ["Se mere"]))), t.dataFrom = bt.default(O || (O = n(["Data fra:"], ["Data fra:"]))), t.videos = bt.default(R || (R = n(["Videoer"], ["Videoer"]))), t.moreNews = bt.default(_ || (_ = n(["Se flere artikler"], ["Se flere artikler"]))), t.moreVideos = bt.default(N || (N = n(["Se flere videoer"], ["Se flere videoer"]))), t.map = bt.default(V || (V = n(["Kort:"], ["Kort:"]))), t.feedback = bt.default(U || (U = n(["Giv feedback"], ["Giv feedback"]))), t.feedbackQuestion = bt.default(q || (q = n(["Hvilken type feedback har du om dette værktøj?"], ["Hvilken type feedback har du om dette værktøj?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Rapportér et problem"], ["Rapportér et problem"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Fortæl os om problemet"], ["Fortæl os om problemet"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Del en idé"], ["Del en idé"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Fortæl os om din idé"], ["Fortæl os om din idé"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Giv en kompliment"], ["Giv en kompliment"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Fortæl os, hvad du kan lide"], ["Fortæl os, hvad du kan lide"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Bekymring om juridiske forhold eller personlige oplysninger"], ["Bekymring om juridiske forhold eller personlige oplysninger"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Fortæl os om din bekymring"], ["Fortæl os om din bekymring"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Skriv feedback her. For at beskytte dine personlige oplysninger bør du ikke angive personlige oplysninger som f.eks. din adresse eller dit telefonnummer"], ["Skriv feedback her. For at beskytte dine personlige oplysninger bør du ikke angive personlige oplysninger som f.eks. din adresse eller dit telefonnummer"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Gå tilbage"], ["Gå tilbage"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Send"], ["Send"]))), t.feedbackThanks = bt.default(te || (te = n(["Tak for din feedback!"], ["Tak for din feedback!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Erklæring om beskyttelse af personlige oplysninger"], ["Erklæring om beskyttelse af personlige oplysninger"]))), t.websiteDescription = bt.default(ne || (ne = n(["Følg lokale og globale COVID-19-tilfælde med aktive tilfælde, helbredte tilfælde og dødelighed på kortet, med daglige nyheder og video."], ["Følg lokale og globale COVID-19-tilfælde med aktive tilfælde, helbredte tilfælde og dødelighed på kortet, med daglige nyheder og video."]))), t.graphOverTime = bt.default(ie || (ie = n(["Spredning over tid"], ["Spredning over tid"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " mio."], ["", " mio."])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = bt.default(le || (le = n(["Følg de seneste opdateringer på din telefon med Bing-appen"], ["Følg de seneste opdateringer på din telefon med Bing-appen"]))), t.upsellCTA = bt.default(se || (se = n(["Download nu"], ["Download nu"]))), t.upsellTitle = bt.default(de || (de = n(["Følg nyheder om coronavirus"], ["Følg nyheder om coronavirus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Spor coronavirussen"], ["Spor coronavirussen"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Få de seneste opdateringer om coronavirus på Bing, når du tilføjer vores Chrome-udvidelse"], ["Få de seneste opdateringer om coronavirus på Bing, når du tilføjer vores Chrome-udvidelse"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Få de seneste opdateringer om coronavirus på Bing, når du tilføjer vores Firefox-udvidelse"], ["Få de seneste opdateringer om coronavirus på Bing, når du tilføjer vores Firefox-udvidelse"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Tilføj udvidelsen"], ["Tilføj udvidelsen"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Hold dig sikker og informeret"], ["Hold dig sikker og informeret"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Spor med udvidelse"], ["Spor med udvidelse"]))), t.submit = bt.default(he || (he = n(["Udført"], ["Udført"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "å"], ["", "å"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "md"], ["", "md"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "u"], ["", "u"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "t"], ["", "t"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Din placering"], ["Din placering"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtrer til en placering"], ["Filtrer til en placering"]))), t.expand = bt.default(ze || (ze = n(["Udvid"], ["Udvid"]))), t.trends = bt.default(Se || (Se = n(["Tendenser"], ["Tendenser"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Testoplysninger"], ["Testoplysninger"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokol og kontakt"], ["Protokol og kontakt"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokol"], ["Protokol"]))), t.hotline = bt.default(Me || (Me = n(["Hotline"], ["Hotline"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Partnervirksomheder"], ["Partnervirksomheder"]))), t.moreTestingLocations = bt.default(je || (je = n(["Se teststeder (", ")"], ["Se teststeder (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Se mindre"], ["Se mindre"]))), t.topTrends = bt.default(Be || (Be = n(["Sammenligning ud fra tilfælde i alt"], ["Sammenligning ud fra tilfælde i alt"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Seneste opdateringer om coronavirus"], ["Seneste opdateringer om coronavirus"]))), t.copyLink = bt.default(Le || (Le = n(["Kopiér link"], ["Kopiér link"]))), t.email = bt.default(Oe || (Oe = n(["Mail"], ["Mail"]))), t.cancel = bt.default(Re || (Re = n(["Annuller"], ["Annuller"]))), t.confirmed = bt.default(_e || (_e = n(["Bekræftede"], ["Bekræftede"]))), t.fatal = bt.default(Ne || (Ne = n(["Døde"], ["Døde"]))), t.recovered = bt.default(Ve || (Ve = n(["Helbredte"], ["Helbredte"]))), t.active = bt.default(Ue || (Ue = n(["Aktive"], ["Aktive"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Aktivér placeringstilladelser her for at se din placering."], ["Aktivér placeringstilladelser her for at se din placering."]))), t.overviewVertical = bt.default(He || (He = n(["Oversigt"], ["Oversigt"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Nyheder og videoer"], ["Nyheder og videoer"]))), t.graphstrends = bt.default(We || (We = n(["Grafer"], ["Grafer"]))), t.localResources = bt.default(Ke || (Ke = n(["Lokale ressourcer"], ["Lokale ressourcer"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Opdateret for ", " min. siden"], ["Opdateret for ", " min. siden"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Ved at sende dit telefonnummer eller din mailadresse accepterer du at modtage en automatisk engangsbesked fra Microsoft på telefonnummeret eller mailadressen. Der gælder almindelige SMS-takster."], ["Ved at sende dit telefonnummer eller din mailadresse accepterer du at modtage en automatisk engangsbesked fra Microsoft på telefonnummeret eller mailadressen. Der gælder almindelige SMS-takster."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsofts erklæring om beskyttelse af personlige oplysninger"], ["Microsofts erklæring om beskyttelse af personlige oplysninger"]))), t.sendLink = bt.default(nt || (nt = n(["Send link"], ["Send link"]))), t.compare = bt.default(it || (it = n(["Sammenlign"], ["Sammenlign"]))), t.browse = bt.default(rt || (rt = n(["Gennemse"], ["Gennemse"]))), t.favorites = bt.default(ot || (ot = n(["Favoritter"], ["Favoritter"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Angiv et gyldigt amerikansk telefonnummer."], ["Angiv et gyldigt amerikansk telefonnummer."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Tak. Prøv det link, der er blevet sendt til din telefon, inden for en time."], ["Tak. Prøv det link, der er blevet sendt til din telefon, inden for en time."]))), t.opalSMSError = bt.default(dt || (dt = n(["Der opstod en fejl. Download appen Bing Search fra appbutikken."], ["Der opstod en fejl. Download appen Bing Search fra appbutikken."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Mere om ", ""], ["Mere om ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Mindre om ", ""], ["Mindre om ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Populære emner"], ["Populære emner"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logaritmisk skala"], ["Logaritmisk skala"]))), t.linearScale = bt.default(vt || (vt = n(["Lineær skala"], ["Lineær skala"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hej! Jeg er COVID-19 FAQ-hjælperrobotten, og jeg kan hjælpe med at svare på dine spørgsmål!"], ["Hej! Jeg er COVID-19 FAQ-hjælperrobotten, og jeg kan hjælpe med at svare på dine spørgsmål!"]))), t.dataTitle = bt.default(gt || (gt = n(["Data"], ["Data"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.de-de.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Letzte Aktualisierung der Daten:"], ["Letzte Aktualisierung der Daten:"]))), t.urlCopied = bt.default(r || (r = n(["URL in Zwischenablage kopiert"], ["URL in Zwischenablage kopiert"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19-Tracker"], ["COVID-19-Tracker"]))), t.bingCovidTitle = bt.default(s || (s = n(["Live-Karten-Tracker zum Coronavirus (COVID-19) von Microsoft Bing"], ["Live-Karten-Tracker zum Coronavirus (COVID-19) von Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regionen"], ["Regionen"]))), t.noRegionalData = bt.default(u || (u = n(["Regionale Daten sind für dieses Land/diese Region noch nicht verfügbar. Versuchen Sie es später nochmal."], ["Regionale Daten sind für dieses Land/diese Region noch nicht verfügbar. Versuchen Sie es später nochmal."]))), t.activeCases = bt.default(c || (c = n(["Aktive Fälle"], ["Aktive Fälle"]))), t.recoveredCases = bt.default(f || (f = n(["Geheilte Fälle"], ["Geheilte Fälle"]))), t.fatalCases = bt.default(p || (p = n(["Todesfälle"], ["Todesfälle"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktive Fälle"], ["Aktive Fälle"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Geheilt"], ["Geheilt"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Todesfälle"], ["Todesfälle"]))), t.overview = bt.default(g || (g = n(["Übersicht"], ["Übersicht"]))), t.close = bt.default(b || (b = n(["Schließen"], ["Schließen"]))), t.selectARegion = bt.default(k || (k = n(["Region auswählen"], ["Region auswählen"]))), t.global = bt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = bt.default(C || (C = n(["Globaler Status"], ["Globaler Status"]))), t.allRegions = bt.default(w || (w = n(["Alle Regionen"], ["Alle Regionen"]))), t.share = bt.default(x || (x = n(["Teilen"], ["Teilen"]))), t.dataInfo = bt.default(T || (T = n(["Daten"], ["Daten"]))), t.totalConfirmed = bt.default(z || (z = n(["Bestätigte Fälle insgesamt"], ["Bestätigte Fälle insgesamt"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Fälle insgesamt"], ["Fälle insgesamt"]))), t.totalAreas = bt.default(I || (I = n(["", " insgesamt"], ["", " insgesamt"])), 0), t.hideInfo = bt.default(A || (A = n(["Info ausblenden, um vollständige Karte anzuzeigen"], ["Info ausblenden, um vollständige Karte anzuzeigen"]))), t.showInfo = bt.default(D || (D = n(["Info anzeigen"], ["Info anzeigen"]))), t.news = bt.default(M || (M = n(["News"], ["News"]))), t.helpfulResources = bt.default(E || (E = n(["Hilfe und Informationen"], ["Hilfe und Informationen"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Mehr anzeigen"], ["Mehr anzeigen"]))), t.dataFrom = bt.default(O || (O = n(["Quelle:"], ["Quelle:"]))), t.videos = bt.default(R || (R = n(["Videos"], ["Videos"]))), t.moreNews = bt.default(_ || (_ = n(["Weitere Artikel anzeigen"], ["Weitere Artikel anzeigen"]))), t.moreVideos = bt.default(N || (N = n(["Weitere Videos anzeigen"], ["Weitere Videos anzeigen"]))), t.map = bt.default(V || (V = n(["Karte:"], ["Karte:"]))), t.feedback = bt.default(U || (U = n(["Feedback senden"], ["Feedback senden"]))), t.feedbackQuestion = bt.default(q || (q = n(["Welches Feedback haben Sie zu diesem Tool?"], ["Welches Feedback haben Sie zu diesem Tool?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Problem melden"], ["Problem melden"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Teilen Sie uns Ihr Anliegen mit"], ["Teilen Sie uns Ihr Anliegen mit"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Idee vorschlagen"], ["Idee vorschlagen"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Teilen Sie uns Ihre Idee mit"], ["Teilen Sie uns Ihre Idee mit"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Kompliment"], ["Kompliment"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Teilen Sie uns mit, was Ihnen gefällt"], ["Teilen Sie uns mit, was Ihnen gefällt"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Rechtliches oder Datenschutz"], ["Rechtliches oder Datenschutz"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Teilen Sie uns Ihre Bedenken mit"], ["Teilen Sie uns Ihre Bedenken mit"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Geben Sie hier Ihr Feedback ein. Geben Sie aus Datenschutzgründen keine persönlichen Informationen an, wie Ihre Adresse oder Telefonnummer."], ["Geben Sie hier Ihr Feedback ein. Geben Sie aus Datenschutzgründen keine persönlichen Informationen an, wie Ihre Adresse oder Telefonnummer."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Zurück"], ["Zurück"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Senden"], ["Senden"]))), t.feedbackThanks = bt.default(te || (te = n(["Vielen Dank für Ihr Feedback!"], ["Vielen Dank für Ihr Feedback!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Datenschutzbestimmungen"], ["Datenschutzbestimmungen"]))), t.websiteDescription = bt.default(ne || (ne = n(["Auf dieser Karte können Sie lokale und globale COVID-19-Fälle mit Angaben zu aktiven Fällen, geheilten Fällen und Todesfällen nachverfolgen – mit den neuesten News und Videos."], ["Auf dieser Karte können Sie lokale und globale COVID-19-Fälle mit Angaben zu aktiven Fällen, geheilten Fällen und Todesfällen nachverfolgen – mit den neuesten News und Videos."]))), t.graphOverTime = bt.default(ie || (ie = n(["Ausbreitung im Zeitverlauf"], ["Ausbreitung im Zeitverlauf"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " Mio."], ["", " Mio."])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " Tsd."], ["", " Tsd."])), 0), t.upsellDesc = bt.default(le || (le = n(["Mit der Bing-App können Sie die neuesten Entwicklungen auf Ihrem Smartphone nachverfolgen"], ["Mit der Bing-App können Sie die neuesten Entwicklungen auf Ihrem Smartphone nachverfolgen"]))), t.upsellCTA = bt.default(se || (se = n(["Jetzt herunterladen"], ["Jetzt herunterladen"]))), t.upsellTitle = bt.default(de || (de = n(["Folgen Sie aktuellen Nachrichten zum Coronavirus"], ["Folgen Sie aktuellen Nachrichten zum Coronavirus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Coronavirus nachverfolgen"], ["Coronavirus nachverfolgen"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Fügen Sie unsere Chrome-Erweiterung hinzu, damit Sie stets aktuelle Nachrichten zum Coronavirus in Bing erhalten."], ["Fügen Sie unsere Chrome-Erweiterung hinzu, damit Sie stets aktuelle Nachrichten zum Coronavirus in Bing erhalten."]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Fügen Sie unsere Firefox-Erweiterung hinzu, damit Sie stets aktuelle Nachrichten zum Coronavirus in Bing erhalten."], ["Fügen Sie unsere Firefox-Erweiterung hinzu, damit Sie stets aktuelle Nachrichten zum Coronavirus in Bing erhalten."]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Erweiterung hinzufügen"], ["Erweiterung hinzufügen"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Informieren Sie sich"], ["Informieren Sie sich"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Nachverfolgung mit der Erweiterung"], ["Nachverfolgung mit der Erweiterung"]))), t.submit = bt.default(he || (he = n(["Fertig"], ["Fertig"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " J."], ["", " J."])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " M."], ["", " M."])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " W."], ["", " W."])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " T."], ["", " T."])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " Std."], ["", " Std."])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " Min."], ["", " Min."])), 0), t.yourLocation = bt.default(xe || (xe = n(["Ihr Standort"], ["Ihr Standort"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Standort filtern"], ["Standort filtern"]))), t.expand = bt.default(ze || (ze = n(["Erweitern"], ["Erweitern"]))), t.trends = bt.default(Se || (Se = n(["Trends"], ["Trends"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Testinformationen"], ["Testinformationen"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokoll und Kontakt"], ["Protokoll und Kontakt"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokoll"], ["Protokoll"]))), t.hotline = bt.default(Me || (Me = n(["Hotline"], ["Hotline"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Partnerunternehmen"], ["Partnerunternehmen"]))), t.moreTestingLocations = bt.default(je || (je = n(["Teststellen anzeigen (", ")"], ["Teststellen anzeigen (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Weniger anzeigen"], ["Weniger anzeigen"]))), t.topTrends = bt.default(Be || (Be = n(["Fallzahlentwicklung"], ["Fallzahlentwicklung"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Neueste News zum Coronavirus"], ["Neueste News zum Coronavirus"]))), t.copyLink = bt.default(Le || (Le = n(["Link kopieren"], ["Link kopieren"]))), t.email = bt.default(Oe || (Oe = n(["E-Mail senden"], ["E-Mail senden"]))), t.cancel = bt.default(Re || (Re = n(["Abbrechen"], ["Abbrechen"]))), t.confirmed = bt.default(_e || (_e = n(["Bestätigte Fälle"], ["Bestätigte Fälle"]))), t.fatal = bt.default(Ne || (Ne = n(["Tödlich"], ["Tödlich"]))), t.recovered = bt.default(Ve || (Ve = n(["Geheilt"], ["Geheilt"]))), t.active = bt.default(Ue || (Ue = n(["Aktive Fälle"], ["Aktive Fälle"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Zum Anzeigen Ihres Ortes aktivieren Sie hier Ihre Standortberechtigungen."], ["Zum Anzeigen Ihres Ortes aktivieren Sie hier Ihre Standortberechtigungen."]))), t.overviewVertical = bt.default(He || (He = n(["Übersicht"], ["Übersicht"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Nachrichten und Videos"], ["Nachrichten und Videos"]))), t.graphstrends = bt.default(We || (We = n(["Diagramme"], ["Diagramme"]))), t.localResources = bt.default(Ke || (Ke = n(["Lokale Ressourcen"], ["Lokale Ressourcen"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Vor ", " Minuten aktualisiert"], ["Vor ", " Minuten aktualisiert"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Wenn Sie Ihre Telefonnummer oder E-Mail-Adresse senden, erklären Sie sich damit einverstanden, dass Microsoft Ihnen einmalig eine automatisierte Nachricht an diese Mobiltelefonnummer oder E-Mail-Adresse sendet. Es gelten die SMS-Standardgebühren."], ["Wenn Sie Ihre Telefonnummer oder E-Mail-Adresse senden, erklären Sie sich damit einverstanden, dass Microsoft Ihnen einmalig eine automatisierte Nachricht an diese Mobiltelefonnummer oder E-Mail-Adresse sendet. Es gelten die SMS-Standardgebühren."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft-Datenschutzbestimmungen"], ["Microsoft-Datenschutzbestimmungen"]))), t.sendLink = bt.default(nt || (nt = n(["Link senden"], ["Link senden"]))), t.compare = bt.default(it || (it = n(["Vergleichen"], ["Vergleichen"]))), t.browse = bt.default(rt || (rt = n(["Durchsuchen"], ["Durchsuchen"]))), t.favorites = bt.default(ot || (ot = n(["Favoriten"], ["Favoriten"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Bitte geben Sie eine gültige Telefonnummer aus den USA ein."], ["Bitte geben Sie eine gültige Telefonnummer aus den USA ein."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Vielen Dank. Bitte verwenden Sie den Link, der an Ihr Telefon gesendet wurde, innerhalb einer Stunde."], ["Vielen Dank. Bitte verwenden Sie den Link, der an Ihr Telefon gesendet wurde, innerhalb einer Stunde."]))), t.opalSMSError = bt.default(dt || (dt = n(["Ein Fehler ist aufgetreten. Bitte laden Sie die App für die Bing-Suche aus dem App Store herunter."], ["Ein Fehler ist aufgetreten. Bitte laden Sie die App für die Bing-Suche aus dem App Store herunter."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Mehr zum Thema „", "“"], ["Mehr zum Thema „", "“"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Weniger zum Thema „", "“"], ["Weniger zum Thema „", "“"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Beliebte Themen"], ["Beliebte Themen"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logarithmische Darstellung"], ["Logarithmische Darstellung"]))), t.linearScale = bt.default(vt || (vt = n(["Lineare Darstellung"], ["Lineare Darstellung"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hallo! Ich bin der FAQ-Hilfe-Bot für COVID-19 und beantworte gerne Ihre Fragen!"], ["Hallo! Ich bin der FAQ-Hilfe-Bot für COVID-19 und beantworte gerne Ihre Fragen!"]))), t.dataTitle = bt.default(gt || (gt = n(["Daten"], ["Daten"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.el-gr.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Τελευταία ενημέρωση δεδομένων:"], ["Τελευταία ενημέρωση δεδομένων:"]))), t.urlCopied = bt.default(r || (r = n(["Η διεύθυνση URL αντιγράφηκε στο πρόχειρο"], ["Η διεύθυνση URL αντιγράφηκε στο πρόχειρο"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Παρακολούθηση COVID-19"], ["Παρακολούθηση COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Παρακολούθηση κορωνοϊού (COVID-19) με χάρτη σε πραγματικό χρόνο από το Microsoft Bing"], ["Παρακολούθηση κορωνοϊού (COVID-19) με χάρτη σε πραγματικό χρόνο από το Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Περιοχές"], ["Περιοχές"]))), t.noRegionalData = bt.default(u || (u = n(["Τοπικά δεδομένα για αυτή τη χώρα/περιοχή δεν είναι διαθέσιμα προς το παρόν. Δοκιμάστε ξανά αργότερα."], ["Τοπικά δεδομένα για αυτή τη χώρα/περιοχή δεν είναι διαθέσιμα προς το παρόν. Δοκιμάστε ξανά αργότερα."]))), t.activeCases = bt.default(c || (c = n(["Ενεργά κρούσματα"], ["Ενεργά κρούσματα"]))), t.recoveredCases = bt.default(f || (f = n(["Περιστατικά ανάρρωσης"], ["Περιστατικά ανάρρωσης"]))), t.fatalCases = bt.default(p || (p = n(["Θανατηφόρα κρούσματα"], ["Θανατηφόρα κρούσματα"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Ενεργά"], ["Ενεργά"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Ανάρρωσαν"], ["Ανάρρωσαν"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Θανατηφόρα"], ["Θανατηφόρα"]))), t.overview = bt.default(g || (g = n(["Επισκόπηση"], ["Επισκόπηση"]))), t.close = bt.default(b || (b = n(["Κλείσιμο"], ["Κλείσιμο"]))), t.selectARegion = bt.default(k || (k = n(["Επιλογή περιοχής"], ["Επιλογή περιοχής"]))), t.global = bt.default(y || (y = n(["Παγκοσμίως"], ["Παγκοσμίως"]))), t.globalStatus = bt.default(C || (C = n(["Κατάσταση παγκοσμίως"], ["Κατάσταση παγκοσμίως"]))), t.allRegions = bt.default(w || (w = n(["Όλες οι περιοχές"], ["Όλες οι περιοχές"]))), t.share = bt.default(x || (x = n(["Κοινή χρήση"], ["Κοινή χρήση"]))), t.dataInfo = bt.default(T || (T = n(["Πληροφορίες δεδομένων"], ["Πληροφορίες δεδομένων"]))), t.totalConfirmed = bt.default(z || (z = n(["Συνολικά επιβεβαιωμένα περιστατικά"], ["Συνολικά επιβεβαιωμένα περιστατικά"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Συνολικά περιστατικά"], ["Συνολικά περιστατικά"]))), t.totalAreas = bt.default(I || (I = n(["Σύνολο ", ""], ["Σύνολο ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Απόκρυψη πληροφοριών για εμφάνιση ολόκληρου του χάρτη"], ["Απόκρυψη πληροφοριών για εμφάνιση ολόκληρου του χάρτη"]))), t.showInfo = bt.default(D || (D = n(["Εμφάνιση πληροφοριών"], ["Εμφάνιση πληροφοριών"]))), t.news = bt.default(M || (M = n(["Ειδήσεις"], ["Ειδήσεις"]))), t.helpfulResources = bt.default(E || (E = n(["Βοήθεια και πληροφορίες"], ["Βοήθεια και πληροφορίες"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Εμφάνιση περισσότερων"], ["Εμφάνιση περισσότερων"]))), t.dataFrom = bt.default(O || (O = n(["Δεδομένα από:"], ["Δεδομένα από:"]))), t.videos = bt.default(R || (R = n(["Βίντεο"], ["Βίντεο"]))), t.moreNews = bt.default(_ || (_ = n(["Εμφάνιση περισσότερων άρθρων"], ["Εμφάνιση περισσότερων άρθρων"]))), t.moreVideos = bt.default(N || (N = n(["Εμφάνιση περισσότερων βίντεο"], ["Εμφάνιση περισσότερων βίντεο"]))), t.map = bt.default(V || (V = n(["Χάρτης:"], ["Χάρτης:"]))), t.feedback = bt.default(U || (U = n(["Παροχή σχολίων"], ["Παροχή σχολίων"]))), t.feedbackQuestion = bt.default(q || (q = n(["Τι είδους σχόλια έχετε σχετικά με αυτό το εργαλείο;"], ["Τι είδους σχόλια έχετε σχετικά με αυτό το εργαλείο;"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Αναφέρετε ένα πρόβλημα"], ["Αναφέρετε ένα πρόβλημα"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Πείτε μας για το πρόβλημα"], ["Πείτε μας για το πρόβλημα"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Μοιραστείτε μια ιδέα"], ["Μοιραστείτε μια ιδέα"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Πείτε μας για την ιδέα σας"], ["Πείτε μας για την ιδέα σας"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Δώστε έναν έπαινο"], ["Δώστε έναν έπαινο"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Πείτε μας τι σας αρέσει"], ["Πείτε μας τι σας αρέσει"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Νομικό ζήτημα ή ζήτημα προστασίας προσωπικών δεδομένων"], ["Νομικό ζήτημα ή ζήτημα προστασίας προσωπικών δεδομένων"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Πείτε μας για το ζήτημα"], ["Πείτε μας για το ζήτημα"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Πληκτρολογήστε τα σχόλιά σας εδώ. Για την προστασία των προσωπικών σας δεδομένων, μη συμπεριλάβετε προσωπικές πληροφορίες, όπως τη διεύθυνση ή τον αριθμό τηλεφώνου σας"], ["Πληκτρολογήστε τα σχόλιά σας εδώ. Για την προστασία των προσωπικών σας δεδομένων, μη συμπεριλάβετε προσωπικές πληροφορίες, όπως τη διεύθυνση ή τον αριθμό τηλεφώνου σας"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Επιστροφή"], ["Επιστροφή"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Αποστολή"], ["Αποστολή"]))), t.feedbackThanks = bt.default(te || (te = n(["Ευχαριστούμε για τα σχόλιά σας!"], ["Ευχαριστούμε για τα σχόλιά σας!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Δήλωση προστασίας προσωπικών δεδομένων"], ["Δήλωση προστασίας προσωπικών δεδομένων"]))), t.websiteDescription = bt.default(ne || (ne = n(["Παρακολουθήστε περιστατικά COVID-19 σε τοπικό και παγκόσμιο επίπεδο, με ποσοστό ενεργών κρουσμάτων, περιστατικών ανάρρωσης και θνησιμότητας στον χάρτη, με καθημερινές ειδήσεις και βίντεο."], ["Παρακολουθήστε περιστατικά COVID-19 σε τοπικό και παγκόσμιο επίπεδο, με ποσοστό ενεργών κρουσμάτων, περιστατικών ανάρρωσης και θνησιμότητας στον χάρτη, με καθημερινές ειδήσεις και βίντεο."]))), t.graphOverTime = bt.default(ie || (ie = n(["Εξάπλωση χρονικά"], ["Εξάπλωση χρονικά"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " ΕΚΑΤ."], ["", " ΕΚΑΤ."])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " ΧΙΛ."], ["", " ΧΙΛ."])), 0), t.upsellDesc = bt.default(le || (le = n(["Παρακολουθήστε τα τελευταία νέα στο τηλέφωνό σας με την εφαρμογή Bing"], ["Παρακολουθήστε τα τελευταία νέα στο τηλέφωνό σας με την εφαρμογή Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Λήψη τώρα"], ["Λήψη τώρα"]))), t.upsellTitle = bt.default(de || (de = n(["Παρακολούθηση ειδήσεων για τον κορωνοϊό"], ["Παρακολούθηση ειδήσεων για τον κορωνοϊό"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Παρακολούθηση κορωνοϊού"], ["Παρακολούθηση κορωνοϊού"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Λάβετε τα τελευταία νέα για τον κορωνοϊό στο Bing με την προσθήκη της επέκτασης για Chrome"], ["Λάβετε τα τελευταία νέα για τον κορωνοϊό στο Bing με την προσθήκη της επέκτασης για Chrome"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Λάβετε τα τελευταία νέα για τον κορωνοϊό στο Bing με την προσθήκη της επέκτασης για Firefox"], ["Λάβετε τα τελευταία νέα για τον κορωνοϊό στο Bing με την προσθήκη της επέκτασης για Firefox"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Προσθήκη της επέκτασης"], ["Προσθήκη της επέκτασης"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Μείνετε ασφαλείς, μείνετε ενημερωμένοι"], ["Μείνετε ασφαλείς, μείνετε ενημερωμένοι"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Παρακολούθηση με την επέκταση"], ["Παρακολούθηση με την επέκταση"]))), t.submit = bt.default(he || (he = n(["Τέλος"], ["Τέλος"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " έτη"], ["", " έτη"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " μήν."], ["", " μήν."])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " εβδ."], ["", " εβδ."])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " ημ."], ["", " ημ."])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " ώ."], ["", " ώ."])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " λεπ."], ["", " λεπ."])), 0), t.yourLocation = bt.default(xe || (xe = n(["Η τοποθεσία σας"], ["Η τοποθεσία σας"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Φιλτράρισμα τοποθεσίας"], ["Φιλτράρισμα τοποθεσίας"]))), t.expand = bt.default(ze || (ze = n(["Ανάπτυξη"], ["Ανάπτυξη"]))), t.trends = bt.default(Se || (Se = n(["Τάσεις"], ["Τάσεις"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Πληροφορίες εξέτασης"], ["Πληροφορίες εξέτασης"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Πρωτόκολλο και επικοινωνία"], ["Πρωτόκολλο και επικοινωνία"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Πρωτόκολλο"], ["Πρωτόκολλο"]))), t.hotline = bt.default(Me || (Me = n(["Ανοικτή γραμμή"], ["Ανοικτή γραμμή"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Συνεργαζόμενες εταιρείες"], ["Συνεργαζόμενες εταιρείες"]))), t.moreTestingLocations = bt.default(je || (je = n(["Εμφάνιση τοποθεσιών εξέτασης (", ")"], ["Εμφάνιση τοποθεσιών εξέτασης (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Εμφάνιση λιγότερων"], ["Εμφάνιση λιγότερων"]))), t.topTrends = bt.default(Be || (Be = n(["Σύγκριση κατά συνολικά περιστατικά"], ["Σύγκριση κατά συνολικά περιστατικά"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Τελευταία νέα για τον κορωνοϊό"], ["Τελευταία νέα για τον κορωνοϊό"]))), t.copyLink = bt.default(Le || (Le = n(["Αντιγραφή σύνδεσης"], ["Αντιγραφή σύνδεσης"]))), t.email = bt.default(Oe || (Oe = n(["Email"], ["Email"]))), t.cancel = bt.default(Re || (Re = n(["Άκυρο"], ["Άκυρο"]))), t.confirmed = bt.default(_e || (_e = n(["Επιβεβαιωμένα"], ["Επιβεβαιωμένα"]))), t.fatal = bt.default(Ne || (Ne = n(["Θανατηφόρα"], ["Θανατηφόρα"]))), t.recovered = bt.default(Ve || (Ve = n(["Ανάρρωσαν"], ["Ανάρρωσαν"]))), t.active = bt.default(Ue || (Ue = n(["Ενεργά"], ["Ενεργά"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Για να δείτε την τοποθεσία σας, ενεργοποιήστε τα δικαιώματα τοποθεσίας εδώ."], ["Για να δείτε την τοποθεσία σας, ενεργοποιήστε τα δικαιώματα τοποθεσίας εδώ."]))), t.overviewVertical = bt.default(He || (He = n(["Επισκόπηση"], ["Επισκόπηση"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Ειδήσεις και βίντεο"], ["Ειδήσεις και βίντεο"]))), t.graphstrends = bt.default(We || (We = n(["Γραφήματα"], ["Γραφήματα"]))), t.localResources = bt.default(Ke || (Ke = n(["Τοπικοί πόροι"], ["Τοπικοί πόροι"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Ενημέρωση πριν από ", " λεπτά"], ["Ενημέρωση πριν από ", " λεπτά"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Με την αποστολή του αριθμού τηλεφώνου ή της διεύθυνσης ηλεκτρονικού ταχυδρομείου σας, αποδέχεστε ότι θα λάβετε ένα εφάπαξ αυτοματοποιημένο μήνυμα από τη Microsoft σε αυτόν τον αριθμό κινητού τηλεφώνου ή σε αυτή τη διεύθυνση ηλεκτρονικού ταχυδρομείου. Ισχύουν οι τυπικές χρεώσεις για SMS."], ["Με την αποστολή του αριθμού τηλεφώνου ή της διεύθυνσης ηλεκτρονικού ταχυδρομείου σας, αποδέχεστε ότι θα λάβετε ένα εφάπαξ αυτοματοποιημένο μήνυμα από τη Microsoft σε αυτόν τον αριθμό κινητού τηλεφώνου ή σε αυτή τη διεύθυνση ηλεκτρονικού ταχυδρομείου. Ισχύουν οι τυπικές χρεώσεις για SMS."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Δήλωση προστασίας προσωπικών δεδομένων της Microsoft"], ["Δήλωση προστασίας προσωπικών δεδομένων της Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Αποστολή σύνδεσης"], ["Αποστολή σύνδεσης"]))), t.compare = bt.default(it || (it = n(["Σύγκριση"], ["Σύγκριση"]))), t.browse = bt.default(rt || (rt = n(["Περιήγηση"], ["Περιήγηση"]))), t.favorites = bt.default(ot || (ot = n(["Αγαπημένα"], ["Αγαπημένα"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Πληκτρολογήστε έναν έγκυρο αριθμό τηλεφώνου Η.Π.Α."], ["Πληκτρολογήστε έναν έγκυρο αριθμό τηλεφώνου Η.Π.Α."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Ευχαριστούμε. Δοκιμάστε τη σύνδεση που στάλθηκε στο τηλέφωνό σας εντός της επόμενης ώρας."], ["Ευχαριστούμε. Δοκιμάστε τη σύνδεση που στάλθηκε στο τηλέφωνό σας εντός της επόμενης ώρας."]))), t.opalSMSError = bt.default(dt || (dt = n(["Παρουσιάστηκε σφάλμα, κάντε λήψη της εφαρμογής Αναζήτηση στο Bing από το κατάστημα εφαρμογών."], ["Παρουσιάστηκε σφάλμα, κάντε λήψη της εφαρμογής Αναζήτηση στο Bing από το κατάστημα εφαρμογών."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Περισσότερα για: ", ""], ["Περισσότερα για: ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Λιγότερα για: ", ""], ["Λιγότερα για: ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Δημοφιλή θέματα"], ["Δημοφιλή θέματα"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Λογαριθμική κλίμακα"], ["Λογαριθμική κλίμακα"]))), t.linearScale = bt.default(vt || (vt = n(["Γραμμική κλίμακα"], ["Γραμμική κλίμακα"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Γεια σας! Είμαι το bot-βοηθός για συνήθεις ερωτήσεις σχετικά με τον COVID-19 και είμαι εδώ για να απαντήσω στις ερωτήσεις σας!"], ["Γεια σας! Είμαι το bot-βοηθός για συνήθεις ερωτήσεις σχετικά με τον COVID-19 και είμαι εδώ για να απαντήσω στις ερωτήσεις σας!"]))), t.dataTitle = bt.default(gt || (gt = n(["Δεδομένα"], ["Δεδομένα"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.en-gb.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Data was last updated:"], ["Data was last updated:"]))), t.urlCopied = bt.default(r || (r = n(["Url copied to clipboard"], ["Url copied to clipboard"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19 Tracker"], ["COVID-19 Tracker"]))), t.bingCovidTitle = bt.default(s || (s = n(["Coronavirus (COVID-19) live map tracker from Microsoft Bing"], ["Coronavirus (COVID-19) live map tracker from Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regions"], ["Regions"]))), t.noRegionalData = bt.default(u || (u = n(["Regional data is not available for this country/region yet. Try again later."], ["Regional data is not available for this country/region yet. Try again later."]))), t.activeCases = bt.default(c || (c = n(["Active cases"], ["Active cases"]))), t.recoveredCases = bt.default(f || (f = n(["Recovered cases"], ["Recovered cases"]))), t.fatalCases = bt.default(p || (p = n(["Fatal cases"], ["Fatal cases"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Active"], ["Active"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Recovered"], ["Recovered"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Fatal"], ["Fatal"]))), t.overview = bt.default(g || (g = n(["Overview"], ["Overview"]))), t.close = bt.default(b || (b = n(["Close"], ["Close"]))), t.selectARegion = bt.default(k || (k = n(["Select a region"], ["Select a region"]))), t.global = bt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = bt.default(C || (C = n(["Global Status"], ["Global Status"]))), t.allRegions = bt.default(w || (w = n(["All Regions"], ["All Regions"]))), t.share = bt.default(x || (x = n(["Share"], ["Share"]))), t.dataInfo = bt.default(T || (T = n(["Data information"], ["Data information"]))), t.totalConfirmed = bt.default(z || (z = n(["Total Confirmed Cases"], ["Total Confirmed Cases"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Total cases"], ["Total cases"]))), t.totalAreas = bt.default(I || (I = n(["", " Total"], ["", " Total"])), 0), t.hideInfo = bt.default(A || (A = n(["Hide information to see full map"], ["Hide information to see full map"]))), t.showInfo = bt.default(D || (D = n(["Show information"], ["Show information"]))), t.news = bt.default(M || (M = n(["News"], ["News"]))), t.helpfulResources = bt.default(E || (E = n(["Help & Information"], ["Help & Information"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["See more"], ["See more"]))), t.dataFrom = bt.default(O || (O = n(["Data from:"], ["Data from:"]))), t.videos = bt.default(R || (R = n(["Videos"], ["Videos"]))), t.moreNews = bt.default(_ || (_ = n(["See more articles"], ["See more articles"]))), t.moreVideos = bt.default(N || (N = n(["See more videos"], ["See more videos"]))), t.map = bt.default(V || (V = n(["Map:"], ["Map:"]))), t.feedback = bt.default(U || (U = n(["Give feedback"], ["Give feedback"]))), t.feedbackQuestion = bt.default(q || (q = n(["What kind of feedback do you have about this tool?"], ["What kind of feedback do you have about this tool?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Report an issue"], ["Report an issue"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Tell us about the issue"], ["Tell us about the issue"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Share an idea"], ["Share an idea"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Tell us about your idea"], ["Tell us about your idea"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Give a compliment"], ["Give a compliment"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Tell us what you like"], ["Tell us what you like"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Legal or privacy concern"], ["Legal or privacy concern"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Tell us about your concern"], ["Tell us about your concern"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Enter feedback here. To help protect your privacy, do not include personal information, like your address or phone number"], ["Enter feedback here. To help protect your privacy, do not include personal information, like your address or phone number"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Go back"], ["Go back"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Send"], ["Send"]))), t.feedbackThanks = bt.default(te || (te = n(["Thank you for your feedback!"], ["Thank you for your feedback!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Privacy statement"], ["Privacy statement"]))), t.websiteDescription = bt.default(ne || (ne = n(["Track COVID-19 local and global coronavirus cases with active, recoveries and death rate on the map, with daily news and video."], ["Track COVID-19 local and global coronavirus cases with active, recoveries and death rate on the map, with daily news and video."]))), t.graphOverTime = bt.default(ie || (ie = n(["Spread Over Time"], ["Spread Over Time"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "M"], ["", "M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = bt.default(le || (le = n(["Track the latest updates on your phone with the Bing app"], ["Track the latest updates on your phone with the Bing app"]))), t.upsellCTA = bt.default(se || (se = n(["Download now"], ["Download now"]))), t.upsellTitle = bt.default(de || (de = n(["Follow coronavirus news"], ["Follow coronavirus news"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Track the coronavirus"], ["Track the coronavirus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Get the latest coronavirus updates on Bing when you add our Chrome extension"], ["Get the latest coronavirus updates on Bing when you add our Chrome extension"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Get the latest coronavirus updates on Bing when you add our Firefox extension"], ["Get the latest coronavirus updates on Bing when you add our Firefox extension"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Add the extension"], ["Add the extension"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Track with extension"], ["Track with extension"]))), t.submit = bt.default(he || (he = n(["Done"], ["Done"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "y"], ["", "y"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "M"], ["", "M"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "w"], ["", "w"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "h"], ["", "h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Your Location"], ["Your Location"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filter to a location"], ["Filter to a location"]))), t.expand = bt.default(ze || (ze = n(["Expand"], ["Expand"]))), t.trends = bt.default(Se || (Se = n(["Trends"], ["Trends"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Testing Information"], ["Testing Information"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protocol & Contact"], ["Protocol & Contact"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protocol"], ["Protocol"]))), t.hotline = bt.default(Me || (Me = n(["Hotline"], ["Hotline"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Partner Companies"], ["Partner Companies"]))), t.moreTestingLocations = bt.default(je || (je = n(["See testing locations (", ")"], ["See testing locations (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["See less"], ["See less"]))), t.topTrends = bt.default(Be || (Be = n(["Comparison by total cases"], ["Comparison by total cases"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Latest coronavirus updates"], ["Latest coronavirus updates"]))), t.copyLink = bt.default(Le || (Le = n(["Copy link"], ["Copy link"]))), t.email = bt.default(Oe || (Oe = n(["Email"], ["Email"]))), t.cancel = bt.default(Re || (Re = n(["Cancel"], ["Cancel"]))), t.confirmed = bt.default(_e || (_e = n(["Confirmed"], ["Confirmed"]))), t.fatal = bt.default(Ne || (Ne = n(["Fatal"], ["Fatal"]))), t.recovered = bt.default(Ve || (Ve = n(["Recovered"], ["Recovered"]))), t.active = bt.default(Ue || (Ue = n(["Active"], ["Active"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["To see your location, enable location permissions here."], ["To see your location, enable location permissions here."]))), t.overviewVertical = bt.default(He || (He = n(["Overview"], ["Overview"]))), t.newsvideos = bt.default(Ge || (Ge = n(["News & videos"], ["News & videos"]))), t.graphstrends = bt.default(We || (We = n(["Graphs"], ["Graphs"]))), t.localResources = bt.default(Ke || (Ke = n(["Local resources"], ["Local resources"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Updated ", " min ago"], ["Updated ", " min ago"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["By sending your phone number or email, you agree to receive a one-time automated message from Microsoft to this mobile phone number or email. Standard SMS rates apply."], ["By sending your phone number or email, you agree to receive a one-time automated message from Microsoft to this mobile phone number or email. Standard SMS rates apply."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft Privacy Statement"], ["Microsoft Privacy Statement"]))), t.sendLink = bt.default(nt || (nt = n(["Send link"], ["Send link"]))), t.compare = bt.default(it || (it = n(["Compare"], ["Compare"]))), t.browse = bt.default(rt || (rt = n(["Browse"], ["Browse"]))), t.favorites = bt.default(ot || (ot = n(["Favourites"], ["Favourites"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Please enter a valid US phone number."], ["Please enter a valid US phone number."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Thank you. Please try the link sent to your phone within the hour."], ["Thank you. Please try the link sent to your phone within the hour."]))), t.opalSMSError = bt.default(dt || (dt = n(["Error encountered. Please download the Bing Search app from the app store."], ["Error encountered. Please download the Bing Search app from the app store."]))), t.moreOnTopic = bt.default(ut || (ut = n(["More on ", ""], ["More on ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Less on ", ""], ["Less on ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Trending topics"], ["Trending topics"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Log scale"], ["Log scale"]))), t.linearScale = bt.default(vt || (vt = n(["Linear scale"], ["Linear scale"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hi there! I'm the COVID-19 FAQ helper bot and I'm here to help answer your questions!"], ["Hi there! I'm the COVID-19 FAQ helper bot and I'm here to help answer your questions!"]))), t.dataTitle = bt.default(gt || (gt = n(["Data"], ["Data"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.es-es.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Última actualización de los datos:"], ["Última actualización de los datos:"]))), t.urlCopied = bt.default(r || (r = n(["URL copiada al portapapeles"], ["URL copiada al portapapeles"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Seguimiento de COVID-19"], ["Seguimiento de COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Coronavirus (COVID-19): Mapa de seguimiento en directo de Microsoft Bing"], ["Coronavirus (COVID-19): Mapa de seguimiento en directo de Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regiones"], ["Regiones"]))), t.noRegionalData = bt.default(u || (u = n(["Aún no hay datos regionales disponibles para este país o región. Vuelve a intentarlo más tarde."], ["Aún no hay datos regionales disponibles para este país o región. Vuelve a intentarlo más tarde."]))), t.activeCases = bt.default(c || (c = n(["Casos activos"], ["Casos activos"]))), t.recoveredCases = bt.default(f || (f = n(["Casos con recuperación"], ["Casos con recuperación"]))), t.fatalCases = bt.default(p || (p = n(["Casos mortales"], ["Casos mortales"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Activos"], ["Activos"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Recuperados"], ["Recuperados"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Fallecidos"], ["Fallecidos"]))), t.overview = bt.default(g || (g = n(["Información general"], ["Información general"]))), t.close = bt.default(b || (b = n(["Cerrar"], ["Cerrar"]))), t.selectARegion = bt.default(k || (k = n(["Selecciona una región"], ["Selecciona una región"]))), t.global = bt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = bt.default(C || (C = n(["Estado global"], ["Estado global"]))), t.allRegions = bt.default(w || (w = n(["Todas las regiones"], ["Todas las regiones"]))), t.share = bt.default(x || (x = n(["Compartir"], ["Compartir"]))), t.dataInfo = bt.default(T || (T = n(["Información de los datos"], ["Información de los datos"]))), t.totalConfirmed = bt.default(z || (z = n(["Total de casos confirmados"], ["Total de casos confirmados"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Total de casos"], ["Total de casos"]))), t.totalAreas = bt.default(I || (I = n(["", " en total"], ["", " en total"])), 0), t.hideInfo = bt.default(A || (A = n(["Ocultar información para ver el mapa completo"], ["Ocultar información para ver el mapa completo"]))), t.showInfo = bt.default(D || (D = n(["Mostrar información"], ["Mostrar información"]))), t.news = bt.default(M || (M = n(["Noticias"], ["Noticias"]))), t.helpfulResources = bt.default(E || (E = n(["Información y ayuda"], ["Información y ayuda"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Ver más"], ["Ver más"]))), t.dataFrom = bt.default(O || (O = n(["Datos de:"], ["Datos de:"]))), t.videos = bt.default(R || (R = n(["Vídeos"], ["Vídeos"]))), t.moreNews = bt.default(_ || (_ = n(["Ver más artículos"], ["Ver más artículos"]))), t.moreVideos = bt.default(N || (N = n(["Ver más vídeos"], ["Ver más vídeos"]))), t.map = bt.default(V || (V = n(["Mapa:"], ["Mapa:"]))), t.feedback = bt.default(U || (U = n(["Proporcionar comentarios"], ["Proporcionar comentarios"]))), t.feedbackQuestion = bt.default(q || (q = n(["¿Qué clase de comentarios quieres darnos acerca de esta herramienta?"], ["¿Qué clase de comentarios quieres darnos acerca de esta herramienta?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Notificar un problema"], ["Notificar un problema"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Danos información del problema"], ["Danos información del problema"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Compartir una idea"], ["Compartir una idea"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Cuéntanos tu idea"], ["Cuéntanos tu idea"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Enviar una crítica positiva"], ["Enviar una crítica positiva"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Dinos lo que te gusta"], ["Dinos lo que te gusta"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Problema legal o de privacidad"], ["Problema legal o de privacidad"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Dinos qué es lo que te preocupa"], ["Dinos qué es lo que te preocupa"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Escribe tus comentarios aquí. Para proteger tu privacidad, no incluyas información personal, como tu dirección o tu número de teléfono."], ["Escribe tus comentarios aquí. Para proteger tu privacidad, no incluyas información personal, como tu dirección o tu número de teléfono."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Volver"], ["Volver"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Enviar"], ["Enviar"]))), t.feedbackThanks = bt.default(te || (te = n(["Gracias por tus comentarios."], ["Gracias por tus comentarios."]))), t.privacyStatement = bt.default(ae || (ae = n(["Declaración de privacidad"], ["Declaración de privacidad"]))), t.websiteDescription = bt.default(ne || (ne = n(["Sigue los casos locales y globales de coronavirus (COVID-19), con los casos activos, los curados y la tasa de fallecimientos en el mapa. Incluye vídeos y noticias diarias."], ["Sigue los casos locales y globales de coronavirus (COVID-19), con los casos activos, los curados y la tasa de fallecimientos en el mapa. Incluye vídeos y noticias diarias."]))), t.graphOverTime = bt.default(ie || (ie = n(["Propagación a lo largo del tiempo"], ["Propagación a lo largo del tiempo"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " M"], ["", " M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", ".000"], ["", ".000"])), 0), t.upsellDesc = bt.default(le || (le = n(["Lleva el seguimiento de las actualizaciones más recientes en tu teléfono con la aplicación de Bing"], ["Lleva el seguimiento de las actualizaciones más recientes en tu teléfono con la aplicación de Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Descargar ahora"], ["Descargar ahora"]))), t.upsellTitle = bt.default(de || (de = n(["Seguir noticias del coronavirus"], ["Seguir noticias del coronavirus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Seguimiento del coronavirus"], ["Seguimiento del coronavirus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Agrega nuestra extensión de Chrome para obtener las actualizaciones más recientes sobre el coronavirus en Bing"], ["Agrega nuestra extensión de Chrome para obtener las actualizaciones más recientes sobre el coronavirus en Bing"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Agrega nuestra extensión de Firefox para obtener las actualizaciones más recientes sobre el coronavirus en Bing"], ["Agrega nuestra extensión de Firefox para obtener las actualizaciones más recientes sobre el coronavirus en Bing"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Agregar la extensión"], ["Agregar la extensión"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Mantente sano e informado"], ["Mantente sano e informado"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Seguimiento con la extensión"], ["Seguimiento con la extensión"]))), t.submit = bt.default(he || (he = n(["Listo"], ["Listo"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " años"], ["", " años"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " meses"], ["", " meses"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " sem."], ["", " sem."])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " d"], ["", " d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " h"], ["", " h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " min"], ["", " min"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Tu ubicación"], ["Tu ubicación"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtrar a una ubicación"], ["Filtrar a una ubicación"]))), t.expand = bt.default(ze || (ze = n(["Ampliar"], ["Ampliar"]))), t.trends = bt.default(Se || (Se = n(["Tendencias"], ["Tendencias"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Información de tests"], ["Información de tests"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protocolo y contacto"], ["Protocolo y contacto"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protocolo"], ["Protocolo"]))), t.hotline = bt.default(Me || (Me = n(["Línea directa"], ["Línea directa"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Empresas asociadas"], ["Empresas asociadas"]))), t.moreTestingLocations = bt.default(je || (je = n(["Ver ubicaciones para tests (", ")"], ["Ver ubicaciones para tests (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Ver menos"], ["Ver menos"]))), t.topTrends = bt.default(Be || (Be = n(["Comparación por total de casos"], ["Comparación por total de casos"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Actualizaciones más recientes de coronavirus"], ["Actualizaciones más recientes de coronavirus"]))), t.copyLink = bt.default(Le || (Le = n(["Copiar vínculo"], ["Copiar vínculo"]))), t.email = bt.default(Oe || (Oe = n(["Correo electrónico"], ["Correo electrónico"]))), t.cancel = bt.default(Re || (Re = n(["Cancelar"], ["Cancelar"]))), t.confirmed = bt.default(_e || (_e = n(["Confirmados"], ["Confirmados"]))), t.fatal = bt.default(Ne || (Ne = n(["Fallecidos"], ["Fallecidos"]))), t.recovered = bt.default(Ve || (Ve = n(["Recuperados"], ["Recuperados"]))), t.active = bt.default(Ue || (Ue = n(["Activos"], ["Activos"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Para ver tu ubicación, habilita los permisos de ubicación aquí."], ["Para ver tu ubicación, habilita los permisos de ubicación aquí."]))), t.overviewVertical = bt.default(He || (He = n(["Información general"], ["Información general"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Noticias y vídeos"], ["Noticias y vídeos"]))), t.graphstrends = bt.default(We || (We = n(["Gráficos"], ["Gráficos"]))), t.localResources = bt.default(Ke || (Ke = n(["Recursos locales"], ["Recursos locales"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Actualizado hace ", " min"], ["Actualizado hace ", " min"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Al enviar tu número de teléfono o tu correo electrónico, accedes a recibir un mensaje automatizado único de Microsoft en este número de teléfono móvil o correo electrónico. Se aplican las tarifas de SMS estándar."], ["Al enviar tu número de teléfono o tu correo electrónico, accedes a recibir un mensaje automatizado único de Microsoft en este número de teléfono móvil o correo electrónico. Se aplican las tarifas de SMS estándar."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Declaración de privacidad de Microsoft"], ["Declaración de privacidad de Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Enviar vínculo"], ["Enviar vínculo"]))), t.compare = bt.default(it || (it = n(["Comparar"], ["Comparar"]))), t.browse = bt.default(rt || (rt = n(["Navegar"], ["Navegar"]))), t.favorites = bt.default(ot || (ot = n(["Favoritos"], ["Favoritos"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Introduce un número de teléfono de EE. UU. válido."], ["Introduce un número de teléfono de EE. UU. válido."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Gracias. Prueba el vínculo enviado a tu teléfono antes de que transcurra una hora."], ["Gracias. Prueba el vínculo enviado a tu teléfono antes de que transcurra una hora."]))), t.opalSMSError = bt.default(dt || (dt = n(["Se ha producido un error. Descarga la aplicación de Bing Search en la tienda de aplicaciones."], ["Se ha producido un error. Descarga la aplicación de Bing Search en la tienda de aplicaciones."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Más sobre ", ""], ["Más sobre ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Menos sobre ", ""], ["Menos sobre ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Temas de actualidad"], ["Temas de actualidad"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Escala logarítmica"], ["Escala logarítmica"]))), t.linearScale = bt.default(vt || (vt = n(["Escala lineal"], ["Escala lineal"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["¡Hola! Soy el bot de preguntas rápidas sobre la COVID-19 y estoy aquí para ayudarte a resolver tus dudas."], ["¡Hola! Soy el bot de preguntas rápidas sobre la COVID-19 y estoy aquí para ayudarte a resolver tus dudas."]))), t.dataTitle = bt.default(gt || (gt = n(["Datos"], ["Datos"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.fi-fi.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Tiedot päivitettiin viimeksi:"], ["Tiedot päivitettiin viimeksi:"]))), t.urlCopied = bt.default(r || (r = n(["URL kopioitu leikepöydälle"], ["URL kopioitu leikepöydälle"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19-seuranta"], ["COVID-19-seuranta"]))), t.bingCovidTitle = bt.default(s || (s = n(["Bing koronaviruslive-karttaseuranta (COVID-19) Microsoft Bingiltä"], ["Bing koronaviruslive-karttaseuranta (COVID-19) Microsoft Bingiltä"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Alueet"], ["Alueet"]))), t.noRegionalData = bt.default(u || (u = n(["Tälle maalle/alueelle ei ole vielä saatavana alueellisia tietoja. Yritä myöhemmin uudelleen."], ["Tälle maalle/alueelle ei ole vielä saatavana alueellisia tietoja. Yritä myöhemmin uudelleen."]))), t.activeCases = bt.default(c || (c = n(["Aktiiviset tapaukset"], ["Aktiiviset tapaukset"]))), t.recoveredCases = bt.default(f || (f = n(["Parantuneet tapaukset"], ["Parantuneet tapaukset"]))), t.fatalCases = bt.default(p || (p = n(["Kuolemantapaukset"], ["Kuolemantapaukset"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktiivisia"], ["Aktiivisia"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Parantuneita"], ["Parantuneita"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Kuolemantapaukset"], ["Kuolemantapaukset"]))), t.overview = bt.default(g || (g = n(["Yleiskatsaus"], ["Yleiskatsaus"]))), t.close = bt.default(b || (b = n(["Sulje"], ["Sulje"]))), t.selectARegion = bt.default(k || (k = n(["Valitse alue"], ["Valitse alue"]))), t.global = bt.default(y || (y = n(["Maailmanlaajuinen"], ["Maailmanlaajuinen"]))), t.globalStatus = bt.default(C || (C = n(["Maailmanlaajuinen tilanne"], ["Maailmanlaajuinen tilanne"]))), t.allRegions = bt.default(w || (w = n(["Kaikki alueet"], ["Kaikki alueet"]))), t.share = bt.default(x || (x = n(["Jaa"], ["Jaa"]))), t.dataInfo = bt.default(T || (T = n(["Datan tiedot"], ["Datan tiedot"]))), t.totalConfirmed = bt.default(z || (z = n(["Vahvistettuja tapauksia yhteensä"], ["Vahvistettuja tapauksia yhteensä"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Tapauksia yhteensä"], ["Tapauksia yhteensä"]))), t.totalAreas = bt.default(I || (I = n(["Yhteensä ", ""], ["Yhteensä ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Piilota tiedot, jotta voit nähdä koko kartan"], ["Piilota tiedot, jotta voit nähdä koko kartan"]))), t.showInfo = bt.default(D || (D = n(["Näytä tiedot"], ["Näytä tiedot"]))), t.news = bt.default(M || (M = n(["Uutiset"], ["Uutiset"]))), t.helpfulResources = bt.default(E || (E = n(["Ohjeita ja tietoa"], ["Ohjeita ja tietoa"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Näytä lisää"], ["Näytä lisää"]))), t.dataFrom = bt.default(O || (O = n(["Tietojen lähde:"], ["Tietojen lähde:"]))), t.videos = bt.default(R || (R = n(["Videot"], ["Videot"]))), t.moreNews = bt.default(_ || (_ = n(["Katso lisää artikkeleita"], ["Katso lisää artikkeleita"]))), t.moreVideos = bt.default(N || (N = n(["Katso lisää videoita"], ["Katso lisää videoita"]))), t.map = bt.default(V || (V = n(["Kartta:"], ["Kartta:"]))), t.feedback = bt.default(U || (U = n(["Anna palautetta"], ["Anna palautetta"]))), t.feedbackQuestion = bt.default(q || (q = n(["Millaista palautetta sinulla on tästä työkalusta?"], ["Millaista palautetta sinulla on tästä työkalusta?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Ilmoita ongelmasta"], ["Ilmoita ongelmasta"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Kerro meille ongelmasta"], ["Kerro meille ongelmasta"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Jaa idea"], ["Jaa idea"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Kerro meille ideastasi"], ["Kerro meille ideastasi"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Anna kehuja"], ["Anna kehuja"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Kerro meille mistä pidät"], ["Kerro meille mistä pidät"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Oikeudellinen tai tietosuojaan liittyvä huolenaihe"], ["Oikeudellinen tai tietosuojaan liittyvä huolenaihe"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Kerro meille huolenaiheestasi"], ["Kerro meille huolenaiheestasi"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Anna palautteesi tässä. Yksityisyytesi suojaamiseksi, älä lisää henkilökohtaisia tietoja, kuten osoitettasi tai puhelinnumeroasi"], ["Anna palautteesi tässä. Yksityisyytesi suojaamiseksi, älä lisää henkilökohtaisia tietoja, kuten osoitettasi tai puhelinnumeroasi"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Palaa takaisin"], ["Palaa takaisin"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Lähetä"], ["Lähetä"]))), t.feedbackThanks = bt.default(te || (te = n(["Kiitos palautteestasi!"], ["Kiitos palautteestasi!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Tietosuojalauseke"], ["Tietosuojalauseke"]))), t.websiteDescription = bt.default(ne || (ne = n(["Seuraa paikallisia ja globaaleja COVID-19-tapauksia ja näe aktiiviset tapaukset, parantuneet ja kuolleisuusaste kartalla. Saatavilla on myös päivittäisiä uutisia ja videoita."], ["Seuraa paikallisia ja globaaleja COVID-19-tapauksia ja näe aktiiviset tapaukset, parantuneet ja kuolleisuusaste kartalla. Saatavilla on myös päivittäisiä uutisia ja videoita."]))), t.graphOverTime = bt.default(ie || (ie = n(["Leviäminen ajan myötä"], ["Leviäminen ajan myötä"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " M"], ["", " M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " t"], ["", " t"])), 0), t.upsellDesc = bt.default(le || (le = n(["Seuraa viimeisimpiä päivityksiä puhelimessasi Bing-sovelluksella"], ["Seuraa viimeisimpiä päivityksiä puhelimessasi Bing-sovelluksella"]))), t.upsellCTA = bt.default(se || (se = n(["Lataa nyt"], ["Lataa nyt"]))), t.upsellTitle = bt.default(de || (de = n(["Seuraa koronavirusuutisia"], ["Seuraa koronavirusuutisia"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Seuraa koronavirusta"], ["Seuraa koronavirusta"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Saat viimeisimmät koronaviruspäivitykset Bingissä, kun lisäät Chrome-laajennuksemme"], ["Saat viimeisimmät koronaviruspäivitykset Bingissä, kun lisäät Chrome-laajennuksemme"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Saat viimeisimmät koronaviruspäivitykset Bingissä, kun lisäät Firefox-laajennuksemme"], ["Saat viimeisimmät koronaviruspäivitykset Bingissä, kun lisäät Firefox-laajennuksemme"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Lisää laajennus"], ["Lisää laajennus"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Pysy turvassa, pysy tilanteen tasalla"], ["Pysy turvassa, pysy tilanteen tasalla"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Seuraa laajennuksella"], ["Seuraa laajennuksella"]))), t.submit = bt.default(he || (he = n(["Valmis"], ["Valmis"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " v"], ["", " v"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " kk"], ["", " kk"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " vko"], ["", " vko"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " pv"], ["", " pv"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " t"], ["", " t"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " min"], ["", " min"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Sijaintisi"], ["Sijaintisi"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Suodata sijaintiin"], ["Suodata sijaintiin"]))), t.expand = bt.default(ze || (ze = n(["Laajenna"], ["Laajenna"]))), t.trends = bt.default(Se || (Se = n(["Kehitys"], ["Kehitys"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Testaustiedot"], ["Testaustiedot"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokolla ja yhteystiedot"], ["Protokolla ja yhteystiedot"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokolla"], ["Protokolla"]))), t.hotline = bt.default(Me || (Me = n(["Palvelupuhelin"], ["Palvelupuhelin"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Kumppaniyritykset"], ["Kumppaniyritykset"]))), t.moreTestingLocations = bt.default(je || (je = n(["Katso testisijainnit (", ")"], ["Katso testisijainnit (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Näytä vähemmän"], ["Näytä vähemmän"]))), t.topTrends = bt.default(Be || (Be = n(["Vertailu tapausten kokonaismäärän mukaan"], ["Vertailu tapausten kokonaismäärän mukaan"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Viimeisimmät koronaviruspäivitykset"], ["Viimeisimmät koronaviruspäivitykset"]))), t.copyLink = bt.default(Le || (Le = n(["Kopioi linkki"], ["Kopioi linkki"]))), t.email = bt.default(Oe || (Oe = n(["Sähköposti"], ["Sähköposti"]))), t.cancel = bt.default(Re || (Re = n(["Peruuta"], ["Peruuta"]))), t.confirmed = bt.default(_e || (_e = n(["Vahvistettuja"], ["Vahvistettuja"]))), t.fatal = bt.default(Ne || (Ne = n(["Kuolemantapaukset"], ["Kuolemantapaukset"]))), t.recovered = bt.default(Ve || (Ve = n(["Parantuneita"], ["Parantuneita"]))), t.active = bt.default(Ue || (Ue = n(["Aktiivisia"], ["Aktiivisia"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Anna sijaintitietojen käyttöoikeus täällä, jotta voit nähdä sijaintisi."], ["Anna sijaintitietojen käyttöoikeus täällä, jotta voit nähdä sijaintisi."]))), t.overviewVertical = bt.default(He || (He = n(["Yleiskatsaus"], ["Yleiskatsaus"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Uutiset ja videot"], ["Uutiset ja videot"]))), t.graphstrends = bt.default(We || (We = n(["Kaaviot"], ["Kaaviot"]))), t.localResources = bt.default(Ke || (Ke = n(["Paikalliset resurssit"], ["Paikalliset resurssit"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Päivitetty ", " min sitten"], ["Päivitetty ", " min sitten"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Lähettämällä puhelinnumerosi tai sähköpostiosoitteesi hyväksyt vastaanottavasi yhden automaattisen viestin Microsoftilta tähän matkapuhelinnumeroon tai sähköpostiosoitteeseen. Normaalit tekstiviestien hinnat ovat voimassa."], ["Lähettämällä puhelinnumerosi tai sähköpostiosoitteesi hyväksyt vastaanottavasi yhden automaattisen viestin Microsoftilta tähän matkapuhelinnumeroon tai sähköpostiosoitteeseen. Normaalit tekstiviestien hinnat ovat voimassa."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoftin tietosuojalausunto"], ["Microsoftin tietosuojalausunto"]))), t.sendLink = bt.default(nt || (nt = n(["Lähetä linkki"], ["Lähetä linkki"]))), t.compare = bt.default(it || (it = n(["Vertaa"], ["Vertaa"]))), t.browse = bt.default(rt || (rt = n(["Selaa"], ["Selaa"]))), t.favorites = bt.default(ot || (ot = n(["Suosikit"], ["Suosikit"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Anna kelvollinen yhdysvaltalainen puhelinnumero."], ["Anna kelvollinen yhdysvaltalainen puhelinnumero."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Kiitos. Kokeile puhelimeesi lähetettyä linkkiä tunnin sisällä."], ["Kiitos. Kokeile puhelimeesi lähetettyä linkkiä tunnin sisällä."]))), t.opalSMSError = bt.default(dt || (dt = n(["Tapahtui virhe, lataa Bing Search -sovellus sovelluskaupasta."], ["Tapahtui virhe, lataa Bing Search -sovellus sovelluskaupasta."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Lisää aiheesta ", ""], ["Lisää aiheesta ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Vähemmän aiheesta ", ""], ["Vähemmän aiheesta ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Suositut aiheet"], ["Suositut aiheet"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logaritminen asteikko"], ["Logaritminen asteikko"]))), t.linearScale = bt.default(vt || (vt = n(["Lineaarinen asteikko"], ["Lineaarinen asteikko"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hei! Olen COVID-19:n usein kysyttyjen kysymysten apubotti, ja olen täällä auttamassa löytämään vastauksia kysymyksiisi!"], ["Hei! Olen COVID-19:n usein kysyttyjen kysymysten apubotti, ja olen täällä auttamassa löytämään vastauksia kysymyksiisi!"]))), t.dataTitle = bt.default(gt || (gt = n(["Tiedot"], ["Tiedot"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.fr-fr.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Dernière mise à jour des données :"], ["Dernière mise à jour des données :"]))), t.urlCopied = bt.default(r || (r = n(["URL copiée dans le Presse-papiers"], ["URL copiée dans le Presse-papiers"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Outil de suivi du COVID-19"], ["Outil de suivi du COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Outil de suivi cartographique en direct du coronavirus (COVID-19) de Microsoft Bing"], ["Outil de suivi cartographique en direct du coronavirus (COVID-19) de Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Régions"], ["Régions"]))), t.noRegionalData = bt.default(u || (u = n(["Les données régionales ne sont pas encore disponibles pour ce pays/cette région. Réessayez ultérieurement."], ["Les données régionales ne sont pas encore disponibles pour ce pays/cette région. Réessayez ultérieurement."]))), t.activeCases = bt.default(c || (c = n(["Nombre de malades"], ["Nombre de malades"]))), t.recoveredCases = bt.default(f || (f = n(["Nombre de guérisons"], ["Nombre de guérisons"]))), t.fatalCases = bt.default(p || (p = n(["Nombre de décès"], ["Nombre de décès"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Actifs"], ["Actifs"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Guérisons"], ["Guérisons"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Décès"], ["Décès"]))), t.overview = bt.default(g || (g = n(["Vue d’ensemble"], ["Vue d’ensemble"]))), t.close = bt.default(b || (b = n(["Fermer"], ["Fermer"]))), t.selectARegion = bt.default(k || (k = n(["Sélectionner une région"], ["Sélectionner une région"]))), t.global = bt.default(y || (y = n(["Monde"], ["Monde"]))), t.globalStatus = bt.default(C || (C = n(["Situation mondiale"], ["Situation mondiale"]))), t.allRegions = bt.default(w || (w = n(["Toutes les régions"], ["Toutes les régions"]))), t.share = bt.default(x || (x = n(["Partager"], ["Partager"]))), t.dataInfo = bt.default(T || (T = n(["Informations"], ["Informations"]))), t.totalConfirmed = bt.default(z || (z = n(["Nombre total de cas confirmés"], ["Nombre total de cas confirmés"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Nombre total de cas"], ["Nombre total de cas"]))), t.totalAreas = bt.default(I || (I = n(["", " au total"], ["", " au total"])), 0), t.hideInfo = bt.default(A || (A = n(["Masquer les infos pour afficher la carte complète"], ["Masquer les infos pour afficher la carte complète"]))), t.showInfo = bt.default(D || (D = n(["Afficher les infos"], ["Afficher les infos"]))), t.news = bt.default(M || (M = n(["Actualités"], ["Actualités"]))), t.helpfulResources = bt.default(E || (E = n(["Aide et informations"], ["Aide et informations"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Afficher plus"], ["Afficher plus"]))), t.dataFrom = bt.default(O || (O = n(["Données à partir du :"], ["Données à partir du :"]))), t.videos = bt.default(R || (R = n(["Vidéos"], ["Vidéos"]))), t.moreNews = bt.default(_ || (_ = n(["Afficher plus d’articles"], ["Afficher plus d’articles"]))), t.moreVideos = bt.default(N || (N = n(["Afficher plus de vidéos"], ["Afficher plus de vidéos"]))), t.map = bt.default(V || (V = n(["Carte :"], ["Carte :"]))), t.feedback = bt.default(U || (U = n(["Commentaires"], ["Commentaires"]))), t.feedbackQuestion = bt.default(q || (q = n(["Quel type de commentaires avez-vous à propos de cet outil ?"], ["Quel type de commentaires avez-vous à propos de cet outil ?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Signaler un problème"], ["Signaler un problème"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Expliquez le problème"], ["Expliquez le problème"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Partager une idée"], ["Partager une idée"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Expliquez votre idée"], ["Expliquez votre idée"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Faire un compliment"], ["Faire un compliment"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Expliquez ce que vous aimez"], ["Expliquez ce que vous aimez"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Signaler un problème juridique ou de confidentialité"], ["Signaler un problème juridique ou de confidentialité"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Expliquez votre problème"], ["Expliquez votre problème"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Entrez vos commentaires ici. Pour protéger votre vie privée, n’indiquez aucune information personnelle, comme votre adresse ou votre numéro de téléphone"], ["Entrez vos commentaires ici. Pour protéger votre vie privée, n’indiquez aucune information personnelle, comme votre adresse ou votre numéro de téléphone"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Retour"], ["Retour"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Envoyer"], ["Envoyer"]))), t.feedbackThanks = bt.default(te || (te = n(["Merci de vos commentaires !"], ["Merci de vos commentaires !"]))), t.privacyStatement = bt.default(ae || (ae = n(["Déclaration de confidentialité"], ["Déclaration de confidentialité"]))), t.websiteDescription = bt.default(ne || (ne = n(["Suivez les cas de coronavirus COVID-19 à travers le monde et près de chez vous sur cette carte où sont indiqués les cas actifs, les guérisons et les décès, avec des actualités quotidiennes et des vidéos."], ["Suivez les cas de coronavirus COVID-19 à travers le monde et près de chez vous sur cette carte où sont indiqués les cas actifs, les guérisons et les décès, avec des actualités quotidiennes et des vidéos."]))), t.graphOverTime = bt.default(ie || (ie = n(["Propagation dans le temps"], ["Propagation dans le temps"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " Mio"], ["", " Mio"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " K"], ["", " K"])), 0), t.upsellDesc = bt.default(le || (le = n(["Suivez les dernières actualités sur votre téléphone avec l’application Bing"], ["Suivez les dernières actualités sur votre téléphone avec l’application Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Télécharger"], ["Télécharger"]))), t.upsellTitle = bt.default(de || (de = n(["Suivre les actualités sur le coronavirus"], ["Suivre les actualités sur le coronavirus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Suivre le coronavirus"], ["Suivre le coronavirus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Obtenez les informations les plus récentes relatives au coronavirus sur Bing en ajoutant notre extension Chrome"], ["Obtenez les informations les plus récentes relatives au coronavirus sur Bing en ajoutant notre extension Chrome"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Obtenez les informations les plus récentes relatives au coronavirus sur Bing en ajoutant notre extension Firefox"], ["Obtenez les informations les plus récentes relatives au coronavirus sur Bing en ajoutant notre extension Firefox"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Ajouter l’extension"], ["Ajouter l’extension"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Restez protégé et informé"], ["Restez protégé et informé"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Suivre avec l’extension"], ["Suivre avec l’extension"]))), t.submit = bt.default(he || (he = n(["Terminé"], ["Terminé"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " a"], ["", " a"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " mo"], ["", " mo"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " sem"], ["", " sem"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " j"], ["", " j"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " h"], ["", " h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " min"], ["", " min"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Votre emplacement"], ["Votre emplacement"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtrer par emplacement"], ["Filtrer par emplacement"]))), t.expand = bt.default(ze || (ze = n(["Agrandir"], ["Agrandir"]))), t.trends = bt.default(Se || (Se = n(["Tendances"], ["Tendances"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Informations sur les tests"], ["Informations sur les tests"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protocole et contact"], ["Protocole et contact"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protocole"], ["Protocole"]))), t.hotline = bt.default(Me || (Me = n(["Hotline"], ["Hotline"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Sociétés partenaires"], ["Sociétés partenaires"]))), t.moreTestingLocations = bt.default(je || (je = n(["Afficher les emplacements de test (", ")"], ["Afficher les emplacements de test (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Afficher moins"], ["Afficher moins"]))), t.topTrends = bt.default(Be || (Be = n(["Comparaison par nombre total de cas"], ["Comparaison par nombre total de cas"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Informations les plus récentes relatives au coronavirus"], ["Informations les plus récentes relatives au coronavirus"]))), t.copyLink = bt.default(Le || (Le = n(["Copier le lien"], ["Copier le lien"]))), t.email = bt.default(Oe || (Oe = n(["E-mail"], ["E-mail"]))), t.cancel = bt.default(Re || (Re = n(["Annuler"], ["Annuler"]))), t.confirmed = bt.default(_e || (_e = n(["Confirmés"], ["Confirmés"]))), t.fatal = bt.default(Ne || (Ne = n(["Décès"], ["Décès"]))), t.recovered = bt.default(Ve || (Ve = n(["Guérisons"], ["Guérisons"]))), t.active = bt.default(Ue || (Ue = n(["Actifs"], ["Actifs"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Pour afficher les informations pour votre emplacement, activez les autorisations de localisation ici."], ["Pour afficher les informations pour votre emplacement, activez les autorisations de localisation ici."]))), t.overviewVertical = bt.default(He || (He = n(["Vue d’ensemble"], ["Vue d’ensemble"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Actualités et vidéos"], ["Actualités et vidéos"]))), t.graphstrends = bt.default(We || (We = n(["Graphiques"], ["Graphiques"]))), t.localResources = bt.default(Ke || (Ke = n(["Ressources locales"], ["Ressources locales"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Mise à jour : il y a ", " min"], ["Mise à jour : il y a ", " min"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["En envoyant votre numéro de téléphone ou votre e-mail, vous acceptez de recevoir un message automatique unique de Microsoft sur ce numéro de téléphone mobile ou à cette adresse e-mail. Les tarifs de SMS standard s’appliquent."], ["En envoyant votre numéro de téléphone ou votre e-mail, vous acceptez de recevoir un message automatique unique de Microsoft sur ce numéro de téléphone mobile ou à cette adresse e-mail. Les tarifs de SMS standard s’appliquent."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Déclaration de confidentialité Microsoft"], ["Déclaration de confidentialité Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Envoyer le lien"], ["Envoyer le lien"]))), t.compare = bt.default(it || (it = n(["Comparer"], ["Comparer"]))), t.browse = bt.default(rt || (rt = n(["Parcourir"], ["Parcourir"]))), t.favorites = bt.default(ot || (ot = n(["Favoris"], ["Favoris"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Entrez un numéro de téléphone valide aux États-Unis."], ["Entrez un numéro de téléphone valide aux États-Unis."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Merci. Essayez le lien envoyé sur votre téléphone dans un délai d’une heure."], ["Merci. Essayez le lien envoyé sur votre téléphone dans un délai d’une heure."]))), t.opalSMSError = bt.default(dt || (dt = n(["Une erreur est survenue. Téléchargez l’application Recherche Bing à partir de la boutique d’applications."], ["Une erreur est survenue. Téléchargez l’application Recherche Bing à partir de la boutique d’applications."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Afficher plus sur ", ""], ["Afficher plus sur ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Afficher moins sur ", ""], ["Afficher moins sur ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Sujets d’actualité"], ["Sujets d’actualité"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Échelle logarithmique"], ["Échelle logarithmique"]))), t.linearScale = bt.default(vt || (vt = n(["Échelle linéaire"], ["Échelle linéaire"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Bonjour ! Je suis l’assistant FAQ COVID-19 et je suis là pour répondre à vos questions !"], ["Bonjour ! Je suis l’assistant FAQ COVID-19 et je suis là pour répondre à vos questions !"]))), t.dataTitle = bt.default(gt || (gt = n(["Données"], ["Données"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.he-il.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["עדכון נתונים אחרון:"], ["עדכון נתונים אחרון:"]))), t.urlCopied = bt.default(r || (r = n(["כתובת URL הועתקה ללוח"], ["כתובת URL הועתקה ללוח"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["מעקב COVID-19"], ["מעקב COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["מעקב מפה בשידור חי אחר וירוס הקורונה (COVID-19) של Microsoft Bing"], ["מעקב מפה בשידור חי אחר וירוס הקורונה (COVID-19) של Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["אזורים"], ["אזורים"]))), t.noRegionalData = bt.default(u || (u = n(["נתונים אזוריים לא זמינים עדיין עבור מדינה/אזור אלה. נסה שוב מאוחר יותר."], ["נתונים אזוריים לא זמינים עדיין עבור מדינה/אזור אלה. נסה שוב מאוחר יותר."]))), t.activeCases = bt.default(c || (c = n(["מקרים פעילים"], ["מקרים פעילים"]))), t.recoveredCases = bt.default(f || (f = n(["מקרים שהחלימו"], ["מקרים שהחלימו"]))), t.fatalCases = bt.default(p || (p = n(["מקרי תמותה"], ["מקרי תמותה"]))), t.activeCasesForCallout = bt.default(m || (m = n(["חולים"], ["חולים"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["החלימו"], ["החלימו"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["נפטרים"], ["נפטרים"]))), t.overview = bt.default(g || (g = n(["סקירה כללית"], ["סקירה כללית"]))), t.close = bt.default(b || (b = n(["סגור"], ["סגור"]))), t.selectARegion = bt.default(k || (k = n(["בחר אזור"], ["בחר אזור"]))), t.global = bt.default(y || (y = n(["בעולם"], ["בעולם"]))), t.globalStatus = bt.default(C || (C = n(["מצב בעולם"], ["מצב בעולם"]))), t.allRegions = bt.default(w || (w = n(["כל האזורים"], ["כל האזורים"]))), t.share = bt.default(x || (x = n(["שתף"], ["שתף"]))), t.dataInfo = bt.default(T || (T = n(["מידע נתונים"], ["מידע נתונים"]))), t.totalConfirmed = bt.default(z || (z = n(['סה"כ מקרים שאושרו'], ['סה"כ מקרים שאושרו']))), t.totalConfirmedShort = bt.default(S || (S = n(['סה"כ מקרים'], ['סה"כ מקרים']))), t.totalAreas = bt.default(I || (I = n(["", ' בסה"כ'], ["", ' בסה"כ'])), 0), t.hideInfo = bt.default(A || (A = n(["הסתר את המידע כדי לראות מפה מלאה"], ["הסתר את המידע כדי לראות מפה מלאה"]))), t.showInfo = bt.default(D || (D = n(["הצג מידע"], ["הצג מידע"]))), t.news = bt.default(M || (M = n(["חדשות"], ["חדשות"]))), t.helpfulResources = bt.default(E || (E = n(["עזרה ומידע"], ["עזרה ומידע"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["ראה יותר"], ["ראה יותר"]))), t.dataFrom = bt.default(O || (O = n(["נתונים מ:"], ["נתונים מ:"]))), t.videos = bt.default(R || (R = n(["סרטונים"], ["סרטונים"]))), t.moreNews = bt.default(_ || (_ = n(["הצג מאמרים נוספים"], ["הצג מאמרים נוספים"]))), t.moreVideos = bt.default(N || (N = n(["הצג סרטונים נוספים"], ["הצג סרטונים נוספים"]))), t.map = bt.default(V || (V = n(["מפה:"], ["מפה:"]))), t.feedback = bt.default(U || (U = n(["תן משוב"], ["תן משוב"]))), t.feedbackQuestion = bt.default(q || (q = n(["איזה סוג של משוב יש לך אודות כלי זה?"], ["איזה סוג של משוב יש לך אודות כלי זה?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["דווח על בעיה"], ["דווח על בעיה"]))), t.feedbackTellIssue = bt.default(G || (G = n(["ספר לנו מה הבעיה"], ["ספר לנו מה הבעיה"]))), t.feedbackShareIdea = bt.default(W || (W = n(["שתף רעיון"], ["שתף רעיון"]))), t.feedbackTellIdea = bt.default(K || (K = n(["ספר לנו על הרעיון שלך"], ["ספר לנו על הרעיון שלך"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["תן מחמאה"], ["תן מחמאה"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["ספר לנו מה מוצא חן בעיניך"], ["ספר לנו מה מוצא חן בעיניך"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["חשש משפטי או בנושא פרטיות"], ["חשש משפטי או בנושא פרטיות"]))), t.feedbackTellConcern = bt.default(J || (J = n(["ספר לנו מה החשש שלך"], ["ספר לנו מה החשש שלך"]))), t.feedbackTextEntry = bt.default(X || (X = n(["הזן משוב כאן. כדי להגן על הפרטיות שלך, אל תכלול פרטים אישיים, כגון הכתובת או מספר הטלפון שלך"], ["הזן משוב כאן. כדי להגן על הפרטיות שלך, אל תכלול פרטים אישיים, כגון הכתובת או מספר הטלפון שלך"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["חזור לאחור"], ["חזור לאחור"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["שלח"], ["שלח"]))), t.feedbackThanks = bt.default(te || (te = n(["תודה על המשוב!"], ["תודה על המשוב!"]))), t.privacyStatement = bt.default(ae || (ae = n(["הצהרת פרטיות"], ["הצהרת פרטיות"]))), t.websiteDescription = bt.default(ne || (ne = n(["עקוב אחר המקרים המקומיים והעולמיים של וירוס הקורונה COVID-19 עם מספר ההחולים הפעילים, המחלימים והנפטרים במפה, עם חדשות יומיומיות וסרטונים."], ["עקוב אחר המקרים המקומיים והעולמיים של וירוס הקורונה COVID-19 עם מספר ההחולים הפעילים, המחלימים והנפטרים במפה, עם חדשות יומיומיות וסרטונים."]))), t.graphOverTime = bt.default(ie || (ie = n(["התפשטות לאורך זמן"], ["התפשטות לאורך זמן"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " מיליון"], ["", " מיליון"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " אלף"], ["", " אלף"])), 0), t.upsellDesc = bt.default(le || (le = n(["עקוב אחר העדכונים האחרונים בטלפון בעזרת אפליקציית Bing"], ["עקוב אחר העדכונים האחרונים בטלפון בעזרת אפליקציית Bing"]))), t.upsellCTA = bt.default(se || (se = n(["הורד כעת"], ["הורד כעת"]))), t.upsellTitle = bt.default(de || (de = n(["עקוב אחר חדשות וירוס הקורונה"], ["עקוב אחר חדשות וירוס הקורונה"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["מעקב אחר וירוס הקורונה"], ["מעקב אחר וירוס הקורונה"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["הוסף את הרחבת Chrome שלנו כדי לקבל מ- Bing את העדכונים האחרונים בנושא נגיף הקורונה"], ["הוסף את הרחבת Chrome שלנו כדי לקבל מ- Bing את העדכונים האחרונים בנושא נגיף הקורונה"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["הוסף את הרחבת Firefox שלנו כדי לקבל מ- Bing את העדכונים האחרונים בנושא נגיף הקורונה."], ["הוסף את הרחבת Firefox שלנו כדי לקבל מ- Bing את העדכונים האחרונים בנושא נגיף הקורונה."]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["הוסף את ההרחבה"], ["הוסף את ההרחבה"]))), t.dseUpsellTitle = bt.default(me || (me = n(["הישאר מוגן, הישאר מעודכן"], ["הישאר מוגן, הישאר מעודכן"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["עקוב בעזרת ההרחבה"], ["עקוב בעזרת ההרחבה"]))), t.submit = bt.default(he || (he = n(["סיום"], ["סיום"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " שנים"], ["", " שנים"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " חודשים"], ["", " חודשים"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " שבועות"], ["", " שבועות"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " ימים"], ["", " ימים"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " שעות"], ["", " שעות"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " דקות"], ["", " דקות"])), 0), t.yourLocation = bt.default(xe || (xe = n(["המיקום שלך"], ["המיקום שלך"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["סנן למיקום"], ["סנן למיקום"]))), t.expand = bt.default(ze || (ze = n(["הרחב"], ["הרחב"]))), t.trends = bt.default(Se || (Se = n(["מגמות"], ["מגמות"]))), t.testingProcess = bt.default(Ie || (Ie = n(["מידע על בדיקות"], ["מידע על בדיקות"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["פרוטוקול פרטי התקשרות"], ["פרוטוקול פרטי התקשרות"]))), t.testingProcessProtocol = bt.default(De || (De = n(["פרוטוקול"], ["פרוטוקול"]))), t.hotline = bt.default(Me || (Me = n(["מוקד טלפוני"], ["מוקד טלפוני"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["חברות שותפות"], ["חברות שותפות"]))), t.moreTestingLocations = bt.default(je || (je = n(["ראה מרכזי בדיקות (", ")"], ["ראה מרכזי בדיקות (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["ראה פחות"], ["ראה פחות"]))), t.topTrends = bt.default(Be || (Be = n(['השוואה לפי סה"כ מקרים'], ['השוואה לפי סה"כ מקרים']))), t.latestUpdates = bt.default(Fe || (Fe = n(["עדכונים אחרונים בנושא וירוס הקורונה"], ["עדכונים אחרונים בנושא וירוס הקורונה"]))), t.copyLink = bt.default(Le || (Le = n(["העתק קישור"], ["העתק קישור"]))), t.email = bt.default(Oe || (Oe = n(["דואר אלקטרוני"], ["דואר אלקטרוני"]))), t.cancel = bt.default(Re || (Re = n(["ביטול"], ["ביטול"]))), t.confirmed = bt.default(_e || (_e = n(["מאומתים"], ["מאומתים"]))), t.fatal = bt.default(Ne || (Ne = n(["נפטרים"], ["נפטרים"]))), t.recovered = bt.default(Ve || (Ve = n(["החלימו"], ["החלימו"]))), t.active = bt.default(Ue || (Ue = n(["חולים"], ["חולים"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["כדי לראות את המיקום שלך, הקצה הרשאות מיקום כאן."], ["כדי לראות את המיקום שלך, הקצה הרשאות מיקום כאן."]))), t.overviewVertical = bt.default(He || (He = n(["סקירה כללית"], ["סקירה כללית"]))), t.newsvideos = bt.default(Ge || (Ge = n(["חדשות וסרטונים"], ["חדשות וסרטונים"]))), t.graphstrends = bt.default(We || (We = n(["גרפים"], ["גרפים"]))), t.localResources = bt.default(Ke || (Ke = n(["משאבים מקומיים"], ["משאבים מקומיים"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["עודכן לפני ", " דקות"], ["עודכן לפני ", " דקות"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["בשליחת מספר הטלפון או כתובת הדואר האלקטרוני שלך, אתה מסכים לקבל מ- Microsoft הודעה אוטומטית חד-פעמית למספר טלפון נייד זה או לכתובת דואר אלקטרוני זו. ייתכן שיחולו תעריפי SMS רגילים."], ["בשליחת מספר הטלפון או כתובת הדואר האלקטרוני שלך, אתה מסכים לקבל מ- Microsoft הודעה אוטומטית חד-פעמית למספר טלפון נייד זה או לכתובת דואר אלקטרוני זו. ייתכן שיחולו תעריפי SMS רגילים."]))), t.msPrivacyTitle = bt.default(at || (at = n(["הצהרת הפרטיות של Microsoft"], ["הצהרת הפרטיות של Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["שלח קישור"], ["שלח קישור"]))), t.compare = bt.default(it || (it = n(["השווה"], ["השווה"]))), t.browse = bt.default(rt || (rt = n(["דפדף"], ["דפדף"]))), t.favorites = bt.default(ot || (ot = n(["מועדפים"], ["מועדפים"]))), t.validNumberRequired = bt.default(lt || (lt = n(['הזן מספר טלפון חוקי בארה"ב.'], ['הזן מספר טלפון חוקי בארה"ב.']))), t.opalSMSAccepted = bt.default(st || (st = n(["תודה. פתח במהלך השעה הקרובה את הקישור שנשלח לטלפון שלך."], ["תודה. פתח במהלך השעה הקרובה את הקישור שנשלח לטלפון שלך."]))), t.opalSMSError = bt.default(dt || (dt = n(["המערכת נתקלה בשגיאה, אנא הורד את Bing Search מחנות האפליקציות."], ["המערכת נתקלה בשגיאה, אנא הורד את Bing Search מחנות האפליקציות."]))), t.moreOnTopic = bt.default(ut || (ut = n(["עוד בנושא ", ""], ["עוד בנושא ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["פחות בנושא ", ""], ["פחות בנושא ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["נושאים פופולריים"], ["נושאים פופולריים"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["סקאלה לוגריתמית"], ["סקאלה לוגריתמית"]))), t.linearScale = bt.default(vt || (vt = n(["סקאלה לינארית"], ["סקאלה לינארית"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["היי! אני בוט השאלות הנפוצות בנושא וירוס הקורונה (COVID-19). יש לך שאלה? אעזור לך למצוא תשובה!"], ["היי! אני בוט השאלות הנפוצות בנושא וירוס הקורונה (COVID-19). יש לך שאלה? אעזור לך למצוא תשובה!"]))), t.dataTitle = bt.default(gt || (gt = n(["נתונים"], ["נתונים"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.hi-in.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["डेटा अंतिम बार अपडेट किया था:"], ["डेटा अंतिम बार अपडेट किया था:"]))), t.urlCopied = bt.default(r || (r = n(["क्लिपबोर्ड में Url की प्रतिलिपि बनाई गई"], ["क्लिपबोर्ड में Url की प्रतिलिपि बनाई गई"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19 ट्रैकर"], ["COVID-19 ट्रैकर"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing द्वारा प्रदान किया गया कोरोना वायरस (COVID-19) लाइव मैप ट्रैकर"], ["Microsoft Bing द्वारा प्रदान किया गया कोरोना वायरस (COVID-19) लाइव मैप ट्रैकर"]))), t.citiesAndProvinces = bt.default(d || (d = n(["क्षेत्र"], ["क्षेत्र"]))), t.noRegionalData = bt.default(u || (u = n(["इस देश/क्षेत्र के लिए क्षेत्रीय डेटा अभी तक उपलब्ध नहीं है. बाद में फिर से प्रयास करें."], ["इस देश/क्षेत्र के लिए क्षेत्रीय डेटा अभी तक उपलब्ध नहीं है. बाद में फिर से प्रयास करें."]))), t.activeCases = bt.default(c || (c = n(["सक्रिय केसेस"], ["सक्रिय केसेस"]))), t.recoveredCases = bt.default(f || (f = n(["रिकवर हुए केसेस"], ["रिकवर हुए केसेस"]))), t.fatalCases = bt.default(p || (p = n(["जानलेवा केसेस"], ["जानलेवा केसेस"]))), t.activeCasesForCallout = bt.default(m || (m = n(["सक्रिय"], ["सक्रिय"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["रिकवर हुए"], ["रिकवर हुए"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["जानलेवा"], ["जानलेवा"]))), t.overview = bt.default(g || (g = n(["ओवरव्यू"], ["ओवरव्यू"]))), t.close = bt.default(b || (b = n(["बंद करें"], ["बंद करें"]))), t.selectARegion = bt.default(k || (k = n(["किसी क्षेत्र का चयन करें"], ["किसी क्षेत्र का चयन करें"]))), t.global = bt.default(y || (y = n(["वैश्विक"], ["वैश्विक"]))), t.globalStatus = bt.default(C || (C = n(["वैश्विक स्थिति"], ["वैश्विक स्थिति"]))), t.allRegions = bt.default(w || (w = n(["सभी क्षेत्र"], ["सभी क्षेत्र"]))), t.share = bt.default(x || (x = n(["साझा करें"], ["साझा करें"]))), t.dataInfo = bt.default(T || (T = n(["डेटा की जानकारी"], ["डेटा की जानकारी"]))), t.totalConfirmed = bt.default(z || (z = n(["कुल पुष्टि किए गए केसेस"], ["कुल पुष्टि किए गए केसेस"]))), t.totalConfirmedShort = bt.default(S || (S = n(["कुल केसेस"], ["कुल केसेस"]))), t.totalAreas = bt.default(I || (I = n(["कुल ", ""], ["कुल ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["पूर्ण मैप देखने के लिए जानकारी छुपाएँ"], ["पूर्ण मैप देखने के लिए जानकारी छुपाएँ"]))), t.showInfo = bt.default(D || (D = n(["जानकारी दिखाएँ"], ["जानकारी दिखाएँ"]))), t.news = bt.default(M || (M = n(["समाचार"], ["समाचार"]))), t.helpfulResources = bt.default(E || (E = n(["मदद और जानकारी"], ["मदद और जानकारी"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["अधिक देखें"], ["अधिक देखें"]))), t.dataFrom = bt.default(O || (O = n(["डेटा प्रदाता:"], ["डेटा प्रदाता:"]))), t.videos = bt.default(R || (R = n(["वीडियो"], ["वीडियो"]))), t.moreNews = bt.default(_ || (_ = n(["अधिक आलेख देखें"], ["अधिक आलेख देखें"]))), t.moreVideos = bt.default(N || (N = n(["अधिक वीडियो देखें"], ["अधिक वीडियो देखें"]))), t.map = bt.default(V || (V = n(["मैप:"], ["मैप:"]))), t.feedback = bt.default(U || (U = n(["प्रतिक्रिया दें"], ["प्रतिक्रिया दें"]))), t.feedbackQuestion = bt.default(q || (q = n(["इस टूल के बारे में आपकी किस प्रकार की प्रतिक्रिया है?"], ["इस टूल के बारे में आपकी किस प्रकार की प्रतिक्रिया है?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["समस्‍या की रिपोर्ट करें"], ["समस्‍या की रिपोर्ट करें"]))), t.feedbackTellIssue = bt.default(G || (G = n(["हमें समस्‍या के बारे में बताएँ"], ["हमें समस्‍या के बारे में बताएँ"]))), t.feedbackShareIdea = bt.default(W || (W = n(["विचार साझा करें"], ["विचार साझा करें"]))), t.feedbackTellIdea = bt.default(K || (K = n(["हमें अपने विचार के बारे में बताएँ"], ["हमें अपने विचार के बारे में बताएँ"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["सकारात्मक प्रतिक्रिया दें"], ["सकारात्मक प्रतिक्रिया दें"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["हमें बताएँ कि आपको क्या पसंद है"], ["हमें बताएँ कि आपको क्या पसंद है"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["कानूनी या गोपनीयता संबंधित चिंता"], ["कानूनी या गोपनीयता संबंधित चिंता"]))), t.feedbackTellConcern = bt.default(J || (J = n(["हमें अपनी चिंता के बारे में बताएँ"], ["हमें अपनी चिंता के बारे में बताएँ"]))), t.feedbackTextEntry = bt.default(X || (X = n(["प्रतिक्रिया यहाँ दर्ज करें. अपनी गोपनीयता की सुरक्षा में मदद के लिए, व्‍यक्तिगत जानकारी, जैसे आपका पता या फ़ोन नंबर शामिल नहीं करें"], ["प्रतिक्रिया यहाँ दर्ज करें. अपनी गोपनीयता की सुरक्षा में मदद के लिए, व्‍यक्तिगत जानकारी, जैसे आपका पता या फ़ोन नंबर शामिल नहीं करें"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["वापस जाएँ"], ["वापस जाएँ"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["भेजें"], ["भेजें"]))), t.feedbackThanks = bt.default(te || (te = n(["आपकी प्रतिक्रिया के लिए धन्‍यवाद!"], ["आपकी प्रतिक्रिया के लिए धन्‍यवाद!"]))), t.privacyStatement = bt.default(ae || (ae = n(["गोपनीयता कथन"], ["गोपनीयता कथन"]))), t.websiteDescription = bt.default(ne || (ne = n(["COVID-19 संबंधित स्थानीय और वैश्विक सक्रिय केसेस, रिकवर हुए केसेस और मृत्यु के आँकड़ों के साथ कोरोना वायरस के केसेस को मैप पर ट्रैक करें, साथ ही दैनिक समाचार और वीडियो देखें."], ["COVID-19 संबंधित स्थानीय और वैश्विक सक्रिय केसेस, रिकवर हुए केसेस और मृत्यु के आँकड़ों के साथ कोरोना वायरस के केसेस को मैप पर ट्रैक करें, साथ ही दैनिक समाचार और वीडियो देखें."]))), t.graphOverTime = bt.default(ie || (ie = n(["समय के साथ साथ फैलाव"], ["समय के साथ साथ फैलाव"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "M"], ["", "M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = bt.default(le || (le = n(["अपने फ़ोन पर Bing ऐप के ज़रिए ताज़ा अपडेट्स ट्रैक करें"], ["अपने फ़ोन पर Bing ऐप के ज़रिए ताज़ा अपडेट्स ट्रैक करें"]))), t.upsellCTA = bt.default(se || (se = n(["अभी डाउनलोड करें"], ["अभी डाउनलोड करें"]))), t.upsellTitle = bt.default(de || (de = n(["कोरोना वायरस संबंधित समाचार देखते रहिए"], ["कोरोना वायरस संबंधित समाचार देखते रहिए"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["कोरोना वायरस ट्रैक करें"], ["कोरोना वायरस ट्रैक करें"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["हमारा Chrome एक्सटेंशन जोड़कर आप Bing पर कोरोना वायरस संबंधित नवीनतम अपडेट्‍स प्राप्त कर सकते हैं"], ["हमारा Chrome एक्सटेंशन जोड़कर आप Bing पर कोरोना वायरस संबंधित नवीनतम अपडेट्‍स प्राप्त कर सकते हैं"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["हमारा Firefox एक्सटेंशन जोड़कर आप Bing पर कोरोना वायरस संबंधित नवीनतम अपडेट्‍स प्राप्त कर सकते हैं"], ["हमारा Firefox एक्सटेंशन जोड़कर आप Bing पर कोरोना वायरस संबंधित नवीनतम अपडेट्‍स प्राप्त कर सकते हैं"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["एक्सटेंशन जोड़ें"], ["एक्सटेंशन जोड़ें"]))), t.dseUpsellTitle = bt.default(me || (me = n(["सुरक्षित रहें, सूचित रहें"], ["सुरक्षित रहें, सूचित रहें"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["एक्सटेंशन के ज़रिए ट्रैक करें"], ["एक्सटेंशन के ज़रिए ट्रैक करें"]))), t.submit = bt.default(he || (he = n(["पूरा हुआ"], ["पूरा हुआ"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "y"], ["", "y"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "M"], ["", "M"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "w"], ["", "w"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "h"], ["", "h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["आपका स्‍थान"], ["आपका स्‍थान"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["किसी स्थान के अनुसार फ़िल्टर करें"], ["किसी स्थान के अनुसार फ़िल्टर करें"]))), t.expand = bt.default(ze || (ze = n(["विस्तृत करें"], ["विस्तृत करें"]))), t.trends = bt.default(Se || (Se = n(["रुझान"], ["रुझान"]))), t.testingProcess = bt.default(Ie || (Ie = n(["टेस्टिंग संबंधित जानकारी"], ["टेस्टिंग संबंधित जानकारी"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["प्रोटोकॉल और संपर्क"], ["प्रोटोकॉल और संपर्क"]))), t.testingProcessProtocol = bt.default(De || (De = n(["प्रोटोकॉल"], ["प्रोटोकॉल"]))), t.hotline = bt.default(Me || (Me = n(["हॉटलाइन"], ["हॉटलाइन"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["पार्टनर कंपनियाँ"], ["पार्टनर कंपनियाँ"]))), t.moreTestingLocations = bt.default(je || (je = n(["टेस्टिंग के स्थान देखें (", ")"], ["टेस्टिंग के स्थान देखें (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["कम देखें"], ["कम देखें"]))), t.topTrends = bt.default(Be || (Be = n(["कुल केसेस के अनुसार तुलना"], ["कुल केसेस के अनुसार तुलना"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["कोरोना वायरस संबंधित नवीनतम अपडेट्‍स"], ["कोरोना वायरस संबंधित नवीनतम अपडेट्‍स"]))), t.copyLink = bt.default(Le || (Le = n(["लिंक कॉपी करें"], ["लिंक कॉपी करें"]))), t.email = bt.default(Oe || (Oe = n(["ईमेल"], ["ईमेल"]))), t.cancel = bt.default(Re || (Re = n(["रद्द करें"], ["रद्द करें"]))), t.confirmed = bt.default(_e || (_e = n(["पुष्टि किए गए"], ["पुष्टि किए गए"]))), t.fatal = bt.default(Ne || (Ne = n(["जानलेवा"], ["जानलेवा"]))), t.recovered = bt.default(Ve || (Ve = n(["रिकवर हुए"], ["रिकवर हुए"]))), t.active = bt.default(Ue || (Ue = n(["सक्रिय"], ["सक्रिय"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["आपका स्थान देखने के लिए, यहाँ स्थान संबंधित अनुमतियाँ सक्षम करें."], ["आपका स्थान देखने के लिए, यहाँ स्थान संबंधित अनुमतियाँ सक्षम करें."]))), t.overviewVertical = bt.default(He || (He = n(["ओवरव्यू"], ["ओवरव्यू"]))), t.newsvideos = bt.default(Ge || (Ge = n(["समाचार और वीडियो"], ["समाचार और वीडियो"]))), t.graphstrends = bt.default(We || (We = n(["ग्राफ़"], ["ग्राफ़"]))), t.localResources = bt.default(Ke || (Ke = n(["स्थानीय संसाधन"], ["स्थानीय संसाधन"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " मिनट पहले अपडेट किया गया"], ["", " मिनट पहले अपडेट किया गया"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["आपका फ़ोन नंबर या ईमेल भेजकर, आप इस मोबाइल फ़ोन नंबर या ईमेल पर Microsoft से एक बार का स्वचलित संदेश प्राप्त करने के लिए सहमत होते हैं. मानक SMS दरें लागू होते हैं."], ["आपका फ़ोन नंबर या ईमेल भेजकर, आप इस मोबाइल फ़ोन नंबर या ईमेल पर Microsoft से एक बार का स्वचलित संदेश प्राप्त करने के लिए सहमत होते हैं. मानक SMS दरें लागू होते हैं."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft गोपनीयता कथन"], ["Microsoft गोपनीयता कथन"]))), t.sendLink = bt.default(nt || (nt = n(["लिंक भेजें"], ["लिंक भेजें"]))), t.compare = bt.default(it || (it = n(["तुलना करें"], ["तुलना करें"]))), t.browse = bt.default(rt || (rt = n(["ब्राउज़ करें"], ["ब्राउज़ करें"]))), t.favorites = bt.default(ot || (ot = n(["पसंदीदा"], ["पसंदीदा"]))), t.validNumberRequired = bt.default(lt || (lt = n(["कृपया कोई मान्य US फ़ोन नंबर दर्ज करें."], ["कृपया कोई मान्य US फ़ोन नंबर दर्ज करें."]))), t.opalSMSAccepted = bt.default(st || (st = n(["धन्यवाद. कृपया आपके फ़ोन पर भेजे गए लिंक का एक घंटे के भीतर उपयोग करके देखें."], ["धन्यवाद. कृपया आपके फ़ोन पर भेजे गए लिंक का एक घंटे के भीतर उपयोग करके देखें."]))), t.opalSMSError = bt.default(dt || (dt = n(["किसी त्रुटि का सामना करना पड़ा, कृपया ऐप स्टोर से Bing खोज ऐप डाउनलोड करें."], ["किसी त्रुटि का सामना करना पड़ा, कृपया ऐप स्टोर से Bing खोज ऐप डाउनलोड करें."]))), t.moreOnTopic = bt.default(ut || (ut = n(["", " के बारे में अधिक"], ["", " के बारे में अधिक"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["", " के बारे में कम"], ["", " के बारे में कम"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["अभी लोकप्रिय विषय"], ["अभी लोकप्रिय विषय"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["लॉग स्केल"], ["लॉग स्केल"]))), t.linearScale = bt.default(vt || (vt = n(["रेखीय स्केल"], ["रेखीय स्केल"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["नमस्ते! मैं COVID-19 FAQ हेल्पर बॉट हूँ और मैं यहाँ आपके प्रश्नों के उत्तर देने के लिए हूँ!"], ["नमस्ते! मैं COVID-19 FAQ हेल्पर बॉट हूँ और मैं यहाँ आपके प्रश्नों के उत्तर देने के लिए हूँ!"]))), t.dataTitle = bt.default(gt || (gt = n(["डेटा"], ["डेटा"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.hu-hu.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Az adatok legutóbbi frissítésének időpontja:"], ["Az adatok legutóbbi frissítésének időpontja:"]))), t.urlCopied = bt.default(r || (r = n(["Az URL-cím a vágólapra másolva"], ["Az URL-cím a vágólapra másolva"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19-figyelő"], ["COVID-19-figyelő"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing élő térképes koronavírus- (COVID-19-) figyelő"], ["Microsoft Bing élő térképes koronavírus- (COVID-19-) figyelő"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Régiók"], ["Régiók"]))), t.noRegionalData = bt.default(u || (u = n(["Ehhez az országhoz/régióhoz még nem állnak rendelkezésre regionális adatok. Próbálja újra később."], ["Ehhez az országhoz/régióhoz még nem állnak rendelkezésre regionális adatok. Próbálja újra később."]))), t.activeCases = bt.default(c || (c = n(["Aktív esetek"], ["Aktív esetek"]))), t.recoveredCases = bt.default(f || (f = n(["Gyógyult esetek"], ["Gyógyult esetek"]))), t.fatalCases = bt.default(p || (p = n(["Halálos esetek"], ["Halálos esetek"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktív"], ["Aktív"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Gyógyult"], ["Gyógyult"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Elhunyt"], ["Elhunyt"]))), t.overview = bt.default(g || (g = n(["Áttekintés"], ["Áttekintés"]))), t.close = bt.default(b || (b = n(["Bezárás"], ["Bezárás"]))), t.selectARegion = bt.default(k || (k = n(["Régió kiválasztása"], ["Régió kiválasztása"]))), t.global = bt.default(y || (y = n(["Globális"], ["Globális"]))), t.globalStatus = bt.default(C || (C = n(["Globális állapot"], ["Globális állapot"]))), t.allRegions = bt.default(w || (w = n(["Minden régió"], ["Minden régió"]))), t.share = bt.default(x || (x = n(["Megosztás"], ["Megosztás"]))), t.dataInfo = bt.default(T || (T = n(["Adatinformáció"], ["Adatinformáció"]))), t.totalConfirmed = bt.default(z || (z = n(["Összes megerősített eset"], ["Összes megerősített eset"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Összes eset"], ["Összes eset"]))), t.totalAreas = bt.default(I || (I = n(["összesen ", ""], ["összesen ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Rejtse el az információkat a teljes térkép megjelenítéséhez"], ["Rejtse el az információkat a teljes térkép megjelenítéséhez"]))), t.showInfo = bt.default(D || (D = n(["Információk megjelenítése"], ["Információk megjelenítése"]))), t.news = bt.default(M || (M = n(["Hírek"], ["Hírek"]))), t.helpfulResources = bt.default(E || (E = n(["Súgó és információ"], ["Súgó és információ"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Továbbiak megjelenítése"], ["Továbbiak megjelenítése"]))), t.dataFrom = bt.default(O || (O = n(["Adatok forrása:"], ["Adatok forrása:"]))), t.videos = bt.default(R || (R = n(["Videók"], ["Videók"]))), t.moreNews = bt.default(_ || (_ = n(["További cikkek megtekintése"], ["További cikkek megtekintése"]))), t.moreVideos = bt.default(N || (N = n(["További videók megtekintése"], ["További videók megtekintése"]))), t.map = bt.default(V || (V = n(["Térkép:"], ["Térkép:"]))), t.feedback = bt.default(U || (U = n(["Visszajelzés küldése"], ["Visszajelzés küldése"]))), t.feedbackQuestion = bt.default(q || (q = n(["Milyen jellegű visszajelzése van az eszközzel kapcsolatban?"], ["Milyen jellegű visszajelzése van az eszközzel kapcsolatban?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Probléma bejelentése"], ["Probléma bejelentése"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Írja le a problémát"], ["Írja le a problémát"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Ötlet megosztása"], ["Ötlet megosztása"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Írja meg az ötletét"], ["Írja meg az ötletét"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Dicséret"], ["Dicséret"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Írja meg, mi nyerte el a tetszését"], ["Írja meg, mi nyerte el a tetszését"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Jogi vagy adatvédelmi aggály"], ["Jogi vagy adatvédelmi aggály"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Írja meg észrevételét"], ["Írja meg észrevételét"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Itt adhat visszajelzését. Adatvédelmi okokból ne adja meg személyes adatait, például a címét vagy a telefonszámát"], ["Itt adhat visszajelzését. Adatvédelmi okokból ne adja meg személyes adatait, például a címét vagy a telefonszámát"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Vissza"], ["Vissza"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Küldés"], ["Küldés"]))), t.feedbackThanks = bt.default(te || (te = n(["Köszönjük visszajelzését!"], ["Köszönjük visszajelzését!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Adatvédelmi nyilatkozat"], ["Adatvédelmi nyilatkozat"]))), t.websiteDescription = bt.default(ne || (ne = n(["Térképünkön nyomon követheti a helyi és a globális koronavírusos (COVID-19) eseteket, az aktív esetek, a gyógyultak és az elhunytak arányával együtt. Emellett megtekintheti a legújabb napi híreket és videókat is."], ["Térképünkön nyomon követheti a helyi és a globális koronavírusos (COVID-19) eseteket, az aktív esetek, a gyógyultak és az elhunytak arányával együtt. Emellett megtekintheti a legújabb napi híreket és videókat is."]))), t.graphOverTime = bt.default(ie || (ie = n(["Időbeli eloszlás"], ["Időbeli eloszlás"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " M"], ["", " M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " E"], ["", " E"])), 0), t.upsellDesc = bt.default(le || (le = n(["Kövesse a legfrissebb fejleményeket a telefonján a Bing alkalmazással"], ["Kövesse a legfrissebb fejleményeket a telefonján a Bing alkalmazással"]))), t.upsellCTA = bt.default(se || (se = n(["Letöltés"], ["Letöltés"]))), t.upsellTitle = bt.default(de || (de = n(["Kövesse a koronavírussal kapcsolatos híreket"], ["Kövesse a koronavírussal kapcsolatos híreket"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Kövesse nyomon a koronavírust"], ["Kövesse nyomon a koronavírust"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["A Chrome-bővítményünk hozzáadásával értesülhet a Bing koronavírussal kapcsolatos legfrissebb információiról."], ["A Chrome-bővítményünk hozzáadásával értesülhet a Bing koronavírussal kapcsolatos legfrissebb információiról."]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["A Firefox-bővítményünk hozzáadásával értesülhet a Bing koronavírussal kapcsolatos legfrissebb információiról."], ["A Firefox-bővítményünk hozzáadásával értesülhet a Bing koronavírussal kapcsolatos legfrissebb információiról."]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Bővítmény hozzáadása"], ["Bővítmény hozzáadása"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Legyen biztonságban, kövesse a híreket"], ["Legyen biztonságban, kövesse a híreket"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Követés bővítménnyel"], ["Követés bővítménnyel"]))), t.submit = bt.default(he || (he = n(["Kész"], ["Kész"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " éve"], ["", " éve"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " hónapja"], ["", " hónapja"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " hete"], ["", " hete"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " napja"], ["", " napja"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " órája"], ["", " órája"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " perce"], ["", " perce"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Tartózkodási hely"], ["Tartózkodási hely"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Szűrés hely szerint"], ["Szűrés hely szerint"]))), t.expand = bt.default(ze || (ze = n(["Kibontás"], ["Kibontás"]))), t.trends = bt.default(Se || (Se = n(["Trendek"], ["Trendek"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Tesztelési információ"], ["Tesztelési információ"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokoll és kapcsolat"], ["Protokoll és kapcsolat"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokoll"], ["Protokoll"]))), t.hotline = bt.default(Me || (Me = n(["Forródrót"], ["Forródrót"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Partnercégek"], ["Partnercégek"]))), t.moreTestingLocations = bt.default(je || (je = n(["Tesztelési helyszínek megtekintése (", ")"], ["Tesztelési helyszínek megtekintése (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Kevesebb megjelenítése"], ["Kevesebb megjelenítése"]))), t.topTrends = bt.default(Be || (Be = n(["Összehasonlítás teljes esetszám alapján"], ["Összehasonlítás teljes esetszám alapján"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["A koronavírussal kapcsolatos legfrissebb fejlemények"], ["A koronavírussal kapcsolatos legfrissebb fejlemények"]))), t.copyLink = bt.default(Le || (Le = n(["Hivatkozás másolása"], ["Hivatkozás másolása"]))), t.email = bt.default(Oe || (Oe = n(["E-mail"], ["E-mail"]))), t.cancel = bt.default(Re || (Re = n(["Mégse"], ["Mégse"]))), t.confirmed = bt.default(_e || (_e = n(["Megerősített"], ["Megerősített"]))), t.fatal = bt.default(Ne || (Ne = n(["Elhunyt"], ["Elhunyt"]))), t.recovered = bt.default(Ve || (Ve = n(["Gyógyult"], ["Gyógyult"]))), t.active = bt.default(Ue || (Ue = n(["Aktív"], ["Aktív"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["A hely megjelenítéséhez itt adhat hozzáférést a tartózkodási helyéhez."], ["A hely megjelenítéséhez itt adhat hozzáférést a tartózkodási helyéhez."]))), t.overviewVertical = bt.default(He || (He = n(["Áttekintés"], ["Áttekintés"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Hírek és videók"], ["Hírek és videók"]))), t.graphstrends = bt.default(We || (We = n(["Grafikonok"], ["Grafikonok"]))), t.localResources = bt.default(Ke || (Ke = n(["Helyi források"], ["Helyi források"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " perce frissítve"], ["", " perce frissítve"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Ha elküldi a telefonszámát vagy e-mail-címét, azzal beleegyezik, hogy a Microsoft egy egyszeri, automatikus üzenetet küldjön erre a mobilszámra vagy e-mail-címre. A szokásos SMS-díjak merülhetnek fel."], ["Ha elküldi a telefonszámát vagy e-mail-címét, azzal beleegyezik, hogy a Microsoft egy egyszeri, automatikus üzenetet küldjön erre a mobilszámra vagy e-mail-címre. A szokásos SMS-díjak merülhetnek fel."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft adatvédelmi nyilatkozat"], ["Microsoft adatvédelmi nyilatkozat"]))), t.sendLink = bt.default(nt || (nt = n(["Hivatkozás küldése"], ["Hivatkozás küldése"]))), t.compare = bt.default(it || (it = n(["Összehasonlítás"], ["Összehasonlítás"]))), t.browse = bt.default(rt || (rt = n(["Tallózás"], ["Tallózás"]))), t.favorites = bt.default(ot || (ot = n(["Kedvencek"], ["Kedvencek"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Érvényes, egyesült államokbeli telefonszámot adjon meg."], ["Érvényes, egyesült államokbeli telefonszámot adjon meg."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Köszönjük. Kérjük, használja a telefonjára küldött hivatkozást egy órán belül."], ["Köszönjük. Kérjük, használja a telefonjára küldött hivatkozást egy órán belül."]))), t.opalSMSError = bt.default(dt || (dt = n(["Hiba történt. Kérjük, töltse le a Bing Search alkalmazást az alkalmazás-áruházból."], ["Hiba történt. Kérjük, töltse le a Bing Search alkalmazást az alkalmazás-áruházból."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Több megjelenítése erről: ", ""], ["Több megjelenítése erről: ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Kevesebb megjelenítése erről: ", ""], ["Kevesebb megjelenítése erről: ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Népszerű témakörök"], ["Népszerű témakörök"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logaritmikus skála"], ["Logaritmikus skála"]))), t.linearScale = bt.default(vt || (vt = n(["Lineáris skála"], ["Lineáris skála"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Üdvözlöm! A COVID-19-cel kapcsolatos gyakori kérdések robotsegédje vagyok, és a feladatom, hogy segítsek választ találni a kérdéseire!"], ["Üdvözlöm! A COVID-19-cel kapcsolatos gyakori kérdések robotsegédje vagyok, és a feladatom, hogy segítsek választ találni a kérdéseire!"]))), t.dataTitle = bt.default(gt || (gt = n(["Adatok"], ["Adatok"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.id-id.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Data terakhir diperbarui:"], ["Data terakhir diperbarui:"]))), t.urlCopied = bt.default(r || (r = n(["URL disalin ke clipboard"], ["URL disalin ke clipboard"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Pelacak COVID-19"], ["Pelacak COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Pelacak peta langsung virus corona (COVID-19) Bing dari Microsoft"], ["Pelacak peta langsung virus corona (COVID-19) Bing dari Microsoft"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Wilayah"], ["Wilayah"]))), t.noRegionalData = bt.default(u || (u = n(["Data regional belum tersedia untuk negara/wilayah ini. Coba lagi nanti."], ["Data regional belum tersedia untuk negara/wilayah ini. Coba lagi nanti."]))), t.activeCases = bt.default(c || (c = n(["Kasus aktif"], ["Kasus aktif"]))), t.recoveredCases = bt.default(f || (f = n(["Kasus pulih"], ["Kasus pulih"]))), t.fatalCases = bt.default(p || (p = n(["Kasus meninggal"], ["Kasus meninggal"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktif"], ["Aktif"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Pulih"], ["Pulih"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Meninggal"], ["Meninggal"]))), t.overview = bt.default(g || (g = n(["Ringkasan"], ["Ringkasan"]))), t.close = bt.default(b || (b = n(["Tutup"], ["Tutup"]))), t.selectARegion = bt.default(k || (k = n(["Pilih wilayah"], ["Pilih wilayah"]))), t.global = bt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = bt.default(C || (C = n(["Status Global"], ["Status Global"]))), t.allRegions = bt.default(w || (w = n(["Semua Wilayah"], ["Semua Wilayah"]))), t.share = bt.default(x || (x = n(["Bagikan"], ["Bagikan"]))), t.dataInfo = bt.default(T || (T = n(["Informasi data"], ["Informasi data"]))), t.totalConfirmed = bt.default(z || (z = n(["Total Kasus yang Dikonfirmasi"], ["Total Kasus yang Dikonfirmasi"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Total kasus"], ["Total kasus"]))), t.totalAreas = bt.default(I || (I = n(["", " Total"], ["", " Total"])), 0), t.hideInfo = bt.default(A || (A = n(["Sembunyikan info untuk melihat peta lengkap"], ["Sembunyikan info untuk melihat peta lengkap"]))), t.showInfo = bt.default(D || (D = n(["Tampilkan info"], ["Tampilkan info"]))), t.news = bt.default(M || (M = n(["Berita"], ["Berita"]))), t.helpfulResources = bt.default(E || (E = n(["Bantuan & Informasi"], ["Bantuan & Informasi"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Lihat selengkapnya"], ["Lihat selengkapnya"]))), t.dataFrom = bt.default(O || (O = n(["Data dari:"], ["Data dari:"]))), t.videos = bt.default(R || (R = n(["Video"], ["Video"]))), t.moreNews = bt.default(_ || (_ = n(["Lihat artikel lainnya"], ["Lihat artikel lainnya"]))), t.moreVideos = bt.default(N || (N = n(["Lihat video lainnya"], ["Lihat video lainnya"]))), t.map = bt.default(V || (V = n(["Peta:"], ["Peta:"]))), t.feedback = bt.default(U || (U = n(["Berikan umpan balik"], ["Berikan umpan balik"]))), t.feedbackQuestion = bt.default(q || (q = n(["Umpan balik seperti apa yang Anda miliki terkait alat ini?"], ["Umpan balik seperti apa yang Anda miliki terkait alat ini?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Laporkan masalah"], ["Laporkan masalah"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Beri tahu kami masalahnya"], ["Beri tahu kami masalahnya"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Bagikan ide"], ["Bagikan ide"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Beri tahu kami ide Anda"], ["Beri tahu kami ide Anda"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Berikan pujian"], ["Berikan pujian"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Beri tahu kami apa yang Anda sukai"], ["Beri tahu kami apa yang Anda sukai"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Masalah hukum atau privasi"], ["Masalah hukum atau privasi"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Beri tahu kami masalah Anda"], ["Beri tahu kami masalah Anda"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Masukkan umpan balik Anda di sini. Untuk melindungi privasi Anda, jangan sertakan info pribadi, seperti alamat atau nomor telepon"], ["Masukkan umpan balik Anda di sini. Untuk melindungi privasi Anda, jangan sertakan info pribadi, seperti alamat atau nomor telepon"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Kembali"], ["Kembali"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Kirim"], ["Kirim"]))), t.feedbackThanks = bt.default(te || (te = n(["Terima kasih atas umpan balik Anda!"], ["Terima kasih atas umpan balik Anda!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Pernyataan privasi"], ["Pernyataan privasi"]))), t.websiteDescription = bt.default(ne || (ne = n(["Lacak kasus virus corona COVID-19 lokal dan global dengan kasus aktif, pulih, dan tingkat kematian di peta, melalui berita dan video harian."], ["Lacak kasus virus corona COVID-19 lokal dan global dengan kasus aktif, pulih, dan tingkat kematian di peta, melalui berita dan video harian."]))), t.graphOverTime = bt.default(ie || (ie = n(["Sebaran Seiring Waktu"], ["Sebaran Seiring Waktu"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " jt"], ["", " jt"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " rb"], ["", " rb"])), 0), t.upsellDesc = bt.default(le || (le = n(["Lacak pembaruan terkini di ponsel Anda menggunakan aplikasi Bing"], ["Lacak pembaruan terkini di ponsel Anda menggunakan aplikasi Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Unduh sekarang"], ["Unduh sekarang"]))), t.upsellTitle = bt.default(de || (de = n(["Ikuti berita virus corona"], ["Ikuti berita virus corona"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Lacak virus corona"], ["Lacak virus corona"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Dapatkan info terbaru terkait virus corona di Bing jika Anda menambahkan ekstensi Chrome kami"], ["Dapatkan info terbaru terkait virus corona di Bing jika Anda menambahkan ekstensi Chrome kami"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Dapatkan info terbaru terkait virus corona di Bing jika Anda menambahkan ekstensi Firefox kami"], ["Dapatkan info terbaru terkait virus corona di Bing jika Anda menambahkan ekstensi Firefox kami"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Tambahkan ekstensi"], ["Tambahkan ekstensi"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Tetap aman, selalu update"], ["Tetap aman, selalu update"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Lacak dengan ekstensi"], ["Lacak dengan ekstensi"]))), t.submit = bt.default(he || (he = n(["Selesai"], ["Selesai"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "th"], ["", "th"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "b"], ["", "b"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "mg"], ["", "mg"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "h"], ["", "h"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "j"], ["", "j"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Lokasi Anda"], ["Lokasi Anda"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filter ke lokasi"], ["Filter ke lokasi"]))), t.expand = bt.default(ze || (ze = n(["Perluas"], ["Perluas"]))), t.trends = bt.default(Se || (Se = n(["Tren"], ["Tren"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Informasi Pengujian"], ["Informasi Pengujian"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokol & Kontak"], ["Protokol & Kontak"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokol"], ["Protokol"]))), t.hotline = bt.default(Me || (Me = n(["Hotline"], ["Hotline"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Perusahaan Mitra"], ["Perusahaan Mitra"]))), t.moreTestingLocations = bt.default(je || (je = n(["Lihat lokasi pengujian (", ")"], ["Lihat lokasi pengujian (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Lihat lebih sedikit"], ["Lihat lebih sedikit"]))), t.topTrends = bt.default(Be || (Be = n(["Perbandingan menurut total kasus"], ["Perbandingan menurut total kasus"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Info terbaru terkait virus corona"], ["Info terbaru terkait virus corona"]))), t.copyLink = bt.default(Le || (Le = n(["Salin tautan"], ["Salin tautan"]))), t.email = bt.default(Oe || (Oe = n(["Email"], ["Email"]))), t.cancel = bt.default(Re || (Re = n(["Batal"], ["Batal"]))), t.confirmed = bt.default(_e || (_e = n(["Dikonfirmasi"], ["Dikonfirmasi"]))), t.fatal = bt.default(Ne || (Ne = n(["Meninggal"], ["Meninggal"]))), t.recovered = bt.default(Ve || (Ve = n(["Pulih"], ["Pulih"]))), t.active = bt.default(Ue || (Ue = n(["Aktif"], ["Aktif"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Untuk melihat lokasi Anda, aktifkan izin lokasi di sini."], ["Untuk melihat lokasi Anda, aktifkan izin lokasi di sini."]))), t.overviewVertical = bt.default(He || (He = n(["Ringkasan"], ["Ringkasan"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Berita & Video"], ["Berita & Video"]))), t.graphstrends = bt.default(We || (We = n(["Grafik"], ["Grafik"]))), t.localResources = bt.default(Ke || (Ke = n(["Sumber Daya Lokal"], ["Sumber Daya Lokal"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Diperbarui ", " menit lalu"], ["Diperbarui ", " menit lalu"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Dengan mengirimkan nomor telepon dan email, Anda setuju untuk menerima pesan otomatis satu kali dari Microsoft ke nomor ponsel atau email ini. Tarif SMS standar berlaku."], ["Dengan mengirimkan nomor telepon dan email, Anda setuju untuk menerima pesan otomatis satu kali dari Microsoft ke nomor ponsel atau email ini. Tarif SMS standar berlaku."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Pernyataan Privasi Microsoft"], ["Pernyataan Privasi Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Kirim tautan"], ["Kirim tautan"]))), t.compare = bt.default(it || (it = n(["Bandingkan"], ["Bandingkan"]))), t.browse = bt.default(rt || (rt = n(["Telusuri"], ["Telusuri"]))), t.favorites = bt.default(ot || (ot = n(["Favorit"], ["Favorit"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Masukkan nomor telepon AS yang valid."], ["Masukkan nomor telepon AS yang valid."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Terima kasih. Silakan coba buka tautan yang dikirimkan ke ponsel Anda dalam satu jam."], ["Terima kasih. Silakan coba buka tautan yang dikirimkan ke ponsel Anda dalam satu jam."]))), t.opalSMSError = bt.default(dt || (dt = n(["Terjadi kesalahan, unduh aplikasi Bing Search dari app store."], ["Terjadi kesalahan, unduh aplikasi Bing Search dari app store."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Lebih banyak tentang ", ""], ["Lebih banyak tentang ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Lebih sedikit tentang ", ""], ["Lebih sedikit tentang ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Topik Sedang Tren"], ["Topik Sedang Tren"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Skala log"], ["Skala log"]))), t.linearScale = bt.default(vt || (vt = n(["Skala linear"], ["Skala linear"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hai! Saya bot yang bisa membantu terkait FAQ COVID-19 dan saya hadir untuk membantu menjawab pertanyaan Anda!"], ["Hai! Saya bot yang bisa membantu terkait FAQ COVID-19 dan saya hadir untuk membantu menjawab pertanyaan Anda!"]))), t.dataTitle = bt.default(gt || (gt = n(["Data"], ["Data"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.it-it.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Ultimo aggiornamento dati:"], ["Ultimo aggiornamento dati:"]))), t.urlCopied = bt.default(r || (r = n(["URL copiato in Appunti"], ["URL copiato in Appunti"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Monitoraggio COVID-19"], ["Monitoraggio COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Monitoraggio mappa in tempo reale coronavirus (COVID-19) - Microsoft Bing"], ["Monitoraggio mappa in tempo reale coronavirus (COVID-19) - Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Aree geografiche"], ["Aree geografiche"]))), t.noRegionalData = bt.default(u || (u = n(["I dati a livello regionale non sono ancora disponibili per questo paese o area geografica. Riprova più tardi."], ["I dati a livello regionale non sono ancora disponibili per questo paese o area geografica. Riprova più tardi."]))), t.activeCases = bt.default(c || (c = n(["Casi attivi"], ["Casi attivi"]))), t.recoveredCases = bt.default(f || (f = n(["Casi guariti"], ["Casi guariti"]))), t.fatalCases = bt.default(p || (p = n(["Casi letali"], ["Casi letali"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Attivi"], ["Attivi"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Guariti"], ["Guariti"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Decessi"], ["Decessi"]))), t.overview = bt.default(g || (g = n(["Panoramica"], ["Panoramica"]))), t.close = bt.default(b || (b = n(["Chiudi"], ["Chiudi"]))), t.selectARegion = bt.default(k || (k = n(["Seleziona un'area geografica"], ["Seleziona un'area geografica"]))), t.global = bt.default(y || (y = n(["Globale"], ["Globale"]))), t.globalStatus = bt.default(C || (C = n(["Stato globale"], ["Stato globale"]))), t.allRegions = bt.default(w || (w = n(["Tutte le aree geografiche"], ["Tutte le aree geografiche"]))), t.share = bt.default(x || (x = n(["Condividi"], ["Condividi"]))), t.dataInfo = bt.default(T || (T = n(["Informazioni dati"], ["Informazioni dati"]))), t.totalConfirmed = bt.default(z || (z = n(["Totale casi confermati"], ["Totale casi confermati"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Casi totali"], ["Casi totali"]))), t.totalAreas = bt.default(I || (I = n(["", " in totale"], ["", " in totale"])), 0), t.hideInfo = bt.default(A || (A = n(["Nascondi informazioni per visualizzare la mappa intera"], ["Nascondi informazioni per visualizzare la mappa intera"]))), t.showInfo = bt.default(D || (D = n(["Mostra informazioni"], ["Mostra informazioni"]))), t.news = bt.default(M || (M = n(["Notizie"], ["Notizie"]))), t.helpfulResources = bt.default(E || (E = n(["Supporto e informazioni"], ["Supporto e informazioni"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Maggiori dettagli"], ["Maggiori dettagli"]))), t.dataFrom = bt.default(O || (O = n(["Fonte dati:"], ["Fonte dati:"]))), t.videos = bt.default(R || (R = n(["Video"], ["Video"]))), t.moreNews = bt.default(_ || (_ = n(["Visualizza altri articoli"], ["Visualizza altri articoli"]))), t.moreVideos = bt.default(N || (N = n(["Visualizza altri video"], ["Visualizza altri video"]))), t.map = bt.default(V || (V = n(["Mappa:"], ["Mappa:"]))), t.feedback = bt.default(U || (U = n(["Dai un feedback"], ["Dai un feedback"]))), t.feedbackQuestion = bt.default(q || (q = n(["Che tipo di feedback vuoi esprimere su questo strumento?"], ["Che tipo di feedback vuoi esprimere su questo strumento?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Segnala un problema"], ["Segnala un problema"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Spiegaci il problema"], ["Spiegaci il problema"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Condividi un'idea"], ["Condividi un'idea"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Raccontaci la tua idea"], ["Raccontaci la tua idea"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Esprimi un apprezzamento"], ["Esprimi un apprezzamento"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Raccontaci cosa ti piace"], ["Raccontaci cosa ti piace"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Problema legale o di privacy"], ["Problema legale o di privacy"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Spiegaci il problema"], ["Spiegaci il problema"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Immetti qui il feedback. Per proteggere la tua privacy, non includere informazioni personali come l'indirizzo o il numero di telefono."], ["Immetti qui il feedback. Per proteggere la tua privacy, non includere informazioni personali come l'indirizzo o il numero di telefono."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Indietro"], ["Indietro"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Invia"], ["Invia"]))), t.feedbackThanks = bt.default(te || (te = n(["Grazie per il feedback"], ["Grazie per il feedback"]))), t.privacyStatement = bt.default(ae || (ae = n(["Informativa sulla privacy"], ["Informativa sulla privacy"]))), t.websiteDescription = bt.default(ne || (ne = n(["Monitora i casi di COVID-19 nel mondo e nella zona in cui ti trovi. Nella mappa sono indicati i numeri di casi attivi, guarigioni e decessi, con notizie e video quotidiani."], ["Monitora i casi di COVID-19 nel mondo e nella zona in cui ti trovi. Nella mappa sono indicati i numeri di casi attivi, guarigioni e decessi, con notizie e video quotidiani."]))), t.graphOverTime = bt.default(ie || (ie = n(["Diffusione nel tempo"], ["Diffusione nel tempo"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " milioni"], ["", " milioni"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " mila"], ["", " mila"])), 0), t.upsellDesc = bt.default(le || (le = n(["Monitora gli aggiornamenti più recenti sul cellulare con l'app di Bing"], ["Monitora gli aggiornamenti più recenti sul cellulare con l'app di Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Scarica ora"], ["Scarica ora"]))), t.upsellTitle = bt.default(de || (de = n(["Segui le notizie sul coronavirus"], ["Segui le notizie sul coronavirus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Monitora il coronavirus"], ["Monitora il coronavirus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Visualizza gli aggiornamenti più recenti sul coronvirus in Bing aggiungendo l'estensione per Chrome."], ["Visualizza gli aggiornamenti più recenti sul coronvirus in Bing aggiungendo l'estensione per Chrome."]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Visualizza gli aggiornamenti più recenti sul coronavirus in Bing aggiungendo l'estensione per Firefox."], ["Visualizza gli aggiornamenti più recenti sul coronavirus in Bing aggiungendo l'estensione per Firefox."]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Aggiungi estensione"], ["Aggiungi estensione"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Pensa alla tua salute, tieniti informato"], ["Pensa alla tua salute, tieniti informato"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Monitora con l'estensione"], ["Monitora con l'estensione"]))), t.submit = bt.default(he || (he = n(["Fatto"], ["Fatto"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " anni"], ["", " anni"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " mesi"], ["", " mesi"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " sett."], ["", " sett."])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " g"], ["", " g"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " h"], ["", " h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " m"], ["", " m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["La tua posizione"], ["La tua posizione"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtra una località"], ["Filtra una località"]))), t.expand = bt.default(ze || (ze = n(["Espandi"], ["Espandi"]))), t.trends = bt.default(Se || (Se = n(["Andamento"], ["Andamento"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Informazioni sui tamponi"], ["Informazioni sui tamponi"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protocollo e contatti"], ["Protocollo e contatti"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protocollo"], ["Protocollo"]))), t.hotline = bt.default(Me || (Me = n(["Numero di emergenza"], ["Numero di emergenza"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Aziende partner"], ["Aziende partner"]))), t.moreTestingLocations = bt.default(je || (je = n(["Mostra luoghi dove fare il tampone (", ")"], ["Mostra luoghi dove fare il tampone (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Meno dettagli"], ["Meno dettagli"]))), t.topTrends = bt.default(Be || (Be = n(["Confronto per casi totali"], ["Confronto per casi totali"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Ultimi aggiornamenti sul coronavirus"], ["Ultimi aggiornamenti sul coronavirus"]))), t.copyLink = bt.default(Le || (Le = n(["Copia collegamento"], ["Copia collegamento"]))), t.email = bt.default(Oe || (Oe = n(["E-mail"], ["E-mail"]))), t.cancel = bt.default(Re || (Re = n(["Annulla"], ["Annulla"]))), t.confirmed = bt.default(_e || (_e = n(["Confermati"], ["Confermati"]))), t.fatal = bt.default(Ne || (Ne = n(["Decessi"], ["Decessi"]))), t.recovered = bt.default(Ve || (Ve = n(["Guariti"], ["Guariti"]))), t.active = bt.default(Ue || (Ue = n(["Attivi"], ["Attivi"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Per visualizzare la tua ubicazione, abilita le autorizzazioni correlate qui."], ["Per visualizzare la tua ubicazione, abilita le autorizzazioni correlate qui."]))), t.overviewVertical = bt.default(He || (He = n(["Panoramica"], ["Panoramica"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Notizie e video"], ["Notizie e video"]))), t.graphstrends = bt.default(We || (We = n(["Grafici"], ["Grafici"]))), t.localResources = bt.default(Ke || (Ke = n(["Risorse locali"], ["Risorse locali"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Ultimo aggiornamento: ", " min. fa"], ["Ultimo aggiornamento: ", " min. fa"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Inviando il numero di telefono o l'e-mail, accetti di ricevere un messaggio automatico di Microsoft al numero di telefono o all'e-mail specificata. Potrebbe essere applicata la tariffa standard per gli SMS."], ["Inviando il numero di telefono o l'e-mail, accetti di ricevere un messaggio automatico di Microsoft al numero di telefono o all'e-mail specificata. Potrebbe essere applicata la tariffa standard per gli SMS."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Informativa sulla privacy di Microsoft"], ["Informativa sulla privacy di Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Invia collegamento"], ["Invia collegamento"]))), t.compare = bt.default(it || (it = n(["Confronta"], ["Confronta"]))), t.browse = bt.default(rt || (rt = n(["Sfoglia"], ["Sfoglia"]))), t.favorites = bt.default(ot || (ot = n(["Preferiti"], ["Preferiti"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Immetti un numero di telefono valido negli Stati Uniti."], ["Immetti un numero di telefono valido negli Stati Uniti."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Grazie. Hai un'ora per provare il collegamento inviato al telefono."], ["Grazie. Hai un'ora per provare il collegamento inviato al telefono."]))), t.opalSMSError = bt.default(dt || (dt = n(["Si è verificato un errore. Scarica l'app Ricerca Bing dall'App store."], ["Si è verificato un errore. Scarica l'app Ricerca Bing dall'App store."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Visualizza altro su ", ""], ["Visualizza altro su ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Visualizza meno su ", ""], ["Visualizza meno su ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Argomenti di tendenza"], ["Argomenti di tendenza"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Scala logaritmica"], ["Scala logaritmica"]))), t.linearScale = bt.default(vt || (vt = n(["Scala lineare"], ["Scala lineare"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Ciao! Sono il bot dedicato alle FAQ sul COVID-19 e sono qui per rispondere alle tue domande."], ["Ciao! Sono il bot dedicato alle FAQ sul COVID-19 e sono qui per rispondere alle tue domande."]))), t.dataTitle = bt.default(gt || (gt = n(["Dati"], ["Dati"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.ja-jp.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["データの最終更新日:"], ["データの最終更新日:"]))), t.urlCopied = bt.default(r || (r = n(["URL がクリップボードにコピーされました"], ["URL がクリップボードにコピーされました"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19 トラッカー"], ["COVID-19 トラッカー"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing が提供するコロナウィルス (COVID-19) ライブ マップ トラッカー"], ["Microsoft Bing が提供するコロナウィルス (COVID-19) ライブ マップ トラッカー"]))), t.citiesAndProvinces = bt.default(d || (d = n(["地域"], ["地域"]))), t.noRegionalData = bt.default(u || (u = n(["この国/地域では地域別のデータはまだ利用できません。後で再試行してください。"], ["この国/地域では地域別のデータはまだ利用できません。後で再試行してください。"]))), t.activeCases = bt.default(c || (c = n(["患者数"], ["患者数"]))), t.recoveredCases = bt.default(f || (f = n(["回復者数"], ["回復者数"]))), t.fatalCases = bt.default(p || (p = n(["死亡者数"], ["死亡者数"]))), t.activeCasesForCallout = bt.default(m || (m = n(["患者数"], ["患者数"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["回復者数"], ["回復者数"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["死亡者数"], ["死亡者数"]))), t.overview = bt.default(g || (g = n(["概要"], ["概要"]))), t.close = bt.default(b || (b = n(["閉じる"], ["閉じる"]))), t.selectARegion = bt.default(k || (k = n(["地域を選択"], ["地域を選択"]))), t.global = bt.default(y || (y = n(["世界全体"], ["世界全体"]))), t.globalStatus = bt.default(C || (C = n(["世界全体の状態"], ["世界全体の状態"]))), t.allRegions = bt.default(w || (w = n(["すべての地域"], ["すべての地域"]))), t.share = bt.default(x || (x = n(["共有"], ["共有"]))), t.dataInfo = bt.default(T || (T = n(["データ情報"], ["データ情報"]))), t.totalConfirmed = bt.default(z || (z = n(["感染者数合計"], ["感染者数合計"]))), t.totalConfirmedShort = bt.default(S || (S = n(["合計感染者数"], ["合計感染者数"]))), t.totalAreas = bt.default(I || (I = n(["全部で ", ""], ["全部で ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["情報を非表示にして完全な地図を表示"], ["情報を非表示にして完全な地図を表示"]))), t.showInfo = bt.default(D || (D = n(["情報を表示"], ["情報を表示"]))), t.news = bt.default(M || (M = n(["ニュース"], ["ニュース"]))), t.helpfulResources = bt.default(E || (E = n(["ヘルプと情報"], ["ヘルプと情報"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["表示を増やす"], ["表示を増やす"]))), t.dataFrom = bt.default(O || (O = n(["データ出典元:"], ["データ出典元:"]))), t.videos = bt.default(R || (R = n(["ビデオ"], ["ビデオ"]))), t.moreNews = bt.default(_ || (_ = n(["その他の記事を表示"], ["その他の記事を表示"]))), t.moreVideos = bt.default(N || (N = n(["その他のビデオを表示"], ["その他のビデオを表示"]))), t.map = bt.default(V || (V = n(["マップ:"], ["マップ:"]))), t.feedback = bt.default(U || (U = n(["フィードバックを提供"], ["フィードバックを提供"]))), t.feedbackQuestion = bt.default(q || (q = n(["このツールについて、どのような種類のフィードバックがありますか?"], ["このツールについて、どのような種類のフィードバックがありますか?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["問題を報告"], ["問題を報告"]))), t.feedbackTellIssue = bt.default(G || (G = n(["問題について教えてください"], ["問題について教えてください"]))), t.feedbackShareIdea = bt.default(W || (W = n(["アイデアを共有"], ["アイデアを共有"]))), t.feedbackTellIdea = bt.default(K || (K = n(["あなたのアイデアについて教えてください"], ["あなたのアイデアについて教えてください"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["賛辞を示す"], ["賛辞を示す"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["あなたが気に入ったところを教えてください"], ["あなたが気に入ったところを教えてください"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["法的事項またはプライバシーに関する問題"], ["法的事項またはプライバシーに関する問題"]))), t.feedbackTellConcern = bt.default(J || (J = n(["あなたの懸念事項について教えてください"], ["あなたの懸念事項について教えてください"]))), t.feedbackTextEntry = bt.default(X || (X = n(["フィードバックをここに入力してください。プライバシーを保護するため、住所や電話番号などの個人情報は含めないでください。"], ["フィードバックをここに入力してください。プライバシーを保護するため、住所や電話番号などの個人情報は含めないでください。"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["戻る"], ["戻る"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["送信"], ["送信"]))), t.feedbackThanks = bt.default(te || (te = n(["フィードバックありがとうございます!"], ["フィードバックありがとうございます!"]))), t.privacyStatement = bt.default(ae || (ae = n(["プライバシーに関する声明"], ["プライバシーに関する声明"]))), t.websiteDescription = bt.default(ne || (ne = n(["ローカルおよび世界全体での COVID-19 コロナウィルスの患者数、回復者数、および死亡率の状況をマップ上で追跡し、日々のニュースやビデオも提供します。"], ["ローカルおよび世界全体での COVID-19 コロナウィルスの患者数、回復者数、および死亡率の状況をマップ上で追跡し、日々のニュースやビデオも提供します。"]))), t.graphOverTime = bt.default(ie || (ie = n(["感染者数の推移"], ["感染者数の推移"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "00万"], ["", "00万"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " 千"], ["", " 千"])), 0), t.upsellDesc = bt.default(le || (le = n(["Bing アプリを使用して携帯電話で最新情報を追跡できます"], ["Bing アプリを使用して携帯電話で最新情報を追跡できます"]))), t.upsellCTA = bt.default(se || (se = n(["今すぐダウンロード"], ["今すぐダウンロード"]))), t.upsellTitle = bt.default(de || (de = n(["コロナウィルス関連ニュースをフォロー"], ["コロナウィルス関連ニュースをフォロー"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["新型コロナウィルスを追跡"], ["新型コロナウィルスを追跡"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Chrome 拡張機能を追加すると、Bing でコロナウィルスに関する最新情報を取得できます"], ["Chrome 拡張機能を追加すると、Bing でコロナウィルスに関する最新情報を取得できます"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Firefox 拡張機能を追加すると、Bing でコロナウィルスに関する最新情報を取得できます"], ["Firefox 拡張機能を追加すると、Bing でコロナウィルスに関する最新情報を取得できます"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["拡張機能を追加"], ["拡張機能を追加"]))), t.dseUpsellTitle = bt.default(me || (me = n(["安全の確保と、最新情報の確認を継続しましょう"], ["安全の確保と、最新情報の確認を継続しましょう"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["拡張機能で追跡"], ["拡張機能で追跡"]))), t.submit = bt.default(he || (he = n(["完了"], ["完了"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " 年前"], ["", " 年前"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " か月前"], ["", " か月前"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " 週間前"], ["", " 週間前"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " 日前"], ["", " 日前"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " 時間前"], ["", " 時間前"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " 分前"], ["", " 分前"])), 0), t.yourLocation = bt.default(xe || (xe = n(["現在地"], ["現在地"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["1 つの場所に絞り込みます"], ["1 つの場所に絞り込みます"]))), t.expand = bt.default(ze || (ze = n(["拡大"], ["拡大"]))), t.trends = bt.default(Se || (Se = n(["データ"], ["データ"]))), t.testingProcess = bt.default(Ie || (Ie = n(["検査関連情報"], ["検査関連情報"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["プロトコルと連絡先"], ["プロトコルと連絡先"]))), t.testingProcessProtocol = bt.default(De || (De = n(["プロトコル"], ["プロトコル"]))), t.hotline = bt.default(Me || (Me = n(["ホットライン"], ["ホットライン"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["パートナー企業"], ["パートナー企業"]))), t.moreTestingLocations = bt.default(je || (je = n(["検査場所を表示 (", ")"], ["検査場所を表示 (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["表示を減らす"], ["表示を減らす"]))), t.topTrends = bt.default(Be || (Be = n(["総患者数の比較"], ["総患者数の比較"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["新型コロナウィルスの最新情報"], ["新型コロナウィルスの最新情報"]))), t.copyLink = bt.default(Le || (Le = n(["リンクをコピー"], ["リンクをコピー"]))), t.email = bt.default(Oe || (Oe = n(["電子メール"], ["電子メール"]))), t.cancel = bt.default(Re || (Re = n(["キャンセル"], ["キャンセル"]))), t.confirmed = bt.default(_e || (_e = n(["感染者数"], ["感染者数"]))), t.fatal = bt.default(Ne || (Ne = n(["死亡者数"], ["死亡者数"]))), t.recovered = bt.default(Ve || (Ve = n(["回復者数"], ["回復者数"]))), t.active = bt.default(Ue || (Ue = n(["患者数"], ["患者数"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["自分の場所を表示するには、ここで位置情報へのアクセスを許可してください。"], ["自分の場所を表示するには、ここで位置情報へのアクセスを許可してください。"]))), t.overviewVertical = bt.default(He || (He = n(["概要"], ["概要"]))), t.newsvideos = bt.default(Ge || (Ge = n(["ニュースとビデオ"], ["ニュースとビデオ"]))), t.graphstrends = bt.default(We || (We = n(["グラフ"], ["グラフ"]))), t.localResources = bt.default(Ke || (Ke = n(["地域の情報"], ["地域の情報"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " 分前に更新"], ["", " 分前に更新"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["電話番号またはメール アドレスを送信することにより、Microsoft からこの携帯電話番号またはメール アドレスに送られる 1 回限りの自動メッセージを受信することに同意したものと見なされます。SMS の標準料金が適用されます。"], ["電話番号またはメール アドレスを送信することにより、Microsoft からこの携帯電話番号またはメール アドレスに送られる 1 回限りの自動メッセージを受信することに同意したものと見なされます。SMS の標準料金が適用されます。"]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft プライバシー ステートメント"], ["Microsoft プライバシー ステートメント"]))), t.sendLink = bt.default(nt || (nt = n(["リンクを送信"], ["リンクを送信"]))), t.compare = bt.default(it || (it = n(["比較"], ["比較"]))), t.browse = bt.default(rt || (rt = n(["参照"], ["参照"]))), t.favorites = bt.default(ot || (ot = n(["お気に入り"], ["お気に入り"]))), t.validNumberRequired = bt.default(lt || (lt = n(["米国の有効な電話番号を入力してください。"], ["米国の有効な電話番号を入力してください。"]))), t.opalSMSAccepted = bt.default(st || (st = n(["ありがとうございます。1 時間以内に携帯電話に送信されたリンクを使用してください。"], ["ありがとうございます。1 時間以内に携帯電話に送信されたリンクを使用してください。"]))), t.opalSMSError = bt.default(dt || (dt = n(["エラーが発生しました。Bing 検索アプリをアプリ ストアからダウンロードしてください。"], ["エラーが発生しました。Bing 検索アプリをアプリ ストアからダウンロードしてください。"]))), t.moreOnTopic = bt.default(ut || (ut = n(["", "関連トピックの表示を増やす"], ["", "関連トピックの表示を増やす"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["", "関連トピックの表示を減らす"], ["", "関連トピックの表示を減らす"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["話題のトピック"], ["話題のトピック"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["対数スケール"], ["対数スケール"]))), t.linearScale = bt.default(vt || (vt = n(["線形スケール"], ["線形スケール"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["こんにちは! 私は COVID-19 FAQ ヘルパー ボットです。みなさんの質問にお答えします。"], ["こんにちは! 私は COVID-19 FAQ ヘルパー ボットです。みなさんの質問にお答えします。"]))), t.dataTitle = bt.default(gt || (gt = n(["データ"], ["データ"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.ko-kr.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["최종 업데이트 날짜:"], ["최종 업데이트 날짜:"]))), t.urlCopied = bt.default(r || (r = n(["URL을 클립보드로 복사"], ["URL을 클립보드로 복사"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["코로나19 추적기 "], ["코로나19 추적기 "]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing의 코로나바이러스(코로나19) 라이브맵 추적기"], ["Microsoft Bing의 코로나바이러스(코로나19) 라이브맵 추적기"]))), t.citiesAndProvinces = bt.default(d || (d = n(["지역"], ["지역"]))), t.noRegionalData = bt.default(u || (u = n(["이 국가/지역은 아직 지역별 데이터가 없습니다. 나중에 다시 시도하세요."], ["이 국가/지역은 아직 지역별 데이터가 없습니다. 나중에 다시 시도하세요."]))), t.activeCases = bt.default(c || (c = n(["치료 중"], ["치료 중"]))), t.recoveredCases = bt.default(f || (f = n(["완치"], ["완치"]))), t.fatalCases = bt.default(p || (p = n(["사망자"], ["사망자"]))), t.activeCasesForCallout = bt.default(m || (m = n(["치료 중"], ["치료 중"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["완치"], ["완치"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["사망"], ["사망"]))), t.overview = bt.default(g || (g = n(["개요"], ["개요"]))), t.close = bt.default(b || (b = n(["닫기"], ["닫기"]))), t.selectARegion = bt.default(k || (k = n(["지역 선택"], ["지역 선택"]))), t.global = bt.default(y || (y = n(["전 세계"], ["전 세계"]))), t.globalStatus = bt.default(C || (C = n(["전 세계 현황"], ["전 세계 현황"]))), t.allRegions = bt.default(w || (w = n(["모든 지역"], ["모든 지역"]))), t.share = bt.default(x || (x = n(["공유"], ["공유"]))), t.dataInfo = bt.default(T || (T = n(["데이터 정보"], ["데이터 정보"]))), t.totalConfirmed = bt.default(z || (z = n(["총 확진환자 수"], ["총 확진환자 수"]))), t.totalConfirmedShort = bt.default(S || (S = n(["총 확진환자 수"], ["총 확진환자 수"]))), t.totalAreas = bt.default(I || (I = n(["총 ", ""], ["총 ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["정보를 닫고 전체 지도를 표시합니다."], ["정보를 닫고 전체 지도를 표시합니다."]))), t.showInfo = bt.default(D || (D = n(["정보 표시"], ["정보 표시"]))), t.news = bt.default(M || (M = n(["뉴스"], ["뉴스"]))), t.helpfulResources = bt.default(E || (E = n(["도움말 & 정보"], ["도움말 & 정보"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["더 보기"], ["더 보기"]))), t.dataFrom = bt.default(O || (O = n(["데이터 출처:"], ["데이터 출처:"]))), t.videos = bt.default(R || (R = n(["동영상"], ["동영상"]))), t.moreNews = bt.default(_ || (_ = n(["더 많은 기사 보기"], ["더 많은 기사 보기"]))), t.moreVideos = bt.default(N || (N = n(["더 많은 동영상 보기"], ["더 많은 동영상 보기"]))), t.map = bt.default(V || (V = n(["지도:"], ["지도:"]))), t.feedback = bt.default(U || (U = n(["피드백 제공"], ["피드백 제공"]))), t.feedbackQuestion = bt.default(q || (q = n(["이 도구에 관해 피드백이 있으신가요?"], ["이 도구에 관해 피드백이 있으신가요?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["문제 신고"], ["문제 신고"]))), t.feedbackTellIssue = bt.default(G || (G = n(["문제를 설명해 주세요."], ["문제를 설명해 주세요."]))), t.feedbackShareIdea = bt.default(W || (W = n(["의견 공유"], ["의견 공유"]))), t.feedbackTellIdea = bt.default(K || (K = n(["의견을 설명해 주세요."], ["의견을 설명해 주세요."]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["칭찬하기"], ["칭찬하기"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["마음에 드는 점을 설명해 주세요."], ["마음에 드는 점을 설명해 주세요."]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["법적 또는 개인 정보 관련 우려 사항"], ["법적 또는 개인 정보 관련 우려 사항"]))), t.feedbackTellConcern = bt.default(J || (J = n(["우려 사항을 설명해 주세요."], ["우려 사항을 설명해 주세요."]))), t.feedbackTextEntry = bt.default(X || (X = n(["여기에 피드백을 입력해 주세요. 개인 정보를 보호하기 위해 전자 메일 주소, 전화번호와 같은 개인 정보는 포함하지 마세요."], ["여기에 피드백을 입력해 주세요. 개인 정보를 보호하기 위해 전자 메일 주소, 전화번호와 같은 개인 정보는 포함하지 마세요."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["돌아가기"], ["돌아가기"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["전송"], ["전송"]))), t.feedbackThanks = bt.default(te || (te = n(["피드백을 주셔서 감사합니다!"], ["피드백을 주셔서 감사합니다!"]))), t.privacyStatement = bt.default(ae || (ae = n(["개인정보처리방침"], ["개인정보처리방침"]))), t.websiteDescription = bt.default(ne || (ne = n(["전 세계 및 주변 지역의 코로나바이러스 확진환자, 완치, 사망자 수를 지도에서 추적해 보세요. 관련 일일 뉴스와 동영상도 제공합니다."], ["전 세계 및 주변 지역의 코로나바이러스 확진환자, 완치, 사망자 수를 지도에서 추적해 보세요. 관련 일일 뉴스와 동영상도 제공합니다."]))), t.graphOverTime = bt.default(ie || (ie = n(["확산 추세"], ["확산 추세"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "백만"], ["", "백만"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "천"], ["", "천"])), 0), t.upsellDesc = bt.default(le || (le = n(["Bing 앱을 사용하면 휴대폰으로 최신 업데이트를 확인할 수 있습니다."], ["Bing 앱을 사용하면 휴대폰으로 최신 업데이트를 확인할 수 있습니다."]))), t.upsellCTA = bt.default(se || (se = n(["지금 다운로드"], ["지금 다운로드"]))), t.upsellTitle = bt.default(de || (de = n(["코로나바이러스 관련 뉴스를 팔로우하세요."], ["코로나바이러스 관련 뉴스를 팔로우하세요."]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["코로나바이러스 추적하기"], ["코로나바이러스 추적하기"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Chrome용 확장 프로그램을 추가하면 Bing에서 코로나바이러스 관련 최신 업데이트를 확인할 수 있습니다."], ["Chrome용 확장 프로그램을 추가하면 Bing에서 코로나바이러스 관련 최신 업데이트를 확인할 수 있습니다."]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Firefox용 확장 프로그램을 추가하면 Bing에서 코로나바이러스 관련 최신 업데이트를 확인할 수 있습니다."], ["Firefox용 확장 프로그램을 추가하면 Bing에서 코로나바이러스 관련 최신 업데이트를 확인할 수 있습니다."]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["확장 프로그램 추가"], ["확장 프로그램 추가"]))), t.dseUpsellTitle = bt.default(me || (me = n(["안전하게 지내세요. 정보를 꾸준히 확인하세요."], ["안전하게 지내세요. 정보를 꾸준히 확인하세요."]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["확장 프로그램으로 추적하기"], ["확장 프로그램으로 추적하기"]))), t.submit = bt.default(he || (he = n(["제출"], ["제출"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "년 전"], ["", "년 전"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "개월 전"], ["", "개월 전"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "주일 전"], ["", "주일 전"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "일 전"], ["", "일 전"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "시간 전"], ["", "시간 전"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "분 전"], ["", "분 전"])), 0), t.yourLocation = bt.default(xe || (xe = n(["내 위치"], ["내 위치"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["장소별로 필터링합니다."], ["장소별로 필터링합니다."]))), t.expand = bt.default(ze || (ze = n(["확대"], ["확대"]))), t.trends = bt.default(Se || (Se = n(["발생 동향"], ["발생 동향"]))), t.testingProcess = bt.default(Ie || (Ie = n(["검사 정보"], ["검사 정보"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["프로토콜 및 연락처"], ["프로토콜 및 연락처"]))), t.testingProcessProtocol = bt.default(De || (De = n(["프로토콜"], ["프로토콜"]))), t.hotline = bt.default(Me || (Me = n(["상담 전화"], ["상담 전화"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["협력사"], ["협력사"]))), t.moreTestingLocations = bt.default(je || (je = n(["검사 장소 보기(", ")"], ["검사 장소 보기(", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["간략히 보기"], ["간략히 보기"]))), t.topTrends = bt.default(Be || (Be = n(["총 확진환자 수 비교"], ["총 확진환자 수 비교"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["코로나바이러스 관련 최신 업데이트"], ["코로나바이러스 관련 최신 업데이트"]))), t.copyLink = bt.default(Le || (Le = n(["링크 복사"], ["링크 복사"]))), t.email = bt.default(Oe || (Oe = n(["전자 메일"], ["전자 메일"]))), t.cancel = bt.default(Re || (Re = n(["취소"], ["취소"]))), t.confirmed = bt.default(_e || (_e = n(["확진환자"], ["확진환자"]))), t.fatal = bt.default(Ne || (Ne = n(["사망"], ["사망"]))), t.recovered = bt.default(Ve || (Ve = n(["완치"], ["완치"]))), t.active = bt.default(Ue || (Ue = n(["치료 중"], ["치료 중"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["사용자 위치를 사용하려면 여기에서 위치 접근 권한을 활성화하세요."], ["사용자 위치를 사용하려면 여기에서 위치 접근 권한을 활성화하세요."]))), t.overviewVertical = bt.default(He || (He = n(["개요"], ["개요"]))), t.newsvideos = bt.default(Ge || (Ge = n(["뉴스 및 동영상"], ["뉴스 및 동영상"]))), t.graphstrends = bt.default(We || (We = n(["그래프"], ["그래프"]))), t.localResources = bt.default(Ke || (Ke = n(["현지 정보"], ["현지 정보"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["트위터"], ["트위터"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", "분 전 업데이트됨"], ["", "분 전 업데이트됨"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["휴대폰 번호나 전자 메일을 전송하면 Microsoft에서 해당 휴대폰 번호나 전자 메일로 일회성 자동 메시지를 수신하는 것에 동의하게 됩니다. 표준 SMS 요금이 적용됩니다."], ["휴대폰 번호나 전자 메일을 전송하면 Microsoft에서 해당 휴대폰 번호나 전자 메일로 일회성 자동 메시지를 수신하는 것에 동의하게 됩니다. 표준 SMS 요금이 적용됩니다."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft 개인정보처리방침"], ["Microsoft 개인정보처리방침"]))), t.sendLink = bt.default(nt || (nt = n(["링크 전송"], ["링크 전송"]))), t.compare = bt.default(it || (it = n(["비교"], ["비교"]))), t.browse = bt.default(rt || (rt = n(["찾아보다"], ["찾아보다"]))), t.favorites = bt.default(ot || (ot = n(["즐겨찾기"], ["즐겨찾기"]))), t.validNumberRequired = bt.default(lt || (lt = n(["유효한 미국 전화번호를 입력하세요."], ["유효한 미국 전화번호를 입력하세요."]))), t.opalSMSAccepted = bt.default(st || (st = n(["감사합니다. 휴대폰으로 전송된 링크는 1시간 이내에 사용해 주세요."], ["감사합니다. 휴대폰으로 전송된 링크는 1시간 이내에 사용해 주세요."]))), t.opalSMSError = bt.default(dt || (dt = n(["오류가 발생했습니다. 앱 스토어에서 Bing Search 앱을 다운로드하세요."], ["오류가 발생했습니다. 앱 스토어에서 Bing Search 앱을 다운로드하세요."]))), t.moreOnTopic = bt.default(ut || (ut = n(["", "에 관해 더 보기"], ["", "에 관해 더 보기"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["", "에 관해 간략히 보기"], ["", "에 관해 간략히 보기"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["실시간 화제"], ["실시간 화제"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["로그 그래프"], ["로그 그래프"]))), t.linearScale = bt.default(vt || (vt = n(["선 그래프"], ["선 그래프"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["안녕하세요! 저는 코로나19 FAQ 도우미봇입니다. 질문에 답해 드릴게요!"], ["안녕하세요! 저는 코로나19 FAQ 도우미봇입니다. 질문에 답해 드릴게요!"]))), t.dataTitle = bt.default(gt || (gt = n(["데이터"], ["데이터"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.mr-in.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["डेटाला अखेरचे अद्ययावत केले:"], ["डेटाला अखेरचे अद्ययावत केले:"]))), t.urlCopied = bt.default(r || (r = n(["Url ची क्लिपबोर्डमध्ये प्रतिलिपी करण्यात आली"], ["Url ची क्लिपबोर्डमध्ये प्रतिलिपी करण्यात आली"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19 ट्रॅकर"], ["COVID-19 ट्रॅकर"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing द्वारे प्रदान केलेला कोरोना व्हायरस (COVID-19) लाइव्‍ह नकाशा ट्रॅकर"], ["Microsoft Bing द्वारे प्रदान केलेला कोरोना व्हायरस (COVID-19) लाइव्‍ह नकाशा ट्रॅकर"]))), t.citiesAndProvinces = bt.default(d || (d = n(["प्रदेश"], ["प्रदेश"]))), t.noRegionalData = bt.default(u || (u = n(["या देश/प्रदेशासाठी प्रादेशिक डेटा अद्याप उपलब्ध नाही. नंतर पुन्हा प्रयत्न करा."], ["या देश/प्रदेशासाठी प्रादेशिक डेटा अद्याप उपलब्ध नाही. नंतर पुन्हा प्रयत्न करा."]))), t.activeCases = bt.default(c || (c = n(["सक्रिय केसेस"], ["सक्रिय केसेस"]))), t.recoveredCases = bt.default(f || (f = n(["बरे झालेले केसेस"], ["बरे झालेले केसेस"]))), t.fatalCases = bt.default(p || (p = n(["प्राणघातक केसेस"], ["प्राणघातक केसेस"]))), t.activeCasesForCallout = bt.default(m || (m = n(["सक्रिय"], ["सक्रिय"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["बरे झालेले"], ["बरे झालेले"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["प्राणघातक"], ["प्राणघातक"]))), t.overview = bt.default(g || (g = n(["परिदर्शन"], ["परिदर्शन"]))), t.close = bt.default(b || (b = n(["बंद करा"], ["बंद करा"]))), t.selectARegion = bt.default(k || (k = n(["प्रदेश निवडा"], ["प्रदेश निवडा"]))), t.global = bt.default(y || (y = n(["ग्लोबल"], ["ग्लोबल"]))), t.globalStatus = bt.default(C || (C = n(["ग्लोबल स्थिती"], ["ग्लोबल स्थिती"]))), t.allRegions = bt.default(w || (w = n(["सर्व प्रदेश"], ["सर्व प्रदेश"]))), t.share = bt.default(x || (x = n(["शेअर करा"], ["शेअर करा"]))), t.dataInfo = bt.default(T || (T = n(["डेटा माहिती"], ["डेटा माहिती"]))), t.totalConfirmed = bt.default(z || (z = n(["एकूण निश्चित केसेस"], ["एकूण निश्चित केसेस"]))), t.totalConfirmedShort = bt.default(S || (S = n(["एकूण केसेस"], ["एकूण केसेस"]))), t.totalAreas = bt.default(I || (I = n(["एकूण ", ""], ["एकूण ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["संपूर्ण नकाशा पाहण्यासाठी माहिती लपवा"], ["संपूर्ण नकाशा पाहण्यासाठी माहिती लपवा"]))), t.showInfo = bt.default(D || (D = n(["माहिती दाखवा"], ["माहिती दाखवा"]))), t.news = bt.default(M || (M = n(["बातम्या"], ["बातम्या"]))), t.helpfulResources = bt.default(E || (E = n(["मदत आणि माहिती"], ["मदत आणि माहिती"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["अधिक पहा"], ["अधिक पहा"]))), t.dataFrom = bt.default(O || (O = n(["डेटा प्रदाता:"], ["डेटा प्रदाता:"]))), t.videos = bt.default(R || (R = n(["व्हिडिओ"], ["व्हिडिओ"]))), t.moreNews = bt.default(_ || (_ = n(["अधिक लेख पहा"], ["अधिक लेख पहा"]))), t.moreVideos = bt.default(N || (N = n(["अधिक व्हिडिओ पहा"], ["अधिक व्हिडिओ पहा"]))), t.map = bt.default(V || (V = n(["नकाशा:"], ["नकाशा:"]))), t.feedback = bt.default(U || (U = n(["फीडबॅक द्या"], ["फीडबॅक द्या"]))), t.feedbackQuestion = bt.default(q || (q = n(["या टूलविषयी आपला कोणत्या प्रकारचा फीडबॅक आहे?"], ["या टूलविषयी आपला कोणत्या प्रकारचा फीडबॅक आहे?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["समस्येविषयी तक्रार करा"], ["समस्येविषयी तक्रार करा"]))), t.feedbackTellIssue = bt.default(G || (G = n(["आम्हाला समस्येविषयी सांगा"], ["आम्हाला समस्येविषयी सांगा"]))), t.feedbackShareIdea = bt.default(W || (W = n(["विचार शेअर करा"], ["विचार शेअर करा"]))), t.feedbackTellIdea = bt.default(K || (K = n(["आम्हाला आपल्या विचारांविषयी सांगा"], ["आम्हाला आपल्या विचारांविषयी सांगा"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["प्रशंसा करा"], ["प्रशंसा करा"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["आपणांस काय आवडते, ते आम्हाला सांगा"], ["आपणांस काय आवडते, ते आम्हाला सांगा"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["कायदेशीर किंवा प्रायव्हसीसंबंधित चिंता"], ["कायदेशीर किंवा प्रायव्हसीसंबंधित चिंता"]))), t.feedbackTellConcern = bt.default(J || (J = n(["आम्हाला आपल्या चिंतेविषयी सांगा"], ["आम्हाला आपल्या चिंतेविषयी सांगा"]))), t.feedbackTextEntry = bt.default(X || (X = n(["येथे फीडबॅक प्रविष्ट करा. आपल्या प्रायव्हसीच्या संरक्षणेसाठी, आपला पत्ता किंवा फोन नंबर यासारखी वैयक्तिक माहिती समाविष्ट करू नये"], ["येथे फीडबॅक प्रविष्ट करा. आपल्या प्रायव्हसीच्या संरक्षणेसाठी, आपला पत्ता किंवा फोन नंबर यासारखी वैयक्तिक माहिती समाविष्ट करू नये"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["मागे जा"], ["मागे जा"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["पाठवा"], ["पाठवा"]))), t.feedbackThanks = bt.default(te || (te = n(["आपल्या फीडबॅकबद्दल धन्यवाद!"], ["आपल्या फीडबॅकबद्दल धन्यवाद!"]))), t.privacyStatement = bt.default(ae || (ae = n(["प्रायव्हसी स्टेटमेंट"], ["प्रायव्हसी स्टेटमेंट"]))), t.websiteDescription = bt.default(ne || (ne = n(["COVID-19 संबंधित स्थानिक आणि ग्लोबल सक्रिय केसेस, बरे झालेले केसेस आणि मृत्युच्या आकडेवारीसहित कोरोना व्हायरस केसेसना नकाशावर ट्रॅक करा, याशिवाय दैनिक बातम्या आणि व्हिडिओ पहा."], ["COVID-19 संबंधित स्थानिक आणि ग्लोबल सक्रिय केसेस, बरे झालेले केसेस आणि मृत्युच्या आकडेवारीसहित कोरोना व्हायरस केसेसना नकाशावर ट्रॅक करा, याशिवाय दैनिक बातम्या आणि व्हिडिओ पहा."]))), t.graphOverTime = bt.default(ie || (ie = n(["वेळेनुसार पसरला"], ["वेळेनुसार पसरला"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "M"], ["", "M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = bt.default(le || (le = n(["आपल्या फोनवर Bing अनुप्रयोगाद्वारे नवीनतम अद्यतने ट्रॅक करा"], ["आपल्या फोनवर Bing अनुप्रयोगाद्वारे नवीनतम अद्यतने ट्रॅक करा"]))), t.upsellCTA = bt.default(se || (se = n(["आता डाउनलोड करा"], ["आता डाउनलोड करा"]))), t.upsellTitle = bt.default(de || (de = n(["कोरोना व्हायरसविषयी बातम्या पाहत रहा"], ["कोरोना व्हायरसविषयी बातम्या पाहत रहा"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["कोरोना व्हायरसला ट्रॅक करा"], ["कोरोना व्हायरसला ट्रॅक करा"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["आमचे Chrome एक्सटेंशन जोडून आपण कोरोना व्हायरस संबंधित नवीनतम अपडेट्स प्राप्त करू शकता"], ["आमचे Chrome एक्सटेंशन जोडून आपण कोरोना व्हायरस संबंधित नवीनतम अपडेट्स प्राप्त करू शकता"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["आमचे Firefox एक्सटेंशन जोडून आपण कोरोना व्हायरस संबंधित नवीनतम अपडेट्स प्राप्त करू शकता"], ["आमचे Firefox एक्सटेंशन जोडून आपण कोरोना व्हायरस संबंधित नवीनतम अपडेट्स प्राप्त करू शकता"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["एक्सटेंशन जोडा"], ["एक्सटेंशन जोडा"]))), t.dseUpsellTitle = bt.default(me || (me = n(["सुरक्षित रहा, जागरूक रहा"], ["सुरक्षित रहा, जागरूक रहा"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["एक्सटेंशनद्वारे ट्रॅक करा"], ["एक्सटेंशनद्वारे ट्रॅक करा"]))), t.submit = bt.default(he || (he = n(["पूर्ण झाले"], ["पूर्ण झाले"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "y"], ["", "y"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "M"], ["", "M"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "w"], ["", "w"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "h"], ["", "h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["आपले स्थान"], ["आपले स्थान"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["एखाद्या स्‍थानानुसार फिल्टर करा"], ["एखाद्या स्‍थानानुसार फिल्टर करा"]))), t.expand = bt.default(ze || (ze = n(["विस्तृत करा"], ["विस्तृत करा"]))), t.trends = bt.default(Se || (Se = n(["प्रवाह"], ["प्रवाह"]))), t.testingProcess = bt.default(Ie || (Ie = n(["टेस्टिंगविषयी माहिती"], ["टेस्टिंगविषयी माहिती"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["प्रोटोकॉल आणि संपर्क"], ["प्रोटोकॉल आणि संपर्क"]))), t.testingProcessProtocol = bt.default(De || (De = n(["प्रोटोकॉल"], ["प्रोटोकॉल"]))), t.hotline = bt.default(Me || (Me = n(["हॉटलाइन"], ["हॉटलाइन"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["पार्टनर कंपन्या"], ["पार्टनर कंपन्या"]))), t.moreTestingLocations = bt.default(je || (je = n(["टेस्टिंगची स्थाने पहा (", ")"], ["टेस्टिंगची स्थाने पहा (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["कमी पहा"], ["कमी पहा"]))), t.topTrends = bt.default(Be || (Be = n(["एकूण केसेसनुसार तुलना"], ["एकूण केसेसनुसार तुलना"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["कोरोना व्हायरस संबंधित नवीनतम अपडेट्स"], ["कोरोना व्हायरस संबंधित नवीनतम अपडेट्स"]))), t.copyLink = bt.default(Le || (Le = n(["लिंक कॉपी करा"], ["लिंक कॉपी करा"]))), t.email = bt.default(Oe || (Oe = n(["ईमेल"], ["ईमेल"]))), t.cancel = bt.default(Re || (Re = n(["रद्द करा"], ["रद्द करा"]))), t.confirmed = bt.default(_e || (_e = n(["निश्चित"], ["निश्चित"]))), t.fatal = bt.default(Ne || (Ne = n(["प्राणघातक"], ["प्राणघातक"]))), t.recovered = bt.default(Ve || (Ve = n(["बरे झालेले"], ["बरे झालेले"]))), t.active = bt.default(Ue || (Ue = n(["सक्रिय"], ["सक्रिय"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["आपले स्थान पाहण्यासाठी, येथे स्थानासंबंधित परवानग्या सक्षम करा."], ["आपले स्थान पाहण्यासाठी, येथे स्थानासंबंधित परवानग्या सक्षम करा."]))), t.overviewVertical = bt.default(He || (He = n(["परिदर्शन"], ["परिदर्शन"]))), t.newsvideos = bt.default(Ge || (Ge = n(["बातम्या आणि व्हिडिओ"], ["बातम्या आणि व्हिडिओ"]))), t.graphstrends = bt.default(We || (We = n(["ग्राफ"], ["ग्राफ"]))), t.localResources = bt.default(Ke || (Ke = n(["स्थानिक संसाधने"], ["स्थानिक संसाधने"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " मिनिटांपूर्वी अद्ययावत केले"], ["", " मिनिटांपूर्वी अद्ययावत केले"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["आपला फोन नंबर किंवा ईमेल पाठवून, आपण Microsoft कडून या मोबाइल फोन नंबर किंवा ईमेलवर एक-वेळ ऑटोमेटेड संदेश प्राप्त करण्यास सहमत होता. मानक SMS दर लागू होतात."], ["आपला फोन नंबर किंवा ईमेल पाठवून, आपण Microsoft कडून या मोबाइल फोन नंबर किंवा ईमेलवर एक-वेळ ऑटोमेटेड संदेश प्राप्त करण्यास सहमत होता. मानक SMS दर लागू होतात."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft प्रायव्हसी स्टेटमेंट"], ["Microsoft प्रायव्हसी स्टेटमेंट"]))), t.sendLink = bt.default(nt || (nt = n(["लिंक पाठवा"], ["लिंक पाठवा"]))), t.compare = bt.default(it || (it = n(["तुलना करा"], ["तुलना करा"]))), t.browse = bt.default(rt || (rt = n(["ब्राउझ करा"], ["ब्राउझ करा"]))), t.favorites = bt.default(ot || (ot = n(["पसंती"], ["पसंती"]))), t.validNumberRequired = bt.default(lt || (lt = n(["कृपया एक मान्य US फोन नंबर प्रविष्ट करा."], ["कृपया एक मान्य US फोन नंबर प्रविष्ट करा."]))), t.opalSMSAccepted = bt.default(st || (st = n(["धन्यवाद. कृपया आपल्या फोनवर पाठवलेली लिंक एका तासाच्या आत वापरून पहा."], ["धन्यवाद. कृपया आपल्या फोनवर पाठवलेली लिंक एका तासाच्या आत वापरून पहा."]))), t.opalSMSError = bt.default(dt || (dt = n(["त्रुटी आढळली, कृपया अनुप्रयोग स्टोअरमधून Bing शोध अनुप्रयोग डाउनलोड करा."], ["त्रुटी आढळली, कृपया अनुप्रयोग स्टोअरमधून Bing शोध अनुप्रयोग डाउनलोड करा."]))), t.moreOnTopic = bt.default(ut || (ut = n(["", " विषयी अधिक"], ["", " विषयी अधिक"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["", " विषयी कमी"], ["", " विषयी कमी"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["नवीन प्रवाहातील विषय"], ["नवीन प्रवाहातील विषय"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["लॉग स्केल"], ["लॉग स्केल"]))), t.linearScale = bt.default(vt || (vt = n(["रेखीय स्केल"], ["रेखीय स्केल"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["नमस्कार! मी COVID-19 FAQ हेल्पर बॉट आहे आणि मी येथे आपल्या प्रश्नांची उत्तरे देण्यात मदत करण्यासाठी आहे!"], ["नमस्कार! मी COVID-19 FAQ हेल्पर बॉट आहे आणि मी येथे आपल्या प्रश्नांची उत्तरे देण्यात मदत करण्यासाठी आहे!"]))), t.dataTitle = bt.default(gt || (gt = n(["डेटा"], ["डेटा"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.ms-my.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Data terakhir dikemas kini:"], ["Data terakhir dikemas kini:"]))), t.urlCopied = bt.default(r || (r = n(["Url disalin ke papan klip"], ["Url disalin ke papan klip"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Penjejak COVID-19"], ["Penjejak COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Penjejak koronavirus (COVID-19) Bing daripada Microsoft"], ["Penjejak koronavirus (COVID-19) Bing daripada Microsoft"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Rantau"], ["Rantau"]))), t.noRegionalData = bt.default(u || (u = n(["Data wilayah tidak tersedia untuk negara/wilayah ini lagi. Cuba lagi kemudian."], ["Data wilayah tidak tersedia untuk negara/wilayah ini lagi. Cuba lagi kemudian."]))), t.activeCases = bt.default(c || (c = n(["Kes aktif"], ["Kes aktif"]))), t.recoveredCases = bt.default(f || (f = n(["Kes-kes yang telah pulih"], ["Kes-kes yang telah pulih"]))), t.fatalCases = bt.default(p || (p = n(["Kes-kes kematian"], ["Kes-kes kematian"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktifkan"], ["Aktifkan"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Pulih"], ["Pulih"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Maut"], ["Maut"]))), t.overview = bt.default(g || (g = n(["Gambaran keseluruhan"], ["Gambaran keseluruhan"]))), t.close = bt.default(b || (b = n(["Tutup"], ["Tutup"]))), t.selectARegion = bt.default(k || (k = n(["Pilih rantau"], ["Pilih rantau"]))), t.global = bt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = bt.default(C || (C = n(["Status Global"], ["Status Global"]))), t.allRegions = bt.default(w || (w = n(["Semua Rantau"], ["Semua Rantau"]))), t.share = bt.default(x || (x = n(["Kongsi"], ["Kongsi"]))), t.dataInfo = bt.default(T || (T = n(["Maklumat data"], ["Maklumat data"]))), t.totalConfirmed = bt.default(z || (z = n(["Jumlah Kes yang Disahkan"], ["Jumlah Kes yang Disahkan"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Jumlah kes"], ["Jumlah kes"]))), t.totalAreas = bt.default(I || (I = n(["", " Jumlah"], ["", " Jumlah"])), 0), t.hideInfo = bt.default(A || (A = n(["Sembunyikan maklumat untuk melihat peta penuh"], ["Sembunyikan maklumat untuk melihat peta penuh"]))), t.showInfo = bt.default(D || (D = n(["Tunjukkan maklumat"], ["Tunjukkan maklumat"]))), t.news = bt.default(M || (M = n(["Berita"], ["Berita"]))), t.helpfulResources = bt.default(E || (E = n(["Bantuan & Maklumat"], ["Bantuan & Maklumat"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Lihat lagi"], ["Lihat lagi"]))), t.dataFrom = bt.default(O || (O = n(["Data daripada:"], ["Data daripada:"]))), t.videos = bt.default(R || (R = n(["Video"], ["Video"]))), t.moreNews = bt.default(_ || (_ = n(["Lihat lebih banyak artikel"], ["Lihat lebih banyak artikel"]))), t.moreVideos = bt.default(N || (N = n(["Lihat lebih banyak video"], ["Lihat lebih banyak video"]))), t.map = bt.default(V || (V = n(["Peta:"], ["Peta:"]))), t.feedback = bt.default(U || (U = n(["Berikan maklum balas"], ["Berikan maklum balas"]))), t.feedbackQuestion = bt.default(q || (q = n(["Apakah jenis maklum balas anda tentang alat ini?"], ["Apakah jenis maklum balas anda tentang alat ini?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Laporkan masalah"], ["Laporkan masalah"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Beritahu kami tentang masalah"], ["Beritahu kami tentang masalah"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Kongsikan idea"], ["Kongsikan idea"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Beritahu kami tentang idea anda"], ["Beritahu kami tentang idea anda"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Berikan pujian"], ["Berikan pujian"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Beritahu kami apa yang anda suka"], ["Beritahu kami apa yang anda suka"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Kebimbangan undang-undang atau privasi"], ["Kebimbangan undang-undang atau privasi"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Beritahu kami tentang kebimbangan anda"], ["Beritahu kami tentang kebimbangan anda"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Masukkan maklum balas di sini. Untuk membantu melindungi privasi anda, jangan masukkan maklumat peribadi seperti alamat atau nombor telefon anda"], ["Masukkan maklum balas di sini. Untuk membantu melindungi privasi anda, jangan masukkan maklumat peribadi seperti alamat atau nombor telefon anda"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Kembali"], ["Kembali"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Hantar"], ["Hantar"]))), t.feedbackThanks = bt.default(te || (te = n(["Terima kasih atas maklum balas anda!"], ["Terima kasih atas maklum balas anda!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Pernyataan privasi"], ["Pernyataan privasi"]))), t.websiteDescription = bt.default(ne || (ne = n(["Jejaki kes koronavirus tempatan dan global COVID-19 yang mempunyai kadar aktif, pulih dan kematian pada peta, dengan berita dan video harian."], ["Jejaki kes koronavirus tempatan dan global COVID-19 yang mempunyai kadar aktif, pulih dan kematian pada peta, dengan berita dan video harian."]))), t.graphOverTime = bt.default(ie || (ie = n(["Tular Dari Masa Ke Semasa"], ["Tular Dari Masa Ke Semasa"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "J"], ["", "J"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "R"], ["", "R"])), 0), t.upsellDesc = bt.default(le || (le = n(["Jejaki kemas kini terkini pada telefon anda dengan aplikasi Bing"], ["Jejaki kemas kini terkini pada telefon anda dengan aplikasi Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Muat turun sekarang"], ["Muat turun sekarang"]))), t.upsellTitle = bt.default(de || (de = n(["Ikuti berita koronavirus"], ["Ikuti berita koronavirus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Jejaki koronavirus"], ["Jejaki koronavirus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Dapatkan kemas kini koronavirus yang terkini di Bing apabila anda menambah sambungan Chrome kami"], ["Dapatkan kemas kini koronavirus yang terkini di Bing apabila anda menambah sambungan Chrome kami"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Dapatkan kemas kini koronavirus yang terkini di Bing apabila anda menambah sambungan Firefox kami"], ["Dapatkan kemas kini koronavirus yang terkini di Bing apabila anda menambah sambungan Firefox kami"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Tambah sambungan"], ["Tambah sambungan"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Jaga keselamatan, kekal maklum"], ["Jaga keselamatan, kekal maklum"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Jejaki dengan sambungan"], ["Jejaki dengan sambungan"]))), t.submit = bt.default(he || (he = n(["Selesai"], ["Selesai"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "t"], ["", "t"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "B"], ["", "B"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "m"], ["", "m"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "h"], ["", "h"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "h"], ["", "h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Lokasi Anda"], ["Lokasi Anda"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Tapis mengikut lokasi"], ["Tapis mengikut lokasi"]))), t.expand = bt.default(ze || (ze = n(["Berkembang"], ["Berkembang"]))), t.trends = bt.default(Se || (Se = n(["Trend"], ["Trend"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Maklumat Ujian"], ["Maklumat Ujian"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokol & Maklumat Hubungan"], ["Protokol & Maklumat Hubungan"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokol"], ["Protokol"]))), t.hotline = bt.default(Me || (Me = n(["Talian Penting"], ["Talian Penting"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Syarikat Rakan Kongsi"], ["Syarikat Rakan Kongsi"]))), t.moreTestingLocations = bt.default(je || (je = n(["Lihat lokasi ujian (", ")"], ["Lihat lokasi ujian (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Lihat kurang"], ["Lihat kurang"]))), t.topTrends = bt.default(Be || (Be = n(["Perbandingan mengikut jumlah kes"], ["Perbandingan mengikut jumlah kes"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Kemas kini koronavirus terkini"], ["Kemas kini koronavirus terkini"]))), t.copyLink = bt.default(Le || (Le = n(["Salin pautan"], ["Salin pautan"]))), t.email = bt.default(Oe || (Oe = n(["E-mel"], ["E-mel"]))), t.cancel = bt.default(Re || (Re = n(["Batal"], ["Batal"]))), t.confirmed = bt.default(_e || (_e = n(["Disahkan"], ["Disahkan"]))), t.fatal = bt.default(Ne || (Ne = n(["Maut"], ["Maut"]))), t.recovered = bt.default(Ve || (Ve = n(["Pulih"], ["Pulih"]))), t.active = bt.default(Ue || (Ue = n(["Aktif"], ["Aktif"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Untuk melihat lokasi anda, dayakan keizinan lokasi di sini."], ["Untuk melihat lokasi anda, dayakan keizinan lokasi di sini."]))), t.overviewVertical = bt.default(He || (He = n(["Gambaran Keseluruhan"], ["Gambaran Keseluruhan"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Berita & Video"], ["Berita & Video"]))), t.graphstrends = bt.default(We || (We = n(["Graf"], ["Graf"]))), t.localResources = bt.default(Ke || (Ke = n(["Sumber Tempatan"], ["Sumber Tempatan"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Dikemas kini ", " min lalu"], ["Dikemas kini ", " min lalu"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Dengan menghantar nombor telefon atau e-mel anda, anda bersetuju untuk menerima mesej automatik sekali daripada Microsoft ke nombor telefon mudah alih atau e-mel ini. Kadar SMS standard dikenakan."], ["Dengan menghantar nombor telefon atau e-mel anda, anda bersetuju untuk menerima mesej automatik sekali daripada Microsoft ke nombor telefon mudah alih atau e-mel ini. Kadar SMS standard dikenakan."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Pernyataan Privasi Microsoft"], ["Pernyataan Privasi Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Hantar pautan"], ["Hantar pautan"]))), t.compare = bt.default(it || (it = n(["Bandingkan"], ["Bandingkan"]))), t.browse = bt.default(rt || (rt = n(["Semak Imbas"], ["Semak Imbas"]))), t.favorites = bt.default(ot || (ot = n(["Kegemaran"], ["Kegemaran"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Sila masukkan nombor telefon AS yang sah."], ["Sila masukkan nombor telefon AS yang sah."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Terima kasih. Sila cuba pautan yang dihantar ke telefon anda dalam masa sejam."], ["Terima kasih. Sila cuba pautan yang dihantar ke telefon anda dalam masa sejam."]))), t.opalSMSError = bt.default(dt || (dt = n(["Ralat ditemui, sila muat turun aplikasi Carian Bing dari gedung aplikasi."], ["Ralat ditemui, sila muat turun aplikasi Carian Bing dari gedung aplikasi."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Lagi tentang ", ""], ["Lagi tentang ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Kurang tentang ", ""], ["Kurang tentang ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Topik Sohor Kini"], ["Topik Sohor Kini"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Skala log"], ["Skala log"]))), t.linearScale = bt.default(vt || (vt = n(["Skala linear"], ["Skala linear"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hai! Saya ialah bot pembantu Soalan Lazim COVID-19 dan saya di sini untuk membantu menjawab pertanyaan anda!"], ["Hai! Saya ialah bot pembantu Soalan Lazim COVID-19 dan saya di sini untuk membantu menjawab pertanyaan anda!"]))), t.dataTitle = bt.default(gt || (gt = n(["Data"], ["Data"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.nb-no.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Data ble sist oppdatert:"], ["Data ble sist oppdatert:"]))), t.urlCopied = bt.default(r || (r = n(["Nettadressen er kopiert til utklippstavlen"], ["Nettadressen er kopiert til utklippstavlen"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Sporing av COVID-19"], ["Sporing av COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Kart med sporing i sanntid av koronaviruset (COVID-19) fra Microsoft Bing"], ["Kart med sporing i sanntid av koronaviruset (COVID-19) fra Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regioner"], ["Regioner"]))), t.noRegionalData = bt.default(u || (u = n(["Regiondata er ikke tilgjengelig for dette landet / denne regionen ennå. Prøv igjen senere."], ["Regiondata er ikke tilgjengelig for dette landet / denne regionen ennå. Prøv igjen senere."]))), t.activeCases = bt.default(c || (c = n(["Aktive tilfeller"], ["Aktive tilfeller"]))), t.recoveredCases = bt.default(f || (f = n(["Friske tilfeller"], ["Friske tilfeller"]))), t.fatalCases = bt.default(p || (p = n(["Tilfeller med dødelig utfall"], ["Tilfeller med dødelig utfall"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktiv"], ["Aktiv"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Friskmeldte"], ["Friskmeldte"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Dødelige"], ["Dødelige"]))), t.overview = bt.default(g || (g = n(["Oversikt"], ["Oversikt"]))), t.close = bt.default(b || (b = n(["Lukk"], ["Lukk"]))), t.selectARegion = bt.default(k || (k = n(["Velg region"], ["Velg region"]))), t.global = bt.default(y || (y = n(["Globalt"], ["Globalt"]))), t.globalStatus = bt.default(C || (C = n(["Global status"], ["Global status"]))), t.allRegions = bt.default(w || (w = n(["Alle regioner"], ["Alle regioner"]))), t.share = bt.default(x || (x = n(["Del"], ["Del"]))), t.dataInfo = bt.default(T || (T = n(["Datainformasjon"], ["Datainformasjon"]))), t.totalConfirmed = bt.default(z || (z = n(["Totalt antall bekreftede tilfeller"], ["Totalt antall bekreftede tilfeller"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Totalt antall tilfeller"], ["Totalt antall tilfeller"]))), t.totalAreas = bt.default(I || (I = n(["", " totalt"], ["", " totalt"])), 0), t.hideInfo = bt.default(A || (A = n(["Skjul informasjonen for å se hele kartet"], ["Skjul informasjonen for å se hele kartet"]))), t.showInfo = bt.default(D || (D = n(["Vis informasjon"], ["Vis informasjon"]))), t.news = bt.default(M || (M = n(["Nyheter"], ["Nyheter"]))), t.helpfulResources = bt.default(E || (E = n(["Hjelp og informasjon"], ["Hjelp og informasjon"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Se mer"], ["Se mer"]))), t.dataFrom = bt.default(O || (O = n(["Data fra:"], ["Data fra:"]))), t.videos = bt.default(R || (R = n(["Videoer"], ["Videoer"]))), t.moreNews = bt.default(_ || (_ = n(["Se flere artikler"], ["Se flere artikler"]))), t.moreVideos = bt.default(N || (N = n(["Se flere videoer"], ["Se flere videoer"]))), t.map = bt.default(V || (V = n(["Kart:"], ["Kart:"]))), t.feedback = bt.default(U || (U = n(["Gi tilbakemelding"], ["Gi tilbakemelding"]))), t.feedbackQuestion = bt.default(q || (q = n(["Hva slags tilbakemeldinger har du om dette verktøyet?"], ["Hva slags tilbakemeldinger har du om dette verktøyet?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Rapporter et problem"], ["Rapporter et problem"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Fortell oss om problemet"], ["Fortell oss om problemet"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Del en idé"], ["Del en idé"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Fortell oss om ideen din"], ["Fortell oss om ideen din"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Gi et kompliment"], ["Gi et kompliment"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Fortell oss hva du liker"], ["Fortell oss hva du liker"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Juridisk eller personvernrelatert spørsmål"], ["Juridisk eller personvernrelatert spørsmål"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Fortell oss om bekymringen du har"], ["Fortell oss om bekymringen du har"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Skriv inn tilbakemelding her. Ikke ta med personlig informasjon som adresse eller telefonnummer for å bevare personvernet ditt."], ["Skriv inn tilbakemelding her. Ikke ta med personlig informasjon som adresse eller telefonnummer for å bevare personvernet ditt."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Gå tilbake"], ["Gå tilbake"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Send"], ["Send"]))), t.feedbackThanks = bt.default(te || (te = n(["Takk for tilbakemeldingen!"], ["Takk for tilbakemeldingen!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Personvernerklæring"], ["Personvernerklæring"]))), t.websiteDescription = bt.default(ne || (ne = n(["Følg aktive og friskmeldte tilfeller av COVID-19 (koronavirus) samt dødsfall lokalt og globalt på kartet med daglige nyheter og videoer."], ["Følg aktive og friskmeldte tilfeller av COVID-19 (koronavirus) samt dødsfall lokalt og globalt på kartet med daglige nyheter og videoer."]))), t.graphOverTime = bt.default(ie || (ie = n(["Spredning over tid"], ["Spredning over tid"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " mill."], ["", " mill."])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " k"], ["", " k"])), 0), t.upsellDesc = bt.default(le || (le = n(["Følg med på nye oppdateringer på telefonen med Bing-appen"], ["Følg med på nye oppdateringer på telefonen med Bing-appen"]))), t.upsellCTA = bt.default(se || (se = n(["Last ned nå"], ["Last ned nå"]))), t.upsellTitle = bt.default(de || (de = n(["Følg nyheter om koronaviruset"], ["Følg nyheter om koronaviruset"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Spor koronaviruset"], ["Spor koronaviruset"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Få de siste oppdateringene om koronaviruset på Bing når du legger til Chrome-utvidelsen vår"], ["Få de siste oppdateringene om koronaviruset på Bing når du legger til Chrome-utvidelsen vår"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Få de siste oppdateringene om koronaviruset på Bing når du legger til Firefox-utvidelsen vår"], ["Få de siste oppdateringene om koronaviruset på Bing når du legger til Firefox-utvidelsen vår"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Legg til utvidelsen"], ["Legg til utvidelsen"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Hold deg trygg og oppdatert"], ["Hold deg trygg og oppdatert"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Spor med utvidelsen"], ["Spor med utvidelsen"]))), t.submit = bt.default(he || (he = n(["Ferdig"], ["Ferdig"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " år"], ["", " år"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " md."], ["", " md."])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " u"], ["", " u"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " d"], ["", " d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " t"], ["", " t"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " m"], ["", " m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Ditt sted"], ["Ditt sted"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtrer etter sted"], ["Filtrer etter sted"]))), t.expand = bt.default(ze || (ze = n(["Utvid"], ["Utvid"]))), t.trends = bt.default(Se || (Se = n(["Trender"], ["Trender"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Testinformasjon"], ["Testinformasjon"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokoll og kontakt"], ["Protokoll og kontakt"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokoll"], ["Protokoll"]))), t.hotline = bt.default(Me || (Me = n(["Direktelinje"], ["Direktelinje"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Partnerselskaper"], ["Partnerselskaper"]))), t.moreTestingLocations = bt.default(je || (je = n(["Se teststeder (", ")"], ["Se teststeder (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Se mindre"], ["Se mindre"]))), t.topTrends = bt.default(Be || (Be = n(["Sammenligning basert på totalt antall tilfeller"], ["Sammenligning basert på totalt antall tilfeller"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Siste oppdateringer om koronaviruset"], ["Siste oppdateringer om koronaviruset"]))), t.copyLink = bt.default(Le || (Le = n(["Kopier kobling"], ["Kopier kobling"]))), t.email = bt.default(Oe || (Oe = n(["E-post"], ["E-post"]))), t.cancel = bt.default(Re || (Re = n(["Avbryt"], ["Avbryt"]))), t.confirmed = bt.default(_e || (_e = n(["Bekreftet"], ["Bekreftet"]))), t.fatal = bt.default(Ne || (Ne = n(["Dødelige"], ["Dødelige"]))), t.recovered = bt.default(Ve || (Ve = n(["Friskmeldte"], ["Friskmeldte"]))), t.active = bt.default(Ue || (Ue = n(["Aktive"], ["Aktive"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Slå på posisjonstillatelser her for å se ditt sted."], ["Slå på posisjonstillatelser her for å se ditt sted."]))), t.overviewVertical = bt.default(He || (He = n(["Oversikt"], ["Oversikt"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Nyheter og videoer"], ["Nyheter og videoer"]))), t.graphstrends = bt.default(We || (We = n(["Grafer"], ["Grafer"]))), t.localResources = bt.default(Ke || (Ke = n(["Lokale ressurser"], ["Lokale ressurser"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Oppdatert for ", " min siden"], ["Oppdatert for ", " min siden"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Hvis du sender inn telefonnummeret ditt eller e-postadressen din, godtar du å få én automatisert melding fra Microsoft til dette telefonnummeret eller denne e-postadressen. Standard SMS-gebyrer gjelder."], ["Hvis du sender inn telefonnummeret ditt eller e-postadressen din, godtar du å få én automatisert melding fra Microsoft til dette telefonnummeret eller denne e-postadressen. Standard SMS-gebyrer gjelder."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsofts personvernerklæring"], ["Microsofts personvernerklæring"]))), t.sendLink = bt.default(nt || (nt = n(["Send kobling"], ["Send kobling"]))), t.compare = bt.default(it || (it = n(["Sammenlign"], ["Sammenlign"]))), t.browse = bt.default(rt || (rt = n(["Bla gjennom"], ["Bla gjennom"]))), t.favorites = bt.default(ot || (ot = n(["Favoritter"], ["Favoritter"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Skriv inn et gyldig amerikansk telefonnummer."], ["Skriv inn et gyldig amerikansk telefonnummer."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Takk. Prøv koblingen som ble sendt til telefonen din, innen én time."], ["Takk. Prøv koblingen som ble sendt til telefonen din, innen én time."]))), t.opalSMSError = bt.default(dt || (dt = n(["Det oppstod en feil. Last ned Bing Søk-appen fra appbutikken."], ["Det oppstod en feil. Last ned Bing Søk-appen fra appbutikken."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Mer om ", ""], ["Mer om ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Mindre om ", ""], ["Mindre om ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Populære emner"], ["Populære emner"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logaritmisk skala"], ["Logaritmisk skala"]))), t.linearScale = bt.default(vt || (vt = n(["Lineær skala"], ["Lineær skala"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hei! Jeg er hjelperoboten for vanlige spørsmål om COVID-19. Jeg er her for å svare på spørsmålene dine."], ["Hei! Jeg er hjelperoboten for vanlige spørsmål om COVID-19. Jeg er her for å svare på spørsmålene dine."]))), t.dataTitle = bt.default(gt || (gt = n(["Data"], ["Data"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.nl-nl.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Gegevens laatst bijgewerkt op:"], ["Gegevens laatst bijgewerkt op:"]))), t.urlCopied = bt.default(r || (r = n(["Url gekopieerd naar klembord"], ["Url gekopieerd naar klembord"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19-tracker"], ["COVID-19-tracker"]))), t.bingCovidTitle = bt.default(s || (s = n(["Live coronavirus (COVID-19)-kaarttracker van Microsoft Bing"], ["Live coronavirus (COVID-19)-kaarttracker van Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regio's"], ["Regio's"]))), t.noRegionalData = bt.default(u || (u = n(["Er zijn nog geen regionale gegevens beschikbaar voor dit land/deze regio. Probeer het later opnieuw."], ["Er zijn nog geen regionale gegevens beschikbaar voor dit land/deze regio. Probeer het later opnieuw."]))), t.activeCases = bt.default(c || (c = n(["Actieve gevallen"], ["Actieve gevallen"]))), t.recoveredCases = bt.default(f || (f = n(["Herstelde gevallen"], ["Herstelde gevallen"]))), t.fatalCases = bt.default(p || (p = n(["Dodelijke gevallen"], ["Dodelijke gevallen"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Actieve gevallen"], ["Actieve gevallen"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Herstelde gevallen"], ["Herstelde gevallen"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Doden"], ["Doden"]))), t.overview = bt.default(g || (g = n(["Overzicht"], ["Overzicht"]))), t.close = bt.default(b || (b = n(["Sluiten"], ["Sluiten"]))), t.selectARegion = bt.default(k || (k = n(["Selecteer een regio"], ["Selecteer een regio"]))), t.global = bt.default(y || (y = n(["Wereldwijd"], ["Wereldwijd"]))), t.globalStatus = bt.default(C || (C = n(["Wereldwijde status"], ["Wereldwijde status"]))), t.allRegions = bt.default(w || (w = n(["Alle regio's"], ["Alle regio's"]))), t.share = bt.default(x || (x = n(["Delen"], ["Delen"]))), t.dataInfo = bt.default(T || (T = n(["Informatie over gegevens"], ["Informatie over gegevens"]))), t.totalConfirmed = bt.default(z || (z = n(["Totaal aantal bevestigde gevallen"], ["Totaal aantal bevestigde gevallen"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Totaal aantal gevallen"], ["Totaal aantal gevallen"]))), t.totalAreas = bt.default(I || (I = n(["", " in totaal"], ["", " in totaal"])), 0), t.hideInfo = bt.default(A || (A = n(["Verberg info om volledige kaart te zien"], ["Verberg info om volledige kaart te zien"]))), t.showInfo = bt.default(D || (D = n(["Toon info"], ["Toon info"]))), t.news = bt.default(M || (M = n(["Nieuws"], ["Nieuws"]))), t.helpfulResources = bt.default(E || (E = n(["Hulp en informatie"], ["Hulp en informatie"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Meer bekijken"], ["Meer bekijken"]))), t.dataFrom = bt.default(O || (O = n(["Gegevens afkomstig van:"], ["Gegevens afkomstig van:"]))), t.videos = bt.default(R || (R = n(["Video's"], ["Video's"]))), t.moreNews = bt.default(_ || (_ = n(["Meer artikels bekijken"], ["Meer artikels bekijken"]))), t.moreVideos = bt.default(N || (N = n(["Meer video's bekijken"], ["Meer video's bekijken"]))), t.map = bt.default(V || (V = n(["Kaart:"], ["Kaart:"]))), t.feedback = bt.default(U || (U = n(["Feedback geven"], ["Feedback geven"]))), t.feedbackQuestion = bt.default(q || (q = n(["Welk soort feedback wilt u geven over deze tool?"], ["Welk soort feedback wilt u geven over deze tool?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Een probleem melden"], ["Een probleem melden"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Omschrijf het probleem"], ["Omschrijf het probleem"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Deel een idee"], ["Deel een idee"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Omschrijf uw idee"], ["Omschrijf uw idee"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Een compliment geven"], ["Een compliment geven"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Vertel ons wat u goed vindt"], ["Vertel ons wat u goed vindt"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Juridische of privacykwestie"], ["Juridische of privacykwestie"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Omschrijf de kwestie"], ["Omschrijf de kwestie"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Voer hier uw feedback in. Vermeld geen persoonlijke gegevens zoals uw adres of telefoonnummer ter bescherming van uw privacy."], ["Voer hier uw feedback in. Vermeld geen persoonlijke gegevens zoals uw adres of telefoonnummer ter bescherming van uw privacy."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Terug"], ["Terug"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Verzenden"], ["Verzenden"]))), t.feedbackThanks = bt.default(te || (te = n(["Bedankt voor uw feedback!"], ["Bedankt voor uw feedback!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Privacyverklaring"], ["Privacyverklaring"]))), t.websiteDescription = bt.default(ne || (ne = n(["Volg het aantal actieve COVID-19-gevallen, herstelde patiënten en doden op de kaart, lokaal en wereldwijd, met dagelijks nieuws en video's."], ["Volg het aantal actieve COVID-19-gevallen, herstelde patiënten en doden op de kaart, lokaal en wereldwijd, met dagelijks nieuws en video's."]))), t.graphOverTime = bt.default(ie || (ie = n(["Verloop van de verspreiding"], ["Verloop van de verspreiding"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "M"], ["", "M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = bt.default(le || (le = n(["Volg het laatste nieuws op uw telefoon met de Bing-app"], ["Volg het laatste nieuws op uw telefoon met de Bing-app"]))), t.upsellCTA = bt.default(se || (se = n(["Nu downloaden"], ["Nu downloaden"]))), t.upsellTitle = bt.default(de || (de = n(["Volg het nieuws over het coronavirus"], ["Volg het nieuws over het coronavirus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Volg het coronavirus"], ["Volg het coronavirus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Ontvang het laatste nieuws over het coronavirus op Bing door onze Chrome-extensie toe te voegen"], ["Ontvang het laatste nieuws over het coronavirus op Bing door onze Chrome-extensie toe te voegen"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Ontvang het laatste nieuws over het coronavirus op Bing door onze Firefox-extensie toe te voegen"], ["Ontvang het laatste nieuws over het coronavirus op Bing door onze Firefox-extensie toe te voegen"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["De extensie toevoegen"], ["De extensie toevoegen"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Blijf veilig, blijf geïnformeerd"], ["Blijf veilig, blijf geïnformeerd"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Volgen met extensie"], ["Volgen met extensie"]))), t.submit = bt.default(he || (he = n(["Gereed"], ["Gereed"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "j"], ["", "j"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "M"], ["", "M"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "w"], ["", "w"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "u"], ["", "u"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Uw locatie"], ["Uw locatie"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filter op een locatie"], ["Filter op een locatie"]))), t.expand = bt.default(ze || (ze = n(["Vergroten"], ["Vergroten"]))), t.trends = bt.default(Se || (Se = n(["Trends"], ["Trends"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Testinformatie"], ["Testinformatie"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protocol en contact"], ["Protocol en contact"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protocol"], ["Protocol"]))), t.hotline = bt.default(Me || (Me = n(["Hotline"], ["Hotline"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Partnerbedrijven"], ["Partnerbedrijven"]))), t.moreTestingLocations = bt.default(je || (je = n(["Zie testlocaties (", ")"], ["Zie testlocaties (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Minder bekijken"], ["Minder bekijken"]))), t.topTrends = bt.default(Be || (Be = n(["Vergelijking op basis van totaal aantal gevallen"], ["Vergelijking op basis van totaal aantal gevallen"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Laatste nieuws over het coronavirus"], ["Laatste nieuws over het coronavirus"]))), t.copyLink = bt.default(Le || (Le = n(["Link kopiëren"], ["Link kopiëren"]))), t.email = bt.default(Oe || (Oe = n(["E-mailen"], ["E-mailen"]))), t.cancel = bt.default(Re || (Re = n(["Annuleren"], ["Annuleren"]))), t.confirmed = bt.default(_e || (_e = n(["Bevestigd"], ["Bevestigd"]))), t.fatal = bt.default(Ne || (Ne = n(["Doden"], ["Doden"]))), t.recovered = bt.default(Ve || (Ve = n(["Hersteld"], ["Hersteld"]))), t.active = bt.default(Ue || (Ue = n(["Actieve gevallen"], ["Actieve gevallen"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Schakel hier locatiemachtigingen in om uw locatie te zien."], ["Schakel hier locatiemachtigingen in om uw locatie te zien."]))), t.overviewVertical = bt.default(He || (He = n(["Overzicht"], ["Overzicht"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Nieuws en video's"], ["Nieuws en video's"]))), t.graphstrends = bt.default(We || (We = n(["Grafieken"], ["Grafieken"]))), t.localResources = bt.default(Ke || (Ke = n(["Lokale bronnen"], ["Lokale bronnen"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " min. geleden bijgewerkt"], ["", " min. geleden bijgewerkt"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Door uw telefoonnummer of e-mailadres te verzenden gaat u ermee akkoord om een eenmalig automatisch bericht van Microsoft te ontvangen op dit mobiel telefoonnummer of e-mailadres. Hiervoor gelden de normale sms-tarieven."], ["Door uw telefoonnummer of e-mailadres te verzenden gaat u ermee akkoord om een eenmalig automatisch bericht van Microsoft te ontvangen op dit mobiel telefoonnummer of e-mailadres. Hiervoor gelden de normale sms-tarieven."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Privacyverklaring van Microsoft"], ["Privacyverklaring van Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Link verzenden"], ["Link verzenden"]))), t.compare = bt.default(it || (it = n(["Vergelijken"], ["Vergelijken"]))), t.browse = bt.default(rt || (rt = n(["Bladeren"], ["Bladeren"]))), t.favorites = bt.default(ot || (ot = n(["Favorieten"], ["Favorieten"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Voer een geldig Amerikaans telefoonnummer in."], ["Voer een geldig Amerikaans telefoonnummer in."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Bedankt. Probeer de link die naar uw telefoon is verzonden binnen het uur."], ["Bedankt. Probeer de link die naar uw telefoon is verzonden binnen het uur."]))), t.opalSMSError = bt.default(dt || (dt = n(["Er is een fout opgetreden. Download de Bing Search-app uit de App Store."], ["Er is een fout opgetreden. Download de Bing Search-app uit de App Store."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Meer over ", ""], ["Meer over ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Minder over ", ""], ["Minder over ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Populaire onderwerpen"], ["Populaire onderwerpen"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logaritmische schaal"], ["Logaritmische schaal"]))), t.linearScale = bt.default(vt || (vt = n(["Lineaire schaal"], ["Lineaire schaal"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hallo! Ik ben de FAQ-hulpbot voor COVID-19 en probeer al uw vragen te beantwoorden!"], ["Hallo! Ik ben de FAQ-hulpbot voor COVID-19 en probeer al uw vragen te beantwoorden!"]))), t.dataTitle = bt.default(gt || (gt = n(["Gegevens"], ["Gegevens"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.pl-pl.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Ostatnia aktualizacja danych:"], ["Ostatnia aktualizacja danych:"]))), t.urlCopied = bt.default(r || (r = n(["Adres URL skopiowano do schowka"], ["Adres URL skopiowano do schowka"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Śledzenie zakażeń wirusem COVID-19"], ["Śledzenie zakażeń wirusem COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Aktualizowana na żywo mapa zakażeń koronawirusem (COVID-19) w Microsoft Bing"], ["Aktualizowana na żywo mapa zakażeń koronawirusem (COVID-19) w Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regiony"], ["Regiony"]))), t.noRegionalData = bt.default(u || (u = n(["Dane regionalne nie są jeszcze dostępne dla tego kraju lub regionu. Spróbuj ponownie później."], ["Dane regionalne nie są jeszcze dostępne dla tego kraju lub regionu. Spróbuj ponownie później."]))), t.activeCases = bt.default(c || (c = n(["Zarażenia"], ["Zarażenia"]))), t.recoveredCases = bt.default(f || (f = n(["Wyzdrowienia"], ["Wyzdrowienia"]))), t.fatalCases = bt.default(p || (p = n(["Zgony"], ["Zgony"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktywne"], ["Aktywne"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Wyleczone"], ["Wyleczone"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Śmiertelne"], ["Śmiertelne"]))), t.overview = bt.default(g || (g = n(["Przegląd"], ["Przegląd"]))), t.close = bt.default(b || (b = n(["Zamknij"], ["Zamknij"]))), t.selectARegion = bt.default(k || (k = n(["Wybierz region"], ["Wybierz region"]))), t.global = bt.default(y || (y = n(["Cały świat"], ["Cały świat"]))), t.globalStatus = bt.default(C || (C = n([" Stan na świecie"], [" Stan na świecie"]))), t.allRegions = bt.default(w || (w = n(["Wszystkie regiony"], ["Wszystkie regiony"]))), t.share = bt.default(x || (x = n(["Udostępnij"], ["Udostępnij"]))), t.dataInfo = bt.default(T || (T = n(["Informacje o danych"], ["Informacje o danych"]))), t.totalConfirmed = bt.default(z || (z = n(["Suma potwierdzonych przypadków"], ["Suma potwierdzonych przypadków"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Łączna liczba przypadków"], ["Łączna liczba przypadków"]))), t.totalAreas = bt.default(I || (I = n(["Łącznie ", ""], ["Łącznie ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Aby zobaczyć całą mapę, ukryj informacje"], ["Aby zobaczyć całą mapę, ukryj informacje"]))), t.showInfo = bt.default(D || (D = n(["Pokaż informacje"], ["Pokaż informacje"]))), t.news = bt.default(M || (M = n(["Wiadomości"], ["Wiadomości"]))), t.helpfulResources = bt.default(E || (E = n(["Pomoc i informacje"], ["Pomoc i informacje"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Pokaż więcej"], ["Pokaż więcej"]))), t.dataFrom = bt.default(O || (O = n(["Źródła danych:"], ["Źródła danych:"]))), t.videos = bt.default(R || (R = n(["Wideo"], ["Wideo"]))), t.moreNews = bt.default(_ || (_ = n(["Zobacz więcej artykułów"], ["Zobacz więcej artykułów"]))), t.moreVideos = bt.default(N || (N = n(["Zobacz więcej wideo"], ["Zobacz więcej wideo"]))), t.map = bt.default(V || (V = n(["Mapa:"], ["Mapa:"]))), t.feedback = bt.default(U || (U = n(["Przekaż opinię"], ["Przekaż opinię"]))), t.feedbackQuestion = bt.default(q || (q = n(["Jakiego rodzaju opinię na temat tego narzędzia chcesz nam przekazać?"], ["Jakiego rodzaju opinię na temat tego narzędzia chcesz nam przekazać?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Problem"], ["Problem"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Powiedz nam, na czym polega problem"], ["Powiedz nam, na czym polega problem"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Pomysł"], ["Pomysł"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Opowiedz nam o swoim pomyśle"], ["Opowiedz nam o swoim pomyśle"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Pochwała"], ["Pochwała"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Powiedz nam, co Ci się podoba"], ["Powiedz nam, co Ci się podoba"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Wątpliwość dotycząca kwestii prawnych lub prywatności"], ["Wątpliwość dotycząca kwestii prawnych lub prywatności"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Powiedz nam, czego dotyczy Twoja wątpliwość"], ["Powiedz nam, czego dotyczy Twoja wątpliwość"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Tutaj wpisz swoją opinię. Aby chronić swoją prywatność, nie podawaj żadnych danych osobowych, takich jak adres czy numer telefonu."], ["Tutaj wpisz swoją opinię. Aby chronić swoją prywatność, nie podawaj żadnych danych osobowych, takich jak adres czy numer telefonu."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Wstecz"], ["Wstecz"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Wyślij"], ["Wyślij"]))), t.feedbackThanks = bt.default(te || (te = n(["Dziękujemy za opinię!"], ["Dziękujemy za opinię!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Oświadczenie o ochronie prywatności"], ["Oświadczenie o ochronie prywatności"]))), t.websiteDescription = bt.default(ne || (ne = n(["Monitoruj liczbę aktywnych, wyleczonych i śmiertelnych przypadków koronawirusa w skali lokalnej i globalnej na mapie. Do tego codzienne wiadomości i materiały wideo."], ["Monitoruj liczbę aktywnych, wyleczonych i śmiertelnych przypadków koronawirusa w skali lokalnej i globalnej na mapie. Do tego codzienne wiadomości i materiały wideo."]))), t.graphOverTime = bt.default(ie || (ie = n(["Rozprzestrzenianie się w czasie"], ["Rozprzestrzenianie się w czasie"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " mln"], ["", " mln"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " tys."], ["", " tys."])), 0), t.upsellDesc = bt.default(le || (le = n(["Śledź najnowsze wiadomości na telefonie w aplikacji Bing"], ["Śledź najnowsze wiadomości na telefonie w aplikacji Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Pobierz teraz"], ["Pobierz teraz"]))), t.upsellTitle = bt.default(de || (de = n(["Śledź wiadomości o koronawirusie"], ["Śledź wiadomości o koronawirusie"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Więcej o koronawirusie"], ["Więcej o koronawirusie"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Dodaj nasze rozszerzenie do przeglądarki Chrome i otrzymuj najnowsze informacje o koronawirusie w wyszukiwarce Bing"], ["Dodaj nasze rozszerzenie do przeglądarki Chrome i otrzymuj najnowsze informacje o koronawirusie w wyszukiwarce Bing"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Dodaj nasze rozszerzenie do przeglądarki Firefox i otrzymuj najnowsze informacje o koronawirusie w wyszukiwarce Bing"], ["Dodaj nasze rozszerzenie do przeglądarki Firefox i otrzymuj najnowsze informacje o koronawirusie w wyszukiwarce Bing"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Dodaj rozszerzenie"], ["Dodaj rozszerzenie"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Chroń się przed infekcją"], ["Chroń się przed infekcją"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Monitoruj sytuację, korzystając z rozszerzenia"], ["Monitoruj sytuację, korzystając z rozszerzenia"]))), t.submit = bt.default(he || (he = n(["Gotowe"], ["Gotowe"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " lat(a)"], ["", " lat(a)"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " mies."], ["", " mies."])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " tyg."], ["", " tyg."])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " dni"], ["", " dni"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " godz."], ["", " godz."])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " min"], ["", " min"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Twoja lokalizacja"], ["Twoja lokalizacja"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtruj według lokalizacji"], ["Filtruj według lokalizacji"]))), t.expand = bt.default(ze || (ze = n(["Rozwiń"], ["Rozwiń"]))), t.trends = bt.default(Se || (Se = n(["Trendy"], ["Trendy"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Informacje o badaniach"], ["Informacje o badaniach"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokół i kontakt"], ["Protokół i kontakt"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokół"], ["Protokół"]))), t.hotline = bt.default(Me || (Me = n(["Infolinia"], ["Infolinia"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Firmy partnerskie"], ["Firmy partnerskie"]))), t.moreTestingLocations = bt.default(je || (je = n(["Zobacz, gdzie można się zbadać (liczba lokalizacji: ", ")"], ["Zobacz, gdzie można się zbadać (liczba lokalizacji: ", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Pokaż mniej"], ["Pokaż mniej"]))), t.topTrends = bt.default(Be || (Be = n(["Porównanie według łącznej liczby przypadków"], ["Porównanie według łącznej liczby przypadków"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Najnowsze wiadomości o koronawirusie"], ["Najnowsze wiadomości o koronawirusie"]))), t.copyLink = bt.default(Le || (Le = n(["Kopiuj łącze"], ["Kopiuj łącze"]))), t.email = bt.default(Oe || (Oe = n(["E-mail"], ["E-mail"]))), t.cancel = bt.default(Re || (Re = n(["Anuluj"], ["Anuluj"]))), t.confirmed = bt.default(_e || (_e = n(["Potwierdzone"], ["Potwierdzone"]))), t.fatal = bt.default(Ne || (Ne = n(["Śmiertelne"], ["Śmiertelne"]))), t.recovered = bt.default(Ve || (Ve = n(["Wyleczone"], ["Wyleczone"]))), t.active = bt.default(Ue || (Ue = n(["Aktywne"], ["Aktywne"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Aby zobaczyć dane dla swojej lokalizacji, przydziel uprawnienia dostępu do lokalizacji tutaj."], ["Aby zobaczyć dane dla swojej lokalizacji, przydziel uprawnienia dostępu do lokalizacji tutaj."]))), t.overviewVertical = bt.default(He || (He = n(["Przegląd"], ["Przegląd"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Wiadomości i wideo"], ["Wiadomości i wideo"]))), t.graphstrends = bt.default(We || (We = n(["Wykresy"], ["Wykresy"]))), t.localResources = bt.default(Ke || (Ke = n(["Zasoby lokalne"], ["Zasoby lokalne"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Zaktualizowano ", " min temu"], ["Zaktualizowano ", " min temu"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Wysyłając swój numer telefonu komórkowego lub adres e-mail, zgadzasz się na otrzymanie na ten adres lub numer jednorazowej wiadomości automatycznej od firmy Microsoft. Obowiązują standardowe stawki za wiadomości SMS."], ["Wysyłając swój numer telefonu komórkowego lub adres e-mail, zgadzasz się na otrzymanie na ten adres lub numer jednorazowej wiadomości automatycznej od firmy Microsoft. Obowiązują standardowe stawki za wiadomości SMS."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Oświadczenie o ochronie prywatności w firmie Microsoft"], ["Oświadczenie o ochronie prywatności w firmie Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Wyślij łącze"], ["Wyślij łącze"]))), t.compare = bt.default(it || (it = n(["Porównaj"], ["Porównaj"]))), t.browse = bt.default(rt || (rt = n(["Przeglądaj"], ["Przeglądaj"]))), t.favorites = bt.default(ot || (ot = n(["Ulubione"], ["Ulubione"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Wprowadź prawidłowy amerykański numer telefonu."], ["Wprowadź prawidłowy amerykański numer telefonu."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Dziękujemy. Wypróbuj łącze, które w ciągu godziny wyślemy na Twój telefon."], ["Dziękujemy. Wypróbuj łącze, które w ciągu godziny wyślemy na Twój telefon."]))), t.opalSMSError = bt.default(dt || (dt = n(["Wystąpił błąd. Pobierz aplikację Wyszukiwanie Bing ze sklepu z aplikacjami."], ["Wystąpił błąd. Pobierz aplikację Wyszukiwanie Bing ze sklepu z aplikacjami."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Więcej na temat: ", ""], ["Więcej na temat: ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Mniej na temat: ", ""], ["Mniej na temat: ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Popularne tematy"], ["Popularne tematy"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Skala logarytmiczna"], ["Skala logarytmiczna"]))), t.linearScale = bt.default(vt || (vt = n(["Skala liniowa"], ["Skala liniowa"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Cześć! Jestem botem odpowiadającym na często zadawane pytania dotyczące COVID-19. Pomogę Ci znaleźć odpowiedzi na Twoje pytania."], ["Cześć! Jestem botem odpowiadającym na często zadawane pytania dotyczące COVID-19. Pomogę Ci znaleźć odpowiedzi na Twoje pytania."]))), t.dataTitle = bt.default(gt || (gt = n(["Dane"], ["Dane"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.pt-br.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Última atualização dos dados:"], ["Última atualização dos dados:"]))), t.urlCopied = bt.default(r || (r = n(["Url copiada para a área de transferência"], ["Url copiada para a área de transferência"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Rastreador do COVID-19"], ["Rastreador do COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Rastreador em mapa dinâmico do coronavírus (COVID-19) do Bing da Microsoft"], ["Rastreador em mapa dinâmico do coronavírus (COVID-19) do Bing da Microsoft"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regiões"], ["Regiões"]))), t.noRegionalData = bt.default(u || (u = n(["Os dados regionais ainda não estão disponíveis para este país/região. Tente novamente mais tarde."], ["Os dados regionais ainda não estão disponíveis para este país/região. Tente novamente mais tarde."]))), t.activeCases = bt.default(c || (c = n(["Casos ativos"], ["Casos ativos"]))), t.recoveredCases = bt.default(f || (f = n(["Casos recuperados"], ["Casos recuperados"]))), t.fatalCases = bt.default(p || (p = n(["Casos fatais"], ["Casos fatais"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Ativos"], ["Ativos"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Recuperados"], ["Recuperados"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Fatais"], ["Fatais"]))), t.overview = bt.default(g || (g = n(["Visão geral"], ["Visão geral"]))), t.close = bt.default(b || (b = n(["Fechar"], ["Fechar"]))), t.selectARegion = bt.default(k || (k = n(["Selecione uma região"], ["Selecione uma região"]))), t.global = bt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = bt.default(C || (C = n(["Status Global"], ["Status Global"]))), t.allRegions = bt.default(w || (w = n(["Todas as Regiões"], ["Todas as Regiões"]))), t.share = bt.default(x || (x = n(["Compartilhar"], ["Compartilhar"]))), t.dataInfo = bt.default(T || (T = n(["Informações de dados"], ["Informações de dados"]))), t.totalConfirmed = bt.default(z || (z = n(["Total de Casos Confirmados"], ["Total de Casos Confirmados"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Total de casos"], ["Total de casos"]))), t.totalAreas = bt.default(I || (I = n(["Total: ", ""], ["Total: ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Ocultar informações para ver o mapa completo"], ["Ocultar informações para ver o mapa completo"]))), t.showInfo = bt.default(D || (D = n(["Mostrar informações"], ["Mostrar informações"]))), t.news = bt.default(M || (M = n(["Notícias"], ["Notícias"]))), t.helpfulResources = bt.default(E || (E = n(["Ajuda e Informações"], ["Ajuda e Informações"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Ver mais"], ["Ver mais"]))), t.dataFrom = bt.default(O || (O = n(["Dados de:"], ["Dados de:"]))), t.videos = bt.default(R || (R = n(["Vídeos"], ["Vídeos"]))), t.moreNews = bt.default(_ || (_ = n(["Ver mais artigos"], ["Ver mais artigos"]))), t.moreVideos = bt.default(N || (N = n(["Ver mais vídeos"], ["Ver mais vídeos"]))), t.map = bt.default(V || (V = n(["Mapa:"], ["Mapa:"]))), t.feedback = bt.default(U || (U = n(["Enviar comentários"], ["Enviar comentários"]))), t.feedbackQuestion = bt.default(q || (q = n(["Que tipo de comentários você quer fazer sobre esta ferramenta?"], ["Que tipo de comentários você quer fazer sobre esta ferramenta?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Relatar um problema"], ["Relatar um problema"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Conte-nos sobre o problema"], ["Conte-nos sobre o problema"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Compartilhar uma ideia"], ["Compartilhar uma ideia"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Conte-nos sobre sua ideia"], ["Conte-nos sobre sua ideia"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Fazer um elogio"], ["Fazer um elogio"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Diga-nos do que você gosta"], ["Diga-nos do que você gosta"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Preocupação legal ou de privacidade"], ["Preocupação legal ou de privacidade"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Conte-nos sobre sua preocupação"], ["Conte-nos sobre sua preocupação"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Insira seus comentários aqui. Para ajudar a proteger sua privacidade, não inclua informações pessoais, como seu endereço ou número de telefone"], ["Insira seus comentários aqui. Para ajudar a proteger sua privacidade, não inclua informações pessoais, como seu endereço ou número de telefone"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Voltar"], ["Voltar"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Enviar"], ["Enviar"]))), t.feedbackThanks = bt.default(te || (te = n(["Obrigado por seus comentários!"], ["Obrigado por seus comentários!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Política de privacidade"], ["Política de privacidade"]))), t.websiteDescription = bt.default(ne || (ne = n(["Acompanhe os casos locais e globais do coronavírus (COVID-19) com casos ativos, recuperações e taxa de mortalidade no mapa, bem como notícias e vídeos diários."], ["Acompanhe os casos locais e globais do coronavírus (COVID-19) com casos ativos, recuperações e taxa de mortalidade no mapa, bem como notícias e vídeos diários."]))), t.graphOverTime = bt.default(ie || (ie = n(["Propagação ao Longo do Tempo"], ["Propagação ao Longo do Tempo"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " milhão(ões)"], ["", " milhão(ões)"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " mil"], ["", " mil"])), 0), t.upsellDesc = bt.default(le || (le = n(["Acompanhe as atualizações mais recentes em seu celular com o aplicativo Bing"], ["Acompanhe as atualizações mais recentes em seu celular com o aplicativo Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Baixar agora"], ["Baixar agora"]))), t.upsellTitle = bt.default(de || (de = n(["Acompanhe as notícias sobre o coronavírus"], ["Acompanhe as notícias sobre o coronavírus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Rastrear o coronavírus"], ["Rastrear o coronavírus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Receba as atualizações mais recentes sobre o coronavírus no Bing ao adicionar nossa extensão para o Chrome"], ["Receba as atualizações mais recentes sobre o coronavírus no Bing ao adicionar nossa extensão para o Chrome"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Receba as atualizações mais recentes sobre o coronavírus no Bing ao adicionar nossa extensão para o Firefox"], ["Receba as atualizações mais recentes sobre o coronavírus no Bing ao adicionar nossa extensão para o Firefox"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Adicionar a extensão"], ["Adicionar a extensão"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Fique informado e seguro"], ["Fique informado e seguro"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Rastrear com a extensão"], ["Rastrear com a extensão"]))), t.submit = bt.default(he || (he = n(["Concluído"], ["Concluído"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "ano(s)"], ["", "ano(s)"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "mês(es)"], ["", "mês(es)"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "sem"], ["", "sem"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "h"], ["", "h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "min"], ["", "min"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Sua Localização"], ["Sua Localização"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtrar para um local"], ["Filtrar para um local"]))), t.expand = bt.default(ze || (ze = n(["Expandir"], ["Expandir"]))), t.trends = bt.default(Se || (Se = n(["Tendências"], ["Tendências"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Informações de Teste"], ["Informações de Teste"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protocolo e Contato"], ["Protocolo e Contato"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protocolo"], ["Protocolo"]))), t.hotline = bt.default(Me || (Me = n(["Linha direta"], ["Linha direta"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Empresas Parceiras"], ["Empresas Parceiras"]))), t.moreTestingLocations = bt.default(je || (je = n(["Ver locais de teste (", ")"], ["Ver locais de teste (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Ver menos"], ["Ver menos"]))), t.topTrends = bt.default(Be || (Be = n(["Comparação por Total de Casos"], ["Comparação por Total de Casos"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Atualizações mais recentes sobre o coronavírus"], ["Atualizações mais recentes sobre o coronavírus"]))), t.copyLink = bt.default(Le || (Le = n(["Copiar link"], ["Copiar link"]))), t.email = bt.default(Oe || (Oe = n(["Email"], ["Email"]))), t.cancel = bt.default(Re || (Re = n(["Cancelar"], ["Cancelar"]))), t.confirmed = bt.default(_e || (_e = n(["Confirmados"], ["Confirmados"]))), t.fatal = bt.default(Ne || (Ne = n(["Fatais"], ["Fatais"]))), t.recovered = bt.default(Ve || (Ve = n(["Recuperados"], ["Recuperados"]))), t.active = bt.default(Ue || (Ue = n(["Ativos"], ["Ativos"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Para ver sua localização, habilite as permissões de localização aqui."], ["Para ver sua localização, habilite as permissões de localização aqui."]))), t.overviewVertical = bt.default(He || (He = n(["Visão geral"], ["Visão geral"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Notícias e Vídeos"], ["Notícias e Vídeos"]))), t.graphstrends = bt.default(We || (We = n(["Gráficos"], ["Gráficos"]))), t.localResources = bt.default(Ke || (Ke = n(["Recursos Locais"], ["Recursos Locais"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Atualizado há ", " min"], ["Atualizado há ", " min"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Enviando seu número de telefone ou email, você concorda em receber uma mensagem automatizada única da Microsoft nesse número de telefone celular ou email. Taxas padrão de SMS são aplicáveis."], ["Enviando seu número de telefone ou email, você concorda em receber uma mensagem automatizada única da Microsoft nesse número de telefone celular ou email. Taxas padrão de SMS são aplicáveis."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Política de Privacidade da Microsoft"], ["Política de Privacidade da Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Enviar link"], ["Enviar link"]))), t.compare = bt.default(it || (it = n(["Comparar"], ["Comparar"]))), t.browse = bt.default(rt || (rt = n(["Procurar"], ["Procurar"]))), t.favorites = bt.default(ot || (ot = n(["Favoritos"], ["Favoritos"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Insira um número de telefone válido nos EUA."], ["Insira um número de telefone válido nos EUA."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Obrigado. Experimente o link enviado ao seu telefone dentro de uma hora."], ["Obrigado. Experimente o link enviado ao seu telefone dentro de uma hora."]))), t.opalSMSError = bt.default(dt || (dt = n(["Erro encontrado. Baixe o aplicativo Pesquisa do Bing da loja de aplicativos."], ["Erro encontrado. Baixe o aplicativo Pesquisa do Bing da loja de aplicativos."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Mais artigos sobre ", ""], ["Mais artigos sobre ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Menos artigos sobre ", ""], ["Menos artigos sobre ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Tópicos mais Populares"], ["Tópicos mais Populares"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Escala logarítmica"], ["Escala logarítmica"]))), t.linearScale = bt.default(vt || (vt = n(["Escala linear"], ["Escala linear"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Olá! Sou o bot auxiliar de perguntas frequentes sobre o COVID-19 e estou aqui para ajudar a responder às suas perguntas!"], ["Olá! Sou o bot auxiliar de perguntas frequentes sobre o COVID-19 e estou aqui para ajudar a responder às suas perguntas!"]))), t.dataTitle = bt.default(gt || (gt = n(["Dados"], ["Dados"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.pt-pt.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Data/hora da última atualização dos dados:"], ["Data/hora da última atualização dos dados:"]))), t.urlCopied = bt.default(r || (r = n(["Url copiado para a área de transferência"], ["Url copiado para a área de transferência"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Monitorizador do COVID-19"], ["Monitorizador do COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Monitorizador em direto do mapa do coronavírus (COVID-19) do Microsoft Bing"], ["Monitorizador em direto do mapa do coronavírus (COVID-19) do Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regiões"], ["Regiões"]))), t.noRegionalData = bt.default(u || (u = n(["Os dados regionais ainda não estão disponíveis para este país/região. Tente novamente mais tarde."], ["Os dados regionais ainda não estão disponíveis para este país/região. Tente novamente mais tarde."]))), t.activeCases = bt.default(c || (c = n(["Casos ativos"], ["Casos ativos"]))), t.recoveredCases = bt.default(f || (f = n(["Casos recuperados"], ["Casos recuperados"]))), t.fatalCases = bt.default(p || (p = n(["Casos fatais"], ["Casos fatais"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Ativos"], ["Ativos"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Recuperados"], ["Recuperados"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Fatais"], ["Fatais"]))), t.overview = bt.default(g || (g = n(["Resumo"], ["Resumo"]))), t.close = bt.default(b || (b = n(["Fechar"], ["Fechar"]))), t.selectARegion = bt.default(k || (k = n(["Selecionar uma região"], ["Selecionar uma região"]))), t.global = bt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = bt.default(C || (C = n(["Estado Global"], ["Estado Global"]))), t.allRegions = bt.default(w || (w = n(["Todas as Regiões"], ["Todas as Regiões"]))), t.share = bt.default(x || (x = n(["Partilhar"], ["Partilhar"]))), t.dataInfo = bt.default(T || (T = n(["Informações de dados"], ["Informações de dados"]))), t.totalConfirmed = bt.default(z || (z = n(["Total de Casos Confirmados"], ["Total de Casos Confirmados"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Total de casos"], ["Total de casos"]))), t.totalAreas = bt.default(I || (I = n(["", " no Total"], ["", " no Total"])), 0), t.hideInfo = bt.default(A || (A = n(["Ocultar informações para ver mapa completo"], ["Ocultar informações para ver mapa completo"]))), t.showInfo = bt.default(D || (D = n(["Mostrar informações"], ["Mostrar informações"]))), t.news = bt.default(M || (M = n(["Notícias"], ["Notícias"]))), t.helpfulResources = bt.default(E || (E = n(["Ajuda e Informações"], ["Ajuda e Informações"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Ver mais"], ["Ver mais"]))), t.dataFrom = bt.default(O || (O = n(["Dados de:"], ["Dados de:"]))), t.videos = bt.default(R || (R = n(["Vídeos"], ["Vídeos"]))), t.moreNews = bt.default(_ || (_ = n(["Ver mais artigos"], ["Ver mais artigos"]))), t.moreVideos = bt.default(N || (N = n(["Ver mais vídeos"], ["Ver mais vídeos"]))), t.map = bt.default(V || (V = n(["Mapa:"], ["Mapa:"]))), t.feedback = bt.default(U || (U = n(["Enviar comentários"], ["Enviar comentários"]))), t.feedbackQuestion = bt.default(q || (q = n(["Que tipos de comentários tem sobre esta ferramenta?"], ["Que tipos de comentários tem sobre esta ferramenta?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Comunicar um problema"], ["Comunicar um problema"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Descreva o seu problema"], ["Descreva o seu problema"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Partilhar uma ideia"], ["Partilhar uma ideia"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Descreva a sua ideia"], ["Descreva a sua ideia"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Elogiar"], ["Elogiar"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Descreva do que gostou"], ["Descreva do que gostou"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Problema legal ou de privacidade"], ["Problema legal ou de privacidade"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Descreva o seu problema"], ["Descreva o seu problema"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Introduza os seus comentário aqui. Para ajudar a proteger a sua privacidade, não inclua informações pessoais, como o seu endereço ou número de telefone"], ["Introduza os seus comentário aqui. Para ajudar a proteger a sua privacidade, não inclua informações pessoais, como o seu endereço ou número de telefone"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Anterior"], ["Anterior"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Enviar"], ["Enviar"]))), t.feedbackThanks = bt.default(te || (te = n(["Agradecemos ter enviado os seus comentários!"], ["Agradecemos ter enviado os seus comentários!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Declaração de privacidade"], ["Declaração de privacidade"]))), t.websiteDescription = bt.default(ne || (ne = n(["Monitorize os casos locais e globais do coronavírus COVID-19 com taxas de infetados, recuperados e mortes no mapa, bem como notícias e vídeos diários."], ["Monitorize os casos locais e globais do coronavírus COVID-19 com taxas de infetados, recuperados e mortes no mapa, bem como notícias e vídeos diários."]))), t.graphOverTime = bt.default(ie || (ie = n(["Disseminação ao Longo do Tempo"], ["Disseminação ao Longo do Tempo"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " milhões"], ["", " milhões"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " mil"], ["", " mil"])), 0), t.upsellDesc = bt.default(le || (le = n(["Monitorize as atualizações mais recentes no seu telemóvel com a aplicação Bing"], ["Monitorize as atualizações mais recentes no seu telemóvel com a aplicação Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Transferir agora"], ["Transferir agora"]))), t.upsellTitle = bt.default(de || (de = n(["Seguir notícias sobre o coronavírus"], ["Seguir notícias sobre o coronavírus"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Monitorizar o coronavírus"], ["Monitorizar o coronavírus"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Obtenha as informações mais atualizadas sobre o coronavírus no Bing ao adicionar a nossa extensão para Chrome"], ["Obtenha as informações mais atualizadas sobre o coronavírus no Bing ao adicionar a nossa extensão para Chrome"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Obtenha as informações mais atualizadas sobre o coronavírus no Bing ao adicionar a nossa extensão para Firefox"], ["Obtenha as informações mais atualizadas sobre o coronavírus no Bing ao adicionar a nossa extensão para Firefox"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Adicionar a extensão"], ["Adicionar a extensão"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Fique seguro e informe-se"], ["Fique seguro e informe-se"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Monitorizar com a extensão"], ["Monitorizar com a extensão"]))), t.submit = bt.default(he || (he = n(["Concluído"], ["Concluído"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " a"], ["", " a"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " m"], ["", " m"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " sem"], ["", " sem"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " d"], ["", " d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " h"], ["", " h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " min"], ["", " min"])), 0), t.yourLocation = bt.default(xe || (xe = n(["A sua Localização"], ["A sua Localização"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtrar por localização"], ["Filtrar por localização"]))), t.expand = bt.default(ze || (ze = n(["Expandir"], ["Expandir"]))), t.trends = bt.default(Se || (Se = n(["Tendências"], ["Tendências"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Informações sobre Testes"], ["Informações sobre Testes"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protocolo e Contacto"], ["Protocolo e Contacto"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protocolo"], ["Protocolo"]))), t.hotline = bt.default(Me || (Me = n(["Linha de atendimento"], ["Linha de atendimento"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Empresas Parceiras"], ["Empresas Parceiras"]))), t.moreTestingLocations = bt.default(je || (je = n(["Ver localizações de teste (", ")"], ["Ver localizações de teste (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Ver menos"], ["Ver menos"]))), t.topTrends = bt.default(Be || (Be = n(["Comparação por Total de Casos"], ["Comparação por Total de Casos"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Atualizações recentes sobre o coronavírus"], ["Atualizações recentes sobre o coronavírus"]))), t.copyLink = bt.default(Le || (Le = n(["Copiar ligação"], ["Copiar ligação"]))), t.email = bt.default(Oe || (Oe = n(["E-mail"], ["E-mail"]))), t.cancel = bt.default(Re || (Re = n(["Cancelar"], ["Cancelar"]))), t.confirmed = bt.default(_e || (_e = n(["Confirmados"], ["Confirmados"]))), t.fatal = bt.default(Ne || (Ne = n(["Fatais"], ["Fatais"]))), t.recovered = bt.default(Ve || (Ve = n(["Recuperados"], ["Recuperados"]))), t.active = bt.default(Ue || (Ue = n(["Ativos"], ["Ativos"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Para ver a sua localização, ative as permissões de localização aqui."], ["Para ver a sua localização, ative as permissões de localização aqui."]))), t.overviewVertical = bt.default(He || (He = n(["Resumo"], ["Resumo"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Notícias e Vídeos"], ["Notícias e Vídeos"]))), t.graphstrends = bt.default(We || (We = n(["Gráficos"], ["Gráficos"]))), t.localResources = bt.default(Ke || (Ke = n(["Recursos Locais"], ["Recursos Locais"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Atualizado há ", " min"], ["Atualizado há ", " min"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Ao enviar o seu número de telefone ou e-mail, aceita receber uma mensagem automatizada única da Microsoft neste número de telemóvel ou e-mail. Podem aplicar-se taxas SMS padrão."], ["Ao enviar o seu número de telefone ou e-mail, aceita receber uma mensagem automatizada única da Microsoft neste número de telemóvel ou e-mail. Podem aplicar-se taxas SMS padrão."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Declaração de Privacidade da Microsoft"], ["Declaração de Privacidade da Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Enviar ligação"], ["Enviar ligação"]))), t.compare = bt.default(it || (it = n(["Comparar"], ["Comparar"]))), t.browse = bt.default(rt || (rt = n(["Procurar"], ["Procurar"]))), t.favorites = bt.default(ot || (ot = n(["Favoritos"], ["Favoritos"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Introduza um número válido nos EUA."], ["Introduza um número válido nos EUA."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Experimente a ligação enviada para o seu telemóvel dentro de uma hora."], ["Experimente a ligação enviada para o seu telemóvel dentro de uma hora."]))), t.opalSMSError = bt.default(dt || (dt = n(["Ocorreu um erro. Transfira a aplicação Pesquisa do Bing a partir da loja de aplicações."], ["Ocorreu um erro. Transfira a aplicação Pesquisa do Bing a partir da loja de aplicações."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Mais sobre ", ""], ["Mais sobre ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Menos sobre ", ""], ["Menos sobre ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Tópicos Mais Populares"], ["Tópicos Mais Populares"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Escala logarítmica"], ["Escala logarítmica"]))), t.linearScale = bt.default(vt || (vt = n(["Escala linear"], ["Escala linear"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Olá! Sou o bot auxiliar das FAQ sobre a COVID-19 e estou aqui para ajudar a responder às suas perguntas!"], ["Olá! Sou o bot auxiliar das FAQ sobre a COVID-19 e estou aqui para ajudar a responder às suas perguntas!"]))), t.dataTitle = bt.default(gt || (gt = n(["Dados"], ["Dados"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.ru-ru.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Последнее обновление данных:"], ["Последнее обновление данных:"]))), t.urlCopied = bt.default(r || (r = n(["URL-адрес скопирован в буфер обмена"], ["URL-адрес скопирован в буфер обмена"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19: отслеживание"], ["COVID-19: отслеживание"]))), t.bingCovidTitle = bt.default(s || (s = n(["Отслеживание коронавируса (COVID-19) на карте в режиме реального времени в Microsoft Bing"], ["Отслеживание коронавируса (COVID-19) на карте в режиме реального времени в Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Регионы"], ["Регионы"]))), t.noRegionalData = bt.default(u || (u = n(["Региональные данные еще не доступны для этой страны или этого региона. Повторите попытку позже."], ["Региональные данные еще не доступны для этой страны или этого региона. Повторите попытку позже."]))), t.activeCases = bt.default(c || (c = n(["Число заболевших"], ["Число заболевших"]))), t.recoveredCases = bt.default(f || (f = n(["Число выздоровевших"], ["Число выздоровевших"]))), t.fatalCases = bt.default(p || (p = n(["Число умерших"], ["Число умерших"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Заболели"], ["Заболели"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Выздоровели"], ["Выздоровели"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Умерли"], ["Умерли"]))), t.overview = bt.default(g || (g = n(["Обзор"], ["Обзор"]))), t.close = bt.default(b || (b = n(["Закрыть"], ["Закрыть"]))), t.selectARegion = bt.default(k || (k = n(["Выберите регион"], ["Выберите регион"]))), t.global = bt.default(y || (y = n(["Общее число"], ["Общее число"]))), t.globalStatus = bt.default(C || (C = n(["Общее состояние"], ["Общее состояние"]))), t.allRegions = bt.default(w || (w = n(["Все регионы"], ["Все регионы"]))), t.share = bt.default(x || (x = n(["Поделиться"], ["Поделиться"]))), t.dataInfo = bt.default(T || (T = n(["Информация, полученная в результате обработки данных"], ["Информация, полученная в результате обработки данных"]))), t.totalConfirmed = bt.default(z || (z = n(["Всего подтвержденных случаев заболевания"], ["Всего подтвержденных случаев заболевания"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Всего случаев заражения"], ["Всего случаев заражения"]))), t.totalAreas = bt.default(I || (I = n(["Всего: ", ""], ["Всего: ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Скрыть информацию, чтобы просмотреть полную карту"], ["Скрыть информацию, чтобы просмотреть полную карту"]))), t.showInfo = bt.default(D || (D = n(["Показать информацию"], ["Показать информацию"]))), t.news = bt.default(M || (M = n(["Новости"], ["Новости"]))), t.helpfulResources = bt.default(E || (E = n(["Справка и информация"], ["Справка и информация"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Дополнительно"], ["Дополнительно"]))), t.dataFrom = bt.default(O || (O = n(["Источник данных:"], ["Источник данных:"]))), t.videos = bt.default(R || (R = n(["Видео"], ["Видео"]))), t.moreNews = bt.default(_ || (_ = n(["Показать другие статьи"], ["Показать другие статьи"]))), t.moreVideos = bt.default(N || (N = n(["Показать другие видео"], ["Показать другие видео"]))), t.map = bt.default(V || (V = n(["Карта:"], ["Карта:"]))), t.feedback = bt.default(U || (U = n(["Отправить отзыв"], ["Отправить отзыв"]))), t.feedbackQuestion = bt.default(q || (q = n(["Какой отзыв об этом инструменте вы хотите отправить?"], ["Какой отзыв об этом инструменте вы хотите отправить?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Сообщить о проблеме"], ["Сообщить о проблеме"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Сообщите нам о проблеме"], ["Сообщите нам о проблеме"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Поделиться идеей"], ["Поделиться идеей"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Сообщите нам о своей идее"], ["Сообщите нам о своей идее"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Сделать комплимент"], ["Сделать комплимент"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Сообщите нам, что вам нравится"], ["Сообщите нам, что вам нравится"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Юридическая проблема или проблема конфиденциальности"], ["Юридическая проблема или проблема конфиденциальности"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Сообщите нам, что вас беспокоит"], ["Сообщите нам, что вас беспокоит"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Введите отзыв здесь. Чтобы обеспечить конфиденциальность, не вводите персональные данные, например адрес или номер телефона."], ["Введите отзыв здесь. Чтобы обеспечить конфиденциальность, не вводите персональные данные, например адрес или номер телефона."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Назад"], ["Назад"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Отправить"], ["Отправить"]))), t.feedbackThanks = bt.default(te || (te = n(["Благодарим за отзыв!"], ["Благодарим за отзыв!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Заявление о конфиденциальности"], ["Заявление о конфиденциальности"]))), t.websiteDescription = bt.default(ne || (ne = n(["Отслеживайте данные о заражении коронавирусом COVID-19, включая статистику заболевших, выздоровевших и умерших на карте, с ежедневными новостями и видео."], ["Отслеживайте данные о заражении коронавирусом COVID-19, включая статистику заболевших, выздоровевших и умерших на карте, с ежедневными новостями и видео."]))), t.graphOverTime = bt.default(ie || (ie = n(["Распространение в зависимости от времени"], ["Распространение в зависимости от времени"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " млн."], ["", " млн."])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " тыс."], ["", " тыс."])), 0), t.upsellDesc = bt.default(le || (le = n(["Следите за последними новостями на своем телефоне с помощью приложения Bing"], ["Следите за последними новостями на своем телефоне с помощью приложения Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Скачать сейчас"], ["Скачать сейчас"]))), t.upsellTitle = bt.default(de || (de = n(["Отслеживайте новости о коронавирусе"], ["Отслеживайте новости о коронавирусе"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Отслеживание коронавируса"], ["Отслеживание коронавируса"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Получите последние новости о коронавирусе, добавив наше расширение для Chrome"], ["Получите последние новости о коронавирусе, добавив наше расширение для Chrome"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Получите последние новости о коронавирусе, добавив наше расширение для Firefox"], ["Получите последние новости о коронавирусе, добавив наше расширение для Firefox"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Добавить расширение"], ["Добавить расширение"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Будьте в безопасности, будьте в курсе"], ["Будьте в безопасности, будьте в курсе"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Отслеживание с помощью расширения"], ["Отслеживание с помощью расширения"]))), t.submit = bt.default(he || (he = n(["Готово"], ["Готово"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " г"], ["", " г"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " мес."], ["", " мес."])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " нед."], ["", " нед."])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " дн."], ["", " дн."])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " ч"], ["", " ч"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " мин"], ["", " мин"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Ваше расположение"], ["Ваше расположение"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Фильтр по расположению"], ["Фильтр по расположению"]))), t.expand = bt.default(ze || (ze = n(["Развернуть"], ["Развернуть"]))), t.trends = bt.default(Se || (Se = n(["Тенденции"], ["Тенденции"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Информация о тестировании"], ["Информация о тестировании"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Протокол и контактная информация"], ["Протокол и контактная информация"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Протокол"], ["Протокол"]))), t.hotline = bt.default(Me || (Me = n(["Линия экстренной связи"], ["Линия экстренной связи"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Компании-партнеры"], ["Компании-партнеры"]))), t.moreTestingLocations = bt.default(je || (je = n(["Показать места тестирования (", ")"], ["Показать места тестирования (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Меньше"], ["Меньше"]))), t.topTrends = bt.default(Be || (Be = n(["Сравнение общего числа заболевших"], ["Сравнение общего числа заболевших"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Последние данные о коронавирусе"], ["Последние данные о коронавирусе"]))), t.copyLink = bt.default(Le || (Le = n(["Копировать ссылку"], ["Копировать ссылку"]))), t.email = bt.default(Oe || (Oe = n(["Электронная почта"], ["Электронная почта"]))), t.cancel = bt.default(Re || (Re = n(["Отмена"], ["Отмена"]))), t.confirmed = bt.default(_e || (_e = n(["Заболели"], ["Заболели"]))), t.fatal = bt.default(Ne || (Ne = n(["Умерли"], ["Умерли"]))), t.recovered = bt.default(Ve || (Ve = n(["Выздоровели"], ["Выздоровели"]))), t.active = bt.default(Ue || (Ue = n(["Заболели"], ["Заболели"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Чтобы просмотреть данные для своего расположения, разрешите доступ к данным о своем расположении здесь."], ["Чтобы просмотреть данные для своего расположения, разрешите доступ к данным о своем расположении здесь."]))), t.overviewVertical = bt.default(He || (He = n(["Обзор"], ["Обзор"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Новости и видео"], ["Новости и видео"]))), t.graphstrends = bt.default(We || (We = n(["Графики"], ["Графики"]))), t.localResources = bt.default(Ke || (Ke = n(["Местные ресурсы"], ["Местные ресурсы"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Обновлено ", " мин назад"], ["Обновлено ", " мин назад"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Отправляя свой номер телефона или адрес электронной почты, вы соглашаетесь на получение разового автоматического сообщения от Майкрософт на этот номер мобильного телефона или электронную почту. Применяются стандартные тарифы для SMS-сообщений."], ["Отправляя свой номер телефона или адрес электронной почты, вы соглашаетесь на получение разового автоматического сообщения от Майкрософт на этот номер мобильного телефона или электронную почту. Применяются стандартные тарифы для SMS-сообщений."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Заявление корпорации Майкрософт о конфиденциальности"], ["Заявление корпорации Майкрософт о конфиденциальности"]))), t.sendLink = bt.default(nt || (nt = n(["Отправить ссылку"], ["Отправить ссылку"]))), t.compare = bt.default(it || (it = n(["Сравнить"], ["Сравнить"]))), t.browse = bt.default(rt || (rt = n(["просмотреть"], ["просмотреть"]))), t.favorites = bt.default(ot || (ot = n(["Избранное"], ["Избранное"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Введите допустимый номер телефона в США."], ["Введите допустимый номер телефона в США."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Спасибо. Воспользуйтесь ссылкой, которая не позже чем через час будет отправлена на ваш телефон."], ["Спасибо. Воспользуйтесь ссылкой, которая не позже чем через час будет отправлена на ваш телефон."]))), t.opalSMSError = bt.default(dt || (dt = n(["Произошла ошибка. Скачайте приложение поиска Bing из магазина приложений."], ["Произошла ошибка. Скачайте приложение поиска Bing из магазина приложений."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Больше по теме: ", ""], ["Больше по теме: ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Меньше по теме: ", ""], ["Меньше по теме: ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Актуальные темы"], ["Актуальные темы"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Логарифмическая шкала"], ["Логарифмическая шкала"]))), t.linearScale = bt.default(vt || (vt = n(["Линейная шкала"], ["Линейная шкала"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Всем привет! Я бот-помощник, отвечающий на часто задаваемые вопросы о COVID-19, и я здесь, чтобы ответить на ваши вопросы!"], ["Всем привет! Я бот-помощник, отвечающий на часто задаваемые вопросы о COVID-19, и я здесь, чтобы ответить на ваши вопросы!"]))), t.dataTitle = bt.default(gt || (gt = n(["Данные"], ["Данные"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.sv-se.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Data uppdaterades senast:"], ["Data uppdaterades senast:"]))), t.urlCopied = bt.default(r || (r = n(["URL:en kopieras till Urklipp"], ["URL:en kopieras till Urklipp"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19-spårare"], ["COVID-19-spårare"]))), t.bingCovidTitle = bt.default(s || (s = n(["Coronavirus (COVID-19)-spårare med livekarta från Microsoft Bing"], ["Coronavirus (COVID-19)-spårare med livekarta från Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Regioner"], ["Regioner"]))), t.noRegionalData = bt.default(u || (u = n(["Det finns inga regionala data tillgängliga för det här landet/regionen ännu. Försök igen senare."], ["Det finns inga regionala data tillgängliga för det här landet/regionen ännu. Försök igen senare."]))), t.activeCases = bt.default(c || (c = n(["Aktiva fall"], ["Aktiva fall"]))), t.recoveredCases = bt.default(f || (f = n(["Tillfrisknade"], ["Tillfrisknade"]))), t.fatalCases = bt.default(p || (p = n(["Dödsfall"], ["Dödsfall"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Aktiva"], ["Aktiva"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Tillfrisknade"], ["Tillfrisknade"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Dödsfall"], ["Dödsfall"]))), t.overview = bt.default(g || (g = n(["Översikt"], ["Översikt"]))), t.close = bt.default(b || (b = n(["Stäng"], ["Stäng"]))), t.selectARegion = bt.default(k || (k = n(["Välj en region"], ["Välj en region"]))), t.global = bt.default(y || (y = n(["Globalt"], ["Globalt"]))), t.globalStatus = bt.default(C || (C = n(["Global status"], ["Global status"]))), t.allRegions = bt.default(w || (w = n(["Alla regioner"], ["Alla regioner"]))), t.share = bt.default(x || (x = n(["Dela"], ["Dela"]))), t.dataInfo = bt.default(T || (T = n(["Information om data"], ["Information om data"]))), t.totalConfirmed = bt.default(z || (z = n(["Totalt antal bekräftade fall"], ["Totalt antal bekräftade fall"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Fall totalt"], ["Fall totalt"]))), t.totalAreas = bt.default(I || (I = n(["totalt ", ""], ["totalt ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Dölj information och visa hela kartan"], ["Dölj information och visa hela kartan"]))), t.showInfo = bt.default(D || (D = n(["Visa information"], ["Visa information"]))), t.news = bt.default(M || (M = n(["Nyheter"], ["Nyheter"]))), t.helpfulResources = bt.default(E || (E = n(["Hjälp och information"], ["Hjälp och information"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Visa mer"], ["Visa mer"]))), t.dataFrom = bt.default(O || (O = n(["Data från:"], ["Data från:"]))), t.videos = bt.default(R || (R = n(["Videoklipp"], ["Videoklipp"]))), t.moreNews = bt.default(_ || (_ = n(["Visa fler artiklar"], ["Visa fler artiklar"]))), t.moreVideos = bt.default(N || (N = n(["Visa fler videoklipp"], ["Visa fler videoklipp"]))), t.map = bt.default(V || (V = n(["Karta:"], ["Karta:"]))), t.feedback = bt.default(U || (U = n(["Ge feedback"], ["Ge feedback"]))), t.feedbackQuestion = bt.default(q || (q = n(["Vilken sorts feedback har du om det här verktyget?"], ["Vilken sorts feedback har du om det här verktyget?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Rapportera ett problem"], ["Rapportera ett problem"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Berätta om problemet"], ["Berätta om problemet"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Lämna ett förslag"], ["Lämna ett förslag"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Berätta om ditt förslag"], ["Berätta om ditt förslag"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Ge beröm"], ["Ge beröm"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Berätta vad du gillar"], ["Berätta vad du gillar"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Sekretess eller juridisk fråga"], ["Sekretess eller juridisk fråga"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Berätta om frågan/ärendet"], ["Berätta om frågan/ärendet"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Skriv din feedback här. Ta inte med några personliga uppgifter som adress eller telefonnummer, så att din sekretess kan skyddas."], ["Skriv din feedback här. Ta inte med några personliga uppgifter som adress eller telefonnummer, så att din sekretess kan skyddas."]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Gå tillbaka"], ["Gå tillbaka"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Skicka"], ["Skicka"]))), t.feedbackThanks = bt.default(te || (te = n(["Tack för din feedback!"], ["Tack för din feedback!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Sekretesspolicy"], ["Sekretesspolicy"]))), t.websiteDescription = bt.default(ne || (ne = n(["Följ COVID-19/coronavirusfall lokalt och globalt på kartan med antal aktiva fall, tillfrisknanden och dödsfall, samt nyheter och videoklipp varje dag."], ["Följ COVID-19/coronavirusfall lokalt och globalt på kartan med antal aktiva fall, tillfrisknanden och dödsfall, samt nyheter och videoklipp varje dag."]))), t.graphOverTime = bt.default(ie || (ie = n(["Spridning över tid"], ["Spridning över tid"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " mn"], ["", " mn"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " t"], ["", " t"])), 0), t.upsellDesc = bt.default(le || (le = n(["Följ de senaste uppdateringarna på telefonen med Bing-appen"], ["Följ de senaste uppdateringarna på telefonen med Bing-appen"]))), t.upsellCTA = bt.default(se || (se = n(["Hämta nu"], ["Hämta nu"]))), t.upsellTitle = bt.default(de || (de = n(["Följ nyheter om coronaviruset"], ["Följ nyheter om coronaviruset"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Följ coronaviruset"], ["Följ coronaviruset"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Få de senaste uppdateringarna om coronaviruset på Bing när du lägger till vårt Chrome-tillägg"], ["Få de senaste uppdateringarna om coronaviruset på Bing när du lägger till vårt Chrome-tillägg"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Få de senaste uppdateringarna om coronaviruset på Bing när du lägger till vårt Firefox-tillägg"], ["Få de senaste uppdateringarna om coronaviruset på Bing när du lägger till vårt Firefox-tillägg"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Lägg till tillägget"], ["Lägg till tillägget"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Var försiktig, håll dig uppdaterad"], ["Var försiktig, håll dig uppdaterad"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Följ med tillägget"], ["Följ med tillägget"]))), t.submit = bt.default(he || (he = n(["Klart"], ["Klart"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " år"], ["", " år"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " mån"], ["", " mån"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " v"], ["", " v"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " d"], ["", " d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " tim"], ["", " tim"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " min"], ["", " min"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Din plats"], ["Din plats"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Filtrera till en plats"], ["Filtrera till en plats"]))), t.expand = bt.default(ze || (ze = n(["Utöka"], ["Utöka"]))), t.trends = bt.default(Se || (Se = n(["Trender"], ["Trender"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Information om testning"], ["Information om testning"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Riktlinjer och kontaktuppgifter"], ["Riktlinjer och kontaktuppgifter"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Riktlinjer"], ["Riktlinjer"]))), t.hotline = bt.default(Me || (Me = n(["Kontakttelefon"], ["Kontakttelefon"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Partnerföretag"], ["Partnerföretag"]))), t.moreTestingLocations = bt.default(je || (je = n(["Visa testplatser (", ")"], ["Visa testplatser (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Visa mindre"], ["Visa mindre"]))), t.topTrends = bt.default(Be || (Be = n(["Jämförelse, totalt antal fall"], ["Jämförelse, totalt antal fall"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Aktuella uppdateringar om coronaviruset"], ["Aktuella uppdateringar om coronaviruset"]))), t.copyLink = bt.default(Le || (Le = n(["Kopiera länk"], ["Kopiera länk"]))), t.email = bt.default(Oe || (Oe = n(["E-post"], ["E-post"]))), t.cancel = bt.default(Re || (Re = n(["Avbryt"], ["Avbryt"]))), t.confirmed = bt.default(_e || (_e = n(["Bekräftade"], ["Bekräftade"]))), t.fatal = bt.default(Ne || (Ne = n(["Dödsfall"], ["Dödsfall"]))), t.recovered = bt.default(Ve || (Ve = n(["Tillfrisknade"], ["Tillfrisknade"]))), t.active = bt.default(Ue || (Ue = n(["Aktiva"], ["Aktiva"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Om du vill se din plats aktiverar du platsbehörighet här."], ["Om du vill se din plats aktiverar du platsbehörighet här."]))), t.overviewVertical = bt.default(He || (He = n(["Översikt"], ["Översikt"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Nyheter och videoklipp"], ["Nyheter och videoklipp"]))), t.graphstrends = bt.default(We || (We = n(["Diagram"], ["Diagram"]))), t.localResources = bt.default(Ke || (Ke = n(["Lokala resurser"], ["Lokala resurser"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Uppdaterades för ", " min sedan"], ["Uppdaterades för ", " min sedan"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Genom att skicka ditt telefonnummer eller din e-postadress samtycker du till att få ett automatiserat engångsmeddelande från Microsoft till det mobiltelefonnumret eller den e-postadressen. Standardpriser för SMS gäller."], ["Genom att skicka ditt telefonnummer eller din e-postadress samtycker du till att få ett automatiserat engångsmeddelande från Microsoft till det mobiltelefonnumret eller den e-postadressen. Standardpriser för SMS gäller."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsofts sekretesspolicy"], ["Microsofts sekretesspolicy"]))), t.sendLink = bt.default(nt || (nt = n(["Skicka länk"], ["Skicka länk"]))), t.compare = bt.default(it || (it = n(["Jämför"], ["Jämför"]))), t.browse = bt.default(rt || (rt = n(["Bläddra"], ["Bläddra"]))), t.favorites = bt.default(ot || (ot = n(["Favoriter"], ["Favoriter"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Ange ett giltigt telefonnummer i USA."], ["Ange ett giltigt telefonnummer i USA."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Tack. Prova länken som har skickats till din telefon inom en timme."], ["Tack. Prova länken som har skickats till din telefon inom en timme."]))), t.opalSMSError = bt.default(dt || (dt = n(["Ett fel påträffades. Hämta appen för Bing-sökning i appbutiken."], ["Ett fel påträffades. Hämta appen för Bing-sökning i appbutiken."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Mer om ", ""], ["Mer om ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Mindre om ", ""], ["Mindre om ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Populära ämnen"], ["Populära ämnen"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logaritmisk skala"], ["Logaritmisk skala"]))), t.linearScale = bt.default(vt || (vt = n(["Linjär skala"], ["Linjär skala"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Hej! Jag är hjälproboten för vanliga frågor om COVID-19, och mitt jobb är att hjälpa dig få svar på dina frågor!"], ["Hej! Jag är hjälproboten för vanliga frågor om COVID-19, och mitt jobb är att hjälpa dig få svar på dina frågor!"]))), t.dataTitle = bt.default(gt || (gt = n(["Data"], ["Data"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.te-in.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["డేటా చివరిగా అప్‌డేట్ అయినది:"], ["డేటా చివరిగా అప్‌డేట్ అయినది:"]))), t.urlCopied = bt.default(r || (r = n(["క్లిప్‌బోర్డ్‌కు Url కాపీ చేయబడింది"], ["క్లిప్‌బోర్డ్‌కు Url కాపీ చేయబడింది"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19 (కరోనా వైరస్ వ్యాధి) ట్రాకర్"], ["COVID-19 (కరోనా వైరస్ వ్యాధి) ట్రాకర్"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing నుండి అందించబడుతున్న కరోనా వైరస్ (COVID-19) లైవ్ మ్యాప్ ట్రాకర్"], ["Microsoft Bing నుండి అందించబడుతున్న కరోనా వైరస్ (COVID-19) లైవ్ మ్యాప్ ట్రాకర్"]))), t.citiesAndProvinces = bt.default(d || (d = n(["ప్రాంతాలు"], ["ప్రాంతాలు"]))), t.noRegionalData = bt.default(u || (u = n(["ఈ దేశం/ప్రాంతానికి సంబంధించిన స్థానిక డేటా ఇంకా అందుబాటులో లేదు. తర్వాత మళ్లీ ప్రయత్నించండి."], ["ఈ దేశం/ప్రాంతానికి సంబంధించిన స్థానిక డేటా ఇంకా అందుబాటులో లేదు. తర్వాత మళ్లీ ప్రయత్నించండి."]))), t.activeCases = bt.default(c || (c = n(["యాక్టివ్‌గా ఉన్న కేస్‌లు"], ["యాక్టివ్‌గా ఉన్న కేస్‌లు"]))), t.recoveredCases = bt.default(f || (f = n(["నయమైన కేస్‌లు"], ["నయమైన కేస్‌లు"]))), t.fatalCases = bt.default(p || (p = n(["ప్రాణాలు బలి తీసుకుంటున్న కేస్‌లు"], ["ప్రాణాలు బలి తీసుకుంటున్న కేస్‌లు"]))), t.activeCasesForCallout = bt.default(m || (m = n(["యాక్టివ్"], ["యాక్టివ్"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["నయమైనవి"], ["నయమైనవి"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["ప్రాణాంతకంగా ఉన్నవి"], ["ప్రాణాంతకంగా ఉన్నవి"]))), t.overview = bt.default(g || (g = n(["సంక్షిప్త వీక్షణ"], ["సంక్షిప్త వీక్షణ"]))), t.close = bt.default(b || (b = n(["మూసివేయి"], ["మూసివేయి"]))), t.selectARegion = bt.default(k || (k = n(["ప్రాంతాన్ని ఎంచుకోంటి"], ["ప్రాంతాన్ని ఎంచుకోంటి"]))), t.global = bt.default(y || (y = n(["గ్లోబల్"], ["గ్లోబల్"]))), t.globalStatus = bt.default(C || (C = n(["గ్లోబల్ స్టేటస్"], ["గ్లోబల్ స్టేటస్"]))), t.allRegions = bt.default(w || (w = n(["అన్ని ప్రాంతాలు"], ["అన్ని ప్రాంతాలు"]))), t.share = bt.default(x || (x = n(["భాగస్వామ్యం చేయండి"], ["భాగస్వామ్యం చేయండి"]))), t.dataInfo = bt.default(T || (T = n(["డేటా సమాచారం"], ["డేటా సమాచారం"]))), t.totalConfirmed = bt.default(z || (z = n(["మొత్తం నిర్ధారిత కేస్‌లు"], ["మొత్తం నిర్ధారిత కేస్‌లు"]))), t.totalConfirmedShort = bt.default(S || (S = n(["మొత్తం కేస్‌లు"], ["మొత్తం కేస్‌లు"]))), t.totalAreas = bt.default(I || (I = n(["మొత్తం ", ""], ["మొత్తం ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["పూర్తి మ్యాప్‌ను చూడటానికి సమాచారం దాచండి"], ["పూర్తి మ్యాప్‌ను చూడటానికి సమాచారం దాచండి"]))), t.showInfo = bt.default(D || (D = n(["సమాచారాన్ని చూపండి"], ["సమాచారాన్ని చూపండి"]))), t.news = bt.default(M || (M = n(["వార్తలు"], ["వార్తలు"]))), t.helpfulResources = bt.default(E || (E = n(["సహాయం మరియు సమాచారం"], ["సహాయం మరియు సమాచారం"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["మరిన్ని చూడండి"], ["మరిన్ని చూడండి"]))), t.dataFrom = bt.default(O || (O = n(["డేటా ప్రదాత:"], ["డేటా ప్రదాత:"]))), t.videos = bt.default(R || (R = n(["వీడియోలు"], ["వీడియోలు"]))), t.moreNews = bt.default(_ || (_ = n(["మరిన్ని కథనాలను చూడండి"], ["మరిన్ని కథనాలను చూడండి"]))), t.moreVideos = bt.default(N || (N = n(["మరిన్ని వీడియోలను చూడండి"], ["మరిన్ని వీడియోలను చూడండి"]))), t.map = bt.default(V || (V = n(["మ్యాప్:"], ["మ్యాప్:"]))), t.feedback = bt.default(U || (U = n(["అభిప్రాయం అందించండి"], ["అభిప్రాయం అందించండి"]))), t.feedbackQuestion = bt.default(q || (q = n(["ఈ టూల్ పట్ల మీ అభిప్రాయం ఏమిటి?"], ["ఈ టూల్ పట్ల మీ అభిప్రాయం ఏమిటి?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["సమస్యను రిపోర్ట్ చేయండి"], ["సమస్యను రిపోర్ట్ చేయండి"]))), t.feedbackTellIssue = bt.default(G || (G = n(["సమస్య గురించి మాకు చెప్పండి"], ["సమస్య గురించి మాకు చెప్పండి"]))), t.feedbackShareIdea = bt.default(W || (W = n(["ఆలోచనను పంచుకోండి"], ["ఆలోచనను పంచుకోండి"]))), t.feedbackTellIdea = bt.default(K || (K = n(["మీ ఆలోచనను మాతో పంచుకోండి"], ["మీ ఆలోచనను మాతో పంచుకోండి"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["అభినందన తెలపండి"], ["అభినందన తెలపండి"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["మీకు ఏమి నచ్చాయో తెలియజేయండి"], ["మీకు ఏమి నచ్చాయో తెలియజేయండి"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["చట్టసంబంధిత లేదా గోప్యతాపరమైన సమస్య"], ["చట్టసంబంధిత లేదా గోప్యతాపరమైన సమస్య"]))), t.feedbackTellConcern = bt.default(J || (J = n(["మీ సమస్య గురించి మాకు చెప్పండి"], ["మీ సమస్య గురించి మాకు చెప్పండి"]))), t.feedbackTextEntry = bt.default(X || (X = n(["ఇక్కడ అభిప్రాయాలను అందించండి. మీ గోప్యతను కాపాడుకోవడానికి, మీ చిరునామా లేదా ఫోన్ నంబర్ లాంటి వ్యక్తిగత సమాచారాన్ని చెప్పకండి"], ["ఇక్కడ అభిప్రాయాలను అందించండి. మీ గోప్యతను కాపాడుకోవడానికి, మీ చిరునామా లేదా ఫోన్ నంబర్ లాంటి వ్యక్తిగత సమాచారాన్ని చెప్పకండి"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["వెనుకకు వెళ్లు"], ["వెనుకకు వెళ్లు"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["పంపు"], ["పంపు"]))), t.feedbackThanks = bt.default(te || (te = n(["మీ అభిప్రాయానికి ధన్యవాదాలు!"], ["మీ అభిప్రాయానికి ధన్యవాదాలు!"]))), t.privacyStatement = bt.default(ae || (ae = n(["గోప్యతా ప్రకటన"], ["గోప్యతా ప్రకటన"]))), t.websiteDescription = bt.default(ne || (ne = n(["స్థానికంగా మరియు ప్రపంచవ్యాప్తంగా COVID-19 కరోనా వైరస్ కేసుల నమోదులు, వాటిలో నయమైన, మరణాలు సంభావించిన సగటులు పట్టికలో చూడండి. వీటికి సంబంధించిన రోజువారీ తాజా వార్తలు, వీడియోలు పొందండి."], ["స్థానికంగా మరియు ప్రపంచవ్యాప్తంగా COVID-19 కరోనా వైరస్ కేసుల నమోదులు, వాటిలో నయమైన, మరణాలు సంభావించిన సగటులు పట్టికలో చూడండి. వీటికి సంబంధించిన రోజువారీ తాజా వార్తలు, వీడియోలు పొందండి."]))), t.graphOverTime = bt.default(ie || (ie = n(["సమయ పరిధిలో వ్యాప్తి"], ["సమయ పరిధిలో వ్యాప్తి"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "M"], ["", "M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = bt.default(le || (le = n(["Bing యాప్ సహాయంతో మీ ఫోన్‌లో తాజా వార్తలు తెలుసుకోండి"], ["Bing యాప్ సహాయంతో మీ ఫోన్‌లో తాజా వార్తలు తెలుసుకోండి"]))), t.upsellCTA = bt.default(se || (se = n(["ఇప్పుడే డౌన్‌లోడ్ చేయి"], ["ఇప్పుడే డౌన్‌లోడ్ చేయి"]))), t.upsellTitle = bt.default(de || (de = n(["కరోనా వైరస్ తాజా వార్తలు ఎప్పటికప్పుడు తెలుసుకోండి"], ["కరోనా వైరస్ తాజా వార్తలు ఎప్పటికప్పుడు తెలుసుకోండి"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["కరోనా వైరస్ వార్తలు తెలుసుకోండి"], ["కరోనా వైరస్ వార్తలు తెలుసుకోండి"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["మా Chrome ఎక్స్‌టెన్షన్‌ను జోడించడం ద్వారా Bingలో తాజా కరోనా వైరస్ అప్‌డేట్‌లను పొందండి"], ["మా Chrome ఎక్స్‌టెన్షన్‌ను జోడించడం ద్వారా Bingలో తాజా కరోనా వైరస్ అప్‌డేట్‌లను పొందండి"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["మా Firefox ఎక్స్‌టెన్షన్‌ను జోడించడం ద్వారా Bingలో తాజా కరోనా వైరస్ అప్‌డేట్‌లను పొందండి"], ["మా Firefox ఎక్స్‌టెన్షన్‌ను జోడించడం ద్వారా Bingలో తాజా కరోనా వైరస్ అప్‌డేట్‌లను పొందండి"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["ఎక్స్‌టెన్షన్‌ను జోడించండి"], ["ఎక్స్‌టెన్షన్‌ను జోడించండి"]))), t.dseUpsellTitle = bt.default(me || (me = n(["సురక్షితంగా ఉండండి, తాజా వార్తలు తెలుసుకోండి"], ["సురక్షితంగా ఉండండి, తాజా వార్తలు తెలుసుకోండి"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["ఎక్స్‌టెన్షన్‌తో ట్రాక్ చేయండి"], ["ఎక్స్‌టెన్షన్‌తో ట్రాక్ చేయండి"]))), t.submit = bt.default(he || (he = n(["పూర్తయింది"], ["పూర్తయింది"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "y"], ["", "y"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "M"], ["", "M"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "w"], ["", "w"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "h"], ["", "h"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = bt.default(xe || (xe = n(["మీ లొకేషన్"], ["మీ లొకేషన్"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["లొకేషన్‌కు ఫిల్టర్ చేయండి"], ["లొకేషన్‌కు ఫిల్టర్ చేయండి"]))), t.expand = bt.default(ze || (ze = n(["విస్తరింపజేయి"], ["విస్తరింపజేయి"]))), t.trends = bt.default(Se || (Se = n(["ట్రెండ్‌లు"], ["ట్రెండ్‌లు"]))), t.testingProcess = bt.default(Ie || (Ie = n(["టెస్టింగ్ సమాచారం"], ["టెస్టింగ్ సమాచారం"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["ప్రోటోకాల్ మరియు కాంటాక్ట్"], ["ప్రోటోకాల్ మరియు కాంటాక్ట్"]))), t.testingProcessProtocol = bt.default(De || (De = n(["ప్రోటోకాల్"], ["ప్రోటోకాల్"]))), t.hotline = bt.default(Me || (Me = n(["హాట్‌లైన్"], ["హాట్‌లైన్"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["భాగస్వామి కంపెనీలు"], ["భాగస్వామి కంపెనీలు"]))), t.moreTestingLocations = bt.default(je || (je = n(["టెస్టింగ్ లొకేషన్‌లు చూడండి (", ")"], ["టెస్టింగ్ లొకేషన్‌లు చూడండి (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["తక్కువ చూడండి"], ["తక్కువ చూడండి"]))), t.topTrends = bt.default(Be || (Be = n(["మొత్తం కేస్‌ల వారీగా సరిపోలిక"], ["మొత్తం కేస్‌ల వారీగా సరిపోలిక"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["తాజా కరోనా వైరస్ అప్‌డేట్‌లు"], ["తాజా కరోనా వైరస్ అప్‌డేట్‌లు"]))), t.copyLink = bt.default(Le || (Le = n(["లింక్‌ను కాపీ చేయి"], ["లింక్‌ను కాపీ చేయి"]))), t.email = bt.default(Oe || (Oe = n(["ఇమెయిల్"], ["ఇమెయిల్"]))), t.cancel = bt.default(Re || (Re = n(["రద్దు చేయి"], ["రద్దు చేయి"]))), t.confirmed = bt.default(_e || (_e = n(["నిర్ధారించినవి"], ["నిర్ధారించినవి"]))), t.fatal = bt.default(Ne || (Ne = n(["ప్రాణాంతకంగా ఉన్నవి"], ["ప్రాణాంతకంగా ఉన్నవి"]))), t.recovered = bt.default(Ve || (Ve = n(["నయమైనవి"], ["నయమైనవి"]))), t.active = bt.default(Ue || (Ue = n(["యాక్టివ్"], ["యాక్టివ్"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["మీ లొకేషన్‌ను చూసేందుకు, ఇక్కడ లొకేషన్ అనుమతులు ఎనేబుల్ చేయండి."], ["మీ లొకేషన్‌ను చూసేందుకు, ఇక్కడ లొకేషన్ అనుమతులు ఎనేబుల్ చేయండి."]))), t.overviewVertical = bt.default(He || (He = n(["సంక్షిప్త వీక్షణ"], ["సంక్షిప్త వీక్షణ"]))), t.newsvideos = bt.default(Ge || (Ge = n(["వార్తలు మరియు వీడియోలు"], ["వార్తలు మరియు వీడియోలు"]))), t.graphstrends = bt.default(We || (We = n(["గ్రాఫ్‌లు"], ["గ్రాఫ్‌లు"]))), t.localResources = bt.default(Ke || (Ke = n(["స్థానిక వనరులు"], ["స్థానిక వనరులు"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " నిమిషాల క్రితం అప్‌డేట్ అయింది"], ["", " నిమిషాల క్రితం అప్‌డేట్ అయింది"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["మీ ఫోన్ నంబర్ లేదా ఇమెయిల్ పంపడం ద్వారా, ఈ మొబైల్ ఫోన్ నంబర్ లేదా ఇమెయిల్‌లో Microsoft నుండి వన్-టైమ్ ఆటోమేటిక్ సందేశం అందుకోవడానికి అంగీకరిస్తున్నారు. ప్రామాణిక SMS ధరలు విధించవచ్చు."], ["మీ ఫోన్ నంబర్ లేదా ఇమెయిల్ పంపడం ద్వారా, ఈ మొబైల్ ఫోన్ నంబర్ లేదా ఇమెయిల్‌లో Microsoft నుండి వన్-టైమ్ ఆటోమేటిక్ సందేశం అందుకోవడానికి అంగీకరిస్తున్నారు. ప్రామాణిక SMS ధరలు విధించవచ్చు."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft గోప్యతా ప్రకటన"], ["Microsoft గోప్యతా ప్రకటన"]))), t.sendLink = bt.default(nt || (nt = n(["లింక్‌ను పంపు"], ["లింక్‌ను పంపు"]))), t.compare = bt.default(it || (it = n(["సరిపోల్చండి"], ["సరిపోల్చండి"]))), t.browse = bt.default(rt || (rt = n(["బ్రౌజ్ చేయండి"], ["బ్రౌజ్ చేయండి"]))), t.favorites = bt.default(ot || (ot = n(["ఇష్టమైనవి"], ["ఇష్టమైనవి"]))), t.validNumberRequired = bt.default(lt || (lt = n(["దయచేసి చెల్లుబాటు అయ్యే యు.ఎస్. ఫోన్ నంబర్‌ను నమోదు చేయండి."], ["దయచేసి చెల్లుబాటు అయ్యే యు.ఎస్. ఫోన్ నంబర్‌ను నమోదు చేయండి."]))), t.opalSMSAccepted = bt.default(st || (st = n(["ధన్యవాదాలు. దయచేసి ఒక గంటలోపు మీ ఫోన్‌కు పంపిన లింక్‌ను ప్రయత్నించండి."], ["ధన్యవాదాలు. దయచేసి ఒక గంటలోపు మీ ఫోన్‌కు పంపిన లింక్‌ను ప్రయత్నించండి."]))), t.opalSMSError = bt.default(dt || (dt = n(["ఎర్రర్ ఏర్పడింది, దయచేసి యాప్ స్టోర్ నుండి Bing శోధన యాప్‌ను డౌన్‌లోడ్ చేసుకోండి."], ["ఎర్రర్ ఏర్పడింది, దయచేసి యాప్ స్టోర్ నుండి Bing శోధన యాప్‌ను డౌన్‌లోడ్ చేసుకోండి."]))), t.moreOnTopic = bt.default(ut || (ut = n(["", " గురించి మరిన్ని"], ["", " గురించి మరిన్ని"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["", " గురించి తక్కువ"], ["", " గురించి తక్కువ"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["ట్రెండింగ్ విషయాలు"], ["ట్రెండింగ్ విషయాలు"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["లాగ్ స్కేల్"], ["లాగ్ స్కేల్"]))), t.linearScale = bt.default(vt || (vt = n(["రేఖీయ స్కేల్"], ["రేఖీయ స్కేల్"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["నమస్తే! నేను COVID-19 ఎఫ్ ఎ క్యు సహాయక బాట్‌ను, మీ ప్రశ్నలకు నేను సమాధానం ఇస్తాను!"], ["నమస్తే! నేను COVID-19 ఎఫ్ ఎ క్యు సహాయక బాట్‌ను, మీ ప్రశ్నలకు నేను సమాధానం ఇస్తాను!"]))), t.dataTitle = bt.default(gt || (gt = n(["డేటా"], ["డేటా"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.th-th.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["อัปเดตข้อมูลล่าสุด:"], ["อัปเดตข้อมูลล่าสุด:"]))), t.urlCopied = bt.default(r || (r = n(["คัดลอก URL ไปยังคลิปบอร์ดแล้ว"], ["คัดลอก URL ไปยังคลิปบอร์ดแล้ว"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["ตัวติดตามข้อมูลโควิด-19"], ["ตัวติดตามข้อมูลโควิด-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["ตัวติดตามข้อมูลไวรัสโคโรนา (โควิด-19) แบบแผนที่ข้อมูลสดจาก Microsoft"], ["ตัวติดตามข้อมูลไวรัสโคโรนา (โควิด-19) แบบแผนที่ข้อมูลสดจาก Microsoft"]))), t.citiesAndProvinces = bt.default(d || (d = n(["ภูมิภาค"], ["ภูมิภาค"]))), t.noRegionalData = bt.default(u || (u = n(["ยังไม่มีข้อมูลประจำภูมิภาคสำหรับประเทศ/ภูมิภาคนี้ โปรดลองอีกครั้งในภายหลัง"], ["ยังไม่มีข้อมูลประจำภูมิภาคสำหรับประเทศ/ภูมิภาคนี้ โปรดลองอีกครั้งในภายหลัง"]))), t.activeCases = bt.default(c || (c = n(["ผู้ป่วย"], ["ผู้ป่วย"]))), t.recoveredCases = bt.default(f || (f = n(["ผู้ที่รักษาหายแล้ว"], ["ผู้ที่รักษาหายแล้ว"]))), t.fatalCases = bt.default(p || (p = n(["ผู้เสียชีวิต"], ["ผู้เสียชีวิต"]))), t.activeCasesForCallout = bt.default(m || (m = n(["ป่วย"], ["ป่วย"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["รักษาหายแล้ว"], ["รักษาหายแล้ว"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["เสียชีวิต"], ["เสียชีวิต"]))), t.overview = bt.default(g || (g = n(["ภาพรวม"], ["ภาพรวม"]))), t.close = bt.default(b || (b = n(["ปิด"], ["ปิด"]))), t.selectARegion = bt.default(k || (k = n(["เลือกภูมิภาค"], ["เลือกภูมิภาค"]))), t.global = bt.default(y || (y = n(["ทั่วโลก"], ["ทั่วโลก"]))), t.globalStatus = bt.default(C || (C = n(["สถานะทั่วโลก"], ["สถานะทั่วโลก"]))), t.allRegions = bt.default(w || (w = n(["ทุกภูมิภาค"], ["ทุกภูมิภาค"]))), t.share = bt.default(x || (x = n(["แชร์"], ["แชร์"]))), t.dataInfo = bt.default(T || (T = n(["สารสนเทศข้อมูล"], ["สารสนเทศข้อมูล"]))), t.totalConfirmed = bt.default(z || (z = n(["จำนวนรวมของผู้ป่วยยืนยัน"], ["จำนวนรวมของผู้ป่วยยืนยัน"]))), t.totalConfirmedShort = bt.default(S || (S = n(["ผู้ป่วยทั้งหมด"], ["ผู้ป่วยทั้งหมด"]))), t.totalAreas = bt.default(I || (I = n(["รวม ", " รายการ"], ["รวม ", " รายการ"])), 0), t.hideInfo = bt.default(A || (A = n(["ซ่อนข้อมูลเพื่อดูแผนที่ทั้งหมด"], ["ซ่อนข้อมูลเพื่อดูแผนที่ทั้งหมด"]))), t.showInfo = bt.default(D || (D = n(["แสดงข้อมูล"], ["แสดงข้อมูล"]))), t.news = bt.default(M || (M = n(["ข่าว"], ["ข่าว"]))), t.helpfulResources = bt.default(E || (E = n(["ความช่วยเหลือและข้อมูล"], ["ความช่วยเหลือและข้อมูล"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["ดูเพิ่มเติม"], ["ดูเพิ่มเติม"]))), t.dataFrom = bt.default(O || (O = n(["ข้อมูลจาก:"], ["ข้อมูลจาก:"]))), t.videos = bt.default(R || (R = n(["วิดีโอ"], ["วิดีโอ"]))), t.moreNews = bt.default(_ || (_ = n(["ดูบทความเพิ่มเติม"], ["ดูบทความเพิ่มเติม"]))), t.moreVideos = bt.default(N || (N = n(["ดูวิดีโอเพิ่มเติม"], ["ดูวิดีโอเพิ่มเติม"]))), t.map = bt.default(V || (V = n(["แผนที่:"], ["แผนที่:"]))), t.feedback = bt.default(U || (U = n(["ให้คำติชม"], ["ให้คำติชม"]))), t.feedbackQuestion = bt.default(q || (q = n(["คุณต้องการให้คำติชมในด้านใดเกี่ยวกับเครื่องมือนี้"], ["คุณต้องการให้คำติชมในด้านใดเกี่ยวกับเครื่องมือนี้"]))), t.feedbackReportIssue = bt.default(H || (H = n(["รายงานปัญหา"], ["รายงานปัญหา"]))), t.feedbackTellIssue = bt.default(G || (G = n(["แจ้งปัญหาให้เราทราบ"], ["แจ้งปัญหาให้เราทราบ"]))), t.feedbackShareIdea = bt.default(W || (W = n(["แชร์ความคิด"], ["แชร์ความคิด"]))), t.feedbackTellIdea = bt.default(K || (K = n(["แจ้งความคิดของคุณให้เราทราบ"], ["แจ้งความคิดของคุณให้เราทราบ"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["ให้คำชมเชย"], ["ให้คำชมเชย"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["แจ้งสิ่งที่คุณชอบให้เราทราบ"], ["แจ้งสิ่งที่คุณชอบให้เราทราบ"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["ผู้ป่วยยืนยันรวม"], ["ผู้ป่วยยืนยันรวม"]))), t.feedbackTellConcern = bt.default(J || (J = n(["แจ้งข้อกังวลของคุณให้เราทราบ"], ["แจ้งข้อกังวลของคุณให้เราทราบ"]))), t.feedbackTextEntry = bt.default(X || (X = n(["ป้อนคำติชมที่นี่ โปรดอย่าระบุข้อมูลส่วนบุคคล เช่น ที่อยู่หรือหมายเลขโทรศัพท์ ทั้งนี้เพื่อเป็นการช่วยปกป้องความเป็นส่วนตัวของคุณ"], ["ป้อนคำติชมที่นี่ โปรดอย่าระบุข้อมูลส่วนบุคคล เช่น ที่อยู่หรือหมายเลขโทรศัพท์ ทั้งนี้เพื่อเป็นการช่วยปกป้องความเป็นส่วนตัวของคุณ"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["ย้อนกลับ"], ["ย้อนกลับ"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["ส่ง"], ["ส่ง"]))), t.feedbackThanks = bt.default(te || (te = n(["ขอขอบคุณสำหรับคำติชมของคุณ!"], ["ขอขอบคุณสำหรับคำติชมของคุณ!"]))), t.privacyStatement = bt.default(ae || (ae = n(["คำชี้แจงสิทธิ์ส่วนบุคคล"], ["คำชี้แจงสิทธิ์ส่วนบุคคล"]))), t.websiteDescription = bt.default(ne || (ne = n(["ติดตามข้อมูลอัตราผู้ป่วยโควิด-19 ผู้ที่รักษาหายแล้ว และผู้เสียชีวิตทั้งในระดับท้องถิ่นและทั่วโลกได้บนแผนที่ พร้อมด้วยข่าวและวิดีโอรายวัน"], ["ติดตามข้อมูลอัตราผู้ป่วยโควิด-19 ผู้ที่รักษาหายแล้ว และผู้เสียชีวิตทั้งในระดับท้องถิ่นและทั่วโลกได้บนแผนที่ พร้อมด้วยข่าวและวิดีโอรายวัน"]))), t.graphOverTime = bt.default(ie || (ie = n(["การแพร่กระจายของโรค"], ["การแพร่กระจายของโรค"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " ล้าน"], ["", " ล้าน"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " พัน"], ["", " พัน"])), 0), t.upsellDesc = bt.default(le || (le = n(["ติดตามข้อมูลล่าสุดทางโทรศัพท์ด้วยแอป Bing"], ["ติดตามข้อมูลล่าสุดทางโทรศัพท์ด้วยแอป Bing"]))), t.upsellCTA = bt.default(se || (se = n(["ดาวน์โหลดตอนนี้"], ["ดาวน์โหลดตอนนี้"]))), t.upsellTitle = bt.default(de || (de = n(["ติดตามข่าวไวรัสโคโรนา"], ["ติดตามข่าวไวรัสโคโรนา"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["ติดตามข้อมูลไวรัสโคโรนา"], ["ติดตามข้อมูลไวรัสโคโรนา"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["รับข้อมูลล่าสุดเกี่ยวกับไวรัสโคโรนาบน Bing เมื่อคุณเพิ่มส่วนขยาย Chrome ของเรา"], ["รับข้อมูลล่าสุดเกี่ยวกับไวรัสโคโรนาบน Bing เมื่อคุณเพิ่มส่วนขยาย Chrome ของเรา"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["รับข้อมูลล่าสุดเกี่ยวกับไวรัสโคโรนาบน Bing เมื่อคุณเพิ่มส่วนขยาย Firefox ของเรา"], ["รับข้อมูลล่าสุดเกี่ยวกับไวรัสโคโรนาบน Bing เมื่อคุณเพิ่มส่วนขยาย Firefox ของเรา"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["เพิ่มส่วนขยาย"], ["เพิ่มส่วนขยาย"]))), t.dseUpsellTitle = bt.default(me || (me = n(["ปลอดภัยและรับข้อมูลล่าสุดเสมอ"], ["ปลอดภัยและรับข้อมูลล่าสุดเสมอ"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["ติดตามข้อมูลด้วยส่วนขยาย"], ["ติดตามข้อมูลด้วยส่วนขยาย"]))), t.submit = bt.default(he || (he = n(["เสร็จสิ้น"], ["เสร็จสิ้น"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " ปี"], ["", " ปี"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " เดือน"], ["", " เดือน"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " สัปดาห์"], ["", " สัปดาห์"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " วัน"], ["", " วัน"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " ชั่วโมง"], ["", " ชั่วโมง"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " นาที"], ["", " นาที"])), 0), t.yourLocation = bt.default(xe || (xe = n(["ตำแหน่งที่ตั้งของคุณ"], ["ตำแหน่งที่ตั้งของคุณ"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["กรองเพื่อเลือกตำแหน่งที่ตั้ง"], ["กรองเพื่อเลือกตำแหน่งที่ตั้ง"]))), t.expand = bt.default(ze || (ze = n(["ขยาย"], ["ขยาย"]))), t.trends = bt.default(Se || (Se = n(["แนวโน้ม"], ["แนวโน้ม"]))), t.testingProcess = bt.default(Ie || (Ie = n(["ข้อมูลการตรวจเชื้อ"], ["ข้อมูลการตรวจเชื้อ"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["การติดต่อสื่อสารและวิธีการติดต่อ"], ["การติดต่อสื่อสารและวิธีการติดต่อ"]))), t.testingProcessProtocol = bt.default(De || (De = n(["โพรโทคอล"], ["โพรโทคอล"]))), t.hotline = bt.default(Me || (Me = n(["สายด่วน"], ["สายด่วน"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["บริษัทพันธมิตร"], ["บริษัทพันธมิตร"]))), t.moreTestingLocations = bt.default(je || (je = n(["ดูสถานที่ตรวจเชื้อ (", ")"], ["ดูสถานที่ตรวจเชื้อ (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["ดูน้อยลง"], ["ดูน้อยลง"]))), t.topTrends = bt.default(Be || (Be = n(["ข้อมูลเปรียบเทียบตามจำนวนผู้ป่วยรวม"], ["ข้อมูลเปรียบเทียบตามจำนวนผู้ป่วยรวม"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["ข้อมูลล่าสุดเกี่ยวกับไวรัสโคโรนา"], ["ข้อมูลล่าสุดเกี่ยวกับไวรัสโคโรนา"]))), t.copyLink = bt.default(Le || (Le = n(["คัดลอกลิงก์"], ["คัดลอกลิงก์"]))), t.email = bt.default(Oe || (Oe = n(["ส่งอีเมล"], ["ส่งอีเมล"]))), t.cancel = bt.default(Re || (Re = n(["ยกเลิก"], ["ยกเลิก"]))), t.confirmed = bt.default(_e || (_e = n(["ยืนยัน"], ["ยืนยัน"]))), t.fatal = bt.default(Ne || (Ne = n(["เสียชีวิต"], ["เสียชีวิต"]))), t.recovered = bt.default(Ve || (Ve = n(["รักษาหายแล้ว"], ["รักษาหายแล้ว"]))), t.active = bt.default(Ue || (Ue = n(["ป่วย"], ["ป่วย"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["หากต้องการดูตำแหน่งที่ตั้งของคุณ ให้เปิดใช้งานสิทธิ์การเข้าถึงตำแหน่งที่ตั้งที่นี่"], ["หากต้องการดูตำแหน่งที่ตั้งของคุณ ให้เปิดใช้งานสิทธิ์การเข้าถึงตำแหน่งที่ตั้งที่นี่"]))), t.overviewVertical = bt.default(He || (He = n(["ภาพรวม"], ["ภาพรวม"]))), t.newsvideos = bt.default(Ge || (Ge = n(["ข่าวและวิดีโอ"], ["ข่าวและวิดีโอ"]))), t.graphstrends = bt.default(We || (We = n(["กราฟ"], ["กราฟ"]))), t.localResources = bt.default(Ke || (Ke = n(["แหล่งข้อมูลท้องถิ่น"], ["แหล่งข้อมูลท้องถิ่น"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["อัปเดตเมื่อ ", " นาทีที่ผ่านมา"], ["อัปเดตเมื่อ ", " นาทีที่ผ่านมา"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["เมื่อส่งหมายเลขโทรศัพท์หรืออีเมลของคุณ ถือว่าคุณตกลงที่จะรับข้อความอัตโนมัติแบบครั้งเดียวซึ่งจะส่งจาก Microsoft มายังหมายเลขโทรศัพท์มือถือหรืออีเมลนี้ โดยจะมีการคิดค่าส่ง SMS ตามอัตรามาตรฐาน"], ["เมื่อส่งหมายเลขโทรศัพท์หรืออีเมลของคุณ ถือว่าคุณตกลงที่จะรับข้อความอัตโนมัติแบบครั้งเดียวซึ่งจะส่งจาก Microsoft มายังหมายเลขโทรศัพท์มือถือหรืออีเมลนี้ โดยจะมีการคิดค่าส่ง SMS ตามอัตรามาตรฐาน"]))), t.msPrivacyTitle = bt.default(at || (at = n(["คำชี้แจงสิทธิ์ส่วนบุคคลของ Microsoft"], ["คำชี้แจงสิทธิ์ส่วนบุคคลของ Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["ส่งลิงก์"], ["ส่งลิงก์"]))), t.compare = bt.default(it || (it = n(["เปรียบเทียบ"], ["เปรียบเทียบ"]))), t.browse = bt.default(rt || (rt = n(["เรียกดู"], ["เรียกดู"]))), t.favorites = bt.default(ot || (ot = n(["เว็บไซต์ที่ชอบ"], ["เว็บไซต์ที่ชอบ"]))), t.validNumberRequired = bt.default(lt || (lt = n(["โปรดป้อนหมายเลขโทรศัพท์ในสหรัฐอเมริกาที่ถูกต้อง"], ["โปรดป้อนหมายเลขโทรศัพท์ในสหรัฐอเมริกาที่ถูกต้อง"]))), t.opalSMSAccepted = bt.default(st || (st = n(["ขอขอบคุณ โปรดลองใช้ลิงก์ที่ส่งไปยังโทรศัพท์ของคุณภายในหนึ่งชั่วโมง"], ["ขอขอบคุณ โปรดลองใช้ลิงก์ที่ส่งไปยังโทรศัพท์ของคุณภายในหนึ่งชั่วโมง"]))), t.opalSMSError = bt.default(dt || (dt = n(["พบข้อผิดพลาด โปรดดาวน์โหลดแอป Bing Search จากร้านค้าแอป"], ["พบข้อผิดพลาด โปรดดาวน์โหลดแอป Bing Search จากร้านค้าแอป"]))), t.moreOnTopic = bt.default(ut || (ut = n(["เพิ่มเติมเกี่ยวกับ ", ""], ["เพิ่มเติมเกี่ยวกับ ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["น้อยลงเกี่ยวกับ ", ""], ["น้อยลงเกี่ยวกับ ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["หัวข้อที่กำลังนิยม"], ["หัวข้อที่กำลังนิยม"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Log Scale"], ["Log Scale"]))), t.linearScale = bt.default(vt || (vt = n(["Linear Scale"], ["Linear Scale"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["สวัสดี! ฉันคือบอทผู้ช่วยเหลือในส่วนของคำถามที่ถามบ่อยเกี่ยวกับโควิด-19 โดยฉันจะคอยช่วยตอบคำถามของคุณอยู่ที่นี่!"], ["สวัสดี! ฉันคือบอทผู้ช่วยเหลือในส่วนของคำถามที่ถามบ่อยเกี่ยวกับโควิด-19 โดยฉันจะคอยช่วยตอบคำถามของคุณอยู่ที่นี่!"]))), t.dataTitle = bt.default(gt || (gt = n(["ข้อมูล"], ["ข้อมูล"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.tr-tr.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Verilerin son güncelleştirilme zamanı:"], ["Verilerin son güncelleştirilme zamanı:"]))), t.urlCopied = bt.default(r || (r = n(["URL panoya kopyalandı"], ["URL panoya kopyalandı"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["COVID-19 İzleyici"], ["COVID-19 İzleyici"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing'den harita üzerinde canlı koronavirüs (COVID-19) izleyicisi"], ["Microsoft Bing'den harita üzerinde canlı koronavirüs (COVID-19) izleyicisi"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Bölgeler"], ["Bölgeler"]))), t.noRegionalData = bt.default(u || (u = n(["Henüz bu ülke/bölge için bölgesel veri yok. Daha sonra tekrar deneyin."], ["Henüz bu ülke/bölge için bölgesel veri yok. Daha sonra tekrar deneyin."]))), t.activeCases = bt.default(c || (c = n(["Mevcut vakalar"], ["Mevcut vakalar"]))), t.recoveredCases = bt.default(f || (f = n(["Tedavi edilen vakalar"], ["Tedavi edilen vakalar"]))), t.fatalCases = bt.default(p || (p = n(["Ölüm vakaları"], ["Ölüm vakaları"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Mevcut"], ["Mevcut"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["İyileşenler"], ["İyileşenler"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Ölümler"], ["Ölümler"]))), t.overview = bt.default(g || (g = n(["Genel bakış"], ["Genel bakış"]))), t.close = bt.default(b || (b = n(["Kapat"], ["Kapat"]))), t.selectARegion = bt.default(k || (k = n(["Bir bölge seçin"], ["Bir bölge seçin"]))), t.global = bt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = bt.default(C || (C = n(["Global Durum"], ["Global Durum"]))), t.allRegions = bt.default(w || (w = n(["Tüm Bölgeler"], ["Tüm Bölgeler"]))), t.share = bt.default(x || (x = n(["Paylaş"], ["Paylaş"]))), t.dataInfo = bt.default(T || (T = n(["Veri bilgileri"], ["Veri bilgileri"]))), t.totalConfirmed = bt.default(z || (z = n(["Onaylanan Toplam Vaka Sayısı"], ["Onaylanan Toplam Vaka Sayısı"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Toplam vaka sayısı"], ["Toplam vaka sayısı"]))), t.totalAreas = bt.default(I || (I = n(["Toplam ", ""], ["Toplam ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Haritanın tamamını görmek için bilgileri gizleyin"], ["Haritanın tamamını görmek için bilgileri gizleyin"]))), t.showInfo = bt.default(D || (D = n(["Bilgileri göster"], ["Bilgileri göster"]))), t.news = bt.default(M || (M = n(["Haberler"], ["Haberler"]))), t.helpfulResources = bt.default(E || (E = n(["Yardım ve Bilgi"], ["Yardım ve Bilgi"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Daha fazla göster"], ["Daha fazla göster"]))), t.dataFrom = bt.default(O || (O = n(["Veri kaynağı:"], ["Veri kaynağı:"]))), t.videos = bt.default(R || (R = n(["Videolar"], ["Videolar"]))), t.moreNews = bt.default(_ || (_ = n(["Daha fazla makale görüntüle"], ["Daha fazla makale görüntüle"]))), t.moreVideos = bt.default(N || (N = n(["Daha fazla video görüntüle"], ["Daha fazla video görüntüle"]))), t.map = bt.default(V || (V = n(["Harita:"], ["Harita:"]))), t.feedback = bt.default(U || (U = n(["Geri bildirim gönderin"], ["Geri bildirim gönderin"]))), t.feedbackQuestion = bt.default(q || (q = n(["Bu araç hakkında nasıl bir geri bildirimde bulunmak istersiniz?"], ["Bu araç hakkında nasıl bir geri bildirimde bulunmak istersiniz?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Sorun bildirin"], ["Sorun bildirin"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Bize sorundan bahsedin"], ["Bize sorundan bahsedin"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Bir fikir paylaşın"], ["Bir fikir paylaşın"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Bize fikrinizden bahsedin"], ["Bize fikrinizden bahsedin"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["İltifatta bulunun"], ["İltifatta bulunun"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Hoşunuza giden şeylerden bahsedin"], ["Hoşunuza giden şeylerden bahsedin"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Yasal veya gizlilikle ilgili bir konuda endişe"], ["Yasal veya gizlilikle ilgili bir konuda endişe"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Bize endişenizden bahsedin"], ["Bize endişenizden bahsedin"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Geri bildiriminizi buraya girin. Gizliliğinizi korumak için adresiniz veya telefon numaranız gibi kişisel bilgilerinizi dahil etmeyin"], ["Geri bildiriminizi buraya girin. Gizliliğinizi korumak için adresiniz veya telefon numaranız gibi kişisel bilgilerinizi dahil etmeyin"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Geri"], ["Geri"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Gönder"], ["Gönder"]))), t.feedbackThanks = bt.default(te || (te = n(["Geri bildiriminiz için teşekkürler!"], ["Geri bildiriminiz için teşekkürler!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Gizlilik bildirimi"], ["Gizlilik bildirimi"]))), t.websiteDescription = bt.default(ne || (ne = n(["Devam eden, tedavi edilen veya ölümle sonuçlanan yerel ve küresel COVID-19 vaka oranlarını harita üzerinde izleyin ve günlük haberler ile videolar alın."], ["Devam eden, tedavi edilen veya ölümle sonuçlanan yerel ve küresel COVID-19 vaka oranlarını harita üzerinde izleyin ve günlük haberler ile videolar alın."]))), t.graphOverTime = bt.default(ie || (ie = n(["Zaman İçinde Yayılım"], ["Zaman İçinde Yayılım"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " milyon"], ["", " milyon"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " bin"], ["", " bin"])), 0), t.upsellDesc = bt.default(le || (le = n(["En son gelişmeleri Bing uygulamasıyla telefonunuzdan takip edin"], ["En son gelişmeleri Bing uygulamasıyla telefonunuzdan takip edin"]))), t.upsellCTA = bt.default(se || (se = n(["Hemen indir"], ["Hemen indir"]))), t.upsellTitle = bt.default(de || (de = n(["Koronavirüs haberlerini takip edin"], ["Koronavirüs haberlerini takip edin"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Koronavirüsü izleyin"], ["Koronavirüsü izleyin"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Chrome uzantımızı ekleyerek Bing üzerinde koronavirüs hakkındaki en son gelişmeleri takip edin"], ["Chrome uzantımızı ekleyerek Bing üzerinde koronavirüs hakkındaki en son gelişmeleri takip edin"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Firefox uzantımızı ekleyerek Bing üzerinde koronavirüs hakkındaki en son gelişmeleri takip edin"], ["Firefox uzantımızı ekleyerek Bing üzerinde koronavirüs hakkındaki en son gelişmeleri takip edin"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Uzantıyı ekle"], ["Uzantıyı ekle"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Güvende kalın, bilgilenin"], ["Güvende kalın, bilgilenin"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Uzantıyla takip edin"], ["Uzantıyla takip edin"]))), t.submit = bt.default(he || (he = n(["Bitti"], ["Bitti"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " y"], ["", " y"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " ay"], ["", " ay"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " h"], ["", " h"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " gün"], ["", " gün"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " s"], ["", " s"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " dk"], ["", " dk"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Konumunuz"], ["Konumunuz"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Bir konuma göre filtreleyin"], ["Bir konuma göre filtreleyin"]))), t.expand = bt.default(ze || (ze = n(["Genişlet"], ["Genişlet"]))), t.trends = bt.default(Se || (Se = n(["Eğilimler"], ["Eğilimler"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Test Bilgileri"], ["Test Bilgileri"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Protokol ve İletişim"], ["Protokol ve İletişim"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Protokol"], ["Protokol"]))), t.hotline = bt.default(Me || (Me = n(["Yardım Hattı"], ["Yardım Hattı"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["İş Ortağı Şirketler"], ["İş Ortağı Şirketler"]))), t.moreTestingLocations = bt.default(je || (je = n(["Test konumlarını görüntüle (", ")"], ["Test konumlarını görüntüle (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Daha az göster"], ["Daha az göster"]))), t.topTrends = bt.default(Be || (Be = n(["Toplam vaka karşılaştırması"], ["Toplam vaka karşılaştırması"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["En son koronavirüs gelişmeleri"], ["En son koronavirüs gelişmeleri"]))), t.copyLink = bt.default(Le || (Le = n(["Bağlantıyı kopyala"], ["Bağlantıyı kopyala"]))), t.email = bt.default(Oe || (Oe = n(["E-posta"], ["E-posta"]))), t.cancel = bt.default(Re || (Re = n(["İptal"], ["İptal"]))), t.confirmed = bt.default(_e || (_e = n(["Onaylananlar"], ["Onaylananlar"]))), t.fatal = bt.default(Ne || (Ne = n(["Ölümler"], ["Ölümler"]))), t.recovered = bt.default(Ve || (Ve = n(["İyileşenler"], ["İyileşenler"]))), t.active = bt.default(Ue || (Ue = n(["Mevcut"], ["Mevcut"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Konumunuzu görmek için, buradan konum izinlerinizi etkinleştirin."], ["Konumunuzu görmek için, buradan konum izinlerinizi etkinleştirin."]))), t.overviewVertical = bt.default(He || (He = n(["Genel bakış"], ["Genel bakış"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Haberler ve Videolar"], ["Haberler ve Videolar"]))), t.graphstrends = bt.default(We || (We = n(["Grafikler"], ["Grafikler"]))), t.localResources = bt.default(Ke || (Ke = n(["Yerel Kaynaklar"], ["Yerel Kaynaklar"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " dakika önce güncellendi"], ["", " dakika önce güncellendi"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Telefon numaranızı veya e-postanızı göndererek bu telefon numarası veya e-posta adresine Microsoft'tan tek seferlik otomatik ileti almayı kabul etmiş olursunuz. Standart SMS ücretleri uygulanır."], ["Telefon numaranızı veya e-postanızı göndererek bu telefon numarası veya e-posta adresine Microsoft'tan tek seferlik otomatik ileti almayı kabul etmiş olursunuz. Standart SMS ücretleri uygulanır."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft Gizlilik Bildirimi"], ["Microsoft Gizlilik Bildirimi"]))), t.sendLink = bt.default(nt || (nt = n(["Bağlantıyı gönder"], ["Bağlantıyı gönder"]))), t.compare = bt.default(it || (it = n(["Karşılaştır"], ["Karşılaştır"]))), t.browse = bt.default(rt || (rt = n(["Göz at"], ["Göz at"]))), t.favorites = bt.default(ot || (ot = n(["Sık kullanılanlar"], ["Sık kullanılanlar"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Lütfen geçerli bir ABD telefon numarası girin."], ["Lütfen geçerli bir ABD telefon numarası girin."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Teşekkür ederiz. Lütfen telefonunuza gönderilen bağlantıyı bir saat içinde deneyin."], ["Teşekkür ederiz. Lütfen telefonunuza gönderilen bağlantıyı bir saat içinde deneyin."]))), t.opalSMSError = bt.default(dt || (dt = n(["Hata oluştu, lütfen uygulama mağazasından Bing Arama uygulamasını indirin."], ["Hata oluştu, lütfen uygulama mağazasından Bing Arama uygulamasını indirin."]))), t.moreOnTopic = bt.default(ut || (ut = n(["", " hakkında daha fazla haber"], ["", " hakkında daha fazla haber"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["", " hakkında daha az haber"], ["", " hakkında daha az haber"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Popüler Konular"], ["Popüler Konular"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Logaritmik ölçek"], ["Logaritmik ölçek"]))), t.linearScale = bt.default(vt || (vt = n(["Doğrusal ölçek"], ["Doğrusal ölçek"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Merhaba! Ben COVID-19 için SSS yardımcısı botuyum ve sorularınızı yanıtlamaya hazırım!"], ["Merhaba! Ben COVID-19 için SSS yardımcısı botuyum ve sorularınızı yanıtlamaya hazırım!"]))), t.dataTitle = bt.default(gt || (gt = n(["Veriler"], ["Veriler"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt, kt, yt, Ct, wt, xt, Tt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = Tt.default(i || (i = n(["Data was last updated:"], ["Data was last updated:"]))), t.urlCopied = Tt.default(r || (r = n(["Url copied to clipboard"], ["Url copied to clipboard"]))), t.bing = Tt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = Tt.default(l || (l = n(["COVID-19 Tracker"], ["COVID-19 Tracker"]))), t.bingCovidTitle = Tt.default(s || (s = n(["Coronavirus (COVID-19) live map tracker from Microsoft Bing"], ["Coronavirus (COVID-19) live map tracker from Microsoft Bing"]))), t.citiesAndProvinces = Tt.default(d || (d = n(["Regions"], ["Regions"]))), t.noRegionalData = Tt.default(u || (u = n(["Regional data is not available for this country/region yet. Try again later."], ["Regional data is not available for this country/region yet. Try again later."]))), t.activeCases = Tt.default(c || (c = n(["Active cases"], ["Active cases"]))), t.recoveredCases = Tt.default(f || (f = n(["Recovered cases"], ["Recovered cases"]))), t.fatalCases = Tt.default(p || (p = n(["Fatal cases"], ["Fatal cases"]))), t.activeCasesForCallout = Tt.default(m || (m = n(["Active"], ["Active"]))), t.recoveredCasesForCallout = Tt.default(v || (v = n(["Recovered"], ["Recovered"]))), t.fatalCasesForCallout = Tt.default(h || (h = n(["Fatal"], ["Fatal"]))), t.overview = Tt.default(g || (g = n(["Overview"], ["Overview"]))), t.close = Tt.default(b || (b = n(["Close"], ["Close"]))), t.selectARegion = Tt.default(k || (k = n(["Select a region"], ["Select a region"]))), t.global = Tt.default(y || (y = n(["Global"], ["Global"]))), t.globalStatus = Tt.default(C || (C = n(["Global Status"], ["Global Status"]))), t.allRegions = Tt.default(w || (w = n(["All Regions"], ["All Regions"]))), t.share = Tt.default(x || (x = n(["Share"], ["Share"]))), t.dataInfo = Tt.default(T || (T = n(["Data information"], ["Data information"]))), t.totalConfirmed = Tt.default(z || (z = n(["Total Confirmed Cases"], ["Total Confirmed Cases"]))), t.totalConfirmedShort = Tt.default(S || (S = n(["Total cases"], ["Total cases"]))), t.totalAreas = Tt.default(I || (I = n(["", " Total"], ["", " Total"])), 0), t.hideInfo = Tt.default(A || (A = n(["Hide info to see full map"], ["Hide info to see full map"]))), t.showInfo = Tt.default(D || (D = n(["Show info"], ["Show info"]))), t.news = Tt.default(M || (M = n(["News"], ["News"]))), t.helpfulResources = Tt.default(E || (E = n(["Help & Information"], ["Help & Information"]))), t.quizTitle = Tt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = Tt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = Tt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = Tt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = Tt.default(L || (L = n(["See more"], ["See more"]))), t.dataFrom = Tt.default(O || (O = n(["Data from:"], ["Data from:"]))), t.videos = Tt.default(R || (R = n(["Videos"], ["Videos"]))), t.moreNews = Tt.default(_ || (_ = n(["See more articles"], ["See more articles"]))), t.moreVideos = Tt.default(N || (N = n(["See more videos"], ["See more videos"]))), t.map = Tt.default(V || (V = n(["Map: "], ["Map: "]))), t.feedback = Tt.default(U || (U = n(["Give feedback"], ["Give feedback"]))), t.feedbackQuestion = Tt.default(q || (q = n(["What kind of feedback do you have about this tool?"], ["What kind of feedback do you have about this tool?"]))), t.feedbackReportIssue = Tt.default(H || (H = n(["Report an issue"], ["Report an issue"]))), t.feedbackTellIssue = Tt.default(G || (G = n(["Tell us about the issue"], ["Tell us about the issue"]))), t.feedbackShareIdea = Tt.default(W || (W = n(["Share an idea"], ["Share an idea"]))), t.feedbackTellIdea = Tt.default(K || (K = n(["Tell us about your idea"], ["Tell us about your idea"]))), t.feedbackGiveCompliment = Tt.default(Z || (Z = n(["Give a compliment"], ["Give a compliment"]))), t.feedbackTellCompliment = Tt.default(Q || (Q = n(["Tell us what you like"], ["Tell us what you like"]))), t.feedbackLegalConcern = Tt.default(Y || (Y = n(["Legal or privacy concern"], ["Legal or privacy concern"]))), t.feedbackTellConcern = Tt.default(J || (J = n(["Tell us about your concern"], ["Tell us about your concern"]))), t.feedbackTextEntry = Tt.default(X || (X = n(["Enter feedback here. To help protect your privacy, don't include personal info, like your address or phone number"], ["Enter feedback here. To help protect your privacy, don't include personal info, like your address or phone number"]))), t.feedbackButtonBack = Tt.default($ || ($ = n(["Go back"], ["Go back"]))), t.feedbackButtonSend = Tt.default(ee || (ee = n(["Send"], ["Send"]))), t.feedbackThanks = Tt.default(te || (te = n(["Thank you for your feedback!"], ["Thank you for your feedback!"]))), t.privacyStatement = Tt.default(ae || (ae = n(["Privacy statement"], ["Privacy statement"]))), t.websiteDescription = Tt.default(ne || (ne = n(["Track COVID-19 local and global coronavirus cases with active, recoveries and death rate on the map, with daily news and video."], ["Track COVID-19 local and global coronavirus cases with active, recoveries and death rate on the map, with daily news and video."]))), t.graphOverTime = Tt.default(ie || (ie = n(["Spread over time"], ["Spread over time"]))), t.millionAbbreviation = Tt.default(re || (re = n(["", "M"], ["", "M"])), 0), t.thousandAbbreviation = Tt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = Tt.default(le || (le = n(["Track the latest updates on your phone with the Bing app"], ["Track the latest updates on your phone with the Bing app"]))), t.upsellCTA = Tt.default(se || (se = n(["Download now"], ["Download now"]))), t.upsellTitle = Tt.default(de || (de = n(["Follow coronavirus news"], ["Follow coronavirus news"]))), t.upsellBubbleTitle = Tt.default(ue || (ue = n(["Track the coronavirus"], ["Track the coronavirus"]))), t.dseUpsellChromeDesc = Tt.default(ce || (ce = n(["Get the latest coronavirus updates on Bing when you add our Chrome extension"], ["Get the latest coronavirus updates on Bing when you add our Chrome extension"]))), t.dseUpsellFirefoxDesc = Tt.default(fe || (fe = n(["Get the latest coronavirus updates on Bing when you add our Firefox extension"], ["Get the latest coronavirus updates on Bing when you add our Firefox extension"]))), t.dseUpsellCTA = Tt.default(pe || (pe = n(["Add the extension"], ["Add the extension"]))), t.dseUpsellTitle = Tt.default(me || (me = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.dseUpsellBubbleTitle = Tt.default(ve || (ve = n(["Track with extension"], ["Track with extension"]))), t.submit = Tt.default(he || (he = n(["Done"], ["Done"]))), t.yearAbbreviation = Tt.default(ge || (ge = n(["", "y"], ["", "y"])), 0), t.monthAbbreviation = Tt.default(be || (be = n(["", "M"], ["", "M"])), 0), t.weekAbbreviation = Tt.default(ke || (ke = n(["", "w"], ["", "w"])), 0), t.dayAbbreviation = Tt.default(ye || (ye = n(["", "d"], ["", "d"])), 0), t.hourAbbreviation = Tt.default(Ce || (Ce = n(["", "h"], ["", "h"])), 0), t.minuteAbbreviation = Tt.default(we || (we = n(["", "m"], ["", "m"])), 0), t.yourLocation = Tt.default(xe || (xe = n(["Your Location"], ["Your Location"]))), t.filterPlaceholder = Tt.default(Te || (Te = n(["Filter to a location"], ["Filter to a location"]))), t.expand = Tt.default(ze || (ze = n(["Expand "], ["Expand "]))), t.trends = Tt.default(Se || (Se = n(["Trends"], ["Trends"]))), t.testingProcess = Tt.default(Ie || (Ie = n(["Testing Information"], ["Testing Information"]))), t.testingInfoHeader = Tt.default(Ae || (Ae = n(["Protocol & Contact"], ["Protocol & Contact"]))), t.testingProcessProtocol = Tt.default(De || (De = n(["Protocol"], ["Protocol"]))), t.hotline = Tt.default(Me || (Me = n(["Hotline"], ["Hotline"]))), t.partnerCompanies = Tt.default(Ee || (Ee = n(["Partner Companies"], ["Partner Companies"]))), t.moreTestingLocations = Tt.default(je || (je = n(["See testing locations (", ")"], ["See testing locations (", ")"])), 0), t.seeLess = Tt.default(Pe || (Pe = n(["See less"], ["See less"]))), t.topTrends = Tt.default(Be || (Be = n(["Comparison by total cases"], ["Comparison by total cases"]))), t.latestUpdates = Tt.default(Fe || (Fe = n(["Latest coronavirus updates"], ["Latest coronavirus updates"]))), t.copyLink = Tt.default(Le || (Le = n(["Copy link"], ["Copy link"]))), t.email = Tt.default(Oe || (Oe = n(["Email"], ["Email"]))), t.cancel = Tt.default(Re || (Re = n(["Cancel"], ["Cancel"]))), t.confirmed = Tt.default(_e || (_e = n(["Confirmed"], ["Confirmed"]))), t.fatal = Tt.default(Ne || (Ne = n(["Fatal"], ["Fatal"]))), t.recovered = Tt.default(Ve || (Ve = n(["Recovered"], ["Recovered"]))), t.active = Tt.default(Ue || (Ue = n(["Active"], ["Active"]))), t.permissionsToShowNearest = Tt.default(qe || (qe = n(["To see your location, enable location permissions here."], ["To see your location, enable location permissions here."]))), t.overviewVertical = Tt.default(He || (He = n(["Overview"], ["Overview"]))), t.newsvideos = Tt.default(Ge || (Ge = n(["News & Videos"], ["News & Videos"]))), t.graphstrends = Tt.default(We || (We = n(["Graphs"], ["Graphs"]))), t.localResources = Tt.default(Ke || (Ke = n(["Local Resources"], ["Local Resources"]))), t.facebook = Tt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = Tt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = Tt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = Tt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = Tt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = Tt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = Tt.default(et || (et = n(["Updated ", " min ago"], ["Updated ", " min ago"])), 0), t.phoneNumberPolicy = Tt.default(tt || (tt = n(["By sending your phone number or email, you agree to receive a one-time automated message from Microsoft to this mobile phone number or email. Standard SMS rates apply."], ["By sending your phone number or email, you agree to receive a one-time automated message from Microsoft to this mobile phone number or email. Standard SMS rates apply."]))), t.msPrivacyTitle = Tt.default(at || (at = n(["Microsoft Privacy Statement"], ["Microsoft Privacy Statement"]))), t.sendLink = Tt.default(nt || (nt = n(["Send link"], ["Send link"]))), t.compare = Tt.default(it || (it = n(["Compare "], ["Compare "]))), t.browse = Tt.default(rt || (rt = n(["Browse"], ["Browse"]))), t.favorites = Tt.default(ot || (ot = n(["Favorites"], ["Favorites"]))), t.validNumberRequired = Tt.default(lt || (lt = n(["Please enter a valid US phone number."], ["Please enter a valid US phone number."]))), t.opalSMSAccepted = Tt.default(st || (st = n(["Thank you. Please try the link sent to your phone within the hour."], ["Thank you. Please try the link sent to your phone within the hour."]))), t.opalSMSError = Tt.default(dt || (dt = n(["Error encountered, please download the Bing Search app from the app store."], ["Error encountered, please download the Bing Search app from the app store."]))), t.moreOnTopic = Tt.default(ut || (ut = n(["More on ", ""], ["More on ", ""])), 0), t.lessOnTopic = Tt.default(ct || (ct = n(["Less on ", ""], ["Less on ", ""])), 0), t.trendingTopics = Tt.default(ft || (ft = n(["Trending Topics"], ["Trending Topics"]))), t.durationAgo = Tt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = Tt.default(mt || (mt = n(["Log scale"], ["Log scale"]))), t.linearScale = Tt.default(vt || (vt = n(["Linear scale"], ["Linear scale"]))), t.botWelcomeMessage = Tt.default(ht || (ht = n(["Hi there! I'm the COVID-19 FAQ helper bot and I'm here to help answer your questions!"], ["Hi there! I'm the COVID-19 FAQ helper bot and I'm here to help answer your questions!"]))), t.dataTitle = Tt.default(gt || (gt = n(["Data"], ["Data"]))), t.newCases = Tt.default(bt || (bt = n(["New Cases"], ["New Cases"]))), t.mobility = Tt.default(kt || (kt = n(["Mobility"], ["Mobility"]))), t.confirmedDistribution = Tt.default(yt || (yt = n(["Distribution of confirmed cases"], ["Distribution of confirmed cases"]))), t.activeTopTen = Tt.default(Ct || (Ct = n(["Top 10 by active cases"], ["Top 10 by active cases"]))), t.confirmedTrend = Tt.default(wt || (wt = n(["Confirmed cases trend"], ["Confirmed cases trend"]))), t.activeTrend = Tt.default(xt || (xt = n(["Active cases trend"], ["Active cases trend"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.vi-vn.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["Dữ liệu được cập nhật mới nhất:"], ["Dữ liệu được cập nhật mới nhất:"]))), t.urlCopied = bt.default(r || (r = n(["Đã sao chép Url vào bảng tạm"], ["Đã sao chép Url vào bảng tạm"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["Công cụ theo dõi COVID-19"], ["Công cụ theo dõi COVID-19"]))), t.bingCovidTitle = bt.default(s || (s = n(["Bản đồ theo dõi trực tiếp virus corona (COVID-19) từ Microsoft Bing"], ["Bản đồ theo dõi trực tiếp virus corona (COVID-19) từ Microsoft Bing"]))), t.citiesAndProvinces = bt.default(d || (d = n(["Khu vực"], ["Khu vực"]))), t.noRegionalData = bt.default(u || (u = n(["Chưa có dữ liệu khu vực cho quốc gia/khu vực này. Hãy thử lại sau."], ["Chưa có dữ liệu khu vực cho quốc gia/khu vực này. Hãy thử lại sau."]))), t.activeCases = bt.default(c || (c = n(["Ca nhiễm bệnh"], ["Ca nhiễm bệnh"]))), t.recoveredCases = bt.default(f || (f = n(["Ca hồi phục"], ["Ca hồi phục"]))), t.fatalCases = bt.default(p || (p = n(["Ca tử vong"], ["Ca tử vong"]))), t.activeCasesForCallout = bt.default(m || (m = n(["Dương tính"], ["Dương tính"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["Đã hồi phục"], ["Đã hồi phục"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["Tử vong"], ["Tử vong"]))), t.overview = bt.default(g || (g = n(["Tổng quan"], ["Tổng quan"]))), t.close = bt.default(b || (b = n(["Đóng"], ["Đóng"]))), t.selectARegion = bt.default(k || (k = n(["Chọn một khu vực"], ["Chọn một khu vực"]))), t.global = bt.default(y || (y = n(["Toàn cầu"], ["Toàn cầu"]))), t.globalStatus = bt.default(C || (C = n(["Tình trạng toàn cầu"], ["Tình trạng toàn cầu"]))), t.allRegions = bt.default(w || (w = n(["Tất cả các khu vực"], ["Tất cả các khu vực"]))), t.share = bt.default(x || (x = n(["Chia sẻ"], ["Chia sẻ"]))), t.dataInfo = bt.default(T || (T = n(["Thông tin dữ liệu"], ["Thông tin dữ liệu"]))), t.totalConfirmed = bt.default(z || (z = n(["Tổng số ca đã xác nhận"], ["Tổng số ca đã xác nhận"]))), t.totalConfirmedShort = bt.default(S || (S = n(["Tổng số ca"], ["Tổng số ca"]))), t.totalAreas = bt.default(I || (I = n(["Tổng cộng ", ""], ["Tổng cộng ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["Ẩn thông tin để xem toàn bộ bản đồ"], ["Ẩn thông tin để xem toàn bộ bản đồ"]))), t.showInfo = bt.default(D || (D = n(["Hiển thị thông tin"], ["Hiển thị thông tin"]))), t.news = bt.default(M || (M = n(["Tin tức"], ["Tin tức"]))), t.helpfulResources = bt.default(E || (E = n(["Trợ giúp & Thông tin"], ["Trợ giúp & Thông tin"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["Xem thêm"], ["Xem thêm"]))), t.dataFrom = bt.default(O || (O = n(["Dữ liệu từ:"], ["Dữ liệu từ:"]))), t.videos = bt.default(R || (R = n(["Video"], ["Video"]))), t.moreNews = bt.default(_ || (_ = n(["Xem thêm bài viết"], ["Xem thêm bài viết"]))), t.moreVideos = bt.default(N || (N = n(["Xem thêm video"], ["Xem thêm video"]))), t.map = bt.default(V || (V = n(["Bản đồ:"], ["Bản đồ:"]))), t.feedback = bt.default(U || (U = n(["Đưa ra phản hồi"], ["Đưa ra phản hồi"]))), t.feedbackQuestion = bt.default(q || (q = n(["Bạn có loại phản hồi gì về công cụ này?"], ["Bạn có loại phản hồi gì về công cụ này?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["Báo cáo một vấn đề"], ["Báo cáo một vấn đề"]))), t.feedbackTellIssue = bt.default(G || (G = n(["Hãy cho chúng tôi biết về vấn đề này"], ["Hãy cho chúng tôi biết về vấn đề này"]))), t.feedbackShareIdea = bt.default(W || (W = n(["Chia sẻ một ý kiến"], ["Chia sẻ một ý kiến"]))), t.feedbackTellIdea = bt.default(K || (K = n(["Hãy cho chúng tôi biết ý kiến của bạn"], ["Hãy cho chúng tôi biết ý kiến của bạn"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["Đưa ra một lời khen"], ["Đưa ra một lời khen"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["Hãy cho chúng tôi biết những gì bạn thích"], ["Hãy cho chúng tôi biết những gì bạn thích"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["Mối bận tâm về pháp lý hoặc quyền riêng tư"], ["Mối bận tâm về pháp lý hoặc quyền riêng tư"]))), t.feedbackTellConcern = bt.default(J || (J = n(["Cho chúng tôi biết mối bận tâm của bạn"], ["Cho chúng tôi biết mối bận tâm của bạn"]))), t.feedbackTextEntry = bt.default(X || (X = n(["Nhập phản hồi ở đây. Để giúp bảo vệ quyền riêng tư của bạn, đừng nhập thông tin cá nhân như địa chỉ hoặc số điện thoại của bạn"], ["Nhập phản hồi ở đây. Để giúp bảo vệ quyền riêng tư của bạn, đừng nhập thông tin cá nhân như địa chỉ hoặc số điện thoại của bạn"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["Quay lại"], ["Quay lại"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["Gửi"], ["Gửi"]))), t.feedbackThanks = bt.default(te || (te = n(["Cảm ơn phản hồi của bạn!"], ["Cảm ơn phản hồi của bạn!"]))), t.privacyStatement = bt.default(ae || (ae = n(["Điều khoản về Quyền riêng tư"], ["Điều khoản về Quyền riêng tư"]))), t.websiteDescription = bt.default(ne || (ne = n(["Theo dõi tỷ lệ các ca nhiễm COVID-19, các ca hồi phục và tử vong tại địa phương và toàn cầu trên bản đồ này, cùng với các tin tức và video hàng ngày."], ["Theo dõi tỷ lệ các ca nhiễm COVID-19, các ca hồi phục và tử vong tại địa phương và toàn cầu trên bản đồ này, cùng với các tin tức và video hàng ngày."]))), t.graphOverTime = bt.default(ie || (ie = n(["Lây lan theo thời gian"], ["Lây lan theo thời gian"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " triệu"], ["", " triệu"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " nghìn"], ["", " nghìn"])), 0), t.upsellDesc = bt.default(le || (le = n(["Theo dõi các tin tức cập nhật mới nhất trên điện thoại của bạn bằng ứng dụng Bing"], ["Theo dõi các tin tức cập nhật mới nhất trên điện thoại của bạn bằng ứng dụng Bing"]))), t.upsellCTA = bt.default(se || (se = n(["Tải xuống bây giờ"], ["Tải xuống bây giờ"]))), t.upsellTitle = bt.default(de || (de = n(["Theo dõi tin tức về virus corona"], ["Theo dõi tin tức về virus corona"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["Theo dõi virus corona"], ["Theo dõi virus corona"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["Nhận các cập nhật mới nhất về virus corona trên Bing khi bạn thêm phần mở rộng Chrome của chúng tôi"], ["Nhận các cập nhật mới nhất về virus corona trên Bing khi bạn thêm phần mở rộng Chrome của chúng tôi"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["Nhận các cập nhật mới nhất về virus corona trên Bing khi bạn thêm phần mở rộng Firefox"], ["Nhận các cập nhật mới nhất về virus corona trên Bing khi bạn thêm phần mở rộng Firefox"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["Thêm phần mở rộng"], ["Thêm phần mở rộng"]))), t.dseUpsellTitle = bt.default(me || (me = n(["Giữ an toàn, nắm thông tin"], ["Giữ an toàn, nắm thông tin"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["Theo dõi với phần mở rộng"], ["Theo dõi với phần mở rộng"]))), t.submit = bt.default(he || (he = n(["Gửi"], ["Gửi"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", "n"], ["", "n"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", "Th"], ["", "Th"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", "t"], ["", "t"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", "ng"], ["", "ng"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", "g"], ["", "g"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", "p"], ["", "p"])), 0), t.yourLocation = bt.default(xe || (xe = n(["Địa điểm của bạn"], ["Địa điểm của bạn"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["Lọc đến một địa điểm"], ["Lọc đến một địa điểm"]))), t.expand = bt.default(ze || (ze = n(["Mở rộng"], ["Mở rộng"]))), t.trends = bt.default(Se || (Se = n(["Xu hướng"], ["Xu hướng"]))), t.testingProcess = bt.default(Ie || (Ie = n(["Thông tin xét nghiệm"], ["Thông tin xét nghiệm"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["Hướng dẫn & Liên lạc"], ["Hướng dẫn & Liên lạc"]))), t.testingProcessProtocol = bt.default(De || (De = n(["Hướng dẫn"], ["Hướng dẫn"]))), t.hotline = bt.default(Me || (Me = n(["Đường dây nóng"], ["Đường dây nóng"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["Các công ty đối tác"], ["Các công ty đối tác"]))), t.moreTestingLocations = bt.default(je || (je = n(["Xem các địa điểm xét nghiệm (", ")"], ["Xem các địa điểm xét nghiệm (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["Thu gọn"], ["Thu gọn"]))), t.topTrends = bt.default(Be || (Be = n(["So sánh theo tổng số ca"], ["So sánh theo tổng số ca"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["Cập nhật mới nhất về virus corona"], ["Cập nhật mới nhất về virus corona"]))), t.copyLink = bt.default(Le || (Le = n(["Sao chép liên kết"], ["Sao chép liên kết"]))), t.email = bt.default(Oe || (Oe = n(["Email"], ["Email"]))), t.cancel = bt.default(Re || (Re = n(["Hủy"], ["Hủy"]))), t.confirmed = bt.default(_e || (_e = n(["Đã xác nhận"], ["Đã xác nhận"]))), t.fatal = bt.default(Ne || (Ne = n(["Tử vong"], ["Tử vong"]))), t.recovered = bt.default(Ve || (Ve = n(["Đã hồi phục"], ["Đã hồi phục"]))), t.active = bt.default(Ue || (Ue = n(["Dương tính"], ["Dương tính"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["Để xem vị trí của bạn, bật quyền vị trí ở đây."], ["Để xem vị trí của bạn, bật quyền vị trí ở đây."]))), t.overviewVertical = bt.default(He || (He = n(["Tổng quan"], ["Tổng quan"]))), t.newsvideos = bt.default(Ge || (Ge = n(["Tin tức & Video"], ["Tin tức & Video"]))), t.graphstrends = bt.default(We || (We = n(["Biểu đồ"], ["Biểu đồ"]))), t.localResources = bt.default(Ke || (Ke = n(["Nguồn thông tin địa phương"], ["Nguồn thông tin địa phương"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["Đã cập nhật ", " phút trước"], ["Đã cập nhật ", " phút trước"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["Bằng cách gửi số điện thoại hoặc email của bạn, bạn đồng ý nhận tin nhắn tự động một lần từ Microsoft đến số điện thoại di động này hoặc email. Áp dụng phí SMS tiêu chuẩn."], ["Bằng cách gửi số điện thoại hoặc email của bạn, bạn đồng ý nhận tin nhắn tự động một lần từ Microsoft đến số điện thoại di động này hoặc email. Áp dụng phí SMS tiêu chuẩn."]))), t.msPrivacyTitle = bt.default(at || (at = n(["Điều khoản về quyền riêng tư của Microsoft"], ["Điều khoản về quyền riêng tư của Microsoft"]))), t.sendLink = bt.default(nt || (nt = n(["Gửi liên kết"], ["Gửi liên kết"]))), t.compare = bt.default(it || (it = n(["So sánh"], ["So sánh"]))), t.browse = bt.default(rt || (rt = n(["Duyệt"], ["Duyệt"]))), t.favorites = bt.default(ot || (ot = n(["Mục yêu thích"], ["Mục yêu thích"]))), t.validNumberRequired = bt.default(lt || (lt = n(["Vui lòng nhập số điện thoại hợp lệ của Hoa Kỳ."], ["Vui lòng nhập số điện thoại hợp lệ của Hoa Kỳ."]))), t.opalSMSAccepted = bt.default(st || (st = n(["Cảm ơn bạn. Vui lòng thử liên kết được gửi đến điện thoại của bạn trong vòng 1 giờ."], ["Cảm ơn bạn. Vui lòng thử liên kết được gửi đến điện thoại của bạn trong vòng 1 giờ."]))), t.opalSMSError = bt.default(dt || (dt = n(["Đã gặp lỗi, vui lòng tải xuống ứng dụng Tìm kiếm trên Bing từ cửa hàng ứng dụng."], ["Đã gặp lỗi, vui lòng tải xuống ứng dụng Tìm kiếm trên Bing từ cửa hàng ứng dụng."]))), t.moreOnTopic = bt.default(ut || (ut = n(["Xem thêm về ", ""], ["Xem thêm về ", ""])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["Thu gọn ", ""], ["Thu gọn ", ""])), 0), t.trendingTopics = bt.default(ft || (ft = n(["Chủ đề thịnh hành"], ["Chủ đề thịnh hành"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["Thước đo lôgarit"], ["Thước đo lôgarit"]))), t.linearScale = bt.default(vt || (vt = n(["Thước đo tuyến tính"], ["Thước đo tuyến tính"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["Xin chào! Tôi là bot trợ giúp cho Câu hỏi thường gặp về COVID-19, tôi sẵn sàng giải đáp các thắc mắc của bạn!"], ["Xin chào! Tôi là bot trợ giúp cho Câu hỏi thường gặp về COVID-19, tôi sẵn sàng giải đáp các thắc mắc của bạn!"]))), t.dataTitle = bt.default(gt || (gt = n(["Dữ liệu"], ["Dữ liệu"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.zh-hans.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["数据上次更新时间:"], ["数据上次更新时间:"]))), t.urlCopied = bt.default(r || (r = n(["URL 已复制到剪贴板"], ["URL 已复制到剪贴板"]))), t.bing = bt.default(o || (o = n(["必应"], ["必应"]))), t.covidTitle = bt.default(l || (l = n(["新型冠状病毒肺炎追踪"], ["新型冠状病毒肺炎追踪"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft 必应新冠病毒 (COVID-19) 疫情追踪实时地图"], ["Microsoft 必应新冠病毒 (COVID-19) 疫情追踪实时地图"]))), t.citiesAndProvinces = bt.default(d || (d = n(["地区"], ["地区"]))), t.noRegionalData = bt.default(u || (u = n(["尚没有此国家/地区的地区数据。请稍后重试。"], ["尚没有此国家/地区的地区数据。请稍后重试。"]))), t.activeCases = bt.default(c || (c = n(["现有确诊"], ["现有确诊"]))), t.recoveredCases = bt.default(f || (f = n(["累计治愈"], ["累计治愈"]))), t.fatalCases = bt.default(p || (p = n(["累计死亡"], ["累计死亡"]))), t.activeCasesForCallout = bt.default(m || (m = n(["现有确诊"], ["现有确诊"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["累计治愈"], ["累计治愈"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["累计死亡"], ["累计死亡"]))), t.overview = bt.default(g || (g = n(["概况"], ["概况"]))), t.close = bt.default(b || (b = n(["关闭"], ["关闭"]))), t.selectARegion = bt.default(k || (k = n(["选择地区"], ["选择地区"]))), t.global = bt.default(y || (y = n(["全球"], ["全球"]))), t.globalStatus = bt.default(C || (C = n(["全球状态"], ["全球状态"]))), t.allRegions = bt.default(w || (w = n(["所有地区"], ["所有地区"]))), t.share = bt.default(x || (x = n(["分享"], ["分享"]))), t.dataInfo = bt.default(T || (T = n(["数据信息"], ["数据信息"]))), t.totalConfirmed = bt.default(z || (z = n(["累计确诊"], ["累计确诊"]))), t.totalConfirmedShort = bt.default(S || (S = n(["累计确诊"], ["累计确诊"]))), t.totalAreas = bt.default(I || (I = n(["总计 ", ""], ["总计 ", ""])), 0), t.hideInfo = bt.default(A || (A = n(["隐藏信息以查看完整地图"], ["隐藏信息以查看完整地图"]))), t.showInfo = bt.default(D || (D = n(["显示信息"], ["显示信息"]))), t.news = bt.default(M || (M = n(["资讯"], ["资讯"]))), t.helpfulResources = bt.default(E || (E = n(["帮助和信息"], ["帮助和信息"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["展开"], ["展开"]))), t.dataFrom = bt.default(O || (O = n(["数据来源:"], ["数据来源:"]))), t.videos = bt.default(R || (R = n(["视频"], ["视频"]))), t.moreNews = bt.default(_ || (_ = n(["查看更多文章"], ["查看更多文章"]))), t.moreVideos = bt.default(N || (N = n(["查看更多视频"], ["查看更多视频"]))), t.map = bt.default(V || (V = n(["地图:"], ["地图:"]))), t.feedback = bt.default(U || (U = n(["提供反馈"], ["提供反馈"]))), t.feedbackQuestion = bt.default(q || (q = n(["你对该工具有何反馈?"], ["你对该工具有何反馈?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["报告问题"], ["报告问题"]))), t.feedbackTellIssue = bt.default(G || (G = n(["告诉我们你的问题"], ["告诉我们你的问题"]))), t.feedbackShareIdea = bt.default(W || (W = n(["分享想法"], ["分享想法"]))), t.feedbackTellIdea = bt.default(K || (K = n(["告诉我们你的想法"], ["告诉我们你的想法"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["给予称赞"], ["给予称赞"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["告诉我们你的喜好"], ["告诉我们你的喜好"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["法律或隐私顾虑"], ["法律或隐私顾虑"]))), t.feedbackTellConcern = bt.default(J || (J = n(["告诉我们你的顾虑"], ["告诉我们你的顾虑"]))), t.feedbackTextEntry = bt.default(X || (X = n(["在此处输入反馈。为了保护你的隐私，请勿包含个人信息，例如你的地址或电话号码"], ["在此处输入反馈。为了保护你的隐私，请勿包含个人信息，例如你的地址或电话号码"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["返回"], ["返回"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["发送"], ["发送"]))), t.feedbackThanks = bt.default(te || (te = n(["谢谢你的反馈!"], ["谢谢你的反馈!"]))), t.privacyStatement = bt.default(ae || (ae = n(["隐私声明"], ["隐私声明"]))), t.websiteDescription = bt.default(ne || (ne = n(["在此地图上追踪各地和全球的新冠病毒肺炎确诊、治愈和死亡人数，以及每天的资讯和视频。"], ["在此地图上追踪各地和全球的新冠病毒肺炎确诊、治愈和死亡人数，以及每天的资讯和视频。"]))), t.graphOverTime = bt.default(ie || (ie = n(["随时间的扩散情况"], ["随时间的扩散情况"]))), t.millionAbbreviation = bt.default(re || (re = n(["", "M"], ["", "M"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", "K"], ["", "K"])), 0), t.upsellDesc = bt.default(le || (le = n(["在手机上用必应应用跟踪最新更新"], ["在手机上用必应应用跟踪最新更新"]))), t.upsellCTA = bt.default(se || (se = n(["立即下载"], ["立即下载"]))), t.upsellTitle = bt.default(de || (de = n(["关注新冠病毒肺炎资讯"], ["关注新冠病毒肺炎资讯"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["新冠病毒肺炎追踪"], ["新冠病毒肺炎追踪"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["添加 Chrome 扩展后，即可在必应上获取新冠病毒肺炎的最新动态"], ["添加 Chrome 扩展后，即可在必应上获取新冠病毒肺炎的最新动态"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["添加 Firefox 扩展后，即可在必应上获取新冠病毒肺炎的最新动态"], ["添加 Firefox 扩展后，即可在必应上获取新冠病毒肺炎的最新动态"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["添加扩展"], ["添加扩展"]))), t.dseUpsellTitle = bt.default(me || (me = n(["保证安全，保持信息畅通"], ["保证安全，保持信息畅通"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["使用扩展追踪"], ["使用扩展追踪"]))), t.submit = bt.default(he || (he = n(["完成"], ["完成"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " 年"], ["", " 年"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " 个月"], ["", " 个月"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " 星期"], ["", " 星期"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " 天"], ["", " 天"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " 小时"], ["", " 小时"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " 分钟"], ["", " 分钟"])), 0), t.yourLocation = bt.default(xe || (xe = n(["你所在的位置"], ["你所在的位置"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["按位置筛选"], ["按位置筛选"]))), t.expand = bt.default(ze || (ze = n(["展开"], ["展开"]))), t.trends = bt.default(Se || (Se = n(["趋势"], ["趋势"]))), t.testingProcess = bt.default(Ie || (Ie = n(["检测信息"], ["检测信息"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["协议和联系人"], ["协议和联系人"]))), t.testingProcessProtocol = bt.default(De || (De = n(["协议"], ["协议"]))), t.hotline = bt.default(Me || (Me = n(["热线"], ["热线"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["合作伙伴公司"], ["合作伙伴公司"]))), t.moreTestingLocations = bt.default(je || (je = n(["查看检测地点 (", ")"], ["查看检测地点 (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["收起"], ["收起"]))), t.topTrends = bt.default(Be || (Be = n(["累计确诊对比"], ["累计确诊对比"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["新冠病毒肺炎最新更新"], ["新冠病毒肺炎最新更新"]))), t.copyLink = bt.default(Le || (Le = n(["复制链接"], ["复制链接"]))), t.email = bt.default(Oe || (Oe = n(["电子邮件"], ["电子邮件"]))), t.cancel = bt.default(Re || (Re = n(["取消"], ["取消"]))), t.confirmed = bt.default(_e || (_e = n(["累计确诊"], ["累计确诊"]))), t.fatal = bt.default(Ne || (Ne = n(["累计死亡"], ["累计死亡"]))), t.recovered = bt.default(Ve || (Ve = n(["累计治愈"], ["累计治愈"]))), t.active = bt.default(Ue || (Ue = n(["现有确诊"], ["现有确诊"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["要查看你所在的位置，请在此处启用位置权限。"], ["要查看你所在的位置，请在此处启用位置权限。"]))), t.overviewVertical = bt.default(He || (He = n(["概况"], ["概况"]))), t.newsvideos = bt.default(Ge || (Ge = n(["资讯和视频"], ["资讯和视频"]))), t.graphstrends = bt.default(We || (We = n(["图表"], ["图表"]))), t.localResources = bt.default(Ke || (Ke = n(["本地资源"], ["本地资源"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["领英"], ["领英"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " 分钟前更新"], ["", " 分钟前更新"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["发送电话号码或电子邮件即表示你同意 Microsoft 向此手机号码或电子邮件发送一次性的自动邮件。将收取标准短信费。"], ["发送电话号码或电子邮件即表示你同意 Microsoft 向此手机号码或电子邮件发送一次性的自动邮件。将收取标准短信费。"]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft 隐私声明"], ["Microsoft 隐私声明"]))), t.sendLink = bt.default(nt || (nt = n(["发送链接"], ["发送链接"]))), t.compare = bt.default(it || (it = n(["比较"], ["比较"]))), t.browse = bt.default(rt || (rt = n(["浏览"], ["浏览"]))), t.favorites = bt.default(ot || (ot = n(["收藏夹"], ["收藏夹"]))), t.validNumberRequired = bt.default(lt || (lt = n(["请输入有效的美国电话号码。"], ["请输入有效的美国电话号码。"]))), t.opalSMSAccepted = bt.default(st || (st = n(["谢谢。请在一小时内尝试发送到你手机的链接。"], ["谢谢。请在一小时内尝试发送到你手机的链接。"]))), t.opalSMSError = bt.default(dt || (dt = n(["出错了，请从应用商店下载 Bing Search 应用。"], ["出错了，请从应用商店下载 Bing Search 应用。"]))), t.moreOnTopic = bt.default(ut || (ut = n(["展开有关", "的主题"], ["展开有关", "的主题"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["收起有关", "的主题"], ["收起有关", "的主题"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["热门主题"], ["热门主题"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["对数标度"], ["对数标度"]))), t.linearScale = bt.default(vt || (vt = n(["线性标度"], ["线性标度"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["你好! 我是新冠病毒肺炎常见问题帮助程序机器人，我将随时回答你的问题!"], ["你好! 我是新冠病毒肺炎常见问题帮助程序机器人，我将随时回答你的问题!"]))), t.dataTitle = bt.default(gt || (gt = n(["数据"], ["数据"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/covid.zh-hant.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__makeTemplateObject || function(e, t) {
            return Object.defineProperty ? Object.defineProperty(e, "raw", {
                value: t
            }) : e.raw = t, e
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i, r, o, l, s, d, u, c, f, p, m, v, h, g, b, k, y, C, w, x, T, z, S, I, A, D, M, E, j, P, B, F, L, O, R, _, N, V, U, q, H, G, W, K, Z, Q, Y, J, X, $, ee, te, ae, ne, ie, re, oe, le, se, de, ue, ce, fe, pe, me, ve, he, ge, be, ke, ye, Ce, we, xe, Te, ze, Se, Ie, Ae, De, Me, Ee, je, Pe, Be, Fe, Le, Oe, Re, _e, Ne, Ve, Ue, qe, He, Ge, We, Ke, Ze, Qe, Ye, Je, Xe, $e, et, tt, at, nt, it, rt, ot, lt, st, dt, ut, ct, ft, pt, mt, vt, ht, gt, bt = a("https://www.bing.com/covid/localization/template.ts");
        t.dataUpdate = bt.default(i || (i = n(["資料上次更新時間:"], ["資料上次更新時間:"]))), t.urlCopied = bt.default(r || (r = n(["已將網址複製到剪貼簿"], ["已將網址複製到剪貼簿"]))), t.bing = bt.default(o || (o = n(["Bing"], ["Bing"]))), t.covidTitle = bt.default(l || (l = n(["新冠肺炎疫情追蹤"], ["新冠肺炎疫情追蹤"]))), t.bingCovidTitle = bt.default(s || (s = n(["Microsoft Bing 新冠肺炎 (COVID-19) 疫情即時追蹤地圖"], ["Microsoft Bing 新冠肺炎 (COVID-19) 疫情即時追蹤地圖"]))), t.citiesAndProvinces = bt.default(d || (d = n(["地區"], ["地區"]))), t.noRegionalData = bt.default(u || (u = n(["目前尚無這個國家/地區的地區資料。請稍後再試。"], ["目前尚無這個國家/地區的地區資料。請稍後再試。"]))), t.activeCases = bt.default(c || (c = n(["確診待治癒病例"], ["確診待治癒病例"]))), t.recoveredCases = bt.default(f || (f = n(["治癒病例"], ["治癒病例"]))), t.fatalCases = bt.default(p || (p = n(["死亡病例"], ["死亡病例"]))), t.activeCasesForCallout = bt.default(m || (m = n(["確診待治癒人數"], ["確診待治癒人數"]))), t.recoveredCasesForCallout = bt.default(v || (v = n(["治癒人數"], ["治癒人數"]))), t.fatalCasesForCallout = bt.default(h || (h = n(["死亡人數"], ["死亡人數"]))), t.overview = bt.default(g || (g = n(["現況"], ["現況"]))), t.close = bt.default(b || (b = n(["關閉"], ["關閉"]))), t.selectARegion = bt.default(k || (k = n(["選取地區"], ["選取地區"]))), t.global = bt.default(y || (y = n(["全球"], ["全球"]))), t.globalStatus = bt.default(C || (C = n(["全球現況"], ["全球現況"]))), t.allRegions = bt.default(w || (w = n(["所有地區"], ["所有地區"]))), t.share = bt.default(x || (x = n(["分享"], ["分享"]))), t.dataInfo = bt.default(T || (T = n(["資料資訊"], ["資料資訊"]))), t.totalConfirmed = bt.default(z || (z = n(["確診病例總數"], ["確診病例總數"]))), t.totalConfirmedShort = bt.default(S || (S = n(["病例總數"], ["病例總數"]))), t.totalAreas = bt.default(I || (I = n(["共 ", " 個"], ["共 ", " 個"])), 0), t.hideInfo = bt.default(A || (A = n(["隱藏資訊以查看完整地圖"], ["隱藏資訊以查看完整地圖"]))), t.showInfo = bt.default(D || (D = n(["顯示資訊"], ["顯示資訊"]))), t.news = bt.default(M || (M = n(["新聞"], ["新聞"]))), t.helpfulResources = bt.default(E || (E = n(["說明與資訊"], ["說明與資訊"]))), t.quizTitle = bt.default(j || (j = n(["Stay safe, stay informed"], ["Stay safe, stay informed"]))), t.quizTitleCorona = bt.default(P || (P = n(["Coronavirus: Fact or Fiction"], ["Coronavirus: Fact or Fiction"]))), t.quizTitleDebunk = bt.default(B || (B = n(["Debunk the myths with this quiz"], ["Debunk the myths with this quiz"]))), t.quizTaketheQuiz = bt.default(F || (F = n(["Take the quiz"], ["Take the quiz"]))), t.seeMore = bt.default(L || (L = n(["查看更多"], ["查看更多"]))), t.dataFrom = bt.default(O || (O = n(["資料來源:"], ["資料來源:"]))), t.videos = bt.default(R || (R = n(["影片"], ["影片"]))), t.moreNews = bt.default(_ || (_ = n(["查看更多文章"], ["查看更多文章"]))), t.moreVideos = bt.default(N || (N = n(["查看更多影片"], ["查看更多影片"]))), t.map = bt.default(V || (V = n(["地圖:"], ["地圖:"]))), t.feedback = bt.default(U || (U = n(["提供意見"], ["提供意見"]))), t.feedbackQuestion = bt.default(q || (q = n(["您想就這項工具提供什麼樣的意見?"], ["您想就這項工具提供什麼樣的意見?"]))), t.feedbackReportIssue = bt.default(H || (H = n(["回報問題"], ["回報問題"]))), t.feedbackTellIssue = bt.default(G || (G = n(["請告訴我們您遇到的問題"], ["請告訴我們您遇到的問題"]))), t.feedbackShareIdea = bt.default(W || (W = n(["分享想法"], ["分享想法"]))), t.feedbackTellIdea = bt.default(K || (K = n(["請告訴我們您的想法"], ["請告訴我們您的想法"]))), t.feedbackGiveCompliment = bt.default(Z || (Z = n(["表達讚美"], ["表達讚美"]))), t.feedbackTellCompliment = bt.default(Q || (Q = n(["請告訴我們您喜歡它什麼地方"], ["請告訴我們您喜歡它什麼地方"]))), t.feedbackLegalConcern = bt.default(Y || (Y = n(["法律或隱私顧慮"], ["法律或隱私顧慮"]))), t.feedbackTellConcern = bt.default(J || (J = n(["請告訴我們您的顧慮"], ["請告訴我們您的顧慮"]))), t.feedbackTextEntry = bt.default(X || (X = n(["請在這裡輸入意見。為保護您的隱私，請勿提供個人資訊，像是地址、電話號碼等等。"], ["請在這裡輸入意見。為保護您的隱私，請勿提供個人資訊，像是地址、電話號碼等等。"]))), t.feedbackButtonBack = bt.default($ || ($ = n(["返回"], ["返回"]))), t.feedbackButtonSend = bt.default(ee || (ee = n(["傳送"], ["傳送"]))), t.feedbackThanks = bt.default(te || (te = n(["感謝您提供意見!"], ["感謝您提供意見!"]))), t.privacyStatement = bt.default(ae || (ae = n(["隱私權聲明"], ["隱私權聲明"]))), t.websiteDescription = bt.default(ne || (ne = n(["追蹤當地與全球的新冠肺炎 (COVID-19) 病例人數，包括地圖上的確診待治癒病例、治癒病例與死亡病例人數，以及最新的新聞和影片。"], ["追蹤當地與全球的新冠肺炎 (COVID-19) 病例人數，包括地圖上的確診待治癒病例、治癒病例與死亡病例人數，以及最新的新聞和影片。"]))), t.graphOverTime = bt.default(ie || (ie = n(["隨時間的擴散情形"], ["隨時間的擴散情形"]))), t.millionAbbreviation = bt.default(re || (re = n(["", " 百萬"], ["", " 百萬"])), 0), t.thousandAbbreviation = bt.default(oe || (oe = n(["", " 千"], ["", " 千"])), 0), t.upsellDesc = bt.default(le || (le = n(["下載 Bing 應用程式，在手機上追蹤最新疫情發展"], ["下載 Bing 應用程式，在手機上追蹤最新疫情發展"]))), t.upsellCTA = bt.default(se || (se = n(["立即下載"], ["立即下載"]))), t.upsellTitle = bt.default(de || (de = n(["關注新冠肺炎新聞"], ["關注新冠肺炎新聞"]))), t.upsellBubbleTitle = bt.default(ue || (ue = n(["追蹤新冠肺炎疫情"], ["追蹤新冠肺炎疫情"]))), t.dseUpsellChromeDesc = bt.default(ce || (ce = n(["新增我們的 Chrome 擴充功能，獲得 Bing 上最新的新冠肺炎疫情消息"], ["新增我們的 Chrome 擴充功能，獲得 Bing 上最新的新冠肺炎疫情消息"]))), t.dseUpsellFirefoxDesc = bt.default(fe || (fe = n(["新增我們的 Firefox 擴充套件，獲得 Bing 上最新的新冠肺炎疫情消息"], ["新增我們的 Firefox 擴充套件，獲得 Bing 上最新的新冠肺炎疫情消息"]))), t.dseUpsellCTA = bt.default(pe || (pe = n(["新增擴充功能"], ["新增擴充功能"]))), t.dseUpsellTitle = bt.default(me || (me = n(["做好防護措施，留意最新疫情"], ["做好防護措施，留意最新疫情"]))), t.dseUpsellBubbleTitle = bt.default(ve || (ve = n(["利用擴充功能來追蹤"], ["利用擴充功能來追蹤"]))), t.submit = bt.default(he || (he = n(["完成"], ["完成"]))), t.yearAbbreviation = bt.default(ge || (ge = n(["", " 年"], ["", " 年"])), 0), t.monthAbbreviation = bt.default(be || (be = n(["", " 個月"], ["", " 個月"])), 0), t.weekAbbreviation = bt.default(ke || (ke = n(["", " 週"], ["", " 週"])), 0), t.dayAbbreviation = bt.default(ye || (ye = n(["", " 天"], ["", " 天"])), 0), t.hourAbbreviation = bt.default(Ce || (Ce = n(["", " 小時"], ["", " 小時"])), 0), t.minuteAbbreviation = bt.default(we || (we = n(["", " 分鐘"], ["", " 分鐘"])), 0), t.yourLocation = bt.default(xe || (xe = n(["您的位置"], ["您的位置"]))), t.filterPlaceholder = bt.default(Te || (Te = n(["篩選位置"], ["篩選位置"]))), t.expand = bt.default(ze || (ze = n(["展開"], ["展開"]))), t.trends = bt.default(Se || (Se = n(["趨勢"], ["趨勢"]))), t.testingProcess = bt.default(Ie || (Ie = n(["檢測資訊"], ["檢測資訊"]))), t.testingInfoHeader = bt.default(Ae || (Ae = n(["資格限制與連絡資訊"], ["資格限制與連絡資訊"]))), t.testingProcessProtocol = bt.default(De || (De = n(["資格限制"], ["資格限制"]))), t.hotline = bt.default(Me || (Me = n(["專線電話"], ["專線電話"]))), t.partnerCompanies = bt.default(Ee || (Ee = n(["合作公司"], ["合作公司"]))), t.moreTestingLocations = bt.default(je || (je = n(["查看檢測地點 (", ")"], ["查看檢測地點 (", ")"])), 0), t.seeLess = bt.default(Pe || (Pe = n(["收起"], ["收起"]))), t.topTrends = bt.default(Be || (Be = n(["依確診病例總數比較"], ["依確診病例總數比較"]))), t.latestUpdates = bt.default(Fe || (Fe = n(["新冠肺炎最新疫情"], ["新冠肺炎最新疫情"]))), t.copyLink = bt.default(Le || (Le = n(["複製連結"], ["複製連結"]))), t.email = bt.default(Oe || (Oe = n(["電子郵件"], ["電子郵件"]))), t.cancel = bt.default(Re || (Re = n(["取消"], ["取消"]))), t.confirmed = bt.default(_e || (_e = n(["確診人數"], ["確診人數"]))), t.fatal = bt.default(Ne || (Ne = n(["死亡人數"], ["死亡人數"]))), t.recovered = bt.default(Ve || (Ve = n(["治癒人數"], ["治癒人數"]))), t.active = bt.default(Ue || (Ue = n(["確診待治癒人數"], ["確診待治癒人數"]))), t.permissionsToShowNearest = bt.default(qe || (qe = n(["若要查看您的位置，請在這裡啟用位置權限。"], ["若要查看您的位置，請在這裡啟用位置權限。"]))), t.overviewVertical = bt.default(He || (He = n(["現況"], ["現況"]))), t.newsvideos = bt.default(Ge || (Ge = n(["新聞與影片"], ["新聞與影片"]))), t.graphstrends = bt.default(We || (We = n(["圖形"], ["圖形"]))), t.localResources = bt.default(Ke || (Ke = n(["當地資源"], ["當地資源"]))), t.facebook = bt.default(Ze || (Ze = n(["Facebook"], ["Facebook"]))), t.linkedin = bt.default(Qe || (Qe = n(["LinkedIn"], ["LinkedIn"]))), t.twitter = bt.default(Ye || (Ye = n(["Twitter"], ["Twitter"]))), t.whatsapp = bt.default(Je || (Je = n(["WhatsApp"], ["WhatsApp"]))), t.reddit = bt.default(Xe || (Xe = n(["Reddit"], ["Reddit"]))), t.viber = bt.default($e || ($e = n(["Viber"], ["Viber"]))), t.lastUpdateMinutes = bt.default(et || (et = n(["", " 分鐘前更新"], ["", " 分鐘前更新"])), 0), t.phoneNumberPolicy = bt.default(tt || (tt = n(["一旦傳送電話號碼或電子郵件，即表示您同意 Microsoft 自動傳送單次訊息到此行動電話號碼或電子郵件。適用標準簡訊費率。"], ["一旦傳送電話號碼或電子郵件，即表示您同意 Microsoft 自動傳送單次訊息到此行動電話號碼或電子郵件。適用標準簡訊費率。"]))), t.msPrivacyTitle = bt.default(at || (at = n(["Microsoft 隱私權聲明"], ["Microsoft 隱私權聲明"]))), t.sendLink = bt.default(nt || (nt = n(["傳送連結"], ["傳送連結"]))), t.compare = bt.default(it || (it = n(["比較"], ["比較"]))), t.browse = bt.default(rt || (rt = n(["瀏覽"], ["瀏覽"]))), t.favorites = bt.default(ot || (ot = n(["常用列表"], ["常用列表"]))), t.validNumberRequired = bt.default(lt || (lt = n(["請輸入有效的美國手機號碼。"], ["請輸入有效的美國手機號碼。"]))), t.opalSMSAccepted = bt.default(st || (st = n(["感謝您。請在一小時內試試傳送到您手機的連結。"], ["感謝您。請在一小時內試試傳送到您手機的連結。"]))), t.opalSMSError = bt.default(dt || (dt = n(["發生錯誤，請從應用程式市集下載 Bing 搜尋應用程式。"], ["發生錯誤，請從應用程式市集下載 Bing 搜尋應用程式。"]))), t.moreOnTopic = bt.default(ut || (ut = n(["更多與", "有關的文章"], ["更多與", "有關的文章"])), 0), t.lessOnTopic = bt.default(ct || (ct = n(["較少與", "有關的文章"], ["較少與", "有關的文章"])), 0), t.trendingTopics = bt.default(ft || (ft = n(["熱門主題"], ["熱門主題"]))), t.durationAgo = bt.default(pt || (pt = n(["", " ago"], ["", " ago"])), 0), t.logScale = bt.default(mt || (mt = n(["對數刻度"], ["對數刻度"]))), t.linearScale = bt.default(vt || (vt = n(["線性刻度"], ["線性刻度"]))), t.botWelcomeMessage = bt.default(ht || (ht = n(["您好! 我是新冠肺炎常見問題小幫手機器人，可幫忙回答您的問題!"], ["您好! 我是新冠肺炎常見問題小幫手機器人，可幫忙回答您的問題!"]))), t.dataTitle = bt.default(gt || (gt = n(["資料"], ["資料"])))
    },
    "https://www.bing.com/covid/localization/covid.strings/index.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(e) {
                for (var t, a = 1, n = arguments.length; a < n; a++)
                    for (var i in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }).apply(this, arguments)
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = a("https://www.bing.com/covid/localization/localeHelper.ts"),
            r = a("https://www.bing.com/covid/localization/covid.strings/covid.ts"),
            o = a("https://www.bing.com/covid/localization/covid.strings/covid.ar-sa.ts"),
            l = a("https://www.bing.com/covid/localization/covid.strings/covid.cs-cz.ts"),
            s = a("https://www.bing.com/covid/localization/covid.strings/covid.bn-in.ts"),
            d = a("https://www.bing.com/covid/localization/covid.strings/covid.de-de.ts"),
            u = a("https://www.bing.com/covid/localization/covid.strings/covid.el-gr.ts"),
            c = a("https://www.bing.com/covid/localization/covid.strings/covid.da-dk.ts"),
            f = a("https://www.bing.com/covid/localization/covid.strings/covid.en-gb.ts"),
            p = a("https://www.bing.com/covid/localization/covid.strings/covid.es-es.ts"),
            m = a("https://www.bing.com/covid/localization/covid.strings/covid.fi-fi.ts"),
            v = a("https://www.bing.com/covid/localization/covid.strings/covid.he-il.ts"),
            h = a("https://www.bing.com/covid/localization/covid.strings/covid.hi-in.ts"),
            g = a("https://www.bing.com/covid/localization/covid.strings/covid.fr-fr.ts"),
            b = a("https://www.bing.com/covid/localization/covid.strings/covid.id-id.ts"),
            k = a("https://www.bing.com/covid/localization/covid.strings/covid.hu-hu.ts"),
            y = a("https://www.bing.com/covid/localization/covid.strings/covid.mr-in.ts"),
            C = a("https://www.bing.com/covid/localization/covid.strings/covid.it-it.ts"),
            w = a("https://www.bing.com/covid/localization/covid.strings/covid.ko-kr.ts"),
            x = a("https://www.bing.com/covid/localization/covid.strings/covid.ja-jp.ts"),
            T = a("https://www.bing.com/covid/localization/covid.strings/covid.ms-my.ts"),
            z = a("https://www.bing.com/covid/localization/covid.strings/covid.nb-no.ts"),
            S = a("https://www.bing.com/covid/localization/covid.strings/covid.nl-nl.ts"),
            I = a("https://www.bing.com/covid/localization/covid.strings/covid.pl-pl.ts"),
            A = a("https://www.bing.com/covid/localization/covid.strings/covid.pt-br.ts"),
            D = a("https://www.bing.com/covid/localization/covid.strings/covid.pt-pt.ts"),
            M = a("https://www.bing.com/covid/localization/covid.strings/covid.ru-ru.ts"),
            E = a("https://www.bing.com/covid/localization/covid.strings/covid.sv-se.ts"),
            j = a("https://www.bing.com/covid/localization/covid.strings/covid.te-in.ts"),
            P = a("https://www.bing.com/covid/localization/covid.strings/covid.th-th.ts"),
            B = a("https://www.bing.com/covid/localization/covid.strings/covid.tr-tr.ts"),
            F = a("https://www.bing.com/covid/localization/covid.strings/covid.vi-vn.ts"),
            L = a("https://www.bing.com/covid/localization/covid.strings/covid.zh-hans.ts"),
            O = a("https://www.bing.com/covid/localization/covid.strings/covid.zh-hant.ts"),
            R = {
                currentLanguage: r,
                ar_sa: o,
                cs_cz: l,
                bn_in: s,
                de_de: d,
                el_gr: u,
                da_dk: c,
                en_gb: f,
                es_es: p,
                fi_fi: m,
                he_il: v,
                hi_in: h,
                fr_fr: g,
                id_id: b,
                hu_hu: k,
                mr_in: y,
                it_it: C,
                ko_kr: w,
                ja_jp: x,
                ms_my: T,
                nb_no: z,
                nl_nl: S,
                pl_pl: I,
                pt_br: A,
                pt_pt: D,
                ru_ru: M,
                sv_se: E,
                te_in: j,
                th_th: P,
                tr_tr: B,
                vi_vn: F,
                zh_hans: L,
                zh_hant: O
            },
            _ = "en-us",
            N = ["en-us", "ar-sa", "cs-cz", "bn-in", "de-de", "el-gr", "da-dk", "en-gb", "es-es", "fi-fi", "he-il", "hi-in", "fr-fr", "id-id", "hu-hu", "mr-in", "it-it", "ko-kr", "ja-jp", "ms-my", "nb-no", "nl-nl", "pl-pl", "pt-br", "pt-pt", "ru-ru", "sv-se", "te-in", "th-th", "tr-tr", "vi-vn", "zh-hans", "zh-hant"];

        function V(e) {
            var t = i.getLocale(e, N);
            if (t && t !== _) {
                var a = R[t.split("-").join("_")];
                return n({}, r, a)
            }
            return n({}, r)
        }

        function U(e) {
            return function() {
                for (var t = [], a = 0; a < arguments.length; a++) t[a] = arguments[a];
                return R.currentLanguage[e].call(null, t)
            }
        }
        t.setLanguage = function(e) {
            R.currentLanguage = V(e)
        }, t.getAllStringsForLanguage = V, t.tryGetLocale = function(e, t) {
            void 0 === t && (t = _);
            var a = i.getLocale(e, N);
            return a || t
        }, t.hasLocalizedString = function(e, t) {
            var a = i.getIndexOfLocale(e, N);
            if (-1 === a) return !1;
            if (0 === t.length) return !0;
            var n = N[a];
            if (n === _) return !0;
            var r = R[n.split("-").join("_")];
            return !t.some(function(e) {
                return !r[e]
            })
        }, t.dataUpdate = U("dataUpdate"), t.urlCopied = U("urlCopied"), t.bing = U("bing"), t.covidTitle = U("covidTitle"), t.bingCovidTitle = U("bingCovidTitle"), t.citiesAndProvinces = U("citiesAndProvinces"), t.noRegionalData = U("noRegionalData"), t.activeCases = U("activeCases"), t.recoveredCases = U("recoveredCases"), t.fatalCases = U("fatalCases"), t.activeCasesForCallout = U("activeCasesForCallout"), t.recoveredCasesForCallout = U("recoveredCasesForCallout"), t.fatalCasesForCallout = U("fatalCasesForCallout"), t.overview = U("overview"), t.close = U("close"), t.selectARegion = U("selectARegion"), t.global = U("global"), t.globalStatus = U("globalStatus"), t.allRegions = U("allRegions"), t.share = U("share"), t.dataInfo = U("dataInfo"), t.totalConfirmed = U("totalConfirmed"), t.totalConfirmedShort = U("totalConfirmedShort"), t.totalAreas = U("totalAreas"), t.hideInfo = U("hideInfo"), t.showInfo = U("showInfo"), t.news = U("news"), t.helpfulResources = U("helpfulResources"), t.quizTitle = U("quizTitle"), t.quizTitleCorona = U("quizTitleCorona"), t.quizTitleDebunk = U("quizTitleDebunk"), t.quizTaketheQuiz = U("quizTaketheQuiz"), t.seeMore = U("seeMore"), t.dataFrom = U("dataFrom"), t.videos = U("videos"), t.moreNews = U("moreNews"), t.moreVideos = U("moreVideos"), t.map = U("map"), t.feedback = U("feedback"), t.feedbackQuestion = U("feedbackQuestion"), t.feedbackReportIssue = U("feedbackReportIssue"), t.feedbackTellIssue = U("feedbackTellIssue"), t.feedbackShareIdea = U("feedbackShareIdea"), t.feedbackTellIdea = U("feedbackTellIdea"), t.feedbackGiveCompliment = U("feedbackGiveCompliment"), t.feedbackTellCompliment = U("feedbackTellCompliment"), t.feedbackLegalConcern = U("feedbackLegalConcern"), t.feedbackTellConcern = U("feedbackTellConcern"), t.feedbackTextEntry = U("feedbackTextEntry"), t.feedbackButtonBack = U("feedbackButtonBack"), t.feedbackButtonSend = U("feedbackButtonSend"), t.feedbackThanks = U("feedbackThanks"), t.privacyStatement = U("privacyStatement"), t.websiteDescription = U("websiteDescription"), t.graphOverTime = U("graphOverTime"), t.millionAbbreviation = U("millionAbbreviation"), t.thousandAbbreviation = U("thousandAbbreviation"), t.upsellDesc = U("upsellDesc"), t.upsellCTA = U("upsellCTA"), t.upsellTitle = U("upsellTitle"), t.upsellBubbleTitle = U("upsellBubbleTitle"), t.dseUpsellChromeDesc = U("dseUpsellChromeDesc"), t.dseUpsellFirefoxDesc = U("dseUpsellFirefoxDesc"), t.dseUpsellCTA = U("dseUpsellCTA"), t.dseUpsellTitle = U("dseUpsellTitle"), t.dseUpsellBubbleTitle = U("dseUpsellBubbleTitle"), t.submit = U("submit"), t.yearAbbreviation = U("yearAbbreviation"), t.monthAbbreviation = U("monthAbbreviation"), t.weekAbbreviation = U("weekAbbreviation"), t.dayAbbreviation = U("dayAbbreviation"), t.hourAbbreviation = U("hourAbbreviation"), t.minuteAbbreviation = U("minuteAbbreviation"), t.yourLocation = U("yourLocation"), t.filterPlaceholder = U("filterPlaceholder"), t.expand = U("expand"), t.trends = U("trends"), t.testingProcess = U("testingProcess"), t.testingInfoHeader = U("testingInfoHeader"), t.testingProcessProtocol = U("testingProcessProtocol"), t.hotline = U("hotline"), t.partnerCompanies = U("partnerCompanies"), t.moreTestingLocations = U("moreTestingLocations"), t.seeLess = U("seeLess"), t.topTrends = U("topTrends"), t.latestUpdates = U("latestUpdates"), t.copyLink = U("copyLink"), t.email = U("email"), t.cancel = U("cancel"), t.confirmed = U("confirmed"), t.fatal = U("fatal"), t.recovered = U("recovered"), t.active = U("active"), t.permissionsToShowNearest = U("permissionsToShowNearest"), t.overviewVertical = U("overviewVertical"), t.newsvideos = U("newsvideos"), t.graphstrends = U("graphstrends"), t.localResources = U("localResources"), t.facebook = U("facebook"), t.linkedin = U("linkedin"), t.twitter = U("twitter"), t.whatsapp = U("whatsapp"), t.reddit = U("reddit"), t.viber = U("viber"), t.lastUpdateMinutes = U("lastUpdateMinutes"), t.phoneNumberPolicy = U("phoneNumberPolicy"), t.msPrivacyTitle = U("msPrivacyTitle"), t.sendLink = U("sendLink"), t.compare = U("compare"), t.browse = U("browse"), t.favorites = U("favorites"), t.validNumberRequired = U("validNumberRequired"), t.opalSMSAccepted = U("opalSMSAccepted"), t.opalSMSError = U("opalSMSError"), t.moreOnTopic = U("moreOnTopic"), t.lessOnTopic = U("lessOnTopic"), t.trendingTopics = U("trendingTopics"), t.durationAgo = U("durationAgo"), t.logScale = U("logScale"), t.linearScale = U("linearScale"), t.botWelcomeMessage = U("botWelcomeMessage"), t.dataTitle = U("dataTitle"), t.newCases = U("newCases"), t.mobility = U("mobility"), t.confirmedDistribution = U("confirmedDistribution"), t.activeTopTen = U("activeTopTen"), t.confirmedTrend = U("confirmedTrend"), t.activeTrend = U("activeTrend")
    },
    "https://www.bing.com/covid/localization/localeHelper.ts": function(e, t, a) {
        "use strict";

        function n(e, t) {
            if (!i(e)) return -1;
            var a = t.indexOf(e.toLowerCase());
            if (a > -1) return a;
            var n = t.findIndex(function(t) {
                return t.startsWith(e.toLowerCase())
            });
            if (n > -1) return n;
            var r = e.split("-")[0],
                o = t.findIndex(function(e) {
                    return e.startsWith(r.toLocaleLowerCase())
                });
            return o > -1 ? o : -1
        }

        function i(e) {
            try {
                return "test".toLocaleLowerCase(e), !0
            } catch (e) {
                return !1
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.getLocale = function(e, t) {
            var a = n(e, t);
            return a > -1 ? t[a] : null
        }, t.getIndexOfLocale = n, t.isValidLocale = i
    },
    "https://www.bing.com/covid/localization/template.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = function(e) {
            for (var t = [], a = 1; a < arguments.length; a++) t[a - 1] = arguments[a];
            return function() {
                for (var a = [], n = 0; n < arguments.length; n++) a[n] = arguments[n];
                var i = a[a.length - 1] || {},
                    r = [e[0]];
                return t.forEach(function(t, n) {
                    var o = "number" == typeof t ? a[t] : i[t];
                    r.push(o, e[n + 1])
                }), r.join("")
            }
        }
    },
    "https://www.bing.com/covid/location.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/localStorage.ts");
        t.haveLocationPermission = function() {
            return !0 === n.readFromLocalStorage("covid-location")
        }, t.getNearestLocation = function(e, a, i) {
            "undefined" != typeof navigator && navigator.geolocation && (e || t.haveLocationPermission()) && navigator.geolocation.getCurrentPosition(function(e) {
                if (n.writeToLocalStorage("covid-location", !0), e && e.coords) {
                    var r = e.coords.latitude,
                        o = e.coords.longitude;
                    t.getNearestToLocation(r, o, a, i)
                }
            }, function(e) {
                n.writeToLocalStorage("covid-location", !1)
            })
        }, t.getNearestToLocation = function(e, t, a, n) {
            var i, r = function(e, t, a, n) {
                    return Math.abs(e - a) + Math.abs(t - n)
                },
                o = null;
            for (var l in a)
                if (!a[l].areas || 0 === a[l].areas.length && a[l].lat && a[l].long)
                    if (o) {
                        var s = r(e, t, a[l].lat, a[l].long);
                        s < i && (o = a[l], i = s)
                    } else i = r(e, t, (o = a[l]).lat, o.long);
            o && n(o)
        }
    },
    "https://www.bing.com/covid/makeRequest.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__assign || function() {
            return (n = Object.assign || function(e) {
                for (var t, a = 1, n = arguments.length; a < n; a++)
                    for (var i in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }).apply(this, arguments)
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = a("https://www.bing.com/framework/apiFetchTools.ts"),
            r = a("https://www.bing.com/covid/config.ts"),
            o = a("https://www.bing.com/covid/helper.ts"),
            l = a("https://www.bing.com/covid/instrumentation.ts");
        var s = n({}, o.caseInsensitiveObj(n({}, o.getParamsFromURL(window.location.href))).getObj(), {
            ig: r.ig
        });
        o.isInIframe() && (s.FROM = "iframe");
        var d = "Basic " + btoa(r.token);

        function u(e, t, a, r, l, c) {
            void 0 === a && (a = null), void 0 === l && (l = 2), void 0 === c && (c = {});
            var f = new XMLHttpRequest;
            f.onreadystatechange = function() {
                4 === f.readyState && (f.status >= 200 && f.status < 300 ? t(!0, f) : 0 !== f.status && l > 0 ? u(e, t, a, r, l - 1) : t(!1, f))
            };
            var p = o.getParamsFromURL(e),
                m = n({}, s, p),
                v = e.split("?"),
                h = i.stringifyUrlParams(m, !1);
            for (var g in f.open(a ? "post" : "get", v[0] + h, !0), f.setRequestHeader("Authorization", d), c) f.setRequestHeader(g, c[g]);
            return "function" == typeof r && r(f), f.send(a), f
        }
        t.asyncRequest = u, t.makeRequest = function(e, t, a, n) {
            void 0 === n && (n = {});
            var i = null,
                r = null;
            return t && (i = JSON.stringify(t), r = function(e) {
                e.setRequestHeader("Content-Type", "application/json")
            }), new Promise(function(t, o) {
                u(e, function(a, n) {
                    if (a) {
                        var i = null;
                        if ("string" == typeof n.response && n.response) try {
                            i = JSON.parse(n.response)
                        } catch (t) {
                            l.logError("Failed to parse response " + n.response + " for " + e + " with error:" + t.message, t.file, t.line, t.column)
                        }
                        t(i)
                    } else o(n.status)
                }, i, r, a, n)
            })
        }
    },
    "https://www.bing.com/covid/quizClicks.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/localStorage.ts"),
            i = "covid-quiz-clicks";
        t.getQuizClicks = function() {
            return n.readFromLocalStorage(i)
        }, t.addToQuizClicks = function() {
            n.writeToLocalStorage(i, !0)
        }
    },
    "https://www.bing.com/covid/redux/actions/articleClustersData.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/server/safeAsync.ts"),
            o = a("https://www.bing.com/covid/makeRequest.ts");
        t.articleClustersData = function() {
            return function(e) {
                return n(this, void 0, void 0, function() {
                    var t, a;
                    return i(this, function(n) {
                        switch (n.label) {
                            case 0:
                                return t = o.makeRequest("/covid/trendingClusters"), [4, r.default(t)];
                            case 1:
                                return a = n.sent().result, e({
                                    type: 10,
                                    payload: a
                                }), [2]
                        }
                    })
                })
            }
        }
    },
    "https://www.bing.com/covid/redux/actions/data.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/framework/apiFetchTools.ts"),
            o = a("https://www.bing.com/server/covid/cache.ts"),
            l = a("https://www.bing.com/server/safeAsync.ts"),
            s = a("https://www.bing.com/covid/config.ts"),
            d = a("https://www.bing.com/covid/helper.ts"),
            u = a("https://www.bing.com/covid/instrumentation.ts"),
            c = a("https://www.bing.com/covid/makeRequest.ts"),
            f = a("https://www.bing.com/covid/timeDiff.ts"),
            p = o.memoizeAsync(function(e, t, a) {
                void 0 === t && (t = null);
                void 0 === a && (a = null);
                return n(this, void 0, void 0, function() {
                    var n, r;
                    return i(this, function(i) {
                        switch (i.label) {
                            case 0:
                                return n = k(t, a), [4, c.makeRequest("/covid/bingapi?q=" + encodeURIComponent(e) + "&api=news&count=5", null, 0, n)];
                            case 1:
                                return (r = i.sent()) && r.value.map(function(e) {
                                    if (e.datePublished) {
                                        var t = new Date(e.datePublished).valueOf() / 1e3,
                                            a = Math.round(Date.now() / 1e3);
                                        e.timeDiff = f.getTimeDifferenceString(Math.round((a - t) / 60))
                                    }
                                    var n = !(!e.provider || !e.provider[0]);
                                    if (n && e.provider[0].image && e.provider[0].image.thumbnail && e.provider[0].image.thumbnail.contentUrl) {
                                        var i = -1 !== e.provider[0].image.thumbnail.contentUrl.indexOf("?") ? "&" : "?";
                                        e.provider[0].image.thumbnail.contentUrl += i + "w=14&h=14"
                                    }
                                    return d.isOpal() && -1 != d.getHostFromURL(e.url).toLowerCase().indexOf("msn.com") && (e.url = d.setURLParam(e.url, "ocid", "opal0003")), e
                                }), [2, r]
                        }
                    })
                })
            }, 300),
            m = o.memoizeAsync(function(e, t, a) {
                void 0 === t && (t = null);
                void 0 === a && (a = null);
                return n(this, void 0, void 0, function() {
                    var n, r, o;
                    return i(this, function(i) {
                        switch (i.label) {
                            case 0:
                                return n = k(t, a), [4, c.makeRequest("/covid/bingapi?q=" + encodeURIComponent(e) + "&api=videos&count=7", null, 0, n)];
                            case 1:
                                return r = i.sent(), o = [], r && r.value && r.value.forEach(function(e) {
                                    var t = new Date(e.datePublished + "Z").valueOf() / 1e3,
                                        a = Math.round(Date.now() / 1e3),
                                        n = Math.round((a - t) / 60),
                                        i = f.getTimeDifferenceString(n),
                                        r = {
                                            name: e.name,
                                            webSearchUrl: e.webSearchUrl,
                                            thumbnailUrl: e.thumbnailUrl,
                                            datePublished: i,
                                            publisher: e.publisher,
                                            creator: e.creator,
                                            duration: e.duration
                                        };
                                    o.push(r)
                                }), 0 === o.length ? [2, r] : [2, {
                                    webSearchUrl: r.webSearchUrl,
                                    value: o
                                }]
                        }
                    })
                })
            }, 300),
            v = o.memoizeAsync(function(e, t, a, r, o) {
                void 0 === e && (e = null);
                void 0 === t && (t = null);
                void 0 === a && (a = "");
                void 0 === r && (r = "");
                return n(this, void 0, void 0, function() {
                    var n, l;
                    return i(this, function(i) {
                        switch (i.label) {
                            case 0:
                                return [4, c.makeRequest("/covid/msnapi?locationLat=" + encodeURIComponent(e.toString()) + "&locationLong=" + encodeURIComponent(t.toString()) + "&locationId=" + encodeURIComponent(a), null, 0)];
                            case 1:
                                return n = i.sent(), l = [], n && n.value && n.value[0] && n.value[0].subCards && n.value[0].subCards.forEach(function(e) {
                                    d.isOpal() && (e.url = d.setURLParam(e.url, "ocid", "opal0003"));
                                    var t = "";
                                    if (e.publishedDateTime) {
                                        var a = new Date(e.publishedDateTime).valueOf() / 1e3,
                                            n = Math.round(Date.now() / 1e3);
                                        t = f.getTimeDifferenceString(Math.round((n - a) / 60))
                                    }
                                    var i = [];
                                    if (e.provider && e.provider.logoUrl) {
                                        var r = -1 !== e.provider.logoUrl.indexOf("?") ? "&" : "?";
                                        i.push({
                                            type: "",
                                            name: e.provider.name,
                                            image: {
                                                thumbnail: {
                                                    contentUrl: e.provider.logoUrl + r + "w=14&h=14"
                                                }
                                            }
                                        })
                                    }
                                    var o = null;
                                    if (e.images && e.images[0] && e.images[0].url && e.provider && e.provider.logoUrl && e.provider.logoUrl !== e.images[0].url) {
                                        var r = -1 !== e.images[0].url.indexOf("?") ? "&" : "?";
                                        o = {
                                            thumbnail: {
                                                contentUrl: e.images[0].url
                                            },
                                            contentUrl: ""
                                        }
                                    }
                                    var s = {
                                        name: e.title,
                                        url: e.url,
                                        description: e.abstract,
                                        datePublished: e.publishedDateTime,
                                        timeDiff: t,
                                        category: "",
                                        provider: i,
                                        image: o
                                    };
                                    l.push(s)
                                }), 0 !== l.length ? [3, 3] : (u.logInfo("msnNewsApi", {
                                    status: "noResults",
                                    locationId: a
                                }), [4, p(r, e, t)]);
                            case 2:
                                return [2, i.sent()];
                            case 3:
                                return [2, {
                                    value: l,
                                    queryContext: null,
                                    msnPage: o
                                }]
                        }
                    })
                })
            }, 300);

        function h(e, t) {
            return void 0 === e && (e = s.rootId), void 0 === t && (t = null),
                function(a) {
                    return n(this, void 0, void 0, function() {
                        var n;
                        return i(this, function(i) {
                            return u.logInfo("areaSelected", {
                                id: e,
                                R: t
                            }), n = e === s.rootId ? "/covid" : "/covid/local/" + e, window.history.replaceState(null, null, "" + n + r.stringifyUrlParams(d.getParamsFromURL(location.href), !1)), a({
                                type: 1,
                                payload: {
                                    id: e,
                                    reason: t
                                }
                            }), a(g(e)), [2]
                        })
                    })
                }
        }

        function g(e) {
            return void 0 === e && (e = "world"),
                function(t, a) {
                    return n(this, void 0, void 0, function() {
                        var r, o, l, u, c, f, h, g;
                        return i(this, function(k) {
                            return d.isNewsAndVideosEnabled() ? (r = a(), o = r.byId[e], l = !1, u = null, c = null, d.stateToMSNLocationID[e.toLowerCase().trim()] ? (l = !0, f = e.replace("_unitedstates", ""), u = "https://www.msn.com/en-us/news/coronavirus/" + encodeURIComponent(f), c = d.stateToMSNLocationID[e.toLowerCase().trim()]) : e && s.market && d.marketToCountryId[s.market.toLocaleLowerCase().trim()] === e && (l = !0, u = "https://www.msn.com/" + encodeURIComponent(s.market) + "/news/coronavirus", c = d.marketToMSNFeedId[s.market.toLocaleLowerCase().trim()]), h = "coronavirus ", o && (h += o.displayName, "world" !== (g = o.parentId) && r.byId[g] && ("unitedstates" === r.byId[g].parentId && ("alaska_unitedstates" === g && -1 === o.displayName.toLowerCase().indexOf("borough") ? h += " borough" : "louisiana_unitedstates" === r.byId[g].id && -1 === o.displayName.toLowerCase().indexOf("parish") ? h += " parish" : "alaska_unitedstates" !== g && "louisiana_unitedstates" !== g && -1 === o.displayName.toLowerCase().indexOf("county") && (h += " county")), h += " " + r.byId[g].displayName)), o && (l ? function(e, t, a, r, o, l, s, d) {
                                void 0 === r && (r = null);
                                void 0 === o && (o = null);
                                void 0 === l && (l = "");
                                void 0 === s && (s = "");
                                n(this, void 0, void 0, function() {
                                    var n, u;
                                    return i(this, function(i) {
                                        switch (i.label) {
                                            case 0:
                                                return n = e(), [4, v(r, o, l, s, d)];
                                            case 1:
                                                return u = i.sent(), n.selectedInfo.id === t && a(b(u)), [2]
                                        }
                                    })
                                })
                            }(a, e, t, o.lat, o.long, c, h, u) : function(e, t, a, r, o, l) {
                                void 0 === o && (o = null);
                                void 0 === l && (l = null);
                                n(this, void 0, void 0, function() {
                                    var n, s;
                                    return i(this, function(i) {
                                        switch (i.label) {
                                            case 0:
                                                return n = e(), [4, p(a, o, l)];
                                            case 1:
                                                return s = i.sent(), n.selectedInfo.id === t && r(b(s)), [2]
                                        }
                                    })
                                })
                            }(a, e, h, t, o.lat, o.long), function(e, t, a, r, o, l) {
                                void 0 === o && (o = null);
                                void 0 === l && (l = null);
                                n(this, void 0, void 0, function() {
                                    var n, s;
                                    return i(this, function(i) {
                                        switch (i.label) {
                                            case 0:
                                                return n = e(), [4, m(a, o, l)];
                                            case 1:
                                                return s = i.sent(), n.selectedInfo.id === t && r(function(e) {
                                                    return {
                                                        type: 5,
                                                        payload: e
                                                    }
                                                }(s)), [2]
                                        }
                                    })
                                })
                            }(a, e, h, t, o.lat, o.long)), [2]) : [2]
                        })
                    })
                }
        }

        function b(e) {
            return {
                type: 4,
                payload: e
            }
        }

        function k(e, t) {
            void 0 === e && (e = null), void 0 === t && (t = null);
            var a = {};
            return e && t ? a["X-Search-Location"] = "lat:" + e.toString() + ";long:" + t.toString() + ";re:18000" : window.loc && window.loc.lat && window.loc.long && (a["X-Search-Location"] = "lat:" + window.loc.lat + ";long:" + window.loc.long + ";re:18000"), a
        }
        t.default = function() {
            return function(e, t) {
                return n(this, void 0, void 0, function() {
                    var a, n, r;
                    return i(this, function(i) {
                        switch (i.label) {
                            case 0:
                                return [4, l.default(c.makeRequest("/covid/data", null, 3))];
                            case 1:
                                return a = i.sent().result, (n = a) && (e({
                                    type: 0,
                                    payload: n
                                }), (r = t()).selectedInfo && r.selectedInfo.reason || e(h())), [2]
                        }
                    })
                })
            }
        }, t.areaSelected = h, t.getNews = g, t.newsDataReceived = b, t.sendBotMessage = function(e) {
            return function(t) {
                return n(this, void 0, void 0, function() {
                    return i(this, function(a) {
                        return t({
                            type: 9,
                            payload: e
                        }), [2]
                    })
                })
            }
        }
    },
    "https://www.bing.com/covid/redux/actions/graphData.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/covid/makeRequest.ts"),
            o = a("https://www.bing.com/server/safeAsync.ts");
        t.graphData = function() {
            return function(e) {
                return n(this, void 0, void 0, function() {
                    var t, a;
                    return i(this, function(n) {
                        switch (n.label) {
                            case 0:
                                return t = r.makeRequest("/covid/graphdata"), [4, o.default(t)];
                            case 1:
                                return a = n.sent().result, e({
                                    type: 6,
                                    payload: a
                                }), [2]
                        }
                    })
                })
            }
        }
    },
    "https://www.bing.com/covid/redux/actions/helpfulResources.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/server/safeAsync.ts"),
            o = a("https://www.bing.com/covid/makeRequest.ts");
        t.helpfulResources = function() {
            return function(e) {
                return n(this, void 0, void 0, function() {
                    var t, a;
                    return i(this, function(n) {
                        switch (n.label) {
                            case 0:
                                return t = o.makeRequest("/covid/helpfulresources"), [4, r.default(t)];
                            case 1:
                                return a = n.sent().result, e({
                                    type: 7,
                                    payload: a
                                }), [2]
                        }
                    })
                })
            }
        }
    },
    "https://www.bing.com/covid/redux/actions/mobilityData.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/server/safeAsync.ts"),
            o = a("https://www.bing.com/covid/makeRequest.ts"),
            l = a("https://www.bing.com/covid/helper.ts");
        t.mobilityData = function() {
            return function(e) {
                return n(this, void 0, void 0, function() {
                    var t, a;
                    return i(this, function(n) {
                        switch (n.label) {
                            case 0:
                                return "1" === l.getParamsFromURL(window.location.href).graphexp ? (t = o.makeRequest("/covid/mobilityData"), [4, r.default(t)]) : [2];
                            case 1:
                                return a = n.sent().result, e({
                                    type: 11,
                                    payload: a
                                }), [2]
                        }
                    })
                })
            }
        }
    },
    "https://www.bing.com/covid/redux/actions/size.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = function(e, t) {
            return {
                type: 2,
                payload: {
                    width: e,
                    height: t
                }
            }
        }
    },
    "https://www.bing.com/covid/redux/actions/testingLocationsData.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/server/safeAsync.ts"),
            o = a("https://www.bing.com/covid/makeRequest.ts");
        t.testingLocationsData = function() {
            return function(e) {
                return n(this, void 0, void 0, function() {
                    var t, a;
                    return i(this, function(n) {
                        switch (n.label) {
                            case 0:
                                return t = o.makeRequest("/covid/testinglocations"), [4, r.default(t)];
                            case 1:
                                return a = n.sent().result, e({
                                    type: 8,
                                    payload: a
                                }), [2]
                        }
                    })
                })
            }
        }
    },
    "https://www.bing.com/covid/redux/reducers/data.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 0:
                    return t.payload
            }
            return e
        }, t.newsData = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 4:
                    return t.payload
            }
            return e
        }, t.videosData = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 5:
                    return t.payload
            }
            return e
        }, t.trendsData = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 6:
                    return t.payload
            }
            return e
        }, t.helpfulResourcesData = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 7:
                    return t.payload
            }
            return e
        }, t.testingLocationsData = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 8:
                    return t.payload
            }
            return e
        }, t.articleClustersData = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 10:
                    return t.payload
            }
            return e
        }, t.byId = function(e, t) {
            switch (void 0 === e && (e = {}), t.type) {
                case 0:
                    var a = t.payload,
                        i = {};
                    return i.world = a, n(a, i), i
            }
            return e
        }, t.lastUpdated = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 0:
                    var a = t.payload;
                    return new Date(a.lastUpdated)
            }
            return e
        };
        var n = function(e, t) {
            if (e.areas)
                for (var a = 0, i = e.areas; a < i.length; a++) {
                    var r = i[a];
                    r.id ? t[r.id] = r : t[r.displayName] = r, n(r, t)
                }
        };
        t.selectedInfo = function(e, t) {
            switch (void 0 === e && (e = {
                id: "world",
                reason: null
            }), t.type) {
                case 1:
                    return t.payload.id && "" !== t.payload.id || (t.payload.id = "world"), t.payload
            }
            return e
        }, t.bingBotMessageData = function(e, t) {
            switch (void 0 === e && (e = []), t.type) {
                case 9:
                    return e.concat(t.payload)
            }
            return e
        }, t.mobilityData = function(e, t) {
            switch (void 0 === e && (e = null), t.type) {
                case 11:
                    return t.payload
            }
            return e
        }
    },
    "https://www.bing.com/covid/redux/reducers/index.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/redux/reducers/data.ts"),
            i = a("https://www.bing.com/covid/redux/reducers/size.ts"),
            r = a("https://www.bing.com/covid/redux/reducers/page.ts"),
            o = {
                data: n.default,
                byId: n.byId,
                selectedInfo: n.selectedInfo,
                width: i.width,
                height: i.height,
                lastUpdated: n.lastUpdated,
                panelsHidden: r.panelsHidden,
                newsData: n.newsData,
                videosData: n.videosData,
                trendsData: n.trendsData,
                helpfulResourcesData: n.helpfulResourcesData,
                testingLocationsData: n.testingLocationsData,
                bingBotMessageData: n.bingBotMessageData,
                articleClustersData: n.articleClustersData,
                mobilityData: n.mobilityData
            };
        t.default = o
    },
    "https://www.bing.com/covid/redux/reducers/page.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.panelsHidden = function(e, t) {
            switch (void 0 === e && (e = !1), t.type) {
                case 3:
                    return t.payload
            }
            return e
        }
    },
    "https://www.bing.com/covid/redux/reducers/size.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.width = function(e, t) {
            switch (void 0 === e && (e = 0), t.type) {
                case 2:
                    return t.payload.width
            }
            return e
        }, t.height = function(e, t) {
            switch (void 0 === e && (e = 0), t.type) {
                case 2:
                    return t.payload.height
            }
            return e
        }
    },
    "https://www.bing.com/covid/redux/store.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/node_modules/redux/es/index.js"),
            i = a("https://www.bing.com/covid/redux/reducers/index.ts"),
            r = a("https://www.bing.com/node_modules/redux-thunk/lib/index.js"),
            o = i.default,
            l = {
                data: null,
                selectedInfo: {
                    id: "world",
                    reason: null
                },
                byId: null,
                width: "undefined" != typeof window && window ? window.innerWidth : 0,
                height: "undefined" != typeof window && window ? window.innerHeight : 0,
                lastUpdated: null,
                panelsHidden: !1,
                newsData: null,
                videosData: null,
                trendsData: null,
                helpfulResourcesData: null,
                testingLocationsData: null,
                bingBotMessageData: [],
                articleClustersData: null,
                mobilityData: null
            },
            s = d();

        function d() {
            return n.createStore(n.combineReducers(o), l, n.applyMiddleware(r.default))
        }
        t.default = s, t.getNewStore = d
    },
    "https://www.bing.com/covid/registerServiceWorker.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/config.ts"),
            i = a("https://www.bing.com/covid/instrumentation.ts");
        t.register = function() {
            if (n.isPWA && "serviceWorker" in navigator && "NavigationPreloadManager" in window) {
                var e = "/covid/covid-service-worker.js";
                navigator.serviceWorker.register(e, {
                    updateViaCache: "all",
                    scope: "/covid"
                }).then(function(t) {
                    return i.logInfo("Covid service worker is registered successfully", {
                        url: e,
                        scope: t.scope
                    })
                }).catch(function(e) {
                    return i.logError("Failed to register covid service worker: " + e)
                })
            }
        }, t.unregister = function() {
            "serviceWorker" in navigator && navigator.serviceWorker.getRegistrations().then(function(e) {
                for (var t = 0, a = e; t < a.length; t++) {
                    var n = a[t];
                    "/covid" === n.scope && n.unregister().then(function(e) {
                        e && document.location.reload()
                    })
                }
            })
        }
    },
    "https://www.bing.com/covid/styles/covid.css": function(e, t, a) {
        var n = a("https://www.bing.com/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),
            i = a("https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/covid.css");
        "string" == typeof(i = i.__esModule ? i.default : i) && (i = [
            [e.i, i, ""]
        ]);
        var r = {
                insert: "head",
                singleton: !1
            },
            o = (n(i, r), i.locals ? i.locals : {});
        e.exports = o
    },
    "https://www.bing.com/covid/styles/graphVertical.css": function(e, t, a) {
        var n = a("https://www.bing.com/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),
            i = a("https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/graphVertical.css");
        "string" == typeof(i = i.__esModule ? i.default : i) && (i = [
            [e.i, i, ""]
        ]);
        var r = {
                insert: "head",
                singleton: !1
            },
            o = (n(i, r), i.locals ? i.locals : {});
        e.exports = o
    },
    "https://www.bing.com/covid/styles/testingLocations.css": function(e, t, a) {
        var n = a("https://www.bing.com/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),
            i = a("https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/testingLocations.css");
        "string" == typeof(i = i.__esModule ? i.default : i) && (i = [
            [e.i, i, ""]
        ]);
        var r = {
                insert: "head",
                singleton: !1
            },
            o = (n(i, r), i.locals ? i.locals : {});
        e.exports = o
    },
    "https://www.bing.com/covid/styles/topicClusters.css": function(e, t, a) {
        var n = a("https://www.bing.com/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),
            i = a("https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/topicClusters.css");
        "string" == typeof(i = i.__esModule ? i.default : i) && (i = [
            [e.i, i, ""]
        ]);
        var r = {
                insert: "head",
                singleton: !1
            },
            o = (n(i, r), i.locals ? i.locals : {});
        e.exports = o
    },
    "https://www.bing.com/covid/styles/upsells.css": function(e, t, a) {
        var n = a("https://www.bing.com/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),
            i = a("https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/upsells.css");
        "string" == typeof(i = i.__esModule ? i.default : i) && (i = [
            [e.i, i, ""]
        ]);
        var r = {
                insert: "head",
                singleton: !1
            },
            o = (n(i, r), i.locals ? i.locals : {});
        e.exports = o
    },
    "https://www.bing.com/covid/timeDiff.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            i = 60,
            r = 24 * i,
            o = 7 * r,
            l = 4.35 * o,
            s = 12 * l;
        t.getTimeDifferenceString = function(e) {
            return " · " + (e > s ? n.yearAbbreviation((e / s).toFixed()) : e > l ? n.monthAbbreviation((e / l).toFixed()) : e > o ? n.weekAbbreviation((e / o).toFixed()) : e > r ? n.dayAbbreviation((e / r).toFixed()) : e > i ? n.hourAbbreviation((e / i).toFixed()) : n.minuteAbbreviation(e))
        }
    },
    "https://www.bing.com/covid/upsellHelper.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = a("https://www.bing.com/covid/components/Icons.tsx"),
            i = a("https://www.bing.com/covid/localization/covid.strings/index.ts"),
            r = a("https://www.bing.com/covid/localStorage.ts"),
            o = a("https://www.bing.com/covid/config.ts"),
            l = {
                bubbleTitle: i.upsellBubbleTitle,
                title: i.upsellTitle,
                icon: n.opalLogo,
                desc: i.upsellDesc,
                ctaText: i.upsellCTA,
                titleStyle: "title",
                ctaLink: "https://bing.app.link/48iIQRrp14",
                upsellType: 0
            },
            s = {
                bubbleTitle: i.dseUpsellBubbleTitle,
                title: i.dseUpsellTitle,
                icon: n.dseCovidIcon,
                desc: o.isChromeDesktop ? i.dseUpsellChromeDesc : i.dseUpsellFirefoxDesc,
                ctaText: i.dseUpsellCTA,
                titleStyle: "titleNoMargin",
                ctaLink: "https://www.bing.com/set/browserextension/covid",
                upsellType: 1
            },
            d = ["en-us", "en-gb", "en-ca", "en-au", "fr-fr", "de-de", "es-es"];
        t.isDSEUpsellEnabled = function() {
            return d.indexOf(o.market) >= 0 && (o.isChromeDesktop || o.isFireFoxDesktop) && window.localStorage && ! function(e, t) {
                if (!e) return !1;
                var a = JSON.parse(e),
                    n = new Date(a);
                return n.setDate(n.getDate() + t - 1), new Date <= n
            }(r.readFromLocalStorage("lastDSETimestamp"), 7)
        }, t.getCurrentUpsellAttrribute = function() {
            var e = [l];
            return t.isDSEUpsellEnabled() && e.push(s), e.length > 0 ? e[(r.readFromLocalStorage(r.LocalStorageKeys.SessionCount) || 0) % e.length] : null
        }
    },
    "https://www.bing.com/framework/apiFetchTools.ts": function(e, t, a) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = ["reco-twocolumn"];
        t.stringifyUrlParams = function(e, t) {
            void 0 === t && (t = !0);
            var a = "",
                i = function() {
                    var i = "setopalflight" === r.toLowerCase(),
                        o = e[r];
                    "string" == typeof o && (!i || n.indexOf(o.toLowerCase()) < 0) && (o.indexOf(",") > 0 ? o = o.split(",") : (a = a + (t ? "&" : "?") + r + "=" + encodeURIComponent(o), t = !0)), Array.isArray(o) && o.map(function(e) {
                        (!i || n.indexOf(e.toLowerCase()) < 0) && (a = a + (t ? "&" : "?") + r + "=" + encodeURIComponent(e), t = !0)
                    })
                };
            for (var r in e) i();
            return a
        }, t.getCacheKey = function(e, t, a) {
            var n = a || ("undefined" != typeof window && window ? window.location.pathname : "/search");
            return 0 !== n.indexOf("/") && (n = "/" + n), n + (t ? "?" + t : "") + ":" + e
        }
    },
    "https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/covid.css": function(e, t, a) {
        (t = a("https://www.bing.com/node_modules/css-loader/dist/runtime/api.js")(!1)).push([e.i, 'html, body, div, span, applet, object, iframe,\r\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\r\na, abbr, acronym, address, big, cite, code,\r\ndel, dfn, em, img, ins, kbd, q, s, samp,\r\nsmall, strike, strong, sub, sup, tt, var,\r\nb, u, i, center,\r\ndl, dt, dd, ol, ul, li,\r\nfieldset, form, label, legend,\r\ntable, caption, tbody, tfoot, thead, tr, th, td,\r\narticle, aside, canvas, details, embed,\r\nfigure, figcaption, footer, header, hgroup,\r\nmenu, nav, output, ruby, section, summary,\r\ntime, mark, audio, video, textarea {\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n\tborder: 0;\r\n\tfont-size: 100%;\r\n\tfont: inherit;\r\n\tvertical-align: baseline;\r\n\tfont-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;\r\n\t-webkit-tap-highlight-color: transparent;\r\n}\r\n\r\nsvg {\r\n\tdisplay: block;\r\n}\r\n\r\n\r\n.wholePage {\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\toverflow: hidden;\r\n\tposition: absolute;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n}\r\n\r\n.desktop .content {\r\n\tdisplay: flex;\r\n\tflex: 1;\r\n\twidth: 100%;\r\n\tposition: relative;\r\n\toverflow: hidden;\r\n}\r\n\r\n.verticalWrapper {\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tposition: relative;\r\n\toverflow-x: auto;\r\n}\r\n\r\n.verticalHeader {\r\n\tbackground: rgba(247, 247, 247, 0.8);\r\n    backdrop-filter: blur(10px);\r\n\t-webkit-backdrop-filter: blur(10px);\r\n    padding: 16px 24px;\r\n    position: absolute;\r\n    top: 0;\r\n    width: 100%;\r\n    z-index: 300;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.verticalContent {\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\toverflow: auto;\r\n}\r\n\r\n.header {\r\n\tdisplay: flex;\r\n\tjustify-content: space-between;\r\n\tpadding: 12px 24px;\r\n\tborder-bottom: 1px solid #DDD;\r\n}\r\n\r\n.header .logo {\r\n\tpadding-right: 18px;\r\n\tmargin-right: 20px;\r\n\tborder-right: 1px solid #DDD;\r\n\tdisplay: block;\r\n}\r\n\r\n.headerButtons {\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n\tmargin: -6px;\r\n}\r\n\r\n.headerButtons > div {\r\n\tmargin-left: 12px;\r\n\tpadding: 6px;\r\n\tcursor: pointer;\r\n}\r\n\r\n.header .spacer {\r\n\tflex: 1 0 auto;\r\n}\r\n\r\n.header .pageName {\r\n\tmargin-bottom: 0;\r\n}\r\n\r\n.overview {\r\n    position: absolute;\r\n    top: 56px;\r\n    margin: 24px;\r\n    height: calc(100% - 104px);\r\n    box-sizing: border-box;\r\n    background: #FFFFFF;\r\n    border: 1px solid rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.15);\r\n    border-radius: 10px;\r\n    overflow: hidden;\r\n    display: block;\r\n    width: 320px;\r\n    padding: 16px 24px 24px 24px;\r\n    z-index: 1;\r\n}\r\n\r\n.overview:hover,\r\n.overview:focus {\r\n\toverflow-y: overlay;\r\n}\r\n\r\n.overview .pageName {\r\n    font-size: 16px;\r\n    margin-bottom: 12px;\r\n    line-height: 22px;\r\n}\r\n\r\n.overview .infoTile,\r\n.mobile .infoTile {\r\n\tbackground-color: white;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 6px;\r\n\tpadding: 8px 12px 12px 12px;\r\n\tborder-bottom: none;\r\n\tmargin-bottom: 24px;\r\n}\r\n\r\n.overview .infoTile .title {\r\n\tfont-size: 13px;\r\n\tmargin-bottom: 5px;\r\n}\r\n\r\n.locationTitle {\r\n\tfont-weight: 600;\r\n\tfont-size: 20px;\r\n\tline-height: 24px;\r\n\tcolor: #333333;\r\n}\r\n\r\n.verticalOptions {\r\n\tfont-weight: 600;\r\n    font-size: 13px;\r\n    line-height: 24px;\r\n    color: #333333;\r\n    display: grid;\r\n    white-space: nowrap;\r\n    grid-column-gap: 20px;\r\n    margin-bottom: -16px;\r\n}\r\n\r\n.verticalOption {\r\n\tcursor: pointer;\r\n\tline-height: 36px;\r\n}\r\n\r\n.verticalOption.selected {\r\n\tfont-weight: bold;\r\n}\r\n\r\n.closeCallout {\r\n\tposition: absolute;\r\n    top: 2px;\r\n    right: 2px;\r\n}\r\n\r\n.infoCallout {\r\n\tbackground-color: rgb(255, 255, 255);\r\n    overflow-x: hidden;\r\n    overflow-y: auto;\r\n    position: relative;\r\n\tborder-radius: 2px;\r\n\tpadding: 24px;\r\n\tmax-width: 300px;\r\n}\r\n\r\n.pageName {\r\n\tfont-size: 20px;\r\n\tfont-weight: 600;\r\n\tmargin-bottom: 25px;\r\n\tline-height: 24px;\r\n}\r\n\r\n.region .pageName {\r\n    margin-bottom: 4px;\r\n}\r\n\r\n.tab {\r\n\twidth: 320px;\r\n\tpadding: 24px 24px 0 24px;\r\n\tbox-sizing: border-box;\r\n\tborder-right: 1px solid rgba(0, 0, 0, 0.1);\r\n\tbox-shadow: 5px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tz-index: 201;\r\n\tbackground-color: white;\r\n\tdisplay: flex;\r\n    flex-direction: column;\r\n\tmax-height:100vh;\r\n}\r\n\r\n.infoTile {\r\n\tborder-bottom: #DDD 1px solid;\r\n\tcolor: #333;\r\n}\r\n\r\n.country .infoTileData {\r\n\tpadding-bottom: 20px;\r\n}\r\n\r\n.infoTile .bar {\r\n\tmargin-top: 12px;\r\n\theight: 8px;\r\n\tdisplay: flex;\r\n}\r\n\r\n.infoTile .slice {\r\n\tborder-radius: 6px;\r\n}\r\n\r\n.infoTile.graph.multiLineGraph {\r\n\tpadding: 4px;\r\n\tborder-bottom: none;\r\n}\r\n\r\n.graphTitle {\r\n    display: grid;\r\n    grid-template-columns: auto max-content;\r\n    font-size: 13px;\r\n    font-weight: 600;\r\n    padding-right: 8px;\r\n    margin-bottom: 6px;\r\n    grid-column-gap: 6px;\r\n}\r\n\r\n.graphTitle > *:nth-child(2) {\r\n\tborder: 1px solid #DDDDDD;\r\n    border-radius: 2px;\r\n    height: min-content;\r\n    font-size: 11px;\r\n    line-height: 16px;\r\n    font-weight: normal;\r\n    padding: 2px 4px 2px 8px;\r\n\talign-self: center;\r\n\tcursor: pointer;\r\n}\r\n\r\n.graphTitle svg {\r\n    display: inline-block;\r\n    position: relative;\r\n    top: 1px;\r\n}\r\n\r\n.multiLineGraph .graphTitle {\r\n    padding: 4px 8px 0;\r\n}\r\n\r\n.expandedGraph .graphTitle {\r\n\tpadding: 8px 8px;\r\n\tfont-size: 18px;\r\n}\r\n\r\n.expandedGraph .multiLineGraph .graphTitle {\r\n\tpadding: 8px 8px;\r\n\tfont-size: 18px;\r\n}\r\n\r\n.multiLineGraph .filter {\r\n    margin: 0 8px 0;\r\n}\r\n\r\n.legend {\r\n    display: grid;\r\n    padding-top: 16px;\r\n    grid-template-columns: 8px auto min-content;\r\n    align-items: center;\r\n    grid-gap: 16px 8px;\r\n    font-size: 13px;\r\n    line-height: 20px;\r\n}\r\n\r\n.country .legend {\r\n    padding-top: 16px;\r\n}\r\n\r\n.country .legend:first-child {\r\n    padding-top: 12px;\r\n}\r\n\r\n.covidHeader {\r\n\ttext-decoration: none;\r\n\tcolor: #222;\r\n}\r\n\r\n.covidHeader:visited {\r\n\tcolor: #222;\r\n}\r\n\r\n.legend .color {\r\n\twidth: 8px;\r\n    height: 8px;\r\n\tborder-radius: 8px;\r\n}\r\n\r\n.legend .description {\r\n\tfont-weight: 600;\r\n}\r\n\r\n.legend .total {\r\n\tcolor: #767676;\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n}\r\n\r\n.legend .delta {\r\n\ttext-align: right;\r\n\tfont-size: 11px;\r\n\tline-height: 15px;\r\n\tmargin-left: 8px;\r\n\tbackground-color: #F5F5F5;\r\n\tborder-radius: 2px;\r\n\tpadding: 1px 4px 2px 4px;\r\n\tfont-weight: 600;\r\n}\r\n\r\n.country .infoTile .title {\r\n\tmargin-bottom: 0px;\r\n\tfont-size: 16px;\r\n\tline-height: 22px;\r\n}\r\n\r\n.infoTile .title {\r\n\tcolor: #333333;\r\n\tfont-weight: 600;\r\n}\r\n\r\n.infoTile .confirmed {\r\n    font-size: 32px;\r\n    color: #DE3700;\r\n\tfont-weight: bold;\r\n\tline-height: 40px;\r\n}\r\n\r\n.infoTile .lastUpdate {\r\n\tfont-size: 13px;\r\n\tcolor: #767676;\r\n\tline-height: 20px;\r\n\tpadding-bottom: 12px;\r\n}\r\n\r\n.areas {\r\n\tpadding: 24px;\r\n    width: 100%;\r\n\tmargin-left: -24px;\r\n    overflow: hidden;\r\n}\r\n\r\n.areas:hover,\r\n.areas:focus {\r\n\toverflow-y: overlay;\r\n}\r\n\r\n.area {\r\n\tdisplay: grid;\r\n\tbackground: #FFF;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.05);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 6px;\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\r\n\tpadding: 10px 16px;\r\n\tcursor: pointer;\r\n\tuser-select: none;\r\n\tgrid-template-columns: auto min-content;\r\n\tgrid-column-gap: 5px;\r\n\tposition: relative;\r\n}\r\n\r\n.area:not(:last-child) {\r\n\tmargin-bottom: 12px;\r\n}\r\n\r\n.desktop .area:hover:not(input) {\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);\r\n\tborder: 1px solid #00809D;\r\n\tcolor: #00809D;\r\n}\r\n\r\n.area .areaName {\r\n    font-weight: 600;\r\n    overflow: hidden;\r\n    white-space: nowrap;\r\n\ttext-overflow: ellipsis;\r\n}\r\n\r\n.area .areaTotal {\r\n\tcolor: #767676;\r\n}\r\n\r\n.selectedAreas {\r\n\tpadding: 16px 0;\r\n\tborder-bottom: #DDD 1px solid;\r\n\tposition: relative;\r\n}\r\n\r\n.selectedArea,\r\n.area.selected {\r\n\tbackground: linear-gradient(98.7deg, rgba(255, 255, 255, 0.3) 0%, rgba(235, 235, 235, 0.3) 100%), radial-gradient(50% 351.19% at 50% 50%, rgba(0, 128, 157, 0.016) 0%, rgba(0, 128, 157, 0.02) 100%), #FFFFFF;\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);\r\n\tborder: 1px solid #00809D;\r\n}\r\n\r\n.area:hover .areaTotal,\r\n.area.selectedArea .areaName,\r\n.area.selectedArea .areaTotal,\r\n.area.selected .areaName,\r\n.area.selected .areaTotal {\r\n\tcolor: #00809D;\r\n}\r\n\r\n.hasChildren svg {\r\n    position: absolute;\r\n    right: 1px;\r\n    bottom: 1px;\r\n}\r\n\r\n.selectedArea .secondaryInfo {\r\n\tdisplay: grid;\r\n    grid-column-gap: 9px;\r\n    grid-template-columns: min-content min-content;\r\n    align-items: center;\r\n}\r\n\r\n.deep.areas > .area {\r\n\tmargin-right: 16px;\r\n\tmargin-left: 16px;\r\n}\r\n\r\n\r\ninput.area:focus {\r\n    outline: none;\r\n}\r\n\r\ninput.area {\r\n    width: 100%;\r\n\tborder: 1px solid #DDD;\r\n\tcursor: text;\r\n\tbox-sizing: border-box;\r\n\tpadding-right: 54px;\r\n}\r\n\r\ninput.area.open {\r\n\tborder-radius: 6px 6px 0 0;\r\n}\r\n\r\n.suggestions {\r\n    position: absolute;\r\n    z-index: 1;\r\n    background-color: white;\r\n    width: 100%;\r\n    top: 58px;\r\n    background: #FFF;\r\n    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n    border-radius: 0 0 6px 6px;\r\n    font-size: 13px;\r\n    line-height: 20px;\r\n    box-sizing: border-box;\r\n\tborder: 1px solid #DDD;\r\n\tborder-top: none;\r\n\tmax-height: 290px;\r\n    overflow-x: auto;\r\n}\r\n\r\n.suggestion {\r\n    padding: 8px 16px;\r\n    cursor: pointer;\r\n\theight: 50px;\r\n    box-sizing: border-box;\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n}\r\n\r\n.suggestion:not(:first-child) {\r\n    border-top: 1px #DDD solid;\r\n}\r\n\r\n.parentSugg {\r\n\tfont-size: 11px;\r\n\tline-height: 1.2em;\r\n\tcolor: #767676;\r\n}\r\n\r\n.suggArea {\r\n    overflow: hidden;\r\n    white-space: nowrap;\r\n\ttext-overflow: ellipsis;\r\n\tfont-weight: 600;\r\n}\r\n\r\n.locate {\r\n\tposition: absolute;\r\n    top: 23px;\r\n    right: 7px;\r\n    border-left: 1px #DDD solid;\r\n\tpadding-left: 12px;\r\n}\r\n\r\n.locationIcon {\r\n\tbackground-color: #F5F5F5;\r\n\tborder-radius: 16px;\r\n\theight: 28px;\r\n\twidth: 28px;\r\n\tpadding: 7px;\r\n\tbox-sizing: border-box;\r\n\tcursor: pointer;\r\n}\r\n\r\n.nearest .suggestion {\r\n\tbackground-color: #E7E0E0;\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n\tjustify-content: flex-start;\r\n\tmargin-bottom: 12px;\r\n\tborder: 1px solid #DDDDDD;\r\n}\r\n\r\n.nearest .locationIcon {\r\n\theight: 32px;\r\n\twidth: 32px;\r\n\tpadding: 9px;\r\n\tmargin-right: 8px;\r\n}\r\n\r\n.nearestInfo {\r\n\tposition: relative;\r\n\ttop: -2px;\r\n\twidth: 100%;\r\n    overflow: visible;\r\n}\r\n\r\n.nearestTitle {\r\n\tpadding: 0 18px;\r\n\tline-height: 23px;\r\n\tfont-size: 11px;\r\n\tcolor: #767676;\r\n}\r\n\r\n.mapContainer{\r\n\toverflow: hidden;\r\n\twidth: 150%;\r\n    height: calc(100% + 50px);\r\n    position: relative;\r\n    left: -25%;\r\n    top: -25px;\r\n}\r\n\r\n.mobile .mapContainer{\r\n\twidth: 250%;\r\n\theight: calc(100% + 300px);\r\n\tleft: -75%;\r\n\ttop: -150px;\r\n}\r\n\r\n.secondaryInfo > * {\r\n\tcolor: #767676;\r\n}\r\n\r\n.feedbackModal {\r\n\tposition: absolute;\r\n\ttop: 50%;\r\n\tleft: 50%;\r\n\ttransform: translate(-50%, -50%);\r\n\tbackground-color: white;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.04);\r\n\tbox-shadow: 0px 4px 12px rgba(0, 0, 0, 0.14);\r\n\tborder-radius: 6px;\r\n\twidth: 320px;\r\n}\r\n\r\n.feedbackModal .question {\r\n\tfont-size: 16px;\r\n\tline-height: 22px;\r\n\tcolor: #00809D;\r\n\tpadding: 16px;\r\n\tborder-bottom: #DDD 1px solid;\r\n}\r\n\r\n.feedbackInput {\r\n\tpadding: 16px;\r\n}\r\n\r\n.feedbackOption {\r\n\tbackground-color: #F5F5F5;\r\n\tborder-radius: 6px;\r\n\tpadding: 4px 16px;\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\r\n\tcolor: #666;\r\n\tmargin-bottom: 16px;\r\n\twidth: min-content;\r\n\twhite-space: nowrap;\r\n\tcursor: pointer;\r\n}\r\n\r\n.feedbackOption:hover,\r\n.feedbackOption:focus {\r\n\tbackground-color: #ececec;\r\n    color: #111;\r\n    border-color: #ccc;\r\n}\r\n\r\n.feedbackOption:last-child {\r\n\tmargin-bottom: 0;\r\n}\r\n\r\n.feedbackInput textarea {\r\n\twidth: 100%;\r\n\tfont-size: 13px;\r\n\theight: 120px;\r\n\tline-height: 20px;\r\n\tborder: 1px solid #DDDDDD;\r\n\tbox-sizing: border-box;\r\n\tpadding: 8px 12px;\r\n\tmargin-bottom: 10px;\r\n}\r\n\r\n.feedbackInput .privacyLink {\r\n\tcolor: #00809D;\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\r\n\ttext-decoration: none;\r\n}\r\n\r\n.feedbackActions {\r\n\tdisplay: flex;\r\n\tjustify-content: flex-end;\r\n\tmargin-top: 8px;\r\n}\r\n\r\n.feedbackButton {\r\n\tborder-radius: 2px;\r\n\tpadding: 6px 16px;\r\n\tcolor: white;\r\n\tbackground-color: #00809D;\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\r\n\tcursor: pointer;\r\n}\r\n\r\n.feedbackButton:first-child {\r\n\tmargin-right: 8px;\r\n\tbackground: #ECECEC;\r\n\tcolor: #666;\r\n}\r\n\r\n.thanks {\r\n\ttext-align: center;\r\n\tflex: 1 0 auto;\r\n\tfont-size: 14px;\r\n\tline-height: 20px;\r\n\tpadding: 6px 16px;\r\n}\r\n\r\n.closeFeedback {\r\n\tposition: absolute;\r\n    right: 0;\r\n\ttop: -24px;\r\n\tcursor: pointer;\r\n}\r\n\r\n.expandedGraph {\r\n\tposition: absolute;\r\n\twidth: 80%;\r\n\tmin-width:560px;\r\n\ttop: 50%;\r\n\tleft: 50%;\r\n\ttransform: translate(-50%, -50%);\r\n\tbackground-color: white;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 6px;\r\n}\r\n.graphModal .overlay {\r\n\topacity: 0.8;\r\n}\r\n\r\n.closeRegion {\r\n    position: absolute;\r\n    top: 20px;\r\n    left: 100%;\r\n    padding: 14px 9px 14px 6px;\r\n\tbackground-color: #F5F5F5;\r\n\tborder-radius: 0 6px 6px 0;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\r\n    box-shadow: 5px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-left: none;\r\n}\r\n\r\n.closeRegion svg {\r\n\ttransition: transform 200ms linear;\r\n}\r\n\r\n.hidden .closeRegion svg {\r\n\ttransform: rotate(180deg);\r\n}\r\n\r\n/***************************\r\n*******MOBILE STYLES********\r\n****************************/\r\n\r\n.mobile .content {\r\n    display: flex;\r\n    height: 100vh;\r\n    width: 100%;\r\n\tposition: absolute;\r\n\toverflow-x: hidden;\r\n\toverflow-y: auto;\r\n\tbackground-color: #C8C8C8;\r\n}\r\n\r\n.mobile .header {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    border-bottom: 1px solid #DDD;\r\n    position: fixed;\r\n    z-index: 100;\r\n    background: rgba(247, 247, 247, 0.8);\r\n    backdrop-filter: blur(10px);\r\n\t-webkit-backdrop-filter: blur(10px);\r\n    width: 100%;\r\n    font-size: 16px;\r\n    padding: 10px 16px 10px 10px;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.mobile .header .pageName {\r\n    font-size: 16px;\r\n    line-height: 20px;\r\n}\r\n\r\n.mobile .header .logo {\r\n    padding-right: 12px;\r\n    margin-right: 12px;\r\n}\r\n\r\n.mobile .map {\r\n\tposition: fixed;\r\n\twidth: 100%;\r\n}\r\n\r\n.mobile .information {\r\n\twidth: 100%;\r\n\tpadding: 8px 16px 0 16px;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.05);\r\n\tbox-shadow: 0px -3px 5px rgba(0, 0, 0, 0.1);\r\n\tborder-radius: 10px 10px 0px 0px;\r\n\tbox-sizing: border-box;\r\n\tz-index: 100;\r\n\tposition: absolute;\r\n\tbackground-color: rgba(255, 255, 255, 0.9);\r\n\tbackdrop-filter: blur(10px);\r\n\t-webkit-backdrop-filter: blur(10px);\r\n}\r\n\r\n.mobile .information {\r\n    padding: 8px 24px 0 24px;\r\n}\r\n\r\n.mobile .legend {\r\n\tpadding-top: 12px;\r\n}\r\n\r\n.mobile .infoTileData {\r\n\tmargin-top: 8px;\r\n\tmargin-bottom: 12px;\r\n}\r\n\r\n.mobile .infoTile .bar {\r\n    margin-top: 0;\r\n}\r\n\r\n.mobile .infoTile .lastUpdate {\r\n\tpadding-bottom: 0;\r\n}\r\n\r\n.mobile .segmentPanel {\r\n\tpadding: 0;\r\n}\r\n\r\n.mobile .segmentTitle {\r\n\tfont-size: 15px;\r\n}\r\n\r\n.mobile .helpfulResourceCard{\r\n    background-color: white;\r\n    border: 1px solid rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n    border-radius: 6px;\r\n    padding: 8px 12px 12px 12px;\r\n    border-bottom: none;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.mobile .area,\r\n.mobile .legend {\r\n\t-webkit-tap-highlight-color: transparent;\r\n\tfont-size: 14px;\r\n\tline-height: 20px;\r\n}\r\n\r\n.mobile .secondaryInfo {\r\n    display: grid;\r\n    align-items: center;\r\n}\r\n\r\n.mobile .information .secondaryInfo {\r\n    grid-template-columns: min-content min-content;\r\n\tgrid-column-gap: 16px;\r\n}\r\n\r\n.mobile .information .areaName,\r\n.mobile .information  .secondaryInfo > * {\r\n\tcolor: #DE3700;\r\n}\r\n\r\n.mobile .secondaryInfo svg {\r\n\ttransform: rotate(180deg);\r\n\ttransition: transform 200ms ease;\r\n}\r\n\r\n.mobile .information > .area {\r\n    margin-bottom: 16px;\r\n    margin-top: 12px;\r\n}\r\n\r\n.mobile .pullbar {\r\n\theight: 5px;\r\n\twidth: 75px;\r\n\tbackground-color: #C4C4C4;\r\n\tborder-radius: 100px;\r\n    position: relative;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n}\r\n\r\n.mobile .titleContainer {\r\n\tflex-direction: row;\r\n    display: flex;\r\n    justify-content: space-between;\r\n}\r\n\r\n.mobile .shareLinks {\r\n\twidth: 100%;\r\n\tmargin-left: 0px;\r\n}\r\n\r\n.mobile .shareItem {\r\n\tborder-bottom: solid 1px #ddd;\r\n    padding: 10px;\r\n    margin: 0px;\r\n}\r\n\r\n.mobileShareContainer{\r\n\tflex-direction: column;\r\n    height: 100%;\r\n    width: 100%;\r\n\toverflow: hidden;\r\n\tposition: absolute;\r\n    top: 0;\r\n\tleft: 0;\r\n\tbackground: #FFF;\r\n\tdisplay: flex;\r\n}\r\n\r\n.mobile .shareImage{\r\n\twidth: 100%;\r\n    height: 197px;\r\n    object-fit: cover;\r\n}\r\n\r\n.mobile .shareLinks .title {\r\n\tmargin-left: 10px;\r\n}\r\n\r\n.mobile .legend .delta {\r\n\tfont-size: 12px;\r\n}\r\n\r\n.dropdown {\r\n\tbackground-color: rgba(255, 255, 255, 0.9);\r\n\tbackdrop-filter: blur(10px);\r\n\t-webkit-backdrop-filter: blur(10px);\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100%;\r\n    top: 0;\r\n    left: 0;\r\n    z-index: 200;\r\n\tbox-sizing: border-box;\r\n\ttransform: translateY(0);\r\n\tdisplay: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n/* dropdown animation */\r\n.opening .dropdown {\r\n\tanimation: slideFromBottom 300ms ease-in;\r\n}\r\n.closing .dropdown {\r\n\tanimation: slideFromBottom 300ms ease-out;\r\n\tanimation-direction: reverse;\r\n\ttransform: translateY(100%);\r\n}\r\n/**/\r\n\r\n.dropdown .pageTitle {\r\n    margin: 0;\r\n    padding: 24px;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    padding-bottom: 16px;\r\n    font-size: 18px;\r\n    font-weight: 600;\r\n\tline-height: 24px;\r\n\tcolor: #333;\r\n}\r\n\r\n.dropdown .selectedAreas {\r\n\tpadding-top: 0;\r\n}\r\n\r\n.dropdown .locate {\r\n\ttop: 7px;\r\n}\r\n\r\n.dropdownVerts {\r\n\tdisplay: grid;\r\n\tgrid-template-columns: 1fr 1fr;\r\n\tjustify-items: center;\r\n\tmargin-top: 16px;\r\n\tgrid-row-gap: 12px;\r\n\tborder-bottom: 1px solid #DDD;\r\n}\r\n\r\n.dropdownVert.selected {\r\n\tfont-weight: bold;\r\n}\r\n\r\n.dropdownOptions {\r\n\twidth: 100%;\r\n    height: 100%;\r\n    padding: 0 24px;\r\n\toverflow: auto;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tbox-sizing: border-box;\r\n}\r\n\r\n.dropdownSubmit {\r\n\tpadding: 16px;\r\n\tbackground: rgba(249, 249, 249, 0.9);\r\n\tbackdrop-filter: blur(8px);\r\n\tborder-top: 1px solid rgba(221, 221, 221, 0.9);\r\n\tmargin-right: -24px;\r\n    margin-left: -24px;\r\n}\r\n\r\n.dropdownSubmit > * {\r\n\tcolor: white;\r\n\tfont-size: 14px;\r\n\tfont-weight: 600;\r\n\tline-height: 20px;\r\n\twidth: 180px;\r\n\ttext-align: center;\r\n\tpadding-top: 8px;\r\n\tpadding-bottom: 12px;\r\n\tbackground: linear-gradient(102.53deg, #069ABC 0%, rgba(0, 128, 157, 0) 100%), linear-gradient(0deg, #00809D, #00809D), #FFFFFF;\r\n\tborder-radius: 100px;\r\n\tposition: relative;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n}\r\n\r\n.mobile .areas {\r\n\tpadding: 16px 24px;\r\n\toverflow: unset;\r\n}\r\n\r\n.modal,\r\n.mobileMenuPanel {\r\n    z-index: 500;\r\n    position: absolute;\r\n    height: 100%;\r\n    width: 100%;\r\n    top: 0;\r\n\tleft: 0;\r\n}\r\n\r\n.overlay {\r\n    width: 100%;\r\n\theight: 100%;\r\n\tbackground-color: black;\r\n\topacity: 0.5;\r\n}\r\n\r\n/*overlay animation*/\r\n.opening .overlay {\r\n\tanimation: solidify 200ms ease-in;\r\n}\r\n.closing .overlay {\r\n\tanimation: solidify 200ms ease-in;\r\n\tanimation-direction: reverse;\r\n\topacity: 0;\r\n}\r\n/**/\r\n\r\n.mobileMenu {\r\n    width: 300px;\r\n    background-color: white;\r\n    padding: 16px;\r\n    height: 100%;\r\n\tposition: absolute;\r\n\ttransform: translateX(0);\r\n    right: 0;\r\n    top: 0;\r\n}\r\n\r\n/* menu panel animation */\r\n.opening .mobileMenu {\r\n\tanimation: slideFromRight 200ms ease-in;\r\n}\r\n.closing .mobileMenu {\r\n\tanimation: slideFromRight 200ms ease-out;\r\n\tanimation-direction: reverse;\r\n\ttransform: translateX(100%);\r\n}\r\n/**/\r\n\r\n.menuOptions {\r\n    margin-top: 40px;\r\n}\r\n\r\n.menuOption {\r\n\tdisplay: flex;\r\n    font-size: 16px;\r\n    line-height: 1.2em;\r\n    padding: 12px 0;\r\n    align-items: center;\r\n    border-bottom: #DDD 1px solid;\r\n}\r\n\r\n.menuOption:last-child {\r\n\tborder-bottom: none;\r\n}\r\n\r\n.menuOption > svg {\r\n\tpadding: 8px;\r\n\tmargin-right: 12px;\r\n}\r\n\r\n.menuOption > div {\r\n\tmargin-bottom: 3px;\r\n}\r\n\r\n.mobile input.area {\r\n\tz-index: 60;\r\n}\r\n\r\n.mobile .suggestions {\r\n\tmax-height: 240px;\r\n\tz-index: 60;\r\n    top: 42px;\r\n}\r\n\r\n.mobile .locate {\r\n\tz-index: 61;\r\n}\r\n\r\n.mobile .filterOverlay {\r\n\tbackground-color: black;\r\n\topacity: 0.2;\r\n\tposition: fixed;\r\n\theight: 100%;\r\n\twidth: 100%;\r\n\ttop: 0;\r\n\tleft: 0;\r\n\tz-index: 10;\r\n}\r\n\r\n.mobile .infoTile {\r\n\tpadding: 16px;\r\n}\r\n\r\n.verticalSwipe {\r\n    width: calc(100% + 16px);\r\n    margin-right: -24px;\r\n    margin-left: -24px;\r\n    box-sizing: content-box;\r\n    padding: 0 16px;\r\n    border-bottom: 1px solid #DDD;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.mobileVerticals {\r\n    display: grid;\r\n    scroll-behavior: smooth;\r\n    grid-column-gap: 12px;\r\n    white-space: nowrap;\r\n    font-weight: 600;\r\n\toverflow-x: auto;\r\n}\r\n\r\n.verticalIndicator {\r\n\twidth: 100%;\r\n\theight: 3px;\r\n\tbackground-color: #00809D;\r\n}\r\n\r\n.mobileVertOption {\r\n\tfont-size: 14px;\r\n\tline-height: 20px;\r\n\tpadding: 0 8px 12px 8px;\r\n}\r\n\r\n.mobileVertOption.selected {\r\n\tfont-weight: bold;\r\n}\r\n\r\n@keyframes solidify {\r\n    0% {\r\n        opacity: 0\r\n    }\r\n    100% {\r\n        opacity: 0.5\r\n    }\r\n}\r\n\r\n@keyframes slideFromRight {\r\n\t0% {\r\n\t\ttransform: translateX(100%);\r\n\t}\r\n\t100% {\r\n\t\ttransform: translateX(0);\r\n\t}\r\n}\r\n\r\n@keyframes slideFromBottom {\r\n\t0% {\r\n\t\ttransform: translateY(100%);\r\n\t}\r\n\t100% {\r\n\t\ttransform: translateY(0);\r\n\t}\r\n}\r\n\r\n@keyframes expand {\r\n\t0% {\r\n\t\tmax-height: 0;\r\n\t}\r\n\t100% {\r\n\t\tmax-height: 2000px;\r\n\t}\r\n}\r\n\r\n@keyframes panelSlideOut {\r\n\t0% {\r\n\t\ttransform: translateX(0);\r\n\t\tposition: absolute;\r\n\t}\r\n\t100%{\r\n\t\ttransform: translateX(-100%);\r\n\t\tposition: static;\r\n\t}\r\n}\r\n\r\n@keyframes panelSlideIn {\r\n\t0% {\r\n\t\ttransform: translateX(-100%);\r\n\t\tposition: absolute;\r\n\t}\r\n\t99%{\r\n\t\tposition: absolute;\r\n\t}\r\n\t100% {\r\n\t\ttransform: translateX(0);\r\n\t\tposition: static;\r\n\t}\r\n}\r\n\r\n@keyframes panelOpen {\r\n\t0% {\r\n\t\ttransform: translateX(-100%);\r\n\t}\r\n\t100% {\r\n\t\ttransform: translateX(0);\r\n\t}\r\n}\r\n\r\n.segmentPanel {\r\n\twidth: 100%;\r\n\tpadding-right: 20px;\r\n\toverflow: hidden;\r\n}\r\n\r\n.apiContentLink {\r\n\ttext-decoration: none;\r\n}\r\n\r\n.videoContent {\r\n\tdisplay: flex;\r\n\tflex-wrap: wrap;\r\n\tjustify-content: space-between;\r\n}\r\n\r\n.videoCard {\r\n\tbackground: #FFFFFF;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.05);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 6px;\r\n\tmargin-bottom: 8px;\r\n\twidth: 100%;\r\n\tmax-height: 266px;\r\n\tbox-sizing: border-box;\r\n\toverflow: hidden;\r\n}\r\n\r\n.seeMoreButton {\r\n\twidth: 170px;\r\n    height: 36px;\r\n    background: #FFFFFF;\r\n    border: 1px solid rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n    border-radius: 100px;\r\n    font-weight: 600;\r\n    font-size: 14px;\r\n    line-height: 36px;\r\n    color: #767676;\r\n    text-align: center;\r\n}\r\n\r\n.seeMoreContainer {\r\n    display: flex;\r\n    justify-content: center;\r\n\tpadding-top: 8px;\r\n\tpadding-bottom: 8px;\r\n}\r\n\r\n.miniVideoCard {\r\n\twidth: calc(50% - 4px);\r\n}\r\n\r\n.videoCard .videoImage{\r\n\twidth: 100%;\r\n\theight: 184px;\r\n\tobject-fit: cover;\r\n    background-color: black;\r\n}\r\n\r\n.miniVideoCard .videoImage{\r\n\theight: 88px;\r\n\tflex: 1 0 auto;\r\n}\r\n\r\n.videoCard .info {\r\n\tpadding: 8px;\r\n}\r\n\r\n.videoCard .videoSource {\r\n\ttext-overflow: ellipsis;\r\n\twhite-space: nowrap;\r\n}\r\n\r\n.videoCard .videoTimestamp,\r\n.videoCard .videoSource {\r\n\tfont-size: 12px;\r\n\tline-height: 18px;\r\n\tcolor: #767676;\r\n\theight: 18px;\r\n\toverflow: hidden;\r\n\tmargin-top: 6px;\r\n}\r\n\r\n.videoCard .thumbnailContainer{\r\n\tposition: relative;\r\n}\r\n\r\n.videoCard .playIcon {\r\n\tmargin-left: auto;\r\n\tmargin-right: auto;\r\n\tposition: absolute;\r\n\ttop: 50%;\r\n    left: 50%;\r\n    transform: translate(-50%, -50%);\r\n}\r\n\r\n.videoCard .title {\r\n\tfont-weight: 500;\r\n\tfont-size: 14px;\r\n\tmax-height: 40px;\r\n\tline-height: 20px;\r\n\tcolor: #333333;\r\n\toverflow: hidden;\r\n\ttext-overflow: ellipsis;\r\n\twidth: 100%;\r\n\t-webkit-line-clamp: 2;\r\n\tdisplay: -webkit-box;\r\n\t-webkit-box-orient: vertical;\r\n}\r\n\r\n.miniVideoCard .title {\r\n\theight: 60px;\r\n\tmax-height: 60px;\r\n\t-webkit-line-clamp: 3;\r\n}\r\n\r\n.videoCard .sourceContainer {\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n\toverflow: hidden;\r\n}\r\n\r\n.helpfulResourceTitle{\r\n\twhite-space: nowrap;\r\n\toverflow: hidden;\r\n\tdisplay: block;\r\n\ttext-overflow: ellipsis;\r\n\tfont-size: 13px;\r\n\tfont-weight: 600;\r\n\tcolor: #444;\r\n}\r\n\r\n.helpfulResourceCard .seeMoreHelpful div\r\n{\r\n\tcursor: pointer;\r\n\tcolor: #767676;\r\n}\r\n\r\n.helpfulResourceCard .seeMoreHelpful\r\n{\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n}\r\n\r\n.helpfulResourceCard .seeMoreWithIcon\r\n{\r\n\tmargin-right: 8px;\r\n}\r\n\r\n.helpfulResourceCard .infoContainer .provider{\r\n\tmargin-top: 0px;\r\n\tmargin-bottom: 10px;\r\n}\r\n\r\n.helpfulResourceCard .infoContainer:last-child .provider{\r\n\tmargin-bottom: 0px;\r\n}\r\n\r\n.newsCard {\r\n\tbackground: #FFFFFF;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.05);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 6px;\r\n\theight: 100px;\r\n\tpadding: 12px 12px;\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n\t-moz-box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n\tbox-sizing: border-box;\r\n\tmargin-bottom: 8px;\r\n}\r\n\r\n.newsCard .newsImage{\r\n\twidth: 76px;\r\n\theight: 76px;\r\n\tborder-radius: 6px;\r\n\tobject-fit: cover;\r\n\tmargin-right: 12px;\r\n\tflex: 1 0 auto;\r\n}\r\n\r\n.newsCard .title {\r\n\tfont-weight: 600;\r\n\tfont-size: 13px;\r\n\tmax-lines: 3;\r\n\theight: 54px;\r\n\tline-height: 18px;\r\n\tcolor: #333333;\r\n\toverflow: hidden;\r\n\ttext-overflow: ellipsis;\r\n}\r\n\r\n.newsCard .newsProviderThumbnail {\r\n\twidth: 14px;\r\n\theight: 14px;\r\n\tobject-fit: none;\r\n\tmargin-right: 6px;\r\n}\r\n\r\n.provider {\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n\talign-items: center;\r\n\twidth: 100%;\r\n\toverflow: hidden;\r\n\tmargin-top: 8px;\r\n}\r\n\r\n.providerName {\r\n\tfont-size: 11px;\r\n\tline-height: 17px;\r\n\tcolor: #767676;\r\n\tmargin-right: 6px;\r\n\twhite-space: nowrap;\r\n\toverflow: hidden;\r\n\ttext-overflow: ellipsis;\r\n}\r\n\r\n.publishedTime {\r\n\tflex: 1;\r\n\tfont-size: 11px;\r\n\tline-height: 17px;\r\n\tcolor: #767676;\r\n\tflex: 0 0 auto;\r\n\theight: 17px;\r\n\toverflow: hidden;\r\n\ttext-overflow: ellipsis;\r\n}\r\n\r\n.newsCard .infoNoImage {\r\n\twidth: 100%;\r\n}\r\n\r\n.newsCard .infoContainer {\r\n\twidth: calc(100% - 90px);\r\n}\r\n\r\n.segmentTitle {\r\n\tfont-weight: 600;\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\r\n\tcolor: #333333;\r\n\tmargin-bottom: 10px;\r\n}\r\n\r\n.mobile .graph {\r\n\tpadding: 0px !important;\r\n}\r\n\r\n.attribution {\r\n\ttext-decoration: none;\r\n\tcolor: #767676;\r\n}\r\n\r\n\r\n.attribution:hover {\r\n\ttext-decoration: underline;\r\n}\r\n\r\n/* share */\r\n\r\n.shareImage {\r\n\twidth: 600px;\r\n\theight: 315px;\r\n}\r\n\r\n.shareLinks .title {\r\n\tfont-size: 18px;\r\n\tfont-weight: 500;\r\n\tcolor: #111;\r\n\tmargin-bottom: 16px;\r\n\tflex-direction: row;\r\n}\r\n\r\n.shareContainer {\r\n\tposition: absolute;\r\n\ttop: 50%;\r\n\tleft: 50%;\r\n\ttransform: translate(-50%, -50%);\r\n\tbackground: #FFFFFF;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.04);\r\n\tbox-shadow: 0px 4px 12px rgba(0, 0, 0, 0.14);\r\n\tborder-radius: 6px;\r\n\theight: 315px;\r\n\tdisplay: flex;\r\n}\r\n\r\n.mobile .quizContainer .feedbackModal{\r\n\twidth:320px;\r\n\theight:570px;\r\n}\r\n\r\n.quizContainer .feedbackModal {\r\n\twidth:640px;\r\n\theight: 570px;\r\n}\r\n\r\n.mobile .quizCard {\r\n    background-color: white;\r\n    border: 1px solid rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n    border-radius: 6px;\r\n    padding: 8px 12px 12px 12px;\r\n    border-bottom: none;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.quizCard .quizDescription {\r\n\tdisplay: inline-flex;\r\n\talign-items: center;\r\n\tpadding-bottom: 12px;\r\n}\r\n\r\n.quizCard .takeQuizStyle {\r\n\tcolor: #00809D;\r\n\tfont-size: 13px;\r\n\tflex:1;\r\n}\r\n\r\n.quizCard .chevronRightStyle {\r\n\ttransform: rotate(-90deg);\r\n}\r\n\r\n.quizCard .quizTakeQuizPart {\r\n\tdisplay: flex;\r\n\tcursor: pointer;\r\n\tpadding-top: 12px;\r\n\tborder-top: #ddd 1px solid;\r\n}\r\n\r\n.quizCard .quizTitle {\r\n\twhite-space: nowrap;\r\n\toverflow: hidden;\r\n\tdisplay: block;\r\n\ttext-overflow: ellipsis;\r\n\tfont-size: 13px;\r\n\tfont-weight: 600;\r\n    font-size: 13px;\r\n\tcolor: #444;\r\n}\r\n\r\n.quizCard .quizIconStyle {\r\n\tmargin-right: 12px;\r\n}\r\n\r\n.quizCard .quizSource {\r\n\tfont-size: 11px;\r\n\tcolor:#767676;\r\n}\r\n\r\n.shareCancel {\r\n\tdisplay: block;\r\n    line-height: 50px;\r\n    color: #404040;\r\n    text-align: center;\r\n    background-color: #ccc;\r\n\tborder: solid 1px #ddd;\r\n\tmargin: 10px;\r\n}\r\n\r\n.shareLinks{\r\n\tflex-direction: column;\r\n\tdisplay: flex;\r\n\tmargin-left: 12px;\r\n\tmargin-top: 12px;\r\n\toverflow-x: hidden;\r\n\toverflow-y: scroll;\r\n\twidth: 180px;\r\n}\r\n\r\n.shareItem {\r\n\tmargin-bottom: 16px;\r\n\tflex-direction: row;\r\n\tdisplay: flex;\r\n\tcursor: pointer;\r\n\tmin-height: 40px;\r\n\twidth: 100%;\r\n}\r\n\r\n.shareIcon {\r\n\tmin-height: 40px;\r\n}\r\n\r\n.shareText{\r\n\tmargin:auto;\r\n\tmargin-left: 6px;\r\n\tfont-size: 14px;\r\n\tcolor: #444;\r\n\tuser-select: pointer;\r\n}\r\n\r\n.shareButton{\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n}\r\n\r\n/******************************\r\n******Bing Maps Overrides******\r\n******************************/\r\n\r\n.desktop .MicrosoftMap .NavBar_Container.V8MapStyle:lang(ar),\r\n.desktop .MicrosoftMap .NavBar_Container.V8MapStyle:lang(he) {\r\n    margin-left: calc(25vw - 80px + 12px + 344px);  /* 80px = 0.25 * country card, 344px is overview card without the right margin, 12px is actual right margin */\r\n}\r\n\r\n.desktop .MicrosoftMap .NavBar_Container.V8MapStyle {\r\n\tmargin-right: calc(25vw - 80px + 12px);  /* 80px = 0.25 * country card, 12px is actual right margin */\r\n\tmargin-top: 99px; /* align with overview card on the left */\r\n}\r\n\r\n.mobile .MicrosoftMap .NavBar_Container.V8MapStyle {\r\n\tmargin-right: calc(75vw - 10px); /* 75 from mapContainer left) */\r\n\tmargin-top: 200px !important;\r\n}\r\n\r\n.mobile .MicrosoftMap .NavBar_Container.V8MapStyle:lang(ar),\r\n.mobile .MicrosoftMap .NavBar_Container.V8MapStyle:lang(he) {\r\n\tmargin-left: calc(75vw - 10px); /* 75 from mapContainer right) */\r\n}\r\n\r\n.bm_bottomRightOverlay {\r\n\tright: calc(20vw + 25px) !important;\r\n    bottom: 30px !important;\r\n}\r\n\r\n.InfoboxCustom {\r\n  opacity: 1;\r\n}\r\n\r\n.InfoboxCustom.fade {\r\n  opacity: 0;\r\n  transition: opacity 0.5s;\r\n  transition-delay: 2s;\r\n}\r\n\r\n.mobileMapCR{\r\n\tpadding: 12px;\r\n}\r\n\r\n#trendsAnimationControl {\r\n\tposition: absolute;\r\n    top: 30px;\r\n    width: 200px;\r\n    height: 100px;\r\n    right: calc(25vw - 171px + 12px); /* 92px = 0.25 * (hearder bar + country card), 20px for original positioning, 12px is actual right margin */\r\n}\r\n\r\n.tabs.hidden ~ div.map #trendsAnimationControl {\r\n\tright: calc(25vw - 13px + 12px); /* 13px = 0.25 * (hearder bar), 20px for original positioning, 12px is actual right margin */\r\n}\r\n\r\n.mobile #trendsAnimationControl {\r\n\tright: calc(75vw - 10px); /* 75 from mapContainer left) */\r\n\tmargin-top: 300px;\r\n}\r\n\r\n/* Browser overrides */\r\n@-moz-document url-prefix() {\r\n\t/* firefox*/\r\n\t.areas,\r\n\t.segmentPanel,\r\n\t.overview:hover {\r\n\t\toverflow: auto;\r\n\t}\r\n\r\n\t.mobileVerticals {\r\n\t\tscrollbar-width: none;\r\n\t}\r\n\r\n\t.dropdown {\r\n\t\tbackground: rgba(245, 245, 245, 0.98);\r\n\t}\r\n}\r\n\r\n@supports (-ms-ime-align:auto) {\r\n\t/* edge */\r\n\t.areas,\r\n\t.segmentPanel,\r\n\t.overview:hover {\r\n\t\toverflow: auto;\r\n\t}\r\n}\r\n\r\n/* IE 10 and above scroll bar visible */\r\n@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\r\n\t.overview:hover,\r\n\t.overview:focus,\r\n\t.areas:hover,\r\n\t.areas:focus  {\r\n\t\toverflow-y: auto;\r\n\t\tpadding-right: 7px;\r\n\t}\r\n\r\n\t.areas:hover,\r\n\t.areas:focus {\r\n\t\twidth: calc(100% + 17px);\r\n\t}\r\n\r\n\t.tab {\r\n\t\tmin-width: 320px;\r\n\t}\r\n\r\n\t.selectedArea .secondaryInfo {\r\n\t\tdisplay: flex;\r\n\t}\r\n\t\r\n\t.selectedArea .secondaryInfo > span {\r\n\t\tmargin-left: 9px;\r\n\t}\r\n\r\n\t.area .areaName,\r\n\t.legend .description {\r\n\t\tflex-grow: 1;\r\n\t}\r\n\r\n\t.area {\r\n\t\tdisplay: flex;\r\n\t\talign-items: center;\r\n\t}\r\n\t\r\n\t.legend {\r\n\t\tdisplay: flex;\r\n\t}\r\n\r\n\t.legend .color {\r\n\t\tmargin-right: 8px;\r\n\t}\r\n\r\n\t.graphTitle {\r\n\t\tdisplay: flex;\r\n\t\tjustify-content: space-between;\r\n\t}\r\n\r\n\t.verticalOptions {\r\n\t\tdisplay: flex;\r\n\t}\r\n\t\r\n\t.verticalOption {\r\n\t\tmargin-left: 20px;\r\n\t}\r\n\t\r\n\t.verticalOption.selected {\r\n\t\tborder-bottom: 3px solid #00809D;\r\n\t}\r\n}\r\n\r\n/* Hide scrollbar for Chrome, Safari and Opera */\r\n.mobileVerticals::-webkit-scrollbar {\r\n\tdisplay: none;\r\n}\r\n  \r\n/* Hide scrollbar for IE and Edge */\r\n.mobileVerticals {\r\n\t-ms-overflow-style: none;\r\n}', ""]), e.exports = t
    },
    "https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/graphVertical.css": function(e, t, a) {
        (t = a("https://www.bing.com/node_modules/css-loader/dist/runtime/api.js")(!1)).push([e.i, ".graphPanel .infoTile {\r\n\tbackground-color: white;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 6px;\r\n\tpadding: 8px 12px 12px 12px;\r\n\tborder-bottom: none;\r\n\tmargin-bottom: 20px;\r\n}\r\n\r\n.verticalContent .graphPanel {\r\n    margin: 56px 0;\r\n    background-color: #f9f9f9;\r\n}\r\n\r\n.verticalContent .graphPanel .graphTitle {\r\n\tmargin: 20px 10px 12px 10px;\r\n    line-height: 22px;\r\n    font-size: 16px;\r\n    margin-right: 0px;\r\n    color: #333333;\r\n}\r\n\r\n.verticalContent .graphPanel .row {\r\n\tdisplay: flex;\r\n\tflex-wrap: wrap;\r\n\tpadding: 0 12px;\r\n\tjustify-content: center;\r\n}\r\n\r\n.verticalContent .graphPanel .row .infoTile {\r\n\tmargin: 6px;\r\n\tpadding: 0;\r\n}\r\n\r\n.verticalContent .graphPanel .row .rawDataList {\r\n\tpadding: 0 16px 16px 16px;\r\n}\r\n\r\n.verticalContent .graphPanel .col-2 {\r\n\tflex: 16.6%;\r\n\tmax-width: 16.6%;\r\n}\r\n\r\n.verticalContent .graphPanel .col-2:last-child {\r\n\tflex: 17%;\r\n\tmax-width: 17%;\r\n}\r\n\r\n.verticalContent .graphPanel .col-3 {\r\n\tflex: 25%;\r\n\tmax-width: 25%;\r\n}\r\n\r\n.verticalContent .graphPanel .col-6 {\r\n\tflex: 50%;\r\n\tmax-width: 50%;\r\n}\r\n\r\n.verticalContent .graphPanel .col-9 {\r\n\tflex: 75%;\r\n\tmax-width: 75%;\r\n}\r\n\r\n.verticalContent .graphPanel .col-12 {\r\n\tflex: 100%;\r\n\tmax-width: 100%;\r\n}\r\n\r\n@media (max-width: 1060px) {\r\n\t.verticalContent .graphPanel .col-2,\r\n\t.verticalContent .graphPanel .col-3 {\r\n\t    flex: 50%;\r\n    \tmax-width: 50%;\r\n\t}\r\n\t.verticalContent .graphPanel .col-6 {\r\n\t    flex: 100%;\r\n    \tmax-width: 100%;\r\n\t}\r\n}\r\n\r\n.graphPanel .graphTitle {\r\n\tfont-size: 16px;\r\n\tmargin: 8px;\r\n}\r\n\r\n.graphPanel .graphTitle > *:nth-child(2) {\r\n    font-size: 14px;\r\n    border: none;\r\n    color: #666666;\r\n}\r\n\r\n.graphPanel .graphTitle svg {\r\n    margin-left: 8px;\r\n}\r\n\r\n.graphPanel .summary .row {\r\n\tpadding: 0;\r\n}\r\n\r\n.mobile .graphPanel .summary .title {\r\n    font-size: 14px;\r\n}\r\n\r\n.mobile .graphPanel .summary .number {\r\n\tfont-size: 16px;\r\n\tfont-weight: bold;\r\n\tline-height: 26px;\r\n}\r\n\r\n.graphPanel .summary .title {\r\n\tfont-weight: normal;\r\n\tfont-size: 16px;\r\n\tline-height: 20px;\r\n\ttext-transform: capitalize;\r\n}\r\n\r\n.graphPanel .summary .number {\r\n\tfont-weight: bold;\r\n\tfont-size: 36px;\r\n\tline-height: 48px;\r\n\tletter-spacing: -1px;\r\n}\r\n\r\n.graphPanel .summary .confirmed {\r\n\tcolor: #DE3700;\r\n}\r\n\r\n.graphPanel .summary .recovered {\r\n\tcolor: #00AA00;\r\n}\r\n\r\n.graphPanel .summary .active {\r\n\tcolor: #F4C363;\r\n}\r\n\r\n.graphPanel .summary .death {\r\n\tcolor: #767676;\r\n}\r\n\r\n.graphPanel .summary .container {\r\n\tpadding: 24px 0;\r\n\tmargin: 0;\r\n\ttext-align: center;\r\n}\r\n\r\n.graphPanel .summary .container.confirmed {\r\n\tborder-top: 4px solid #DE3700;\r\n\tborder-top-left-radius: 3px;\r\n}\r\n\r\n.graphPanel .summary .container.active {\r\n\tborder-top: 4px solid #F4C363;\r\n}\r\n\r\n.graphPanel .summary .container.recovered {\r\n\tborder-top: 4px solid #00AA00;\r\n}\r\n\r\n.graphPanel .summary .container.death {\r\n\tborder-top: 4px solid #767676;\r\n\tborder-top-right-radius: 3px;\r\n}\r\n\r\n.graphPanel .summary .container.confirmed .tile,\r\n.graphPanel .summary .container.active .tile,\r\n.graphPanel .summary .container.recovered .tile {\r\n\tborder-right: 1px solid #EEE;\r\n}\r\n\r\n.graphPanel .summary .delta {\r\n\tfont-weight: 600;\r\n\tfont-size: 16px;\r\n\tline-height: 20px;\r\n\tpadding: 6px 20px;\r\n\tborder-radius: 32px;\r\n\tmargin: 12px auto 0 auto;\r\n\twidth: fit-content;\r\n\tcolor: #333;\r\n}\r\n.graphPanel .summary .confirmed .delta { background: rgba(217, 63, 63, 0.2); }\r\n.graphPanel .summary .active .delta { background: rgba(231, 181, 38, 0.2); }\r\n.graphPanel .summary .recovered .delta { background: rgba(58, 154, 80, 0.2); }\r\n.graphPanel .summary .death .delta { background: rgba(163, 170, 185, 0.2); }\r\n\r\n@media (max-width: 1060px) {\r\n\t.graphPanel .summary .container.active {\r\n\t\tborder-top-right-radius: 3px;\r\n\t}\r\n\t.graphPanel .summary .container.death {\r\n\t\tborder-top-right-radius: 0px;\r\n\t}\r\n}\r\n\r\n.graphPanel .ms-List-surface .ms-DetailsHeader-cell {\r\n\tfont-style: normal;\r\n\tfont-weight: 600;\r\n\tfont-size: 16px;\r\n\tline-height: 22px;\r\n    color: #666;\r\n}\r\n\r\n.graphPanel .ms-List-surface .ms-DetailsRow-fields div {\r\n    font-weight: 600;\r\n\tfont-size: 14px;\r\n    line-height: 20px;\r\n}\r\n\r\n.graphPanel .ms-List-surface .ms-DetailsRow-fields div:nth-child(1) {\r\n\tfont-weight: normal;\r\n    color: #444;\r\n}\r\n.graphPanel .ms-List-surface .ms-DetailsRow-fields div:nth-child(2) {\r\n\tcolor: #D93F3F;\r\n}\r\n.graphPanel .ms-List-surface .ms-DetailsRow-fields div:nth-child(3) {\r\n\tcolor: #E7B526;\r\n}\r\n.graphPanel .ms-List-surface .ms-DetailsRow-fields div:nth-child(4) {\r\n\tcolor: #3A9A50;\r\n}\r\n.graphPanel .ms-List-surface .ms-DetailsRow-fields div:nth-child(5) {\r\n\tcolor: #A3AAB9;\r\n}\r\n\r\n/** Region: filters and select **/\r\n\r\n.chartFilterLine {\r\n\tpadding: 16px 16px 0 16px;\r\n\tdisplay: flex;\r\n\tflex-wrap: wrap;\r\n\tjustify-content: start;\r\n}\r\n\r\n.chartFilterLine .selectBox {\r\n\twidth: 180px;\r\n\tfont-size: 14px;\r\n\tmargin: 0 10px 4px 0;\r\n}\r\n\r\n", ""]), e.exports = t
    },
    "https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/testingLocations.css": function(e, t, a) {
        (t = a("https://www.bing.com/node_modules/css-loader/dist/runtime/api.js")(!1)).push([e.i, ".tlocCard.newsCard {\r\n    display: block;\r\n    height: auto;\r\n    font-size: 13px;\r\n    line-height: 18px;\r\n    cursor: pointer;\r\n}\r\n\r\n.tlocCard.newsCard:active {\r\n    cursor: auto;\r\n}\r\n\r\n.tlocCard.nolist {\r\nmargin-bottom: 20px;\r\n}\r\n\r\n.tlocCard.hide {\r\n    display: none;\r\n}\r\n\r\n.tlocCard .headerRow {\r\n    color: #00809D;\r\n    padding-bottom: 10px;\r\n}\r\n\r\n.tlocCard .headerRow svg {\r\n    display: inline-block;\r\n    vertical-align: text-bottom;\r\n    margin-right: 8px;\r\n}\r\n\r\n.tlocCard .sepRow {\r\n    border-bottom: 1px solid #ececec;\r\n    margin: 0 -12px;\r\n}\r\n\r\n.tlocCard .titleRow {\r\n    color: #333333;\r\n    font-weight: 600;\r\n    padding: 12px 0;\r\n}\r\n\r\n.tlocCard .labelRow {\r\n    color: #333333;\r\n    font-weight: 600;\r\n    padding: 10px 0 4px;\r\n}\r\n\r\n.tlocCard .factRow {\r\n    color: #767676;\r\n    padding-bottom: 2px;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    display: -webkit-box;\r\n    -webkit-line-clamp: 10;\r\n    -webkit-box-orient: vertical;\r\n}\r\n\r\n.tlocCard .linkRow {\r\n    font-size: 12px;\r\n    color: #006621;\r\n    padding-top: 10px;\r\n}\r\n\r\n.tlocSeeMore.seeMoreButton {\r\n    width: auto;\r\n    height: auto;\r\n    font-size: 13px;\r\n    font-weight: 600;\r\n    line-height: 20px;\r\n    padding: 6px 20px;\r\n    cursor: pointer;\r\n}\r\n\r\n.tlocSeeMore svg{\r\n    display: inline;\r\n    vertical-align: middle;\r\n    margin: 0 0 2px 8px;\r\n}\r\n\r\n.tlocSeeMore.seeMoreUp svg{\r\n    transform: rotate(180deg);\r\n}\r\n", ""]), e.exports = t
    },
    "https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/topicClusters.css": function(e, t, a) {
        (t = a("https://www.bing.com/node_modules/css-loader/dist/runtime/api.js")(!1)).push([e.i, ".topicClusterTitle {\r\n    font-size: 13px;\r\n    color: #333333;\r\n    font-weight: 600;\r\n    line-height: 18px;\r\n    overflow: hidden;\r\n    max-height: 54px;\r\n    cursor: pointer;\r\n}\r\n\r\n.topicPublisher {\r\n    font-size: 11px;\r\n    line-height: 17px;\r\n    color: #767676;\r\n }\r\n\r\n .topicMore {\r\n    font-weight: 500;\r\n    font-size: 12px;\r\n    line-height: 16px;\r\n    text-decoration: none;\r\n    margin-top: 8px;\r\n    color: #00809D;\r\n    cursor: pointer;\r\n    justify-content: space-between;\r\n    display: flex;\r\n }\r\n\r\n .rotate {\r\n    transform: rotate(180deg);\r\n }\r\n\r\n .chevronDown {\r\n    width: 12px;\r\n    height: 7px;\r\n    margin-top: 5px;\r\n }\r\n \r\n .articleContainer {\r\n    background: #FFFFFF;\r\n    padding: 12px;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    flex-direction: column;\r\n }\r\n\r\n .articleContainer:not(:last-child) {\r\n    border-bottom: 1px solid rgba(0, 0, 0, 0.05);\r\n }\r\n \r\n .articleCard {\r\n    display: flex;\r\n    flex-direction: row;\r\n }\r\n\r\n .topicImage{\r\n    width: 70px;\r\n\theight: 70px;\r\n\tborder-radius: 6px;\r\n\tobject-fit: cover;\r\n\tmargin-right: 12px;\r\n\tflex: 1 0 auto;\r\n }\r\n\r\n .articlesList{\r\n    background: #FFFFFF;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.05);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n    border-radius: 6px;\r\n    overflow: hidden;\r\n    margin-bottom: 12px;\r\n }\r\n\r\n .moreArticleTitle {\r\n    max-height: 36px;\r\n}\r\n\r\n.articlePoint {\r\n    width: 4px;\r\n    height: 4px;\r\n    border-radius: 2px;\r\n    background-color: #00809D;\r\n}\r\n\r\n.moreArticle {\r\n    display: flex;\r\n    flex-direction: row;\r\n    padding-left: 8px;\r\n    margin-bottom: 6px;\r\n}\r\n\r\n.noMoreArticle {\r\n    cursor: auto;\r\n}\r\n\r\n.pointContainer {\r\n    padding-left: 4px;\r\n    padding-right: 8px;\r\n    margin-top: 8px;\r\n}\r\n\r\n.moreArticlesContainerOpen {\r\n    visibility: visible;\r\n    margin-top: 10px;\r\n    height: auto;\r\n}\r\n\r\n.moreArticlesContainerClose {\r\n    visibility: hidden;\r\n    height: 0;\r\n}", ""]), e.exports = t
    },
    "https://www.bing.com/node_modules/css-loader/dist/cjs.js!./covid/styles/upsells.css": function(e, t, a) {
        (t = a("https://www.bing.com/node_modules/css-loader/dist/runtime/api.js")(!1)).push([e.i, '/* Upsell Container for FloatingUpsell */\r\n.upsellContainer {\r\n\tposition: absolute;\r\n    right: 23px;\r\n    bottom: 16px;\r\n\tz-index: 500;\r\n    display: flex;\r\n}\r\n\r\n.floatingUpsell {\r\n    color: #FFF;\r\n\tfont-weight: 600;\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\r\n    cursor: pointer;\r\n\tz-index: 500;\r\n\theight: 40px;\r\n    display: flex;\r\n    padding: 0px 16px 0px 16px;\r\n\talign-items: center;\r\n\tbackground: linear-gradient(102.27deg, rgba(0, 128, 157, 0.9) 0.35%, rgba(8, 117, 143, 0.9) 100%);\r\n\tborder: 1px solid rgba(0, 0, 0, 0.04);\r\n\tbox-shadow: 0px 4px 14px rgba(0, 0, 0, 0.2);\r\n\tborder-radius: 6px;\r\n\tmargin-left: 8px;\r\n}\r\n\r\n.shareFloating {\r\n\tpadding: 0px;\r\n\twidth: 40px;\r\n\tjustify-content: center;\r\n}\r\n\r\n.botOpen {\r\n\tbackground: linear-gradient(92.75deg, rgba(255, 255, 255, 0.9) 0.35%, rgba(245, 245, 245, 0.9) 100%);\r\n\tborder: 1px solid rgba(0, 0, 0, 0.12);\r\n}\r\n\r\n.floatingUpsell .title {\r\n\tmargin-left: 8px;\r\n}\r\n\r\n.floatingUpsell .titleNoMargin {\r\n\tmargin-left: 0px;\r\n}\r\n\r\n.upsellOpen {\r\n\tpadding: 0px;\r\n\twidth: 40px;\r\n\tjustify-content: center;\r\n\tbackground: linear-gradient(0deg, #666666, #666666), #FFFFFF;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.04);\r\n\tbox-shadow: 0px 4px 12px rgba(0, 0, 0, 0.14);\r\n\tborder-radius: 100px;\r\n}\r\n\r\n/* Floating upsell content */\r\n\r\n.floatingUpsellContent {\r\n    z-index: 500;\r\n    position: absolute;\r\n\tright: 123px;\r\n\tbottom: 76px;\r\n\twidth: 300px;\r\n\t-webkit-backdrop-filter: blur(10px);\r\n\tborder-radius: 6px;\r\n\tuser-select: none;\r\n\tbackground: linear-gradient(100.67deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 249, 249, 0.9) 100%);\r\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\r\n\tbox-shadow: 0px 4px 14px rgba(0, 0, 0, 0.2);\r\n\tbackdrop-filter: blur(10px);\r\n\tpadding: 24px;\r\n}\r\n\r\n.floatingUpsellContent .container {\r\n    display: flex;\r\n    background: #FFFFFF;\r\n    border: 1px solid rgba(0, 0, 0, 0.1);\r\n    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.08);\r\n    border-radius: 6px;\r\n    overflow: hidden;\r\n}\r\n\r\n.floatingUpsellContent .numberInput {\r\n\tflex: 1;\r\n    padding: 6px;\r\n    border: 0;\r\n    padding-left: 10px;\r\n}\r\n\r\n.floatingUpsellContent .submit {\r\n\tpadding-left: 8px;\r\n\tpadding-right: 8px;\r\n    height: 36px;\r\n    display: flex;\r\n    background: #0F69B6;\r\n    justify-content: center;\r\n    text-align: center;\r\n    color: #FFFFFF;\r\n    font-size: 13px;\r\n\tline-height: 36px;\r\n\tcursor: pointer;\r\n}\r\n\r\n.floatingUpsellContent .calloutError {\r\n\tcolor: #d24a4a;\r\n    font-size: 13px;\r\n    line-height: 20px;\r\n    font-weight: 600;\r\n}\r\n\r\n.floatingUpsellContent .calloutSubmitted {\r\n\tcolor: #00809D;\r\n    font-size: 13px;\r\n    line-height: 20px;\r\n    font-weight: 600;\r\n}\r\n\r\n.floatingUpsellContent .appleBadge {\r\n\twidth: 135px;\r\n\theight: 40px;\r\n\tbackground: url("/covid/static/images/storebadge/apple_black.png") no-repeat;\r\n\tbackground-size: 135px 40px;\r\n}\r\n\r\n.floatingUpsellContent .androidBadge {\r\n\twidth: 135px;\r\n\theight: 40px;\r\n\tbackground: url("/covid/static/images/storebadge/google_black.png") no-repeat;\r\n\tbackground-size: 135px 40px;\r\n}\r\n\r\n.floatingUpsellContent .contentText {\r\n\tmargin-left: 17px;\r\n}\r\n\r\n.floatingUpsellContent .upsellContent {\r\n\tflex-direction: row;\r\n\tdisplay: flex;\r\n\tmargin-bottom: 24px;\r\n}\r\n\r\n.floatingUpsellContent .title {\r\n\tcolor: #222222;\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\r\n\tfont-weight: 600;\r\n}\r\n\r\n.floatingUpsellContent .description {\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\t\r\n\tcolor: #222222;\r\n\topacity: 0.7;\r\n}\r\n\r\n.floatingUpsellContent .policy{\r\n\tfont-size: 10px;\r\n\tline-height: 15px;\r\n\tcolor: #767676;\r\n\tmargin-top: 20px;\r\n}\r\n\r\n.floatingUpsellContent .privacy{\r\n\tfont-size: 11px;\r\n\tline-height: 18px;\r\n\ttext-align: center;\r\n\tcolor: #00809D;\r\n\tmargin-top: 8px;\r\n}\r\n\r\n.floatingUpsellContent .downloadButton {\r\n\tcolor: #ffffff;\r\n\tfont-weight: 600;\r\n\ttext-align: center;\r\n\tcursor: pointer;\r\n\tfont-size: 13px;\r\n\tbackground: #00809D;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 100px;\r\n\theight: 34px;\r\n\tpadding-left: 8px;\r\n\tpadding-right: 8px;\r\n\tvertical-align: middle;\r\n\tline-height: 34px;\r\n\tmargin: auto;\r\n}\r\n\r\n.floatingUpsellContent .appIcons {\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n\tjustify-content: space-between;\r\n\tmargin-top: 24px;\r\n}\r\n\r\n/* Health bot */\r\n.healthChatContainer {\r\n    z-index: 500;\r\n    position: absolute;\r\n\tbottom: 76px;\r\n\twidth: 400px;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\r\n\tbox-shadow: 0px 4px 14px rgba(0, 0, 0, 0.2);\r\n\tbackground-color: white;\r\n}\r\n\r\n/* Bing bot */\r\n\r\n.bingBotContainer {\r\n    z-index: 500;\r\n    position: absolute;\r\n\tbottom: 76px;\r\n\twidth: 320px;\r\n\tborder: 1px solid rgba(0, 0, 0, 0.1);\r\n\tbox-shadow: 0px 4px 14px rgba(0, 0, 0, 0.2);\r\n\tbackground-color: white;\r\n\tpadding-bottom: 77px;\r\n}\r\n\r\n.bingBotContainer .botHeader {\r\n\tbackground: rgba(255, 255, 255, 0.9);\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tbackdrop-filter: blur(8px);\r\n\tpadding-left: 16px;\r\n\tpadding-right: 16px;\r\n\tflex-direction: row;\r\n\tdisplay: flex;\r\n\theight: 57px;\r\n\talign-items: center;\r\n}\r\n\r\n.bingBotContainer .botTitle {\r\n\tfont-size: 16px;\r\n\tcolor: #00809D;\r\n\tflex: 1;\r\n\tpadding-left: 12px;\r\n\tfont-weight: 600;\r\n}\r\n\r\n.bingBotContainer .botMinimize {\r\n\tmargin-right: 24px;\r\n\tcursor: pointer;\r\n}\r\n\r\n.bingBotContainer .botClose {\r\n\tcursor: pointer;\r\n}\r\n\r\n.bingBotContainer .botSeparator {\r\n\tbackground: #DDDDDD;\r\n\theight: 1px;\r\n}\r\n\r\n.bingBotContainer .botInput {\r\n\twidth: 100%;\r\n\tmax-height: 120px;\r\n\tbackground: #F5F5F5;\r\n\tresize: none;\r\n\theight: 24px;\r\n\tfont-size: 13px;\r\n\tline-height: 20px;\r\n}\r\n\r\n.bingBotContainer .botInput:focus {\r\n    outline:none;\r\n}\r\n\r\n.bingBotContainer .inputAndSubmit {\r\n\tpadding: 9px 16px 9px 16px;\r\n\tbackground: #F5F5F5;\r\n\tborder: 1px solid rgba(17, 17, 17, 0.1);\r\n\tbox-sizing: border-box;\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 20px;\r\n\tdisplay: flex;\r\n}\r\n\r\n.bingBotContainer .inputContainer {\r\n\tpadding: 17px 16px 16px 16px;\r\n\tposition: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n\tborder-top: 1px solid #DDDDDD;\r\n\tbackground: #FFF;\r\n}\r\n\r\n.bingBotContainer .submitContainer {\r\n\tdisplay: flex;\r\n    flex-direction: column;\r\n\tjustify-content: flex-end;\r\n\tpadding-bottom: 3px;\r\n\tpadding-left: 16px;\r\n\tcursor: pointer;\r\n}\r\n\r\n.bingBotContainer .messagesContainer {\r\n\theight: 380px;\r\n\toverflow-y: scroll;\r\n\toverflow-x: hidden;\r\n\tpadding: 16px 16px 0px 16px;\r\n}\r\n\r\n.bingBotContainer .userMessage {\r\n    max-width: 100%;\r\n\toverflow-x: hidden;\r\n\tpadding: 10px 12px;\r\n\tbackground: linear-gradient(0deg, #CDE6EB, #CDE6EB), linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #00809D;\r\n\tborder-radius: 6px 6px 1px 6px;\r\n}\r\n\r\n.bingBotContainer .botMessage {\r\n\tbackground: linear-gradient(0deg, #ECECEC, #ECECEC), linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #000000;\r\n\tborder-radius: 6px 6px 6px 1px;\r\n\tpadding: 10px 12px;\r\n\tmargin-right: 92px;\r\n}\r\n\r\n.bingBotContainer .messageContainerBase {\r\n\tmargin-bottom: 16px;\r\n}\r\n\r\n.bingBotContainer .userMessageContainer {\r\n\tdisplay: flex;\r\n    flex-direction: row-reverse;\r\n    padding-left: 92px;\r\n}\r\n\r\n.bingBotContainer .botMessageContainer {\r\n\tdisplay: flex;\r\n\tflex-direction: row;\r\n}\r\n\r\n.bingBotContainer .botMessageRefinementContainer {\r\n\tflex-direction: column;\r\n    justify-content: flex-end;\r\n    align-items: flex-start;\r\n}\r\n\r\n.bingBotContainer .messageBase {\r\n\tword-wrap: break-word;\r\n\tfont-size: 13px;\r\n\tline-height: 18px;\r\n\tcolor: #000000;\r\n}\r\n\r\n.bingBotContainer .actionBase {\r\n\tbackground: #FFFFFF;\r\n\tborder: 1px solid rgba(17, 17, 17, 0.1);\r\n\tbox-sizing: border-box;\r\n\tbox-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n\tborder-radius: 100px;\r\n\tpadding: 9px 16px;\r\n\tmargin-bottom: 8px;\r\n\tline-height: 22px;\r\n}\r\n\r\n.bingBotContainer .primaryAction {\r\n\tmargin-bottom: 12px;\r\n}\r\n\r\n/* Mobile */\r\n.mobile .upsellContainer {\r\n\tposition: absolute;\r\n\ttop: 50%;\r\n\tleft: 50%;\r\n\ttransform: translate(-50%, -50%);\r\n\tbox-shadow: 0px 4px 12px rgba(0, 0, 0, 0.14);\r\n\tborder-radius: 6px;\r\n\twidth: 320px;\r\n}\r\n\r\n.mobile .floatingUpsell {\r\n    right: 10px;\r\n    background: rgba(255, 255, 255, 0.9);\r\n    border: 1px solid #DDD;\r\n    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);\r\n    border-radius: 4px;\r\n\tcolor: #767676;\r\n\tz-index: 0;\r\n}\r\n\r\n.mobile .upsellModal {\r\n\tz-index: 0;\r\n    position: relative;\r\n    right: auto;\r\n    bottom: auto;\r\n\twidth: auto;\r\n\tuser-select: none;\r\n}\r\n\r\n.mobile .floatingUpsell{\r\n\tposition: absolute;\r\n}', ""]), e.exports = t
    },
    "https://www.bing.com/server/covid/cache.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var r = a("https://www.bing.com/server/safeAsync.ts");

        function o() {
            for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
            return JSON.stringify(e)
        }

        function l(e, t, a, o) {
            var l = this;
            void 0 === o && (o = !1);
            var s = a,
                d = new Date(0);
            return function(a) {
                return void 0 === a && (a = !1), n(l, void 0, void 0, function() {
                    var l, u, c, f;
                    return i(this, function(p) {
                        switch (p.label) {
                            case 0:
                                return l = new Date, d < l || a ? [4,
                                    function(e, t) {
                                        return n(this, void 0, void 0, function() {
                                            return i(this, function(a) {
                                                switch (a.label) {
                                                    case 0:
                                                        return t ? [4, e()] : [3, 2];
                                                    case 1:
                                                        return [2, {
                                                            result: a.sent(),
                                                            error: void 0
                                                        }];
                                                    case 2:
                                                        return [4, r.default(e())];
                                                    case 3:
                                                        return [2, a.sent()]
                                                }
                                            })
                                        })
                                    }(e, o)
                                ] : [3, 2];
                            case 1:
                                u = p.sent(), c = u.result, (f = u.error) ? console.error(f) : (s = c, l.setSeconds(l.getSeconds() + t), d = l), p.label = 2;
                            case 2:
                                return [2, s]
                        }
                    })
                })
            }
        }
        t.memoizeAsync = function(e, t, a, r) {
            var s = this;
            void 0 === a && (a = o), void 0 === r && (r = 20), l(function() {
                return n(s, void 0, void 0, function() {
                    return i(this, function(t) {
                        switch (t.label) {
                            case 0:
                                return [4, e.apply(void 0, [])];
                            case 1:
                                return [2, t.sent()]
                        }
                    })
                })
            }, t, null);
            var d = {};
            return function() {
                for (var o = [], u = 0; u < arguments.length; u++) o[u] = arguments[u];
                return n(s, void 0, void 0, function() {
                    var s, u, c = this;
                    return i(this, function(f) {
                        switch (f.label) {
                            case 0:
                                return s = a.apply(void 0, o), d[s] || (u = Object.keys(d), r < u.length && delete d[u[0]], d[s] = l(function() {
                                    return n(c, void 0, void 0, function() {
                                        return i(this, function(t) {
                                            switch (t.label) {
                                                case 0:
                                                    return [4, e.apply(void 0, o)];
                                                case 1:
                                                    return [2, t.sent()]
                                            }
                                        })
                                    })
                                }, t, null)), [4, (0, d[s])()];
                            case 1:
                                return [2, f.sent()]
                        }
                    })
                })
            }
        }, t.default = l
    },
    "https://www.bing.com/server/safeAsync.ts": function(e, t, a) {
        "use strict";
        var n = this && this.__awaiter || function(e, t, a, n) {
                return new(a || (a = Promise))(function(i, r) {
                    function o(e) {
                        try {
                            s(n.next(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function l(e) {
                        try {
                            s(n.throw(e))
                        } catch (e) {
                            r(e)
                        }
                    }

                    function s(e) {
                        e.done ? i(e.value) : new a(function(t) {
                            t(e.value)
                        }).then(o, l)
                    }
                    s((n = n.apply(e, t || [])).next())
                })
            },
            i = this && this.__generator || function(e, t) {
                var a, n, i, r, o = {
                    label: 0,
                    sent: function() {
                        if (1 & i[0]) throw i[1];
                        return i[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw :l(1),
                    return :l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (a) throw new TypeError("Generator is already executing.");
                            for (; o;) try {
                                if (a = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, r[1])).done) return i;
                                switch (n = 0, i && (r = [2 & r[0], i.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        i = r;
                                        break;
                                    case 4:
                                        return o.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        o.label++, n = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = o.ops.pop(), o.trys.pop();
                                        continue;
                                    default:
                                        if (!(i = (i = o.trys).length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            o = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
                                            o.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && o.label < i[1]) {
                                            o.label = i[1], i = r;
                                            break
                                        }
                                        if (i && o.label < i[2]) {
                                            o.label = i[2], o.ops.push(r);
                                            break
                                        }
                                        i[2] && o.ops.pop(), o.trys.pop();
                                        continue
                                }
                                r = t.call(e, o)
                            } catch (e) {
                                r = [6, e], n = 0
                            } finally {
                                a = i = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            };
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = function(e) {
            return n(this, void 0, void 0, function() {
                var t, a, n;
                return i(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return i.trys.push([0, 2, , 3]), [4, e];
                        case 1:
                            return t = i.sent(), [3, 3];
                        case 2:
                            return n = i.sent(), a = n, [3, 3];
                        case 3:
                            return [2, {
                                result: t,
                                error: a
                            }]
                    }
                })
            })
        }
    }
}, ["https://www.bing.com/covid/app.tsx"]);
//# sourceMappingURL=covid.js.map