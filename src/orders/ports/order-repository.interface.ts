export const ORDER_REPOSITORY_TOKEN = 'OrderRepository';

export interface OrderRepository {
    /**
     * Checks if an order with the given ID already exists in the persistence layer.
     * @param id The external ID of the order.
     */
    exists(id: string): Promise<boolean>;

    /**
     * Saves the order ID to the persistence layer to track synchronized orders.
     * @param id The external ID of the order.
     */
    save(id: string): Promise<void>;
}
