import React, { useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import fiuupayment, { FiuuPaymentDetails } from 'fiuu-mobile-xdk-reactnative';

type LastResponse = {
  flow: 'Fiuu XDK' | 'Google Pay' | 'Apple Pay';
  status: 'success' | 'pending' | 'error';
  message: string;
  timestamp: string;
};

const PENDING_BACKEND_NOTE =
  'Payment is pending. Do not fulfill or settle this order until your backend confirms the final status.';

function resolveStatusFromPayload(
  payload: unknown,
  fallback: LastResponse['status']
): LastResponse['status'] {
  if (typeof payload !== 'object' || payload === null) {
    return fallback;
  }

  const statCode = String(
    (payload as { StatCode?: string; status_code?: string }).StatCode ??
      (payload as { status_code?: string }).status_code ??
      ''
  );

  if (statCode === '00') {
    return 'success';
  }
  if (statCode === '22') {
    return 'pending';
  }
  if (statCode !== '') {
    return 'error';
  }
  return fallback;
}

function alertTitleForStatus(status: LastResponse['status']): string {
  if (status === 'success') {
    return 'Payment Result';
  }
  if (status === 'pending') {
    return 'Payment Pending';
  }
  return 'Payment Failed';
}

function App(): React.JSX.Element {
  const [lastResponse, setLastResponse] = useState<LastResponse | null>(null);
  const [paymentInFlight, setPaymentInFlight] = useState(false);

  const generateOrderId = (): string => {
    const randomSuffix = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');
    return `${Date.now()}${randomSuffix}`;
  };

  const captureResponse = (
    flow: LastResponse['flow'],
    status: LastResponse['status'],
    payload: unknown
  ) => {
    const resolvedStatus = resolveStatusFromPayload(payload, status);
    const resolvedPayload = payload;

    const message =
      typeof resolvedPayload === 'string'
        ? resolvedPayload
        : JSON.stringify(resolvedPayload, null, 2);

    const displayMessage =
      resolvedStatus === 'pending'
        ? `${message}\n\n${PENDING_BACKEND_NOTE}`
        : message;

    if (__DEV__) {
      console.log(`[${flow}] ${resolvedStatus}:`, resolvedPayload);
    }

    setLastResponse({
      flow,
      status: resolvedStatus,
      message: displayMessage,
      timestamp: new Date().toLocaleTimeString(),
    });

    Alert.alert(alertTitleForStatus(resolvedStatus), displayMessage);
    setPaymentInFlight(false);
  };

  const startPayment = (
    flow: LastResponse['flow'],
    paymentDetails: FiuuPaymentDetails
  ) => {
    if (paymentInFlight) {
      return;
    }

    setPaymentInFlight(true);
    fiuupayment.startFiuu(
      paymentDetails,
      (data) => captureResponse(flow, 'success', data),
      (error) => captureResponse(flow, 'error', error)
    );
  };

  const handleFiuuPayment = () => {
    const paymentDetails = {
      // TODO: Enter your sandbox credentials
      mp_username: 'username',
      mp_password: 'password',
      mp_merchant_ID: 'merchantID',
      mp_app_name: 'appname',
      mp_verification_key: 'verificationkey',
      mp_order_ID: generateOrderId(),
      mp_currency: 'MYR',
      mp_country: 'MY',
      mp_channel: 'multi',
      mp_amount: '1.01',
      mp_bill_description: 'Test React XDK',
      mp_bill_name: 'React XDK',
      mp_bill_email: 'example@gmail.com',
      mp_bill_mobile: '123456789',
      mp_closebutton_display: true,
      mp_core_env:'1',
      mp_extended_vcode: true,
    };

    startPayment('Fiuu XDK', paymentDetails);
  };

  const handleGooglePay = () => {
    const paymentDetails = {
      mp_sandbox_mode: true,
      // TODO: Enter your sandbox credentials
      mp_merchant_ID: 'merchantid',
      mp_verification_key: 'verificationkey',
      mp_order_ID: generateOrderId(),
      mp_currency: 'MYR',
      mp_country: 'MY',
      mp_gpay_channel: ['SHOPEEPAY', 'TNG-EWALLET', 'CC'],
      mp_amount: '1.01',
      mp_bill_description: 'Test Google Pay',
      mp_bill_name: 'GPay',
      mp_bill_email: 'example@gmail.com',
      mp_bill_mobile: '123456789',
      mp_core_env: '4',
      mp_company: 'TEST',
      mp_extended_vcode: true,
    };

    startPayment('Google Pay', paymentDetails);
  };

  const handleApplePay = () => {
    const paymentDetails = {
      mp_express_mode: true,
      mp_allowed_channels: ['ApplePay'],
      mp_channel: 'ApplePay',
      // TODO: Enter your sandbox credentials
      mp_merchant_ID: 'merchantid',
      mp_verification_key: 'verificationkey',
      // TODO: Enter your Apple Pay merchant ID from Apple Developer portal
      mp_ap_merchant_ID: '',
      mp_order_ID: generateOrderId(),
      mp_currency: 'MYR',
      mp_country: 'MY',
      mp_amount: '1.01',
      mp_bill_description: 'Test Apple Pay',
      mp_bill_name: 'Apple Pay',
      mp_bill_email: 'example@gmail.com',
      mp_bill_mobile: '123456789',
      mp_extended_vcode: true,
    };

    startPayment('Apple Pay', paymentDetails);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.title}>Fiuu XDK React Native</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Fiuu XDK</Text>
          <Button
            title="Pay Now"
            onPress={handleFiuuPayment}
            disabled={paymentInFlight}
          />
        </View>

        {Platform.OS === 'android' && (
          <View style={styles.card}>
            <Text style={styles.subtitle}>Google Pay</Text>
            <Button
              title="Pay With Google"
              onPress={handleGooglePay}
              disabled={paymentInFlight}
            />
          </View>
        )}

        {Platform.OS === 'ios' && (
          <View style={styles.card}>
            <Text style={styles.subtitle}>Apple Pay</Text>
            <Button
              title="Pay With Apple"
              onPress={handleApplePay}
              disabled={paymentInFlight}
            />
          </View>
        )}

        {lastResponse && (
          <View
            style={[
              styles.card,
              lastResponse.status === 'success'
                ? styles.responseCardSuccess
                : lastResponse.status === 'pending'
                  ? styles.responseCardPending
                  : styles.responseCardError,
            ]}
          >
            <Text style={styles.subtitle}>
              {lastResponse.status === 'success'
                ? 'Success'
                : lastResponse.status === 'pending'
                  ? 'Pending'
                  : 'Error'}
              {' — '}
              {lastResponse.flow} ({lastResponse.timestamp})
            </Text>
            <Text style={styles.responseText}>{lastResponse.message}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 5,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  responseCardSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  responseCardPending: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  responseCardError: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  responseText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#343a40',
  },
});

export default App;
