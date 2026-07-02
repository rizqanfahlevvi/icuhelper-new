// Google Fonts URLs per font ID. Lexend is omitted — pre-loaded in index.html.
const FONT_URLS: Record<string, string> = {
  inter:           'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
  roboto:          'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap',
  jetbrains:       'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap',
  poppins:         'https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800;900&display=swap',
  montserrat:      'https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap',
  'plus-jakarta':  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap',
  outfit:          'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap',
  'space-grotesk': 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
  'fira-code':     'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap',
  quicksand:       'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap',
};

// Track which fonts have already had their <link> injected this session.
const loadedFonts = new Set<string>(['lexend', 'system']);

/**
 * Dynamically injects a Google Fonts <link> tag for the given font ID.
 * No-ops if the font is already loaded or doesn't require a remote file.
 */
export function loadFont(fontId: string): void {
  if (loadedFonts.has(fontId)) return;
  const url = FONT_URLS[fontId];
  if (!url) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
  loadedFonts.add(fontId);
}
