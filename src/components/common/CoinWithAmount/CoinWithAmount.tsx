import styles from "./CoinWithAmount.module.css";
import {B256Address} from "fuels";
import {useAssetImage} from "@/src/hooks/useAssetImage";
import useAssetMetadata from "@/src/hooks/useAssetMetadata";
import Image from "next/image";

type Props = {
  amount: string;
  assetId: B256Address;
};

const CoinWithAmount = ({amount, assetId}: Props) => {
  const icon = useAssetImage(assetId);
  const metadata = useAssetMetadata(assetId);

  return (
    <div className={styles.coinWithAmount}>
      {icon && (
        <Image
          src={icon}
          alt={`${metadata.symbol} icon`}
          width={40}
          height={40}
          priority
        />
      )}
      <div className={styles.info}>
        <p className={styles.amount}>{amount}</p>
        <p className={styles.name}>{metadata.symbol}</p>
      </div>
    </div>
  );
};

export default CoinWithAmount;
