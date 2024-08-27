import { useEffect, useState, useContext } from "react"
import {api} from "../const"
import { Approval, Application } from "../../openapi/api";
import { Context } from '../Context.tsx'
import Kensaku from "../components/kensaku"

export interface ApprovalAndApplication {
  approval: Approval,
  application?: Application
}

export default function Syounin() {

  const {userID} = useContext(Context);
  const [approvals, setApprovals] = useState<ApprovalAndApplication[]>([]);
  const [kensakuApprovals, setKensakuApprovals] = useState<ApprovalAndApplication[]|null>(null)
  const [selectedApprovals, setSelectedApprovals] = useState<ApprovalAndApplication[]>([])

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

  const setStatusForSelected = async (status: string) => {
    const promises: any = []
    
    selectedApprovals.forEach(appr => {
      (async () => {
        appr.approval.status = status
        const promise = api.approvals.updateApproval(appr.approval)
        promises.push(promise)
        const res = await promise
        if (res.data.id != undefined) {
        } else {
          alert(res.error.message)
        }
      })()
    })

    Promise.all(promises).then(()=>{
      getApprovalsByUserID()
    })
    
  }

  const onSelectApproval = (checked: boolean, appr: ApprovalAndApplication) => {
    if (checked) {
      if (isSelected(appr)) return;
      selectedApprovals.push(appr)
      setSelectedApprovals(structuredClone(selectedApprovals))
    } else {
      if (isSelected(appr)) {
        setSelectedApprovals(
          selectedApprovals.filter(selected_appr => {
            if (selected_appr.approval.id == appr.approval.id) return false
            return true
          })
        )
      }
    }
  }
  
  const selectAll = () => {
    if (kensakuApprovals != null) {
      setSelectedApprovals(structuredClone(kensakuApprovals))
    } else {
      setSelectedApprovals(structuredClone(approvals))
    }
  }
  
  const unselectAll = () => {
    setSelectedApprovals([])
  }
  
  const isSelected = (appr:ApprovalAndApplication) => {
    for (let i = 0; i<selectedApprovals.length; i++) {
      if (selectedApprovals[i].approval.id == appr.approval.id) {
        return true
      }
    }
    return false
  }
  
  const approvalsList = (apprs: ApprovalAndApplication[]) => {
    return (
      <>
      {apprs.length > 0 &&
        apprs.map(appr => (
          <>
            <tr>
            <td><input type="checkbox"
          checked={isSelected(appr)}
          onChange={(e)=>{ onSelectApproval(e.target.checked, appr)}}
          key={appr.approval.id}
            /></td>
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
            <button onClick={() => setStatus(appr.approval, "approve")}>承認</button>
            <button onClick={() => setStatus(appr.approval, "reject")}>却下</button>
            </div>
            </td>
            </tr>
            </>

        )
                     )
      }

      </>
    )
  }

  const checkEmpty = (apprs: ApprovalAndApplication[]) => (
    <>
      {apprs.length <= 0 && <p>承認するものなし</p>}
    </>
  )

  console.log("rerender")

  return (
    <>
      <Kensaku approvals={approvals} setKensakuApprovals={setKensakuApprovals} unselectAll={unselectAll}/>
      {kensakuApprovals!=null && (<p>{kensakuApprovals.length}件ヒット</p>)}
      <button onClick={selectAll}>すべて選択</button>
      <button onClick={unselectAll}>選択解除</button>
      <button onClick={() => setStatusForSelected("approve")}>まとめて承認</button>
      <button onClick={() => setStatusForSelected("reject")}>まとめて却下</button>
      <div style={{display: "flex", justifyContent: "center"}}>
      <table border={1} cellPadding={5} >
      <thead>
      <tr>
      <th></th>
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
      {approvalsList(kensakuApprovals==null?approvals:kensakuApprovals)}
    </tbody>
      </table>
      </div>
      {checkEmpty(kensakuApprovals==null?approvals:kensakuApprovals)}
    </>
  )
}
