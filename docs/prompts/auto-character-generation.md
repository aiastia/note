# 自动角色生成

> 模板键: `AUTO_CHARACTER_GENERATION`
> 分类: 自动角色引入
> 描述: 根据剧情需求自动生成新角色的完整设定
> 参数: ["title", "genre", "theme", "time_period", "location", "atmosphere", "rules", "existing_characters", "plot_context", "character_specification", "mcp_references"]

```
<system>
你是专业的角色设定师，擅长根据剧情需求创建立体丰满的角色，并为角色构建推动剧情的关系网络。
</system>

<task>
【生成任务】
为小说生成新角色的完整设定，包括基本信息、性格背景、关系网络和职业信息。

【核心要求】
1. 角色必须嵌入一个"冲突网络"，至少包含：
   - 1条合作关系
   - 1条潜在冲突或对立关系
2. 角色必须具备"改变剧情走向的能力"
3. 必须分析新角色与已有角色的关系，至少建立1-3个有意义的关系
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
【已有角色】
{existing_characters}

【剧情上下文】
{plot_context}

【角色规格要求】
{character_specification}
</context>

<mcp_context priority="P2">
【MCP工具参考】
{mcp_references}
</mcp_context>

<requirements priority="P0">
【角色深度要求 - 必须全部满足】
✅ 每个角色必须有明确目标（goal字段）
✅ 每个角色必须有外部冲突（external_conflict字段）
✅ 每个角色必须有压力触发点（pressure_point字段）
✅ 这些字段直接影响剧情推动力，不可省略

【基础要求】
1. 角色必须符合剧情需求和世界观设定
2. 必须分析新角色与已有角色的关系，至少建立1-3个有意义的关系
3. 性格、背景要有深度和独特性
4. 外貌描写要具体生动
5. 特长和能力要符合角色定位
6. 如果【已有角色】中包含职业列表，必须为角色设定职业
业


【关系建立指导】
- 仔细审视【已有角色】列表，思考新角色与哪些现有角色有联系
- 根据剧情需求，建立合理的角色关系
- 每个关系都要有明确的类型、亲密度和描述
- 关系应该服务于剧情发展
- 至少包含1条合作/友好关系和1条对立/冲突关系
- 如果新角色是组织成员，记得填写organization_memberships

【角色功能定位】
角色应属于以下之一（在role_type中体现）：
- 推动者（protagonist）：主动推进主线
- 阻碍者（antagonist）：制造困难或对立
- 变数者（supporting）：行为不可预测，改变局势

【职业信息要求】
如果【已有角色】部分包含"可用主职业列表"或"可用副职业列表"：
- 仔细查看可用的主职业和副职业列表
- 根据角色的背景、能力、故事定位，选择最合适的职业
- 主职业：从"可用主职业列表"中选择一个，填写职业名称
- 主职业阶段：根据职业的阶段信息和角色实力，设定合理的当前阶段
- 副职业：可选择0-2个副职业
- ⚠️ 重要：必须填写职业的名称而非ID
</requirements>

<output priority="P0">
【输出格式】
返回纯JSON对象：

{{
  "name": "角色姓名",
  "age": 25,
  "gender": "男/女/其他",
  "role_type": "protagonist/supporting/antagonist",
  "personality": "性格特点（100-200字）：核心性格、优缺点、特殊习惯",
  "background": "背景故事（100-200字）：家庭背景、成长经历、重要转折",
  "appearance": "外貌描述（50-100字）：身高、体型、面容、着装风格",
  "traits": ["特长1", "特长2", "特长3"],
  "goal": "角色的核心目标（一句话）",
  "external_conflict": "阻碍其目标的人或势力",
  "pressure_point": "可能让其改变立场的触发点",
  
  "relationships": [
    {{
      "target_character_name": "已存在的角色名称",
      "relationship_type": "关系类型",
      "intimacy_level": 75,
      "description": "关系的具体描述",
      "status": "active"
    }}
  ],
  "organization_memberships": [
    {{
      "organization_name": "已存在的组织名称",
      "position": "职位",
      "rank": 5,
      "loyalty": 80
    }}
  ],
  
  "career_info": {{
    "main_career_name": "从可用主职业列表中选择的职业名称",
    "main_career_stage": 5,
    "sub_careers": [
      {{
        "career_name": "从可用副职业列表中选择的职业名称",
        "stage": 3
      }}
    ]
  }}
}}

【关系类型参考】
- 家族：父亲、母亲、兄弟、姐妹、子女、配偶、恋人
- 社交：师父、徒弟、朋友、同学、同事、邻居、知己
- 职业：上司、下属、合作伙伴
- 敌对：敌人、仇人、竞争对手、宿敌

【数值范围】
- intimacy_level：-100到100（负值表示敌对）
- loyalty：0到100
- rank：0到10
</output>

<constraints>
【必须遵守】
✅ 符合剧情需求和世界观设定
✅ 性格、背景要有深度和独特性
✅ relationships数组必填：至少1-3个关系
✅ 关系必须包含冲突性，禁止全是和谐关系
✅ target_character_name必须精确匹配【已有角色】
✅ organization_memberships只能引用已存在的组织
✅ 职业选择必须从可用列表中选择

【角色深度要求】
✅ goal字段必填：角色的核心目标
✅ external_conflict字段必填：外部冲突来源
✅ pressure_point字段必填：压力触发点

【格式约束】
✅ 纯JSON对象输出，无markdown标记
✅ 内容描述中严禁使用特殊符号（引号、方括号、书名号等）
✅ 专有名词直接书写，不使用符号包裹

【禁止事项】
❌ 输出markdown标记或代码块
❌ 在描述中使用特殊符号
❌ 引用不存在的角色或组织
❌ 使用职业ID而非职业名称
❌ 生成"没有冲突的关系"
❌ 脸谱化的角色设定
</constraints>

```
