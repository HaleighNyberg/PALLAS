<template>
  <div class="faq-container">
    <div class="header-section">
      <div class="text-section">
        <h1 class="faq-title">Frequently Asked Questions</h1>
        <p class="faq-par">
          Scientists and artists can explore PALLAS's recommended best practices for art-science collaborations by reviewing our comments and answers to frequently asked questions about the process.
        </p>
      </div>
    </div>

    <div class="search-controls-section">
      <div class="search-container">
        <div class="search-box">
          <div class="search-filter-container">
            <button class="search__button filter-in-search" @click.prevent="toggleSortDropdown" title="Sort Options">
              <div class="search__icon">
                <svg viewBox="0 0 512 512" height="16" width="16">
                  <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" fill="rgb(77, 77, 77)"/>
                </svg>
              </div>
            </button>
            <div v-if="showSortDropdown" class="sort-dropdown search-sort-dropdown">
              <div class="filter-section">
                <div class="filter-header">Category</div>
                <div class="filter-option" @click.stop="toggleFilter('artist')">
                  <input
                    type="checkbox"
                    :checked="activeFilters.artist"
                    class="filter-checkbox"
                    tabindex="-1"
                  />
                  <span class="checkbox-label">Artists</span>
                </div>
                <div class="filter-option" @click.stop="toggleFilter('scientist')">
                  <input
                    type="checkbox"
                    :checked="activeFilters.scientist"
                    class="filter-checkbox"
                    tabindex="-1"
                  />
                  <span class="checkbox-label">Scientists</span>
                </div>
              </div>
            </div>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search FAQ..."
            class="search-input"
          />
          <button class="search__clear" type="button" @click="clearSearch"
            aria-label="Clear search">
            ✕
          </button>
        </div>

        <div class="submit-container">
          <button @click="showSubmitModal = true" class="submit-question-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            Submit a Question
          </button>
        </div>
      </div>
    </div>

    <div class="faq-content">
      <div class="faq-grid">
        <div
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          class="faq-card"
          :class="{ expanded: faq.isOpen }"
        >
          <button
            class="faq-header"
            @click="toggleFaq(faq)"
            :aria-expanded="faq.isOpen"
          >
            <div class="question-content">
              <span class="category-tag" :class="faq.category === 'scientist' ? 'scientist-tag' : 'artist-tag'">
                {{ faq.category === 'scientist' ? 'Scientists' : 'Artists' }}
              </span>
              <h3 class="question-text">{{ faq.question }}</h3>
            </div>
            <div class="expand-icon" :class="{ rotated: faq.isOpen }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </button>

          <div class="faq-body" v-show="faq.isOpen">
            <div class="answer-content">
              <h4 v-if="faq.title !== faq.question"
                  :class="['answer-title', faq.category === 'scientist' ? 'scientist-title' : 'artist-title']">
                {{ faq.title }}
              </h4>
              <div class="answer-text" v-html="faq.description"></div>
              <p v-if="faq.source" class="answer-source">
                <em>Source: {{ faq.source }}</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSubmitModal" class="modal-overlay" @click="closeSubmitModal">
      <div class="form" @click.stop>
        <button @click="closeSubmitModal" class="close-button">&times;</button>
        <p class="title">Submit a Question</p>
        <p class="message">Have a question about art-science collaborations? We'd love to hear from you!</p>

        <form @submit.prevent="submitQuestion" class="flex flex-column">
          <div class="user-type-group">
            <label class="radio-option scientist-option">
              <input type="radio" value="scientist" v-model="submitForm.userType" name="userType">
              <span class="radio-custom"></span>
              Scientist
            </label>
            <label class="radio-option artist-option">
              <input type="radio" value="artist" v-model="submitForm.userType" name="userType">
              <span class="radio-custom"></span>
              Artist
            </label>
            <label class="radio-option both-option">
              <input type="radio" value="both" v-model="submitForm.userType" name="userType">
              <span class="radio-custom"></span>
              Both
            </label>
          </div>

          <label>
            <input
              class="input"
              type="email"
              v-model="submitForm.email"
              placeholder=""
            />
            <span>Email (Optional)</span>
          </label>

          <label>
            <textarea
              class="input textarea"
              v-model="submitForm.question"
              placeholder=""
              rows="4"
              required
            ></textarea>
            <span>Your Question</span>
          </label>

          <button class="submit" type="submit" :disabled="!submitForm.question.trim()">
            Submit Question
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BestPractices',
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  data() {
    return {
      searchQuery: '',
      showSortDropdown: false,
      showSubmitModal: false,
      activeFilters: {
        artist: false,
        scientist: false
      },
      submitForm: {
        userType: '',
        email: '',
        question: ''
      },
      faqs: [
        {
          category: 'artist',
          question: 'What are the benefits to using PALLAS?',
          title: 'Benefits of PALLAS',
          description: 'The main function of PALLAS is to facilitate connections between scientists and artists interested in science communication. We offer connections to a network of 100+ scientists across astrobiology, earth science, and the physical sciences.',
          source: '',
          isOpen: false,
        },
        {
          category: 'artist',
          question: 'What is PALLAS doing to protect artists from AI?',
          title: 'AI Protection',
          description: 'We provide each artist with a page to display selected artwork. Before uploading artwork, we suggest artists run their artwork through Glaze, a software developed by UChicago (<a href="https://glaze.cs.uchicago.edu/" target="_blank">https://glaze.cs.uchicago.edu/</a>) to disrupt AI art generators\' ability to mimic your art. (Please note that Glaze is not a total solution to this problem, since it is not equally effective for all art styles). We also invite artists to watermark their work in any way they see fit.',
          source: '',
          isOpen: false,
        },
        {
          category: 'artist',
          question: "I don't have a lot of experience in science, how can I translate the work accurately into visual form?",
          title: 'Translating Science to Art',
          description: 'If you are an artist transitioning to scientific illustration or a science illustrator exploring a new field, you may be unfamiliar with the technical aspects a scientist may want to communicate. We recommend scientists bring a layman description of the project along with a sketch of their idea. Artists can then take the lead to propose iterations that work with the time and budget. We also encourage that scientists integrate artists throughout the process and especially from the start of the process if possible (e.g., consult an artist from the beginning stages of idea conception and manuscript/proposal writing).',
          source: '',
          isOpen: false,
        },
        {
          category: 'artist',
          question: 'How do I make sure I get paid?',
          title: 'Payment Security',
          description: 'As a disclaimer, PALLAS is not involved with the transaction process between scientists and artists and as such is not responsible for requiring, moderating, or enforcing payment; hosting any payment services; providing discounts; settling disputes, etc. Payment is entirely as agreed upon between the scientist and artist.<br><br>Artists - we recommend: a) specifying all rates, payment, and deadlines clearly in the first message to a scientist/client in order to have a written agreement on deliverables and payment; and b) asking for some percentage of payment upfront (often 25-50%). We especially encourage you to seek payment upfront if the client\'s account is new or missing some information. Always follow your gut for your own safety.',
          source: '',
          isOpen: false,
        },
        {
          category: 'artist',
          question: 'How is PALLAS screening artists/moderating scientists?',
          title: 'Screening Process',
          description: 'We review every application individually to check and ensure that each account is created by the individual intended. This also allows us to ensure that the profile is created by an actual scientist or artist, and not by spam or bot accounts. We filter each profile by account type (scientist, artist, etc.) to streamline the search process and avoid irrelevant searches.',
          source: '',
          isOpen: false,
        },
        {
          category: 'artist',
          question: 'What are the restrictions for PALLAS artists around using stock libraries, AI?',
          title: 'Stock Resources & AI Restrictions',
          description: 'PALLAS places no restrictions on our artists\' medium or methods besides a good faith assumption that there is no use of generative AI (ChatGPT, DALL-E) with the intent to take credit for the generated image. However, stock image and asset libraries may place their own restrictions on usage, and publishing venues may place additional restrictions on artwork that we recommend referring to as you collaborate.',
          source: '',
          isOpen: false,
        },
        {
          category: 'artist',
          question: 'How do I negotiate and set rates for my scientific illustration work?',
          title: 'Setting Your Rates',
          description: 'Setting rates can be challenging for artists new to scientific illustration. Consider factors like:<br>• Project complexity and technical requirements<br>• Time investment (research, revisions, meetings)<br>• Usage rights (publication, presentations, web)<br>• Your experience level and portfolio<br>• Market rates in your region<br><br>We recommend researching standard rates in scientific illustration, joining professional organizations for guidance, and being transparent about your pricing structure upfront.',
          source: '',
          isOpen: false,
        },
        {
          category: 'artist',
          question: 'What should I include in my PALLAS portfolio?',
          title: 'Portfolio Guidelines',
          description: 'Your portfolio should showcase:<br>• Diverse examples of your work (different styles, subjects)<br>• Any science-related illustrations you\'ve created<br>• Technical accuracy demonstrations<br>• Process work (sketches to final pieces)<br>• Clear descriptions of each piece<br>• Your artistic range and specialties<br><br>Quality over quantity - 5-10 strong pieces are better than 20 mediocre ones.',
          source: '',
          isOpen: false,
        },
        {
          category: 'scientist',
          question: 'Why hire an artist?',
          title: 'Benefits of Hiring Artists',
          description: 'Science communication encompasses a variety of media and display items, including but not limited to visual communication (renderings, schematics, technical diagrams, concept illustrations, infographics, and improvements on graphical figure design). This media may be tailored to a range of audiences, again including but not limited to outreach, teaching, conference presentations, public media coverage, or funding proposals. Understanding different media and audiences takes skill that scientists may not have extensive training in, or have the time to invest in for every paper or presentation - just like collaborating with other scientists with different expertise.',
          source: '',
          isOpen: false,
        },
        {
          category: 'scientist',
          question: 'Why should I hire an artist instead of using Generative AI?',
          title: 'Artists vs. AI',
          description: 'Many high impact journals like Nature and Science, as well as several publishers like Elsevier, have policies banning the use of AI-generated images without clear labeling, on grounds of copyright infringement, accuracy concerns, and reproducibility, while others strongly caution against such usage. Using AI-generated images, especially without proper disclosure, can compromise scientific integrity and may lead to publication rejection or retraction.<br><br>Artists bring human creativity, scientific understanding, and the ability to iterate based on your specific needs. They ensure accuracy, originality, and compliance with publication standards while creating custom visuals that truly represent your research.',
          source: '',
          isOpen: false,
        },
        {
          category: 'scientist',
          question: 'How do I fund an artist?',
          title: 'Funding Artist Collaborations',
          description: 'Many grants now recognize the importance of science communication and allow budgeting for:<br>• Broader Impacts activities<br>• Outreach and education materials<br>• Publication and dissemination costs<br>• Science communication personnel<br><br>Check your grant guidelines or speak with your program officer about including artist collaboration costs. Some institutions also have internal funding for science communication initiatives.',
          source: '',
          isOpen: false,
        },
        {
          category: 'scientist',
          question: 'How do I find an artist on PALLAS?',
          title: 'Finding the Right Artist',
          description: 'Use our search and filter features to find artists by:<br>• Art medium (digital, traditional, 3D, etc.)<br>• Subject expertise<br>• Style preferences<br>• Availability for commissions<br><br>Review portfolios, check artist statements, and reach out directly through the platform. You can also post project opportunities in our community forums.',
          source: '',
          isOpen: false,
        },
        {
          category: 'scientist',
          question: "I'm not good at sketching—how can I communicate my ideas?",
          title: 'Communicating Visual Ideas',
          description: 'You don\'t need to be an artist! Here are effective ways to communicate your vision:<br>• Create simple diagrams or flowcharts<br>• Use reference images from papers or online<br>• Write detailed descriptions of what you envision<br>• Share the key scientific concepts to convey<br>• Provide examples of styles you like<br><br>Artists are skilled at interpreting scientific concepts and will work with you to develop the visuals.',
          source: '',
          isOpen: false,
        },
        {
          category: 'scientist',
          question: 'Does PALLAS provide contracts or handle payments?',
          title: 'Contracts and Payments',
          description: 'PALLAS facilitates connections but does not provide contracts or handle payments. We recommend:<br>• Discussing all terms in writing (email is fine)<br>• Clarifying deliverables, timeline, and payment<br>• Agreeing on revision rounds<br>• Defining usage rights<br>• Using your institution\'s procurement process if applicable<br><br>Many universities have standard contracts for creative services that you can adapt.',
          source: '',
          isOpen: false,
        },
        {
          category: 'scientist',
          question: 'What information should I provide to an artist?',
          title: 'Project Brief Essentials',
          description: 'A good project brief includes:<br>• Project overview and scientific context<br>• Target audience (peers, public, students)<br>• Intended use (publication, presentation, web)<br>• Technical requirements (size, format, resolution)<br>• Key elements that must be included<br>• Timeline and budget<br>• Examples or style preferences<br>• Number of revision rounds expected',
          source: '',
          isOpen: false,
        },
        {
          category: 'scientist',
          question: 'How far in advance should I contact an artist?',
          title: 'Timeline Planning',
          description: 'Plan ahead! Quality scientific illustration takes time:<br>• Simple diagrams: 1-2 weeks<br>• Complex illustrations: 3-6 weeks<br>• Large projects: 2-3 months<br><br>Factor in time for:<br>• Initial discussions and quotes<br>• Artist research and concept development<br>• Revision rounds<br>• Final formatting<br>• Institutional approval processes<br><br>Contact artists as early as possible, ideally when writing grants or planning publications.',
          source: '',
          isOpen: false,
        },
      ],
    };
  },
  computed: {
    filteredFaqs() {
      let filtered = [...this.faqs];

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.title.toLowerCase().includes(query) ||
          faq.description.toLowerCase().includes(query)
        );
      }

      const hasActiveFilters = this.activeFilters.artist || this.activeFilters.scientist;

      if (hasActiveFilters) {
        filtered = filtered.filter(faq => {
          if (this.activeFilters.artist && faq.category === 'artist') return true;
          if (this.activeFilters.scientist && faq.category === 'scientist') return true;
          return false;
        });
      }

      if (this.activeFilters.artist && this.activeFilters.scientist) {
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
      } else {
        filtered.sort((a, b) => {
          if (a.category !== b.category) {
            return a.category === 'scientist' ? -1 : 1;
          }
          return a.question.localeCompare(b.question);
        });
      }

      return filtered;
    }
  },
  methods: {
    toggleFaq(faq) {
      faq.isOpen = !faq.isOpen;
    },
    toggleSortDropdown() {
      this.showSortDropdown = !this.showSortDropdown;
    },
    toggleFilter(filterName) {
      this.activeFilters[filterName] = !this.activeFilters[filterName];
    },
    clearSearch() {
      this.searchQuery = '';
    },
    handleClickOutside(event) {
      const isDropdownButton = event.target.closest('.search__button.filter-in-search');
      if (isDropdownButton) {
        return;
      }

      const isDropdownContent = event.target.closest('.search-sort-dropdown');
      if (isDropdownContent) {
        return;
      }

      this.showSortDropdown = false;
    },
    closeSubmitModal() {
      this.showSubmitModal = false;
      this.resetForm();
    },
    resetForm() {
      this.submitForm = {
        userType: '',
        email: '',
        question: ''
      };
    },
    async submitQuestion() {
      try {
        console.log('Submitting question:', this.submitForm);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Thank you for your question! We\'ll review it and potentially add it to our FAQ.');
        this.closeSubmitModal();
      } catch (error) {
        console.error('Error submitting question:', error);
        alert('Sorry, there was an error submitting your question. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 80vh;
}

.header-section {
  text-align: center;
}

.text-section {
  margin: 0 auto;
}

.faq-title {
  margin-top: 100px;
  font-size: 4.0vw;
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.faq-par {
  margin-top: -40px;
  font-size: 1.45em;
  color: #6b7280;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.search-controls-section {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  margin-top: 50px;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 800px;
  width: 100%;
  justify-content: space-between;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.submit-container {
  flex-shrink: 0;
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
  position: relative;
  top: 36px;
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

.filter-section {
  padding: 12px 0;
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
  right: 30px;
  top: calc(50% + 11px);
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

.submit-question-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #6567BE;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(101, 103, 190, 0.2);
  position: relative;
  top: 11px;
}

.submit-question-btn:hover {
  background: #7577c4;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(101, 103, 190, 0.3);
}

.faq-content {
  margin-top: 2rem;
}

.faq-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  min-height: 400px;
}

.faq-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  width: 100%;
  min-width: 0;
}

.faq-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.faq-card.expanded {
  box-shadow: 0 8px 25px rgba(101, 103, 190, 0.15);
}

.faq-header {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  text-align: left;
}

.faq-header:hover {
  background: #f8fafc;
}

.question-content {
  flex: 1;
  margin-right: 1rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.category-tag.scientist-tag {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #64748b;
}

.category-tag.artist-tag {
  background: #f3f4ff;
  color: #6366f1;
  border: 1px solid #a5b4fc;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  color: #1f2937;
}

.expand-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
  color: #6b7280;
  flex-shrink: 0;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.expand-icon svg {
  width: 100%;
  height: 100%;
}

.faq-body {
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
}

.answer-content {
  padding: 1.5rem;
}

.answer-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.scientist-title {
  color: #475569;
}

.artist-title {
  color: #6366f1;
}

.answer-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
}

.answer-text a {
  color: var(--color-secondary);
  text-decoration: underline;
}

.answer-text a:hover {
  color: var(--color-primary);
}

.answer-source {
  margin-top: 1rem;
  margin-bottom: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .faq-container {
    padding: 1rem 0.75rem;
  }

  .faq-title {
    font-size: 6vw;
  }

  .faq-par {
    font-size: 1.2em;
  }

  .search-container {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-controls-section {
    margin-top: 30px;
  }

  .search-box {
    max-width: 100%;
  }

  .submit-container {
    align-self: center;
  }

  .faq-grid {
    min-height: 300px;
    max-width: 100%;
  }

  .faq-header {
    padding: 1.25rem;
  }

  .question-text {
    font-size: 1rem;
  }

  .answer-content {
    padding: 1.25rem;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .modal-header,
  .modal-body {
    padding: 1rem 1.5rem;
  }

  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-actions {
    flex-direction: column;
  }
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
  padding: 20px;
  border-radius: 20px;
  position: relative;
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
}

.title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: #6567BE;
}

.title::before {
  width: 18px;
  height: 18px;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: #6567BE;
}

.message {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.7);
}

.flex {
  display: flex;
  width: 100%;
  gap: 6px;
}

.flex-column {
  flex-direction: column;
}

.form label {
  position: relative;
}

.form label .input {
  background-color: #333;
  color: #fff;
  width: 100%;
  padding: 20px 05px 05px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
}

.form label .input + span {
  color: rgba(255, 255, 255, 0.5);
  position: absolute;
  left: 10px;
  top: 0px;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown + span {
  top: 12.5px;
  font-size: 1.1em;
}

.form label .input:focus + span,
.form label .input:valid + span {
  color: #6567BE;
  top: 0px;
  font-size: 0.7em;
  font-weight: 600;
}

.input {
  font-size: 16px;
}

.textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.submit {
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #6567BE;
  cursor: pointer;
  margin-top: 10px;
}

.submit:hover:not(:disabled) {
  background-color: rgba(101, 103, 190, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(101, 103, 190, 0.3);
}

.submit:disabled {
  background-color: rgba(150, 150, 150, 0.3) !important;
  color: rgba(255, 255, 255, 0.5) !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #6567BE;
}

.user-type-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(105, 105, 105, 0.397);
  background-color: #333;
  color: #fff;
  transition: all 0.2s ease;
  flex: 1;
  font-size: 0.8rem;
}

.radio-option input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  position: relative;
  transition: all 0.2s ease;
}

.radio-option:hover {
  border-color: #6567BE;
  background-color: rgba(101, 103, 190, 0.1);
}

.radio-option input:checked + .radio-custom {
  border-color: #6567BE;
  background: #6567BE;
}

.radio-option input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
}

@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }

  to {
    transform: scale(1.8);
    opacity: 0;
  }
}

.faq-body {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>