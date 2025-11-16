import { Component } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {PostsComponent} from '../posts-component/posts-component';

@Component({
  selector: 'app-profile-component',
  imports: [
    MatCard,
    MatIcon,
    MatButton,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatMenu,
    MatCardContent,
    MatCardActions,
    MatIconButton,
    MatMenuItem,
    MatMenuTrigger,
    PostsComponent
  ],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss',
})
export class ProfileComponent {

}
