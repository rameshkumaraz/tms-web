import { Pipe, PipeTransform } from '@angular/core';
import { TestGroup } from 'src/app/models/testGroup';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            console.log(it);
            return it.name.toLowerCase().includes(searchText);
        });
    }
}