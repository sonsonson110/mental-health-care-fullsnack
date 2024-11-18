import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../../core/models/enums/gender.enum';
import { environment } from '../../../environments/environment.dev';

@Pipe({
  name: 'parseAvatarUrl',
  standalone: true,
})
export class ParseAvatarUrlPipe implements PipeTransform {
  transform(avatarName: string | null, gender: Gender): string {
    const defaultFemaleAvatar = '/assets/default-avatar/girl.png';
    const defaultMaleAvatar = '/assets/default-avatar/boy.png';

    if (avatarName) {
      return `${environment.avatarUrl}/${avatarName}`;
    }

    return gender === Gender.FEMALE ? defaultFemaleAvatar : defaultMaleAvatar;
  }
}
