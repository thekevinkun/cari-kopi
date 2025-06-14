import { Box, Typography, Chip, Stack } from "@mui/material";

import type { ExtensionGroup } from "@/types";
import { formatTitle, getEmoji } from "@/utils/helpers";

const ExtensionList = ({ extensions }: { extensions: ExtensionGroup[] }) => {
  if (!extensions || !Array.isArray(extensions)) return null;

  return (
    <Box mt={5}>
      {extensions.map((group, idx) => {
        const { key, values, _unsupported } = group;

        if (!values || values.length === 0) return null;

        return (
          <Box key={key} mb={2}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              mb={1}
              sx={{ color: "text.secondary" }}
            >
              {formatTitle(key)}
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {values.map((value, i) => (
                <Chip
                  key={value}
                  label={`${getEmoji(value,  _unsupported)} ${value}`}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
};

export default ExtensionList;