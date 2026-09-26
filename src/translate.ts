type TranslateApi = {
  language: {
    setLocal: (language: string) => void;
    getLanguage?: () => string;
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
  selectLanguageTag?: {
    show: boolean;
  };
  changeLanguage: (language: string) => void;
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

const LANGUAGES = [
  {id: 'english', label: 'English'},
  {id: 'spanish', label: 'Español'},
  {id: 'french', label: 'Français'},
  {id: 'deutsch', label: 'Deutsch'},
  {id: 'portuguese', label: 'Português'},
  {id: 'italian', label: 'Italiano'},
] as const;

function createLanguageSelector(translate: TranslateApi): void {
  if (document.getElementById(LANGUAGE_SELECTOR_ID)) {
    return;
  }

  const navbarRight = document.querySelector('.navbar__items--right');
  if (!navbarRight) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.id = LANGUAGE_SELECTOR_ID;
  wrapper.className = 'navbar__item translation-language-picker';
  wrapper.setAttribute('aria-label', 'Language selector');
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '0.35rem';

  const icon = document.createElement('span');
  icon.textContent = '🌐';
  icon.setAttribute('aria-hidden', 'true');

  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Language');
  select.style.background = 'transparent';
  select.style.color = 'inherit';
  select.style.border = '1px solid var(--ifm-color-emphasis-300)';
  select.style.borderRadius = '6px';
  select.style.padding = '0.3rem 0.45rem';
  select.style.font = 'inherit';
  select.style.cursor = 'pointer';

  for (const language of LANGUAGES) {
    const option = document.createElement('option');
    option.value = language.id;
    option.textContent = language.label;
    select.appendChild(option);
  }

  select.value = 'english';
  select.addEventListener('change', () => {
    translate.changeLanguage(select.value);
  });

  wrapper.append(icon, select);
  navbarRight.insertBefore(wrapper, navbarRight.firstChild);

  window.setTimeout(() => {
    const currentLanguage = translate.language.getLanguage?.();
    if (currentLanguage && LANGUAGES.some((language) => language.id === currentLanguage)) {
      select.value = currentLanguage;
    }
  }, 0);
}

function initializeTranslate(): void {
  const translate = window.translate;

  if (!translate || window.__neuralAudioTranslateInitialized) {
    return;
  }

  window.__neuralAudioTranslateInitialized = true;

  // Neural Audio Theory is authored in English. Visitors choose translations
  // explicitly from the navbar selector; there is no browser-language autodetect.
  translate.language.setLocal('english');
  translate.service.use('client.edge');

  // Hide translate.js' built-in picker because the site provides its own navbar UI.
  if (translate.selectLanguageTag) {
    translate.selectLanguageTag.show = false;
  }

  // Keep technical material and the language picker itself intact while translating.
  translate.ignore?.tag?.push('pre', 'code', 'script', 'style', 'textarea');
  translate.ignore?.class?.push(
    'katex',
    'katex-display',
    'theme-code-block',
    'translation-language-picker',
  );

  createLanguageSelector(translate);

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
