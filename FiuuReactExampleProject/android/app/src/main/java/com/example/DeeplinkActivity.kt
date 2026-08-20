package com.fiuu.xdkandroid

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity

class DeeplinkActivity : ReactActivity() {
  override fun getMainComponentName(): String = "example"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val incomingIntent = intent
    if (incomingIntent != null) {
      Log.d(TAG, "Deeplink received: ${incomingIntent.data}")
      if (isTaskRoot) {
        incomingIntent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
        incomingIntent.setClass(this, MainActivity::class.java)
        startActivity(incomingIntent)
        finish()
      } else {
        finish()
      }
    } else {
      Log.d(TAG, "Deeplink intent is null")
      finish()
    }
  }

  companion object {
    private const val TAG = "FiuuDeeplink"
  }
}
