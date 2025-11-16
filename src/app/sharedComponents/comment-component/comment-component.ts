import { Component } from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem} from "@angular/material/menu";

@Component({
  selector: 'app-comment-component',
    imports: [
        MatButton,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        MatIcon,
        MatIconButton,
        MatMenu,
        MatMenuItem
    ],
  templateUrl: './comment-component.html',
  styleUrl: './comment-component.scss',
})
export class CommentComponent {

}
