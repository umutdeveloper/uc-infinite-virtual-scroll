# Infinite Virtual Scroll with Dynamic Sized Items

This is an usage repository of custom infinite virtual scroll library that allows for an infinite virtual scroll with dynamic sized items. It uses async loading to fetch new items as needed, and only renders a virtual list of the elements in the DOM. This means that it can handle very large data sets without sacrificing performance.

## How is it different from Angular CDK?

Angular CDK has the autosize directive that it has been developing experimentally for a long time. But it is not stable. In this library, there are no problems such as any jump during scrolling, undesired scroll position. This library does not care about the total item height, but the overall item height created so far on the viewport. So infinity somehow the height can increase to infinity.

## Features

- Infinite scrolling with dynamic sized items
- Async loading for efficient data retrieval
- Virtual list rendering for only in view DOM updates
- Doesn't care about the total height of the items
- No jump during scrolling, stable scroll position experience
- Easy to integrate with existing projects
- Easy to reset view and update items

## Demo

[Try the Demo in StackBlitz](https://stackblitz.com/edit/uc-ngx-infinite-virtual-scroll)

## Supported API

### Properties

| @Input()                | Type   | Required | Default | Description                                                                                     |
| ----------------------- | ------ | -------- | ------- | ----------------------------------------------------------------------------------------------- |
| \*appInfiniteVirtualFor | any[]  | optional | []      | List of items to display in viewport                                                            |
| size                    | number | required | -       | Specifies how many elements to render on the DOM in the viewport at once.                       |
| debounceTime            | number | optional | 30      | Debounce time to be applied when listening to scroll event in viewport (ms)                     |
| trackBy                 | string | required | -       | Item field name to use when comparing existing items and new ones in the viewport. For ex; 'id' |

### Events

| @Output()        | Type         | Event Type | Required | Description                                                         |
| ---------------- | ------------ | ---------- | -------- | ------------------------------------------------------------------- |
| onScrollAtBottom | EventEmitter | void       | optional | It is triggered when the viewport scroll position is at the bottom. |

### Actions

| Method          | Description                                               |
| --------------- | --------------------------------------------------------- |
| scrollToStart() | Moves the viewport scroll position to the starting point. |
| reset()         | Resets viewport, clears items.                            |

## Usage

First, **InfiniteVirtualScrollModule** is added to the main module or, if the component is standalone, into the component imports array.

```ts
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [InfiniteVirtualScrollModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
...
```

Then, our infinite scroll directive is run in the virtual viewport in the HTML.

```html
<div class="posts-wrapper">
  <app-infinite-virtual-scroll-viewport #viewport (onScrollAtBottom)="handleScrollAtBottom()">
    <div class="post-item"
         *appInfiniteVirtualFor="let post of posts; size: 50; trackBy: 'id'; let i = index">
      <div>
        {{ post.id }}<br />
        {{ post.text }}
      </div>
    </div>
  </app-infinite-virtual-scroll-viewport>
</div>
```

And it's ready, now you can listen to the events and trigger the actions by accessing the viewport component.

```ts
export class TestComponent {
  @ViewChild(InfiniteVirtualScrollViewportComponent)
  viewport: InfiniteVirtualScrollViewportComponent;

  posts: { id: number; text: string }[];

  constructor() {
    // Simulate async loading...
    setTimeout(() => (this.posts = this.generatePosts(50, 0)), 1000);
  }

  scrollToStart() {
    this.viewport.scrollToStart();
  }

  handleScrollAtBottom() {
    this.addItems();
  }

  reset() {
    this.viewport.reset();
    this.posts = [...this.generatePosts(30, 0)];
  }

  generatePosts(length: number, idPrefix: number) {
    return Array.from({ length }, generateParagraph.bind(this)).map(
      (text: string, index) => ({ id: index + idPrefix, text })
    );
  }

  removeItems() {
    this.posts.splice(5, 3);
    this.posts = [...this.posts];
  }

  addItems() {
    // Simulate async adding...
    setTimeout(
      () =>
        (this.posts = [
          ...this.posts,
          ...this.generatePosts(50, this.posts.length),
        ]),
        1000
    );
  }
}
```

Thank you!

## Front End Services

- Angular/Javascript Consulting
- Code Review
- Web Application Development

[Contact Here](https://www.linkedin.com/in/umuttcakir/)

## Contributions

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the Github repository. If you'd like to contribute code, please fork the repository and submit a pull request with your changes.

## License

This library is licensed under the MIT license.
