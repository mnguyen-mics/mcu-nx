class Plugins {
  async createPluginByApi(
    pluginType: string,
    organisationId: string,
    accessToken: string,
    groupId: string,
    artifactId: string,
  ) {
    const response = await fetch(`${Cypress.env('apiDomain')}/v1/plugins`, {
      method: 'POST',
      headers: { Authorization: accessToken, 'Content-type': 'application/json' },
      body: JSON.stringify({
        artifact_id: `${artifactId}`,
        group_id: `${groupId}`,
        organisation_id: `${organisationId}`,
        plugin_type: `${pluginType}`,
      }),
    });

    return response.json();
  }

  async createPluginVersionByApi(
    pluginId: any,
    versionId: any,
    accessToken: string,
    customPluginProperties?: any,
  ) {
    let json_body: object;
    customPluginProperties
      ? (json_body = {
          version_id: `${versionId}`,
          plugin_properties: [
            {
              technical_name: 'provider',
              value: {
                value: 'provider',
              },
              property_type: 'STRING',
              origin: 'PLUGIN_STATIC',
              writable: true,
              deletable: true,
            },
            customPluginProperties,
          ],
        })
      : (json_body = {
          version_id: `${versionId}`,
          plugin_properties: [
            {
              technical_name: 'provider',
              value: {
                value: '',
              },
              property_type: 'STRING',
              origin: 'PLUGIN_STATIC',
              writable: true,
              deletable: true,
            },
            {
              technical_name: 'name',
              value: {
                value: 'QA test',
              },
              property_type: 'STRING',
              origin: 'PLUGIN_STATIC',
              writable: true,
              deletable: true,
            },
          ],
        });
    const response = await fetch(`${Cypress.env('apiDomain')}/v1/plugins/${pluginId}/versions`, {
      method: 'POST',
      headers: { Authorization: accessToken, 'Content-type': 'application/json' },
      body: JSON.stringify(json_body),
    });
    return response.json();
  }
  async getAssetsByApi(organisationId: string, accessToken: string) {
    const response = await fetch(
      `${Cypress.env('apiDomain')}/v1/assets?organisation_id=${organisationId}`,
      {
        method: 'GET',
        headers: { Authorization: accessToken, 'Content-type': 'application/json' },
      },
    );
    return response.json();
  }
}

export default new Plugins();
