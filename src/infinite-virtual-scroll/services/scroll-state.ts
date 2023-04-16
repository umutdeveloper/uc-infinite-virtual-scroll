import { ViewContainerRef } from '@angular/core';
import {
  setEndPlaceholderHeight,
  setScrollPosition,
  setStartPlaceholderHeight,
} from './scroll-resolver';

export class ScrollState {
  scrollPosition = 0;
  startPlaceholderHeight = 0;
  endPlaceholderHeight = 0;

  constructor(private readonly viewContainerRef: ViewContainerRef) {}

  setScrollPosition(amount: number) {
    this.scrollPosition = amount;
    setScrollPosition(this.viewContainerRef, amount);
  }

  setStartPlaceholderHeight(amount: number) {
    this.startPlaceholderHeight = amount;
    setStartPlaceholderHeight(this.viewContainerRef, amount);
  }

  setEndPlaceholderHeight(amount: number) {
    this.endPlaceholderHeight = amount;
    setEndPlaceholderHeight(this.viewContainerRef, amount);
  }
}
