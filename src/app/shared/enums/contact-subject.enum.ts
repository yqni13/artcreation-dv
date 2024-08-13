import { KeyValue } from "@angular/common";

export const SubjectOptionEnum: KeyValue<number, string>[] = [
    { key: 0, value: 'art order' },
    { key: 1, value: 'general request' },
    { key: 2, value: 'specific information' },
];

export type SubjectOptions = 'art order' | 'general request' | 'specific information';

export const SubjectOptions = {
    artOrder: 'art order' as SubjectOptions,
    generalRequest: 'general request' as SubjectOptions,
    specificInformation: 'specific information' as SubjectOptions,
};