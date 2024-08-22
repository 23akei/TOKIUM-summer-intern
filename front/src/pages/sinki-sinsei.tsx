import {api} from "../const"
import { useState } from "react"



// title?: string;
//   date?: string;
//   description?: string;
//   user_id?: number;
//   kind?: string;
//   shop?: string;
//   amount?: number;
//   flow_id?: number;



export default function SinkiSinsei() {


  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [user_id, setUser_id] = useState(0);
  const [kind, setKind] = useState("");
  const [shop, setShop] = useState("");
  const [amount, setAmount] = useState(0);
  const [flow_id, setFlow_id] = useState(0);



  const registerSinsei = async () => {
    const res = await api.application.createApplication({title, date, description, user_id, kind, shop, amount, flow_id})

    console.log(res.data)
    // if (!res.data.date || !res.data.description) {
    //   alert((res.error.message))
    // }


    alert("Title is " + res.data.title + " description is " + res.data.description)
}

const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setUser_id(value === "" ? 0 : parseInt(value));
};

const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setAmount(value === "" ? 0 : parseInt(value));
};

const handleFlow_idChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setFlow_id(value === "" ? 0 : parseInt(value));
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
          <input value={title} onChange={(event)=>{setTitle(event.target.value)}}/></p>
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
          <p>flow_id：<br />
          <input value={flow_id} onChange={handleFlow_idChange}/></p>

          
          <button onClick={registerSinsei}>作成</button>
          
      </>
  )
}
