package com.reactnativeplayinstallreferrer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.RemoteException;

import androidx.annotation.NonNull;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

public class PlayInstallReferrerModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  InstallReferrerClient mReferrerClient = null;

  public PlayInstallReferrerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;

    String actionType = "com.android.vending.INSTALL_REFERRER";

    reactContext.registerReceiver(new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {

      }
    }, new IntentFilter(actionType));
  }

  @ReactMethod
  public void getReferrer(final Promise promise) {
    try {
      mReferrerClient = InstallReferrerClient.newBuilder(reactContext).build();
      mReferrerClient.startConnection(new InstallReferrerStateListener() {
        @Override
        public void onInstallReferrerSetupFinished(int responseCode) {
          WritableMap result = getReferrerDetails(responseCode);
          if (result.getString("status").equals("OK"))
            promise.resolve(result);
          else
            promise.reject(new Error(result.getString("status")));
        }

        @Override
        public void onInstallReferrerServiceDisconnected() {
        }
      });
    } catch (RuntimeException e) {
      promise.reject(new Error("RUNTIME_EXCEPTION"));
    }
  }

  public WritableMap getReferrerDetails(int responseCode) {
    WritableMap result = new WritableNativeMap();

    switch (responseCode) {
      case InstallReferrerClient.InstallReferrerResponse.OK: {
        result.putString("status", "OK");
        try {
          ReferrerDetails response = mReferrerClient.getInstallReferrer();
          result.putString("url", response.getInstallReferrer());
          result.putString("clickTime", String.valueOf(response.getReferrerClickTimestampSeconds()));
          result.putString("appInstallTime", String.valueOf(response.getInstallBeginTimestampSeconds()));
          result.putBoolean("instantExperienceLaunched", response.getGooglePlayInstantParam());
        } catch (RemoteException e) {
          result.putString("error", e.getMessage());
          e.printStackTrace();
        } finally {
          mReferrerClient.endConnection();
        }

        break;
      }
      case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED: {
        result.putString("status", "FEATURE_NOT_SUPPORTED");
        break;
      }
      case InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE: {
        result.putString("status", "SERVICE_UNAVAILABLE");
        break;
      }
      case InstallReferrerClient.InstallReferrerResponse.DEVELOPER_ERROR: {
        result.putString("status", "DEVELOPER_ERROR");
        break;
      }
    }

    return result;
  }


  @NonNull
  @Override
  public String getName() {
    return "PlayInstallReferrerModule";
  }
}

