import { Component } from '@angular/core';
import {CommentComponent} from '../comment-component/comment-component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-comments-component',
  imports: [
    CommentComponent,
    NgForOf
  ],
  templateUrl: './comments-component.html',
  styleUrl: './comments-component.scss',
})
export class CommentsComponent {
  public numbers: number[] = [1,2,3,4,5,6,7,8,9];
}
