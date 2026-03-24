# Dashboard Color Palette System

## Complete Color System Reference

### **Primary Colors**
| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary 600 | `#2563eb` | Main actions, primary buttons, primary text |
| Primary 700 | `#1d4ed8` | Hover states for primary elements |
| Primary 800 | `#1e40af` | Active states for primary elements |
| Primary 900 | `#1e3a8a` | Dark backgrounds, deep accents |

---

## **Status Colors**
| Status | Color | Hex Code | Usage |
|--------|-------|----------|-------|
| 🔵 To Do | Bright Blue | `#3b82f6` | Todo status cards, todo badges |
| 🟠 In Progress | Amber/Orange | `#f59e0b` | In progress status cards, active badges |
| 🟢 Done | Emerald Green | `#10b981` | Completed status cards, success completion display |
| 🟣 Delivered | Purple | `#8b5cf6` | Delivered status cards, special badges |
| 🔴 Danger | Red | `#ef4444` | Overdue cards, errors, warnings |
| 🔷 Info | Cyan | `#06b6d4` | Due today info, information display |
| 🟡 Warning | Orange | `#f97316` | Alert colors, warnings |
| 🟢 Success | Lime Green | `#22c55e` | Success indicators, positive actions |

---

## **Neutral/Gray Scale**
| Shade | Hex Code | Usage |
|-------|----------|-------|
| Gray 50 | `#f9fafb` | Main background, very light surfaces |
| Gray 100 | `#f3f4f6` | Secondary background, hover states |
| Gray 200 | `#e5e7eb` | Borders, dividers |
| Gray 300 | `#d1d5db` | Strong borders, shadows |
| Gray 400 | `#9ca3af` | Secondary text, muted labels |
| Gray 500 | `#6b7280` | Muted text, secondary information |
| Gray 600 | `#4b5563` | Secondary text color |
| Gray 700 | `#374151` | Primary text, headings |
| Gray 800 | `#1f2937` | Dark text, strong emphasis |
| Gray 900 | `#111827` | Text on light backgrounds, darkest text |

---

## **Semantic Colors (CSS Variables)**
```css
/* Primary Colors */
--tp-primary: #2563eb;                    /* Main blue */
--tp-primary-hover: #1d4ed8;              /* Hover state blue */
--tp-primary-muted: rgba(37, 99, 235, 0.1);

/* Status Colors */
--color-todo: #3b82f6;                    /* Blue */
--color-inprogress: #f59e0b;              /* Orange */
--color-done: #10b981;                    /* Green */
--color-delivered: #8b5cf6;               /* Purple */
--color-danger: #ef4444;                  /* Red */
--color-warning: #f97316;                 /* Orange */
--color-success: #22c55e;                 /* Lime */
--color-info: #06b6d4;                    /* Cyan */

/* Backgrounds */
--tp-bg-app: #f9fafb;                     /* Main app background */
--tp-bg-elevated: #ffffff;                /* Card backgrounds */
--tp-bg-secondary: #f3f4f6;               /* Secondary backgrounds */
--tp-bg-tertiary: #e5e7eb;                /* Tertiary backgrounds */

/* Borders */
--tp-border: #e5e7eb;                     /* Light border */
--tp-border-strong: #d1d5db;              /* Strong border */

/* Text */
--tp-text: #111827;                       /* Primary text */
--tp-text-secondary: #374151;             /* Secondary text */
--tp-text-muted: #6b7280;                 /* Muted text */
```

---

## **Gradients**
| Name | Gradient | Usage |
|------|----------|-------|
| Primary | `linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)` | Primary buttons, actions |
| Success | `linear-gradient(135deg, #10b981 0%, #059669 100%)` | Success states, completion |
| Warning | `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)` | Warning colors, attention |
| Danger | `linear-gradient(135deg, #ef4444 0%, #dc2626 100%)` | Error states, deletions |
| Info | `linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)` | Info displays, details |
| Light | `linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)` | Light backgrounds, cards |
| Dark | `linear-gradient(135deg, #1f2937 0%, #111827 100%)` | Dark backgrounds, overlays |

---

## **Shadows (Box Shadows)**
| Size | Shadow | Usage |
|------|--------|-------|
| XS | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Minimal elevation |
| SM | `0 1px 2px rgba(15, 23, 42, 0.04)` | Subtle depth |
| MD | `0 4px 12px rgba(15, 23, 42, 0.08)` | Medium elevation |
| LG | `0 12px 28px rgba(15, 23, 42, 0.12)` | High elevation |
| XL | `0 20px 40px rgba(15, 23, 42, 0.15)` | Maximum elevation |

---

## **Border Radius**
| Size | Value | Usage |
|------|-------|-------|
| Small | `6px` | Small buttons, badges |
| Medium | `10px` | Cards, medium elements |
| Large | `14px` | Large cards, containers |

---

## **Card Color Scheme**

### **Card Borders & Backgrounds**
| Card Type | Border Color | Background Gradient | Text Color |
|-----------|--------------|-------------------|-----------|
| Total Tasks | `#3b82f6` | Blue subtle (3% opacity) | Primary text |
| To Do | `#3b82f6` | Blue subtle (3% opacity) | Blue accent |
| In Progress | `#f59e0b` | Orange subtle (3% opacity) | Orange accent |
| Completed | `#10b981` | Green subtle (3% opacity) | Green accent |
| Delivered | `#8b5cf6` | Purple subtle (3% opacity) | Purple accent |
| Team Members | `#2563eb` | Blue subtle (3% opacity) | Blue accent |
| Overdue | `#ef4444` | Red subtle (3% opacity) | Red accent |
| Due Today | `#06b6d4` | Cyan subtle (3% opacity) | Cyan accent |
| Due This Week | `#8b5cf6` | Purple subtle (3% opacity) | Purple accent |
| Completion Rate | `#10b981` | Green subtle (3% opacity) | Green accent |
| Recent Tasks | `#3b82f6` | Blue subtle (3% opacity) | Primary text |

---

## **Interactive States**

### **Button States**
- **Normal**: Primary gradient with shadow
- **Hover**: Darker gradient, elevated shadow, -2px transform
- **Active**: Darker gradient with strong shadow
- **Disabled**: Gray background with reduced opacity

### **Card Hover Effects**
- Elevation increases (shadow becomes larger)
- Border color strengthens
- Background subtly brightens
- Transform: -2px Y-axis movement

### **List Item Hover Effects**
- Background color changes to secondary
- Border strengthens
- Shadow increases
- Transform: -2px Y-axis movement

---

## **Usage Examples**

### **For Cards**
```html
<!-- Todo Status Card -->
<div class="dash-card card-todo">
  <div class="card-label">To Do</div>
  <div class="card-value accent-todo">{{ count }}</div>
</div>
```

### **For Badges**
```html
<!-- Status Badge -->
<span class="badge" [ngClass]="getStatusClass(task)">
  {{ getStatusLabel(task) }}
</span>
```

### **For Progress/Completion**
```html
<div class="progress">
  <div class="progress-bar" [style.width.%]="completionRate"></div>
</div>
```

---

## **Accessibility Considerations**

1. **Color Contrast**: All text meets WCAG AA standards (4.5:1 for normal text)
2. **Color Blindness**: Status colors are not solely distinguished by hue
3. **Reduced Motion**: Transitions are disabled for users with `prefers-reduced-motion`
4. **Focus States**: All interactive elements have visible focus indicators

---

## **CSS Variables Reference**

```css
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Status Colors */
  --color-todo: #3b82f6;
  --color-inprogress: #f59e0b;
  --color-done: #10b981;
  --color-delivered: #8b5cf6;
  --color-danger: #ef4444;
  --color-warning: #f97316;
  --color-success: #22c55e;
  --color-info: #06b6d4;

  /* Gray Scale */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
}
```

---

## **Recent Updates**
- ✅ Complete color system implemented
- ✅ Professional gradients applied
- ✅ Card colors standardized
- ✅ Status badges updated
- ✅ Shadow depths refined
- ✅ Accessibility compliance checked
