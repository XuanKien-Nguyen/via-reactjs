import React from 'react';

const FeatureLayout = () => {

    return (
        <div id="feature-layout">
            <div className='feature-container'>
                {[1, 2, 3, 4, 5].map((el, idx) => {
                    return <div key={idx} className='feature-item'>
                        <div className='feature-image'><img alt='feature'
                                                            src={require('../../../../../assets/img/icon4.svg')}/></div>
                        <div className='feature-name'><h3>Bảo mật thông tin</h3></div>
                        <div className='feature-desc'><p>Hệ thống của chúng tôi bảo mật bất kể thông tin gì về bạn.</p>
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
};
export default FeatureLayout;
