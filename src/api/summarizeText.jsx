// This function checks if the Chrome AI Summarizer API is available.
async function isSummarizerAPISupported() {
  if (!("ai" in self)) {
    return false;
  }

  if (!("summarizer" in self.ai)) {
    return false;
  }

  console.log("Summarizer API is supported!");
  return true;
}

// This function summarizes the given text using Chrome’s AI Summarizer API.
async function summarizeText(message) {
  if (!(await isSummarizerAPISupported())) {
    console.error("Chrome AI Summarizer API is not supported.");
    return { error: "Summarizer API not supported" };
  }

  try {
    const capabilities = await self.ai.summarizer.capabilities();

    if (!capabilities || capabilities.available === "no") {
      console.error("Summarizer API is unavailable.");
      return { error: "Summarizer API is unavailable." };
    }
    const options = {
      sharedContext: "Summarize concisely without introductory phrases",
      type: "tl;dr",
      format: "plain-text",
      length: "medium",
    };

    // Initializing the Summarizer
    let summarizer;

    if (capabilities.available === "readily") {
      summarizer = await self.ai.summarizer.create(options);
    } else {
      summarizer = await self.ai.summarizer.create({
        ...options,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            console.log(
              `Download Progress: ${e.loaded} / ${e.total} bytes (${(
                (e.loaded / e.total) *
                100
              ).toFixed(2)}%)`
            );
          });
        },
      });
      await summarizer.ready;
    }

    console.log("Summarizer is ready. Processing text...");

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

    console.log("Final Cleaned Summary:", cleanedSummary);

    return {
      originalText: message.text,
      summary: cleanedSummary,
    };
  } catch (error) {
    console.error("Summarization Error:", error);
    return { error: "Error summarizing text. Please try again." };
  }
}

export default summarizeText;
