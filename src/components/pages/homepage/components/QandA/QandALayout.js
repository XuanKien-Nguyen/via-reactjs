import React from 'react';
import { Collapse } from 'antd';
const { Panel } = Collapse;

const QandALayout = () => {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  return (
    <section id="QandA-layout">
      <div className='QandA-container'>
        <div className='QandA-title'><h2>Câu hỏi thường gặp?</h2></div>
        <div className='QandA-content'>
          <Collapse accordion bordered={false} style={{ backgroundColor: 'white' }}>
            <Panel header="Mua Via Facebook để làm gì?" key="1">
              <div>
                <p>Tùy nhu cầu của mỗi cá nhân , người sử dụng. Tuy nhiên thường những khách hàng sử dụng tài khoản Via Facebook vào mục đích chính như:</p>
                <ul style={{ listStyleType: 'disc' }}>
                  <li><strong>Tài khoản quảng cáo của Khách Hàng bị vô hiệu hóa</strong> và muốn mua thêm để phục vụ việc kinh doanh.</li>
                  <li>Sử dụng để đăng bài vào các <strong>Group</strong> trên Facebook nhằm mục đích <strong>bán hàng, marketing, truyền thông</strong>.</li>
                  <li>Sử dụng để <strong>Seeding</strong> nhằm tăng độ uy tín của doanh nghiệp.</li>
                  <li>Sử dụng để <strong>Spam Comment , Spam Mesenger</strong> nhằm mục đích thương mại.</li>
                </ul>
              </div>
            </Panel>
            <Panel header="Tôi nên mua loại via nào để chạy quảng cáo ?" key="2">
              <p>Theo kinh nghiệm của chúng tôi <a href='/' style={{ color: '#000000A6' }}><strong>(Via2fa.VN)</strong></a> Khuyến cáo mọi người nên sử dụng các loại tài khoản như Via Xác Minh Danh Tính hoặc Via Kháng 902 . Các loại VIA này đều đã được xác minh danh tính, trâu hơn các loại tài khoản thường.</p>
            </Panel>
            <Panel header="Chính sách bảo hành của Viaads.VN như thế nào?" key="3">
              <div>
                <p><a href='/' style={{ color: '#000000A6' }}><strong>Via2fa.VN</strong></a> cam kết bảo hành cho các tài khoản via được mua tại <a href='/' style={{ color: '#000000A6' }}><strong>Via2fa.VN</strong></a> như sau:</p>
                <ul style={{ listStyleType: 'disc' }}>
                  <li>Bảo hành đối với các tài khoản không đúng như thông tin được mô tả.</li>
                  <li>Bảo hành các tài khoản sai mật khẩu đăng nhập hoặc bị đổi mật khẩu trước thời gian giao dịch của khách hàng.</li>
                  <li>Bảo hành tích xanh, tích quảng cáo đối với các tài khoản như <strong>XMDT, 902</strong> trong 7 ngày. ( Chỉ áp dụng đối với trường hợp chưa thực hiện các tác động đến tài khoản quảng cáo ) .</li>
                  <li>Bảo hành checkpoint đối với các tài khoản khách hàng đã mua nhưng chưa thực hiện thay đổi thông tin.</li>
                  <li>Hoàn tiền đối với tài khoản bị nhân viên bán hàng giao nhầm.</li>
                </ul>
              </div>
            </Panel>
            <Panel header="Tài khoản đã xác minh danh tính nhưng vẫn tiếp tục bị xác minh danh tính?" key="4">
              <div>
                <p>Trường hợp tài khoản đã được xác minh danh tính, có tích xanh quảng cáo . Nhưng sau khi sử dụng vẫn tiếp tục bị xác minh lại. Điều này có thể do khách hàng đang vi phạm các chính sách quảng cáo, hoặc Facebook cảm thấy người dùng đang hoạt động bất thường trên các tài khoản Via và vẫn bắt xác minh lại.</p>
                <p>Đối với các tài khoản đã mua tại <a href='/' style={{ color: '#000000A6' }}><strong>Via2fa.VN</strong></a> chúng tôi sẽ hỗ trợ bạn xác minh danh tính lại hoàn toàn miễn phí. ( Tuy nhiên tỉ lệ có thể chỉ tầm <strong>60-90%</strong>)</p>
              </div>
            </Panel>
            <Panel header="Tài khoản bị checkpoint khi đăng nhập lần đầu thì phải làm sao?" key="5">
            <div>
                <p>Đối với các tài khoản mua tại <a href='/' style={{ color: '#000000A6' }}><strong>Via2fa.VN</strong></a> . Hơn 90% số tài khoản đều đã được xác minh phương thức mở checkpoint bằng Email. Khách hàng có thể yên tâm sử dụng mà không lo sợ việc bị <strong>checkpoint</strong>.</p>
                <ul style={{ listStyleType: 'disc' }}>
                  <li>Quyền lợi của khách hàng <a href='/' style={{ color: '#000000A6' }}><strong>Via2fa.VN</strong></a> : Chúng tôi có đội ngũ nhân viên hùng hậu, sẵn sàng hỗ trợ bạn mở checkpoint, xác minh danh tính lại hoàn toàn miễn phí</li>
                </ul>
              </div>
            </Panel>
            <Panel header="Chúng tôi từ chối bảo hành cho trường hợp nào?" key="6">
            <div>
                <p><a href='/' style={{ color: '#000000A6' }}><strong>Via2fa.VN</strong></a> từ chối bảo hành đối với các trường hợp sau đây:</p>
                <ul style={{ listStyleType: 'disc' }}>
                  <li>Tài khoản đã được khách hàng thay đổi thông tin như: <strong>Email, Mật khẩu, Số điện thoại…</strong></li>
                  <li>Khách hàng sử dụng tính năng quên mật khẩu để đổi mật khẩu ( Điều này làm mất đi tính năng mở checkpoint bằng Email của tài khoản ).</li>
                  <li>Khách hàng đã thực hiện các tác vụ như : Thêm Via làm Quản trị viên Fanpage, Thêm phương thức thanh toán, Tạo các chiến dịch quảng cáo, Thêm người dùng vào tài khoản quảng cáo.</li>
                  <li>Khách hàng sử dụng via, nhưng để quá 30 ngày không thực hiện việc thay đổi thông tin Via ( Trường hợp xấu nhất có thể bị chiếm đoạt, hack, bị lấy dữ liệu ) ViaADS.VN hoàn toàn không chịu trách nhiệm.</li>
                  <li>Máy tính của khách hàng đang sử dụng có sử dụng các phần mềm bị nghi ngờ <strong>Botnet, Keylog, Virus…</strong></li>
                </ul>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </section>
  );
};
export default QandALayout;
