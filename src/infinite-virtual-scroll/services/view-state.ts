import { TemplateRef, ViewContainerRef } from '@angular/core';
import { getScrollPosition } from './scroll-resolver';
import { ScrollState } from './scroll-state';
import {
  createMapFor,
  createViewFor,
  findFirstItemIndex,
  getTotalHeight,
  mergeMapWith,
  setMapPropertiesFor,
} from './view-resolver';

export interface MapProperties {
  height: number;
}

export class ViewState {
  firstItemIndex = 0;
  items: any[];
  itemMap = new Map<number, MapProperties>();
  trackByMap = new Map<any, number>();

  constructor(
    private totalItemSize: number,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private scrollState: ScrollState,
    private trackBy: string
  ) {}

  update(items: any[]) {
    this.updateItems(items);
    this.scroll(true);
  }

  scroll(forceUpdate = false) {
    const scrollPosition = getScrollPosition(this.viewContainerRef);
    const firstItemIndex = findFirstItemIndex(
      this.itemMap,
      scrollPosition,
      this.totalItemSize
    );
    if (firstItemIndex !== this.firstItemIndex || forceUpdate) {
      this.firstItemIndex = firstItemIndex;
      this.updateView();
      this.updatePlaceholdersHeight();
    }
    this.scrollState.setScrollPosition(scrollPosition);
  }

  private updateItems(items: any[]) {
    const itemMap = createMapFor(items, 0);
    this.itemMap = mergeMapWith(
      items,
      itemMap,
      this.itemMap,
      this.trackByMap,
      this.trackBy
    );
    this.items = [...items];
  }

  private updateView() {
    const mapProperties: MapProperties[] = createViewFor(
      this.viewContainerRef,
      this.templateRef,
      this.firstItemIndex,
      this.items.slice(
        this.firstItemIndex,
        this.firstItemIndex + this.totalItemSize
      )
    );
    setMapPropertiesFor(this.itemMap, mapProperties, this.firstItemIndex);
  }

  private updatePlaceholdersHeight() {
    const startHeight = getTotalHeight(this.itemMap, 0, this.firstItemIndex);
    const endHeight = getTotalHeight(
      this.itemMap,
      this.firstItemIndex + this.totalItemSize + 1,
      this.items.length - 1
    );
    this.scrollState.setStartPlaceholderHeight(startHeight);
    this.scrollState.setEndPlaceholderHeight(endHeight);
  }
}
