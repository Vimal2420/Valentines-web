# 💕 Valentine's Day Website

A responsive, playful two-page website asking "Will you be my Valentine?" with an evasive "No" button that cannot be caught, followed by a congratulations page with Instagram contact info.

## Features

✨ **Responsive Design** — Works perfectly on phones (320px), tablets (768px), desktops (1024px+), and landscape orientations.

🖤 **Black & Red Theme** — Modern dark mode with vibrant red accents, heart decorations, and smooth animations.

🎯 **Evasive "No" Button** — The "No" button moves away on hover/touch, changes positions, and cannot be clicked:
- CSS hover escape animation on desktop
- JavaScript position swapping on mobile/touch
- Throttled, smooth movement that keeps button in viewport
- Works with keyboard and accessibility tools

📸 **Instagram Integration** — Congrats page displays your Instagram handle with:
- Direct link to your Instagram profile
- Copy-to-clipboard functionality for your handle
- App-scheme fallback for mobile (opens Instagram app if installed)

♿ **Accessibility** — WCAG-friendly with:
- Semantic HTML structure
- ARIA labels and live regions for screen readers
- Keyboard navigation (Tab, Enter, Space)
- Respects `prefers-reduced-motion` for users who prefer minimal animations
- High contrast mode support
- Touch-friendly button targets (48px minimum)

📱 **Mobile-Optimized** — Disables evasive antics on screens < 360px wide to prevent user frustration.

## File Structure

```
kazhap/
├── index.html           # Page 1: Valentine question
├── congrats.html        # Page 2: Congratulations message
├── styles.css           # Mobile-first responsive styling
├── app.js               # Evasive button logic & interactivity
├── assets/
│   └── heart.png        # Decorative heart image
└── README.md            # This file
```

## Setup

### 1. Add Your Instagram Handle

Edit `app.js` and update the `CONFIG` object:

```javascript
const CONFIG = {
    instagram_handle: 'your_instagram_handle', // ← Change this to your handle
    // ... other settings
};
```

### 2. Place the Heart Image

Ensure `assets/heart.png` exists in the workspace. The file should be:
- A heart-shaped image (PNG recommended)
- Minimum 200×200px, ideally 400×400px (2x resolution)
- Transparent or dark background for the black theme

If the image doesn't exist, create the `assets/` folder:

```bash
mkdir assets
```

Then place your `heart.png` file in that folder.

### 3. Open in a Browser

- **Local testing**: Open `index.html` directly in your browser, or use a local server:
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Or Node.js (with http-server)
  npx http-server
  ```
  Then navigate to `http://localhost:8000` in your browser.

- **Deployment**: Deploy the entire folder to any static hosting (GitHub Pages, Vercel, Netlify, etc.).

## How It Works

### Page 1: `index.html`
- Displays a Valentine question with decorative heart animation
- **YES Button** → Navigates to `congrats.html`
- **NO Button** → Moves away when you try to click it (evasive behavior)
  - On desktop (mouse): CSS hover animation + JS mouse tracking
  - On mobile (touch): Button positions swap when tapped
  - On keyboard: Styled focus state but still evasive
- **Skip Link** → Accessibility fallback for keyboard users who want to skip the game

### Page 2: `congrats.html`
- Shows congratulations message with animated heart
- Displays your Instagram handle (`@your_handle`)
- **Message Me Button** → Opens your Instagram profile (web or app)
- **Copy Handle Button** → Copies your handle to clipboard for easy sharing

## Customization

### Change Colors

Edit `:root` CSS variables in `styles.css`:

```css
:root {
    --color-bg: #000000;        /* Background (black) */
    --color-primary: #c21616;   /* Accent (red) */
    --color-primary-dark: #8b0f0f; /* Darker red */
    /* ... more variables */
}
```

### Adjust Button Behavior

Edit `CONFIG` in `app.js`:

```javascript
const CONFIG = {
    instagram_handle: 'your_handle',
    no_button_min_distance: 50,      // Minimum pixels to move
    button_container_padding: 20,    // Padding inside container
    disable_evasion_below_width: 360, // Disable evasion on small screens
    throttle_delay: 50,              // Delay between moves (ms)
};
```

### Customize Text & Messages

- Page 1 title: Edit `<h1>` in `index.html`
- Page 2 title: Edit `<h1>` in `congrats.html`
- Footer message: Edit `.footer-message` text
- Button labels: Edit button content

## Testing Checklist

- [ ] **Mouse Desktop**: Click YES, try clicking NO (should evade)
- [ ] **Touch Mobile**: Tap YES, try tapping NO (should swap positions)
- [ ] **Keyboard Only**: Tab to buttons, press Enter/Space
- [ ] **Screen Reader**: NVDA/JAWS (Windows), VoiceOver (Mac/iOS), TalkBack (Android)
- [ ] **Responsive Widths**: 320px, 375px, 600px, 768px, 1024px, 1440px
- [ ] **Orientations**: Portrait and landscape
- [ ] **Animations**: Check reduced motion preference (`prefers-reduced-motion`)
- [ ] **Copy Button**: Verify Instagram handle is copied to clipboard
- [ ] **Instagram Links**: Test on mobile (with/without app installed) and desktop
- [ ] **Cross-browser**: Chrome, Firefox, Edge, Safari (desktop & mobile)

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile, Firefox Mobile, Samsung Internet

## Accessibility Notes

- The NO button is intentionally evasive but provides:
  - Keyboard focus (visual outline when using Tab)
  - Screen reader label: "No button (This button will try to evade your clicks!)"
  - Accessible skip link for those who prefer not to play the game
- All buttons meet WCAG AA contrast standards (white/red on black)
- Touch targets are minimum 48×48px for accessibility
- Animations respect `prefers-reduced-motion` system preference
- Color is not the only way to distinguish buttons (uses text labels and borders)

## Tips & Tricks

1. **Instagram App on Mobile**: Install Instagram on your phone to allow the app-scheme link to work and open the app directly.
2. **Copy-to-Clipboard**: Works in modern browsers; older browsers will show a fallback message.
3. **Sharing**: Share the URL to `index.html` directly with others (it's self-contained and portable).
4. **Analytics**: Add Google Analytics or similar to track congratulations and Instagram link clicks.

## Troubleshooting

### "NO button is too easy to click on mobile"
- The button position-swaps on touch attempts. If it still feels easy, increase `no_button_min_distance` in `app.js`.

### "Heart image isn't showing"
- Verify `assets/heart.png` exists and the path is correct
- Check browser console for 404 errors
- Use a PNG or JPG file with transparent/dark background

### "Evasion doesn't work on my phone"
- The `touchstart` handler swaps button positions; ensure the Instagram app is **not** intercepting the touch event
- Try on a different mobile browser (Chrome, Firefox, Safari)

### "Screen reader doesn't announce the evasive behavior"
- The ARIA label explains this in the skip link; the behavior is intentional and accessible via keyboard alternative

## License

Free to use and modify for personal or non-commercial purposes. ❤️

---

**Made with 💕 and JavaScript**
