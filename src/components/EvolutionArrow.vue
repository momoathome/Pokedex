<template>
  <div class="evolution-arrow-div">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="evolution-arrow"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
        clip-rule="evenodd"
      />
      <path
        fill-rule="evenodd"
        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'EvolutionArrow',
}
</script>

<style lang="scss" scoped>
.evolution-arrow-div {
  display: flex;
  align-items: center;
}
.evolution-arrow {
  height: 30px;
  width: 30px;
}

@media (max-width: 768px) {
  .evolution-arrow {
    height: 25px;
    width: 25px;
  }
}
</style>
