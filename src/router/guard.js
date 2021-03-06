/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
import LockScreen from '@/pages/LockScreen'
import FirstStart from '@/pages/FirstStart'

import walletStore from '@/store/wallet'

/**
 * Common guard for routers.
 * More info [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards).
 * @param {*} to the target Route Object being navigated to.
 * @param {*} from the current route being navigated away from.
 * @param {Function} next this function must be called to resolve the hook.
 * The action depends on the arguments provided to.
 */
export default function guard(to, from, next) {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!walletStore.STORE.state.isReady) {
      return next({
        path: `/${FirstStart.name.toLowerCase()}`
      })
    } else if (!walletStore.STORE.state.isEnable) {
      return next({
        path: `/${LockScreen.name.toLowerCase()}`
      })
    }
  }

  return next() // make sure to always call next()!
}
