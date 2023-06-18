import React from 'react';
import { Card, Badge, Tooltip } from 'antd';
import {useHistory} from "react-router-dom";
import moment from 'moment';

const BlogCard = ({blogDetail}) => {

    const history = useHistory()

    const convertDate = (date) => {
        let dateString = date.substring(0, 10).split("-");
        let dateMoment = moment(dateString, "YYYYMMDD").format("MMM Do YYYY");
        return <Tooltip title={dateMoment}>
            <div className='badge-container'>
                    <span className='post-date'>{dateMoment.substring(4, 8)}</span>
                    <br/>
                    <span className='post-month'>{dateMoment.substring(0, 3)}</span>
                </div>
        </Tooltip>
    }

    return (
        <Card className='blog-card' bordered={false} onClick={() => {
                if (blogDetail.slug) history.push(`/${blogDetail.slug}`)
            }}>
            <a href='#'>
                <div className='blog-image'>
                    <img alt="blog" src={blogDetail.post_img}/>
                </div>
                <div className='blog-container'>
                    <Tooltip title={blogDetail.title.toUpperCase()}>
                        <h3 className='blog-title'>{blogDetail.title.toUpperCase()}</h3>
                    </Tooltip>
                    <div className='is-divider'></div>
                    <div className='blog-text'><span>{blogDetail.content}</span></div>
                </div>
                <Badge className='badge-post-time'>
                    {convertDate(blogDetail.created_time)}
                </Badge>
            </a>
        </Card>
    );
};
export default BlogCard;
