export class SettingsManager {
  constructor() {
    this.modalOpen = false;
    this.containerId = "settings-panel";

    // --- УМНОЕ ОПРЕДЕЛЕНИЕ ЯЗЫКА СИСТЕМЫ ---
    const getSystemLanguage = () => {
      // Поддерживаемые языки в Синсю
      const supportedLangs = ["ru", "en", "ja"];

      // Берем язык из системы (например, 'ru-RU' или 'en-US')
      const systemLang = (
        navigator.languages?.[0] ||
        navigator.language ||
        "en"
      ).toLowerCase();

      // Отрезаем всё после дефиса (получаем просто 'ru' или 'en')
      const shortLang = systemLang.split("-")[0];

      // Если язык системы есть в нашем списке — ставим его. Иначе — строгий английский.
      return supportedLangs.includes(shortLang) ? shortLang : "en";
    };

    this.defaultSettings = {
      fullscreen: "full",
      parallax: "on",
      bgmVolume: 50,
      sfxVolume: 100,
      textSpeed: 70,
      language: getSystemLanguage(),
    };

    // Словарь для перевода интерфейса настроек
    this.uiTranslations = {
      ru: {
        settings_header: "[ НАСТРОЙКИ СИСТЕМЫ ]",
        group_graphics: "ЭКРАН И ГРАФИКА",
        lbl_fullscreen: "Режим экрана",
        btn_window: "Окно",
        btn_full: "Полный",
        lbl_parallax: "Эффект параллакса",
        btn_on: "Вкл",
        btn_off: "Выкл",
        lbl_lang: "Язык",
        group_sound: "ЗВУК И ТЕКСТ",
        lbl_bgm: "Громкость музыки",
        lbl_sfx: "Громкость звуков",
        lbl_text_speed: "Скорость текста",
        btn_reset: "[ СБРОС ]",
        manual_header: "СПРАВОЧНИК",
        // Глобальные кнопки интерфейса игры (уже были)
        btn_save: "[ СОХРАНИТЬ ]",
        btn_load: "[ ЗАГРУЗИТЬ ]",
        btn_history: "[ ИСТОРИЯ ]",
        btn_settings: "[ НАСТРОЙКИ ]",
        history_title: "История",
        hk_next_pc: `<span class="key">[ ЛКМ / Пробел / -> / Колёсико вниз ]</span><span class="desc">Далее</span>`,
        hk_skip_pc: `<span class="key">[ Ctrl ]</span><span class="desc">Промотка</span>`,
        hk_history_pc: `<span class="key">[ H / Колёсико вверх ]</span><span class="desc">История</span>`,
        hk_saveload_pc: `<span class="key">[ S / L ]</span><span class="desc">Сохр. / Загрузить</span>`,
        hk_settings_pc: `<span class="key">[ O ]</span><span class="desc">Настройки</span>`,
        hk_hideui_pc: `<span class="key">[ ПКМ ]</span><span class="desc">Скрыть интерфейс</span>`,

        hk_next_mob: `<span class="key">[ Тап по экрану ]</span><span class="desc">Далее</span>`,
        hk_skip_mob: `<span class="key">[ Удержание ]</span><span class="desc">Промотка</span>`,
        hk_history_mob: `<span class="key">[ Свайп вниз ]</span><span class="desc">История</span>`,
        hk_hideui_mob: `<span class="key">[ Свайп вверх ]</span><span class="desc">Скрыть интерфейс</span>`,
        // --- ГЛАВНОЕ МЕНЮ И ДИСКЛЕЙМЕР ---
        disclaimer_title: "ВНИМАНИЕ!",
        disclaimer_body: `
          <p>Эта игра содержит откровенные сцены жестокости, наготы и множество фетишей, способных вызвать сильное возбуждение.</p>
          <p>Проект находится в стадии ранней демо-версии — возможны баги и недоработки.</p>
          <p>Всем персонажам строго больше 18 лет. И вам, игрок, тоже должно быть не меньше! Если это не так, то господь вам судья.</p>
          <p class="click-to-continue">
            <span class="desktop-hint">[ Кликните по пустому месту, чтобы продолжить ]</span>
            <span class="mobile-hint">[ Коснитесь экрана, чтобы продолжить ]</span>
          </p>`,
        credits_hint_pc: "(Кликните по пустому месту, чтобы продолжить)",
        credits_hint_mob: "(Коснитесь экрана, чтобы продолжить)",
        menu_new_game: "Новая игра",
        menu_load_game: "Загрузить",
        menu_settings: "Настройки",
        menu_gallery: "Галерея",
        menu_exit: "Выход",
        gallery_title: "ГАЛЕРЕЯ",
        exit_wait: "Я БУДУ ЖДАТЬ ТВОЕГО ВОЗВРАЩЕНИЯ...",
        confirm_reset: "ВОССТАНОВИТЬ НАСТРОЙКИ ПО УМОЛЧАНИЮ?",
        btn_menu: "[ В МЕНЮ ]",
        confirm_yes: "[ ДА ]",
        confirm_no: "[ ОТМЕНА ]",
        confirm_exit_menu: "ВЫЙТИ В ГЛАВНОЕ МЕНЮ? НЕ ЗАБУДЬ СОХРАНИТЬСЯ.",
        confirm_delete_save: "БЕЗВОЗВРАТНО УДАЛИТЬ ДАННЫЕ В СЛОТЕ ",
        confirm_overwrite_save: "ПЕРЕЗАПИСАТЬ ДАННЫЕ В СЛОТЕ ",
        sl_title_save: "[ СОХРАНИТЬ ДАННЫЕ ]",
        sl_title_load: "[ ЗАГРУЗИТЬ ДАННЫЕ ]",
        sl_page: "Страница",
        sl_autosave: "АВТОСОХРАНЕНИЕ",
        sl_slot: "СЛОТ",
        sl_empty: "Пусто",
        sl_delete_title: "Удалить слот",
      },
      en: {
        settings_header: "[ SYSTEM SETTINGS ]",
        group_graphics: "SCREEN & GRAPHICS",
        lbl_fullscreen: "Display Mode",
        btn_window: "Window",
        btn_full: "Fullscreen",
        lbl_parallax: "Parallax Effect",
        btn_on: "On",
        btn_off: "Off",
        lbl_lang: "Language",
        group_sound: "SOUND & TEXT",
        lbl_bgm: "Music Volume",
        lbl_sfx: "SFX Volume",
        lbl_text_speed: "Text Speed",
        btn_reset: "[ RESET ]",
        manual_header: "MANUAL",
        // Глобальные кнопки интерфейса игры
        btn_save: "[ SAVE ]",
        btn_load: "[ LOAD ]",
        btn_history: "[ LOG ]",
        btn_settings: "[ SETTINGS ]",
        history_title: "History Log",
        hk_next_pc: `<span class="key">[ LMB / Space / -> / Scroll Down ]</span><span class="desc">Next</span>`,
        hk_skip_pc: `<span class="key">[ Ctrl ]</span><span class="desc">Skip</span>`,
        hk_history_pc: `<span class="key">[ H / Scroll Up ]</span><span class="desc">Log</span>`,
        hk_saveload_pc: `<span class="key">[ S / L ]</span><span class="desc">Save / Load</span>`,
        hk_settings_pc: `<span class="key">[ O ]</span><span class="desc">Settings</span>`,
        hk_hideui_pc: `<span class="key">[ RMB ]</span><span class="desc">Hide UI</span>`,

        hk_next_mob: `<span class="key">[ Tap screen ]</span><span class="desc">Next</span>`,
        hk_skip_mob: `<span class="key">[ Hold ]</span><span class="desc">Skip</span>`,
        hk_history_mob: `<span class="key">[ Swipe Down ]</span><span class="desc">Log</span>`,
        hk_hideui_mob: `<span class="key">[ Swipe Up ]</span><span class="desc">Hide UI</span>`,
        // --- ГЛАВНОЕ МЕНЮ И ДИСКЛЕЙМЕР ---
        disclaimer_title: "WARNING!",
        disclaimer_body: `
          <p>This game contains explicit scenes of violence, nudity, and various fetishes that may cause strong arousal.</p>
          <p>This is an early demo version — bugs and unfinished features are possible.</p>
          <p>All characters are strictly over 18 years old. You, the player, must be of legal age as well! If not, God will be your judge.</p>
          <p class="click-to-continue">
            <span class="desktop-hint">[ Click anywhere to continue ]</span>
            <span class="mobile-hint">[ Tap the screen to continue ]</span>
          </p>`,
        credits_hint_pc: "(Click anywhere to continue)",
        credits_hint_mob: "(Tap the screen to continue)",
        menu_new_game: "New Game",
        menu_load_game: "Load Game",
        menu_settings: "Settings",
        menu_gallery: "Gallery",
        menu_exit: "Exit",
        gallery_title: "GALLERY",
        exit_wait: "I WILL WAIT FOR YOUR RETURN...",
        confirm_reset: "RESTORE DEFAULT SETTINGS?",
        btn_menu: "[ TO MENU ]",
        confirm_yes: "[ YES ]",
        confirm_no: "[ CANCEL ]",
        confirm_exit_menu: "EXIT TO MAIN MENU? DON'T FORGET TO SAVE.",
        confirm_delete_save: "PERMANENTLY DELETE DATA IN SLOT ",
        confirm_overwrite_save: "OVERWRITE DATA IN SLOT ",
        sl_title_save: "[ SAVE DATA ]",
        sl_title_load: "[ LOAD DATA ]",
        sl_page: "Page",
        sl_autosave: "AUTOSAVE",
        sl_slot: "SLOT",
        sl_empty: "Empty",
        sl_delete_title: "Delete slot",
      },
      ja: {
        settings_header: "[ システム設定 ]",
        group_graphics: "画面・グラフィック",
        lbl_fullscreen: "表示モード",
        btn_window: "ウィンドウ",
        btn_full: "フルスクリーン",
        lbl_parallax: "パララックス効果",
        btn_on: "オン",
        btn_off: "オフ",
        lbl_lang: "言語",
        group_sound: "音声・テキスト",
        lbl_bgm: "BGM音量",
        lbl_sfx: "SE音量",
        lbl_text_speed: "テキスト速度",
        btn_reset: "[ リセット ]",
        manual_header: "マニュアル",
        // Глобальные кнопки интерфейса игры
        btn_save: "[ セーブ ]",
        btn_load: "[ ロード ]",
        btn_history: "[ ログ ]",
        btn_settings: "[ 設定 ]",
        history_title: "テキスト履歴",
        hk_next_pc: `<span class="key">[ 左クリック / スペース / -> / 下スクロール ]</span><span class="desc">次へ</span>`,
        hk_skip_pc: `<span class="key">[ Ctrl ]</span><span class="desc">スキップ</span>`,
        hk_history_pc: `<span class="key">[ H / 上スクロール ]</span><span class="desc">ログ</span>`,
        hk_saveload_pc: `<span class="key">[ S / L ]</span><span class="desc">セーブ / ロード</span>`,
        hk_settings_pc: `<span class="key">[ O ]</span><span class="desc">設定</span>`,
        hk_hideui_pc: `<span class="key">[ 右クリック ]</span><span class="desc">UI非表示</span>`,

        hk_next_mob: `<span class="key">[ タップ ]</span><span class="desc">次へ</span>`,
        hk_skip_mob: `<span class="key">[ 長押し ]</span><span class="desc">スキップ</span>`,
        hk_history_mob: `<span class="key">[ 下スワイプ ]</span><span class="desc">ログ</span>`,
        hk_hideui_mob: `<span class="key">[ 上スワイプ ]</span><span class="desc">UI非表示</span>`,
        // --- ГЛАВНОЕ МЕНЮ И ДИСКЛЕЙМЕР ---
        disclaimer_title: "警告！",
        disclaimer_body: `
          <p>本作には、暴力的なシーン、過激な性描写、および強い性的興奮を引き起こす可能性のある様々なフェティッシュ要素が含まれています。</p>
          <p>本作は早期デモ版であり、バグや未完成の部分が含まれる場合があります。</p>
          <p>登場する全キャラクターは18歳以上です。プレイヤーの皆様も同様に18歳以上である必要があります！もしそうでなければ、神の裁きを受けるでしょう。</p>
          <p class="click-to-continue">
            <span class="desktop-hint">[ 画面をクリックして続行 ]</span>
            <span class="mobile-hint">[ 画面をタップして続行 ]</span>
          </p>`,
        credits_hint_pc: "(画面をクリックして続行)",
        credits_hint_mob: "(画面をタップして続行)",
        menu_new_game: "ニューゲーム",
        menu_load_game: "ロード",
        menu_settings: "設定",
        menu_gallery: "ギャラリー",
        menu_exit: "終了",
        gallery_title: "ギャラリー",
        exit_wait: "あなたが戻るのを待っています...",
        confirm_reset: "設定を初期化しますか？",
        btn_menu: "[ メニュー ]",
        confirm_yes: "[ はい ]",
        confirm_no: "[ キャンセル ]",
        confirm_exit_menu:
          "メインメニューに戻りますか？ セーブを忘れないでください。",
        confirm_delete_save: "スロットのデータを完全に削除しますか: スロット ",
        confirm_overwrite_save: "スロットのデータを上書きしますか: スロット ",
        sl_title_save: "[ データをセーブ ]",
        sl_title_load: "[ データをロード ]",
        sl_page: "ページ",
        sl_autosave: "オートセーブ",
        sl_slot: "スロット",
        sl_empty: "空",
        sl_delete_title: "スロットを削除",
      },
    };

    // Загружаем сохраненные или берем базовые
    this.settings = this.loadSettings();

    // Теперь, когда словарь готов, мы можем строить и переводить интерфейс!
    this._initUI();
    this._applySettingsOnLoad();
    this._updateUIFromSettings();
  }

  // --- РАБОТА С ПАМЯТЬЮ ---
  loadSettings() {
    const saved = localStorage.getItem("sota_settings");
    if (saved) {
      return { ...this.defaultSettings, ...JSON.parse(saved) };
    }
    return { ...this.defaultSettings };
  }

  saveCurrentSettings() {
    localStorage.setItem("sota_settings", JSON.stringify(this.settings));
  }

  resetToDefaults() {
    const currentLang = this.settings.language;
    Object.assign(this.settings, this.defaultSettings);
    this.settings.language = currentLang;
    this.saveCurrentSettings();
    this._updateUIFromSettings();
    this._applySettingsOnLoad();
  }

  // Применяем настройки к самой игре (вызывается при старте и сбросе)
  _applySettingsOnLoad() {
    if (this.settings.parallax === "off") {
      document.body.classList.add("disable-parallax");
    } else {
      document.body.classList.remove("disable-parallax");
    }

    // Применяем полный экран (ТОЛЬКО ДЛЯ NW.JS)
    if (this.settings.fullscreen === "full" && typeof nw !== "undefined") {
      nw.Window.get().enterFullscreen();
    } else if (
      this.settings.fullscreen === "window" &&
      typeof nw !== "undefined"
    ) {
      nw.Window.get().leaveFullscreen();
    }
    if (this.settings.fullscreen === "full" && typeof nw === "undefined") {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  }

  // Обновляем визуальное состояние кнопок в меню настроек
  _updateUIFromSettings() {
    const panel = document.getElementById(this.containerId);
    if (!panel) return;

    // Обновляем тумблеры полного экрана
    const fsBtns = panel.querySelectorAll("#fullscreen-toggle .toggle-btn");
    fsBtns.forEach((b) => b.classList.remove("active"));
    const activeFs = panel.querySelector(
      `#fullscreen-toggle .toggle-btn[data-val="${this.settings.fullscreen}"]`,
    );
    if (activeFs) activeFs.classList.add("active");

    // Обновляем тумблеры параллакса
    const pxBtns = panel.querySelectorAll("#parallax-toggle .toggle-btn");
    pxBtns.forEach((b) => b.classList.remove("active"));
    const activePx = panel.querySelector(
      `#parallax-toggle .toggle-btn[data-val="${this.settings.parallax}"]`,
    );
    if (activePx) activePx.classList.add("active");
  }

  // ... (дальше идет _initUI)

  _initUI() {
    const panel = document.createElement("div");
    panel.id = this.containerId;
    panel.className = "modal-panel";

    panel.innerHTML = `
      <div id="settings-inner">
        <button class="modal-close-btn" id="close-settings-btn" title="Закрыть">[ × ]</button>
        
        <div class="settings-layout">
          <!-- ЛЕВАЯ ЧАСТЬ: НАСТРОЙКИ (60%) -->
          <div class="settings-left">
            <div class="modal-header" data-i18n="settings_header">[ НАСТРОЙКИ СИСТЕМЫ ]</div>
            <div class="settings-list">
              
              <!-- ГРУППА 1: ГРАФИКА -->
              <div class="settings-group">
                <div class="group-title" data-i18n="group_graphics">ЭКРАН И ГРАФИКА</div>
                
                <div class="settings-row" id="row-fullscreen">
                  <span class="settings-label" data-i18n="lbl_fullscreen">Режим экрана</span>
                  <div class="toggle-group" id="fullscreen-toggle">
                    <button class="toggle-btn active" data-val="window" data-i18n="btn_window">Окно</button>
                    <button class="toggle-btn" data-val="full" data-i18n="btn_full">Полный</button>
                  </div>
                </div>

                <div class="settings-row">
                  <span class="settings-label" data-i18n="lbl_parallax">Эффект параллакса</span>
                  <div class="toggle-group" id="parallax-toggle">
                    <button class="toggle-btn active" data-val="on" data-i18n="btn_on">Вкл</button>
                    <button class="toggle-btn" data-val="off" data-i18n="btn_off">Выкл</button>
                  </div>
                </div>
              </div>

              <div class="settings-row" id="row-language">
                  <span class="settings-label" data-i18n="lbl_lang">Язык</span>
                  <div class="toggle-group" id="language-toggle">
                    <button class="toggle-btn ${this.settings.language === "ru" ? "active" : ""}" data-val="ru">Русский</button>
                    <button class="toggle-btn ${this.settings.language === "en" ? "active" : ""}" data-val="en">English</button>
                    <button class="toggle-btn ${this.settings.language === "ja" ? "active" : ""}" data-val="ja">日本語</button>
                  </div>
              </div>
              
              <div class="settings-group">
                <div class="group-title" data-i18n="group_sound">ЗВУК И ТЕКСТ</div>
                
                <div class="settings-row">
                  <span class="settings-label" data-i18n="lbl_bgm">Громкость музыки</span>
                  <input type="range" id="bgm-slider" class="settings-slider" min="0" max="100" value="${this.settings.bgmVolume}">
                </div>
                
                <div class="settings-row">
                  <span class="settings-label" data-i18n="lbl_sfx">Громкость звуков</span>
                  <input type="range" id="sfx-slider" class="settings-slider" min="0" max="100" value="${this.settings.sfxVolume}">
                </div>

                <div class="settings-row">
                  <span class="settings-label" data-i18n="lbl_text_speed">Скорость текста</span>
                  <input type="range" id="text-speed-slider" class="settings-slider" min="10" max="100" value="${this.settings.textSpeed}">
                </div>
              </div>

            </div>
            <button class="reset-btn" data-i18n="btn_reset">[ СБРОС ]</button>
          </div>

          <!-- ПРАВАЯ ЧАСТЬ: СПРАВОЧНИК -->
          <div class="settings-right">
            <div class="manual-header" data-i18n="manual_header">СПРАВОЧНИК</div>
            <div class="manual-content">
              <div class="hotkey-row"><span class="key">[ ЛКМ / Пробел / -> ]</span><span class="desc" data-i18n="hk_next">Далее</span></div>
              <div class="hotkey-row"><span class="key">[ Ctrl ]</span><span class="desc" data-i18n="hk_skip">Промотка</span></div>
              <div class="hotkey-row"><span class="key">[ H / Scroll]</span><span class="desc" data-i18n="hk_history">История</span></div>
              <div class="hotkey-row"><span class="key">[ S / L ]</span><span class="desc" data-i18n="hk_saveload">Сохранить / Загрузить</span></div>
              <div class="hotkey-row"><span class="key">[ O ]</span><span class="desc" data-i18n="hk_settings">Настройки</span></div>
              <div class="hotkey-row"><span class="key">[ ПКМ ]</span><span class="desc" data-i18n="hk_hideui">Скрыть интерфейс</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // --- КНОПКА ЗАКРЫТИЯ (которую мы случайно сломали) ---
    const closeBtn = panel.querySelector("#close-settings-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // --- АДАПТАЦИЯ ПОД МОБИЛЬНЫЕ УСТРОЙСТВА ---
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      !!window.cordova ||
      !!window.Capacitor;

    const manualContent = panel.querySelector(".manual-content");
    if (manualContent) {
      if (isTouchDevice) {
        const fsRow = panel.querySelector("#row-fullscreen");
        if (fsRow) fsRow.style.display = "none";

        // МАЙ ФИКС: Используем атрибут data-i18n-html
        manualContent.innerHTML = `
          <div class="hotkey-row" data-i18n-html="hk_next_mob"></div>
          <div class="hotkey-row" data-i18n-html="hk_skip_mob"></div>
          <div class="hotkey-row" data-i18n-html="hk_history_mob"></div>
          <div class="hotkey-row" data-i18n-html="hk_hideui_mob"></div>
        `;
      } else {
        manualContent.innerHTML = `
          <div class="hotkey-row" data-i18n-html="hk_next_pc"></div>
          <div class="hotkey-row" data-i18n-html="hk_skip_pc"></div>
          <div class="hotkey-row" data-i18n-html="hk_history_pc"></div>
          <div class="hotkey-row" data-i18n-html="hk_saveload_pc"></div>
          <div class="hotkey-row" data-i18n-html="hk_settings_pc"></div>
          <div class="hotkey-row" data-i18n-html="hk_hideui_pc"></div>
        `;
      }
    }

    // --- ЛОГИКА НАСТРОЕК ГРАФИКИ ---
    const fsToggleBtns = panel.querySelectorAll(
      "#fullscreen-toggle .toggle-btn",
    );
    fsToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("open");
        const val = e.target.getAttribute("data-val");
        this.settings.fullscreen = val;
        this.saveCurrentSettings();
        this._updateUIFromSettings();
        if (val === "full") {
          document.documentElement
            .requestFullscreen?.()
            .catch((err) => console.warn(err));
        } else {
          // Убираем проверку document.fullscreenElement — вызываем безусловно
          document.exitFullscreen?.().catch((err) => console.warn(err));
        }
      });
    });

    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        this.settings.fullscreen = "full";
      } else {
        this.settings.fullscreen = "window";
      }
      this.saveCurrentSettings();
      this._updateUIFromSettings();
    });

    const parallaxToggleBtns = panel.querySelectorAll(
      "#parallax-toggle .toggle-btn",
    );
    parallaxToggleBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        window.playUISound("open");
        const val = e.target.getAttribute("data-val");
        this.settings.parallax = val;
        this.saveCurrentSettings();
        this._updateUIFromSettings();
        if (val === "off") {
          document.body.classList.add("disable-parallax");
        } else {
          document.body.classList.remove("disable-parallax");
        }
      });
    });

    // --- ЛОГИКА АУДИО И ТЕКСТА ---
    const bgmSlider = panel.querySelector("#bgm-slider");
    const sfxSlider = panel.querySelector("#sfx-slider");
    const tsSlider = panel.querySelector("#text-speed-slider");

    if (bgmSlider) {
      bgmSlider.addEventListener("input", (e) => {
        this.settings.bgmVolume = parseInt(e.target.value);
        if (window.audioManager) window.audioManager.updateVolumes();
      });
      bgmSlider.addEventListener("change", () => {
        this.saveCurrentSettings();
        if (window.playUISound) window.playUISound("open");
      });
    }

    if (sfxSlider) {
      sfxSlider.addEventListener("input", (e) => {
        this.settings.sfxVolume = parseInt(e.target.value);
        if (window.audioManager) window.audioManager.updateVolumes();
      });
      sfxSlider.addEventListener("change", () => {
        this.saveCurrentSettings();
        if (window.playUISound) window.playUISound("open");
      });
    }

    if (tsSlider) {
      tsSlider.addEventListener("input", (e) => {
        this.settings.textSpeed = parseInt(e.target.value);
      });
      tsSlider.addEventListener("change", () => {
        this.saveCurrentSettings();
        if (window.playUISound) window.playUISound("open");
      });
    }

    // --- Кнопка СБРОСА ---
    const resetBtn = panel.querySelector(".reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        // МАЙ ФИКС: Достаем текст из нашего словаря
        const lang = this.settings.language || "ru";
        const confirmText =
          this.uiTranslations[lang]?.confirm_reset ||
          "ВОССТАНОВИТЬ НАСТРОЙКИ ПО УМОЛЧАНИЮ?";

        window.showConfirm(confirmText, () => {
          this.resetToDefaults();
          // Обновляем ползунки после сброса
          if (bgmSlider) bgmSlider.value = this.settings.bgmVolume;
          if (sfxSlider) sfxSlider.value = this.settings.sfxVolume;
          if (tsSlider) tsSlider.value = this.settings.textSpeed;
        });
      });
    }

    // --- ЗАКРЫТИЕ ПО КЛИКУ В ПУСТОТУ (на затемненный фон) ---
    panel.addEventListener("click", (e) => {
      if (e.target === panel) {
        e.stopPropagation();
        this.close();
      }
    });

    // --- ЛОГИКА СМЕНЫ ЯЗЫКА ---
    const langToggleBtns = panel.querySelectorAll(
      "#language-toggle .toggle-btn",
    );
    langToggleBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        window.playUISound("click");

        langToggleBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        const val = e.target.getAttribute("data-val");
        this.settings.language = val;
        this.saveCurrentSettings();
        this.applyTranslations(); // переводит UI настроек, меню и т.д.

        if (typeof window.loadStoryLanguage === "function") {
          await window.loadStoryLanguage(val);
        }

        const mainMenu = document.getElementById("main-menu-screen");
        const isInGame =
          mainMenu && window.getComputedStyle(mainMenu).display === "none";

        if (isInGame && window.sm?.currentSceneId) {
          // Если сейчас активны выборы — просто перерисовываем их
          if (window.sm.cs?.isActive) {
            const scene = window.sm.story[window.sm.currentSceneId];

            // Обновляем диалоговое окно перед перерисовкой выборов
            if (scene) {
              const line = scene.lines?.[window.sm.currentLineIndex] ?? scene;
              const dialogBoxEl = document.getElementById("dialog-box");

              if (line.speaker) {
                window.sm.ui?.updateNameTag?.(line.speaker);
              }
              if (dialogBoxEl && line.text) {
                dialogBoxEl.textContent =
                  typeof line.text === "object"
                    ? (line.text[val] ?? line.text["ru"])
                    : line.text;
              }
            }

            if (scene?.choices) {
              window.sm.cs.showChoices(
                scene.choices,
                (nextId) => window.sm.loadScene(nextId),
                window.sm.am,
              );
            }
          } else {
            const audioState = window.sm?.am?.getSaveState?.() || null;
            await window.sm.loadScene(
              window.sm.currentSceneId,
              window.sm.currentLineIndex,
              true,
              audioState,
            );
          }
        }
      });
    });

    this.applyTranslations();
  }

  open() {
    if (this.modalOpen) return;

    // Закрываем другие модалки
    if (window.saveManager && window.saveManager.modalOpen)
      window.saveManager.close();
    if (window.sm && window.sm.hm && window.sm.hm.modalOpen)
      window.sm.hm.hideHistory();

    window.playUISound("open");
    this.modalOpen = true;
    document.getElementById(this.containerId).classList.add("active");

    // Показываем общий блюр (он тоже забирает клики)
    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.add("active");

    // Блокируем клики по текстовому окну на всякий случай
    const dialogWrapper = document.getElementById("dialog-wrapper");
    if (dialogWrapper) dialogWrapper.style.pointerEvents = "none";
  }

  close() {
    if (!this.modalOpen) return;

    window.playUISound("close");
    this.modalOpen = false;
    document.getElementById(this.containerId).classList.remove("active");

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.remove("active");

    const dialogWrapper = document.getElementById("dialog-wrapper");
    if (dialogWrapper) dialogWrapper.style.pointerEvents = "auto";
  }

  // Мгновенно переводит все элементы с атрибутами data-i18n и data-i18n-html
  applyTranslations() {
    const lang = this.settings.language || "ru";
    const dict = this.uiTranslations[lang];
    if (!dict) return;
    window.sm?.ui?.refreshDocument?.();

    // Перевод обычного текста
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Перевод строк с HTML тегами (наши кнопки ЛКМ, ПКМ и т.д.)
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  }
}
