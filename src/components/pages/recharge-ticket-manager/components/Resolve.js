import React, {Fragment} from "react";
import TextArea from "antd/es/input/TextArea";

export default () => {
    return <Fragment>
        <p>Ghi chú</p>
        <TextArea rows={5}/>
    </Fragment>
}