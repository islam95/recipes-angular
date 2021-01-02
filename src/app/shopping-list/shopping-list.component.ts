import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  public ingredients$: Observable<{ingredients: Ingredient[]}>;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ shoppingList: {ingredients: Ingredient[]} }>
  ){}

  public ngOnInit(): void {
    this.ingredients$ = this.store.select('shoppingList');
  }

  public onEditItem(index: number): void {
    this.shoppingListService.startedEditing.next(index);
  }
}
