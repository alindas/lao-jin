<template>
  <div class="right-part-links">
    <ul v-for="(item,index) in moreLinkList" :key="index">
      <li v-for="item in item" :key="item.value"><a :href="item.link" target="_blank">{{item.value}}</a></li>
    </ul>
    <ul v-for="item in companyMessage" :key="item.value">
      <li>{{item.value}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "mainSidebar",
  data () {
    return {
        moreLinkList: [
          [
            {"value":"关于","link":"/others/about"},
            {"value":"营业执照","link":"/others/license"},
            {"value":"友情链接","link":"/others/links"},
          ],
          [
            {"value":"用户协议","link":"/others/terms"},
            {"value":"隐私政策","link":"/others/privacy"},
            {"value":"使用指南","link":"/others/helpbook"},
          ],
          [{"value":"粤ICP备23333333号-3","link":"https://beian.miit.gov.cn/"}],
          [{"value":"粤安网安备号23333333333333号","link":"http://www.beian.gov.cn/"}]
          
        ],
        companyMessage: [
          {"value":"版权所有：广东省东莞市东莞理工学院"},
          {"value":"学校地址：广东省东莞市松山湖校区大学路1号"},
          {"value":"学校邮政编码：525300"},
          {"value":"\u00A92020 捞金网"}
        ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/commonValue";
.right-part-links {
  width: 296px;
  height: 296px;
  margin-top: 10px;
  font-size: 12px;
  ul {
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    margin-left: 20px;
    li {
      padding-top: 5px;
      color: #8590a6;
      a {
        color: #8590a6;
        &:hover {
          color: $selected_color;
        }
      }
    }
    &:nth-child(-n+2) {
      li:nth-child(-n+2)::after {
        content: '·';
        margin: 0 10px;
        color: #8590a6;
      }
    }
  }
}
</style>