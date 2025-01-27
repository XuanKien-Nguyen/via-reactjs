import React, { useContext, useEffect, useState, Fragment } from 'react';
import { Dropdown, Icon, Input, Layout, Menu, Tabs, Select, Drawer } from 'antd';
import { logout } from "../../../services/user";
import { getParentCategoryList } from '../../../services/category/category';
import { convertCurrencyVN } from '../../../utils/helpers';
import { useDispatch, useSelector } from "react-redux";
import { LayoutContext } from "../../../contexts";

import { useTranslation } from 'react-i18next';
import i18n from '../../../translation/i18n';

const { Search } = Input;
const { Header } = Layout;
const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { Option } = Select;

function HeaderLayout({ history }) {

    const { t } = useTranslation()

    const user = useSelector(store => store.user)

    const categories = useSelector(store => store.categories)

    // const [userInfo, setUserInfo] = useState()
    const [visible, setVisible] = useState(false)
    const [visibleNoti, setVisibleNoti] = useState(false)

    const { setLoading } = useContext(LayoutContext);

    const dispatch = useDispatch()

    const goto = url => history.push(url)

    const onClick = ({ key }) => {
        window.location.href = `/categories?id=${key}`
    };

    const onClickSupport = ({ key }) => {
        window.location.href = `/user-info?menu=${key}`
    };

    const handleLogout = async () => {
        setLoading(true)
        await logout();
        dispatch({ type: "LOGOUT" })
        localStorage.removeItem("is_logged")
        // localStorage.removeItem('user_info')
        window.location.href = '/'
        setLoading(false)
    }

    useEffect(() => {
        if (!categories.called) {
            getParentCategoryList().then(res => {
                if (res.status === 200 && res.data) {
                    const lst = res.data?.parentCategoryList?.map(el => ({ value: el.id, label: el.name })) || []
                    dispatch({ type: 'SET_CATEGORIES', payload: lst })
                }
            });
        }

        // const u = localStorage.getItem('user_info')
        // if (u) {
        //     setUserInfo(JSON.parse(u))
        // }
    }, []);

    const menu = (
        <Menu onClick={onClick}>
            {categories?.list?.map((category) => <Menu.Item key={category.value}>{category.label}</Menu.Item>)}
        </Menu>
    );

    const menuSupport = (
        <Menu onClick={onClickSupport}>
            <Menu.Item key={'recharge-tickets'}>{t('profile.recharge_tickets')}</Menu.Item>
            <Menu.Item key={'warranty-tickets'}>{t('profile.warranty_tickets')}</Menu.Item>
        </Menu>
    )

    const dropDownUser = () => {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={() => goto('/user-info')}>{t('common.profile')}</a>
                </Menu.Item>
                {(user?.role === 'admin' || user?.role === 'staff') && <Menu.Item >
                    <a onClick={() => {
                        changeLanguage('vi');
                        goto('/admin');
                    }}>{t('common.admin')}</a>
                </Menu.Item>}
                <Menu.Item>
                    <a onClick={handleLogout}>{t('common.sign_out')}</a>
                </Menu.Item>
            </Menu>
        )
        return <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {user?.username?.toUpperCase()} <Icon type="down" />
            </a>
        </Dropdown>
    }

    const changeLanguage = (value) => {
        i18n.changeLanguage(value);
    }

    const searchProduct = (value) => {
        const query = new URLSearchParams(window.location.search)
        const name = query.get('name')
        if (name || name === '') {
            query.delete('name')
        }
        query.append('name', value)
        window.location.href = `/categories?${query.toString()}`
        //
        // history.push({
        //     pathname: '',
        //     search:
        // })
    }

    const goToRecharge = () => {
        if (!user) {
            history.push('/login')
            return
        } 
        history.push('/user-info?menu=recharge')
    }

    return (
        <Header id='header_user' style={{ height: 'auto', padding: 0, margin: 0 }}>
            <div id="top-bar" className="header-top" style={{ backgroundColor: '#1b74e4', height: '40px', lineHeight: '40px' }}>
                <div className='header-top_container'>
                    <div className="header-top_left"><Search
                        type='search'
                        placeholder={t('common.placeholder_search')}
                        onSearch={searchProduct}
                        style={{ width: 250, color: 'white' }}
                    /></div>
                    <div className='header-top_right'>
                        <ul>
                            <li className='item'><a href='' onClick={() => {goto('/categories')}}>{t('common.all_product')}</a></li>
                            <li className='item'><a href=''>{t('common.guide')}</a></li>
                            <li className='item'><a href='' onClick={goToRecharge}>{t('common.recharge')}</a></li>
                            <li className='item'><a href='' onClick={() => {goto('/blog')}}>{t('common.tricks')}</a></li>
                            <li className='item'><a href=''>{t('common.about-us')}</a></li>
                            <li className='item'><a href=''>{t('common.contact')}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="master-header" className="header-main" style={{ height: '63px' }}>
                <div className='header-main_container'>
                    <div className='header-main-icon__menu'>
                        <Icon type="menu" style={{ fontSize: '20px' }} onClick={() => {setVisible(true)}} />
                    </div>
                    <div className='header-logo' style={{ marginRight: '30px', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
                        <img alt='via2fa' src={require('../../../assets/img/clone-logo.gif')} style={{ width: '135px' }} />
                    </div>
                    <div className="header-main_left">
                        <ul>
                            <li className='item'><Dropdown overlay={menu}><a href='#' onClick={e => e.preventDefault()} className='uppercase'>{t('common.category')}<Icon type="down" style={{ marginLeft: '4px' }} /></a></Dropdown></li>
                            <li className='item'><a href='#' className='uppercase' onClick={() => {goto('/blog')}}>{t('common.blog')}</a></li>
                            {user && <li className='item'><Dropdown overlay={menuSupport}><a href='#' onClick={e => e.preventDefault()} className='uppercase'>{t('common.support')}<Icon type="down" style={{ marginLeft: '4px' }} /></a></Dropdown></li>}
                        </ul>
                    </div>
                    <div className="header-main_right">
                        <ul>
                            <li className='item'>
                                <Select defaultValue={i18n?.language || 'vi'} style={{ width: 110 }} onChange={changeLanguage}>
                                    <Option value="vi">Việt Nam</Option>
                                    <Option value="en">English</Option>
                                </Select>
                            </li>
                            {user && <li className='item header_user-balance'><b>{t('common.total_balance')}:&nbsp;{convertCurrencyVN(user?.totalBalance)}</b></li>}
                            <li className='header-devider'></li>
                            <li className='item' style={user?.role !== 'admin' ? { display: 'none' } : {}} onClick={() => {setVisibleNoti(true)}}><div className='notify'><Icon type="bell" theme="filled" style={{ fontSize: '20px', width: '20px', height: '20px' }} /></div></li>
                            <li style={{
                                height: '64px',
                                display: 'flex',
                            }} className='item'><div className='signin-signup d-flex justify-content-center align-items-center' style={{ height: '100%' }}>{user ? dropDownUser() : <Fragment><div className={'login-home uppercase'} onClick={() => goto('/login')}>{t('common.sign_in')}</div><div className={'register-home uppercase'} onClick={() => goto('/register')}>{t('common.sign_up')}</div></Fragment>}</div></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='header-divider'><div className='top-divider'></div></div>
            <Drawer
                id="header_mobile"
                placement='left'
                onClose={() => {setVisible(false)}}
                visible={visible}
                headerStyle={{display: 'none'}}
                bodyStyle={{padding: 0}}
            >
                    <div className='header-logo' style={{ marginBottom: '8px', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
                        <img alt='via2fa' src={require('../../../assets/img/clone-logo.gif')} style={{ width: '150px' }} />
                    </div>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="MENU" key="1">
                            <Menu
                                style={{ width: '100%' }}
                                mode="inline"
                            >
                                <Menu.Item key="all-category" className='sub-menu__item'  onClick={() => {goto('/categories')}}>
                                    <span className='uppercase'>{t('common.all_product')}</span>
                                </Menu.Item>
                                <Menu.Item key="guide" className='sub-menu__item'>
                                    <span className='uppercase'>{t('common.guide')}</span>
                                </Menu.Item>
                                <Menu.Item key="recharge" className='sub-menu__item' onClick={goToRecharge}>
                                    <span className='uppercase'>{t('common.recharge')}</span>
                                </Menu.Item>
                                <Menu.Item key="facebook" className='sub-menu__item' onClick={() => {goto('/blog')}}>
                                    <span className='uppercase'>{t('common.tricks')}</span>
                                </Menu.Item>
                                <Menu.Item key="about-us" className='sub-menu__item'>
                                    <span className='uppercase'>{t('common.about-us')}</span>
                                </Menu.Item>
                                <Menu.Item key="contact" className='sub-menu__item'>
                                    <span className='uppercase'>{t('common.contact')}</span>
                                </Menu.Item>
                            </Menu>
                        </TabPane>
                        <TabPane tab="VIA" key="2">
                            <Menu
                                style={{ width: '100%' }}
                                mode="inline"
                            >
                                <SubMenu
                                    key="category"
                                    title={
                                        <span className='uppercase'>
                                            {t('common.category')}
                                        </span>
                                    }
                                    className='sub-menu-category'
                                    onClick={onClick}
                                >
                                    {categories?.list?.map((category) => <Menu.Item key={category.value}>{category.label}</Menu.Item>)}
                                </SubMenu>
                                <Menu.Item key="blog" className='sub-menu-blog' onClick={() => {goto('/blog')}}>
                                    <span className='uppercase'>{t('common.blog')}</span>
                                </Menu.Item>
                                {user && <SubMenu
                                    key="support"
                                    title={
                                        <span className='uppercase'>
                                            {t('common.support')}
                                        </span>
                                    }
                                    className='sub-menu-support'
                                    onClick={onClickSupport}
                                >
                                    <Menu.Item key={'recharge-tickets'}>{t('profile.recharge_tickets')}</Menu.Item>
                                    <Menu.Item key={'warranty-tickets'}>{t('profile.warranty_tickets')}</Menu.Item>
                                </SubMenu>}
                            </Menu>
                        </TabPane>
                    </Tabs>
            </Drawer>
            <Drawer
                id="header_noti"
                placement='right'
                onClose={() => {setVisibleNoti(false)}}
                visible={visibleNoti}
                headerStyle={{display: 'none'}}
                bodyStyle={{padding: 0}}
                width='600px'
            >
                    NOTIFICATION HERE
            </Drawer>
        </Header>
    );
}

export default HeaderLayout;
