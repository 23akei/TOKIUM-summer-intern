import { useEffect, useState, useContext } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Button,
  Paper, TableContainer, Typography, Box, Snackbar, Alert
} from '@mui/material';
import { api } from "../const";
import { Approval, Application, User, Flow } from "../../openapi/api";
import { Context } from '../Context.tsx';
import Kensaku from "../components/kensaku";
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};


export interface ApprovalAndApplication {
  approval: Approval,
  application?: Application
  user?: User
  flow?: Flow
}

export default function Syounin() {

  const {userID} = useContext(Context);
  const [approvals, setApprovals] = useState<ApprovalAndApplication[]>([]);
  const [kensakuApprovals, setKensakuApprovals] = useState<ApprovalAndApplication[]|null>(null)
  const [selectedApprovals, setSelectedApprovals] = useState<ApprovalAndApplication[]>([])

  const[open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [message, setMessage] = useState('');

  const [open_pop, setOpen_pop] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setCurrentIndex(0); // モーダルを開いたときに最初の項目を表示する
  };
  const handleClose = () => setOpen(false);

  const handleClose_popup = () => {
    setOpen_pop(false);
  };





  useEffect(()=>{
    getApprovalsByUserID();
  }, [userID])

  const getApprovalsByUserID = async () => {
    setSelectedApprovals([])
    let apprs: ApprovalAndApplication[];
    {
      const res = await api.approvals.getApprovalsByUserId(userID)

      apprs = res.data.map(appr => ({approval: appr}))
    }
    {
      const res = await api.users.getUsers()
      const all_users: User[]= res.data as User[];
      const res_flow = await api.flows.getFlows()
      const all_flows = res_flow.data;
      const asyncs: any[] = [];
      apprs = apprs.map((appr) => {
        const a = api.application.getApplicationById(appr.approval.shinsei_id as number)
        asyncs.push(a)
        a.then(res => {
          appr.application = res.data
          appr.user = all_users.find(user => user.id == appr.application?.user_id)
          appr.flow = all_flows.find(flow => flow.id == appr.application?.flow_id)
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
            <TableRow key={appr.approval.id}>
              <TableCell>
                <Checkbox
                  checked={isSelected(appr)}
                  onChange={(e) => onSelectApproval(e.target.checked, appr)}
                />
              </TableCell>
              <Box sx={{display: 'inline-block', padding: '2px 4px', border: '2px solid orange', borderRadius: '4px', backgroundColor: 'lightyellow', }}>
                <TableCell>{appr.approval.status}</TableCell>
              </Box>
              <TableCell>{appr.user?.name}</TableCell>
              <TableCell>{appr.approval.comment}</TableCell>
              <TableCell>{appr.application?.title}</TableCell>
              <TableCell>{appr.flow?.name}</TableCell>
              <TableCell>{appr.application?.kind}</TableCell>
              <TableCell>{appr.application?.shop}</TableCell>
              <TableCell>{appr.application?.amount}</TableCell>
              <TableCell>{appr.application?.date && new Date(appr.application.date).toLocaleDateString('ja-JP')}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={() => setStatus(appr.approval, "approve")}>
                    承認
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => setStatus(appr.approval, "reject")}>
                    却下
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
            </>

        )
                     )
      }

      </>
    )
  }


  const modal_approvalsList = (apprs: ApprovalAndApplication[]) => {
    return (
      <>
      {apprs.length > 0 &&
        apprs.map(appr => (
          <>
            <TableRow key={appr.approval.id}>
              <Box sx={{display: 'inline-block',border: '2px solid orange', borderRadius: '4px', backgroundColor: 'lightyellow', }}>
                <TableCell>{appr.approval.status}</TableCell>
              </Box>
              <TableCell>{appr.user?.name}</TableCell>
              <TableCell>{appr.approval.comment}</TableCell>
              <TableCell>{appr.application?.title}</TableCell>
              <TableCell>{appr.flow?.name}</TableCell>
              <TableCell>{appr.application?.kind}</TableCell>
              <TableCell>{appr.application?.shop}</TableCell>
              <TableCell>{appr.application?.amount}</TableCell>
              <TableCell>{appr.application?.date &&  new Date(appr.application.date).toLocaleDateString('ja-JP')}</TableCell>
            </TableRow>
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



  const currentApproval = (apprs: ApprovalAndApplication[]) => {
    if (apprs.length === 0) return null;
    return apprs[currentIndex];
  };

  const modal_setStatus = async (appr: Approval, status: string) => {
    appr.status = status
    const res = await api.approvals.updateApproval(appr)
    if (res.data.id != undefined) {
      getApprovalsByUserID();
      setMessage("updated approval " + res.data.id)
      setOpen_pop(true);
      setTimeout(() => {
        setOpen_pop(false);
      }, 3000); // ポップアップが表示される時間（ミリ秒）
    } else {
      alert(res.error.message)
    }
  }

  const modal_approve = () =>{
    const app = currentApproval(kensakuApprovals == null ? approvals : kensakuApprovals);
    if(app !== null){
      modal_setStatus(app.approval, "approve")
    }
  }

  const modal_reject = () =>{
    const app = currentApproval(kensakuApprovals == null ? approvals : kensakuApprovals);
    if(app !== null){
      modal_setStatus(app.approval, "reject")
    }
  }

  const handleSkip = () => {
    setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= (kensakuApprovals || approvals).length) {
        return 0;
      }
      return nextIndex;
    });
  };


  const handleRevers =() =>{
    setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex - 1;
      if (nextIndex <= 0) {
        return ((kensakuApprovals || approvals).length) - 1;
      }
      return nextIndex;
    });
  };




  return (
    <>
      <Kensaku approvals={approvals} setKensakuApprovals={setKensakuApprovals} unselectAll={unselectAll} />
      {kensakuApprovals != null && (
        <Typography variant="body2">{kensakuApprovals.length}件ヒット</Typography>
      )}
      <Button sx={{ margin: 1}} variant="outlined" onClick={selectAll}>すべて選択</Button>
      <Button sx={{ margin: 1}}variant="outlined" onClick={unselectAll}>選択解除</Button>
      <Button sx={{ margin: 1}}variant="contained" color="primary" onClick={() => setStatusForSelected("approve")}>
        まとめて承認
      </Button>
      <Button sx={{ margin: 1}}variant="contained" color="secondary" onClick={() => setStatusForSelected("reject")}>
        まとめて却下
      </Button>
      <Button
        sx={{
          marginLeft: 10,
          backgroundColor: '#00a152',
          color: 'white',
          '&:hover': {
            backgroundColor: '#007a40', // ホバー時の色を設定
          },
        }}
        variant="contained"
        onClick={handleOpen}
      >
        連続承認
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
                    <TableCell>申請状態</TableCell>
                    <TableCell>申請者</TableCell>
                    <TableCell>コメント</TableCell>
                    <TableCell>申請タイトル</TableCell>
                    <TableCell>承認フロー</TableCell>
                    <TableCell>科目</TableCell>
                    <TableCell>店舗</TableCell>
                    <TableCell>金額</TableCell>
                    <TableCell>日時</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvalsList(kensakuApprovals == null ? approvals : kensakuApprovals)}
          </TableBody>
        </Table>
      </TableContainer>
      {checkEmpty(kensakuApprovals == null ? approvals : kensakuApprovals)}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                承認の連続処理
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                sx={{ backgroundColor: '#ff9100', color: 'white', '&:hover': { backgroundColor: '#b26500' } }}
                variant="contained"
                color="secondary"
                onClick={handleRevers}
              >
                戻る
              </Button>
              <Button
                sx={{ backgroundColor: '#ff9100', color: 'white', '&:hover': { backgroundColor: '#b26500' } }}
                variant="contained"
                color="secondary"
                onClick={handleSkip}
              >
                次へ
              </Button>
            </Box>
          </Box>
          {currentApproval(kensakuApprovals == null ? approvals : kensakuApprovals) && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>申請状態</TableCell>
                    <TableCell>申請者</TableCell>
                    <TableCell>コメント</TableCell>
                    <TableCell>申請タイトル</TableCell>
                    <TableCell>承認フロー</TableCell>
                    <TableCell>科目</TableCell>
                    <TableCell>店舗</TableCell>
                    <TableCell>金額</TableCell>
                    <TableCell>日時</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modal_approvalsList([currentApproval(kensakuApprovals == null ? approvals : kensakuApprovals)])}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', }}>
            <Button sx={{ margin: 2}} variant="contained" color="primary" onClick={modal_approve} >承認</Button>
            <Button sx={{ margin: 2}} variant="contained" color="secondary" onClick={modal_reject}>却下</Button>
            </Box>
        </Box>
      </Modal>

      <Snackbar open={open_pop} autoHideDuration={3000} onClose={handleClose_popup}>
        <Alert onClose={handleClose_popup} severity="info">
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}
