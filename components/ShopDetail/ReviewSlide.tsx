import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { Avatar, Box, Button, IconButton, Paper, Rating, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import "swiper/css";
import "swiper/css/navigation";

import type { ReviewItemProps } from "@/types";

const ReviewSlide = ({ reviews }: { reviews : ReviewItemProps[] }) => {
   const swiperReviewRef = useRef<any>(null);
   const [activeIndex, setActiveIndex] = useState(0);
   const [readMore, setReadMore] = useState(false);
   const [isOverflowing, setIsOverflowing] = useState(false);

   const textRef = useRef<HTMLParagraphElement>(null);

   const handleReviewSlideChange = (swiper: any) => {
        setActiveIndex(swiper.activeIndex);
        setReadMore(false); 
   }

   useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
        const lines = Math.round(el.scrollHeight / lineHeight);
        
        setIsOverflowing(lines > 6)
    }, [activeIndex]);

  return (
    <Box sx={{ position: "relative", width: "100%",  mt: 5 }}>
        <Swiper
            modules={[Navigation]}
            navigation={{
                nextEl: ".swiper-next_review",
                prevEl: ".swiper-prev_review",
            }}
            onSwiper={(swiper) => (swiperReviewRef.current = swiper)}
            onSlideChange={handleReviewSlideChange}
            style={{ height: "100%" }}
        >
            {reviews.map((review: ReviewItemProps, index) => (
                <SwiperSlide key={review.author_name}>
                    <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar alt={review.author_name} src={review.profile_photo_url} />
                            
                            <Box>
                            <Typography fontWeight="bold">{review.author_name}</Typography>
                            
                            <Rating value={review.rating} precision={0.5} readOnly size="small" />
                            
                            <Typography variant="body2" color="text.secondary">
                                {new Date(review.time * 1000).toLocaleDateString()}
                            </Typography>
                            </Box>
                        </Box>

                        <Typography 
                            ref={index === activeIndex ? textRef : null}
                            variant="body2" 
                            sx={{ 
                                mt: 1,
                                display: "-webkit-box",
                                WebkitLineClamp: !readMore ? 6 : "unset",
                                WebkitBoxOrient: "vertical",
                                overflow: !readMore ? "hidden" : "visible" 
                            }}
                        >
                            {review.text}
                        </Typography>
                        
                        {(!readMore && isOverflowing) && (
                            <Box width="100%" display="flex" justifyContent="flex-end">
                                <Button 
                                    variant="text" 
                                    sx={{ padding: 0, marginTop: 1.5, fontSize: "0.825rem" }} 
                                    onClick={() => setReadMore(true)}
                                >
                                    Read More
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </SwiperSlide>
            ))}
        </Swiper>

        <Box
            sx={{
                display: {
                    xs: "none",
                    md: "flex"
                },
                position: "absolute",
                top: 4,
                right: 8,
                gap: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: 1,
                p: 0.15,
                zIndex: 10
            }}
        >
            <IconButton 
                className="swiper-prev_review" 
                size="small" 
                sx={{ 
                    color: "#fff",
                    opacity: activeIndex === 0 ? 0.3 : 1,
                    pointerEvents: activeIndex === 0 ? "none" : "auto"
                }}
            >
                <ChevronLeft />
            </IconButton>

            <IconButton 
                className="swiper-next_review" 
                size="small" 
                sx={{ 
                    color: "#fff",
                    opacity: activeIndex === reviews.length - 1 ? 0.3 : 1,
                    pointerEvents: activeIndex === reviews.length - 1 ? "none" : "auto"
                }}
            >
                <ChevronRight />
            </IconButton>
        </Box>
    </Box>
    
  )
}

export default ReviewSlide;