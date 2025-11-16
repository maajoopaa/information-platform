import { Component } from '@angular/core';
import {PostComponent} from '../post-component/post-component';
import {NgForOf, NgIf} from '@angular/common';
import {CommentsComponent} from '../comments-component/comments-component';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-posts-component',
  imports: [
    PostComponent,
    NgForOf,
    MatButton,
    MatIcon,
  ],
  templateUrl: './posts-component.html',
  styleUrl: './posts-component.scss',
})
export class PostsComponent {
  public numbers: number[] = [1,2,3,4,5,6,7,8,9];
  public isCommentsExpanded: boolean = false;

  onCommentsButtonClick(){
    this.isCommentsExpanded = !this.isCommentsExpanded;
  }
}
