(function() {
  "use strict";

  function themeValue(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function applyChantTheme(root) {
    var scope = root || document;
    var warmWhite = themeValue("--ui-text", "#f3e6d4");
    var rubricRed = themeValue("--ui-red", "#d64a48");
    var staffRed = themeValue("--ui-red-soft", "#b94a43");
    var svgs = [];

    if (scope.matches && scope.matches("svg.ChantScore, .chant-preview svg")) {
      svgs.push(scope);
    }
    if (scope.querySelectorAll) {
      svgs = svgs.concat(Array.prototype.slice.call(scope.querySelectorAll("svg.ChantScore, .chant-preview svg")));
    }

    Array.prototype.forEach.call(svgs, function(svg) {
      svg.style.color = warmWhite;
      svg.style.fill = warmWhite;

      Array.prototype.forEach.call(svg.querySelectorAll("text, tspan"), function(node) {
        if (!node.getAttribute("fill") && !/fill\s*:/.test(node.getAttribute("style") || "")) {
          node.style.fill = warmWhite;
        }
      });

      Array.prototype.forEach.call(svg.querySelectorAll("path, use, line, rect"), function(node) {
        var style = node.getAttribute("style") || "";
        if (!node.getAttribute("fill") && !/fill\s*:/.test(style)) {
          node.style.fill = "currentColor";
        }
        if (node.getAttribute("stroke") && !/stroke\s*:/.test(style)) {
          node.style.stroke = "currentColor";
        }
      });

      Array.prototype.forEach.call(svg.querySelectorAll(".glyph, .neumeLine, .neumeBeam, .horizontalEpisema"), function(node) {
        node.style.fill = warmWhite;
        node.style.stroke = warmWhite;
      });

      Array.prototype.forEach.call(svg.querySelectorAll(".staffLine, .staffLines, .ledgerLine, .dividerLine"), function(node) {
        node.style.fill = staffRed;
        node.style.stroke = staffRed;
      });

      Array.prototype.forEach.call(svg.querySelectorAll(
        ".Annotation, .annotation, .Rubric, .rubric, .AboveLinesText, .aboveLinesText, [style*='fill:#f00'], [style*='fill: #f00']"
      ), function(node) {
        node.style.fill = rubricRed;
        node.style.color = rubricRed;
      });
    });
  }

  window.applyChantTheme = applyChantTheme;
  window.afterChantLayout = function() {
    applyChantTheme(document);
  };

  document.addEventListener("DOMContentLoaded", function() {
    applyChantTheme(document);

    if (window.MutationObserver) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes && mutation.addedNodes.length) {
            Array.prototype.forEach.call(mutation.addedNodes, function(node) {
              if (node.nodeType === 1) applyChantTheme(node);
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  });
})();
