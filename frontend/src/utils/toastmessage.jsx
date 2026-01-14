import toast, { Toaster } from "react-hot-toast";
import { FaX } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import styled from "styled-components";

// Custom styled components for the toast
const StyledToast = styled.div`
  background: ${({ type }) => (type === "SUCCESS" ? "#27ab99" : "#e44242")};
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 350px;
  width: 100%;
`;

const ToastMessage = styled.span`
  font-size: 15px;
  font-weight: 400;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-left: 16px;
`;

// Custom toast function
const customToast = (type, message) => {
  toast.custom(
    (t) => (
      <StyledToast type={type}>
        <ToastMessage>{message}</ToastMessage>
        <CloseButton onClick={() => toast.dismiss(t.id)}>
          <IoCloseOutline fontSize={20} />
        </CloseButton>
      </StyledToast>
    ),
    {
      duration: type === "SUCCESS" ? 4000 : 8000,
    }
  );
};

// Notification functions
export const showNotification = ({ type, message }) => {
  switch (type) {
    case "SUCCESS":
      return customToast("SUCCESS", message);
    case "ERROR":
      return customToast("ERROR", message);
    default:
      return customToast("ERROR", "Unknown type");
  }
};

// Toaster component
export const ToasterNotification = () => (
  <Toaster
    position="top-right"
    containerStyle={{
      top: 20,
      right: 20,
    }}
    toastOptions={{
      style: {
        background: "transparent",
        boxShadow: "none",
        padding: 0,
      },
    }}
  />
);
