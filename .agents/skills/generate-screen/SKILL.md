---
name: generate-screen
description: Generate full UI screens using an existing design system extracted from Figma. Always reuse existing components, tokens, and global styles. Never recreate components or duplicate styles.
---

# ROLE

Your goal is to:
1. **Audit** all available components and tokens first
2. **Map** Figma design elements to existing components
3. **Assemble** screens by composing only existing components and tokens
4. **Validate** that zero custom HTML or styles were created

You MUST NOT regenerate design system components or create anything from scratch.

---

# PHASE 1: COMPONENT & TOKEN INVENTORY (MANDATORY FIRST)

**Action: Before writing any screen code, execute this audit:**

### 1.1 – List all components
```
Find src/components/ and extract:
- File path and name
- Props interface (appearance, state, size, etc.)
- Default values for each prop
- Example usage from the file
```

### 1.2 – List all design tokens
```
Load src/Token.ts or src/theme/ and extract:
- Color palette (tokens.colors.*)
- Typography scale (tokens.typography.*)
- Spacing scale (tokens.spacing.*, tokens.radius.*)
- Shadows (tokens.shadows.*)
```

---

# PHASE 2: FIGMA ANALYSIS

**When given a Figma node ID:**

### 2.1 – Extract Figma structure
Using `mcp_my-mcp-server_get_design_context`:
- Frame name and purpose
- Visual hierarchy (top to bottom)
- Component instances and their props
- Styles (colors, typography, spacing)
- Responsive breakpoints

### 2.2 – Create a text-based layout blueprint
```
[Frame: "PDV Unicentro Report"]
├─ Header: PrincipalMenu (property1="Header")
├─ Body:
│  ├─ Back link → Button (appearance="text")
│  ├─ Status chip → CheckBoxStatus + text wrapper
│  ├─ Title → h1 (use --text-heading token)
│  ├─ Info card → DropdownCard (state="Card open")
│  ├─ Category list:
│  │  ├─ List header (flex row)
│  │  ├─ Category rows → CardCheck (state="enabled"/disabled)
│  ├─ Save button → Button (appearance="contained")
└─ Footer: MenuBar (items="3")
```

---

# PHASE 3: COMPONENT-TO-PROPS MAPPING

**For each component instance in the blueprint, resolve its props:**


---

# CRITICAL RULES (STRICT)

## ALWAYS reuse existing components

**Decision tree for every UI element:**

```
1. Does this exist in src/components/?
   → YES: Use it with props 
   → NO: Check Phase 1 inventory again

2. Can I achieve it by composing multiple components?
   → YES: Compose them; add minimal CSS wrapper if needed
   → NO: Ask human before creating custom HTML

3. Does the component have a prop for this state/style?
   → YES: Use the prop (e.g., state="disabled")
   → NO: Do NOT add inline style={{ ... }} —  use component's style prop only as fallback
```

**What NEVER to do:**
```typescript
❌ <div className="custom-checkbox">✓</div>  // Use CheckBoxStatus
❌ <button className="btn">Save</button>       // Use Button
❌ <div style={{background: tokens.colors.primary}}>  // Use component props
❌ Create a new CardItem when CardCheck exists
```

---

## NEVER duplicate design tokens

**Token lookup order:**

1. Check `src/Token.ts` for typography, colors, spacing
2. Check `src/index.css` for CSS variables (--text-heading, --background-primary, etc.)
3. Use CSS variable names in className or sparingly in style prop
4. Do NOT hardcode `#0041a3` or `16px` or color values

**Examples:**
```typescript
✅ color: var(--text-heading)
✅ padding: var(--spacing-md)
✅ background: tokens.colors.primary
✅ <span style={{ color: var(--text-secondary) }}>

❌ color: "#0041a3"
❌ padding: "16px"
❌ style={{ background: "#0041a3" }}
```

---

# COMPONENT API RESPECT (MANDATORY)

**Props come first. Inline styles come last.**

### Rule: Use component props, never override with style

Correct:
```typescript
<CardCheck 
  state="enabled" 
  title="Adhesivos" 
  showNumber={false}
  showIconRight={false}
/>
```

Incorrect:
```typescript
<CardCheck 
  title="Adhesivos"
  style={{ background: 'white', padding: '12px' }}  // ❌ Redefining CardCheck internals
/>
```

### Rule: Check the component's interface first

Before adding ANY prop, read the component's props signature

→ Use props, not className or style overrides.

### Rule: Composition for layout, not for styling

If you need to add custom spacing or alignment:
```typescript
// ✅ Wrap components in a layout container
<div className="categories-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
  <CardCheck ... />
  <CardCheck ... />
</div>

// ❌ Do NOT add wrapper elements inside the component
<CardCheck style={{ marginBottom: '10px' }} />  // Use gap instead
```

---

# SCREEN GENERATION WORKFLOW

## Step 1: Output the TSX structure


## Step 2: Add layout CSS (minimal, no component internals)

In `Screen.css`, add ONLY:
- Flexbox/Grid for layout
- Gap/padding for spacing (use token scale)
- Outer container sizing
- Media queries


**Do NOT add:**
- Component-internal styles (button colors, card borders, etc.)
- Typography redefinitions
- Color overrides

---

# VALIDATION CHECKLIST

**Before committing the screen, verify:**

- [ ] **Component inventory was run** (Phase 1 completed)
- [ ] **Every Figma element mapped to a component** (Phase 2–3 completed)
- [ ] **No custom HTML buttons, divs, or inputs created** (grep for `<button>`, `<input>`, etc. outside of components)
- [ ] **All props used from component interface** (not style={} overrides)
- [ ] **CSS file contains ONLY layout rules** (no colors, fonts, or spacing redefinitions)
- [ ] **All colors use tokens or CSS variables** (no hardcoded #hexcodes)
- [ ] **All spacing uses token scale** (spacing.xs, spacing.sm, spacing.md, etc.)
- [ ] **Component props match the mapping table** (e.g., CardCheck with correct state prop)
- [ ] **Build passes** (`npm run build` succeeds)
- [ ] **No console warnings or errors** (check theme/token resolution)

---

# WHEN GIVEN A FIGMA NODE ID

**Complete workflow to generate a screen from a Figma frame:**

1. **Call `mcp_my-mcp-server_get_design_context`** with the nodeId
2. **Extract frame structure** and create text blueprint (Phase 2.2)
3. **Match each visual element to a component** using the inventory (Phase 1)
4. **Build props mapping table** (Phase 3) for each component
5. **Generate TSX** using only component instances with correct props
6. **Add minimal CSS** for layout only
7. **Run validation checklist**
8. **Build and verify** (`npm run build`)

---

# FORBIDDEN ACTIONS (STRICT ENFORCEMENT)

**NEVER:**

- ❌ Create new component files or custom HTML elements
- ❌ Hardcode colors (`#0041a3`, `rgba(...)`) instead of tokens
- ❌ Hardcode spacing values (`16px`, `8px`) instead of tokens
- ❌ Override component styles with `style={{ ... }}` attributes
- ❌ Add className="custom-..." to replace existing component behavior
- ❌ Duplicate component logic (e.g., building a new checkbox when CheckBoxStatus exists)
- ❌ Ignore component props in favor of CSS redefines
- ❌ Create wrapper divs with `style={{ background: colors.primary }}` instead of using Button

**If tempted to do any of the above, STOP and:**
1. Re-check the component inventory
2. Re-read the component's prop interface
3. Ask if a different component composition would work

---

# DESIGN CONSISTENCY RULES

The generated screen MUST:

✅ Use only tokens from `src/Token.ts`
✅ Use only CSS variables from `:root` in `src/index.css`
✅ Preserve the component's visual hierarchy (button sizes, card padding, etc.)
✅ Follow the spacing scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px)
✅ Use typography only via tokens (Solomon Sans family, weights, sizes)
✅ Maintain responsive behavior (mobile-first layout)

If uncertain about spacing or color, refer to the token scale or check existing screens using the same components.

---

# SUMMARY

**The goal:** Turn a Figma mockup into a production screen using only existing components and tokens.

**The process:**
1. Audit components & tokens (Phase 1)
2. Analyze Figma frame (Phase 2)
3. Map visuals to components (Phase 3)
4. Generate TSX with component instances only
5. Add minimal layout CSS
6. Validate checklist
7. Ship

**The principle:** Composition, not creation. Props, not styles. Tokens, not hardcodes.
