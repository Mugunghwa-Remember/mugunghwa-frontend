import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchKakaoLogin } from "../../controllers/login/api";
import loadingImage from "../../assets/logo.png";
import { vars } from "../../styles/vars.css";
import { safeTrack } from "../../utils/mixpanel";

const AuthPage = () => {
  useEffect(() => {
    safeTrack("page_view", {
      page: "auth",
    });
  }, []);

  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      safeTrack("kakao_auth_code_received", {
        has_code: true,
        code_length: code.length,
      });
      fetchKakaoLogin({
        code,
        redirectUri: window.location.origin + "/oauth",
      })
        .then((res) => {
          safeTrack("kakao_login_success", {
            has_access_token: !!res.data.accessToken,
            has_refresh_token: !!res.data.refreshToken,
            has_email: !!res.data.email,
            provider: "kakao",
          });

          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("provider", "kakao");

          navigate("/plant", { replace: true });
        })
        .catch((error) => {
          safeTrack("kakao_login_error", {
            error: error instanceof Error ? error.message : String(error),
            provider: "kakao",
          });
        });
    } else {
      safeTrack("kakao_auth_code_missing", {
        has_code: false,
        url: window.location.href,
      });

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
