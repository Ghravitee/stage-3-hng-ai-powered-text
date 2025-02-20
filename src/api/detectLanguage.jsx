import languageNames from "../constants/languageNames";

let detectorInstance = null;

async function initializeLanguageDetector() {
  if (detectorInstance) return detectorInstance;

  try {
    if (!("ai" in self) || !("languageDetector" in self.ai)) {
      console.error("❌ Chrome AI Language Detector API is not supported.");
      return null;
    }

    const capabilities = await self.ai.languageDetector.capabilities();
    const canDetect = capabilities.capabilities;

    if (canDetect === "no") {
      console.warn("⚠️ The language detector is not usable.");
      return null;
    }

    let detector;
    if (canDetect === "readily") {
      detector = await self.ai.languageDetector.create();
    } else {
      detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(`📥 Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
      await detector.ready;
    }

    detectorInstance = detector;
    return detector;
  } catch (error) {
    console.error("❌ Error initializing Language Detector:", error);
    return null;
  }
}

async function detectLanguage(text) {
  const detector = await initializeLanguageDetector();
  if (!detector) return "API not available";

  try {
    const response = await detector.detect(text);

    // Find the detection with the highest confidence
    const highestConfidence = response.reduce((max, current) => {
      return current.confidence > max.confidence ? current : max;
    }, response[0]);

    // Use the languageNames map to get the full language name
    const languageCode = highestConfidence?.detectedLanguage || "Unknown";
    return languageNames[languageCode] || "Unknown"; // Return full language name
  } catch (error) {
    console.error("❌ Language Detection Error:", error);
    return "Error detecting language";
  }
}

export default detectLanguage;
