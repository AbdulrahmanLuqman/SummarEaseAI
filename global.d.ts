// global.d.ts
export {};

interface AITranslator {
  translate(text: string): Promise<string>;
  destroy(): void;
}

interface AITranslatorCreateOptions {
  sourceLanguage: string;
  targetLanguage: string;
}

interface AITranslatorCapabilities {
  languagePairAvailable: (
    sourceLanguage: string,
    targetLanguage: string
  ) => "no" | "readily" | "after-download";
}

interface AITranslatorFactory {
  capabilities(): Promise<AITranslatorCapabilities>;
  create(options: AITranslatorCreateOptions): Promise<AITranslator>;
}

interface AILanguageDetectorResult {
  detectedLanguage: string | null;
  confidence: number;
}

interface AILanguageDetector {
    detect(input: string, options?: { signal?: AbortSignal }): Promise<AILanguageDetectorResult[]>;
    destroy(): void;
    ready?: Promise<void>; // Add this line
  }
  

interface AILanguageDetectorFactory {
  capabilities(options?: object): Promise<{ available: boolean | "readily" | "after-download" | "no" }>;
  create(options?: object): Promise<AILanguageDetector>;
}

type AILanguageModelFactory = object;

// ===== Summarizer API Types =====

export interface AISummarizerOptions {

  sharedContext?: string;

  type?: "key-points" | "tl;dr" | "teaser" | "headline";

  format?: "markdown" | "plain-text";

  length?: "short" | "medium" | "long";
}

interface AISummarizerCapabilities {
  available: "no" | "readily" | "after-download";
}

interface AISummarizer extends EventTarget {

  summarize(text: string, options?: { context?: string }): Promise<string>;

  destroy(): void;

  ready?: Promise<void>;
}

interface AISummarizerFactory {

  capabilities(): Promise<AISummarizerCapabilities>;
  create(options?: AISummarizerOptions): Promise<AISummarizer>;
}

declare global {
  interface Window {
    ai: {
      languageModel: AILanguageModelFactory;
      summarizer: AISummarizerFactory;
      languageDetector: AILanguageDetectorFactory;
      translator: AITranslatorFactory;
    };
  }
}