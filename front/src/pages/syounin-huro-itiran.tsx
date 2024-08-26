import { useContext, useEffect, useState } from "react";
import { api } from "../const";
import { Flow, Approvers, Condition } from "../../openapi/api";
import { Context } from "../Context";

export default function SyouninHuroItiran() {
  const { userID } = useContext(Context);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [approvers, setApprovers] = useState<Approvers[]>([]);
  const [condition, setCondition] = useState<Condition[]>([]);

  const fetchFlows = async () => {
    try {
      const res0 = await api.flows.getFlows();
      setFlows(res0.data || []);
    } catch (error) {
      console.error('Error fetching flows:', error);
    }
  };

  useEffect(() => {
    fetchFlows();


  }, [userID]);

  console.log(flows);  // Log the fetched flows to inspect the data structure
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>フローID</th>
              <th>フロー名</th>
              <th>条件</th>
              <th>承認者</th>
            </tr>
          </thead>
          <tbody>
            {flows && flows.length > 0 ? (
              flows.map((item, index) => {
                if (item.flow == undefined) return;
                const conditions = item.flow
                  ?.filter((f): f is Condition => 'condition' in f)
                  .flatMap(app => app.condition)
                  .filter(user => user);  // Filters out undefined

                const approvers = item.flow
                  ?.filter((f): f is Approvers => 'approvers' in f)
                  .flatMap(app => app.approvers)
                  .filter(user => user);  // Filters out undefined

                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>

                    <td>
                      {conditions && conditions.length > 0 ? (

                        <div>
                          {conditions.map((cond, i) => (
                            <span key={i}>
                              <strong>ステップ: {cond?.step}</strong>&nbsp;
                              <span>キー: {cond?.key}</span>&nbsp;
                              <span>条件: {cond?.condition}</span>&nbsp;
                              <span>値: {cond?.condition}</span>
                              {i < conditions.length - 1 && <span>&nbsp;|&nbsp;</span>} {/* 区切りを追加 */}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p>条件なし</p>
                      )}
                    </td>

                    <td>
                      {approvers && approvers.length > 0 ? (
                        approvers.map((user, i) => (
                          <div key={i}>
                            <p>{user?.name}</p>
                          </div>
                        ))
                      ) : (
                        <p>承認者なし</p>
                      )}
                    </td>


                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4}>データがありません</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
