import cuid from 'cuid';
import { FormattedMessage } from 'react-intl';

export interface FieldArrayModel<T = any> {
  key: string;
  model: T;
}

export interface FieldArrayModelWithMeta<T = any, Y = any> {
  key: string;
  model: T;
  meta: Y;
}

export interface ReduxFormChangeProps {
  formChange: (fieldName: string, value: any) => void;
}

export interface McsFormSection {
  id: string;
  title: FormattedMessage.MessageDescriptor;
  component: React.ReactNode;
}

// take the model id key if present
// usefull for domain object coming from api
export function createFieldArrayModel(model: {
  [key: string]: any;
}): FieldArrayModel {
  return {
    model: model,
    key: model.id || cuid(),
  };
}

export function createFieldArrayModelWithMeta(
  model: { [key: string]: any },
  meta: any,
): FieldArrayModelWithMeta {
  return {
    ...createFieldArrayModel(model),
    meta,
  };
}

export type Task<T = any> = () => Promise<T>;

export function executeTasksInSequence(tasks: Task[]): Promise<any> {
  return tasks.reduce((previousTask, task) => {
    return previousTask.then(() => {
      return task();
    });
  }, Promise.resolve());
}
