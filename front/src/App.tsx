import { Link, Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Header from './components/header.tsx'
import SinkiUserSakusei from './pages/sinki-user-sakusei.tsx'

function App() {
  return (

    <BrowserRouter>
      <>
        <div>
          <Link to="/sinki-user-sakusei">
            新規ユーザー作成
          </Link>
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
      </Routes>
      
     </>

    </BrowserRouter> 
  )
}

export default App
