# Learnings

## 2026-03-21

### Category

correction

### Priority

high

### Pattern-Key

builder-manual-book-quality-vs-readable-web

### Source

user-feedback

### Learning

在《AI 时代 Builder 手册》的产品化过程中，不能把“已经能顺着读的网页文本”误判成“已经成立的一本书”。

用户对当前学习版网页和书稿的整体评价只有 **3/10**，说明前一阶段虽然解决了：

- 从工作稿到前台阅读层的切分
- 从架构图到正文网页的承载
- 从母本到可读页面的基本编译

但并没有解决“书本身为什么值得继续读下去”这个更高层问题。

### What Went Wrong

- 过早把工作重点放在“可读网页化”和“连续阅读感”上
- 默认认为轻度加工足以把母本提升为成书质量
- 把“结构清楚、跳转顺、页面可读”误当成“文本本身已经有足够的锋利度、密度和张力”

### Better Heuristic

在类似内容产品化任务里，先验证的是：

1. 这份文本是否已经具备足够高的内容强度
2. 是否像一本书，而不是一份被整理过的观点笔记
3. 是否存在读者愿意一路读完的张力

只有这三件事成立之后，网页化才是放大器；否则网页只是把一个中等文本包装得更容易阅读。

### Next-Time Rule

以后遇到“把长文、手册、方法论做成网页”的任务时：

- 先区分“可读”与“高质量”
- 先做内容质量诊断，不急着进入网页实现
- 优先产出高质量样章，再决定是否整本重写或网页化

## 2026-03-21

### Category

best_practice

### Priority

high

### Pattern-Key

builder-manual-sample-chapter-gate

### Source

self-diagnosis

### Learning

在长篇手册、方法论、书稿类内容的产品化里，必须把“样章先成立”设成硬门槛，不能直接把整本轻加工后再用网页壳放大。

### Better Heuristic

更稳妥的顺序应该是：

1. 先定义样章标准
2. 先重写 1 到 2 章
3. 先让真实读感验证样章质量
4. 再决定整本改写和网页化

### Why It Matters

如果跳过这个门槛，就容易出现一种假进展：

- 结构越来越完整
- 页面越来越可读
- 但文本本身仍然没有达到成书质量

这会让团队误以为已经接近完成，实际上只是更顺滑地交付了一个中等文本。
## 2026-03-21 Role correction
- Category: correction
- Priority: medium
- Source: user correction in builder-manual writing-engineering thread
- Learning: In this book-writing workflow, the assistant's role is COO, and the total-control role is CEO. Do not refer to the assistant as CEO or conflate execution/compliance review with total-control decisions.
- Operational rule: Treat total-control as final direction setter and approval authority; treat the assistant as COO responsible for execution system setup, process discipline, compliance review support, and implementation handoff.

## 2026-03-21 Writing tone correction
- Category: correction
- Priority: high
- Source: user correction in builder-manual intro sample chapter
- Learning: When expanding audience beyond internet/product/tech readers, do not mix role, industry, and organization examples in one flat list. Reader framing must sound like natural Chinese, not classification notes.
- Learning: In front-stage Chinese prose for this project, avoid hard-translated terms like “实现”“构建” when they make the sentence feel imported rather than spoken. If the English role word `Builder` is clearer, keep it and explain it in plain Chinese on first use.
- Learning: Do not use punch lines that sound clever but are semantically fuzzy, such as “AI 没有取消 Builder，它只是取消了许多借口”. If a line cannot be immediately paraphrased in plain Chinese, rewrite it.
- Operational rule: For chapter prose, prefer natural spoken Chinese over taxonomy. Test key sentences by asking: would a real person say this out loud without sounding translated?
## 2026-03-21 Front-stage language calibration
- Category: correction
- Priority: medium
- Source: total-control clarification in builder-manual writing thread
- Learning: Keep the front-stage axis as 'build applications with AI' rather than broad generic work-method language, but do not narrow the front-stage voice to programmer-only 'write code / write programs' language.
- Operational rule: Prefer front-stage verbs like '写应用 / 做工具 / 搭小系统 / 真能用、真能改、真能继续做'. Mention '代码' only when necessary, and never let '代码' become the only front-stage mother tongue.
