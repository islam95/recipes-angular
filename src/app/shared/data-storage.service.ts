import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

const firebaseDbUrl = 'https://recipe-d9c43-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(firebaseDbUrl, recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes(): any {
    return this.http.get<Recipe[]>(firebaseDbUrl)
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => this.recipeService.setRecipes(recipes))
    );
  }
}
