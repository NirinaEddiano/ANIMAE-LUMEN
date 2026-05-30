// Script de traduction automatique gratuit FR -> EN
export async function translateToEnglish(text: string): Promise<string> {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data[0][0][0]; // Retourne le texte traduit en anglais
  } catch (error) {
    console.error("Erreur de traduction automatique :", error);
    return text; // Retourne le texte d'origine en cas d'erreur de réseau
  }
}