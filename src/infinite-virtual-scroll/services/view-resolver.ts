import { ViewContainerRef, TemplateRef, EmbeddedViewRef } from '@angular/core';
import { getScrollPosition } from './scroll-resolver';
import { MapProperties } from './view-state';

export function getContainer(viewContainerRef: ViewContainerRef): HTMLElement {
  return viewContainerRef.element.nativeElement.parentElement as HTMLElement;
}

export function createMapFor(items: any[], height: number) {
  return new Map(
    Array.from({ length: items.length }).map((_, i) => [i, { height }])
  );
}

export function mergeMapWith(
  items: any[],
  newMap: Map<number, MapProperties>,
  currMap: Map<number, MapProperties>,
  trackMap: Map<any, number>,
  trackBy: string
) {
  [...newMap.keys()].forEach((index) => {
    const oldIndex = trackMap.get(items[index][trackBy]);
    if (oldIndex !== undefined) {
      const currentMapProperties = currMap.get(oldIndex);
      if (currentMapProperties) {
        newMap.set(index, currentMapProperties);
      }
    }
  });
  return newMap;
}

export function setTrackMap(
  trackMap: Map<any, number>,
  trackBy: string,
  items: any[]
) {
  items.forEach((item, index) => trackMap.set(item[trackBy], index));
}

export function setMapPropertiesFor(
  map: Map<number, MapProperties>,
  properties: MapProperties[],
  startIndex: number
) {
  properties.forEach((property, index) => {
    map.set(startIndex + index, property);
  });
}

export function createViewFor(
  viewContainerRef: ViewContainerRef,
  templateRef: TemplateRef<any>,
  startIndex: number,
  items: any[]
): MapProperties[] {
  viewContainerRef.clear();
  return items.map((item, index) => {
    const viewRef = viewContainerRef.createEmbeddedView(templateRef, {
      $implicit: item,
      index: startIndex + index,
    });
    viewRef.detectChanges();
    return {
      height: getHeight(viewRef),
    };
  });
}

export function getHeight(viewRef: EmbeddedViewRef<any>): number {
  return viewRef.rootNodes[0].offsetHeight;
}

export function getTotalHeight(
  map: Map<number, MapProperties>,
  startIndex: number,
  endIndex: number
): number {
  return [...map.values()]
    .filter((curr) => !!curr.height)
    .slice(startIndex, endIndex)
    .reduce((acc, curr) => {
      let height = curr.height;
      return acc + height;
    }, 0);
}

export function findFirstItemIndex(
  map: Map<number, MapProperties>,
  scrollPosition: number,
  totalItemSize: number
): number {
  const indexList = [...map.keys()];
  for (let i = 0; i < indexList.length; i++) {
    const offsetStart = getTotalHeight(map, 0, indexList[i]);
    const height = map.get(indexList[i]).height;
    if (offsetStart > scrollPosition) {
      return getBufferedIndex(indexList[i], totalItemSize);
    } else if (offsetStart + height > scrollPosition) {
      return getBufferedIndex(indexList[i] + 1, totalItemSize);
    }
  }
  return 0;
}

export function getBufferedIndex(index: number, totalItemSize: number) {
  const centerOfItems = Math.floor(totalItemSize / 2); // This provides a buffer range
  return index > centerOfItems ? index - centerOfItems : 0;
}

export function findFirstVisibleItem(
  map: Map<number, MapProperties>,
  firstItemIndex: number,
  totalItemSize: number,
  scrollPosition: number
) {
  let viewportOffsetTop = 0;
  let index = 0;
  for (let i = firstItemIndex; i < map.size; i++) {
    const offsetTop = getTotalHeight(map, 0, i);
    if (offsetTop >= scrollPosition) {
      viewportOffsetTop = offsetTop - scrollPosition;
      index = i;
      break;
    }
  }
  return { viewportOffsetTop, index };
}

export function findNewIndexOfExistingItem(
  items: any[],
  index: number,
  trackMap: Map<any, number>,
  trackBy: string
) {
  let newIndex = 0;
  const itemLength = items.length;
  for (let i = index; i < itemLength; i++) {
    const indexFound = items.findIndex(
      (item) => trackMap.get(item[trackBy]) === i
    );
    if (indexFound !== -1) {
      newIndex = indexFound;
      break;
    }
  }
  return newIndex;
}
