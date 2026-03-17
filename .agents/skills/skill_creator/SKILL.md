---
name: Skill Creator
description: Expert system to design, structure, and generate effective Antigravity skills following best practices and the required folder/metadata architecture.
---

# Skill Creator

You are operating under the **Skill Creator** context. Your objective is to help the user design, scaffold, and implement new specialized skills for Antigravity. 

You must ensure that any new skill requested by the user perfectly adheres to the Antigravity Skill standards.

## Antigravity Skill Architecture Rules

Skills are specialized folders that provide instructions, scripts, and resources to extend capabilities. When creating a new skill, you MUST follow this structure:

### 1. The Skill Directory
Create a dedicated folder for the skill, typically in the `.agents/skills/` or `_agents/skills/` directory of the project workspace (e.g., `.agents/skills/deploy_manager/`). Name the folder using `snake_case`.

### 2. The `SKILL.md` File (Mandatory)
Inside the new skill folder, you MUST create a `SKILL.md` file. This is the main brain of the skill. 
It **MUST** start with YAML frontmatter containing the `name` and `description` to be valid, followed by highly detailed, step-by-step markdown instructions for Antigravity.

**Template for `SKILL.md`:**
```markdown
---
name: [Human Readable Name]
description: [Clear, concise description indicating EXACTLY when Antigravity should invoke this skill]
---

# Introduction
[Brief context on what the skill achieves]

# Rules and Capabilities
- [Rule 1]
- [Rule 2]

# Workflows / Steps
1. **Step One:** [What Antigravity should do first]
2. **Step Two:** [Subsequent actions]
...
```

### 3. Optional Subdirectories
If the skill requires complex logic, scripts, or references, you should also create any of the following folders inside the skill's directory:
- `scripts/`: Helper scripts (bash, python, node) that Antigravity can execute using `run_command` to accomplish the specialized task.
- `examples/`: Reference implementations, code blueprints, or usage patterns that Antigravity can read using `view_file` to learn how to generate similar code.
- `resources/`: Additional static files, text templates, or assets the skill might need.

## Workflow: How to Create a New Skill for the User

When the user asks you to create a new skill, follow these exact steps:

1. **Information Gathering:**
   - Understand the exact purpose and goal of the new skill.
   - Ask clarifying questions about what rules, scripts, or examples should be included if the user's initial request is too brief.

2. **Scaffold the Architecture:**
   - Determine the target directory (e.g., `.agents/skills/[skill_name]/`).
   - Write the `SKILL.md` file using the `write_to_file` tool, ensuring the YAML frontmatter is flawlessly formatted.
   - Include clear, bold, step-by-step directives within the markdown part of `SKILL.md` so that future Antigravity agents know exactly what to do when they read it.

3. **Populate Extras (If Applicable):**
   - If the skill needs a script to automate a task, write it into the `scripts/` folder.
   - If the skill is meant to enforce coding standards, write an example file in the `examples/` folder.

4. **Confirmation:**
   - Inform the user that the skill has been created and is ready to be utilized. Explain briefly what the new skill's `SKILL.md` contains.
