import React from 'react';
import { KeyboardAvoidingView, View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import {colors, appContainer} from './styles/styles';
import apiHelpers from './utils/api-helpers';

export default class InsuranceDetailsPdp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      insuranceList: [],
    };
  }

  componentDidMount() {
    const hostUrl = this.props.hostUrl;
    const token = this.props.token;
    const policyId = this.props.policyId;
    let endpoint = '/self/user/policy?pageNumber=0&pageSize=200';
    apiHelpers
      .apiRequest(hostUrl, endpoint, {}, {}, 'GET', true, token)
      .then(responseJson => {
        if (responseJson.error) {
          this.props.postMessage('{"type":"error"}');
        } else {
          this.setState({
            isLoading: false,
            insuranceList: responseJson.data.filter((insurance) => insurance.id === policyId),
          });
        }
      })
      .catch(error => {
        this.props.postMessage('{"type":"error"}');
      });
  }

  render() {
    let {isLoading, insuranceList} = this.state;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={[appContainer.container, {paddingTop: 0}]}>
        {isLoading ?
          <View
            style={[
              {flex: 1, alignItems: 'center', justifyContent: 'center'},
            ]}>
            <ActivityIndicator size={35} color={colors.primary} />
          </View>
          :
          <ScrollView style={{paddingTop: 20, paddingHorizontal: 25}}>
            <Text style={[appContainer.textCenter, appContainer.heading]}>Listing - Fetched from API within sdk based on policy number passed from previous page</Text>
            {insuranceList.map((insurance, index) => (
              <View key={index} style={[appContainer.cardContainer]}>
                <View style={[appContainer.cardWrapper]}>
                  <View style={[appContainer.insuranceCard]}>
                    <View style={[appContainer.content, appContainer.p16]}>
                      <Text style={[appContainer.cardTitle]}>{insurance.policyType}</Text>
                      <Text style={[appContainer.cardSubtitle]}>Insurer: {insurance.insurer}</Text>
                      <Text style={[appContainer.cardSubtitle]}>PolicyNo: {insurance.policyNumber}</Text>
                    </View>
                    <View style={[appContainer.footer, appContainer.p16]}>
                      <TouchableOpacity style={[appContainer.borderedButton]} onPress={() => {this.props.postMessage('{"type":"redirect","goto":"insurance-details-pdp","extraParams":{"policyId":"'+insurance.id+'"}}');}}><Text style={[]}>View Policy</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        }
      </KeyboardAvoidingView>
    );
  }
}