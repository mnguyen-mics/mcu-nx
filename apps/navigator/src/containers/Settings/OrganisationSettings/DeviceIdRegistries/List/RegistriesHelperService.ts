import { DeviceIdRegistryDatamartSelectionResource } from '../../../../../models/deviceIdRegistry/DeviceIdRegistryResource';
import { IDatamartService } from '@mediarithmics-private/advanced-components';
import { injectable } from 'inversify';
import { Action } from 'redux';
import { lazyInject } from '../../../../../config/inversify.config';
import { TYPES } from '../../../../../constants/types';
import { IDeviceIdRegistryService } from '../../../../../services/DeviceIdRegistryService';
import { getPaginatedApiParam } from '../../../../../utils/ApiHelper';
import { executeTasksInSequence, Task } from '../../../../../utils/PromiseHelper';

@injectable()
export default class RegistriesHelperService {
  @lazyInject(TYPES.IDatamartService)
  private _datamartService: IDatamartService;

  @lazyInject(TYPES.IDeviceIdRegistryService)
  private _deviceIdRegistryService: IDeviceIdRegistryService;

  selectAllDatamarts(
    organisationId: string,
    deviceIdRegistryId: string,
    notifyError: (err: any, notifConfig?: any) => Action<any>,
  ): Promise<void> {
    const datamartsOptions = {
      archived: false,
      ...getPaginatedApiParam(1, 1000),
    };

    return this._datamartService
      .getDatamarts(organisationId, datamartsOptions)
      .then(res => {
        return res.data.length > 0
          ? this._deviceIdRegistryService.updateDeviceIdRegistryDatamartSelections(
              organisationId,
              deviceIdRegistryId,
              res.data.map(datamart => datamart.id),
            )
          : Promise.resolve();
      })
      .catch(err => {
        notifyError(err);
      });
  }

  updateDatamartSelections(
    organisationId: string,
    deviceIdRegistryId: string,
    selectedDatamartIds: string[],
    previousSelections: DeviceIdRegistryDatamartSelectionResource[],
    notifyError: (err: any, notifConfig?: any) => Action<any>,
  ): Promise<void> {
    const updateSelectionsP = (): Promise<any> => {
      if (selectedDatamartIds.length === 0 && previousSelections.length !== 0) {
        const deleteTasks: Task[] = [];
        previousSelections.forEach(selection => {
          deleteTasks.push(() =>
            this._deviceIdRegistryService.deleteDeviceIdRegistryDatamartSelection(
              selection.id,
              selection.datamart_id,
            ),
          );
        });
        return executeTasksInSequence(deleteTasks);
      } else if (selectedDatamartIds.length === 0 && previousSelections.length === 0) {
        return Promise.resolve();
      } else {
        return this._deviceIdRegistryService.updateDeviceIdRegistryDatamartSelections(
          organisationId,
          deviceIdRegistryId,
          selectedDatamartIds,
        );
      }
    };

    return updateSelectionsP().catch(err => {
      notifyError(err);
    });
  }
}
