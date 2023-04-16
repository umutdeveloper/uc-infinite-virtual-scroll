import { TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent, Subscription, tap, debounceTime } from 'rxjs';
import { ScrollState } from './scroll-state';
import { getContainer } from './view-resolver';
import { ViewState } from './view-state';

export class Scroller {
  private disposeScroller: Subscription;
  private readonly scrollState: ScrollState;
  private readonly viewState: ViewState;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly totalItemSize: number,
    private readonly trackBy: string,
    private readonly debounceTime: number
  ) {
    this.scrollState = new ScrollState(this.viewContainerRef);
    this.viewState = new ViewState(
      this.totalItemSize,
      this.viewContainerRef,
      this.templateRef,
      this.scrollState,
      this.trackBy
    );
    this.attachScrollEvent();
  }

  update(items: any[]): void {
    this.viewState.update(items);
  }

  scrollToStart() {
    this.scrollState.setScrollPosition(0);
    this.viewState.scroll();
  }

  destroy() {
    this.disposeScroller.unsubscribe();
  }

  private attachScrollEvent(): void {
    const container = getContainer(this.viewContainerRef);
    this.disposeScroller = fromEvent(container, 'scroll')
      .pipe(
        debounceTime(this.debounceTime),
        tap(() => this.viewState.scroll())
      )
      .subscribe();
  }
}
