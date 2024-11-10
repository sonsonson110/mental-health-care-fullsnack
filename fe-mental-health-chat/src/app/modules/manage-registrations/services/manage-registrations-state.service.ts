import { Injectable } from '@angular/core';
import { PrivateSessionRegistrationsApiService } from '../../../core/api-services/private-session-registrations-api.service';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { ClientRegistrationResponse } from '../../../core/models/modules/manage-registrations/client-registration-response.model';
import { UpdateClientRegistrationRequest } from '../../../core/models/modules/manage-registrations/update-client-registration-request.model';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ManageRegistrationsStateService {
  private isLoadingState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = this.isLoadingState.asObservable();

  private privateSessionRegistrations: BehaviorSubject<ClientRegistrationResponse[]> =
    new BehaviorSubject<ClientRegistrationResponse[]>([]);
  readonly registrations$ = this.privateSessionRegistrations.asObservable();

  constructor(
    private privateSessionRegistrationApiService: PrivateSessionRegistrationsApiService,
    private toastr: ToastrService
  ) {
    this.isLoadingState.next(true);

    this.privateSessionRegistrationApiService
      .getClientRegistrations()
      .pipe(finalize(() => this.isLoadingState.next(false)))
      .subscribe(registrations => {
        this.privateSessionRegistrations.next(registrations);
      });
  }

  getRegistrationById(id: string): ClientRegistrationResponse | null {
    return (
      this.privateSessionRegistrations.value.find(
        registration => registration.id === id
      ) || null
    );
  }

  updateRegistrationStatusById(id: string, body: UpdateClientRegistrationRequest) {
    return this.privateSessionRegistrationApiService
      .updateClientRegistration(id, body)
      .pipe(
        tap(() => {
          const updatedRegistrations = this.privateSessionRegistrations.value.map(
            registration =>
              registration.id === id
                ? {
                    ...registration,
                    status: body.status,
                    noteFromTherapist: body.noteFromTherapist,
                    id: id,
                  }
                : registration
          );
          this.privateSessionRegistrations.next(updatedRegistrations);
          this.toastr.success('Registration updated successfully');
        })
      );
  }
}
