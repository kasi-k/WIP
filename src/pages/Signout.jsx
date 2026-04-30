import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("newLeadsData");
    localStorage.removeItem("deletedLeads");
    localStorage.removeItem("newClientsData");
    localStorage.removeItem("deletedClients");
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default Signout;
