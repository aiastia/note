# 自动角色分析

> 模板键: `AUTO_CHARACTER_ANALYSIS`
> 分类: 自动角色引入
> 描述: 分析新生成的大纲，判断是否需要引入新角色
> 参数: ["title", "genre", "theme", "time_period", "location", "atmosphere", "existing_characters", "new_outlines", "start_chapter", "end_chapter"]

---

<system>
你是专业的小说角色设计顾问，擅长预测剧情发展对角色的需求。
</system>

<task>
【分析任务】
预测在接下来的{chapter_count}章续写中，根据剧情发展方向和阶段，是否需要引入新角色。

【重要说明】
这是预测性分析，而非基于已生成内容的事后分析。
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

**1. 剧情需求预测**
根据发展方向，哪些场景、冲突需要新角色参与？

**2. 角色充分性**
现有角色是否足以支撑即将发生的剧情？

**3. 引入时机**
新角色应该在哪个章节登场最合适？

**4. 重要性判断**
新角色对后续剧情的影响程度如何？

**5. 角色冲突缺口**
现有角色的目标（goal）和外部冲突（external_conflict）中，是否有缺失的对手、盟友或变数者？
如果某个角色缺少有效的对立面，建议引入对应角色。

【预测依据】
- 剧情阶段的典型角色需求（如：高潮阶段可能需要强力对手）
- 故事发展方向的逻辑需要（如：进入新地点需要当地角色）
- 冲突升级的角色需求（如：更强的反派、意外的盟友）
- 世界观扩展的需要（如：新组织、新势力的代表）
- 现有角色冲突网络缺口（如：某角色有目标但无对手）
</analysis_framework>

<output priority="P0">
【输出格式】
返回纯JSON对象（两种情况之一）：

**情况A：需要新角色**
{{
  "needs_new_characters": true,
  "reason": "预测分析原因（150-200字），说明为什么即将的剧情需要新角色",
  "character_count": 2,
  "character_specifications": [
    {{
      "name": "建议的角色名字（可选）",
      "role_description": "角色在剧情中的定位和作用（100-150字）",
      "suggested_role_type": "supporting/antagonist/protagonist",
      "importance": "high/medium/low",
      "appearance_chapter": {start_chapter},
      "goal": "该角色的核心目标（一句话）",
      "conflict_target": "该角色与哪个现有角色形成什么冲突",
      "key_abilities": ["能力1", "能力2"],
      "plot_function": "在剧情中的具体功能",
      "relationship_suggestions": [
        {{
          "target_character": "现有角色名",
          "relationship_type": "建议的关系类型",
          "reason": "为什么建立这种关系"
        }}
      ]
    }}
  ]
}}

**情况B：不需要新角色**
{{
  "needs_new_characters": false,
  "reason": "现有角色足以支撑即将的剧情发展，说明理由"
}}
</output>

<constraints>
【必须遵守】
✅ 这是预测性分析，面向未来剧情
✅ 考虑剧情的自然发展和节奏
✅ 确保引入必要性，不为引入而引入
✅ 优先考虑角色的长期作用

【关系建议要求】
✅ relationship_suggestions优先建议社交、职业、立场类关系
✅ 血缘关系建议最多1条，且须有充分理由
✅ 关系建议应服务于冲突网络的完善

【禁止事项】
❌ 输出markdown标记
❌ 基于已生成内容做事后分析
❌ 为了引入角色而强行引入
❌ 设计一次性功能角色
❌ 血缘关系建议超过1条
</constraints>
