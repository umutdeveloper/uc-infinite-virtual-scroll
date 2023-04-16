import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteVirtualScrollViewportComponent } from './infinite-virtual-scroll-viewport/infinite-virtual-scroll-viewport.component';
import { InfiniteVirtualForDirective } from './infinite-virtual-for.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    InfiniteVirtualScrollViewportComponent,
    InfiniteVirtualForDirective,
  ],
  exports: [
    InfiniteVirtualScrollViewportComponent,
    InfiniteVirtualForDirective,
  ],
})
export class InfiniteVirtualScrollModule {}
