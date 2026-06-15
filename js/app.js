/* =========================================================
   OfficeMassage — app.js
   i18n + theme/variant switching + interactive widgets
   ========================================================= */
(function () {
    "use strict";

    /* ---------- Icons ---------- */
    var IC = {
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        shirt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l4 2-2 4-2-1v11H8V8L6 9 4 5l4-2 2 2h4z"/></svg>',
        drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><line x1="5" y1="3" x2="19" y2="21"/></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>',
        pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
        cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>',
        spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
        shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><polyline points="9 12 11 14 15 10"/></svg>',
        chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-5.1A8 8 0 1 1 21 12z"/></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
        heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20z"/></svg>',
        building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="9" y1="7" x2="9" y2="7.01"/><line x1="15" y1="7" x2="15" y2="7.01"/><line x1="9" y1="11" x2="9" y2="11.01"/><line x1="15" y1="11" x2="15" y2="11.01"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
    };

    var AV_HUES = [10, 45, 90, 150, 200, 240, 280, 320, 0, 120];

    /* ---------- State ---------- */
    var state = {
        lang: localStorage.getItem("om_lang") || "pl",
        theme: "calm",
        tab: "company",
        tariffDur: 20,
    };
    if (!window.I18N[state.lang]) state.lang = "pl";

    function dict() {
        return window.I18N[state.lang];
    }
    function getPath(obj, path) {
        return path.split(".").reduce(function (o, k) {
            return o == null ? undefined : o[k];
        }, obj);
    }
    function t(path) {
        var v = getPath(dict(), path);
        return v == null ? "" : v;
    }
    function fmt(n) {
        return Math.round(n)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
    }

    /* ============================================================
       APPLY TRANSLATIONS
       ============================================================ */
    function applyI18n() {
        var d = dict();
        document.documentElement.lang = state.lang === "ua" ? "uk" : state.lang;
        document.title = d.meta.title;
        var md = document.querySelector('meta[name="description"]');
        if (md) md.setAttribute("content", d.meta.desc);

        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var v = getPath(d, el.getAttribute("data-i18n"));
            if (typeof v === "string") el.textContent = v;
        });
        document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            var v = getPath(d, el.getAttribute("data-i18n-html"));
            if (typeof v === "string") el.innerHTML = v;
        });
        document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
            var v = getPath(d, el.getAttribute("data-i18n-ph"));
            if (typeof v === "string") el.setAttribute("placeholder", v);
        });

        applyHero();
        renderDynamic();
        // language buttons
        document.querySelectorAll(".lang-switch__btn").forEach(function (b) {
            b.classList.toggle("is-active", b.dataset.lang === state.lang);
        });
    }

    function applyHero() {
        var d = dict();
        var titleEl = document.querySelector("[data-hero='title']");
        var subEl = document.querySelector("[data-hero='sub']");
        if (titleEl) titleEl.innerHTML = d.hero.title[state.theme];
        if (subEl) subEl.textContent = d.hero.sub[state.theme];
    }

    /* ============================================================
       DYNAMIC RENDERERS
       ============================================================ */
    function renderDynamic() {
        var d = dict();
        renderHeroTrust(d);
        renderFormulaRows(d);
        renderAsidePoints(d);
        renderFacts(d);
        renderTrial(d);
        renderAboutCards(d);
        renderSteps(d);
        renderBenefits(d);
        renderBooking(d);
        renderTariffs(d);
        renderSafety(d);
        renderGallery(d);
        renderFaq(d);
        renderChatQuick(d);
        recalcPricing();
        recalcRoi();
    }

    function fillReveal() {
        document.querySelectorAll(".reveal:not(.is-visible)").forEach(observeEl);
    }

    function renderHeroTrust(d) {
        var wrap = document.querySelector("[data-render='heroTrust']");
        if (!wrap) return;
        wrap.innerHTML = d.hero.trust
            .map(function (tx) {
                return "<span>" + IC.check + tx + "</span>";
            })
            .join("");
    }

    function renderFormulaRows(d) {
        var wrap = document.querySelector("[data-render='formulaRows']");
        if (!wrap) return;
        wrap.innerHTML = d.pricing.rows
            .map(function (r) {
                return (
                    '<div class="formula__row"><span>' +
                    r.k +
                    "</span><strong>" +
                    r.v +
                    "</strong></div>"
                );
            })
            .join("");
    }

    function renderAsidePoints(d) {
        var wrap = document.querySelector("[data-render='asidePoints']");
        if (!wrap) return;
        wrap.innerHTML = d.contact.asidePoints
            .map(function (p) {
                return (
                    '<div class="aside-point">' +
                    IC.check +
                    "<div><b>" +
                    p.t +
                    "</b><span>" +
                    p.d +
                    "</span></div></div>"
                );
            })
            .join("");
    }

    function renderFacts(d) {
        var ics = [IC.shirt, IC.drop, IC.clock, IC.pin];
        var wrap = document.querySelector("[data-render='facts']");
        if (!wrap) return;
        wrap.innerHTML = d.facts.items
            .map(function (f, i) {
                return (
                    '<div class="fact reveal" data-delay="' +
                    i +
                    '"><div class="fact__ic">' +
                    ics[i] +
                    "</div><b>" +
                    f.t +
                    "</b><p>" +
                    f.d +
                    "</p></div>"
                );
            })
            .join("");
    }

    function renderTrial(d) {
        var wrap = document.querySelector("[data-render='trialItems']");
        if (!wrap) return;
        wrap.innerHTML = d.trial.items
            .map(function (it) {
                return (
                    '<div class="trial__item">' +
                    IC.check +
                    "<div><b>" +
                    it.t +
                    "</b><span>" +
                    it.d +
                    "</span></div></div>"
                );
            })
            .join("");
    }

    function renderAboutCards(d) {
        var ics = [IC.spark, IC.clock, IC.shirt, IC.pin];
        var wrap = document.querySelector("[data-render='aboutCards']");
        if (!wrap) return;
        wrap.innerHTML = d.about.cards
            .map(function (c, i) {
                return (
                    '<div class="benefit-col reveal" data-delay="' +
                    i +
                    '" style="padding:26px 24px"><div class="benefit-col__ic" style="margin-bottom:16px">' +
                    ics[i] +
                    '</div><h3 style="font-size:1.15rem;margin-bottom:8px">' +
                    c.t +
                    '</h3><p style="font-size:0.92rem;color:var(--muted);line-height:1.55">' +
                    c.d +
                    "</p></div>"
                );
            })
            .join("");
    }

    function renderSteps(d) {
        var wrap = document.querySelector("[data-render='steps']");
        if (!wrap) return;
        var arr = d.how[state.tab];
        wrap.innerHTML = arr
            .map(function (s, i) {
                var accent = i === arr.length - 1 ? " step--accent" : "";
                return (
                    '<div class="step reveal' +
                    accent +
                    '" data-delay="' +
                    (i % 5) +
                    '"><div class="step__num">' +
                    (i + 1) +
                    "</div><h4>" +
                    s.t +
                    "</h4><p>" +
                    s.d +
                    "</p></div>"
                );
            })
            .join("");
        document.querySelectorAll(".tab").forEach(function (b) {
            b.classList.toggle("is-active", b.dataset.tab === state.tab);
        });
        fillReveal();
    }

    function benefitList(arr, alt) {
        return arr
            .map(function (b) {
                return (
                    '<div class="benefit-item"><span class="benefit-item__ic">' +
                    IC.check +
                    "</span><div><b>" +
                    b.t +
                    "</b><p>" +
                    b.d +
                    "</p></div></div>"
                );
            })
            .join("");
    }

    function renderBenefits(d) {
        var wrap = document.querySelector("[data-render='benefits']");
        if (!wrap) return;
        wrap.innerHTML =
            '<div class="benefit-col reveal"><div class="benefit-col__head"><div class="benefit-col__ic">' +
            IC.building +
            "<\/div><div><h3>" +
            d.benefits.companyTitle +
            "<\/h3><p>" +
            d.benefits.companySub +
            "<\/p><\/div><\/div>" +
            benefitList(d.benefits.company) +
            "<\/div>" +
            '<div class="benefit-col benefit-col--alt reveal" data-delay="1"><div class="benefit-col__head"><div class="benefit-col__ic">' +
            IC.heart +
            "<\/div><div><h3>" +
            d.benefits.employeeTitle +
            "<\/h3><p>" +
            d.benefits.employeeSub +
            "<\/p><\/div><\/div>" +
            benefitList(d.benefits.employee, true) +
            "<\/div>";
        fillReveal();
    }

    function renderBooking(d) {
        var list = document.querySelector("[data-render='booking']");
        if (!list) return;
        var b = d.booking;
        // build 21 sessions 9:00-17:00, 20min, lunch 12-13
        var names = [
            "AK", "TN", "MZ", "PW", "KL", "JK", "AS", "MW", "EK",
            "DR", "SK", "NP", "RM", "IJ", "GZ", "KS", "ŁB", "MK", "AP", "JW", "DM",
        ];
        var fulls = [
            "Anna K.", "Tomasz N.", "Magda Z.", "Paweł W.", "Kasia L.", "Jakub K.",
            "Ola S.", "Michał W.", "Ewa K.", "Dorota R.", "Szymon K.", "Natalia P.",
            "Robert M.", "Iza J.", "Grzegorz Z.", "Karolina S.", "Łukasz B.",
            "Monika K.", "Adam P.", "Joanna W.", "Damian M.",
        ];
        var html = "";
        var slot = 0;
        var mins = 9 * 60;
        for (var i = 0; i < 21; i++) {
            if (mins === 12 * 60) {
                html +=
                    '<div class="slot slot--break"><div class="slot__time">12:00</div><div>☕ ' +
                    b.lunch +
                    "</div></div>";
                mins = 13 * 60;
            }
            var h = Math.floor(mins / 60),
                m = mins % 60;
            var time = h + ":" + (m < 10 ? "0" + m : m);
            var status =
                i < 6
                    ? '<span class="slot__status slot__status--done">' + b.done + "</span>"
                    : i === 6
                    ? '<span class="slot__status slot__status--now">' + b.now + "</span>"
                    : '<span class="slot__status slot__status--next">' + time + "</span>";
            var dept = b.depts[i % b.depts.length];
            html +=
                '<div class="slot"><div class="slot__time">' +
                time +
                '</div><div class="slot__person"><div class="slot__avatar" style="background:oklch(0.6 0.13 ' +
                AV_HUES[i % AV_HUES.length] +
                ')">' +
                names[i] +
                '</div><div><div class="slot__name">' +
                fulls[i] +
                '</div><div class="slot__dept">' +
                dept +
                "</div></div></div>" +
                status +
                "</div>";
            mins += 20;
        }
        list.innerHTML = html;
    }

    /* ---------- Pricing ---------- */
    function rateFor(days) {
        if (days <= 1) return 150;
        if (days <= 2) return 135;
        if (days <= 3) return 130;
        if (days <= 4) return 120;
        return 115;
    }

    function renderTariffs(d) {
        var wrap = document.querySelector("[data-render='tariffs']");
        if (!wrap) return;
        var defs = [
            { days: 1 },
            { days: 2 },
            { days: 4, featured: true },
        ];
        wrap.innerHTML = d.pricing.tariffs
            .map(function (tf, i) {
                var days = defs[i].days;
                var rate = rateFor(days);
                var price = rate * 7 * days;
                var dur = state.tariffDur;
                var massages = Math.floor(60 / dur) * 7 * days;
                var per = price / massages;
                var feats = tf.feats
                    .map(function (f) {
                        return "<li>" + IC.check + "<span>" + f + "</span></li>";
                    })
                    .join("");
                return (
                    '<div class="tariff reveal' +
                    (defs[i].featured ? " tariff--featured" : "") +
                    '" data-delay="' +
                    i +
                    '">' +
                    (defs[i].featured
                        ? '<div class="tariff__badge">' + d.pricing.mostPopular + "</div>"
                        : "") +
                    '<div class="tariff__name">' +
                    tf.name +
                    '</div><div class="tariff__freq">' +
                    tf.freq +
                    '</div><div class="tariff__price"><b>' +
                    fmt(price) +
                    ' zł</b><span>' +
                    d.pricing.perMonth +
                    '</span></div><div class="tariff__stats"><span class="tariff__perhead">≈ ' +
                    fmt(massages) +
                    " " +
                    d.pricing.massagesMo +
                    '</span><span class="tariff__permass">≈ ' +
                    fmt(per) +
                    " zł " +
                    d.pricing.perMassage +
                    '</span></div><ul class="tariff__feats">' +
                    feats +
                    '</ul><a href="#kontakt" class="btn ' +
                    (defs[i].featured ? "btn--primary" : "btn--ghost") +
                    ' btn--block">' +
                    d.pricing.cta +
                    "</a></div>"
                );
            })
            .join("");
        fillReveal();
    }

    function recalcPricing() {
        var daysEl = document.getElementById("calcDays");
        if (!daysEl) return;
        var days = +daysEl.value;
        var hours = +document.getElementById("calcHours").value;
        var durBtn = document.querySelector("#calcDur .is-active");
        var dur = durBtn ? +durBtn.dataset.dur : 20;
        var rate = rateFor(days);
        var monthly = rate * hours * days;
        var perHour = Math.floor(60 / dur);
        var massages = perHour * hours * days;
        var per = massages ? monthly / massages : 0;

        document.getElementById("calcDaysOut").textContent = days;
        document.getElementById("calcHoursOut").textContent = hours;
        document.getElementById("calcTotalVal").textContent = fmt(monthly) + " zł";
        document.getElementById("calcMassagesVal").textContent = fmt(massages);
        document.getElementById("calcPerVal").textContent = fmt(per) + " zł";
    }

    /* ---------- ROI ---------- */
    function recalcRoi() {
        var empEl = document.getElementById("roiEmp");
        if (!empEl) return;
        var emp = +empEl.value;
        var salary = +document.getElementById("roiSalary").value;
        var days = +document.getElementById("roiDays").value;
        var rate = rateFor(days);
        var monthly = rate * 7 * days;
        var perEmp = emp ? monthly / emp : 0;
        var pct = salary ? (perEmp / salary) * 100 : 0;
        var massages = 21 * days;
        var year = monthly * 12;

        document.getElementById("roiEmpOut").textContent = emp;
        document.getElementById("roiSalaryOut").textContent = fmt(salary) + " zł";
        document.getElementById("roiDaysOut").textContent = days;
        document.getElementById("roiBig").textContent = fmt(perEmp) + " zł";
        document.getElementById("roiCost").textContent = fmt(monthly) + " zł";
        document.getElementById("roiPct").textContent =
            (pct < 1 ? pct.toFixed(1) : Math.round(pct)) + "%";
        document.getElementById("roiMassages").textContent = fmt(massages);
        document.getElementById("roiYear").textContent = fmt(year) + " zł";
    }

    function renderSafety(d) {
        var ics = [IC.shield, IC.drop, IC.check];
        var wrap = document.querySelector("[data-render='safety']");
        if (!wrap) return;
        wrap.innerHTML = d.safety.items
            .map(function (s, i) {
                return (
                    '<div class="safety reveal" data-delay="' +
                    i +
                    '"><div class="safety__ic">' +
                    ics[i] +
                    "</div><h4>" +
                    s.t +
                    "</h4><p>" +
                    s.d +
                    "</p></div>"
                );
            })
            .join("");
        fillReveal();
    }

    function renderGallery(d) {
        var wrap = document.querySelector("[data-render='gallery']");
        if (!wrap) return;
        var photos = [
            { src: "assets/chair.jpg",     cap: d.gallery.caps[0] },
            { src: "assets/therapist.jpg", cap: d.gallery.caps[1] },
        ];
        wrap.innerHTML = photos
            .map(function (p) {
                return (
                    '<div class="gallery__item gallery__item--pair"><img src="' +
                    p.src +
                    '" alt="' +
                    p.cap +
                    '" loading="lazy" /></div>'
                );
            })
            .join("");
    }

    function renderFaq(d) {
        var wrap = document.querySelector("[data-render='faq']");
        if (!wrap) return;
        wrap.innerHTML = d.faq.items
            .map(function (f) {
                return (
                    '<div class="faq__item"><button class="faq__q">' +
                    f.q +
                    '<span class="faq__icon"></span></button><div class="faq__a"><div class="faq__a-inner">' +
                    f.a +
                    "</div></div></div>"
                );
            })
            .join("");
        wrap.querySelectorAll(".faq__q").forEach(function (q) {
            q.addEventListener("click", function () {
                var item = q.parentElement;
                var a = item.querySelector(".faq__a");
                var open = item.classList.toggle("is-open");
                a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
            });
        });
    }

    /* ============================================================
       CHATBOT
       ============================================================ */
    function renderChatQuick(d) {
        var wrap = document.querySelector("[data-render='chatQuick']");
        if (!wrap) return;
        wrap.innerHTML = d.chat.quick
            .map(function (q, i) {
                return '<button data-qi="' + i + '">' + q.q + "</button>";
            })
            .join("");
        wrap.querySelectorAll("button").forEach(function (b) {
            b.addEventListener("click", function () {
                var qi = +b.dataset.qi;
                var item = dict().chat.quick[qi];
                pushMsg(item.q, "user");
                setTimeout(function () {
                    pushMsg(item.a, "bot");
                }, 450);
            });
        });
        // reset greeting
        var body = document.getElementById("chatBody");
        if (body && !body.dataset.init) {
            pushMsg(d.chat.greeting, "bot");
            body.dataset.init = "1";
        }
    }

    function pushMsg(text, who) {
        var body = document.getElementById("chatBody");
        if (!body) return;
        var m = document.createElement("div");
        m.className = "msg msg--" + who;
        m.textContent = text;
        body.appendChild(m);
        body.scrollTop = body.scrollHeight;
    }

    /* ============================================================
       OBSERVERS / SCROLL
       ============================================================ */
    var io;
    function observeEl(el) {
        if (!io) {
            io = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (e) {
                        if (e.isIntersecting) {
                            e.target.classList.add("is-visible");
                            io.unobserve(e.target);
                        }
                    });
                },
                { threshold: 0.12 }
            );
        }
        io.observe(el);
    }

    /* ============================================================
       INIT
       ============================================================ */
    function setTheme(theme) {
        state.theme = theme;
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("om_theme", theme);
        document.querySelectorAll(".theme-switch__btn").forEach(function (b) {
            b.classList.toggle("is-active", b.dataset.set === theme);
        });
        document.querySelectorAll(".variant-chip").forEach(function (b) {
            b.classList.toggle("is-active", b.dataset.set === theme);
        });
        applyHero();
    }

    function setLang(lang) {
        if (!window.I18N[lang]) return;
        state.lang = lang;
        localStorage.setItem("om_lang", lang);
        applyI18n();
        fillReveal();
    }

    function init() {
        setTheme(state.theme);

        // theme + variant switches
        document.querySelectorAll(".theme-switch__btn, .variant-chip").forEach(
            function (b) {
                b.addEventListener("click", function () {
                    setTheme(b.dataset.set);
                });
            }
        );
        // lang switch
        document.querySelectorAll(".lang-switch__btn").forEach(function (b) {
            b.addEventListener("click", function () {
                setLang(b.dataset.lang);
            });
        });
        // tabs
        document.querySelectorAll(".tab").forEach(function (b) {
            b.addEventListener("click", function () {
                state.tab = b.dataset.tab;
                renderSteps(dict());
            });
        });

        applyI18n();
        fillReveal();

        // calculators
        ["calcDays", "calcHours"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener("input", recalcPricing);
        });
        document.querySelectorAll("#calcDur button").forEach(function (b) {
            b.addEventListener("click", function () {
                document
                    .querySelectorAll("#calcDur button")
                    .forEach(function (x) {
                        x.classList.remove("is-active");
                    });
                b.classList.add("is-active");
                recalcPricing();
            });
        });
        document.querySelectorAll("#tariffDur button").forEach(function (b) {
            b.addEventListener("click", function () {
                document
                    .querySelectorAll("#tariffDur button")
                    .forEach(function (x) {
                        x.classList.remove("is-active");
                    });
                b.classList.add("is-active");
                state.tariffDur = +b.dataset.dur;
                renderTariffs(dict());
            });
        });
        ["roiEmp", "roiSalary", "roiDays"].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener("input", recalcRoi);
        });

        // header scroll + progress
        var header = document.getElementById("header");
        var prog = document.getElementById("progress");
        window.addEventListener(
            "scroll",
            function () {
                var sc = window.scrollY;
                if (header) header.classList.toggle("is-scrolled", sc > 8);
                if (prog) {
                    var h =
                        document.documentElement.scrollHeight -
                        window.innerHeight;
                    prog.style.width = (h > 0 ? (sc / h) * 100 : 0) + "%";
                }
            },
            { passive: true }
        );

        // burger
        var burger = document.getElementById("burger");
        var nav = document.getElementById("nav");
        if (burger && nav) {
            burger.addEventListener("click", function () {
                burger.classList.toggle("is-open");
                nav.classList.toggle("is-open");
            });
            nav.querySelectorAll("a").forEach(function (a) {
                a.addEventListener("click", function () {
                    burger.classList.remove("is-open");
                    nav.classList.remove("is-open");
                });
            });
        }

        // chatbot toggle
        var fab = document.getElementById("chatFab");
        var panel = document.getElementById("chatPanel");
        var cl = document.getElementById("chatClose");
        if (fab && panel) {
            fab.addEventListener("click", function () {
                panel.classList.toggle("is-open");
                var dot = fab.querySelector(".chat-fab__dot");
                if (dot) dot.style.display = "none";
            });
        }
        if (cl) cl.addEventListener("click", function () {
            panel.classList.remove("is-open");
        });

        // form
        var form = document.getElementById("leadForm");
        if (form) {
            var submitting = false;
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                if (submitting) return;
                submitting = true;

                var btn = form.querySelector("[type='submit']");
                var originalText = btn.textContent;
                btn.disabled = true;
                btn.textContent = "Wysyłanie…";

                var fields = form.querySelectorAll("input:not([type=checkbox]), textarea");
                var data = { access_key: "82db62ad-a560-4ba6-823d-31b60c79d1ca" };
                fields.forEach(function (f) {
                    if (f.name) data[f.name] = f.value.trim();
                });
                data.subject = "Nowe zgłoszenie – HealthyOffice";
                data.from_name = data.name || "HealthyOffice strona";
                data.botcheck = "";

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify(data),
                })
                    .then(function (r) { return r.json(); })
                    .then(function (res) {
                        if (res.success) {
                            form.style.display = "none";
                            document.getElementById("formSuccess").classList.add("is-shown");
                        } else {
                            btn.disabled = false;
                            btn.textContent = originalText;
                            submitting = false;
                            alert("Wystąpił błąd. Spróbuj ponownie lub napisz na masaz@healthyoffice.pl");
                        }
                    })
                    .catch(function () {
                        btn.disabled = false;
                        btn.textContent = originalText;
                        submitting = false;
                        alert("Brak połączenia. Spróbuj ponownie lub napisz na masaz@healthyoffice.pl");
                    });
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

// Cookie banner
(function () {
    var banner = document.getElementById("cookieBanner");
    if (!banner) return;
    if (!localStorage.getItem("cookieConsent")) {
        banner.style.display = "flex";
    }
    document.getElementById("cookieAccept").addEventListener("click", function () {
        localStorage.setItem("cookieConsent", "accepted");
        banner.style.display = "none";
    });
    document.getElementById("cookieReject").addEventListener("click", function () {
        localStorage.setItem("cookieConsent", "rejected");
        banner.style.display = "none";
    });
})();
