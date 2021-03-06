<template>
  <div :class="b()">
    <TopBar close/>
    <Alert>
      <P :font="FONT_VARIANTS.medium">
        {{ local.EXPORT_WARNING }}
      </P>
      <P :class="b('info')">
        {{ local.EXPORT_INFO }}
      </P>
    </Alert>
    <Container :class="b('wrapper')">
      <RadioGroup
        v-model="radioGroupModel"
        :elements="radioGroupElements"
        @input="content = null"
      />
      <form
        v-show="radioGroupModel && !content"
        :class="b('form')"
        @submit.prevent="onSubmit"
      >
        <Input
          v-model="password.model"
          :placeholder="local.PASSWORD"
          :title="local.EXPORT_CAN_PASSWROD"
          :type="INPUT_TYPES.password"
          :error="password.error"
          round
          required
          @input="password.error = null"
        />
        <Button
          :class="b('next-btn')"
          round
        >
          {{ local.NEXT }}
        </Button>
      </form>
    </Container>
    <Alert v-show="content">
      <Container :class="b('warn-info')">
        <Icon
          :icon="ICON_VARIANTS.warn"
          width="30"
          height="40"
        />
        <P>
          {{ local.EXPORT_DANGER }}
        </P>
      </Container>
    </Alert>
    <Container v-show="content">
      <Textarea
        v-model="content"
        readonly
      />
    </Container>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import uiStore from '@/store/ui'

import {
  ICON_TYPE,
  ICON_VARIANTS,
  FONT_VARIANTS,
  SIZE_VARIANS
} from '@/config'

import TopBar from '@/components/TopBar'
import Container from '@/components/Container'
import Button from '@/components/Button'
import Alert from '@/components/Alert'
import Textarea from '@/components/Textarea'
import Icon from '@/components/Icon'
import Input, { INPUT_TYPES } from '@/components/Input'
import P from '@/components/P'
import RadioGroup from '@/components/RadioGroup'

import { Background } from '@/services'

export default {
  name: 'Export',
  components: {
    TopBar,
    Container,
    Button,
    Input,
    Alert,
    Icon,
    Textarea,
    P,
    RadioGroup
  },
  data() {
    return {
      ICON_TYPE,
      ICON_VARIANTS,
      FONT_VARIANTS,
      SIZE_VARIANS,
      INPUT_TYPES,

      radioGroupModel: null,
      content: null,
      password: {
        model: null,
        error: null
      }
    }
  },
  computed: {
    ...mapState(uiStore.STORE_NAME, [
      uiStore.STATE_NAMES.local
    ]),

    radioGroupElements() {
      return [
        this.local.PRIVATEKEY,
        this.local.PHRASE
      ]
    }
  },
  methods: {
    ...mapMutations(uiStore.STORE_NAME, [
      uiStore.MUTATIONS_NAMES.setLoad
    ]),

    async onSubmit() {
      this.setLoad()

      const currenType = this.radioGroupModel.toLowerCase()
      const privKey = this.local.PRIVATEKEY.toLowerCase()
      const phrase = this.local.PHRASE.toLowerCase()

      switch (currenType) {
      case privKey:
        await this.onPrivateKey()
        break
      case phrase:
        await this.onSeed()
        break
      default:
        break
      }

      this.setLoad()
    },
    async onSeed() {
      const bg = new Background()

      try {
        this.content = await bg.exportSeed(this.password.model)
      } catch (err) {
        this.password.error = `${this.local.INCORRECT} ${this.local.PASSWORD}`
      }
    },
    async onPrivateKey() {
      const bg = new Background()

      try {
        this.content = await bg.exportPrivKey(this.password.model)
      } catch (err) {
        this.password.error = `${this.local.INCORRECT} ${this.local.PASSWORD}`
      }
    }
  }
}
</script>

<style lang="scss">
.Export {
  &__wrapper {
    /* top | right | bottom | left */
    padding: 30px 15px 30px 15px;
  }

  &__next-btn {
    width: 175px;
  }

  &__form {
    display: grid;
    grid-gap: 15px;

    padding-top: 30px;
  }

  &__info {
    font-size: 15px;
    line-height: 20px;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  &__warn-info {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 15px;
  }
}
</style>
