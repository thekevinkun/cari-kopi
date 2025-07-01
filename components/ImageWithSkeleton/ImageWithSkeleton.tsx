import { useState } from "react";
import { Box, Skeleton } from "@mui/material";

import type { SkeletonImageProps } from "@/types";

const ImageWithSkeleton = ({
  src,
  alt,
  width = "100%",
  height,
  style,
  onClickImage,
}: SkeletonImageProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Box
      position="relative"
      width={width}
      height={height}
      sx={{ overflow: "hidden" }}
    >
      {loading && !error && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
          bgcolor="#f0f0f0"
        >
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </Box>
      )}

      {/* eslint-disable @next/next/no-img-element */}
      <img
        src={error ? "/no-coffee-image.jpg" : src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        onClick={onClickImage}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          userSelect: "none",
          display: loading ? "none" : "block",
          ...style,
        }}
      />
    </Box>
  );
};

export default ImageWithSkeleton;
