const formattedHttpErrorCode = code => {
  if ([502, 503].includes(code)) {
    code = 502;
  }
  return code;
};

const apiHelpers = {
  apiRequest: async (
    domain,
    endpoint,
    body,
    headers,
    method = 'GET',
    form_url = true,
    authT = false,
    multipart = false,
    apiType = null,
    version = null,
    skipCaching = false,
    signal = null,
  ) => {
    if (version === null || version === false) {
      version = 'v1';
    }
    if (apiType === null || apiType === false) {
      apiType = 'ca';
    }
    let baseEndpoint = `${domain}/api/${apiType}/${version}`;
    let url = form_url ? `${baseEndpoint}${endpoint}` : endpoint;
    let methodType = method ? method : 'GET';
    let options = {
      method: methodType,
      headers: {
        Accept: 'application/json',
        'Content-Type': multipart ? 'multipart/form-data' : 'application/json',
        'Accept-Language': 'en',
        ...headers,
      },
      signal: signal,
    };

    if (authT) {
      options.headers.Authorization = authT;
    }
    if (['POST', 'PATCH'].includes(methodType)) {
      options.body = multipart ? body : JSON.stringify(body);
    }

    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(response => {
          response
            .json()
            .then(async res => {
              if (
                response.status !== 200 &&
                !(res.message && res.message !== '')
              ) {
                res.message = "Unexpected error";
              }
              resolve({
                code: formattedHttpErrorCode(response.status),
                error: response.status !== 200,
                data: res,
              });
            })
            .catch(async error => {
              if (methodType === 'DELETE') {
                resolve({
                  code: formattedHttpErrorCode(response.status),
                  error: response.status !== 200,
                  data:
                    response.status === 200
                      ? {}
                      : {message: "Unexpected error"},
                });
                return true;
              }
              resolve({
                code: response.status
                  ? formattedHttpErrorCode(response.status)
                  : false,
                error: true,
                data: {message: "Unexpected error"},
              });
            });
        })
        .catch(async error => {
          if (signal && signal.aborted) {
            resolve({code: false, error: true, data: {aborted: true}});
          } else {
            resolve({
              code: false,
              error: true,
              data: {message: "Unexpected error"},
            });
          }
        });
    });
  },
};

export default apiHelpers;
