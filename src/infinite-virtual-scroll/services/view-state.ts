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
  setTrackMap,
} from './view-resolver';

export interface MapProperties {
  height: number;
}

export class ViewState {
  firstItemIndex = 0;
  items: any[];
  itemMap = new Map<number, MapProperties>();
  trackByMap = new Map<any, number>();

  private totalItemSize: number;
  private trackBy: string;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private scrollState: ScrollState
  ) {}

  init(totalItemSize: number, trackBy: string) {
    this.totalItemSize = totalItemSize;
    this.trackBy = trackBy;
  }

  update(items: any[], reset = false) {
    this.updateItems(items, reset);
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

  private updateItems(items: any[], reset: boolean) {
    const itemMap = createMapFor(items, 0);
    if (!reset) {
      this.itemMap = mergeMapWith(
        items,
        itemMap,
        this.itemMap,
        this.trackByMap,
        this.trackBy
      );
    } else {
      this.itemMap = itemMap;
      this.trackByMap.clear();
    }
    setTrackMap(this.trackByMap, this.trackBy, items);
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
