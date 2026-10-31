(() => {
  if (document.body.classList.contains('brand-resource') && document.body.dataset.page !== 'resources-index') {
    const main = document.querySelector('main') || document.querySelector('.page');
    if (main) {
      const crumb = document.createElement('nav');
      crumb.className = 'brand-resource-nav'; crumb.dataset.brandShell = '';
      crumb.setAttribute('aria-label', 'Breadcrumb');
      const home = document.createElement('a'); home.href='/';home.textContent='Home';
      const resources = document.createElement('a');resources.href='/resources/';resources.textContent='Back to resources';
      const current = document.createElement('span');current.className='current';current.textContent=document.querySelector('h1')?.textContent || '';current.setAttribute('aria-current','page');
      crumb.append(home,document.createTextNode('/'),resources,document.createTextNode('/'),current);main.before(crumb);
    }
  }

  const topbar = document.querySelector('header.topbar') || document.querySelector('body > header');
  if (topbar) {
    topbar.classList.add('topbar');
    const inner = topbar.querySelector('.topbar-inner, .bar') || topbar.firstElementChild;
    if (inner) {
      inner.classList.add('topbar-inner');
      const brand = inner.querySelector('a.brand');
      if (brand) brand.setAttribute('href', '/');
      const shell = document.createElement('div');
      shell.className = 'brand-menu-shell';
      shell.dataset.brandShell = '';
      shell.innerHTML = '<button type="button" class="brand-menu-toggle" aria-expanded="false" aria-controls="brand-menu">Menu <span aria-hidden="true">☰</span></button><nav id="brand-menu" class="brand-menu" aria-label="Main menu" hidden><a href="/consult/">Professional help <span aria-hidden="true">↗</span></a><a href="/digital-dog-school/">A step-by-step plan <span aria-hidden="true">↗</span></a><a href="/resources/">Why does my dog do that? <span aria-hidden="true">↗</span></a><a href="/#about-title">About Scoob &amp; I <span aria-hidden="true">↗</span></a></nav>';
      inner.append(shell);
      const toggle = shell.querySelector('button');
      const menu = shell.querySelector('nav');
      const close = (focus = false) => { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); if (focus) toggle.focus(); };
      toggle.addEventListener('click', () => {
        const open = menu.hidden;
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        if (open) menu.querySelector('a').focus();
      });
      document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) close(true); });
      document.addEventListener('pointerdown', event => { if (!shell.contains(event.target)) close(); });
      menu.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    }
  }

  // The current course copy stays intact; add the same supplied character to its scene.
  if (document.body.dataset.page === 'digital-dog-school') {
    const hero = document.querySelector('section.hero');
    if (hero) {
      const art = document.createElement('img');
      art.className = 'brand-course-character';
      art.src = '/assets/zoey-concept.webp';
      art.alt = '';
      art.width = 1312; art.height = 1199;
      art.setAttribute('aria-hidden', 'true');
      art.dataset.brandShell = '';
      hero.append(art);
    }
  }

  // A local visual preview must not initialize the live booking widget on page load.
  const calendar = document.getElementById('consult-calendar-iframe');
  if (calendar && calendar.getAttribute('data-base-src')) {
    calendar.hidden = true;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'brand-load-calendar';
    button.textContent = 'Load the booking calendar';
    button.dataset.brandShell = '';
    calendar.before(button);
    button.addEventListener('click', () => {
      calendar.src = calendar.getAttribute('data-base-src');
      calendar.hidden = false;
      button.remove();
    });
  }
})();
