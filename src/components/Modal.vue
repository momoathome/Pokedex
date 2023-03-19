<template>
  <Transition name="modal">
      <div class="modal-wrapper">
        <div class="modal-container" :style="createMainBackground">
          <button class="btn-close" @click="$emit('close')">X</button>

          <div class="modal-content">
            <div class="poke-modal-header">
              <div class="poke-head">
                <div class="poke-name">
                  <h3 class="pokemon-name-large">{{ pokemon.name }}</h3>
                  <span class="poke-id-large">No.{{ pokemon.id }}</span>
                </div>
                <div class="poke-head-info">
                  <div class="poke-kp">{{ pokemon.stats[0].base_stat }} <span>KP</span></div>
                  <div class="poke-element-icon">
                    <img :src="'assets/' + setElementIcon" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div class="poke-body">
              <div class="modal-img">
                <div class="poke-img-container">
                  <div class="poke-img poke-front">
                    <img :src="pokemon.sprites.front_default" class="img-large" />
                  </div>
                  <div class="poke-img poke-back">
                    <img :src="pokemon.sprites.front_shiny" class="img-large" />
                  </div>
                </div>
              </div>
           </div>

              <div class="poke-footer">
                <div class="poke-details modal-details">
                  <span>Height: {{ pokemon.height / 10 }}m </span>,<span
                    >Weight: {{ pokemon.weight / 10 }}kg
                  </span>
                </div>
                <div class="poke-abilities modal-abilities">
                  <div class="poke-ability">
                    {{ pokemon.abilities[0].ability.name }}
                    <span v-if="pokemon.abilities[0].desc" class="poke-ability-desc"
                      >{{ pokemon.abilities[0].desc }}
                    </span>
                  </div>
                  <div class="poke-ability" v-if="pokemon.abilities[1]">
                    {{ pokemon.abilities[1].ability.name }}
                    <span v-if="pokemon.abilities[1].desc" class="poke-ability-desc"
                      >{{ pokemon.abilities[1].desc }}
                    </span>
                  </div>
                </div>
              </div>
          </div>

          
          <div class="evolution-chain">
            <div v-if="pokemon.evolution_base">
              <img
                :src="pokemon.evolution_base.sprites.front_default"
                class="evolution-img"
              />
              <p>{{ pokemon.evolution_base.name }}</p>
            </div>
            <template v-if="pokemon.evolution_advanced">
              <EvolutionArrow />
            </template>
            <div v-if="pokemon.evolution_advanced">
              <img
                :src="pokemon.evolution_advanced.sprites.front_default"
                class="evolution-img"
              />
              <p>{{ pokemon.evolution_advanced.name }}</p>
            </div>
            <template v-if="pokemon.evolution_expert">
              <EvolutionArrow />
            </template>
            <div v-if="pokemon.evolution_expert">
              <img
                :src="pokemon.evolution_expert.sprites.front_default"
                class="evolution-img"
              />
              <p>{{ pokemon.evolution_expert.name }}</p>
            </div>
          </div>

        </div>
      </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EvolutionArrow from './EvolutionArrow.vue'

const props = defineProps({
  pokeTypes: Array,
  pokemon: Object,
})

const setElementIcon = computed(() => {
  const type = props.pokemon!.types[0].type.name
  return `Pokemon_${type}_Type_Icon.svg`
})

const createMainBackground = computed(() => {
  const type = props.pokemon!.types[0].type.hex
  return `background: linear-gradient(315deg, ${type![0]} 0%, ${type![1]} 74%)`
})

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
  padding-bottom: 20px;
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
.modal-content {
  padding: 20px 30px;
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
    border-radius: 0;
    max-width: 100%;
    height: 100%;
  }

  .modal-img {
    width: 232px;
    height: 232px;

    .img-large {
      width: 220px;
      height: 220px;
    }
  }

  .modal-details {
    width: 210px;
  }

  .evolution-chain {
    flex-wrap: wrap;
  }

  .evolution-img {
    max-width: 100px;
    height: 100px;
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
