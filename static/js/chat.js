/* Website chat assistant.
   Any WhatsApp button on the page opens this chat instead. It asks a few questions,
   sends the lead to the server (/api/lead -> your WhatsApp), and finally offers the
   customer a "Send on WhatsApp" button with the summary already typed. */
(function () {
  "use strict";
  var CFG = window.CHAT || {};
  var WA = CFG.whatsapp || "96181706156";
  var WA_PRETTY = CFG.whatsappPretty || "+961 81 706 156";

  var SERVICES = [
    ["net", "Network & Wi-Fi", "شبكة و Wi-Fi", /network|wi-?fi|switch|router|cabl|fiber/i],
    ["remote", "Remote IT support", "دعم تقني عن بعد", /support session|remote/i],
    ["cctv", "CCTV & security", "كاميرات مراقبة", /cctv|camera/i],
    ["voip", "IP phones", "هواتف IP", /ip phone|telephon|voip/i],
    ["fw", "Firewall & VPN", "Firewall و VPN", /firewall|vpn/i],
    ["srv", "Servers & backups", "سيرفرات و نسخ احتياطي", /server|backup/i],
    ["plan", "Monthly IT plan", "خطة دعم شهرية", /plan/i],
    ["other", "Something else", "شي تاني", null]
  ];
  var URG = [["now", "Urgent (today)", "مستعجل (اليوم)"], ["week", "This week", "هالأسبوع"], ["info", "Just asking", "بس استفسار"]];

  var T = {
    en: {
      title: "Daouk IT Services", status: "Assistant · replies instantly",
      hello: "Hi 👋 I'm the Daouk IT assistant. I'll take a few details and pass them to our engineers on WhatsApp.",
      lang: "Which language do you prefer?",
      name: "What's your name?",
      phone: "Thanks {name}! What's your phone / WhatsApp number? (so our team can reach you)",
      badPhone: "That doesn't look like a phone number. Please try again, for example 03 123 456 or +961 70 123 456.",
      company: "Your company or business name? (or tap Skip)",
      service: "What do you need help with?",
      gotService: "Got it: {service}.",
      area: "Where are you located? (area or city)",
      details: "Briefly describe what you need.",
      urgency: "How urgent is it?",
      review: "Here's your request:",
      send: "Send request ✅", restart: "Start over", skip: "Skip",
      sending: "Sending…",
      done: "Done ✅ Your request reached our team. An engineer will contact you soon on {phone}.",
      doneWa: "Want to chat with us right away? Tap below: WhatsApp opens with your request already written.",
      waBtn: "Send on WhatsApp", close: "Close",
      fail: "Almost done! Tap the green button below to send your request to our team on WhatsApp.",
      placeholder: "Type your answer…", direct: "Prefer WhatsApp directly?",
      labels: { name: "Name", phone: "Phone", company: "Company", service: "Service", area: "Area", urgency: "Urgency", details: "Details" }
    },
    ar: {
      title: "Daouk IT Services", status: "المساعد · بيرد فوراً",
      name: "شو إسمك؟",
      phone: "أهلا {name}! شو رقم تلفونك / واتساب؟ (ليقدر فريقنا يتواصل معك)",
      badPhone: "الرقم مش واضح. جرب مرة تانية، مثلاً 03 123 456 أو 70123456 961+.",
      company: "إسم الشركة أو المحل؟ (أو كبس تخطي)",
      service: "بشو فينا نساعدك؟",
      gotService: "تمام: {service}.",
      area: "وين موقعك؟ (المنطقة أو المدينة)",
      details: "اشرحلنا باختصار شو بدك.",
      urgency: "قديش مستعجل؟",
      review: "هيدا طلبك:",
      send: "إرسال الطلب ✅", restart: "من الأول", skip: "تخطي",
      sending: "عم نبعت…",
      done: "تم ✅ وصل طلبك لفريقنا. رح يتواصل معك مهندس قريباً على {phone}.",
      doneWa: "بدك تحكي معنا هلق؟ كبس تحت: بينفتح واتساب والطلب مكتوب.",
      waBtn: "إرسال على واتساب", close: "إغلاق",
      fail: "خلصنا تقريباً! كبس الزر الأخضر تحت لتبعت طلبك لفريقنا على واتساب.",
      placeholder: "اكتب جوابك…", direct: "بتفضل واتساب مباشرة؟",
      labels: { name: "الإسم", phone: "الهاتف", company: "الشركة", service: "الخدمة", area: "المنطقة", urgency: "الأولوية", details: "التفاصيل" }
    }
  };

  /* ---------- UI ---------- */
  var root, log, input, form, chipsBox, directLink;
  function build() {
    root = el("div", "chat-root");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "Chat with Daouk IT Services");
    root.innerHTML =
      '<div class="chat-card">' +
        '<div class="chat-head"><div class="chat-av">D<i></i></div>' +
          '<div class="chat-who"><b class="c-title"></b><small class="c-status"></small></div>' +
          '<button class="chat-x" type="button" aria-label="Close">✕</button></div>' +
        '<div class="chat-log" aria-live="polite"></div>' +
        '<div class="chat-chips"></div>' +
        '<form class="chat-form" autocomplete="on"><input class="chat-in" name="msg" maxlength="600" autocomplete="off" />' +
          '<button class="chat-send" type="submit" aria-label="Send">➤</button></form>' +
        '<a class="chat-direct" target="_blank" rel="noopener"></a>' +
      '</div>';
    document.body.appendChild(root);
    log = root.querySelector(".chat-log");
    input = root.querySelector(".chat-in");
    form = root.querySelector(".chat-form");
    chipsBox = root.querySelector(".chat-chips");
    directLink = root.querySelector(".chat-direct");
    root.querySelector(".chat-x").onclick = close;
    root.addEventListener("click", function (e) { if (e.target === root) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("open")) close(); });
    form.onsubmit = function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v || !waiting) return;
      input.value = "";
      answer(v, v);
    };
  }
  function el(tag, cls, html) { var d = document.createElement(tag); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; })
      .replace(/\+?\d[\d ]{6,}\d/g, function (n) { return '<bdi dir="ltr">' + n + "</bdi>"; }); // keep phone numbers left-to-right
  }
  function fill(s, v) { return s.replace(/\{(\w+)\}/g, function (_, k) { return v[k] || ""; }); }

  function scroll() { log.scrollTop = log.scrollHeight; }
  function botSay(text, opts) {
    var typing = el("div", "msg bot typing", "<span></span><span></span><span></span>");
    log.appendChild(typing); scroll();
    return new Promise(function (ok) {
      setTimeout(function () {
        typing.remove();
        var m = el("div", "msg bot", opts && opts.html ? text : esc(text).replace(/\n/g, "<br>"));
        if (L === "ar") m.dir = "rtl";
        log.appendChild(m); scroll(); ok(m);
      }, Math.min(900, 280 + text.length * 6));
    });
  }
  function meSay(text) { var m = el("div", "msg me", esc(text)); if (L === "ar") m.dir = "rtl"; log.appendChild(m); scroll(); }
  function chips(list) {
    chipsBox.innerHTML = "";
    list.forEach(function (c) {
      var b = el("button", "chip" + (c.primary ? " chip-primary" : ""), esc(c.label));
      b.type = "button";
      b.onclick = function () { chipsBox.innerHTML = ""; answer(c.value, c.label); };
      chipsBox.appendChild(b);
    });
  }
  function ask(kind, chipList, typeable) {
    step = kind; waiting = true;
    chips(chipList || []);
    form.style.display = typeable === false ? "none" : "";
    if (typeable !== false) { input.placeholder = t().placeholder; setTimeout(function () { input.focus({ preventScroll: true }); }, 50); }
    input.type = kind === "phone" ? "tel" : "text";
    input.dir = L === "ar" ? "rtl" : "auto";
    if (kind === "phone") input.dir = "ltr";
  }

  /* ---------- conversation ---------- */
  var L = "en", step = "", waiting = false, lead = {}, source = "";
  function t() { return T[L]; }

  function open(prefill, label) {
    if (!root) build();
    source = label || "";
    lead = { first: prefill || "", source: source };
    var hint = prefill ? SERVICES.find(function (s) { return s[3] && s[3].test(prefill); }) : null;
    if (hint) lead.serviceId = hint[0];
    log.innerHTML = ""; chipsBox.innerHTML = "";
    L = (document.documentElement.lang || "en").slice(0, 2) === "ar" ? "ar" : "en";
    paintHead();
    directLink.href = "https://wa.me/" + WA + (prefill ? "?text=" + encodeURIComponent(prefill) : "");
    root.classList.add("open");
    document.documentElement.classList.add("chat-open");
    botSay(T.en.hello).then(function () { return botSay(T.en.lang + "\nأي لغة بتفضل؟"); }).then(function () {
      ask("lang", [{ label: "English", value: "en" }, { label: "عربي", value: "ar" }], false);
    });
  }
  function close() {
    root.classList.remove("open");
    document.documentElement.classList.remove("chat-open");
    waiting = false;
  }
  function paintHead() {
    root.querySelector(".c-title").textContent = t().title;
    root.querySelector(".c-status").textContent = t().status;
    directLink.textContent = t().direct + " " + WA_PRETTY + " ↗";
    root.querySelector(".chat-card").dir = L === "ar" ? "rtl" : "ltr";
  }

  function answer(value, shown) {
    if (!waiting) return;
    waiting = false;
    meSay(shown);
    var s = step;
    if (s === "lang") { L = value === "ar" ? "ar" : "en"; paintHead(); return botSay(t().name).then(function () { ask("name"); }); }
    if (s === "name") { lead.name = value.slice(0, 80); return botSay(fill(t().phone, { name: lead.name.split(" ")[0] })).then(function () { ask("phone"); }); }
    if (s === "phone") {
      var p = normPhone(value);
      if (!p) return botSay(t().badPhone).then(function () { ask("phone"); });
      lead.phone = p;
      return botSay(t().company).then(function () { ask("company", [{ label: t().skip, value: "" }]); });
    }
    if (s === "company") {
      lead.company = value.slice(0, 100);
      if (lead.serviceId) return botSay(fill(t().gotService, { service: svcName(lead.serviceId) }) + "\n" + t().area).then(function () { ask("area"); });
      return botSay(t().service).then(function () {
        ask("service", SERVICES.map(function (x) { return { label: L === "ar" ? x[2] : x[1], value: x[0] }; }), false);
      });
    }
    if (s === "service") { lead.serviceId = value; return botSay(t().area).then(function () { ask("area"); }); }
    if (s === "area") { lead.area = value.slice(0, 100); return botSay(t().details).then(function () { ask("details"); }); }
    if (s === "details") {
      lead.details = value.slice(0, 600);
      return botSay(t().urgency).then(function () {
        ask("urgency", URG.map(function (u) { return { label: L === "ar" ? u[2] : u[1], value: u[0] }; }), false);
      });
    }
    if (s === "urgency") {
      lead.urgencyId = value;
      // no confirm button: show the summary and send the request straight away
      form.style.display = "none";
      return botSay(t().review + "<br><br>" + summaryHtml(), { html: true }).then(submit);
    }
    if (s === "confirm") {
      if (value === "restart") { lead = { first: lead.first, source: source, serviceId: null }; return botSay(t().name).then(function () { ask("name"); }); }
      return submit();
    }
  }

  function svcName(id) { var x = SERVICES.find(function (s) { return s[0] === id; }); return x ? (L === "ar" ? x[2] : x[1]) : ""; }
  function urgName(id, lang) { var x = URG.find(function (u) { return u[0] === id; }); return x ? ((lang || L) === "ar" ? x[2] : x[1]) : ""; }
  function rows(lang) {
    var lb = T[lang || L].labels, svc = SERVICES.find(function (s) { return s[0] === lead.serviceId; });
    return [
      [lb.name, lead.name], [lb.phone, lead.phone], [lb.company, lead.company || "—"],
      [lb.service, svc ? (lang === "en" ? svc[1] : (lang || L) === "ar" ? svc[2] : svc[1]) : "—"],
      [lb.area, lead.area], [lb.urgency, urgName(lead.urgencyId, lang)], [lb.details, lead.details]
    ];
  }
  function summaryHtml() {
    return '<span class="sum">' + rows().map(function (r) { return "<b>" + esc(r[0]) + ":</b> " + esc(r[1] || "—"); }).join("<br>") + "</span>";
  }
  function waText() {
    return ["Hello Daouk IT Services, here is my request:"].concat(rows("en").map(function (r) { return r[0] + ": " + (r[1] || "—"); })).join("\n");
  }

  function submit() {
    var payload = {
      name: lead.name, phone: lead.phone, company: lead.company || "",
      service: (SERVICES.find(function (s) { return s[0] === lead.serviceId; }) || [0, ""])[1],
      area: lead.area, details: lead.details, urgency: urgName(lead.urgencyId, "en"),
      language: L === "ar" ? "Arabic" : "English", source: source, first: lead.first, page: location.pathname
    };
    var waUrl = "https://wa.me/" + WA + "?text=" + encodeURIComponent(waText());
    return botSay(t().sending).then(function () {
      return fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
        .catch(function () { return false; });
    }).then(function (ok) {
      if (ok) {
        return botSay(fill(t().done, { phone: lead.phone })).then(function () { return botSay(t().doneWa); }).then(function () {
          finalButtons(waUrl);
        });
      }
      return botSay(t().fail).then(function () { finalButtons(waUrl); });
    });
  }
  function finalButtons(waUrl) {
    chipsBox.innerHTML = "";
    var a = el("a", "chip chip-wa", "<span>●</span> " + esc(t().waBtn));
    a.href = waUrl; a.target = "_blank"; a.rel = "noopener"; a.dataset.chatSkip = "1";
    var c = el("button", "chip", esc(t().close)); c.type = "button"; c.onclick = close;
    chipsBox.appendChild(a); chipsBox.appendChild(c);
    form.style.display = "none";
  }

  // Lebanese numbers: 03 123 456, 70123456, +961 70 123 456, 00961...
  function normPhone(v) {
    var d = v.replace(/[^\d+]/g, "");
    if (d.indexOf("00") === 0) d = "+" + d.slice(2);
    var digits = d.replace(/\D/g, "");
    if (d.charAt(0) === "+") { return digits.length >= 8 && digits.length <= 15 ? "+" + digits : null; }
    if (/^0?[1-9]\d{6,7}$/.test(digits)) return "+961" + digits.replace(/^0/, "");
    if (/^961\d{7,8}$/.test(digits)) return "+" + digits;
    return digits.length >= 8 && digits.length <= 15 ? "+" + digits : null;
  }

  /* ---------- every WhatsApp link on the page opens the chat ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
    if (!a || a.dataset.chatSkip || (root && root.contains(a))) return;
    e.preventDefault();
    var text = "";
    try { text = new URL(a.href).searchParams.get("text") || ""; } catch (err) {}
    var sec = a.closest("section, header, .wa-float");
    var where = sec ? (sec.id || (sec.classList.contains("wa-float") ? "floating button" : sec.tagName.toLowerCase())) : "";
    var label = (a.getAttribute("aria-label") || a.textContent || "WhatsApp").replace(/\s+/g, " ").replace("→", "").trim();
    open(text, label + (where ? " · " + where : ""));
  });

  // hardware cards: tap to ask for a quote on that item
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-ask]");
    if (!b) return;
    open(b.getAttribute("data-ask"), "Hardware · " + (b.querySelector(".hw-model") || b).textContent.trim());
    try { navigator.sendBeacon && navigator.sendBeacon("/api/click", new Blob([JSON.stringify({ label: "Quote request · " + (b.querySelector(".hw-model") || b).textContent.trim() })], { type: "application/json" })); } catch (err) {}
  });

  // hardware tabs
  document.querySelectorAll(".hw-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var cat = tab.getAttribute("data-cat");
      document.querySelectorAll(".hw-tab").forEach(function (x) { x.classList.toggle("on", x === tab); });
      document.querySelectorAll(".hw").forEach(function (card) {
        var show = cat === "all" || card.getAttribute("data-cat") === cat;
        card.hidden = !show;
        if (show) card.classList.add("in");
      });
    });
  });

  // the round chat button only appears after the first screen
  function pastHero() { document.documentElement.classList.toggle("past-hero", window.scrollY > window.innerHeight * 0.6); }
  window.addEventListener("scroll", pastHero, { passive: true });
  pastHero();

  window.DaoukChat = { open: open };
})();
