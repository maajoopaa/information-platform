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
import {MatMenu, MatMenuItem} from '@angular/material/menu';
import {MatButton, MatIconButton} from '@angular/material/button';
import {CommentsComponent} from '../comments-component/comments-component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-post-component',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatIcon,
    MatMenu,
    MatIconButton,
    MatMenuItem,
    MatCardActions,
    MatButton,
    CommentsComponent,
    NgIf
  ],
  templateUrl: './post-component.html',
  styleUrl: './post-component.scss',
})
export class PostComponent {
  public isCommentsExpanded: boolean = false;

  onCommentsButtonClick(){
    this.isCommentsExpanded = !this.isCommentsExpanded;
  }
}
