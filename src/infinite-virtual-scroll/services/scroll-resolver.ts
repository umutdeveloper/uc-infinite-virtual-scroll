import { ViewContainerRef } from '@angular/core';
import { getContainer } from './view-resolver';

export function getScrollPosition(viewContainerRef: ViewContainerRef) {
  const container = getContainer(viewContainerRef);
  return container.scrollTop;
}

export function setScrollPosition(
  viewContainerRef: ViewContainerRef,
  amount: number
) {
  const container = getContainer(viewContainerRef);
  container.scrollTop = amount;
}

export function setStartPlaceholderHeight(
  viewContainerRef: ViewContainerRef,
  amount: number
) {
  const container = getContainer(viewContainerRef);
  const startPlaceholder = container.firstElementChild as HTMLElement;
  startPlaceholder.style.height = `${amount}px`;
}

export function setEndPlaceholderHeight(
  viewContainerRef: ViewContainerRef,
  amount: number
) {
  const container = getContainer(viewContainerRef);
  const endPlaceholder = container.lastElementChild as HTMLElement;
  endPlaceholder.style.height = `${amount}px`;
}
