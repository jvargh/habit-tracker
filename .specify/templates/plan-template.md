# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Node.js 18+, Python 3.11, or native tooling or NEEDS CLARIFICATION]  
**Build Dependencies**: [e.g., minimal/none, postcss, esbuild, or NEEDS CLARIFICATION]  
**Template Engine**: [e.g., native, mustache, liquid, or NEEDS CLARIFICATION]  
**Testing**: [e.g., jest, pytest, or native testing or NEEDS CLARIFICATION]  
**Target Browsers**: [e.g., Modern browsers (ES6+), IE11+, or NEEDS CLARIFICATION]
**Project Type**: [static-site/docs-site/cms - determines source structure]  
**Performance Goals**: [e.g., <3s load time, <1MB bundle, <100ms build/page or NEEDS CLARIFICATION]  
**Constraints**: [e.g., no-js fallback, offline-capable, CDN-friendly or NEEDS CLARIFICATION]  
**Content Scale**: [e.g., 100 pages, 1000 posts, 10GB assets or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Static-First Compliance**:
- [ ] Feature produces only static output (HTML/CSS/JS)
- [ ] No server-side rendering or runtime dependencies required
- [ ] Output can be served by any static web server

**Minimal Dependencies Check**:
- [ ] All dependencies justified with clear benefits
- [ ] Prefer native web APIs over external libraries
- [ ] Build tools are minimal and have clear exit strategies

**Template-Driven Verification**:
- [ ] Content generation uses declarative templates
- [ ] Clear separation between content, structure, and presentation
- [ ] Templates are readable by non-developers

**Test-First Requirements**:
- [ ] Test strategy defined for template contracts
- [ ] Integration tests planned for build processes
- [ ] Output validation tests specified

**Simplicity Validation**:
- [ ] Feature follows YAGNI principles
- [ ] Default behaviors work out-of-the-box
- [ ] Advanced features are opt-in only

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Static Site Generator (DEFAULT)
src/
├── templates/           # Template files for content generation
├── assets/              # CSS, JS, images, fonts
├── content/             # Markdown, data files, content source
├── generators/          # Build logic and processors
└── lib/                 # Shared utilities and helpers

build/                   # Generated static output (gitignored)
├── css/
├── js/
├── images/
└── *.html

tests/
├── contract/            # Template contract tests
├── integration/         # Build process tests
├── output/              # Generated site validation tests
└── unit/                # Component unit tests

# [REMOVE IF UNUSED] Option 2: Static Site with CMS (when content management detected)
src/
├── templates/
├── assets/
├── generators/
└── cms/                 # Content management interfaces
    ├── admin/
    └── api/

content/
├── pages/               # Page content and metadata
├── posts/               # Blog posts or articles
├── data/                # Structured data files
└── media/               # Images, documents, uploads

# [REMOVE IF UNUSED] Option 3: Documentation Site (when docs-focused detected)
docs/
├── content/             # Documentation source
│   ├── guides/
│   ├── reference/
│   └── tutorials/
├── templates/
└── assets/

src/
├── generators/          # Documentation processors
├── plugins/             # Extension mechanisms
└── lib/
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
