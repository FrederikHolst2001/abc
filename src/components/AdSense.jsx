import React, { useEffect } from 'react';

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  style = { display: 'block' }
}) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-3424983948330298"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive}
    />
  );
}