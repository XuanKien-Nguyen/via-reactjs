import React from 'react';
import ListLayout from '../../../../layout/user/products/ListLayout';
import BlogCard from './BlogCard';

const BlogLayout = () => {

  return (
    <section id='blog-layout'>
      <ListLayout titleCatagory={'THỦ THUẬT FACEBOOK'} contentSeeMore={'Xem tất cả bài viết'} cardComponent={<BlogCard />}></ListLayout>
    </section>
  );
};
export default BlogLayout;
