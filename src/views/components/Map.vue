<template>
  <div class="box">
    <el-input
      id="searchInputId"
      class="common_layout"
      placeholder="输入关键词搜索位置"
      style="width: 400px"
      v-model="positionInput"
      @keyup.enter="searchLocation"
    />
    <el-button :icon="Search" type="primary" @click="searchLocation"
      >搜索</el-button
    >
    <div class="list">
      <div
        class="list_item"
        :title="item.name"
        v-for="item in addressList"
        :key="item.id"
        @click="clickItem(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>

  <div class="gdmap_container">
    <div id="container" />
  </div>
</template>

<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, onUnmounted, ref } from "vue";
// 需要下载element-plus
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const $emit = defineEmits(["change"]);

const positionInput = ref("");

let placeSearch;
let map;

const addressList = ref([]);

onMounted(() => {
  initMap();
});

function initMap() {
  window._AMapSecurityConfig = {
    securityJsCode: "b86122b3e929835b077b9fb2e9380739", // 申请好的Web端开发者安全密钥
  };
  AMapLoader.load({
    key: "cc1ae41a8dd961d6129825a8ac26d591", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.AutoComplete", "AMap.PlaceSearch"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then((AMap) => {
    map = new AMap.Map("container", {
      resizeEnable: true,
      viewMode: "3D", // 是否为3D地图模式
      zoom: 15, // 初始化地图级别
    });

    const autoOptions = {
      input: "searchInputId",
    };

    const auto = new AMap.AutoComplete(autoOptions);

    placeSearch = new AMap.PlaceSearch({
      pageSize: 20,
      map: map,
    });

    auto.on("select", select);
    function select(e) {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name); //关键字查询查询
    }
  });
}

const searchLocation = () => {
  // 判断用户是否输入了关键字
  if (!positionInput.value.trim()) {
    ElMessage.error("请输入搜索内容！");
    return;
  }

  // 执行地点搜索，并处理搜索结果
  placeSearch.search(positionInput.value, (status, result) => {
    // console.log(status, result)
    if (status === "complete" && result.info === "OK") {
      // 如果搜索成功且有搜索结果
      if (result.poiList.pois.length > 0) {
        // 取第一个搜索结果，设置地图中心和缩放级别
        const poi = result.poiList.pois[0];
        map.setCenter([poi.location.lng, poi.location.lat]);
        map.setZoom(15); //缩放级别

        addressList.value = result.poiList.pois;
        console.log(addressList.value)
      } else {
        ElMessage.error("未找到相关地点！");
      }
    } else {
      ElMessage.error("搜索失败！");
    }
  });
};

const clickItem = (item) => {
  // 向父组件传值
  $emit("change", {
    address: item.name,
    lat: item.location.lat,
    lng: item.location.lng,
  });
};

onUnmounted(() => {
  map?.destroy();
});
</script>

<style lang="scss" scoped>
.box {
  position: relative;
}

.auto-item {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding-left: 10px;
}

.list {
  z-index: 2;
  position: absolute;
  top: 40px;
  left: 0;
  width: 400px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #fff;
}

.list_item {
  box-sizing: border-box;
  line-height: 50px;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  text-overflow: ellipsis;
  border:1px solid #eee;
  padding-left: 10px;
}

.gdmap_container {
  width: 500px;
  height: 300px;
  margin-top: 10px;
}
#container {
  padding: 0px;
  margin: 0px;
  border: 1px solid gray;
  width: 100%;
  height: 100%;
}
</style>
