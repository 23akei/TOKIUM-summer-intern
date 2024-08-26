import React, { useState, useEffect } from "react"
import {api} from "../const"
import { User } from "../../openapi/api";
import { Condition } from "../../openapi/api";
import { CreateFlow } from "../../openapi/api";
import { Flow } from "../../openapi/api";

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

    const [key, setKey] = useState<string[]>([]);
    const [comparators, setComparators] = useState<string[]>([]);

    const [selectedKey, setSelectedKey] = useState<string>("");
    const [selectedComp, setSelectedComp] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<string>("");

    const [userID, setUserID] = useState<number | undefined>();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const [flow, setFlow] = useState<CreateFlow | undefined>()
    const [condition, setCondition] = useState<Condition | undefined>()

    // const [flows, setFlows] = useState<Flow[]>(); // 型を明示的に指定

    // key, 比較演算子, 取得
    useEffect(() => {
        const fetchFlows = async () => {
            try {
                const res0 = await api.flows.getConditions()
                const res1 = await api.flows.getComparators()
                const res2 = await api.users.getUsers()
                // const res = await api.flows.getFlows()

                setKey(res0.data.key || []);
                setComparators(res1.data.comparators || []); // APIレスポンスをflowsステートに保存
                setUsers(res2.data || [])
            } catch (error) {
                console.error('Error fetching flows:', error);
            }
        };

        fetchFlows(); // コンポーネントマウント時にAPI呼び出しを実行
    }, []);


    // flowsを記録
    const registerFlows = async () => {
        console.log("init of registerFlows");
        const create_flow: CreateFlow = {
            name: title,
            flow: [
                {
                    condition: {
                        key: selectedKey,
                        condition: selectedComp,
                        value: selectedValue,
                    },
                },
                {
                    approvers: selectedUsers,
                },
            ],
        };

        setFlow(create_flow);

        try {
            const response = await api.flows.createFlow(create_flow);
            if (response.ok) {
                alert("Flow created: " + response.data);
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

    const handleChange1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedKey(event.target.value);
    };

    const handleChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedComp(event.target.value);
    };

    const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        // console.log("Input value:", event.target.value);
    };

    const UserSerach = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // setUserID(parseInt(event.target.value));
        // if (users !== undefined) {
        //     setSelectedUsers(users.filter(user => user.id === userID))
        // }

        // const selectedID = parseInt(event.target.value);
        // setUserID(selectedID);
        // if (users) {
        //     setSelectedUsers(users.filter((user) => user.id === selectedID));
        // }

        const selectedUserId = parseInt(event.target.value);
        const user = users.find(user => user.id === selectedUserId);
        if (user && !selectedUsers.includes(user)) {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const removeApprover = (userId: number) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    useEffect(() => {
        if (flow) {
            console.log("Updated flow:", flow);
        }
    }, [flow]);

    // console.log(users)
   

    return (
        <>
            <div>

                
                <p>承認フロー</p>
                {/*
                <p>キー追加</p>
                <input value={key} onChange={(event)=>{setCondition(event.target.value)}}></input> 
                <button onClick={registerFlows}>保存</button>
                */}
                <p>タイトル</p>
                <input value={title} onChange={handleChange0}></input>
                <p>条件選択</p>
                <select value={selectedKey} onChange={handleChange1}>
                    <option value="">--選択--</option>
                    {key !== undefined && key.map((ke) => {
                        return (
                            <option key={ke} value={ke}>{ke}</option>
                        );
                    })}
                </select>

                <select value={selectedComp} onChange={handleChange2}>
                    <option value="">--選択--</option>
                    {comparators !== undefined && comparators.map((comp) => {
                        return (
                            <option key={comp} value={comp}>
                                {conditionLabels[comp]}
                            </option>
                        );
                    })}
                </select>

                <input
                type="text"
                value={selectedValue}
                onChange={handleChange3}
                placeholder="Enter text"
                />

                <p>承認者</p>
                <select value={userID ?? ""} onChange={UserSerach}>
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
                        
                        // インデックスに基づいて順番を表示
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
