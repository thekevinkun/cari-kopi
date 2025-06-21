import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { Box, List, ListItemButton, ListItemText, CircularProgress, Typography, useMediaQuery, Button } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import type { AutocompletePrediction, SearchBarProps } from "@/types";
import { Search, SearchIconWrapper, StyledInputBase, scrollStyle } from "./styles";

const SearchBar = ({ onSelectSearchResult }: SearchBarProps) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputAfterSelected, setInputAfterSelected] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Debounced autocomplete fetch
  const fetchSuggestions = debounce(async (query: string) => {
    if (!query || query.length < 3) {
        setResults([]);
        return;
    }

    setLoading(true);
    try {
      const res = await fetch(`
        /api/autocomplete?query=${encodeURIComponent(query)}&sessiontoken=${sessionToken}`
      );

      const data: { predictions: AutocompletePrediction[] } = await res.json();
      console.log("search results: ", data);
      setResults(data.predictions || []);
    } catch (err) {
      console.error("Autocomplete error:", err);
    } finally {
      setLoading(false);
    }
  }, 1000);

  useEffect(() => {
    setSessionToken(uuidv4()); // Reset token each time component mounts
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputAfterSelected(false);
    setInput(value);
    fetchSuggestions(value);
  };

  const handleSelect = (placeId: string, description: string) => {
    onSelectSearchResult(placeId);
    setInput(description);
    setInputAfterSelected(true);
    setResults([]);
    setSessionToken(uuidv4()); // new token for next search
  };
  
  return (
    <Box sx={{ position: "relative" }}>
        <Search>
            <SearchIconWrapper>
                <SearchIcon 
                    sx={{
                        width: {
                            xs: "0.85em",
                            sm: "0.95em"
                        },
                        height: {
                            xs: "0.85em",
                            sm: "0.95em"
                        }
                    }}
                />
            </SearchIconWrapper>

            <StyledInputBase
                placeholder="Search for coffee shop..."
                value={input}
                onChange={handleChange}
                sx={{
                    opacity: inputAfterSelected ? 0.45 : 1
                }}
            />
      </Search>

      {loading && (
        <Box sx={{ position: "absolute", top: "11px", right: "12px" }}>
          <CircularProgress size={18} />
        </Box>
      )}

      {(!loading && results.length > 0) || (!loading && input) && (
        <Button 
            variant="text"
            sx={{ 
                position: "absolute", 
                top: "11px", 
                right: "12px",
                padding: 0,
                minWidth: 0,
            }}
            onClick={() => {
                setInput("");
                setInputAfterSelected(false);
                setResults([]);
            }}
        >
            <CloseIcon fontSize="small" sx={{ color: "rgba(211,47,47)" }}/>
        </Button>
      )}

       {results.length > 0 && (
            <List
                sx={{
                    ...scrollStyle,
                    position: "absolute",
                    zIndex: 1000,
                    width: "100%",
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                    mt: 0.75,
                    paddingTop: 0,
                    paddingBottom: 0,
                    borderRadius: 1,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    maxHeight: 280, 
                    overflowY: "auto",
                }}
            >
                {results.slice(0, 5).map((item) => (
                    <ListItemButton
                        key={item.place_id}
                        sx={{
                            "&:hover": {
                                backgroundColor: "rgba(128, 74, 38, 0.25)",
                            },
                            alignItems: "flex-start",
                            gap: 1,
                        }}
                        onClick={() => handleSelect(item.place_id, item.description)}
                    >
                        <RoomIcon
                            fontSize="small"
                            sx={{ mt: "3px", color: "#804A26" }}
                        />

                        <ListItemText
                            primary={
                                <Typography fontWeight="bold" fontSize="0.95rem">
                                    {item.structured_formatting?.main_text ?? item.description}
                                </Typography>
                            }
                            secondary={
                                item.structured_formatting?.secondary_text && (
                                    <Typography
                                        title={item.structured_formatting.secondary_text}
                                        variant="body2"
                                        color="text.secondary"
                                        fontSize="0.775rem"
                                        noWrap
                                    >
                                        {item.structured_formatting.secondary_text}
                                    </Typography>
                                )
                            }
                        />
                    </ListItemButton>
                ))}
            </List>
        )}
    </Box>
  )
}

export default SearchBar;