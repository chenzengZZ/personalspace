# 新线程 Prompt：Builder 手册｜写书工程基建

我们开一个新线程，目标只做一件事：

把《AI 时代 Builder 手册》的**写书工程基建**搭起来，不直接重写正文，不讨论网页产品化。

请严格按下面边界执行：

## 你的任务

1. 先读交接文件和当前关键文档
2. 基于文件内容，而不是过度依赖聊天上下文
3. 帮我明确：
   - 整书工作流
   - 章节工作流模板
   - 主读者 / 非读者
   - 全书唯一承诺
   - 样章顺序
   - 样章验收标准
   - agent 使用门槛
4. 不直接开始大规模改正文

## 必读文件顺序

1. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\WRITING_ENGINEERING_THREAD_HANDOFF.md`
2. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\WHY_CURRENT_VERSION_IS_3_OF_10.md`
3. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\STATUS.md`
4. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\LEARNING_BOOK_DRAFT.md`
5. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\LEARNING_WEB_SPEC.md`
6. `C:\Users\Admin\Documents\trae_projects\personal html\water-miniprogram\builder-manual\LEARNING_TEXT_EDIT_RULES.md`

## 当前已知结论

- 当前问题不是网页，而是文本成书质量不足
- 当前文本更像结构化讲义，不像成立的书
- 当前阶段应先做写书工程基建，再做样章
- 这本书更接近工具书 / 实用方法论手册
- 主书主体应以 `Explanation` 为主
- 运行篇局部可承接 `How-to`
- 附录承接 `Reference`
- 当前窗口已经混入网页产品化、质量诊断、写书工程，不适合继续承担单一执行目标

## 当前边界

这轮不要做：

- 不直接重写七章正文
- 不继续优化 `LEARNING_BOOK.html`
- 不讨论传播版
- 不讨论工程运行时版
- 不多 agent 并行写正文

## 你这一轮应该产出的东西

优先产出：

- `BOOK_BRIEF.md`
- `CHAPTER_WORKFLOW.md`
- `CHAPTER_CONTRACTS.md`

如有必要再补：

- `SAMPLE_CHAPTER_ACCEPTANCE.md`
- `EVIDENCE_BANK.md`

## 工作原则

- 先设计，再写正文
- 先做样章闭环，再谈全书铺开
- 每章作为执行单元复用同一套流程
- 对关键判断，尽量区分“文件中有证据”与“你的推断”
- 需要中立判断时，请主动警惕：
  - 上下文锚定
  - 后台语言泄漏
  - 结构自证循环

请先从：

1. 复述你理解的任务边界
2. 给出你建议的 `BOOK_BRIEF` 结构
3. 再进入写书工程设计

不要一上来就改书稿正文。
