import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Header from './components/header.tsx'
import SinkiUserSakusei from './pages/sinki-user-sakusei.tsx'
import SinkiSinsei from './pages/sinki-sinsei.tsx'
import SyoninHuro from './pages/syounin-huro.tsx'
import SinseiTeishutsu from './pages/sinsei-teishutsu.tsx'
import { Context } from './Context.tsx'
import { useState } from 'react'
import Syounin from './pages/syounin.tsx'
import UserItiran from './pages/user-itiran.tsx'
import SyouninHuroItiran from './pages/syounin-huro-itiran.tsx'
import AppBar from './components/app-bar.tsx'
import SWOpenAPI from './pages/doc.tsx'
import WebhookTouroku from './pages/webhook-touroku.tsx'


function App() {
  const [userID, setUserID] = useState(0)

  return (


    <Context.Provider value={{ userID, setUserID }}>
      {/* <span>user id:</span>
      <input type="number" value={userID} onChange={(event) => setUserID(event.target.valueAsNumber)} /> */}

    <BrowserRouter>
      <>
        <AppBar></AppBar>

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

        <Route path="/syounin" element={<Syounin></Syounin>}>

        </Route>
        <Route path='/syounin-huro' element={<SyoninHuro></SyoninHuro>}>
        </Route>
        <Route path='/syounin-huro-itiran' element={<SyouninHuroItiran></SyouninHuroItiran>}>
        </Route>

        <Route path='/user-itiran' element={<UserItiran/>} />
      
        <Route path='/webhook-touroku' element={<WebhookTouroku/>} />
        <Route path='/doc' element={<SWOpenAPI></SWOpenAPI>}></Route>
      </Routes>

     </>

    </BrowserRouter>
    </Context.Provider>
  )
}

export default App
