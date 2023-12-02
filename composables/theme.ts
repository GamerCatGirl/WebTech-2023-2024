export enum Theme {
    light,
    dark,
}
let theme = ref(Theme.light);
export function initializeTheme() {
    theme = useCookie("theme", { default: () => Theme.light });
}
export function getTheme() {
    return theme;
}
