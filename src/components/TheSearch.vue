<template>
  <div class="searchbar">
    <div class="inner-search">
      <label for="pokemon" class="pokemonSearch">
        <input
          type="text"
          id="pokemonSearch"
          v-model="search"
          @keydown="$emit('update-search', search)"
          placeholder="&nbsp;"
        />
        <span class="label">Search Pokemon ({{ pokemons.length }}) </span>
        <span class="focus-bg"></span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheSearch',
  props: {
    pokemons: Array,
    search: String,
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
$primary: #800000;
$dark: #000;
$background: #fff;

.searchbar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 9999;
  margin-bottom: 4rem;
  //background-color: $background;
}

.inner-search {
  display: flex;
  justify-content: center;
}

.pokemonSearch {
  position: relative;
  border-radius: 3px;
  overflow: hidden;

  .label {
    position: absolute;
    top: 20px;
    left: 12px;
    font-size: 16px;
    color: rgba($dark, 0.5);
    font-weight: 500;
    transform-origin: 0 0;
    transform: translate3d(0, 0, 0);
    transition: all 0.2s ease;
    pointer-events: none;
  }

  .focus-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($dark, 0.05);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    width: 500px;
    border: 0;
    font-family: inherit;
    padding: 16px 12px 0 12px;
    height: 56px;
    font-size: 16px;
    font-weight: 400;
    background: rgba($dark, 0.02);
    box-shadow: inset 0 -1px 0 rgba($dark, 0.3);
    color: $dark;
    transition: all 0.15s ease;

    &:hover {
      background: rgba($dark, 0.04);
      box-shadow: inset 0 -1px 0 rgba($dark, 0.5);
    }

    &:not(:placeholder-shown) {
      .label {
        color: rgba($dark, 0.5);
        transform: translate3d(0, -12px, 0) scale(0.75);
      }
    }

    &:focus {
      background: rgba($dark, 0.05);
      outline: none;
      box-shadow: inset 0 -2px 0 $primary;
      + .label {
        color: $primary;
        transform: translate3d(0, -12px, 0) scale(0.75);
      }
      + .focus-bg {
        transform: scaleX(1);
        transition: all 0.1s ease;
      }
    }
  }
}
</style>
