import {
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Scroller } from './services/scroller';
import { inputPropChanged } from './services/utils';

@Directive({
  selector: '[appInfiniteVirtualFor][appInfiniteVirtualForOf]',
})
export class InfiniteVirtualForDirective implements OnChanges, OnDestroy {
  private scroller?: Scroller;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this.setup();
  }

  @Input() appInfiniteVirtualForOf: any[] = [];
  @Input() appInfiniteVirtualForSize: number;
  @Input() appInfiniteVirtualForDebounceTime: number = 20;
  @Input() appInfiniteVirtualForTrackBy: string;

  ngOnChanges(changes: SimpleChanges) {
    const { appInfiniteVirtualForOf } = changes;
    const itemsChanged = inputPropChanged(appInfiniteVirtualForOf);
    if (
      this.appInfiniteVirtualForSize &&
      this.appInfiniteVirtualForTrackBy &&
      this.appInfiniteVirtualForDebounceTime
    ) {
      this.init();
      if (itemsChanged) {
        this.update(this.appInfiniteVirtualForOf);
      }
    }
  }

  ngOnDestroy() {
    if (this.scroller) {
      this.scroller.destroy();
    }
  }

  private setup() {
    this.scroller = new Scroller(this.templateRef, this.viewContainerRef);
  }

  private update(items: any) {
    this.scroller.update(items);
  }

  private init() {
    this.scroller.init(
      this.appInfiniteVirtualForSize,
      this.appInfiniteVirtualForTrackBy,
      this.appInfiniteVirtualForDebounceTime
    );
  }
}
