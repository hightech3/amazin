import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import {
  listProductCategories,
  updateCurrencyRates
} from './Controllers/productActions';
import MainRoute from './Features/Route/MainRoute';
import HeaderNavBelt from './Features/Nav/HeaderNavBelt';
import SidebarMenu from './Features/Nav/SidebarMenu';
import './responsive.css';
import HeaderNavMain from './Features/Nav/HeaderNavMain';
import { useShadow } from './utils/useShadow';
import { Storage, pipe } from './utils';
import { SHADOW, KEY } from './constants';
const ErrorScreen = React.lazy(() =>
  import(/* webpackPrefetch: true */ './Features/Auth/ErrorScreen')
);

export default function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userSignin);
  const { sessionCurrency } = useSelector((state) => state.currencyType);

  const { shadowOf, setShadowOf } = useShadow();
  const [currency, setCurrency] = useState(userInfo?.currency || pipe.currency);

  useEffect(() => {
    pipe.setCurrency(
      userInfo?.currency ||
        sessionCurrency ||
        Storage[KEY.CURRENCY] ||
        pipe.currency
    );
    setCurrency(pipe.currency);
    dispatch(updateCurrencyRates());
    dispatch(listProductCategories());
  }, [dispatch, userInfo?.currency, sessionCurrency]);

  return (
    <BrowserRouter>
      <div
        className={`container--grid ${
          SHADOW.SIDEBAR === shadowOf ? 'scroll--off' : ''
        }`}
      >
        <ErrorBoundary FallbackComponent={ErrorScreen}>
          <header id="nav-bar">
            <HeaderNavBelt currency={currency} />

            <HeaderNavMain />
          </header>

          <SidebarMenu currency={currency} />
        </ErrorBoundary>

        <main className="container">
          <MainRoute />

          <div
            className={`shadow-of__${shadowOf}`}
            onClick={() => setShadowOf('')}
          />
        </main>
        <footer className="row center">
          Amazin' eCommerce platform, all right reserved
        </footer>
      </div>
    </BrowserRouter>
  );
}
