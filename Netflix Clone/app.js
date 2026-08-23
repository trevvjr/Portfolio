const { useState, useEffect } = React;

const movieRows = [
  {
    title: 'Trending Now',
    movies: [
      {
        id: 101,
        name: 'Stranger Things',
        poster: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
        overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      },
      {
        id: 102,
        name: 'The Witcher',
        poster: 'https://image.tmdb.org/t/p/w500/zb6fM0Vz4pYVwQ0uOz5xW7q2f4k.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/vr6iQ3qpeHmKfAmd2uvouijw9hH.jpg',
        overview: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
      },
      {
        id: 103,
        name: 'Money Heist',
        poster: 'https://image.tmdb.org/t/p/w500/ReTFS1uTkQXm1NPcQNUYQzdQudx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/reTFS1uTkQXm1NPcQNUYQzdQudx.jpg',
        overview: 'A criminal mastermind who goes by "The Professor" has a plan to pull off the biggest heist in recorded history.',
      },
      {
        id: 104,
        name: 'Squid Game',
        poster: 'https://image.tmdb.org/t/p/w500/dlNwwuH9Ta6QdvUy0K2u1JYmPlT.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/dlNwwuH9Ta6QdvUy0K2u1JYmPlT.jpg',
        overview: 'Hundreds of cash-strapped contestants accept an invitation to compete in children\'s games for a tempting prize, but the stakes are deadly.',
      },
      {
        id: 105,
        name: 'Arcane',
        poster: 'https://image.tmdb.org/t/p/w500/rN5kmJRPxE4YCO3uZJBPJC2qlXy.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/rN5kmJRPxE4YCO3uZJBPJC2qlXy.jpg',
        overview: 'The delicate balance between the rich city of Piltover and the seedy underbelly of Zaun is shattered by the spark of revolution.',
      },
    ],
  },
  {
    title: 'Top Picks for You',
    movies: [
      {
        id: 201,
        name: 'The Dark Knight',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        overview: 'Batman raises the stakes in his war on crime as a ruthless criminal mastermind known as the Joker wreaks havoc on Gotham City.',
      },
      {
        id: 202,
        name: 'Inception',
        poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        overview: 'A skilled thief is given a chance at redemption when he is offered a seemingly impossible task: planting an idea into a target\'s subconscious.',
      },
      {
        id: 203,
        name: 'The Matrix',
        poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        overview: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
      },
    ],
  },
  {
    title: 'Popular on Netflix',
    movies: [
      {
        id: 301,
        name: 'Black Mirror',
        poster: 'https://image.tmdb.org/t/p/w500/8sf7QBGpEYbKx8QG1X1lYpmD4Wn.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8sf7QBGpEYbKx8QG1X1lYpmD4Wn.jpg',
        overview: 'A series of stand-alone dramas showcase dystopian worlds that show the dark side of life and technology.',
      },
      {
        id: 302,
        name: 'Black Panther',
        poster: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
        overview: 'T\'Challa returns home to the isolated, technologically advanced African nation of Wakanda to serve as his country\'s new leader.',
      },
      {
        id: 303,
        name: 'Emily in Paris',
        poster: 'https://image.tmdb.org/t/p/w500/6Gs3PJKN1iPDK9jkZxlxJPfAWhz.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/6Gs3PJKN1iPDK9jkZxlxJPfAWhz.jpg',
        overview: 'An American woman moves to Paris for an unexpected job opportunity and finds herself balancing career, friends, and romance.',
      },
    ],
  },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 48);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={"navbar" + (scrolled ? ' scrolled' : '')}>
      <img className="nav-logo" src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix logo" />
      <div className="nav-actions">
        <button>Browse</button>
        <button>Sign In</button>
      </div>
    </header>
  );
}

function Banner({ movie }) {
  const backgroundImage = movie.backdrop || movie.poster;
  return (
    <section className="banner" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="banner-content">
        <h1>{movie.name}</h1>
        <p>{movie.overview}</p>
        <div className="banner-buttons">
          <button className="primary-button">Play</button>
          <button className="secondary-button">More Info</button>
        </div>
      </div>
    </section>
  );
}

function Row({ title, movies }) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div className="row">
        {movies.map((movie) => (
          <article className="card" key={movie.id}>
            <img src={movie.poster} alt={movie.name} />
            <div className="card-title">{movie.name}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>Built with React-style components and Netflix-inspired UI.</p>
      <p>
        <a href="https://www.netflix.com" target="_blank" rel="noreferrer">Netflix</a> clone concept based on a React + Firebase tutorial.
      </p>
    </footer>
  );
}

function App() {
  const featuredMovie = movieRows[0].movies[0];

  return (
    <React.Fragment>
      <Nav />
      <Banner movie={featuredMovie} />
      {movieRows.map((row) => (
        <Row key={row.title} title={row.title} movies={row.movies} />
      ))}
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
