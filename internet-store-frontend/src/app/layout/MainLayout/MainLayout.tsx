import React from 'react';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import styles from './MainLayout.module.css';
import { MainLayoutProps } from '../../../interfaces';


const MainLayout: React.FC<MainLayoutProps> = ({ children, noPadding }) => {
  return (
    <div className={styles.appContainer}>
      <Header />
      <main className={`${styles.mainContent} ${noPadding ? styles.noPadding : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};


export default MainLayout;
