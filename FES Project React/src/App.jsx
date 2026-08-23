import { useEffect, useMemo, useState } from 'react';
import { HashRouter as Router, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 12;
const STORAGE_KEYS = {
  favorites: 'fes-react-favorites',
  theme: 'fes-react-theme',
};

const FALLBACK_ANIME = [
  { id: 1, title: 'Attack on Titan', year: 2013, img: 'https://i.imgur.com/erS4b1E.jpg', desc: 'Humanity fights for survival against giant titans in a devastated world.' },
  { id: 2, title: 'Demon Slayer', year: 2019, img: 'https://i.imgur.com/9RfZQ0S.jpeg', desc: 'A young swordsman battles demons while protecting his demon sister.' },
  { id: 3, title: 'Jujutsu Kaisen', year: 2020, img: 'https://i.imgur.com/Wf2AZMw.jpg', desc: 'A high schooler joins sorcerers to fight curses and reclaim his life.' },
  { id: 4, title: 'My Hero Academia', year: 2016, img: 'https://i.imgur.com/6m6W1WU.jpg', desc: 'Aspiring heroes train at U.A. Academy to master their powers.' },
  { id: 5, title: 'One Piece', year: 1999, img: 'https://i.imgur.com/7YfZQ0S.jpeg', desc: 'A pirate crew searches for the legendary treasure and pursues freedom.' },
  { id: 6, title: 'Naruto', year: 2002, img: 'https://i.imgur.com/8XqQ0kL.jpeg', desc: 'A young ninja dreams of becoming the strongest leader in his village.' },
  { id: 7, title: 'Your Name', year: 2016, img: 'https://i.imgur.com/TT7zW6v.jpg', desc: 'Two strangers swap bodies and search for one another across time.' },
  { id: 8, title: 'Fullmetal Alchemist', year: 2003, img: 'https://i.imgur.com/Rvv2Q0a.jpg', desc: 'Two brothers use alchemy to restore what they lost after a terrible ritual.' },
  { id: 9, title: 'Cowboy Bebop', year: 1998, img: 'https://i.imgur.com/gIhP7nM.jpg', desc: 'A bounty hunter team travels through space and faces their pasts.' },
  { id: 10, title: 'Spy x Family', year: 2022, img: 'https://i.imgur.com/pCwZtOe.jpg', desc: 'A spy forms a fake family for a mission only to find their hearts changing.' },
  { id: 11, title: 'One Punch Man', year: 2015, img: 'https://i.imgur.com/eD1Gxdr.jpg', desc: 'A hero who can defeat any opponent with one punch searches for meaning.' },
  { id: 12, title: 'Death Note', year: 2006, img: 'https://i.imgur.com/MvJiYYf.jpg', desc: 'A notebook gives a teen the power to erase criminals from the world.' },
  { id: 13, title: 'Violet Evergarden', year: 2018, img: 'https://i.imgur.com/XcwzK49.jpg', desc: 'An ex-soldier learns compassion while writing letters for others.' },
  { id: 14, title: 'Sword Art Online', year: 2012, img: 'https://i.imgur.com/Yn593Zi.jpg', desc: 'Players fight for survival inside a virtual reality game world.' },
  { id: 15, title: 'Mob Psycho 100', year: 2016, img: 'https://i.imgur.com/rAKxjZ8.jpg', desc: 'A powerful psychic struggles to keep his emotions under control.' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest → Oldest' },
  { value: 'oldest', label: 'Oldest → Newest' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
];

const VIEW_MODES = [
  { value: 'all', label: 'All Titles' },
  { value: 'favorites', label: 'Favorites' },
];

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValue];
}

async function fetchAnimeData() {
  const query = `
    query {
      Page(perPage: 100) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji }
          startDate { year }
          description(asHtml: false)
          coverImage { large }
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('API error');
  }

  const json = await response.json();
  const media = json?.data?.Page?.media || [];
  if (!media.length) {
    return FALLBACK_ANIME;
  }

  return media.slice(0, 24).map((item) => ({
    id: item.id,
    title: item.title?.romaji || 'Unknown',
    year: item.startDate?.year || 'N/A',
    img: item.coverImage?.large || 'https://i.imgur.com/7YfZQ0S.jpeg',
    desc: item.description ? item.description.replace(/<[^>]*>/g, '') : 'No description available.',
  }));
}

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [viewMode, setViewMode] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, []);
  const [theme, setTheme] = useLocalStorage(STORAGE_KEYS.theme, 'dark');

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchAnimeData()
      .then((data) => {
        if (!active) return;
        setAnimeList(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load anime list. Showing fallback data.');
        setAnimeList(FALLBACK_ANIME);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(animeList.map((item) => item.year).filter(Boolean))];
    return uniqueYears.sort((a, b) => Number(b) - Number(a));
  }, [animeList]);

  const filteredAnime = useMemo(
    () =>
      animeList.filter((item) => {
        const searchMatches = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const yearMatches = yearFilter === 'all' || String(item.year) === String(yearFilter);
        const favoriteMatches = viewMode === 'favorites' ? favorites.includes(item.id) : true;
        return searchMatches && yearMatches && favoriteMatches;
      }),
    [animeList, searchTerm, yearFilter, viewMode, favorites]
  );

  const sortedAnime = useMemo(() => {
    const list = [...filteredAnime];
    if (sortKey === 'newest') list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    if (sortKey === 'oldest') list.sort((a, b) => Number(a.year || 0) - Number(b.year || 0));
    if (sortKey === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortKey === 'za') list.sort((a, b) => b.title.localeCompare(a.title));
    return list;
  }, [filteredAnime, sortKey]);

  const pageCount = Math.max(1, Math.ceil(sortedAnime.length / ITEMS_PER_PAGE));
  const pageItems = sortedAnime.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortKey, viewMode, yearFilter]);

  const toggleFavorite = (id) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const bannerAnime = animeList[0] || FALLBACK_ANIME[0];

  return (
    <Router>
      <div className="app-shell">
        <Navbar theme={theme} setTheme={setTheme} favoritesCount={favorites.length} />
        <main className="main-content container">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  bannerAnime={bannerAnime}
                  loading={loading}
                  error={error}
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                  sortKey={sortKey}
                  onSort={setSortKey}
                  viewMode={viewMode}
                  onViewMode={setViewMode}
                  yearFilter={yearFilter}
                  onYearFilter={setYearFilter}
                  years={years}
                  page={page}
                  pageCount={pageCount}
                  onPage={setPage}
                  pageItems={pageItems}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  totalCount={sortedAnime.length}
                />
              }
            />
            <Route
              path="/browse"
              element={
                <BrowsePage
                  bannerAnime={bannerAnime}
                  loading={loading}
                  error={error}
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                  sortKey={sortKey}
                  onSort={setSortKey}
                  viewMode={viewMode}
                  onViewMode={setViewMode}
                  yearFilter={yearFilter}
                  onYearFilter={setYearFilter}
                  years={years}
                  page={page}
                  pageCount={pageCount}
                  onPage={setPage}
                  pageItems={pageItems}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  totalCount={sortedAnime.length}
                />
              }
            />
            <Route path="/detail/:id" element={<DetailPage animeList={animeList} favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function Navbar({ theme, setTheme, favoritesCount }) {
  return (
    <header>
      <nav className="nav-bar" aria-label="Main navigation">
        <Link className="brand" to="/">
          Anime Library
        </Link>
        <ul>
          <li>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/browse">
              Browse
            </NavLink>
          </li>
          <li>
            <span className="tag">Favorites: {favoritesCount}</span>
          </li>
          <li>
            <button className="theme-btn" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function LandingPage({ bannerAnime }) {
  return (
    <>
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">Color-Coordinated Anime Discovery</p>
          <h1>Welcome to your next anime adventure.</h1>
          <p className="landing-text">
            Explore top-rated series, save favorites, and find new shows with a polished, modern interface designed to feel bright, calm, and vibrant.
          </p>
          <div className="hero-buttons">
            <Link className="btn-primary" to="/browse">
              Browse Library
            </Link>
            <Link className="btn-secondary" to={`/detail/${bannerAnime.id}`}>
              Featured Detail
            </Link>
          </div>
        </div>
        <div className="landing-panel">
          <div className="panel-card">
            <span className="panel-label">Featured</span>
            <h2>{bannerAnime.title}</h2>
            <p>{bannerAnime.desc}</p>
            <div className="panel-meta">
              <span>{bannerAnime.year}</span>
              <span>{bannerAnime.title.length < 18 ? 'Quick pick' : 'Recommended'}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="feature-section">
        <h2>Designed with thoughtful color balance</h2>
        <p className="landing-text">
          This homepage uses a coordinated palette of deep blues, bright cyan, and warm highlights to create a polished anime browsing experience.
        </p>
        <div className="feature-grid">
          <article className="feature-card accent-blue">
            <h3>Easy discovery</h3>
            <p>Search, filter, and sort your anime list with clear visual cues and clean spacing.</p>
          </article>
          <article className="feature-card accent-cyan">
            <h3>Favorites saved</h3>
            <p>Mark shows you love and return to them quickly from the browse screen.</p>
          </article>
          <article className="feature-card accent-mauve">
            <h3>Bright & balanced</h3>
            <p>Every section is crafted with a companion color palette for a cohesive home page look.</p>
          </article>
        </div>
      </section>
      <section className="color-swatch-section">
        <p className="eyebrow">Palette</p>
        <div className="color-swatch-grid">
          <div className="color-swatch blue">
            <span>#4D8CFF</span>
          </div>
          <div className="color-swatch cyan">
            <span>#36C2FF</span>
          </div>
          <div className="color-swatch mauve">
            <span>#8B7DFF</span>
          </div>
          <div className="color-swatch navy">
            <span>#08101F</span>
          </div>
        </div>
      </section>
    </>
  );
}

function BrowsePage({ bannerAnime, loading, error, searchTerm, onSearch, sortKey, onSort, viewMode, onViewMode, yearFilter, onYearFilter, years, page, pageCount, onPage, pageItems, favorites, onToggleFavorite, totalCount }) {
  return (
    <>
      <section className="hero-banner" style={{ backgroundImage: `url(${bannerAnime.img})` }}>
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="eyebrow">Anime Library</p>
          <h1>{bannerAnime.title}</h1>
          <p>{bannerAnime.desc}</p>
          <div className="hero-buttons">
            <Link className="btn-primary" to={`/detail/${bannerAnime.id}`}>
              View Details
            </Link>
            <button className="btn-secondary" type="button" onClick={() => onSearch(bannerAnime.title)}>
              Search Similar
            </button>
          </div>
        </div>
      </section>
      <div className="controls">
        <div className="control-row">
          <input
            type="search"
            placeholder="Search anime titles..."
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            aria-label="Search anime titles"
          />
          <select value={sortKey} onChange={(event) => onSort(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="control-row">
          {VIEW_MODES.map((mode) => (
            <button key={mode.value} type="button" className={`tag ${viewMode === mode.value ? 'active' : ''}`} onClick={() => onViewMode(mode.value)}>
              {mode.label}
            </button>
          ))}
          <select value={yearFilter} onChange={(event) => onYearFilter(event.target.value)}>
            <option value="all">All years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="status-pill">Showing {pageItems.length} of {totalCount} anime</div>
      {loading ? (
        <p className="status-message">Loading list...</p>
      ) : error ? (
        <p className="status-message">{error}</p>
      ) : pageItems.length === 0 ? (
        <p className="status-message">No anime found. Try adjusting your search or filters.</p>
      ) : (
        <AnimeGrid items={pageItems} favorites={favorites} onToggleFavorite={onToggleFavorite} />
      )}
      <Pagination currentPage={page} pageCount={pageCount} onPage={onPage} />
    </>
  );
}

function AnimeGrid({ items, favorites, onToggleFavorite }) {
  return (
    <section className="anime-grid" aria-live="polite">
      {items.map((item) => (
        <AnimeCard key={item.id} item={item} isFavorite={favorites.includes(item.id)} onToggleFavorite={onToggleFavorite} />
      ))}
    </section>
  );
}

function AnimeCard({ item, isFavorite, onToggleFavorite }) {
  return (
    <article className="anime-card">
      <img src={item.img} alt={`${item.title} cover`} />
      <div className="card-body">
        <div className="card-meta">
          <h3>{item.title}</h3>
          <span>{item.year}</span>
        </div>
        <p>{item.desc.slice(0, 120)}{item.desc.length > 120 ? '...' : ''}</p>
        <div className="card-actions">
          <Link className="action-btn" to={`/detail/${item.id}`}>
            Details
          </Link>
          <button className="action-btn" type="button" onClick={() => onToggleFavorite(item.id)}>
            {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
          </button>
        </div>
      </div>
    </article>
  );
}

function Pagination({ currentPage, pageCount, onPage }) {
  if (pageCount <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(pageCount, currentPage + 2);
  for (let value = start; value <= end; value += 1) {
    pages.push(value);
  }

  return (
    <div className="pagination" aria-label="Pagination">
      <button className="page-btn" type="button" disabled={currentPage === 1} onClick={() => onPage(currentPage - 1)}>
        Prev
      </button>
      {pages.map((page) => (
        <button key={page} type="button" className={`page-btn ${page === currentPage ? 'active' : ''}`} onClick={() => onPage(page)}>
          {page}
        </button>
      ))}
      <button className="page-btn" type="button" disabled={currentPage === pageCount} onClick={() => onPage(currentPage + 1)}>
        Next
      </button>
    </div>
  );
}

function DetailPage({ animeList, favorites, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const animeId = Number(id);
  const item = animeList.find((entry) => entry.id === animeId) || FALLBACK_ANIME.find((entry) => entry.id === animeId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [animeId]);

  if (!item) {
    return (
      <section className="detail-page">
        <p style={{ color: 'var(--muted)' }}>Anime not found. Return to the homepage to browse again.</p>
        <button className="action-btn" type="button" onClick={() => navigate('/')}>Back Home</button>
      </section>
    );
  }

  return (
    <section className="detail-page">
      <Link className="back-link" to="/">← Back to library</Link>
      <div className="detail-card">
        <img src={item.img} alt={item.title} />
        <div className="detail-body">
          <div className="detail-meta">{item.year} · Anime</div>
          <h1>{item.title}</h1>
          <p>{item.desc}</p>
          <div className="card-actions">
            <button className="action-btn" type="button" onClick={() => onToggleFavorite(item.id)}>
              {favorites.includes(item.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button className="action-btn" type="button" onClick={() => navigate('/')}>Browse More</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section style={{ padding: '2rem 0', color: 'var(--muted)' }}>
      <h1>Page not found</h1>
      <p>We couldn’t locate that page. Try returning to the homepage.</p>
      <Link className="action-btn" to="/">Go Home</Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>React-powered FES rebuild with search, sorting, favorites, pagination, details pages, and theme persistence.</p>
      <p>Data loads from AniList GraphQL with fallback assets for offline-friendly browsing.</p>
    </footer>
  );
}

export default App;
