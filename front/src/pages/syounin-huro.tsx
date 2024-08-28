import {useState, useEffect} from "react"
import { api } from "../const"
import { CreateApprovers, CreateCondition, User } from "../../openapi/api";
import { CreateFlow } from "../../openapi/api";
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
      <div>
      <span>名前 </span>
      <input value={createFlow.name} onChange={(e) => {
        createFlow.name = e.target.value
        setCreateFlow({...createFlow})
      }} />
      </div>

      <div>
        {createFlow.flow && createFlow.flow.map((f, fIndex) => {

          ///////条件
          if ("condition" in f) {
            const createCondition = f as CreateCondition;
            return <div>
              <p>条件</p>
              <select value={createCondition.condition?.key} onChange={(e) => setConditionKey(e.target.value, createCondition.condition)}>
                <option value="">--選択--</option>
                {conditionKeys.map((ke) => (
                  <option key={ke} value={ke}>{ke}</option>
                ))}
              </select>
              <select value={createCondition.condition?.condition} onChange={(e) => setConditionComparator(e.target.value, createCondition.condition)}>
                <option value="">--選択--</option>
                {comparators.map((comp) => (
                    <option key={comp} value={comp}>
                        {conditionLabels[comp]}
                    </option>
                ))}
              </select>
              <input
                type="text"
                value={createCondition.condition?.value}
                onChange={(e) => setConditionValue(e.target.value, createCondition.condition)}
                placeholder="Enter text"
              />
              <button onClick={(e) => {
                deleteIthF(fIndex)
              }}>削除</button>
            </div>
          }
          //////////////

          ///////承認者リスト
          const createApprovers = f as CreateApprovers;
          return <div>
            <p>承認者リスト</p>
            <div>
            <select onChange={(e) => {addApprover(e, createApprovers.approvers as User[])}}>
              <option value="">--選択--</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.id}: {user.name}</option>
                ))}
            </select>
            </div>
            <div>
              {createApprovers.approvers?.map(approver => (
                <div>{approver.id}:{approver.name}</div>
              ))}
            </div>
            <button onClick={(e) => {
                deleteIthF(fIndex)
            }}>削除</button>
          </div>
          //////////////
        })}
      </div>

      <div style={{marginTop:"50px"}}>
        <button onClick={(e) => {
          createFlow.flow?.push(makeEmptyCreateCondition())
          setCreateFlow({...createFlow})
        }}>条件を追加</button>
        <button onClick={(e) => {
          createFlow.flow?.push(makeEmptyCreateApprovers())
          setCreateFlow({...createFlow})
        }}>承認者リストを追加</button>
      </div>
      <button onClick={registerCreateFlow}>
        作成
      </button>
    </div>
    </>
  ) 
}
