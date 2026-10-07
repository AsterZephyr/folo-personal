export const appUpdaterConfig = {
  // Personal builds must never install an official renderer or application update.
  enableRenderHotUpdate: false,
  enableCoreUpdate: false,
  enableAppUpdate: false,
  enableDistributionStoreUpdate: false,

  app: {
    autoCheckUpdate: false,
    autoDownloadUpdate: false,
    checkUpdateInterval: 15 * 60 * 1000,
  },
}
