// List of section Markdown files (in order)
const sections = [
  "sections/families.md",
  "sections/measure.md",
  "sections/integration.md"
];

const contentDiv = document.getElementById("content");
const tocDiv = document.getElementById("toc");

marked.setOptions({ mangle: false, headerIds: true });

// Auto-numbering counters
let counters = {
  definition: 0,
  theorem: 0,
  proposition: 0,
  lemma: 0,
  section: 0
};

// Reset counters for each top-level section
function resetCounters() {
  counters.definition = 0;
  counters.theorem = 0;
  counters.proposition = 0;
  counters.lemma = 0;
}

// Load all sections
(async function init() {
  for (const file of sections) {
    counters.section++;
    resetCounters();

    const resp = await fetch(file);
    const text = await resp.text();
    const html = marked.parse(text);

    const wrapper = document.createElement("section");
    wrapper.innerHTML = html;

    // Auto-number boxes
    wrapper.querySelectorAll(".box").forEach(box => {
      if (box.classList.contains("definition")) {
        counters.definition++;
        box.querySelector(".title").textContent =
          `Definition ${counters.section}.${counters.definition}: ` +
          box.querySelector(".title").textContent;
      }
      if (box.classList.contains("theorem")) {
        counters.theorem++;
        box.querySelector(".title").textContent =
          `Theorem ${counters.section}.${counters.theorem}: ` +
          box.querySelector(".title").textContent;
      }
      if (box.classList.contains("proposition")) {
        counters.proposition++;
        box.querySelector(".title").textContent =
          `Proposition ${counters.section}.${counters.proposition}: ` +
          box.querySelector(".title").textContent;
      }
      if (box.classList.contains("lemma")) {
        counters.lemma++;
        box.querySelector(".title").textContent =
          `Lemma ${counters.section}.${counters.lemma}: ` +
          box.querySelector(".title").textContent;
      }
    });

    contentDiv.appendChild(wrapper);
  }

  buildTOC();
  enableCollapsibles();
  typesetMath();
})();

// TOC builder
function buildTOC() {
  const headers = contentDiv.querySelectorAll("h2, h3");
  let html = "<ul>";
  headers.forEach(h => {
    const id = h.textContent.replace(/\s+/g, "-").toLowerCase();
    h.id = id;
    html += `<li><a href="#${id}">${h.textContent}</a></li>`;
  });
  html += "</ul>";
  tocDiv.innerHTML = html;
}

// Collapsibles
function enableCollapsibles() {
  const coll = document.getElementsByClassName("collapsible");
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }
}

// MathJax
function typesetMath() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
}
