const ITEMS_PER_PAGE = 12;
let animeList = [];
let currentPage = 1;

const grid = document.getElementById("animeGrid");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const searchInputHeader = document.getElementById("searchInputHeader");
const paginationEl = document.getElementById("pagination");
const themeToggle = document.getElementById("themeToggle");

const FALLBACK = [
  { id: 1, title: "Naruto", year: 2002, img: "https://i.imgur.com/8XqQ0kL.jpeg", desc: "Fallback: Naruto description." },
  { id: 2, title: "One Piece", year: 1999, img: "https://i.imgur.com/7YfZQ0S.jpeg", desc: "Fallback: One Piece description." },
  { id: 3, title: "Demon Slayer", year: 2019, img: "https://i.imgur.com/9RfZQ0S.jpeg", desc: "Fallback: Demon Slayer description." }
];

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function showMessage(msg){
  grid.innerHTML = `<p style="color:var(--muted);padding:12px;">${escapeHtml(msg)}</p>`;
}

async function fetchAnime(){
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
    }`;
  try{
    const res = await fetch("https://graphql.anilist.co",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({query})
    });
    if(!res.ok){
      animeList = FALLBACK;
      showMessage("AniList error — showing fallback data.");
      applyFiltersAndRender();
      return;
    }
    const json = await res.json();
    const media = json?.data?.Page?.media || [];
    if(!media.length){
      animeList = FALLBACK;
      showMessage("No anime from API — showing fallback data.");
      applyFiltersAndRender();
      return;
    }
    animeList = media.map(m=>({
      id:m.id,
      title:m.title?.romaji || "Untitled",
      year:m.startDate?.year || null,
      img:m.coverImage?.large || "",
      desc:m.description ? m.description.replace(/<[^>]*>?/gm,"") : "No description available."
    }));
    applyFiltersAndRender();
  }catch(e){
    console.error(e);
    animeList = FALLBACK;
    showMessage("Network error — showing fallback data.");
    applyFiltersAndRender();
  }
}

function sortAnime(list,mode){
  const sorted=[...list];
  if(mode==="newest") sorted.sort((a,b)=>(Number(b.year)||0)-(Number(a.year)||0));
  else if(mode==="oldest") sorted.sort((a,b)=>(Number(a.year)||0)-(Number(b.year)||0));
  else if(mode==="az") sorted.sort((a,b)=>a.title.localeCompare(b.title));
  else if(mode==="za") sorted.sort((a,b)=>b.title.localeCompare(a.title));
  return sorted;
}

function displayAnime(list,page=1){
  grid.innerHTML="";
  if(!list.length){
    grid.innerHTML=`<p style="color:var(--muted);padding:12px;">No results found.</p>`;
    paginationEl.innerHTML="";
    return;
  }
  const total=list.length;
  const pages=Math.ceil(total/ITEMS_PER_PAGE);
  if(page<1) page=1;
  if(page>pages) page=pages;
  currentPage=page;
  const start=(page-1)*ITEMS_PER_PAGE;
  const pageItems=list.slice(start,start+ITEMS_PER_PAGE);

  pageItems.forEach(item=>{
    const card=document.createElement("article");
    card.className="anime-card";
    card.innerHTML=`
      <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)} poster">
      <div class="card-body">
        <h3 data-id="${item.id}">${escapeHtml(item.title)}</h3>
        <p class="muted">${item.year || "Year N/A"}</p>
      </div>`;
    grid.appendChild(card);
  });

  grid.querySelectorAll("h3[data-id]").forEach(h=>{
    h.addEventListener("click",()=>{
      const id=h.dataset.id;
      window.location.href=`detail.html?id=${encodeURIComponent(id)}`;
    });
  });

  renderPagination(pages,page);
}

function renderPagination(totalPages,activePage){
  paginationEl.innerHTML="";
  if(totalPages<=1) return;
  const createBtn=(label,page,cls="")=>{
    const b=document.createElement("button");
    b.className=`page-btn ${cls}`.trim();
    b.textContent=label;
    b.addEventListener("click",()=>{
      applyFiltersAndRender(page);
      window.scrollTo({top:0,behavior:"smooth"});
    });
    return b;
  };
  if(activePage>1) paginationEl.appendChild(createBtn("Prev",activePage-1));
  const maxButtons=7;
  let start=Math.max(1,activePage-Math.floor(maxButtons/2));
  let end=Math.min(totalPages,start+maxButtons-1);
  if(end-start<maxButtons-1) start=Math.max(1,end-maxButtons+1);
  for(let p=start;p<=end;p++){
    paginationEl.appendChild(createBtn(p,p,p===activePage?"active":""));
  }
  if(activePage<totalPages) paginationEl.appendChild(createBtn("Next",activePage+1));
}

function applyFiltersAndRender(page=1){
  const q1=(searchInput?.value || "").trim().toLowerCase();
  const q2=(searchInputHeader?.value || "").trim().toLowerCase();
  const q=q1 || q2;
  const filtered=animeList.filter(a=>a.title.toLowerCase().includes(q));
  const sorted=sortAnime(filtered,sortSelect.value);
  displayAnime(sorted,page);
}

/* THEME */
function applySavedTheme(){
  const saved=localStorage.getItem("site-theme");
  if(saved==="light") document.body.classList.add("light");
  else document.body.classList.remove("light");
  updateThemeButtonText();
}
function toggleTheme(){
  document.body.classList.toggle("light");
  const isLight=document.body.classList.contains("light");
  localStorage.setItem("site-theme",isLight?"light":"dark");
  updateThemeButtonText();
}
function updateThemeButtonText(){
  const isLight=document.body.classList.contains("light");
  if(themeToggle){
    themeToggle.textContent=isLight?"Dark Mode":"Light Mode";
    themeToggle.setAttribute("aria-pressed",String(isLight));
  }
}

/* EVENTS */
searchInput?.addEventListener("input",()=>applyFiltersAndRender(1));
searchInputHeader?.addEventListener("input",()=>{
  if(searchInput) searchInput.value=searchInputHeader.value;
  applyFiltersAndRender(1);
});
sortSelect?.addEventListener("change",()=>applyFiltersAndRender(1));
themeToggle?.addEventListener("click",toggleTheme);

/* INIT */
applySavedTheme();
fetchAnime();
