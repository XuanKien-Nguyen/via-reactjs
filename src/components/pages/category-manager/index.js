import React, {useContext, useState} from "react";
import Search from './components/Search'
import FilterItem from "../category/components/filter/FilterItem";
import CreateCategory from "./components/create-category";
import List from './components/detail'
import {getCategoryList} from "../../../services/category/category";
import {swapCategory} from "../../../services/category-manager";
import {LayoutContext} from "../../../contexts";
import './style.scss'
import {Button, Icon, Tree, Tabs} from 'antd';

const { TreeNode, DirectoryTree } = Tree;
const { TabPane } = Tabs;
export default () => {

    const {setLoading} = useContext(LayoutContext)

    const [name, setName] = useState('')
    const [date, setDate] = useState(['', ''])
    const [updateObject, setUpdateObject] = useState(null)
    const [visible, setVisible] = useState(false)
    const [ds, setDs] = useState([])
    const [reload, setReload] = useState(0)
    const [page, setPage] = useState({
        perpage: 10,
        currentPage: 1,
        total: 0
    })

    const getItems = () => {
        return [
            <FilterItem defaultValue={name}
                        setValue={setName}
                        type={'text'}
                        title={'Tên danh mục'}
                        allowClear={true}/>,
            // <FilterItem defaultValue={date}
            //    x         setValue={setDate}
            //             type={'date'}
            //             placeholder={['Từ ngày', 'Đến ngày']}
            //             title={'Chọn ngày'}/>
        ]
    }
    const setupSearch = () => {
        const params = {
            name
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
        setReload(reload + 1)
    }

    const forceReload = () => {
        setReload(reload + 1)
    }

    return <div>
        <Search items={getItems()}
                search={setupSearch()}
                loading={setLoading}
                setPage={setPage}
                reload={reload}
                state={[name]}
                onReset={() => {
                    setName('')
                }}
                page={page}/>
        <p style={{textAlign: 'right'}}>
            <Button type={'primary'} onClick={() => setVisible(true)}><Icon type="plus" />Thêm mới danh mục</Button>
        </p>

        <Tabs defaultActiveKey="1" onChange={() => {}}>
            <TabPane tab="Danh sách" key="1">
                <List
                    datasource={ds}
                    reload={forceReload}
                    loading={setLoading}
                    setUpdateObject={setUpdateObject}
                />
            </TabPane>
            <TabPane tab="Sắp xếp danh mục" key="2">
                <div className={'m-t-10'} style={{border:' 1px solid #eaeaea', padding: '15px'}}>
                    <DirectoryTree
                        draggable
                        onDrop={onDragEnd}
                    >
                        {ds.map((el, pIdx) => <TreeNode expanded title={el.name} key={pIdx + ''} id={el.id} idx={pIdx}>
                            {el.childCategoryList.map((child, cIdx) => <TreeNode id={child.id} idx={cIdx} title={child.name} key={`${pIdx}-${cIdx}`} isLeaf />)}
                        </TreeNode>)
                        }
                    </DirectoryTree>
                </div>
            </TabPane>
        </Tabs>
        <CreateCategory visible={visible}
                        setVisible={setVisible}
                        reload={forceReload}
                        updateObject={updateObject}
        />
    </div>
}