import ActionButton from "@/src/components/common/ActionButton/ActionButton";
import AprBadge from "@/src/components/common/AprBadge/AprBadge";
import CoinPair from "@/src/components/common/CoinPair/CoinPair";
import Info from "@/src/components/common/Info/Info";
import StatusModal, {ModalType} from "@/src/components/common/StatusModal";
import useAssetMetadata from "@/src/hooks/useAssetMetadata";
import useCheckActiveNetwork from "@/src/hooks/useCheckActiveNetwork";
import useModal from "@/src/hooks/useModal/useModal";
import usePoolAPR from "@/src/hooks/usePoolAPR";
import usePoolNameAndMatch from "@/src/hooks/usePoolNameAndMatch";
import usePositionData from "@/src/hooks/usePositionData";
import useRemoveLiquidity from "@/src/hooks/useRemoveLiquidity";
import {createPoolKey} from "@/src/utils/common";
import {DefaultLocale} from "@/src/utils/constants";
import clsx from "clsx";
import {bn, formatUnits, FuelError} from "fuels";
import {PoolId} from "mira-dex-ts";
import {memo, useCallback, useRef, useState} from "react";
import Slider from "../Slider";
import styles from "./index.module.css";
import {useRouter} from "next/navigation";
import {useAssetPrice} from "@/src/hooks/useAssetPrice";
import fiatValueFormatter from "@/src/utils/abbreviateNumber";
import {APRTooltip} from "../../../add-liquidity-page/components/AddLiquidity/addLiquidityTooltips";

type Props = {
  pool: PoolId;
};

const RemoveLiquidityModalContent = ({pool}: Props) => {
  const router = useRouter();

  const [SuccessModal, openSuccessModal] = useModal();
  const [FailureModal, openFailureModal] = useModal();

  const coinAMetadata = useAssetMetadata(pool[0].bits);
  const coinBMetadata = useAssetMetadata(pool[1].bits);
  const {assets, lpTokenBalance} = usePositionData({pool});
  const {apr} = usePoolAPR(pool);
  const isValidNetwork = useCheckActiveNetwork();

  const {price: coinAPrice} = useAssetPrice(pool[0].bits);
  const {price: coinBPrice} = useAssetPrice(pool[1].bits);

  const [removeLiquidityPercentage, setRemoveLiquidityPercentage] =
    useState(50);

  const aprValue =
    apr !== undefined
      ? apr.apr.toLocaleString(DefaultLocale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;
  const tvlValue = apr?.tvlUSD;

  const poolKey = createPoolKey(pool);

  const {isMatching} = usePoolNameAndMatch(poolKey);

  const isStablePool = pool[2];

  const [assetA, assetB] = assets || [
    [pool[0], bn(0)],
    [pool[1], bn(0)],
  ];

  const coinAAmount = formatUnits(assetA[1], coinAMetadata.decimals);
  const coinAAmountToWithdraw = assetA[1]
    .mul(bn(removeLiquidityPercentage))
    .div(bn(100));
  const coinAAmountToWithdrawStr = formatUnits(
    coinAAmountToWithdraw,
    coinAMetadata.decimals,
  );

  const coinBAmount = formatUnits(assetB[1], coinBMetadata.decimals);
  const coinBAmountToWithdraw = assetB[1]
    .mul(bn(removeLiquidityPercentage))
    .div(bn(100));
  const coinBAmountToWithdrawStr = formatUnits(
    coinBAmountToWithdraw,
    coinBMetadata.decimals,
  );

  const totalCoinValueToBeRemoved = !!(
    coinAPrice &&
    coinBPrice &&
    Number(coinAAmountToWithdrawStr) &&
    Number(coinBAmountToWithdrawStr)
  )
    ? fiatValueFormatter(
        Number(coinAAmountToWithdrawStr) * coinAPrice +
          Number(coinBAmountToWithdrawStr) * coinBPrice,
      )
    : "-";

  const {
    data,
    removeLiquidity,
    error: removeLiquidityError,
    isPending,
  } = useRemoveLiquidity({
    pool,
    liquidityPercentage: removeLiquidityPercentage,
    lpTokenBalance,
    coinAAmountToWithdraw,
    coinBAmountToWithdraw,
  });

  const confirmationModalAssetsAmounts = useRef({
    firstAsset: coinAAmountToWithdrawStr,
    secondAsset: coinBAmountToWithdrawStr,
  });

  const handleRemoveLiquidity = useCallback(async () => {
    try {
      const result = await removeLiquidity();
      if (result) {
        confirmationModalAssetsAmounts.current = {
          firstAsset: coinAAmountToWithdrawStr,
          secondAsset: coinBAmountToWithdrawStr,
        };
        openSuccessModal();
      }
    } catch (e) {
      openFailureModal();
    }
  }, [
    coinAAmountToWithdrawStr,
    coinBAmountToWithdrawStr,
    openFailureModal,
    openSuccessModal,
    removeLiquidity,
  ]);

  const handleChange = (value: number) => {
    setRemoveLiquidityPercentage(value);
  };

  const redirectToLiquidity = () =>
    router.push(`/liquidity/position?pool=${poolKey}`);

  const getModalMessage = () => {
    const successMessage = `Removed ${confirmationModalAssetsAmounts.current.firstAsset} ${coinAMetadata.symbol} and ${confirmationModalAssetsAmounts.current.secondAsset} ${coinBMetadata.symbol} from your position`;

    let errorMessage: string;
    if (removeLiquidityError instanceof FuelError) {
      errorMessage = removeLiquidityError.message;
    } else {
      errorMessage =
        "An error occurred while processing your request. Please try again or contact support if the issue persists.";
    }

    return [successMessage, errorMessage];
  };

  const [successModalSubtitle, errorModalSubtitle] = getModalMessage();

  const withdrawalDisabled = !isValidNetwork;
  let buttonTitle = "Confirm";
  if (withdrawalDisabled) {
    buttonTitle = "Incorrect network";
  }

  return (
    <div className={styles.removeLiquidityContent}>
      <div>
        <p className={clsx(styles.subHeader, "mc-type-m")}>Selected pair</p>
        <div className={styles.coinHeader}>
          <CoinPair
            firstCoin={pool[0].bits}
            secondCoin={pool[1].bits}
            isStablePool={isStablePool}
          />
          <div className={styles.APR}>
            <div className={styles.aprText}>
              <p className="mc-type-s">Estimated APR</p>
              <Info tooltipText={APRTooltip} tooltipKey="apr" />
            </div>
            {isMatching ? (
              <div className={styles.aprDiv}>
                <AprBadge
                  aprValue={
                    aprValue === "NaN"
                      ? "n/a"
                      : aprValue
                        ? `${aprValue}%`
                        : "pending"
                  }
                  small
                  poolKey={poolKey}
                  tvlValue={tvlValue}
                />
              </div>
            ) : (
              <span className={clsx(aprValue ? "mc-mono-m" : "mc-type-m")}>
                {aprValue ? `${aprValue}%` : "Awaiting data"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.sliderContainer}>
        <div className={styles.sliderInfoContainer}>
          <p>Amount to remove</p>
          <p>{totalCoinValueToBeRemoved}</p>
        </div>
        <Slider value={removeLiquidityPercentage} onChange={handleChange} />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.liquidityTable}>
          <thead className="mc-type-b">
            <tr>
              <th />
              <th>{coinAMetadata.symbol}</th>
              <th>{coinBMetadata.symbol}</th>
            </tr>
          </thead>
          <hr className={styles.divider} />
          <tbody>
            <tr>
              <td className="mc-type-b">Current position</td>
              <td className="mc-mono-b">{coinAAmount}</td>
              <td className="mc-mono-b">{coinBAmount}</td>
            </tr>
            <tr className={styles.lastRow}>
              <td className="mc-type-b">Remove</td>
              <td className="mc-mono-b">{coinAAmountToWithdrawStr}</td>
              <td className="mc-mono-b">{coinBAmountToWithdrawStr}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={clsx(styles.infoBlockText, "mc-type-b")}>
        This is based on the current price of the pool. Your fees earned will
        always increase, but the principal amount may change with the price of
        the pool.
      </p>

      <ActionButton
        onClick={handleRemoveLiquidity}
        disabled={withdrawalDisabled}
        loading={isPending}
        fullWidth
        size="big"
      >
        {buttonTitle}
      </ActionButton>
      <SuccessModal title={<></>} onClose={redirectToLiquidity}>
        <StatusModal
          type={ModalType.SUCCESS}
          transactionHash={data?.id}
          subTitle={successModalSubtitle}
          title="Removed liquidity successfully"
        />
      </SuccessModal>
      <FailureModal title={<></>}>
        <StatusModal
          type={ModalType.ERROR}
          subTitle={errorModalSubtitle}
          title="Failed to remove liquidity"
        />
      </FailureModal>
    </div>
  );
};

export default memo(RemoveLiquidityModalContent);
