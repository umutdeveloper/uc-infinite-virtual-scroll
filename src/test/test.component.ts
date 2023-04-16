import { Component, OnInit } from '@angular/core';
import { InfiniteVirtualScrollModule } from '../infinite-virtual-scroll/infinite-virtual-scroll.module';
import { generateParagraph } from '../utils';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [InfiniteVirtualScrollModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  posts: { id: number; text: string }[];

  constructor() {
    setTimeout(() => (this.posts = this.generatePosts(5000, 0)), 1000);
    // setInterval(() => this.generatePosts(), 2000);
  }

  ngOnInit() {}

  generatePosts(length: number, idPrefix: number) {
    return Array.from({ length }, generateParagraph.bind(this)).map(
      (text: string, index) => ({ id: index + idPrefix, text })
    );
  }

  removeItems() {
    this.posts.splice(5, 3);
    this.posts = [...this.posts];
  }

  addItems() {
    this.posts = [
      ...this.posts,
      ...this.generatePosts(5000, this.posts.length),
    ];
  }
}
