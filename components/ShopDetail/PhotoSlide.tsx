import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import "swiper/css";
import "swiper/css/navigation";

import { FullscreenImage, ImageWithSkeleton } from "@/components";
import { SerpPhotosProps } from "@/types";

import { StyledBoxImage } from "./styles";

const PhotoSlide = ({ photos }: { photos: SerpPhotosProps[] }) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const swiperPhotoRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePhotoSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <StyledBoxImage sx={{ position: "relative" }}>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-next_photo",
          prevEl: ".swiper-prev_photo",
        }}
        onSwiper={(swiper) => (swiperPhotoRef.current = swiper)}
        onSlideChange={handlePhotoSlideChange}
        style={{ height: "100%" }}
      >
        {photos.map((item, index) => (
          <SwiperSlide key={item.title}>
            <ImageWithSkeleton
              src={item.serpapi_thumbnail || item.thumbnail || ""}
              alt={item.title ?? ""}
              height="100%"
              style={{ objectPosition: "center center", cursor: "pointer" }}
              onClickImage={() => setFullscreenIndex(index)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
          display: "flex",
          gap: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: 1,
          p: 0.5,
          zIndex: 10,
        }}
      >
        <IconButton
          className="swiper-prev_photo"
          size="small"
          sx={{
            color: "#fff",
            opacity: activeIndex === 0 ? 0.3 : 1,
            pointerEvents: activeIndex === 0 ? "none" : "auto",
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          className="swiper-next_photo"
          size="small"
          sx={{
            color: "#fff",
            opacity: activeIndex === photos.length - 1 ? 0.3 : 1,
            pointerEvents: activeIndex === photos.length - 1 ? "none" : "auto",
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {fullscreenIndex !== null && (
        <FullscreenImage
          photos={photos}
          startIndex={fullscreenIndex}
          type="gallery"
          onClose={() => setFullscreenIndex(null)}
        />
      )}
    </StyledBoxImage>
  );
};

export default PhotoSlide;
