import {useState, useEffect, useContext} from "react"
import Typography from '@mui/material/Typography';
import { api } from "../const";
import { Webhook, WebhookEntry } from "../../openapi/api";
import { Context } from "../Context";

import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, Paper } from '@mui/material';


interface CreateWebhook {
  user_id?: number,
  url?: string,
  entry?: string
}

const makeEmptyCreateWebhook = () => {
  return {
    url:"",
    entry: ""
  }
}

export default function WebhookTouroku() {
  const {userID} = useContext(Context)
  const [entries, setEntries] = useState<WebhookEntry[]>(["submittion"])
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [createWebhook, setCreateWebhook] = useState<CreateWebhook>(makeEmptyCreateWebhook());

  const fetch = async () => {
    try {
      const res0 = await api.webhook.getWebhookEntries()
      if (res0.data) {
        setEntries(res0.data)
      } else {
        alert("failed to fetch webhookentries")
      }

      const res1 = await api.webhook.getWebhooksByUserId(userID)
      if (res1.data) {
        setWebhooks(
          res1.data
        )
      } else {
        alert("failed to fetch webhooks")
      }

    } catch( error ) {
      alert("fetch failed: see the console")
      console.error(error)
    }
  }

  const isCreateWebhookValid = () : boolean => {
    if (!createWebhook.entry || !createWebhook.url) return false

    return true
  }

  const registerWebhook = async () => {
    if (!isCreateWebhookValid()) {
      alert("invalid input")
      return 
    }

    try {
      const res = await api.webhook.createWebhook({...createWebhook, user_id:userID})
      if (res.data) {
        alert("created!")
      }
    } catch (error) {
      alert("error: see the console")
      console.error(error)
    }

    fetch()
  }

  const deleteWebhook = async (id: number) => {
    try {
    const res = await api.webhook.deleteWebhook(id)
    if (res.data) {
      alert("deleted!")
    }
            
    } catch (error) {
      alert("error: see the console")
      console.error(error)
    }

    fetch();
  }
  
  useEffect(() => {
    fetch()
  }, [userID])
  
  return (
    <Box sx={{ paddingRight: 15, paddingLeft: 15 }}>
      <Typography variant="h5" gutterBottom>
        Webhook登録画面
      </Typography>
      
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
          <InputLabel>エントリ</InputLabel>
          <Select
            value={createWebhook.entry}
            onChange={(e) => {
              setCreateWebhook({ ...createWebhook, entry: e.target.value });
            }}
            label="エントリ"
          >
            <MenuItem value="">
              <em>--選択--</em>
            </MenuItem>
            {entries.map((ke) => (
              <MenuItem key={ke} value={ke}>{ke}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="URL"
          variant="outlined"
          fullWidth
          value={createWebhook.url}
          onChange={(e) => {
            setCreateWebhook({ ...createWebhook, url: e.target.value });
          }}
          sx={{ marginBottom: 2 }}
        />

        <Button variant="contained" color="primary" onClick={registerWebhook}>
          作成
        </Button>
      </Paper>

      {webhooks.map((webhook) => (
        <Paper key={webhook.id} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="subtitle1">{webhook.entry}</Typography>
          <Typography variant="body2">{webhook.url}</Typography>
          <Button variant="outlined" color="secondary" onClick={() => deleteWebhook(webhook.id)}>
            削除
          </Button>
        </Paper>
      ))}
    </Box>
  )
}
