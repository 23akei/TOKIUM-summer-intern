import {api} from "../const"
import { Flow } from "../../openapi/api";
import { useState, useContext, useEffect } from "react"
import { Context } from "../Context";
import GMap from '../components/map.tsx'

import { Dialog, DialogContent } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { Table, TableBody, TableCell, TableContainer, TableRow, MenuItem, Select, InputLabel, FormControl } from "@mui/material";


interface RowData {
  title: string;
  date: string;
  description: string;
  kind: string;
  shop: string;
  amount: number;
  flow_id: number;
  selectUserID: number;

}

export default function SinkiSinsei() {

  const {userID} = useContext(Context)

  const [shop, setShop] = useState("");
  const [shopNameFromMap, setShopNameFromMap] = useState("");
  const [selectUserID, setSelectUserID] = useState(userID);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [flows, setFlows] = useState<Flow[]>([]);



  const fetchFlows = async () => {
    try {
      const res0 = await api.flows.getFlows();
      setFlows(res0.data || []);
    } catch (error) {
      console.error('Error fetching flows:', error);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, [userID]);


const openModal = (index: number) => {
  setCurrentRowIndex(index);
  setShop(rows[index].shop);
  setIsModalOpen(true);
};


const closeModal = () => {
  if (currentRowIndex !== null) {
    const updatedRows = [...rows];
    updatedRows[currentRowIndex].shop = shop;
    setRows(updatedRows);
  }
  setIsModalOpen(false);
};

  useEffect(() => {
    setShop(shopNameFromMap)
  }, [shopNameFromMap]);

const [rows, setRows] = useState<RowData[]>([
  {
    title: "",
    date: "",
    description: "",
    kind: "",
    shop: "",
    amount: 0,
    flow_id: 0,
    selectUserID: userID,
  },
]);

const addRow = () => {
  setRows([
    ...rows,
    {
      title: "",
      date: "",
      description: "",
      kind: "",
      shop: "",
      amount: 0,
      flow_id: 0,
      selectUserID: userID,
    },
  ]);
};

const copyRow = (index: number) => {
  const newRow = { ...rows[index] };
  setRows([...rows, newRow]);
};

const deleteRow = (index: number) => {
  setRows(rows.filter((_, i) => i !== index));
};

const handleInputChange = (
  index: number,
  field: keyof RowData,
  value: string | number
) => {
  const updatedRows = [...rows];

  if (field === "amount" || field === "flow_id") {
    updatedRows[index][field] = Number(value);
  } else {
    // 動く
    updatedRows[index][field] = String(value);
  }

  setRows(updatedRows);
};

const isSinseiValid = () => {
  for (const row of rows) {
    if (!row.title) {
      alert("title cannot be empty")
      return false
    }
    if (row.amount<=0) {
      alert("amount must be greater than 0")
      return false
    }

    if (row.flow_id <= 0) {
      alert("invalid flow id")
      return false
    }
  }

  return true
}  
  
const registerSinsei = async () => {
  if (!isSinseiValid()) return
  
  const errors = []
  const promises = []
  for (const row of rows) {
    const promise = api.application.createApplication({
      title: row.title,
      date: row.date,
      description: row.description,
      user_id: row.selectUserID,
      kind: row.kind,
      shop: row.shop,
      amount: row.amount,
      flow_id: row.flow_id,
    });
    promises.push(promise)

    const res = await promise
    if (res.data) {
    } else if (res.error){
      errors.push(res.error)
    }
  }

  await Promise.all(promises)

  if( errors.length >0 ) {
    console.log("申請エラー")
    console.log(errors)
    alert("Error: see the console")
  } else {
    alert("申請登録しました");
  }
};

useEffect(() => {
  setSelectUserID(userID);

}, [userID]);


// エクセル風のインプット欄

  return (
      <>
      <Typography variant="h6">新規申請</Typography>
      <Box mb={4} />
      <TableContainer>
      <Table >
        <TableBody >
          {rows.map((row, index) => (
            <TableRow key={index} sx={{display: 'flex', flexWrap:"wrap", alignItems: "center", background: "#fafafa", padding:"10px 0 0 10px",margin:"10px", borderRadius: "10px"}}>
              <TableCell sx={{ padding: '10px' }}> {/* セル間の隙間を狭める */}
                <TextField
                  label="タイトル"
                  value={row.title}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                  variant="outlined"
                  style={{ width: '150px' }} // 幅を指定

                />
              </TableCell>
              <TableCell sx={{ padding: '10px' }}>
                <TextField
                  label="日付"
                  type="date"
                  value={row.date}
                  onChange={(e) =>
                    handleInputChange(index, "date", e.target.value)
                  }
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </TableCell>
              <TableCell sx={{ padding: '10px' }}>
                <TextField
                  label="詳細"
                  value={row.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                  variant="outlined"
                  style={{ width: '150px' }}
                />
              </TableCell>
              <TableCell sx={{ padding: '10px' }}>
                <TextField
                  label="科目"
                  value={row.kind}
                  onChange={(e) =>
                    handleInputChange(index, "kind", e.target.value)
                  }
                  variant="outlined"
                  style={{ width: '150px' }}
                />
              </TableCell>
              <TableCell sx={{ padding: '10px' }}>
                <TextField
                  label="店舗"
                  value={row.shop}
                  onChange={(e) =>
                    handleInputChange(index, "shop", e.target.value)
                  }
                  variant="outlined"
                  style={{ width: '150px' }}
                />
              </TableCell>
              <TableCell sx={{ padding: "10px", height: "100%" }}>
                <Button onClick={() => openModal(index)}>マップ</Button>
              </TableCell>

              <TableCell sx={{ padding: '10px' }}>
                <TextField
                  label="金額"
                  type="number"
                  value={row.amount}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      handleInputChange(index, "amount", value);
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  style={{ width: '130px' }}
                />
              </TableCell>

              <TableCell sx={{ padding: '10px' }}>
                <FormControl sx={{ minWidth: 100 }}>
                <InputLabel >Flow ID</InputLabel>
                <Select
                  value={row.flow_id}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      handleInputChange(index, "flow_id", value);
                    }
                  }}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>--選択--</em>
                  </MenuItem>
                  {flows.map((flow) => (
                    <MenuItem key={flow.id} value={flow.id}>
                      {flow.id}: {flow.name}
                    </MenuItem>
                  ))}
                </Select>
                </FormControl>
              </TableCell>

            {/*
              <TableCell sx={{ padding: '1px', maxWidth: '80px', minWidth: '80px' }}>
                <TextField
                  label="UserID"
                  value={selectUserID}
                  variant="outlined"
                  fullWidth
                  disabled
                />
                <Typography variant="h6">{selectUserID}</Typography>
              </TableCell>
            */}
              
              <TableCell sx={{ padding: '5px' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => copyRow(index)}
                  size="small"
                >
                  複製
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteRow(index)}
                  size="small"
                >
                  削除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Button
      variant="outlined"
      color="primary"
      onClick={addRow}
      style={{ marginTop: "10px" }}
    >
      行を追加
    </Button>
    <Button
      variant="contained"
      onClick={registerSinsei}
      style={{ marginTop: "10px", marginLeft: "10px" }}
    >
      申請を登録
    </Button>


            {/* 地図表示モーダル */}
            <Dialog
              open={isModalOpen}
              onClose={closeModal}
              fullWidth
              maxWidth="lg"
            >
              <DialogContent>
                <Typography variant="h4">店舗マップ</Typography>
                <Typography variant="body1">マップ上の施設を選択すると店舗名が入力されます</Typography>
                <GMap setShopName={setShopNameFromMap} />
                  <TextField
                    label="店舗名"
                    value={shop}
                    onChange={(event) => setShop(event.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" onClick={closeModal}>閉じる</Button>
              </DialogContent>
            </Dialog>

      </>
  )
}
