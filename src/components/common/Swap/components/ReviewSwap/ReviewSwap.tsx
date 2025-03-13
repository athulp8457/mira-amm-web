import {FC, memo} from "react";
import styles from "./ReviewSwap.module.css";
import {clsx} from "clsx";
import {TradeState} from "@/src/hooks/useSwapRouter";
import Loader from "../../../Loader/Loader";
import {PoolId} from "mira-dex-ts";
import {createPoolKey} from "@/src/utils/common";
import {useAssetImage} from "@/src/hooks/useAssetImage";
import useAssetMetadata from "@/src/hooks/useAssetMetadata";
import PriceImpact from "../PriceImpact/PriceImpact";

interface ReviewSwapProps {
  tradeState: TradeState;
  exchangeRate: string | null;
  pools: PoolId[] | undefined;
  feeValue: string | 0;
  sellMetadataSymbol: string | undefined;
  txCostPending: boolean;
  txCost: number | null;
  reservesPrice: number | undefined;
  previewPrice: number | undefined;
}

function SwapRouteItem({pool}: {pool: PoolId}) {
  const firstAssetIcon = useAssetImage(pool[0].bits);
  const secondAssetIcon = useAssetImage(pool[1].bits);

  const firstAssetMetadata = useAssetMetadata(pool[0].bits);
  const secondAssetMetadata = useAssetMetadata(pool[1].bits);

  const isStablePool = pool[2];
  const poolFeePercent = isStablePool ? 0.05 : 0.3;

  return (
    <>
      <img src={firstAssetIcon || ""} alt={firstAssetMetadata.symbol} />
      <img src={secondAssetIcon || ""} alt={secondAssetMetadata.symbol} />
      <p>({poolFeePercent}%)</p>
    </>
  );
}

const ReviewSwap: FC<ReviewSwapProps> = ({
  tradeState,
  exchangeRate,
  pools,
  feeValue,
  sellMetadataSymbol,
  txCostPending,
  txCost,
  reservesPrice,
  previewPrice,
}) => {
  const previewLoading = tradeState === TradeState.LOADING;

  return (
    <div className={styles.review}>
      <div className={styles.summary}>
        <div className={styles.summaryEntry}>
          <p>Rate:</p>
          {previewLoading || tradeState === TradeState.REEFETCHING ? (
            <Loader color="gray" />
          ) : (
            <p>{exchangeRate}</p>
          )}
        </div>

        <div className={styles.summaryEntry}>
          <p>Routing:</p>
          <div className={styles.feeLine}>
            {previewLoading || tradeState === TradeState.REEFETCHING ? (
              <Loader color="gray" />
            ) : (
              pools?.map((pool, index) => {
                const poolKey = createPoolKey(pool);

                return (
                  <div className={styles.poolsFee} key={poolKey}>
                    <SwapRouteItem pool={pool} />
                    {index !== pools.length - 1 && "+"}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.summaryEntry}>
          <p>Estimated fees:</p>
          {previewLoading || tradeState === TradeState.REEFETCHING ? (
            <Loader color="gray" />
          ) : (
            <p>
              {feeValue} {sellMetadataSymbol}
            </p>
          )}
        </div>

        <div className={styles.summaryEntry}>
          <p>Gas cost:</p>
          {txCostPending ? (
            <Loader color="gray" />
          ) : (
            <p>{txCost?.toFixed(9)} ETH</p>
          )}
        </div>
      </div>
      <PriceImpact reservesPrice={reservesPrice} previewPrice={previewPrice} />
    </div>
  );
};

export default memo(ReviewSwap);
