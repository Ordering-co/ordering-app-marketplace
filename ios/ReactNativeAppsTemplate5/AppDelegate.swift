import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import GoogleMaps
import AuthenticationServices
import SafariServices
import FBSDKCoreKit
import FirebaseCore

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    // Initialize Facebook SDK
    ApplicationDelegate.shared.application(
      application,
      didFinishLaunchingWithOptions: launchOptions
    )

    // Configurar Google Maps API Key
    GMSServices.provideAPIKey("_GOOGLE_MAPS_API_KEY_")

    // Configurar Intercom
    let intercomApiKey = "_INTERCOM_API_KEY_"
    let intercomAppId = "_INTERCOM_APP_ID_"

    if !intercomApiKey.isEmpty &&
       intercomApiKey != "none" &&
       !intercomApiKey.hasPrefix("_INTERCOM") &&
       !intercomAppId.isEmpty &&
       intercomAppId != "none" &&
       !intercomAppId.hasPrefix("_INTERCOM") {
      IntercomModule.initialize(intercomApiKey, withAppId: intercomAppId)
    }

    factory.startReactNative(
      withModuleName: "ReactNativeAppsTemplate5",
      in: window,
      launchOptions: launchOptions
    )

    RNSplashScreen.show()

    return true
  }

  // Manejo de URLs para deep linking y Facebook
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    // Handle Facebook SDK URLs
    if ApplicationDelegate.shared.application(app, open: url, options: options) {
      return true
    }

    // Manejar URLs con React Native Linking
    if RCTLinkingManager.application(app, open: url, options: options) {
      return true
    }

    return false
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
