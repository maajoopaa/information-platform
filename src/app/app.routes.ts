import { Routes } from '@angular/router';
import {MainLayoutComponent} from './layouts/main-layout-component/main-layout-component';
import {PostComponent} from './sharedComponents/post-component/post-component';
import {PostsComponent} from './sharedComponents/posts-component/posts-component';

export const routes: Routes = [
  {path: "", component: MainLayoutComponent,
  children: [
    {path: "home", component: PostsComponent},
  ]},
];
