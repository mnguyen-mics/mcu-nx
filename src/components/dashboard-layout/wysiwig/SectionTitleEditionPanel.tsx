import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
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

interface SectionTitleEditionPanelProps {
  section?: DashboardContentSection;
  onSaveSection: (c: DashboardContentSection) => void;
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

  handleEditClick() {
    this.setState({
      editMode: true,
    });
  }

  handleSaveClick() {
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
  }

  handleCancelClick() {
    const { section } = this.props;

    this.setState({
      editMode: false,
      title: section ? section.title : '',
    });
  }

  handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      title: e.target.value,
    });
  }

  renderTitleWithEditButton(title: string) {
    const handleEditClick = this.handleEditClick.bind(this);

    return (
      <div className='mcs-subtitle2'>
        {title}
        <EditOutlined className='mcs-chartIcon' onClick={handleEditClick} />
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
    const handleInputChange = this.handleInputChange.bind(this);
    const handleSaveClick = this.handleSaveClick.bind(this);
    const handleCancelClick = this.handleCancelClick.bind(this);

    return (
      <div className='mcs-subtitle2 mcs-subtitleEdit'>
        <Input value={title} onChange={handleInputChange} />
        <Button
          className='mcs-subtitleEdit_button'
          icon={<CheckOutlined />}
          onClick={handleSaveClick}
        />
        <Button
          className='mcs-subtitleEdit_button'
          icon={<CloseOutlined />}
          onClick={handleCancelClick}
        />
      </div>
    );
  }

  render() {
    const { title, editMode, section } = this.state;

    if (editMode) return this.renderTitleEditor(title);
    else
      return section && section.title.length > 0
        ? this.renderTitleWithEditButton(title)
        : this.renderButtonCreateTitle();
  }
}

export default compose<Props, SectionTitleEditionPanelProps>(injectIntl)(SectionTitleEditionPanel);
