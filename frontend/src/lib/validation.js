
/*
validation logic 
*/

import moment from 'moment'
import RoutingConstants from './RoutingConstants';
import { post } from './api';

export function validateInputs(type, inputText) {
  switch (type) {
  case 'string': {
    // const strings = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};^':"\\|,.<>/?]*$/i;
    // const strings = /^[A-Za-z]\w*$/i;
    const strings = /^[a-zA-Z][A-Za-z0-9'\-,#$%^&*!~@./\s]+$/i;
    if (inputText && inputText.match(strings)) {
      return true;
    }
    return false;
  }
  case 'alphabetics':
    if (inputText) {
      const alphabetics = /^[a-zA-Z][a-zA-Z\s]+$/i;
      return alphabetics.test(inputText);
    }
    return false;
  case 'number': {
    const numbers = /^[0-9]+$/i;
    return numbers.test(inputText);
  }
  case 'email': {
    const emails = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emails.test(inputText);
  }
  case 'phone': {
    const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (inputText.match(phoneno)) {
      return true;
    }
    return false;
  }
  case 'password': {
    const passwordExpression = new RegExp('^(?=.{8,})((?=.*[0-9])|(?=.*[!@#%&]))');
    if (inputText && inputText.match(passwordExpression)) {
      return true;
    }
    return false;
  }
  case 'website': {
    const webReg = /^(http[s]?:\/\/){0,1}(www\.){1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/;
    if (webReg.test(inputText)) {
      return true;
    }
    return false;
  }
  default:
  }
  return type;
}
export function sortByKey(key, desc) {
  return (a, b) => {
    let nameA = a[key];
    if (nameA) {
      nameA = nameA.toUpperCase(); // ignore upper and lowercase
    }
    else {
      nameA = 'Z';
    }
    let nameB = b[key]; // ignore upper and lowercase
    if (nameB) {
      nameB = nameB.toUpperCase(); // ignore upper and lowercase
    }
    else {
      nameB = 'Z';
    }
    if (desc === 'asc') {
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    }
    else {
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
    }
    return 0;
    // return desc ? ~(a[key] < b[key]) : ~(a[key] > b[key]);
  };
}

export async function newRefreshToken(detail, id) {
  const url = RoutingConstants.getNewToken;
  let data;
  detail.companyId = id
  await post(url, detail).then((response) => {
    localStorage.setItem('connect',moment().format('DD-MM-YYYY H:mm:s'))
    data = response.result
  }).catch(err => {
    console.log(err);
  });
  return data
}
