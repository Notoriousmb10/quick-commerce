export interface PlaceOrderItemDto {
  product: string;
  quantity: number;
}

export interface PlaceOrderDto {
  items: PlaceOrderItemDto[];
  deliveryLocation: {
    address: string;
  };
}

export interface UpdateOrderDto {
  status?: string;
  deliveryPartner?: string;
}
