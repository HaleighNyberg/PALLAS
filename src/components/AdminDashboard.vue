<template>
  <div class="admin-container">
    <div class="header-section">
      <div class="text-section">
        <h1 class="admin-title">Admin Dashboard</h1>
        <p class="admin-subtitle">
          Manage PALLAS community members, verify profiles, and oversee platform activity.
        </p>
      </div>
    </div>

    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon verified">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ verifiedUsers }}</div>
            <div class="stat-label">Verified</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pending">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ unverifiedUsers }}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon recent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ recentUsers }}</div>
            <div class="stat-label">This Week</div>
          </div>
        </div>
      </div>
    </div>

    <div class="search-controls-section">
      <div class="search-container">
        <div class="search-box">
          <div class="search-filter-container">
            <button class="search-icon filter-in-search" @click="toggleSortDropdown" title="Sort Options">
              <svg viewBox="0 0 512 512" height="16" width="16">
                <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" fill="rgb(77, 77, 77)"/>
              </svg>
            </button>
            <div v-if="showSortDropdown" class="sort-dropdown search-sort-dropdown">
              <div class="filter-section">
                <div class="filter-header">Status</div>
                <div class="filter-option" @click.stop="toggleFilter('verified')">
                  <input
                    type="checkbox"
                    :checked="activeFilters.verified"
                    class="filter-checkbox"
                    tabindex="-1"
                  />
                  <span class="checkbox-label">Verified</span>
                </div>
                <div class="filter-option" @click.stop="toggleFilter('unverified')">
                  <input
                    type="checkbox"
                    :checked="activeFilters.unverified"
                    class="filter-checkbox"
                    tabindex="-1"
                  />
                  <span class="checkbox-label">Unverified</span>
                </div>
              </div>

              <div class="filter-section">
                <div class="filter-header">Sort By</div>
                <div v-for="option in sortOptions" :key="option.value"
                     @click="selectSortOption(option.value)"
                     :class="['sort-option', { active: sortOption === option.value }]">
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="search-input"
            ref="searchInput"
          />
          <button class="search__clear" type="button" @click="clearSearch" aria-label="Clear search">
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="users-section">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading users...</p>
      </div>

      <div v-else-if="errorMessage" class="error-state">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h3>Error Loading Users</h3>
        <p>{{ errorMessage }}</p>
        <button @click="loadUsers" class="retry-btn">Try Again</button>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h3>No Users Found</h3>
        <p>{{ searchQuery ? 'Try adjusting your search criteria.' : 'No users match the current filter.' }}</p>
      </div>

      <div v-else class="users-table-container">
        <div class="results-info">
          <span>{{ filteredUsers.length }} {{ filteredUsers.length === 1 ? 'user' : 'users' }} found</span>
        </div>

        <div class="users-grid">
          <div v-for="user in filteredUsers" :key="user.uid || user.id" class="user-card">
            <div class="user-avatar">
              <img
                v-if="user.profilePicture"
                :src="user.profilePicture"
                :alt="user.name || 'User'"
                class="avatar-image"
                @error="handleImageError"
              />
              <div v-else class="avatar-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div class="verification-badge" :class="{ verified: !!user.verified }">
                <svg v-if="user.verified" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                </svg>
              </div>
            </div>

            <div class="user-info">
              <div class="user-header">
                <h3 class="user-name">{{ user.name || 'No Name' }}</h3>
              </div>

              <div class="user-details">
                <div class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>{{ user.email }}</span>
                </div>

                <div class="detail-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{{ formatDate(user.created) }}</span>
                </div>

              </div>

              <div class="user-actions">
                <button @click="toggleVerification(user)" :class="['action-btn', user.verified ? 'unverify-btn' : 'verify-btn']">
                  <svg v-if="user.verified" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {{ user.verified ? 'Remove' : 'Verify' }}
                </button>

                <router-link v-if="user.uid" :to="`/profile-new/${user.uid}`" class="action-btn view-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  View
                </router-link>

                <button v-if="currentUser && currentUser.uid !== user.uid" @click="toggleAdminStatus(user)" :class="['action-btn', 'admin-btn', user.role === 'admin' ? 'remove-admin-btn' : 'grant-admin-btn']">
                  <svg v-if="user.role === 'admin'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="16" y2="12"/>
                    <line x1="16" y1="8" x2="20" y2="12"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <path d="M20 8v6"/>
                    <path d="M23 11h-6"/>
                  </svg>
                  {{ user.role === 'admin' ? 'Remove' : 'Admin' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAdminConfirmModal" class="modal-overlay" @click="cancelAdminToggle">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">Confirm Admin Status Change</h2>
        <p class="modal-text">
          Are you sure you want to
          <strong>{{ userToToggleAdmin?.role === 'admin' ? 'remove admin status from' : 'grant admin status to' }}</strong>
          {{ userToToggleAdmin?.name || 'this user' }}?
        </p>
        <p class="modal-warning" v-if="userToToggleAdmin?.role !== 'admin'">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          Admin users have full access to manage all users and platform settings.
        </p>
        <div class="modal-actions">
          <button @click="cancelAdminToggle" class="btn-secondary">Cancel</button>
          <button @click="confirmAdminToggle" class="btn-primary" :class="{ 'btn-danger': userToToggleAdmin?.role === 'admin' }">
            {{ userToToggleAdmin?.role === 'admin' ? 'Remove' : 'Grant Admin' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'

export default {
  name: 'AdminDashboard',
  setup() {
    const users = ref([]);
    const isLoading = ref(true);
    const errorMessage = ref('');
    const searchQuery = ref('');
    const sortOption = ref('date-desc');
    const showSortDropdown = ref(false);
    const searchInput = ref(null);
    const activeFilters = ref({
      verified: false,
      unverified: false
    });
    const db = getFirestore();

    const showAdminConfirmModal = ref(false);
    const userToToggleAdmin = ref(null);
    const currentUser = ref(null);

    const sortOptions = [
      { value: 'date-desc', label: 'Newest First' },
      { value: 'date-asc', label: 'Oldest First' },
      { value: 'verified-first', label: 'Verified First' },
      { value: 'unverified-first', label: 'Unverified First' }
    ];

    const totalUsers = computed(() => users.value.length);
    const verifiedUsers = computed(() => users.value.filter(u => u.verified).length);
    const unverifiedUsers = computed(() => users.value.filter(u => !u.verified).length);
    const recentUsers = computed(() => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return users.value.filter(u => u.created && new Date(u.created) > oneWeekAgo).length;
    });

    const filteredUsers = computed(() => {
      let filtered = [...users.value];

      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(user => {
          const nameMatch = (user.name || '').toLowerCase().includes(query);
          const emailMatch = (user.email || '').toLowerCase().includes(query);
          const dateMatch = user.created && formatDate(user.created).toLowerCase().includes(query);
          return nameMatch || emailMatch || dateMatch;
        });
      }

      const hasActiveFilters = Object.values(activeFilters.value).some(v => v);

      if (hasActiveFilters) {
        filtered = filtered.filter(user => {
          if (activeFilters.value.verified && user.verified) return true;
          if (activeFilters.value.unverified && !user.verified) return true;
          return false;
        });
      }

      return sortUsers(filtered);
    });

    const sortUsers = (userList) => {
      return userList.sort((a, b) => {
        switch (sortOption.value) {
          case 'date-asc':
            return new Date(a.created || 0) - new Date(b.created || 0);
          case 'verified-first':
            if (a.verified !== b.verified) {
              return b.verified - a.verified;
            }
            return new Date(b.created || 0) - new Date(a.created || 0);
          case 'unverified-first':
            if (a.verified !== b.verified) {
              return a.verified - b.verified;
            }
            return new Date(b.created || 0) - new Date(a.created || 0);
          case 'date-desc':
          default:
            return new Date(b.created || 0) - new Date(a.created || 0);
        }
      });
    };

    const loadUsers = async () => {
      try {
        isLoading.value = true;
        errorMessage.value = '';

        const snapshot = await getDocs(collection(db, 'users'));
        const userList = [];

        snapshot.forEach(docSnap => {
          try {
            const data = docSnap.data() || {};
          let createdDate = null;

            if (data.createdAt && data.createdAt.toDate) {
              createdDate = data.createdAt.toDate();
            } 

          let profilePicture = null;
            if (data.profile?.profilePictureURL) {
              profilePicture = data.profile.profilePictureURL;
            } 

            userList.push({
              uid: docSnap.id,
              email: data.email || '',
              name: data.profile?.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'No Name',
              verified: !!data.verified,
              role: data.role || 'artist',
              created: createdDate,
              profilePicture: profilePicture,
              profile: data.profile || {}
            });
          } catch (docError) {
            console.error('Error processing user document:', docSnap.id, docError);
          }
        });

        users.value = userList;
      } catch (error) {
        console.error('Error fetching users:', error);
        errorMessage.value = 'Failed to load user data. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };

    const toggleVerification = async (user) => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const newVerificationStatus = !user.verified;
        await updateDoc(userRef, { verified: newVerificationStatus });
        user.verified = newVerificationStatus;
      } catch (error) {
        console.error('Error updating user verification:', error);
        errorMessage.value = 'Failed to update verification status.';
      }
    };

    const clearSearch = () => {
      searchQuery.value = '';
    };

    const toggleAdminStatus = (user) => {
      userToToggleAdmin.value = user;
      showAdminConfirmModal.value = true;
    };

    const confirmAdminToggle = async () => {
      if (!userToToggleAdmin.value) return;

      try {
        const user = userToToggleAdmin.value;
        const userRef = doc(db, 'users', user.uid);
        const newRole = user.role === 'admin' ? 'artist' : 'admin';
        await updateDoc(userRef, { role: newRole });
        user.role = newRole;
      } catch (error) {
        console.error('Error updating user role:', error);
        errorMessage.value = 'Failed to update user role.';
      } finally {
        showAdminConfirmModal.value = false;
        userToToggleAdmin.value = null;
      }
    };

    const cancelAdminToggle = () => {
      showAdminConfirmModal.value = false;
      userToToggleAdmin.value = null;
    };

    const toggleSortDropdown = () => {
      showSortDropdown.value = !showSortDropdown.value;
    };

    const selectSortOption = (value) => {
      sortOption.value = value;
      showSortDropdown.value = false;
    };

    const toggleFilter = (filterName) => {
      activeFilters.value[filterName] = !activeFilters.value[filterName];
    };

    const handleClickOutside = (event) => {
      const isDropdownButton = event.target.closest('.filter-in-search');
      if (isDropdownButton) {
        return;
      }

      const isDropdownContent = event.target.closest('.search-sort-dropdown');
      if (isDropdownContent) {
        return;
      }

      showSortDropdown.value = false;
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'No Date';
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const handleImageError = (event) => {
      event.target.style.display = 'none';
      const placeholder = event.target.nextElementSibling;
      if (placeholder && placeholder.classList.contains('avatar-placeholder')) {
         placeholder.style.display = 'flex';
      }
    };
    onMounted(() => {
      loadUsers();
      document.addEventListener('click', handleClickOutside);
      const userInfo = localStorage.getItem('user-info');
      if (userInfo) {
        currentUser.value = JSON.parse(userInfo);
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      users,
      isLoading,
      errorMessage,
      searchQuery,
      sortOption,
      showSortDropdown,
      searchInput,
      activeFilters,
      sortOptions,
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      recentUsers,
      filteredUsers,
      loadUsers,
      toggleVerification,
      clearSearch,
      toggleSortDropdown,
      selectSortOption,
      toggleFilter,
      formatDate,
      handleImageError,
      currentUser,
      showAdminConfirmModal,
      userToToggleAdmin,
      toggleAdminStatus,
      confirmAdminToggle,
      cancelAdminToggle
    };
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 2800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 80vh;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.admin-title {
  margin-top: 100px;
  font-size: 4.0vw;
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 1rem;
}

.admin-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.search-controls-section {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 500px;
  min-width: 300px;
}

.search-filter-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: calc(50% + 25px);
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #666;
}

.search-icon.filter-in-search {
  border: none;
  background-color: transparent;
  z-index: 1;
  cursor: pointer;
  transition: all 0.3s;
  pointer-events: auto;
}

.search-icon.filter-in-search:focus {
  outline: none;
}

.search-icon.filter-in-search:active {
  transform: translateY(calc(-50% + 2px));
}

.search-icon.filter-in-search:hover svg {
  fill: #6366f1;
}

.search-sort-dropdown {
  position: absolute;
  top: 100%;
  left: -250px;
  transform: translateY(40px);
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #d1d5db;
  z-index: 1000;
  min-width: 200px;
  max-width: 280px;
  font-family: inherit;
}

.search-input {
  width: 100%;
  padding: 1rem 4rem 1rem 3.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 4px 20px rgba(101, 103, 190, 0.15);
}

.search-input::placeholder {
  color: #9ca3af;
}

.search__clear {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
  z-index: 2;
}

.search__clear:hover {
  color: var(--color-text);
}

.sort-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #d1d5db;
  z-index: 1000;
  min-width: 200px;
  max-width: 280px;
  font-family: inherit;
}

.filter-section {
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.filter-section:last-child {
  border-bottom: none;
}

.filter-header {
  padding: 0 16px 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  cursor: pointer;
  color: #374151;
  font-size: 14px;
  font-weight: 400;
  transition: background-color 0.2s ease;
}

.filter-option:hover {
  background: #f9fafb;
  color: #111827;
}

.filter-checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.filter-checkbox:checked {
  background: #6567BE;
  border-color: #6567BE;
}

.filter-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 5px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  user-select: none;
}

.sort-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  cursor: pointer;
  color: #374151;
  font-size: 14px;
  font-weight: 400;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.sort-option:first-child {
  border-radius: 4px 4px 0 0;
}

.sort-option:last-child {
  border-bottom: none;
  border-radius: 0 0 4px 4px;
}

.sort-option:hover {
  background: #f9fafb;
  color: #111827;
}

.sort-option.active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 500;
}

.sort-option.active::after {
  content: '✓';
  color: #6567BE;
  font-weight: 600;
  font-size: 16px;
}

.stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon.verified {
  background: #dcfce7;
  color: #16a34a;
}

.stat-icon.pending {
  background: #fef3c7;
  color: #d97706;
}

.stat-icon.recent {
  background: #dbeafe;
  color: #2563eb;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.users-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #6567BE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon, .empty-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.error-state h3, .empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #6567BE;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #7577c4;
  transform: translateY(-1px);
}

.results-info {
  font-weight: 600;
  color: #374151;
  margin-bottom: 1.5rem;
  text-align: center;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.user-card {
  background: #fafbfc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #6567BE;
}

.user-avatar {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.avatar-image, .avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.avatar-placeholder svg {
  width: 24px;
  height: 24px;
}

.verification-badge {
  position: absolute;
  bottom: -2px;
  right: calc(50% - 32px);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.verification-badge.verified {
  background: #10b981;
}

.verification-badge svg {
  width: 10px;
  height: 10px;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.user-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.user-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.detail-item svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.user-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  flex: 1;
  justify-content: center;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.verify-btn {
  background: #dcfce7;
  color: #166534;
}

.verify-btn:hover {
  background: #bbf7d0;
}

.unverify-btn {
  background: #fecaca;
  color: #dc2626;
}

.unverify-btn:hover {
  background: #fca5a5;
}

.admin-btn {
  font-size: 0.75rem;
  font-weight: 500;
}

.grant-admin-btn {
  background: #e0e7ff;
  color: #3730a3;
}

.grant-admin-btn:hover {
  background: #c7d2fe;
}

.remove-admin-btn {
  background: #fef3c7;
  color: #92400e;
}

.remove-admin-btn:hover {
  background: #fde68a;
}

.view-btn {
  background: #dbeafe;
  color: #1d4ed8;
}

.view-btn:hover {
  background: #bfdbfe;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 1rem 0.5rem;
  }

  .admin-title {
    font-size: 2.5rem;
  }

  .search-container {
    max-width: 100%;
  }

  .filter-pills {
    gap: 0.5rem;
  }

  .filter-pill {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .users-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .user-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .admin-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .users-section {
    padding: 1rem;
  }

  .user-card {
    padding: 1rem;
  }

  .filter-pills {
    flex-direction: column;
    width: 100%;
  }

  .filter-pill {
    width: 100%;
    justify-content: center;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.modal-text {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.modal-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #92400e;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.modal-warning svg {
  flex-shrink: 0;
  color: #f59e0b;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-secondary,
.btn-primary {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #6567BE;
  color: white;
}

.btn-primary:hover {
  background: #5557a8;
}

.btn-danger {
  background: #ef4444;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>