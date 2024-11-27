import React from 'react';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import styles from './MainLayout.module.css';


const MainLayout: React.FC<{ children: React.ReactNode, noPadding: boolean }> = ({ children, noPadding }) => {
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
