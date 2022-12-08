import styles from './basic.module.less';

/* eslint-disable-next-line */
export interface BasicProps {}

export function Basic(props: BasicProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Basic!</h1>
    </div>
  );
}

export default Basic;
