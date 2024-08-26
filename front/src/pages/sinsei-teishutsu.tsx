import { useContext, useEffect, useState } from "react"
import { api } from "../const"
import { Application, Submittion } from "../../openapi/api";
import { Context } from "../Context";


interface SubmittionAndApplication {
  submittion: Submittion
  application?: Application,
}

export default function SinseiTeishutsu() {
  const { userID } = useContext(Context)
  const [toSubimitList, setToSubmitList] = useState<Application[]>([]); //submitted yet
  const [submittedList, setSubmittedList] = useState<SubmittionAndApplication[]>([]); //submitted already
  const [selectedApplicationIDs, setSelectedApplicationIDs] = useState<number[]>([]);

  const onSelectApplication = (checked: boolean, application_id: number) => {
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
      api.submittions.createSubmittion({ shinsei_id: application_id, user_id: userID }).then((res: any) => {
        console.log(res);
      }).catch((e: any) => {
        console.log(e)
      });
    });

    fetchApplicaions()
  }

  const findSubmittion = (application: Application, submittions: Submittion[]): Submittion | null => {
    for (let i = 0; i<submittions.length; i++) {
      if (submittions[i].shinsei_id == application.id) return submittions[i];
    }

    return null;
  }

  const classifyApplications = (applications: Application[], submittions: Submittion[]) => {
    let _submittedList: SubmittionAndApplication[] = []

    setToSubmitList(
      applications.filter(app => {
        const sub = findSubmittion(app, submittions)
        if (sub != null) {
          _submittedList.push({ submittion: sub, application: app })
          return false;
        }
        return true;
      })
    )
    setSubmittedList(_submittedList)
  }

  const fetchApplicaions = async () => {
    const resApplications = await api.application.getApplicationsByUserId(userID as number)
    const resSubmittions = await api.submittions.getSubmittionsByUserId(userID as number)

    if (!resApplications.data || !resSubmittions.data) {
      alert("yavai!")
      return
    }

    classifyApplications(resApplications.data, resSubmittions.data)
  }

  useEffect(() => {
    if (userID != undefined && !isNaN(userID)) {
      fetchApplicaions()
    }
  }, [userID])

  return (
    <>
      <div>
        <p>申請提出画面</p>
        <button onClick={submitApplications}>提出</button>

        <p>未申請</p>
        {toSubimitList.map((application) => (
          <div key={application.id} style={{ border: "1px solid black", display: "flex", justifyContent: "space-between" }}>
            <input
              type="checkbox"
              onChange={(e) => { onSelectApplication(e.target.checked, application.id as number) }}
              key={application.id}
            />
            {Object.entries(application).map(([k, value]) => (
              <div key={k}>
                <span>{value}</span>
              </div>
            ))}
          </div>
        ))}

        <p>申請済み</p>
        {submittedList.map((sub) => (
          <div key={sub.application?.id} style={{ border: "1px solid black", display: "flex", justifyContent: "space-between" }}>
            <div>status:{sub.submittion.status}</div>
            {Object.entries(sub.application as Application).map(([k, value]) => (
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
