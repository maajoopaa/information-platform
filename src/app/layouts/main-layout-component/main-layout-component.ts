import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatDivider, MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {NgClass, NgIf} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIconButton} from '@angular/material/button';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-main-layout-component',
  imports: [
    MatNavList,
    MatIcon,
    MatDivider,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatMenu,
    MatMenuTrigger,
    MatIconButton,
    MatMenuItem,
    NgIf
  ],
  templateUrl: './main-layout-component.html',
  styleUrl: './main-layout-component.scss',
})
export class MainLayoutComponent {
  public isCollapsed : boolean = false;
  public isAuthenticated: boolean = false;

  constructor(private auth: AuthService) {
    const userInformation = auth.getAuthData();

    if(userInformation){
      this.isAuthenticated = true;
    }

  }

  onToggleMenuClick(){
    if(!this.isCollapsed){
      this.isCollapsed = true;
    }
  }
}
