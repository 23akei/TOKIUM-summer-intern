import {api} from "../const"
import { useState, useContext, useEffect } from "react"
import { Context } from "../Context";

import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';

import { Table, TableBody, TableCell, TableContainer, TableRow,  } from "@mui/material";


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
  
  // const [title, setTitle] = useState("");
  // const [date, setDate] = useState("");
  // const [description, setDescription] = useState("");
  // const [kind, setKind] = useState("");
  const [shop, setShop] = useState("");
  // const [amount, setAmount] = useState(0);
  // const [flow_id, setFlow_id] = useState(0);

  const [selectUserID, setSelectUserID] = useState(userID);

  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);




//   const registerSinsei = async () => {
//     // const res = await api.application.createApplication({title, date, description, user_id:userID, kind, shop, amount, flow_id})
//     const res = await api.application.createApplication({title, date, description, user_id: selectUserID, kind, shop, amount, flow_id})
//     console.log(res.data)
//     if (!res.data.date || !res.data.description) {
//       alert((res.error.message))
//     }

//     alert("Title is " + res.data.title + " description is " + res.data.description)
// }

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


          {isModalOpen && (
            <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            backgroundColor: "white", padding: "20px", border: "1px solid #ccc", zIndex: 1000
            }}>
              <h2>店舗マップ</h2>
              <p>店舗名: <input value={shop} onChange={(event) => setShop(event.target.value)} /></p>
              <button onClick={closeModal}>閉じる</button>
            </div>
          )}

          {/* モーダルの背面部分 */}
          {isModalOpen && (
            <div style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 999
            }} onClick={closeModal}></div>
          )}
              
      </>
  )
}
