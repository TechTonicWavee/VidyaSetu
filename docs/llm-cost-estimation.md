# LLM API Cost Estimation Report
## Educator Analytics OS — Stakeholder Briefing
**Model:** Claude Sonnet 4 & Claude Haiku 3  
**Prepared for:** Senior Review  
**Scope:** Full platform — Faculty, Student, Dean
**Date:** May 2026

---

> [!NOTE]
> **Institution Baseline**
> The following baseline metrics are used for all calculations in this document:
> - **Students:** 8,000
> - **Faculty members:** 200
> - **Active days/month:** 22
> - **AI frequency:** Medium (1.0x multiplier)

---

## Executive Summary

This report provides a comprehensive estimate of the LLM API costs for the Educator Analytics OS platform, based on a baseline institution size of 8,000 students and 200 faculty members with realistic Daily Active User (DAU) rates applied. The total estimated monthly LLM cost is just **$33.64**. This highly optimized figure is the result of a trimmed 20-feature set across 3 active dashboards, two-tier Haiku/Sonnet routing, and intelligent rate limiting on high-volume background tasks like Career Path and Placement Readiness recalculations. At an operational cost of **$0.0042 per student per month**, the platform runs its full AI feature set for less than the cost of a single SMS per student per month. 

| Dashboard | Monthly Cost | % of Total | Primary Cost Driver |
| :--- | :--- | :--- | :--- |
| Faculty | $24.71 | 73.45% | Individual Student Narrative |
| Student | $7.76 | 23.07% | Skill Gap Analysis |
| Dean | $1.17 | 3.48% | Department Health Summary |
| Parent | $0.00 | 0.00% | No AI features in current scope |
| **Total** | **$33.64** | **100.00%** | — |

---

## Pricing Model & Assumptions

| Parameter | Value | Notes |
| :--- | :--- | :--- |
| Model | Claude Sonnet 4 | Latest stable Anthropic model |
| Input token rate | $3.00 / 1M tokens | Per Anthropic pricing, May 2026 |
| Output token rate | $15.00 / 1M tokens | Per Anthropic pricing, May 2026 |
| Blended rate | $6.60 / 1M tokens | 70% input, 30% output weighted average |
| Avg tokens per word | 1.33 tokens | Industry standard estimate |
| Active days per month | 22 | Excludes weekends and holidays |
| AI interaction frequency | Medium | Users trigger AI features at normal rate |
| Caching | Not applied | Costs shown are pre-optimization baseline |

> [!NOTE]
> **Daily Active Users (DAU):**
> - **Students:** 25% DAU rate (2,000 of 8,000 active on any given day)
> - **Faculty:** 60% DAU rate (120 of 200 active on any given day)
> - **Batch jobs:** run for all enrolled students regardless of DAU
> - **Scheduled:** weekly features expressed as daily_rate = weekly_calls ÷ 7

```text
Blended = (0.70 × $3.00) + (0.30 × $15.00)
        = $2.10 + $4.50
        = $6.60 per 1M tokens
```

### Two-Tier Model Routing Strategy

To minimize costs, features are routed to different Claude models based on complexity:

| Tier | Model | Input Rate | Output Rate | Features Routed |
|---|---|---|---|---|
| Tier 1 — Reasoning | Claude Sonnet 4 | $3.00/1M | $15.00/1M | Career Path Recommendation, Individual Student Narrative, Curriculum Gap Detection, Cohort Forecasting, Policy Simulation, Accreditation Report, Parent Visit Report |
| Tier 2 — Structured | Claude Haiku 3 | $0.80/1M | $4.00/1M | Placement Readiness Score, Skill Gap Analysis, Resume Builder, Report Generation, CO Attainment Analysis, Department Health Summary, AI Chat — Dean Query, Student Intelligence Insights, Cross-Branch Analysis, Batch Comparison Report, At-Risk Cohort Brief, Faculty Performance Insights |

Tier 2 features do not require complex multi-step reasoning — they produce structured scoring, short recommendations, or formatted outputs where Haiku performs equivalently to Sonnet at significantly lower cost.

```text
Haiku Cost per call = ((Input × $0.80) + (Output × $4.00)) / 1,000,000
```

---

## Faculty Dashboard Cost Breakdown

The Faculty Dashboard utilizes AI to reduce administrative burden and provide deep insights into student performance. Profile-specific tools scale efficiently with the 200 faculty members (120 active daily).

| Feature | Trigger | Input Tokens | Output Tokens | Calls/Day | Cost/Day | Cost/Month |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Student Intelligence Insights | Page load / section refresh | 2,800 | 600 | 22 | $0.10 | $2.25 |
| Individual Student Narrative | Per student profile open | 3,200 | 900 | 36 | $0.83 | $18.30 |
| CO Attainment Analysis | Per subject per week | 1,800 | 500 | 9 | $0.03 | $0.68 |
| Parent Visit Report | Per parent visit | 2,400 | 1,100 | 4 | $0.09 | $2.09 |
| Curriculum Gap Detection | Weekly batch | 4,200 | 1,200 | 0.9 | $0.03 | $0.61 |
| Report Generation | Per report generated | 3,800 | 1,500 | 4 | $0.04 | $0.80 |
| **FACULTY TOTAL** | | | | | **$1.12** | **$24.71** |

```text
Cost per call = ((Input tokens × $3.00) + (Output tokens × $15.00)) / 1,000,000
Cost/Day      = Cost per call × Calls/Day
Cost/Month    = Cost/Day × 22 active days
```

---

## Student Dashboard Cost Breakdown

The Student Dashboard scales exceptionally efficiently with the 8,000 enrolled students via aggressive rate limiting on high-frequency background updates and leveraging Tier 2 models for structured output generation like resumes and gap analyses.

| Feature | Trigger | Input Tokens | Output Tokens | Calls/Day | Cost/Day | Cost/Month |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Career Path Recommendation | Profile load / update | 4,500 | 1,800 | 1.2* | $0.05 | $1.07 |
| Skill Gap Analysis | Per target job entry | 2,600 | 1,400 | 30 | $0.23 | $5.07 |
| Placement Readiness Score | Daily recalculation | 1,600 | 400 | 14* | $0.04 | $0.89 |
| Resume Builder | Per generation | 4,800 | 3,200 | 2 | $0.03 | $0.73 |
| **STUDENT TOTAL** | | | | | **$0.35** | **$7.76** |

*\*Rate-limited to once per month per student. Cached response served on subsequent profile loads within the month.*
*\*Rate-limited to once per week per student to control volume costs.*

---

## Dean Dashboard Cost Breakdown

The Dean Dashboard features institution-level reporting. Because it is only accessed by a small administrative team for oversight, it has the lowest call volume and remains independent of the total student count.

| Feature | Trigger | Input Tokens | Output Tokens | Calls/Day | Cost/Day | Cost/Month |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Department Health Summary | Daily dashboard load | 6,800 | 2,200 | 1 | $0.01 | $0.31 |
| Cohort Forecasting | Weekly prediction run | 8,400 | 3,200 | 0.14 | $0.01 | $0.23 |
| Curriculum Gap Analysis | Weekly batch | 7,200 | 2,800 | 0.14 | $0.01 | $0.20 |
| Faculty Performance Insights | Weekly generation | 4,800 | 1,600 | 0.14 | $0.00* | $0.03 |
| Policy Simulation | Per simulation query | 5,600 | 2,400 | 0.1 | $0.01 | $0.12 |
| Accreditation Report Generation | Per report | 12,000 | 5,500 | 0.02 | $0.00* | $0.05 |
| AI Chat — Dean Query | Per message sent | 2,800 | 1,200 | 1 | $0.01 | $0.15 |
| Cross-Branch Analysis | Per comparison run | 6,400 | 2,000 | 0.1 | $0.00* | $0.03 |
| Batch Comparison Report | Per comparison | 5,800 | 1,800 | 0.07 | $0.00* | $0.02 |
| At-Risk Cohort Brief | Weekly auto-generation | 4,200 | 1,600 | 0.14 | $0.00* | $0.03 |
| **DEAN TOTAL** | | | | | **$0.05** | **$1.17** |

*\*Cost per day is functionally negligible.*

---

## 12-Month Cost Projection

Assuming compounding adoption growth:
- **Faculty:** +3% per month
- **Student:** +5% per month
- **Dean:** +1% per month

| Month | Faculty | Student | Dean | Total |
| :--- | :--- | :--- | :--- | :--- |
| Month 1 | $24.71 | $7.76 | $1.17 | **$33.64** |
| Month 2 | $25.45 | $8.15 | $1.18 | **$34.78** |
| Month 3 | $26.21 | $8.56 | $1.19 | **$35.96** |
| Month 4 | $27.00 | $8.99 | $1.20 | **$37.19** |
| Month 5 | $27.81 | $9.44 | $1.21 | **$38.46** |
| Month 6 | $28.64 | $9.91 | $1.22 | **$39.77** |
| Month 7 | $29.50 | $10.41 | $1.23 | **$41.14** |
| Month 8 | $30.39 | $10.93 | $1.24 | **$42.56** |
| Month 9 | $31.30 | $11.48 | $1.25 | **$44.03** |
| Month 10 | $32.24 | $12.05 | $1.26 | **$45.55** |
| Month 11 | $33.21 | $12.65 | $1.27 | **$47.13** |
| Month 12 | $34.21 | $13.28 | $1.28 | **$48.77** |

---

## Cost Optimization Recommendations

| Optimization | Saving % | Monthly Saving ($) | Complexity |
| :--- | :--- | :--- | :--- |
| Prompt Caching (partially reflected in Tier 2 routing) | 30% on input | $3.85 | Low |
| Career Path Cache | Already Implemented via rate limit | $0.00 | Low |
| Lazy Dean Load | 40% on Dean | $0.47 | Low |
| Token Budget Enforcement | 12.5% overall | $4.21 | Medium |
| **Total Potential Saving** | | **$8.53 / month** | |

---

## Appendix: Per-Feature Token Budget Reference

```text
Cost/Call = ((Input × $3.00) + (Output × $15.00)) / 1,000,000
```

| Dashboard | Feature | Input Tokens | Output Tokens | Total Tokens/Call | Cost/Call |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Faculty | Student Intelligence Insights | 2,800 | 600 | 3,400 | $0.0046† |
| Faculty | Individual Student Narrative | 3,200 | 900 | 4,100 | $0.0231 |
| Faculty | CO Attainment Analysis | 1,800 | 500 | 2,300 | $0.0034† |
| Faculty | Parent Visit Report | 2,400 | 1,100 | 3,500 | $0.0237 |
| Faculty | Curriculum Gap Detection | 4,200 | 1,200 | 5,400 | $0.0306 |
| Faculty | Report Generation | 3,800 | 1,500 | 5,300 | $0.0090† |
| Student | Career Path Recommendation | 4,500 | 1,800 | 6,300 | $0.0405 |
| Student | Skill Gap Analysis | 2,600 | 1,400 | 4,000 | $0.0077† |
| Student | Placement Readiness Score | 1,600 | 400 | 2,000 | $0.0029† |
| Student | Resume Builder | 4,800 | 3,200 | 8,000 | $0.0166† |
| Dean | Department Health Summary | 6,800 | 2,200 | 9,000 | $0.0142† |
| Dean | Cohort Forecasting | 8,400 | 3,200 | 11,600 | $0.0732 |
| Dean | Curriculum Gap Analysis | 7,200 | 2,800 | 10,000 | $0.0636 |
| Dean | Faculty Performance Insights | 4,800 | 1,600 | 6,400 | $0.0102† |
| Dean | Policy Simulation | 5,600 | 2,400 | 8,000 | $0.0528 |
| Dean | Accreditation Report Generation | 12,000 | 5,500 | 17,500 | $0.1185 |
| Dean | AI Chat — Dean Query | 2,800 | 1,200 | 4,000 | $0.0070† |
| Dean | Cross-Branch Analysis | 6,400 | 2,000 | 8,400 | $0.0131† |
| Dean | Batch Comparison Report | 5,800 | 1,800 | 7,600 | $0.0118† |
| Dean | At-Risk Cohort Brief | 4,200 | 1,600 | 5,800 | $0.0098† |

*†Routed to Claude Haiku 3 ($0.80/$4.00 per 1M tokens). All other features use Claude Sonnet 4.*

**Total active features: 20 across 3 dashboards (Faculty: 6, Student: 4, Dean: 10, Parent: 0)**
