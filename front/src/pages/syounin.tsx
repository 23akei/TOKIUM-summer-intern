import { useEffect, useState, useContext } from "react"
import {api} from "../const"
import { Approval, Application } from "../../openapi/api";
import { Context } from '../Context.tsx'


interface ApprovalAndApplication {
  approval: Approval,
  application?: Application
}

export default function Syounin() {

  const {userID} = useContext(Context);
  const [approvals, setApprovals] = useState<ApprovalAndApplication[]>([]);
  
  useEffect(()=>{
    getApprovalsByUserID();
  }, [userID])
  
  const getApprovalsByUserID = async () => {
    let apprs: ApprovalAndApplication[];
    {
      const res = await api.approvals.getApprovalsByUserId(userID)
      console.log(res)
      
      apprs = res.data.map(appr => ({approval: appr}))
    }
    {
      setApprovals(
        apprs.map(appr => {
            api.application.getApplicationById(appr.approval.shinsei_id as number).then(res => {
              appr.application = res.data
            })
            
          return appr
        })
      )
    } 
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
          <p style={{padding: "0 100px"}}>from:{appr.approval.approved_user_id}</p>
          <p style={{padding: "0 100px"}}>shinsei id:{appr.approval.shinsei_id}</p>
          <p style={{width: "200px"}}>status:{appr.approval.status}</p>
          {appr.application && Object.entries(appr.application).map(([k, value]) => (
            <div key={k}>
              <span>{value}</span>
            </div>
          ))}
          <div style={{display:"flex", alignItems: "center"}}>
          <button onClick={() => setStatus(appr.approval, "approved")}>承認</button>
          <button onClick={() => setStatus(appr.approval, "rejected")}>却下</button>
          </div>
        </div>)
        : <p>承認するものなし</p>}
    </>
  )
}
