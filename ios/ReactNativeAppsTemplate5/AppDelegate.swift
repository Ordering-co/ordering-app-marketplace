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
  private var initialLaunchOptions: [UIApplication.LaunchOptionsKey: Any]?

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

    initialLaunchOptions = launchOptions

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

    return true
  }

  func startReactNative(in window: UIWindow, connectionOptions: UIScene.ConnectionOptions) {
    guard let factory = reactNativeFactory else {
      preconditionFailure("React Native must be initialized before connecting a scene")
    }
    self.window = window
    var launchOptions = initialLaunchOptions ?? [:]

    // Cold links are read by Linking.getInitialURL, not emitted again as URL events.
    if let context = connectionOptions.urlContexts.first {
      launchOptions.removeValue(forKey: .url)
      launchOptions.removeValue(forKey: .userActivityDictionary)
      let options = Self.openURLOptions(for: context)
      if !ApplicationDelegate.shared.application(
        UIApplication.shared, open: context.url, options: options
      ) {
        launchOptions[.url] = context.url
        if let sourceApplication = context.options.sourceApplication {
          launchOptions[.sourceApplication] = sourceApplication
        }
        if let annotation = context.options.annotation {
          launchOptions[.annotation] = annotation
        }
      }
    } else if let activity = connectionOptions.userActivities.first(where: {
      $0.activityType == NSUserActivityTypeBrowsingWeb && $0.webpageURL != nil
    }) {
      launchOptions.removeValue(forKey: .url)
      if ApplicationDelegate.shared.application(UIApplication.shared, continue: activity) {
        launchOptions.removeValue(forKey: .userActivityDictionary)
      } else {
        launchOptions[.userActivityDictionary] = [
          "UIApplicationLaunchOptionsUserActivityTypeKey": activity.activityType,
          "UIApplicationLaunchOptionsUserActivityKey": activity
        ]
      }
    }

    factory.startReactNative(
      withModuleName: "ReactNativeAppsTemplate5",
      in: window,
      launchOptions: launchOptions
    )
    initialLaunchOptions = nil
    RNSplashScreen.show()
  }

  static func openURLOptions(for context: UIOpenURLContext) -> [UIApplication.OpenURLOptionsKey: Any] {
    var options: [UIApplication.OpenURLOptionsKey: Any] = [
      .openInPlace: context.options.openInPlace
    ]
    if let sourceApplication = context.options.sourceApplication {
      options[.sourceApplication] = sourceApplication
    }
    if let annotation = context.options.annotation {
      options[.annotation] = annotation
    }
    return options
  }

  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
       ApplicationDelegate.shared.application(application, continue: userActivity) {
      return true
    }
    return RCTLinkingManager.application(
      application, continue: userActivity, restorationHandler: restorationHandler
    )
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
