<template>
  <div class="sys-setup">
    <ListTableHeander 
      tabTitle="平台数据统计"
      :optionsList="optionsList"
      @setOptions="setOptions"
    />
    <div id="container"></div>
  </div>
</template>

<script>
import {sysDataAnalysis} from '@/axios/request';
import ListTableHeander from '@/components/common/DataListHeader';
import { Line, Chart, P } from "@antv/g2plot";

export default {
  name: "Setup",
  components: {
    ListTableHeander
  },
  data() {
    return {
      view: undefined,
      data: [],
      optionsList: [
        {
          key: 'sysMess-select1',
          category: 'select',
          value: undefined,
          reminder: '数据类型',
          options: [
          {
            value: 'basic',
            label: '平台基础'
          },
          {
            value: 'online',
            label: '当前在线用户'
          }],
        },
        {
          key: 'sysMess-select2',
          category: 'select',
          value: undefined,
          reminder: '条件设置',
          options: [],
        },
      ],
      dynamicOptions: [
        [
          {
            value: 'lastWeek',
            label: '过去一周'
          },
          {
            value: 'lastMonth',
            label: '过去一月'
          }
        ]
      ]
    };
  },
  methods: {
    setOptions(val) {
      this.view && this.view.destroy();
      this.view = undefined;  
      for(let i of this.optionsList) {
        if(i.key == val[0]) {
          i.value = val[1];
          if(val[1] == 'basic') {
            this.optionsList[1].options = this.dynamicOptions[0];
          }
          else {
            this.optionsList[1].options = [];
          }
          this.load();
          break;
        }
      }
    },
    load() {
      sysDataAnalysis({
        type: this.optionsList[0].value
      })
      .then(res => {
        this.data = res.data;
        if(this.optionsList[0].value == 'basic') {
          this.renderBasicView();
        }
      })
      .catch(err => {
        this.$message.error(err);
      })
    },
    renderBasicView() {
      const COLOR_PLATE_10 = [
        "#5B8FF9",
        "#5AD8A6",
        "#5D7092",
        "#F6BD16",
        "#E8684A",
        "#6DC8EC",
        "#9270CA",
        "#FF9D4D",
        "#269A99",
        "#FF99C3",
      ];
      this.view = new Line('container', {
        data: this.data,
        xField: "date",
        yField: "value",
        seriesField: "category",
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) =>
              `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        color: COLOR_PLATE_10,

        point: {
          shape: ({ category }) => {
            switch(category) {
              case '新用户': return 'square';
              case '兼职发布': return 'circle';
              case '轻需求发布': return 'triangle';
              default: return 'square';
            }
          },
          style: ({ date }) => {
            const day = date.split('-')[1];
            return {
              r: Number(day) % 4 ? 0 : 3, // 4 个数据示一个点标记
            };
          },
        },
      });
      this.view.render();
    },
  },
  created() {
    this.load();
  }
};
</script>
<style lang="scss">
.sys-setup {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: auto;
  padding: 20px 10px;
  #container {
    margin-top: 10px;
    width: 80%;
    height: 70%;
  }
}
</style>