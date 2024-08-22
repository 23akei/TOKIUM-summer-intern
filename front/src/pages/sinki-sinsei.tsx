import {api} from "../const"
import { useState } from "react"



export default function SinkiSinsei() {

  const [name, setName] = useState("")
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [user_id, setUser_id] = useState(0);
  const [kind, setKind] = useState("");
  const [shop, setShop] = useState("");
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState("");



  const registerSinsei = async () => {
    const res = await api.application.createApplication({name, date, description, user_id, kind, shop, amount, status})
    console.log(res.data)
    // if (!res.data.date || !res.data.description) {
    //   alert((res.error.message))
    // }

    alert("name is " + res.data.name)
}

const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setUser_id(value === "" ? 0 : parseInt(value));
};

const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setAmount(value === "" ? 0 : parseInt(value));
};


  return (
      <>
          <div>
            新規申請
          </div>
          <div>
            データ入力
          </div>
          <p>タイトル：<br />
          <input value={name} onChange={(event)=>{setName(event.target.value)}}/></p>
          <p>日付：<br />
          <input type="date" value={date} onChange={(event)=>{setDate(event.target.value)}}/></p>
          <p>詳細：<br />
          <input value={description} onChange={(event)=>{setDescription(event.target.value)}}/></p>
          <p>ユーザーID：<br />
          <input value={user_id} onChange={handleUserIdChange}/></p>
          <p>種類：<br />
          <input value={kind} onChange={(event)=>{setKind(event.target.value)}}/></p>
          <p>店舗：<br />
          <input value={shop} onChange={(event)=>{setShop(event.target.value)}}/></p>
          <p>金額：<br />
          <input value={amount} onChange={handleAmountChange}/></p>
          <p>ステータス：<br />
          <input value={status} onChange={(event)=>{setStatus(event.target.value)}}/></p>
          
          <button onClick={registerSinsei}>作成</button>
          
      </>
  )
}
