<template>
  <div class="about-us-container">
    <div class="header-container">
      <div class="watermark">
        <svg viewBox="0 0 200.1 103.46" xmlns="http://www.w3.org/2000/svg" class="loader">
          <g id="Layer_5">
            <path
              class="cls-1"
              d="m198.96,49.05c-.34-.39-.74-.75-1.18-1.03-1.51-.94-3.52-1.06-5.14-.8,1.52-.4,2.36-.93,3.02-1.23,2.16-.98,3.28-3.43,2.38-5.63-2.18-5.29-5.37-9.58-10.18-13.69-1.99-1.7-4.52-2.67-7.14-2.68-2.78-.02-5.41-.18-7.34.76,3.23-1.81,3.19-6.11-.34-8.25-5.67-3.27-8.7-4.86-15.39-7.13-3.58-1.22-7.5-1.05-10.95.51-1.57.72-3.56,1.58-4.14,2.07.42-.35.79-1.38,1.07-2.54.55-2.3-.66-4.06-2.83-4.68-9.99-2.86-22.76-3.88-34.37-4.22-1.37-.04-2.67.59-3.51,1.67-.12.15-.24.31-.35.47-1.3,1.75-1.97,6.04-1.97,6.04,0,0-.73-4.29-2.03-6.04-.12-.16-.23-.31-.35-.47-.83-1.09-2.14-1.71-3.51-1.67-11.62.34-24.38,1.36-34.37,4.22-2.17.62-3.38,2.39-2.83,4.68.28,1.16.65,2.19,1.07,2.54-.58-.48-2.57-1.35-4.14-2.07-3.45-1.57-7.37-1.73-10.95-.51-6.7,2.28-9.73,3.86-15.39,7.13-3.53,2.14-3.57,6.43-.34,8.25-1.92-.95-4.56-.78-7.34-.76-2.62.02-5.15.98-7.14,2.68-4.81,4.11-8,8.4-10.18,13.69-.91,2.2.21,4.65,2.38,5.63.66.3,1.5.83,3.02,1.23-1.63-.26-3.64-.14-5.14.8-.45.28-.84.64-1.18,1.03-1.3,1.49-1.78,3.51-1.6,5.48.51,5.61,3.02,11.81,7.17,16.97,1.71,2.13,3.9,3.45,6.62,3.19,1.07-.1,3.93-1.21,4.98-1.82-1.6.86-1.84,1.05-2.44,2.06-1.32,2.23-.74,5.33,1.35,6.86,6.95,5.08,17.4,10.52,29.2,14.18,1.35.42,2.79.47,4.18.17.97-.21,2.21-.79,2.61-1.16.58-.35,1.17-.69,1.75-1.03.69-.41,1.5-1.08,2.26-1.3-.68.78-1.58,1.22-2.06,2.23-.85,1.75.07,3.67,1.93,4.14,11.4,2.92,26.17,4.92,41.76,4.92h1.44c15.58,0,30.36-2.01,41.76-4.92,1.86-.48,2.78-2.39,1.93-4.14-.49-1.01-1.38-1.44-2.06-2.23.76.22,1.57.89,2.26,1.3.58.34,1.17.68,1.75,1.03.4.38,1.64.95,2.61,1.16,1.38.3,2.82.25,4.18-.17,11.79-3.65,22.25-9.09,29.2-14.18,2.09-1.53,2.68-4.63,1.35-6.86-.6-1.01-.85-1.2-2.44-2.06,1.05.61,3.91,1.71,4.98,1.82,2.72.26,4.91-1.07,6.62-3.19,4.15-5.16,6.65-11.37,7.17-16.97.18-1.97-.3-3.99-1.6-5.48Zm-23.66-20.2c3.58-.55,7.29,0,9.89,2.53,2.33,2.27,4.28,4.64,5.84,7.1,1.54,2.45.08,5.7-2.8,6.04-11.97,1.42-23.99,4.52-34.98,9.55-1.32.61-3.13.21-4.03-.94-1.39-1.79-3.04-3.63-5.08-5.22-1.26-.98-1.11-2.73.06-3.81,9.26-8.58,22.15-13.87,31.1-15.24Zm-48.39,31.91c2.84-4.77,6.45-7.72,10.16-10.99.96-.85,2.71-1.26,3.78-.54,2.36,1.58,4.92,4.25,5.55,5.43.63,1.18.51,2.59-.65,3.25-4.59,2.6-9.06,5.43-13.07,8.8-.73.61-1.68.45-2.21-.34-.81-1.23-1.89-2.39-3.2-3.46-.64-.53-.79-1.45-.36-2.17Zm-1.3-2.17c-.82,1.32-2.44,1.65-3.85.99-1.47-.69-3.07-1.31-4.78-1.85-1.22-.38-1.84-1.56-1.4-2.75,1.56-4.19,3.38-8.4,5.79-11.1.87-.98,2.91-1.93,4.21-1.75,2.5.34,6.89,2.28,7.45,2.68,1.78,1.27,1.64,3.29.43,4.5-3.24,3.24-5.74,5.86-7.85,9.28Zm14.54,18.15c.61-.1.92.19.41.54-2.32,1.6-5.9,3.68-8.91,4.77-3.32,1.2-3.32,1.14-7.63,1.58,1.88-.97,2.4-1.57,3.21-2.02,5.87-3.19,9.95-4.36,12.92-4.87Zm-7.71-.11c-.79.3-1.11-.1-.79-.89.12-.3.95-2.72.59-4.77-.39-2.21.36-1.89,1.4-2.7.19-.15.62-.36.8-.5,4.14-3.22,8.01-5.42,13.12-7.71.52-.23,1.47-.45,1.74.64.2.78.32,2.68.14,4.07-.33,2.52-1.72,4.96-2.42,6.11-.98,1.61-2.66,1.94-4.06,2.3-4.07,1.04-5.97,1.74-10.52,3.44Zm10.57-59.83c4.75-3.09,7.99-3.96,12.22-2.5,2.95,1.02,5.87,2.15,8.73,3.41,1.26.55,2.57,1.09,3.79,1.71.03.01.06.03.08.04.99.54,1.7,1.6,1.75,2.73.12,2.64-2.52,3.33-4.44,4.21-2.35,1.09-4.66,2.26-6.93,3.52-6.05,3.37-11.75,7.36-16.99,11.89-1.5,1.3-3.62,1.59-5.42.77-2.36-1.07-5.08-2.26-7.78-3.07-1.65-.49-2.35-2.43-1.46-3.91,5.19-8.61,12.54-16.27,16.43-18.81Zm-39.57-7.17c.09-2.14,1.92-3.81,4.06-3.74,9.41.34,18.43,1.35,26.88,2.94,2.7.51,3.9,3.72,2.14,5.83-5.05,6.08-9.8,12.73-13.79,19.52-1.14,1.95-3.36,2.96-5.59,2.6-3.5-.57-7.16-.96-10.95-1.16-2.12-.11-3.76-1.9-3.67-4.02l.93-21.98Zm-1.36,32.36c.06-1.39,1.39-3.04,2.75-3.35.45-.1,7.79.38,11.37,1.16,1.39.3,2.1,2.7,1.5,3.99-1.56,3.33-2.97,6.74-4.2,10.2-.56,1.56-2.13,2.39-3.76,2.15-1.82-.28-3.72-.47-5.68-.58-1.4-.08-2.49-1.19-2.44-2.59l.46-10.97Zm-.7,16.7c1.86.03,3.68.15,5.45.35.36.04.71.08,1.07.12.09.01.17.02.26.03,12.09,1.57,20.97,6.78,20.97,12.98,0,.84-.17,1.66-.48,2.45l-.05.14c-1.03,2.49-3.52,4.73-7.03,6.53l-.25.12c-4.95,2.47-11.87,4.06-19.57,4.2h-2.36c-7.7-.15-14.62-1.73-19.57-4.2l-.25-.12c-3.51-1.79-5.99-4.04-7.03-6.53l-.05-.14c-.31-.79-.48-1.61-.48-2.45,0-6.2,8.88-11.41,20.97-12.98.09-.01.17-.02.26-.03.35-.04.71-.08,1.07-.12,1.77-.2,3.58-.32,5.45-.35h1.64Zm-27.18,2.08c.43.72.29,1.64-.36,2.17-1.31,1.07-2.39,2.23-3.2,3.46-.52.79-1.48.95-2.21.34-4.01-3.37-8.48-6.21-13.07-8.8-1.17-.66-1.29-2.07-.65-3.25.63-1.18,3.2-3.85,5.55-5.43,1.06-.71,2.81-.31,3.78.54,3.71,3.27,7.32,6.22,10.16,10.99Zm-6.12-15.95c.55-.4,4.94-2.33,7.45-2.68,1.3-.18,3.33.77,4.21,1.75,2.41,2.7,4.23,6.91,5.79,11.1.45,1.19-.18,2.37-1.4,2.75-1.71.54-3.31,1.16-4.78,1.85-1.41.66-3.03.33-3.85-.99-2.11-3.42-4.61-6.04-7.85-9.28-1.21-1.21-1.35-3.23.43-4.5Zm-1.41,22.96c.18.14.61.35.8.5,1.04.81,1.79.49,1.4,2.7-.36,2.06.47,4.48.59,4.77.31.79,0,1.19-.79.89-4.55-1.7-6.44-2.4-10.52-3.44-1.4-.36-3.08-.69-4.06-2.3-.7-1.15-2.09-3.6-2.42-6.11-.18-1.4-.05-3.3.14-4.07.28-1.09,1.22-.87,1.74-.64,5.11,2.29,8.97,4.49,13.12,7.71Zm-5.71,8.97c2.96.51,7.05,1.68,12.92,4.87.81.44,1.33,1.04,3.21,2.02-4.31-.44-4.31-.38-7.63-1.58-3.02-1.09-6.59-3.17-8.91-4.77-.51-.35-.2-.64.41-.54Zm38.53-23.79c.06,1.4-1.04,2.51-2.44,2.59-1.96.11-3.85.3-5.68.58-1.63.25-3.21-.59-3.76-2.15-1.24-3.46-2.64-6.87-4.2-10.2-.61-1.29.1-3.69,1.5-3.99,3.58-.78,10.93-1.26,11.37-1.16,1.35.31,2.69,1.97,2.75,3.35l.46,10.97ZM66.73,8.83c8.45-1.59,17.47-2.6,26.88-2.94,2.14-.08,3.97,1.6,4.06,3.74l.93,21.98c.09,2.12-1.55,3.91-3.67,4.02-3.79.2-7.46.59-10.95,1.16-2.23.37-4.45-.65-5.59-2.6-3.99-6.79-8.74-13.44-13.79-19.52-1.76-2.12-.56-5.32,2.14-5.83Zm-33.46,10.63s.05-.03.08-.04c1.22-.62,2.53-1.16,3.79-1.71,2.86-1.26,5.78-2.39,8.73,3.41,4.23-1.46,7.47-.59,12.22,2.5,3.9,2.53,11.24,10.2,16.43,18.81.89,1.47.19,3.41-1.46,3.91-2.69.81-5.41,2-7.78,3.07-1.81.82-3.92.52-5.42-.77-5.24-4.53-10.94-8.52-16.99-11.89-2.26-1.26-4.57-2.44-6.93-3.52-1.92-.88-4.56-1.58-4.44-4.21.05-1.13.76-2.19,1.75-2.73Zm-23.19,19.02c1.55-2.46,3.51-4.83,5.84-7.1,2.6-2.53,6.31-3.08,9.89-2.53,8.95,1.37,21.84,6.66,31.1,15.24,1.17,1.09,1.32,2.83.06,3.81-2.04,1.59-3.69,3.43-5.08,5.22-.89,1.15-2.7,1.55-4.03.94-11-5.03-23.01-8.13-34.98-9.55-2.87-.34-4.34-3.59-2.8-6.04Zm7.72,31.59c-2.66.36-5.34-.71-6.88-2.9-2.6-3.69-4.27-7.59-4.88-11.64-.42-2.82,1.92-4.66,4.66-5.26,5.06-1.11,24.59,2.65,36.04,6.98,1.02.39,2.22,1.32,2.09,2.4-.16,1.37-.47,3.34-.17,5.51.21,1.51.74,2.81.8,3.94.04.7-.43,2.23-2.1,1.9-9.7-1.89-19.69-2.26-29.56-.94Zm38.54,20.37c-2.08,1.19-4.57,1.47-6.85.75-10.02-3.16-18.73-7.21-25.69-11.93-1.61-1.09-.91-2.99.71-4.07,3.51-2.34,16.51-2.66,25.51-.56.28.07.54.1.94.2,1.24.3,2.68.65,4.51,2.24,4,3.47,5.45,4.21,9.46,6.32,1.07.57.92,2.01-.17,2.55-3,1.5-5.59,2.89-8.41,4.5Zm81.22,4.43c-11.35,2.54-23.24,4.61-36.29,4.64h-1.44c-13.04-.03-24.94-2.11-36.29-4.64-1.45-.32-1.74-1.92-.94-3.17,1.93-3.02,4.64-4.49,6.77-4.6,1.72-.09,3.78-.31,5.46.17,7.58,2.13,15.61,3.52,25,3.52h1.44c9.39,0,17.42-1.39,25-3.52,1.68-.47,3.74-.26,5.46-.17,2.13.11,4.84,1.58,6.77,4.6.8,1.25.51,2.85-.94,3.17Zm39.75-15.61c-6.96,4.72-15.67,8.77-25.69,11.93-2.29.72-4.77.44-6.85-.75-2.82-1.61-5.41-3-8.41-4.5-1.09-.54-1.24-1.99-.17-2.55,4.01-2.11,5.46-2.85,9.46-6.32,1.83-1.58,3.26-1.94,4.51-2.24.4-.1.66-.13.94-.2,9-2.1,22-1.78,25.51.56,1.62,1.08,2.32,2.98.71,4.07Zm17.76-23.73c-.6,4.04-2.28,7.94-4.88,11.64-1.54,2.19-4.22,3.26-6.88,2.9-9.88-1.32-19.86-.96-29.56.94-1.67.33-2.14-1.2-2.1-1.9.07-1.14.59-2.43.8-3.94.3-2.18,0-4.14-.17-5.51-.13-1.08,1.07-2.01,2.09-2.4,11.45-4.33,30.98-8.08,36.04-6.98,2.74.6,5.08,2.44,4.66,5.26Z"/>
          </g>
        </svg>
      </div>
      <div class="text-section">
        <h1 class="about-title">
          The PortAL Linking <br />
          <span>Artists and Scientists</span>
        </h1>
        <p class="about-par">
          At PALLAS, we are passionate about integrating artists into the fabric of the scientific ecosystem. Our goals are to facilitate interactions between artists and scientists and advocate for increased inclusivity of art in scientific research and communication. We are inspired by successful endeavors like the SciArt Exchange, which helps artists (mostly in television and movies) find scientist collaborators. But what about scientists who are looking for artists? By providing an easy way to connect with artists, we hope that scientists will build lasting collaborations with artists that lead to a more creative and vibrant environment in science and science communication.
        </p>

        <button @click="openContactModal" class="contact-us-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Contact Us
        </button>
      </div>
    </div>

    <div class="public-section">
      <div class="whole-thing">

      <h2 class="team-title">Meet the PALLAS Team</h2>
      <h3 class="team-text">
        PALLAS was founded by the Pallasites*—seven astrobiologists and one physicist who wish they had better art skills, or just wish they knew more cool artists! Learn more about us below. *Pallasites are also one of the most rad (and expensive) kind of meteorite. We accept donations.
      </h3>
      <ul class="team-list">
        <li
          v-for="(member, index) in teamMembers"
          :key="index"
          class="team-member-container"
        >
          <div class="card" :style="{ backgroundImage: `url(${member.image})` }">
            <div class="card-front">
              <div class="card-info">
                <p class="title">{{ member.name }}</p>
                <p class="subtitle">{{ member.role }}</p>
              </div>
            </div>
            <div class="card-back">
              <div class="hover-content">
                <p>{{ member.bio }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
    <div class="pet-section">
      <div class="whole-thing">

      <h2 class="team-title">Pallaspets</h2>
      <h3 class="team-text">
        The true masterminds of our team... meet the PALLAS Pets!
      </h3>
      <ul class="team-list">
        <li
          v-for="(member, index) in teamCats"
          :key="index"
          class="team-member-container"
        >
          <div class="card" :style="{ backgroundImage: `url(${member.image})` }">
            <div class="card-front">
              <div class="card-info">
                <p class="title">{{ member.name }}</p>
                <p class="subtitle">{{ member.role }}</p>
              </div>
            </div>
            <div class="card-back">
              <div class="hover-content">
                <p>{{ member.bio }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    </div>

    <ContactModal />
  </div>

</template>

<script>
import { ref } from "vue";
import { openContactForm } from '../utils/eventBus';
import ContactModal from './ContactModal.vue';

export default {
  name: "AboutUs",
  components: {
    ContactModal
  },
  setup() {
    const teamMembers = ref([
      {
        name: "Ashika Capirala",
        role: "Lead Cat",
        bio: "I’m a fourth-year PhD student at Purdue University. I use computer models to study the ocean and marine biosphere on ancient Earth and possible Earth-like exoplanets. In my spare time, I love doing graphic design, photomanipulation, and digital painting to bring alien worlds to life.",
        image: require('./ash.jpg'),
      },
      {
        name: "Lucas Fifer",
        role: "Lead Cat",
        bio: "I'm a PhD candidate at the University of Washington in the Department of Earth & Space Sciences and Astrobiology Program. I study the potential for life on icy moons in our solar system, in particular, what eruptions on Enceladus can tell us about the chemistry and habitability of its subsurface ocean. I've always enjoyed drawing for fun (but I'm not very good), and have recently gotten into making pixel art.",
        image: require('./lucus.jpg'),
      },
      {
        name: "Émilie A. Laflèche",
        role: "Lead Cat",
        bio: "I’m a PhD candidate in Planetary Science at Purdue University. My research explores the effects of seasons on the emergence of complex life on Earth, as well as how extreme seasons may impact exoplanet habitability and life detection! I’ve also always loved crafting, and in my free time I crochet/knit, bake for friends, and hang out with my cat Chai.",
        image: require('./emilie.jpg'),
      },
      {
        name: "Douglas Nyberg",
        role: "Lead Cat",
        bio: "I don't like pickles",
        image: require('./douglas.jpg'),
      },
      {
        name: "Haleigh Nyberg",
        role: "Lead Cat",
        bio: "I am an NSF GRFP Fellow in Stephanie Olson’s PHaB lab at Purdue University. My research focuses on identifying factors that might encourage an origin of life on Earth-like exoplanets through climate modeling and machine learning techniques. I'm passionate about ceramics, 3D-modeling, and crocheting!",
        image: require('./haleigh.jpg'),
      },
      {
        name: "Rebecca Payne",
        role: "Lead Cat",
        bio: "I'm an assistant professor in Earth & Climate Sciences and Physics & Astronomy at Bates College. I study the atmospheres of habitable planets, and am particularly interested in how the Earth's climate, atmospheric chemistry, and biosignatures have changed over time. In my spare time, I like to paint, crochet, bake, and continue my quest to try to learn every handicraft under the sun",
        image: require('./becca.jpg'),
      },
      {
        name: "Evan Sneed",
        role: "Lead Cat",
        bio: "Muffin is a good cat.",
        image: require('./cat.jpg'),
      },
      {
        name: "Michael L. Wong",
        role: "Lead Cat",
        bio: "I'm an NHFP Sagan Postdoctoral Fellow at Carnegie Science's Earth & Planets Laboratory. I'm interested in looking for life in the universe—both within the solar system and on distant exoplanets—through a blend of planetary science and data science. I love photography, typography, and podcasting!",
        image: require('./mike.jpg'),
      },
    ]);

    const teamCats = ref([
      {
        name: "Chai Laflèche",
        role: "Diva Rat",
        bio: "I hate everything today.",
        image: require('./chai.jpg'),
      },
      {
        name: "Muffin Nyberg",
        role: "Fluffy Rat",
        bio: "Is Fluffy Rat",
        image: require('./muffin.jpg'),
      },
      {
        name: "Pearl Nyberg",
        role: "Zoomie Rat",
        bio: "Gotta Go Fast",
        image: require('./pearl.jpg'),
      },
      {
        name: "Beignet Payne",
        role: "Beautiful Rat",
        bio: "Smol Rat",
        image: require('./beignet.jpg'),
      },
    ]);

    const openContactModal = () => {
      openContactForm();
    };

    return {
      teamMembers,
      teamCats,
      openContactModal
    };
  },
};
</script>

<style scoped>
.about-us-container {
  width: 95%;
  margin: 0 auto;
  box-sizing: border-box;
}

.header-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
  text-align: center;
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25%;
  opacity: 0.07;
  transform: translate(-50%, -50%) scale(2.5);
  z-index: 0;
}

.loader .cls-1 {
  fill: #000;
}

.text-section {
  position: relative;
  z-index: 1;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-title {
  margin: 0;
  font-size: 4vw;

}

.about-title span {
  font-style: italic;
}

.about-par {

  margin: 20px 0 0;
  font-size: 1.2vw;

}

.whole-thing {
  background-color: #fff;
  border-radius: 10px;
  border: 3px solid #d1d2e6c2;
  padding: 0 40px;
  box-shadow: 0px 8px 16px rgba(51, 51, 51, 0.21);

}

.public-section {

  margin-top: 75px;
  padding: 0 3%;
}

.pet-section {
  margin-top: 50px;
  padding: 0 3%;
}

.team-title {
  font-size: 2em;
  color: var(--color-text);
  margin-bottom: 20px;
  text-align: left;
}

.team-text {
  font-size: 1.1rem;
  text-align: left;
  margin-bottom: 30px;
  color: #555;
  font-weight: normal;
  line-height: 1.6;
}

.team-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding: 0;
  list-style: none;
  margin-bottom: 50px;
}

.team-member-container {
  list-style: none;
  margin: 0;
  padding: 0;
}

.card {
  position: relative;
  width: 300px;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  perspective: 1000px;
  background-size: cover;
  background-position: center;
  transition: transform 0.1s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);

}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  overflow: hidden;
  transition: transform .5s cubic-bezier(0.785, 0.135, 0.150, 0.860);
}

.card-front {
  transform: translateX(0);
  z-index: 2;
}

.card-back {
  transform: translateX(120%);
  background: rgba(43, 43, 43, 0.847);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  z-index: 1;
}

.card:hover .card-front {
  transform: translateX(-100%);
}

.card:hover .card-back {
  transform: translateX(0);
}

.card-info {
  color: #fff;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(43, 43, 43, 0.873);
  padding: 10px 0;
  text-align: center;
  transition: transform .5s cubic-bezier(0.785, 0.135, 0.150, 0.860);
}

.title {
  font-size: 1.3rem;
  margin: 0;
}

.title::after {
  content: "";
  display: block;
  width: 50%;
  border-radius: 50%;
  height: 2px;
  margin: 2px auto;
  background-color: #fff;
}

.subtitle {
  color: #fff;
  font-size: 1rem;
  margin: 5px 0 0 0;
}

.card:hover .card-info {
  transform: translateY(100%);
}

.hover-content {
  color: #fff;
  font-size: 0.9rem;
}

.contact-us-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #6567BE;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(101, 103, 190, 0.2);
  margin: 2rem auto 0;
  width: fit-content;
}

.contact-us-btn:hover {
  background: #7577c4;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(101, 103, 190, 0.3);
}

</style>