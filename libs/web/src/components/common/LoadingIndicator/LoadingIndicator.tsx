import styles from "./LoadingIndicator.module.css";
import clsx from "clsx";

type LoadingProps = {
  fontSize?: string;
};

const LoadingIndicator = ({
  fontSize = "mc-type-xxl",
}: LoadingProps): JSX.Element => {
  return <span className={clsx(styles.loadingAnimation, `${fontSize}`)} />;
};

export default LoadingIndicator;
