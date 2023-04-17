import { TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent, tap, debounceTime, Subscription, filter } from 'rxjs';
import { getScrollPosition, isScrollAtBottom } from './scroll-resolver';
import { ScrollState } from './scroll-state';
import { getContainer } from './view-resolver';
import { ViewState } from './view-state';

export class Scroller {
  private readonly scrollState: ScrollState;
  private readonly viewState: ViewState;
  private disposeScroller: Subscription;
  private isInitialized = false;
  private debounceTime: number;

  get onScrollAtBottom$() {
    return this.getScrollEvent().pipe(
      filter(() => isScrollAtBottom(this.viewContainerRef))
    );
  }

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.scrollState = new ScrollState(this.viewContainerRef);
    this.viewState = new ViewState(
      this.viewContainerRef,
      this.templateRef,
      this.scrollState
    );
  }

  update(items: any[]): void {
    this.viewState.update(items);
  }

  scrollToStart() {
    let scrollPosition: number;
    do {
      this.scrollState.setScrollPosition(0);
      this.viewState.scroll();
      scrollPosition = getScrollPosition(this.viewContainerRef);
    } while (scrollPosition !== 0);
  }

  reset() {
    this.viewState.update([], true);
  }

  destroy() {
    this.disposeScroller.unsubscribe();
  }

  init(totalItemSize: number, trackBy: string, debounceTime: number) {
    if (!this.isInitialized) {
      this.debounceTime = debounceTime;
      this.isInitialized = true;
      this.viewState.init(totalItemSize, trackBy);
      this.attachScrollEvent();
      this.attachScrollerToViewport();
    }
  }

  private getScrollEvent() {
    const container = getContainer(this.viewContainerRef);
    return fromEvent(container, 'scroll').pipe(debounceTime(this.debounceTime));
  }

  private attachScrollEvent() {
    this.disposeScroller = this.getScrollEvent()
      .pipe(tap(() => this.viewState.scroll()))
      .subscribe();
  }

  private attachScrollerToViewport() {
    const container = getContainer(this.viewContainerRef) as HTMLElement & {
      scroller: Scroller;
    };
    container.scroller = this;
  }
}
