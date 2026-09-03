import React from 'react';
import Link from 'next/link';

const TAPA_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACMCAYAAAC9FwHKAAAxlUlEQVR4nO29eZxlV1nu/33X2vsMVdVzd9KZQyYgaaYkguJP01HCEL0IF6rBCFdFb7iCgnpxQNBKg6LXAbmiMsgVBAGtDj8CXEBE6G5IDARCIKRDhs7Y81Bz1Rn23ms99491TncHEtJJutND6smnU1X7nL33Wmu/e613eN53wXEKCQO454PPOPPODz/rHICREdyRbdXRj+N3gK66xAMs2730VSt2Dr0O4CouOX77O48fjhFw5DD3iufdNPOyn94uXZmLNGvM46FxXL4xGh32V4GK/zt8kbvfP715h50094E7L+t/doSbd1TjuBQI1oGB+Fzn9Y1duYt7DX1d/8MMse5IN24ejys0ghPY3JaXntp+3uWzk8tfEKdPfGFor76smLnux1YJTMPzs8RD4bitITZsuMQZiL8rf6OxLRukkQdr5LGxtZG7Ty7+LQMd6TYezTiuBEIjuNuB3A13S3/51tWp5S6m7m1lTlXzJwyb/rF2urq2x1+Lw3f1h3Jt3Z91bO1nLg+mX23q1i1y13XvtJ6z5vf+Uv9833V1qyLWte133f9+t//u9+433rM164K4h7l05l0a2tL/3Fz6+98v7v3tL8z7p3ePbd+3N/7+3z0v7zN0b6+0V1y/1yvNnZ517mvhfO0y19r3p/d9d/mP1S5/7v719/5e0/2+e9e1+v/d9z0z07/d5s77p/8+/272x88v5z/3b733ve/c513/f510v0/bX7v9l/m//9n/3d3d+3v9f0d7e6u+q9f3d9l8855v7N69e3e3b3c3c7v/c1u2fXFw13/f7Tz/fN897n+5d+6Z//n+bNn6d/+j/2ffXv9d6/5X5u9100v0/z01b5v7c/+y85m31u2dvefV38/9rN+a2vW3d/f+629/5/1+0397p//oXw0+t5v7Lz02r5t3/Z+172zXf2vvd5l9t8zNzV3d7/v5192+9+8s3p5r/s7/nly//0d1v617v12a4P1a3Xm2x1Xl6z31s17p/3u8fLzN0v7+6/v1+h7b+0/2vf++x/2b834X9P5Z/2L9v/W29v6h394q9/mrf97705s5P/bvv3L1c518//w+l2x//q13X/fJ010p7tN1y//tve518/39uX90u7686bZ16d+/z01vLw7s0zM19j12j/25fX/tXN3f02p76w0zbf7+5X2r113z+/1n7d6d+s///J3b6m7e7z2m/903e1/4nN+uN9f9b5X8v/+696/zO4Z1P+m5d/5t1u6/zN3t/b//d/99e2//vbfv7e4f16vT1y35n3+/c/j/9q09v02z26v25b59h/X529s7u5s3t3N3t7e5gAAAAABJRU5ErkJggg==';

export const Logo: React.FC = () => {
  return (
    <Link href="/" className="logo flex items-center gap-2" style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src={TAPA_LOGO_BASE64} alt="तप्" className="h-9 sm:h-11 md:h-[52px] w-auto block" />
      <span className="logo-wm devanagari">the tapa company</span>
    </Link>
  );
};
