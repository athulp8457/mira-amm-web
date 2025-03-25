import {ColorProps} from "../SvgPropTypes";

export const DiscordIcon = ({primaryColor}: ColorProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={primaryColor}
        d="M24.317 8.15509C22.7873 7.4532 21.147 6.93609 19.4319 6.63991C19.4007 6.6342 19.3695 6.64848 19.3534 6.67705C19.1424 7.05227 18.9087 7.54177 18.7451 7.92651C16.9004 7.65034 15.0652 7.65034 13.2583 7.92651C13.0946 7.53321 12.8525 7.05227 12.6406 6.67705C12.6245 6.64944 12.5933 6.63515 12.562 6.63991C10.8479 6.93514 9.20756 7.45226 7.67693 8.15509C7.66368 8.1608 7.65233 8.17033 7.64479 8.1827C4.53339 12.8311 3.68105 17.3652 4.09918 21.8431C4.10107 21.865 4.11337 21.8859 4.1304 21.8992C6.18321 23.4068 8.17171 24.322 10.1233 24.9286C10.1545 24.9382 10.1876 24.9267 10.2075 24.901C10.6691 24.2706 11.0806 23.6058 11.4335 22.9068C11.4543 22.8659 11.4344 22.8173 11.3919 22.8011C10.7391 22.5535 10.1176 22.2516 9.51973 21.9088C9.47244 21.8812 9.46865 21.8135 9.51216 21.7811C9.63797 21.6869 9.76382 21.5888 9.88396 21.4897C9.90569 21.4716 9.93598 21.4678 9.96153 21.4792C13.8893 23.2725 18.1415 23.2725 22.023 21.4792C22.0485 21.4669 22.0788 21.4707 22.1015 21.4888C22.2216 21.5878 22.3475 21.6869 22.4742 21.7811C22.5177 21.8135 22.5149 21.8812 22.4676 21.9088C21.8697 22.2583 21.2482 22.5535 20.5945 22.8002C20.552 22.8163 20.533 22.8659 20.5538 22.9068C20.9143 23.6049 21.3258 24.2696 21.7789 24.9001C21.7978 24.9267 21.8319 24.9382 21.8631 24.9286C23.8241 24.322 25.8126 23.4068 27.8654 21.8992C27.8834 21.8859 27.8948 21.8659 27.8967 21.844C28.3971 16.6671 27.0585 12.1701 24.3482 8.18365C24.3416 8.17033 24.3303 8.1608 24.317 8.15509ZM12.02 19.1165C10.8375 19.1165 9.86313 18.0308 9.86313 16.6976C9.86313 15.3643 10.8186 14.2786 12.02 14.2786C13.2309 14.2786 14.1958 15.3738 14.1769 16.6976C14.1769 18.0308 13.2214 19.1165 12.02 19.1165ZM19.9947 19.1165C18.8123 19.1165 17.8379 18.0308 17.8379 16.6976C17.8379 15.3643 18.7933 14.2786 19.9947 14.2786C21.2056 14.2786 22.1705 15.3738 22.1516 16.6976C22.1516 18.0308 21.2056 19.1165 19.9947 19.1165Z"
        fillOpacity="1"
      />
    </svg>
  );
};

export default DiscordIcon;
