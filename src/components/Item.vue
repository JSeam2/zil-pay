<template>
  <div :class="b({ pointer })">
    <Icon
      v-if="src"
      :src="src"
      :type="ICON_TYPE.auto"
      height="35"
      width="35"
      @click="onClick"
    />
    <div
      :class="b('content')"
      @click="onClick"
    >
      <slot/>
    </div>
    <Trash
      v-if="trash"
      height="16"
      width="13"
      pointer
      @click="onRemove"
    />
    <Arrow
      v-if="arrow"
      right
      height="12"
      width="2"
    />
  </div>
</template>

<script>
import {
  SIZE_VARIANS,
  COLOR_VARIANTS,
  ICON_TYPE,
  EVENTS
} from '@/config'

import Icon from '@/components/Icon'

import Trash from '@/components/icons/Trash'
import Arrow from '@/components/icons/Arrow'

/**
 * List item
 * @example
 * import Item from '@/components/Item'
 * <Item
 *   :src="item.icon"
 *   trash // or arrow
 *   pointer
 *   @click="/ do something /"
 *   @remove="/ do something /"
 * >
 *   any content
 * </Item>
 */
export default {
  name: 'Item',
  components: {
    Icon,
    Trash,
    Arrow
  },
  props: {
    src: {
      type: String,
      required: false
    },
    trash: {
      type: Boolean,
      required: false
    },
    arrow: {
      type: Boolean,
      required: false
    },
    pointer: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      SIZE_VARIANS,
      COLOR_VARIANTS,
      ICON_TYPE
    }
  },
  methods: {
    onClick() {
      this.$emit(EVENTS.click)
    },
    onRemove() {
      this.$emit(EVENTS.remove)
    }
  },
  mounted() {
    if (this.arrow && this.trash) {
      throw new Error('arrow and trash props can be only one of them.')
    }
  }
}
</script>

<style lang="scss">
.Item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 330px;

  &__content {
    display: flex;
    align-items: center;

    text-indent: 15px;

    height: 45px;
    width: 100%;
  }

  &_pointer {
    cursor: pointer;
  }
}
</style>
