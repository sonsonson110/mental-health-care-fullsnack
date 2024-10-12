import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';
import { AiChatConversationComponent } from './modules/ai-chat/components/ai-chat-conversation/ai-chat-conversation.component';
import { LoginComponent } from './modules/login/login.component';
import { AiChatComponent } from './modules/ai-chat/ai-chat.component';
import { RegisterComponent } from './modules/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: WelcomeComponent, pathMatch: 'full' },
      {
        path: 'ai-chat',
        component: AiChatComponent,
        children: [
          { path: '', component: AiChatConversationComponent, pathMatch: 'full' },
          { path: ':id', component: AiChatConversationComponent },
        ],
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
