<template>
  <div class="el-transfer" style="padding-left: 30px;">
    <transfer-panel
      v-bind="$props"
      :data="sourceData"
      :title="titles[0] || t('el.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      :canDrop="false"
      @checked-change="onSourceCheckedChange">
      <slot name="left-footer"></slot>
    </transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToLeft"
        :disabled="rightChecked.length === 0">
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        @click.native="addToRight"
        :disabled="leftChecked.length === 0">
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
    <transfer-panel
      v-bind="$props"
      :data="targetData"
      :title="titles[1] || t('el.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onTargetCheckedChange"
      @emit-filtered="getDragData">
      <slot name="right-footer"></slot>
    </transfer-panel>
  </div>
</template>

<script>
  import ElButton from 'element-ui/packages/button'
  import Emitter from 'element-ui/src/mixins/emitter'
  import Locale from 'element-ui/src/mixins/locale'
  import TransferPanel from './transfer-panel.vue'
  import Migrating from 'element-ui/src/mixins/migrating'

  export default {
    name: 'MyTransfer',

    mixins: [Emitter, Locale, Migrating],

    components: {
      TransferPanel,
      ElButton
    },

    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      titles: {
        type: Array,
        default() {
          return []
        }
      },
      buttonTexts: {
        type: Array,
        default() {
          return []
        }
      },
      filterPlaceholder: {
        type: String,
        default: ''
      },
      filterMethod: Function,
      leftDefaultChecked: {
        type: Array,
        default() {
          return []
        }
      },
      rightDefaultChecked: {
        type: Array,
        default() {
          return []
        }
      },
      renderContent: Function,
      value: {
        type: Array,
        default() {
          return []
        }
      },
      format: {
        type: Object,
        default() {
          return {}
        }
      },
      filterable: Boolean,
      props: {
        type: Object,
        default() {
          return {
            label: 'fieldsName',
            key: 'fieldsKey',
            disabled: 'disabled'
          }
        }
      }
    },

    data() {
      return {
        leftChecked: [],
        rightChecked: [],
        arr: [],

      }
    },

    computed: {
      // sourceData() {
      //   return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1)
      // },
      sourceData: {
        get: function() {
          return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1)
        },
        set: function(newData) {
          return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1)
          console.log(newData)
        }
      },

      targetData: {
        // return this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1)

        get: function() {
          let tmp = []
          this.value.forEach(item => {
            let i = this.data.find(it => it[this.props.key] === item) || item
            tmp.push(i)
          })
          return tmp
        },
        set: function(newData) {
          return newData
        }
      },

      hasButtonTexts() {
        return this.buttonTexts.length === 2
      }
    },

    watch: {
      value(val) {
        console.log(val)
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    },

    methods: {
      getMigratingConfig() {
        return {
          props: {
            'footer-format': 'footer-format is renamed to format.'
          }
        }
      },

      onSourceCheckedChange(val) {
        this.leftChecked = val
      },

      onTargetCheckedChange(val) {
        this.rightChecked = val
      },

      addToLeft() {
        let currentValue = []
        this.value.slice().forEach(item => {
          currentValue.push(item[this.props.key] || item)
        })
        this.rightChecked.forEach(item => {
          const index = currentValue.indexOf(item)
          if (index > -1) {
            currentValue.splice(index, 1)
          }
        })
        this.$emit('input', currentValue)
        this.$emit('change', currentValue, 'left', this.rightChecked)
      },

      addToRight() {
        let currentValue = []
        this.value.slice().forEach(item => {
          currentValue.push(item[this.props.key] || item)
        })
        this.leftChecked.forEach(item => {
          if (this.value.indexOf(item) === -1) {
            currentValue = currentValue.concat(item)
          }
        })
        this.$emit('input', currentValue)
        this.$emit('change', currentValue, 'right', this.leftChecked)
      },

      getDragData(data) {
        this.targetData = data
        // let arr = []
        // data.forEach(item => {
        //   arr.push(item.fieldsKey)
        // })
        // let list = this.data.filter(item => {
        //   return arr.indexOf(item[this.props.key]) === -1
        // })
        this.$emit('updata', data)
        // this.$emit('input', data)
        // this.$emit('change', data, 'right', this.leftChecked)
      }
    }
  }
</script>
