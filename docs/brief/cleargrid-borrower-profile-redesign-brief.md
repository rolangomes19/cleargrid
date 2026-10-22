# Borrower Profile Page Redesign

**Product Design Case Study Brief — For Product Design Candidates**

---

## Overview

This case study brief invites product design candidates to redesign the **Borrower Profile Page** within ClearGrid's collections CRM platform. The objective is to improve visual hierarchy, data grouping, and overall usability while creating a design that works seamlessly in both **English (LTR)** and **Arabic (RTL)** layouts.

The current interface is live and functional but has evolved organically over time. This presents an opportunity to apply fresh UX thinking and design clarity to create a more efficient, agent-friendly experience.

## About ClearGrid

ClearGrid is a next-generation debt resolution partner helping institutions improve recovery, reduce cost-to-collect, and enhance customer experience across the full DPD (Days Past Due) spectrum. Using predictive AI, omni-channel orchestration, and real-time portfolio intelligence, ClearGrid creates a resolution process that is faster, fairer, and more consistent for lenders and borrowers alike.

ClearGrid operates primarily in the **UAE** and **KSA (Saudi Arabia)** markets, serving clients across banking, BNPL, telecom, digital SMEs, and embedded finance sectors.

---

## The Challenge

### Current State Analysis

The existing Borrower Profile Page serves as the primary workspace for collections agents. After analyzing the current interface, several UX/UI issues have been identified that impact agent efficiency and user experience.

| Issue Category | Current Problem | Business Impact |
|---|---|---|
| **Visual Hierarchy** | Information lacks clear visual distinction between primary and secondary data. Font sizes and weights are inconsistent. | Agents struggle to quickly locate critical borrower information, leading to longer call handling times. |
| **Data Grouping** | Related information is scattered across disconnected sections. Contact details, financial status, and interaction history are fragmented. | Increased cognitive load as agents must piece together related information from multiple areas. |
| **Layout Efficiency** | Excessive scrolling required to access key information. Poor utilization of screen real estate. | Reduced agent productivity and potential for missed critical data points. |
| **Component Scalability** | Current design lacks modular, reusable components. | Difficult to maintain consistency and scale as new features are added. |
| **Bilingual Support** | Limited consideration for RTL (Arabic) layout requirements. | Suboptimal experience for Arabic-speaking agents and markets. |

### Current Interface Screenshots

Full-resolution screenshots extracted to [`screenshots/`](screenshots/):

1. **[01-main-borrower-info.png](screenshots/01-main-borrower-info.png)** — Main Borrower Information: personal details, financial status, and PTP (Promise to Pay) collections log.
2. **[02-deal-activity-interaction-logs.png](screenshots/02-deal-activity-interaction-logs.png)** — Deal Activity & Interaction Logs: email addresses, phone numbers, and tabular interaction log data.
3. **[03-custom-attributes-extended-details.png](screenshots/03-custom-attributes-extended-details.png)** — Custom Attributes & Extended Details: payment dates, amounts, system metadata.
4. **[04-deal-timeline-communication-history.png](screenshots/04-deal-timeline-communication-history.png)** — Deal Timeline & Communication History: deal activity timeline and expanded interaction logs.

---

## Redesign Requirements

### Your Redesign Should Include

**1. Redesigned UI Layout (Desktop Only)**
Create a comprehensive redesign of the Borrower Profile Page for both English (LTR) and Arabic (RTL) versions. The design should prioritize agent efficiency and quick access to critical information.

**2. Improved Visual Hierarchy**
Demonstrate clear thinking about which information should be prominent, grouped, collapsible, or tabbed. Consider the agent's workflow and prioritize information accordingly.

**3. Component-Based Thinking**
Design with modularity in mind. Create reusable components such as cards, tables, accordions, and action buttons that can scale across the platform.

**4. UX Rationale**
Provide a brief explanation (2–4 bullet points or a short Loom video) describing your thought process and how your redesign improves usability for collections agents.

---

## Data Elements to Include

All of the following data must be represented in your redesign. Full creative freedom to restructure and group these elements.

### A. Borrower & Loan Information

| Field | Description |
|---|---|
| Name | Borrower name (Arabic + English) |
| Gender | Male/Female/N/A |
| Nationality | Country code (e.g., IND, UAE) |
| Date of Birth | DD/MM/YYYY format |
| Emirates ID | National identification number |
| Deal Owner | Assigned agent name |
| Deal Stage | Current stage (e.g., RPC, PTP) |
| Visa Status | Employment/residency status |
| Submit Date | Date case was submitted |

### B. Financial Status

| Field | Description |
|---|---|
| Total Amount | Original loan/debt amount |
| Outstanding Amount | Current balance owed |
| Overdue Amount | Amount past due date |
| Last Due Date | Most recent payment due date |
| Days Past Due (DPD) | Number of days overdue |
| Account Status | Current account state (e.g., IN_COLLECTION) |

### C. PTP & Call Logs

| Field | Description |
|---|---|
| Total Human Calls | Count of agent-initiated calls |
| Total AI Calls | Count of automated AI calls |
| Latest Human Call Answered | Timestamp of last answered human call |
| Latest AI Call Answered | Timestamp of last answered AI call |
| PTP Via Interaction Log | Promise to Pay amount and date |
| Broken Promises | Type, date, and count of broken PTPs |
| Interaction Logs | Table of all interactions |
| Communication Logs | Table of all communications |

### D. Loan/Deal Data Table

For borrowers with multiple deals, display a table with:

| Column | Description |
|---|---|
| Reference ID | Unique deal identifier |
| Account Reference ID | Linked account identifier |
| Balance Amount | Current balance |
| Total Amount | Original amount |
| Due Date | Payment due date |
| Loan Type | Type of loan (e.g., CREDIT_CARD) |
| Status | Current status |
| Merchant Name | Merchant (Arabic/English) |
| Action | View/Edit actions |

### E. Account Details (Expanded Deal View)

| Field | Description |
|---|---|
| Payment Plan Status | Active/Inactive payment plan |
| Interest/EMI/Installment | Payment breakdown information |
| Lender Name & ID | Financial institution details |
| Principal Amount | Original principal |
| Schedule/Payment Flags | Payment schedule indicators |
| Timeline Entries | Chronological activity log |
| Custom Attributes | Lender verification, dispute status, etc. |

### F. Action Buttons

| Action | Description |
|---|---|
| Call | Phone call initiation |
| SMS | Text message |
| WhatsApp | WhatsApp message |
| Email | Email composition |
| Email Inbox | View received emails |

---

## Bilingual Design Requirements

### English (LTR) Version
- Standard left-to-right text flow
- Left-aligned labels and content
- Standard icon placement

### Arabic (RTL) Version
- Right-to-left text flow and alignment
- Mirrored layout structure
- RTL-appropriate icon placement
- Arabic typography considerations

You may present these as two separate frames or pages in your Figma file. Proper RTL alignment and language mirroring is required for the Arabic version.

---

## Deliverables

| Deliverable | Format | Required |
|---|---|---|
| Design File | Figma file or link | Yes |
| English (LTR) Layout | Desktop web design | Yes |
| Arabic (RTL) Layout | Desktop web design | Yes |
| UX Rationale | Bullet points or Loom video | Yes |

## Evaluation Criteria

| Criterion | Weight | Description |
|---|---|---|
| Visual Design Clarity | 25% | Clean, professional aesthetic aligned with ClearGrid brand |
| UX Thinking | 30% | Thoughtful hierarchy, grouping, and layout decisions |
| Arabic Support & RTL | 25% | Proper RTL execution and bilingual design quality |
| Initiative & Ownership | 20% | Bonus points for thoughtful touches and creative solutions |

## Timeline

> Please complete and submit your redesign within **48 hours** of receiving this brief.

---

*ClearGrid — Modern Collections, Better Outcomes · cleargrid.ai*
