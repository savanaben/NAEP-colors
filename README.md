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

### Deployment to GitHub Pages

1. **Set up GitHub Pages in your repository:**
   - Go to your repository Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Choose the `gh-pages` branch and `/ (root)` folder
   - Click Save

2. **Configure the base path (if needed):**
   - If your repository is named `username.github.io`, the base path should be `/` (default)
   - If your repository is named something else (e.g., `NAEP-colors`), set the base path:
     - Create a `.env` file in the root directory
     - Add: `VITE_BASE_PATH=/NAEP-colors/` (replace with your actual repo name)

3. **Deploy:**
   ```bash
   npm run deploy
   ```
   
   This will build the project and deploy it to the `gh-pages` branch.

4. **Access your site:**
   - If repo is `username.github.io`: `https://username.github.io`
   - If repo is `username/repo-name`: `https://username.github.io/repo-name/`

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

