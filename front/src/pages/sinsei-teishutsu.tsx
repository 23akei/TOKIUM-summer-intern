import { useContext, useEffect, useState } from "react"
import { api } from "../const"
import { Application, Submittion, Flow } from "../../openapi/api";
import { Context } from "../Context";
import { User } from "../../openapi/api"
import styled from '@emotion/styled';
import { Box, Button, Checkbox, Table, TableBody, TableContainer,TableCell,TableHead, TableRow, Typography, Paper} from "@mui/material";





interface SubmittionAndApplication {
  submittion: Submittion
  application?: Application,
  flow: Flow,
}

interface toSubmittions {
  application: Application,
  flow: Flow
}

export default function SinseiTeishutsu() {
  const { userID } = useContext(Context)
  const [users, setUsers] = useState<User[]>([])
  const [toSubimitList, setToSubmitList] = useState<toSubmittions[]>([]); //submitted yet
  const [submittedList, setSubmittedList] = useState<SubmittionAndApplication[]>([]); //submitted already
  const [selectedApplicationIDs, setSelectedApplicationIDs] = useState<number[]>([]);


  const fetchAllUsers = async () => {
    const res = await api.users.getUsers()
    if (res.data) {
      setUsers(res.data)
    }
  }

  useEffect(()=>{
    fetchAllUsers()
  }, [])

  function getUserNameById(userId) {
    const user = users.find(user => user.id === userId);
    return user ? user.name : "Unknown User";
  }


  const selectAllApplications = () => {
    setSelectedApplicationIDs(
      toSubimitList.map(app => app.application.id)
    )
  }
  const unselectAllApplications = () => {
    setSelectedApplicationIDs(
      []
    )
  }

  const isApplicationSelected = (application_id: number): boolean => {
    return selectedApplicationIDs.includes(application_id)
  }

  const onSelectApplication = (checked: boolean, application_id: number) => {
    if (checked) {
      if (!isApplicationSelected(application_id)) {
        selectedApplicationIDs.push(application_id);
        setSelectedApplicationIDs([...selectedApplicationIDs])
      }
    } else {
      setSelectedApplicationIDs(
        selectedApplicationIDs.filter((id) => id != application_id)
      )
    }
  }

  const submitApplications = async () => {
    const promises: any = []
    selectedApplicationIDs.forEach(async (application_id) => {
      const promise = api.submittions.createSubmittion({ shinsei_id: application_id, user_id: userID })
      promises.push(promise)
    });

    await Promise.all(promises)

    fetchApplicaions()
  }

  const findSubmittion = (application: Application, submittions: Submittion[]): Submittion | null => {
    for (let i = 0; i < submittions.length; i++) {
      if (submittions[i].shinsei_id == application.id) return submittions[i];
    }

    return null;
  }

  const classifyApplications =  async (applications: Application[], submittions: Submittion[]) => {
    let _submittedList: SubmittionAndApplication[] = []

    const res = await api.flows.getFlows()
    const flows = res.data

    const app = applications.filter(app => {
      const sub = findSubmittion(app, submittions)
      const flow =  flows.find(flow => flow.id === app.flow_id) as Flow
      if (sub != null) {
        _submittedList.push({ submittion: sub, application: app, flow: flow })
        return false;
      }
      return true;
    }).map(app => {
      const flow =  flows.find(flow => flow.id === app.flow_id) as Flow
      return { application: app, flow: flow }
    });
    setToSubmitList(app)
    setSubmittedList(_submittedList)
  }

  const fetchApplicaions = async () => {
    setSelectedApplicationIDs([])
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
      <Box>
        <Typography variant="h6" gutterBottom>
          申請提出画面
        </Typography>
        <Button variant="contained" color="primary" onClick={submitApplications}>
          提出
        </Button>

        <Typography variant="h6" gutterBottom mt={4}>
          未申請
        </Typography>
        <div>
         <Button variant="contained"  style={{ margin: '5px', backgroundColor: 'grey', color: 'white' }}  onClick={selectAllApplications}>
          すべて選択
         </Button>
         <Button variant="contained" style={{ margin: '5px', backgroundColor: 'grey', color: 'white' }} onClick={unselectAllApplications}>
          すべて選択解除
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#c9c9c9', color: 'white' }}>
              <TableRow >
                <TableCell></TableCell>
                <TableCell>タイトル</TableCell>
                <TableCell>承認フロー</TableCell>
                <TableCell>申請者</TableCell>
                <TableCell>科目</TableCell>
                <TableCell>店舗</TableCell>
                <TableCell>金額</TableCell>
                <TableCell>日時</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {toSubimitList.map((app) => (
                <TableRow key={app.application.id}>
                  <TableCell>
                    <Checkbox
                      onChange={(e) =>
                        onSelectApplication(e.target.checked, app.application.id as number)
                      }
                      checked={isApplicationSelected(app.application.id)}
                    />
                  </TableCell>
                  <TableCell>{app.application.title}</TableCell>
                  <TableCell>{app.flow?.name}</TableCell>
                  <TableCell>{getUserNameById(app.application.user_id)}</TableCell> {/* user_id を user.name に置き換え */}
                  <TableCell>{app.application.kind}</TableCell>
                  <TableCell>{app.application.shop}</TableCell>
                  <TableCell>{app.application.amount}</TableCell>
                  <TableCell>{app?.application.date && new Date(app.application.date).toLocaleDateString('ja-JP')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom mt={4}>
          申請済み
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#c9c9c9', color: 'white' }}>
                <TableCell>申請状態</TableCell>
                <TableCell>タイトル</TableCell>
                <TableCell>承認フロー</TableCell>
                <TableCell>申請者</TableCell>
                <TableCell>科目</TableCell>
                <TableCell>店舗</TableCell>
                <TableCell>金額</TableCell>
                <TableCell>日時</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submittedList.map((sub) => (
                <TableRow key={sub.application?.id}>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        padding: '2px 4px',
                        border: `2px solid ${
                          sub.submittion.status === 'approve' ? 'green' :
                          sub.submittion.status === 'pending' ? 'orange' :
                          sub.submittion.status === 'reject' ? 'red' :
                          'gray'
                        }`,
                        borderRadius: '4px',
                        backgroundColor: `${
                          sub.submittion.status === 'approve' ? 'lightgreen' :
                          sub.submittion.status === 'pending' ? 'lightyellow' :
                          sub.submittion.status === 'reject' ? 'lightcoral' :
                          'lightgray'
                        }`,
                      }}
                    >
                      {sub.submittion.status}
                    </Box>
                  </TableCell>
                  <TableCell>{sub.application?.title}</TableCell>
                  <TableCell>{sub.flow?.name}</TableCell>
                  <TableCell>{getUserNameById(sub.application?.user_id)}</TableCell>
                  <TableCell>{sub.application?.kind}</TableCell>
                  <TableCell>{sub.application?.shop}</TableCell>
                  <TableCell>{sub.application?.amount}</TableCell>
                  <TableCell>{sub.application?.date && new Date(sub.application?.date).toLocaleDateString('ja-JP')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      </div>
    </>
  )
}
