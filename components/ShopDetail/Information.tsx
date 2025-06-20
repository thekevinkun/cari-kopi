import { Link as MUILink, Typography } from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const Information = ({ address, price, phone, webLink, website }: 
    { address: string, price: string, phone: string, webLink: string, website: string }) => {

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
        
        {website &&
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
                
                <MUILink href={website}>Website</MUILink>
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
                <TagIcon /> 
                
                <MUILink href={webLink}>Social Media Website</MUILink>
            </Typography>
        }
    </>
  )
}

export default Information