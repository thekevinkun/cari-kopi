import { Box, Card, CardContent, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

import { StyledStack, StyledSecondTypography } from "./styles";

const ShopDetail = () => {
  return (
    <StyledStack py={2} px={1}>
      <Card elevation={6}>
        <CardContent>
          <Typography gutterBottom variant="h5">Coffe Shop Name</Typography>
          <Box display="flex" justifyContent="space-between" my={2}>
            <Typography component="legend">Rating</Typography>
            <Typography component="legend">Review</Typography>
          </Box>
          <StyledSecondTypography gutterBottom variant="body2" color="textSecondary">
            <LocationOnIcon /> Address
          </StyledSecondTypography>
          <StyledSecondTypography variant="body2" color="textSecondary">
            <PhoneIcon /> Phone Number
          </StyledSecondTypography>
        </CardContent>
      </Card>
    </StyledStack>
  )
}

export default ShopDetail;