import React, { Component } from 'react';
import Router from 'next/router';
import moment from 'moment';

// material
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
// component
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBack from '../../components/global-component/ButtonBack';

// redux

import { showSnackbar } from '../../redux/snackbar/action';
import { getRupiah } from '../../utils/Calculate';
import { AuthNetworkCall } from '../../utils/NetworkCall';

let next_page = 1;
export class Riwayat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyList: [],
      hasMore: true,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getHistoryList(1);
  }

  async getNextPage() {
    next_page++;
    await this.getHistoryList(next_page);
  }

  async getHistoryList(page) {
    const { historyList } = this.state;
    const result = await AuthNetworkCall(`/order?page=${page}`, 'get', this.props.showSnackbar);
    if (result) {
      this.setState({ historyList: historyList.concat(result) });
      if (result.length < 10) this.setState({ hasMore: false });
      else this.setState({ hasMore: true });
    }
    this.setState({ isLoading: false });
  }

  render() {
    const { hasMore, historyList, isLoading } = this.state;
    return (
      <div className="soft-blue-body">

        {isLoading ? (
          <CircularProgress style={{ position: 'absolute', left: '47%', top: '50%' }} />
        )
          : (
            <div className="main-content" id="mainContent">
              <ButtonBack id="btnBack" onClick={() => Router.back()} />

              {historyList.length <= 0
                ? (
                  <div id="emptyState" className="txt-center-hoz margin-top-36 padding-36">
                    <img alt="empty bayar tagihan" src="./icon/ic_empty_history.svg" width={64} />
                    <p className="font-muli-14 bold grey">
                      Anda belum memiliki
                      <br />
                      transaksi
                    </p>
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={historyList.length}
                    next={() => this.getNextPage()}
                    hasMore={hasMore}
                    loader={<h4>Memuat...</h4>}
                  >
                    {historyList.map((product) => (
                      <Paper className="padding-16 margin-btm-16">
                        <div className="flex margin-btm-16">
                          <p className="font-muli-14">{moment(product.created).locale('id').format('DD MMM YYYY, HH:mm ')}</p>
                          <p
                            id="btnDetail"
                            className="light-blue margin-lft-auto bold font-muli-14 pointer"
                            onClick={() => Router.push({ pathname: `/status-pembayaran/${product.id}`, query: { type: 'history' } })}
                          >
                          DETAIL PEMBELIAN
                          </p>
                        </div>
                        <Divider />
                        <div className="flex margin-top-16 margin-btm-16">
                          <p className="font-muli-14 bold">Item:</p>
                          <div className="margin-lft-auto">
                            {product.items.map((item) => (
              <p className="font-muli-16">
                                {item.product_name}
                              </p>
            ))}
                          </div>
                        </div>
                        <Divider />
                        <div className="flex margin-top-16">
                          <p className="font-muli-14 bold">Total pembayaran:</p>
                          <p className="margin-lft-auto font-muli-16">
                            {getRupiah(product.total)}
                          </p>
                        </div>
                      </Paper>
                    ))}
                  </InfiniteScroll>
                )}

              <br />
            </div>
          )}

      </div>

    );
  }
}

const mapDispatchToProps = {
  showSnackbar,
};
export default connect(null, mapDispatchToProps)(Riwayat);
