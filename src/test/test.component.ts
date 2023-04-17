import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteVirtualScrollViewportComponent } from '../infinite-virtual-scroll/infinite-virtual-scroll-viewport/infinite-virtual-scroll-viewport.component';
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
  @ViewChild(InfiniteVirtualScrollViewportComponent)
  viewport: InfiniteVirtualScrollViewportComponent;

  posts: { id: number; text: string }[];
  lastId = 0;

  constructor() {
    setTimeout(() => (this.posts = this.generatePosts(50, this.lastId)), 1000);
    // setInterval(() => this.generatePosts(), 2000);
  }

  ngOnInit() {}

  scrollToStart() {
    this.viewport.scrollToStart();
  }

  handleScrollAtBottom() {
    this.addItems();
  }

  reset() {
    this.viewport.reset();
    this.posts = [...this.generatePosts(30, 0)];
  }

  generatePosts(length: number, idPrefix: number) {
    this.lastId += length;
    return Array.from({ length }, generateParagraph.bind(this)).map(
      (text: string, index) => ({ id: index + idPrefix, text })
    );
  }

  removeItems() {
    this.posts.splice(5, 3);
    this.posts = [...this.posts];
  }

  addItems() {
    setTimeout(
      () =>
        (this.posts = [...this.posts, ...this.generatePosts(50, this.lastId)]),
      1000
    );
  }

  addItemsToTop() {
    this.posts = [...this.generatePosts(1, this.lastId), ...this.posts];
  }
}
