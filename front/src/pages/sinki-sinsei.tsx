import {api} from "../const"
import { useState, useContext, useEffect } from "react"
import { Context } from "../Context";
import GMap from '../components/map.tsx'

import { Dialog, DialogContent } from "@mui/material";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';


export default function SinkiSinsei() {

  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

  const {userID, setUserID} = useContext(Context)

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("");
  const [shop, setShop] = useState("");
  const [amount, setAmount] = useState(0);
  const [flow_id, setFlow_id] = useState(0);
  const [shopNameFromMap, setShopNameFromMap] = useState("");

  const [selectUserID, setSlectUserID] = useState(userID);


  const registerSinsei = async () => {
    // const res = await api.application.createApplication({title, date, description, user_id:userID, kind, shop, amount, flow_id})
    const res = await api.application.createApplication({title, date, description, user_id: selectUserID, kind, shop, amount, flow_id})
    console.log(res.data)
    // if (!res.data.date || !res.data.description) {
    //   alert((res.error.message))
    // }

    alert("Title is " + res.data.title + " description is " + res.data.description)
}

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setShop(shopNameFromMap)
  }, [shopNameFromMap]);


// エクセル風のインプット欄

  return (
      <>
       <Card sx={{ minWidth: 275, borderRadius: '0' }}>  {/* ここで角を角ばらせる */}
        <CardContent>

        <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">新規申請</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="日付"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="詳細"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="ユーザーID"
            type="number"
            value={selectUserID}
            onChange={(e) => setSlectUserID(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="科目"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={10}>
        <TextField
          label="店舗"
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          fullWidth
        />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            fullWidth
          >
            マップ
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="金額"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="flow_id"
            type="number"
            value={flow_id}
            onChange={(e) => setFlow_id(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Box mb={15} />
      </Grid>
      <Card>
      <Box mt={2}>
        <Typography variant="h6">入力内容</Typography>
        <Grid container spacing={2}>
          <Grid item xs={2}><Typography>タイトル:</Typography></Grid>
          <Grid item xs={4}><Typography>{title}</Typography></Grid>
          <Grid item xs={2}><Typography>日付:</Typography></Grid>
          <Grid item xs={4}><Typography>{date}</Typography></Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}><Typography>詳細:</Typography></Grid>
          <Grid item xs={4}><Typography>{description}</Typography></Grid>
          <Grid item xs={2}><Typography>ユーザーID:</Typography></Grid>
          <Grid item xs={4}><Typography>{selectUserID}</Typography></Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}><Typography>科目:</Typography></Grid>
          <Grid item xs={4}><Typography>{kind}</Typography></Grid>
          <Grid item xs={2}><Typography>店舗:</Typography></Grid>
          <Grid item xs={4}><Typography>{shop}</Typography></Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}><Typography>金額:</Typography></Grid>
          <Grid item xs={4}><Typography>{amount}</Typography></Grid>
          <Grid item xs={2}><Typography>flow_id:</Typography></Grid>
          <Grid item xs={4}><Typography>{flow_id}</Typography></Grid>
        </Grid>
        <Box mb={2} />
      </Box>
      </Card>
    </Container>

        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center' }} >  {/* ここでボタンを右端に配置 */}
          <Button  variant="outlined" onClick={registerSinsei}>作成</Button>
        </CardActions>
      </Card>

            {/* 地図表示モーダル */}
            <Dialog
              open={isModalOpen}
              onClose={closeModal}
              fullWidth
              maxWidth="lg"
            >
              <DialogContent>
              <h2>店舗マップ</h2>
              <GMap setShopName={setShopNameFromMap} />
              <div>店舗名: <TextField value={shop} onChange={(event) => setShop(event.target.value)} /></div>
              <Button onClick={closeModal}>閉じる</Button>
              </DialogContent>
            </Dialog>

      </>
  )
}
