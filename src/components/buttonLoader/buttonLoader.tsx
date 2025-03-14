import styles from './buttonLoader.module.css'; // Assume you will create this CSS module

const ButtonLoader = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;

  return <div className={styles.loader}></div>;
};

export default ButtonLoader;
