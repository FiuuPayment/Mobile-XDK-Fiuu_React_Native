/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Alert,
  Button,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import fiuupayment from 'fiuu-mobile-xdk-reactnative';
console.log('Fiuu Payment:', fiuupayment);

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  const [paymentResult, setPaymentResult] = useState('');

  const handleFiuuPayment = () => {
    const paymentDetails = {

      'mp_sandbox_mode': true,

      // TODO : Enter your credentials
      'mp_merchant_ID': 'SB_molpayxdk',
      'mp_verification_key': '4445db44bdb60687a8e7f7903a59c3a9',

      // "mp_merchant_ID": "rmsxdk_mobile_Dev",
      // "mp_verification_key": 'ee738b541eff7b6b495e44771f71c0ec',

      'mp_order_ID': "orderId11212aa",
      'mp_currency': 'MYR',
      'mp_country': 'MY',

      // 'mp_username': 'RMSxdk_SB',
      // 'mp_password': 'RMSpwd@RmS_Sb!p@s$wd',
      // 'mp_app_name': 'molpayxdk',

      'mp_username': 'RMSxdk_2022',
      'mp_password': 'RMSpwd@2022',
      'mp_app_name': 'mobile',

      'mp_channel': 'multi',
      // 'mp_allowed_channels': ['RPP_RTP_CIMBCLICKS', 'RPP_RTP_MB2U', 'RPP_RTP_MBSB'],

      'mp_amount': '1.01', // Minimum 1.00 must be in 2 decimal points format
      'mp_bill_description': 'Test React XDK',
      'mp_bill_name': 'React XDK',
      'mp_bill_email': 'example@gmail.com',
      'mp_bill_mobile': '123456789',
      'mp_extended_vcode': false,

      "mp_closebutton_display": true,

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
      'mp_merchant_ID': 'SB_molpayxdk',
      'mp_verification_key': '4445db44bdb60687a8e7f7903a59c3a9',

      'mp_order_ID': "orderId11212",
      'mp_currency': 'MYR',
      'mp_country': 'MY',

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
