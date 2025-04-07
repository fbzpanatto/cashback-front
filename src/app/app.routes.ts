import { Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { ImportDataComponent } from "./components/import-data/import-data.component";
import { ReportComponent } from "./components/report/report.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { WhatsappComponent } from "./components/whatsapp/whatsapp.component";
import { ReportClientComponent } from "./components/report-client/report-client.component";
import { LoginComponent } from "./components/login/login.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'import-data', component: ImportDataComponent },
  { path: 'report', component: ReportComponent },
  { path: 'client/:id', component: ReportClientComponent },
  { path: 'whatsapp', component: WhatsappComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: LoginComponent },

  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
