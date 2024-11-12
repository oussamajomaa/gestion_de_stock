export type Transaction = {
    id: number
    transaction_date: string
    transaction_quantity: number
    transaction_type: String
    userId: number 
    articleId: number
    article: {
        article_name: string
    }
}