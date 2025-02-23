import { Component, inject, signal } from '@angular/core';
import { GifService } from '../../services/gifs.service';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
  styles: ``
})
export default class SearchPageComponent {

  gifService = inject(GifService)
  gifs = signal<Gif[]>([])

  onSearch(query: string):void{
    this.gifService.searchGif(query).subscribe((resp)=>{
        this.gifs.set(resp);
    });
  }
}
