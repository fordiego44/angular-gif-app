import { Component, input } from '@angular/core';

@Component({
  selector: 'gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.component.html',
  styles: ``
})
export class GifListItemComponent {

  public imageUrl = input.required<string>();
}
