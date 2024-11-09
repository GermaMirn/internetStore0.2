import React from 'react';
import { Header } from './Header/Header';
import { Footer } from './Fotter/Footer';
import styles from './MainLayout.module.css';


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.appContainer}>
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
};


export default MainLayout;
