import React from 'react';

const FeatureLayout = () => {

    return (
        <div id="feature-layout">
            <div className='feature-container'>
            <div key='feature-1' className='feature-item'>
                    <div className='feature-image'><img alt='feature'
                        src={require('../../../../../assets/img/feature-1.svg')} /></div>
                    <div className='feature-name'><h3>Giao dịch tự động</h3></div>
                    <div className='feature-desc'><p>Hệ thống của chúng tôi được vận hành tự động 24/7/365 . Không kể lễ tết, ngày nghỉ.</p>
                    </div>
                </div>
                <div key='feature-2' className='feature-item'>
                    <div className='feature-image'><img alt='feature'
                        src={require('../../../../../assets/img/feature-2.svg')} /></div>
                    <div className='feature-name'><h3>Tài nguyên đa dạng</h3></div>
                    <div className='feature-desc'><p>Với hơn 100 loại sản phẩm từ Via, Clone, Fanpage, BM, Tut, TIP…</p>
                    </div>
                </div>
                <div key='feature-3' className='feature-item'>
                    <div className='feature-image'><img alt='feature'
                        src={require('../../../../../assets/img/feature-3.svg')} /></div>
                    <div className='feature-name'><h3>Bảo hành một đổi một</h3></div>
                    <div className='feature-desc'><p>Bảo hành tài khoản 1-1 và hoàn tiền cho tất cả trường hợp tài khoản lỗi.</p>
                    </div>
                </div>
                <div key='feature-4' className='feature-item'>
                    <div className='feature-image'><img alt='feature'
                        src={require('../../../../../assets/img/feature-4.svg')} /></div>
                    <div className='feature-name'><h3>Bảo mật thông tin</h3></div>
                    <div className='feature-desc'><p>Hệ thống của chúng tôi bảo mật bất kể thông tin gì về bạn.</p>
                    </div>
                </div>
                <div key='feature-5' className='feature-item'>
                    <div className='feature-image'><img alt='feature'
                        src={require('../../../../../assets/img/feature-5.svg')} /></div>
                    <div className='feature-name'><h3>Giá tốt nhất thị trường</h3></div>
                    <div className='feature-desc'><p>Giá cả hợp lí là một trong những yếu tố làm chúng tôi trở nên nổi bật giữa vạn Brands.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default FeatureLayout;
