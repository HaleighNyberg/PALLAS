<template>
  <div class="search-container">
    <div class="filter-section">
      <h1>PALLAS Gallery</h1>
      <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 20px; justify-content: center;">
        <form action="#" class="search" ref="searchGroup" @click="focusSearchInput">
          <div class="search-filter-container">
            <button class="search__button filter-in-search" @click.prevent="toggleSortDropdown" title="Sort Options">
              <div class="search__icon">
                <svg viewBox="0 0 512 512" height="16" width="16">
                  <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" fill="rgb(77, 77, 77)"/>
                </svg>
              </div>
            </button>
            <div v-if="showSortDropdown" class="sort-dropdown search-sort-dropdown">
              <div v-for="option in sortOptions" :key="option.value"
                   @click="selectSortOption(option.value)"
                   :class="['sort-option', { active: sortOption === option.value }]">
                {{ option.label }}
              </div>
            </div>
          </div>
          <input type="text" class="search__input" placeholder="Search..." v-model="searchQuery"
                 @input="onSearchInput" ref="searchInput" />
          <button class="search__clear" type="button" @click="() => { clearSearch(); resetFilters(); }"
                  aria-label="Clear search">
            ✕
          </button>
        </form>

        <div class="filter-group" ref="focusDropdown">
          <div class="dropdown" :key="'focus-dropdown'">
            <button @click="toggleFocusDropdown" class="dropdown-button focus-dropdown btn cube cube-hover" aria-haspopup="true"
                    :aria-expanded="dropdowns.focus" type="button">
              Filter by Art Focus
              <svg viewBox="0 0 512 512" height="1em" class="chevron-down" :class="{ rotated: !dropdowns.focus }">
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5 -32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
              </svg>
            </button>
            <transition name="slide">
              <div v-if="dropdowns.focus" class="dropdown-content focus-dropdown-content" role="menu" :key="'focus-dropdown-content'">
                <input type="text" v-model="searchFocusQuery"
                       placeholder="Search Art Focus..." class="dropdown-search-input" />
                <div v-for="tag in filteredFocusTags" :key="tag" class="dropdown-item focus-checkbox-item"
                     @click.stop="handleFocusTagClick(tag)">
                  <input
                    type="checkbox"
                    :value="tag"
                    :checked="selectedFocus.includes(tag)"
                    class="custom-checkbox focus-checkbox"
                    tabindex="-1"
                  />
                  <span class="checkbox-label">{{ tag }}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div class="filter-group" ref="mediumDropdown">
          <div class="dropdown" :key="'medium-dropdown'">
            <button @click="toggleMediumDropdown" class="dropdown-button medium-dropdown btn cube cube-hover" aria-haspopup="true"
                    :aria-expanded="dropdowns.medium" type="button">
              Filter by Art Medium
              <svg viewBox="0 0 512 512" height="1em" class="chevron-down" :class="{ rotated: !dropdowns.medium }">
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5 -32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
              </svg>
            </button>
            <transition name="slide">
              <div v-if="dropdowns.medium" class="dropdown-content medium-dropdown-content" role="menu" :key="'medium-dropdown-content'">
                <input type="text" v-model="searchMediumQuery"
                       placeholder="Search Art Medium..." class="dropdown-search-input" />
                <div v-for="tag in filteredMediumTags" :key="tag" class="dropdown-item medium-checkbox-item"
                     @click.stop="handleMediumTagClick(tag)">
                  <input
                    type="checkbox"
                    :value="tag"
                    :checked="selectedMedium.includes(tag)"
                    class="custom-checkbox medium-checkbox"
                    tabindex="-1"
                  />
                  <span class="checkbox-label">{{ tag }}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div class="commission-filter-slider-container">
          <div class="commission-filter-label">
            <span class="commission-text-top">OPEN TO</span>
            <span class="commission-text-bottom">COMMISSIONS</span>
          </div>
          <label class="commission-switch">
            <input type="checkbox" v-model="filterOpenCommissions" @change="toggleCommissionFilter">
            <span class="commission-slider"></span>
          </label>
        </div>
      </div>

      <div class="controls-section">
        <transition-group name="fade" tag="div" class="selected-filters" v-if="appliedFilters.length">
          <span v-for="filter in appliedFilters" :key="filter.type + '-' + filter.tag"
                :class="['selected-tag', filter.type === 'focus' ? 'selected-focus-tag' : 'selected-medium-tag']"
                @click="removeFilter(filter)">
            {{ filter.tag }}
            <span class="tag-remove" aria-hidden="true">✕</span>
          </span>
        </transition-group>
      </div>

      <div class="results">
        <transition name="fade">
          <div v-if="loading" class="loading">
          </div>
          <div v-else-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-else-if="filteredArtists.length === 0" class="no-results">
            No artists found matching your criteria.
          </div>
          <div v-else class="artist-grid">
            <div v-for="artist in filteredArtists" :key="artist.id" class="pallas-artist-card" style="display: flex; flex-direction: column;">
              <div class="art-hero-main" :style="{
                backgroundImage: artist.profile.artShowcaseURL
                  ? `url(${artist.profile.artShowcaseURL})`
                  : artist.profile.profileBackgroundURL
                  ? `url(${artist.profile.profileBackgroundURL})`
                  : `url(${defaultBanner})`
              }">
                <div v-if="artist.profile.openToCommissions" class="commission-indicator">
                  <span class="commission-dot"></span>
                  <span class="commission-text">Open</span>
                </div>
              </div>
              <div class="artist-profile-section">
                <div class="profile-image-container">
                  <img :src="artist.profile.profilePictureURL || defaultProfile"
                       :alt="artist.profile.name || 'Artist Profile'"
                       class="profile-image-main" />
                </div>
                <div class="artist-info-main">
                  <h2 class="artist-name-main">{{ artist.profile.name || "No Name Provided" }}</h2>
                  <p class="artist-title-main">{{ (artist.profile.bio || "Artist & Researcher").length > 20 ? (artist.profile.bio || "Artist & Researcher").substring(0, 20) + "..." : (artist.profile.bio || "Artist & Researcher") }}</p>
                  <router-link :to="{
                    name: 'ProfileNew',
                    params: { uuid: artist.id },
                    query: {
                      searchQuery: searchQuery,
                      selectedFocus: JSON.stringify(selectedFocus),
                      selectedMedium: JSON.stringify(selectedMedium)
                    }
                  }" class="profile-btn">
                    Profile
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15px" width="15px" class="icon">
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.5" stroke="#ffffff" d="M8.91016 19.9201L15.4302 13.4001C16.2002 12.6301 16.2002 11.3701 15.4302 10.6001L8.91016 4.08008"></path>
                    </svg>
                  </router-link>
                </div>
              </div>
              <div class="expertise-tags-main" style="flex-grow: 1;">
                <div class="tag-group-main" v-if="artist.profile.artFocus && artist.profile.artFocus.length">
                  <button v-for="tag in artist.profile.artFocus" :key="tag"
                          class="expertise-tag research-tag clickable-tag"
                          @click="handleTagClick(tag, 'focus')">
                    {{ tag }}
                  </button>
                </div>
                <div class="tag-group-main" v-if="artist.profile.artMedium && artist.profile.artMedium.length">
                  <button v-for="tag in artist.profile.artMedium" :key="tag"
                          class="expertise-tag art-tag clickable-tag"
                          @click="handleTagClick(tag, 'medium')">
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
const defaultBanner = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 300'%3E%3Cdefs%3E%3Cpattern id='bannerGrid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23e5e5e5' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='1200' height='300' fill='%23f8f8f8'/%3E%3Crect width='1200' height='300' fill='url(%23bannerGrid)'/%3E%3C/svg%3E"
const defaultProfile = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
import { reactive, computed, onMounted, onUnmounted, onActivated, toRefs, ref } from "vue";
import { useRoute } from "vue-router";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";

export default {
  name: "SearchArtists",
  components: {
  },
  setup() {
    const route = useRoute();

    const focusSearchInput = () => {
      if (searchInput.value) {
        searchInput.value.focus();
      }
    };

    const handleTagClick = (tag, type = 'focus') => {
      if (type === 'focus' || predefinedFocusTags.includes(tag)) {
        if (!state.selectedFocus.includes(tag)) {
          state.selectedFocus.push(tag);
          state.dropdowns.focus = true;
        }
      } else if (type === 'medium' || predefinedMediumTags.includes(tag)) {
        if (!state.selectedMedium.includes(tag)) {
          state.selectedMedium.push(tag);
          state.dropdowns.medium = true;
        }
      }
      debouncedFetchArtists();
    };

    const predefinedFocusTags = [ "Physics", "Math", "Biology", "Astronomy", "Computer Science", "Chemistry", "Geology", "Environmental Science", "Medical Science", "Robotics", "Engineering", "Nanotechnology", "Oceanography", "Psychology", "Art History (Scientific Illustration)", "Materials Science", "Data Science", "Artificial Intelligence", "Meteorology", "Ecology", "Astrophysics", "Quantum Computing", "Biotechnology", "Neuroscience", "Forensic Science", "Energy Science", "Acoustics", "Systems Engineering", "Agricultural Science"];
    const predefinedMediumTags = [ "Pencil", "Pen", "Painting", "Sculpture", "Photography", "Digital", "Mixed Media", "Drawing", "Illustration", "Printmaking", "Ceramics", "Textile Art", "Collage", "Installation Art", "Video Art", "Performance Art", "3D Modeling", "Augmented Reality", "Virtual Reality", "Sound Art", "Kinetic Art", "Glass Art", "Woodworking", "Metalworking", "Mosaic", "Calligraphy", "Paper Art", "Projection Mapping"];

    const focusDropdown = ref(null);
    const mediumDropdown = ref(null);
    const searchGroup = ref(null);
    const searchInput = ref(null);

    const state = reactive({
      artists: [],
      loading: true,
      error: null,
      selectedFocus: [],
      selectedMedium: [],
      dropdowns: { focus: false, medium: false },
      searchQuery: "",
      searchFocusQuery: "",
      searchMediumQuery: "",
      sortOption: localStorage.getItem('pallas-sort-option') || "random",
      fuse: null,
      showSortDropdown: false,
      filterOpenCommissions: false,
    });

    const sortOptions = ref([
      { value: "random", label: "Random" },
      { value: "name-asc", label: "Name (A-Z)" },
      { value: "name-desc", label: "Name (Z-A)" },
      { value: "date-joined", label: "Date Joined" }
    ]);

    const appliedFilters = computed(() => {
      const focusFilters = Array.isArray(state.selectedFocus)
        ? state.selectedFocus.map((tag) => ({ type: "focus", tag }))
        : [];
      const mediumFilters = Array.isArray(state.selectedMedium)
        ? state.selectedMedium.map((tag) => ({ type: "medium", tag }))
        : [];
      return [...focusFilters, ...mediumFilters];
    });

    const filteredArtists = computed(() => {
      let filtered = state.artists;
      
      if (state.searchQuery.trim() !== "" && state.fuse) {
        const results = state.fuse.search(state.searchQuery.trim());
        filtered = results.map((result) => result.item);
      }

      if (state.selectedFocus.length > 0 || state.selectedMedium.length > 0) {
        filtered = filtered.filter((artist) => {
          let matchesFocus = state.selectedFocus.length === 0;
          let matchesMedium = state.selectedMedium.length === 0;

          if (state.selectedFocus.length > 0) {
            matchesFocus = state.selectedFocus.every(tag =>
              artist.profile.artFocus && artist.profile.artFocus.includes(tag)
            );
          }

          if (state.selectedMedium.length > 0) {
            matchesMedium = state.selectedMedium.every(tag =>
              artist.profile.artMedium && artist.profile.artMedium.includes(tag)
            );
          }
          return matchesFocus && matchesMedium;
        });
      }

      if (state.filterOpenCommissions) {
        filtered = filtered.filter(artist => artist.profile.openToCommissions === true);
      }

      let sorted = [...filtered];
      switch (state.sortOption) {
        case "name-asc":
          sorted.sort((a, b) => {
            const nameA = a.profile.name ? a.profile.name.toLowerCase() : "";
            const nameB = b.profile.name ? b.profile.name.toLowerCase() : "";
            return nameA.localeCompare(nameB);
          });
          break;
        case "name-desc":
          sorted.sort((a, b) => {
            const nameA = a.profile.name ? a.profile.name.toLowerCase() : "";
            const nameB = b.profile.name ? b.profile.name.toLowerCase() : "";
            return nameB.localeCompare(nameA);
          });
          break;
        case "date-joined":
          sorted.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.profile.createdAt || 0);
            const dateB = new Date(b.createdAt || b.profile.createdAt || 0);
            return dateB - dateA;
          });
          break;
        case "random":
        default:
          for (let i = sorted.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
          }
          break;
      }
      return sorted;
    });

    const filteredFocusTags = computed(() => {
      if (!state.searchFocusQuery) return predefinedFocusTags;
      return predefinedFocusTags.filter((tag) =>
        tag.toLowerCase().includes(state.searchFocusQuery.toLowerCase())
      );
    });

    const filteredMediumTags = computed(() => {
      if (!state.searchMediumQuery) return predefinedMediumTags;
      return predefinedMediumTags.filter((tag) =>
        tag.toLowerCase().includes(state.searchMediumQuery.toLowerCase())
      );
    });

    const initializeFuse = () => {
      state.fuse = new Fuse(state.artists, {
        keys: ["profile.name", "profile.artFocus", "profile.artMedium"],
        threshold: 0.3,
      });
    };

    const fetchArtists = async () => {
      const preservedDropdownState = { ...state.dropdowns };
      state.loading = true;
      state.error = null;
      try {
        const usersCol = collection(db, "users");
        const usersSnapshot = await getDocs(usersCol);
        let allArtists = usersSnapshot.docs
          .filter((doc) => {
            const data = doc.data();
            return data.verified === true;
          })
          .map((doc) => {
            const data = doc.data();
            const profile = data.profile
              ? data.profile
              : { name: `${data.firstName || ""} ${data.lastName || ""}`.trim() };
            return { id: doc.id, profile, ...data };
          });

        if (state.selectedFocus.length > 0 || state.selectedMedium.length > 0) {
          allArtists = allArtists.filter((artist) => {
            let matchesFocus = state.selectedFocus.length === 0;
            let matchesMedium = state.selectedMedium.length === 0;

            if (state.selectedFocus.length > 0) {
              matchesFocus = state.selectedFocus.some(tag =>
                artist.profile.artFocus && artist.profile.artFocus.includes(tag)
              );
            }
            if (state.selectedMedium.length > 0) {
              matchesMedium = state.selectedMedium.some(tag =>
                artist.profile.artMedium && artist.profile.artMedium.includes(tag)
              );
            }
            return matchesFocus && matchesMedium;
          });
        }
        state.artists = allArtists;
        initializeFuse();
        if (state.artists.length === 0) {
          state.error = "No artists found matching your criteria.";
        }
      } catch (err) {
        state.error = "Failed to load artists. Please try again later.";
      } finally {
        state.loading = false;
        state.dropdowns = preservedDropdownState;
      }
    };

    const toggleFocusDropdown = () => {
      state.dropdowns.focus = !state.dropdowns.focus;
    };

    const toggleMediumDropdown = () => {
      state.dropdowns.medium = !state.dropdowns.medium;
    };

    const removeFilter = (filter) => {
      if (filter.type === "focus") {
        state.selectedFocus = state.selectedFocus.filter((t) => t !== filter.tag);
      } else if (filter.type === "medium") {
        state.selectedMedium = state.selectedMedium.filter((t) => t !== filter.tag);
      }
      fetchArtists();
    };

    const resetFilters = () => {
      state.selectedFocus = [];
      state.selectedMedium = [];
      state.searchQuery = "";
      state.searchFocusQuery = "";
      state.searchMediumQuery = "";
      state.error = null;
      fetchArtists();
    };

    const clearSearch = () => {
      state.searchQuery = "";
      fetchArtists();
    };

    const handleClickOutside = (event) => {
      const isDropdownButton = event.target.closest('.dropdown-button');
      if (isDropdownButton) {
        return;
      }
      const isDropdownContent = event.target.closest('.dropdown-content') ||
                                event.target.closest('.dropdown-item') ||
                                event.target.closest('.custom-checkbox') ||
                                event.target.closest('.checkbox-label') ||
                                event.target.closest('.dropdown-search-input');
      if (isDropdownContent) {
        return;
      }
      const isSortClick = event.target.closest('.sort-container') || event.target.closest('.search-filter-container');
      if (isSortClick) {
        return;
      }
      state.dropdowns.focus = false;
      state.dropdowns.medium = false;
      state.showSortDropdown = false;
    };

    const debouncedFetchArtists = debounce(fetchArtists, 300);

    const onSearchInput = () => {
      debouncedFetchArtists();
    };
    const onFilterChange = () => {
      debouncedFetchArtists();
    };

    const handleFocusTagClick = (tag) => {
      if (state.selectedFocus.includes(tag)) {
        state.selectedFocus = state.selectedFocus.filter(t => t !== tag);
      } else {
        state.selectedFocus = [...state.selectedFocus, tag];
      }
      onFilterChange();
    };

    const handleMediumTagClick = (tag) => {
      if (state.selectedMedium.includes(tag)) {
        state.selectedMedium = state.selectedMedium.filter(t => t !== tag);
      } else {
        state.selectedMedium = [...state.selectedMedium, tag];
      }
      onFilterChange();
    };

    const toggleSortDropdown = () => {
      state.showSortDropdown = !state.showSortDropdown;
    };

    const selectSortOption = (value) => {
      state.sortOption = value;
      state.showSortDropdown = false;
      localStorage.setItem('pallas-sort-option', value);
    };

    const toggleCommissionFilter = () => {
      debouncedFetchArtists();
    };

    const restoreSearchState = () => {
      if (route.query.searchQuery) {
        state.searchQuery = route.query.searchQuery;
      }
      if (route.query.selectedFocus) {
        try {
          const focus = JSON.parse(route.query.selectedFocus);
          if (Array.isArray(focus)) state.selectedFocus = focus;
        } catch (e) {
          console.error('Error parsing selectedFocus:', e);
        }
      }
      if (route.query.selectedMedium) {
         try {
          const medium = JSON.parse(route.query.selectedMedium);
          if (Array.isArray(medium)) state.selectedMedium = medium;
        } catch (e) {
          console.error('Error parsing selectedMedium:', e);
        }
      }
    };

    onMounted(() => {
      restoreSearchState();
      fetchArtists();
      document.addEventListener("click", handleClickOutside);
    });

    onActivated(() => {
      restoreSearchState();
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      defaultBanner,
      defaultProfile,
      predefinedFocusTags,
      predefinedMediumTags,
      ...toRefs(state),
      removeFilter,
      resetFilters,
      clearSearch,
      appliedFilters,
      filteredArtists,
      filteredFocusTags,
      filteredMediumTags,
      focusDropdown,
      mediumDropdown,
      searchGroup,
      searchInput,
      onSearchInput,
      onFilterChange,
      handleTagClick,
      focusSearchInput,
      sortOptions,
      toggleSortDropdown,
      selectSortOption,
      handleFocusTagClick,
      handleMediumTagClick,
      toggleFocusDropdown,
      toggleMediumDropdown,
      toggleCommissionFilter,
    };
  },
};
</script>

<style scoped>
.search-container {
  width: 82.5%;
  margin: 0 auto;
}
.filter-section h1 {
  margin-top: 6.5%;
  font-size: 4.5em;
  text-align: center;
  color: var(--color-text);
}
.search {
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0;
}
.search-filter-container {
  position: relative;
  display: flex;
  align-items: center;
}
.search__button.filter-in-search {
  border: none;
  background-color: transparent;
  z-index: 1;
  cursor: pointer;
  margin-right: -35px;
  margin-left: 15px;
  transition: all 0.3s;
}
.search__button.filter-in-search:focus {
  outline: none;
}
.search__button.filter-in-search:active {
  transform: translateY(2px);
}
.search__button.filter-in-search:hover .search__icon svg {
  fill: #6366f1;
}
.search__icon {
  height: 20px;
  width: 20px;
  fill: #000000;
}
.search-sort-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
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
.search__input {
  width: 100%;
  padding: 1rem 4rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  color: var(--color-text);
  font-family: var(--font-primary);
}
.search__input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 4px 20px rgba(101, 103, 190, 0.15);
}
.search__input::-webkit-input-placeholder {
  color: #9ca3af;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: normal;
}
.search__clear {
  position: absolute;
  right: 36px;
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
.search__clear:focus {
  outline: none;
}
.controls-section {
  min-height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-sizing: border-box;
  flex-wrap: wrap;
}
.filter-controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.sort-container {
  position: relative;
  display: flex;
  align-items: center;
}
.filter {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.192);
  cursor: pointer;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.021);
  transition: all 0.3s;
  background: white;
}
.filter svg {
  height: 16px;
  fill: rgb(77, 77, 77);
  transition: all 0.3s;
}
.filter:hover {
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.11);
  background-color: rgb(59, 59, 59);
}
.filter:hover svg {
  fill: white;
}
.commission-filter-slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 7px 12px;
  border-radius: 9px;
  box-shadow: 0 0px 20px rgba(0,0,0,0.1);
}
.commission-filter-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.commission-text-top {
  font-size: 0.85rem;
  font-weight: 700;
  color:rgb(49, 49, 49);
  line-height: 1;
  letter-spacing: 0.05em;
  align-self: flex-start;
}
.commission-text-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgb(49, 49, 49);
  line-height: 1;
  letter-spacing: 0.05em;
  align-self: flex-start;
}
.commission-switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 2em;
}
.commission-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.commission-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #e0e7ff;
  border-radius: 50px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  border: 1px solid #c7d2fe;
}
.commission-slider:before {
  position: absolute;
  content: "";
  height: 1.4em;
  width: 1.4em;
  left: 0.3em;
  bottom: 0.3em;
  background-color: white;
  border-radius: 50px;
  box-shadow: 0 0px 20px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.commission-switch input:checked + .commission-slider {
  background: #6366f1;
  border-color: #4f46e5;
}
.commission-switch input:focus + .commission-slider {
  box-shadow: 0 0 1px #6366f1;
}
.commission-switch input:checked + .commission-slider:before {
  transform: translateX(1.6em);
  width: 2em;
  height: 2em;
  bottom: 0;
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
.selected-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  flex-grow: 1;
}
.selected-tag {
  margin-top: 15px;
  margin-bottom: 25px;
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.selected-focus-tag {
  background: #f1f5f9;
  color: #475569;
  border-color: #64748b;
}
.selected-focus-tag:hover {
  background: #e2e8f0;
  color: #334155;
  border-color: #475569;
}
.selected-medium-tag {
  background: #f3f4ff;
  color: #6366f1;
  border-color: #a5b4fc;
}
.selected-medium-tag:hover {
  background: #e0e7ff;
  color: #4338ca;
  border-color: #818cf8;
}
.tag-remove {
  margin-left: 8px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
.tag-remove:hover {
  opacity: 1;
}
.selected-focus-tag:hover .tag-remove,
.selected-medium-tag:hover .tag-remove {
  color: inherit !important;
}
.filter-group {
  position: relative;
  width: 240px;
}
.dropdown {
  position: relative;
}
.dropdown-button {
  width: 100%;
  padding: 10px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid;
  transition: all 0.2s ease;
  font-weight: 500;
}
.focus-dropdown {
  background: #f1f5f9;
  color: #475569;
  border-color: #64748b;
}
.focus-dropdown:hover {
  background: #e2e8f0;
  color: #334155;
  border-color: #475569;
}
.medium-dropdown {
  background: #f3f4ff;
  color: #6366f1;
  border-color: #a5b4fc;
}
.medium-dropdown:hover {
  background: #e0e7ff;
  color: #4338ca;
  border-color: #818cf8;
}
.chevron-down {
  width: 1em;
  height: 1em;
  fill: currentColor;
  transition: transform 0.3s ease;
  margin-left: 8px;
  opacity: 0.7;
}
.chevron-down.rotated {
  transform: rotate(-180deg);
}
.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1000;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  border: 1px solid #d1d5db;
  border-top: none;
  font-family: inherit;
}
.focus-dropdown-content {
  background: #f1f5f9;
  border-color: #64748b;
}
.medium-dropdown-content {
  background: #f3f4ff;
  border-color: #a5b4fc;
}
.dropdown-search-input {
  width: 92%;
  margin: 8px auto 12px auto;
  display: block;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  background: white;
  color: #374151;
  font-family: inherit;
}
.dropdown-search-input:focus {
  outline: none;
  border-color: #6567BE;
  box-shadow: 0 0 0 3px rgba(101, 103, 190, 0.1);
}
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  color: #374151 !important;
  transition: background-color 0.2s ease;
  font-size: 14px;
  font-weight: 400;
}
.focus-dropdown-content .dropdown-item:hover {
  background: #e2e8f0;
}
.medium-dropdown-content .dropdown-item:hover {
  background: #e0e7ff;
}
.custom-checkbox {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  width: 14px !important;
  height: 14px !important;
  min-width: 14px !important;
  max-width: 14px !important;
  min-height: 14px !important;
  max-height: 14px !important;
  border-radius: 3px;
  border: 2px solid;
  margin-right: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-sizing: border-box !important;
  display: inline-block !important;
  vertical-align: top;
}
.focus-checkbox {
  border-color: #64748b;
  background: #f1f5f9;
}
.focus-checkbox:checked {
  background: #64748b;
  border-color: #475569;
}
.focus-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}
.focus-checkbox:hover {
  border-color: #475569;
  background: #e2e8f0;
}
.medium-checkbox {
  border-color: #a5b4fc;
  background: #f3f4ff;
}
.medium-checkbox:checked {
  background: #a5b4fc;
  border-color: #818cf8;
}
.medium-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}
.medium-checkbox:hover {
  border-color: #818cf8;
  background: #e0e7ff;
}
.checkbox-label {
  cursor: pointer;
  user-select: none;
  flex: 1;
}
.dropdown-item input {
  margin-right: 10px;
  cursor: pointer;
}
.loading,
.error-message,
.no-results {
  text-align: center;
  font-size: 1.2em;
  color: var(--color-text);
  margin-top: 80px;
}
.error-message {
  color: var(--color-text);
}
.no-results {
  color: var(--color-text);
}
.spinner {
  width: 24px;
  height: 24px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 10px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.results {
  margin-top: -75px;
  min-height: 400px;
  box-sizing: border-box;
  text-align: center;
  margin-bottom: 50px;
}
.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 8px;
  margin: 20px auto 0;
  box-sizing: border-box;
  justify-items: center;
}
.pallas-artist-card {
  width: 100%;
  max-width: 360px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transform: scale(0.88);
  transform-origin: top center;
}
.pallas-artist-card:hover {
  transform: scale(0.88) translateY(-8px);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.12);
}
.art-hero-main {
  width: 100%;
  height: 240px;
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: #f3f4f6;
}
.commission-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(99, 102, 241, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}
.commission-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
.commission-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.profile-btn {
  position: relative;
  width: 80px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid #a5b4fc;
  background: #6366f1;
  color: white;
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 6px;
  transition: .2s cubic-bezier(0.19, 1, 0.22, 1);
  opacity: 1;
  margin-top: 4px;
  align-self: flex-start;
}
.profile-btn::after {
  content: '';
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  width: 0;
  height: 100%;
  position: absolute;
  margin-top: -2px;
  top: 0;
  left: 4px;
  visibility: hidden;
  opacity: 1;
  transition: .2s linear;
}
.profile-btn .icon {
  transform: translateX(0%);
  transition: .2s linear;
  animation: attention 1.2s linear infinite;
}
.profile-btn:hover::after {
  visibility: visible;
  opacity: 0.7;
  width: 85%;
}
.profile-btn:hover {
  letter-spacing: 1.5px;
  background: #4338ca;
  border-color: #818cf8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
.profile-btn:hover > .icon {
  transform: translateX(20%);
  animation: none;
}
@keyframes attention {
  0% {
    transform: translateX(0%);
  }
  50% {
    transform: translateX(20%);
  }
}
.artist-profile-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 32px 28px 24px 28px;
  position: relative;
}
.profile-image-container {
  position: relative;
  flex-shrink: 0;
}
.profile-image-main {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  border: 4px solid white;
  background-color: #f3f4f6;
}
.artist-info-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.artist-name-main {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  letter-spacing: -0.01em;
  align-self: flex-start;
}
.artist-title-main {
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.4;
  align-self: flex-start;
}
.expertise-tags-main {
  padding: 0 28px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tag-group-main {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.expertise-tag {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  cursor: default;
  text-transform: none;
  letter-spacing: normal;
  display: inline-block;
  line-height: 1;
  background: none;
  font-family: inherit;
  outline: none;
  text-decoration: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.expertise-tag.clickable-tag {
  cursor: pointer;
}
.research-tag {
  background: #f1f5f9;
  color: #475569;
  border-color: #64748b;
}
.art-tag {
  background: #f3f4ff;
  color: #6366f1;
  border-color: #a5b4fc;
}
.expertise-tag.clickable-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.research-tag.clickable-tag:hover {
  background: #e2e8f0;
  color: #334155;
  border-color: #475569;
}
.art-tag.clickable-tag:hover {
  background: #e0e7ff;
  color: #4338ca;
  border-color: #818cf8;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  max-height: 0;
  opacity: 0;
  transform: scaleY(0);
}
.slide-enter-to {
  max-height: 300px;
  opacity: 1;
  transform: scaleY(1);
}
.slide-leave-from {
  max-height: 300px;
  opacity: 1;
  transform: scaleY(1);
}
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: scaleY(0);
}
</style>