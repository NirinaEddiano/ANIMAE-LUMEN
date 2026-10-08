export type Language = 'fr' | 'en';
export type ContentField = 'value_fr' | 'value_en';

export interface ContentLike {
  key: string;
  value_fr: string;
  value_en: string;
  is_deleted?: boolean | null;
}

export function fieldFor(language: Language): ContentField {
  return language === 'fr' ? 'value_fr' : 'value_en';
}

/**
 * true quand la ligne existe mais que la traduction anglaise n'a jamais été
 * faite : value_en est une copie exacte de value_fr.
 * C'est l'état laissé par l'ancien admin, qui écrivait le français dans value_en.
 */
export function isUntranslated(item: ContentLike | undefined): boolean {
  if (!item) return false;
  const fr = (item.value_fr || '').trim();
  const en = (item.value_en || '').trim();
  return !!fr && fr === en;
}

/**
 * Lecture d'un texte dans la langue active.
 *
 * Côté anglais : si value_en est vide, ou si elle est une copie du français
 * (traduction jamais faite), on renvoie le repli codé en dur en anglais.
 * C'est ce qui garantit que le site est anglais par défaut même quand la base
 * contient des données corrompues.
 *
 * Côté français : value_fr est la source d'origine, elle fait toujours foi.
 */
export function readContent(
  items: ContentLike[] | undefined | null,
  key: string,
  language: Language,
  fallback: string
): string {
  const item = items?.find((i) => i.key === key);
  if (!item) return fallback;
  if (item.is_deleted === true) return '';
  if (language === 'en' && isUntranslated(item)) return fallback;
  return ((item[fieldFor(language)] as string) || '').trim() || fallback;
}

/**
 * Lecture d'une image : les URLs sont identiques dans les deux colonnes,
 * on accepte donc la valeur de l'autre langue si celle-ci est vide.
 *
 * Volontairement SANS isUntranslated : pour une image, value_en et value_fr
 * sont légitimement la même URL. Les traiter comme « non traduites » ferait
 * disparaître la photo et renverrait par erreur sur le repli codé en dur.
 */
export function readImage(
  items: ContentLike[] | undefined | null,
  key: string,
  fallback: string
): string {
  const item = items?.find((i) => i.key === key);
  if (!item) return fallback;
  if (item.is_deleted === true) return '';
  return item.value_en || item.value_fr || fallback;
}

/** Suffixes qui désignent une photo plutôt qu'un texte. */
const IMAGE_SUFFIXES = ['_image', '_img', '_bg', '_texture', '_photo', '_avatar'];

/**
 * true si la clé correspond à une image. Utilisé par l'admin pour décider
 * d'ouvrir le sélecteur de photo plutôt qu'une zone de texte, y compris pour
 * les clés créées à la volée (qui n'ont pas encore de colonne is_image en base).
 */
export function isImageKey(key: string): boolean {
  return IMAGE_SUFFIXES.some((suffix) => key.endsWith(suffix));
}

/**
 * true si l'administrateur a masque ce contenu.
 *
 * Permet de retirer un texte ou une photo du site public sans le supprimer de
 * la base : il suffit de decocher l'interrupteur pour le faire revenir.
 */
export function isHidden(
  item: { is_hidden?: boolean | null } | undefined | null
): boolean {
  return item?.is_hidden === true;
}

/** A deleted zone is removed from public rendering while its content remains recoverable in admin. */
export function isDeleted(item: { is_deleted?: boolean | null } | undefined | null): boolean {
  return item?.is_deleted === true;
}

/**
 * Variante pour les composants quiDiposent d'une liste de contenus.
 */
export function isHiddenKey(
  items: ReadonlyArray<{ key: string; is_hidden?: boolean | null; is_deleted?: boolean | null }> | undefined | null,
  key: string
): boolean {
  const item = items?.find((i) => i.key === key);
  return isHidden(item) || isDeleted(item);
}

/** Pile de repli commune. Voir le bloc @font-face de globals.css. */
export const FONT_STACK = '"Minionpro", "EB Garamond", Georgia, serif';

/**
 * Ajoute la pile de repli à une police venue de la base.
 *
 * Indispensable : les composants posent `fontFamily` en style inline a partir de
 * `site_content.font_family`. Une valeur comme `Minionpro` posee ainsi SANS
 * famille generique fait retomber l'element sur la police par defaut du
 * navigateur (Times) des que la fonte n'est pas chargee, et le style inline
 * l'emporte sur la classe CSS qui, elle, avait un repli correct.
 */
export function fontFamilyWithFallback(font?: string | null): string | undefined {
  const name = (font ?? '').trim().replace(/^["']|["']$/g, '');
  if (!name) return undefined;
  const lower = name.toLowerCase();
  if (lower === 'minionpro' || lower === 'minion pro') return FONT_STACK;
  return `"${name}", ${FONT_STACK}`;
}
