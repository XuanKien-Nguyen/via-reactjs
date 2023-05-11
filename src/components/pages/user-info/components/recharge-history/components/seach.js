// import {Button, Collapse, Icon, message} from "antd";
// import FilterItem from "../../../../category/components/filter/FilterItem";
// import React, {useEffect, useState} from "react";
// import TableCommon from "../../../../../common/table";
// const { Panel } = Collapse
//
// export default ({setList, api, setPage, type, updateBy, transactionId, page, getTypeList, t}) => {
//
//     const [updatedTime, setUpdatedTime] = useState([]);
//     const [type, setType] = useState([]);
//
//     useEffect(() =>{
//         getList()
//     }, [type, updateBy, updatedTime, transactionId]);
//
//     const getList = () =>{
//         let updated_time = '';
//
//         const body = {
//             updateBy: updateBy,
//             transaction_id: transactionId,
//             type: type,
//             page: page.currentPage,
//             perpage: page.perpage
//         }
//
//         api(body).then(resp =>{
//             console.log(resp)
//         })
//
//     }
//
//     return <div>
//         <TableCommon className='table-order'
//                      bordered={true}
//                      page={page}
//                      datasource={datasource}
//                      columns={columns}
//                      rowKey="id"
//                      onChangePage={onChangePage}
//                      onChangeSize={onChangeSize}/>
//     </div>
//
//
// }