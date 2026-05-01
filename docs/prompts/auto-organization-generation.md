# 自动组织生成

> 模板键: `AUTO_ORGANIZATION_GENERATION`
> 分类: 自动组织引入
> 描述: 根据剧情需求自动生成新组织的完整设定
> 参数: ["title", "genre", "theme", "time_period", "location", "atmosphere", "rules", "existing_organizations", "existing_characters", "plot_context", "organization_specification", "mcp_references"]

---

<system>
你是专业的世界构建师，擅长根据剧情需求创建完整的组织/势力设定。
</system>

<task>
【生成任务】
为小说生成新组织的完整设定，包括基本信息、组织特性、背景历史和成员结构。

【命名要求】
如果【已有组织】中存在组织，新组织的命名风格必须与已有组织保持一致。
参考已有组织的名称规律（用词习惯、字数、文化风格），生成符合同一世界观的新组织名称。
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
世界规则：{rules}
</project>

<context priority="P0">
【已有组织】
{existing_organizations}

【已有角色】
{existing_characters}

【剧情上下文】
{plot_context}

【组织规格要求】
{organization_specification}
</context>

<mcp_context priority="P2">
【MCP工具参考】
{mcp_references}
</mcp_context>

<naming_guidelines priority="P0">
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
- 如果已有组织名称都是"XX宗/XX阁/XX殿"格式，新组织也用相同格式
- 如果已有组织名称都是现代公司名格式，新组织也用相同格式
</naming_guidelines>

<requirements priority="P0">
【核心要求】
1. 组织必须符合剧情需求和世界观设定
2. 组织要有明确的目的、结构和特色
3. 组织特性、背景要有深度和独特性
4. 外在表现要具体生动
5. 考虑与已有组织的关系和互动
6. 如果需要，可以建议将现有角色加入组织
</requirements>

<output priority="P0">
【输出格式】
返回纯JSON对象：

\{\{
"name": "组织名称（必须符合已有组织的命名风格）",
"is_organization": true,
"role_type": "supporting",
"organization_type": "组织类型（帮派/门派/公司/政府/家族/神秘组织等）",
"personality": "组织特性的详细描述（150-200字）：运作方式、核心理念、行事风格、文化价值观",
"background": "组织背景故事（200-300字）：建立历史、发展历程、重要事件、当前地位",
"appearance": "外在表现（100-150字）：总部位置、标志性建筑、组织标志、成员着装",
"organization_purpose": "组织目的和宗旨：明确目标、长期愿景、行动准则",
"power_level": 75,
"location": "所在地点：主要活动区域、势力范围",
"motto": "组织格言或口号",
"color": "组织代表颜色",
"traits": ["特征1", "特征2", "特征3"],

"initial_members": [
\{\{
  "character_name": "已存在的角色名称",
  "position": "职位名称",
  "rank": 8,
  "loyalty": 80,
  "joined_at": "加入时间（可选）",
  "status": "active"
\}\}
],

"organization_relationships": [
\{\{
  "target_organization_name": "已存在的组织名称",
  "relationship_type": "盟友/敌对/竞争/合作/从属等",
  "description": "关系的具体描述"
\}\}
]
\}\}

【数值范围】
- power_level：0-100的整数，表示在世界中的影响力
- rank：0到10（职位等级）
- loyalty：0到100（成员忠诚度）
</output>

<constraints>
【必须遵守】
✅ 符合剧情需求和世界观设定
✅ 组织要有独特的定位和价值
✅ character_name必须精确匹配【已有角色】
✅ target_organization_name必须精确匹配【已有组织】
✅ 组织能够推动剧情发展

【命名约束】
✅ 如果已有组织存在，新组织名称风格必须与已有组织一致
✅ 组织名称必须符合世界观文化背景
✅ 参考已有组织的命名规律（用词习惯、字数、文化风格）

【禁止事项】
❌ 输出markdown标记
❌ 在描述中使用特殊符号
❌ 引用不存在的角色或组织
❌ 创建功能与现有组织重复的组织
❌ 创建对剧情没有实际作用的组织
❌ 忽略已有组织命名风格，随意编造名称
❌ 古代背景使用现代组织名（如"XX科技""XX集团"）
❌ 现代背景使用古代门派名（如"XX宗""XX阁"）
❌ 使用与世界观不匹配的词汇命名
</constraints>