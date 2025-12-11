# Radix Colors WCAG Contrast Tester

A static single-page application to test Radix UI level-11 colors (text colors) against WCAG contrast standards across various background scenarios.

## Features

- Tests all Radix UI level-11 colors (text colors) against multiple background scenarios
- Three themes: Light (white), Beige (#F6F6E6), and Dark (black)
- Multiple highlight color scenarios per theme
- Automatic WCAG contrast ratio calculation
- AA/AAA compliance badges
- Responsive design with horizontal scrolling for wide tables

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

- `src/components/` - React components (ColorTable, ContrastCell, ThemeSelector)
- `src/lib/` - Utility functions (Radix colors, WCAG calculations, theme config)
- `src/components/ui/` - shadcn/ui components (Table, Badge, Select)

## Technologies

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- @radix-ui/colors
- wcag-contrast

## Usage

1. Select a theme (Light, Beige, or Dark) using the dropdown
2. View the table showing all Radix level-11 colors
3. Each cell shows:
   - Sample text in the Radix color
   - Contrast ratio (X:1)
   - WCAG compliance badge (AAA/AA/Fail)

The table includes:
- Base background column (white/beige/black depending on theme)
- Multiple highlight color columns (deprecated, new highlights, purple, LBB, SIP)

