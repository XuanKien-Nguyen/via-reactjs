import {Pagination, Table} from "antd";
import React, {Fragment, useEffect} from "react";
import { useTranslation } from 'react-i18next';
import './style.scss'

const PAGE_SIZE_OPTION = ['5', '10', '20', '30', '50']

export default (props) => {

    const {datasource, columns, page, onChangePage, onChangeSize, bordered, className = '', expandedRowRender, setPage, rowKey = 'id'} = props

    const { t } = useTranslation()

    const {perpage, currentPage, total} = page

    const whenSizeChanged = (currentPage, perPage) => {
        if (setPage) {
            return () => {
                setPage({
                    perpage: perPage,
                    currentPage: 1
                })
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        return onChangeSize
    }

    const whenPageChanged = (currentPage, perPage) => {
        if (setPage) {
            return () => {
                setPage({
                    perpage: perPage,
                    currentPage: currentPage
                })
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        return onChangePage
    }

    return <Fragment >
        <Table className={className}
               bordered={bordered}
               dataSource={datasource}
               columns={columns}
               rowKey={rowKey}
               expandedRowRender={expandedRowRender ? expandedRowRender : null}
               pagination={false}
               locale={{
                   emptyText: t('common.no-data')
               }}
               {...props}
        />
        <div id={'common_table'}>
            <Pagination defaultCurrent={1}
                        current={currentPage}
                        locale={{ items_per_page: `${t('order.records')}`}}
                        total={total}
                        pageSize={perpage}
                        showSizeChanger
                        onChange={whenPageChanged()}
                        pageSizeOptions={PAGE_SIZE_OPTION}
                        onShowSizeChange={whenSizeChanged()}
                        showTotal={(total) => `${t('order.total-records')} ${total}`}/>
        </div>
    </Fragment>
}