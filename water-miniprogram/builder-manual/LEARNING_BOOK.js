(() => {
  const sourceNode = document.getElementById("book-source");
  const article = document.getElementById("article");

  if (!sourceNode || !article) {
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  const source = sourceNode.textContent.replace(/\uFEFF/g, "").trim();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const accentHues = [192, 160, 42, 358, 18, 212, 132];

  const ui = {
    currentLabel: document.getElementById("current-label"),
    currentSectionLabel: document.getElementById("current-section-label"),
    progressBar: document.getElementById("progress-bar"),
    chapterProgressBar: document.getElementById("chapter-progress-bar"),
    menuToggle: document.getElementById("menu-toggle"),
    overlay: document.getElementById("overlay"),
    toc: document.getElementById("toc"),
    bookTitle: document.getElementById("book-title"),
    bookSubtitle: document.getElementById("book-subtitle"),
    coverPreface: document.getElementById("cover-preface"),
    sidebarCopy: document.getElementById("sidebar-copy"),
    statChapters: document.getElementById("stat-chapters"),
    statSections: document.getElementById("stat-sections"),
    statRead: document.getElementById("stat-read"),
    heroStatChapters: document.getElementById("hero-stat-chapters"),
    heroStatSections: document.getElementById("hero-stat-sections"),
    heroStatRead: document.getElementById("hero-stat-read"),
    heroStack: document.getElementById("hero-stack"),
    chapterRibbon: document.getElementById("chapter-ribbon"),
    railChapterTitle: document.getElementById("rail-chapter-title"),
    railSectionTitle: document.getElementById("rail-section-title"),
    railChapterIndex: document.getElementById("rail-chapter-index"),
    railTotalTime: document.getElementById("rail-total-time"),
    quickJump: document.getElementById("quick-jump"),
    railNav: document.getElementById("rail-nav"),
    midJump: document.getElementById("mid-jump"),
    finalJump: document.getElementById("final-jump"),
    cover: document.getElementById("book-top")
  };

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inlineMarkup(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function stripChapterPrefix(title) {
    return title.replace(/^第.+?[篇章]\s*/, "").trim();
  }

  function countReadMinutes(text) {
    const han = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const latin = (text.replace(/[\u4e00-\u9fff]/g, " ").match(/\b[\w-]+\b/g) || []).length;
    return Math.max(1, Math.ceil(han / 420 + latin / 180));
  }

  function blockTarget(book, chapter, section) {
    if (section) {
      return section.blocks;
    }
    if (chapter) {
      return chapter.blocks;
    }
    return book.preface;
  }

  function parseBook(markdown) {
    const book = {
      title: "AI 时代 Builder 手册",
      subtitle: "",
      preface: [],
      chapters: []
    };

    const lines = markdown.replace(/\r/g, "").split("\n");
    let currentChapter = null;
    let currentSection = null;
    let paragraph = [];
    let listType = null;
    let listItems = [];

    function pushParagraph(text) {
      if (!text) {
        return;
      }
      if (!currentChapter && book.title && !book.subtitle) {
        book.subtitle = text;
        return;
      }
      blockTarget(book, currentChapter, currentSection).push({
        type: "p",
        html: inlineMarkup(text),
        text
      });
    }

    function flushParagraph() {
      if (!paragraph.length) {
        return;
      }
      pushParagraph(paragraph.join(" "));
      paragraph = [];
    }

    function flushList() {
      if (!listType || !listItems.length) {
        return;
      }
      blockTarget(book, currentChapter, currentSection).push({
        type: listType,
        items: listItems.map((item) => ({
          html: inlineMarkup(item),
          text: item
        }))
      });
      listType = null;
      listItems = [];
    }

    function flushBlocks() {
      flushParagraph();
      flushList();
    }

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        flushBlocks();
        continue;
      }

      if (line === "---") {
        flushBlocks();
        if (currentChapter || currentSection) {
          blockTarget(book, currentChapter, currentSection).push({ type: "hr" });
        }
        continue;
      }

      if (line.startsWith("# ")) {
        flushBlocks();
        book.title = line.slice(2).trim();
        continue;
      }

      if (line.startsWith("## ")) {
        flushBlocks();
        currentSection = null;
        currentChapter = {
          index: book.chapters.length + 1,
          id: `chapter-${book.chapters.length + 1}`,
          title: line.slice(3).trim(),
          blocks: [],
          sections: []
        };
        book.chapters.push(currentChapter);
        continue;
      }

      if (line.startsWith("### ")) {
        flushBlocks();
        if (!currentChapter) {
          continue;
        }
        currentSection = {
          index: currentChapter.sections.length + 1,
          id: `chapter-${currentChapter.index}-section-${currentChapter.sections.length + 1}`,
          title: line.slice(4).trim(),
          blocks: []
        };
        currentChapter.sections.push(currentSection);
        continue;
      }

      if (line.startsWith("#### ")) {
        flushBlocks();
        blockTarget(book, currentChapter, currentSection).push({
          type: "h4",
          html: inlineMarkup(line.slice(5).trim()),
          text: line.slice(5).trim()
        });
        continue;
      }

      if (line.startsWith("> ")) {
        flushBlocks();
        blockTarget(book, currentChapter, currentSection).push({
          type: "note",
          html: inlineMarkup(line.slice(2).trim()),
          text: line.slice(2).trim()
        });
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        flushParagraph();
        if (listType && listType !== "ol") {
          flushList();
        }
        listType = "ol";
        listItems.push(line.replace(/^\d+\.\s/, "").trim());
        continue;
      }

      if (line.startsWith("- ")) {
        flushParagraph();
        if (listType && listType !== "ul") {
          flushList();
        }
        listType = "ul";
        listItems.push(line.slice(2).trim());
        continue;
      }

      flushList();
      paragraph.push(line);
    }

    flushBlocks();

    const allText = [];

    book.preface.forEach((block) => {
      if (block.text) {
        allText.push(block.text);
      }
    });

    book.chapters.forEach((chapter) => {
      const textParts = [];
      chapter.blocks.forEach((block) => {
        if (block.text) {
          textParts.push(block.text);
        }
        if (block.items) {
          block.items.forEach((item) => textParts.push(item.text));
        }
      });
      chapter.sections.forEach((section) => {
        textParts.push(section.title);
        section.blocks.forEach((block) => {
          if (block.text) {
            textParts.push(block.text);
          }
          if (block.items) {
            block.items.forEach((item) => textParts.push(item.text));
          }
        });
      });
      chapter.minutes = countReadMinutes(textParts.join(" "));
      chapter.sectionCount = chapter.sections.length;
      allText.push(...textParts);
    });

    book.totalMinutes = countReadMinutes(allText.join(" "));
    book.totalSections = book.chapters.reduce((sum, chapter) => sum + chapter.sectionCount, 0);
    return book;
  }

  function renderBlock(block) {
    if (block.type === "p") {
      return `<p>${block.html}</p>`;
    }
    if (block.type === "h4") {
      return `<h4>${block.html}</h4>`;
    }
    if (block.type === "note") {
      return `<aside class="note-block"><p>${block.html}</p></aside>`;
    }
    if (block.type === "hr") {
      return "<hr />";
    }
    if (block.type === "ul" || block.type === "ol") {
      const items = block.items.map((item) => `<li>${item.html}</li>`).join("");
      return `<${block.type}>${items}</${block.type}>`;
    }
    return "";
  }
  function renderQuickJump(chapter) {
    if (!chapter) {
      ui.quickJump.innerHTML = "";
      ui.railNav.innerHTML = "";
      return;
    }

    ui.quickJump.innerHTML = chapter.sections
      .map((section) => `<a href="#${section.id}" data-section-link="${section.id}">${escapeHtml(section.title)}</a>`)
      .join("");

    const chapterIndex = chapter.index - 1;
    const navLinks = [];

    if (chapterIndex > 0) {
      navLinks.push(`<a href="#${book.chapters[chapterIndex - 1].id}">上一章</a>`);
    }
    if (chapterIndex < book.chapters.length - 1) {
      navLinks.push(`<a href="#${book.chapters[chapterIndex + 1].id}">下一章</a>`);
    } else {
      navLinks.push('<a href="#book-top">回封面</a>');
    }

    ui.railNav.innerHTML = navLinks.join("");
  }

  const book = parseBook(source);

  function renderBook() {
    const html = book.chapters
      .map((chapter, chapterIndex) => {
        const chapterNumber = String(chapter.index).padStart(2, "0");
        const introHtml = chapter.blocks.map(renderBlock).join("");
        const sectionsHtml = chapter.sections
          .map((section) => {
            const sectionNumber = `${chapter.index}.${section.index}`;
            const sectionHtml = section.blocks.map(renderBlock).join("");
            return `
              <section class="chapter-section reveal" id="${section.id}" data-title="${escapeHtml(section.title)}" data-chapter-id="${chapter.id}">
                <div class="section-index">${sectionNumber}</div>
                <div class="section-card">
                  <h3>${inlineMarkup(section.title)}</h3>
                  <div class="section-content">${sectionHtml}</div>
                </div>
              </section>
            `;
          })
          .join("");

        const footerLinks = [];

        if (chapterIndex > 0) {
          footerLinks.push(`<a href="#${book.chapters[chapterIndex - 1].id}">上一章</a>`);
        }
        if (chapterIndex < book.chapters.length - 1) {
          footerLinks.push(`<a href="#${book.chapters[chapterIndex + 1].id}">下一章</a>`);
        } else {
          footerLinks.push('<a href="#book-top">回封面</a>');
        }

        return `
          <section class="chapter reveal" id="${chapter.id}" data-title="${escapeHtml(chapter.title)}" data-index="${chapter.index}" data-minutes="${chapter.minutes}">
            <div class="chapter-shell">
              <header class="chapter-header">
                <div class="chapter-eyebrow">
                  <span class="chapter-number">${chapterNumber}</span>
                  <span class="chapter-meta">${chapter.sectionCount} 节 / 约 ${chapter.minutes} 分钟</span>
                </div>
                <h2>${inlineMarkup(chapter.title)}</h2>
              </header>
              <div class="chapter-opening">${introHtml}</div>
              <div class="section-group">${sectionsHtml}</div>
              <footer class="chapter-footer">
                <span>Chapter ${chapterNumber}</span>
                <div class="chapter-links">${footerLinks.join("")}</div>
              </footer>
            </div>
          </section>
        `;
      })
      .join("");

    article.innerHTML = html;
  }

  function renderStaticUI() {
    ui.bookTitle.textContent = book.title;
    ui.bookSubtitle.textContent = book.subtitle || "学习版网页";
    ui.sidebarCopy.textContent = "整书同步、本地直开、阅读优先。这一页只做表现层和交互层重构，不改正文。";
    ui.statChapters.textContent = String(book.chapters.length).padStart(2, "0");
    ui.statSections.textContent = String(book.totalSections).padStart(2, "0");
    ui.statRead.textContent = `${book.totalMinutes}m`;
    ui.heroStatChapters.textContent = `${book.chapters.length} 篇结构`;
    ui.heroStatSections.textContent = `${book.totalSections} 节跳读`;
    ui.heroStatRead.textContent = `约 ${book.totalMinutes} 分钟`;

    const midChapter = book.chapters[Math.min(3, book.chapters.length - 1)];
    const lastChapter = book.chapters[book.chapters.length - 1];

    if (ui.midJump && midChapter) {
      ui.midJump.href = `#${midChapter.id}`;
      ui.midJump.textContent = `跳到 ${stripChapterPrefix(midChapter.title)}`;
    }

    if (ui.finalJump && lastChapter) {
      ui.finalJump.href = `#${lastChapter.id}`;
      ui.finalJump.textContent = `直达 ${stripChapterPrefix(lastChapter.title)}`;
    }

    if (book.preface.length) {
      ui.coverPreface.innerHTML = book.preface.map(renderBlock).join("");
    }

    const heroCards = [0, Math.floor(book.chapters.length / 2), book.chapters.length - 1]
      .filter((value, index, array) => array.indexOf(value) === index)
      .map((index) => book.chapters[index]);

    ui.heroStack.innerHTML = heroCards
      .map((chapter) => `
        <article class="visual-card">
          <strong>Chapter ${String(chapter.index).padStart(2, "0")}</strong>
          <p>${escapeHtml(stripChapterPrefix(chapter.title))}</p>
        </article>
      `)
      .join("");

    ui.chapterRibbon.innerHTML = [...book.chapters, ...book.chapters]
      .map((chapter) => `<span class="ribbon-chip">${escapeHtml(stripChapterPrefix(chapter.title))}</span>`)
      .join("");
  }

  function renderToc() {
    ui.toc.innerHTML = book.chapters
      .map((chapter) => {
        const chapterNumber = String(chapter.index).padStart(2, "0");
        const sectionLinks = chapter.sections
          .map((section) => `<a href="#${section.id}" data-toc-section="${section.id}">${escapeHtml(section.title)}</a>`)
          .join("");

        return `
          <section class="toc-item" data-target="${chapter.id}">
            <a class="toc-link" href="#${chapter.id}">
              <div class="toc-meta">
                <span class="toc-number">${chapterNumber}</span>
                <span class="toc-count">${chapter.sectionCount} 节</span>
              </div>
              <div class="toc-title">${escapeHtml(chapter.title)}</div>
            </a>
            <div class="toc-sub">${sectionLinks}</div>
          </section>
        `;
      })
      .join("");
  }

  renderBook();
  renderStaticUI();
  renderToc();

  const chapterElements = [...article.querySelectorAll(".chapter")];
  const sectionElements = [...article.querySelectorAll(".chapter-section")];
  const tocItems = [...ui.toc.querySelectorAll(".toc-item")];
  const tocSectionLinks = [...ui.toc.querySelectorAll("[data-toc-section]")];
  const revealTargets = [ui.cover, ...chapterElements, ...sectionElements];
  const chapterDataById = new Map(book.chapters.map((chapter) => [chapter.id, chapter]));

  let activeChapterId = chapterElements[0]?.id || "";
  let activeSectionId = "";
  let ticking = false;

  function toggleNav(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !body.classList.contains("nav-open");
    body.classList.toggle("nav-open", shouldOpen);
    ui.menuToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  }

  function setAccentByChapter(chapterIndex) {
    root.style.setProperty("--accent-hue", String(accentHues[(chapterIndex - 1) % accentHues.length]));
  }

  function setActiveChapter(chapterId) {
    if (!chapterId || chapterId === activeChapterId) {
      return;
    }

    activeChapterId = chapterId;
    const chapter = chapterDataById.get(chapterId);

    if (!chapter) {
      return;
    }

    const chapterElement = document.getElementById(chapterId);
    setAccentByChapter(chapter.index);
    ui.currentLabel.textContent = chapter.title;
    ui.railChapterTitle.textContent = stripChapterPrefix(chapter.title);
    ui.railChapterIndex.textContent = String(chapter.index).padStart(2, "0");
    ui.railTotalTime.textContent = `${chapter.minutes}m`;

    tocItems.forEach((item) => {
      const isActive = item.dataset.target === chapterId;
      item.classList.toggle("active", isActive);
      if (isActive) {
        item.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    });

    chapterElements.forEach((element) => {
      element.classList.toggle("active", element.id === chapterId);
    });

    renderQuickJump(chapter);
    const activeSectionElement = activeSectionId ? document.getElementById(activeSectionId) : null;
    const sectionBelongsToChapter = activeSectionElement && activeSectionElement.dataset.chapterId === chapterId;

    if (!sectionBelongsToChapter) {
      activeSectionId = "";
      ui.currentSectionLabel.textContent = `约 ${chapter.minutes} 分钟 / ${chapter.sectionCount} 节`;
      ui.railSectionTitle.textContent = "当前定位在章节总述";
      updateSectionHighlight("");
    } else {
      updateSectionHighlight(activeSectionId);
    }

    scheduleProgress();

    if (!activeSectionId && chapterElement) {
      ui.currentSectionLabel.textContent = `约 ${chapter.minutes} 分钟 / ${chapter.sectionCount} 节`;
      ui.railSectionTitle.textContent = "当前定位在章节总述";
    }
  }
  function updateSectionHighlight(sectionId) {
    tocSectionLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.tocSection === sectionId);
    });

    const quickLinks = [...ui.quickJump.querySelectorAll("[data-section-link]")];
    quickLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.sectionLink === sectionId);
    });

    sectionElements.forEach((section) => {
      section.classList.toggle("active", section.id === sectionId);
    });
  }

  function setActiveSection(sectionId) {
    if (sectionId === activeSectionId) {
      return;
    }

    activeSectionId = sectionId;
    const sectionElement = sectionId ? document.getElementById(sectionId) : null;

    if (sectionElement) {
      const chapterId = sectionElement.dataset.chapterId;
      const chapter = chapterDataById.get(chapterId);
      if (chapter) {
        ui.currentSectionLabel.textContent = sectionElement.dataset.title;
        ui.railSectionTitle.textContent = `当前落点：${sectionElement.dataset.title}`;
        setActiveChapter(chapterId);
      }
    } else if (activeChapterId) {
      const chapter = chapterDataById.get(activeChapterId);
      if (chapter) {
        ui.currentSectionLabel.textContent = `约 ${chapter.minutes} 分钟 / ${chapter.sectionCount} 节`;
        ui.railSectionTitle.textContent = "当前定位在章节总述";
      }
    }

    updateSectionHighlight(sectionId);
  }

  function updateProgress() {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollMax > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollMax)) : 0;
    ui.progressBar.style.transform = `scaleX(${ratio})`;

    if (activeChapterId) {
      const chapterElement = document.getElementById(activeChapterId);
      if (chapterElement) {
        const top = chapterElement.offsetTop;
        const height = chapterElement.offsetHeight;
        const end = top + height - window.innerHeight * 0.35;
        const chapterRatio = end > top ? Math.max(0, Math.min(1, (window.scrollY - top) / (end - top))) : ratio;
        ui.chapterProgressBar.style.transform = `scaleX(${chapterRatio})`;
      }
    }

    ticking = false;
  }

  function scheduleProgress() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }

  const chapterObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

    if (visible) {
      setActiveChapter(visible.target.id);
    }
  }, {
    rootMargin: "-16% 0px -52% 0px",
    threshold: [0.15, 0.3, 0.55, 0.8]
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

    if (visible) {
      setActiveSection(visible.target.id);
    }
  }, {
    rootMargin: "-18% 0px -58% 0px",
    threshold: [0.1, 0.25, 0.5]
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.08
  });

  chapterElements.forEach((chapter) => chapterObserver.observe(chapter));
  sectionElements.forEach((section) => sectionObserver.observe(section));

  if (!reducedMotion) {
    revealTargets.forEach((target) => {
      if (target) {
        revealObserver.observe(target);
      }
    });
  } else {
    revealTargets.forEach((target) => target && target.classList.add("is-visible"));
  }

  const firstChapter = chapterElements[0];
  if (firstChapter) {
    activeChapterId = "";
    setActiveChapter(firstChapter.id);
  }

  const firstSection = sectionElements[0];
  if (firstSection) {
    setActiveSection(firstSection.id);
  }

  scheduleProgress();
  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", scheduleProgress, { passive: true });

  ui.menuToggle.addEventListener("click", () => toggleNav());
  ui.overlay.addEventListener("click", () => toggleNav(false));
  ui.toc.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.innerWidth <= 1220) {
      toggleNav(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleNav(false);
    }
  });

  if (!reducedMotion && ui.cover && window.matchMedia("(pointer: fine)").matches) {
    ui.cover.addEventListener("pointermove", (event) => {
      const rect = ui.cover.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      root.style.setProperty("--pointer-x", `${x}%`);
      root.style.setProperty("--pointer-y", `${y}%`);
    });

    ui.cover.addEventListener("pointerleave", () => {
      root.style.setProperty("--pointer-x", "62%");
      root.style.setProperty("--pointer-y", "38%");
    });
  }
})();
