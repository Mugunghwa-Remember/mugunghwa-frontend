import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchKakaoLogin } from "../../controllers/login/api";
import loadingImage from "../../assets/logo.png";
import { vars } from "../../styles/vars.css";

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        padding: "20px 0",
        gap: "28px",
        maxWidth: "840px",
        width: "100%",
      }}
    >
      <img
        style={{
          width: "128px",
        }}
        src={loadingImage}
        alt="로그인 처리 중"
      />
      <p
        style={{
          fontFamily: vars.fonts.yeongnamnu,
          fontSize: "24px",
          fontWeight: "400",
          color: vars.colors.ink,
        }}
      >
        로그인 처리 중입니다...
      </p>
    </div>
  );
};

export default AuthPage;
