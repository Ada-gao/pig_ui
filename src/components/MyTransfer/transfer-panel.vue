<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>
    
    <div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <el-input
        class="el-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        v-if="filterable">
        <i slot="prefix"
          :class="['el-input__icon', 'el-icon-' + inputIcon]"
          @click="clearQuery"
        ></i>
      </el-input>
      
      <el-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list">
        <Container @drop="onDrop" v-if="canDrop">
          <Draggable v-for="item in filteredData" :key="item.id">
            <el-checkbox
              class="el-transfer-panel__item draggable-item"
              :label="item[keyProp]"
              :disabled="item[disabledProp]"
              :key="item[keyProp]">
              <option-content :option="item"></option-content>
            </el-checkbox>
          </Draggable>
        </Container>
        <el-checkbox
          v-else
          class="el-transfer-panel__item draggable-item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData">
          <option-content :option="item"></option-content>
        </el-checkbox>
        
      </el-checkbox-group>
      <p
        class="el-transfer-panel__empty"
        v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
      <p
        class="el-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
  import { Container, Draggable } from 'vue-smooth-dnd'
  import { applyDrag, generateItems } from './utils'
  import ElCheckboxGroup from 'element-ui/packages/checkbox-group'
  import ElCheckbox from 'element-ui/packages/checkbox'
  import ElInput from 'element-ui/packages/input'
  import Locale from 'element-ui/src/mixins/locale'

  export default {
    mixins: [Locale],

    name: 'ElTransferPanel',

    componentName: 'ElTransferPanel',

    components: {
      ElCheckboxGroup,
      ElCheckbox,
      ElInput,
      Container,
      Draggable,
      OptionContent: {
        props: {
          option: Object
        },
        render(h) {
          const getParent = vm => {
            if (vm.$options.componentName === 'ElTransferPanel') {
              return vm
            } else if (vm.$parent) {
              return getParent(vm.$parent)
            } else {
              return vm
            }
          }
          const parent = getParent(this)
          return parent.renderContent
            ? parent.renderContent(h, this.option)
            : `<span>${ this.option[parent.labelProp] || this.option[parent.keyProp] }</span>`
        }
      }
    },

    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      renderContent: Function,
      placeholder: String,
      title: String,
      filterable: Boolean,
      format: Object,
      filterMethod: Function,
      defaultChecked: Array,
      props: Object,
      canDrop: {
        type: Boolean,
        default() {
          return true
        }
      }
    },

    data() {
      return {
        checked: [],
        allChecked: false,
        query: '',
        inputHover: false,
        filteredData: this.data
        // items: generateItems(50, i => ({id: i, data: 'Draggable ' + i}))
      }
    },

    watch: {
      checked(val) {
        this.updateAllChecked()
        this.$emit('checked-change', val)
      },

      data(curVal, oldVal) {
        let hasCurVal = curVal.some(item => item === undefined)
        if(hasCurVal) return
        this.filteredData = curVal
        const checked = []
        const filteredDataKeys = this.filteredData.map(item => item[this.keyProp])
        this.checked.forEach(item => {
          if (filteredDataKeys.indexOf(item) > -1) {
            checked.push(item)
          }
        })
        this.checked = checked
      },

      checkableData() {
        this.updateAllChecked()
      },

      defaultChecked: {
        immediate: true,
        handler(val, oldVal) {
          if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return
          const checked = []
          const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
          val.forEach(item => {
            if (checkableDataKeys.indexOf(item) > -1) {
              checked.push(item)
            }
          })
          this.checked = checked
        }
      }
    },

    computed: {
      // filteredData: {
      //   get: function () {
      //     return this.data
      //     // return this.data.filter(item => {
      //     //   if (typeof this.filterMethod === 'function') {
      //     //     return this.filterMethod(this.query, item)
      //     //   } else {
      //     //     const label = item[this.labelProp] || item[this.keyProp].toString()
      //     //     return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1
      //     //   }
      //     // })
      //   },
      //   set: function (newData) {
      //     console.log(newData)
      //     return newData
      //   }
      // },

      checkableData() {
        // this.$emit('emit-filtered', this.filteredData)
        return this.filteredData
        // return this.filteredData.filter(item => !item[this.disabledProp])
      },

      checkedSummary() {
        const checkedLength = this.checked.length
        const dataLength = this.data.length
        const { noChecked, hasChecked } = this.format
        if (noChecked && hasChecked) {
          return checkedLength > 0
            ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
            : noChecked.replace(/\${total}/g, dataLength)
        } else {
          return `${ checkedLength }/${ dataLength }`
        }
      },

      isIndeterminate() {
        const checkedLength = this.checked.length
        return checkedLength > 0 && checkedLength < this.checkableData.length
      },

      hasNoMatch() {
        return this.query.length > 0 && this.filteredData.length === 0
      },

      inputIcon() {
        return this.query.length > 0 && this.inputHover
          ? 'circle-close'
          : 'search'
      },

      labelProp() {
        return this.props.label || 'label'
      },

      keyProp() {
        return this.props.key || 'key'
      },

      disabledProp() {
        return this.props.disabled || 'disabled'
      },

      hasFooter() {
        return !!this.$slots.default
      }
    },

    methods: {
      onDrop(dropResult) {
        this.filteredData = applyDrag(this.filteredData, dropResult)
        // this.data = this.filteredData
        console.log(this.filteredData)
        this.$emit('emit-filtered', this.filteredData)
      },

      updateAllChecked() {
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp])
        this.allChecked = checkableDataKeys.length > 0 &&
          checkableDataKeys.every(item => this.checked.indexOf(item) > -1)
      },

      handleAllCheckedChange(value) {
        this.checked = value
          ? this.checkableData.map(item => item[this.keyProp])
          : []
      },

      clearQuery() {
        if (this.inputIcon === 'circle-close') {
          this.query = ''
        }
      }
    }
  }
</script>
