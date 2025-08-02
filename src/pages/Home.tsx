import React from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Categories from '../components/Categories';

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <ProductGrid />
    </>
  );
};

export default Home;