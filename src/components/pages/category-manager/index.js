import React, {useContext, useState} from "react";
import Search from './components/Search'
import FilterItem from "../category/components/filter/FilterItem";
import CreateCategory from "./components/create-category";
import {getCategoryList} from "../../../services/category/category";
import {swapCategory} from "../../../services/category-manager";
import {LayoutContext} from "../../../contexts";
import './style.scss'

import {Button, Tree} from 'antd';

const { TreeNode, DirectoryTree } = Tree;

export default () => {

    const {setLoading} = useContext(LayoutContext)

    const [name, setName] = useState('')
    const [date, setDate] = useState(['', ''])
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
            <FilterItem defaultValue={date}
                        setValue={setDate}
                        type={'date'}
                        placeholder={['Từ ngày', 'Đến ngày']}
                        title={'Chọn ngày'}/>]
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
        await swapCategory(currentId, {index: targetIdx})
        setReload(reload + 1)
    }

    const forceReload = () => {
        setReload(reload + 1)
    }

    const expandedKeys = () => {
       return ds.map((el, idx) => idx + '')
    }

    return <div>
        <Search items={getItems()}
                search={setupSearch()}
                loading={setLoading}
                setPage={setPage}
                reload={reload}
                page={page}/>
        <p style={{textAlign: 'right'}}>
            <Button type={'primary'} onClick={() => setVisible(true)}>Thêm mới danh mục</Button>
        </p>
        <div className={'m-t-10'} style={{    border:' 1px solid #eaeaea',
            padding: '15px'}}>
            <DirectoryTree
                draggable
                onDrop={onDragEnd}
            >
                {ds.map((el, pIdx) => <TreeNode expanded title={el.name} key={pIdx + ''} id={el.id} idx={pIdx}>
                    {el.childCategoryList.map((child, cIdx) => <TreeNode expanded disabled id={el.id} idx={cIdx} title={child.name} key={`${pIdx}-${cIdx}`} isLeaf />)}
                </TreeNode>)}
            </DirectoryTree>
        </div>
        <CreateCategory visible={visible}
                        setVisible={setVisible}
                        reload={forceReload}
        />
    </div>
}