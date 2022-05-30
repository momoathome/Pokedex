<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" :style="createMainBackground">
          <button class="btn-close" @click="$emit('close')">X</button>

          <div class="poke-modal-header">
            <slot name="poke-head"></slot>
          </div>

          <slot name="poke-body"></slot>

          <slot name="poke-footer"></slot>

          <slot name="poke-evolution"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    show: Boolean,
    types: Array,
  },
  computed: {
    createMainBackground() {
      const type = this.types
      return `background: linear-gradient(315deg, ${type[0]} 0%, ${type[1]} 74%)`
    },
  },
}
</script>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
}

.modal-container {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 450px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: hsl(0, 0%, 100%);
  border: 16px solid;
  border-image-source: linear-gradient(245deg, #bcc6cc, #eee, #bcc6cc);
  border-image-slice: 80 20;
  transition: all 0.3s ease;

  .btn-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-weight: 700;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.3s;
  }
}
.list-style-none {
  ul {
    list-style: none;
    padding-left: 0;
  }
}

h2 {
  margin-block: 0.5rem;
  font-size: 27px;
}
p {
  margin: 0;
  text-align: center;
}

.modal-img {
  position: relative;
  width: 262px;
  height: 262px;
  background-color: transparent;
  perspective: 1000px;

  &:hover .poke-img-container {
    transform: rotateY(180deg);
  }

  .poke-img-container {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .poke-front,
  .poke-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
  }

  .poke-back {
    transform: rotateY(180deg);
  }

  .img-large {
    width: 250px;
    height: 250px;
  }
}

.modal-details {
  width: 240px;
}

.poke-id-large {
  font-size: 0.9rem;
  font-weight: bold;
  align-self: flex-end;
  margin-left: 0.25rem;
}
.poke-modal-header {
  margin-inline: 13.5%;

  .poke-name {
    margin: 0;
    .pokemon-name-large {
      margin: 0;
      font-size: 1.1rem;
      color: #fff;
      text-shadow: 1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black,
        -1px -1px 1px black;
    }
  }
}

.modal-abilities {
  margin-top: 1.5rem;
}
.evolution-img {
  max-width: 125px;
  height: 125px;
}
.evolution-chain {
  max-width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .modal-container {
    border: none;
    padding: 20px 0;
    border-radius: 0;
  }
  .poke-img {
    width: 150px;
    height: 150px;
  }
  .detail-img {
    max-width: 150px;
    height: 150px;
  }
  .modal-img {
    max-width: 100px;
    height: 100px;
  }
  .modal-body {
    margin-block: 0;
    margin-top: 20px;
    padding-inline: 20px;
  }
  .modal-footer {
    h2 {
      padding-left: 20px;
    }
  }
  .poke-details {
    grid-template-columns: 40% 60%;
  }
  .evolution-chain {
    flex-wrap: wrap;
  }
}

/* Transitions */
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
</style>
