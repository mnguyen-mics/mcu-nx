export interface Mics {
  init: (siteToken: string) => void;
  push: (eventName: string, properties: any) => void;
  addProperty: (propertyType: string, property: any) => void;
}

export interface MicsWindow extends Window {
  mics: any;
}

export default {
  pushPageView: (datalayer?: any): void => {
    if ((window as MicsWindow).mics && (window as MicsWindow).mics.push) {
      (window as MicsWindow).mics.push("PageView",  datalayer ? datalayer : {})
    }
  },
  addUserAccountProperty: (userAccountId: string): void => {
    if ((window as MicsWindow).mics && (window as MicsWindow).mics.push) {
      (window as MicsWindow).mics.addProperty("$user_account_id", userAccountId)
    }
  },
  setUserProperties: (user: { id: string }): void => {
    if ((window as MicsWindow).mics && (window as MicsWindow).mics.push) {
      (window as MicsWindow).mics.addProperty("$set_user_profile_properties", {
        '$user_account_id': user.id
      })
    }
  }
}