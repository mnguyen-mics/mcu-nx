export default interface AccessTokenResource {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
};