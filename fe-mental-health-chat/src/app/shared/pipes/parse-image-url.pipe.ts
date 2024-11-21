import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment.dev';

@Pipe({
  name: 'parseImageUrl',
  standalone: true
})
export class ParseImageUrlPipe implements PipeTransform {

  transform(imageName: string): string {
    if (imageName) {
      return `${environment.imageUrl}/${imageName}`;
    }
    return '';
  }
}
