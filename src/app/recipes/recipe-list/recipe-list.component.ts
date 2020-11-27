import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  public recipes: Recipe[] = [
    new Recipe('Test recipe', 'This is simple test recipe', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS18ulMGyMk3iLNlzsRNKZiBuOAMK2j3EbfmQ&usqp=CAU'),
    new Recipe('Another recipe', 'This is another simple test recipe', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS18ulMGyMk3iLNlzsRNKZiBuOAMK2j3EbfmQ&usqp=CAU')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public onRecipeSelected(recipe: Recipe): void {
    this.recipeWasSelected.emit(recipe);
  }

}
