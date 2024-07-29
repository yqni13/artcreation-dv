import { KeyValue } from "@angular/common";

export const ThemeOptionEnum: KeyValue<number, string>[] = [
    { key: 0, value: 'lightMode' },
    { key: 1, value: 'darkMode' }
];

export type ThemeOption = 'lightMode' | 'darkMode';

export const ThemeOption = {
    lightMode: 'lightMode' as ThemeOption,
    darkMode: 'darkMode' as ThemeOption
};