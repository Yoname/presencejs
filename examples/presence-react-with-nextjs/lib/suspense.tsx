import { Router } from 'next/router';
import { useEffect, useState } from 'react';

export default function Suspense({ children }: any) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      console.log('start');
      setLoading(true);
    };
    const end = () => {
      console.log('finished');
      setLoading(false);
    };
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);
  return loading ? <h1>Loading...</h1> : children;
}
