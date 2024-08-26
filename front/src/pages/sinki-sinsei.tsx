import {api} from "../const"
import { useState, useContext } from "react"
import { Context } from "../Context";



// title?: string;
//   date?: string;
//   description?: string;
//   user_id?: number;
//   kind?: string;
//   shop?: string;
//   amount?: number;
//   flow_id?: number;



export default function SinkiSinsei() {

  const {userID, setUserID} = useContext(Context)
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("");
  const [shop, setShop] = useState("");
  const [amount, setAmount] = useState(0);
  const [flow_id, setFlow_id] = useState(0);



  const registerSinsei = async () => {
    const res = await api.application.createApplication({title, date, description, user_id:userID, kind, shop, amount, flow_id})
    console.log(res.data)
    // if (!res.data.date || !res.data.description) {
    //   alert((res.error.message))
    // }

    alert("Title is " + res.data.title + " description is " + res.data.description)
}

const [isModalOpen, setIsModalOpen] = useState(false);

const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setUserID(value === "" ? 0 : parseInt(value));
};

const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setAmount(value === "" ? 0 : parseInt(value));
};

const handleFlow_idChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  setFlow_id(value === "" ? 0 : parseInt(value));
};

const openModal = () => {
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
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
          <input value={userID} onChange={handleUserIdChange}/></p>
          <p>種類：<br />
          <input value={kind} onChange={(event)=>{setKind(event.target.value)}}/></p>
          <p>店舗：<br />
          <input value={shop} onChange={(event)=>{setShop(event.target.value)}}/></p>
          <button onClick={openModal}>マップ</button>
          <p>金額：<br />
          <input value={amount} onChange={handleAmountChange}/></p>
          <p>flow_id：<br />
          <input value={flow_id} onChange={handleFlow_idChange}/></p>
          
          <button onClick={registerSinsei}>作成</button>

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
