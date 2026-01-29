import { Routes } from '@angular/router';
import { Summary } from './features/summary/summary';
import { AddTask } from './features/add-task/add-task';
import { Board } from './features/board/board';
import { Contacts } from './features/contacts/contacts';
import { PrivacyPolicy } from './features/privacy-policy/privacy-policy';
import { LegalNotice } from './features/legal-notice/legal-notice';
import { Help } from './features/help/help';
import { LandingPage } from './features/landing-page/landing-page';
import { LogIn } from './features/landing-page/log-in/log-in';
import { SignUp } from './features/landing-page/sign-up/sign-up';
import { authGuard } from './core/guards/auth-guard';
import { loggedInGuard } from './core/guards/logged-in-guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    canActivate: [loggedInGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LogIn },
      { path: 'signup', component: SignUp },
    ],
  },
  { path: 'summary', component: Summary, canActivate: [authGuard] },
  { path: 'add-task', component: AddTask, canActivate: [authGuard] },
  { path: 'board', component: Board, canActivate: [authGuard] },
  { path: 'contacts', component: Contacts, canActivate: [authGuard] },
  { path: 'help', component: Help, canActivate: [authGuard] },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'legal-notice', component: LegalNotice },
];
