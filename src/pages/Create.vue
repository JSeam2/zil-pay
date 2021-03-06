<template>
  <div :class="b()">
    <UiPanel />
    <div :class="b('wrapper')">
      <TopBar
        :route="false"
        back
      />
      <Title :size="SIZE_VARIANS.md">
        {{ local.CREATE_TITLE }}
      </Title>
      <P :variant="COLOR_VARIANTS.gray">
        {{ local.CREATE_DIS }}
      </P>
      <Refresh
        :class="b('reset-icon')"
        width="30"
        height="30"
        pointer
        @click="refreshWords"
      />
      <div :class="b('words')">
        <Chip
          v-for="(el, index) of wrdsAsArray"
          :key="el.uuid"
          :circle="index + 1"
        >
          {{ el.word }}
        </Chip>
      </div>
      <div :class="b('actions')">
        <Button
          :color="COLOR_VARIANTS.success"
          block
          round
          @click="prinntWords"
        >
          {{ local.PRINT }}
        </Button>
        <Button
          block
          round
          @click="setWords"
        >
          {{ local.CONTINUE }}
        </Button>
      </div>
    </div>
    <Wave />
  </div>
</template>

<script>
import { uuid } from 'uuidv4'

import { mapState, mapMutations } from 'vuex'
import uiStore from '@/store/ui'
import walletStore from '@/store/wallet'

import {
  ICON_VARIANTS,
  SIZE_VARIANS,
  COLOR_VARIANTS
} from '@/config'

import Verify from '@/pages/Verify'

import TopBar from '@/components/TopBar'
import Chip from '@/components/Chip'
import Title from '@/components/Title'
import P from '@/components/P'
import Button from '@/components/Button'
import Refresh from '@/components/icons/Refresh'
import Wave from '@/components/Wave'
import UiPanel from '@/components/UiPanel'
import Printer from '@/mixins/printer'

import { Background } from '@/services'

const bgScript = new Background()

export default {
  name: 'Create',
  mixins: [Printer],
  components: {
    Chip,
    TopBar,
    P,
    Title,
    Button,
    Refresh,
    Wave,
    UiPanel
  },
  data() {
    return {
      ICON_VARIANTS,
      SIZE_VARIANS,
      COLOR_VARIANTS,
      words: ''
    }
  },
  computed: {
    ...mapState(uiStore.STORE_NAME, [
      uiStore.STATE_NAMES.local
    ]),

    wrdsAsArray() {
      return this
        .words
        .split(' ')
        .map(word => ({
          word,
          uuid: uuid()
        }))
    }
  },
  methods: {
    ...mapMutations(walletStore.STORE_NAME, [
      walletStore.MUTATIONS_NAMES.setVerifly
    ]),

    setWords() {
      this.setVerifly(this.words)
      this.$router.push({ name: Verify.name })
    },
    async refreshWords() {
      this.words = await bgScript.getRandomMnemonic()
    },
    prinntWords() {
      // Call from Printer mixin.
      this.printSeed()
    }
  },
  mounted() {
    this.refreshWords()
  }
}
</script>

<style lang="scss">
.Create {
  display: grid;
  justify-content: center;
  align-items: center;

  &__wrapper {
    display: inline-grid;
    align-items: center;
    grid-template-rows: auto 50px 60px 50px 1fr 90px;

    min-width: 250px;
  }

  &__reset-icon {
    justify-self: right;
  }

  &__words {
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(6, 40px);
    grid-auto-flow: column;
    grid-column-gap: 30px;
    grid-row-gap: 10px;
  }

  &__actions {
    display: grid;
    grid-template-columns: minmax(90px, 100px) minmax(90px, 100px);
    justify-content: space-between;
    grid-gap: 30px;
  }
}
</style>
