import { Routes } from '@angular/router';
import { Summary } from './features/summary/summary';
import { AddTask } from './features/add-task/add-task';
import { Board } from './features/board/board';
import { Contacts } from './features/contacts/contacts';
import { PrivacyPolicy } from './features/privacy-policy/privacy-policy';
import { LegalNotice } from './features/legal-notice/legal-notice';
import { LandingPage } from './features/landing-page/landing-page';
import { LogIn } from './features/landing-page/log-in/log-in';
import { SignUp } from './features/landing-page/sign-up/sign-up';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LogIn },
  { path: 'signup', component: SignUp },
  { path: 'summary', component: Summary },
  { path: 'add-task', component: AddTask },
  { path: 'board', component: Board },
  { path: 'contacts', component: Contacts },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'legal-notice', component: LegalNotice },
];
