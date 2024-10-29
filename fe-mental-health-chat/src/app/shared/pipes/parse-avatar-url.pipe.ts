import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../../core/models/enums/gender.enum';

@Pipe({
  name: 'parseAvatarUrl',
  standalone: true,
})
export class ParseAvatarUrlPipe implements PipeTransform {
  transform(avatarUrl: string | null, gender: Gender): string {
    const defaultFemaleAvatar = '/assets/default-avatar/girl.png';
    const defaultMaleAvatar = '/assets/default-avatar/boy.png';

    if (avatarUrl && this.isValidUrl(avatarUrl)) {
      return avatarUrl;
    }

    return gender === Gender.FEMALE ? defaultFemaleAvatar : defaultMaleAvatar;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }
}
