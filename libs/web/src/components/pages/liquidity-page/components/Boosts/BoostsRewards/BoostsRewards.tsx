import styles from "./BoostsRewards.module.css";
import Info from "@/src/components/common/Info/Info";
import {
  POINTS_TOOLTIP,
  POINTS_RANK_TOOLTIP,
  DefaultLocale,
} from "@/src/utils/constants";
import Loader from "@/src/components/common/Loader/Loader";
import {usePointsRank} from "@/src/hooks/usePoints/usePoints";
import PointsIcon from "@/src/components/icons/Points/PointsIcon";
import {LearnMoreButton} from "@/src/components/common/LearnMoreButton/LearnMoreButton";
import clsx from "clsx";

const BoostsRewards = (): JSX.Element => {
  const {data: pointsRankArray, isLoading, error} = usePointsRank();

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader color="gray" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  let pointsRank = {
    points: 0,
    rank: 0,
    address: "",
  };

  if (pointsRankArray && pointsRankArray.data.length > 0) {
    pointsRank = pointsRankArray.data[0];
  }

  return (
    <div className={styles.boosts}>
      {/* <div className={styles.boostsHeader}>
        <p className={clsx(pointsStyles.pointsTitle, "mc-type-xxxl")}>
        <Link href={POINTS_LEARN_MORE_URL} target="_blank">
          <LearnMoreButton />
        </Link>
      </div> */}

      {/* Boosts rewards details */}
      <div className={styles.boostsFallback}>
        <div className={styles.rewardsItem}>
          <div className={styles.rewardsLabel}>
            <p className="mc-type-m">Your Points</p>
            <Info
              tooltipText={POINTS_TOOLTIP}
              tooltipKey="points"
              color="#D1D4F9"
            />
          </div>
          <div className={styles.rewardsValue}>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <PointsIcon />
                <p className="mc-mono-xxxl">
                  {pointsRank?.points.toLocaleString(DefaultLocale, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </>
            )}
          </div>
        </div>
        <div className={styles.rankSection}>
          <div className={styles.divider}></div>
          <div className={styles.rankItem}>
            <div className={styles.rewardsLabel}>
              <p className="mc-type-m">Your rank</p>
              <Info
                tooltipText={POINTS_RANK_TOOLTIP}
                tooltipKey="rank"
                color="#D1D4F9"
              />
            </div>
            <p className={clsx(styles.rank, "mc-mono-xl")}>
              {pointsRank?.rank}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostsRewards;
