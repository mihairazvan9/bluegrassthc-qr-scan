<script setup>
  import { loader } from '@/lib/loader.js'
  loader('preview-3D')
</script>

<template>
  <canvas id="preview-3D"></canvas>
</template>

<style lang="scss">
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
