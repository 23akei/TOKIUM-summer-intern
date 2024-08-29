import { useContext, useEffect, useState } from "react";
import { api } from "../const";
import { Flow, Approvers, Condition } from "../../openapi/api";
import { Context } from "../Context";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box } from '@mui/material';
import styled from '@emotion/styled';

const StyledTableCell = styled(TableCell)({
  maxWidth: 200,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

// sx={{
//   maxWidth: 200,
//   overflow: 'hidden',
//   textOverflow: 'ellipsis',
//   whiteSpace: 'nowrap',
// }}

// border: '2px solid #000000',

export default function SyouninHuroItiran() {
  const { userID } = useContext(Context);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [approvers, setApprovers] = useState<Approvers[]>([]);
  const [condition, setCondition] = useState<Condition[]>([]);

  const fetchFlows = async () => {
    try {
      const res0 = await api.flows.getFlows();
      setFlows(res0.data || []);
    } catch (error) {
      console.error('Error fetching flows:', error);
    }
  };



  useEffect(() => {
    fetchFlows();


  }, [userID]);

  console.log(flows);  // Log the fetched flows to inspect the data structure
  return (
    <>
      <Box display="flex" justifyContent="center">
      <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow sx={{backgroundColor: '#c9c9c9', color: 'white',}}>
              <StyledTableCell ><Typography variant="h6">フローID</Typography></StyledTableCell>
              <StyledTableCell><Typography variant="h6">フロー名</Typography></StyledTableCell>
              <StyledTableCell><Typography variant="h6">条件</Typography></StyledTableCell>
              <StyledTableCell ><Typography variant="h6">承認者</Typography></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flows && flows.length > 0 ? (
              flows.map((item, index) => {
                if (item.flow == undefined) return null;

                const conditions = item.flow
                  ?.filter((f): f is Condition => 'condition' in f)
                  .flatMap(app => app.condition)
                  .filter(Boolean); // Filters out undefined

                const approvers = item.flow
                  ?.filter((f): f is Approvers => 'approvers' in f)
                  .flatMap(app => app.approvers)
                  .filter(Boolean); // Filters out undefined

                return (
                  <TableRow key={index}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {conditions && conditions.length > 0 ? (
                        <div>
                          {conditions.map((cond, i) => (
                            <span key={i}>
                              <strong>ステップ: {cond?.step}</strong>&nbsp;
                              <span>キー: {cond?.key}</span>&nbsp;
                              <span>条件: {cond?.condition}</span>&nbsp;
                              <span>値: {cond?.value}</span>
                              {i < conditions.length - 1 && <span>&nbsp;|&nbsp;</span>} {/* 区切りを追加 */}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <Typography variant="body2">条件なし</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {approvers && approvers.length > 0 ? (
                        approvers.map((user, i) => (
                          <Typography key={i} variant="body2">{user?.name}</Typography>
                        ))
                      ) : (
                        <Typography variant="body2">承認者なし</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2">データがありません</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </>
  );
}
