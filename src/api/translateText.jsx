import languageNames from "../constants/languageNames";

function isTranslatorAPISupported() {
  return "ai" in self && "translator" in self.ai;
}

// Example usage check
if (isTranslatorAPISupported()) {
  console.log("✅ The Translator API is supported.");
} else {
  console.log("❌ The Translator API is NOT supported.");
}

function getLanguageCode(language) {
  // Convert full language name to abbreviation if needed
  const code = Object.keys(languageNames).find(
    (key) => languageNames[key].toLowerCase() === language.toLowerCase()
  );
  return code || language; // If not found, assume it's already a valid code
}

async function translateText(text, sourceLang, targetLang) {
  if (!isTranslatorAPISupported()) {
    console.error("❌ Chrome AI Translator API is not supported.");
    return { error: "API not supported" };
  }

  if (!text) {
    console.error("❌ No text provided for translation!");
    return { error: "No text to translate" };
  }

  if (!targetLang) {
    console.error("❌ Target language is missing!");
    return { error: "Invalid target language" };
  }

  sourceLang = getLanguageCode(sourceLang);
  targetLang = getLanguageCode(targetLang);

  // ✅ Prevent unnecessary translation for same-language pairs
  if (sourceLang === targetLang) {
    console.log(
      "🔄 Source and target languages are the same. Returning original text."
    );
    return {
      originalText: text,
      translatedText: text, // No translation needed
      detectedLanguage: sourceLang,
    };
  }

  try {
    console.log(`🌍 Translating from ${sourceLang} to ${targetLang}...`);

    const translatorCapabilities = await self.ai.translator.capabilities();
    const availability = translatorCapabilities.languagePairAvailable(
      sourceLang,
      targetLang
    );

    if (availability === "no") {
      console.error("❌ Translation not supported for this language pair.");
      return { error: "Translation not supported" };
    }

    const translator = await self.ai.translator.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`📥 Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });

    const translatedText = await translator.translate(text);
    return {
      originalText: text,
      translatedText,
      detectedLanguage: sourceLang,
    };
  } catch (error) {
    console.error("❌ Translation Error:", error);
    return { error: "Error translating text" };
  }
}

export default translateText;
