# 自动组织分析

> 模板键: `AUTO_ORGANIZATION_ANALYSIS`
> 分类: 自动组织引入
> 描述: 分析新生成的大纲，判断是否需要引入新组织
> 参数: ["title", "genre", "theme", "time_period", "location", "atmosphere", "existing_organizations", "existing_characters", "all_chapters_brief", "start_chapter", "chapter_count", "plot_stage", "story_direction"]

---

<system>
你是专业的小说世界构建顾问，擅长预测剧情发展对组织/势力的需求。
</system>

<task>
【分析任务】
预测在接下来的{chapter_count}章续写中，根据剧情发展方向和阶段，是否需要引入新的组织或势力。

【重要说明】
这是预测性分析，而非基于已生成内容的事后分析。
组织包括：帮派、门派、公司、政府机构、神秘组织、家族等。
</task>

<project priority="P1">
【项目信息】
书名：{title}
类型：{genre}
主题：{theme}

【世界观】
时间背景：{time_period}
地理位置：{location}
氛围基调：{atmosphere}
</project>

<context priority="P0">
【已有组织】
{existing_organizations}

【已有角色】
{existing_characters}

【已有章节概览】
{all_chapters_brief}

【续写计划】
- 起始章节：第{start_chapter}章
- 续写数量：{chapter_count}章
- 剧情阶段：{plot_stage}
- 发展方向：{story_direction}
</context>

<analysis_framework priority="P0">
【预测分析维度】

**1. 世界观扩展需求**
根据发展方向，是否需要新的势力或组织来丰富世界观？

**2. 冲突升级需求**
剧情是否需要新的对立势力、竞争组织或神秘集团？

**3. 角色归属需求**
现有角色是否需要加入或对抗某个新组织？

**4. 剧情推动需求**
新组织能否成为推动剧情的关键力量？

**5. 引入时机**
新组织应该在哪个章节出现最合适？

【预测依据】
- 剧情阶段的典型组织需求（如：高潮阶段可能需要强大的敌对势力）
- 故事发展方向的逻辑需要（如：进入新地点需要当地势力）
- 世界观完整性需要（如：权力格局需要多方势力）
- 角色成长需要（如：主角需要加入或创建组织）
</analysis_framework>

<naming_guidelines priority="P0">
【命名要求】
如果【已有组织】中存在组织，建议的新组织命名风格必须与已有组织保持一致。
参考已有组织的名称规律（用词习惯、字数、文化风格），生成符合同一世界观的建议名称。

【各类型组织命名风格】

**现代都市**：公司用全称/简称（盛华集团、锐思科技）、机构用正式名称（市公安局、第一人民医院）
**玄幻仙侠**：用意境词+门派词（天剑宗、幽冥殿、星辰阁、万兽山庄）
**科幻**：用编号/代号/功能名（第七舰队、量子研究所、新星联邦）
**历史古代**：用朝代+职能（锦衣卫、漕帮、翰林院）
**奇幻魔法**：用象征词+组织词（银月骑士团、暗影议会、龙语学院）

【命名原则】
- 参考已有组织的命名风格，保持高度一致
- 名称要有文化代入感，不要用现代词汇套古代背景
- 组织名称长度2-6个字为佳
- 如果已有组织名称都是"XX宗/XX阁/XX殿"格式，建议名称也用相同格式
- 如果已有组织名称都是现代公司名格式，建议名称也用相同格式
</naming_guidelines>

<output priority="P0">
【输出格式】
返回纯JSON对象（两种情况之一）：

**情况A：需要新组织**
\{\{
"needs_new_organizations": true,
"reason": "预测分析原因（150-200字），说明为什么即将的剧情需要新组织",
"organization_count": 1,
"organization_specifications": [
\{\{
  "name": "建议的组织名称（必须符合已有组织的命名风格和规律）",
  "organization_description": "组织在剧情中的定位和作用（100-150字）",
  "organization_type": "帮派/门派/公司/政府/家族/神秘组织等",
  "importance": "high/medium/low",
  "appearance_chapter": {start_chapter},
  "power_level": 70,
  "plot_function": "在剧情中的具体功能",
  "location": "组织所在地或活动区域",
  "motto": "组织口号或宗旨（可选）",
  "naming_rationale": "命名理由：说明为什么这个名字符合已有组织的命名风格",
  "initial_members": [
    \{\{
      "character_name": "现有角色名（必须精确匹配已有角色，如需加入）",
      "position": "职位",
      "reason": "为什么加入"
    \}\}
  ],
  "relationship_suggestions": [
    \{\{
      "target_organization": "已有组织名（必须精确匹配已有组织）",
      "relationship_type": "建议的关系类型（盟友/敌对/竞争/合作等）",
      "reason": "为什么建立这种关系"
    \}\}
  ]
\}\}
]
\}\}

**情况B：不需要新组织**
\{\{
"needs_new_organizations": false,
"reason": "现有组织足以支撑即将的剧情发展，说明理由"
\}\}
</output>

<constraints>
【必须遵守】
✅ 这是预测性分析，面向未来剧情
✅ 考虑世界观的丰富性和完整性
✅ 确保引入必要性，不为引入而引入
✅ 优先考虑组织的长期作用
✅ 组织应该是推动剧情的关键力量
✅ character_name必须精确匹配【已有角色】
✅ target_organization必须精确匹配【已有组织】

【命名约束】
✅ 如果已有组织存在，建议的组织名称风格必须与已有组织一致
✅ 组织名称必须符合世界观文化背景
✅ 参考已有组织的命名规律（用词习惯、字数、文化风格）
✅ 提供 naming_rationale 说明命名理由

【禁止事项】
❌ 输出markdown标记
❌ 基于已生成内容做事后分析
❌ 为了引入组织而强行引入
❌ 设计一次性功能组织
❌ 创建与现有组织功能重复的组织
❌ 忽略已有组织命名风格，随意编造建议名称
❌ 古代背景使用现代组织名（如"XX科技""XX集团"）
❌ 现代背景使用古代门派名（如"XX宗""XX阁"）
❌ 使用与世界观不匹配的词汇命名
❌ 引用不存在的角色或组织
</constraints>