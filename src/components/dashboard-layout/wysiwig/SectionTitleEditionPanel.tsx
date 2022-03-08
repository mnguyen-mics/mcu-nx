import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { ChangeEvent } from 'react';
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { DashboardContentSection } from '../../../models/customDashboards/customDashboards';

const messages = defineMessages({
  sectionAddTitle: {
    id: 'section.edition.addTitle',
    defaultMessage: 'Add section title',
  },
});

export type VerticalDirection = 'up' | 'down';

interface SectionTitleEditionPanelProps {
  section?: DashboardContentSection;
  onSaveSection: (c: DashboardContentSection) => void;
  showButtonDown?: boolean;
  showButtonUp?: boolean;
  onClickMove?: (direction: VerticalDirection) => void;
  onClickDelete?: () => void;
}

type Props = InjectedIntlProps & SectionTitleEditionPanelProps;

interface SectionTitleEditionPanelState {
  title: string;
  editMode: boolean;
  section?: DashboardContentSection;
}

class SectionTitleEditionPanel extends React.Component<Props, SectionTitleEditionPanelState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: props.section ? props.section.title : '',
      editMode: false,
      section: props.section,
    };
  }

  handleEditClick = () => {
    this.setState({
      editMode: true,
    });
  };

  handleSaveClick = () => {
    const { section, onSaveSection } = this.props;
    const { title } = this.state;

    if (section) {
      const sectionCopy: DashboardContentSection = JSON.parse(JSON.stringify(section));
      sectionCopy.title = title;
      onSaveSection(sectionCopy);
      this.setState({
        editMode: false,
        section: sectionCopy,
      });
    }
  };

  handleCancelClick = () => {
    const { section } = this.props;

    this.setState({
      editMode: false,
      title: section ? section.title : '',
    });
  };

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value,
    });
  };

  renderTitleWithEditButton(title: string) {
    return (
      <div className='mcs-subtitle2'>
        {title}
        <EditOutlined className='mcs-chartIcon' onClick={this.handleEditClick} />
      </div>
    );
  }

  renderButtonCreateTitle() {
    const { intl } = this.props;

    const handleEditClick = this.handleEditClick.bind(this);

    return (
      <div className='mcs-subtitle2'>
        <Button type='dashed' onClick={handleEditClick}>
          {intl.formatMessage(messages.sectionAddTitle)}
        </Button>
      </div>
    );
  }

  renderTitleEditor(title: string) {
    return (
      <div className='mcs-subtitle2 mcs-subtitleEdit'>
        <Input value={title} onChange={this.handleInputChange} />
        <Button
          className='mcs-subtitleEdit_button'
          icon={<CheckOutlined />}
          onClick={this.handleSaveClick}
        />
        <Button
          className='mcs-subtitleEdit_button'
          icon={<CloseOutlined />}
          onClick={this.handleCancelClick}
        />
      </div>
    );
  }
  render() {
    const { showButtonDown, showButtonUp, onClickMove, onClickDelete } = this.props;
    const { title, editMode, section } = this.state;
    const hasTitle = section && section.title.length > 0;

    const onClickMoveUp = onClickMove ? () => onClickMove('up') : undefined;
    const onClickMoveDown = onClickMove ? () => onClickMove('down') : undefined;

    return (
      <div className='mcs-sectionTitleEditionPanel'>
        {editMode && this.renderTitleEditor(title)}
        {!editMode && hasTitle && this.renderTitleWithEditButton(title)}
        {!editMode && !hasTitle && this.renderButtonCreateTitle()}

        {(onClickMove || onClickDelete) && (
          <div className='mcs-subtitleEditPanel'>
            {showButtonDown && onClickMove && (
              <ArrowDownOutlined
                className='mcs-chartIcon mcs-sectionTitleEditionPanel_arrow_down'
                onClick={onClickMoveDown}
              />
            )}
            {showButtonUp && onClickMove && (
              <ArrowUpOutlined
                className='mcs-chartIcon mcs-sectionTitleEditionPanel_arrow_up'
                onClick={onClickMoveUp}
              />
            )}
            {onClickDelete && (
              <DeleteOutlined
                className='mcs-chartIcon mcs-sectionTitleEditionPanel_delete'
                onClick={onClickDelete}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default compose<Props, SectionTitleEditionPanelProps>(injectIntl)(SectionTitleEditionPanel);
