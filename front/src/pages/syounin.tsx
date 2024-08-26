import { useEffect, useState, useContext } from "react"
import {api} from "../const"
import { Approval } from "../../openapi/api";
import { Context } from '../Context.tsx'

export default function Syounin() {

  const {userID} = useContext(Context);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  
  useEffect(()=>{
    getApprovalsByUserID();
  }, [userID])
  
  const getApprovalsByUserID = async () => {
    const res = await api.approvals.getApprovalsByUserId(userID)
    console.log(res)
    setApprovals(res.data)
  }
  
  const setStatus = async (appr: Approval, status: string) => {
    appr.status = status
    const res = await api.approvals.updateApproval(appr)
    if (res.data.id != undefined) {
      alert("updated approval " + res.data.id)
      getApprovalsByUserID();
    } else (
      alert(res.error.message)
    )
  }
  
  return (
    <>
      {approvals.length > 0 ?
        approvals.map(appr => 
          <div style={{display:"flex", border: "1px solid #000"}}>
          <p style={{padding: "0 100px"}}>user id:{appr.approved_user_id}</p>
          <p style={{padding: "0 100px"}}>application id:{appr.shinsei_id}</p>
          <p style={{width: "200px"}}>status:{appr.status}</p>
          <div style={{display:"flex", alignItems: "center"}}>
          <button onClick={() => setStatus(appr, "approved")}>承認</button>
          <button onClick={() => setStatus(appr, "rejected")}>却下</button>
          </div>
        </div>)
        : <p>承認するものなし</p>}
    </>
  )
}
