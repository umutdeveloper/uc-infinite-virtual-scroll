import { TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent, tap, debounceTime, map, Subject, Subscription } from 'rxjs';
import { isScrollAtBottom } from './scroll-resolver';
import { ScrollState } from './scroll-state';
import { getContainer } from './view-resolver';
import { ViewState } from './view-state';

export class Scroller {
  private readonly _onScrollAtBottom$ = new Subject<void>();
  private readonly scrollState: ScrollState;
  private readonly viewState: ViewState;
  private disposeScroller: Subscription;
  private isInitialized = false;

  get onScrollAtBottom$() {
    return this._onScrollAtBottom$.asObservable();
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
    this.scrollState.setScrollPosition(0);
    this.viewState.scroll();
  }

  reset() {
    this.viewState.update([], true);
  }

  destroy() {
    this.disposeScroller.unsubscribe();
  }

  init(totalItemSize: number, trackBy: string, debounceTime: number) {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.viewState.init(totalItemSize, trackBy);
      this.attachScrollEvent(debounceTime);
      this.attachScrollerToViewport();
    }
  }

  private attachScrollEvent(debounce: number) {
    const container = getContainer(this.viewContainerRef);
    this.disposeScroller = fromEvent(container, 'scroll')
      .pipe(
        debounceTime(debounce),
        tap(() => {
          this.viewState.scroll();
          if (isScrollAtBottom(this.viewContainerRef)) {
            this._onScrollAtBottom$.next();
          }
        })
      )
      .subscribe();
  }

  private attachScrollerToViewport() {
    const container = getContainer(this.viewContainerRef) as HTMLElement & {
      scroller: Scroller;
    };
    container.scroller = this;
  }
}
