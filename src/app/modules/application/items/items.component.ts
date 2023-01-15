import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ItemsService } from './items.service';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const STATE_KEY_ITEMS = makeStateKey('items');


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit{

  items: any;
  loaded: boolean = false;
  item: any;

  constructor(
    private state: TransferState,
    private itemsService: ItemsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
      this.loaded = false;
    }

   ngOnInit(): void {
   this.getUsers();
  }

  getUsers(): void {
    this.loaded = false;

    this.items = this.state.get(STATE_KEY_ITEMS, <any> []);

    if (this.items.length === 0) {
    this.itemsService.getItems('https://jsonplaceholder.typicode.com/users')
    .subscribe(
      items => {
        const platform = isPlatformBrowser(this.platformId) ?
        'in the browser' : 'on the server';
        console.log(`getUsers : Running ${platform} with appId=${this.appId}`);
        this.items = items;
        this.loaded = true;
        this.state.set(STATE_KEY_ITEMS, <any> items);
      }
    );
  } else {
    this.loaded = true;
  }
}

  resetUsers(): void {
    this.items = null;
    this.loaded = true;
  }

}
