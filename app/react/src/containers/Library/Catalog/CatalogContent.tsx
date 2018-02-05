import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'redux';
import CatalogService from '../../../services/Library/CatalogService'
import { getDefaultDatamart } from '../../../state/Session/selectors';
import { connect } from 'react-redux';
import { Datamart } from '../../../models/organisation/organisation';
import { CatalogRessource, CategoryRessource, ItemRessource } from '../../../models/catalog/catalog';
import Card from '../../../components/Card/Card'
import CatalogItemTable from './CatalogItemTable'
import McsIcon from '../../../components/McsIcon'
import { ButtonStyleless } from '../../../components'
import { Select, Table, Breadcrumb, Icon } from 'antd';
import * as actions from '../../../state/Notifications/actions';
import messages from './messages'


const Option = Select.Option;

export interface CatalogContentProps {
  defaultDatamart: (organisationId: string) => Datamart;
  notifyError: (err: any) => void;
}

export interface Category extends CategoryRessource {
  hasSubCategory: boolean;
  hasItems: boolean;
  subItems: ItemRessource[];
}

interface CatalogContentState {
  catalogs: {
    items: CatalogRessource[];
    selectedId?: string;
    loading: boolean
  },
  categories: {
    items: Category[];
    loading: boolean;
  },
  path: Category[];
}

type Props = CatalogContentProps & RouteComponentProps<{ organisationId: string }> & InjectedIntlProps;

class CategoryTable extends Table<Category> {}

class CatalogContent extends React.Component<
  Props,
  CatalogContentState
> {

  constructor(props: Props) {
    super(props);
    this.state = {
      catalogs: {
        items: [],
        selectedId: undefined,
        loading: true,
      },
      categories: {
        items: [],
        loading: true,
      },
      path: [],
    }
  }

  componentDidMount() {
    const {
      match: {
        params: {
          organisationId
        }
      },
      defaultDatamart,
    } = this.props;
    this.fetchCatalog(defaultDatamart(organisationId).id);
  }
  
  componentWillReceiveProps(nextProps: Props) {
    const {
      match: {
        params: {
          organisationId
        }
      },
    } = this.props;

    const {
      match: {
        params: {
          organisationId: nextOrganisationId,
        }
      },
      defaultDatamart,
    } = nextProps;

    if (organisationId !== nextOrganisationId) {
      this.fetchCatalog(defaultDatamart(nextOrganisationId).id);
    }
  }
  
  fetchCatalog = (datamatId: string) => {
    const getSelectedCatalogId = (catalogs: CatalogRessource[]) => {
      return this.state.catalogs.selectedId ? this.state.catalogs.selectedId : catalogs && catalogs[0].token;
    }
    CatalogService.getCatalogs(datamatId)
      .then(res => res.data)
      .then(catalogs => {
        this.setState({ catalogs: { loading: false, items: catalogs, selectedId: getSelectedCatalogId(catalogs) } })
        return getSelectedCatalogId(catalogs)
      })
      .then(selectedCategory => this.fetchInitialCategories(datamatId, selectedCategory))
      .catch(err => this.handleError(err))
  }

  fetchInitialCategories = (datamartId: string, catalogToken: string) => {
    CatalogService.getCatalogMainCategories(datamartId, catalogToken, { depth: 0, first_result: 0, max_results: 500 })
      .then(res => res.data)
      .then(res => {
        const promises = res.map(category => {
          return CatalogService.getCatalogSubCategories(datamartId, catalogToken, category.category_id)
            .then(r => r.data)
            .then(r => { return {...category, hasSubCategory: r.length > 0 ? true : false } })
            .then(r => {
              return r.hasSubCategory ? CatalogService.getCatalogCategoryItems(datamartId, catalogToken, category.category_id, { first_result: 0, max_results: 500 })
                .then(i => i.data)
                .then(i => { return {...r, hasItems: i.length > 0 ? true : false, subItems: i } }) : {...r, hasItems: false, subItems: []}
            })
        })
        return Promise.all(promises)
      })
      .then(categories => this.setState({ categories: { items: categories, loading: false } }))
      .catch(err => this.handleError(err))
  }

  handleError = (err: any) => {
    this.props.notifyError(err);
    this.setState({
      path: [],
      catalogs: {
        ...this.state.catalogs,
        loading: false,
      },
      categories: {
        ...this.state.categories,
        loading: false,
      },
    })
  }

  fetchSubCategories = (datamartId: string, catalogToken: string, categoryId: string) => {
    this.setState({
      categories: {
        items: this.state.categories.items,
        loading: true,
      }
    }, () => {
      CatalogService.getCatalogSubCategories(datamartId, catalogToken, categoryId, { depth: 0, first_result: 0, max_results: 500 })
        .then(res => res.data)
        .then(res => {
          const promises = res.map(category => {
            return CatalogService.getCatalogSubCategories(datamartId, catalogToken, category.category_id)
              .then(r => r.data)
              .then(r => { return {...category, hasSubCategory: r.length > 0 ? true : false } })
              .then(r => {
                return r.hasSubCategory ? {...r, hasItems: false, subItems: []} : CatalogService.getCatalogCategoryItems(datamartId, catalogToken, category.category_id)
                  .then(i => i.data)
                  .then(i => { return {...r, hasItems: i.length > 0 ? true : false, subItems: i } }) 
              })
          })
          return Promise.all(promises)
        })
        .then(categories => this.setState({ categories: { items: categories, loading: false } }))
        .catch(err => this.handleError(err))
    })
  }

  handleCatalogChange = (value: string) => {
    const {
      defaultDatamart,
      match: {
        params: {
          organisationId,
        },
      },
    } = this.props;

   this.setState({
     path: [],
     catalogs: {
       items: this.state.catalogs.items,
       loading: false,
       selectedId: value,
     },
     categories: {
       ...this.state.categories,
       loading: true,
     },
   }, () => this.fetchInitialCategories(defaultDatamart(organisationId).id, value));
  
  }

  generateCatalogSelect = () => {
    return this.state.catalogs.items.length ? (
      <Select defaultValue={this.state.catalogs.selectedId} style={{ minWidth: 120 }} onChange={this.handleCatalogChange}>
        {this.state.catalogs.items.map(catalog => {
          return <Option key={catalog.token} value={catalog.token}>{catalog.token}</Option>
        })}
      </Select>
    ) : null
  }

  generateBreadcrumb = () => {
    const {
      defaultDatamart,
      match: {
        params: {
          organisationId
        }
      }
    } = this.props;

    const onHomeClick = () => {
      this.setState({ path: [], categories: { items: [], loading: true } }, () => {
        if (this.state.catalogs.selectedId) {
          this.fetchInitialCategories(defaultDatamart(organisationId).id, this.state.catalogs.selectedId)
        }
      })
    }
    const onCategoryClick = (item: Category) => () => {
      const newPath = [ ... this.state.path ];
      const index = newPath.findIndex(i => i.category_id === item.category_id);
      this.setState({ path: newPath.slice(0, index + 1) }, () => {
        if (this.state.catalogs.selectedId) {
          this.fetchSubCategories(defaultDatamart(organisationId).id, this.state.catalogs.selectedId, item.category_id)
        }
      })
      
    }

    return  (
      <Breadcrumb style={{ marginBottom: 14 }}>
        <Breadcrumb.Item>
          <ButtonStyleless onClick={onHomeClick}>
            <Icon type="home" /> { this.state.catalogs.selectedId }
          </ButtonStyleless>
        </Breadcrumb.Item>
        {this.state.path.map((item, i) => {
          return (
            <Breadcrumb.Item key={item.category_id}>
              {i === this.state.path.length -1 ? item.category_id : <ButtonStyleless onClick={onCategoryClick(item)}>
                {item.category_id}
              </ButtonStyleless>}
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    )
  }

  renderEmbededView = (record: Category) => {
    const {
      intl
    } = this.props;
    return record.hasItems ? <CatalogItemTable records={record.subItems} /> : <div>{intl.formatMessage(messages.catalog)}</div>
  }


  render() {
    const {
      defaultDatamart,
      match: {
        params: {
          organisationId
        }
      },
      intl,
    } = this.props;

    const handleOnRow = (record: Category) => ({
      onClick: () => {
        if (record.hasSubCategory) {
          this.setState({ path: [...this.state.path, record], categories: { loading: true, items: this.state.categories.items } }, () => {
            if (this.state.catalogs.selectedId) {
              this.fetchSubCategories(defaultDatamart(organisationId).id, this.state.catalogs.selectedId, record.category_id);
            }
            
          })
        }
        
      },
    });

    const getRowClassName = (record: Category) => {
      if ( record.hasSubCategory ) return 'mcs-table-cursor';
      return '';
    }
  
    return (
      <div style={{ marginTop: 40 }}>
        <Card title={"test"} buttons={this.generateCatalogSelect()}>
          {this.generateBreadcrumb()}

          <CategoryTable
            columns={[
              {
                title: intl.formatMessage(messages.category),
                dataIndex: 'category_id',
              },
              {
                render: (text, record) => {
                  if (record.hasSubCategory) {
                    return (
                      <div className="float-right">
                        <McsIcon type="chevron-right" />
                      </div>
                    );
                  }
                  return null;
                },
              },
            ]}
            onRow={handleOnRow}
            rowClassName={getRowClassName}
            rowKey='category_id'
            loading={this.state.catalogs.loading || this.state.categories.loading}
            dataSource={this.state.categories.items}
            expandedRowRender={this.renderEmbededView}
            pagination={{
              size: 'small',
              showSizeChanger: true,
              hideOnSinglePage: true,
            }}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  defaultDatamart: getDefaultDatamart(state),
});

const mapDispatchToProps = { notifyError: actions.notifyError };

export default compose(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(CatalogContent);
