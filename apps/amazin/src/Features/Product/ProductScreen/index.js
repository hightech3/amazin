import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import ProductImages from './ProductImages';
import ProductDescription from './ProductDescription';
import ProductReview from './ProductReview';
import ProductInStock from './ProductInStock';
import { detailsProduct } from '../../../Controllers/productActions';
import SellerCard from '../SellerScreen/SellerCard';

import LoadingOrError from '../../../components/LoadingOrError';
import { STORAGE } from '../../../constants';

export function _ProductScreen({ match }) {
  const dispatch = useDispatch();
  const productId = match.params.id;

  const productDetails = useSelector((state) => state.productDetails);
  const { product } = productDetails;

  useEffect(() => {
    dispatch(detailsProduct(productId)); // eslint-disable-next-line
  }, [productId]);

  return (
    <div>
      <LoadingOrError xl statusOf={productDetails} />

      {productDetails?.success && (
        <div className="col-fill">
          <div>
            <div className="row search__banner">
              <Link
                to={localStorage?.getItem(STORAGE.HISTORY) || '/'}
                className="ml-1"
              >
                Back to last section
              </Link>
            </div>
          </div>

          <div className="row top mt-1 p-1">
            <ProductImages product={product} />

            <ProductDescription product={product} />

            <div className="col-1">
              <SellerCard
                user={product.seller}
                linkTo={`/seller/${product.seller._id}`}
              />

              <ProductInStock productId={productId} product={product} />
            </div>
          </div>

          <ProductReview productId={productId} />
        </div>
      )}
    </div>
  );
}

const ProductScreen = React.memo(_ProductScreen);
export default ProductScreen;
