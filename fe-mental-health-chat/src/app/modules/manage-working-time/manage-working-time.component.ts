import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ManageAvailabilityTemplateComponent } from './components/manage-availability-template/manage-availability-template.component';
import { ManageAvailabilityOverridesComponent } from './components/manage-availability-overrides/manage-availability-overrides.component';
import { ManageAvailabilityTemplateStateService } from './services/manage-availability-template-state.service';
import { ManageAvailabilityOverridesStateService } from './services/manage-availability-overrides-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-manage-working-time',
  standalone: true,
  imports: [
    MatTabsModule,
    ManageAvailabilityTemplateComponent,
    ManageAvailabilityOverridesComponent,
  ],
  providers: [
    ManageAvailabilityTemplateStateService,
    ManageAvailabilityOverridesStateService,
  ],
  templateUrl: './manage-working-time.component.html',
  styleUrl: './manage-working-time.component.scss',
})
export class ManageWorkingTimeComponent implements OnInit {
  activeTabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.activeTabIndex = params['tab'] ? +params['tab'] : 0;
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.activeTabIndex },
      queryParamsHandling: 'merge',
    });
  }
}
