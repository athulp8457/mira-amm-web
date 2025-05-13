import Logo from "@/src/components/common/Logo/Logo";

import styles from "./Header.module.css";
import Link from "next/link";
import {clsx} from "clsx";
import {usePathname} from "next/navigation";
import ConnectButton from "@/src/components/common/ConnectButton/ConnectButton";
import LaunchAppButton from "@/src/components/common/LaunchAppButton/LaunchAppButton";
import DisconnectMobile from "@/src/components/common/ConnectButton/DisconnectMobile";
import {useIsConnected} from "@fuels/react";
import {
  BlogLink,
  FuelAppUrl,
  POINTS_LEARN_MORE_URL,
  POINTS_PROMO_TITLE,
} from "@/src/utils/constants";
import IconButton from "../IconButton/IconButton";
import CloseIcon from "../../icons/Close/CloseIcon";
import {useEffect, useState} from "react";
import PointsIcon from "../../icons/Points/PointsIcon";

type Props = {
  isHomePage?: boolean;
};

const PROMO_BANNER_STORAGE_KEY = "fuel-boost-program-promo-banner-closed";

const ISSERVER = typeof window === "undefined";

const Header = ({isHomePage}: Props) => {
  const pathname = usePathname();
  const {isConnected} = useIsConnected();
  const [isPromoShown, setIsPromoShown] = useState(false);

  useEffect(() => {
    if (!ISSERVER) {
      const bannerClosed = localStorage.getItem(PROMO_BANNER_STORAGE_KEY);
      setIsPromoShown(!bannerClosed);
    }
  }, []);

  const handleCloseBanner = () => {
    setIsPromoShown(false);
    localStorage.setItem(PROMO_BANNER_STORAGE_KEY, "true");
  };

  const NavLinks = () => {
    return (
      <>
        <Link
          href="/"
          className={clsx(styles.link, pathname === "/" && styles.activeLink)}
        >
          Swap
        </Link>
        <Link
          href="/liquidity"
          className={clsx(
            styles.link,
            pathname.includes("/liquidity") && styles.activeLink,
          )}
        >
          Liquidity
        </Link>
        <Link
          href="/points"
          className={clsx(
            styles.link,
            pathname.includes("/points") && styles.activeLink,
          )}
        >
          Points
        </Link>
        <a
          href={`${FuelAppUrl}/bridge?from=eth&to=fuel&auto_close=true&=true`}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Bridge
        </a>
      </>
    );
  };

  return (
    <header
      className={clsx(
        styles.header,
        pathname.includes("/liquidity") && styles.headerFixed,
      )}
    >
      {isPromoShown && (
        <section className={styles.promo}>
          <div className={styles.promo_text}>
            <PointsIcon />
            <p className="mc-type-l">
              {POINTS_PROMO_TITLE}
              <Link href={POINTS_LEARN_MORE_URL} target="_blank">
                <u>Learn More</u>
              </Link>
            </p>
          </div>
          <IconButton onClick={handleCloseBanner} className={styles.promoClose}>
            <CloseIcon />
          </IconButton>
        </section>
      )}
      <section className={styles.main}>
        <div className={styles.left}>
          <Logo />
        </div>

        <div className={clsx(styles.center)}>
          <div className={clsx("mc-type-l", styles.links)}>
            <NavLinks />
          </div>
        </div>

        <div className={clsx(styles.right)}>
          {isHomePage && (
            <>
              <a
                href="https://docs.mira.ly"
                className={styles.link}
                target="_blank"
              >
                Docs
              </a>
              <a href={BlogLink} className={styles.link} target="_blank">
                Blog
              </a>
            </>
          )}
          {/* {!isHomePage && <TestnetLabel />} */}
          {!isHomePage && <ConnectButton className={styles.launchAppButton} />}
          {isHomePage && (
            <div className={styles.launchAppArea}>
              {isConnected ? (
                <ConnectButton className={styles.launchAppButton} />
              ) : (
                <LaunchAppButton className={styles.launchAppButton} />
              )}
            </div>
          )}
        </div>

        <div className={clsx("mobileOnly", styles.links)}>
          <ConnectButton className={styles.disconnectMobile} />
        </div>
      </section>

      <div className={clsx("mobileOnly", styles.navMobile)}>
        <div className={clsx("mc-type-b", styles.links)}>
          <NavLinks />
        </div>
      </div>
    </header>
  );
};

export default Header;
