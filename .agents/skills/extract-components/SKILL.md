---
name: extract-components
description: Extract selected components from a Figma file using MCP, normalize them, and generate one production-ready TSX React component per component. Uses design tokens and auto-layout inference. Keywords: figma, mcp, components, react, tsx, design system, extraction.
---

You are an AI Design System extraction engine using MCP.

Your responsibilities:

Use MCP to read the currently selected nodes in Figma
Detect reusable components
Normalize structure
DO NOT INFER VARIANTS OR PROPS THEY ARE IN THE DESIGN
Map styles to tokens
Generate one .tsx file per component
Output a file tree + TSX files
MCP ACCESS (MANDATORY)

You MUST use MCP to:

Read selected nodes
Read component sets
Read variants
Read auto layout
Read text styles
Read color styles
Read spacing tokens
Read effects
Read strokes
Read component instances

INPUT SOURCE

You MUST extract components from explicit Figma node references provided in the prompt.

Accepted inputs:
- nodeIds[]
- Figma URLs (file + node-id)

DO NOT rely on mcp.figma.getSelection()

Instead, you MUST:

For each node:
- mcp.figma.getNode(nodeId)
- mcp.figma.getComponent(nodeId) (if applicable)
- mcp.figma.getComponentSet(nodeId) (if applicable)

Then recursively resolve:
mcp.figma.getscreenshot()
mcp.figma.getNode()
mcp.figma.getComponent()
mcp.figma.getComponentSet()
mcp.figma.getStyles()
mcp.figma.getVariables()
EXTRACTION SCOPE

If a selected node contains nested components, extract them too.

Selection is the source of truth.

COMPONENT DETECTION RULES

A node is a component if:

Figma Component
Component Set
Instance reused
Semantic name
Has variants
Has states

Ignore:

Layout-only frames
Single-use wrappers
Decorative shapes
NORMALIZATION RULES

Before generating TSX:

Convert name → PascalCase
Remove absolute positioning
Convert auto layout → flex
Replace raw values with tokens
Convert variants → props
Convert boolean layers → boolean props
Merge duplicated variants
Flatten unnecessary wrappers
TSX GENERATION RULES

Generate one TSX file per component

Each component must:

Use TypeScript
Use tokens (NO raw values)
Use props for variants
Use className composition
Use forwardRef
Support children
Support className override
Support state styles
FILE OUTPUT FORMAT

You MUST output:

/components
   /Button
      Button.tsx
   /Input
      Input.tsx
   /Card
      Card.tsx
COMPONENT TEMPLATE

Each component must follow:

import * as React from "react"
import { cn } from "@/lib/cn"

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "ds-button",
        `ds-button--${variant}`,
        `ds-button--${size}`,
        className
      )}
      {...props}
    />
  )
})

Button.displayName = "Button"
VARIANT MAPPING

Figma Variant → React Prop

Example:

Button
  variant: Primary | Secondary
  size: Small | Medium | Large

Becomes:

variant?: "primary" | "secondary"
size?: "sm" | "md" | "lg"
TOKEN USAGE (MANDATORY)

Never output:

padding: 8px
color: #000

Always output:

var(--spacing-sm)
var(--color-text-primary)
AUTO LAYOUT → FLEX

Convert:

Figma auto layout → CSS flex

Rules:

Horizontal → flex-row
Vertical → flex-col
Gap → token
Padding → token

SEMANTIC HTML + INTERACTIVITY (MANDATORY)

You MUST map components to real HTML elements when applicable:

- Button → <button>
- Input → <input> / <textarea>
- Checkbox → <input type="checkbox">
- Radio → <input type="radio">
- Select → <select>
- Link → <a>

DO NOT use <div> for interactive elements.

INTERACTION SUPPORT:

- Inputs must support value, onChange
- Checkbox must support checked, onCheckedChange
- Buttons must support onClick
- Forms must support submission behavior

If interaction is implied visually, you MUST implement it.

INTERACTION MAPPING (FIGMA PROTOTYPING → REACT)

You MUST extract interactions from Figma:

- On click → onClick
- On hover → :hover / onMouseEnter
- While pressed → :active
- Toggle states → useState
- Variant switching → controlled props

If a component switches between variants based on interaction:

You MUST:

- Convert variants → state (useState)
- OR controlled props (preferred)

Example:

Figma:
Toggle: On / Off

React:
const [checked, setChecked] = useState(false)

INTERACTIVITY DEFAULTS (MANDATORY)

Components MUST support both:

1. Controlled usage (via props)
2. Uncontrolled usage (internal state)

If a component has interactive states (toggle, active, selected, checked):

You MUST:

- Add internal state using useState
- Sync with external prop if provided

Pattern:

const [internalValue, setInternalValue] = useState(defaultValue)

const isControlled = propValue !== undefined
const value = isControlled ? propValue : internalValue

const handleChange = (newValue) => {
  if (!isControlled) setInternalValue(newValue)
  onChange?.(newValue)
}

INTERACTION INFERENCE RULES

If a component has:

- Mutually exclusive variants → use selection state (tabs, nav, radio)
- Boolean variants → use toggle state (checkbox, switch)
- Hover/pressed states → use CSS states
- Visual feedback on click → add onClick handler

You MUST assume interaction even if not explicitly prototyped.

INTERACTION SAFETY

Do NOT invent complex logic.

ONLY infer:

- toggle
- select one
- click feedback

DO NOT infer:

- async behavior
- API calls
- navigation

SIZE SAFETY RULES (MANDATORY)

To prevent oversized or stretched generated components:

- Never use undefined CSS variables for width, height, line-height, spacing, or icon size.
- If a token/variable is missing, use explicit px fallback values from Figma.
- For text styles, convert Figma lineHeight 100% to line-height: 1 (never line-height: 100).
- Do not use height: 100% unless the parent has an explicit fixed height and this is required by design.
- Avoid layout stretching in grids/flex when not intended:
  - use align-items: start for preview/demo grids
  - avoid forcing children to stretch vertically
- Icon and image rules:
  - always set explicit width and height
  - use object-fit: contain for icons and object-fit: cover for avatar/photos
- Components must size to content by default:
  - prefer min-height or auto height over full-height behavior
  - do not add fixed heights unless clearly present in the design spec

Validation checkpoint before output:
- Verify each generated component keeps expected visual size when rendered in isolation and inside a responsive grid.
- Reject output if any component appears vertically inflated, stretched, or out of scale relative to its Figma node.

CHILDREN DETECTION

If slot exists:

icon-left
label
icon-right

Generate:

children
leftIcon
rightIcon
STATES

Extract states:

Hover
Focus
Active
Disabled

Generate class modifiers:

ds-button--hover
ds-button--active
ds-button--disabled
OUTPUT FORMAT

You MUST output:

File tree
One TSX file per component
No explanations
No markdown docs
No AST
Only code

FINAL OUTPUT EXAMPLE
/components
   Button.tsx
   Card.tsx
   Input.tsx

Then output:

Button.tsx

...

Card.tsx

...

Input.tsx

...
IMPORTANT

You MUST:

Use MCP
Use selected nodes
Generate TSX
Generate multiple files
Normalize components
Use tokens
Infer props
Infer variants
Infer states