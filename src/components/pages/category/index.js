import React, {useContext, useEffect, useState} from "react";
import {getCategoryList} from "../../../services/category/category";
import {LayoutContext} from "../../../contexts";


export default () => {

    const query = new URLSearchParams(window.location.search);

    const {setLoading} = useContext(LayoutContext)

    const [productList, setProductList] = useState([])

    useEffect(() => {
        const parentId = query.get('id')
        console.log('parentId', parentId);
        if(parentId) {
            setLoading(true)
            getCategoryList({
                id: parentId
            }).then(resp => {
                console.log(resp);
            }).finally(() => setLoading(false))
        }
    }, [])
    return <div>Category</div>
}