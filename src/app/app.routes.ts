import { Routes } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { ImportDataComponent } from "./components/import-data/import-data.component";
import { ReportComponent } from "./components/report/report.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { WhatsappComponent } from "./components/whatsapp/whatsapp.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'import-data', component: ImportDataComponent },
  { path: 'report', component: ReportComponent },
  { path: 'whatsapp', component: WhatsappComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
