<script>
export default {
  props: {
    show: Boolean,
  },
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <button class="btn-close" @click="$emit('close')">X</button>
          <div class="modal-header">
            <slot name="img"></slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

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
}

.modal-container {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;

  .btn-close {
    background: none;
    border: none;
    align-self: end;
    font-weight: 700;
    font-size: 1.25rem;
    cursor: pointer;
  }
}
.list-style-none {
  ul {
    list-style: none;
    padding-left: 0;
  }
}

.modal-header {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.detail-img {
  max-width: 200px;
  height: 200px;
}
.modal-body {
  margin-top: 20px;
  font-size: 18px;
  line-height: 24px;
}
.poke-details {
  max-width: 100%;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 1rem;
}
@media (max-width: 768px) {
  .detail-img {
    max-width: 200px;
    height: 150px;
  }
  .poke-details {
    grid-template-columns: 40% 60%;
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
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
