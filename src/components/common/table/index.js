import {Pagination, Table} from "antd";
import React, {Fragment} from "react";
import './style.scss'

const PAGE_SIZE_OPTION = ['5', '10', '20', '30', '50']

export default ({datasource, columns, page, onChangePage, onChangeSize, bordered}) => {

    const {perpage, currentPage, total} = page

    return <Fragment >
        <Table bordered={bordered} dataSource={datasource} columns={columns} rowKey="id" pagination={false} />
        <div id={'common_table'}>
            <Pagination defaultCurrent={1}
                        current={currentPage}
                        locale={{ items_per_page: "/ bản ghi"}}
                        total={total}
                        pageSize={perpage}
                        showSizeChanger
                        onChange={onChangePage}
                        pageSizeOptions={PAGE_SIZE_OPTION}
                        onShowSizeChange={onChangeSize}
                        showTotal={(t) => `Tổng số ${t}`}/>
        </div>
    </Fragment>
}