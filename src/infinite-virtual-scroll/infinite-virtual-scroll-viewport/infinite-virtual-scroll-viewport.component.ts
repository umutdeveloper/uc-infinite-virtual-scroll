import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { Scroller } from '../services/scroller';

@Component({
  selector: 'app-infinite-virtual-scroll-viewport',
  templateUrl: './infinite-virtual-scroll-viewport.component.html',
  styleUrls: ['./infinite-virtual-scroll-viewport.component.css'],
})
export class InfiniteVirtualScrollViewportComponent
  implements AfterViewInit, OnDestroy
{
  @Output() onScrollAtBottom = new EventEmitter<void>();

  private scroller?: Scroller;
  private done$ = new Subject<void>();

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.scroller = this.elementRef.nativeElement.firstChild.scroller;
    this.listenScrollerEvents();
  }

  ngOnDestroy() {
    this.done$.next();
    this.done$.complete();
  }

  scrollToStart() {
    this.scroller.scrollToStart();
  }

  reset() {
    this.scroller.reset();
  }

  private listenScrollerEvents() {
    this.listenScrollAtBottom();
  }

  private listenScrollAtBottom() {
    this.scroller.onScrollAtBottom$
      .pipe(
        takeUntil(this.done$),
        map(() => this.onScrollAtBottom.emit())
      )
      .subscribe();
  }
}
