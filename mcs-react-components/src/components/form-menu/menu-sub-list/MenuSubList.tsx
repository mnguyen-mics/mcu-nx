import * as React from 'react';
import * as cuid from 'cuid';
import { Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import McsIcon from '../../mcs-icon';

export interface SubMenu {
  title: string;
  select: React.FormEventHandler<any>;
}

export interface MenuSubListProps {
  className?: string;
  title: string;
  subtitles: string[];
  submenu: SubMenu[] | (() => Promise<SubMenu[]>);
}

export interface MenuSubListState {
  open: boolean;
  fetchedMenu: SubMenu[];
  fetching: boolean;
  fetched: boolean;
}

type Props = MenuSubListProps;

class MenuSubList extends React.Component<Props, MenuSubListState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      fetching: false,
      fetched: false,
      fetchedMenu: [],
    };
  }

  fetchSubmenu = () => {
    const { submenu } = this.props;
    if (typeof submenu === 'function') {
      this.setState({ fetching: true });
      submenu()
        .then(menu => {
          this.setState({
            fetching: false,
            fetched: true,
            fetchedMenu: menu,
          });
        })
        .catch(() => {
          this.setState({ fetching: false });
        });
    }
  };

  openMenuItem = () => {
    const { fetched } = this.state;
    if (!fetched) this.fetchSubmenu();
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    const { title, subtitles, submenu, className } = this.props;

    const { fetching, fetchedMenu } = this.state;

    let displayMenu: SubMenu[] = fetchedMenu;
    if (Array.isArray(submenu)) {
      displayMenu = submenu;
    }

    return (
      <div className={`mcs-menu-sub-list ${className ? className : ''}`}>
        <button
          className={this.state.open ? 'menu-item opened' : 'menu-item'}
          onClick={this.openMenuItem}
        >
          <div className={subtitles ? 'content' : 'content alone'}>
            <div className='title'>{title}</div>
            {subtitles ? (
              <div className='subtitles'>
                {subtitles.map((subtitle, index) => {
                  return index !== subtitles.length - 1 ? `${subtitle}, ` : subtitle;
                })}
              </div>
            ) : null}
          </div>
          <div className='selector'>
            <McsIcon type={this.state.open ? 'minus' : 'plus'} />
          </div>
        </button>
        {this.state.open && (
          <div>
            {fetching && (
              <div className='menu-item small'>
                <div className='content alone small text-center'>
                  <Spin />
                </div>
              </div>
            )}
            {!fetching && !displayMenu.length && (
              <div className='menu-item small'>
                <div className='content alone small text-center'>
                  <FormattedMessage
                    id='components.formMenu.menuSubList.empty'
                    defaultMessage='Empty'
                  />
                </div>
              </div>
            )}
            {!fetching &&
              displayMenu.map(sub => {
                return (
                  <button key={cuid()} className='menu-item small' onClick={sub.select}>
                    <div className='content alone small'>
                      <div className='subtitles'>{sub.title}</div>
                    </div>
                    <div className='selector'>
                      <McsIcon type={'chevron-right'} />
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

export default MenuSubList;
