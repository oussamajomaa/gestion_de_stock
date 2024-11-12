export type Article = {
    id: number
    article_description: string
    article_name: string
    article_quantity: number
    barcode: string
    expiration_date: string // Utilisez `string` pour manipuler facilement les dates en affichage
    quantity_min: number
    unit: string
    unit_price: number
    category_id: number
    category: {
      category_name: string; // Représente le nom de la catégorie associée
    };
  }