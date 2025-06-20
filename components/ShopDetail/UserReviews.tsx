import { useState } from "react";
import { Avatar, Box, Button, Grid, IconButton, Paper, Rating, Typography } from "@mui/material";

import { FullscreenImage, ImageWithSkeleton } from "@/components";

import type { SerpReviewItemProps } from "@/types";

const UserReviews = ({ reviews }: { reviews : SerpReviewItemProps[] }) => {
  const [reviewImageIndex, setReviewImageIndex] = useState<number | null>(null);
  const [reviewIndex, setReviewIndex] = useState<number>(0);
    
  return (
    <Box 
        mt={7}
        width="100%"
        display="flex"
        alignItems="center"
        flexDirection="column"
        gap={3}
    >
        {reviews.map((review: SerpReviewItemProps, index) => (
            <Paper 
                key={review.username}
                elevation={10} 
                sx={{ p: 2, width: "100%" }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                        alt={review.username} 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.username)}&background=8d6e63&color=fff`}
                    />
                    
                    <Box>
                    <Typography fontWeight="bold">{review.username}</Typography>
                    
                    <Rating value={review.rating} precision={0.5} readOnly size="small" />
                    
                    <Typography variant="body2" color="text.secondary">
                        {review.date}
                    </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" sx={{ mt: 1 }}>
                    {review.description}
                </Typography>
                
                {review.images &&
                    <Grid container spacing={1} mt={4}>
                        {review.images.map((image, i) => (
                            <Grid 
                                key={`${review.username}-photo-${i + 1}`}
                                size={{ xs: 3, md: 4, lg: 3 }}
                                sx={{ height: {xs: 125, md: 115} }}
                            >
                                <ImageWithSkeleton 
                                    src={`/api/image-proxy?url=${encodeURIComponent(image.thumbnail ?? "")}`} 
                                    alt={`${review.username}-photo-${i + 1}`}
                                    height="100%"
                                    style={{
                                        borderRadius: 8,
                                        cursor: "pointer"
                                    }}
                                    onClickImage={() => {setReviewImageIndex(i); setReviewIndex(index);}}
                                />
                            </Grid>
                        ))}
                    </Grid>
                }
            </Paper>
        ))}

        {reviewImageIndex !== null &&
            <FullscreenImage 
                photos={reviews[reviewIndex].images ?? []}
                startIndex={reviewImageIndex}
                type="review"
                onClose={() => setReviewImageIndex(null)}
            />
        }
    </Box>
  )
}

export default UserReviews;