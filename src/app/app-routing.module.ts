import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteListComponent } from './components/note/note-list/note-list.component';
import { NoteDetailComponent } from './components/note/note-detail/note-detail.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignUpComponent } from './components/authentication/sign-up/sign-up.component';
import { NotFoundComponent } from './components/layout/not-found/not-found.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignUpComponent },
    {
        path: 'notes',
        component: NoteListComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'note/:id',
        component: NoteDetailComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'account-delete',
        component: DeleteAccountComponent,
        canActivate: [AuthGuardService]
    },
    { path: '**', pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
