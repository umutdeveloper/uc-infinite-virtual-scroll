import { TemplateRef, ViewContainerRef } from '@angular/core';
import { getScrollPosition } from './scroll-resolver';
import { ScrollState } from './scroll-state';
import {
  createMapFor,
  createViewFor,
  findFirstItemIndex,
  findFirstVisibleItem,
  findNewIndex,
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
    const visibleItemInfo = this.calculateVisibleItemInfo(items);
    this.updateItems(items, reset);
    this.scroll(visibleItemInfo, true);
  }

  scroll(
    visibleItemInfo: {
      scrollPosition: number;
      viewportOffsetTop: number;
      index: number;
    } = this.calculateVisibleItemInfo(),
    forceUpdate = false
  ) {
    const { scrollPosition } = visibleItemInfo;
    const firstItemIndex = findFirstItemIndex(
      this.itemMap,
      scrollPosition,
      this.totalItemSize
    );
    if (firstItemIndex !== this.firstItemIndex || forceUpdate) {
      this.firstItemIndex = firstItemIndex;
      this.updateView();
      this.updatePlaceholdersHeight();
      this.updateScrollPosition(visibleItemInfo);
    }
  }

  private calculateVisibleItemInfo(items?: any[]) {
    const scrollPosition = getScrollPosition(this.viewContainerRef);
    const { viewportOffsetTop, index } = findFirstVisibleItem(
      this.itemMap,
      this.firstItemIndex,
      scrollPosition
    );
    let newIndex = index;
    if (items) {
      newIndex = findNewIndex(items, index, this.trackByMap, this.trackBy);
    }
    return { scrollPosition, viewportOffsetTop, index: newIndex };
  }

  private updateScrollPosition(visibleItemInfo: {
    scrollPosition: number;
    viewportOffsetTop: number;
    index: number;
  }) {
    const { index, viewportOffsetTop } = visibleItemInfo;
    const offsetTop = getTotalHeight(this.itemMap, 0, index);
    this.scrollState.setScrollPosition(offsetTop - viewportOffsetTop);
  }

  private updateItems(items: any[], reset: boolean) {
    const itemMap = createMapFor(items, 0.1); // Item offsets should be different.
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
