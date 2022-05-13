<template>
  <div>
    <div class="skeleton">
      <div class="skel-name"></div>
      <div class="skel-img"></div>
      <div class="skel-text-div">
        <div class="skel-text"></div>
        <div class="skel-text"></div>
        <div class="skel-text"></div>
      </div>
      <div class="skel-text-div">
        <div class="skel-text"></div>
        <div class="skel-text"></div>
        <div class="skel-text"></div>
      </div>
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
  height: 475px;
  width: 300px;
  display: flex;
  flex-direction: column;
  border: 12px solid rgba(204, 204, 204, 0.2);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding-inline: 1.5rem;
}

.skel-img {
  align-self: center;
  margin-top: 0.5rem;
  height: 225px;
  width: 100%;
  @include skelloading;
}

.skel-name {
  align-self: start;
  height: 1.25rem;
  margin-top: 1.25rem;
  width: 100%;
  border-radius: 0.125rem;
  @include skelloading;
}

.skel-text-div {
  margin-top: 0.5rem;

  &:nth-of-type(2n + 1) {
    margin-top: 1.5rem;
  }
}
.skel-text {
  align-self: center;
  height: 0.6rem;
  margin-top: 0.5rem;
  width: 100%;
  border-radius: 0.125rem;
  @include skelloading;

  &:nth-child(3n) {
    width: 80%;
  }
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
