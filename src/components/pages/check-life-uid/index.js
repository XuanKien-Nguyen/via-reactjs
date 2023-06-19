import React, {useContext, useState} from "react";
import {Button, Input, Modal} from "antd";
import axios from 'axios'
import {LayoutContext} from "../../../contexts";

const {TextArea} = Input
export default () => {

    const {setLoading} = useContext(LayoutContext)
    const [msg, setMsg] = useState('')
    const [listUid, setListUid] = useState('')

    const handleCheck = async () => {
        if (!listUid) {
            setMsg('Vui lòng nhập danh sách cần kiểm tra')
            return
        }
        setLoading(true)
        const responses = await checkLiveUIDProcesses(listUid.split(','))
        let totalLife = 0
        let totalDie = 0
        for (let i = 0; i < responses.length; i++) {
            if (responses[i].status === 'fulfilled' && responses[i].value.data.data.url.includes('static')) {
                totalDie++
            } else {
                totalLife++
            }
        }
        setLoading(false)
        Modal.info({
            content: <div>
                <h2><b>Kết quả kiểm tra</b></h2>
                <p style={{color: 'green'}}>Tổng số sản phẩm còn sống: {totalLife}</p>
                <p style={{color: 'red'}}>Tổng số sản phẩm còn chết: {totalDie}</p>
            </div>
        })

    }
    const checkLiveUIDProcesses = (products) => {
        const promises = products.map((product) => {
            return axios.get(`https://graph.facebook.com/${product}/picture?type=normal&redirect=false`);
        });
        return Promise.allSettled(promises);
    };

    return <div>
        <span className={'m-b-10'}><span style={{color: 'red'}}>*</span>Danh sách UID cần kiểm tra: </span>
        <TextArea rows={10} value={listUid} onChange={e => {
            setListUid(e.target.value)
            setMsg('')
        }}/>
        <p className={'m-t-10'} style={{color: 'red'}}>{msg}</p>
        <ol title={'Lưu ý: '}>
            <li><i>Các UID cách nhau vởi dấu phẩy (,)</i></li>
            <li><i>Vui lòng tắt IPv6 trước khi thực hiện kiểm tra</i></li>
        </ol>
        <p className={'m-t-10'} style={{textAlign: "center"}}><Button type={'primary'} onClick={handleCheck}>Kiểm
            tra</Button></p>
    </div>
}