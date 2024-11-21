import { Pipe, PipeTransform } from '@angular/core';
import { publicSessionFollowTypes } from '../../core/constants/public-session-follow-type.constant';
import { PublicSessionFollowType } from '../../core/models/enums/public-session-follow-type.enum';

@Pipe({
  name: 'publicSessionFollowType',
  standalone: true
})
export class PublicSessionFollowTypePipe implements PipeTransform {
  transform(type: PublicSessionFollowType): string {
    const typeString = publicSessionFollowTypes.find(g => g.key === type);
    return typeString ? typeString.value : 'Undefined';
  }
}
