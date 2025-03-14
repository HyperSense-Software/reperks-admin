// components/LoadingOverlay.js
import React from 'react';
import styles from './LoadingOverlay.module.css'; // Assume you will create this CSS module

export const LoadingOverlay = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingOverlay;
