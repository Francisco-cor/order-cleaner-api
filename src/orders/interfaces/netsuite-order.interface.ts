export interface NetSuiteOrderItem {
    itemId: string;
    quantity: number;
    rate: number;
    description: string;
}

export interface NetSuiteOrder {
    externalId: string;
    entity: string; // Customer reference
    trandate: string; // ISO Date
    memo: string;
    location: string;
    subsidiary: string;
    items: NetSuiteOrderItem[];
    shippingAddress: {
        addr1: string;
        addr2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    source: string;
    status: 'pending_sync' | 'synced' | 'failed';
}
