import styles from "@/src/components/pages/add-liquidity-page/components/AddLiquidity/AddLiquidity.module.css";
import CoinPair from "@/src/components/common/CoinPair/CoinPair";
import Coin from "@/src/components/common/Coin/Coin";
import ActionButton from "@/src/components/common/ActionButton/ActionButton";
import useModal from "@/src/hooks/useModal/useModal";
import {useRouter} from "next/navigation";
import {useCallback} from "react";
import useCreatePool from "@/src/hooks/useCreatePool";
import useAssetMetadata from "@/src/hooks/useAssetMetadata";
import StatusModal, {ModalType} from "@/src/components/common/StatusModal";

type AssetsData = {
  assetId: string;
  amount: string;
};

export type CreatePoolPreviewData = {
  assets: AssetsData[];
  isStablePool: boolean;
};

type Props = {
  previewData: CreatePoolPreviewData;
};

const PreviewCreatePoolDialog = ({previewData}: Props) => {
  const [SuccessModal, openSuccessModal] = useModal();

  const firstAssetMetadata = useAssetMetadata(previewData.assets[0].assetId);
  const secondAssetMetadata = useAssetMetadata(previewData.assets[1].assetId);

  const router = useRouter();

  const {assets, isStablePool} = previewData;

  const {createPoolData, createPool, isPoolCreationPending} = useCreatePool({
    firstAsset: assets[0].assetId,
    firstAssetAmount: assets[0].amount,
    secondAsset: assets[1].assetId,
    secondAssetAmount: assets[1].amount,
    isPoolStable: isStablePool,
  });

  const firstCoinAmount = previewData.assets[0].amount;
  const secondCoinAmount = previewData.assets[1].amount;

  // const rate = (
  //   parseFloat(firstCoinAmount) / parseFloat(secondCoinAmount)
  // ).toLocaleString(DefaultLocale, { minimumFractionDigits: 2 });

  const handleCreateLiquidity = useCallback(async () => {
    try {
      const data = await createPool();

      if (data?.id) {
        openSuccessModal();
      }
    } catch (e) {
      console.error(e);
    }
  }, [createPool, openSuccessModal]);

  const redirectToLiquidity = useCallback(() => {
    router.push("/liquidity");
  }, [router]);

  const feeText = isStablePool ? "0.05%" : "0.3%";

  const successModalSubtitle = `Added ${firstCoinAmount} ${firstAssetMetadata.symbol} and ${secondCoinAmount} ${secondAssetMetadata.symbol}`;

  return (
    <>
      <div className={styles.section}>
        <div className={styles.previewCoinPair}>
          <CoinPair
            firstCoin={previewData.assets[0].assetId}
            secondCoin={previewData.assets[1].assetId}
            isStablePool={isStablePool}
          />
        </div>
        <div className={styles.inputsPreview}>
          <div className={styles.inputPreviewRow}>
            <Coin
              assetId={previewData.assets[0].assetId}
              coinSelectionDisabled
            />
            <p className="mc-mono-m">{firstCoinAmount}</p>
          </div>
          <div className={styles.inputPreviewRow}>
            <Coin
              assetId={previewData.assets[1].assetId}
              coinSelectionDisabled
            />
            <p className="mc-mono-m">{secondCoinAmount}</p>
          </div>
          <hr className={styles.divider} />
          <div className={styles.inputPreviewRow}>
            <p className="mc-type-m">Fee tier</p>
            <p className="mc-mono-m">{feeText}</p>
          </div>
        </div>
        <ActionButton
          loading={isPoolCreationPending}
          onClick={handleCreateLiquidity}
          fullWidth
          size="big"
        >
          Create pool
        </ActionButton>
      </div>
      {/* <div className={styles.section}>
        <p>Selected Price</p>
        <div className={styles.sectionContent}>
          <div className={styles.previewPriceBlocks}>
            <div className={styles.previewPriceBlock}>
              <p className={styles.previewPriceBlockTitle}>
                Low price
              </p>
              <p className={styles.previewPriceBlockValue}>
                0
              </p>
              <p className={styles.previewPriceBlockExchange}>
                {coinA} per {coinB}
              </p>
              <p className={styles.previewPriceBlockDescription}>
                Your position will be 100% composed of {coinA} at this price
              </p>
            </div>
            <div className={styles.previewPriceBlock}>
              <p className={styles.previewPriceBlockTitle}>
                High price
              </p>
              <p className={styles.previewPriceBlockValue}>
                ∞
              </p>
              <p className={styles.previewPriceBlockExchange}>
                {coinA} per {coinB}
              </p>
              <p className={styles.previewPriceBlockDescription}>
                Your position will be 100% composed of {coinB} at this price
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.previewCurrentPriceBlock}>
          <p className={styles.previewPriceBlockTitle}>
            Current Price
          </p>
          <p className={styles.previewPriceBlockValue}>
            {rate}
          </p>
          <p className={styles.previewPriceBlockExchange}>
            {coinA} per {coinB}
          </p>
        </div>
      </div> */}
      <SuccessModal title={<></>} onClose={redirectToLiquidity}>
        <StatusModal
          type={ModalType.SUCCESS}
          subTitle={successModalSubtitle}
          title="Liquidity created successfully"
          transactionHash={createPoolData?.id}
        />
      </SuccessModal>
    </>
  );
};

export default PreviewCreatePoolDialog;
