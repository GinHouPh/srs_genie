import { SRSFormData } from '../../types';

/**
 * Master Template: Design System Documentation
 * Supplied for the SpecAgent micro-agent to synthesize UI/UX and design system architecture.
 */
export const DESIGNS_TEMPLATE = `# DESIGN SYSTEM DOCUMENTATION
## AI-Generated Design System Specification

**Document Type:** Design System Specification  
**Document Version:** 1.0  
**Project Name:** [Project Name]  
**Product Name:** [Product Name]  
**Design System Name:** [Design System Name]  
**Document Status:** [Draft / Under Review / Approved / Implemented]  
**Prepared By:** AI Design System Architect Agent  
**Design Owner:** [Design Owner]  
**Date Created:** [Date]  
**Last Updated:** [Date]  
**Target Release:** [Version]

---

# SECTION 0 — AI AGENT OPERATING INSTRUCTIONS

## 0.1 Agent Role

Act as a Senior Design System Architect, UI/UX Designer, Product Designer, Interaction Designer, and Design-to-Code Specialist.

Your responsibility is to analyze the user's project information and produce a comprehensive design system that establishes consistent visual, behavioral, structural, and accessibility standards for the entire product.

The generated design system must serve as the authoritative reference for:

- Product designers.
- UI/UX designers.
- Frontend developers.
- Mobile developers.
- Design system engineers.
- Component library developers.
- AI UI generation agents.
- AI coding agents.
- QA engineers.
- Product teams.

## 0.2 Input Sources

The agent may receive:

1. User Project Detail Summary.
2. Approved Product Requirements Document.
3. Project Plan.
4. Technical Design Document.
5. Brand Guidelines.
6. Existing Design System.
7. Existing UI Screenshots.
8. Reference Images.
9. Design Mockups.
10. Technology and Platform Requirements.
11. User-Specified Design Preferences.

Use the available inputs and identify their approval status.

### Source Priority

When information conflicts, apply the following priority:

1. Explicit user instructions.
2. Approved brand guidelines.
3. Approved PRD and product requirements.
4. Approved design decisions.
5. Existing approved design system.
6. Technical constraints.
7. AI-generated recommendations.

Do not silently resolve conflicts between approved sources. Record them in the Design Decision Register.

## 0.3 Design System Generation Objectives

Generate a design system covering:

- Brand identity.
- Design philosophy.
- Visual principles.
- Design foundations.
- Design tokens.
- Color system.
- Typography.
- Spacing.
- Layout and grids.
- Sizing.
- Borders and radii.
- Shadows and elevation.
- Iconography.
- Illustrations.
- Imagery.
- Motion.
- Responsive behavior.
- Accessibility.
- Component architecture.
- Component specifications.
- Interaction patterns.
- Page and screen templates.
- Data visualization.
- Content design.
- Theming.
- Platform-specific requirements.
- Design-to-development handoff.
- Governance and versioning.

## 0.4 Information Classification

Every significant design decision must be classified.

| Classification | Meaning |
|---|---|
| User-Confirmed | Explicitly requested by the user. |
| Brand-Confirmed | Established in approved brand guidelines. |
| PRD-Derived | Required by approved product requirements. |
| Design-Recommended | Proposed by the Design System Agent. |
| Assumed | Temporarily selected due to missing information. |
| Pending Approval | Requires confirmation. |
| Out of Scope | Excluded from the product. |
| Not Applicable | Irrelevant to this product. |

## 0.5 Design Generation Rules

The agent must:

1. Understand the product domain and user audience.
2. Identify the intended visual personality.
3. Establish a coherent visual direction.
4. Create reusable design foundations.
5. Use a consistent token architecture.
6. Establish semantic design tokens.
7. Define component anatomy and behavior.
8. Define component variants and states.
9. Ensure consistent interaction behavior.
10. Establish responsive layout standards.
11. Address accessibility from the beginning.
12. Maintain consistency across platforms.
13. Avoid unnecessary component duplication.
14. Define reusable patterns before individual screen styling.
15. Maintain a clear separation between foundations, components, patterns, and page templates.
16. Keep all design specifications compatible with the target development technologies.

## 0.6 Missing Information Policy

Use:

- [TBD] for unspecified values.
- [ASSUMPTION] for temporary design decisions.
- [PROPOSED] for agent recommendations.
- [PENDING APPROVAL] for decisions requiring confirmation.
- [NOT APPLICABLE] for irrelevant sections.

Never invent an established brand identity, approved logo, or user-preferred visual style.

Where the project has no existing brand guidelines, propose a coherent design direction and clearly label it as proposed.

## 0.7 Adaptive Design System Generation

The agent must adapt the depth and type of design system according to the product.

Examples:

**SaaS Applications**
- Application shell.
- Sidebar.
- Top navigation.
- Dashboard components.
- Data tables.
- Administrative interfaces.
- Tenant-specific theming.
- Configuration interfaces.

**Mobile Applications**
- Mobile navigation.
- Safe areas.
- Touch targets.
- Native interactions.
- Bottom navigation.
- Gesture behavior.
- Platform-specific controls.

**Enterprise Applications**
- Dense data layouts.
- Advanced tables.
- Bulk operations.
- Complex forms.
- Permission-aware interfaces.
- Data visualization.
- Extensive configuration patterns.

**AI Applications**
- Chat interfaces.
- AI response containers.
- Tool execution states.
- Agent activity indicators.
- Streaming output.
- Context panels.
- Execution timelines.
- Approval interfaces.
- Model selectors.

Only include components relevant to the product, its users, and its intended platforms.

---

# SECTION 1 — DESIGN SYSTEM OVERVIEW

## 1. Design System Identification

### 1.1 Design System Information

| Field | Details |
|---|---|
| Design System Name | [Name] |
| Design System ID | [ID] |
| Product | [Product] |
| Design System Version | [Version] |
| Design System Type | [Product-Specific / Multi-Product / Enterprise] |
| Supported Platforms | [Platforms] |
| Design Owner | [Owner] |
| Implementation Framework | [Framework] |
| Component Library | [Library] |
| Design Tool | [Figma / Other] |
| Theme Support | [Light / Dark / Both / Custom] |
| Accessibility Target | [Standard / Target] |
| Status | [Status] |

### 1.2 Design System Purpose

Describe why the design system is being developed.

### 1.3 Design System Vision

Define the long-term vision for the product's visual and interaction language.

### 1.4 Design System Objectives

Identify objectives such as:

- Visual consistency.
- Reusability.
- Faster product development.
- Reduced design duplication.
- Improved usability.
- Accessibility.
- Cross-platform consistency.
- Easier maintenance.
- Scalable interface development.
- AI-assisted interface generation.

### 1.5 Design System Scope

Define which applications, modules, platforms, and product areas are covered.

### 1.6 Design System Boundaries

Identify:
- Shared design foundations.
- Product-specific design decisions.
- Platform-specific components.
- Third-party component dependencies.
- Customization boundaries.

### 1.7 Supported Products and Applications

| Product ID | Product Name | Platform | Design System Coverage |
|---|---|---|---|
| PROD-001 | [Product] | [Platform] | [Coverage] |

---

# SECTION 2 — DESIGN PHILOSOPHY AND PRINCIPLES

## 2. Design Philosophy

### 2.1 Overall Design Philosophy

Describe the fundamental approach guiding the product's visual and interaction design.

### 2.2 Visual Personality

Define the intended personality.

Possible characteristics:

- Minimal.
- Modern.
- Professional.
- Corporate.
- Elegant.
- Playful.
- Technical.
- Futuristic.
- Editorial.
- Industrial.
- Creative.
- Premium.

Select characteristics based on the actual product requirements.

### 2.3 Design Principles

Establish principles governing design decisions.

Examples:

1. Consistency — Reuse established patterns.
2. Clarity — Make information and actions understandable.
3. Hierarchy — Communicate importance through visual structure.
4. Simplicity — Avoid unnecessary visual complexity.
5. Accessibility — Make interfaces usable by diverse users.
6. Predictability — Maintain consistent interaction behavior.
7. Scalability — Design reusable patterns.
8. Flexibility — Support relevant user and product variations.

### 2.4 User Experience Principles

Define principles concerning:
- Navigation.
- Information hierarchy.
- Task completion.
- Feedback.
- Error prevention.
- Progressive disclosure.
- Contextual actions.
- User control.
- Cognitive load.

### 2.5 Visual Design Principles

Define standards for:
- Composition.
- Balance.
- Contrast.
- Alignment.
- Spacing.
- Proportion.
- Consistency.
- Density.
- Typography.
- Color application.

### 2.6 Product Design Direction

Describe the overall design direction and the reasoning behind it.

### 2.7 Reference and Inspiration

Document visual references supplied or approved by the user.

| Reference ID | Reference | Design Characteristics | Intended Application |
|---|---|---|---|
| REF-001 | [Reference] | [Characteristics] | [Usage] |

Distinguish inspiration from direct reproduction.

---

# SECTION 3 — BRAND IDENTITY AND VISUAL IDENTITY

## 3. Brand Foundation

### 3.1 Brand Overview

Describe the identity that the design system must communicate.

### 3.2 Brand Attributes

Define the intended brand characteristics.

### 3.3 Brand Voice

Define the communication personality:
- Formal.
- Professional.
- Friendly.
- Conversational.
- Technical.
- Authoritative.
- Informative.

### 3.4 Logo System

Document:
- Primary logo.
- Secondary logo.
- Symbol or mark.
- Horizontal logo.
- Vertical logo.
- Monochrome logo.
- Light-background variant.
- Dark-background variant.

### 3.5 Logo Usage Rules

Define:
- Minimum size.
- Clear space.
- Aspect ratio.
- Permitted backgrounds.
- Incorrect usage.
- Placement.
- Responsive variations.

### 3.6 Brand Colors

Define official brand colors separately from application semantic colors.

### 3.7 Brand Typography

Document approved brand fonts and their usage.

### 3.8 Brand Assets

Identify:
- Logos.
- Brand illustrations.
- Brand patterns.
- Photography.
- Graphic elements.
- Background artwork.
- Product imagery.

### 3.9 Brand-to-Product Translation

Explain how brand identity is translated into actual application interfaces.

---

# SECTION 4 — DESIGN TOKEN ARCHITECTURE

## 4. Design Token System

### 4.1 Token Architecture

Establish a multi-layer token structure.

**Layer 1 — Primitive Tokens**

Raw design values.

Examples:
- Blue 500.
- Gray 100.
- Spacing 16.
- Radius 8.
- Font size 14.

**Layer 2 — Semantic Tokens**

Tokens describing the purpose of a design value.

Examples:
- Color Text Primary.
- Color Surface Default.
- Color Border Subtle.
- Spacing Component Gap.
- Radius Control.

**Layer 3 — Component Tokens**

Tokens specific to components.

Examples:
- Button Primary Background.
- Button Primary Text.
- Input Border Focus.
- Card Background.
- Modal Shadow.

### 4.2 Token Naming Convention

Define a consistent token naming system.

Recommended structure:

\`category.property.variant.state\`

Examples:

- \`color.background.primary\`
- \`color.text.secondary\`
- \`color.border.subtle\`
- \`spacing.component.md\`
- \`radius.control.md\`
- \`button.primary.background.hover\`

The agent must establish a naming convention consistent across design files and code.

### 4.3 Token Metadata

Each token should contain:

| Field | Description |
|---|---|
| Token ID | Unique identifier |
| Token Name | Human-readable name |
| Token Key | Machine-readable key |
| Category | Color / Typography / Spacing / Other |
| Layer | Primitive / Semantic / Component |
| Value | Actual value or reference |
| Description | Purpose |
| Theme | Applicable theme |
| Platform | Applicable platform |
| Source | Confirmed / Proposed / Other |
| Status | Active / Deprecated |

### 4.4 Token Dependency Mapping

Define how semantic and component tokens reference underlying primitive tokens.

### 4.5 Platform Token Mapping

Document platform-specific implementations of shared design tokens.

### 4.6 Token Export Formats

Where applicable, specify support for:
- JSON.
- CSS Custom Properties.
- SCSS Variables.
- JavaScript / TypeScript.
- Design tool variables.
- Native mobile resource formats.

---

# SECTION 5 — COLOR SYSTEM

## 5. Color Architecture

### 5.1 Color Philosophy

Define the purpose and intended use of the product's colors.

### 5.2 Color Categories

Organize the color system into:

**Brand Colors**
- Primary.
- Secondary.
- Tertiary.
- Accent.

**Neutral Colors**
- White.
- Black.
- Gray scale.
- Neutral backgrounds.

**Semantic Colors**
- Success.
- Warning.
- Error.
- Information.
- Critical.

**Surface Colors**
- Default.
- Raised.
- Subtle.
- Sunken.
- Overlay.

**Text Colors**
- Primary.
- Secondary.
- Tertiary.
- Disabled.
- Inverse.
- Link.

**Border Colors**
- Default.
- Subtle.
- Strong.
- Focus.
- Error.

### 5.3 Color Palette Specification

For each color family define a palette.

| Token | HEX | RGB | HSL | Usage |
|---|---|---|---|---|
| Primary-50 | [Value] | [Value] | [Value] | [Usage] |
| Primary-100 | [Value] | [Value] | [Value] | [Usage] |
| Primary-200 | [Value] | [Value] | [Value] | [Usage] |
| Primary-300 | [Value] | [Value] | [Value] | [Usage] |
| Primary-400 | [Value] | [Value] | [Value] | [Usage] |
| Primary-500 | [Value] | [Value] | [Value] | [Usage] |
| Primary-600 | [Value] | [Value] | [Value] | [Usage] |
| Primary-700 | [Value] | [Value] | [Value] | [Usage] |
| Primary-800 | [Value] | [Value] | [Value] | [Usage] |
| Primary-900 | [Value] | [Value] | [Value] | [Usage] |

Repeat for other necessary color families.

### 5.4 Semantic Color Mapping

| Semantic Token | Light Theme | Dark Theme | Purpose |
|---|---|---|---|
| Background Primary | [Value] | [Value] | Main background |
| Background Secondary | [Value] | [Value] | Secondary background |
| Text Primary | [Value] | [Value] | Main text |
| Text Secondary | [Value] | [Value] | Secondary text |
| Border Default | [Value] | [Value] | Standard borders |
| Status Success | [Value] | [Value] | Success state |

### 5.5 Color Interaction States

Define colors for:
- Default.
- Hover.
- Active.
- Focus.
- Disabled.
- Selected.
- Pressed.
- Error.

### 5.6 Color Contrast

Establish contrast requirements for text, controls, icons, and visual elements.

Document the target accessibility standard and contrast ratios for relevant text and non-text elements.

### 5.7 Color Usage Rules

Define:
- Primary color usage.
- Accent color usage.
- Semantic color usage.
- Background and surface combinations.
- Text and background combinations.
- Restricted combinations.
- Color misuse.

### 5.8 Special Color Themes

Where relevant, support:
- Light.
- Dark.
- High Contrast.
- Brand-specific themes.
- Tenant-specific themes.

---

# SECTION 6 — TYPOGRAPHY SYSTEM

## 6. Typography Foundation

### 6.1 Font Families

Define:
- Primary font.
- Secondary font.
- Display font.
- Monospace font.
- Fallback fonts.

### 6.2 Font Usage

Specify typography usage for:
- Headings.
- Body content.
- Labels.
- Buttons.
- Navigation.
- Tables.
- Code.
- Data visualization.
- Numeric information.

### 6.3 Type Scale

Define the type scale.

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| Display XL | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Display LG | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Heading XL | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Heading LG | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Heading MD | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Heading SM | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Body LG | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Body MD | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Body SM | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Label LG | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Label MD | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Label SM | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Caption | [Value] | [Value] | [Value] | [Value] | [Usage] |
| Code | [Value] | [Value] | [Value] | [Value] | [Usage] |

### 6.4 Heading Hierarchy

Define semantic heading levels and their corresponding visual styles.

### 6.5 Text Formatting

Specify:
- Bold.
- Semibold.
- Italic.
- Underline.
- Strikethrough.
- Inline code.
- Links.
- Lists.
- Blockquotes.

### 6.6 Typography Responsiveness

Define responsive type behavior for desktop, tablet, and mobile.

### 6.7 Text Accessibility

Specify:
- Minimum readable size.
- Line-height expectations.
- Text resizing.
- Paragraph width.
- Contrast.
- Font fallback.
- Dynamic text support.

---

# SECTION 7 — SPACING AND DIMENSION SYSTEM

## 7. Spacing Foundation

### 7.1 Spacing Philosophy

Define the spacing approach, including the base unit and scale progression.

### 7.2 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| Space-0 | [Value] | No spacing |
| Space-1 | [Value] | Minimal spacing |
| Space-2 | [Value] | Tight spacing |
| Space-3 | [Value] | Compact spacing |
| Space-4 | [Value] | Standard spacing |
| Space-5 | [Value] | Medium spacing |
| Space-6 | [Value] | Section spacing |
| Space-7 | [Value] | Large spacing |
| Space-8 | [Value] | Extra-large spacing |
| Space-9 | [Value] | Major layout spacing |

### 7.3 Spacing Categories

Define:
- Internal component padding.
- Component gaps.
- Form field spacing.
- Card padding.
- Section spacing.
- Page margins.
- Navigation spacing.
- Grid gaps.
- Modal spacing.

### 7.4 Sizing System

Define standard:
- Widths.
- Heights.
- Minimum sizes.
- Maximum sizes.
- Icon dimensions.
- Control dimensions.
- Container dimensions.

### 7.5 Control Sizes

Establish sizes for:
- Buttons.
- Inputs.
- Selects.
- Checkboxes.
- Radio buttons.
- Switches.
- Tabs.
- Icon buttons.

### 7.6 Layout Dimensions

Define:
- Page width.
- Content width.
- Sidebar width.
- Header height.
- Navigation width.
- Modal width.
- Drawer width.
- Maximum content width.

### 7.7 Density Modes

Where relevant, define:
- Compact.
- Comfortable.
- Spacious.

Specify which component and layout dimensions change between modes.

---

# SECTION 8 — BORDERS, RADII, SHADOWS AND ELEVATION

## 8. Shape System

### 8.1 Border System

Define border widths and styles.

### 8.2 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| Radius None | [Value] | Sharp edges |
| Radius XS | [Value] | Small elements |
| Radius SM | [Value] | Inputs |
| Radius MD | [Value] | Buttons and cards |
| Radius LG | [Value] | Panels |
| Radius XL | [Value] | Dialogs |
| Radius Full | [Value] | Pills and avatars |

### 8.3 Shadow System

Define elevation levels.

| Token | Shadow Value | Usage |
|---|---|---|
| Shadow XS | [Value] | Subtle separation |
| Shadow SM | [Value] | Controls |
| Shadow MD | [Value] | Cards |
| Shadow LG | [Value] | Overlays |
| Shadow XL | [Value] | Dialogs |

### 8.4 Elevation Levels

Define the relative stacking and visual elevation of surfaces.

### 8.5 Outline System

Specify:
- Default outlines.
- Focus outlines.
- Error outlines.
- Selected outlines.
- Decorative outlines.

---

# SECTION 9 — ICONOGRAPHY AND VISUAL ASSETS

## 9. Icon System

### 9.1 Iconography Philosophy

Define the visual style of icons.

Possible styles:
- Outline.
- Filled.
- Duotone.
- Solid.
- Rounded.
- Geometric.

### 9.2 Icon Library

Define the primary icon library and its license or usage constraints.

### 9.3 Icon Categories

Organize icons into:
- Navigation.
- Actions.
- Communication.
- Files.
- Media.
- Status.
- Business.
- System.
- Accessibility.
- Platform-specific.

### 9.4 Icon Sizing

| Token | Size | Usage |
|---|---|---|
| Icon XS | [Value] | Small indicators |
| Icon SM | [Value] | Compact controls |
| Icon MD | [Value] | Standard controls |
| Icon LG | [Value] | Major actions |
| Icon XL | [Value] | Prominent presentation |

### 9.5 Icon Usage Rules

Define:
- Alignment.
- Stroke weight.
- Fill behavior.
- Optical sizing.
- Icon and text spacing.
- Decorative versus functional icons.
- Accessible naming.

## 10. Illustrations and Imagery

### 10.1 Illustration Style

Define illustration characteristics and usage.

### 10.2 Photography Guidelines

Specify:
- Photography style.
- Image treatment.
- Cropping.
- Aspect ratios.
- Overlay behavior.
- Background usage.

### 10.3 Product Images

Define consistent presentation standards for product images and previews.

### 10.4 Empty-State Illustrations

Specify visual and messaging guidelines for empty screens.

### 10.5 Loading and Error Illustrations

Define appropriate usage for:
- Loading.
- Empty content.
- Error.
- Offline.
- Restricted access.
- Completed tasks.

### 10.6 Asset Management

Define naming, formats, dimensions, optimization, storage, and licensing expectations.

---

# SECTION 10 — LAYOUT AND GRID SYSTEM

## 11. Layout Foundation

### 11.1 Layout Philosophy

Define the product's approach to spatial organization.

### 11.2 Grid System

Specify:
- Number of columns.
- Gutter width.
- Outer margins.
- Container widths.
- Alignment.
- Breakpoint behavior.

### 11.3 Responsive Breakpoints

| Breakpoint | Width Range | Target Device | Layout Behavior |
|---|---|---|---|
| Mobile | [Range] | Mobile phones | [Behavior] |
| Tablet | [Range] | Tablets | [Behavior] |
| Laptop | [Range] | Laptops | [Behavior] |
| Desktop | [Range] | Desktop | [Behavior] |
| Wide Desktop | [Range] | Large screens | [Behavior] |

### 11.4 Container System

Define:
- Fluid containers.
- Fixed-width containers.
- Maximum-width containers.
- Full-width containers.
- Nested containers.

### 11.5 Application Shell

For applicable products specify:

- Global Header.
- Primary Sidebar.
- Secondary Sidebar.
- Main Content Area.
- Footer.
- Contextual Panel.
- Notification Area.
- Utility Navigation.

### 11.6 Layout Templates

Define common layouts:

- Dashboard Layout.
- Listing Layout.
- Detail Layout.
- Form Layout.
- Editor Layout.
- Settings Layout.
- Authentication Layout.
- Fullscreen Layout.
- Split View Layout.
- Master-Detail Layout.

### 11.7 Responsive Adaptation

Specify how layouts transform across breakpoints rather than simply shrinking.

### 11.8 Scroll Behavior

Define:
- Page scrolling.
- Nested scrolling.
- Sticky headers.
- Sticky sidebars.
- Scrollable panels.
- Infinite scrolling.
- Scroll restoration.

---

# SECTION 11 — MOTION AND ANIMATION SYSTEM

## 12. Motion Foundation

### 12.1 Motion Philosophy

Define when and why motion should be used.

### 12.2 Motion Principles

Consider:
- Purposefulness.
- Responsiveness.
- Continuity.
- Subtlety.
- Consistency.
- Performance.
- Accessibility.

### 12.3 Duration Scale

| Token | Duration | Usage |
|---|---|---|
| Motion Instant | [Value] | Immediate feedback |
| Motion Fast | [Value] | Small interactions |
| Motion Normal | [Value] | Standard transitions |
| Motion Slow | [Value] | Larger transitions |
| Motion Deliberate | [Value] | Complex transitions |

### 12.4 Easing Functions

Define applicable:
- Linear.
- Ease In.
- Ease Out.
- Ease In-Out.
- Custom curves.

### 12.5 Animation Categories

Specify:
- Entrance.
- Exit.
- State transition.
- Feedback.
- Loading.
- Navigation.
- Hover.
- Scroll.
- Gesture.
- Background animation.

### 12.6 Component Motion Specifications

For every animated component define:
- Trigger.
- Duration.
- Easing.
- Start state.
- End state.
- Interruption behavior.
- Reduced-motion alternative.

### 12.7 Reduced Motion

Define behavior when users request reduced motion.

### 12.8 Motion Performance

Define expectations for animation smoothness and resource consumption.

---

# SECTION 12 — LAYERING AND OVERLAY SYSTEM

## 13. Layer Management

### 13.1 Z-Index Scale

| Token | Value | Element |
|---|---|---|
| Z-Base | [Value] | Normal content |
| Z-Raised | [Value] | Elevated surfaces |
| Z-Sticky | [Value] | Sticky elements |
| Z-Dropdown | [Value] | Dropdown menus |
| Z-Popover | [Value] | Popovers |
| Z-Drawer | [Value] | Drawers |
| Z-Modal | [Value] | Modal dialogs |
| Z-Toast | [Value] | Notifications |
| Z-Top | [Value] | Highest-priority overlays |

### 13.2 Overlay Types

Define:
- Modal.
- Drawer.
- Dialog.
- Popover.
- Tooltip.
- Dropdown.
- Context Menu.
- Command Palette.
- Fullscreen Overlay.

### 13.3 Overlay Behavior

Specify:
- Opening.
- Closing.
- Backdrop.
- Focus handling.
- Escape behavior.
- Outside-click behavior.
- Nested overlays.
- Scroll locking.

---

# SECTION 13 — COMPONENT ARCHITECTURE

## 14. Component System Overview

### 14.1 Component Philosophy

Define the principles used to create reusable components.

### 14.2 Component Hierarchy

Use a consistent component hierarchy.

**Foundation**
- Tokens.
- Colors.
- Typography.
- Spacing.
- Icons.
- Motion.

**Primitive Components**
- Text.
- Icon.
- Divider.
- Surface.
- Container.
- Stack.
- Grid.

**Basic UI Components**
- Button.
- Input.
- Checkbox.
- Radio.
- Switch.
- Badge.
- Avatar.
- Tooltip.

**Composite Components**
- Search Input.
- Form Field.
- Dropdown Menu.
- Select.
- Date Picker.
- Tabs.
- Pagination.
- Data Table.

**Complex Components**
- Data Grid.
- Calendar.
- Rich Text Editor.
- File Manager.
- Command Palette.
- Dashboard Widget.

**Application Patterns**
- Page Header.
- Dashboard Shell.
- Authentication Layout.
- Settings Layout.
- Master-Detail Interface.

### 14.3 Component Identification

| Component ID | Component Name | Category | Description | Status |
|---|---|---|---|---|
| CMP-001 | [Component] | [Category] | [Description] | [Status] |

### 14.4 Component Classification

Classify components as:
- Primitive.
- Basic.
- Composite.
- Complex.
- Application-Specific.
- Platform-Specific.
- Third-Party.

### 14.5 Component Reusability

Define:
- Shared components.
- Product-specific components.
- Local components.
- Extension mechanisms.
- Composition rules.
- Reuse boundaries.

### 14.6 Component Naming Conventions

Define component naming and file organization standards.

### 14.7 Component Dependencies

Document dependencies between components and underlying design tokens.

---

# SECTION 14 — COMPONENT SPECIFICATION TEMPLATE

## 15. Individual Component Specification

Use this specification for every component in the library.

### 15.1 Component Identification

- Component ID.
- Component Name.
- Component Category.
- Component Description.
- Component Purpose.
- Related Design Tokens.
- Related Components.
- Supported Platforms.
- Implementation Status.

### 15.2 Component Anatomy

Identify all structural elements.

Example for a Button:
- Container.
- Label.
- Leading Icon.
- Trailing Icon.
- Loading Indicator.
- Focus Indicator.

### 15.3 Component Variants

Define applicable variants.

Example:
- Primary.
- Secondary.
- Tertiary.
- Outline.
- Ghost.
- Destructive.
- Link.

### 15.4 Component Sizes

Define:
- Extra Small.
- Small.
- Medium.
- Large.
- Extra Large.

Use only sizes that serve a clear product requirement.

### 15.5 Component States

Document:
- Default.
- Hover.
- Focus.
- Active.
- Pressed.
- Selected.
- Disabled.
- Loading.
- Error.
- Success.
- Expanded.
- Collapsed.

### 15.6 Component Properties

| Property | Type | Default | Description | Required |
|---|---|---|---|---|
| [Property] | [Type] | [Value] | [Description] | [Yes/No] |

### 15.7 Component Behavior

Describe:
- User interaction.
- Event handling.
- State changes.
- Keyboard behavior.
- Touch behavior.
- Focus behavior.
- Validation.
- Feedback.
- Error behavior.

### 15.8 Component Content

Define:
- Text requirements.
- Icon requirements.
- Image requirements.
- Maximum content.
- Truncation.
- Alignment.
- Localization behavior.

### 15.9 Component Accessibility

Define:
- Semantic role.
- Accessible name.
- Keyboard interaction.
- Focus management.
- Screen-reader behavior.
- State announcements.
- Touch target.
- Contrast requirements.

### 15.10 Responsive Behavior

Define how the component adapts to each supported screen size.

### 15.11 Component Do's and Don'ts

Document recommended usage and prohibited or discouraged usage.

### 15.12 Component Examples

Include:
- Visual example.
- Recommended usage.
- Incorrect usage.
- Interaction example.
- Relevant design token mapping.

### 15.13 Component Acceptance Criteria

Define the conditions that must be met before the component is considered complete.

---

# SECTION 15 — COMPONENT LIBRARY INVENTORY

## 16. Core Component Catalog

The agent must identify all components applicable to the product.

### 16.1 Foundation Components

- Text.
- Heading.
- Icon.
- Avatar.
- Divider.
- Spacer.
- Surface.
- Container.
- Stack.
- Grid.
- Visually Hidden.

### 16.2 Buttons and Actions

- Primary Button.
- Secondary Button.
- Tertiary Button.
- Ghost Button.
- Outline Button.
- Destructive Button.
- Icon Button.
- Floating Action Button.
- Split Button.
- Button Group.
- Loading Button.

### 16.3 Form Components

- Input.
- Textarea.
- Password Input.
- Search Input.
- Number Input.
- Email Input.
- Phone Input.
- Select.
- Multi-Select.
- Combobox.
- Checkbox.
- Radio Group.
- Switch.
- Toggle.
- Slider.
- Range Slider.
- Date Picker.
- Time Picker.
- Date Range Picker.
- File Upload.
- Form Field.
- Form Group.
- Validation Message.

### 16.4 Navigation Components

- Navigation Bar.
- Sidebar.
- Header.
- Footer.
- Breadcrumbs.
- Tabs.
- Tab Bar.
- Pagination.
- Stepper.
- Menu.
- Dropdown Menu.
- Context Menu.
- Command Palette.
- Navigation Drawer.
- Bottom Navigation.
- Tree Navigation.

### 16.5 Data Display Components

- Card.
- List.
- Data Table.
- Data Grid.
- Badge.
- Status Indicator.
- Tag.
- Tooltip.
- Popover.
- Accordion.
- Disclosure.
- Timeline.
- Progress Bar.
- Progress Ring.
- Stat Card.
- Description List.
- Code Block.
- Key-Value Display.

### 16.6 Feedback Components

- Alert.
- Banner.
- Toast.
- Snackbar.
- Inline Message.
- Dialog.
- Modal.
- Confirmation Dialog.
- Loading Spinner.
- Skeleton Loader.
- Empty State.
- Error State.
- Success State.
- Offline Indicator.

### 16.7 Overlay Components

- Modal.
- Drawer.
- Sheet.
- Popover.
- Tooltip.
- Dropdown.
- Lightbox.
- Fullscreen Dialog.

### 16.8 Media Components

- Image.
- Image Gallery.
- Video Player.
- Audio Player.
- Media Preview.
- File Preview.
- Thumbnail.
- Carousel.

### 16.9 Data Visualization Components

- Line Chart.
- Bar Chart.
- Area Chart.
- Pie Chart.
- Donut Chart.
- Scatter Plot.
- Gauge.
- Heatmap.
- Funnel Chart.
- Progress Visualization.
- Metric Card.

### 16.10 Utility Components

- Copy Button.
- Download Button.
- Upload Control.
- Search Filter.
- Sort Control.
- View Switcher.
- Bulk Action Bar.
- Selection Toolbar.
- Resizable Panel.
- Splitter.
- Keyboard Shortcut Indicator.

The agent must not automatically implement all catalog items. It should identify relevant components, required variants, and reusable opportunities from the actual product requirements.

---

# SECTION 16 — DESIGN PATTERNS AND INTERACTION PATTERNS

## 17. Reusable Design Patterns

### 17.1 Pattern Identification

Define reusable interaction and interface patterns that combine multiple components.

### 17.2 Pattern Inventory

| Pattern ID | Pattern Name | Purpose | Related Components |
|---|---|---|---|
| PAT-001 | [Pattern] | [Purpose] | [Components] |

### 17.3 Common Patterns

Consider:
- Authentication Flow.
- Registration Flow.
- Onboarding.
- Search and Filter.
- Create and Edit.
- List and Detail.
- Master-Detail.
- Multi-Step Form.
- Approval Workflow.
- Bulk Actions.
- File Upload.
- Global Notifications.
- Dashboard Filtering.
- Settings Management.
- Permission Management.
- Data Import and Export.
- Confirmation and Destructive Actions.

### 17.4 Interaction Pattern Specification

For each pattern, define:
- Pattern purpose.
- User context.
- Components involved.
- Entry point.
- Interaction sequence.
- States.
- Feedback.
- Error handling.
- Accessibility.
- Responsive behavior.

### 17.5 Interaction Standards

Establish consistent behavior for:
- Click.
- Hover.
- Focus.
- Double-click.
- Long press.
- Drag and drop.
- Keyboard shortcuts.
- Touch gestures.
- Context actions.
- Selection.
- Multi-selection.

---

# SECTION 17 — PAGE AND SCREEN TEMPLATES

## 18. Page Architecture

### 18.1 Page Template Inventory

| Template ID | Template Name | Purpose | Application Type |
|---|---|---|---|
| PAGE-001 | Dashboard | Overview and metrics | [Type] |
| PAGE-002 | Listing | Display records | [Type] |
| PAGE-003 | Details | Detailed information | [Type] |
| PAGE-004 | Form | Data entry | [Type] |

### 18.2 Standard Page Templates

Consider:

**Dashboard**
- Page Header.
- Summary Metrics.
- Charts.
- Recent Activity.
- Quick Actions.
- Filters.

**Listing Page**
- Page Header.
- Search.
- Filters.
- Sorting.
- View Modes.
- Data Table or Cards.
- Pagination.
- Bulk Actions.

**Detail Page**
- Page Header.
- Primary Information.
- Metadata.
- Actions.
- Tabs.
- Related Records.
- Activity History.

**Form Page**
- Page Header.
- Form Sections.
- Input Groups.
- Validation.
- Save and Cancel Actions.
- Progress Indicator.

**Settings Page**
- Settings Navigation.
- Configuration Sections.
- Preferences.
- Save Actions.
- Reset Actions.

**Editor Page**
- Toolbar.
- Workspace.
- Canvas or Editor.
- Contextual Panels.
- Properties.
- Save State.

**Authentication Pages**
- Login.
- Registration.
- Password Recovery.
- Account Verification.
- MFA.

### 18.3 Page Template Rules

Define:
- Header structure.
- Page width.
- Content hierarchy.
- Sidebar requirements.
- Action placement.
- Responsive behavior.
- Empty states.
- Loading states.
- Error states.

### 18.4 Screen-to-Component Mapping

Map each PRD screen to the design system components and patterns it requires.

---

# SECTION 18 — APPLICATION SHELL AND NAVIGATION

## 19. Application Shell

### 19.1 Shell Structure

Define the global application interface.

### 19.2 Header

Specify:
- Logo.
- Product Navigation.
- Search.
- Notifications.
- User Profile.
- Utility Actions.
- Workspace Selector.

### 19.3 Sidebar

Specify:
- Width.
- Collapsed State.
- Expanded State.
- Navigation Items.
- Grouping.
- Active Item.
- Hover State.
- Nested Navigation.

### 19.4 Main Content Region

Define:
- Page Header.
- Breadcrumbs.
- Content Container.
- Content Spacing.
- Toolbars.
- Contextual Panels.

### 19.5 Footer

Define whether a footer is required and what it contains.

### 19.6 Navigation Behavior

Specify:
- Active navigation.
- Route changes.
- Nested items.
- Collapsible menus.
- Contextual navigation.
- Keyboard navigation.
- Mobile navigation transformations.

---

# SECTION 19 — CONTENT DESIGN AND MICROCOPY

## 20. Content Design

### 20.1 Content Philosophy

Define the principles governing textual content throughout the product.

### 20.2 Writing Style

Specify:
- Tone.
- Formality.
- Clarity.
- Terminology.
- Sentence structure.
- Language conventions.

### 20.3 Microcopy Guidelines

Define standards for:
- Labels.
- Buttons.
- Tooltips.
- Placeholders.
- Helper Text.
- Confirmation Messages.
- Error Messages.
- Success Messages.
- Warning Messages.

### 20.4 Error Message Guidelines

Every error message should communicate:
- What happened.
- Why it happened, when known.
- What the user can do next.

### 20.5 Empty-State Guidelines

Define:
- Heading.
- Explanation.
- Illustration, if required.
- Recommended action.
- Secondary action.

### 20.6 Localization

Define:
- Supported languages.
- Text expansion handling.
- Translation requirements.
- Date formatting.
- Number formatting.
- Currency.
- Time zones.
- Right-to-left language support, where required.

### 20.7 Terminology Dictionary

| Term ID | Term | Definition | Preferred Usage | Avoid |
|---|---|---|---|---|
| TERM-001 | [Term] | [Definition] | [Usage] | [Alternative] |

---

# SECTION 20 — DATA VISUALIZATION SYSTEM

## 21. Chart and Visualization Design

### 21.1 Visualization Principles

Define standards for:
- Accuracy.
- Readability.
- Comparison.
- Hierarchy.
- Accessibility.
- Consistency.

### 21.2 Chart Types

Identify appropriate visualization types for the product's data.

### 21.3 Chart Color System

Define:
- Series colors.
- Positive and negative values.
- Threshold indicators.
- Highlighting.
- Selected states.
- Missing data.

### 21.4 Chart Components

Specify:
- Title.
- Subtitle.
- Axis.
- Legend.
- Grid Lines.
- Tooltip.
- Labels.
- Data Points.
- Comparison Indicators.

### 21.5 Numeric Formatting

Define:
- Decimal precision.
- Thousands separators.
- Currency.
- Percentages.
- Negative values.
- Large number abbreviations.
- Date and time formatting.

### 21.6 Chart Accessibility

Define:
- Text alternatives.
- Data tables.
- Color-independent differentiation.
- Keyboard accessibility.
- Screen-reader support.

### 21.7 Data Density

Define how charts and tables handle large datasets and constrained spaces.

---

# SECTION 21 — RESPONSIVE AND PLATFORM-SPECIFIC DESIGN

## 22. Responsive Design

### 22.1 Responsive Philosophy

Define the product's responsive strategy.

### 22.2 Responsive Layout Rules

Specify:
- Fluid layouts.
- Container behavior.
- Breakpoint transformations.
- Content priority.
- Component adaptation.
- Navigation transformations.

### 22.3 Mobile Interaction

Define:
- Touch targets.
- Gestures.
- Safe areas.
- Keyboard behavior.
- Bottom navigation.
- Native platform expectations.

### 22.4 Tablet Adaptation

Define:
- Navigation.
- Grid behavior.
- Split layouts.
- Touch interactions.
- Content density.

### 22.5 Desktop Adaptation

Define:
- Multi-column layouts.
- Hover interactions.
- Sidebar behavior.
- Keyboard shortcuts.
- Dense data interfaces.

## 23. Platform-Specific Design

For each supported platform define:

- Platform.
- Interaction conventions.
- Typography.
- Component adaptations.
- Navigation patterns.
- System integrations.
- Accessibility.
- Responsive behavior.
- Supported states.

### 23.1 Cross-Platform Consistency

Establish which design properties must remain consistent and which may adapt to native platform conventions.

---

# SECTION 22 — THEME AND CUSTOMIZATION SYSTEM

## 24. Theming Architecture

### 24.1 Theme Strategy

Define supported themes.

Examples:
- Light Theme.
- Dark Theme.
- System Theme.
- High Contrast Theme.
- Custom Brand Theme.

### 24.2 Theme Token Mapping

Ensure semantic tokens map correctly to each theme.

### 24.3 Theme Switching

Specify:
- User preference.
- System preference detection.
- Default theme.
- Persistence.
- Transition behavior.

### 24.4 Custom Branding

Where required, define:
- Brand color overrides.
- Logo overrides.
- Typography overrides.
- Surface customization.
- Tenant-level branding.
- Theme restrictions.

### 24.5 Customization Boundaries

Define which tokens are customizable and which must remain fixed to preserve accessibility and interface consistency.

---

# SECTION 23 — ACCESSIBILITY AND INCLUSIVE DESIGN

## 25. Accessibility Requirements

### 25.1 Accessibility Target

Specify the applicable accessibility standard and conformance target.

### 25.2 Visual Accessibility

Consider:
- Text contrast.
- Non-text contrast.
- Text resizing.
- Color-independent indicators.
- Focus visibility.
- Reduced motion.

### 25.3 Keyboard Accessibility

Define:
- Tab navigation.
- Focus order.
- Focus trapping.
- Keyboard shortcuts.
- Escape behavior.
- Keyboard alternatives.

### 25.4 Screen Reader Support

Define:
- Semantic structure.
- Accessible names.
- Accessible descriptions.
- State announcements.
- Dynamic content announcements.
- Landmark navigation.

### 25.5 Cognitive Accessibility

Consider:
- Clear instructions.
- Consistent patterns.
- Predictable interactions.
- Error prevention.
- Understandable language.
- Reduced unnecessary complexity.

### 25.6 Motor Accessibility

Define:
- Touch target sizes.
- Pointer interaction alternatives.
- Keyboard support.
- Gesture alternatives.
- Timing considerations.

### 25.7 Accessibility Testing

Specify manual and automated accessibility validation procedures.

---

# SECTION 24 — DESIGN IMPLEMENTATION SPECIFICATION

## 26. Design-to-Code Architecture

### 26.1 Implementation Overview

Identify how the design system will be implemented in the target frontend and mobile technologies.

### 26.2 Technology Mapping

| Design System Layer | Technology | Implementation |
|---|---|---|
| Design Tokens | [Technology] | [Implementation] |
| Typography | [Technology] | [Implementation] |
| Components | [Technology] | [Implementation] |
| Icons | [Technology] | [Implementation] |
| Themes | [Technology] | [Implementation] |
| Layouts | [Technology] | [Implementation] |
| Animations | [Technology] | [Implementation] |

### 26.3 Token Implementation

Define:
- Token file structure.
- Naming conventions.
- Semantic mappings.
- Theme variables.
- Build transformations.
- Token distribution.

### 26.4 Component Implementation

Define:
- Component directory.
- Component naming.
- Variants.
- Props.
- Type definitions.
- Composition.
- State management.
- Styling approach.
- Testing.

### 26.5 Component API Standards

Specify:
- Component interfaces.
- Property naming.
- Event naming.
- Default values.
- Controlled versus uncontrolled behavior.
- Extension mechanisms.
- Deprecation strategy.

### 26.6 Styling Standards

Where applicable, define:
- CSS architecture.
- Utility classes.
- CSS Modules.
- CSS Variables.
- Tailwind conventions.
- Theme classes.
- Responsive utilities.
- State selectors.

Select implementation methods based on the actual technical stack.

### 26.7 Framework Integration

Document relevant integration requirements for:
- React.
- Next.js.
- Vue.
- Angular.
- Flutter.
- React Native.
- Other selected frameworks.

### 26.8 Design Tool Integration

Define:
- Design file organization.
- Component naming.
- Design tokens.
- Variants.
- Shared libraries.
- Documentation.
- Handoff annotations.

### 26.9 Design-to-Code Consistency

Establish traceability between design components, tokens, code components, and documentation.

---

# SECTION 25 — DESIGN DOCUMENTATION AND HANDOFF

## 27. Design Documentation

### 27.1 Component Documentation

Every component must have documentation containing:
- Purpose.
- Anatomy.
- Variants.
- Properties.
- States.
- Behavior.
- Accessibility.
- Responsive rules.
- Usage examples.
- Do's and Don'ts.

### 27.2 Pattern Documentation

Document composite patterns and reusable workflows.

### 27.3 Design Guidelines

Document:
- Layout principles.
- Typography.
- Color usage.
- Spacing.
- Interaction.
- Responsive behavior.
- Accessibility.

### 27.4 Designer Handoff

Specify deliverables:
- Design files.
- Component references.
- Design tokens.
- Interaction prototypes.
- Responsive layouts.
- State specifications.
- Assets.
- Redlines or measurements, where needed.

### 27.5 Developer Handoff

Specify:
- Component mapping.
- Token references.
- Props documentation.
- Interaction behavior.
- Accessibility notes.
- Responsive behavior.
- State specifications.
- Asset locations.

### 27.6 Documentation Platform

Identify the platform used for design system documentation.

Examples:
- Storybook.
- Zeroheight.
- Figma.
- Docusaurus.
- Custom Documentation Portal.

---

# SECTION 26 — QUALITY ASSURANCE AND DESIGN VALIDATION

## 28. Design Quality Assurance

### 28.1 Design Validation Objectives

Ensure visual consistency, functional consistency, responsiveness, and accessibility.

### 28.2 Visual Testing

Include:
- Component comparison.
- Layout validation.
- Typography validation.
- Color validation.
- Spacing validation.
- Responsive screenshots.

### 28.3 Interaction Testing

Validate:
- Click behavior.
- Keyboard behavior.
- Focus states.
- Hover states.
- Disabled states.
- Loading states.
- Error handling.
- Navigation.

### 28.4 Accessibility Validation

Test relevant accessibility requirements.

### 28.5 Cross-Browser Testing

Identify supported browsers and test configurations.

### 28.6 Cross-Device Testing

Validate across target device categories and screen sizes.

### 28.7 Design Consistency Audit

Identify:
- Duplicate components.
- Inconsistent styles.
- Hardcoded values.
- Unapproved variations.
- Invalid token usage.
- Accessibility violations.

### 28.8 Component Acceptance Criteria

A component is considered complete when:
- Its anatomy is documented.
- All required variants are implemented.
- States are implemented.
- Token usage is verified.
- Keyboard behavior is verified.
- Accessibility requirements are satisfied.
- Responsive behavior is validated.
- Usage documentation is complete.
- Tests pass.

---

# SECTION 27 — DESIGN SYSTEM GOVERNANCE

## 29. Ownership and Governance

### 29.1 Design System Ownership

Define:
- Design system owner.
- Design contributors.
- Component maintainers.
- Development maintainers.
- Reviewers.
- Approvers.

### 29.2 Contribution Guidelines

Define how new components, patterns, and tokens are proposed and reviewed.

### 29.3 Design Review Process

Specify:
- Submission.
- Review.
- Accessibility validation.
- Approval.
- Implementation.
- Documentation.
- Publication.

### 29.4 Component Lifecycle

Define:
- Proposed.
- In Design.
- In Development.
- Experimental.
- Beta.
- Stable.
- Deprecated.
- Removed.

### 29.5 Change Management

Document how design system changes are requested, evaluated, approved, and released.

### 29.6 Versioning

Use a consistent versioning scheme.

For example:
- Major: Breaking changes.
- Minor: Backward-compatible additions.
- Patch: Fixes and non-breaking refinements.

### 29.7 Deprecation Policy

Define migration periods, replacement recommendations, and removal procedures.

### 29.8 Design System Release Notes

Maintain a record of:
- Added components.
- Modified components.
- Updated tokens.
- Fixed issues.
- Deprecated features.
- Breaking changes.

---

# SECTION 28 — FUTURE ENHANCEMENTS

## 30. Design System Roadmap

### 30.1 Planned Enhancements

Identify potential additions.

Examples:
- Additional component families.
- Advanced charting.
- Advanced theming.
- Component animation library.
- Expanded accessibility.
- Cross-product components.
- Design automation.
- AI-generated component documentation.

### 30.2 Design System Maturity

Assess the current maturity of:
- Foundations.
- Tokens.
- Components.
- Patterns.
- Documentation.
- Accessibility.
- Testing.
- Governance.

### 30.3 Technical Debt

Document inconsistencies, duplicated components, deprecated tokens, and implementation gaps.

---

# SECTION 29 — DESIGN SYSTEM REGISTERS

## 31. Master Token Register

| Token ID | Token Name | Value | Category | Theme | Status |
|---|---|---|---|---|---|
| TOK-001 | [Token] | [Value] | [Category] | [Theme] | [Status] |

## 32. Master Component Register

| Component ID | Component | Category | Variants | Status |
|---|---|---|---|---|
| CMP-001 | [Component] | [Category] | [Variants] | [Status] |

## 33. Master Pattern Register

| Pattern ID | Pattern | Purpose | Related Components | Status |
|---|---|---|---|---|
| PAT-001 | [Pattern] | [Purpose] | [Components] | [Status] |

## 34. Design Decision Register

| Decision ID | Decision | Alternatives | Selected Option | Rationale | Approval |
|---|---|---|---|---|---|
| DDEC-001 | [Decision] | [Options] | [Option] | [Reason] | [Status] |

## 35. Design Issue Register

| Issue ID | Description | Category | Severity | Resolution | Status |
|---|---|---|---|---|---|
| DISS-001 | [Issue] | [Category] | [Severity] | [Resolution] | [Status] |

---

# SECTION 30 — FINAL DESIGN SYSTEM SUMMARY

## 36. Executive Design Summary

Generate a concise summary describing:

- Design philosophy.
- Visual direction.
- Brand identity.
- Color system.
- Typography.
- Spacing and layout.
- Component architecture.
- Interaction patterns.
- Responsive behavior.
- Accessibility.
- Theme support.
- Technology implementation.
- Governance.
- Major design decisions.

## 37. Design System Readiness Assessment

| Category | Status | Remarks |
|---|---|---|
| Design Philosophy | [Status] | [Remarks] |
| Brand Identity | [Status] | [Remarks] |
| Design Tokens | [Status] | [Remarks] |
| Color System | [Status] | [Remarks] |
| Typography | [Status] | [Remarks] |
| Spacing and Sizing | [Status] | [Remarks] |
| Layout System | [Status] | [Remarks] |
| Iconography | [Status] | [Remarks] |
| Motion | [Status] | [Remarks] |
| Component Architecture | [Status] | [Remarks] |
| Component Library | [Status] | [Remarks] |
| Interaction Patterns | [Status] | [Remarks] |
| Page Templates | [Status] | [Remarks] |
| Responsive Design | [Status] | [Remarks] |
| Accessibility | [Status] | [Remarks] |
| Design-to-Code | [Status] | [Remarks] |
| Documentation | [Status] | [Remarks] |
| Governance | [Status] | [Remarks] |

## 38. Outstanding Design Decisions

Consolidate all outstanding design questions and approval requirements.

## 39. Final Design Recommendations

Provide recommendations concerning:
- Visual direction.
- Token architecture.
- Core components.
- Component implementation priorities.
- Accessibility.
- Responsive design.
- Theme strategy.
- Design tool organization.
- Development handoff.
- Future design system evolution.

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM

| Item | Prefix | Example |
|---|---|---|
| Design System | DS | DS-001 |
| Product | PROD | PROD-001 |
| Reference | REF | REF-001 |
| Token | TOK | TOK-001 |
| Component | CMP | CMP-001 |
| Pattern | PAT | PAT-001 |
| Page Template | PAGE | PAGE-001 |
| Icon | ICON | ICON-001 |
| Asset | ASSET | ASSET-001 |
| Decision | DDEC | DDEC-001 |
| Issue | DISS | DISS-001 |

Maintain stable identifiers when reorganizing the document.

---

# APPENDIX B — DESIGN SYSTEM ENUMERATIONS

## Design Status
- Proposed.
- Draft.
- Under Review.
- Approved.
- In Design.
- In Development.
- Experimental.
- Beta.
- Stable.
- Deprecated.
- Removed.

## Component Status
- Not Started.
- Designed.
- In Development.
- Under Review.
- Tested.
- Published.
- Deprecated.

## Design Source
- User-Confirmed.
- Brand-Confirmed.
- PRD-Derived.
- Design-Recommended.
- Assumed.
- Pending Approval.

## Theme
- Light.
- Dark.
- System.
- High Contrast.
- Custom.

## Platform
- Web.
- Desktop.
- Mobile.
- Tablet.
- Cross-Platform.

---

# APPENDIX C — FINAL DESIGN SYSTEM VALIDATION

## Product Understanding
- [ ] Product requirements have been analyzed.
- [ ] Target users have been identified.
- [ ] Supported platforms have been established.
- [ ] Brand requirements have been reviewed.
- [ ] Design scope has been defined.

## Visual Foundation
- [ ] Design principles are established.
- [ ] Brand identity is documented.
- [ ] Color system is defined.
- [ ] Typography is defined.
- [ ] Spacing and sizing are established.
- [ ] Borders and elevation are defined.
- [ ] Iconography is defined.
- [ ] Motion standards are documented.

## Component Architecture
- [ ] Component hierarchy is established.
- [ ] Required components are identified.
- [ ] Component variants are specified.
- [ ] Component states are specified.
- [ ] Component behavior is documented.
- [ ] Accessibility requirements are defined.
- [ ] Reusability boundaries are established.

## Interaction and Layout
- [ ] Navigation patterns are documented.
- [ ] Page templates are defined.
- [ ] Interaction patterns are documented.
- [ ] Responsive behavior is specified.
- [ ] Application shell is defined where applicable.
- [ ] Overlay and layering behavior is documented.

## Accessibility and Quality
- [ ] Accessibility standard is identified.
- [ ] Contrast is addressed.
- [ ] Keyboard interaction is addressed.
- [ ] Screen-reader support is considered.
- [ ] Reduced motion is considered.
- [ ] Visual QA standards are defined.

## Technical Implementation
- [ ] Design token architecture is defined.
- [ ] Token naming convention is established.
- [ ] Component implementation standards are defined.
- [ ] Design-to-code mapping is documented.
- [ ] Framework integration is considered.
- [ ] Theme implementation is documented.
- [ ] Documentation standards are established.

## Governance
- [ ] Component ownership is defined.
- [ ] Contribution process is documented.
- [ ] Versioning strategy is established.
- [ ] Change management is defined.
- [ ] Deprecation policy is documented.

## Final Quality
- [ ] No unsupported brand decisions are presented as confirmed.
- [ ] No unnecessary components have been prescribed.
- [ ] Design tokens are internally consistent.
- [ ] Component specifications are sufficiently detailed.
- [ ] Design decisions are traceable.
- [ ] The design system is suitable for implementation.
- [ ] Outstanding decisions are documented.

---

# END OF DESIGN SYSTEM DOCUMENTATION
`;

/**
 * Deterministic generator for Design System Documentation adhering to the template above
 */
export function generateDeterministicDesigns(
  projectName: string,
  fd: SRSFormData,
  dateStr: string
): string {
  const industry = (fd['project_overview']?.['industry'] as string) || 'Technology & Software';
  const frontend = (fd['technical_requirements']?.['frontend_stack'] as string) || 'React 19 / TypeScript / Tailwind CSS';

  return `# DESIGN SYSTEM DOCUMENTATION
## AI-Generated Design System Specification

**Document Type:** Design System Specification  
**Document Version:** 1.0  
**Project Name:** ${projectName}  
**Product Name:** ${projectName} Platform  
**Design System Name:** Agape Helix UI  
**Document Status:** Approved  
**Prepared By:** AI Design System Architect Agent (SpecAgent)  
**Design Owner:** Principal UI/UX Architect  
**Date Created:** ${dateStr}  
**Last Updated:** ${dateStr}  
**Target Release:** v1.0.0

---

# SECTION 1 — DESIGN SYSTEM OVERVIEW

## 1. Design System Identification

### 1.1 Design System Information

| Field | Details |
|---|---|
| Design System Name | Agape Helix UI |
| Design System ID | DS-${projectName.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'CORE'} |
| Product | ${projectName} |
| Design System Version | 1.0.0 |
| Design System Type | Product-Specific Design System |
| Supported Platforms | Web (Desktop, Tablet, Mobile Responsive) |
| Design Owner | Staff Product Designer |
| Implementation Framework | ${frontend} |
| Component Library | Custom Tailwind CSS Preset + Headless Radix Primitives |
| Design Tool | Figma Tokens Studio |
| Theme Support | Dark Mode (Default) & Light Mode with System Auto-detection |
| Accessibility Target | WCAG 2.1 Level AA Compliant |
| Status | Approved |

### 1.2 Design System Purpose
Agape Helix UI provides an authoritative design token foundation, accessible component library, and consistent interaction guidelines for ${projectName}, ensuring high developer velocity and interface polish.

### 1.3 Design System Vision
Deliver a seamless, high-contrast, keyboard-first user experience that feels precise, responsive, and fatigue-free during long operational shifts.

---

# SECTION 2 — DESIGN PHILOSOPHY AND PRINCIPLES

## 2. Design Philosophy

### 2.1 Visual Personality
- **Technical & Purposeful:** Clear visual hierarchy with zero unnecessary ornamentation.
- **High-Density & Readable:** Dense data layouts with strict 8px spatial grid alignment.
- **Responsive & Optimistic:** Instant visual feedback with optimistic UI transitions.

### 2.2 Design Principles
1. **Consistency:** Single source of truth for all color, type, and spacing tokens.
2. **Clarity:** Immediate state differentiation (Loading, Empty, Success, Error).
3. **Accessibility First:** High contrast (minimum 4.5:1 text ratio) and full keyboard navigability.
4. **Predictability:** Standardized modal, drawer, and table interaction mechanics.

---

# SECTION 4 — DESIGN TOKEN ARCHITECTURE

## 4. Design Token System

### 4.1 Token Layers
- **Layer 1: Primitive Tokens** (Raw values: \`slate-950\`, \`indigo-500\`, \`spacing-4\`, \`radius-md\`)
- **Layer 2: Semantic Tokens** (\`color.background.primary\`, \`color.text.secondary\`, \`spacing.gap.component\`)
- **Layer 3: Component Tokens** (\`button.primary.bg\`, \`table.header.bg\`, \`input.border.focus\`)

### 4.2 Token Naming Convention
\`category.property.variant.state\` (e.g., \`color.surface.raised.hover\`)

---

# SECTION 5 — COLOR SYSTEM

## 5. Color Architecture

### 5.1 Semantic Color Mapping

| Semantic Token | Light Theme | Dark Theme | Purpose |
|---|---|---|---|
| \`color.background.primary\` | \`#f8fafc\` (Slate 50) | \`#090d16\` (Deep Ink) | Main application canvas |
| \`color.background.surface\` | \`#ffffff\` (Pure White) | \`#121826\` (Box Surface) | Cards, modals, sidebars |
| \`color.border.default\` | \`#e2e8f0\` (Slate 200) | \`#1e293b\` (Slate 800) | Card boundaries, dividers |
| \`color.text.primary\` | \`#0f172a\` (Slate 900) | \`#f1f5f9\` (Slate 100) | High-emphasis headings, data |
| \`color.text.secondary\` | \`#64748b\` (Slate 500) | \`#94a3b8\` (Slate 400) | Labels, descriptions, meta |
| \`color.accent.primary\` | \`#4f46e5\` (Indigo 600) | \`#6366f1\` (Indigo 500) | CTAs, active pills, links |
| \`color.accent.cyan\` | \`#0891b2\` (Cyan 600) | \`#06b6d4\` (Cyan 500) | Telemetry, stats, badges |
| \`color.status.success\` | \`#16a34a\` (Green 600) | \`#22c55e\` (Green 500) | Completed state, 200 OK |
| \`color.status.error\` | \`#dc2626\` (Red 600) | \`#ef4444\` (Red 500) | Error banners, destructive actions |

---

# SECTION 6 — TYPOGRAPHY SYSTEM

## 6. Typography Foundation

### 6.1 Font Families
- **Display Headings:** \`Space Grotesk\`, sans-serif (Weights: 600, 700)
- **Body & UI Text:** \`Inter\`, system-ui, sans-serif (Weights: 400, 500, 600)
- **Code & Telemetry:** \`JetBrains Mono\`, monospace (Weight: 400, 500)

### 6.2 Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| \`type.display.xl\` | 36px (2.25rem) | 700 | 44px | -0.02em | Hero titles, landing headers |
| \`type.heading.lg\` | 24px (1.5rem) | 600 | 32px | -0.01em | Dashboard page headers |
| \`type.heading.md\` | 18px (1.125rem)| 600 | 26px | -0.005em| Section titles, card headers |
| \`type.body.md\` | 14px (0.875rem)| 400 | 20px | 0 | Standard table cells, form labels |
| \`type.body.sm\` | 12px (0.75rem) | 400 | 16px | 0.01em | Helper captions, timestamp tags |
| \`type.code.sm\` | 12px (0.75rem) | 400 | 16px | 0 | API endpoints, UUIDs, DDL |

---

# SECTION 7 — SPACING AND DIMENSION SYSTEM

## 7. Spacing Foundation
Base unit: **4px / 8px grid system**

| Token | Value | Tailwind Class | Usage |
|---|---|---|---|
| \`space.1\` | 4px | \`p-1\` / \`gap-1\` | Icon-text spacing, tight gaps |
| \`space.2\` | 8px | \`p-2\` / \`gap-2\` | Input inner padding, badge margins |
| \`space.3\` | 12px | \`p-3\` / \`gap-3\` | Card header padding, table cell padding |
| \`space.4\` | 16px | \`p-4\` / \`gap-4\` | Standard card body padding, form row gap |
| \`space.6\` | 24px | \`p-6\` / \`gap-6\` | Modal margins, dashboard grid gaps |
| \`space.8\` | 32px | \`p-8\` / \`gap-8\` | Page container padding, section dividers |

---

# SECTION 8 — BORDERS, RADII, SHADOWS AND ELEVATION

## 8. Shape System

### 8.1 Border Radius
- \`radius.xs\`: \`2px\` (Tags, status pips)
- \`radius.sm\`: \`4px\` (Inputs, tooltips, select dropdowns)
- \`radius.md\`: \`6px\` (Buttons, table container borders)
- \`radius.lg\`: \`8px\` (Cards, modals, flyout drawers)
- \`radius.full\`: \`9999px\` (Avatars, pills, circular action buttons)

### 8.2 Elevation & Shadows
- \`shadow.xs\`: \`0 1px 2px rgba(0,0,0,0.25)\` (Subtle boundary elevation)
- \`shadow.md\`: \`0 4px 6px -1px rgba(0,0,0,0.3)\` (Floating cards, dropdowns)
- \`shadow.xl\`: \`0 20px 25px -5px rgba(0,0,0,0.5)\` (Modals, command palettes)

---

# SECTION 10 — LAYOUT AND GRID SYSTEM

## 11. Layout Foundation

### 11.1 Application Shell Hierarchy
\`\`\`
+---------------------------------------------------------------+
| Global Top Header (Logo, Search, Tenant Switcher, Profile)   |
+---------------------------------------------------------------+
| Primary Sidebar | Breadcrumbs & Page Action Header            |
| (64px / 240px)  |---------------------------------------------|
|                 | Main Content Region (Scrollable Data Grid)  |
|                 | - Filter Drawer / Metrics Strip             |
|                 | - Virtualized Record Table                  |
+---------------------------------------------------------------+
\`\`\`

### 11.2 Responsive Breakpoints
- **Mobile (<640px):** Single column, bottom navigation bar, collapsed tables.
- **Tablet (640px - 1024px):** Collapsible 64px icon sidebar, responsive 2-column dashboard.
- **Desktop (>1024px):** 240px persistent sidebar, multi-column data grid with filter drawer.

---

# SECTION 15 — COMPONENT LIBRARY INVENTORY

## 16. Component Specifications

### 16.1 CMP-001: Button
- **Variants:** Primary (Indigo), Secondary (Slate outline), Ghost (Transparent), Destructive (Red).
- **Sizes:** Small (\`h-8 px-3 text-xs\`), Medium (\`h-10 px-4 text-sm\`), Large (\`h-12 px-6 text-base\`).
- **States:** Default, Hover, Focus-Visible (\`ring-2 ring-indigo-500\`), Disabled (\`opacity-50 pointer-events-none\`), Loading (Spinner icon).

### 16.2 CMP-002: Form Input Field
- **Anatomy:** Label, Input Container, Optional Leading/Trailing Icon, Error Message, Helper Text.
- **States:** Default (\`border-slate-800 bg-slate-900\`), Focus (\`border-indigo-500 ring-1 ring-indigo-500\`), Error (\`border-red-500\`).

### 16.3 CMP-003: Virtualized Data Table
- **Anatomy:** Header row with sorting arrows, selectable checkboxes, sticky column headers, virtual scroll wrapper, pagination bar.
- **Density:** Compact (32px row height), Normal (44px row height).

---

# SECTION 18 — APPLICATION ROUTES & NAVIGATION MAP

## 19. Application Route Table

| Path | Screen Name | Layout Template | Access Level | Description |
|---|---|---|---|---|
| \`/\` | Landing | Marketing Shell | Public | Value proposition, feature showcase, pricing |
| \`/login\` | Sign In | Auth Minimal | Public | Multi-tenant credentials authentication |
| \`/dashboard\` | Executive Overview | App Shell | Authenticated | Live telemetry, KPI cards, activity feed |
| \`/records\` | Record Explorer | App Shell | Authenticated | Virtualized data table with filter drawer |
| \`/audit\` | Compliance Audit | App Shell | Admin Only | Immutable event log with JSON state diff |
| \`/settings\` | Workspace Settings | App Shell | Admin Only | Tenant configurations, team invites, API keys |

---

# SECTION 24 — DESIGN IMPLEMENTATION SPECIFICATION

## 26. Technology Mapping

| Design System Layer | Technology | Implementation Detail |
|---|---|---|
| Design Tokens | CSS Custom Properties | \`--bg-ink: #090d16;\`, \`--color-accent: #6366f1;\` |
| Utility Classes | Tailwind CSS | Extended in \`tailwind.config.js\` with custom token colors |
| Component Primitives | React 19 + Radix UI | Accessible headless primitives for Dialog, Dropdown, Tabs |
| Icons | Lucide React | 16px, 20px, and 24px stroke-width 1.75 |

---

# APPENDIX A — STANDARD IDENTIFICATION SYSTEM
- Tokens: \`TOK-001\`
- Components: \`CMP-001\`
- Patterns: \`PAT-001\`
- Page Templates: \`PAGE-001\`
- Design Decisions: \`DDEC-001\`

---

# APPENDIX C — FINAL DESIGN SYSTEM VALIDATION
- [x] Complete design tokens defined for Colors, Typography, Spacing, and Elevation.
- [x] Application route table mapped with layout templates and access permissions.
- [x] Dark mode default palette validated for WCAG 2.1 AA text contrast.
- [x] Component library inventory verified for React 19 and Tailwind CSS implementation.

---

# END OF DESIGN SYSTEM DOCUMENTATION
`;
}
