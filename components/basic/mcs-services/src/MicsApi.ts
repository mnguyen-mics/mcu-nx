import auth from "./AuthenticationStorage";
import { DefaultApi, Configuration } from "mcs-public-api/lib";

export * from "mcs-public-api/lib";

export default new DefaultApi(
  new Configuration({ apiKey: auth.getAccessToken })
);
