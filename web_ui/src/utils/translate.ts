/** 仅在选择英文翻译时才加载 i18n，简体中文/禁用不加载约 330KB 的 index.js */
const NEED_TRANSLATE_LANG = "english";

function needLoadI18n(lang: string | null): boolean {
  return !!lang && lang === NEED_TRANSLATE_LANG;
}

let translateInstance: { changeLanguage: (lang: string) => void } | null = null;

async function getTranslate() {
  if (translateInstance) return translateInstance;
  const mod = await import("./i18n/index.js");
  translateInstance = mod.trans as typeof translateInstance;
  return translateInstance!;
}

const Has_Change = () => {
  let _hash = hash(document.body.innerText);
  console.log(get_hash(), _hash);
  return get_hash() !== _hash;
};

export const hash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};
const key = "c-Hash-Body";
export const set_hash = (): void => {
  localStorage.setItem(key, hash(document.body.innerText));
};

export const get_hash = (): string | null => {
  return localStorage.getItem(key);
};

export const translatePage = () => {
  const savedLanguage = localStorage.getItem("language");
  if (!needLoadI18n(savedLanguage)) return; // 仅英文时加载并执行翻译
  setTimeout(async () => {
    if (!Has_Change()) {
      console.log("未改变");
      return;
    }
    const translate = await getTranslate();
    translate.changeLanguage(savedLanguage!);
    set_hash();
  }, 1000); // 延时1000毫秒后执行语言切换
};

export const setCurrentLanguage = (language: string) => {
  localStorage.setItem("language", language);
  if (!needLoadI18n(language)) return; // 仅选英文时才加载 i18n
  getTranslate().then((translate) => translate.changeLanguage(language));
};
