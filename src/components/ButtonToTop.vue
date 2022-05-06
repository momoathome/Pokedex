<template>
  <button v-show="ishidden" @click="goToTop" class="back-to-top">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="back-to-top-icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"
      />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'ToTopButton',
  data() {
    return {
      ishidden: false,
      showOnPx: 400,
    }
  },
  methods: {
    showButton() {
      document.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > this.showOnPx) {
          this.ishidden = true
        } else {
          this.ishidden = false
        }
      })
    },
    goToTop() {
      document.body.scrollIntoView({
        behavior: 'smooth',
      })
    },
  },
  mounted() {
    this.showButton()
  },
}
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  height: 50px;
  width: 50px;
  border-radius: 100%;
  background-color: #800000;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  opacity: 1;
  transition: all 0.35s;

  &:hover {
    background-color: #c00202;
  }
}

.back-to-top-icon {
  color: #fff;
}
</style>
