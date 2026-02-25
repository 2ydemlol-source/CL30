import React from 'react';
import Lottie from 'lottie-react';

const LottieGift = ({ gift, className = 'w-full h-full', loop = true }) => {
  if (gift?.lottieData) {
    return <Lottie animationData={gift.lottieData} loop={loop} className={className} />;
  }

  if (gift?.image) {
    return <img src={gift.image} alt={gift.name} className={`${className} object-contain`} />;
  }

  return <div className={`${className} bg-zinc-800 rounded-xl`} />;
};

export default LottieGift;
