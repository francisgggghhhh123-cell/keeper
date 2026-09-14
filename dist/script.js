const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
const closeMenu = () => { menu.hidden = true; toggle.setAttribute('aria-expanded','false'); };
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; menu.hidden = open; toggle.setAttribute('aria-expanded',String(!open)); });
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && !menu.hidden){closeMenu();toggle.focus();}});
document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!toggle.contains(e.target))closeMenu();});
const progress = document.querySelector('.reading-progress');
let ticking = false;
function updateScroll(){const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});
updateScroll();

const exchanges = {
  intro: {question:'What am I looking at?', answer:'This is Madhubani, a painting tradition from the Mithila region of Bihar. Its lines and colours carry stories of nature, everyday life and belief.'},
  patterns: {question:'Why so many patterns?', answer:'In Madhubani, even the spaces between figures have a role. Artists fill them with flowers, birds and geometric patterns, carrying designs passed through generations.'},
  colours: {question:'Where do the colours come from?', answer:'Traditionally, artists made colours from the world around them: turmeric for yellow, indigo for blue and leaves for green. The materials became part of the story, too.'},
  simple: {question:'Can you explain it more simply?', answer:'Think of it as a story told in pictures. The artist uses lines, colours and familiar shapes to share something about their world.'}
};
const question = document.querySelector('#visitor-question');
const answer = document.querySelector('#keeper-answer');
const exchange = document.querySelector('.exchange');
const resetQuestion = document.querySelector('.question-reset');
document.querySelectorAll('[data-question]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.question;
  const entry=exchanges[key];
  question.textContent=`“${entry.question}”`;
  answer.textContent=`“${entry.answer}”`;
  document.querySelectorAll('.question-button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  resetQuestion.hidden=key==='intro';
  if(key==='intro') document.querySelector('.question-button').focus({preventScroll:true});
  exchange.classList.remove('is-changing');
  void exchange.offsetWidth;
  exchange.classList.add('is-changing');
}));

const range=document.querySelector('#comparison-range');
range.addEventListener('input',()=>{
  document.querySelector('.comparison').style.setProperty('--split',`${range.value}%`);
  range.setAttribute('aria-valuetext',`${range.value} percent prototype, ${100-Number(range.value)} percent finished Keeper`);
});
const strip=document.querySelector('.culture-strip');
const previous=document.querySelector('.strip-prev');
const next=document.querySelector('.strip-next');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function updateStrip(){previous.disabled=strip.scrollLeft<2;next.disabled=strip.scrollLeft+strip.clientWidth>=strip.scrollWidth-3;}
function moveStrip(direction){strip.scrollBy({left:direction*(strip.querySelector('article').offsetWidth),behavior:reducedMotion.matches?'instant':'smooth'});}
previous.addEventListener('click',()=>moveStrip(-1));
next.addEventListener('click',()=>moveStrip(1));
strip.addEventListener('scroll',updateStrip,{passive:true});
strip.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveStrip(e.key==='ArrowRight'?1:-1);}});
addEventListener('resize',()=>{updateStrip();updateScroll();if(innerWidth>700)closeMenu();});
updateStrip();

if('IntersectionObserver' in window){
  const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');entry.target.classList.remove('will-reveal');reveals.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -28px 0px'});
  document.querySelectorAll('.reveal').forEach(element=>{if(element.getBoundingClientRect().top>innerHeight&&!reducedMotion.matches){element.classList.add('will-reveal');reveals.observe(element);}});
  const chapters=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-active');}),{threshold:.45});
  document.querySelectorAll('.timeline-chapter').forEach(el=>chapters.observe(el));
  const sectionNav=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}}),{rootMargin:'-15% 0px -55% 0px'});
  document.querySelectorAll('#purpose,#keeper,#journey,#nationals,#people').forEach(el=>sectionNav.observe(el));
}
// Print and motion preferences never hide the documentary content.
addEventListener('beforeprint',()=>document.querySelectorAll('.will-reveal').forEach(el=>el.classList.remove('will-reveal')));
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)document.querySelectorAll('.will-reveal').forEach(el=>el.classList.remove('will-reveal'));});
