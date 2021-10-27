import * as React from 'react';
import { compose } from 'recompose';
import { List, Spin, Input } from 'antd';
import * as InfiniteScroll from 'react-infinite-scroller';
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';

const messages = defineMessages({
  searchBarPlaceholder: {
    id: 'settings.services.infinite.scroll.searchBar.placeholder',
    defaultMessage: 'Enter your search here',
  },
  loadingSearchBarPlaceholder: {
    id: 'settings.services.infinite.scroll.loading.data.searchBar.placeholder',
    defaultMessage: 'Loading, please wait....',
  },
});

const InputSearch = Input.Search;

export interface InfiniteListFilters {
  page?: number;
  pageSize?: number;
  keywords?: string;
}

export interface InfiniteListProps<T = any> {
  className?: string;
  fetchData: (filter: InfiniteListFilters) => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  storeItemData: (item: T) => void;
}

type Props<T = any> = InfiniteListProps<T> & InjectedIntlProps;

interface State<T> {
  data: T[];
  loading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  first: number;
  size: number;
}

const initialPage = 0;
const initialPageSize = 12;

class InfiniteList<T> extends React.Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      initialLoading: false,
      hasMore: true,
      first: initialPage,
      size: initialPageSize,
    };
  }

  componentDidMount() {
    this.setState({
      initialLoading: true,
    });
    this.handleInfiniteOnLoad().then((data: T[]) => {
      if (data[0]) {
        this.props.storeItemData(data[0]);
      }
      this.setState({
        initialLoading: false,
      });
    });
  }

  handleInfiniteOnLoad = (): Promise<T[] | void> => {
    const { first, size, loading } = this.state;

    if (!loading) {
      this.setState({
        loading: true,
      });

      return this.props
        .fetchData({ page: first, pageSize: size })
        .then(res => {
          this.setState(prev => ({
            data: prev.data.concat(res),
            loading: false,
            hasMore: res.length === size,
            first: first + size,
          }));
          return res;
        })
        .catch(err => {
          this.setState({
            loading: false,
          });
          throw err;
        });
    }
    return Promise.resolve();
  };

  onSearch = (searchValue: string) => {
    this.props
      .fetchData({
        keywords: searchValue,
      })
      .then(res => {
        if (res[0]) {
          this.setState({
            data: res,
            loading: false,
            hasMore: res.length === initialPageSize,
            first: initialPageSize + 1,
          });
          this.props.storeItemData(res[0]);
        }
      });
  };

  onChange = (e: any) => {
    this.onSearch(e.target.value);
  };

  render() {
    const { intl, className } = this.props;
    const { data, loading, hasMore, initialLoading } = this.state;
    return (
      <div className={`mcs-infinite-list ${className ? className : ''}`}>
        <InfiniteScroll
          initialLoad={false}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          {initialLoading ? (
            <div>
              <InputSearch
                placeholder={intl.formatMessage(messages.loadingSearchBarPlaceholder)}
                className='mcs-infinite-list-searchbar'
                disabled={true}
              />
              <div className='mcs-infinite-list-loading'>
                <Spin />
              </div>
            </div>
          ) : (
            <div>
              <InputSearch
                placeholder={intl.formatMessage(messages.searchBarPlaceholder)}
                onSearch={this.onSearch}
                className='mcs-infinite-list-searchbar'
                onChange={this.onChange}
              />
              <List
                dataSource={data}
                renderItem={this.props.renderItem}
                className='mcs-infinite-list-items'
              >
                {loading && hasMore && (
                  <div className='mcs-infinite-list-loading'>
                    <Spin />
                  </div>
                )}
              </List>
            </div>
          )}
        </InfiniteScroll>
      </div>
    );
  }
}

export default compose<Props, InfiniteListProps>(injectIntl)(InfiniteList);
