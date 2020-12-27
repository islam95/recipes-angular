import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  public recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Test recipe',
      'This is simple test recipe',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS18ulMGyMk3iLNlzsRNKZiBuOAMK2j3EbfmQ&usqp=CAU',
      [
        new Ingredient('Meat', 4),
        new Ingredient('French Fries', 2)
      ]
      ),
    new Recipe(
      'Another recipe',
      'This is another simple test recipe',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS18ulMGyMk3iLNlzsRNKZiBuOAMK2j3EbfmQ&usqp=CAU',
      [
        new Ingredient('Test', 2),
        new Ingredient('Bsfsdg', 6)
      ]
      )
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  public getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  public getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  public addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngredients(ingredients);
  }
}
