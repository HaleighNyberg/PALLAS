import HomePage from './components/HomePage.vue';
import ProfilePageNew from './components/ProfilePageNew.vue';
import AdminDashboard from './components/AdminDashboard.vue';
import SearchArtists from './components/SearchArtists.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AboutUs from './components/AboutUs.vue';
import BlogPage from './components/BlogPage.vue';
import BestPractices from './components/BestPractices.vue';
import ResetPassword from './components/ResetPassword.vue';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const routes = [
  {
    name: 'HomePage',
    component: HomePage,
    path: '/HomePage',
  },
  {
    name: 'ProfileNew',
    component: ProfilePageNew,
    path: '/profile-new/:uuid',
  },
  {
    name: 'AdminDashboard',
    component: AdminDashboard,
    path: '/admin-dashboard',
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    name: 'SearchArtists',
    component: SearchArtists,
    path: '/SearchArtists',
  },
  {
    name: 'AboutUs',
    component: AboutUs,
    path: '/AboutUs',
  },
  {
    name: 'BlogPage',
    component: BlogPage,
    path: '/BlogPage',
  },
  {
    name: 'BestPractices',
    component: BestPractices,
    path: '/BestPractices',
  },
  {
    name: 'ResetPassword',
    component: ResetPassword,
    path: '/reset-password',
  },
  {
    path: '/',
    redirect: '/HomePage',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getCurrentUserInfo() {
  try {
    const userInfo = localStorage.getItem('user-info');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error parsing user info from localStorage:', error);
    return null;
  }
}

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

router.beforeEach(async (to, from, next) => {
  try {
    const requiresAuth = to.meta.requiresAuth;
    const requiredRole = to.meta.role;

    if (requiresAuth) {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        return next('/');
      }

      const userInfo = getCurrentUserInfo();

      if (requiredRole && userInfo) {
        if (userInfo.role !== requiredRole) {
          if (userInfo.role === 'admin') {
            return next('/admin-dashboard');
          } else if (userInfo.role === 'artist') {
            return next(`/profile-new/${userInfo.uid}`);
          } else {
            return next('/');
          }
        }

        if (to.name === 'Dashboard') {
          const routeUuid = to.params.uuid;
          if (routeUuid && routeUuid !== userInfo.uid) {
            return next(`/dashboard/${userInfo.uid}`);
          }
        }
      } else if (requiredRole && !userInfo) { 
        return next('/'); 
      }
    }
    next();
  } catch (error) {
    console.error('Error in route guard:', error);
    next('/');
  }
});

export default router;