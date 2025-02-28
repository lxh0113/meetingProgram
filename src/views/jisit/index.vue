<template>
    <div class="bigBox">
        <MyReactComponent />
    </div>
</template>

<script>
import { applyReactInVue } from "veaury";
import myReactComponent from "./jisit.tsx";

export default {
  components: {
    MyReactComponent: applyReactInVue(myReactComponent),
  },
};
</script>

<style lang="scss" scoped>
.bigBox{
    height: 100vh;
    width: 100vw;
}
</style>
