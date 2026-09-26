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
  selectLanguageTag: {
    show: boolean;
    languages: string;
    documentId: string;
  };
  execute: () => void;
};

declare global {
  interface Window {
    translate?: TranslateApi;
    __neuralAudioTranslateInitialized?: boolean;
  }
}

const TRANSLATE_SCRIPT_ID = 'translate-js-runtime';
const LANGUAGE_SELECTOR_ID = 'neural-audio-language-selector';
const TRANSLATE_SCRIPT_SRC =
  'https://cdn.staticfile.net/translate.js/3.18.66/translate.js';

function createLanguageSelectorContainer(): void {
  if (document.getElementById(LANGUAGE_SELECTOR_ID)) {
    return;
  }

  const navbarRight = document.querySelector('.navbar__items--right');
  if (!navbarRight) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.id = LANGUAGE_SELECTOR_ID;
  wrapper.className = 'navbar__item translation-language-picker ignore';
  wrapper.setAttribute('aria-label', 'Language selector');
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '0.35rem';

  const icon = document.createElement('span');
  icon.textContent = '🌐';
  icon.setAttribute('aria-hidden', 'true');
  wrapper.appendChild(icon);

  navbarRight.insertBefore(wrapper, navbarRight.firstChild);
}

function initializeTranslate(): void {
  const translate = window.translate;

  if (!translate || window.__neuralAudioTranslateInitialized) {
    return;
  }

  window.__neuralAudioTranslateInitialized = true;

  // Neural Audio Theory is authored in English. Visitors choose translations
  // explicitly from translate.js' own language selector; no autodetect is used.
  translate.language.setLocal('english');
  translate.service.use('client.edge');

  // Put translate.js' native selector in the Docusaurus navbar. Using the
  // library's own selector keeps its change-language state and events intact.
  createLanguageSelectorContainer();
  translate.selectLanguageTag.show = true;
  translate.selectLanguageTag.documentId = LANGUAGE_SELECTOR_ID;
  translate.selectLanguageTag.languages =
    'english,spanish,french,deutsch,portuguese,italian';

  // Keep technical material intact while translating surrounding prose.
  translate.ignore?.tag?.push('pre', 'code', 'script', 'style', 'textarea');
  translate.ignore?.class?.push(
    'katex',
    'katex-display',
    'theme-code-block',
    'translation-language-picker',
  );

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
