import { useState } from "react"

export default function SinkiUserSakusei() {

    const [namae, setNamae] = useState("");

    return (
        <>
            <div>
                <p>新規ユーザー作成画面</p>
                <p>名前</p>
                <input value={namae} onChange={(event)=>{setNamae(event.target.value)}}></input>
                <p>役職</p>
                <input></input>

                <div>
                    <button>作成</button>
                </div>
                
            </div>
        </>
    )
}
