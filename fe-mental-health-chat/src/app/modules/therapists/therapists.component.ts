import { Component } from '@angular/core';
import { TherapistsStateService } from './services/therapists-state.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-therapists',
  standalone: true,
  imports: [RouterOutlet],
  providers: [TherapistsStateService],
  templateUrl: './therapists.component.html',
  styleUrl: './therapists.component.scss',
})
export class TherapistsComponent {
}
