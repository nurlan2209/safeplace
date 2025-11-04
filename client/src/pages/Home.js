import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import mainIllustration from '../assets/images/main_illustration.png';

const Home = () => {
  return (
    <>
      <Header isLogged={false} />
      <main className="home">
        <section className="left">
          <h1>
            SafePlace —<br /> your safety in your hands
          </h1>
          <p className="subtitle">Место, где тебя понимают</p>
        </section>

        <section className="right">
          <img src={mainIllustration} alt="Девушка пишет в дневник" />
        </section>
      </main>
    </>
  );
};

export default Home;
