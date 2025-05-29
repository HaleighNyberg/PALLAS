<template>
  <div class="profile-page">
    <div v-if="loading" class="loading">
      Loading your profile...
    </div>

    <div v-else>
      <div v-if="isVerified || (isOwner && !isVerified) || (isAdmin && !isVerified)">

        <div v-if="!isEditMode">
          <div class="profile-hero-banner" :style="{
            backgroundImage: profile.profileBackgroundURL
              ? `url(${profile.profileBackgroundURL})`
              : `url(${defaultBanner})`,
            backgroundSize: (profile.profileBackgroundZoom ? profile.profileBackgroundZoom * 100 : 100) + '%',
            backgroundPosition:
              (profile.profileBackgroundPosition?.x ?? 50) + '% ' +
              (profile.profileBackgroundPosition?.y ?? 50) + '%'
          }">
            <div class="hero-overlay"></div>
            
            <div class="profile-navigation">
              <button @click="goToGallery" class="back-to-gallery-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Gallery
              </button>
            </div>
          </div>

          
          <div class="profile-content">
            <div class="profile-main">
              
              <div class="profile-image-section">
                <div class="profile-image-container">
                  <img v-if="profile.profilePictureURL" :src="profile.profilePictureURL" alt="Profile Picture"
                    class="profile-image" :style="{
                      objectFit: 'cover',
                      transform: 'scale(' + (profile.profilePictureZoom || 1) + ')',
                      transformOrigin:
                        (profile.profilePicturePosition && profile.profilePicturePosition.x
                          ? profile.profilePicturePosition.x
                          : 50
                        ) +
                        '% ' +
                        (profile.profilePicturePosition && profile.profilePicturePosition.y
                          ? profile.profilePicturePosition.y
                          : 50
                        ) +
                        '%'
                    }" />
                  <img v-else :src="defaultProfile" alt="Default Profile Picture" class="profile-image"
                    style="object-fit: cover;" />
                    
                </div>
              </div>

              
              <div class="profile-info">
                <h1 class="artist-name">
                  {{ profile.name }}
                  <span v-if="isAdmin && !isVerified" class="unverified-badge">Unverified</span>
                </h1>
                <p class="artist-bio">{{ profile.bio || 'Artist & Creative Professional' }}</p>
                
                
                <div v-if="isOwner" class="edit-actions">
                  <button @click="toggleEditMode" class="edit-profile-btn">
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>

              
              <div class="artist-tags">
                <div v-if="profile.openToCommissions" class="commission-indicator-container">
                  <span class="commission-badge">Open for Commissions</span>
                </div>
                <div class="tag-group-main" v-if="profile.artFocus && profile.artFocus.length">
                  <button v-for="tag in profile.artFocus" :key="tag" 
                          class="expertise-tag research-tag clickable-tag"
                          @click="goToSearch(tag, 'focus')">
                    {{ tag }}
                  </button>
                </div>
                <div class="tag-group-main" v-if="profile.artMedium && profile.artMedium.length">
                  <button v-for="tag in profile.artMedium" :key="tag" 
                          class="expertise-tag art-tag clickable-tag"
                          @click="goToSearch(tag, 'medium')">
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          
          <div class="contact-methods-section" v-if="hasEnabledContactMethods">
            
            <div class="preferred-contact-legend" v-if="profile.preferredContactMethod">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-icon">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span>Preferred contact method</span>
            </div>
            
            <div class="contact-methods-list">
              
              <a v-if="profile.contactMethods.email.enabled && profile.contactMethods.email.value" 
                 :href="'mailto:' + profile.contactMethods.email.value" 
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'email' }"
                 @click="handleContactClick($event, 'email', profile.contactMethods.email.value, 'mailto:' + profile.contactMethods.email.value)"
                 title="Email">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>Email</span>
                <svg v-if="profile.preferredContactMethod === 'email'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
              
              
              <a v-if="profile.contactMethods.phone.enabled && profile.contactMethods.phone.value" 
                 :href="'tel:' + profile.contactMethods.phone.value" 
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'phone' }"
                 @click="handleContactClick($event, 'phone', profile.contactMethods.phone.value, 'tel:' + profile.contactMethods.phone.value)"
                 title="Phone">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>Phone</span>
                <svg v-if="profile.preferredContactMethod === 'phone'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
              
              
              <a v-if="profile.contactMethods.instagram.enabled && profile.contactMethods.instagram.value" 
                 :href="profile.contactMethods.instagram.value.startsWith('http') ? profile.contactMethods.instagram.value : 'https://instagram.com/' + profile.contactMethods.instagram.value.replace('@', '')" 
                 target="_blank"
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'instagram' }"
                 @click="handleContactClick($event, 'instagram', profile.contactMethods.instagram.value, profile.contactMethods.instagram.value.startsWith('http') ? profile.contactMethods.instagram.value : 'https://instagram.com/' + profile.contactMethods.instagram.value.replace('@', ''))"
                 title="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
                <span>Instagram</span>
                <svg v-if="profile.preferredContactMethod === 'instagram'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
              
              
              <a v-if="profile.contactMethods.twitter.enabled && profile.contactMethods.twitter.value" 
                 :href="profile.contactMethods.twitter.value.startsWith('http') ? profile.contactMethods.twitter.value : 'https://twitter.com/' + profile.contactMethods.twitter.value.replace('@', '')" 
                 target="_blank"
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'twitter' }"
                 @click="handleContactClick($event, 'twitter', profile.contactMethods.twitter.value, profile.contactMethods.twitter.value.startsWith('http') ? profile.contactMethods.twitter.value : 'https://twitter.com/' + profile.contactMethods.twitter.value.replace('@', ''))"
                 title="Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M22.46 6c-.85.38-1.76.64-2.72.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.55-2.11-9.93-5.02-.41.71-.65 1.53-.65 2.41 0 1.67.85 3.14 2.14 4.01-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.92 2.39 3.31 4.5 3.35-1.65 1.29-3.73 2.06-5.99 2.06-.39 0-.77-.02-1.15-.07 2.13 1.37 4.66 2.17 7.39 2.17 8.87 0 13.72-7.35 13.72-13.72 0-.21 0-.42-.01-.62.94-.68 1.76-1.53 2.41-2.5z"/>
                </svg>
                <span>Twitter</span>
                <svg v-if="profile.preferredContactMethod === 'twitter'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
              
              
              <a v-if="profile.contactMethods.tiktok.enabled && profile.contactMethods.tiktok.value" 
                 :href="profile.contactMethods.tiktok.value.startsWith('http') ? profile.contactMethods.tiktok.value : 'https://tiktok.com/@' + profile.contactMethods.tiktok.value.replace('@', '')" 
                 target="_blank"
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'tiktok' }"
                 @click="handleContactClick($event, 'tiktok', profile.contactMethods.tiktok.value, profile.contactMethods.tiktok.value.startsWith('http') ? profile.contactMethods.tiktok.value : 'https://tiktok.com/@' + profile.contactMethods.tiktok.value.replace('@', ''))"
                 title="TikTok">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>TikTok</span>
                <svg v-if="profile.preferredContactMethod === 'tiktok'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
              
              
              <a v-if="profile.contactMethods.linkedin.enabled && profile.contactMethods.linkedin.value" 
                 :href="profile.contactMethods.linkedin.value.startsWith('http') ? profile.contactMethods.linkedin.value : 'https://linkedin.com/in/' + profile.contactMethods.linkedin.value" 
                 target="_blank"
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'linkedin' }"
                 @click="handleContactClick($event, 'linkedin', profile.contactMethods.linkedin.value, profile.contactMethods.linkedin.value.startsWith('http') ? profile.contactMethods.linkedin.value : 'https://linkedin.com/in/' + profile.contactMethods.linkedin.value)"
                 title="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
                <svg v-if="profile.preferredContactMethod === 'linkedin'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
              
              
              <a v-if="profile.contactMethods.facebook.enabled && profile.contactMethods.facebook.value" 
                 :href="profile.contactMethods.facebook.value.startsWith('http') ? profile.contactMethods.facebook.value : 'https://facebook.com/' + profile.contactMethods.facebook.value" 
                 target="_blank"
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'facebook' }"
                 @click="handleContactClick($event, 'facebook', profile.contactMethods.facebook.value, profile.contactMethods.facebook.value.startsWith('http') ? profile.contactMethods.facebook.value : 'https://facebook.com/' + profile.contactMethods.facebook.value)"
                 title="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
                <svg v-if="profile.preferredContactMethod === 'facebook'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
              
              
              <a v-if="profile.contactMethods.cara.enabled && profile.contactMethods.cara.value" 
                 :href="profile.contactMethods.cara.value.startsWith('http') ? profile.contactMethods.cara.value : 'https://cara.app/' + profile.contactMethods.cara.value" 
                 target="_blank"
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'cara' }"
                 @click="handleContactClick($event, 'cara', profile.contactMethods.cara.value, profile.contactMethods.cara.value.startsWith('http') ? profile.contactMethods.cara.value : 'https://cara.app/' + profile.contactMethods.cara.value)"
                 title="Cara">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                  <text x="12" y="17" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor">C</text>
                </svg>
                <span>Cara</span>
                <svg v-if="profile.preferredContactMethod === 'cara'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
              
              
              <a v-if="profile.contactMethods.other.enabled && profile.contactMethods.other.value" 
                 :href="profile.contactMethods.other.value.startsWith('http') ? profile.contactMethods.other.value : 'https://' + profile.contactMethods.other.value" 
                 target="_blank"
                 class="contact-link"
                 :class="{ 'preferred': profile.preferredContactMethod === 'other' }"
                 @click="handleContactClick($event, 'other', profile.contactMethods.other.value, profile.contactMethods.other.value.startsWith('http') ? profile.contactMethods.other.value : 'https://' + profile.contactMethods.other.value)"
                 :title="profile.contactMethods.other.label || 'Other'">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>{{ profile.contactMethods.other.label || 'Other' }}</span>
                <svg v-if="profile.preferredContactMethod === 'other'" viewBox="0 0 24 24" width="16" height="16" fill="#FFB800" class="star-indicator">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </a>
            </div>
          </div>

          
          <div class="portfolio-section">
            <div class="portfolio-header">
              <h2 class="portfolio-title">Portfolio</h2>
            </div>
          
            
            <p class="artist-mission">{{ profile.mission || '' }}</p>

            
            <div class="portfolio-showcase" v-if="dashboard.portfolio.length > 0">
              
              <div class="portfolio-main-display">
                <div class="portfolio-content" v-if="currentPortfolioItem">
                  
                  <div class="portfolio-image-section">
                    <div class="portfolio-main-image" 
                         :style="{
                           backgroundImage: `url(${currentPortfolioItem.url || defaultPortfolioImage})`,
                           backgroundSize: `${(currentPortfolioItem.zoom || 1) * 100}%`,
                           backgroundPosition: `${currentPortfolioItem.position?.x || 50}% ${currentPortfolioItem.position?.y || 50}%`
                         }">
                    </div>
                  </div>
                  
                  
                  <div class="portfolio-info-section">
                    <div class="portfolio-details">
                      <h3 class="portfolio-main-title">{{ currentPortfolioItem.title }}</h3>
                      <div class="portfolio-description">
                        <p>{{ currentPortfolioItem.description }}</p>
                      </div>
                      
                      
                      <div class="portfolio-metadata" v-if="currentPortfolioItem.year || currentPortfolioItem.medium || currentPortfolioItem.dimensions">
                        <div class="metadata-item" v-if="currentPortfolioItem.year">
                          <span class="metadata-label">Year:</span>
                          <span class="metadata-value">{{ currentPortfolioItem.year }}</span>
                        </div>
                        <div class="metadata-item" v-if="currentPortfolioItem.medium">
                          <span class="metadata-label">Medium:</span>
                          <span class="metadata-value">{{ currentPortfolioItem.medium }}</span>
                        </div>
                        <div class="metadata-item" v-if="currentPortfolioItem.dimensions">
                          <span class="metadata-label">Dimensions:</span>
                          <span class="metadata-value">{{ currentPortfolioItem.dimensions }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              
              <div class="portfolio-thumbnails" v-if="dashboard.portfolio.length > 1">
                <div class="thumbnails-container">
                  <button v-for="(item, index) in dashboard.portfolio" 
                          :key="'thumb-' + item.id"
                          class="portfolio-thumbnail"
                          :class="{ active: index === currentPortfolioIndex }"
                          @click="setPortfolioIndex(index)"
                          :style="{ backgroundImage: item.url ? `url(${item.url})` : 'none', backgroundColor: item.url ? 'transparent' : '#f3f4f6' }">
                  </button>
                </div>
              </div>
              
              
              <div class="portfolio-navigation">
                <button class="portfolio-nav prev" @click="prevPortfolioItem">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                </button>
                
                <div class="portfolio-counter">
                  {{ currentPortfolioIndex + 1 }} / {{ dashboard.portfolio.length }}
                </div>
                
                <button class="portfolio-nav next" @click="nextPortfolioItem">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div v-else class="empty-portfolio">
              <div class="empty-portfolio-content">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
                <h3>No Portfolio Items</h3>
                <p>This artist hasn't shared any portfolio pieces yet.</p>
              </div>
            </div>
          </div>

        </div>

        
        <div v-else-if="isEditMode && isOwner" class="edit-mode">
          
          <div class="profile-hero-banner" :style="{
            backgroundImage: profile.profileBackgroundURL
              ? `url(${profile.profileBackgroundURL})`
              : `url(${defaultBanner})`,
            backgroundSize: (profile.profileBackgroundZoom ? profile.profileBackgroundZoom * 100 : 100) + '%',
            backgroundPosition:
              (profile.profileBackgroundPosition?.x ?? 50) + '% ' +
              (profile.profileBackgroundPosition?.y ?? 50) + '%'
          }">
            <div class="hero-overlay"></div>
            
            
            <div class="profile-navigation">
              <button @click="goToGallery" class="back-to-gallery-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Gallery
              </button>
            </div>
            
            
            <div class="edit-controls background-controls">
              <button @click="showBackgroundImageResize = true" class="edit-control-btn" title="Edit Background Image">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          </div>

          
          <div class="edit-header">
            <div class="edit-title">
              <h1>Edit Profile</h1>
              <div class="edit-status">
                <span v-if="successMessage" class="success-message">{{ successMessage }}</span>
                <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
              </div>
            </div>
            <div class="edit-actions-header">
              <button @click="saveProfile" :disabled="isSaving" class="save-btn">
                <span v-if="isSaving">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
              <button @click="toggleEditMode" class="cancel-btn">Cancel</button>
            </div>
          </div>

          
          <div class="profile-content">
            <div class="profile-main">
              <div class="profile-sidebar">
                
                <div class="profile-image-section edit-mode">
                  <div class="profile-image-container">
                    <img v-if="profile.profilePictureURL" :src="profile.profilePictureURL" alt="Profile Picture"
                      class="profile-image" :style="{
                        objectFit: 'cover',
                        transform: 'scale(' + (profile.profilePictureZoom || 1) + ')',
                        transformOrigin:
                          (profile.profilePicturePosition && profile.profilePicturePosition.x
                            ? profile.profilePicturePosition.x
                            : 50
                          ) +
                          '% ' +
                          (profile.profilePicturePosition && profile.profilePicturePosition.y
                            ? profile.profilePicturePosition.y
                            : 50
                          ) +
                          '%'
                      }" />
                    <img v-else :src="defaultProfile" alt="Default Profile Picture" class="profile-image"
                      style="object-fit: cover;" />
                    
                    
                    <button @click="showProfileImageResize = true" class="image-edit-btn edit-mode-btn" title="Edit Profile Image">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                
                <div class="contact-methods-dropdown">
                    <button type="button" 
                            @click="contactDropdownOpen = !contactDropdownOpen"
                            class="dropdown-button contact-dropdown">
                      <span>Select Contact Methods</span>
                      <svg viewBox="0 0 512 512" height="1em" class="chevron-down" :class="{ rotated: !contactDropdownOpen }">
                        <path d="M233.4 406.6c12.5 12.5 32.8 
                         12.5 45.3 0l192-192c12.5-12.5 
                         12.5-32.8 0-45.3s-32.8-12.5-45.3 
                         0L256 338.7 86.6 169.4c-12.5-12.5
                         -32.8-12.5-45.3 0s-12.5 32.8 
                         0 45.3l192 192z" />
                      </svg>
                    </button>
                    
                    <div v-show="contactDropdownOpen" class="dropdown-content contact-dropdown-content">
                      <input 
                        type="text" 
                        v-model="searchContactQuery" 
                        placeholder="Search contact methods..." 
                        class="dropdown-search-input"
                      />
                      
                      
                      <div class="preferred-contact-legend-edit">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="#FFB800">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        <span>Click star to set as preferred contact</span>
                      </div>
                      
                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'email'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-email'"
                                 v-model="profile.contactMethods.email.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-email'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            <span>Email</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('email')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'email' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.email.enabled" class="contact-input-wrapper">
                          <input type="email" 
                                 v-model="profile.contactMethods.email.value" 
                                 placeholder="your.email@example.com" 
                                 class="contact-input compact" />
                        </div>
                      </div>

                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'phone'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-phone'"
                                 v-model="profile.contactMethods.phone.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-phone'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                            </svg>
                            <span>Phone</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('phone')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'phone' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.phone.enabled" class="contact-input-wrapper">
                          <input type="tel" 
                                 v-model="profile.contactMethods.phone.value" 
                                 placeholder="+1 (555) 123-4567" 
                                 class="contact-input compact" />
                        </div>
                      </div>

                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'instagram'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-instagram'"
                                 v-model="profile.contactMethods.instagram.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-instagram'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                            </svg>
                            <span>Instagram</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('instagram')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'instagram' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.instagram.enabled" class="contact-input-wrapper">
                          <input type="text" 
                                 v-model="profile.contactMethods.instagram.value" 
                                 placeholder="@username or profile URL" 
                                 class="contact-input compact" />
                        </div>
                      </div>

                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'tiktok'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-tiktok'"
                                 v-model="profile.contactMethods.tiktok.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-tiktok'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                            </svg>
                            <span>TikTok</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('tiktok')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'tiktok' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.tiktok.enabled" class="contact-input-wrapper">
                          <input type="text" 
                                 v-model="profile.contactMethods.tiktok.value" 
                                 placeholder="@username or profile URL" 
                                 class="contact-input compact" />
                        </div>
                      </div>

                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'cara'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-cara'"
                                 v-model="profile.contactMethods.cara.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-cara'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                              <text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold" fill="currentColor">C</text>
                            </svg>
                            <span>Cara</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('cara')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'cara' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.cara.enabled" class="contact-input-wrapper">
                          <input type="text" 
                                 v-model="profile.contactMethods.cara.value" 
                                 placeholder="@username or profile URL" 
                                 class="contact-input compact" />
                        </div>
                      </div>

                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'twitter'.toLowerCase().includes(searchContactQuery.toLowerCase()) || 'x'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-twitter'"
                                 v-model="profile.contactMethods.twitter.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-twitter'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span>Twitter/X</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('twitter')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'twitter' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.twitter.enabled" class="contact-input-wrapper">
                          <input type="text" 
                                 v-model="profile.contactMethods.twitter.value" 
                                 placeholder="@username or profile URL" 
                                 class="contact-input compact" />
                        </div>
                      </div>

                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'linkedin'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-linkedin'"
                                 v-model="profile.contactMethods.linkedin.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-linkedin'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                            </svg>
                            <span>LinkedIn</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('linkedin')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'linkedin' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.linkedin.enabled" class="contact-input-wrapper">
                          <input type="text" 
                                 v-model="profile.contactMethods.linkedin.value" 
                                 placeholder="Profile URL" 
                                 class="contact-input compact" />
                        </div>
                      </div>

                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'facebook'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-facebook'"
                                 v-model="profile.contactMethods.facebook.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-facebook'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
                            </svg>
                            <span>Facebook</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('facebook')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'facebook' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.facebook.enabled" class="contact-input-wrapper">
                          <input type="text" 
                                 v-model="profile.contactMethods.facebook.value" 
                                 placeholder="Profile URL" 
                                 class="contact-input compact" />
                        </div>
                      </div>

                      
                      <div class="contact-method-item" v-show="!searchContactQuery || 'other'.toLowerCase().includes(searchContactQuery.toLowerCase())">
                        <div class="contact-method-row">
                          <input type="checkbox" 
                                 :id="'contact-other'"
                                 v-model="profile.contactMethods.other.enabled"
                                 class="contact-checkbox" />
                          <label :for="'contact-other'" class="contact-label">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            <span>Other</span>
                          </label>
                          <button type="button"
                                  @click="setPreferredContact('other')"
                                  class="star-btn-enhanced"
                                  :class="{ active: profile.preferredContactMethod === 'other' }"
                                  title="Set as preferred contact method">
                            <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        </div>
                        <div v-if="profile.contactMethods.other.enabled" class="contact-input-wrapper">
                          <input type="text" 
                                 v-model="profile.contactMethods.other.label" 
                                 placeholder="Method name" 
                                 class="contact-input compact contact-label-input" />
                          <input type="text" 
                                 v-model="profile.contactMethods.other.value" 
                                 placeholder="Contact details" 
                                 class="contact-input compact" />
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              
              <div class="profile-info edit-mode">
                <div class="name-edit-section">
                  <label>Artist Name</label>
                  <input v-model="profile.name" type="text" class="name-input" placeholder="Enter your name">
                </div>
                
                <div class="bio-edit-section">
                  <label>Bio <span class="char-count">{{ bioCharsRemaining }} characters remaining</span></label>
                  <textarea v-model="profile.bio" class="bio-textarea" 
                           :maxlength="maxBioLength"
                           placeholder="Tell us about yourself and your artistic journey..."></textarea>
                </div>
              </div>

              
              
              <div class="artist-tags edit-mode">
                
                <div class="commission-indicator-container">
                  <label class="commission-badge-editable" @click="profile.openToCommissions = !profile.openToCommissions">
                    <input type="checkbox" v-model="profile.openToCommissions" class="commission-checkbox">
                    <span class="commission-badge">Open for Commissions</span>
                  </label>
                </div>
                
                <div class="tags-edit-section">
                  <h3>Art Focus <span class="tag-limit">({{ profile.artFocus.length }}/{{ maxTagsCount }})</span></h3>
                  <div class="tag-editor">
                    <div class="selected-tags">
                      <div v-for="tag in profile.artFocus" :key="tag" class="expertise-tag research-tag selected-in-edit clickable-tag" @click="removeTag('focus', tag)">
                        {{ tag }}
                        <button @click.stop="removeTag('focus', tag)" class="remove-tag-btn">×</button>
                      </div>
                    </div>
                    <div class="tag-dropdown-container">
                      <button @click="toggleDropdownFocus" 
                              class="dropdown-button focus-dropdown btn cube cube-hover"
                              aria-haspopup="true"
                              :aria-expanded="dropdownFocusOpen">
                        Select Art Focus
                        <svg viewBox="0 0 512 512" height="1em" class="chevron-down" :class="{ rotated: !dropdownFocusOpen }">
                          <path d="M233.4 406.6c12.5 12.5 32.8 
                           12.5 45.3 0l192-192c12.5-12.5 
                           12.5-32.8 0-45.3s-32.8-12.5-45.3 
                           0L256 338.7 86.6 169.4c-12.5-12.5
                           -32.8-12.5-45.3 0s-12.5 32.8 
                           0 45.3l192 192z" />
                        </svg>
                      </button>
                      <div v-show="dropdownFocusOpen" class="dropdown-content focus-dropdown-content" role="menu">
                        <input v-model="searchFocusQuery" type="text" placeholder="Search Art Focus..." class="dropdown-search-input" />
                        <div v-for="tag in predefinedFocusTags.filter(t => 
                                  t.toLowerCase().includes(searchFocusQuery.toLowerCase())
                                )" 
                                :key="tag"
                                @click.stop="handleTagClick(tag, 'focus')"
                                class="dropdown-item focus-checkbox-item"
                                :class="{ 
                                  'disabled-item': !profile.artFocus.includes(tag) && profile.artFocus.length >= maxTagsCount 
                                }">
                          <input 
                            type="checkbox" 
                            :value="tag" 
                            :checked="profile.artFocus.includes(tag)"
                            class="custom-checkbox focus-checkbox"
                            tabindex="-1"
                          />
                          <span class="checkbox-label">{{ tag }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="tags-edit-section">
                  <h3>Art Medium <span class="tag-limit">({{ profile.artMedium.length }}/{{ maxTagsCount }})</span></h3>
                  <div class="tag-editor">
                    <div class="selected-tags">
                      <div v-for="tag in profile.artMedium" :key="tag" class="expertise-tag art-tag selected-in-edit clickable-tag" @click="removeTag('medium', tag)">
                        {{ tag }}
                        <button @click.stop="removeTag('medium', tag)" class="remove-tag-btn">×</button>
                      </div>
                    </div>
                    <div class="tag-dropdown-container">
                      <button @click="toggleDropdownMedium" 
                              class="dropdown-button medium-dropdown btn cube cube-hover"
                              aria-haspopup="true"
                              :aria-expanded="dropdownMediumOpen">
                        Select Art Medium
                        <svg viewBox="0 0 512 512" height="1em" class="chevron-down" :class="{ rotated: !dropdownMediumOpen }">
                          <path d="M233.4 406.6c12.5 12.5 32.8 
                           12.5 45.3 0l192-192c12.5-12.5 
                           12.5-32.8 0-45.3s-32.8-12.5-45.3 
                           0L256 338.7 86.6 169.4c-12.5-12.5
                           -32.8-12.5-45.3 0s-12.5 32.8 
                           0 45.3l192 192z" />
                        </svg>
                      </button>
                      <div v-show="dropdownMediumOpen" class="dropdown-content medium-dropdown-content" role="menu">
                        <input v-model="searchMediumQuery" type="text" placeholder="Search Art Medium..." class="dropdown-search-input" />
                        <div v-for="tag in predefinedMediumTags.filter(t => 
                                  t.toLowerCase().includes(searchMediumQuery.toLowerCase())
                                )" 
                                :key="tag"
                                @click.stop="handleTagClick(tag, 'medium')"
                                class="dropdown-item medium-checkbox-item"
                                :class="{ 
                                  'disabled-item': !profile.artMedium.includes(tag) && profile.artMedium.length >= maxTagsCount 
                                }">
                          <input 
                            type="checkbox" 
                            :value="tag" 
                            :checked="profile.artMedium.includes(tag)"
                            class="custom-checkbox medium-checkbox"
                            tabindex="-1"
                          />
                          <span class="checkbox-label">{{ tag }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div class="portfolio-section edit-mode">
            <div class="portfolio-header">
              <h2 class="portfolio-title">Portfolio</h2>

              <div class="portfolio-count" v-if="dashboard.portfolio.length">
                {{ dashboard.portfolio.length }} / {{ maxPortfolioItems }} pieces
              </div>
            </div>
            
            
              <div class="mission-edit-section">
                <label>Art Mission Statement <span class="char-count">{{ missionCharsRemaining }} characters remaining</span></label>
                  <textarea v-model="profile.mission" class="mission-textarea" 
                      :maxlength="maxMissionLength"
                      placeholder="Tell us about your artistic goals, values, etc..."></textarea>
              </div>

            
            <div v-if="showNewItemForm" class="new-item-form">
              <div class="form-header">
                <h3>Add New Portfolio Piece</h3>
                <button @click="showNewItemForm = false" class="close-form-btn">×</button>
              </div>
              
              <div class="form-content">
                <div class="form-left">
                  <div class="form-group">
                    <label>Title</label>
                    <input v-model="newPortfolioItem.title" type="text" placeholder="Piece title">
                  </div>
                  <div class="form-group">
                    <label>Description</label>
                    <textarea v-model="newPortfolioItem.description" placeholder="Describe your artwork..."></textarea>
                  </div>
                  <div class="form-actions">
                    <button @click="addPortfolioItem" :disabled="!isValidPortfolioItem || isSaving" class="submit-btn">
                      <span v-if="isSaving">Adding...</span>
                      <span v-else>Add Piece</span>
                    </button>
                    <button @click="showNewItemForm = false" class="cancel-form-btn">Cancel</button>
                  </div>
                </div>
                
                <div class="form-right">
                  <div class="new-portfolio-image-container">
                    <div v-if="newPortfolioItem.imageUrl" class="portfolio-image-preview"
                         :style="{
                           backgroundImage: `url(${newPortfolioItem.imageUrl})`,
                           backgroundSize: `${(newPortfolioItem.zoom || 1) * 100}%`,
                           backgroundPosition: `${newPortfolioItem.position?.x || 50}% ${newPortfolioItem.position?.y || 50}%`
                         }">
                      <button @click="editNewPortfolioImage" class="edit-portfolio-image-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        <span>Edit Image</span>
                      </button>
                    </div>
                    <button v-else @click="editNewPortfolioImage" class="upload-new-portfolio-btn">
                      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      <span>Upload portfolio image</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
            <div class="portfolio-showcase edit-mode" v-if="dashboard.portfolio.length > 0">
              
              <div class="portfolio-main-display">
                <div class="portfolio-content edit-mode" v-if="currentPortfolioItem">
                  
                  <div class="portfolio-image-section edit-mode">
                    <div class="portfolio-upload-container">
                      <div class="portfolio-image-preview" 
                           :style="{
                             backgroundImage: currentPortfolioItem.url ? `url(${currentPortfolioItem.url})` : 'none',
                             backgroundSize: `${(currentPortfolioItem.zoom || 1) * 100}%`,
                             backgroundPosition: `${currentPortfolioItem.position?.x || 50}% ${currentPortfolioItem.position?.y || 50}%`
                           }">
                        <button @click="editPortfolioImage(currentPortfolioIndex)" class="edit-portfolio-image-btn">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          <span>Edit Image</span>
                        </button>
                      </div>
                    </div>
                    <button @click="deletePortfolioItem(currentPortfolioItem)" class="portfolio-delete-btn standalone" title="Delete">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                  
                  
                  <div class="portfolio-info-section">
                    <div class="portfolio-details">
                      <div class="edit-field-group">
                        <label class="edit-label">Title {{ currentPortfolioItem.title ? currentPortfolioItem.title.length : 0 }}/50 characters</label>
                        <input v-model="currentPortfolioItem.title" 
                               type="text" 
                               class="portfolio-main-title editable always-bordered"
                               placeholder="Enter title"
                               maxlength="50">
                      </div>
                      <div class="edit-field-group">
                        <label class="edit-label">Description {{ currentPortfolioItem.description ? currentPortfolioItem.description.length : 0 }}/500 characters</label>
                        <textarea v-model="currentPortfolioItem.description" 
                                  class="portfolio-description-textarea always-bordered"
                                  placeholder="Enter description"
                                  maxlength="500"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              
              <div class="portfolio-thumbnails" v-if="editMode || dashboard.portfolio.length > 0">
                <div class="thumbnails-container">
                  <div v-for="(item, index) in dashboard.portfolio" 
                       :key="'thumb-' + item.id"
                       class="portfolio-thumbnail-wrapper"
                       draggable="true"
                       @dragstart="startDrag($event, index)"
                       @dragover.prevent
                       @dragenter.prevent
                       @drop="onDrop($event, index)">
                    <button class="portfolio-thumbnail"
                            :class="{ active: index === currentPortfolioIndex }"
                            @click="setPortfolioIndex(index)"
                            :style="{ backgroundImage: item.url ? `url(${item.url})` : 'none', backgroundColor: item.url ? 'transparent' : '#f3f4f6' }">
                    </button>
                  </div>
                  
                  
                  <button v-if="dashboard.portfolio.length < maxPortfolioItems" 
                          class="portfolio-thumbnail add-thumbnail"
                          @click="addBlankPortfolioItem">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
                                 
              
              <div class="portfolio-navigation">
                <button class="portfolio-nav prev" @click="prevPortfolioItem" :disabled="dashboard.portfolio.length === 0">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                </button>
                
                <div class="portfolio-counter">
                  <span v-if="dashboard.portfolio.length > 0">{{ currentPortfolioIndex + 1 }} / {{ dashboard.portfolio.length }}</span>
                  <span v-else>0 / 0</span>
                  <span class="portfolio-limit-info">• {{ dashboard.portfolio.length }}/10 items</span>
                </div>
                
                <button class="portfolio-nav next" @click="nextPortfolioItem" :disabled="dashboard.portfolio.length === 0">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div v-else class="empty-portfolio edit-mode">
              
              <div class="portfolio-thumbnails">
                <div class="thumbnails-container">
                  <button class="portfolio-thumbnail add-thumbnail"
                          @click="addBlankPortfolioItem">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              
              <div class="portfolio-navigation">
                <button class="portfolio-nav prev" @click="prevPortfolioItem" disabled>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                </button>
                
                <div class="portfolio-counter">
                  <span>0 / 0 </span>
                  <span class="portfolio-limit-info"> • 0/10 items</span>
                </div>

                <button class="portfolio-nav next" @click="nextPortfolioItem" disabled>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            
            <p class="reorder"> click and drag to reorder </p>

            
            <div class="portfolio-grid-section" style="display: none;">
              
              <div class="portfolio-grid">
                
                <div v-for="item in dashboard.portfolio" :key="item.id" :class="['portfolio-item-card', { 'admin-mode': isOwner }]">
                  
                  <div class="portfolio-thumbnail">
                    <img :src="item.url" :alt="item.title" class="portfolio-thumb-image" 
                         :style="{
                           transform: 'scale(' + (item.zoom || 1) + ')',
                           transformOrigin: (item.position?.x || 50) + '% ' + (item.position?.y || 50) + '%'
                         }" />
                    
                    
                    <div v-if="isOwner" class="portfolio-item-actions">
                      <button @click="editPortfolioItem(item)" class="action-btn edit-action" title="Edit">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button @click="deletePortfolioItem(item)" class="action-btn delete-action" title="Delete">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  
                  <div v-if="editingPortfolioItem === item.id" class="portfolio-edit-form">
                    
                    <div class="portfolio-edit-image">
                      <div class="portfolio-image-preview"
                           :style="{
                             backgroundImage: portfolioEditData.imageUrl ? `url(${portfolioEditData.imageUrl})` : 'none',
                             backgroundSize: `${(portfolioEditData.zoom || 1) * 100}%`,
                             backgroundPosition: `${portfolioEditData.position?.x || 50}% ${portfolioEditData.position?.y || 50}%`
                           }">
                        <button @click="editPortfolioImageById(item.id)" class="edit-portfolio-image-btn">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          <span>Change Image</span>
                        </button>
                      </div>
                    </div>
                    
                    
                    <div class="portfolio-edit-fields">
                      <div class="edit-field">
                        <label>Title</label>
                        <input v-model="portfolioEditData.title" type="text" class="edit-input" />
                      </div>
                      <div class="edit-field">
                        <label>Description</label>
                        <textarea v-model="portfolioEditData.description" class="edit-textarea"></textarea>
                      </div>
                      <div class="edit-actions">
                        <button @click="savePortfolioEdit(item.id)" class="save-btn">Save</button>
                        <button @click="cancelPortfolioEdit" class="cancel-btn">Cancel</button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="portfolio-item-info">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
                
                
                <div v-if="isOwner && dashboard.portfolio.length < maxPortfolioItems" class="portfolio-add-card">
                  <button @click="showNewItemForm = true" class="add-item-btn">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          
        
        <div v-if="showProfileImageEditor" class="image-editor-modal" @click="cancelProfileImageChanges">
          <div class="editor-container" @click.stop>
            <div class="editor-header">
              <h3>Edit Profile Image</h3>
              <button @click="cancelProfileImageChanges" class="close-editor-btn">×</button>
            </div>
            <div class="editor-content">
              <div class="image-preview-section">
                <div class="image-preview-container"
                     @wheel.prevent="handleImageWheel($event, 'profile')"
                     @mousedown="startImageDrag($event, 'profile')"
                     @mousemove="handleImageDrag($event, 'profile')"
                     @mouseup="stopImageDrag"
                     @mouseleave="stopImageDrag"
                     :style="{
                       backgroundImage: `url(${profile.profilePictureURL})`,
                       backgroundSize: profileImageZoom * 100 + '%',
                       backgroundPosition: profileImagePosition.x + '% ' + profileImagePosition.y + '%'
                     }">
                  <div class="crop-preview-overlay">
                    <div class="crop-preview-frame"></div>
                  </div>
                  <div class="image-edit-hints">
                    <div class="hint-item">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="7" cy="12" r="3"/>
                        <circle cx="17" cy="12" r="3"/>
                        <path d="M10 12h4"/>
                      </svg>
                      <span>Scroll to zoom</span>
                    </div>
                    <div class="hint-item">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
                      </svg>
                      <span>Drag to position</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="editor-actions">
              <button @click="saveProfileImageChanges" class="save-editor-btn">Save Changes</button>
              <button @click="cancelProfileImageChanges" class="cancel-editor-btn">Cancel</button>
            </div>
          </div>
        </div>

        
        <div v-if="showBackgroundImageEditor" class="image-editor-modal" @click="cancelBackgroundImageChanges">
          <div class="editor-container" @click.stop>
            <div class="editor-header">
              <h3>Edit Background Image</h3>
              <button @click="cancelBackgroundImageChanges" class="close-editor-btn">×</button>
            </div>
            <div class="editor-content">
              <div class="image-preview-section">
                <div class="image-preview-container background-preview"
                     @wheel.prevent="handleImageWheel($event, 'background')"
                     @mousedown="startImageDrag($event, 'background')"
                     @mousemove="handleImageDrag($event, 'background')"
                     @mouseup="stopImageDrag"
                     @mouseleave="stopImageDrag"
                     :style="{
                       backgroundImage: `url(${profile.profileBackgroundURL})`,
                       backgroundSize: backgroundImageZoom * 100 + '%',
                       backgroundPosition: backgroundImagePosition.x + '% ' + backgroundImagePosition.y + '%'
                     }">
                  <div class="crop-preview-overlay background-crop">
                    <div class="crop-preview-frame background-frame"></div>
                  </div>
                  <div class="image-edit-hints">
                    <div class="hint-item">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="7" cy="12" r="3"/>
                        <circle cx="17" cy="12" r="3"/>
                        <path d="M10 12h4"/>
                      </svg>
                      <span>Scroll to zoom</span>
                    </div>
                    <div class="hint-item">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
                      </svg>
                      <span>Drag to position</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="editor-actions">
              <button @click="saveBackgroundImageChanges" class="save-editor-btn">Save Changes</button>
              <button @click="cancelBackgroundImageChanges" class="cancel-editor-btn">Cancel</button>
            </div>
          </div>
        </div>

        
        <div v-if="showPortfolioImageEditor" class="image-editor-modal" @click="cancelPortfolioImageChanges">
          <div class="editor-container" @click.stop>
            <div class="editor-header">
              <h3>Edit Portfolio Image</h3>
              <button @click="cancelPortfolioImageChanges" class="close-editor-btn">×</button>
            </div>
            <div class="editor-content">
              <div class="image-preview-section">
                <div class="image-preview-container"
                     @wheel.prevent="handleImageWheel($event, 'portfolio')"
                     @mousedown="startImageDrag($event, 'portfolio')"
                     @mousemove="handleImageDrag($event, 'portfolio')"
                     @mouseup="stopImageDrag"
                     @mouseleave="stopImageDrag"
                     :style="{
                       backgroundImage: `url(${selectedPortfolioItem?.url})`,
                       backgroundSize: itemImageZoom * 100 + '%',
                       backgroundPosition: itemImagePosition.x + '% ' + itemImagePosition.y + '%'
                     }">
                  <div class="crop-preview-overlay">
                    <div class="crop-preview-frame"></div>
                  </div>
                  <div class="image-edit-hints">
                    <div class="hint-item">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="7" cy="12" r="3"/>
                        <circle cx="17" cy="12" r="3"/>
                        <path d="M10 12h4"/>
                      </svg>
                      <span>Scroll to zoom</span>
                    </div>
                    <div class="hint-item">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
                      </svg>
                      <span>Drag to position</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="editor-actions">
              <button @click="savePortfolioImageChanges" class="save-editor-btn">Save Changes</button>
              <button @click="cancelPortfolioImageChanges" class="cancel-editor-btn">Cancel</button>
            </div>
          </div>
        </div>

        
        <div v-if="showDeleteConfirmation" class="delete-modal" @click="cancelDeletePortfolioItem">
          <div class="delete-container" @click.stop>
            <div class="delete-header">
              <h3>Delete Portfolio Item</h3>
            </div>
            <div class="delete-content">
              <p>Are you sure you want to delete "{{ itemToDelete?.title }}"? This action cannot be undone.</p>
            </div>
            <div class="delete-actions">
              <button @click="confirmDeletePortfolioItem" class="confirm-delete-btn">Delete</button>
              <button @click="cancelDeletePortfolioItem" class="cancel-delete-btn">Cancel</button>
            </div>
          </div>
        </div>

        
        <ImageResize
          v-if="showProfileImageResize"
          :initial-image="profile.profilePictureURL"
          :initial-zoom="profile.profilePictureZoom || 1.2"
          :initial-position="profile.profilePicturePosition || { x: 50, y: 50 }"
          :display-width="280"
          :display-height="280"
          @save="handleProfileImageSave"
          @cancel="showProfileImageResize = false"
        />

        
        <ImageResize
          v-if="showBackgroundImageResize"
          :initial-image="profile.profileBackgroundURL"
          :initial-zoom="profile.profileBackgroundZoom || 1.2"
          :initial-position="profile.profileBackgroundPosition || { x: 50, y: 50 }"
          :display-width="1920"
          :display-height="432"
          @save="handleBackgroundImageSave"
          @cancel="showBackgroundImageResize = false"
        />

        
        <ImageResize
          v-if="showPortfolioImageResize"
          :initial-image="editingPortfolioItem?.url || ''"
          :initial-zoom="editingPortfolioItem?.zoom || 1.2"
          :initial-position="editingPortfolioItem?.position || { x: 50, y: 50 }"
          :display-width="720"
          :display-height="500"
          @save="handlePortfolioImageSave"
          @cancel="showPortfolioImageResize = false"
        />
        </div>
        
        
        <div v-else-if="isEditMode && !isOwner" class="security-error">
          <h2>Access Denied</h2>
          <p>You do not have permission to edit this profile.</p>
          <button @click="isEditMode = false" class="back-btn">Go Back</button>
        </div>

      </div>
    </div>
    
    
    <transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="toast-icon">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        {{ toastMessage }}
      </div>
    </transition>
    
    
    <VerificationPopup 
      v-if="showVerificationPopup"
      @close="showVerificationPopup = false"
      @edit-profile="handleEditFromPopup"
    />
  </div>
</template>

<script>

const defaultBanner = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 300'%3E%3Cdefs%3E%3Cpattern id='bannerGrid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23e5e5e5' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='1200' height='300' fill='%23f8f8f8'/%3E%3Crect width='1200' height='300' fill='url(%23bannerGrid)'/%3E%3C/svg%3E";

const defaultProfile = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import ImageResize from './ImageResize.vue'
import VerificationPopup from './VerificationPopup.vue'

export default {
  name: 'ProfilePageNew',
  components: {
    ImageResize,
    VerificationPopup
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    

    const maxBioLength = 600
    const maxMissionLength = 600
    const maxTagsCount = 5
    const maxPortfolioItems = 10
    const defaultPortfolioImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E"
    

    const loading = ref(true)
    const isVerified = ref(false)
    const isOwner = ref(false)
    const isEditMode = ref(false)
    const isAdmin = ref(false)
    const isSaving = ref(false)
    const uploadingImage = ref(false)
    const contactDropdownOpen = ref(false)
    const uploadingBackground = ref(false)
    const uploadingPortfolioItemImage = ref(false)
    const successMessage = ref("")
    const errorMessage = ref("")
    const showVerificationPopup = ref(false)
    

    const profile = reactive({
      name: '',
      bio: '',
      mission: '',
      artFocus: [],
      artMedium: [],
      profilePictureURL: '',
      profileBackgroundURL: '',
      profilePictureZoom: 1,
      profileBackgroundZoom: 1,
      profilePicturePosition: { x: 50, y: 50 },
      profileBackgroundPosition: { x: 50, y: 50 },
      preferredContactMethod: 'email',
      contactMethods: {
        email: { enabled: false, value: "" },
        phone: { enabled: false, value: "" },
        instagram: { enabled: false, value: "" },
        twitter: { enabled: false, value: "" },
        tiktok: { enabled: false, value: "" },
        linkedin: { enabled: false, value: "" },
        facebook: { enabled: false, value: "" },
        cara: { enabled: false, value: "" },
        other: { enabled: false, value: "", label: "" }
      },
      websites: [], 
      openToCommissions: false
    })
    
    const dashboard = reactive({
      portfolio: []
    })
    

    const editingPortfolioItem = ref(null)
    const portfolioEditData = reactive({
      title: '',
      description: '',
      imageUrl: '',
      zoom: 1,
      position: { x: 50, y: 50 }
    })
    

    let originalProfile = {}
    let originalPortfolio = []
    let profileSaved = ref(false)
    

    const currentPortfolioIndex = ref(0)
    const currentPortfolioItem = computed(() => {

      if (dashboard.portfolio && dashboard.portfolio.length > 0 && currentPortfolioIndex.value >= 0 && currentPortfolioIndex.value < dashboard.portfolio.length) {
        return dashboard.portfolio[currentPortfolioIndex.value];
      }
      return null; // Or a default placeholder item
    });
    

    const showNewItemForm = ref(false)
    const newPortfolioItem = reactive({ 
      title: "", 
      description: "", 
      file: null, 
      imageUrl: null, 
      zoom: 1, 
      position: { x: 50, y: 50 } 
    })
    

    const showProfileImageEditor = ref(false)
    const showBackgroundImageEditor = ref(false)
    const showPortfolioImageEditor = ref(false) // This one seems to also use the local handlers
    const selectedPortfolioItem = ref(null) // Used by showPortfolioImageEditor
    

    const showProfileImageResize = ref(false)
    const showBackgroundImageResize = ref(false)
    const showPortfolioImageResize = ref(false)
    const editingPortfolioIndex = ref(null)
    

    const profileImageZoom = ref(1);       // Temporary state for profile image editor
    const profileImagePosition = reactive({ x: 50, y: 50 }); // Temporary state for profile image editor
    const backgroundImageZoom = ref(1);    // Temporary state for background image editor
    const backgroundImagePosition = reactive({ x: 50, y: 50 }); // Temporary state for background image editor
    const itemImageZoom = ref(1);          // Temporary state for portfolio item editor
    const itemImagePosition = reactive({ x: 50, y: 50 }); // Temporary state for portfolio item editor
    const tempProfileImage = ref({ url: '', zoom: 1, pos: { x: 50, y: 50 } })
    const tempBackgroundImage = ref({ url: '', zoom: 1, pos: { x: 50, y: 50 } })
    const tempItemImage = ref({ url: '', zoom: 1, pos: { x: 50, y: 50 } }) // For the local portfolio image editor
    

    const showToast = ref(false)
    const toastMessage = ref('')
    

    const showDeleteConfirmation = ref(false)
    const itemToDelete = ref(null)
    

    const predefinedFocusTags = [ "Physics", "Math", "Biology", "Astronomy", "Computer Science", "Chemistry", "Geology", "Environmental Science", "Medical Science", "Robotics", "Engineering", "Nanotechnology", "Oceanography", "Psychology", "Art History (Scientific Illustration)", "Materials Science", "Data Science", "Artificial Intelligence", "Meteorology", "Ecology", "Astrophysics", "Quantum Computing", "Biotechnology", "Neuroscience", "Forensic Science", "Energy Science", "Acoustics", "Systems Engineering", "Agricultural Science"];
    const predefinedMediumTags = [ "Pencil", "Pen", "Painting", "Sculpture", "Photography", "Digital", "Mixed Media", "Drawing", "Illustration", "Printmaking", "Ceramics", "Textile Art", "Collage", "Installation Art", "Video Art", "Performance Art", "3D Modeling", "Augmented Reality", "Virtual Reality", "Sound Art", "Kinetic Art", "Glass Art", "Woodworking", "Metalworking", "Mosaic", "Calligraphy", "Paper Art", "Projection Mapping"];

    const dropdownFocusOpen = ref(false)
    const dropdownMediumOpen = ref(false)
    const searchFocusQuery = ref("")
    const searchMediumQuery = ref("")
    const searchContactQuery = ref("")
    

    const bioCharsRemaining = computed(() => maxBioLength - (profile.bio ? profile.bio.length : 0))
    const missionCharsRemaining = computed(() => maxMissionLength - (profile.mission ? profile.mission.length : 0))

    const isValidPortfolioItem = computed(() => {
      return newPortfolioItem.title.trim() && newPortfolioItem.description.trim() && newPortfolioItem.imageUrl
    })
    const hasEnabledContactMethods = computed(() => {
      return Object.values(profile.contactMethods).some(method => method.enabled && method.value);
    })
    

    const toggleEditMode = () => {

      if (!isOwner.value) {
        errorMessage.value = "You can only edit your own profile";
        console.error('Edit attempt by non-owner');
        return;
      }
      
      if (!isEditMode.value) { // Entering Edit Mode
        originalProfile = JSON.parse(JSON.stringify(profile))
        originalPortfolio = JSON.parse(JSON.stringify(dashboard.portfolio))
        

        profileImageZoom.value = profile.profilePictureZoom || 1
        profileImagePosition.x = profile.profilePicturePosition?.x || 50
        profileImagePosition.y = profile.profilePicturePosition?.y || 50
        
        backgroundImageZoom.value = profile.profileBackgroundZoom || 1
        backgroundImagePosition.x = profile.profileBackgroundPosition?.x || 50
        backgroundImagePosition.y = profile.profileBackgroundPosition?.y || 50
        
        isEditMode.value = true
      } else { // Exiting Edit Mode (Cancel)
        if (!profileSaved.value) { // Restore if not saved
          Object.assign(profile, originalProfile)
          dashboard.portfolio = JSON.parse(JSON.stringify(originalPortfolio))

        }
        isEditMode.value = false
        profileSaved.value = false // Reset save flag
        showNewItemForm.value = false
        successMessage.value = ""
        errorMessage.value = ""
      }
    }
    

    const nextPortfolioItem = () => {
      if (!dashboard.portfolio || dashboard.portfolio.length === 0) return;
      if (currentPortfolioIndex.value < dashboard.portfolio.length - 1) {
        currentPortfolioIndex.value++
      } else {
        currentPortfolioIndex.value = 0
      }
    }
    
    const prevPortfolioItem = () => {
      if (!dashboard.portfolio || dashboard.portfolio.length === 0) return;
      if (currentPortfolioIndex.value > 0) {
        currentPortfolioIndex.value--
      } else {
        currentPortfolioIndex.value = dashboard.portfolio.length - 1
      }
    }
    
    const setPortfolioIndex = (index) => {
      currentPortfolioIndex.value = index
    }
    
    
    const goToSearch = (tag, type) => {
      const query = type === 'focus' 
        ? { selectedFocus: JSON.stringify([tag]), selectedMedium: JSON.stringify([]) }
        : { selectedFocus: JSON.stringify([]), selectedMedium: JSON.stringify([tag]) }
      
      router.push({
        name: 'SearchArtists',
        query
      })
    }
    
    const goToGallery = () => {
      try {
        const query = {}
        if (route.query.searchQuery) query.searchQuery = route.query.searchQuery
        if (route.query.selectedFocus) query.selectedFocus = route.query.selectedFocus
        if (route.query.selectedMedium) query.selectedMedium = route.query.selectedMedium
        
        router.push({ 
          name: 'SearchArtists',
          query: query
        }).catch(error => {
          console.error('Gallery navigation error:', error)
          router.push('/SearchArtists')
        })
      } catch (error) {
        console.error('Error in goToGallery:', error)
        router.push('/SearchArtists')
      }
    }
    

    const toggleDropdownFocus = () => { 
      dropdownFocusOpen.value = !dropdownFocusOpen.value
      if (dropdownFocusOpen.value) dropdownMediumOpen.value = false
    }
    const toggleDropdownMedium = () => { 
      dropdownMediumOpen.value = !dropdownMediumOpen.value
      if (dropdownMediumOpen.value) dropdownFocusOpen.value = false
    }

    const handleTagClick = (tag, type) => {
      const targetArray = type === 'focus' ? profile.artFocus : profile.artMedium;
      const index = targetArray.indexOf(tag);

      if (index > -1) {
        targetArray.splice(index, 1);
      } else if (targetArray.length < maxTagsCount) {
        targetArray.push(tag);
      }
    }
    
    const removeTag = (type, tag) => {
      const targetArray = type === 'focus' ? profile.artFocus : profile.artMedium
      const index = targetArray.indexOf(tag)
      if (index > -1) targetArray.splice(index, 1)
    }
    

    const toggleContactMethod = (method) => {
      if (profile.contactMethods[method]) {
        profile.contactMethods[method].enabled = !profile.contactMethods[method].enabled;
        if (!profile.contactMethods[method].enabled) {
          profile.contactMethods[method].value = '';
          if (method === 'other') {
            profile.contactMethods[method].label = '';
          }
        }
      }
    }
    
    const setPreferredContact = (method) => {
      profile.preferredContactMethod = profile.preferredContactMethod === method ? '' : method;
      if (profile.preferredContactMethod === method && profile.contactMethods[method]) {
        profile.contactMethods[method].enabled = true;
      }
    };
    
    const handleContactClick = async (event, method, value, url) => {
      event.preventDefault();
      try {
        let textToCopy = value;
        if (method !== 'email' && method !== 'phone') { // For social links, copy the URL
          textToCopy = url;
        }
        await navigator.clipboard.writeText(textToCopy);
        toastMessage.value = `${method.charAt(0).toUpperCase() + method.slice(1)} copied to clipboard!`;
        showToast.value = true;
        setTimeout(() => { showToast.value = false; }, 3000);
        setTimeout(() => {
          window.open(url, (method === 'email' || method === 'phone') ? '_self' : '_blank');
        }, 300);
      } catch (err) {
        console.error('Failed to copy:', err);
        window.open(url, (method === 'email' || method === 'phone') ? '_self' : '_blank');
      }
    };
    

    

    const commonImageUploadHandler = async (file, type) => {

      if (!file || !file.type.startsWith("image/")) {
        throw new Error(`Invalid file type: ${file?.type || 'unknown'}. Please select an image.`)
      }
      if (!auth.currentUser) {
        throw new Error('You must be logged in to upload images.')
      }
      let loadingIndicator;
      if (type === 'profile') loadingIndicator = uploadingImage;
      else if (type === 'background') loadingIndicator = uploadingBackground;
      else if (type === 'portfolio') loadingIndicator = uploadingPortfolioItemImage;

      if (loadingIndicator) loadingIndicator.value = true;
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'PALLASpreset'); // Your Cloudinary upload preset
        formData.append('folder', `${type}_images/${auth.currentUser.uid}`);

        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dcupr3hmp/image/upload', // Your Cloudinary cloud name
          { method: 'POST', body: formData }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Cloudinary upload failed');
        }
        const result = await response.json();
        return result.secure_url;
      } catch (error) {
        console.error(`Upload error for ${type}:`, error);
        errorMessage.value = `Failed to upload ${type} image: ${error.message}`;
        throw error; // Re-throw to be caught by ImageUploadWithResize or other callers
      } finally {
        if (loadingIndicator) loadingIndicator.value = false;
      }
    };

    const uploadProfileImage = async (file) => ({ url: await commonImageUploadHandler(file, 'profile') });
    const uploadBackgroundImage = async (file) => ({ url: await commonImageUploadHandler(file, 'background') });
    const uploadPortfolioImage = async (file) => ({ url: await commonImageUploadHandler(file, 'portfolio') });
    

    const handleProfileImageSave = async (data) => {
      try {
        if (data.imageUrl.startsWith('data:')) {

          const response = await fetch(data.imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
          const result = await uploadProfileImage(file);
          profile.profilePictureURL = result.url;
        } else {
          profile.profilePictureURL = data.imageUrl;
        }
        profile.profilePictureZoom = data.zoom;
        profile.profilePicturePosition = data.position;
        showProfileImageResize.value = false;
      } catch (error) {
        console.error('Error saving profile image:', error);
        console.error('Error details:', error.message);
        errorMessage.value = `Failed to save profile image: ${error.message}`;
      }
    };
    
    const handleBackgroundImageSave = async (data) => {
      try {
        if (data.imageUrl.startsWith('data:')) {

          const response = await fetch(data.imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'background.jpg', { type: 'image/jpeg' });
          const result = await uploadBackgroundImage(file);
          profile.profileBackgroundURL = result.url;
        } else {
          profile.profileBackgroundURL = data.imageUrl;
        }
        profile.profileBackgroundZoom = data.zoom;
        profile.profileBackgroundPosition = data.position;
        showBackgroundImageResize.value = false;
      } catch (error) {
        console.error('Error saving background image:', error);
        console.error('Error details:', error.message);
        errorMessage.value = `Failed to save background image: ${error.message}`;
      }
    };
    
    const handlePortfolioImageSave = async (data) => {
      try {
        let imageUrl = data.imageUrl;
        if (data.imageUrl.startsWith('data:')) {

          const response = await fetch(data.imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'portfolio.jpg', { type: 'image/jpeg' });
          const result = await uploadPortfolioImage(file);
          imageUrl = result.url;
        }
        
        if (editingPortfolioIndex.value !== null && editingPortfolioIndex.value !== -1) {

          if (dashboard.portfolio && dashboard.portfolio[editingPortfolioIndex.value]) {
            dashboard.portfolio[editingPortfolioIndex.value] = {
              ...dashboard.portfolio[editingPortfolioIndex.value],
              url: imageUrl,
              zoom: data.zoom,
              position: data.position
            };
          }
        } else {

          newPortfolioItem.value.imageUrl = imageUrl;
          newPortfolioItem.value.zoom = data.zoom;
          newPortfolioItem.value.position = data.position;
        }
        
        showPortfolioImageResize.value = false;
        editingPortfolioItem.value = null;
        editingPortfolioIndex.value = null;
      } catch (error) {
        console.error('Error saving portfolio image:', error);
        errorMessage.value = 'Failed to save portfolio image';
      }
    };
    
    const editPortfolioImage = (index) => {
      if (!dashboard.portfolio || !dashboard.portfolio[index]) {
        console.error('Portfolio item not found at index:', index);
        return;
      }
      editingPortfolioIndex.value = index;
      editingPortfolioItem.value = dashboard.portfolio[index];
      showPortfolioImageResize.value = true;
    };
    
    const editNewPortfolioImage = () => {
      editingPortfolioIndex.value = -1; // Special index for new item
      editingPortfolioItem.value = newPortfolioItem.value;
      showPortfolioImageResize.value = true;
    };
    
    const editPortfolioImageById = (itemId) => {
      if (!dashboard.portfolio) {
        console.error('Dashboard portfolio not available');
        return;
      }
      const index = dashboard.portfolio.findIndex(item => item.id === itemId);
      if (index !== -1) {
        editingPortfolioIndex.value = index;
        editingPortfolioItem.value = portfolioEditData;
        showPortfolioImageResize.value = true;
      }
    };
    
    const isDragging = ref(false); // Local dragging state for these editors
    const dragStartPos = ref({ x: 0, y: 0 }); // Mouse clientX/Y for these editors
    const dragStartImagePos = ref({ x: 0, y: 0 }); // Initial image position (percentages) for these editors

    const handleImageWheel = (event, type) => { // This is the ProfilePageNew.vue local handler
      const delta = event.deltaY;

      const zoomMultiplier = delta > 0 ? 0.95 : 1.05; 
      let currentZoomVal = 1;

      if (type === 'profile') {
        currentZoomVal = profile.profilePictureZoom || 1;
        profile.profilePictureZoom = Math.max(1.0, Math.min(5, currentZoomVal * zoomMultiplier)); // Min 100%, Max 500%
      } else if (type === 'background') {
        currentZoomVal = profile.profileBackgroundZoom || 1;
        profile.profileBackgroundZoom = Math.max(1.0, Math.min(5, currentZoomVal * zoomMultiplier));
      } else if (type === 'portfolio' && selectedPortfolioItem.value) { // Check selectedPortfolioItem
        currentZoomVal = selectedPortfolioItem.value.zoom || 1;
        selectedPortfolioItem.value.zoom = Math.max(1.0, Math.min(5, currentZoomVal * zoomMultiplier));
      }
    };
    
    const startImageDrag = (event, type) => { // This is the ProfilePageNew.vue local handler
      isDragging.value = true;
      dragStartPos.value = { x: event.clientX, y: event.clientY };
      
      if (type === 'profile') {
        dragStartImagePos.value = { ...(profile.profilePicturePosition || { x: 50, y: 50 }) };
      } else if (type === 'background') {
        dragStartImagePos.value = { ...(profile.profileBackgroundPosition || { x: 50, y: 50 }) };
      } else if (type === 'portfolio' && selectedPortfolioItem.value) {
        dragStartImagePos.value = { ...(selectedPortfolioItem.value.position || { x: 50, y: 50 }) };
      }
      event.preventDefault(); // Good practice to prevent default drag behaviors
    };
    
    const handleImageDrag = (event, type) => { // This is the ProfilePageNew.vue local handler
      if (!isDragging.value) return;
      event.preventDefault(); // Good practice

      const deltaXPixels = event.clientX - dragStartPos.value.x;
      const deltaYPixels = event.clientY - dragStartPos.value.y;

      const sensitivity = 0.1; 
                                 
      let newX; // Use 'let' to allow reassignment
      let newY; // Use 'let'
      newX = dragStartImagePos.value.x - (deltaXPixels * sensitivity);
      newY = dragStartImagePos.value.y - (deltaYPixels * sensitivity);
      
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));

      if (type === 'profile') {
        if (profile.profilePicturePosition) {
            profile.profilePicturePosition.x = newX;
            profile.profilePicturePosition.y = newY;
        } else { // Initialize if undefined
            profile.profilePicturePosition = { x: newX, y: newY };
        }
      } else if (type === 'background') {
        if (profile.profileBackgroundPosition) {
            profile.profileBackgroundPosition.x = newX;
            profile.profileBackgroundPosition.y = newY;
        } else {
            profile.profileBackgroundPosition = { x: newX, y: newY };
        }
      } else if (type === 'portfolio' && selectedPortfolioItem.value) {
        if (!selectedPortfolioItem.value.position) {
          selectedPortfolioItem.value.position = { x: 50, y: 50 };
        }
        selectedPortfolioItem.value.position.x = newX;
        selectedPortfolioItem.value.position.y = newY;
      }
    };
    
    const stopImageDrag = () => { // This is the ProfilePageNew.vue local handler
      isDragging.value = false;
    };

    const openProfileImageEditor = () => {

      tempProfileImage.value = {
        url: profile.profilePictureURL, // Though URL doesn't change here, just zoom/pos
        zoom: profile.profilePictureZoom || 1,
        pos: { ...(profile.profilePicturePosition || { x: 50, y: 50 }) }
      };
      profileImageZoom.value = profile.profilePictureZoom || 1;
      profileImagePosition.x = profile.profilePicturePosition?.x || 50;
      profileImagePosition.y = profile.profilePicturePosition?.y || 50;
      showProfileImageEditor.value = true;
    };

    const saveProfileImageChanges = () => { // Saves from local editor state to main profile state
      profile.profilePictureZoom = profileImageZoom.value;
      profile.profilePicturePosition = { ...profileImagePosition };
      showProfileImageEditor.value = false;
    };

    const cancelProfileImageChanges = () => {
      profileImageZoom.value = tempProfileImage.value.zoom;
      profileImagePosition.x = tempProfileImage.value.pos.x;
      profileImagePosition.y = tempProfileImage.value.pos.y;
      showProfileImageEditor.value = false;
    };

    const openBackgroundImageEditor = () => {
      tempBackgroundImage.value = {
        url: profile.profileBackgroundURL,
        zoom: profile.profileBackgroundZoom || 1,
        pos: { ...(profile.profileBackgroundPosition || { x: 50, y: 50 }) }
      };
      backgroundImageZoom.value = profile.profileBackgroundZoom || 1;
      backgroundImagePosition.x = profile.profileBackgroundPosition?.x || 50;
      backgroundImagePosition.y = profile.profileBackgroundPosition?.y || 50;
      showBackgroundImageEditor.value = true;
    };
    
    const saveBackgroundImageChanges = () => {
      profile.profileBackgroundZoom = backgroundImageZoom.value;
      profile.profileBackgroundPosition = { ...backgroundImagePosition };
      showBackgroundImageEditor.value = false;
    };

    const cancelBackgroundImageChanges = () => {
      backgroundImageZoom.value = tempBackgroundImage.value.zoom;
      backgroundImagePosition.x = tempBackgroundImage.value.pos.x;
      backgroundImagePosition.y = tempBackgroundImage.value.pos.y;
      showBackgroundImageEditor.value = false;
    };
    

    const openPortfolioImageEditor = (item) => {
        selectedPortfolioItem.value = item; // The item whose URL is used in editor
        tempItemImage.value = {
            url: item.url,
            zoom: item.zoom || 1,
            pos: { ...(item.position || {x: 50, y: 50})}
        };
        itemImageZoom.value = item.zoom || 1;
        itemImagePosition.x = item.position?.x || 50;
        itemImagePosition.y = item.position?.y || 50;
        showPortfolioImageEditor.value = true;
    };
    
    const savePortfolioImageChanges = () => { // Saves from itemImageZoom/Pos to selectedPortfolioItem
      if (selectedPortfolioItem.value) {
        selectedPortfolioItem.value.zoom = itemImageZoom.value;
        selectedPortfolioItem.value.position = { ...itemImagePosition };

        const index = dashboard.portfolio.findIndex(p => p.id === selectedPortfolioItem.value.id);
        if (index !== -1) {
            dashboard.portfolio[index].zoom = itemImageZoom.value;
            dashboard.portfolio[index].position = { ...itemImagePosition };
        }
      }
      showPortfolioImageEditor.value = false;
      selectedPortfolioItem.value = null; // Clear selection
    };

    const cancelPortfolioImageChanges = () => {

      if (selectedPortfolioItem.value && tempItemImage.value) {
          itemImageZoom.value = tempItemImage.value.zoom;
          itemImagePosition.x = tempItemImage.value.pos.x;
          itemImagePosition.y = tempItemImage.value.pos.y;
      }
      showPortfolioImageEditor.value = false;
      selectedPortfolioItem.value = null; // Clear selection
    };

   
    
    const addPortfolioItem = async () => {
      if (!isValidPortfolioItem.value) return;
      isSaving.value = true;
      try {

        const newItemData = {
          id: Date.now().toString(),
          title: newPortfolioItem.title.trim(),
          description: newPortfolioItem.description.trim(),
          url: newPortfolioItem.imageUrl, // This should be set by ImageUploadWithResize
          zoom: newPortfolioItem.zoom,     // This should be set by ImageUploadWithResize @save
          position: { ...newPortfolioItem.position } // This should be set by ImageUploadWithResize @save
        };
        dashboard.portfolio.push(newItemData);

        newPortfolioItem.title = "";
        newPortfolioItem.description = "";
        newPortfolioItem.file = null;
        newPortfolioItem.imageUrl = null;
        newPortfolioItem.zoom = 1;
        newPortfolioItem.position = { x: 50, y: 50 };
        showNewItemForm.value = false;
        successMessage.value = "Portfolio item added!";
        setTimeout(() => successMessage.value = "", 3000);
      } catch (error) {
        errorMessage.value = `Failed to add portfolio item: ${error.message}`;
      } finally {
        isSaving.value = false;
      }
    };

    const editPortfolioItem = (item) => { // Sets up for form editing, not the local image editor modal
      editingPortfolioItem.value = item.id;
      portfolioEditData.title = item.title;
      portfolioEditData.description = item.description;
      portfolioEditData.imageUrl = item.url; // This URL will be v-model for ImageUploadWithResize
      portfolioEditData.zoom = item.zoom || 1;
      portfolioEditData.position = { ...(item.position || { x: 50, y: 50 }) };
    };

    const savePortfolioEdit = (itemId) => { // Saves form data and ImageUploadWithResize data
      const itemIndex = dashboard.portfolio.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        dashboard.portfolio[itemIndex] = {
          ...dashboard.portfolio[itemIndex], // Keep other properties like id
          title: portfolioEditData.title,
          description: portfolioEditData.description,
          url: portfolioEditData.imageUrl, // Updated by ImageUploadWithResize's v-model
          zoom: portfolioEditData.zoom,   // Updated by ImageUploadWithResize's @save
          position: { ...portfolioEditData.position } // Updated by ImageUploadWithResize's @save
        };
      }
      editingPortfolioItem.value = null;
    };
    
    const cancelPortfolioEdit = () => {
      editingPortfolioItem.value = null;

    };

    const addBlankPortfolioItem = () => {
      if (dashboard.portfolio.length >= maxPortfolioItems) {
        errorMessage.value = `Maximum of ${maxPortfolioItems} portfolio items allowed.`;
        setTimeout(() => errorMessage.value = "", 3000);
        return;
      }
      const newItem = {
        id: Date.now().toString(),
        title: 'New Artwork',
        description: 'Add details...',
        url: '', // Will be filled by ImageUploadWithResize
        zoom: 1,
        position: { x: 50, y: 50 }
      };
      dashboard.portfolio.push(newItem);
      currentPortfolioIndex.value = dashboard.portfolio.length - 1;
    };
    
    const deletePortfolioItem = (item) => {
      itemToDelete.value = item;
      showDeleteConfirmation.value = true;
    };
    
    const confirmDeletePortfolioItem = () => {
      if (itemToDelete.value) {
        const index = dashboard.portfolio.findIndex(p => p.id === itemToDelete.value.id);
        if (index > -1) {
          dashboard.portfolio.splice(index, 1);
          if (currentPortfolioIndex.value >= dashboard.portfolio.length && dashboard.portfolio.length > 0) {
            currentPortfolioIndex.value = dashboard.portfolio.length - 1;
          } else if (dashboard.portfolio.length === 0) {
            currentPortfolioIndex.value = 0; // Or -1 if you prefer to show nothing
          }
        }
      }
      showDeleteConfirmation.value = false;
      itemToDelete.value = null;
    };
    
    const cancelDeletePortfolioItem = () => {
      showDeleteConfirmation.value = false;
      itemToDelete.value = null;
    };
    

    const handleEditFromPopup = () => {
      showVerificationPopup.value = false;
      toggleEditMode();
    };
    const saveProfile = async () => {

      if (!isOwner.value) {
        errorMessage.value = "You can only edit your own profile";
        console.error('Save attempt by non-owner');
        return;
      }
      

      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== route.params.uuid) {
        errorMessage.value = "Authentication error. Please refresh and try again.";
        console.error('Auth mismatch during save');
        return;
      }
      
      isSaving.value = true;
      errorMessage.value = "";
      successMessage.value = "";
      try {
        const cleanedContactMethods = {};
        for (const [method, data] of Object.entries(profile.contactMethods)) {
          cleanedContactMethods[method] = (data.enabled && data.value) ? data : { ...data, enabled: false, value: data.value || '' };
           if (method === 'other' && !cleanedContactMethods[method].enabled) {
             cleanedContactMethods[method].label = '';
           }
        }
        if (profile.preferredContactMethod && 
            (!cleanedContactMethods[profile.preferredContactMethod]?.enabled || 
             !cleanedContactMethods[profile.preferredContactMethod]?.value)) {
          profile.preferredContactMethod = '';
        }
        profile.contactMethods = cleanedContactMethods;

        const userDocRef = doc(db, 'users', route.params.uuid);
        await updateDoc(userDocRef, {
          'profile.name': profile.name,
          'profile.bio': profile.bio,
          'profile.mission': profile.mission,
          'profile.artFocus': profile.artFocus,
          'profile.artMedium': profile.artMedium,
          'profile.profilePictureURL': profile.profilePictureURL,
          'profile.profileBackgroundURL': profile.profileBackgroundURL,
          'profile.profilePictureZoom': profile.profilePictureZoom,
          'profile.profilePicturePosition': profile.profilePicturePosition,
          'profile.profileBackgroundZoom': profile.profileBackgroundZoom,
          'profile.profileBackgroundPosition': profile.profileBackgroundPosition,
          'profile.preferredContactMethod': profile.preferredContactMethod,

          'profile.contactMethods': profile.contactMethods,
          'profile.openToCommissions': profile.openToCommissions,
          'dashboard.portfolio': dashboard.portfolio.map(p => ({ // Ensure only intended fields are saved
            id: p.id,
            title: p.title,
            description: p.description,
            url: p.url,
            zoom: p.zoom || 1,
            position: p.position || { x: 50, y: 50 },

            year: p.year || '',
            medium: p.medium || '',
            dimensions: p.dimensions || ''
          }))
        });
        profileSaved.value = true;
        successMessage.value = "Profile saved successfully!";
        setTimeout(() => {
          successMessage.value = "";
          isEditMode.value = false; // Exit edit mode on successful save
          profileSaved.value = false;
        }, 2000);
      } catch (error) {
        console.error('Failed to save profile:', error);
        errorMessage.value = "Failed to save profile. Please try again.";
      } finally {
        isSaving.value = false;
      }
    };
    

    const draggedIndex = ref(null);
    
    const startDrag = (event, index) => { // This is for portfolio item reordering
      draggedIndex.value = index;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', index.toString()); // Use text/plain for simplicity
      }
    };
    
    const onDrop = (event, targetIndex) => {
      event.preventDefault();
      const originalIndex = draggedIndex.value; // Use the stored draggedIndex

      if (originalIndex !== null && originalIndex !== targetIndex) {
        const newPortfolio = [...dashboard.portfolio];
        const draggedItem = newPortfolio.splice(originalIndex, 1)[0];
        newPortfolio.splice(targetIndex, 0, draggedItem);
        dashboard.portfolio = newPortfolio;
        if (currentPortfolioIndex.value === originalIndex) {
          currentPortfolioIndex.value = targetIndex;
        } else if (originalIndex < currentPortfolioIndex.value && targetIndex >= currentPortfolioIndex.value) {
          currentPortfolioIndex.value--;
        } else if (originalIndex > currentPortfolioIndex.value && targetIndex <= currentPortfolioIndex.value) {
          currentPortfolioIndex.value++;
        }
      }
      draggedIndex.value = null;
    };
    
    const loadProfile = async () => {
      loading.value = true;
      try {
        const uuid = route.params.uuid;
        if (!uuid) {
          console.error('No UUID provided');
          router.push({ name: 'NotFound' }); // Or some other error page/redirect
          return;
        }
        
        const userDoc = await getDoc(doc(db, 'users', uuid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          Object.assign(profile, {
            name: userData.profile?.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            bio: userData.profile?.bio || '',
            mission: userData.profile?.mission || '',
            artFocus: Array.isArray(userData.profile?.artFocus) ? userData.profile.artFocus : [],
            artMedium: Array.isArray(userData.profile?.artMedium) ? userData.profile.artMedium : [],
            profilePictureURL: userData.profile?.profilePictureURL || '',
            profileBackgroundURL: userData.profile?.profileBackgroundURL || '',
            profilePictureZoom: userData.profile?.profilePictureZoom || 1,
            profileBackgroundZoom: userData.profile?.profileBackgroundZoom || 1,
            profilePicturePosition: userData.profile?.profilePicturePosition || { x: 50, y: 50 },
            profileBackgroundPosition: userData.profile?.profileBackgroundPosition || { x: 50, y: 50 },
            preferredContactMethod: userData.profile?.preferredContactMethod || 'email',
            contactMethods: userData.profile?.contactMethods || {
              email: { enabled: true, value: userData.email || "" }, // Default email from auth if available
              phone: { enabled: false, value: "" },
              instagram: { enabled: false, value: "" },
              twitter: { enabled: false, value: "" },
              tiktok: { enabled: false, value: "" },
              linkedin: { enabled: false, value: "" },
              facebook: { enabled: false, value: "" },
              cara: { enabled: false, value: "" },
              other: { enabled: false, value: "", label: "" }
            },
            openToCommissions: userData.profile?.openToCommissions || false
          });

          dashboard.portfolio = Array.isArray(userData.dashboard?.portfolio) ? userData.dashboard.portfolio : [];
          if (dashboard.portfolio.length > 0 && currentPortfolioIndex.value >= dashboard.portfolio.length) {
             currentPortfolioIndex.value = 0;
          }
          isVerified.value = userData.verified === true;
          console.log('Profile loaded - verification status:', isVerified.value);
          console.log('User verified field:', userData.verified);
          const currentUser = auth.currentUser;
          if (currentUser) {
            try {
              const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
              if (currentUserDoc.exists()) {
                isAdmin.value = currentUserDoc.data().role === 'admin';
                console.log('Current user is admin:', isAdmin.value);
              }
            } catch (e) {
              console.error('Error checking admin status:', e);
            }
          }
          if (!isVerified.value && !isOwner.value && !isAdmin.value) {
            console.log('Access denied: not verified, not owner, not admin');
            router.push({ name: 'SearchArtists' });
            return;
          }
        } else {
          console.error('Profile not found for UUID:', uuid);
          router.push({ name: 'NotFound' }); // Or some other error page
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        errorMessage.value = "Could not load profile data.";
      } finally {
        loading.value = false;
      }
    };
    

    const handleClickOutside = (event) => {
      const isDropdownButton = event.target.closest('.dropdown-button');
      if (isDropdownButton) return;

      const isWithinDropdownContent = event.target.closest('.dropdown-content');
      if (isWithinDropdownContent) return;
        
      dropdownFocusOpen.value = false;
      dropdownMediumOpen.value = false;
      contactDropdownOpen.value = false;
    };
    let authUnsubscribe = null;
    
    onMounted(() => {    

      authUnsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
        console.log('Route UUID:', route.params.uuid);
        

        isOwner.value = false;
        isAdmin.value = false;
        
        if (!route.params.uuid) {
          console.error('No UUID in route params');
          loading.value = false;
          return;
        }
        

        if (user && user.uid === route.params.uuid) { 
          isOwner.value = true;
          console.log('User is owner of this profile');
          

          await loadProfile();
          

          if (!isVerified.value && isOwner.value) {
            console.log('Showing verification popup for unverified owner');
            showVerificationPopup.value = true;
          }
        } else {
          console.log('User is not owner or not logged in');
          

          if (user) {
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                isAdmin.value = userDoc.data().role === 'admin';
                console.log('Current user admin status:', isAdmin.value);
              }
            } catch (e) {
              console.error('Error checking admin status:', e);
            }
          }
          

          await loadProfile(); 
        }
        
        loading.value = false;
      });
      

      document.addEventListener('click', handleClickOutside);
    });
    

    onUnmounted(() => {
      if (authUnsubscribe) {
        authUnsubscribe();
      }
      document.removeEventListener('click', handleClickOutside);
    });
    watch(() => route.params.uuid, async (newUuid) => {
      if (newUuid) {
        console.log('Route changed, checking profile:', newUuid);

        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === newUuid) {
          isOwner.value = true;

          await loadProfile();

          if (!isVerified.value) {
            console.log('Showing popup on route change for unverified user');
            showVerificationPopup.value = true;
          }
        } else {
          isOwner.value = false;

          if (currentUser) {
            try {
              const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
              if (userDoc.exists()) {
                isAdmin.value = userDoc.data().role === 'admin';
              }
            } catch (e) {
              console.error('Error checking admin status in watcher:', e);
            }
          }
          loadProfile();
        }
      }
    });
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      defaultBanner,
      defaultProfile,
      defaultPortfolioImage,
      loading,
      isVerified,
      isOwner,
      isAdmin,
      isEditMode,
      editMode: isEditMode, 
      isSaving,
      uploadingImage,
      uploadingBackground,
      uploadingPortfolioItemImage,
      successMessage,
      errorMessage,
      showVerificationPopup,
      profile,
      dashboard,
      currentPortfolioIndex,
      currentPortfolioItem,
      maxPortfolioItems,
      maxTagsCount,
      maxBioLength,
      maxMissionLength,
      bioCharsRemaining,
      missionCharsRemaining,

      hasEnabledContactMethods,
      toggleEditMode,
      nextPortfolioItem,
      prevPortfolioItem,
      setPortfolioIndex,
      goToSearch,
      goToGallery,
      saveProfile,
      predefinedFocusTags,
      predefinedMediumTags,
      dropdownFocusOpen,
      dropdownMediumOpen,
      searchFocusQuery,
      searchMediumQuery,
      searchContactQuery,
      toggleDropdownFocus,
      toggleDropdownMedium,
      handleTagClick,
      removeTag,
      toggleContactMethod,
      setPreferredContact,
      handleContactClick,
      contactDropdownOpen,
      showToast,
      toastMessage,

      showProfileImageEditor,
      showBackgroundImageEditor,
      showPortfolioImageEditor,
      showProfileImageResize,
      showBackgroundImageResize,
      showPortfolioImageResize,
      editingPortfolioItem,
      editingPortfolioIndex,
      handleProfileImageSave,
      handleBackgroundImageSave,
      handlePortfolioImageSave,
      editPortfolioImage,
      editNewPortfolioImage,
      editPortfolioImageById,
      profileImageZoom,       // For local profile editor modal
      backgroundImageZoom,    // For local background editor modal
      itemImageZoom,          // For local portfolio item editor modal
      profileImagePosition,   // For local profile editor modal
      backgroundImagePosition,// For local background editor modal
      itemImagePosition,      // For local portfolio item editor modal
      openProfileImageEditor,

      uploadProfileImage,
      uploadBackgroundImage,
      uploadPortfolioImage,
      saveProfileImageChanges,
      cancelProfileImageChanges,
      openBackgroundImageEditor,

      saveBackgroundImageChanges,
      cancelBackgroundImageChanges,
      selectedPortfolioItem,    // For local portfolio image editor
      openPortfolioImageEditor, // Added to return to be callable for the local portfolio image editor
      savePortfolioImageChanges,  // This was duplicated in original return, ensure correct one is used/renamed if different
      cancelPortfolioImageChanges, // This was duplicated

      handleImageWheel,
      startImageDrag,
      handleImageDrag,
      stopImageDrag,

      showNewItemForm,
      newPortfolioItem,
      isValidPortfolioItem,

      addPortfolioItem,
      editPortfolioItem, // For form fields of existing item
      portfolioEditData, // Data for form of existing item
      savePortfolioEdit,   // Saves form data + ImageUploadWithResize data for existing item
      cancelPortfolioEdit,
      addBlankPortfolioItem,
      deletePortfolioItem,
      showDeleteConfirmation,
      itemToDelete,
      confirmDeletePortfolioItem,
      cancelDeletePortfolioItem,

      startDrag,
      onDrop,
      handleEditFromPopup,
    };
  }
}
</script>

<style scoped>

.profile-page {
  background: white;
  min-height: 100vh;
  width: 85vw;
  margin: 0 auto;
}


.profile-navigation {
  position: absolute;
  top: 54px;
  left: 24px;
  z-index: 100;
}

.back-to-gallery-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  color: #374151;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  font-family: inherit;
}

.back-to-gallery-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #111827;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.12);
}

.back-to-gallery-btn svg {
  transition: transform 0.2s ease;
}

.back-to-gallery-btn:hover svg {
  transform: translateX(-2px);
}


.profile-hero-banner {
  width: 100%;
  height: 40vh;
  min-height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-bottom: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
}


.profile-content {
  padding: 3rem 4rem;
  max-width: none;
  width: 100%;
  margin: 0;
}

.profile-main {
  display: grid;
  grid-template-columns: 280px 1fr 300px;
  gap: 3rem;
  align-items: start;
  width: 100%;
}


.profile-left-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 20%;
}


.contact-methods-section {
  margin-top: -55px;
  margin-left: 73px;
  margin-bottom: 45px;
  width: 80%;
}

.preferred-contact-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.preferred-contact-legend .star-icon {
  flex-shrink: 0;
  margin-top: -3px !important;

}

.preferred-contact-legend-edit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: #666;
  background: #f9f9f9;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}


.contact-methods-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
  border: 1px solid #e5e5e5;
  border-radius: 2rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  position: relative;
}

.contact-link:hover {
  background: #f5f5f5;
  border-color: #d4d4d4;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-link.preferred {
  border-color: #FFB800;
  background: #FFFBF0;
}

.contact-link svg:first-child {
  flex-shrink: 0;
}

.contact-link .star-indicator {
  margin-left: 0.25rem;
  flex-shrink: 0;
}


.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.artist-name {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  color: #111827;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.unverified-badge {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background-color: #FEF3C7;
  color: #92400E;
  border: 1px solid #F59E0B;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.commission-badge {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, #8b92f8 0%, #6366f1 100%);
  color: white;
  border-radius: 20px;
  letter-spacing: 0.02em;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}


.commission-toggle-section {
  margin-bottom: 1rem;
}

.commission-tag-toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.commission-checkbox {
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
  cursor: pointer;

}

.commission-badge.edit-mode {
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
  opacity: 0.5;
  position: relative;
}

.commission-badge.edit-mode.active {
  opacity: 1;
}

.commission-badge.edit-mode.clickable {
  cursor: pointer;
}

.commission-tag-toggle:hover .commission-badge.edit-mode {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.profile-image-section.edit-mode {
  margin-bottom: 1.5rem;
}

.contact-edit-section.compact {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.contact-edit-section.compact h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

.contact-methods-dropdown {
  position: relative;
}


.contact-dropdown {
  background: #f9fafb;
  color: #374151;
  border-color: #e5e7eb;
}

.contact-dropdown:hover {
  background: #f3f4f6;
  color: #111827;
  border-color: #d1d5db;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.contact-dropdown-content {
  background: #f9fafb;
  border-color: #e5e7eb;
  margin-top: 4px;
  max-height: 320px;
}

.contact-method-item {
  padding: 0.25rem 0.75rem;
  transition: background-color 0.2s ease;
}

.contact-method-item:hover {
  background: #f3f4f6;
}

.contact-method-item:last-child {
  margin-bottom: 0;
}

.contact-method-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.contact-checkbox {
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #6366f1;
}


.commission-checkbox {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #6b7280;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  position: relative;
  margin-right: 8px;
  transition: all 0.2s ease;
}

.commission-checkbox:checked {
  background: white;
  border-color: #6b7280;
}

.commission-checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}


.commission-badge-editable {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.commission-badge-editable .commission-badge {
  
}

.contact-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex: 1;
  cursor: pointer;
  font-size: 0.75rem;
  color: #4b5563;
}

.contact-label svg {
  width: 14px;
  height: 14px;
}

.contact-label span {
  font-weight: 500;
}

.star-btn-enhanced {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #d1d5db;
  transition: color 0.2s ease;
  padding: 2px;
}

.star-btn-enhanced.active {
  color: #fbbf24;
}

.star-btn-enhanced:hover {
  color: #f59e0b;
}

.contact-input-wrapper {
  margin-top: 0.4rem;
  margin-left: 1.25rem;
}

.contact-input.compact {
  width: 100%;
  font-size: 0.875rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fafafa;
}

.contact-input.compact:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
}

.contact-input.compact.contact-label-input {
  margin-bottom: 0.3rem;
}

.artist-bio {
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  max-width: 700px;
}


.contact-section {
  margin-top: 1.5rem;
}


.contact-methods-display {
  margin-top: 1rem;
  width: 100%;
}


.social-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  box-shadow: 0px 0px 15px #00000027;
  padding: 15px 10px;
  border-radius: 5em;
  gap: 10px;
  max-width: fit-content;
  margin: 0 auto;
}

.social-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 5px;
  background-color: #fff;
  box-shadow: 0px 0px 4px #00000027;
  transition: 0.3s;
  text-decoration: none;
}

.social-button:hover {
  background-color: #f2f2f2;
  box-shadow: 0px 0px 6px 3px #00000027;
  transform: translateY(-2px);
}

.social-buttons svg {
  transition: 0.3s;
  height: 20px;
  width: 20px;
}

.social-button.email {
  background-color: #6366f1;
}

.social-button.email svg {
  fill: #f2f2f2;
}

.social-button.email:hover svg {
  fill: #6366f1;
}

.social-button.twitter {
  background-color: #1DA1F2;
}

.social-button.twitter svg {
  fill: #f2f2f2;
}

.social-button.twitter:hover svg {
  fill: #1DA1F2;
}

.social-button.facebook {
  background-color: #3b5998;
}

.social-button.facebook svg {
  fill: #f2f2f2;
}

.social-button.facebook:hover svg {
  fill: #3b5998;
}

.social-button.linkedin {
  background-color: #0077b5;
}

.social-button.linkedin svg {
  fill: #f2f2f2;
}

.social-button.linkedin:hover svg {
  fill: #0077b5;
}

.social-button.instagram {
  background-color: #c13584;
}

.social-button.instagram svg {
  fill: #f2f2f2;
}

.social-button.instagram:hover svg {
  fill: #c13584;
}

.social-button.tiktok {
  background-color: #000000;
}

.social-button.tiktok svg {
  fill: #f2f2f2;
}

.social-button.tiktok:hover svg {
  fill: #000000;
}

.social-button.cara {
  background-color: #00BFA5;
}

.social-button.cara svg {
  fill: #f2f2f2;
}

.social-button.cara:hover svg {
  fill: #00BFA5;
}

.social-button.phone {
  background-color: #22c55e;
}

.social-button.phone svg {
  fill: #f2f2f2;
}

.social-button.phone:hover svg {
  fill: #22c55e;
}

.social-button.other {
  background-color: #6b7280;
}

.social-button.other svg {
  fill: #f2f2f2;
}

.social-button.other:hover svg {
  fill: #6b7280;
}

.social-button.preferred {
  border: 3px solid #fbbf24;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.preferred-star {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #fbbf24;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.preferred-star svg {
  fill: white;
}

.social-button {
  position: relative;
}

.edit-actions {
  margin: 1rem 0;
}

.edit-profile-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.edit-profile-btn:hover {
  transform: translateY(-1px);
  background: #f0f9ff;
  color: #0ea5e9;
}


.artist-tags {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-self: start;
  justify-self: end;
  margin-top: 0.5rem;
}

.commission-indicator-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.commission-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: #6366f1;
  color: white;
  border: 1px solid #4f46e5;
}

.tag-group-main {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.expertise-tag {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  background: none;
  font-family: inherit;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.research-tag {
  background: #f1f5f9;
  color: #475569;
  border-color: #64748b;
}

.research-tag:hover {
  background: #e2e8f0;
  color: #334155;
  border-color: #475569;
  transform: translateY(-1px);
}

.art-tag {
  background: #f3f4ff;
  color: #6366f1;
  border-color: #a5b4fc;
}

.art-tag:hover {
  background: #e0e7ff;
  color: #4338ca;
  border-color: #818cf8;
  transform: translateY(-1px);
}


.profile-image-section {
  display: flex;
  justify-content: center;
  align-self: start;
}

.profile-image-container {
  width: 280px;
  height: 280px;
  border-radius: 20px;
  overflow: hidden;
  background: #f3f4f6;
  position: relative;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 6px solid white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}


.portfolio-section {
  padding: 4rem 4rem;
  max-width: none;
  width: 100%;
  margin: 0;
  border-top: 1px solid #e5e7eb;
}

.portfolio-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.portfolio-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: #111827;
  margin-bottom: -20px;
}

.artist-mission {
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
  max-width: 100%;

}

.mission-textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-height: 120px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease;
}
.portfolio-count {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}


.portfolio-showcase {
  width: 100%;
  max-width: none;
  margin: 0;
}

.portfolio-main-display {
  margin-bottom: 2rem;
}

.portfolio-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.portfolio-nav {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.portfolio-nav:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: scale(1.05);
}

.portfolio-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.portfolio-counter {
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  min-width: 60px;
  text-align: center;
}

.portfolio-limit-info, {
  margin-left: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.reorder {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: -15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.portfolio-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: start;
  width: 100%;
}


.portfolio-image-section {
  position: relative;
}

.portfolio-main-image {
  width: 90%;
  height: 500px;
  background-repeat: no-repeat;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  background-size: contain;
  background-position: center;
}

.portfolio-info-section {
  margin-left: -50px;
}


.portfolio-image-section.edit-mode {
  position: relative;
}

.portfolio-upload-container {
  width: 50%;
  height: 500px;
  margin: 0 auto;
}

.portfolio-upload-container .image-upload-container {
  height: 500px !important;
}

.image-upload-field {
  margin-top: 1rem;
}

.portfolio-main-title.editable {
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  background: transparent;
  border: 2px solid transparent;
  padding: 0.25rem 0.5rem;
  width: 100%;
  transition: border-color 0.2s ease;
  border-radius: 8px;
}

.portfolio-main-title.editable:hover,
.portfolio-main-title.editable:focus {
  border-color: #e5e7eb;
  outline: none;
}

.portfolio-main-title.editable.always-bordered {
  border-color: #e5e7eb;
}

.portfolio-description-textarea {
  width: 100%;
  min-height: 100px;
  background: transparent;
  border: 2px solid transparent;
  padding: 0.5rem;
  font-size: 1rem;
  color: #6b7280;
  resize: vertical;
  transition: border-color 0.2s ease;
  border-radius: 8px;
  font-family: inherit;
}

.portfolio-description-textarea:hover,
.portfolio-description-textarea:focus {
  border-color: #e5e7eb;
  outline: none;
}

.portfolio-description-textarea.always-bordered {
  border-color: #e5e7eb;
}

.edit-field-group {
  margin-bottom: 1.5rem;
}

.edit-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.portfolio-delete-btn.standalone {
  position: absolute;
  margin: -20px;
  top: 1rem;
  left: 1rem;
  scale: 1.33;
  z-index: 10;
}

.portfolio-details {
  position: sticky;
  top: 2rem;
}

.portfolio-main-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.portfolio-description {
  margin-bottom: 2rem;
}

.portfolio-description p {
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.portfolio-metadata {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.metadata-label {
  color: #6b7280;
  font-weight: 500;
}

.metadata-value {
  color: #111827;
  font-weight: 400;
}


.portfolio-thumbnails {
  margin-top: 2rem;
}

.thumbnails-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.portfolio-thumbnail {
  width: 100px;
  height: 90px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.portfolio-thumbnail:hover {
  opacity: 1;
  transform: scale(1.05);
}

.portfolio-thumbnail.active {
  border-color: #6366f1;
  opacity: 1;
}

.portfolio-thumbnail.add-thumbnail {
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  opacity: 1;
}

.portfolio-thumbnail.add-thumbnail:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
  transform: scale(1.05);
}


.portfolio-thumbnail-wrapper {
  position: relative;
  display: inline-block;
  cursor: grab;
}

.portfolio-thumbnail-wrapper:active {
  cursor: grabbing;
}

.portfolio-thumbnail-wrapper[draggable="true"] .portfolio-thumbnail {
  position: relative;
}

.drag-indicator {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 4px;
  padding: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.portfolio-thumbnail-wrapper:hover .drag-indicator {
  opacity: 1;
}

.portfolio-thumbnail-wrapper[draggable="true"]:hover {
  transform: scale(1.02);
}

.portfolio-thumbnail-wrapper[draggable="true"]:active {
  transform: scale(0.98);
  opacity: 0.8;
}

.empty-portfolio {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-portfolio-content {
  text-align: center;
  color: #9ca3af;
}

.empty-portfolio-content svg {
  margin: 0 auto 1rem;
  opacity: 0.5;
}

.empty-portfolio-content h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
}

.empty-portfolio-content p {
  font-size: 0.9rem;
  margin: 0;
}


.edit-mode {
  width: 100%;
}


.edit-header {
  padding: 2rem 4rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-title h1 {
  font-size: 2rem;
  font-weight: 300;
  color: #111827;
  margin: 0;
}

.edit-status {
  margin-top: 0.5rem;
}

.success-message {
  color: #059669;
  font-size: 0.9rem;
  font-weight: 500;
}

.error-message {
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 500;
}

.edit-actions-header {
  display: flex;
  gap: 1rem;
}

.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #f0fdf4;
  color: #22c55e;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.cancel-btn:hover {
  transform: translateY(-1px);
  background: #fef2f2;
  color: #ef4444;
}


.edit-controls {
  position: absolute;
  top: 60px;
  right: 20px;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.edit-control-btn {
  width: 40px;
  height: 40px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.edit-control-btn:hover {
  background: #f0f9ff;
  color: #0ea5e9;
  transform: translateY(-1px);
}


.profile-image-section.edit-mode .profile-image-container {
  position: relative;
}

.image-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-image-container:hover .image-edit-overlay {
  opacity: 1;
}

.image-edit-controls {
  display: flex;
  gap: 0.5rem;
}

.image-edit-btn {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.image-edit-btn:hover {
  background: #f0f9ff;
  color: #0ea5e9;
  transform: translateY(-1px);
}


.profile-info.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.name-edit-section,
.bio-edit-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name-edit-section label,
.bio-edit-section label,
.mission-edit-section label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.mission-edit-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: -30px 0px 40px 0px;
}

.char-count {
  font-weight: 400;
  color: #6b7280;
  font-size: 0.8rem;
}

.name-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.name-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.bio-textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-height: 120px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease;
}
.bio-textarea:focus,
.mission-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.contact-method-section {
  margin-bottom: 1.5rem;
}

.contact-method-section label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.contact-method-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.contact-method-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.contact-links-section {
  display: grid;
  gap: 1rem;
}

.contact-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.contact-input {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.contact-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}


.contact-method-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.contact-method-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.contact-method-header h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
}

.contact-toggle-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #6b7280;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.contact-toggle-btn:hover {
  color: #374151;
}

.contact-input-wrapper {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.artist-tags.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-self: start;
}

.tags-edit-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.tag-limit {
  font-weight: 400;
  color: #6b7280;
  font-size: 0.9rem;
}

.tag-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.remove-tag-btn:hover {
  opacity: 1;
}

.selected-in-edit {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
}

.tag-dropdown-container {
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


.disabled-item {
  opacity: 0.4;
  cursor: not-allowed !important;
  pointer-events: none;
}

.disabled-item .checkbox-label {
  color: #9ca3af !important;
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

.focus-dropdown .dropdown-item:hover {
  background: #e2e8f0;
}

.medium-dropdown .dropdown-item:hover {
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


.portfolio-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.add-portfolio-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-portfolio-btn:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
}

.add-portfolio-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.new-item-form {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 3rem;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.form-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-form-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-form-btn:hover {
  color: #374151;
}

.form-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-form-btn {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-form-btn:hover {
  background: #e5e7eb;
}


.image-upload-area {
  height: 200px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.upload-placeholder:hover {
  border-color: #6366f1;
  background: #f8faff;
  color: #6366f1;
}

.upload-placeholder span {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.image-preview {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.portfolio-edit-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.portfolio-edit-overlay > * {
  pointer-events: auto;
}

.portfolio-main-image.editable:hover .portfolio-edit-overlay {
  opacity: 1;
}

.hover-hint {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: nowrap;
}

.portfolio-edit-controls {
  display: flex;
  gap: 0.5rem;
}

.portfolio-edit-btn,
.portfolio-delete-btn {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.portfolio-edit-btn:hover {
  background: #f0f9ff;
  color: #0ea5e9;
  transform: translateY(-1px);
}

.portfolio-delete-btn:hover {
  background: #fef2f2;
  color: #ef4444;
  transform: translateY(-1px);
}


.portfolio-title-input,
.portfolio-description-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.portfolio-title-input:focus,
.portfolio-description-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.portfolio-title-input {
  font-weight: 600;
}

.portfolio-description-input {
  min-height: 80px;
  resize: vertical;
}

.add-first-piece-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.add-first-piece-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}


.image-editor-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.editor-container {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.editor-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-editor-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-editor-btn:hover {
  color: #374151;
}

.editor-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.image-preview-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
}

.image-preview-container {
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  position: relative;
  cursor: grab;
}

.image-preview-container:active {
  cursor: grabbing;
}

.background-preview {
  height: 200px;
}

.image-edit-hints {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1.5rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview-container:hover .image-edit-hints {
  opacity: 1;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.85rem;
  white-space: nowrap;
}

.hint-item svg {
  opacity: 0.9;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.zoom-slider,
.position-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
  cursor: pointer;
}

.zoom-slider::-webkit-slider-thumb,
.position-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
}

.zoom-slider::-moz-range-thumb,
.position-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
}

.save-editor-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.save-editor-btn:hover {
  transform: translateY(-1px);
  background: #f0fdf4;
  color: #22c55e;
}

.cancel-editor-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.cancel-editor-btn:hover {
  transform: translateY(-1px);
  background: #fef2f2;
  color: #ef4444;
}


.image-preview-container {
  position: relative;
  cursor: grab;
  user-select: none;
}

.image-preview-container:active {
  cursor: grabbing;
}

.crop-preview-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 12px;
  overflow: hidden;
  z-index: 1;
}

.crop-preview-frame {
  position: absolute;
  border: 2px solid #6366f1;
  border-radius: 8px;
  background: transparent;
  box-shadow: 
    0 0 0 1000px rgba(0, 0, 0, 0.3),
    inset 0 0 0 2px rgba(255, 255, 255, 0.5);
}


.crop-preview-overlay:not(.background-crop) .crop-preview-frame {
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}


.background-crop .crop-preview-frame {
  width: 80%;
  height: 60%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.image-preview-container::before {
  content: 'Scroll to zoom • Drag to position';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.image-preview-container:hover::before {
  opacity: 1;
}


.delete-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.delete-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.delete-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.delete-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.delete-content {
  padding: 1.5rem 2rem;
}

.delete-content p {
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

.delete-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
}

.confirm-delete-btn {
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-delete-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.cancel-delete-btn {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-delete-btn:hover {
  background: #e5e7eb;
}


@media (max-width: 768px) {
  .profile-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .profile-image-container {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
  
  .portfolio-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .portfolio-main-image {
    height: 300px;
  }
  
  .portfolio-details {
    position: static;
  }
  
  .fullscreen-content {
    grid-template-columns: 1fr;
    height: 90%;
  }
  
  .fullscreen-info {
    max-height: 40vh;
    overflow-y: auto;
  }
  
  .fullscreen-navigation {
    padding: 0 1rem;
  }
  
  .fullscreen-nav {
    width: 48px;
    height: 48px;
  }
  
  
  .edit-header {
    padding: 1.5rem 2rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .edit-actions-header {
    flex-direction: column;
  }
  
  .profile-content {
    padding: 2rem 1.5rem;
  }
  
  .portfolio-section.edit-mode {
    padding: 3rem 1.5rem;
  }
  
  .form-content {
    grid-template-columns: 1fr;
  }
  
  .editor-content {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
  
  .image-preview-container {
    height: 200px;
  }
  
  .artist-tags.edit-mode {
    align-self: stretch;
  }
}


.image-upload-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.upload-modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.upload-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.upload-modal-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-modal-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  transform: translateY(-1px);
  background: #fef2f2;
  color: #ef4444;
}

.upload-modal-content {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

.upload-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.close-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.close-upload-btn:hover {
  transform: translateY(-1px);
  background: #f0f9ff;
  color: #0ea5e9;
}


.edit-mode-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
}


.portfolio-grid-section {
  margin-top: 2rem;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.portfolio-item-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.portfolio-item-card.admin-mode {
  transition: all 0.3s ease;
}

.portfolio-item-card.admin-mode:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
.portfolio-thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.portfolio-item-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.portfolio-thumbnail:hover .portfolio-item-actions {
  opacity: 1;
}

.portfolio-item-actions .action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.portfolio-item-actions .action-btn:hover {
  transform: translateY(-1px);
}

.portfolio-item-actions .edit-action:hover {
  background: #f0f9ff;
  color: #0ea5e9;
}

.portfolio-item-actions .delete-action:hover {
  background: #fef2f2;
  color: #ef4444;
}

.portfolio-item-info {
  padding: 1.5rem;
}

.portfolio-item-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

.portfolio-item-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.portfolio-add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  min-height: 280px;
  transition: all 0.2s ease;
}

.portfolio-add-card:hover {
  border-color: #9ca3af;
  background: #f3f4f6;
}

.add-item-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-item-btn:hover {
  background: #d1d5db;
  color: #374151;
  transform: scale(1.05);
}

.add-item-btn svg {
  transition: transform 0.2s ease;
}

.add-item-btn:hover svg {
  transform: rotate(90deg);
}


.portfolio-grid-section ~ .portfolio-showcase,
.portfolio-grid-section ~ .empty-portfolio {
  display: none;
}


.portfolio-edit-form {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.portfolio-edit-image {
  margin-bottom: 1.5rem;
}

.portfolio-edit-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-field label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.edit-input, .edit-textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background: white;
  font-family: inherit;
}

.edit-input:focus, .edit-textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.edit-textarea {
  resize: vertical;
  min-height: 80px;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.edit-actions .save-btn,
.edit-actions .cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}


.portfolio-thumbnail-wrapper.add-new {
  flex-shrink: 0;
}

.add-thumbnail {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: #f8fafc !important;
  border: 2px dashed #d1d5db !important;
  color: #6b7280;
  transition: all 0.2s ease;
}

.add-thumbnail:hover {
  background: #f3f4f6 !important;
  border-color: #9ca3af !important;
  color: #374151;
  transform: scale(1.05);
}

.add-thumbnail svg {
  transition: transform 0.2s ease;
}

.add-thumbnail:hover svg {
  transform: rotate(90deg);
}


.portfolio-header-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: flex-end;
}

.portfolio-header-actions .action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.portfolio-header-actions .action-btn:hover {
  transform: translateY(-1px);
}

.portfolio-header-actions .edit-action:hover {
  background: #f0f9ff;
  color: #0ea5e9;
}

.portfolio-header-actions .delete-action:hover {
  background: #fef2f2;
  color: #ef4444;
}


.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  z-index: 1000;
}

.toast-icon {
  flex-shrink: 0;
}


.unverified-notice-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 4rem 2rem;
}

.unverified-notice {
  max-width: 600px;
  text-align: center;
  background: #f8fafc;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.notice-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #6567BE;
}

.notice-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.notice-message {
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.notice-features {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.notice-features h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
}

.notice-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.notice-features li {
  padding: 0.5rem 0;
  padding-left: 1.75rem;
  position: relative;
  color: #64748b;
}

.notice-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 600;
}

.edit-profile-btn-large {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #6567BE;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(101, 103, 190, 0.3);
}

.edit-profile-btn-large:hover {
  background: #5254a3;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(101, 103, 190, 0.4);
}

.toast-icon {
  flex-shrink: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}


.portfolio-image-preview {
  width: 90%;
  height: 300px;
  max-width: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  margin: 0 auto;
}

.edit-portfolio-image-btn,
.upload-new-portfolio-btn {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.edit-portfolio-image-btn:hover,
.upload-new-portfolio-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-1px);
}

.upload-new-portfolio-btn {
  flex-direction: column;
  padding: 40px;
  background: #f3f4f6;
  color: #666;
  width: 90%;
  height: 300px;
  max-width: 400px;
  border: 2px dashed #ddd;
  margin: 0 auto;
}

.upload-new-portfolio-btn:hover {
  background: #e5e7eb;
  border-color: #6567BE;
  color: #6567BE;
}

.new-portfolio-image-container {
  width: 100%;
}

.portfolio-upload-container {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
}


.security-error {
  text-align: center;
  padding: 100px 20px;
  color: #666;
}

.security-error h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

.security-error .back-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #6567BE;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.security-error .back-btn:hover {
  background: rgba(101, 103, 190, 0.8);
  transform: translateY(-1px);
}

</style>