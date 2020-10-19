var VA = VA || {
    jq: null,
    isWl: !1,
    setup: {
        cart: !1,
        leadgen: !1,
        locale: "en-US",
        mkt: !1,
        platform: null,
        predefined: [],
        receipt: !1,
        whiteLabel: {
            id: null,
            offerId: null,
            domain: null,
            leadAPIKey: null
        },
        resubmitMode: "new"
    },
    trace: function(e) {
        try {
            console.log(e)
        } catch (o) {
            window.location.search.indexOf("vatest=true") >= 0 && alert(e)
        }
    },
    qs: function(e) {
        if ("" == e)
            return {};
        for (var o = {}, t = 0; t < e.length; ++t) {
            var n = e[t].split("=");
            if (2 == n.length)
                try {
                    o[n[0]] = decodeURIComponent(n[1].replace(/\+/g, " "))
                } catch (a) {
                    o[n[0]] = decodeURIComponent(escape(n[1].replace(/\+/g, " ")))
                }
        }
        return o
    }(window.location.search.substr(1).split("&")),
    evalScriptFromNode: function(elem) {
        for (var scripts = elem.getElementsByTagName("script"), i = 0; i < scripts.length; i++)
            if ("" != scripts[i].src) {
                var tag = document.createElement("script");
                tag.src = scripts[i].src,
                document.getElementsByTagName("head")[0].appendChild(tag)
            } else
                eval(scripts[i].innerHTML)
    },
    execScriptFromNode: function(e) {
        function o(e, o) {
            return e.nodeName && e.nodeName.toUpperCase() === o.toUpperCase()
        }
        function t(e) {
            var o = e.text || e.textContent || e.innerHTML || ""
              , t = document.getElementsByTagName("head")[0] || document.documentElement
              , n = document.createElement("script");
            n.type = "text/javascript";
            try {
                n.appendChild(document.createTextNode(o))
            } catch (a) {
                n.text = o
            }
            t.insertBefore(n, t.firstChild),
            t.removeChild(n)
        }
        var n, a, i, r = [], c = e.childNodes;
        for (i = 0; c[i]; i++)
            a = c[i],
            !o(a, "script") || a.type && "text/javascript" !== a.type.toLowerCase() || r.push(a);
        for (i = 0; r[i]; i++)
            n = r[i],
            n.parentNode && n.parentNode.removeChild(n),
            t(r[i])
    },
    getJSONP: function(e, o) {
        var t = "_" + +new Date
          , n = document.createElement("script")
          , a = document.getElementsByTagName("head")[0] || document.documentElement;
        window[t] = function(e) {
            a.removeChild(n),
            o && o(e)
        }
        ,
        n.src = e.replace("callback=?", "callback=" + t),
        a.appendChild(n)
    },
    mergeRecursive: function(e, o) {
        for (var t in o)
            try {
                o[t].constructor == Object ? e[t] = MergeRecursive(e[t], o[t]) : e[t] = o[t]
            } catch (n) {
                e[t] = o[t]
            }
        return e
    },
    createCookie: function(e, o, t, n, a) {
        var i = e + "=" + escape(o) + ";";
        t && (t instanceof Date ? isNaN(t.getTime()) && (t = new Date) : t = new Date((new Date).getTime() + 1e3 * parseInt(t) * 60 * 60 * 24),
        i += "expires=" + t.toGMTString() + ";"),
        n && (i += "path=" + n + ";"),
        a && (i += "domain=" + a + ";"),
        i += "SameSite=None;",
        "https:" == document.location.protocol && (i += "Secure;"),
        document.cookie = i
    },
    getCookie: function(e) {
        return match = document.cookie.match(new RegExp(e + "=([^;]+)")),
        match ? match[1] : void 0
    },
    deleteCookie: function(e, o, t) {
        VA.getCookie(e) && VA.createCookie(e, "", -1, o, t)
    },
    compareVersions: function(e, o) {
        for (var t = e.split("."), n = o.split("."), a = 0; a < t.length; ++a)
            t[a] = Number(t[a]);
        for (var a = 0; a < n.length; ++a)
            n[a] = Number(n[a]);
        return 2 == t.length && (t[2] = 0),
        t[0] > n[0] ? !0 : t[0] < n[0] ? !1 : t[1] > n[1] ? !0 : t[1] < n[1] ? !1 : t[2] > n[2] ? !0 : t[2] < n[2] ? !1 : !0
    },
    isBlank: function(e) {
        return "undefined" == typeof e || null === e || "" === e
    },
    isPresent: function(e) {
        return !VA.isBlank(e)
    },
    isFunction: function(e) {
        return "undefined" !== e && "function" == typeof e
    },
    isIncluded: function(e) {
        for (var o = document.getElementsByTagName("script"), t = 0; t < o.length; t++)
            if (o[t].getAttribute("src") == e)
                return !0;
        return !1
    },
    paramOrCookie: function(e) {
        var o = VA.qs[e] || VA.getCookie(e) || "";
        return o
    },
    events: {
        onAfterDataLoad: function(e) {},
        onAfterFormSuccess: function(e) {},
        onBeforeFormSubmit: function(e) {}
    },
    env: function() {
        var e = document.location.hostname;
        return null != e.match(/local./) ? "development" : null != e.match(/staging./) ? "staging" : "production"
    }(),
    domain: function() {
        var e = "vbtrax.com"
          , o = document.location.hostname;
        return null != o.match(/local./) ? e = "local.vbtrax.com:8080" : null != o.match(/staging./) && (e = "staging.vbtrax.com"),
        e
    }(),
    cdn_domain: function() {
        var e = "cdn.vbtrax.com"
          , o = document.location.hostname;
        return null != o.match(/local./) ? e = "local.vbtrax.com:8080" : null != o.match(/staging./) && (e = "staging.vbtrax.com"),
        e
    }(),
    protocol: function() {
        return "https:" == document.location.protocol ? "https://" : "http://"
    }(),
    loadCSS: function(e) {
        for (var o = document.getElementsByTagName("head")[0], t = 0; t < e.length; t++) {
            var n = document.createElement("link");
            n.rel = "stylesheet",
            n.href = e[t],
            o.appendChild(n)
        }
    },
    loadScript: function(e) {
        if (e.owner_document = e.owner_document || document,
        e.chain = e.chain || [e.src],
        0 == e.chain.length)
            return void (e.callback && e.callback());
        var o = e.chain.shift();
        if (VA.isIncluded(o))
            0 == e.chain.length ? e.callback && e.callback() : VA.loadScript(e);
        else {
            var t = e.owner_document.createElement("script");
            t.setAttribute("type", "text/javascript"),
            t.setAttribute("src", o),
            0 == e.chain.length ? (t.onload = function() {
                t.onreadystatechange = null,
                e.callback && e.callback()
            }
            ,
            t.onreadystatechange = function() {
                ("loaded" == t.readyState || "complete" == t.readyState) && (t.onload = null,
                e.callback && e.callback())
            }
            ) : (t.onload = function() {
                t.onreadystatechange = null,
                VA.loadScript(e)
            }
            ,
            t.onreadystatechange = function() {
                ("loaded" == t.readyState || "complete" == t.readyState) && (t.onload = null,
                VA.loadScript(e))
            }
            ),
            e.owner_document.getElementsByTagName("head")[0].appendChild(t)
        }
    },
    mkt: {
        domain: function() {
            return VA.setup.whiteLabel.domain || VA.domain
        },
        initialize: function(e) {
            var o = VA.getCookie("fingerprint");
            if (!o) {
                o = Math.floor(Math.random() * Math.floor(99999999999));
                var t = new Date((new Date).getTime() + 1e3 * parseInt(5));
                VA.createCookie("fingerprint", o, t, "/")
            }
            var n = VA.setup.whiteLabel.siteId
              , a = VA.setup.whiteLabel.id
              , i = []
              , r = window.location;
            i.push(VA.protocol),
            i.push(VA.mkt.domain()),
            i.push("/track/imp/mkt_site/" + a + "/" + n + "?"),
            i.push("vtm_host=" + encodeURIComponent(r.hostname)),
            i.push("&vtm_page=" + encodeURIComponent(r.pathname)),
            i.push("&protocol=" + encodeURIComponent(r.protocol)),
            i.push("&qs=" + encodeURIComponent(r.search)),
            i.push("&ref=" + encodeURIComponent(document.referrer)),
            i.push("&vtm_channel=" + encodeURIComponent(VA.paramOrCookie("vtm_channel"))),
            i.push("&vtm_campaign=" + encodeURIComponent(VA.paramOrCookie("vtm_campaign"))),
            i.push("&server_subid=" + encodeURIComponent(VA.paramOrCookie("vtm_stat_id"))),
            i.push("&token=" + encodeURIComponent(VA.paramOrCookie("vtm_token"))),
            i.push("&subid_1=" + encodeURIComponent(VA.paramOrCookie("subid_1"))),
            i.push("&subid_2=" + encodeURIComponent(VA.paramOrCookie("subid_2"))),
            i.push("&subid_3=" + encodeURIComponent(VA.paramOrCookie("subid_3"))),
            i.push("&subid_4=" + encodeURIComponent(VA.paramOrCookie("subid_4"))),
            i.push("&subid_5=" + encodeURIComponent(VA.paramOrCookie("subid_5"))),
            i.push("&gaid=" + encodeURIComponent(VA.paramOrCookie("gaid"))),
            i.push("&fp=" + o),
            1 == e.conversion && (i.push("&conversions=true"),
            "undefined" != typeof e.conversionData && (null != e.conversionData.step && i.push("&step=" + encodeURIComponent(e.conversionData.step)),
            null != e.conversionData.orderTotal && i.push("&order_total=" + encodeURIComponent(e.conversionData.orderTotal)),
            null != e.conversionData.order && i.push("&order=" + encodeURIComponent(e.conversionData.order)),
            null != e.conversionData.revenue && i.push("&revenue=" + encodeURIComponent(e.conversionData.revenue)),
            null != e.conversionData.adv_uniq_id && i.push("&adv_uniq_id=" + encodeURIComponent(e.conversionData.adv_uniq_id)))),
            i.push("&callback=?"),
            (VA.isPresent(VA.paramOrCookie("server_subid")) || VA.isPresent(VA.paramOrCookie("vtm_stat_id")) || VA.isPresent(VA.paramOrCookie("vtm_token"))) && VA.getJSONP(i.join(""), function(e) {
                if (!VA.isBlank(e.cookie_bust))
                    for (var o = e.cookie_bust.length, t = 0; o > t; t++)
                        VA.deleteCookie(e.cookie_bust[t], "/", "." + e.cookie.domain);
                var i = function(e, o) {
                    return VA.isPresent(VA.getCookie(e)) && VA.getCookie(e) == o
                };
                if ("1" == VA.qs.debug,
                i("vtm_host", e.cookie.vtm_host) || VA.createCookie("vtm_host", e.cookie.vtm_host, 90, "/", "." + e.cookie.domain),
                i("vtm_page", e.cookie.vtm_page) || VA.createCookie("vtm_page", e.cookie.vtm_page, 90, "/", "." + e.cookie.domain),
                i("vtm_channel", e.cookie.vtm_channel) || VA.createCookie("vtm_channel", e.cookie.vtm_channel, 90, "/", "." + e.cookie.domain),
                i("vtm_campaign", e.cookie.vtm_campaign) || VA.createCookie("vtm_campaign", e.cookie.vtm_campaign, 90, "/", "." + e.cookie.domain),
                i("subid_1", e.cookie.subid_1) || VA.createCookie("subid_1", e.cookie.subid_1, 90, "/", "." + e.cookie.domain),
                i("subid_2", e.cookie.subid_2) || VA.createCookie("subid_2", e.cookie.subid_2, 90, "/", "." + e.cookie.domain),
                i("subid_3", e.cookie.subid_3) || VA.createCookie("subid_3", e.cookie.subid_3, 90, "/", "." + e.cookie.domain),
                i("subid_4", e.cookie.subid_4) || VA.createCookie("subid_4", e.cookie.subid_4, 90, "/", "." + e.cookie.domain),
                i("subid_5", e.cookie.subid_5) || VA.createCookie("subid_5", e.cookie.subid_5, 90, "/", "." + e.cookie.domain),
                i("vtm_stat_id", e.cookie.stat_id) || VA.createCookie("vtm_stat_id", e.cookie.stat_id, 90, "/", "." + e.cookie.domain),
                "1" == VA.qs.debug,
                "undefined" != typeof e.pixel) {
                    var r = document.createElement("ins");
                    r.id = "vbtrax-px-" + a + "-" + n,
                    r.innerHTML = e.pixel,
                    document.body.appendChild(r),
                    VA.evalScriptFromNode(r)
                }
                e.refresh_page && (window.top.location = e.refresh_url)
            })
        }
    },
    uuid: function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
            var o = 16 * Math.random() | 0
              , t = "x" == e ? o : 3 & o | 8;
            return t.toString(16)
        })
    },
    skinFunction: function(e) {
        if (null == VA.jq && "undefined" != typeof jQuery && (VA.jq = jQuery),
        VA.setup.leadgen || VA.setup.cart) {
            var o = [];
            "undefined" == typeof VAD && o.push("//" + VA.domain + "/javascripts/dictionaries/va-" + VA.setup.locale + ".js"),
            VA.loadScript({
                chain: o,
                callback: function() {
                    var e = []
                      , o = [];
                    VA.setup.leadgen && (o.push("//" + VA.domain + "/plugins/jquery.alerts-1.1/jquery.alerts.css"),
                    "undefined" == typeof VA.center && e.push("//" + VA.domain + "/javascripts/va.common.js"),
                    e.push("//code.jquery.com/jquery-migrate-1.2.1.min.js"),
                    e.push("//" + VA.domain + "/plugins/easyXDM-2.4.17.1/easyXDM.min.js"),
                    e.push("//" + VA.domain + "/plugins/jquery-validation-1.9.0/jquery.validate.all.min.js"),
                    e.push("//" + VA.domain + "/plugins/jquery.alerts-1.1/jquery.alerts.js"),
                    e.push("//" + VA.domain + "/javascripts/va.xdm.js"),
                    e.push("//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject_src.js"),
                    e.push("//" + VA.domain + "/plugins/fingerprintjs2/fingerprint2.js"),
                    e.push("//" + VA.domain + "/javascripts/va.leadgen.js")),
                    VA.setup.cart && ("undefined" == typeof VA.center && e.push("//" + VA.domain + "/javascripts/va.common.js"),
                    e.push("//" + VA.domain + "/javascripts/va.cart.js"));
                    for (var t = 0; t < VA.setup.predefined.length; t++)
                        e.push("//" + VA.domain + "/javascripts/va.predefined/" + VA.setup.predefined[t] + ".js");
                    VA.loadCSS(o),
                    VA.loadScript({
                        chain: e,
                        callback: function() {
                            VA.setup.cart ? VA.cart.initialize() : VA.setup.leadgen && VA.leadgen.initialize()
                        }
                    })
                }
            })
        }
    },
    remoteLoad: function(e) {
        if (VA.setup.locale = e.locale || "en-US",
        VA.setup.predefined = e.predefined || [],
        VA.setup.leadgen = e.leadgen || !1,
        VA.setup.cart = e.cart || !1,
        VA.setup.receipt = e.receipt || !1,
        VA.setup.mkt = e.mkt || !1,
        VA.setup.platform = e.platform || null,
        VA.setup.whiteLabel = e.whiteLabel || {
            id: null,
            offerId: null,
            domain: null,
            siteId: ""
        },
        VA.isWl = null != VA.setup.whiteLabel.id,
        VA.events.onAfterDataLoad = e.events && e.events.onAfterDataLoad,
        VA.events.onAfterFormSuccess = e.events && e.events.onAfterFormSuccess,
        VA.setup.resubmitMode = e.resubmitMode || "new",
        VA.setup.leadgen === !0 && ("undefined" != typeof jQuery && VA.compareVersions(jQuery.fn.jquery, "1.7.1") ? VA.trace("VA: Using Client jQuery.") : (VA.trace("VA: Using VA jQuery."),
        VA.loadScript({
            src: "//cdnjs.cloudflare.com/ajax/libs/jquery/1.7.1/jquery.min.js"
        })),
        VA.skinFunction()),
        VA.setup.mkt === !0)
            if (VA.trace("VA: mkt is active."),
            VA.setup.platform) {
                var o = ["//", VA.cdn_domain, "/javascripts/va.platform.", VA.setup.platform, ".js"].join("");
                VA.loadScript({
                    src: o,
                    callback: function() {
                        VA.mkt.initialize(window.VARemoteLoadOptions)
                    }
                })
            } else
                VA.mkt.initialize(e)
    }
};
"undefined" != typeof window.VARemoteLoadOptions && window.VARemoteLoadOptions && (window.VARemoteLoadOptions.conversion && window.VARemoteLoadOptions.conversionData ? setTimeout(function() {
    var e = new Date((new Date).getTime() + 1e3 * parseInt(5))
      , o = JSON.stringify(window.VARemoteLoadOptions.conversionData);
    VA.getCookie("vaConversion") !== escape(o) && (VA.createCookie("vaConversion", o, e, "/"),
    VA.remoteLoad(window.VARemoteLoadOptions))
}, 3 * Math.random()) : VA.remoteLoad(window.VARemoteLoadOptions));

