<template>
  <div v-cloak id="popup">
    <img src="@images/logo_x128.png" alt="">
    <p>{{ msg }}</p>
    <div class="icon">
      <a>
        <i class="iconfont icon-github"></i>
      </a>
      <a>
        <i class="iconfont icon-gitee"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    msg: "Extension App"
  })
}
</script>

<style lang="scss" scoped>
@import "/src/resource/scss/theme";

#popup {
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: 30px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    margin-top: 10px;
    font-size: 28px;
    transition: color 0.3s ease-in-out;
    color: $fontBlackColor;
  }

  img {
    height: 64px;
    animation: rotate 4s linear infinite;
  }
}

.icon {
  position: absolute;
  bottom: 5px;
  right: 5px;

  a {
    color: $fontGaryColor;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: $fontWhiteColor;
    }

    & + a {
      margin-left: 5px;
    }
  }

  i {
    font-size: 24px;
  }
}
</style>