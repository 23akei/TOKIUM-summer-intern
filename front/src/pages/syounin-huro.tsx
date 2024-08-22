// import { useState, useEffect } from "react"
// import {api} from "../const"

// key=項目, value=閾値, condition=不等号,


export default function SyouninHuro() {

    // const [key, setkey] = useState("");
    // const [value, setvalue] = useState("");
    // const [condition, setcondition] = useState("");


    // interface Flow {
    //     key: string;
    //     value: string;
    //     condition: string;
        
    //     // 他の必要なプロパティを追加
    // }
      

    // const [key, setkey] = useState("");
    // const [value, setvalue] = useState("");
    // const [condition, setcondition] = useState("");

    // const [flows, setFlows] = useState<Flow[]>([]); // 型を明示的に指定

    // useEffect(() => {
    //     const fetchFlows = async () => {
    //         try {
    //             const res = await api.flows.getFlows();
    //             setFlows(res.data); // APIレスポンスをflowsステートに保存
    //         } catch (error) {
    //             console.error('Error fetching flows:', error);
    //         }
    //     };

    //     fetchFlows(); // コンポーネントマウント時にAPI呼び出しを実行
    // }, []);

    return (
        <>
            <div>

                
                <p>承認フロー</p>
                <select >
                <option>--選択--</option>
                <option >金額</option>
                </select>

                <select >
                <option>--選択--</option>
                <option >&gt;</option>
                <option >&lt;</option>
                <option >&gt;=</option>
                <option >&lt;=</option>
                </select>
                <input type="text" name="riyoubi"  />


                <p>承認者</p>
                <select >
                    <option>--選択--</option>
                    <option>申請者A</option>
                </select>
                



                
                
            </div>
        </>
    )
}
