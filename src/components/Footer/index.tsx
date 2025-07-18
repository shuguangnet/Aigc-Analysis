import {  HeartFilled } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      
      style={{
        
        color: '#fff',
        padding: '24px 0',
      }}
      copyright={
        <div>
          <div >
            Copyright © {currentYear} 陕西科技大学镐京学院
          </div>
          <div >
            Powered by <HeartFilled  /> SunHe
          </div>
         
        </div>
      }
      links={[
        {
          key: 'home',
          title: '镐京学院',
          href: 'https://www.sust.edu.cn/',
          blankTarget: true,
        },
        
       
      ]}
    />
  );
};

export default Footer;