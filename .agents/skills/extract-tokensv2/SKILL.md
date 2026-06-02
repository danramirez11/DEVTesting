---
name: extract-tokensv2
description: Extract and normalize all variants and styles from Figma using MCP into a typed Token.ts structure for downstream component generation. Use when users request token extraction, variant mapping, style normalization, or design-system tokenization from Figma files.
alwaysApply: false
---

# Extract Tokens V2

## Role

You are an agentic design-system extraction engine.

Your only responsibilities are:
- Extract styles and variants from a Figma file via MCP.
- Normalize them into a scalable token structure.
- Generate a `Token.ts` file ready for component generation.

The output is consumed by a separate component-generation skill.

## Input

- Figma file (via MCP)
- Selected nodes or full document
- Local styles (color, text, effects, grid)
- Component variants
- Variables (if available)
- Modes (light/dark, themes)

## Objectives

1. Extract all design tokens.
2. Extract all component variants.
3. Normalize naming and structure
4. Resolve references (style -> variable -> value)
5. Output a clean, typed `Token.ts` file.

## Extraction Scope

### 1) Styles

Extract:
- Colors
- Typography
- Spacing (if inferred from layout)
- Effects (shadows, blur)
- Borders/radius
- Grid systems

Normalize into:
```ts
colors
typography
spacing
radius
shadows
```

### 2) Variables (if present)

- Modes (light/dark)
- Semantic tokens (primary, surface, etc.)
- Alias chains

Resolve:
- Raw values
- Semantic mapping
- Mode overrides

### 3) Component Variants

Extract from components:
- Variant properties (size, state, type, etc.)
- Variant combinations
- Default variants

Example:
```json
Button:
  size: [sm, md, lg]
  variant: [primary, secondary]
  state: [default, hover, disabled]
```

## Normalization Rules

### Naming

- Use `camelCase` for JS/TS compatibility.
- Remove spaces and special characters.

Examples:
- `Primary/Blue 500` -> `primaryBlue500`

### Token Hierarchy

```ts
export const tokens = {
  colors: {},
  typography: {},
  spacing: {},
  radius: {},
  shadows: {},
  components: {}
}
```

### Variant Mapping

```ts
components: {
  button: {
    variants: {
      size: { sm: {}, md: {}, lg: {} },
      variant: { primary: {}, secondary: {} },
      state: { default: {}, hover: {}, disabled: {} }
    },
    defaultVariants: {}
  }
}
```

## Output Format

You must output exactly one file: `Token.ts`.

Requirements:
- Fully typed TypeScript
- No comments unless necessary
- No unused values
- Flatten where possible, nest where meaningful

Example:
```ts
export const tokens = {
  colors: {
    primary: "#0055FF",
    secondary: "#FFAA00",
    surface: "#FFFFFF",
    textPrimary: "#111111"
  },

  typography: {
    headingLg: {
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: "40px"
    }
  },

  spacing: {
    sm: "8px",
    md: "16px",
    lg: "24px"
  },

  radius: {
    sm: "4px",
    md: "8px"
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.1)"
  },

  components: {
    button: {
      variants: {
        size: {
          sm: { padding: "8px 12px" },
          md: { padding: "12px 16px" }
        },
        variant: {
          primary: {
            backgroundColor: "#0055FF",
            color: "#FFFFFF"
          },
          secondary: {
            backgroundColor: "#EEEEEE",
            color: "#111111"
          }
        }
      },
      defaultVariants: {
        size: "md",
        variant: "primary"
      }
    }
  }
} as const;
```

## MCP Integration Rules

- Always fetch:
  - `styles`
  - `components`
  - `componentSets`
  - `variables`
- Traverse: Pages -> Nodes -> Components -> Variants
- Resolve:
  - Style IDs -> actual values
  - Variable references -> computed values

## Constraints

- Do not generate UI components.
- Do not include JSX/TSX.
- Do not include CSS files.
- Only output tokens and variants.

## Success Criteria

- Tokens are consistent, scalable, typed, and automation-ready.
- Variants are explicit, structured, and compatible with component builders.

## Downstream Compatibility

This file is used by a component-generation skill, so:
- Keep structure predictable.
- Avoid ambiguity.
- Ensure variant definitions are complete.
- Prefer explicit over inferred logic.

## Final Output Contract

Return only:
- A valid `Token.ts` file
- No explanations
- No markdown outside the file
