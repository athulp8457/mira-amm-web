import styles from "./LoaderV2.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"

const LoaderV2 = () => {
  return (
    <div className={styles.loaderWrapper}>
      <Skeleton height={50} count={3} />
    </div>
  );
};

export default LoaderV2;
