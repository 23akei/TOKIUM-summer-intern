import {useState, useEffect, useContext} from "react"
import Typography from '@mui/material/Typography';
import { api } from "../const";
import { Webhook, WebhookEntry } from "../../openapi/api";
import { Context } from "../Context";


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

  useEffect(() => {
    fetch()
  }, [userID])
  
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Webhook登録画面
      </Typography>
      

      <div>
        <div>
          <select value={createWebhook.entry} onChange={(e) => {
                createWebhook.entry = e.target.value
                setCreateWebhook({...createWebhook})
              }}>
            <option value="">--選択--</option>
            {entries.map((ke) => (
              <option key={ke} value={ke}>{ke}</option>
            ))}
          </select>
        
          <span>url: </span><input value={createWebhook.url} onChange={(e) => {
            createWebhook.url = e.target.value
            setCreateWebhook({...createWebhook})
          }}></input>
        </div>
        <button onClick={registerWebhook}>作成</button>
      </div>

      {webhooks.map(webhook => (
        <div style={{padding: "10px"}}>
          <div>{webhook.entry}</div>
          <div>{webhook.url}</div>
        </div>
      ))}
    </div>
  )
}
