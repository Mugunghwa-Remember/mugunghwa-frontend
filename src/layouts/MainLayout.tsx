import * as styles from "./MainLayout.css";

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div
      className={`${styles.mainLayout} ${
        ["/", "/result"].includes(location.pathname) && styles.hasBackground
      }`}
    >
      {children}
    </div>
  );
};

export default MainLayout;
