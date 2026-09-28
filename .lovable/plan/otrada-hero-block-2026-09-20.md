# Otrada hero block

## Build
- Replace the placeholder home page with a full-viewport residential construction hero matching the supplied reference.
- Use the uploaded house photograph as a full-bleed background with a controlled dark overlay.
- Add the Otrada wordmark, navigation, headline, supporting line, and two call-to-action links.
- Make the navigation collapse cleanly on small screens while keeping the key action visible.

## Design system
- Define a restrained cool-blue, charcoal, glass, and white token palette in the global stylesheet.
- Use Zen Old Mincho for display text and Geist for interface/body text, loaded in the document head.
- Add subtle entrance motion and accessible reduced-motion behavior.

## SEO and quality
- Add unique Russian title, description, Open Graph, and Twitter metadata to the home page.
- Use semantic heading, navigation, and descriptive image text.
- Verify the finished page at desktop and mobile sizes and check the preview build status.

## Technical note
Implement the page as a backend-free static export with metadata embedded in the generated HTML, ready for ordinary static hosting. The project’s supported TanStack Start stack will prerender the page at build time, providing the requested Next.js-style SSG output without dynamic SSR.
