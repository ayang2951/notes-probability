// List of section files
const sections = ["sections/families.md", "sections/measure.md", "sections/integration.md"];

const contentDiv = document.getElementById("content");
const tocDiv = document.getElementById("toc");

// Load all sections
async function loadSections() {
  for (const file of sections) {
    const resp = await fetch(file);
    const text = await resp.text();
    const html = marked.parse(text);
    const sectionEl = document.createElement("section");
    sectionEl.innerHTML = html;
    contentDiv.appendChild(sectionEl);
  }
  generateTOC();
  enableCollapsibles();
}

// Generate Table of Contents
function generateTOC() {
  const headers = contentDiv.querySelectorAll("h2, h3");
  let tocHTML = "<ul>";
  headers.forEach(h => {
    const id = h.textContent.replace(/\s+/g, "-").toLowerCase();
    h.id = id;
    tocHTML += `<li><a href="#${id}">${h.textContent}</a></li>`;
  });
  tocHTML += "</ul>";
  tocDiv.innerHTML = tocHTML;
}

// Enable collapsibles
function enableCollapsibles() {
  document.querySelectorAll(".collapsible").forEach(btn => {
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

loadSections();
