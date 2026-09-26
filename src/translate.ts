type TranslateApi = {
  language: {
    setLocal: (language: string) => void;
  };
  service: {
    use: (service: string) => void;
  };
  listener: {
    start: () => void;
  };
  ignore?: {
    tag?: string[];
    class?: string[];
  };
  setAutoDiscriminateLocalLanguage: () => void;
  execute: () => void;
};

declare global {
  interface Window {
    translate?: TranslateApi;
    __neuralAudioTranslateInitialized?: boolean;
  }
}

const TRANSLATE_SCRIPT_ID = 'translate-js-runtime';
const TRANSLATE_SCRIPT_SRC =
  'https://cdn.staticfile.net/translate.js/3.18.66/translate.js';

function initializeTranslate(): void {
  const translate = window.translate;

  if (!translate || window.__neuralAudioTranslateInitialized) {
    return;
  }

  window.__neuralAudioTranslateInitialized = true;

  // Neural Audio Theory is authored in English. translate.js can then choose
  // the visitor's preferred language automatically on first visit.
  translate.language.setLocal('english');
  translate.service.use('client.edge');

  // Keep technical material intact while translating surrounding prose.
  translate.ignore?.tag?.push('pre', 'code', 'script', 'style', 'textarea');
  translate.ignore?.class?.push('katex', 'katex-display', 'theme-code-block');

  translate.setAutoDiscriminateLocalLanguage();

  // Docusaurus performs client-side navigation, so watch DOM updates and
  // translate newly rendered page content without requiring a full reload.
  translate.listener.start();
  translate.execute();
}

function loadTranslate(): void {
  if (window.translate) {
    initializeTranslate();
    return;
  }

  const existingScript = document.getElementById(
    TRANSLATE_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existingScript) {
    existingScript.addEventListener('load', initializeTranslate, {once: true});
    return;
  }

  const script = document.createElement('script');
  script.id = TRANSLATE_SCRIPT_ID;
  script.src = TRANSLATE_SCRIPT_SRC;
  script.async = true;
  script.onload = initializeTranslate;
  document.head.appendChild(script);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', loadTranslate, {once: true});
  } else {
    loadTranslate();
  }
}

export {};
