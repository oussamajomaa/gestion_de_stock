export type Batch = {
    id: number
    quantity: number
    expiration_date: string // Utilisez `string` pour manipuler facilement les dates en affichage
    transactionId: number
    inventaire: String
    article: {
      article_name: string; // Représente le nom de la catégorie associée
    };
  }