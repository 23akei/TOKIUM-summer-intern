import { useContext, useEffect, useState } from "react"
import { api } from "../const"
import { Application, Submittion } from "../../openapi/api";
import { Context } from "../Context";
import styled from '@emotion/styled';
import { Box, Button, Checkbox, Table, TableBody, TableContainer,TableCell,TableHead, TableRow, Typography, Paper} from "@mui/material";





interface SubmittionAndApplication {
  submittion: Submittion
  application?: Application,
}

export default function SinseiTeishutsu() {
  const { userID } = useContext(Context)
  const [toSubimitList, setToSubmitList] = useState<Application[]>([]); //submitted yet
  const [submittedList, setSubmittedList] = useState<SubmittionAndApplication[]>([]); //submitted already
  const [selectedApplicationIDs, setSelectedApplicationIDs] = useState<number[]>([]);

  const selectAllApplications = () => {
    setSelectedApplicationIDs(
      toSubimitList.map(application => application.id)
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
         <Button variant="contained"  style={{ backgroundColor: 'grey', color: 'white' }}  onClick={selectAllApplications}>
          すべて選択
         </Button>
         <Button variant="contained" style={{ backgroundColor: 'grey', color: 'white' }} onClick={unselectAllApplications}>
          すべて選択解除
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#c9c9c9', color: 'white' }}>
              <TableRow >
                <TableCell></TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Shinsei ID</TableCell>
                <TableCell>Flow ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Kind</TableCell>
                <TableCell>Shop</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {toSubimitList.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <Checkbox
                      onChange={(e) =>
                        onSelectApplication(e.target.checked, app.id as number)
                      }
                      checked={isApplicationSelected(app.id)}
                    />
                  </TableCell>
                  <TableCell>{app.title}</TableCell>
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.flow_id}</TableCell>
                  <TableCell>{app.user_id}</TableCell>
                  <TableCell>{app.kind}</TableCell>
                  <TableCell>{app.shop}</TableCell>
                  <TableCell>{app.amount}</TableCell>
                  <TableCell>{app.date}</TableCell>
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
                <TableCell>Status</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Shinsei ID</TableCell>
                <TableCell>Flow ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Kind</TableCell>
                <TableCell>Shop</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submittedList.map((sub) => (
                <TableRow key={sub.application?.id}>
                  <TableCell>{sub.submittion.status}</TableCell>
                  <TableCell>{sub.application?.title}</TableCell>
                  <TableCell>{sub.application?.id}</TableCell>
                  <TableCell>{sub.application?.flow_id}</TableCell>
                  <TableCell>{sub.application?.user_id}</TableCell>
                  <TableCell>{sub.application?.kind}</TableCell>
                  <TableCell>{sub.application?.shop}</TableCell>
                  <TableCell>{sub.application?.amount}</TableCell>
                  <TableCell>{sub.application?.date}</TableCell>
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
