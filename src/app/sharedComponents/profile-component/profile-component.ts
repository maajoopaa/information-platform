import {Component, inject, OnInit} from '@angular/core';
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
import {UserDto} from '../../api/models/user-dto';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth-service';
import {PostDto} from '../../api/models/post-dto';
import {usersUserIdPostsGet} from '../../api/fn/users/users-user-id-posts-get';
import {NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {usersUserIdGet} from '../../api/fn/users/users-user-id-get';

@Component({
  selector: 'app-profile-component',
  imports: [
    MatCard,
    MatIcon,
    PostsComponent,
    NgIf,
    MatButton
  ],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss',
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  public userId: string = '';
  public currentUser: UserDto | null = null;
  public userFromRequest: UserDto | null = null;
  public userFromRequestPosts: PostDto[] = [];
  public userFromRequestLikesCount: number = 0;

  constructor(private auth: AuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id')!;

      this.loadUserFromLocalStorage();
      this.loadUser();
    });
  }

  private loadUserFromLocalStorage(){
    const authData = this.auth.getAuthData();

    if(authData){
      this.currentUser = authData.user || null;
    }
  }

  private loadUser() {
    if (!this.userId) return;

    usersUserIdGet(this.http, this.rootUrl, {
      userId: this.userId
    }).subscribe({
      next: res => {
        this.userFromRequest = res.body;

        this.loadPosts();
      },
      error: err => {
        console.error('Ошибка получения пользователя:', err);
      }
    });
  }

  private loadPosts() {
    if (!this.userFromRequest?.id) return;

    usersUserIdPostsGet(this.http, this.rootUrl, {
      userId: this.userFromRequest.id
    }).subscribe({
      next: res => {
        this.userFromRequestPosts = res.body || [];
        this.userFromRequestLikesCount = this.userFromRequestPosts.reduce(
          (sum, x) => sum + (x.likes?.length || 0),
          0
        );
      },
      error: err => {
        console.error('Ошибка получения постов:', err);
      }
    });
  }

  public onPostCreated(post: PostDto) {
    if(post){
      this.userFromRequestPosts.push(post);
    }
  }
}
