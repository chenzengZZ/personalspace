# Builder 手册：写书工程线程交接

## 当前定位

当前窗口保留为 **总控线程**。

它的职责是：

- 保持全局判断
- 做关键裁决
- 追踪阶段进展
- 决定是否切换方向

下一线程应单独承担：

- 写书工程基建
- 写书工作流设计
- 章节执行单元设计
- 后续样章生产方法

---

## 为什么现在要切线程

当前窗口已经连续承载了三个不同目标：

1. 学习版网页产品化
2. 文本质量诊断
3. 写书工程基建

三者相关，但不属于同一个执行目标。

如果继续混在一个线程里，容易出现：

- 目标漂移
- 上下文权重失真
- 决策记录难回看
- 把网页问题、文本问题、流程问题混成一个问题

因此现在应该：

- 保留当前窗口做总控
- 开新线程专门做“写书工程”

---

## 已确认的关键结论

### 1. 当前问题不是网页壳，而是成书质量

- 学习版网页最小版已经成立
- 当前瓶颈不是导航、跳转、布局
- 当前瓶颈是文本本身只达到约 `3/10`

### 2. 当前稿子更像结构化讲义，不像一本成立的书

主要问题包括：

- 讲义腔重
- 抽象判断多，具体场景少
- 结构完整，但说服力不足
- 章节之间和章节内部存在重复
- 运行篇偏薄
- 桥接生硬，夹带编者语言

### 3. 当前阶段应先写书，不先做网页

后续优先级应为：

1. 写书工程基建
2. 样章策略
3. 样章重写
4. 全书扩写
5. 最后再回网页

### 4. 这本书应当按“工具书 / 实用方法论手册”来处理

更准确地说：

- 主书主体：`Explanation`
- 运行篇局部：`How-to`
- 附录：`Reference`
- `Tutorial` 暂不作为主书主体

### 5. 当前不宜多线程乱开，也不宜多 agent 常驻

当前建议：

- 一个总控线程
- 一个新执行线程
- 不设常驻 agent
- 只在需要明确侧任务时临时开 agent

---

## 已确认的工作模型

## 两层工作流

### A. 整书工作流

职责：

- 定读者
- 定主命题
- 定结构
- 定章节边界
- 定统一验收标准
- 决定先跑哪些样章

它是管理层，不直接批量写正文。

### B. 章节工作流

每章作为一个执行单元复用同一套流程：

1. 定本章问题
2. 定本章中心命题
3. 定本章不写什么
4. 收本章证据 / 反例 / 最佳实践
5. 写章节提纲
6. 写正文初稿
7. 做 reverse outline
8. 做去重 / 去脏 / 去桥接腔
9. 做“对作者本人是否有用”的验收
10. 通过后再并入全书

---

## 新线程的目标

新线程不要直接重写正文。

新线程只做下面这些事：

1. 明确整书工作流
2. 明确章节工作流模板
3. 明确主读者与非读者
4. 明确书的唯一承诺
5. 明确样章顺序与验收标准
6. 明确什么时候允许开 agent，什么时候不允许

---

## 新线程的非目标

新线程不要做：

- 不直接重写七章正文
- 不继续打磨 `LEARNING_BOOK.html`
- 不继续优化网页导航和视觉
- 不立刻决定最终目录一定保持七章不变
- 不开多个 agent 并行写正文

---

## 建议先读的文件

请按这个顺序阅读：

1. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\WRITING_ENGINEERING_THREAD_HANDOFF.md`
2. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\WHY_CURRENT_VERSION_IS_3_OF_10.md`
3. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\STATUS.md`
4. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\LEARNING_BOOK_DRAFT.md`
5. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\LEARNING_WEB_SPEC.md`
6. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\LEARNING_TEXT_EDIT_RULES.md`

如果还需要补充写作方法参考，再看：

7. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\.learnings\LEARNINGS.md`

---

## 新线程建议产物

新线程最好产出这些文件：

- `BOOK_BRIEF.md`
- `CHAPTER_WORKFLOW.md`
- `CHAPTER_CONTRACTS.md`
- 如有需要，再补：
  - `SAMPLE_CHAPTER_ACCEPTANCE.md`
  - `EVIDENCE_BANK.md`

---

## agent 使用门槛

默认不开 agent。

只有遇到下面这类独立侧任务时，才临时开：

- 查工具书 / 技术写作最佳实践
- 做 reverse outline
- 查前后重复
- 查术语污染
- 查桥接和编者语言泄漏

禁止：

- 多 agent 并行写同一章正文
- 在结构未定时大量生成正文

---

## 当前线程与新线程的关系

### 当前线程

- 角色：总控 / 第一顾问
- 职责：裁决方向、确认进展、处理跨线程问题

### 新线程

- 角色：执行线程
- 职责：只处理写书工程，不混网页产品化

---

## 交接结论

现在应该切一个新线程。

当前窗口保留为总控线程；
新窗口专门进入“写书工程基建”。
