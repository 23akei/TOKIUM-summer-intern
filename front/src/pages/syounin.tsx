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
      
      apprs = res.data.map(appr => ({approval: appr}))
    }
    {
      const asyncs: any[] = [];
      apprs = apprs.map((appr) => {
        const a = api.application.getApplicationById(appr.approval.shinsei_id as number)
        asyncs.push(a)
        a.then(res => {
          appr.application = res.data
        })
        
        return appr
      })
      
      Promise.all(asyncs).then(()=>{
        setApprovals(apprs)
      })
    } 
  }
  
  const setStatus = async (appr: Approval, status: string) => {
    appr.status = status
    const res = await api.approvals.updateApproval(appr)
    if (res.data.id != undefined) {
      alert("updated approval " + res.data.id)
      getApprovalsByUserID();
    } else {
      alert(res.error.message)
    }
  }
  
  return (
    <>
      <div style={{display: "flex", justifyContent: "center"}}>
      <table border={1} cellPadding={5} >
      <thead>
      <tr>
      <th>Status</th>
      <th>from user id</th>
      <th>Shinsei ID</th>
      <th>Flow ID</th>
      <th>Title</th>
      <th>Kind</th>
      <th>Shop</th>
      <th>Amount</th>
      <th>Date</th>
      </tr>
      </thead>
      <tbody>

      {approvals.length > 0 &&
        approvals.map(appr => (
          <>
            <tr>
            <td>{appr.approval.status}</td>
            <td>{appr.approval.approved_user_id}</td>
            <td>{appr.application?.id}</td>
            <td>{appr.application?.flow_id}</td>
            <td>{appr.application?.title}</td>
            <td>{appr.application?.kind}</td>
            <td>{appr.application?.shop}</td>
            <td>{appr.application?.amount}</td>
            <td>{appr.application?.date}</td>
            <td>
            <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => setStatus(appr.approval, "approved")}>承認</button>
            <button onClick={() => setStatus(appr.approval, "rejected")}>却下</button>
            </div>
            </td>
            </tr>
            </>

        )
                     )
      }
    </tbody>
      </table>

      </div>
      {approvals.length <= 0 && <p>承認するものなし</p>}
    </>
  )
}
