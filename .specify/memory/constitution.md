<!--
Sync Impact Report:
- Version change: [NEW] → 1.0.0 (initial constitution)
- Principles defined: Static-First, Minimal Dependencies, Template-Driven, Test-First, Simplicity
- Added sections: Technology Constraints, Development Workflow
- Templates requiring updates: ✅ updated
  - ✅ plan-template.md: Updated Constitution Check gates and project structures
  - ✅ spec-template.md: Updated examples for static site context
  - ✅ tasks-template.md: Updated foundational tasks and path conventions
  - ✅ checklist-template.md: No changes needed (generic)
  - ✅ agent-file-template.md: No changes needed (generic)
- Follow-up TODOs: None - all placeholders filled
-->

# SpecKit Constitution

## Core Principles

### I. Static-First
Every feature MUST produce static output that can be served by any web server. No server-side rendering, no runtime dependencies, no dynamic backends required for core functionality. Static HTML, CSS, and minimal JavaScript only. The entire site MUST be deployable to any static hosting platform (GitHub Pages, Netlify, Vercel, S3, etc.).

**Rationale**: Static sites are faster, more secure, easier to deploy, and have lower maintenance overhead.

### II. Minimal Dependencies
MUST minimize external dependencies and prefer built-in platform capabilities. No frameworks unless they provide substantial value that cannot be achieved with vanilla approaches. Every dependency MUST be justified with clear benefits outweighing the complexity cost. Prefer native web APIs over libraries.

**Rationale**: Reduces security surface area, improves load times, decreases maintenance burden, and ensures longevity.

### III. Template-Driven
All content generation MUST use declarative templates with clear separation between content, structure, and presentation. Templates MUST be technology-agnostic and readable by non-developers. Support for multiple output formats from single source content is mandatory.

**Rationale**: Enables non-technical content creation, ensures consistency, and facilitates maintenance.

### IV. Test-First (NON-NEGOTIABLE)
Test-Driven Development is mandatory: Tests written → User approved → Tests fail → Then implement. Focus on contract tests for templates, integration tests for build processes, and validation tests for output quality. Red-Green-Refactor cycle strictly enforced.

**Rationale**: Ensures reliability of build processes and output quality, critical for static sites where runtime debugging is limited.

### V. Simplicity
Start simple, apply YAGNI principles rigorously. Prefer convention over configuration. Default behaviors MUST work out-of-the-box for common use cases. Advanced features are opt-in only. If a feature requires extensive documentation, reconsider the design.

**Rationale**: Lowers barrier to entry, reduces cognitive load, and maintains focus on core value proposition.

## Technology Constraints

**Build Tools**: Prefer native tooling (make, shell scripts) over complex build systems. If build tools are required, they MUST have minimal setup and clear exit strategies.

**JavaScript**: ES6+ modules only, no transpilation required for target browsers. Progressive enhancement mandatory - site MUST function without JavaScript.

**CSS**: Modern CSS features preferred over preprocessors. CSS custom properties for theming. No CSS frameworks unless they can be selectively included.

**Assets**: Optimize for performance - images MUST be compressed, fonts MUST be subset, unused code MUST be eliminated during build.

## Development Workflow

**Feature Development**: All features MUST go through spec → plan → tasks → implementation workflow. Each phase has clear deliverables and checkpoints.

**Quality Gates**: Constitution compliance check mandatory before Phase 0 research. Template validation required before implementation. Output validation required before deployment.

**Documentation**: Every feature MUST include user-facing documentation and examples. Technical documentation MUST be co-located with code.

## Governance

This constitution supersedes all other development practices and decisions. Amendments require documentation of the change rationale, impact assessment, and migration plan for existing code.

All pull requests and code reviews MUST verify compliance with these principles. Complexity MUST be justified against simpler alternatives. When in doubt, choose the simpler path.

For runtime development guidance, refer to template files in `.specify/templates/` and command prompts in `.github/prompts/`.

**Version**: 1.0.0 | **Ratified**: 2025-10-14 | **Last Amended**: 2025-10-14