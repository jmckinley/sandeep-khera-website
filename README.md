# Sandeep Khera - Professional Website

A modern, responsive website for Sandeep Khera, High-Performance Coach, Author & Entrepreneur.

## Live Site

**Preview URL:** https://jmckinley.github.io/sandeep-khera-website/

## Features

- Fully responsive design (mobile-first approach)
- Clean, modern UI with professional styling
- Interactive navigation with dropdowns
- Contact form with validation
- FAQ accordion
- Newsletter signup
- SEO optimized
- Accessibility compliant

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage with hero, pillars, services, testimonials |
| `about.html` | About page with Story, System, Science sections |
| `programs.html` | Coaching programs (1-1, Group, Workshops) |
| `contact.html` | Contact form, discovery call booking, FAQ |
| `book.html` | Book page |
| `blog.html` | Blog listing page |
| `mindset.html` | Mindset coaching topic |
| `health.html` | Health coaching topic |
| `wealth.html` | Wealth mastery topic |
| `relationships.html` | Relationships coaching topic |
| `business.html` | Business excellence topic |
| `leadership.html` | Leadership development topic |
| `happiness.html` | Happiness & purpose topic |

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **JavaScript** - Vanilla JS for interactions
- **Fonts** - Google Fonts (Playfair Display, Inter)

## Project Structure

```
fixedwebsite/
├── index.html              # Homepage
├── about.html              # About page
├── programs.html           # Coaching programs
├── contact.html            # Contact & booking
├── book.html               # Book page
├── blog.html               # Blog listing
├── mindset.html            # Topic page
├── health.html             # Topic page
├── wealth.html             # Topic page
├── relationships.html      # Topic page
├── business.html           # Topic page
├── leadership.html         # Topic page
├── happiness.html          # Topic page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── main.js             # JavaScript functionality
├── images/
│   ├── *.jpg               # Main images
│   └── blog/               # Blog post images
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

## Development

### Local Development

Simply open `index.html` in a browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

### Deployment

The site auto-deploys to GitHub Pages on push to `main` branch.

To manually deploy:
```bash
git add -A
git commit -m "Your commit message"
git push
```

## Customization

### Colors

Edit CSS custom properties in `css/styles.css`:

```css
:root {
    --color-primary: #1e40af;
    --color-primary-dark: #1e3a8a;
    --color-primary-light: #3b82f6;
    /* ... */
}
```

### Fonts

Fonts are loaded from Google Fonts. To change:

1. Update the `<link>` tags in HTML files
2. Update `--font-heading` and `--font-body` in CSS

## Contact Information

- **Phone (AU):** +61 456 666 011
- **Phone (IN):** +91 84488 26011
- **Email:** info@sharingsmilesfoundation.com
- **Location:** Sydney, Australia

## Bugs Fixed

This rebuild addressed the following issues from the original site:

- Spelling errors (Business, Recognition, Entrepreneur, etc.)
- Grammar issues and capitalization inconsistencies
- Broken navigation links
- Non-functional buttons
- Responsive design failures
- Image display issues
- Missing contact information
- Inconsistent styling

## License

Copyright 2025 Sandeep Khera. All rights reserved.

---

Built with care by Great Falls Ventures
