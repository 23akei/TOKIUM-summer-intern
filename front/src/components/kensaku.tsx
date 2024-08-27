import React, {useState, useEffect} from "react"
import { ApprovalAndApplication } from "../../code/TOKIUM-summer-intern/front/src/pages/syounin"


function KensakuJouken({jouken, setJouken}: {jouken: Jouken, setJouken: React.Dispatch<React.SetStateAction<Jouken>>}) {
  const changeUserID = (e:any) => {
    if (e.target.value == "") {
      setJouken({
        ...jouken,
        userID:null
      })
    } else {
      setJouken({
        ...jouken,
        userID: e.target.valueAsNumber
      })
    }
  }
  
  const changeMinAmount = (e:any) => {
    if (e.target.value == "") {
      setJouken({
        ...jouken,
        minAmount: null,
      })
    } else {
      setJouken({
        ...jouken,
        minAmount: e.target.valueAsNumber
      })
    }
  }
  const changeMaxAmount = (e:any) => {
    if (e.target.value == "") {
      setJouken({
        ...jouken,
        maxAmount: null,
      })
    } else {
      setJouken({
        ...jouken,
        maxAmount: e.target.valueAsNumber
      })
    }
  }
  const changeStatus = (e:any) => {
    if (e.target.value == "") {
      setJouken({
        ...jouken,
        status: null,
      })
    } else {
      setJouken({
        ...jouken,
        status: e.target.value
      })
    }
  }
  const changeFlowID = (e:any) => {
    if (e.target.value == "") {
      setJouken({
        ...jouken,
        flowID: null,
      })
    } else {
      setJouken({
        ...jouken,
        flowID: e.target.valueAsNumber
      })
    }
  }
  
  return (
    <>
      <div style={{textAlign:"left", padding:"0 20%" }}>
        <div>
          <span>user id: </span>
          <input type="number" value={jouken.userID!=null?jouken.userID:""} onChange={changeUserID} />
        </div>

        {/* <div>
          <span>role: </span>
          <input value={jouken.role} />
        </div> */}

        <div>
          <span>amount: </span>
      <input type="number" value={jouken.minAmount!=null?jouken.minAmount:""} onChange={changeMinAmount}/>円以上
      <input type="number" value={jouken.maxAmount!=null?jouken.maxAmount:""} onChange={changeMaxAmount} />円以下
        </div>

        <div>
          <span>status: </span>
      <input value={jouken.status||""} onChange={changeStatus}/>
        </div>

        <div>
          <span>flow id: </span>
      <input type="number" value={jouken.flowID!=null?jouken.flowID:""} onChange={changeFlowID}/>
        </div>
      </div>


    </>
  )

}


const kensaku = {
  color: "#1976d2",
  cursor: "pointer",
  display: "inline",
  userSelect: "none"
}

type Jouken = {
  userID: number|null,
  role: string|null,
  minAmount: number|null,
  maxAmount: number|null,
  status: string|null,
  flowID: number|null,
}

function isAllNull(...args:any) {
  for (var i = 0; i < args.length; i++) {
    if (args[i] != null) return false;
  }
  return true;
}

function isJoukenEmpty(jouken: Jouken) {
  return isAllNull(...Object.values((jouken)))
}

function makeEmptyJouken() {
  return {
    userID: null,
    role: null,
    minAmount: null,
    maxAmount: null,
    status: null,
    flowID: null,
  }
}

function filterWithJouken(approvals: ApprovalAndApplication[], setKensakuApprovals: React.Dispatch<React.SetStateAction<ApprovalAndApplication[]|null>>, jouken: Jouken) {
  setKensakuApprovals(
    approvals.filter(appr => {
      if (jouken.userID != null) {
        if (appr.application?.user_id != jouken.userID) return false
      }

      if (jouken.minAmount != null) {
        if (appr.application?.amount == undefined) return false;
        if (jouken.minAmount > appr.application.amount) return false
      }
      if (jouken.maxAmount != null) {
        if (appr.application?.amount == undefined) return false;
        if (jouken.maxAmount < appr.application.amount) return false;
      }

      if (jouken.status != null) {
        if (appr.approval.status != jouken.status) return false;
      }
      
      if (jouken.flowID != null) {
        if (appr.application?.flow_id != jouken.flowID) return false;
      }
      
      return true
    })  
  )
}

export default function Kensaku({approvals, setKensakuApprovals, unselectAll}: {
  approvals: ApprovalAndApplication[],
  setKensakuApprovals: React.Dispatch<React.SetStateAction<ApprovalAndApplication[] | null>>,
}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [jouken, setJouken] = useState<Jouken>(makeEmptyJouken())
  
  const clearKensaku = () => {
    setJouken(makeEmptyJouken())
  }
  
  useEffect(()=>{
    unselectAll();
    if (isJoukenEmpty(jouken)) {
      setKensakuApprovals(null)
      return
    }

    filterWithJouken(approvals, setKensakuApprovals, jouken)
  }, [jouken, approvals])
  
  return (
    <div style={{marginBottom: "100px", background: "#eee", padding:"20px"}}>
      <p style={kensaku} onClick={()=>{setIsCollapsed(p => !p)}}>検索</p>
      
      {!isCollapsed &&
        (
          <>
            <p>条件</p>
            <button onClick={clearKensaku}>clear</button>

            <KensakuJouken jouken={jouken} setJouken={setJouken} />
          </>
        )
      }
    </div>
  )
}
