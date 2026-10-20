export interface CreateRecipeBody {
  title?: string;
  ingredients?: string[];
  instructions?: string;
  cookingTime?: number;
  servings?: number;
  difficulty?: number;
  chefName?: string;
  categoryId?: number;
}

export interface UpdateRecipeBody {
  title?: string;
  ingredients?: string[];
  instructions?: string;
  cookingTime?: number;
  servings?: number;
  difficulty?: number;
  chefName?: string;
}
