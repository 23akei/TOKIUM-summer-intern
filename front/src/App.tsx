import { Link, Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Header from './components/header.tsx'
import SinkiUserSakusei from './pages/sinki-user-sakusei.tsx'
import SinkiSinsei from './pages/sinki-sinsei.tsx'
import SyoninHuro from './pages/syounin-huro.tsx'

function App() {
  return (

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

        <Route path='/syounin-huro' element={<SyoninHuro></SyoninHuro>}>
        </Route>

        
      </Routes>
      
     </>

    </BrowserRouter> 
  )
}

export default App
