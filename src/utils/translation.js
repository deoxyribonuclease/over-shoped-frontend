
import Cookies from 'js-cookie';

const googleTranslateConfig = {
    lang: "uk",
};

export const initGoogleTranslate = () => {
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=TranslateWidgetIsLoaded";
    document.head.appendChild(script);

    window.TranslateWidgetIsLoaded = function () {
        TranslateInit(googleTranslateConfig);
    };

    document.querySelectorAll("[data-google-lang]").forEach((button) => {
        button.addEventListener("click", () => {
            const languageCode = button.getAttribute("data-google-lang");
            handleLanguageChange(languageCode);
        });
    });
};

const TranslateInit = (config) => {
    new window.google.translate.TranslateElement(
        {
            pageLanguage: config.lang,
            includedLanguages: "uk,en,ru",
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
        },
        "google_translate_element"
    );
};

const handleLanguageChange = (languageCode) => {
    TranslateCookieHandler(`/${googleTranslateConfig.lang}/${languageCode}`);
    window.location.reload();
};

const TranslateCookieHandler = (val) => {
    Cookies.set("googtrans", val, { path: "/" });
};


