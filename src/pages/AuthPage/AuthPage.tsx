import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchKakaoLogin } from "../../controllers/login/api";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      console.log("인가 코드:", code);
      fetchKakaoLogin({
        code,
        redirectUri: window.location.origin + "/oauth",
      }).then((res) => {
        console.log(res);
        if (res.success) {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("provider", "kakao");

          navigate("/plant", { replace: true });
        }
      });
    } else {
      alert("잘못된 접근입니다");
      navigate("/", { replace: true });
    }
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return <div>로그인 처리 중입니다...</div>;
};

export default AuthPage;
