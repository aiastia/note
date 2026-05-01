# 批量角色生成

> 模板键: `CHARACTERS_BATCH_GENERATION`
> 分类: 角色生成
> 描述: 批量生成多个角色和组织，建立角色关系网络
> 参数: ["count", "time_period", "location", "atmosphere", "rules", "theme", "genre", "requirements"]

---

<system>
你是专业的角色设定师，擅长为{genre}类型的小说创建立体丰满的角色。
</system>

<task>
【生成任务】
生成{count}个角色和组织实体，并构建“可推动剧情的关系网络”。

【数量要求 - 严格遵守】
数组中必须精确包含{count}个对象，不多不少。

【核心要求】
1. 所有角色必须嵌入一个“冲突网络”，至少包含：
   - 1条合作关系
   - 1条潜在冲突或对立关系
2. 至少2个角色在核心目标上相互冲突
3. 每个主要角色必须具备“改变剧情走向的能力”
4. 群像必须形成：推动者、阻碍者、变数者三种角色分工
5. 关系类型要多样化：血缘关系不超过1-2条，以社交、职业、立场冲突为主

【角色功能分工（必须体现）】
- 推动者：主动推进主线
- 阻碍者：制造困难或对立
- 变数者：行为不可预测，改变局势

【实体类型分配】
- 至少1个主角（protagonist）
- 多个配角（supporting）
- 可包含反派（antagonist）
- 可包含1-2个高影响力组织（power_level: 70-95）
</task>

<worldview priority="P0">
【世界观信息】
时间背景：{time_period}
地理位置：{location}
氛围基调：{atmosphere}
世界规则：{rules}

主题：{theme}
类型：{genre}
</worldview>

<requirements priority="P1">
【特殊要求】
{requirements}
</requirements>

<output priority="P0">
【输出格式】
返回纯JSON数组，每个对象包含：

**角色对象**：
{{
  "name": "角色姓名",
  "age": 25,
  "gender": "男/女/其他",
  "is_organization": false,
  "role_type": "protagonist/supporting/antagonist",
  "personality": "性格特点（100-200字）：核心性格、优缺点、特殊习惯",
  "background": "背景故事（100-200字）：家庭背景、成长经历、重要转折",
  "appearance": "外貌描述（50-100字）：身高、体型、面容、着装风格",
  "traits": ["特长1", "特长2", "特长3"],
  "goal": "角色的核心目标（一句话）",
  "external_conflict": "阻碍其目标的人或势力",
  "pressure_point": "可能让其改变立场的触发点",
  "relationships_array": [
    {{
      "target_character_name": "已生成的角色名称",
      "relationship_type": "关系类型",
      "intimacy_level": 75,
      "description": "关系描述"
    }}
  ],
  "organization_memberships": [
    {{
      "organization_name": "已生成的组织名称",
      "position": "职位",
      "rank": 5,
      "loyalty": 80
    }}
  ]
}}


**组织对象**：
{{
  "name": "组织名称",
  "is_organization": true,
  "role_type": "supporting",
  "personality": "组织特性（100-200字）：运作方式、核心理念、行事风格",
  "background": "组织背景（100-200字）：建立历史、发展历程、重要事件",
  "appearance": "外在表现（50-100字）：总部位置、标志性建筑",
  "organization_type": "组织类型",
  "organization_purpose": "组织目的",
  "organization_members": ["成员1", "成员2"],
  "power_level": 85,
  "location": "所在地或主要活动区域",
  "motto": "组织格言、口号或宗旨",
  "color": "代表颜色",
  "traits": []
}}

【关系类型参考】
- 家族：父亲、母亲、兄弟、姐妹、子女、配偶、恋人
- 社交：师父、徒弟、朋友、同学、同事、邻居、知己
- 职业：上司、下属、合作伙伴
- 敌对：敌人、仇人、竞争对手、宿敌

【关系类型参考 - 优先使用非血缘关系】
- **首选**（社交/职业/敌对）：
  师父、徒弟、朋友、同学、同事、邻居、知己、上司、下属、合作伙伴、竞争对手、宿敌、恩人
- **慎用**（血缘关系，整批角色中最多1-2条）：
  父子、兄弟、叔侄等家族关系
- **仅在用户要求时使用**：
  配偶、恋人

【关系多样性要求】
✅ 血缘关系（父子、兄弟等）整批角色中最多1-2条
✅ 优先用社交、职业、敌对关系构建冲突网络
✅ 两个男性角色之间不要默认设为父子或兄弟
✅ 关系类型要多样化，避免集中使用同一类关系
✅ 不同角色间的冲突应来自立场、利益、理念差异，而非血缘纠葛
✅ 如果设定了家族血缘关系（如父子、兄弟），角色姓名中的姓氏必须相同



【数值范围】
- intimacy_level：-100到100（负值表示敌对）
- loyalty：0到100
- rank：0到10（职位等级）
- power_level：70到95（组织影响力）
</output>

<constraints>
【必须遵守】
✅ 数量精确：数组必须包含{count}个对象
✅ 符合世界观：角色设定与世界观一致
✅ 有深度：性格和背景要立体
✅ 关系网络：角色间形成合理关系
✅ 组织合理：组织是推动剧情的关键力量
【所有角色必须具备】
✅ 一个明确目标（goal）
✅ 一个阻碍其目标的人（external_conflict）
✅ 一个可能让其改变立场的触发点（pressure_point）
【角色深度要求】
✅ 每个角色必须有明确目标（goal字段）
✅ 每个角色必须有外部冲突（external_conflict字段）
✅ 每个角色必须有压力触发点（pressure_point字段）
✅ 这些字段直接影响剧情推动力，不可省略
【关系约束】
✅ relationships_array只能引用本批次已出现的角色
✅ organization_memberships只能引用本批次的组织
✅ 第一个角色的relationships_array必须为空[]
✅ 禁止幻觉：不引用不存在的角色或组织

【格式约束】
✅ 纯JSON数组输出，无markdown标记
✅ 内容描述中严禁使用特殊符号（引号、方括号、书名号等）
✅ 专有名词直接书写，不使用符号包裹

【禁止事项】
❌ 生成数量不符（多于或少于{count}个）
❌ 引用不存在的角色或组织
❌ 生成低影响力的无关紧要组织
❌ 使用markdown或代码块标记
❌ 在描述中使用特殊符号
❌ 生成“没有冲突的关系”
❌ 所有角色目标一致
❌ 设定父子/兄弟等血缘关系但姓氏不一致
</constraints>