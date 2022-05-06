<template>
  <div>
    <div class="skeleton">
      <div class="skel-img"></div>
      <div class="skel-name"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'skeleton',
}
</script>

<style lang="scss" scoped>
@mixin skelloading {
  opacity: 0.7;
  animation: skeleton-loading 1.25s linear infinite alternate;
}
.skeleton {
  height: 250px;
  width: 250px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.skel-img {
  align-self: center;
  margin-top: 2rem;
  border-radius: 50%;
  height: 150px;
  width: 150px;
  @include skelloading();
}

.skel-name {
  align-self: center;
  height: 1rem;
  margin-top: 2rem;
  width: 60%;
  border-radius: 0.125rem;
  @include skelloading();
}
@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 70%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}
</style>
