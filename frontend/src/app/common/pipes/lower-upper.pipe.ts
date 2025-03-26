import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'lowerUpperText'
})
export class LowerUpperTextPipe implements PipeTransform {
    transform(value: string | null | undefined, mode: 'toUpper' | 'toLower'): string | null {
        value = mode === 'toUpper' ? (value as string).toUpperCase() : (value as string).toLowerCase();
        return value ? value : null;
    }
}