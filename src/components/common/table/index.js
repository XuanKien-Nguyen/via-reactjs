import {Pagination, Table} from "antd";
import React, {Fragment, useEffect} from "react";
import {useTranslation} from 'react-i18next';
import './style.scss'

const PAGE_SIZE_OPTION = ['5', '10', '20', '30', '50']
let mouseDown = false;
let startX, scrollLeft, slider, startDragging, stopDragging, handleDragging;
export default (props) => {

    const {
        datasource,
        columns,
        page,
        onChangePage,
        onChangeSize,
        bordered,
        className = '',
        expandedRowRender,
        setPage,
        rowKey = 'id',
        scrollToID
    } = props

    const {t} = useTranslation()

    const {perpage, currentPage, total} = page

    const whenSizeChanged = () => {
        if (setPage) {
            return (currentPage, perPage) => {
                setPage({
                    perpage: perPage,
                    currentPage: 1
                })
                if (scrollToID) {
                    window.location.href = '#' + scrollToID
                } else {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            }
        }
        return onChangeSize
    }

    const whenPageChanged = () => {
        if (setPage) {
            return (currentPage, perPage) => {
                setPage({
                    perpage: perPage,
                    currentPage: currentPage
                })
                if (scrollToID) {
                    window.location.href = '#' + scrollToID
                } else {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            }
        }
        return onChangePage
    }

    useEffect(() => {
        // if (!slider) {
        slider = document.querySelector('.ant-table-body');
        // }
        setTimeout(() => {
            startDragging = (e) => {
                mouseDown = true;
                startX = e.pageX;
                scrollLeft = slider.scrollLeft;
            };
            stopDragging = () => {
                mouseDown = false;
            };

            handleDragging = (e) => {
                e.preventDefault();
                if (!mouseDown) {
                    return;
                }
                const x = e.pageX - slider.offsetLeft;
                const scroll = x - startX;
                slider.scrollLeft = scrollLeft - scroll;
            }

            slider.addEventListener('mousemove', handleDragging);
            slider.addEventListener('mousedown', startDragging, false);
            slider.addEventListener('mouseup', stopDragging, false);
            slider.addEventListener('mouseleave', stopDragging, false);
        }, 500)
        return () => {
            slider.removeEventListener('mousemove', handleDragging);
            slider.removeEventListener('mousedown', startDragging, false);
            slider.removeEventListener('mouseup', stopDragging, false);
            slider.removeEventListener('mouseleave', stopDragging, false);
        }
    }, [])

    return <Fragment>
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
                        locale={{items_per_page: `${t('order.records')}`}}
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