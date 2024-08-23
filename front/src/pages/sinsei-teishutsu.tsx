import { useEffect, useState } from "react"
import {api} from "../const"
import { Application } from "../../openapi/api";


export default function SinseiTeishutsu() {
  const [userID, setUserID] = useState<number>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplicationIDs, setSelectedApplicationIDs] = useState<number[]>([]);
  
  
  
  const onSelectApplication = (checked: boolean, application_id : number) => {
    if (checked) {
      if (!selectedApplicationIDs.includes(application_id)) {
        selectedApplicationIDs.push(application_id);
      }
    } else {
      setSelectedApplicationIDs(
        selectedApplicationIDs.filter((id) => id != application_id)
      )
    }
    
  }
  
  const submitApplications = async () => {
    //TOOD
    // const res = await api.application.createApplication();
  }


  const fetchApplicaions = async () => {
    const res = await api.application.getApplicationsByUserId(userID as number)
    setApplications(res.data)
  }

  useEffect(() =>  {
    if (userID != undefined && !isNaN(userID)) {
      fetchApplicaions()
    }
  }, [userID])

  return (
    <>
      <span>user id:</span>
      <input type="number" value={userID} onChange={(event) => setUserID(event.target.valueAsNumber)} />
      <div>
      <p>申請提出画面</p>
      <button onClick={submitApplications}>提出</button>
      
      {applications.map((application) =>  (
        <div style={{border: "1px solid black", display: "flex", justifyContent: "space-between"}}>
          {/* <input type="checkbox" checked={selectedApplicationIDs.includes(application.id)} onChange={(e) => {onSelectApplication(e.target.checked, application.id)}}/> */}
          <div>title:{application.title}</div>

          <div>userid:{application.user_id}</div>
          <div>state:{application.approval_state}</div>
        </div>
      ))}

      </div>
      </>
  )
}
