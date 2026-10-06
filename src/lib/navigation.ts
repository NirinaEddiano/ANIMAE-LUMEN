export interface NavItem {
  href: string;
  dbKey: string;
  labelFr: string;
  labelEn: string;
}

export const SITE_LOGO_KEY = 'site_title';
export const SITE_LOGO_DEFAULT = 'ANIMAE LUMEN';
export const SITE_EMAIL_DEFAULT = 'animaelumen@outlook.com';
export const SITE_INSTAGRAM_DEFAULT = '@animaelumen';
export const FIXED_BRAND_CONTENT_KEYS = [
  SITE_LOGO_KEY,
  'home_hero_title',
  'footer_email',
  'contact_email',
  'insta_username',
  'contact_instagram',
] as const;

export const FIXED_BRAND_VALUES: Record<(typeof FIXED_BRAND_CONTENT_KEYS)[number], string> = {
  [SITE_LOGO_KEY]: SITE_LOGO_DEFAULT,
  home_hero_title: SITE_LOGO_DEFAULT,
  footer_email: SITE_EMAIL_DEFAULT,
  contact_email: SITE_EMAIL_DEFAULT,
  insta_username: SITE_INSTAGRAM_DEFAULT,
  contact_instagram: SITE_INSTAGRAM_DEFAULT,
};

/**
 * Signature de l'artiste. Affichee sous le nom (dans le header, sous
 * ANIMAE LUMEN, et la ou le nom apparait en grand), en plus petit pour
 * rester discrete mais visible. Contenu dynamique : modifiable depuis
 * l'admin comme le reste.
 */
export const SITE_BYLINE_KEY = 'site_byline';
export const SITE_BYLINE_DEFAULT = 'by Tina Rosae';

export const NAV_ITEMS: NavItem[] = [
  { href: '/services/souls', dbKey: 'nav_souls', labelFr: 'Âmes', labelEn: 'Souls' },
  { href: '/services/events', dbKey: 'nav_events', labelFr: 'Événements', labelEn: 'Events' },
  { href: '/services/retreats', dbKey: 'nav_retreats', labelFr: 'Retraites', labelEn: 'Retreats' },
  { href: '/about', dbKey: 'nav_about', labelFr: 'À propos', labelEn: 'About' },
  { href: '/contact', dbKey: 'nav_reachout', labelFr: 'Nous contacter', labelEn: 'Reach out' },
];

/** Clés de marque : le nom et la signature, utilisées par le header et le hero. */
export const BRAND_CONTENT_KEYS = [SITE_LOGO_KEY, SITE_BYLINE_KEY];

export const NAV_CONTENT_KEYS = [SITE_LOGO_KEY, ...NAV_ITEMS.map((item) => item.dbKey)];
