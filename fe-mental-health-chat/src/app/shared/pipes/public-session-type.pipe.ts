import { Pipe, PipeTransform } from '@angular/core';
import { publicSessionTypes } from '../../core/constants/public-session-type.constant';
import { PublicSessionType } from '../../core/models/enums/public-session-type.enum';

@Pipe({
  name: 'publicSessionType',
  standalone: true
})
export class PublicSessionTypePipe implements PipeTransform {

  private readonly publicSessionTypes = publicSessionTypes

  transform(type: PublicSessionType): string {
    const typeString = publicSessionTypes.find(g => g.key === type);
    return typeString ? typeString.value : 'Undefined';
  }

}
