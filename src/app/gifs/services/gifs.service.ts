import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';


import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';

const GYF_KEY = 'gifs';

const loadFromLocalStorage= () =>{
  const gifsFromLocalStorage = localStorage.getItem(GYF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(()=> Object.keys(this.searchHistory()));


  constructor(){
    this.loadTrendingGifs();
    console.log('Servicio creado');

  }

  saveGifsToLocalStorage = effect(()=>{
    const historyString= JSON.stringify(this.searchHistory());
    localStorage.setItem('gifs',historyString);
  });

  loadTrendingGifs(){
    this.http.get<GiphyResponse>(`${ environment.giphyUrl}/gifs/trending`,
      {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20
        }
      }).subscribe((resp)=>{
        const gifs = GifMapper.mapGiphyItemToGifToArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log(gifs);
      })
  }

  searchGif( query: string): Observable<Gif[]>  {
    return this.http
    .get<GiphyResponse>(`${ environment.giphyUrl}/gifs/search`,
      {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query
        }
      })
      .pipe(
        map( ( ({data}) => data ) ),
        map( ( (items) => GifMapper.mapGiphyItemToGifToArray(items) ) ),
        tap( (items) => {
          this.searchHistory.update( (history)=> ({
            ...history,
            [query.toLowerCase()]: items
          }));
        })
      );
    // this.http.get<GiphyResponse>(`${ environment.giphyUrl}/gifs/search`,
    //   {
    //     params: {
    //       api_key: environment.giphyApiKey,
    //       limit: 20,
    //       q: query
    //     }
    //   }).subscribe((resp)=>{
    //     const gifs = GifMapper.mapGiphyItemToGifToArray(resp.data);
    //     // this.trendingGif.set(gifs);
    //     console.log({search: gifs});
    //   })
  }

  getHistoryGifs( query: string): Gif[]  {
    return this.searchHistory()[query] ?? [];

  }
}
