interface CommonItemsProps {
  adGroupCampaign?: {
    [key: string]: {
      ad_group_id: string;
      campaign_id: string;
    };
  };
  adAdGroup?: {
    [key: string]: {
      ad_group_id: string;
      campaign_id: string;
    };
  };
  isLoading: boolean;
  isUpdating: boolean;
  isArchiving: boolean;
}

export interface ItemsById<T> extends CommonItemsProps {
  items: { [key: string]: T };
}