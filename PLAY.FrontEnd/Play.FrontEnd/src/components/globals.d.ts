// globals.d.ts
export {};

declare global {
  interface Window {
    CATALOG_ITEMS_API_URL: string;
    INVENTORY_ITEMS_API_URL: string;
    CATALOG_SERVICE_URL: string;
    INVENTORY_SERVICE_URL: string;
    RABBITMQ_URL: string;
  }
}
