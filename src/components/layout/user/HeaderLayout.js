import React, {useContext, useEffect, useState, Fragment} from 'react';
import {Dropdown, Icon, Input, Layout, Menu} from 'antd';
import {logout} from "../../../services/user";
import {getParentCategoryList} from '../../../services/category/category';
import {useDispatch, useSelector} from "react-redux";
import {LayoutContext} from "../../../contexts";

const {Search} = Input;
const {Header} = Layout;

function HeaderLayout({history}) {

    const user = useSelector(store => store.user)

    const [userInfo, setUserInfo] = useState()

    const {setLoading} = useContext(LayoutContext);

    const dispatch = useDispatch()

    const goto = url => history.push(url)

    const onClick = ({ key }) => {
        console.log(`Click on item ${key}`);
    };

    const handleLogout = async () => {
        setLoading(true)
        await logout();
        dispatch({ type: "LOGOUT" })
        localStorage.removeItem("is_logged")
        localStorage.removeItem('user_info')
        window.location.href = '/'
        setLoading(false)
    }

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        getParentCategoryList().then(res => {
            if (res.status === 200 && res.data) {
                setCategoryList(res.data.parentCategoryList);
            }
        });
        const u = localStorage.getItem('user_info')
        if (u) {
            setUserInfo(JSON.parse(u))
        }
    }, []);

    const menu = (
        <Menu onClick={onClick}>
            {categoryList.map((category, i) => <Menu.Item key={category.id}>{category.name}</Menu.Item>)}
        </Menu>
    );

    const dropDownUser = () => {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={() => goto('/user-info')}>Cá nhân</a>
                </Menu.Item>
                {(user?.role === 'admin' || user?.role === 'staff') && <Menu.Item >
                    <a onClick={() => goto('/admin')}>Quản trị dành cho admin</a>
                </Menu.Item>}
                <Menu.Item>
                    <a onClick={handleLogout}>Thoát</a>
                </Menu.Item>
            </Menu>
        )
        return <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {userInfo.username?.toUpperCase()} <Icon type="down" />
            </a>
        </Dropdown>

    }

    return (
        <Header id='header_user' style={{ height: 'auto', padding: 0, margin: 0 }}>
            <div id="top-bar" className="header-top" style={{ backgroundColor: '#1b74e4', height: '40px', lineHeight: '40px' }}>
                <div className='header-top_container'>
                    <div className="header-top_left"><Search
                        type='search'
                        placeholder="Bạn đang tìm gì?"
                        onSearch={value => console.log(value)}
                        style={{ width: 156, color: 'white' }}
                    /></div>
                    <div className='header-top_right'>
                        <ul>
                            <li className='item'><a href='#'>Tất cả sản phẩm</a></li>
                            <li className='item'><a href='#'>Hướng dẫn</a></li>
                            <li className='item'><a href='#'>Nạp tiền</a></li>
                            <li className='item'><a href='#'>Thủ thuật Facebook</a></li>
                            <li className='item'><a href='#'>Về chúng tôi</a></li>
                            <li className='item'><a href='#'>Liên hệ</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="master-header" className="header-main" style={{ height: '63px' }}>
                <div className='header-main_container'>
                <div className='header-logo' style={{ marginRight: '30px', cursor: 'pointer' }} onClick={() => history.push('/')}>
                        <img alt='via2fa' src={require('../../../assets/img/clone-logo.gif')} style={{ width: '135px' }} />
                    </div>
                    <div className="header-main_left">
                        <ul>
                            <li className='item'><Dropdown overlay={menu}><a href='#' onClick={e => e.preventDefault()}>DANH MỤC<Icon type="down" style={{ marginLeft: '4px' }} /></a></Dropdown></li>
                            <li className='item'><a href='#'>BÀI VIẾT</a></li>
                        </ul>
                    </div>
                    <div className="header-main_right">
                        <ul>
                            <li style={{
                                height: '64px',
                                display: 'flex',
                            }} className='item'><div className='signin-signup d-flex justify-content-center align-items-center' style={{height: '100%'}}>{userInfo ? dropDownUser() : <Fragment><div className={'login-home'} onClick={() => goto('/login')}>ĐĂNG NHẬP</div><div className={'register-home'} onClick={() => goto('/register')}>ĐĂNG KÝ</div></Fragment>}</div></li>
                            <li className='header-devider' style={userInfo?.role !== 'admin' ? {display: 'none'} : {}}></li>
                            <li className='item' style={userInfo?.role !== 'admin' ? {display: 'none'} : {}}><div className='notify'><Icon type="bell" theme="filled" style={{ fontSize: '20px', width: '20px', height: '20px' }} /></div></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='header-divider'><div className='top-divider'></div></div>
        </Header>
    );
}

export default HeaderLayout;
