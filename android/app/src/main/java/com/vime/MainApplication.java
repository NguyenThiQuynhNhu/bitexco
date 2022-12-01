package com.building.vime.bitexco;

import android.app.Application;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import org.conscrypt.Conscrypt;
import java.security.Security;
import java.util.List;
import com.microsoft.codepush.react.CodePush;
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MPAndroidChartPackage());
      // packages.add(new FIRMessagingPackage());
      // packages.add(new FIRMessagingPackage());
      //packages.add(new VectorIconsPackage());
      return packages;
    }



    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
    @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    //Security.insertProviderAt(new org.conscrypt.OpenSSLProvider(), 1);
  }
}
