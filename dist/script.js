const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Header: mobile menu and a hairline once the page scrolls.
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('#site-nav');
const setMenu = open => { menuButton.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); };
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuButton.focus(); } });
document.addEventListener('click', e => { if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuButton.contains(e.target)) setMenu(false); });
addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); });
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, {passive: true});
onScroll();

// Dot-matrix icons, drawn like Keeper's LED eyes.
const patterns = {
  see: ['.......', '..###..', '.#...#.', '#..#..#', '.#...#.', '..###..', '.......'],
  explain: ['#######', '#.....#', '#.#...#', '#.##..#', '#.###.#', '#######', '..###..'],
  listen: ['..#....', '..#.#..', '#.#.#.#', '#.#.#.#', '#.#.#.#', '..#.#..', '..#....'],
  offline: ['.#.#.#.', '#######', '##...##', '##.#.##', '##...##', '#######', '.#.#.#.']
};
document.querySelectorAll('[data-dots]').forEach(el => {
  el.innerHTML = patterns[el.dataset.dots].join('').split('').map(c => c === '#' ? '<i class="on"></i>' : '<i></i>').join('');
});

// Hero: cycle the five paintings across Keeper's real screen.
const screenImages = [...document.querySelectorAll('.keeper-screen img')];
const screenName = document.querySelector('#screen-name');
let screenIndex = 0;
if (!reducedMotion.matches) {
  setInterval(() => {
    if (document.hidden) return;
    screenImages[screenIndex].classList.remove('is-on');
    screenIndex = (screenIndex + 1) % screenImages.length;
    screenImages[screenIndex].classList.add('is-on');
    screenName.textContent = screenImages[screenIndex].dataset.name;
  }, 3000);
}

// Ask Keeper: a scripted conversation for each painting.
const art = {
  madhubani: {
    name: 'Madhubani', place: 'Mithila, Bihar', tint: '#FBEBDF',
    questions: [
      ['What am I looking at?', 'This is a Madhubani painting, from the Mithila region of Bihar. It shows a peacock with a fish curled into its body, two favourite Madhubani subjects. Notice the double outlines, and how almost no space is left empty.'],
      ['Who painted these first?', 'For generations, women in Mithila painted these images on the walls and floors of their homes, especially for weddings and festivals. Painting on paper became common in the 1960s, and that helped the art travel far beyond Bihar.'],
      ['Why is every space filled?', 'Madhubani artists rarely leave a gap. Empty areas get filled with flowers, leaves, fish, lines and patterns. The bold outlines packed with fine hatching, like the white bands on this peacock, are a signature of the style.'],
      ['Where do the colours come from?', 'Traditionally, from plants and minerals close at hand: turmeric for yellow, indigo for blue and lamp soot for black. Brushes could be as simple as a twig or a matchstick.']
    ]
  },
  warli: {
    name: 'Warli', place: 'Maharashtra', tint: '#F4E3E0',
    questions: [
      ['What am I looking at?', 'This is a Warli painting, made by the Warli community of Maharashtra. Everything here is built from circles, triangles and lines. In the centre, people hold hands and dance in a ring.'],
      ['What is the dance?', 'Rings of linked dancers are one of the best-known Warli images. They are often connected to the tarpa dance, where people move in a spiral around a musician playing the tarpa, a horn made from a dried gourd.'],
      ['Why only simple shapes?', 'Warli artists draw the world with a few basic forms. The circle comes from the sun and moon, the triangle from mountains and trees. Two triangles joined at the tip make a person.'],
      ['What is it painted with?', 'Traditionally, a white paste of ground rice and water, painted onto mud walls with a bamboo stick chewed at one end into a brush. The deep red background here recalls those earthen walls.']
    ]
  },
  pattachitra: {
    name: 'Pattachitra', place: 'Odisha', tint: '#FAF0D0',
    questions: [
      ['What am I looking at?', 'This is Pattachitra, a painting tradition from Odisha. The figure in the centre is Lord Jagannath, whose temple in Puri is closely tied to this art. See how many borders frame him.'],
      ['What does the name mean?', 'It comes from Sanskrit. Patta means cloth and chitra means picture. Artists traditionally coat cotton cloth with chalk and gum until it is stiff and smooth, then paint on that surface.'],
      ['Why such detailed borders?', 'Borders are a hallmark of Pattachitra. The main scene is framed with rows of flowers, vines and patterns, drawn with very fine brushes. Large pieces can take weeks to finish.'],
      ['Is it a way of telling stories?', 'Very much. In Odisha, the paintings tell stories of Jagannath and the epics. In Bengal, painters called patuas make long scroll versions and sing the story aloud as they unroll them. They were keepers of stories long before us.']
    ]
  },
  tanjore: {
    name: 'Tanjore', place: 'Thanjavur, Tamil Nadu', tint: '#F2EADA',
    questions: [
      ['What am I looking at?', 'This is a Tanjore painting, from Thanjavur in Tamil Nadu. It shows Lord Ganesha writing in a book. The shine you can see comes from gold foil laid over raised patterns.'],
      ['Why is it so shiny?', 'Tanjore artists build up raised details with a paste, then cover them in thin gold foil. Glass beads and stones are often set into the jewellery and arches, so the painting catches the light.'],
      ['Why is Ganesha writing?', 'A well-known story says Ganesha wrote down the Mahabharata as the sage Vyasa recited it, without stopping once. That makes him a fitting figure for a robot called Keeper of Stories.'],
      ['How old is this style?', 'It grew up around the royal court of Thanjavur and flourished under its Maratha rulers in the 18th and 19th centuries. Paintings were traditionally made on wooden boards, and artists still make them today.']
    ]
  },
  kalamkari: {
    name: 'Kalamkari', place: 'Andhra Pradesh', tint: '#E3EAF5',
    questions: [
      ['What am I looking at?', 'This is Kalamkari, a hand-painted textile art from Andhra Pradesh. A peacock sits beneath a flowering tree, and every vine and petal was drawn by hand onto cloth.'],
      ['What does the name mean?', 'Kalam means pen and kari means craftsmanship. In the Srikalahasti style, artists draw freehand with a pen made from bamboo, then fill in the colours by hand.'],
      ['Where do the dyes come from?', 'Traditional Kalamkari uses natural dyes from plants, roots and minerals. The cloth is treated with myrobalan and milk so the colours hold, and it goes through many rounds of drawing, dyeing and washing.'],
      ['What does the tree mean?', 'Flowering trees full of vines and birds are a common Kalamkari design, sometimes called a tree of life. Paired with a peacock, they suggest nature, growth and plenty.']
    ]
  }
};

const askSection = document.querySelector('#ask');
const wallItems = [...document.querySelectorAll('.wall-item')];
const status = document.querySelector('#ask-status');
const questionEl = document.querySelector('#ask-question');
const answerEl = document.querySelector('#ask-answer');
const liveEl = document.querySelector('#ask-live');
const chips = document.querySelector('#ask-chips');
let current = 'madhubani';
let typingTimer = 0;
let scanTimer = 0;

function setStatus(key) {
  const b = document.createElement('b');
  b.textContent = art[key].name;
  status.replaceChildren('Recognised ', b, ` · ${art[key].place}`);
}

function typeAnswer(text) {
  clearInterval(typingTimer);
  liveEl.textContent = `Keeper says: ${text}`;
  if (reducedMotion.matches) { answerEl.textContent = text; return; }
  let shown = 0;
  answerEl.textContent = '';
  answerEl.classList.add('is-typing');
  typingTimer = setInterval(() => {
    shown += 2;
    answerEl.textContent = text.slice(0, shown);
    if (shown >= text.length) { clearInterval(typingTimer); answerEl.classList.remove('is-typing'); }
  }, 18);
}

function ask(index) {
  const [question, answer] = art[current].questions[index];
  questionEl.textContent = question;
  chips.querySelectorAll('.chip-btn').forEach((chip, i) => chip.setAttribute('aria-pressed', String(i === index)));
  typeAnswer(answer);
}

function renderChips() {
  chips.replaceChildren(...art[current].questions.map(([question], i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip-btn';
    chip.textContent = question;
    chip.setAttribute('aria-pressed', String(i === 0));
    chip.addEventListener('click', () => ask(i));
    return chip;
  }));
}

function selectArt(key) {
  current = key;
  clearTimeout(scanTimer);
  clearInterval(typingTimer);
  answerEl.classList.remove('is-typing');
  wallItems.forEach(item => { item.setAttribute('aria-pressed', String(item.dataset.art === key)); item.classList.remove('is-scanning'); });
  askSection.style.setProperty('--tint', art[key].tint);
  renderChips();
  if (reducedMotion.matches) { setStatus(key); ask(0); return; }
  const item = wallItems.find(el => el.dataset.art === key);
  void item.offsetWidth;
  item.classList.add('is-scanning');
  status.textContent = 'Looking at the painting…';
  questionEl.textContent = art[key].questions[0][0];
  answerEl.textContent = '';
  scanTimer = setTimeout(() => { item.classList.remove('is-scanning'); setStatus(key); ask(0); }, 900);
}

wallItems.forEach(item => item.addEventListener('click', () => selectArt(item.dataset.art)));
renderChips();

// Reveal below-the-fold content, and mark the current section in the nav.
if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('will-reveal'); reveals.unobserve(entry.target); }
  }), {threshold: .08, rootMargin: '0px 0px -40px 0px'});
  if (!reducedMotion.matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('will-reveal'); reveals.observe(el); }
    });
  }
  const links = [...nav.querySelectorAll('a')];
  const sections = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.hash === `#${entry.target.id}` ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
  }), {rootMargin: '-35% 0px -60% 0px'});
  links.forEach(link => { const target = document.querySelector(link.hash); if (target) sections.observe(target); });
}
addEventListener('beforeprint', () => document.querySelectorAll('.will-reveal').forEach(el => el.classList.remove('will-reveal')));
