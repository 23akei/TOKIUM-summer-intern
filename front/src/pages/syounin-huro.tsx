import React, { useState, useEffect } from "react"
import { api } from "../const"
import { User } from "../../openapi/api";
// import { Condition } from "../../openapi/api";
import { CreateFlow } from "../../openapi/api";
// import { Flow } from "../../openapi/api";

// key=項目, value=閾値, condition=不等号,
const conditionLabels: Record<string, string> = {
    "eq": "=",
    "neq": "!=",
    "lt": "<",
    "le": "<=",
    "gt": ">",
    "ge": ">="
};

export default function SyouninHuro() {

    const [title, setTitle] = useState<string>("");

    const [conditionKeys, setConditionKeys] = useState<string[]>([]);
    const [comparators, setComparators] = useState<string[]>([]);

    const [selectedKeys, setSelectedKeys] = useState<string[]>([""]);
    const [selectedComps, setSelectedComps] = useState<string[]>([""]);
    const [selectedValues, setSelectedValues] = useState<string[]>([""]);

    // const [userID, setuserID] = useState<number | undefined>();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const [flow, setFlow] = useState<CreateFlow | undefined>()
    // const [condition, setCondition] = useState<Condition | undefined>()

  const fetchFlows = async () => {
    try {
      const res0 = await api.flows.getConditions()
      const res1 = await api.flows.getComparators()
      const res2 = await api.users.getUsers()

      setConditionKeys(res0.data.key || []);
      setComparators(res1.data.comparators || []);
      setUsers(res2.data || [])
    } catch (error) {
      console.error('Error fetching flows:', error);
    }
  };


  
    useEffect(() => {
        fetchFlows();
    }, []);

    const registerFlows = async () => {
        // console.log("init of registerFlows");
        console.log(selectedUsers)
        if (selectedUsers.length === 0) {
            alert("承認者を1人以上選択してください。");
            return; // 処理を中断
        }
        if (!title){
            alert("タイトルを入力してください。");
            return;
        }
        for (let i = 0; i < selectedKeys.length; i++) {
            const key = selectedKeys[i];
            const condition = selectedComps[i];
            const value = selectedValues[i];

            if (!key || !condition || !value  || !title ) {
                alert(`条件のすべてのフィールドを入力してください。`);
                return;  
            } 

        }


        const flowConditions = selectedKeys.map((key, index) => ({
            key: key,
            condition: selectedComps[index],
            value: selectedValues[index],
        }));

        const create_flow: CreateFlow = {
            name: title,
            flow: [
                ...flowConditions.map(condition => ({ condition })),
                {
                    approvers: selectedUsers,
                },
            ],
        };

        setFlow(create_flow);

        try {
            
            const response = await api.flows.createFlow(create_flow);
            if (response.ok) {
                alert("Flow created: " + '"' + create_flow.name + '"');
            } else {
                alert("Failed to create flow: " + response.data);
            }
        } catch (error) {
            console.error("Failed to create flow:", error);
        }
    };

    const handleChange0 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleKeyChange = (index: number, value: string) => {
        const newSelectedKeys = [...selectedKeys];
        newSelectedKeys[index] = value;
        setSelectedKeys(newSelectedKeys);
    };

    const handleCompChange = (index: number, value: string) => {
        const newSelectedComps = [...selectedComps];
        newSelectedComps[index] = value;
        setSelectedComps(newSelectedComps);
    };

    const handleValueChange = (index: number, value: string) => {
        const newSelectedValues = [...selectedValues];
        newSelectedValues[index] = value;
        setSelectedValues(newSelectedValues);
    };

    const addCondition = () => {
        setSelectedKeys([...selectedKeys, ""]);
        setSelectedComps([...selectedComps, ""]);
        setSelectedValues([...selectedValues, ""]);
    };

    const removeCondition = (index: number) => {
        const newSelectedKeys = [...selectedKeys];
        const newSelectedComps = [...selectedComps];
        const newSelectedValues = [...selectedValues];

        newSelectedKeys.splice(index, 1);
        newSelectedComps.splice(index, 1);
        newSelectedValues.splice(index, 1);

        setSelectedKeys(newSelectedKeys);
        setSelectedComps(newSelectedComps);
        setSelectedValues(newSelectedValues);
    };

    const UserSearch = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUserId = parseInt(event.target.value);
        const user = users.find(user => user.id === selectedUserId);
        if (user && !selectedUsers.includes(user)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const removeApprover = (userId: number) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    // ログ
    useEffect(() => {
        if (flow) {
            console.log("Updated flow:", flow);
        }
    }, [flow]);

    return (
        <>
            <div>
                <p>承認フロー</p>
                <p>タイトル</p>
                <input value={title} onChange={handleChange0}></input>
                <p>条件選択</p>

                {selectedKeys.map((_, index) => (
                    <div key={index}>
                        <select value={selectedKeys[index]} onChange={(e) => handleKeyChange(index, e.target.value)}>
                            <option value="">--選択--</option>
                            {conditionKeys.map((ke) => (
                                <option key={ke} value={ke}>{ke}</option>
                            ))}
                        </select>

                        <select value={selectedComps[index]} onChange={(e) => handleCompChange(index, e.target.value)}>
                            <option value="">--選択--</option>
                            {comparators.map((comp) => (
                                <option key={comp} value={comp}>
                                    {conditionLabels[comp]}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={selectedValues[index]}
                            onChange={(e) => handleValueChange(index, e.target.value)}
                            placeholder="Enter text"
                        />
                        <button onClick={() => removeCondition(index)}>削除</button>
                    </div>
                ))}

                <button onClick={addCondition}>条件を追加</button>

                <p>承認者</p>
                <select onChange={UserSearch}>
                    <option value="">--選択--</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.id}: {user.name}</option>
                    ))}
                </select>

                <ul style={{ listStyleType: 'none' }}>
                    {selectedUsers.map((user, index) => {
                        if (user.id === undefined) {
                            return null; 
                        }

                        const orderLabel = `${index + 1}人目`;

                        return (
                            <li key={user.id}>
                                {orderLabel}: {user.name} <button onClick={() => removeApprover(user.id!)}>削除</button>
                            </li>
                        );
                    })}
                </ul>

                <button onClick={registerFlows}>保存</button>
            </div>
        </>
    )
}
