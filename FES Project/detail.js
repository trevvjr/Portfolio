const themeToggle = document.getElementById("themeToggle");
const detailImg = document.getElementById("detailImg");
const detailTitle = document.getElementById("detailTitle");
const detailYear = document.getElementById("detailYear");
const detailDesc = document.getElementById("detailDesc");

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
themeToggle?.addEventListener("click",toggleTheme);
applySavedTheme();

function getQueryParam(name){
  const params=new URLSearchParams(window.location.search);
  return params.get(name);
}

async function fetchAnimeById(id){
  const query=`
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji }
        startDate { year }
        description(asHtml: false)
        coverImage { large }
      }
    }`;
  try{
    const res=await fetch("https://graphql.anilist.co",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({query,variables:{id:Number(id)}})
    });
    if(!res.ok){
      detailTitle.textContent="Error loading anime";
      detailDesc.textContent="Unable to load details. Try again later.";
      return;
    }
    const json=await res.json();
    const m=json?.data?.Media;
    if(!m){
      detailTitle.textContent="Not found";
      detailDesc.textContent="Anime not found.";
      return;
    }
    detailImg.src=m.coverImage?.large || "";
    detailImg.alt=(m.title?.romaji || "Anime")+" poster";
    detailTitle.textContent=m.title?.romaji || "Untitled";
    detailYear.textContent=m.startDate?.year ? `Released: ${m.startDate.year}` : "Year: N/A";
    detailDesc.textContent=m.description ? m.description.replace(/<[^>]*>?/gm,"") : "No description available.";
  }catch(e){
    console.error(e);
    detailTitle.textContent="Error";
    detailDesc.textContent="Unable to load details. Try again later.";
  }
}

const id=getQueryParam("id");
if(!id){
  detailTitle.textContent="No anime selected";
  detailDesc.textContent="Go back and click a title from the list.";
}else{
  fetchAnimeById(id);
}
