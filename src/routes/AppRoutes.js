/**
 * @file AppRoutes.js
 * @description 앱의 라우팅을 정의한 파일
 */
import {Routes, Route} from "react-router-dom";
import Feed from "../page/Feed";
import ImageGenerator from "../page/ImageGenerator";
import Setting from "../page/info/Setting";
import MyProfile from "../page/info/MyProfile";
import MyLibrary from "../page/info/MyLibrary";
import MyComment from "../page/info/MyComment";

const AppRoutes = () => (
    <Routes>
        {/**
         * @description 기본 루트 경로에는 Feed 페이지를 렌더링
         */}
        <Route path="/" element={<Feed/>}/>

        <Route path="/image-generator" element={<ImageGenerator/>}/>
        <Route path="/settings" element={<Setting/>}>
            <Route path="profile" element={<MyProfile/>}/>
            <Route path="library" element={<MyLibrary/>}/>
            <Route path="comment" element={<MyComment/>}/>
        </Route>
    </Routes>
);

export default AppRoutes;
