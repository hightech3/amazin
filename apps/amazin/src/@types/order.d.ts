type AddressType = {
  fullName: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
};

type ItemType = {
  _id: string;
  name: string;
  qty: number;
  price: number;
  countInStock: number;
  image: string;
  seller: UserType;
  product: ProductType;
  ship: number;
};

type PaymentResultType = {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
  isPaid: boolean;
  paidAt: string;
};

type PaymentMethodType = 'Paypal' | 'Stripe';

type OrderType = CartType & {
  _id: string;
  createdAt: string;
  orderItems: ItemType[];
  isPaid?: boolean;
  paidAt?: string;
  paymentResult?: PaymentResultType;
  isDelivered?: boolean;
  deliveredAt?: string;
};

type OrderListType = {
  orders: OrderType[];
  loading?: boolean;
  error?: string;
  success?: boolean;
};
