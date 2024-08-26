import { useEffect, useState, useContext } from "react"
import {api} from "../const"
import { Approval } from "../../openapi/api";
import { Context } from '../Context.tsx'

export default function Syounin() {

  const {userID, setUserID} = useContext(Context);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  
  useEffect(()=>{
    getApprovalsByUserID();
  }, [userID])
  
  const getApprovalsByUserID = async () => {
    // const res = await api.approvals.getApprovalsByUserId(userID)
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
