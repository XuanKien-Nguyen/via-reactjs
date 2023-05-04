import React from "react";

export default () => {
    return <div style={{marginTop: '15px'}}>
        <h1>Lưu ý khi nạp tiền:</h1>
        <ol>
            <li>Không giới hạn số tiền tối đa, số lần có thể nạp</li>
            <li>Khách hàng nạp tiền và thanh toán sẽ tự động được <b>giảm giá 1% </b>trên tổng số tiền phải thanh toán (Anh em nên ưu tiên phương thức này)</li>
            <li>Nạp tiền từ 5.000.000 đồng được tặng thêm mã giảm giá 2% <b>CTVGIAMGIA</b></li>
            <li>Các phương thức thanh toán nạp tiền được chấp nhận: Ví điện tử <b>QR PAY,  Chuyển khoản ngân hàng…</b></li>
        </ol>
    </div>
}