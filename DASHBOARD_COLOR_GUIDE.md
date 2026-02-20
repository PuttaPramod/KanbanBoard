# Dashboard Color Combinations Guide

## Overview
The dashboard now includes sophisticated color combinations that match the taskpage status colors, providing a cohesive and visually appealing interface.

---

## Status Color Scheme

### Color Palette Reference
| Status | Color | Hex Code | Usage |
|--------|-------|----------|-------|
| **To Do** | Bright Blue | `#3b82f6` | Todo metrics, cards, badges |
| **In Progress** | Amber/Orange | `#f59e0b` | Active tasks, in-progress cards |
| **Completed** | Emerald Green | `#10b981` | Done tasks, completion metrics |
| **Delivered** | Purple | `#8b5cf6` | Delivered tasks, special metrics |
| **Overdue** | Red | `#ef4444` | Danger alerts, overdue tasks |
| **Due Today** | Cyan | `#06b6d4` | Today's metrics, info |

---

## Card Styling Classes

### Primary Status Cards
Use these classes on dashboard cards for color-coordinated styling:

- **`.card-total`** - Primary Blue Theme
  - Border: Left accent border with primary blue
  - Background: Subtle blue gradient with radial highlight
  - Use for: Total tasks, overall metrics

- **`.card-todo`** - Bright Blue Theme
  - Border: Left accent border with bright blue
  - Background: Blue gradient with inset shadow
  - Use for: Todo count, not started tasks

- **`.card-inprogress`** - Amber/Orange Theme
  - Border: Left accent border with orange
  - Background: Orange gradient with inset shadow
  - Use for: In progress count, active tasks

- **`.card-done`** - Emerald Green Theme
  - Border: Left accent border with green
  - Background: Green gradient with inset shadow
  - Use for: Completed count, done tasks

- **`.card-delivered`** - Purple Theme
  - Border: Left accent border with purple
  - Background: Purple gradient with inset shadow
  - Use for: Delivered count, special metrics

- **`.card-week`** - Purple Theme (Weekly)
  - Similar to delivered
  - Use for: Due this week metrics

- **`.card-today`** - Cyan Theme
  - Border: Left accent border with cyan
  - Background: Cyan gradient with inset shadow
  - Use for: Due today metrics, time-sensitive tasks

- **`.card-overdue`** - Red/Danger Theme
  - Border: Left accent border with red
  - Background: Red gradient with inset shadow
  - Use for: Overdue tasks, danger alerts

- **`.card-members`** - Primary Blue Theme
  - Similar to total card with radial highlight
  - Use for: Team members count

- **`.card-completion`** - Green Success Theme
  - Full border with green
  - Background: Green gradient with large radial highlight
  - Use for: Completion rate, progress metrics

---

## Badge Styling Classes

### Status Badges
Color-coordinated badges for task status display:

```html
<span class="badge status-todo">To Do</span>
<span class="badge status-inprogress">In Progress</span>
<span class="badge status-done">Done</span>
<span class="badge status-delivered">Delivered</span>
```

**Features:**
- Gradient backgrounds matched to status color
- Subtle border for definition
- Hover effects for interactivity
- Responsive sizing

---

## Status Indicators

### Full Status Indicators
Rich status indicators with colors and borders:

```html
<div class="status-indicator todo">
  <span class="color-dot"></span>
  To Do
</div>
```

**Classes:**
- `.status-indicator.todo` - Blue themed
- `.status-indicator.inprogress` - Orange themed
- `.status-indicator.done` - Green themed
- `.status-indicator.delivered` - Purple themed

---

## Metric Highlights

### Value Highlights
Inline highlights for metric values:

```html
<span class="metric-highlight todo">5</span>
<span class="metric-highlight done">12</span>
```

**Classes:**
- `.metric-highlight.todo` - Blue background
- `.metric-highlight.inprogress` - Orange background
- `.metric-highlight.done` - Green background
- `.metric-highlight.delivered` - Purple background
- `.metric-highlight.danger` - Red background

---

## Chart Legend

### Custom Legend Items
Enhanced legend for charts:

```html
<div class="chart-legend">
  <div class="chart-legend-item">
    <div class="color-dot" style="background: #3b82f6;"></div>
    <span>To Do (5)</span>
  </div>
  <div class="chart-legend-item">
    <div class="color-dot" style="background: #f59e0b;"></div>
    <span>In Progress (3)</span>
  </div>
</div>
```

**Features:**
- Colored dots with shadow
- Hover effects
- Clean, professional appearance

---

## Section Headers

### Colored Section Headers
Headers with accent bars:

```html
<div class="section-header overview">
  <h3>Main Metrics</h3>
</div>

<div class="section-header todo">
  <h3>To Do Tasks</h3>
</div>
```

**Classes:**
- `.section-header.overview` - Blue accent bar
- `.section-header.todo` - Blue accent bar
- `.section-header.inprogress` - Orange accent bar
- `.section-header.done` - Green accent bar
- `.section-header.delivered` - Purple accent bar

---

## Separator Lines

### Color-Coded Dividers
Gradient separators matching status colors:

```html
<div class="separator-line todo"></div>
<div class="separator-line done"></div>
```

**Classes:**
- `.separator-line` - Default gray
- `.separator-line.todo` - Blue gradient
- `.separator-line.inprogress` - Orange gradient
- `.separator-line.done` - Green gradient
- `.separator-line.delivered` - Purple gradient

---

## Progress Bars

### Completion Progress
Enhanced progress bar with gradient:

```html
<div class="progress">
  <div class="progress-bar" style="width: 65%"></div>
</div>
```

**Features:**
- Green to lime gradient
- Shimmer animation
- Smooth transition
- Subtle borders

---

## Visual Design Principles

### Color Harmony
- Primary Blue (`#2563eb`) - Main actions and primary metrics
- Status Colors - Matched from taskpage for consistency
- Gradients - Subtle, directional (135deg) for depth
- Opacity - Varied rgba values for layering effect

### Spacing & Borders
- Left accent borders (4px) for status cards
- Rounded borders (6-14px) for friendliness
- Inset shadows for depth without weight
- Radial highlights for emphasis on important cards

### Interactive States
- Hover effects with gradient transitions
- Transform effects on interaction
- Shadow elevation on hover
- Smooth animations (200ms cubic-bezier)

### Accessibility
- Sufficient color contrast ratios
- Reduced motion support
- Semantic color meanings
- Multiple visual indicators (not color alone)

---

## Usage Examples

### Example 1: Dashboard Card
```html
<article class="card dash-card card-todo h-100 shadow-sm">
  <div class="card-body">
    <div class="card-label text-muted">To Do</div>
    <div class="card-value display-6 accent-todo">{{ todoCount }}</div>
    <div class="card-meta text-muted">Not started</div>
  </div>
</article>
```

### Example 2: Status Badge in List
```html
<span class="badge status-done">Completed</span>
```

### Example 3: Metric Highlight
```html
<p>You have completed <span class="metric-highlight done">8</span> tasks this week.</p>
```

### Example 4: Section with Colored Header
```html
<div class="section-header inprogress">
  <h3>Active Tasks</h3>
</div>
<div class="separator-line inprogress"></div>
```

---

## CSS Variables Available

All dashboard colors are defined as CSS variables and can be customized:

```css
--color-primary-600: #2563eb;          /* Main blue */
--color-todo: #3b82f6;                  /* Bright blue */
--color-inprogress: #f59e0b;            /* Orange */
--color-done: #10b981;                  /* Green */
--color-delivered: #8b5cf6;             /* Purple */
--color-danger: #ef4444;                /* Red */
--color-info: #06b6d4;                  /* Cyan */
--color-success: #22c55e;               /* Lime green */
```

---

## Responsive Design

All color combinations maintain visual coherence across:
- **Desktop** (1200px+) - Full color detail with radial highlights
- **Tablet** (768px - 1199px) - Optimized card layouts
- **Mobile** (< 768px) - Simplified but consistent colors

---

## Color Combination Summary

| Component | Primary | Secondary | Accent |
|-----------|---------|-----------|--------|
| **Card Background** | Subtle gradient | Opacity layer | Inset shadow |
| **Border** | Status color (left) | Gray (other sides) | 4px accent |
| **Badge** | Status gradient | White text | Subtle border |
| **Highlight** | Status color 10% | Status text color | N/A |
| **Separator** | Color gradient | Transparent edges | N/A |
| **Progress** | Green to Lime | Shimmer overlay | N/A |

---

## Tips for Implementation

1. **Consistency** - Use matching status colors across all components
2. **Contrast** - Ensure adequate contrast for accessibility
3. **Spacing** - Use consistent gaps between colored elements
4. **Animation** - Use smooth transitions (200ms default)
5. **Hierarchy** - Use color intensity to indicate importance

---

For more details on the complete color palette, refer to [COLOR_PALETTE.md](./COLOR_PALETTE.md)
