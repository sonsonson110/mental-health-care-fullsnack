import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { TherapistChatsConversationComponent } from './modules/therapist-chats/components/therapist-chats-conversation/therapist-chats-conversation.component';
import { TherapistChatsComponent } from './modules/therapist-chats/therapist-chats.component';
import { AiChatsComponent } from './modules/ai-chats/ai-chats.component';
import { AiChatsConversationComponent } from './modules/ai-chats/components/ai-chats-conversation/ai-chats-conversation.component';

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
        component: TherapistChatsComponent,
        children: [
          { path: '', component: TherapistChatsConversationComponent, pathMatch: 'full' },
          { path: ':id', component: TherapistChatsConversationComponent },
        ],
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
