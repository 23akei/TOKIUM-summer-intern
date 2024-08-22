import { useEffect, useState } from "react"
import {api} from "../const"
import { Approval } from "../../openapi/api";

export default function Syounin() {

  const [userId, setUserId] = useState(-1);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  
  const getApprovalsByUserId = async () => {
    // const res = await api.approvals.getApprovalsByUserId(userId)
    // console.log(res)
    setApprovals([
      {
        "application_id": 0,
        "user_id": 0,
        "status": "approved"
      },
      {
        "application_id": 1,
        "user_id": 0,
        "status": "pending"
      }
    ])
  }
  
  const approve = async () => {
    // const res = await api.application.
  }
  const reject = () => {
    
  }
  
  return (
    <>
      <p style={{display:"inline"}}>user id: </p>
      <input value={userId == -1? "" : userId} type="number" onChange={(event)=>{setUserId(event.target.valueAsNumber)}} />
      <div/>
      <button onClick={getApprovalsByUserId}>承認要件を取得</button>

      {approvals.length > 0 ?
        approvals.map(appr => 
          <div style={{display:"flex", border: "1px solid #000"}}>
          <p style={{padding: "0 100px"}}>user id:{appr.user_id}</p>
          <p style={{padding: "0 100px"}}>application id:{appr.application_id}</p>
          <p style={{width: "200px"}}>status:{appr.status}</p>
          <div style={{display:"flex", alignItems: "center"}}>
          <button onClick>承認</button>
          <button onClick>却下</button>
          </div>
        </div>)
        : <p>承認するものなし</p>}
    </>
  )
}
