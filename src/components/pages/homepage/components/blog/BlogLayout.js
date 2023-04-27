import React from 'react';
import ListLayout from '../../../common/list-layout/ListLayout';
import BlogCard from './BlogCard';

const BlogLayout = () => {
  const blogListTest = new Array(7).fill('test');
  return (
    <section id='blog-layout'>
      <ListLayout titleCategory={'THỦ THUẬT FACEBOOK'} contentSeeMore={'Xem tất cả bài viết'}>
        {blogListTest.map((blog, i) => <BlogCard key={i} />)}
      </ListLayout>
    </section>
  );
};
export default BlogLayout;
