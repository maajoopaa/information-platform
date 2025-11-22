import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostDto} from '../../api/models/post-dto';
import {postsGet} from '../../api/functions';
import {PostsComponent} from '../posts-component/posts-component';

@Component({
  selector: 'app-home-component',
  imports: [
    PostsComponent
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent implements OnInit{
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  public posts: PostDto[] = [];

  ngOnInit() {
    postsGet(this.http,this.rootUrl)
      .subscribe(res => {
        this.posts = res.body;
      })
  }
}
