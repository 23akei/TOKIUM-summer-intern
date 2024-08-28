import {useState, useEffect} from "react"
import { api } from "../const"
import { User } from "../../openapi/api";
import { CreateFlow } from "../../openapi/api";

export default function SyouninHuro() {
  //材料
  const [conditionKeys, setConditionKeys] = useState<string[]>([]);
  const [comparators, setComparators] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  //
  
  //送信するやつ
  const [createFlow, setCreateFlow] = useState<CreateFlow>(null)
  //
  
  const fetch = async () => {
    try {
      const res0 = await api.flows.getConditions()
      const res1 = await api.flows.getComparators()
      const res2 = await api.users.getUsers()

      setConditionKeys(res0.data.key || []);
      setComparators(res1.data.comparators || []);
      setUsers(res2.data || [])
    } catch (error) {
      alert('Error fetching flows:'+ error.message);
    }
  };


  
  useEffect(() => {
    fetch();
  }, []);
  
  console.log("conditionKeys: %o", conditionKeys)
  
  return (
    <>
    </>
  ) 
}
