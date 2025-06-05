import { Link as MUILink, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Information = ({ address, price, phone, webLink }: 
    { address: string, price: string, phone: string, webLink: string }) => {

  return (
    <>
        {address &&
            <Typography 
                variant="body2" 
                color="textSecondary"
                fontStyle="normal"
                sx={{
                    mt: 3,
                    textAlign: "right",
                    display: "flex", 
                    justifyContent: "space-between",
                    gap: 7
                }}
            >
                <LocationOnIcon /> {address}
            </Typography>
        }
        
        {price &&
            <Typography 
                variant="body2" 
                color="textSecondary" 
                fontStyle="normal"
                sx={{
                    mt: 1.5,
                    textAlign: "right",
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 7
                }}
            >
                <AttachMoneyIcon /> 
                {price}
            </Typography>
        }

        {phone &&
            <Typography 
                variant="body2" 
                color="textSecondary" 
                fontStyle="normal"
                sx={{
                    mt: 1.5,
                    textAlign: "right",
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 7
                }}
            >
                <PhoneIcon />         
                <MUILink href={`tel:${phone}`}>{phone}</MUILink>
            </Typography>
        }
        
        {webLink &&
            <Typography 
                variant="body2" 
                color="textSecondary" 
                fontStyle="normal"
                sx={{
                    mt: 1.5,
                    textAlign: "right",
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 7
                }}
            >
                <LanguageIcon /> 
                
                <MUILink href={webLink}>Web Link</MUILink>
            </Typography>
        }
    </>
  )
}

export default Information