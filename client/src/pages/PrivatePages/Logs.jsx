import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";

export const Logs = () => {
  const [allLogs, setAllLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const fetchAllLogs = async () => {
    try {
      const { data } = await axiosInstance.get("/food/logs");
      setAllLogs(data || []);
      console.log("Fetched all logs:", data);
    } catch (error) {
      console.error("Error fetching all logs:", error);
    }
  };

  const fetchFilteredLogs = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/food/log/monthly/${selectedYear}/${selectedMonth}`
      );
      setFilteredLogs(data || []);
      console.log("Fetched all logs:", data);
    } catch (error) {
      console.error("Error fetching filtered logs:", error);
    }
  };

  useEffect(() => {
    fetchAllLogs();
  }, []);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchFilteredLogs();
    }
  }, [selectedYear, selectedMonth]);
  const filteredSummaryRows = Object.entries(
    filteredLogs?.daily_summaries || {}
  ).map(([date, summary]) => ({
    date,
    ...summary,
  }));
  const renderTable = (logs) => {
    if (!Array.isArray(logs)) {
      console.error("Expected logs to be an array but got:", logs);
      return <Typography color="error">Invalid data format.</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Food</strong>
              </TableCell>
              <TableCell>
                <strong>Weight (g)</strong>
              </TableCell>
              <TableCell>
                <strong>Calories</strong>
              </TableCell>
              <TableCell>
                <strong>Protein (g)</strong>
              </TableCell>
              <TableCell>
                <strong>Carbs (g)</strong>
              </TableCell>
              <TableCell>
                <strong>Fats (g)</strong>
              </TableCell>
              <TableCell>
                <strong>Meal</strong>
              </TableCell>
              <TableCell>
                <strong>Logged At</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.food_name}</TableCell>
                <TableCell>{log.weight_grams}</TableCell>
                <TableCell>{log.calories_consumed}</TableCell>
                <TableCell>{log.protein_g ?? "-"}</TableCell>
                <TableCell>{log.carbs_g ?? "-"}</TableCell>
                <TableCell>{log.fats_g ?? "-"}</TableCell>
                <TableCell>{log.meal_type}</TableCell>
                <TableCell>
                  {new Date(log.logged_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
const renderSummaryTable = (rows) => {
  if (!Array.isArray(rows)) {
    console.error("Expected array for summary rows:", rows);
    return <Typography color="error">Invalid summary data.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Calories</strong></TableCell>
            <TableCell><strong>Protein (g)</strong></TableCell>
            <TableCell><strong>Carbs (g)</strong></TableCell>
            <TableCell><strong>Fats (g)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.total_calories?.toFixed(2) ?? "-"}</TableCell>
              <TableCell>{row.total_protein?.toFixed(2) ?? "-"}</TableCell>
              <TableCell>{row.total_carbs?.toFixed(2) ?? "-"}</TableCell>
              <TableCell>{row.total_fats?.toFixed(2) ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Food Logs
      </Typography>

      {/* All Logs */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">All Logged Entries</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {allLogs.length === 0 ? (
            <Typography color="text.secondary">
              No logs found for this period.
            </Typography>
          ) : (
            renderTable(allLogs)
          )}
        </AccordionDetails>
      </Accordion>

      {/* Filtered Logs */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Logs by Year & Month</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" gap={2} mb={2}>
            <FormControl size="small">
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[2023, 2024, 2025].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (
                    selectedYear === new Date().getFullYear() &&
                    val > new Date().getMonth() + 1
                  ) {
                    return;
                  }
                  setSelectedMonth(val);
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {filteredSummaryRows.length === 0 ? (
            <Typography color="text.secondary">
              No logs found for this period.
            </Typography>
          ) : (
      renderSummaryTable(filteredSummaryRows)

          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
