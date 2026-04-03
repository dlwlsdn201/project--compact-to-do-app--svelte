class ThemeStore {
    isDark = $state(false);

    toggle() {
        this.isDark = !this.isDark;
        if (typeof document !== 'undefined') {
            const html = document.documentElement;
            if (this.isDark) {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
    }

    init() {
        if (typeof window !== 'undefined') {
            const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDark = isSystemDark;
            if (isSystemDark) {
                document.documentElement.classList.add('dark');
            }
        }
    }
}

export const themeStore = new ThemeStore();
