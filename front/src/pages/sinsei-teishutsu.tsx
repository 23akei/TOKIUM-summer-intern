import { useContext, useEffect, useState } from "react"
import {api} from "../const"
import { Application } from "../../openapi/api";
import { Context } from "../Context";


export default function SinseiTeishutsu() {
  const {userID, setUserID} = useContext(Context)
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
    selectedApplicationIDs.forEach(async (application_id) => {
      api.submittions.createSubmittion({shinsei_id: application_id, user_id: userID}).then((res: any) => {
        console.log(res);
      }).catch((e: any) => {
        console.log(e)
      });
    });
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
      <div>
      <p>申請提出画面</p>
      <button onClick={submitApplications}>提出</button>

      {applications.map((application) =>  (
        <div key={application.id} style={{border: "1px solid black", display: "flex", justifyContent: "space-between"}}>
          <input
            type="checkbox"
            onChange={(e) => {onSelectApplication(e.target.checked, application.id as number)}}
            key={application.id}
          />
          {Object.entries(application).map(([k, value]) => (
            <div key={k}>
              <span>{value}</span>
            </div>
          ))}
        </div>
      ))}

      </div>
      </>
  )
}
