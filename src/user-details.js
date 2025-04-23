import React from 'react';
import { KeyboardAvoidingView, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import {colors, appContainer} from './styles/styles';
import apiHelpers from './utils/api-helpers';

export default class UserDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fullName: "",
      mobile: "",
    };
  }

  componentDidMount() {
    const hostUrl = this.props.hostUrl;
    const token = this.props.token;
    const policyId = this.props.policyId;
    let endpoint = '/self/user';
    apiHelpers
      .apiRequest(hostUrl, endpoint, {}, {}, 'GET', true, token)
      .then(responseJson => {
        if (responseJson.error) {
          this.props.postMessage('{"type":"error"}');
        } else {
          this.setState({
            isLoading: false,
            fullName: responseJson.data.fullName,
            mobile: '+91 ' + responseJson.data.mobile,
          });
        }
      })
      .catch(error => {
        this.props.postMessage('{"type":"error"}');
      });
  }

  render() {
    let {isLoading, fullName, mobile} = this.state;
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
          <View style={{paddingTop: 20, paddingHorizontal: 25}}>
            <Text style={[appContainer.textCenter, appContainer.heading]}>My Profile - Fetched from API within sdk</Text>
            <Text style={[appContainer.userFname]}>{fullName}</Text>
            <Text style={[appContainer.userPhone, appContainer.textCenter, appContainer.subheading]}>{mobile}</Text>
            <TouchableOpacity onPress={() => {this.props.postMessage('{"type":"redirect","goto":"insurance-details"}');}} style={[appContainer.textCenter, appContainer.buttonDark]}><Text style={[appContainer.buttonText, appContainer.textCenter]}>Go to Insurance List</Text></TouchableOpacity>
          </View>
        }
      </KeyboardAvoidingView>
    );
  }
}