import { Routes } from '@angular/router';
import {MainLayoutComponent} from './layouts/main-layout-component/main-layout-component';
import {PostComponent} from './sharedComponents/post-component/post-component';
import {PostsComponent} from './sharedComponents/posts-component/posts-component';
import {ChatComponent} from './sharedComponents/chat-component/chat-component';
import {ChatsComponent} from './sharedComponents/chats-component/chats-component';
import {ProfileComponent} from './sharedComponents/profile-component/profile-component';
import {LoginComponent} from './sharedComponents/login-component/login-component';
import {HomeComponent} from './sharedComponents/home-component/home-component';
import {RegisterComponent} from './sharedComponents/register-component/register-component';
import {AuthGuard} from './guards/auth-guard';
import {GuestGuard} from './guards/guest-guard';
import {OwnerGuard} from './guards/owner-guard';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [GuestGuard],
  },
  {path: "", component: MainLayoutComponent,
  children: [
    {
      path: "",
      component: HomeComponent
    },
    {
      path: "users/:id",
      children: [
        {
          path: "profile",
          component: ProfileComponent
        },
        {
          path: "chats",
          component: ChatsComponent,
          canActivate: [OwnerGuard]
        },
      ]
    },
  ]},
];
