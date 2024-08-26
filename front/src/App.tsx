import { Link, Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Header from './components/header.tsx'
import SinkiUserSakusei from './pages/sinki-user-sakusei.tsx'
import SinkiSinsei from './pages/sinki-sinsei.tsx'
import SyoninHuro from './pages/syounin-huro.tsx'
import SinseiTeishutsu from './pages/sinsei-teishutsu.tsx'
import ShinseiJoutai from './pages/shinsei-joutai.tsx'
import { Context } from './Context.tsx'
import { useState } from 'react'

function App() {
  const [userID, setUserID] = useState(0)

  return (


    <Context.Provider value={{ userID, setUserID }}>
      <span>user id:</span>
      <input type="number" value={userID} onChange={(event) => setUserID(event.target.valueAsNumber)} />

    <BrowserRouter>
      <>
        <div>
          <Link to="/sinki-user-sakusei">
            新規ユーザー作成
          </Link>
          <div></div>
          <Link to="/sinki-sinsei">
            新規申請
          </Link>
          <div></div>
          <Link to="/sinsei-teishutsu">
            申請提出
          </Link>
          <div></div>
          <Link to="/shinsei-joutai">
            提出した申請
          </Link>
          <div></div>
          <Link to="/syounin-huro">
            承認フロー
          </Link>
          <div></div>
          <Link to="/">
            Home
          </Link>
        </div>

      <Routes>
        <Route path="/" element={<>
            <Header/>
            <p>hello tokium</p>
          </>}>

        </Route>
        <Route path="/sinki-user-sakusei" element={<SinkiUserSakusei></SinkiUserSakusei>}>
        </Route>

        <Route path='/sinki-sinsei' element={<SinkiSinsei></SinkiSinsei>}>
        </Route>

        <Route path='/sinsei-teishutsu' element={<SinseiTeishutsu/>}>
        </Route>

        <Route path='/shinsei-joutai' element={<ShinseiJoutai></ShinseiJoutai>}>
        </Route>

        <Route path='/syounin-huro' element={<SyoninHuro></SyoninHuro>}>
        </Route>

      </Routes>

     </>

    </BrowserRouter>
    </Context.Provider>
  )
}

export default App
