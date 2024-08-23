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

    const [title, setTitle] = useState<string>();

    const [key, setKey] = useState<string[]>();
    const [comparators, setComparators] = useState<string[] | undefined>([""]);

    const [selectedKey, setSelectedKey] = useState<string>("");
    const [selectedComp, setSelectedComp] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<string>("");

    const [userID, setUserID] = useState<number>();
    const [users, setUsers] = useState<User[]>();
    const [selectedUsers, setSelectedUsers] = useState<User[]>();

    const [flow, setFlow] = useState<CreateFlow>()
    const [condition, setCondition] = useState<Condition>()

    // const [flows, setFlows] = useState<Flow[]>(); // 型を明示的に指定

    // key, 比較演算子, 取得
    useEffect(() => {
        const fetchFlows = async () => {
            try {
                const res0 = await api.flows.getConditions()
                const res1 = await api.flows.getComparators()
                const res2 = await api.users.getUsers()
                // const res = await api.flows.getFlows()

                setKey(res0.data.key);
                setComparators(res1.data.comparators); // APIレスポンスをflowsステートに保存
                setUsers(res2.data)
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
                        value: selectedValue
                    }
                },
                {
                    approvers: selectedUsers
                }
            ]
            // Unhandled Promise Rejection: [object Response]
        }
        api.flows.createFlow(create_flow).then((response) => {
            if (response.ok) {
                alert("Flow created:"+response.data);
            } else {
                alert("Failed to create flow:"+response.data)
            }
        })
    }
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
        console.log("Input value:", event.target.value);
    };

    const UserSerach = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserID(parseInt(event.target.value));
        if (users !== undefined) {
            setSelectedUsers(users.filter(user => user.id === userID))
        }
    };

    // useEffect(() => {
    //     if (selectedUsers) {
    //         console.log("Updated condition:", selectedUsers);
    //     }
    // }, [selectedUsers]);

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
                <select value={userID} onChange={UserSerach}>
                    {users?.map((user, index) => (
                        <option key={index}>{user.id}: {user.name}</option>
                    ))}
                </select>

                <p></p>
                <button onClick={registerFlows}>保存</button>
                
                
            </div>
        </>
    )
}
