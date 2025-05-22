import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import fiuupayment from 'fiuu-mobile-xdk-reactnative';
console.log('Fiuu Payment:', fiuupayment);

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {

  const [paymentResult, setPaymentResult] = useState('');

  const handleFiuuPayment = () => {
    const paymentDetails = {

      // TODO : Enter your credentials
      'mp_merchant_ID': '',
      'mp_verification_key': '',

      'mp_order_ID': "",
      'mp_currency': '',
      'mp_country': '',

      'mp_username': '',
      'mp_password': '',
      'mp_app_name': '',

      'mp_channel': 'multi',
      // 'mp_allowed_channels': [],

      'mp_amount': '1.01', // Minimum 1.00 must be in 2 decimal points format
      'mp_bill_description': 'Test React XDK',
      'mp_bill_name': 'React XDK',
      'mp_bill_email': 'example@gmail.com',
      'mp_bill_mobile': '123456789',

      'mp_closebutton_display': true,

      //Google Pay
      //'mp_sandbox_mode': true,
      //'mp_extended_vcode': false,  // Optional : Set true if your account enabled extended Verify Payment


      //Apple Pay
      //'mp_express_mode': true,
      //'mp_allowed_channels': ['ApplePay'],
      //'mp_bill_description_eedit_disabled': false,
      //'mp_ap_merchant_ID': '',
      //'mp_channel': 'ApplePay',

    };

    fiuupayment.startMolpay(paymentDetails, (data: any) => {
      console.log('Fiuu Payment Result:', data);
      setPaymentResult(JSON.stringify(data));
      Alert.alert('Payment Result', JSON.stringify(data, null, 2));
    });
  };

  const handleGooglePay = () => {
    const paymentDetails = {
      'mp_sandbox_mode': true,

      // TODO : Enter your credentials
      'mp_merchant_ID': '',
      'mp_verification_key': '',

      'mp_order_ID': "",
      'mp_currency': '',
      'mp_country': '',

      'mp_amount': '1.01', // Minimum 1.00 must be in 2 decimal points format
      'mp_bill_description': 'Test Google Pay',
      'mp_bill_name': 'GPay',
      'mp_bill_email': 'example@gmail.com',
      'mp_bill_mobile': '123456789',
      'mp_extended_vcode': false,  // Optional : Set true if your account enabled extended Verify Payment
    };

    fiuupayment.startMolpay(paymentDetails, (data: any) => {
      console.log('Fiuu Payment Result:', data);
      setPaymentResult(JSON.stringify(data));
      Alert.alert('Payment Result', JSON.stringify(data));
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.title}>RN Fiuu Payment Sample! 👋</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>💳 Fiuu XDK</Text>
          <Button title="Pay Now" onPress={handleFiuuPayment} />
        </View>

        {Platform.OS === 'android' && (
          <View style={styles.card}>
            <Text style={styles.subtitle}>🧾 Google Pay</Text>
            <Button title="Pay With Google" onPress={handleGooglePay} />
          </View>)}
      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 50,
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 5,
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor: '#A1CEDC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  reactLogo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  wave: {
    fontSize: 40,
  },
  stepContainer: {
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default App;
