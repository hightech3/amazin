type ReviewType = {
  name: string;
  comment: string;
  rating: NumberString;
};

type ProductType = {
  _id: string;
  name: string;
  seller?: UserType;
  image?: string;
  video?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  price?: number;
  deal?: number;
  ship?: number;
  countInStock?: number;
  rating?: number;
  numReviews?: number;
  reviews?: ReviewType;
};

type VideoType = {
  title?: string;
  original_title?: string;
  poster_path?: string;
  backdrop_path: string;
  vote_average?: number;
  vote_count?: number;
  overview?: string;
};

type MovieType = VideoType & ProductType;

type ResGetProductApi = Res & {
  data: {
    products: ProductType[];
  };
};

type ResGetProduct = ActionRedux & {
  payload: ResGetProductApi;
};

type ResGetProductItemApi = Res & {
  data: {
    product: ProductType;
  };
};

type ResGetProductItem = ActionRedux & {
  payload: ResGetProductItemApi;
};
