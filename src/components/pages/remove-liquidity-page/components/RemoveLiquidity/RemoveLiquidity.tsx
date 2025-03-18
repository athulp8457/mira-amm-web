import BackLink from "@/src/components/common/BackLink/BackLink";
import IconButton from "@/src/components/common/IconButton/IconButton";
import {DefaultSlippageValue} from "@/src/components/common/Swap/Swap";
import CloseIcon from "@/src/components/icons/Close/CloseIcon";
import AddLiquidityDialog from "@/src/components/pages/add-liquidity-page/components/AddLiquidity/AddLiquidityDialog";
import PreviewAddLiquidityDialog, {
  AddLiquidityPreviewData,
} from "@/src/components/pages/add-liquidity-page/components/AddLiquidity/PreviewAddLiquidityDialog";
import {PoolId} from "mira-dex-ts";
import {useRouter} from "next/navigation";
import {useCallback, useState} from "react";
import styles from "./RemoveLiquidity.module.css";

type Props = {
  poolId: PoolId;
  poolKey: string;
};

const RemoveLiquidity = ({poolId, poolKey}: Props): JSX.Element => {
  const router = useRouter();

  const [previewData, setPreviewData] =
    useState<AddLiquidityPreviewData | null>(null);
  const [slippage, setSlippage] = useState<number>(DefaultSlippageValue);

  const handleBackClick = useCallback(() => {
    if (previewData) {
      setPreviewData(null);
    } else {
      router.back();
    }
  }, [previewData, router]);

  const handleCloseClick = useCallback(() => {
    router.push("/liquidity");
  }, [router]);

  const showPreview = Boolean(previewData);

  return (
    <>
      <BackLink showOnDesktop onClick={handleBackClick} title="Back to Pool" />
      <section className="liquidity-action-container">
        <div className={styles.addLiquidityHeading}>
          <p className={styles.title}>Add Liquidity</p>

          {showPreview && (
            <IconButton onClick={handleCloseClick}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
        {showPreview ? (
          <PreviewAddLiquidityDialog
            previewData={previewData!}
            setPreviewData={setPreviewData}
            slippage={slippage}
          />
        ) : (
          <AddLiquidityDialog
            poolId={poolId}
            setPreviewData={setPreviewData}
            poolKey={poolKey}
          />
        )}
      </section>
      {showPreview && <div className={styles.loadingOverlay} />}
    </>
  );
};

export default RemoveLiquidity;
