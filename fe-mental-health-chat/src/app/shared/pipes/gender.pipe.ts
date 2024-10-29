import { Pipe, PipeTransform } from '@angular/core';
import { genders } from '../../core/constants/gender.constant';
import { Gender } from '../../core/models/enums/gender.enum';

@Pipe({
  name: 'gender',
  standalone: true
})
export class GenderPipe implements PipeTransform {

  private readonly genders = genders;

  transform(gender: Gender): string {
    var genderString = genders.find(g => g.key === gender);
    return genderString ? genderString.value : 'Undifined';
  }
}
