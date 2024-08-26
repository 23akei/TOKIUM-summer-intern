import { useContext, useEffect, useState } from "react"
import {api} from "../const"
import { Submittion } from "../../openapi/api";
import { Context } from "../Context";

// a page for showing status of submitted applications
export default function ShinseiJoutai() {
    const {userID, setUserID} = useContext(Context);
    const [submittions, setSubmittions] = useState<Submittion[]>([]);

    const fetchSubmittions = async () => {
        const res = await api.submittions.getSubmittionsByUserId(userID as number)
        setSubmittions(res.data)
    }

    useEffect(() =>  {
        if (userID != undefined && !isNaN(userID)) {
        fetchSubmittions()
        }
    }, [userID])

    return (
        <>
        <div>
            <p>申請状態画面</p>
            {submittions.map((submittion) => (
            <div key={submittion.id} style={{border: "1px solid black", display: "flex", justifyContent: "space-between"}}>
                {Object.entries(submittion).map(([k, value]) => (
                <div key={k}>
                    <span>{k}</span>
                    <span>{value}</span>
                </div>
                ))}
            </div>
            ))}
        </div>
        </>
    )
}