import {useState, useEffect} from "react"
import { api } from "../const"
import { CreateApprovers, CreateCondition, User } from "../../openapi/api";
import { CreateFlow } from "../../openapi/api";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Grid, Typography, Paper } from '@mui/material';

const conditionLabels: Record<string, string> = {
  "eq": "=",
  "neq": "!=",
  "lt": "<",
  "le": "<=",
  "gt": ">",
  "ge": ">="
};

//TERMINOLOGY
//createFlow: 
//flow: property of createFlow. list of (createCondition | createApprovers).
//f: (createCondition|createApprovers). element of flow
//createCondition: 
//condition: propety of createCondition

export default function SyouninHuro() {
  //材料
  const [conditionKeys, setConditionKeys] = useState<string[]>([]); //比較対象　amountなど
  const [comparators, setComparators] = useState<string[]>([]);//<, =, >, >=
  const [users, setUsers] = useState<User[]>([]);
  
  //送信するやつ
  const [createFlow, setCreateFlow] = useState<CreateFlow>({name:"", flow:[]})
  
  const fetch = async () => {
    try {
      const res0 = await api.flows.getConditions()
      const res1 = await api.flows.getComparators()
      const res2 = await api.users.getUsers()
      setConditionKeys(res0.data.key || []);
      setComparators(res1.data.comparators || []);
      setUsers(res2.data || [])
    } catch (error) {
      alert('Error fetching flows:'+ error);
    }
  };

  const makeEmptyCreateCondition = (): CreateCondition => {
    return {
      condition: {
        key: ""
      }
    }
  }
  const makeEmptyCreateApprovers = (): CreateApprovers => {
    return {
      approvers: []
    }
  }
  const deleteIthF = (i: number) => {
    createFlow.flow?.splice(i, 1)
    setCreateFlow({...createFlow})
  }

  const getUserByID = (id: number): User => {
    const user = users.find(user => user.id == id)
    return user as User
  }
  const addApprover = (event: React.ChangeEvent<HTMLSelectElement>, approvers: User[]) => {
    const user_id = parseInt(event.target.value);

    approvers.push(getUserByID(user_id))
    setCreateFlow({...createFlow})
  };
  const setConditionKey = (key: string, condition:CreateCondition["condition"]) => {
    if (condition) {
      condition.key = key
    }
    setCreateFlow({...createFlow})
  }
  const setConditionComparator = (comparator: string, condition: CreateCondition["condition"]) => {
    if (condition) {
      condition.condition = comparator
    }
    setCreateFlow({...createFlow})
  }
  const setConditionValue = (value: string, condition: CreateCondition["condition"]) => {
    if (condition) {
      condition.value = value
    }
    setCreateFlow({...createFlow})
  }
  const isCreateFlowValid = () => {
    if (!createFlow.flow || createFlow.flow.length==0) {
      alert("flowがないお")
      return false
    }

    if (!createFlow.name) {
      alert("nameがないよ")
      return false
    }

    for (let i = 0; i<createFlow.flow.length; i++) {
      const f = createFlow.flow[i]
      if ("condition" in f) {
        const condition = f.condition
        if (!condition?.key || !condition.condition || !condition.value) {
          alert("条件をすべてうめて")
          return false
        }
      } else {
        const approvers = (f as CreateApprovers).approvers
        if (!approvers || approvers.length == 0) {
          alert("承認者を１人以上選択して")
          return false
        }
      }
    }

    return true
  }
  const registerCreateFlow = async () => {
    if (!isCreateFlowValid()) return

    try {

      const res = await api.flows.createFlow(createFlow)
      if (res.ok) {
        alert("Flow created: " + createFlow.name)
      } else {
        alert("Failed to create flow: " + res.data)
      }
    } catch (error) {
      alert("error: see the console")
      console.error(error)
    }
  }
  
  useEffect(() => {
    fetch();
  }, []);
  
  return (
    <>
    <div>
    <Paper sx={{ padding: 3 }}>
      <Box component="form">
        <Typography variant="h6" gutterBottom>
          フローの作成
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="名前"
              fullWidth
              value={createFlow.name}
              onChange={(e) => {
                createFlow.name = e.target.value;
                setCreateFlow({ ...createFlow });
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {createFlow.flow && createFlow.flow.map((f, fIndex) => {
              if ("condition" in f) {
                const createCondition = f as CreateCondition;
                return (
                  <Box key={fIndex} sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle1">条件</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>キー</InputLabel>
                          <Select
                            value={createCondition.condition?.key}
                            onChange={(e) => setConditionKey(e.target.value, createCondition.condition)}
                          >
                            {/* <MenuItem value="">--選択--</MenuItem> */}
                            {conditionKeys.map((ke) => (
                              <MenuItem key={ke} value={ke}>
                                {ke}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>条件</InputLabel>
                          <Select
                            value={createCondition.condition?.condition}
                            onChange={(e) => setConditionComparator(e.target.value, createCondition.condition)}
                          >
                            {/* <MenuItem value="">--選択--</MenuItem> */}
                            {comparators.map((comp) => (
                              <MenuItem key={comp} value={comp}>
                                {conditionLabels[comp]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="値"
                          value={createCondition.condition?.value}
                          onChange={(e) => setConditionValue(e.target.value, createCondition.condition)}
                          placeholder="Enter text"
                        />
                      </Grid>
                    </Grid>
                    <Button
                      sx={{ marginTop: 1 }}
                      variant="outlined"
                      color="error"
                      onClick={() => deleteIthF(fIndex)}
                    >
                      削除
                    </Button>
                  </Box>
                );
              }

              const createApprovers = f as CreateApprovers;
              return (
                <Box key={fIndex} sx={{ marginBottom: 2 }}>
                  <Typography variant="subtitle1">承認者リスト</Typography>
                  <FormControl fullWidth>
                    <InputLabel>承認者を選択</InputLabel>
                    <Select onChange={(e) => addApprover(e, createApprovers.approvers as User[])}>
                      {/* <MenuItem value="">--選択--</MenuItem> */}
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.id}: {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box sx={{ marginTop: 1 }}>
                    {createApprovers.approvers?.map(approver => (
                      <Typography sx={{ marginBottom: 1 }} key={approver.id}>
                        {approver.id}:{approver.name}
                      </Typography>
                    ))}
                  </Box>
                  <Button
                    sx={{ marginTop: 1 }}
                    variant="outlined"
                    color="error"
                    onClick={() => deleteIthF(fIndex)}
                  >
                    削除
                  </Button>
                </Box>
              );
            })}
          </Grid>

          <Grid item xs={12} sx={{ marginTop: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                createFlow.flow?.push(makeEmptyCreateCondition());
                setCreateFlow({ ...createFlow });
              }}
              sx={{ marginRight: 2 }}
            >
              条件を追加
            </Button>
            <Button
              variant="outlined"
              color="primary"
              // color="secondary"
              // color="success"
              onClick={() => {
                createFlow.flow?.push(makeEmptyCreateApprovers());
                setCreateFlow({ ...createFlow });
              }}
            >
              承認者リストを追加
            </Button>
          </Grid>

          <Grid item xs={12} sx={{ marginTop: 4 }}>
            <Button variant="contained" color="primary" onClick={registerCreateFlow}>
              作成
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
    </div>
    </>
  ) 
}
