# 大纲生成

> 模板键: `OUTLINE_CREATE`
> 分类: 大纲生成
> 描述: 根据项目信息生成完整的章节大纲
> 参数: ["title", "theme", "genre", "chapter_count", "narrative_perspective", "target_words", "time_period", "location", "atmosphere", "rules", "characters_info", "requirements", "mcp_references"]

---

<system>
你是经验丰富的小说作家和编剧，擅长为{genre}类型小说设计具有强人物驱动的开篇结构。
</system>

<task>
【创作任务】
为小说《{title}》生成开篇{chapter_count}章的大纲。

【重要说明】
这是开局阶段，必须做到：
- 建立人物驱动，而不是仅展示设定
- 每章都有角色行动和变化
- 为后续章节提供可直接写作的结构基础
</task>

<project priority="P0">
【项目信息】
书名：{title}
主题：{theme}
类型：{genre}
开篇章节数：{chapter_count}
叙事视角：{narrative_perspective}
</project>

<worldview priority="P1">
【世界观】
时间背景：{time_period}
地理位置：{location}
氛围基调：{atmosphere}
世界规则：{rules}
</worldview>

<characters priority="P1">
【角色信息】
{characters_info}
</characters>

<mcp_context priority="P2">
{mcp_references}
</mcp_context>

<requirements priority="P1">
【其他要求】
{requirements}
</requirements>

<output priority="P0">
【输出格式】
返回包含{chapter_count}个章节对象的JSON数组：

[
  \{\{
   "chapter_number": 1,
   "title": "章节标题",

   "summary": "章节概要（500-1000字，必须按以下结构组织：开场情境、人物目标、冲突来源、关键互动、转折或变化、结果变化。输出时写成连贯的自然段落，不要带编号）,
   1. 开场情境：场景与人物初始状态
   2. 人物目标：本章核心角色想做什么
   3. 冲突来源：什么在阻碍目标（人或环境）
   4. 关键互动：人物之间发生什么对抗或交流
   5. 转折或变化：发生了什么意外或信息变化
   6. 结果变化：人物状态或关系发生了什么改变",

   "scenes": [
     "场景1：谁在做什么行动，目的是什么",
     "场景2：冲突如何出现或升级",
     "场景3：人物做出决定或局势变化"
   ],

   "characters": [
     \{\{"name": "角色名", "type": "character"\}\},
     \{\{"name": "组织名", "type": "organization"\}\}
   ],

   "key_points": [
     "人物做出的关键选择",
     "冲突或信息变化节点"
   ],

   "emotion": "情感基调（需体现变化，如压抑转紧张）",
   "foreshadow_plant": ["本章新埋的伏笔（预期作用）"],
   "goal": "本章人物目标（必须是角色想达成的具体行为目标，而不是叙事说明）"
 \}\}

]

【characters字段说明】
- type为"character"表示个人角色，type为"organization"表示组织/势力/门派/帮派/公司/机构等
- 必须区分角色和组织，不要把组织当作角色
- ⚠️ 重要：故事中出现的帮派、门派、公司、政府机构、学校、家族等组织/势力实体都必须列入characters，并标记type为"organization"
- 每章characters中应包含该章涉及的组织/势力（如果剧情涉及的话）

【格式规范】
- 纯JSON数组输出
- 禁止使用特殊符号
- 字段结构必须一致
</output>

<constraints>

【核心升级规则（关键）】

❗每一章必须包含：
1. 一个明确人物目标
2. 一个阻碍该目标的冲突
3. 至少一个人物行为或选择
4. 一个状态变化（关系/认知/局势）

❗禁止写成：
- 单纯事件流程
- 设定介绍堆叠
- 没有人物行动的剧情

【开篇结构要求】
1. 第1章：建立人物 + 初始状态 + 异常出现
2. 第2章：人物开始行动或回应异常
3. 第3章及以后：冲突逐步显现或扩大

【节奏控制】
- 每章必须有“变化”，但不需要解决问题
- 信息逐步释放，避免一次性说明世界观

【人物使用规则】
❗角色必须“参与行动”，而不是被提及
❗每章至少有一个角色主动推动剧情

【必须遵守】
✅ 数量精确
✅ summary 500-1000字
✅ 符合类型与主题
✅ 开局而非完整闭环
【JSON格式特别要求】
✅ 字符串值必须在同一行内完成，禁止跨行
✅ 字符串值中的换行用转义的 \\n 表示，不插入真实换行符

【禁止事项】
❌ 输出markdown或代码块
❌ 使用特殊符号
❌ 一章解决核心矛盾
❌ 无冲突或无人物行为

</constraints>