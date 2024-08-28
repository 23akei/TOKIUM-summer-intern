import {api} from "../const"
import { useState, useContext, useEffect } from "react"
import { Context } from "../Context";

import Box from '@mui/material/Box';
import { Dialog, DialogContent } from "@mui/material";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";

import GMap from "../components/map";

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

export default function SinkiSinsei2() {

  const {userID, setUserID} = useContext(Context)

  const [shop, setShop] = useState("");
  const [selectUserID, setSelectUserID] = useState(userID);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);
  const [shopNameFromMap, setShopNameFromMap] = useState("");

const [isModalOpen, setIsModalOpen] = useState(false);

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

const registerSinsei = async () => {
  try {
    for (const row of rows) {
      const res = await api.application.createApplication({
        title: row.title,
        date: row.date,
        description: row.description,
        user_id: row.selectUserID,
        kind: row.kind,
        shop: row.shop,
        amount: row.amount,
        flow_id: row.flow_id,
      });

      if (!res.data.date || !res.data.description) {
        alert(res.error.message);
      } else {
        alert(
          "Title is " + res.data.title + " description is " + res.data.description
        );
      }
    }
  } catch (error) {
    console.error("Error registering application:", error);
    alert("Error registering application.");
  }
};

useEffect(() => {
  setSelectUserID(userID);

}, [userID]);


// エクセル風のインプット欄

  return (
      <>
      <Typography variant="h6">新規申請2</Typography>
      <Box mb={4} />
      <TableContainer>
      <Table >
        <TableBody >
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ padding: '5px' }}> {/* セル間の隙間を狭める */}
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
              <TableCell sx={{ padding: '5px' }}>
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
              <TableCell sx={{ padding: '5px' }}>
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
              <TableCell sx={{ padding: '5px' }}>
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
              <TableCell sx={{ padding: '5px' }}>
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
              <TableCell sx={{ padding: '5px'}}>
              <TableCell sx={{ padding: "5px" }}>
                <Button onClick={() => openModal(index)}>マップ</Button>
              </TableCell>
              </TableCell>

              <TableCell sx={{ padding: '5px' }}>
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
                />
              </TableCell>
              <TableCell sx={{ padding: '5px' }}>
                <TextField
                  label="Flow ID"
                  type="number"
                  value={row.flow_id}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      handleInputChange(index, "flow_id", value);
                    }
                  }}
                  variant="outlined"
                  fullWidth
                />
              </TableCell>
              <TableCell sx={{ padding: '5px' }}>
                {/* <TextField
                  label="ユーザーID"
                  value={row.selectUserID}
                  onChange={(e) =>
                    handleInputChange(index, "selectUserID", e.target.value)
                  }
                  variant="outlined"
                  fullWidth
                /> */}
                <TextField
                  label="ユーザーID"
                  value={selectUserID}
                  variant="outlined"
                  fullWidth
                  disabled
                />
                {/* <Typography variant="h6">{selectUserID}</Typography> */}
              </TableCell>
              <TableCell sx={{ padding: '5px' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => copyRow(index)}
                  size="small"
                >
                  コピー
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
