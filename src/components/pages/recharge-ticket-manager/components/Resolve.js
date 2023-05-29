import React, {useState} from "react";
import TextArea from "antd/es/input/TextArea";

export default ({errorComment, setErrorComment, setComment}) => {

    return <div>
        <p className={'m-t-10'}><span style={{color: 'red'}}>*</span>Ghi chú: </p>
        <TextArea rows={10}
                  onChange={() => {
                      setErrorComment('')
                  }}
                  onBlur={(e) => {
                      const value = e.target.value
                      setComment(value)
                      if (!value) {
                          setErrorComment('Vui lòng nhập ghi chú')
                      }
                  }}
        />
        <span style={{color: 'red'}}> {errorComment}</span>
    </div>
}