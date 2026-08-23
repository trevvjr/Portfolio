const { useState, useEffect, useMemo } = React;
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
  const [value, setValue] = useState(function () {
    try {
      var stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(function () {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValue];
}

function fetchAnimeData() {
  var query = "\n    query {\n      Page(perPage: 100) {\n        media(type: ANIME, sort: POPULARITY_DESC) {\n          id\n          title { romaji }\n          startDate { year }\n          description(asHtml: false)\n          coverImage { large }\n        }\n      }\n    }\n  ";

  return fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: query }),
  })
    .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('API error')); })
    .then(function (json) {
      var media = ((json && json.data && json.data.Page && json.data.Page.media) || []);
      if (!media.length) {
        return FALLBACK_ANIME;
      }
      return media.slice(0, 24).map(function (item) {
        return {
          id: item.id,
          title: (item.title && item.title.romaji) || 'Unknown',
          year: (item.startDate && item.startDate.year) || 'N/A',
          img: (item.coverImage && item.coverImage.large) || 'https://i.imgur.com/7YfZQ0S.jpeg',
          desc: item.description ? item.description.replace(/<[^>]*>/g, '') : 'No description available.',
        };
      });
    });
}

function parseHash() {
  var hash = window.location.hash.replace(/^#/, '');
  if (hash.indexOf('/detail/') === 0) {
    var idString = hash.split('/')[2];
    var id = Number(idString);
    return { page: 'detail', id: isNaN(id) ? null : id };
  }
  return { page: 'home', id: null };
}

function App() {
  var routeState = useState(parseHash());
  var route = routeState[0];
  var setRoute = routeState[1];
  var _a = useState([]), animeList = _a[0], setAnimeList = _a[1];
  var _b = useState(true), loading = _b[0], setLoading = _b[1];
  var _c = useState(''), error = _c[0], setError = _c[1];
  var _d = useState(''), searchTerm = _d[0], setSearchTerm = _d[1];
  var _e = useState('newest'), sortKey = _e[0], setSortKey = _e[1];
  var _f = useState('all'), viewMode = _f[0], setViewMode = _f[1];
  var _g = useState('all'), yearFilter = _g[0], setYearFilter = _g[1];
  var _h = useState(1), page = _h[0], setPage = _h[1];
  var _j = useLocalStorage(STORAGE_KEYS.favorites, []), favorites = _j[0], setFavorites = _j[1];
  var _k = useLocalStorage(STORAGE_KEYS.theme, 'dark'), theme = _k[0], setTheme = _k[1];

  useEffect(function () {
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(function () {
    setLoading(true);
    fetchAnimeData()
      .then(setAnimeList)
      .catch(function (err) {
        console.error(err);
        setError('Unable to load anime list. Showing fallback data.');
        setAnimeList(FALLBACK_ANIME);
      })
      .finally(function () { setLoading(false); });
  }, []);

  useEffect(function () {
    var onHashChange = function () {
      setRoute(parseHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return function () {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  var years = useMemo(function () {
    var unique = [];
    animeList.forEach(function (item) {
      if (item.year && unique.indexOf(item.year) === -1) {
        unique.push(item.year);
      }
    });
    return unique.sort(function (a, b) { return Number(b) - Number(a); });
  }, [animeList]);

  var filteredAnime = useMemo(function () {
    return animeList.filter(function (item) {
      var searchMatches = item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
      var yearMatches = yearFilter === 'all' || String(item.year) === String(yearFilter);
      var favoriteMatches = viewMode === 'favorites' ? favorites.indexOf(item.id) !== -1 : true;
      return searchMatches && yearMatches && favoriteMatches;
    });
  }, [animeList, searchTerm, yearFilter, viewMode, favorites]);

  var sortedAnime = useMemo(function () {
    var list = filteredAnime.slice();
    if (sortKey === 'newest') list.sort(function (a, b) { return Number(b.year || 0) - Number(a.year || 0); });
    if (sortKey === 'oldest') list.sort(function (a, b) { return Number(a.year || 0) - Number(b.year || 0); });
    if (sortKey === 'az') list.sort(function (a, b) { return a.title.localeCompare(b.title); });
    if (sortKey === 'za') list.sort(function (a, b) { return b.title.localeCompare(a.title); });
    return list;
  }, [filteredAnime, sortKey]);

  var pageCount = Math.max(1, Math.ceil(sortedAnime.length / ITEMS_PER_PAGE));
  var pageItems = sortedAnime.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(function () {
    setPage(1);
  }, [searchTerm, sortKey, viewMode, yearFilter]);

  var toggleFavorite = function (id) {
    setFavorites(function (current) {
      return current.indexOf(id) !== -1 ? current.filter(function (item) { return item !== id; }) : current.concat([id]);
    });
  };

  var bannerAnime = animeList.length ? animeList[0] : FALLBACK_ANIME[0];
  var content = route.page === 'detail' ? React.createElement(DetailPage, { id: route.id, animeList: animeList, favorites: favorites, onToggleFavorite: toggleFavorite }) : React.createElement(HomePage, { bannerAnime: bannerAnime, loading: loading, error: error, searchTerm: searchTerm, onSearch: setSearchTerm, sortKey: sortKey, onSort: setSortKey, viewMode: viewMode, onViewMode: setViewMode, yearFilter: yearFilter, onYearFilter: setYearFilter, years: years, page: page, pageCount: pageCount, onPage: setPage, pageItems: pageItems, favorites: favorites, onToggleFavorite: toggleFavorite, totalCount: sortedAnime.length });

  return React.createElement('div', { className: 'app-shell' },
    React.createElement(Navbar, { theme: theme, setTheme: setTheme, favoritesCount: favorites.length }),
    React.createElement('main', { className: 'main-content container' }, content),
    React.createElement(Footer, null)
  );
}

function Navbar(_a) {
  var theme = _a.theme, setTheme = _a.setTheme, favoritesCount = _a.favoritesCount;
  return React.createElement('header', null,
    React.createElement('nav', { className: 'nav-bar', 'aria-label': 'Main navigation' },
      React.createElement('a', { className: 'brand', href: '#/' }, 'Anime Library'),
      React.createElement('ul', null,
        React.createElement('li', null, React.createElement('a', { href: '#/' }, 'Home')),
        React.createElement('li', null, React.createElement('a', { href: '#/' }, 'Anime List')),
        React.createElement('li', null, React.createElement('span', { className: 'tag' }, 'Favorites: ', favoritesCount)),
        React.createElement('li', null, React.createElement('button', { className: 'theme-btn', type: 'button', onClick: function () { return setTheme(theme === 'dark' ? 'light' : 'dark'); } }, theme === 'dark' ? 'Light Mode' : 'Dark Mode'))
      )
    )
  );
}

function HomePage(props) {
  return React.createElement(React.Fragment, null,
    React.createElement('section', { className: 'hero-banner', style: { backgroundImage: "url(" + props.bannerAnime.img + ")" } },
      React.createElement('div', { className: 'hero-overlay' }),
      React.createElement('div', { className: 'hero-copy' },
        React.createElement('p', { className: 'eyebrow' }, 'Anime Library'),
        React.createElement('h1', null, props.bannerAnime.title),
        React.createElement('p', null, props.bannerAnime.desc),
        React.createElement('div', { className: 'hero-buttons' },
          React.createElement('a', { className: 'btn-primary', href: '#/detail/' + props.bannerAnime.id }, 'View Details'),
          React.createElement('button', { className: 'btn-secondary', type: 'button', onClick: function () { return props.onSearch(props.bannerAnime.title); } }, 'Search Similar')
        )
      )
    ),
    React.createElement('div', { className: 'controls' },
      React.createElement('div', { className: 'control-row' },
        React.createElement('input', { type: 'search', placeholder: 'Search anime titles...', value: props.searchTerm, onChange: function (event) { return props.onSearch(event.target.value); }, 'aria-label': 'Search anime titles' }),
        React.createElement('select', { value: props.sortKey, onChange: function (event) { return props.onSort(event.target.value); } },
          SORT_OPTIONS.map(function (option) {
            return React.createElement('option', { key: option.value, value: option.value }, option.label);
          })
        )
      ),
      React.createElement('div', { className: 'control-row' },
        VIEW_MODES.map(function (mode) {
          return React.createElement('button', { key: mode.value, type: 'button', className: 'tag ' + (props.viewMode === mode.value ? 'active' : ''), onClick: function () { return props.onViewMode(mode.value); } }, mode.label);
        }),
        React.createElement('select', { value: props.yearFilter, onChange: function (event) { return props.onYearFilter(event.target.value); } },
          React.createElement('option', { value: 'all' }, 'All years'),
          props.years.map(function (year) {
            return React.createElement('option', { key: year, value: year }, year);
          })
        )
      )
    ),
    React.createElement('div', { className: 'status-pill' }, 'Showing ', props.pageItems.length, ' of ', props.totalCount, ' anime'),
    props.loading ?
      React.createElement('p', { style: { padding: '1rem 0', color: 'var(--muted)' } }, 'Loading list...') :
      props.error ?
        React.createElement('p', { style: { padding: '1rem 0', color: 'var(--muted)' } }, props.error) :
        props.pageItems.length === 0 ?
          React.createElement('p', { style: { padding: '1rem 0', color: 'var(--muted)' } }, 'No anime found. Try adjusting your search or filters.') :
          React.createElement(AnimeGrid, { items: props.pageItems, favorites: props.favorites, onToggleFavorite: props.onToggleFavorite }),
    React.createElement(Pagination, { currentPage: props.page, pageCount: props.pageCount, onPage: props.onPage })
  );
}

function AnimeGrid(props) {
  return React.createElement('section', { className: 'anime-grid', 'aria-live': 'polite' },
    props.items.map(function (item) {
      return React.createElement(AnimeCard, { key: item.id, item: item, isFavorite: props.favorites.indexOf(item.id) !== -1, onToggleFavorite: props.onToggleFavorite });
    })
  );
}

function AnimeCard(props) {
  return React.createElement('article', { className: 'anime-card' },
    React.createElement('img', { src: props.item.img, alt: props.item.title + ' cover' }),
    React.createElement('div', { className: 'card-body' },
      React.createElement('div', { className: 'card-meta' },
        React.createElement('h3', null, props.item.title),
        React.createElement('span', null, props.item.year)
      ),
      React.createElement('p', null, props.item.desc.slice(0, 120) + (props.item.desc.length > 120 ? '...' : '')),
      React.createElement('div', { className: 'card-actions' },
        React.createElement('a', { className: 'action-btn', href: '#/detail/' + props.item.id }, 'Details'),
        React.createElement('button', { className: 'action-btn', type: 'button', onClick: function () { return props.onToggleFavorite(props.item.id); } }, props.isFavorite ? 'Remove Favorite' : 'Add Favorite')
      )
    )
  );
}

function Pagination(props) {
  if (props.pageCount <= 1) return null;

  var pages = [];
  var start = Math.max(1, props.currentPage - 2);
  var end = Math.min(props.pageCount, props.currentPage + 2);
  for (var value = start; value <= end; value += 1) {
    pages.push(value);
  }

  return React.createElement('div', { className: 'pagination', 'aria-label': 'Pagination' },
    React.createElement('button', { className: 'page-btn', type: 'button', disabled: props.currentPage === 1, onClick: function () { return props.onPage(props.currentPage - 1); } }, 'Prev'),
    pages.map(function (page) {
      return React.createElement('button', { key: page, type: 'button', className: 'page-btn ' + (page === props.currentPage ? 'active' : ''), onClick: function () { return props.onPage(page); } }, page);
    }),
    React.createElement('button', { className: 'page-btn', type: 'button', disabled: props.currentPage === props.pageCount, onClick: function () { return props.onPage(props.currentPage + 1); } }, 'Next')
  );
}

function DetailPage(props) {
  useEffect(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [props.id]);

  var item = (props.animeList || []).find(function (entry) { return entry.id === props.id; }) || FALLBACK_ANIME.find(function (entry) { return entry.id === props.id; });

  if (!item) {
    return React.createElement('section', { className: 'detail-page' },
      React.createElement('p', { style: { color: 'var(--muted)' } }, 'Anime not found. Return to the homepage to browse again.'),
      React.createElement('a', { className: 'action-btn', href: '#/' }, 'Back Home')
    );
  }

  return React.createElement('section', { className: 'detail-page' },
    React.createElement('a', { className: 'back-link', href: '#/' }, '← Back to library'),
    React.createElement('div', { className: 'detail-card' },
      React.createElement('img', { src: item.img, alt: item.title }),
      React.createElement('div', { className: 'detail-body' },
        React.createElement('div', { className: 'detail-meta' }, item.year + ' · Anime'),
        React.createElement('h1', null, item.title),
        React.createElement('p', null, item.desc),
        React.createElement('div', { className: 'card-actions' },
          React.createElement('button', { className: 'action-btn', type: 'button', onClick: function () { return props.onToggleFavorite(item.id); } }, props.favorites.indexOf(item.id) !== -1 ? 'Remove from Favorites' : 'Add to Favorites'),
          React.createElement('a', { className: 'action-btn', href: '#/' }, 'Browse More')
        )
      )
    )
  );
}

function NotFound() {
  return React.createElement('section', { style: { padding: '2rem 0', color: 'var(--muted)' } },
    React.createElement('h1', null, 'Page not found'),
    React.createElement('p', null, 'We couldn’t locate that page. Try returning to the homepage.'),
    React.createElement('a', { className: 'action-btn', href: '#/' }, 'Go Home')
  );
}

function Footer() {
  return React.createElement('footer', { className: 'footer' },
    React.createElement('p', null, 'React-powered FES rebuild with search, sorting, favorites, pagination, details pages, and theme persistence.'),
    React.createElement('p', null, 'Data loads from AniList GraphQL with fallback assets for offline-friendly browsing.')
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
