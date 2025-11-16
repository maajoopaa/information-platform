import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatDivider, MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-main-layout-component',
  imports: [
    MatNavList,
    MatIcon,
    MatDivider,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    NgClass,
    RouterOutlet,
    MatMenu,
    MatMenuTrigger,
    MatIconButton,
    MatMenuItem
  ],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.scss',
})
export class MainLayoutComponent {
  public isCollapsed : boolean = false;

  onToggleMenuClick(){
    if(!this.isCollapsed){
      this.isCollapsed = true;
    }
  }
}
