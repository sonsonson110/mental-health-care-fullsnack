import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';
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

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: WelcomeComponent, pathMatch: 'full' },
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
        path: 'therapists',
        component: TherapistsComponent,
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
        path: 'profile',
        component: ProfileComponent,
        children: [
          { path: '', redirectTo: 'update', pathMatch: 'full' },
          { path: 'update', component: UpdateProfileComponent },
          { path: 'change-password', component: ChangePasswordComponent },
          { path: 'delete-account', component: DeleteAccountComponent },
        ],
      },
    ],
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
