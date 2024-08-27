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
    for (let i = 0; i < submittions.length; i++) {
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
      <div >
        <p>申請提出画面</p>
        <button onClick={submitApplications}>提出</button>

        <p>未申請</p>
        <div style={{ display: "flex", justifyContent: "center" }}>

          <table border={1} cellPadding={5} >
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Shinsei ID</th>
                <th>Flow ID</th>
                <th>User ID</th>
                <th>Kind</th>
                <th>Shop</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>


              {toSubimitList.map((app) => (
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => { onSelectApplication(e.target.checked, app.id as number) }}
                      key={app.id}
                    />
                  </td>
                  <td>{app.title}</td>
                  <td>{app.id}</td>
                  <td>{app.flow_id}</td>
                  <td>{app.user_id}</td>
                  <td>{app.kind}</td>
                  <td>{app.shop}</td>
                  <td>{app.amount}</td>
                  <td>{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
       
        <p>申請済み</p>
        <div style={{ display: "flex", justifyContent: "center" }}>

          <table border={1} cellPadding={5} >
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Shinsei ID</th>
                <th>Flow ID</th>
                <th>User ID</th>
                <th>Kind</th>
                <th>Shop</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>


              {submittedList.map((sub) => (
                <tr>
                  <td>{sub.submittion.status}</td>
                  <td>{sub.application?.title}</td>
                  <td>{sub.application?.id}</td>
                  <td>{sub.application?.flow_id}</td>
                  <td>{sub.application?.user_id}</td>
                  <td>{sub.application?.kind}</td>
                  <td>{sub.application?.shop}</td>
                  <td>{sub.application?.amount}</td>
                  <td>{sub.application?.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </>
  )
}
