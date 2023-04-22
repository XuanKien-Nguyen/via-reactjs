import React from 'react';
import { Card } from 'antd';

const BlogCard = () => {
    return (
        <Card className='blog-card' bordered={false}>
            <a href='#'>
                <div className='blog-image'>
                    <img alt="blog" src={require('../../../../../assets/img/blog-image.png')}/>
                </div>
                <div className='blog-container'>
                    <h3 className='blog-title'>TITLE BLOG</h3>
                    <div className='is-divider'></div>
                    <div className='blog-text'><span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></div>
                </div>
            </a>
        </Card>
    );
};
export default BlogCard;
