package com.mobile;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "mobile";
  }

  // Declare the launcher at the top of your Activity/Fragment:
  private final ActivityResultLauncher<String> requestPermissionLauncher =
          registerForActivityResult(new ActivityResultContracts.RequestPermission(), isGranted -> {
              if (isGranted) {
                  // FCM SDK (and your app) can post notifications.
              } else {
                  // TODO: Inform user that that your app will not show notifications.
              }
          });

  private void askNotificationPermission() {
      // This is only necessary for API level >= 33 (TIRAMISU)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
                  PackageManager.PERMISSION_GRANTED) {
              // FCM SDK (and your app) can post notifications.
          } else if (shouldShowRequestPermissionRationale(Manifest.permission.POST_NOTIFICATIONS)) {
              // TODO: display an educational UI explaining to the user the features that will be enabled
              //       by them granting the POST_NOTIFICATION permission. This UI should provide the user
              //       "OK" and "No thanks" buttons. If the user selects "OK," directly request the permission.
              //       If the user selects "No thanks," allow the user to continue without notifications.
          } else {
              // Directly ask for the permission
              requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS);
          }
      }
  }


@Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }


}
