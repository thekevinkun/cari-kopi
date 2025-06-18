import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import type { SerpPhotosProps } from "@/types";

const FullscreenImage = ({ photos, startIndex, type, onClose }: {
  photos: SerpPhotosProps[];
startIndex: number;
  type?: string;
  onClose: () => void;
}) => {
  const swiperRef = useRef<any>(null);
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    return () => { document.body.style.overflow = "" };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        height: "100%",
        minHeight: "100svh",
        bgcolor: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300
      }}
    >
      <Swiper
        modules={[Navigation]}
        initialSlide={startIndex}
        navigation
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        style={{ width: "100%", height: "100%" }}
      >
        {photos.map((photo, i) => (
          <SwiperSlide key={`fullscreen-${type}-image-${i + 1}`}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={type === "review" ? 
                    `/api/image-proxy?url=${encodeURIComponent(photo.thumbnail ?? "")}`
                :
                    photo.serpapi_thumbnail
                }
                alt={photo.title || ""}
                style={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  objectFit: "contain",
                  boxShadow: "0 0 12px rgba(255, 255, 255, 0.2)",
                  cursor: "default",
                  userSelect: "none"
                }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          color: "#fff",
          zIndex: 1400,
        }}
      >
        <CloseIcon />
      </IconButton>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #fff;
          outline: none;
          box-shadow: none !important;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .swiper-button-prev:focus,
        .swiper-button-next:focus {
          outline: none;
          box-shadow: none;
        }
        .swiper-button-prev:focus-visible,
        .swiper-button-next:focus-visible {
          outline: 2px solid #fff;
          border-radius: 4px;
        }`}
      </style>
    </Box>
  );
};

export default FullscreenImage;