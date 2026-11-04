/* ============================================================
   SplitSmart - Client-Side Hash Router with Route Guards
   ============================================================ */

class Router {
  constructor() {
    this.routes = [
      'login',
      'terms',
      'help',
      'dashboard',
      'travel',
      'transactions',
      'chat',
      'currency',
      'scanner',
      'suggestions'
    ];
    
    this.currentRoute = 'login';
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // Listen to state changes for route guard evaluations
    if (window.splitStore) {
      window.splitStore.subscribe(() => {
        // recheck guards if state changes
        const route = this.getRouteFromHash();
        const guarded = this.guardRoute(route);
        if (guarded !== route) {
          window.location.hash = '#' + guarded;
        }
      });
    }
  }

  getRouteFromHash() {
    const raw = window.location.hash.replace('#', '').trim();
    if (!raw) return 'login';
    const clean = raw.split('?')[0].replace(/^\//, '');
    return this.routes.includes(clean) ? clean : 'dashboard';
  }

  guardRoute(route) {
    const state = window.splitStore ? window.splitStore.state : null;
    const isLoggedIn = state ? state.auth.isLoggedIn : false;
    const agreedToTerms = state ? state.auth.agreedToTerms : false;

    // Public route: help is always accessible
    if (route === 'help') return 'help';

    // Not logged in -> must go to login
    if (!isLoggedIn) {
      return 'login';
    }

    // Logged in, but hasn't agreed to terms -> must go to terms gateway
    if (!agreedToTerms) {
      return 'terms';
    }

    // Logged in and agreed to terms, but trying to go to login or terms -> go to dashboard
    if (route === 'login' || route === 'terms') {
      return 'dashboard';
    }

    return route;
  }

  handleRoute() {
    const targetRoute = this.getRouteFromHash();
    const finalRoute = this.guardRoute(targetRoute);

    if (finalRoute !== targetRoute) {
      window.location.hash = '#' + finalRoute;
      return;
    }

    this.currentRoute = finalRoute;
    this.renderRoute(finalRoute);
  }

  renderRoute(route) {
    // 1. Hide all page views, show target
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(p => p.classList.remove('active'));

    const activePage = document.getElementById(`view-${route}`);
    if (activePage) {
      activePage.classList.add('active');
    }

    // 2. Adjust visibility of navigation bars (Login & Terms are distraction-free onboarding)
    const isOnboarding = route === 'login' || route === 'terms';
    const bottomNav = document.getElementById('app-bottom-nav');
    const desktopNavLinks = document.getElementById('desktop-nav-links');
    const navUserBadge = document.getElementById('nav-user-badge');

    if (bottomNav) {
      bottomNav.style.display = isOnboarding ? 'none' : 'flex';
    }
    if (desktopNavLinks) {
      desktopNavLinks.style.display = isOnboarding ? 'none' : 'flex';
    }
    if (navUserBadge) {
      navUserBadge.style.display = isOnboarding ? 'none' : 'flex';
    }

    // 3. Update active states on desktop nav
    const desktopLinks = document.querySelectorAll('.nav-link-item');
    desktopLinks.forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 4. Update active states on mobile bottom nav
    const bottomLinks = document.querySelectorAll('.bnav-item');
    bottomLinks.forEach(item => {
      const itemRoute = item.getAttribute('data-route');
      if (itemRoute === route) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 5. Update document title
    const formattedTitle = route.charAt(0).toUpperCase() + route.slice(1);
    document.title = `SplitSmart | ${formattedTitle} - PayPal Blue Fintech`;

    // 6. Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 7. Trigger route specific onMount if needed
    if (window.onRouteChanged) {
      window.onRouteChanged(route);
    }
  }

  navigate(route) {
    window.location.hash = '#' + route;
  }
}

// Global router singleton
window.splitRouter = new Router();
window.navigateTo = function(route) {
  window.splitRouter.navigate(route);
};
