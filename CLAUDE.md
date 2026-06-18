# Alex Aura Website — Development Guide

## Project Overview

**alexaura-website1** is a personal portfolio and professional brand website for Alex Aura, a strategic planner, founder, and investor based in Aleppo and Beirut.

**Key Purpose**: Showcase Alex's expertise across multiple domains (company formation, business consulting, project management, precious metals investing) and facilitate business inquiries from potential partners and clients.

**Target Audience**: International business partners, entrepreneurs, investors, and clients interested in consulting or partnerships across Syrian, Lebanese, and European markets.

**Current Status**: Single-page website (MVP) in production. Repository has minimal commit history (2 commits). Development branch: `claude/claude-md-docs-nb6bar`.

---

## Technology Stack

- **Language**: HTML5
- **Styling**: CSS3 (inline in `index.html.html`)
- **Interactivity**: No JavaScript (static site)
- **Fonts**: Google Fonts (Fraunces, Outfit, Tajawal for Arabic support)
- **Deployment**: Simple HTML file serving
- **Version Control**: Git

**No Build Process**: This is a static HTML file with no build tools, bundlers, or frameworks. Changes are direct edits to the source file.

---

## Project Structure

```
alexaura-website1/
├── index.html.html          # Main website (contains all HTML + CSS)
├── README.md                # Minimal project description
├── CLAUDE.md                # This file — AI assistant guide
└── .git/                    # Version control
```

**Note**: The filename `index.html.html` appears to be a naming quirk. This should ideally be `index.html` in production, but keep current name if there's an intentional reason.

---

## Codebase Structure & Sections

The single HTML file is organized into clear semantic sections:

### 1. **Head Section (Lines 1–690)**
- Meta tags (charset, viewport, title, description)
- Font imports from Google Fonts (Fraunces serif, Outfit sans, Tajawal Arabic)
- Complete CSS styling with:
  - CSS Custom Properties (colors, fonts, spacing)
  - Component-based styling (nav, hero, sections, cards, etc.)
  - Responsive media queries (breakpoint: 968px)
  - Animations (pulse effect, reveal stagger animations)

### 2. **Body Sections (Lines 692–989)**
- **Navigation** (Lines 694–703): Fixed top bar with logo and nav links
- **Hero** (Lines 705–737): Main introduction with badge, name, subtitle, and metadata
- **About** (Lines 739–781): Section 01 — Personal background and philosophy
- **Services** (Lines 783–827): Section 02 — Four core offerings in 2-column grid
- **Projects/Work** (Lines 829–911): Section 03 — Three featured projects with detailed descriptions
- **Philosophy** (Lines 913–921): Section 04 — Core operating principles quote
- **Pillars** (Lines 923–949): Operating principles in 3-column grid
- **Contact** (Lines 951–988): Contact section with email, social links
- **Footer** (Lines 990–993): Copyright notice

---

## Design System & Styling Conventions

### Color Palette (CSS Variables)
```css
--bg-deep:      #0a0a0a       /* Primary dark background */
--bg-mid:       #141414       /* Secondary background */
--bg-card:      #1a1a1a       /* Card backgrounds */
--gold:         #c9a961       /* Primary accent (premium feel) */
--gold-bright:  #e6c378       /* Lighter gold highlights */
--gold-dim:     #8a7340       /* Muted gold for secondary elements */
--cream:        #f5f0e8       /* Primary text color */
--text-primary: #ece6dd       /* Main body text */
--text-secondary: #9b9389     /* Secondary text (muted) */
--text-dim:     #5c574f       /* Dimmed text (labels, captions) */
```

### Typography
- **Serif Font**: Fraunces (used for headings, titles, luxury feel)
- **Sans-serif**: Outfit (used for labels, CTAs, modern elements)
- **Arabic Font**: Tajawal (fallback for all text when Arabic needed)
- **Text Direction**: RTL for Arabic content, LTR for English

### Key CSS Classes & Components
- `.hero`: Full-screen hero section with centered content
- `.section-header`: Grid-based section intro (number + title)
- `.section-title`: Large responsive heading
- `.services-grid`: 2-column grid for services (collapses to 1 on mobile)
- `.project`: Sticky sidebar project layout
- `.pillars-grid`: 3-column equal-width grid
- `.contact-links`: List of interactive contact items with hover states
- `.reveal`: CSS animation class for staggered entrance effects

### Animation & Interaction
- **Pulse Animation** (`.hero-badge::before`): Breathing pulse effect on badge
- **Reveal Animation**: Staggered up-reveal on page load with delays (0.1s to 0.9s)
- **Hover Effects**: Links change to gold, project cards shift background, contact items get subtle padding shift
- **Smooth Scroll**: `html { scroll-behavior: smooth; }`

---

## Content Structure & Sections

### Hero Section
- **Badge**: "Strategic Planner · Founder · Investor" with pulse animation
- **Name**: "Alex Aura" (split across lines, "Aura" italicized in gold)
- **Subtitle**: Arabic description of focus areas
- **Meta Info**: Age, location, markets served, status

### Services (4 Items)
1. **Company Formation**: UK & EU company setup for Arab diaspora
2. **Business Consulting**: Strategy, market analysis, operations
3. **Project Management**: Full lifecycle management using PMI + Lean + custom PFMS
4. **Precious Metals Investing**: Gold & silver portfolio management

### Projects (3 Featured)
1. **SyriaWay** (Active 2025–2026): Travel agency platform solving payment barriers for Syrian diaspora
2. **PFMS v2.0** (In Development): Proprietary project management system combining 7 sub-systems
3. **Precious Metals** (Ongoing): Personal gold/silver investment portfolio

### Operating Principles (3 Pillars)
- Strike First (time-sensitive opportunities)
- Systems Before People (sustainable operations)
- Cash in Bank (Profit First methodology)

---

## Development Workflow

### Git Workflow
- **Main Branch**: `main` (production-ready)
- **Development Branch**: `claude/claude-md-docs-nb6bar` (current feature/docs branch)
- **Commit Convention**: Clear, descriptive messages (existing commits: "Add files via upload", "Initial commit")
- **No CI/CD Setup**: Static HTML deployment

### Making Changes
1. **Check Branch**: Ensure on `claude/claude-md-docs-nb6bar` or create feature branch
2. **Edit**: Modify `index.html.html` directly (no build step)
3. **Test**: Open in browser to verify rendering (especially:)
   - RTL layout for Arabic sections
   - Responsive design (test at 968px breakpoint)
   - Hover states and animations
   - Link functionality
4. **Commit**: Push to development branch with clear message
5. **Review**: Verify no broken links or styling issues

### Testing Checklist
- [ ] Mobile responsiveness (< 968px)
- [ ] Navigation links scroll to correct sections
- [ ] Contact links functional (email, social, WhatsApp)
- [ ] RTL layout correct for Arabic text
- [ ] Animations play smoothly on load
- [ ] No console errors in browser DevTools
- [ ] All external font links load correctly

---

## Common Tasks & Guidelines

### Adding New Content
1. **New Service**: Add `.service` div to `.services-grid` (maintain 2-column layout)
2. **New Project**: Add `.project` div to projects section (maintain sticky sidebar + content layout)
3. **Update Contact**: Edit `.contact-links` list items
4. **Update Text**: Edit within relevant section (maintain Arabic/English split)

### Styling Changes
- **Edit CSS** in the `<style>` block (Lines 13–690)
- **Use CSS Custom Properties** for colors instead of hard-coding hex values
- **Test Responsiveness**: Add/modify `@media (max-width: 968px)` rules
- **Maintain Contrast**: Keep WCAG AA minimum for text readability

### Responsive Design Notes
- Breakpoint: 968px (max-width)
- Mobile adjustments: Padding reduced, 1-column layouts, nav links hidden, sticky positioning made static
- Use `clamp()` for fluid typography (scales with viewport)

### Direction & Internationalization
- **English Content**: Mark with `direction: ltr` (LTR layout)
- **Arabic Content**: Default to RTL (set at body level)
- **Mixed Content**: Use inline `direction` attributes when needed
- **Fonts**: Tajawal as fallback for all text blocks to support both languages

---

## Key Conventions for AI Assistants

### Content Preservation
- **Do NOT** remove or significantly alter existing content without explicit instruction
- The website reflects Alex's actual experience, projects, and philosophy — treat as factual/intentional
- Changes should enhance clarity, fix bugs, or improve UX, not restructure the narrative

### Naming & Terminology
- **PFMS**: Project Foundation & Management System v2.0 (custom methodology)
- **SyriaWay**: Travel agency project (UK-registered)
- **Precious Metals Project**: Gold/silver investment portfolio
- Keep these project names consistent across all references

### Link Updates
- Email link: `hello@alexaura.com` (update if changed)
- Social profiles: Instagram (@alexaura), LinkedIn (/alexaura)
- WhatsApp link: `https://wa.me/963XXXXXXXXX` (replace X's with real number if updating)

### Style Consistency
- **Headings**: Use Fraunces serif for premium feel
- **Labels/CTAs**: Use Outfit sans-serif
- **Gold Accents**: Use primary gold `#c9a961` for key elements
- **Animations**: Add reveal delays (d1, d2, d3, etc.) for staggered entrance
- **Hover States**: Most interactive elements transition to gold on hover

### Performance Notes
- Single HTML file = minimal HTTP requests
- Google Fonts use preconnect for performance
- No JavaScript = instant load and smooth rendering
- CSS animations use GPU-accelerated properties (transform, opacity)

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Broken layout on mobile** | Check viewport meta tag, test at 968px breakpoint, verify media query rules |
| **Arabic text not displaying** | Ensure Tajawal font loaded, check `direction: rtl` on parent, verify charset UTF-8 |
| **Links not working** | Confirm anchor IDs match href values (e.g., `href="#about"` → `id="about"`) |
| **Animations not visible** | Check browser DevTools for animation performance, verify animation-delay syntax |
| **Color contrast issues** | Use browser accessibility checker, refer to CSS Custom Properties for palette |
| **Font weight inconsistent** | Remember Fraunces/Outfit have limited weights; check `font-weight` CSS |

---

## Future Enhancement Ideas
*(For reference, not immediate action items)*

- Separate HTML/CSS into individual files for better maintainability
- Add JavaScript for enhanced interactivity (e.g., smooth scroll, form validation)
- Consider a lightweight CMS or static site generator (Hugo, Astro) if content updates become frequent
- Add Open Graph meta tags for better social media preview
- Implement lazy loading for potential future images
- Add form submission handling for contact inquiries
- Consider adding blog section for thought leadership
- Explore dark/light theme toggle (would require JS)

---

## Contact & Metadata

**Website Owner**: Alex Aura
- Email: hello@alexaura.com
- Instagram: @alexaura
- LinkedIn: /alexaura
- Based: Aleppo, Lebanon; Beirut

**Repository**: 7m4d5phdbd-eng/alexaura-website1
**Development Branch**: `claude/claude-md-docs-nb6bar`
**Last Updated**: 2026-06-18

---

## Quick Reference: File Locations

- **Main File**: `/home/user/alexaura-website1/index.html.html`
- **Styles**: Lines 13–690 (inline `<style>` tag)
- **HTML Structure**: Lines 692–989
- **CSS Variables**: Lines 14–31
- **Responsive Rules**: Lines 666–689

---

**For AI Assistants**: This guide is your north star. When making changes, refer back to these conventions, test thoroughly, and preserve the website's premium, bilingual identity. Happy building! 🚀
