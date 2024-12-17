import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { AiChatsComponent } from './modules/ai-chats/ai-chats.component';
import { AiChatsConversationComponent } from './modules/ai-chats/components/ai-chats-conversation/ai-chats-conversation.component';
import { P2pConversationComponent } from './shared/components/p2p-conversation/p2p-conversation.component';
import { P2pConversationChatboxComponent } from './shared/components/p2p-conversation/components/p2p-conversation-chatbox/p2p-conversation-chatbox.component';
import { TherapistsComponent } from './modules/therapists/therapists.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { UpdateProfileComponent } from './modules/profile/components/update-profile/update-profile.component';
import { ChangePasswordComponent } from './modules/profile/components/change-password/change-password.component';
import { DeleteAccountComponent } from './modules/profile/components/delete-account/delete-account.component';
import { authGuard } from './core/guards/auth.guard';
import { publicOnlyGuard } from './core/guards/public-only.guard';
import { TherapistDetailComponent } from './modules/therapists/components/therapist-detail/therapist-detail.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ManageRegistrationsComponent } from './modules/manage-registrations/manage-registrations.component';
import { therapistOnlyGuard } from './core/guards/therapist-only.guard';
import { TherapistSummariesComponent } from './modules/therapists/components/therapist-summaries/therapist-summaries.component';
import { ManageSchedulesComponent } from './modules/manage-schedules/manage-schedules.component';
import { MyPublicSessionsComponent } from './modules/my-public-sessions/my-public-sessions.component';
import { PublicSessionsComponent } from './modules/public-sessions/public-sessions.component';
import { MySchedulesComponent } from './modules/my-schedules/my-schedules.component';
import { PostsComponent } from './modules/posts/posts.component';
import { ManageWorkingTimeComponent } from './modules/manage-working-time/manage-working-time.component';
import { PublicSessionDetailComponent } from './modules/public-sessions/components/public-session-detail/public-session-detail.component';
import { RegistrationsComponent } from './modules/profile/components/registrations/registrations.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'ai-chats',
        component: AiChatsComponent,
        children: [
          { path: '', component: AiChatsConversationComponent, pathMatch: 'full' },
          { path: ':id', component: AiChatsConversationComponent },
        ],
      },
      {
        path: 'therapist-chats',
        component: P2pConversationComponent,
        data: { forModule: 'therapist-chats' },
        children: [
          { path: '', component: P2pConversationChatboxComponent, pathMatch: 'full' },
          {
            path: ':id',
            component: P2pConversationChatboxComponent,
            data: { forModule: 'therapist-chats' },
          },
        ],
      },
      {
        path: 'posts',
        component: PostsComponent,
      },
      {
        path: 'therapists',
        component: TherapistsComponent,
        children: [
          { path: '', component: TherapistSummariesComponent, pathMatch: 'full' },
          {
            path: ':id',
            component: TherapistDetailComponent,
          },
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        children: [
          { path: '', redirectTo: 'update', pathMatch: 'full' },
          { path: 'update', component: UpdateProfileComponent },
          { path: 'change-password', component: ChangePasswordComponent },
          { path: 'delete-account', component: DeleteAccountComponent },
          { path: 'registrations', component: RegistrationsComponent },
        ],
      },
      {
        path: 'public-sessions',
        component: PublicSessionsComponent,
      },
      { path: 'public-sessions/:id', component: PublicSessionDetailComponent },
      {
        path: 'my-schedules',
        component: MySchedulesComponent,
      },
      {
        path: 'client-chats',
        component: P2pConversationComponent,
        data: { forModule: 'client-chats' },
        children: [
          { path: '', component: P2pConversationChatboxComponent, pathMatch: 'full' },
          {
            path: ':id',
            component: P2pConversationChatboxComponent,
            data: { forModule: 'client-chats' },
          },
        ],
      },
      {
        path: 'manage-registrations',
        component: ManageRegistrationsComponent,
        canActivate: [therapistOnlyGuard],
      },
      {
        path: 'manage-schedules',
        component: ManageSchedulesComponent,
        canActivate: [therapistOnlyGuard],
      },
      {
        path: 'my-public-sessions',
        component: MyPublicSessionsComponent,
        canActivate: [therapistOnlyGuard],
      },
      {
        path: 'manage-working-time',
        component: ManageWorkingTimeComponent,
        canActivate: [therapistOnlyGuard],
      },
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
    ],
  },

  { path: 'login', component: LoginComponent, canActivate: [publicOnlyGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [publicOnlyGuard] },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
