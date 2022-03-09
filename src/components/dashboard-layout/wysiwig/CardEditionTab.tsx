import { Button, Form, InputNumber, Row, Select } from 'antd';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { DashboardContentCard } from '../../../models/dashboards/old-dashboards-model';
import { FormInstance, Rule } from 'antd/lib/form';
import lodash from 'lodash';

interface CardEditionProps {
  card?: DashboardContentCard;
  saveCard: (c: DashboardContentCard) => void;
  deleteCard: () => void;
  closeTab: () => void;
}

interface SelectValue {
  value: string;
  label: string;
  key: string;
}

interface LabelValueOption {
  label: string;
  value: string;
}

type Props = InjectedIntlProps & CardEditionProps;

interface CardEditionState {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  layout?: string;
  contentErrorMessage?: string;
  form: React.RefObject<FormInstance>;
}

const messages = defineMessages({
  cardEditionEditCard: {
    id: 'card.edition.card.edit',
    defaultMessage: 'Edit card',
  },
  cardEditionSave: {
    id: 'card.edition.save',
    defaultMessage: 'Save',
  },
  cardEditionDelete: {
    id: 'card.edition.delete',
    defaultMessage: 'Delete card',
  },
  cardEditionSelectLayout: {
    id: 'card.edition.selectLayout',
    defaultMessage: 'Select layout',
  },
  cardEditionLayoutOptionV: {
    id: 'card.edition.layoutOptionV',
    defaultMessage: 'Vertical',
  },
  cardEditionLayoutOptionH: {
    id: 'card.edition.layoutOptionH',
    defaultMessage: 'Horizontal',
  },
  cardEditionLayoutEnterWidth: {
    id: 'card.edition.enterWidth',
    defaultMessage: 'Please enter the width',
  },
  cardEditionLayoutEnterHeight: {
    id: 'card.edition.enterHeight',
    defaultMessage: 'Please enter the height',
  },
  cardEditionLayoutEnterX: {
    id: 'card.edition.enterX',
    defaultMessage: 'Please enter the X position',
  },
  cardEditionLayoutEnterY: {
    id: 'card.edition.enterY',
    defaultMessage: 'Please enter the Y position',
  },
});

class CardEditionTab extends React.Component<Props, CardEditionState> {
  constructor(props: Props) {
    super(props);

    const { card } = this.props;

    if (card) {
      this.state = {
        x: card.x,
        y: card.y,
        w: card.w,
        h: card.h,
        layout: card.layout,
        form: React.createRef<FormInstance>(),
      };
    } else {
      this.state = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        layout: '',
        form: React.createRef<FormInstance>(),
      };
    }
  }

  private saveCard() {
    if (this.validate()) {
      const { x, y, w, h, layout, contentErrorMessage } = this.state;
      const { card, saveCard } = this.props;

      if (
        !contentErrorMessage &&
        typeof x === 'number' &&
        typeof y === 'number' &&
        typeof w === 'number' &&
        typeof h === 'number' &&
        layout
      ) {
        const cardToSave: DashboardContentCard = {
          x: x,
          y: y,
          w: w,
          h: h,
          layout: layout,
          charts: card ? card.charts : [],
        };

        try {
          saveCard(cardToSave);
        } catch (e) {
          return;
        }
      }
    }
  }

  validate = (): boolean => {
    const { form, contentErrorMessage } = this.state;
    let result = true;

    const formErrors: string[] =
      form && form.current
        ? lodash.flatMap(form.current.getFieldsError(), field => field.errors)
        : [];
    if (formErrors.length > 0 || contentErrorMessage) result = false;

    return result;
  };

  render() {
    const { card, closeTab, intl, deleteCard } = this.props;
    const { x, y, w, h, layout, form } = this.state;

    const onChangeX = (value: string | number) => {
      if (typeof value === 'number') {
        this.setState({
          x: value,
        });
      }
    };

    const onChangeY = (value: string | number) => {
      if (typeof value === 'number') {
        this.setState({
          y: value,
        });
      }
    };

    const onChangeW = (value: string | number) => {
      if (typeof value === 'number') {
        this.setState({
          w: value,
        });
      }
    };

    const onChangeH = (value: string | number) => {
      if (typeof value === 'number') {
        this.setState({
          h: value,
        });
      }
    };
    const onChangeLayout = (v: SelectValue) => {
      this.setState({
        layout: v.value,
      });
    };

    const saveCard = this.saveCard.bind(this);

    const generateRules = (msg: string): Rule[] => {
      return [
        {
          required: true,
          message: msg,
        },
      ];
    };

    const layouts: LabelValueOption[] = [
      {
        label: intl.formatMessage(messages.cardEditionLayoutOptionV),
        value: 'vertical',
      },
      {
        label: intl.formatMessage(messages.cardEditionLayoutOptionH),
        value: 'horizontal',
      },
    ];

    const initialValues = card
      ? {
          x: x,
          y: y,
          w: w,
          h: h,
          layout_select: layouts.find(l => l.value === layout),
        }
      : {};

    return (
      <div>
        <div className='mcs-chartEdition-header'>
          <span className='mcs-chartEdition-header-title'>
            {intl.formatMessage(messages.cardEditionEditCard)}
          </span>
          <CloseOutlined className='mcs-chartEdition-header-close' onClick={closeTab} />
        </div>
        <Form className='mcs-cardEdition-form' ref={form} initialValues={initialValues}>
          <div className='mcs-form-text'>Layout</div>
          <Form.Item
            name='layout_select'
            className='mcs-form-layout'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              showSearch={true}
              labelInValue={true}
              autoFocus={true}
              onChange={onChangeLayout}
              optionFilterProp='label'
              options={layouts}
            />
          </Form.Item>
          <Row className='mcs-form-row'>
            <div>
              <div className='mcs-form-text'>Width</div>
              <Form.Item
                name='w'
                className='mcs-row-input mcs-row-input_left'
                rules={generateRules(intl.formatMessage(messages.cardEditionLayoutEnterWidth))}
              >
                <InputNumber onChange={onChangeW} />
              </Form.Item>
            </div>
            <div>
              <div className='mcs-form-text'>Height</div>
              <Form.Item
                name='h'
                className='mcs-row-input'
                rules={generateRules(intl.formatMessage(messages.cardEditionLayoutEnterHeight))}
              >
                <InputNumber onChange={onChangeH} />
              </Form.Item>
            </div>
          </Row>
          <Row className='mcs-form-row'>
            <div>
              <div className='mcs-form-text'>x</div>
              <Form.Item
                name='x'
                className='mcs-row-input mcs-row-input_left'
                rules={generateRules(intl.formatMessage(messages.cardEditionLayoutEnterX))}
              >
                <InputNumber onChange={onChangeX} />
              </Form.Item>
            </div>
            <div>
              <div className='mcs-form-text'>y</div>
              <Form.Item
                name='y'
                className='mcs-row-input'
                rules={generateRules(intl.formatMessage(messages.cardEditionLayoutEnterY))}
              >
                <InputNumber onChange={onChangeY} />
              </Form.Item>
            </div>
          </Row>
        </Form>
        <div className={'mcs-chartEdition-submit-button-container'}>
          <Button
            className={'mcs-primary mcs-chartEdition-submit-button mcs-cardEdition-button'}
            type='primary'
            onClick={saveCard}
          >
            {intl.formatMessage(messages.cardEditionSave)}
          </Button>
          <Button
            className={'mcs-primary mcs-cardEdition-delete-button'}
            type='link'
            onClick={deleteCard}
          >
            {intl.formatMessage(messages.cardEditionDelete)}
          </Button>
        </div>
      </div>
    );
  }
}

const editionTab = compose<Props, CardEditionProps>(injectIntl)(CardEditionTab);
export default editionTab;
