import React, { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";

import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import type { AutocompletePrediction, SearchBarProps } from "@/types";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  scrollStyle,
} from "./styles";

const SearchBar = ({ onSelectSearchResult }: SearchBarProps) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputAfterSelected, setInputAfterSelected] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Debounced autocomplete fetch
  const fetchSuggestions = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query || query.length < 3) {
          setResults([]);
          return;
        }

        setLoading(true);
        try {
          const res = await fetch(
            `/api/autocomplete?query=${encodeURIComponent(
              query
            )}&sessiontoken=${sessionToken}`
          );
          const data: { predictions: AutocompletePrediction[] } =
            await res.json();
          setResults(data.predictions || []);
        } catch (err) {
          console.error("Autocomplete error:", err);
        } finally {
          setLoading(false);
        }
      }, 800),
    [sessionToken]
  );

  // Clean up the debounce on unmount
  useEffect(() => {
    return () => {
      fetchSuggestions.cancel();
    };
  }, [fetchSuggestions]);

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

  const handleRemoveInput = () => {
    setInput("");
    setInputAfterSelected(false);
    setResults([]);
    setSessionToken(uuidv4());
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <Search>
        <SearchIconWrapper>
          <SearchIcon
            sx={{
              width: "0.95em",
              height: "0.95em",
            }}
          />
        </SearchIconWrapper>

        <StyledInputBase
          placeholder="Search for coffee shop..."
          value={input}
          onChange={handleChange}
          sx={{
            opacity: inputAfterSelected ? 0.45 : 1,
          }}
        />
      </Search>

      {loading && (
        <Box sx={{ position: "absolute", top: "11px", right: "12px" }}>
          <CircularProgress size={18} />
        </Box>
      )}

      {!loading && input && (
        <IconButton
          sx={{
            position: "absolute",
            top: {
              xs: 7,
              sm: 9.5,
            },
            right: 9,
            bgcolor: "rgba(0,0,0,0.30)",
            color: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.5)",
            },
            backdropFilter: "blur(1.5px)",
            borderRadius: "50%",
            width: 22,
            height: 22,
            zIndex: 1300,
          }}
          onClick={handleRemoveInput}
        >
          <CloseIcon sx={{ fontSize: "1.15rem" }} />
        </IconButton>
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
              <RoomIcon fontSize="small" sx={{ mt: "3px", color: "#804A26" }} />

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
  );
};

export default SearchBar;
