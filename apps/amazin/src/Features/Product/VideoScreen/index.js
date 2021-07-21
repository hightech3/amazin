import axios from 'axios';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { listProducts } from '../../../Controllers/productActions';
import './videoScreen.css';

import MessageBox from '../../../components/MessageBox';
import LoadingOrError from '../../../components/LoadingOrError';
import {
  NO_MOVIES,
  TRENDING,
  TOP_RATED,
  SOURCES,
  EXAMPLE_MOVIES,
  VIDEO_GENRES
} from '../../../constants';
import { dummyMovies, sourceAdapter } from '../../../utils';

import VideoNavHeader from './VideoNavHeader';
import VideoBanner from './components/VideoBanner';
import { ErrorFallback, fallback } from './VideoRow';
import { ErrorBoundary } from 'react-error-boundary';
const VideoRow = React.lazy(() =>
  import(/* webpackPrefetch: true */ './VideoRow')
);

export default function VideoScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const productCreate = useSelector((state) => state.productCreate);

  const [active, setActive] = useState('STORE');
  const [movies, setMovies] = useState({ STORE: [] });
  const [externMovies, setExternMovies] = useState({});
  const [storeMovies, setStoreMovies] = useState();
  const [bannerMovies, setBannerMovies] = useState([]);

  const isMounted = useRef(true);

  useEffect(() => {
    const _banner = {};
    VIDEO_GENRES.forEach((_genre) => {
      const genreMovies = !productList.success
        ? NO_MOVIES
        : movies[_genre] || EXAMPLE_MOVIES;
      _banner[_genre] = genreMovies[(Math.random() * genreMovies.length) | 0];
    });
    setBannerMovies(_banner);
  }, [productList.success, movies]);

  useEffect(() => {
    dispatch(
      listProducts({
        seller: process.env.REACT_APP_SELLER,
        category: 'Video',
        pageSize: 11,
        order: 'oldest'
      })
    );

    (async function fetchData() {
      const promiseReturns = await Promise.all(
        Object.keys(SOURCES).map(async (genre) => {
          const { data } = await axios
            .get('https://api.themoviedb.org/3' + SOURCES[genre])
            .catch();
          return [[genre], data.results];
        })
      );
      if (!isMounted.current) return;
      const movieObj = {};
      promiseReturns.map(
        ([genre, list]) => (movieObj[genre] = sourceAdapter(list))
      );
      setExternMovies(movieObj);
    })();
    return () => (isMounted.current = false); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setStoreMovies(productList.products);
  }, [productList.products]);

  useEffect(() => {
    setMovies({ ...externMovies, STORE: storeMovies });
  }, [externMovies, storeMovies]);

  return (
    <div className="container--full video-screen">
      <VideoNavHeader labels={VIDEO_GENRES} hook={[active, setActive]} />

      <LoadingOrError xl statusOf={productCreate} />
      <VideoBanner movie={bannerMovies[active]} />

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={fallback}>
          {externMovies &&
            Object.keys(SOURCES).map(
              (_genre, id) =>
                (_genre === active || active === 'Home') && (
                  <VideoRow
                    key={id}
                    title={_genre}
                    movies={movies[_genre]}
                    portrait={_genre === 'NETFLUX ORIGINALS'}
                  />
                )
            )}

          <LoadingOrError xl statusOf={productList} />
          {productList.success && (
            <>
              <MessageBox show={!productList.products.length}>
                No Product Found/ Sold Out
              </MessageBox>

              {productList.products.length && (
                <VideoRow
                  title="IN STOCK: READY TO BUY"
                  movies={[storeMovies, dummyMovies][!!productList.loading]}
                  //if Netflux is active, only one portrait row
                  portrait={active !== 'NETFLUX ORIGINALS'}
                />
              )}
            </>
          )}

          {
            /* no duplicated Trending Now */
            externMovies[TRENDING] && active !== TRENDING && (
              <VideoRow title={TRENDING} movies={externMovies[TRENDING]} />
            )
          }

          {externMovies[TOP_RATED] && active !== TOP_RATED && (
            <VideoRow title={TOP_RATED} movies={externMovies[TOP_RATED]} />
          )}
        </Suspense>
      </ErrorBoundary>
      <div className="banner__divider"></div>

      <VideoBanner bottom movie={bannerMovies[active]} />
    </div>
  );
}
