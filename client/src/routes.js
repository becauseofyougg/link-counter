import React from 'react'
import { Routes,Route, Navigate  } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { CreatePage } from './pages/CreatePage'
import { DetailPage } from './pages/DetailPage'
import { LinksPage } from './pages/LinksPage'

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Routes>
                <Route path="/links" element={<LinksPage/>} exact />  
                <Route path="/create" element={<CreatePage/>} exact />
                <Route path="/detail/:id" element={<DetailPage/>} />
                <Route  element={<Navigate to ="create/" />} />
            </Routes>
        )
    }
    return (
        <Routes>
            <Route path="/" element={<AuthPage/>} exact />
            <Route  element={<Navigate to ="/" />} />

        </Routes>
    )
}