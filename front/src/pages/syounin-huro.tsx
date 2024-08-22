// import { useState } from "react"

// key=項目, value=閾値, condition=不等号,


export default function SyouninHuro() {

    // const [key, setkey] = useState("");
    // const [value, setvalue] = useState("");
    // const [condition, setcondition] = useState("");

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
