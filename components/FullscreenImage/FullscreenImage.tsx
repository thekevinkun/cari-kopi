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
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
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
          <SwiperSlide key={`fullscreen-image-${i}`}>
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
        }`}
      </style>
    </Box>
  );
};

export default FullscreenImage;