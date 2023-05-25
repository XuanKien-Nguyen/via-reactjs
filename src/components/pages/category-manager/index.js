import React, {useContext, useEffect, useState} from "react";
import Search from './components/Search'
import FilterItem from "../category/components/filter/FilterItem";
import CreateCategory from "./components/create-category";
import List from './components/detail'
import {getCategoryList} from "../../../services/category/category";
import {swapCategory} from "../../../services/category-manager";
import {LayoutContext} from "../../../contexts";
import {Button, Icon, Tree, Tabs} from 'antd';
import Modal from "antd/es/modal";

const {TreeNode, DirectoryTree} = Tree;
const {TabPane} = Tabs;
export default () => {

    const {setLoading} = useContext(LayoutContext)

    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [status, setStatus] = useState(null)
    const [updateObject, setUpdateObject] = useState(null)
    const [visible, setVisible] = useState(false)
    const [ds, setDs] = useState([])
    const [dsTree, setDsTree] = useState([])
    const [reload, setReload] = useState(0)
    const [curTab, setCurTab] = useState('1')
    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const initDsTree = () => {
        setLoading(true)
        getCategoryList().then(resp => {
            if (resp.status === 200) {
                setDsTree(resp?.data?.categoryListFound || [])
            }
        }).catch(err => Modal.error({
            content: err.response?.data?.message
        })).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (curTab === '2' && dsTree.length === 0) {
            initDsTree()
        }
    }, [curTab])

    const getItems = () => {
        return [
            <FilterItem defaultValue={name}
                        setValue={setName}
                        type={'text'}
                        title={'Tên danh mục'}
                        disabled={curTab === '2'}
                        allowClear={true}/>,
            <FilterItem defaultValue={type}
                        allowClear={true}
                        setValue={setType}
                        disabled={curTab === '2'}
                        options={[
                            {
                                label: 'Còn hàng',
                                value: 'stock'
                            },
                            {
                                label: 'Hết hàng',
                                value: 'out_of'
                            }
                        ]}
                        type={'select'}
                        placeholder={'Tình trạng'}
                        title={'Tình trạng'}/>,
            <FilterItem defaultValue={status}
                        allowClear={true}
                        setValue={setStatus}
                        disabled={curTab === '2'}
                        options={[
                            {
                                label: 'Hiển thị',
                                value: 'show'
                            },
                            {
                                label: 'Ẩn',
                                value: 'hide'
                            }
                        ]}
                        type={'select'}
                        placeholder={'Hiển thị/Ẩn'}
                        title={'Hiển thị/Ẩn'}/>,
        ]
    }
    const setupSearch = () => {
        const params = {
            name,
            type,
            status
        }
        return {
            api: () => getCategoryList(params),
            resolve: (resp, setPage) => {
                if (resp.status === 200) {
                    setDs(resp?.data?.categoryListFound || [])
                }
            },
            reject: (err) => console.log(err)
        }
    }

    const onDragEnd = async (p) => {
        const targetNode = p.node.props
        const targetIdx = targetNode.idx
        const currentId = p.dragNode.props.id
        setLoading(true)
        await swapCategory(currentId, {index: targetIdx})
        const resp = await getCategoryList()
        if (resp.status === 200) {
            setDsTree(resp?.data?.categoryListFound || [])
        }
        setReload(reload + 1)
    }

    const forceReload = () => {
        setReload(reload + 1)
        initDsTree()
    }

    return <div>
        <Search items={getItems()}
                search={setupSearch()}
                loading={setLoading}
                setPage={setPage}
                reload={reload}
                state={[name, type, status]}
                onReset={() => {
                    setName('')
                    setType('')
                }}
                page={page}/>
        <p style={{textAlign: 'right'}}>
            <Button type={'primary'} onClick={() => setVisible(true)}><Icon type="plus"/>Thêm mới danh mục</Button>
        </p>

        <Tabs defaultActiveKey={curTab} onChange={t => {
            setCurTab(t)
        }}>
            <TabPane tab="Danh sách danh mục" key='1'>
                <div>
                    <List
                        datasource={ds}
                        reload={forceReload}
                        loading={setLoading}
                        setUpdateObject={setUpdateObject}
                        setVisible={setVisible}
                    />
                </div>
            </TabPane>
            <TabPane tab="Sắp xếp danh mục" key="2">
                {dsTree.length > 0 ? <div className={'m-t-10'} style={{border: ' 1px solid #eaeaea', padding: '15px'}}>
                    <DirectoryTree
                        draggable
                        onDrop={onDragEnd}
                    >
                        {dsTree.map((el, pIdx) => <TreeNode expanded title={el.name} key={pIdx + ''} id={el.id} idx={pIdx}>
                            {el.childCategoryList.map((child, cIdx) => <TreeNode id={child.id} idx={cIdx}
                                                                                 title={child.name}
                                                                                 key={`${pIdx}-${cIdx}`} isLeaf/>)}
                        </TreeNode>)
                        }
                    </DirectoryTree>
                </div> : <p style={{textAlign: 'center'}} className={'ant-table-placeholder'}>Không có dữ liệu</p>}
                <p className={'m-t-10'}><i>Lưu ý: tìm kiếm không khả dụng khi sắp xếp danh mục</i></p>
            </TabPane>
        </Tabs>
        <CreateCategory visible={visible}
                        setVisible={setVisible}
                        reload={forceReload}
                        updateObject={updateObject}
                        setUpdateObject={setUpdateObject}
        />
    </div>
}