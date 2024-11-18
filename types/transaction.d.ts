export type Transaction = {
    id: number;
    transaction_date: string;
    transaction_quantity: number;
    transaction_type: string;
    userId: number;
    batchId?: number;
    batch?: {
        article: {
            article_name: string;
        };
    };
};