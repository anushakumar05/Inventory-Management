import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 1
};

const InventoryLog = ({ open, setLogOpen, editLogs }) => {
  const [logType, setLogType] = useState("edit");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!editLogs) return;

    const filteredLogs = logType === "edit"
      ? editLogs.filter((log) => !log.reStock) // Edit logs only
      : editLogs.filter((log) => log.reStock); // Restock logs only

    setLogs(filteredLogs);
  }, [editLogs, logType]);

  const handleTabChange = (event, newValue) => {
    setLogType(newValue);
  };

  return (
    <Modal
      open={open}
      onClose={() => setLogOpen(false)}
      aria-labelledby="inventory-log-modal"
      aria-describedby="inventory-logs-history"
    >
      <Box sx={modalStyle}>
        <Paper elevation={0} sx={{ width: '100%' }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#2D3621', // Changed from primary.main to #2D3621
            color: 'white',
            px: 2
          }}>
            <Tabs
              value={logType}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="secondary"
            >
              <Tab label="Edit History" value="edit" />
              <Tab label="Restock History" value="restock" />
            </Tabs>
            <Button
              onClick={() => setLogOpen(false)}
              color="inherit"
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <CloseIcon />
            </Button>
          </Box>
          <Box sx={{ p: 2 }}>
            {logType === "edit" ? (
              <EditLogTable logs={logs} />
            ) : (
              <RestockLogTable logs={logs} />
            )}
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

const EditLogTable = ({ logs }) => {
  if (logs.length === 0) {
    return <Typography variant="body1">No edit logs available.</Typography>;
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table aria-label="Edit history table">
        <TableHead sx={{ backgroundColor: "#F1F1F1" }}>
          <TableRow>
            <TableCell>Editor</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Changes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <Typography variant="subtitle1">{log.name}</Typography>
              </TableCell>
              <TableCell>
                {new Date(log.purchaseDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell align="right">Before</TableCell>
                        <TableCell align="right">After</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Display existing items that were changed */}
                      {/* {log.prevItems.map((prevItem, idx) => (
                        <TableRow key={`prev-${idx}`}>
                          <TableCell>{prevItem.name}</TableCell>
                          <TableCell align="right">{prevItem.currentQuantity}</TableCell>
                          <TableCell align="right">
                            {log.newItems.find(item => item.name === prevItem.name)?.currentQuantity || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))} */}
                      <TableRow>
                        <TableCell>{log.prevItem.name}</TableCell>
                        <TableCell align="right">{log.prevItem.currentQuantity}</TableCell>
                        <TableCell align="right">
                          {log.newItem.currentQuantity}
                        </TableCell>
                      </TableRow>

                      {/* Display newly added items */}
                      {/* {log.newItems.filter(newItem =>
                        !log.prevItems.some(prevItem => prevItem.name === newItem.name)
                      ).map((newItem, idx) => (
                        <TableRow key={`new-${idx}`}>
                          <TableCell>{newItem.name}</TableCell>
                          <TableCell align="right">0</TableCell>
                          <TableCell align="right">{newItem.currentQuantity}</TableCell>
                        </TableRow>
                      ))} */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RestockLogTable = ({ logs }) => {
  if (logs.length === 0) {
    return <Typography variant="body1">No restock logs available.</Typography>;
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table aria-label="Restock history table">
        <TableHead sx={{ backgroundColor: "#F1F1F1" }}>
          <TableRow>
            <TableCell>Editor</TableCell>
            <TableCell>Restock Date</TableCell>
            <TableCell>Quantity Changes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <Typography variant="subtitle1">{log.name}</Typography>
              </TableCell>
              <TableCell>
                {new Date(log.purchaseDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell align="right">Before Restock</TableCell>
                        <TableCell align="right">After Restock</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Display existing items that were restocked */}
                      {/* {log.prevItems.map((prevItem, idx) => (
                        <TableRow key={`prev-${idx}`}>
                          <TableCell>{prevItem.name}</TableCell>
                          <TableCell align="right">{prevItem.currentQuantity}</TableCell>
                          <TableCell align="right">
                            {log.newItems.find(item => item.name === prevItem.name)?.currentQuantity || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))} */}
                      <TableRow>
                        <TableCell>{log.prevItem.name}</TableCell>
                        <TableCell align="right">{log.prevItem.currentQuantity}</TableCell>
                        <TableCell align="right">
                          {log.newItem.currentQuantity || 'N/A'}
                        </TableCell>
                      </TableRow>

                      {/* Display newly added items during restock */}
                      {/* {log.newItems.filter(newItem =>
                        !log.prevItems.some(prevItem => prevItem.name === newItem.name)
                      ).map((newItem, idx) => (
                        <TableRow key={`new-${idx}`}>
                          <TableCell>{newItem.name}</TableCell>
                          <TableCell align="right">0</TableCell>
                          <TableCell align="right">{newItem.currentQuantity}</TableCell>
                        </TableRow>
                      ))} */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryLog;