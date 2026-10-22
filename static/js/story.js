/* The journey: one pinned full-screen canvas, five chapters scrubbed by scroll.
   Each chapter draws its video (scrubbed by scroll) if static/media/scenes/<key>.mp4
   exists, otherwise its photo with a slow cinematic push-in. Chapters cross-fade,
   a light sweep passes between them, and data "packets" travel across the screen. */
(function () {
  "use strict";
  var story = document.getElementById("story");
  var canvas = document.getElementById("sceneCanvas");
  var ctx = canvas.getContext("2d");
  var beats = [].slice.call(document.querySelectorAll(".beat"));
  var nodes = [].slice.call(document.querySelectorAll(".node"));
  var pathFill = document.getElementById("pathFill");
  var counterN = document.getElementById("counterN");
  var header = document.querySelector(".top");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CH = window.STORY || [];
  var MEDIA = window.SCENES || {};
  var N = CH.length;
  var START = 0.1, SPAN = 0.8 / Math.max(1, N), XF = 0.035; // timeline

  var W = 0, H = 0, dpr = 1, mobile = false;
  var p = 0, sp = 0, lastSp = 0, vel = 0, t0 = performance.now();

  /* ---------- scenes ---------- */
  var scenes = CH.map(function (c, i) {
    var a = i === 0 ? 0 : START + i * SPAN;
    var b = i === N - 1 ? 1 : START + (i + 1) * SPAN;
    var m = MEDIA[c.key] || {};
    var sc = { key: c.key, from: a, to: b, fx: c.fx == null ? 0.5 : c.fx, fy: c.fy == null ? 0.5 : c.fy, img: null, video: null };
    if (m.image) {
      sc.img = new Image();
      sc.img.decoding = "async";
      sc.img.src = m.image;
    }
    if (m.video) {
      var v = document.createElement("video");
      v.muted = true; v.playsInline = true; v.preload = "auto";
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.src = m.video;
      sc.video = v;
    }
    return sc;
  });

  /* ---------- particles: drifting dust + data packets ---------- */
  var dust = [], packets = [];
  function seed() {
    dust = []; packets = [];
    var nd = mobile ? 26 : 55, np = mobile ? 7 : 14;
    for (var i = 0; i < nd; i++) dust.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3, s: Math.random() * 0.25 + 0.05, a: Math.random() * 0.5 + 0.15 });
    for (var j = 0; j < np; j++) packets.push(newPacket(true));
  }
  function newPacket(anywhere) {
    return { x: anywhere ? Math.random() : -0.1, y: 0.15 + Math.random() * 0.75, len: 0.04 + Math.random() * 0.09, s: 0.12 + Math.random() * 0.35, a: 0.25 + Math.random() * 0.5 };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    mobile = W <= 720;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    seed();
  }

  function progress() {
    var r = story.getBoundingClientRect();
    var total = story.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
  }

  /* draw a media element "cover"-style with zoom and a focus point */
  function cover(el, w0, h0, zoom, fx, fy, alpha, driftX) {
    if (!w0 || !h0 || alpha <= 0) return;
    var cw = W * dpr, chh = H * dpr;
    var s = Math.max(cw / w0, chh / h0) * zoom;
    var dw = w0 * s, dh = h0 * s;
    // keep the focus point on screen; on phones pull the subject to the centre
    var tx = mobile ? 0.5 : 0.5 + (fx - 0.5) * 0.15;
    var x = cw * tx - dw * fx + driftX * dpr;
    var y = chh * 0.5 - dh * fy;
    x = Math.min(0, Math.max(cw - dw, x));
    y = Math.min(0, Math.max(chh - dh, y));
    ctx.globalAlpha = alpha;
    ctx.drawImage(el, x, y, dw, dh);
    ctx.globalAlpha = 1;
  }

  function weightOf(sc, q) {
    // fade in over XF before 'from', out over XF before 'to'
    var inA = sc.from === 0 ? 1 : smooth(clamp((q - (sc.from - XF)) / XF));
    var outA = sc.to >= 1 ? 1 : 1 - smooth(clamp((q - (sc.to - XF)) / XF));
    return Math.min(inA, outA);
  }

  function drawScene(sc, q, alpha) {
    var local = clamp((q - sc.from) / Math.max(0.001, sc.to - sc.from));
    var zoom = (mobile ? 1.0 : 1.04) + local * 0.14;
    var drift = (local - 0.5) * -40;
    var v = sc.video;
    if (v && v.readyState >= 1 && v.duration) {
      var want = local * (v.duration - 0.05);
      if (Math.abs(v.currentTime - want) > 0.03) { try { v.currentTime = want; } catch (e) {} }
      if (v.readyState >= 2) { cover(v, v.videoWidth, v.videoHeight, zoom * 0.98, sc.fx, sc.fy, alpha, drift * 0.3); return; }
    }
    if (sc.img && sc.img.complete && sc.img.naturalWidth) {
      cover(sc.img, sc.img.naturalWidth, sc.img.naturalHeight, zoom, sc.fx, sc.fy, alpha, drift);
    }
  }

  function frame(now) {
    var target = progress();
    sp += (target - sp) * (reduced ? 1 : 0.1);
    if (Math.abs(target - sp) < 0.0001) sp = target;
    vel = vel * 0.9 + Math.abs(sp - lastSp) * 60;
    lastSp = sp;
    var q = sp, time = (now - t0) / 1000;

    var cw = W * dpr, chh = H * dpr;
    ctx.fillStyle = "#06080b";
    ctx.fillRect(0, 0, cw, chh);

    // scenes (cross-fade: draw lower first)
    var active = -1, best = -1;
    for (var i = 0; i < scenes.length; i++) {
      var w = weightOf(scenes[i], q);
      if (w > 0.001) {
        // the newer scene fades in over the older one
        drawScene(scenes[i], q, i === 0 ? 1 : w);
        if (w > best) { best = w; active = i; }
      }
    }
    // dim the last scene behind the finale
    var fin = smooth(clamp((q - 0.9) / 0.05));
    if (fin > 0) { ctx.fillStyle = "rgba(6,8,11," + (fin * 0.55).toFixed(3) + ")"; ctx.fillRect(0, 0, cw, chh); }

    if (!reduced) {
      // light sweep between chapters
      for (var k = 1; k < scenes.length; k++) {
        var b = scenes[k].from, d = (q - (b - XF)) / (XF * 1.6);
        if (d > 0 && d < 1) {
          var x = (-0.2 + d * 1.4) * cw;
          var g = ctx.createLinearGradient(x - cw * 0.18, 0, x + cw * 0.18, 0);
          g.addColorStop(0, "rgba(22,199,230,0)");
          g.addColorStop(0.5, "rgba(140,240,255," + (0.22 * Math.sin(d * Math.PI)).toFixed(3) + ")");
          g.addColorStop(1, "rgba(22,199,230,0)");
          ctx.fillStyle = g;
          ctx.fillRect(x - cw * 0.18, 0, cw * 0.36, chh);
        }
      }
      // dust
      ctx.fillStyle = "#bff6ff";
      for (var a = 0; a < dust.length; a++) {
        var m = dust[a];
        var yy = ((m.y - time * m.s * 0.03) % 1 + 1) % 1;
        ctx.globalAlpha = m.a * (0.6 + 0.4 * Math.sin(time * 1.3 + a));
        ctx.beginPath();
        ctx.arc(m.x * cw, yy * chh, m.r * dpr, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // data packets: faster while scrolling
      var boost = 1 + Math.min(6, vel * 40);
      for (var j = 0; j < packets.length; j++) {
        var pk = packets[j];
        pk.x += pk.s * boost / 60 * 0.35;
        if (pk.x - pk.len > 1.05) packets[j] = pk = newPacket(false);
        var x2 = pk.x * cw, x1 = (pk.x - pk.len) * cw, py = pk.y * chh;
        var lg = ctx.createLinearGradient(x1, 0, x2, 0);
        lg.addColorStop(0, "rgba(22,199,230,0)");
        lg.addColorStop(1, "rgba(160,245,255," + (pk.a * 0.55).toFixed(3) + ")");
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.2 * dpr;
        ctx.beginPath(); ctx.moveTo(x1, py); ctx.lineTo(x2, py); ctx.stroke();
        ctx.fillStyle = "rgba(200,250,255," + (pk.a * 0.8).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(x2, py, 1.6 * dpr, 0, 6.283); ctx.fill();
      }
    }

    updateUI(q, active);
    requestAnimationFrame(frame);
  }

  /* ---------- text beats, path rail, counter ---------- */
  beats.forEach(function (b) {
    b._from = parseFloat(b.dataset.from); b._to = parseFloat(b.dataset.to);
    b._words = [];
    b.querySelectorAll(".split").forEach(function (h) {
      var words = h.textContent.trim().split(/\s+/);
      h.textContent = "";
      words.forEach(function (w, i) {
        var s = document.createElement("span");
        s.className = "w"; s.textContent = w;
        h.appendChild(s);
        if (i < words.length - 1) h.appendChild(document.createTextNode(" "));
        b._words.push(s);
      });
    });
  });

  var lastActive = -2;
  function updateUI(q, active) {
    for (var i = 0; i < beats.length; i++) {
      var b = beats[i], f = b._from, t = b._to;
      var fade = 0.02;
      var a = f <= 0 ? 1 : clamp((q - f) / fade);
      var o = t >= 1 ? 1 : 1 - clamp((q - (t - fade)) / fade);
      var vis = Math.min(a, o);
      b.style.opacity = vis.toFixed(3);
      b.style.visibility = vis > 0.01 ? "visible" : "hidden";
      b.style.transform = "translate3d(0," + ((1 - a) * 24 - (1 - o) * 18).toFixed(1) + "px,0)";
      b.classList.toggle("on", vis > 0.5);
      // words reveal one by one in the first part of the beat
      var lp = f <= 0 ? 1 : clamp((q - f) / Math.max(0.001, (t - f) * 0.4));
      var nW = b._words.length;
      for (var k = 0; k < nW; k++) {
        var wv = reduced ? 1 : clamp(lp * (nW + 2) - k);
        var ws = b._words[k].style;
        ws.opacity = wv.toFixed(3);
        ws.transform = "translate3d(0," + ((1 - wv) * 20).toFixed(1) + "px,0)";
        ws.filter = wv < 1 ? "blur(" + ((1 - wv) * 6).toFixed(1) + "px)" : "none";
      }
    }
    // network path
    var reached = -1;
    for (var n = 0; n < scenes.length; n++) if (q >= scenes[n].from + (n === 0 ? START * 0.9 : 0) - 0.001) reached = n;
    nodes.forEach(function (el, i) {
      el.classList.toggle("done", i < reached);
      el.classList.toggle("now", i === reached);
    });
    var fill = clamp((q - START * 0.9) / (1 - START * 0.9 - 0.1));
    pathFill.style.transform = (mobile ? "scaleX(" : "scaleY(") + fill.toFixed(4) + ")";
    if (reached !== lastActive) {
      counterN.textContent = reached < 0 ? "00" : ("0" + (reached + 1)).slice(-2);
      lastActive = reached;
    }
    story.classList.toggle("in-final", q > 0.9);
  }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(t) { return t * t * (3 - 2 * t); }

  /* ---------- the rest of the page ---------- */
  var GLYPHS = "01#<>/_\\|=+*";
  function decode(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var text = el.getAttribute("data-text") || el.textContent;
    if (reduced) { el.textContent = text; return; }
    var start = performance.now(), dur = Math.min(1400, 380 + text.length * 32);
    (function step(now) {
      var pr = Math.min(1, (now - start) / dur), shown = Math.floor(pr * text.length), out = "";
      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (i < shown || c === " ") out += c;
        else if (i < shown + 6) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else out += " ";
      }
      el.textContent = out;
      if (pr < 1) requestAnimationFrame(step); else el.textContent = text;
    })(start);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (e.target.classList.contains("decode")) decode(e.target); else e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal, .decode").forEach(function (el) { io.observe(el); });

  // nav click on a chapter node jumps to it
  nodes.forEach(function (el, i) {
    el.addEventListener("click", function () {
      var total = story.offsetHeight - window.innerHeight;
      var q = i === 0 ? START + 0.02 : scenes[i].from + 0.03;
      window.scrollTo({ top: story.offsetTop + q * total, behavior: "smooth" });
    });
  });

  // report every WhatsApp tap to the team (handled by /api/click on Vercel)
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
    if (!a) return;
    var sec = a.closest("section, header, .wa-float");
    var where = sec ? (sec.id || (sec.classList.contains("wa-float") ? "floating button" : sec.tagName.toLowerCase())) : "";
    var label = (a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g, " ").replace("→", "").trim();
    var data = JSON.stringify({ label: (label || "WhatsApp") + (where ? " · " + where : ""), page: location.pathname + location.hash });
    try {
      if (!(navigator.sendBeacon && navigator.sendBeacon("/api/click", new Blob([data], { type: "application/json" })))) {
        fetch("/api/click", { method: "POST", body: data, headers: { "Content-Type": "application/json" }, keepalive: true });
      }
    } catch (err) { /* never block the WhatsApp link */ }
  }, true);

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
