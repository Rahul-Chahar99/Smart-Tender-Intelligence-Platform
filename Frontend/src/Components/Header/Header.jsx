import Container from "../Container/Container.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logOutUser, reset } from "../../Features/userSlice";
import { useMemo } from "react";
import toast from "react-hot-toast";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { authStatus, userInfo } = useSelector((state) => state.auth);

  const logOutHandler = async () => {
    await dispatch(logOutUser());
    dispatch(reset());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const navItems = useMemo(
    () => [
      { name: "Home", slug: "/", active: true },
      { name: "Login", slug: "/login", active: !authStatus },
      { name: "Register", slug: "/signup", active: !authStatus },
      { name: "My Tenders", slug: "/my-tenders", active: authStatus },
      {
        name: "Admin Dashboard",
        slug: "/admin-dashboard",
        active: authStatus && userInfo?.role === "admin",
      },
    ],
    [authStatus, userInfo],
  );

  const displayName = userInfo?.companyName || userInfo?.fullName;

  return (
    <header className="py-2 sm:py-3 bg-[#111111] border-b border-[#2a2a2a] shadow-sm">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="mr-4 shrink-0">
            <Link to="/">
              <div className="text-lg sm:text-xl font-bold text-[#f5f5f0] tracking-wide">
                TenderAI
              </div>
            </Link>
          </div>

          {/* Nav */}
          <ul className="flex ml-auto items-center space-x-1 lg:space-x-3">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    className="px-3 py-2 text-sm text-[#a3a3a3] hover:text-[#f5f5f0] font-medium transition duration-200 whitespace-nowrap"
                    onClick={() => navigate(item.slug)}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null,
            )}

            {authStatus && (
              <li>
                <span className="px-3 py-1.5 rounded-full border border-[#2a2a2a] text-xs font-semibold text-[#a3a3a3] whitespace-nowrap">
                  🏢 {displayName || "Company"}
                </span>
              </li>
            )}

            {authStatus && (
              <li>
                <button
                  onClick={logOutHandler}
                  className="px-3 py-2 text-sm text-[#a3a3a3] hover:text-red-400 font-medium transition duration-200"
                >
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
