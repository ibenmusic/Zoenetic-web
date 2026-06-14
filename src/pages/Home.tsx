import ScrollProgressBar from '../components/ScrollProgressBar';
import Navigation from '../components/Navigation';
import Hero from '../sections/Hero';
import About from '../sections/About';
import PawKingdom from '../sections/PawKingdom';
import Roadmap from '../sections/Roadmap';
import Footer from '../sections/Footer';

export default function Home() {
  return (
    <>
      <ScrollProgressBar />
      <Navigation />
      <main>
        <Hero />
        <About />
        <PawKingdom />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
