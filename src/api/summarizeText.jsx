async function isSummarizerAPISupported() {
  console.log("🔍 Checking if Summarizer API is supported...");

  if (!("ai" in self)) {
    console.error("❌ self.ai is undefined. Chrome AI API may not be enabled.");
    return false;
  }

  if (!("summarizer" in self.ai)) {
    console.error(
      "❌ self.ai.summarizer is undefined. Summarizer API may not be available."
    );
    return false;
  }

  console.log("✅ Summarizer API is supported!");
  return true;
}

async function summarizeText(message) {
  console.log("🚀 summarizeText function called with:", message);

  if (!(await isSummarizerAPISupported())) {
    console.error("❌ Chrome AI Summarizer API is NOT supported.");
    return { error: "Summarizer API not supported" };
  }

  try {
    console.log("🔍 Checking Summarizer API capabilities...");
    const capabilities = await self.ai.summarizer.capabilities();

    if (!capabilities || capabilities.available === "no") {
      console.error("❌ Summarizer API is unavailable.");
      return { error: "Summarizer API is unavailable." };
    }
    const options = {
      sharedContext: "Summarize concisely without introductory phrases",
      type: "tl;dr",
      format: "plain-text",
      length: "medium",
    };

    let summarizer;

    if (capabilities.available === "readily") {
      summarizer = await self.ai.summarizer.create(options);
    } else {
      summarizer = await self.ai.summarizer.create({
        ...options,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(
              `📥 Download Progress: ${e.loaded} / ${e.total} bytes (${(
                (e.loaded / e.total) *
                100
              ).toFixed(2)}%)`
            );
          });
        },
      });
      await summarizer.ready;
    }

    console.log("✅ Summarizer is ready. Processing text...");

    // **Using Streaming for Better Handling**
    let result = "";
    let previousLength = 0;
    const stream = await summarizer.summarizeStreaming(message.text);

    for await (const segment of stream) {
      const newContent = segment.slice(previousLength);
      previousLength = segment.length;
      result += newContent;
    }

    console.log("🔹 Raw Streaming Summary:", result);

    // **Post-processing to clean up duplicates & markdown**
    let summaryArray = result.split("\n");

    const cleanedSummary = [
      ...new Set(
        summaryArray.map((line) =>
          line
            .replace(/^\*\*|\*\*$/g, "") // Remove **bold**
            .replace(/^\*|\*$/g, "") // Remove *italic*
            .replace(/^-\s+/g, "") // Remove leading bullet points
            .replace(/^\d+\.\s+/g, "") // Remove numbered list items
            .trim()
        )
      ),
    ].filter((line) => line.length > 0); // Remove empty lines

    console.log("🔹 Final Cleaned Summary:", cleanedSummary);

    return {
      originalText: message.text,
      summary: cleanedSummary,
    };
  } catch (error) {
    console.error("❌ Summarization Error:", error);
    return { error: "Error summarizing text. Please try again." };
  }
}

export default summarizeText;
