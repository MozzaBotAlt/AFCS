# AFCS Frontend - Futuristic Islamic Mathematical Theme

## Overview

I've built a modern, futuristic, Islamic and mathematically-themed frontend GUI for your AFCS (Ain Faraid Calculation System) Islamic inheritance calculator. The interface is sleek, intuitive, and visually stunning with smooth interactions and responsive design.

## Design Theme

### Visual Elements
- **Color Scheme**: 
  - Primary: Cyan (#00d9ff) - Futuristic glow
  - Secondary: Dark Blue (#0099cc)
  - Accent: Magenta (#ff00ff)
  - Success: Neon Green (#00ff88)
  - Background: Very Dark Navy (#050812 to #0a0e27)

- **Islamic Elements**:
  - Geometric patterns and glowing borders
  - Arabic text integration (الفرائض - Al-Faraid)
  - Elegant, symmetrical layouts
  - Gold/cyan color reminiscent of traditional Islamic art

- **Mathematical Elements**:
  - Geometric shapes (◆ symbols)
  - Fractional representations
  - Precise numerical displays
  - Step-by-step calculation breakdown

### Typography
- Modern sans-serif fonts (Segoe UI, Tahoma)
- Clear hierarchy with color-coded headings
- Readable contrast ratios for accessibility

## Frontend Structure

### 1. Home Page (`index.html`)
**Location**: `/templates/index.html`

The landing page featuring:
- Eye-catching header with geometric icon (◆)
- Hero section with call-to-action
- 4-card feature grid highlighting calculator capabilities
- Main calculator launch card
- Information section about Faraid
- Current date/time display
- Responsive footer

**Features**:
- Smooth animations and hover effects
- Glassmorphism design with backdrop blur
- Gradient backgrounds and glowing text shadows
- Completely responsive for mobile, tablet, and desktop

### 2. Calculator Page (`/calculator/index.html`)
**Location**: `/templates/calculator/index.html`

A **3-step multi-page form** with progress tracking:

#### Step 1: Estate Valuation
- Gender selection (♂ Male / ♀ Female)
- Total Assets input
- Deduct: Debt, Funeral costs, Bequest/Will, Nazar
- Real-time net estate calculation with live preview
- Visual feedback with success color (#00ff88)

#### Step 2: Heirs Information
- Two organized categories:
  - **Male Heirs**: Son, Grandson, Father, Grandfather, Brother, Stepbrothers, Nephew, Uncle, Cousins
  - **Female Heirs**: Daughter, Granddaughter, Mother, Grandmothers, Sister, Stepsisters, Spouse
  
- Interactive checkboxes that enable/disable count inputs
- Automatic form validation
- Heirs organized in beautiful cards with hover effects

#### Step 3: Results Display
- Summary card showing net estate
- Individual heir distribution cards featuring:
  - Heir name
  - Portion (as fraction)
  - Count of heirs
  - Total amount in RM
  - Glowing borders and hover animations
- Export to PDF option
- Reset form button for new calculations

### 3. Styling

#### Main Stylesheet (`style.css`)
Handles home page theming with:
- Light mode alternative support
- Feature cards grid
- Responsive breakpoints
- Button animations and states
- Modern glassmorphism effects

#### Calculator Stylesheet (`calc.css`)
Provides extensive styling for:
- Form sections with fade transitions
- Progress tracker with step indicators
- Gender and heir selectors
- Result cards with gradient backgrounds
- Interactive form elements
- Loading animations
- Error/success message styling

### 4. JavaScript Logic

#### Home Page (`script.js`)
Simple utility that:
- Displays current UTC date/time
- Updates dynamically

#### Calculator Page (`script.js`)
Comprehensive logic handling:
- **Form State Management**: Maintains all form data
- **Heir Mapping**: Maps frontend IDs to backend heir names
- **Event Listeners**: Set up on page load
- **Validation**: Validates each step before proceeding
- **API Communication**: Sends data to `/calculate-faraid` endpoint
- **Results Display**: Formats and displays inheritance calculations
- **User Interactions**:
  - Step navigation (next/back buttons)
  - Progress tracker updates
  - Error handling with 5-second timeout
  - Loading spinner during calculation
  - Form reset functionality

## Technical Features

### 1. Responsive Design
- Mobile-first approach
- Breakpoints at 768px and below
- Flexible grid layouts using CSS Grid
- Touch-friendly buttons and inputs

### 2. Accessibility
- Semantic HTML5 structure
- ARIA labels for navigation
- Keyboard navigation support
- Proper color contrast ratios
- Form validation messaging

### 3. Performance
- Smooth CSS transitions (300ms)
- GPU-accelerated transforms
- Minimal JavaScript overhead
- Optimized animations
- No external dependencies

### 4. User Experience
- Real-time form feedback
- Progress visualization
- Clear error messages
- Loading indicators
- Smooth page transitions
- Intuitive heir selection

## Backend Integration

The frontend communicates with the Flask backend via:

### API Endpoint: `POST /calculate-faraid`

**Request**:
```json
{
  "gender": "M",
  "totalAssets": 100000,
  "debt": 5000,
  "funeral": 2000,
  "will": 3000,
  "nazar": 1000,
  "netAsset": 89000,
  "heirs": {
    "Son": 2,
    "Daughter": 1,
    "Mother": 1
  }
}
```

**Response**:
```json
{
  "success": true,
  "estate": { ... },
  "heirs": {
    "Son": {
      "amount": 29666.67,
      "portion": "2/3",
      "count": 2,
      "total": 59333.34
    },
    ...
  },
  "total_distributed": 89000
}
```

## Color Reference

```css
Primary Cyan:       #00d9ff  /* Main brand color, buttons, text glow */
Dark Background:    #0a0e27  /* Main body background */
Darker Background:  #050812  /* Deep space background */
Card Background:    #151d3d  /* Card and section backgrounds */
Text Primary:       #e0e8ff  /* Main readable text */
Text Secondary:     #a0aec8  /* Muted secondary text */
Success Green:      #00ff88  /* Amount display, success states */
Danger Red:         #ff3366  /* Error messages */
Warning Orange:     #ffaa00  /* Warning states */
```

## Animation Effects

1. **Pulse Glow**: Geometric icon in header (infinite loop 3s)
2. **Hover Transforms**: Cards lift up (-5px to -8px)
3. **Button Effects**: Gradient shifts, shadow expansions
4. **Fade Transitions**: Form sections fade in/out (300ms)
5. **Border Glow**: Elements glow on focus/hover
6. **Spinner**: Loading indicator rotates (800ms)

## File Structure

```
templates/
├── index.html              # Home page
├── style.css              # Home page styling
├── script.js              # Home page logic
└── calculator/
    ├── index.html         # Calculator page
    ├── calc.css           # Calculator styling
    └── script.js          # Calculator logic
```

## Future Enhancements

Potential improvements could include:
1. PDF export with formatted inheritance breakdown
2. Dark/Light theme toggle
3. Multiple language support (Arabic, Malay, English)
4. Calculation history
5. Share results via link
6. Advanced heir scenarios
7. Animated calculation breakdown
8. Comparison between different scenarios

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- All calculations are performed on the backend following Islamic law
- The frontend is purely a presentation layer
- No sensitive data is stored locally
- Does not require any CDN dependencies
- Fully self-contained and lightweight

---

**Created**: February 2025
**Theme**: Futuristic Islamic Mathematical
**License**: GNU AGPL v3.0
